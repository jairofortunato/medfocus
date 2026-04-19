import json

with open('medpassei/UFSC 2022.json', encoding='utf-8') as f:
    data = json.load(f)

explicacoes = {
    26: (
        "A alternativa E é correta porque o brometo de ipratrópio (anticolinérgico inalatório), quando associado ao "
        "beta-2 agonista nos casos moderados e graves de exacerbação da asma, demonstra redução do tempo de internação "
        "e da necessidade de UTI. Seu mecanismo de ação é a broncodilatação por bloqueio muscarínico, complementando "
        "o efeito do salbutamol.\n\n"
        "A) A gravidade é fundamental para definir doses e intervalos do broncodilatador. "
        "B) O corticoide é indicado na maioria dos casos, mas a dose de prednisolona é 1-2 mg/kg/dia, não 2-3 mg/kg/dia. "
        "C) O sulfato de magnésio tem efeito hipotensor (vasodilatador), não hipertensor. "
        "D) A aminofilina não tem indicação absoluta na terapia inicial — é reservada para casos refratários."
    ),
    27: (
        "A alternativa C é correta porque tanto nas paradas com ritmos chocáveis (FV/TV sem pulso) quanto nas com "
        "ritmos não chocáveis (assistolia/AESP), causas reversíveis podem estar impedindo o sucesso da RCP. "
        "Os 5 H's (hipovolemia, hipóxia, hidrogênio/acidose, hipo/hipercalemia, hipotermia) e os 5 T's (tensão no "
        "tórax/pneumotórax, tamponamento, toxinas, trombose pulmonar, trombose coronariana) devem ser pesquisados.\n\n"
        "A) Amiodarona e lidocaína são usadas em ritmos chocáveis refratários, não na assistolia. "
        "B) Após intubação, a ventilação passa a ser de 1 a cada 2-3 segundos (20-30/min em crianças), não 10/min. "
        "D) Taquicardia supraventricular não é ritmo de parada — os ritmos chocáveis são FV e TV sem pulso. "
        "E) A frequência de compressões é 100-120/min, não 100-140/min."
    ),
    28: (
        "A alternativa D é correta porque diante de uma convulsão ativa (status epilepticus), o tratamento de "
        "primeira linha é o benzodiazepínico — diazepam EV (0,2-0,5 mg/kg) ou midazolam. O quadro clínico é "
        "compatível com convulsão febril, mas enquanto a criança está convulsionando, a prioridade é cessar a crise.\n\n"
        "A) Glicemia capilar é 90 mg/dl (normal) — não há indicação de soro glicosado. "
        "B) Dipirona trata a febre mas não interrompe a convulsão em curso. "
        "C) Fenitoína é segunda linha, indicada se a crise não ceder com benzodiazepínico. "
        "E) Ceftriaxone é antibiótico — não há sinais de meningite (sinais meníngeos ausentes)."
    ),
    29: (
        "A alternativa B é correta porque o quadro — urticária generalizada + sintomas gastrointestinais (dor "
        "abdominal, vômitos) + taquicardia + taquipneia após exposição a alérgeno (formiga) — configura anafilaxia. "
        "O tratamento de primeira linha é adrenalina intramuscular (0,01 mg/kg, máx 0,5 mg), aplicada na face "
        "anterolateral da coxa. Adrenalina IM, não EV, é a via inicial na anafilaxia.\n\n"
        "A) Anti-histamínico oral isolado é insuficiente — a adrenalina é mandatória. "
        "C) Prometazina IM e aguardar é conduta insuficiente e perigosa na anafilaxia. "
        "D) Não é choque anafilático (PA normal, EC 2s) — é anafilaxia sem choque. Além disso, a adrenalina IM é a prioridade. "
        "E) Adrenalina endovenosa não é primeira linha na anafilaxia — reserva-se para choque refratário."
    ),
    30: (
        "A alternativa E é correta porque o quadro descreve uma criança com pneumonia complicada evoluindo para "
        "sepse/choque séptico (febre alta, EC 4s, pele fria e moteada, hipotensão, sonolência). No choque séptico "
        "pediátrico, a antibioticoterapia deve ser iniciada idealmente na primeira hora, conforme o pacote da hora "
        "do Surviving Sepsis Campaign.\n\n"
        "A) A expansão deve ser com cristaloide (SF 0,9% ou RL), não soro glicosado. "
        "B) A intubação não é medida inicial — primeiro estabiliza-se hemodinamicamente. "
        "C) Hidrocortisona não é prioridade antes da expansão volêmica — é indicada para choque refratário a catecolaminas. "
        "D) Coloides não são primeira escolha e 30 minutos é muito lento para expansão no choque."
    ),
    31: (
        "A alternativa B é correta porque o quadro clínico — lactente de 2 meses com pródromos virais (coriza, febre "
        "baixa), seguidos de taquipneia, tiragens, estertores subcrepitantes difusos e dessaturação — é clássico de "
        "bronquiolite viral aguda (principal agente: VSR). A cânula nasal de alto fluxo (CNAF) é a terapia de suporte "
        "indicada para bronquiolite moderada/grave com hipoxemia, fornecendo oxigênio umidificado e aquecido com efeito CPAP.\n\n"
        "A) Coqueluche cursa com tosse paroxística em acessos, sem estertores subcrepitantes difusos. "
        "C) Pneumonia por Chlamydia é afebril e cursa com tosse seca persistente em lactentes de 1-3 meses. "
        "D) Não se usa broncodilatador de rotina na bronquiolite — evidência insuficiente de benefício. "
        "E) O quadro é de bronquiolite, não pneumonia bacteriana — não há indicação de ampicilina."
    ),
    32: (
        "A alternativa C é correta porque a Síndrome de Löeffler é caracterizada por eosinofilia periférica + "
        "infiltrados pulmonares migratórios causados pela passagem de larvas de helmintos pelo pulmão durante seu "
        "ciclo biológico. Os parasitas com ciclo pulmonar (ciclo de Loss) são: Ascaris lumbricoides, Strongyloides "
        "stercoralis, Necator americanus e Ancylostoma duodenale. O mnemônico clássico é \"ANAS\".\n\n"
        "A) e B) Giardia lamblia não tem ciclo pulmonar — é um protozoário intestinal sem fase tissular. "
        "D) e E) Síndrome de Ekbom é a parasitose delirante (crença infundada de estar infestado por parasitas), "
        "não tem relação com o ciclo pulmonar dos helmintos."
    ),
    33: (
        "A alternativa D é correta porque, segundo a Sociedade Brasileira de Pediatria, as recomendações de tempo "
        "de tela por faixa etária são: < 2 anos — evitar telas; 2-5 anos — máximo 1 hora/dia; 6-10 anos — máximo "
        "1-2 horas/dia; 11-18 anos — máximo 2-3 horas/dia. O tempo excessivo de tela está associado a obesidade, "
        "distúrbios do sono, problemas posturais e impacto no desenvolvimento socioemocional.\n\n"
        "A) e B) São recomendações para faixas etárias menores. "
        "C) 1-2 horas é a recomendação para 6-10 anos. "
        "E) 3-4 horas excede a recomendação para qualquer faixa etária pediátrica."
    ),
    34: (
        "A alternativa E é correta porque o quadro sugere puberdade precoce — aceleração do crescimento e adrenarca "
        "(odor axilar) em uma menina de 4 anos. O primeiro exame na investigação de puberdade precoce é a radiografia "
        "de mão e punho esquerdo para determinação da idade óssea, que avalia se há avanço da maturação esquelética "
        "em relação à idade cronológica. Idade óssea avançada > 2 anos confirma a suspeita.\n\n"
        "A) Curva glicêmica não é relevante para puberdade precoce. "
        "B) USG pélvica é importante na investigação, mas a idade óssea é o exame inicial. "
        "C) USG de adrenal é indicada se há suspeita de tumor adrenal, não como triagem. "
        "D) Função tireoidiana é relevante se suspeita de hipotireoidismo (que pode causar atraso puberal, não precocidade)."
    ),
    35: (
        "A alternativa B é correta porque, de acordo com as diretrizes da AHA 2020 para suporte básico de vida, "
        "a primeira atitude ao encontrar uma vítima é verificar a segurança do local — garantir que o socorrista "
        "não se torne uma segunda vítima. A sequência correta é: segurança → responsividade → pedir ajuda → "
        "verificar respiração e pulso → iniciar RCP.\n\n"
        "A) Ligar para o SAMU é o segundo passo, após verificar segurança e responsividade. "
        "C) Iniciar RCP antes de verificar segurança pode colocar o socorrista em risco. "
        "D) Verificar responsividade é o segundo passo. "
        "E) Verificar pulso e respiração vem depois de confirmar irresponsividade e pedir ajuda."
    ),
    36: (
        "A alternativa A é correta porque as afirmativas 1, 2 e 3 estão corretas: Coxsackie A16 causa a síndrome "
        "mão-pé-boca; Parainfluenza tipo 1 é o principal agente da laringotraqueíte (crupe); e o VSR é o principal "
        "causador da bronquiolite. A afirmativa 4 está errada: Bordetella pertussis causa coqueluche, não difteria "
        "(cujo agente é Corynebacterium diphtheriae). A afirmativa 5 está errada: o agente mais comum do impetigo "
        "não bolhoso é Streptococcus pyogenes (grupo A), não S. aureus (que causa o impetigo bolhoso).\n\n"
        "B) Inclui a afirmativa 4 (incorreta). C) Inclui a afirmativa 5 (incorreta). "
        "D) e E) Incluem afirmativas incorretas (4 e/ou 5)."
    ),
    37: (
        "A alternativa E é correta porque, segundo o consenso da SBP, a suplementação profilática de ferro para "
        "crianças a termo, peso adequado, em AME e sem fatores de risco é: 1 mg de ferro elementar/kg/dia, "
        "iniciando aos 180 dias (6 meses) de vida, mantido até os 24 meses (2 anos). O início aos 6 meses "
        "coincide com a introdução alimentar e a depleção das reservas de ferro neonatais.\n\n"
        "A) 90 dias é o início para prematuros ou crianças com fatores de risco, não para termo sem risco. "
        "B) 2 mg/kg/dia é a dose para prematuros, não para termo. "
        "C) Dose e início incorretos. "
        "D) Dose correta, mas 12° mês é insuficiente — deve manter até 24 meses."
    ),
    38: (
        "A alternativa D é correta porque a febre de sede (desidratação hipernatrêmica neonatal) é uma causa "
        "reconhecida de hipertermia no recém-nascido, ocorrendo por baixa ingesta de leite materno quando há "
        "dificuldade na pega ou amamentação ineficaz. O RN desidrata e apresenta elevação da temperatura corporal.\n\n"
        "A) COVID-19 materna não é contraindicação absoluta à amamentação — recomenda-se amamentar com medidas "
        "de higiene (máscara, lavagem das mãos). "
        "B) Existem contraindicações ao AME: HIV materno, HTLV, galactosemia no RN, entre outras. "
        "C) Fórmula de soja não é recomendada para APLV em lactentes < 6 meses — usa-se fórmula extensamente hidrolisada. "
        "E) Sucos de frutas não são recomendados antes de 1 ano de vida pela SBP e AAP."
    ),
    39: (
        "A alternativa E é correta porque no primeiro ano de vida as habilidades motoras se desenvolvem de forma "
        "mais evidente e precoce que a linguagem falada. O lactente evolui de controle cervical (3-4 meses) a "
        "sentar sem apoio (6-9 meses) e ficar de pé/andar com apoio (9-12 meses), enquanto a linguagem no primeiro "
        "ano limita-se a balbucio e poucas palavras isoladas.\n\n"
        "A) Ao final do primeiro ano, a maioria das crianças fica de pé com apoio — é um marco esperado. "
        "B) O peso duplica por volta dos 4-5 meses, não ao final do primeiro ano (quando triplica). "
        "C) O comprimento aumenta cerca de 50% no primeiro ano (ex: 50 cm → 75 cm), não 10%. "
        "D) O vocabulário ao final do primeiro ano é de 3-5 palavras, não 20 (que é esperado por volta dos 18 meses)."
    ),
    40: (
        "A alternativa D é correta porque, no calendário do PNI, a vacina meningocócica C conjugada é aplicada "
        "aos 3 e 5 meses de vida, com reforço aos 12 meses. O esquema de duas doses no primeiro semestre com "
        "reforço no segundo ano é o padrão atual.\n\n"
        "A) BCG é dose única ao nascimento, sem doses adicionais aos 1 e 6 meses. "
        "B) Tríplice viral é aplicada aos 12 meses (1ª dose) e 15 meses (2ª dose como tetra viral), não no 1° mês. "
        "C) A VOP (oral) é usada como reforço; aos 2, 4 e 6 meses usa-se VIP (injetável). "
        "E) A vacina HPV é indicada para meninos e meninas, não exclusivamente para meninas."
    ),
    41: (
        "A alternativa B é correta porque Nisolle e Donnez (1997) propuseram que a endometriose compreende três "
        "entidades distintas: peritoneal (implantes superficiais no peritônio), ovariana (endometriomas/cistos de "
        "chocolate) e profunda/infiltrativa (lesões que penetram > 5 mm na superfície peritoneal, acometendo "
        "ligamentos uterossacros, septo retovaginal, bexiga e ureter).\n\n"
        "A) Não existe a forma \"sistêmica\" nessa classificação; adenomiose é outra entidade. "
        "C) Criptogenética e adenomiose não fazem parte desta classificação. "
        "D) \"Miometrial\" refere-se a adenomiose, não endometriose. "
        "E) \"Tubária\" e \"retovaginal\" são localizações, não categorias da classificação de Nisolle-Donnez."
    ),
    42: (
        "A alternativa A é correta porque no início da fase folicular (menstruação), os folículos ovarianos ainda "
        "não produziram quantidades significativas de estrogênio, e o corpo lúteo do ciclo anterior já regrediu, "
        "cessando a produção de progesterona. Com estrogênio e progesterona baixos, o feedback negativo sobre a "
        "hipófise é mínimo, mas o FSH e LH ainda estão em níveis basais baixos (o FSH começa a subir progressivamente "
        "para recrutar folículos).\n\n"
        "B) FSH e LH altos ocorrem no pico ovulatório, não no início da fase folicular. "
        "C) Progesterona alta é característica da fase lútea. "
        "D) Estrogênio alto ocorre no final da fase folicular (pré-ovulatório). "
        "E) Todos altos não corresponde a nenhuma fase fisiológica normal."
    ),
    43: (
        "A alternativa B é correta porque os antimuscarínicos (anticolinérgicos) como oxibutinina, tolterodina e "
        "solifenacina são a primeira linha farmacológica para bexiga hiperativa/incontinência urinária de urgência. "
        "Atuam bloqueando receptores muscarínicos M3 no detrusor, reduzindo contrações involuntárias da bexiga.\n\n"
        "A) Cafeína é fator agravante — estimula o detrusor e piora a urgência. "
        "C) Agonista beta-3 adrenérgico (mirabegrona) é opção terapêutica, mas a alternativa diz \"antagonista\", "
        "o que seria incorreto. "
        "D) Antagonista beta-1 adrenérgico não tem papel no tratamento da bexiga hiperativa. "
        "E) Agonista colinérgico estimularia ainda mais o detrusor, piorando a incontinência."
    ),
    44: (
        "A alternativa C é correta porque a carbamazepina é um indutor enzimático do citocromo P450 que reduz a "
        "eficácia de contraceptivos hormonais (orais, transdérmicos, vaginais e implantes). O DIU de cobre, por ser "
        "não hormonal, não sofre interação medicamentosa e é classificado como categoria 1 pela OMS (sem restrição).\n\n"
        "A) Implante tem eficácia reduzida por indutores enzimáticos (categoria 3 pela OMS). "
        "B) Transdérmico contém hormônios afetados pela indução enzimática. "
        "D) ACO combinado tem eficácia reduzida pela carbamazepina. "
        "E) Anel vaginal hormonal sofre a mesma interação."
    ),
    45: (
        "A alternativa B é correta porque o carcinoma de células escamosas (epidermoide) é o tipo histológico mais "
        "comum do câncer de colo uterino, correspondendo a 70-80% dos casos. Está fortemente associado à infecção "
        "persistente pelo HPV de alto risco (tipos 16 e 18 principalmente). O adenocarcinoma é o segundo mais comum "
        "(10-25%), com incidência crescente.\n\n"
        "A) Tumores adenoescamosos são raros (< 5%). "
        "C) Carcinoma basocelular é típico da pele, não do colo uterino. "
        "D) Rabdomiossarcoma é tumor mesenquimal raro, mais comum na infância. "
        "E) Adenocarcinoma é o segundo mais comum, não o primeiro."
    ),
    46: (
        "A alternativa D é correta porque fibroadenomas simples são os tumores benignos de mama mais comuns em "
        "mulheres jovens, compostos por tecido fibroso e glandular. São bem delimitados, móveis e não apresentam "
        "risco significativo de malignização. A conduta é conservadora com acompanhamento — a excisão cirúrgica "
        "não é obrigatória se a lesão é estável e < 3 cm.\n\n"
        "A) Adenomas não possuem moderado risco de malignização — são benignos. "
        "B) Hiperplasia estromal pseudoangiomatosa geralmente é uma massa sólida sem calcificações. "
        "C) Papilomas podem ser múltiplos (não sempre únicos) e o risco de malignização é baixo, não > 50%. "
        "E) Hiperplasia ductal sem atipia confere risco levemente aumentado (1,5-2x), não moderado a alto."
    ),
    47: (
        "A alternativa A é correta porque a OMS, em sua classificação de 2014 (atualizada em edições subsequentes), "
        "simplificou a nomenclatura da hiperplasia endometrial em apenas duas categorias: hiperplasia sem atipia "
        "e hiperplasia atípica. A classificação antiga (simples/complexa, com/sem atipia) foi abandonada. A presença "
        "de atipia é o principal fator prognóstico para progressão para carcinoma endometrial.\n\n"
        "B) \"Benigna e maligna\" não é a classificação da OMS para hiperplasia. "
        "C) \"Simples e complexa\" é a classificação antiga, substituída. "
        "D) \"Leve, moderada e grave\" não se aplica. "
        "E) \"Cística, simples e complexa\" também é da classificação anterior."
    ),
    48: (
        "A alternativa C é correta porque o quadro — amenorreia primária em adolescente 46,XX com caracteres "
        "sexuais secundários normais (mamas, pelos), genitália externa normal e vagina curta em fundo cego — é "
        "clássico da Síndrome de Mayer-Rokitansky-Küster-Hauser (agenesia mülleriana). Há ausência congênita de "
        "útero e 2/3 superiores da vagina, com ovários funcionantes.\n\n"
        "A) Síndrome de Morris (insensibilidade androgênica) é 46,XY com fenótipo feminino — o cariótipo aqui é 46,XX. "
        "B) Síndrome de Turner é 45,X0 com disgenesia gonadal e baixa estatura. "
        "D) Hiperplasia adrenal congênita cursa com virilização da genitália externa. "
        "E) Disgenesia gonadal mista tem cariótipo 45,X/46,XY."
    ),
    49: (
        "A alternativa A é correta porque, segundo o DSM-5, o diagnóstico é disforia de gênero quando há "
        "incongruência acentuada entre o gênero experimentado e as características sexuais primárias/secundárias, "
        "com duração mínima de 6 meses e sofrimento clinicamente significativo. O paciente preenche todos os critérios "
        "(incongruência > 6 meses + sofrimento pessoal).\n\n"
        "B) Transexualidade não é um diagnóstico do DSM-5 — é um termo identitário. "
        "C) Cisgênero descreve concordância entre gênero experimentado e designado. "
        "D) Homoafetividade refere-se à orientação sexual, não à identidade de gênero. "
        "E) Inadequação sexual não é categoria diagnóstica do DSM-5."
    ),
    50: (
        "A alternativa E é correta porque os valores do POP-Q mostram Aa: +2 e Ba: +4, indicando prolapso "
        "significativo da parede vaginal anterior (cistocele) — ambos os pontos anteriores estão além do hímen. "
        "Os pontos posteriores (Ap: -3, Bp: -3) estão normais e o colo uterino (C: -9) está bem posicionado. "
        "A conduta cirúrgica para correção de cistocele é a colpoperineoplastia anterior.\n\n"
        "A) Cirurgia de Burch é para incontinência urinária de esforço, não para prolapso. "
        "B) Histerectomia não é indicada quando o útero está bem posicionado (C: -9, D: -10). "
        "C) Sling é para incontinência urinária de esforço, não prolapso. "
        "D) Colpoperineoplastia posterior corrige retocele — os pontos posteriores aqui estão normais."
    ),
}

count = 0
for q in data['questoes']:
    if q['numero'] in explicacoes:
        q['explicacao'] = explicacoes[q['numero']]
        count += 1

with open('medpassei/UFSC 2022.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'Updated {count} explanations (Q26-Q50)')
