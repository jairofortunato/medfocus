"""
PDF Medical Questions to JSON Converter
Extracts multiple choice questions from medical exam PDFs (ENARE format)
"""

import re
import json
import sys
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    print("Installing pdfplumber...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pdfplumber"])
    import pdfplumber


def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract all text from a PDF file."""
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


def clean_watermarks(text: str) -> str:
    """Remove watermark text from the content."""
    watermarks = [
        r't\.me/medicinalivre',
        r'Medicina Livre',
        r'Contra preços abusivos\s*na medicina\.?',
        r'na medicina\.',
        r'Proibida Venda\.?',
        r'Acesse t\.me/medicinalivre',
        r'Acesse.*?medicinalivre',
    ]
    for pattern in watermarks:
        text = re.sub(pattern, '', text, flags=re.IGNORECASE)
    # Clean up extra spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def extract_answers(text: str) -> dict:
    """Extract the answer key from the end of the document."""
    answers = {}

    # Pattern: number followed by letter (like "1 A" or "1  A")
    answer_pattern = r'(\d+)\s+([A-E])\b'

    # Find the "Respostas:" section
    respostas_match = re.search(r'Respostas:', text, re.IGNORECASE)
    if respostas_match:
        answer_section = text[respostas_match.end():]
        matches = re.findall(answer_pattern, answer_section)
        for num, letter in matches:
            answers[int(num)] = letter

    return answers


def parse_questions(text: str) -> list:
    """Parse questions from the extracted text."""
    questions = []

    # Find all question positions
    question_starts = [(m.start(), int(m.group(1))) for m in re.finditer(r'Questão\s+(\d+)\s+', text)]

    # Find end of questions (where answers section starts)
    respostas_match = re.search(r'Respostas:', text, re.IGNORECASE)
    end_pos = respostas_match.start() if respostas_match else len(text)

    for i, (start_pos, q_num) in enumerate(question_starts):
        # Get end position (next question or end of document)
        if i + 1 < len(question_starts):
            end = question_starts[i + 1][0]
        else:
            end = end_pos

        question_text = text[start_pos:end]
        question_data = parse_single_question(q_num, question_text)
        if question_data:
            questions.append(question_data)

    return questions


def parse_single_question(question_num: int, content: str) -> dict:
    """Parse a single question's content."""

    # Remove the "Questão X" prefix
    content = re.sub(r'^Questão\s+\d+\s+', '', content)

    # Extract options first (A through E)
    options = {}

    # Find all options - they start with letter at beginning of line or after newline
    option_matches = list(re.finditer(r'\n\s*([A-E])\s+', content))

    if not option_matches:
        return None

    # Text before first option contains tags and question
    first_option_pos = option_matches[0].start()
    pre_options_text = content[:first_option_pos]

    # Parse options
    for i, match in enumerate(option_matches):
        letter = match.group(1)
        start = match.end()

        # End is either next option or end of content
        if i + 1 < len(option_matches):
            end = option_matches[i + 1].start()
        else:
            # Find end markers
            remaining = content[start:]
            end_markers = [
                r'Essa questão possui comentário',
                r'4\d{9}',  # Question codes
            ]
            end = len(content)
            for marker in end_markers:
                m = re.search(marker, remaining)
                if m:
                    end = min(end, start + m.start())

        option_text = content[start:end]
        # Clean the option text
        option_text = clean_watermarks(option_text)
        option_text = re.sub(r'Essa questão possui comentário.*$', '', option_text)
        option_text = re.sub(r'4\d{9}.*$', '', option_text)
        option_text = option_text.strip()

        if option_text:
            options[letter] = option_text

    # Now parse tags and question from pre_options_text
    lines = pre_options_text.strip().split('\n')

    # Tags are usually on the first line(s), before the actual question text
    # Question text usually starts with patient description or a specific phrase
    question_starters = [
        r'Paciente', r'Gestante', r'Mulher', r'Homem', r'Um\s+homem', r'Uma\s+mulher',
        r'Uma\s+paciente', r'Um\s+paciente', r'Uma\s+criança', r'Um\s+bebê',
        r'Os\s+pais', r'Dr\.', r'Dona', r'Paulo', r'Marcos', r'Maria', r'José',
        r'Em\s+relação', r'Sobre\s+[ao]', r'Referente', r'Qual', r'Assinale', r'Relacione',
        r'Das\s+opções', r'Dentre', r'A\s+presença', r'Durante', r'Para\s+bloqueio',
        r'Você\s+está', r'Um\s+menino', r'Uma\s+adolescente', r'As\s+infecções',
        r'A\s+glomerulonefrite', r'A\s+bexiga', r'A\s+fibrose', r'Levado',
        r'São\s+considerados', r'L\.B\.C', r'M\.F\.J', r'M\.J\.F', r'J\.N\.S',
        r'Na\s+Hiperplasia', r'Na\s+fase', r'A\s+Jbrose', r'A\s+fibrose',
        r'Sobre\s+a', r'Sobre\s+o', r'Os\s+pacientes', r'Um\s+paciente',
    ]

    full_pre_text = '\n'.join(lines)
    tags = []
    question_text = ""

    # Find where question text starts
    question_start_pos = len(full_pre_text)
    for starter in question_starters:
        match = re.search(starter, full_pre_text, re.IGNORECASE)
        if match and match.start() < question_start_pos:
            question_start_pos = match.start()

    if question_start_pos > 0 and question_start_pos < len(full_pre_text):
        tags_text = full_pre_text[:question_start_pos].strip()
        question_text = full_pre_text[question_start_pos:].strip()

        # Parse tags - they can be separated by spaces or specific patterns
        tags_text = clean_watermarks(tags_text)

        # Split by multiple spaces or common separators
        raw_tags = re.split(r'\s{2,}', tags_text)
        for tag in raw_tags:
            tag = tag.strip()
            if tag and len(tag) > 2:
                tags.append(tag)
    else:
        # Fallback: first line might be tags, rest is question
        if lines:
            tags_line = clean_watermarks(lines[0])
            if len(tags_line) < 150:  # Tags line is usually short
                tags = [t.strip() for t in re.split(r'\s{2,}', tags_line) if t.strip()]
                question_text = '\n'.join(lines[1:])
            else:
                question_text = '\n'.join(lines)

    # Clean question text
    question_text = clean_watermarks(question_text)

    if not options or not question_text:
        return None

    return {
        "numero": question_num,
        "tags": tags,
        "enunciado": question_text,
        "alternativas": options,
        "resposta_correta": None
    }


def convert_pdf_to_json(pdf_path: str, output_path: str = None) -> dict:
    """Main function to convert PDF to JSON."""

    print(f"Reading PDF: {pdf_path}")
    text = extract_text_from_pdf(pdf_path)

    print("Extracting answers...")
    answers = extract_answers(text)
    print(f"Found {len(answers)} answers")

    print("Parsing questions...")
    questions = parse_questions(text)
    print(f"Found {len(questions)} questions")

    # Add correct answers to questions
    for q in questions:
        q_num = q["numero"]
        if q_num in answers:
            q["resposta_correta"] = answers[q_num]

    # Create output structure
    pdf_name = Path(pdf_path).stem
    output = {
        "prova": pdf_name,
        "total_questoes": len(questions),
        "questoes": questions
    }

    # Save to JSON
    if output_path is None:
        output_path = pdf_path.replace('.pdf', '.json').replace('.PDF', '.json')

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"JSON saved to: {output_path}")

    return output


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        # Default to the ENARE 2023 PDF
        pdf_path = r"medpassei\ENARE 2023.pdf"
    else:
        pdf_path = sys.argv[1]

    output_path = sys.argv[2] if len(sys.argv) > 2 else None

    result = convert_pdf_to_json(pdf_path, output_path)

    # Print sample
    print("\n--- Sample Output ---")
    if result["questoes"]:
        sample = result["questoes"][0]
        print(json.dumps(sample, ensure_ascii=False, indent=2))

    # Stats
    with_answers = sum(1 for q in result["questoes"] if q["resposta_correta"])
    print(f"\nQuestions with answers: {with_answers}/{len(result['questoes'])}")


if __name__ == "__main__":
    main()
