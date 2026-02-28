import json
import os
from openai import OpenAI
from pathlib import Path

# Load API key from .env
env_path = Path(__file__).parent / '.env'
api_key = ''

with open(env_path, 'r') as f:
    for line in f:
        if line.startswith('OPENAI_API_KEY='):
            api_key = line.replace('OPENAI_API_KEY=', '').strip()
            break

if not api_key:
    print("ERROR: OPENAI_API_KEY not found in .env")
    exit(1)

# Initialize OpenAI client
client = OpenAI(api_key=api_key)

# Load questions JSON
json_path = Path(__file__).parent / 'medpassei' / 'ENARE 2023.json'
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total de questões: {data['total_questoes']}")
print("Gerando explicações com GPT-4...\n")

# Process each question
for i, questao in enumerate(data['questoes'], 1):
    # Skip if explanation already exists
    if 'explicacao' in questao and questao['explicacao']:
        print(f"[{i}/{data['total_questoes']}] Questão {questao['numero']} já tem explicação. Pulando...")
        continue
    
    # Build the prompt
    enunciado = questao['enunciado']
    alternativas = questao['alternativas']
    resposta_correta = questao['resposta_correta']
    
    alternativas_texto = '\n'.join([f"{key}: {value}" for key, value in alternativas.items()])
    
    prompt = f"""Você é um especialista em medicina preparando estudantes para o ENARE.

Questão: {enunciado}

Alternativas:
{alternativas_texto}

Resposta correta: {resposta_correta}

Escreva uma explicação CONCISA e OBJETIVA (máximo 150 palavras) em português explicando:
1. Por que a alternativa {resposta_correta} é a correta
2. O conceito médico fundamental envolvido
3. Se relevante, por que as outras alternativas estão incorretas

Seja direto, técnico e educativo. Foque no essencial."""

    try:
        print(f"[{i}/{data['total_questoes']}] Gerando explicação para questão {questao['numero']}...")
        
        response = client.chat.completions.create(
            model="gpt-4o",  # Best model available
            messages=[
                {"role": "system", "content": "Você é um professor de medicina especializado em preparação para residência médica. Suas explicações são concisas, precisas e educativas."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.3
        )
        
        explicacao = response.choices[0].message.content.strip()
        questao['explicacao'] = explicacao
        
        print(f"✓ Explicação gerada ({len(explicacao)} caracteres)")
        
    except Exception as e:
        print(f"✗ Erro ao gerar explicação: {str(e)}")
        questao['explicacao'] = ""

# Save updated JSON
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n✓ Arquivo atualizado: {json_path}")
print("Todas as explicações foram geradas!")
