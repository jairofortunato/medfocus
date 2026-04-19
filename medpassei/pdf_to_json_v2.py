"""
PDF Medical Questions to JSON Converter (v2)
Improved parser that handles UFSC, ENARE, and Revalida INEP formats.
"""

import re
import json
import sys
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pdfplumber"])
    import pdfplumber


def extract_text_from_pdf(pdf_path: str) -> str:
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


def clean_text(text: str) -> str:
    """Remove watermarks, codes, and artifacts."""
    # Reversed watermarks (e.g. "adnev adibiorp 2ervilanicidem/em.t")
    text = re.sub(r'adnev\s*\n?adibiorp\s*\n?2ervilanicidem/em\.t', '', text)
    text = re.sub(r'adnev\b.*?ervilanicidem/em\.t', '', text, flags=re.DOTALL)

    # Normal watermarks
    watermarks = [
        r't\.me/m\s*edicinal\s*iv\s*re',
        r't\.me/medicinalivre',
        r'Medicina Livre',
        r'Contra preços abusivos\s*na medicina\.?',
        r'na medicina\.',
        r'Proibida Venda\.?',
        r'Acesse t\.me/medicinalivre',
        r'Acesse.*?medicinalivre',
        r'Acessar Lista',
    ]
    for pattern in watermarks:
        text = re.sub(pattern, '', text, flags=re.IGNORECASE)

    # (cid:XX) artifacts from PDF
    text = re.sub(r'\(cid:\d+\)', '', text)

    # "Essa questão possui comentário do professor no site"
    text = re.sub(r'Essa questão possui comentário.*?(?=\n)', '', text)

    # Numeric codes like 4000164743 (10-digit codes on their own line)
    text = re.sub(r'\n\s*4\d{9}\s*\n', '\n', text)
    text = re.sub(r'\b4\d{9}\b', '', text)

    # Clean up multiple blank lines
    text = re.sub(r'\n{3,}', '\n\n', text)

    return text


def extract_answers(text: str) -> dict:
    answers = {}
    respostas_match = re.search(r'Respostas:', text, re.IGNORECASE)
    if respostas_match:
        answer_section = text[respostas_match.end():]
        matches = re.findall(r'(\d+)\s+([A-E])\b', answer_section)
        for num, letter in matches:
            answers[int(num)] = letter
    return answers


def parse_questions(text: str) -> list:
    questions = []

    # Pattern: "Questão N" optionally followed by tag on the same line
    question_pattern = re.compile(r'Questão\s+(\d+)\s+(.*?)(?=\n)')
    question_starts = [(m.start(), int(m.group(1)), m.group(2).strip()) for m in question_pattern.finditer(text)]

    respostas_match = re.search(r'Respostas:', text, re.IGNORECASE)
    end_pos = respostas_match.start() if respostas_match else len(text)

    for i, (start_pos, q_num, first_line_rest) in enumerate(question_starts):
        if i + 1 < len(question_starts):
            end = question_starts[i + 1][0]
        else:
            end = end_pos

        question_block = text[start_pos:end]
        question_data = parse_single_question(q_num, question_block, first_line_rest)
        if question_data:
            questions.append(question_data)

    return questions


def find_options_block(content: str) -> list:
    """Find the real options block (A-E) by looking for consecutive letters."""
    option_pattern = re.compile(r'^([A-E])\s+', re.MULTILINE)
    all_matches = list(option_pattern.finditer(content))

    if len(all_matches) < 4:
        return []

    # Find a sequence that starts with A and has B, C, D (and optionally E) in order
    for i, m in enumerate(all_matches):
        if m.group(1) != 'A':
            continue
        # Check if we have B, C, D following
        seq = [m]
        expected = 'B'
        for j in range(i + 1, len(all_matches)):
            if all_matches[j].group(1) == expected:
                seq.append(all_matches[j])
                if expected == 'D':
                    # Found A-D, check for E
                    for k in range(j + 1, len(all_matches)):
                        if all_matches[k].group(1) == 'E':
                            seq.append(all_matches[k])
                            break
                    return seq
                expected = chr(ord(expected) + 1)
            elif all_matches[j].group(1) == 'A':
                break  # restart
    return []


def parse_single_question(question_num: int, content: str, first_line_rest: str) -> dict:
    # Remove "Questão N ..." first line
    content = re.sub(r'^Questão\s+\d+\s+.*?\n', '', content, count=1)

    # Find the real options block (consecutive A, B, C, D, optionally E)
    option_matches = find_options_block(content)

    if not option_matches:
        return None

    # Everything before first option = enunciado
    first_option_pos = option_matches[0].start()
    enunciado_raw = content[:first_option_pos].strip()

    # Parse tags from first_line_rest (the text after "Questão N" on the same line)
    # Tags are usually specialty names like "Medicina Preventiva", "Cirurgia Geral", etc.
    tags = []
    if first_line_rest:
        # The first_line_rest may contain: "Tag1 Tag2 Enunciado start..."
        # We need to separate tag from enunciado continuation
        # Strategy: known tags are usually capitalized specialty names, short
        # If first_line_rest starts the enunciado, prepend to enunciado_raw

        # Check if this looks like a tag (short, capitalized words) or enunciado
        # Tags typically don't start with articles or common sentence starters
        enunciado_starters = re.compile(
            r'^(Assinale|Um\b|Uma\b|Paciente|Gestante|Mulher|Homem|Os\s+pais|'
            r'Dr\.|Dona|Em\s+relação|Sobre\s+|Referente|Qual|Das\s+|Dentre|'
            r'A\s+presença|Durante|Para\s+|Você|Observe|Analise|Considere|'
            r'No\s+|Na\s+|O\s+|A\s+revista|Segundo|De\s+acordo|É\s+|São\s+)',
            re.IGNORECASE
        )

        if enunciado_starters.match(first_line_rest):
            # The whole first_line_rest is part of the enunciado
            enunciado_raw = first_line_rest + "\n" + enunciado_raw
        else:
            # Try to split: tag part vs enunciado part
            # Look for where enunciado text starts within first_line_rest
            match = enunciado_starters.search(first_line_rest)
            if match:
                tag_part = first_line_rest[:match.start()].strip()
                enunciado_part = first_line_rest[match.start():].strip()
                if tag_part:
                    tags = [tag_part]
                if enunciado_part:
                    enunciado_raw = enunciado_part + "\n" + enunciado_raw
            else:
                # Whole first_line_rest is tags
                tags = [first_line_rest]

    # Clean enunciado
    enunciado_raw = re.sub(r'\s+', ' ', enunciado_raw).strip()

    if not enunciado_raw:
        return None

    # Parse options
    options = {}
    for i, match in enumerate(option_matches):
        letter = match.group(1)
        start = match.end()

        if i + 1 < len(option_matches):
            end = option_matches[i + 1].start()
        else:
            end = len(content)

        option_text = content[start:end].strip()
        # Clean option text
        option_text = re.sub(r'\s+', ' ', option_text).strip()
        # Remove trailing artifacts
        option_text = re.sub(r'\s*4\d{9}.*$', '', option_text)
        option_text = re.sub(r'\s*Essa questão possui comentário.*$', '', option_text)
        option_text = re.sub(r'\s*adnev.*$', '', option_text)

        if option_text:
            options[letter] = option_text

    if not options:
        return None

    return {
        "numero": question_num,
        "tags": tags if tags else [],
        "enunciado": enunciado_raw,
        "alternativas": options,
        "resposta_correta": None,
        "explicacao": ""
    }


def convert_pdf_to_json(pdf_path: str, output_path: str = None) -> dict:
    print(f"Reading PDF: {pdf_path}")
    raw_text = extract_text_from_pdf(pdf_path)

    print("Cleaning text...")
    text = clean_text(raw_text)

    print("Extracting answers...")
    answers = extract_answers(raw_text)  # Use raw text for answers
    print(f"Found {len(answers)} answers")

    print("Parsing questions...")
    questions = parse_questions(text)
    print(f"Found {len(questions)} questions")

    for q in questions:
        q_num = q["numero"]
        if q_num in answers:
            q["resposta_correta"] = answers[q_num]

    # Derive exam name from filename
    pdf_name = Path(pdf_path).stem
    output = {
        "prova": pdf_name,
        "total_questoes": len(questions),
        "questoes": questions
    }

    if output_path is None:
        output_dir = Path(__file__).parent
        output_path = str(output_dir / f"{pdf_name}.json")

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"JSON saved to: {output_path}")

    # Quality report
    with_answers = sum(1 for q in questions if q["resposta_correta"])
    no_tags = sum(1 for q in questions if not q["tags"])
    short_enunciado = sum(1 for q in questions if len(q["enunciado"]) < 20)
    few_options = sum(1 for q in questions if len(q["alternativas"]) < 4)

    print(f"\n--- Quality Report ---")
    print(f"Questions with answers: {with_answers}/{len(questions)}")
    print(f"Questions without tags: {no_tags}")
    print(f"Questions with short enunciado: {short_enunciado}")
    print(f"Questions with < 4 options: {few_options}")

    return output


def main():
    if len(sys.argv) < 2:
        print("Usage: python pdf_to_json_v2.py <pdf_path> [output_path]")
        sys.exit(1)

    pdf_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else None
    convert_pdf_to_json(pdf_path, output_path)


if __name__ == "__main__":
    main()
