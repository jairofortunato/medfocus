import json

with open('medpassei/UFSC 2022.json', encoding='utf-8') as f:
    data = json.load(f)

explicacoes = {
    1: (
        "A alternativa B é correta porque cada tipo de estudo epidemiológico possui uma medida de associação mais adequada: "
        "o estudo transversal usa a razão de prevalência (compara prevalências entre expostos e não expostos num ponto do tempo); "
        "o ecológico usa correlação (analisa dados agregados de populações); o caso-controle usa odds ratio (estima a chance de "
        "exposição entre doentes vs. não doentes); e o estudo de coorte usa risco relativo (compara incidências entre expostos "
        "e não expostos ao longo do tempo).\n\n"
        "A) Odds ratio não é a medida do transversal, e sim razão de prevalência. "
        "C) Odds ratio é do caso-controle, não do ecológico. "
        "D) Inverte as medidas de correlação e razão de prevalência. "
        "E) Também inverte as medidas — razão de prevalência não se aplica ao ecológico."
    ),
    2: (
        "A alternativa D é correta porque as afirmativas 1 e 3 estão corretas. "
        "A afirmativa 1 está correta: o risco relativo (RR) é calculado dividindo-se a incidência nos expostos pela incidência "
        "nos não expostos (RR = Ie/Ine). A afirmativa 3 está correta: o odds ratio é obtido pela razão entre os produtos "
        "cruzados da tabela 2x2 (ad/bc), ou seja, a razão entre situações concordantes e discordantes. "
        "A afirmativa 2 está incorreta porque a razão de prevalência é a divisão da prevalência entre expostos pela prevalência "
        "entre não expostos, e não simplesmente a divisão dos casos entre fumantes e não fumantes.\n\n"
        "A) Ignora a afirmativa 3, que é correta. "
        "B) A afirmativa 2 está incorreta. "
        "C) Inclui a afirmativa 2, que é incorreta. "
        "E) A afirmativa 2 está incorreta."
    ),
    3: (
        "A alternativa C é correta porque o valor de p = 0,0799 está acima do nível de significância convencional de 0,05 (5%), "
        "o que significa que não há evidência estatística suficiente para rejeitar a hipótese nula. No entanto, o valor está "
        "próximo do limiar, sugerindo uma tendência. Nessa situação, a conduta mais adequada é aumentar o tamanho amostral para "
        "melhorar o poder estatístico do teste e obter conclusões mais robustas.\n\n"
        "A) Não se pode concluir equivalência — o p próximo do limiar sugere que pode haver diferença com amostra maior. "
        "B) Não há evidência para preferir o vidro transparente. "
        "D) Com p > 0,05, as diferenças não são estatisticamente significativas. "
        "E) O qui-quadrado é perfeitamente aplicável para comparar variáveis categóricas."
    ),
    4: (
        "A alternativa E é correta porque p < 0,0001 significa que a probabilidade de obter aquele resultado por acaso, "
        "assumindo que não há diferença entre os grupos, é inferior a 0,01%. O erro tipo I é desprezível, permitindo aceitar "
        "a hipótese alternativa de que existe diferença real entre os grupos.\n\n"
        "A) A significância é alta, não baixa — p muito pequeno indica alta significância estatística. "
        "B) O poder do teste não é avaliado pelo valor de p. "
        "C) A diferença não é desprezível — ao contrário, rejeita-se a hipótese nula. "
        "D) A probabilidade de errar é muito pequena (< 0,01%), não grande."
    ),
    5: (
        "A alternativa D é correta porque, com χ2 = 17,92 e p < 0,0001, há diferença estatisticamente significativa entre as "
        "embalagens de vidro e plástico na exposição ao calor. Como o contexto indica que o vidro preservou melhor o medicamento, "
        "o laboratório deve utilizar a embalagem de vidro.\n\n"
        "A) A pesquisa é conclusiva — p < 0,0001 é altamente significativo. "
        "B) Não há necessidade de repetir com resultado tão robusto. "
        "C) Os dados favorecem o vidro, não o plástico. "
        "E) Não são equivalentes — há diferença estatisticamente significativa entre elas."
    ),
    6: (
        "A alternativa A é correta porque o itinerário terapêutico refere-se ao percurso de cuidados que o paciente já realizou "
        "antes de chegar ao médico e que pode manter em paralelo — incluindo práticas populares, religiosas, uso de chás, "
        "automedicação e consultas com outros curadores. Em doenças crônicas, essas práticas concomitantes podem interferir no "
        "tratamento, causar interações medicamentosas ou atrasar o diagnóstico.\n\n"
        "B) Itinerário terapêutico não se refere ao trajeto geográfico até o serviço de saúde. "
        "C) Descreve adesão terapêutica, não itinerário terapêutico. "
        "D) Descreve posologia/aprazamento de medicações, não o conceito de itinerário. "
        "E) O itinerário não deve ser abandonado — deve ser compreendido e integrado na decisão clínica."
    ),
    7: (
        "A alternativa C é correta porque o texto descreve a terapia de reidratação oral (TRO), desenvolvida nos anos 1960 em "
        "Bangladesh para tratar diarreia aguda. A TRO aproveita o cotransporte de sódio e glicose no intestino delgado para "
        "promover absorção de água mesmo durante a diarreia. Considerada pela Lancet a descoberta médica mais importante do "
        "século XX, reduziu drasticamente a mortalidade por doenças diarreicas em países em desenvolvimento.\n\n"
        "A) Antimaláricos já existiam antes de 1960 e não foram desenvolvidos em campos de refugiados. "
        "B) O tratamento da tuberculose com esquema RIPE não se encaixa no contexto descrito. "
        "D) Oxigenoterapia não foi desenvolvida nesse contexto histórico. "
        "E) Betabloqueadores para ICC não reduziram letalidade de 30% para 3% em campos de refugiados."
    ),
    8: (
        "A alternativa E é correta porque, segundo as recomendações de manejo de contactantes de COVID-19 no ambiente de trabalho, "
        "todos os contatos próximos devem ser mantidos em isolamento e monitoramento por 14 dias. A testagem é indicada apenas "
        "se desenvolverem sintomas, pois testes realizados precocemente em assintomáticos podem gerar falsos negativos.\n\n"
        "A) Testar imediatamente gera muitos falsos negativos no período pré-sintomático, e não existe medicação preventiva padronizada. "
        "B) Nem todos precisam procurar serviço de saúde — apenas os que desenvolverem sintomas. "
        "C) Liberar contatos com base em teste negativo no 3° dia é insuficiente pela janela de positividade. "
        "D) Teste sorológico detecta anticorpos, não infecção ativa — inadequado para essa situação."
    ),
    9: (
        "A alternativa C é correta porque o valor preditivo positivo (VPP) depende não apenas da sensibilidade e especificidade "
        "do teste, mas principalmente da prevalência da doença na população. No rastreamento de cânceres, a prevalência é baixa "
        "na população geral, o que faz com que mesmo testes com boa acurácia produzam muitos falsos positivos, resultando em VPP baixo.\n\n"
        "A) Alta especificidade aumenta o VPP, não o diminui. "
        "B) Alta prevalência aumentaria o VPP. "
        "D) Baixa sensibilidade reduz detecção, mas não é a principal causa de VPP baixo no rastreamento. "
        "E) O efeito da prevalência sobre o VPP é mais determinante do que valores absolutos de sensibilidade/especificidade."
    ),
    10: (
        "A alternativa D é correta porque, em prevenção primária com fármacos aplicada a populações saudáveis, os benefícios "
        "são futuros e atingem poucos, enquanto os riscos afetam todos que recebem a intervenção. Por isso, a evidência exigida "
        "é do mais alto nível: ensaios clínicos randomizados (ECR) e suas revisões sistemáticas, que controlam vieses e fatores "
        "de confusão adequadamente.\n\n"
        "A) Experiência clínica isolada não é suficiente para recomendar intervenções preventivas populacionais. "
        "B) Estudos observacionais são insuficientes para esse tipo de recomendação. "
        "C) Coorte é observacional — não é o melhor delineamento para avaliar eficácia de intervenções. "
        "E) Caso-controle é retrospectivo e não é ideal para mensurar benefícios e danos."
    ),
    11: (
        "A alternativa B é correta porque o RT-qPCR é o padrão-ouro para diagnóstico de infecção ativa pelo SARS-CoV-2, "
        "com melhor desempenho entre o 3° e o 7° dia de sintomas, quando a carga viral é mais alta. Com 5 dias de sintomas, "
        "o paciente está dentro da janela ideal para o RT-qPCR.\n\n"
        "A) Testes sorológicos detectam anticorpos, não o vírus — úteis para infecção prévia, não diagnóstico agudo. "
        "C) O teste rápido de antígeno tem menor sensibilidade que o RT-qPCR. "
        "D) Incluir o teste rápido como equivalente ao PCR diminui a acurácia diagnóstica. "
        "E) O RT-qPCR é uma opção válida, portanto há alternativa correta."
    ),
    12: (
        "A alternativa C é correta porque um trabalhador com teste positivo para SARS-CoV-2 deve ser afastado do trabalho "
        "independentemente de apresentar sintomas, pois assintomáticos positivos também transmitem o vírus. O afastamento "
        "visa proteger a coletividade.\n\n"
        "A) Assintomáticos com teste positivo também transmitem — afastamento não depende de sintomas. "
        "B) O afastamento é pela positividade do teste, não pelo tempo de sintomas. "
        "D) Mandar trabalhar um positivo sintomático é o oposto da conduta correta. "
        "E) Não existe medicação preventiva validada que permita o retorno imediato."
    ),
    13: (
        "A alternativa A é correta porque a prevalência é influenciada pela incidência e duração da doença "
        "(Prevalência ≈ Incidência × Duração). Se a incidência diminui, a prevalência diminui.\n\n"
        "B) Melhora no diagnóstico aumenta a prevalência por detectar casos antes ocultos. "
        "C) Tratamento que prolonga vida sem curar aumenta a duração e, portanto, a prevalência. "
        "D) Imigração de doentes adiciona casos, aumentando a prevalência. "
        "E) Emigração de sadios reduz o denominador, aumentando a prevalência."
    ),
    14: (
        "A alternativa D é correta porque o ensaio clínico randomizado (ECR) é um estudo experimental prospectivo — "
        "os participantes são alocados aleatoriamente antes da exposição e acompanhados até o desfecho. Isso permite "
        "estabelecer claramente a temporalidade entre exposição e desfecho, uma das principais vantagens sobre estudos observacionais.\n\n"
        "A) ECRs geralmente são caros, não invariavelmente baratos. "
        "B) O cegamento é possível e frequentemente utilizado em ECRs. "
        "C) A medida de associação do ECR é o risco relativo, não o odds ratio. "
        "E) ECR é experimental, não observacional — o ajuste para confundidores é feito pela randomização."
    ),
    15: (
        "A alternativa E é correta porque o EPICOVID avaliou a prevalência de anticorpos anti-SARS-CoV-2 na população "
        "em um único momento, sem acompanhamento longitudinal dos mesmos indivíduos. Entrevistar pessoas uma única vez "
        "e medir a presença de anticorpos naquele instante é a definição de estudo transversal.\n\n"
        "A) Coorte acompanha os mesmos indivíduos ao longo do tempo. "
        "B) Ecológico analisa dados agregados de populações, não indivíduos. "
        "C) Caso-controle parte dos doentes e busca exposições prévias. "
        "D) Longitudinal implica seguimento temporal, o que não ocorreu."
    ),
    16: (
        "A alternativa B é correta porque especificidade é a capacidade de um teste identificar corretamente os não doentes — "
        "a probabilidade de resultado negativo entre quem realmente não tem a doença (verdadeiros negativos / total de não doentes).\n\n"
        "A) Descreve incidência, não prevalência. Prevalência é o total de casos existentes num dado momento. "
        "C) Descreve mortalidade, não letalidade. Letalidade = óbitos pela doença / total de doentes. "
        "D) Descreve epidemia, não endemia. Endemia é a ocorrência habitual de uma doença em uma região. "
        "E) Descreve valor preditivo positivo, não negativo. VPN é a probabilidade de não ter a doença quando o teste é negativo."
    ),
    17: (
        "A alternativa E é correta porque o Brasil possui uma Lista Nacional de Doenças de Notificação Compulsória "
        "(atualizada por portaria do MS), e estados e municípios podem incluir outros agravos de interesse local, "
        "respeitando o princípio da descentralização do SUS.\n\n"
        "A) Casos suspeitos também devem ser notificados — a notificação não espera confirmação diagnóstica. "
        "B) A notificação pode ser feita por qualquer profissional de saúde, não apenas médicos. "
        "C) O principal sistema é o SINAN, não o SIA (Sistema de Informações Ambulatoriais). "
        "D) A lista não é baseada em percentual de carga de doença — é definida por critérios epidemiológicos e sanitários."
    ),
    18: (
        "A alternativa B é correta porque as Redes de Atenção à Saúde (RAS) no SUS devem ser organizadas de forma "
        "poliárquica — sem hierarquia rígida entre os pontos de atenção, com a APS coordenando o cuidado numa estrutura "
        "horizontal e integrada, em oposição ao modelo piramidal hierárquico tradicional.\n\n"
        "A) As RAS devem ser proativas, não apenas reativas. "
        "C) O financiamento deve ser por capitação ou orçamento global, não exclusivamente por procedimentos. "
        "D) Devem contemplar atenção contínua a condições crônicas e agudas. "
        "E) Devem enfatizar promoção e prevenção, não apenas ações curativas."
    ),
    19: (
        "A alternativa C é correta. A letalidade é calculada pela fórmula: (número de óbitos pela doença / número total "
        "de casos da doença) × 100. Aplicando os dados do quadro, o resultado é 2,78%. Letalidade mede a gravidade da "
        "doença entre os acometidos, diferentemente da mortalidade, que usa a população total como denominador.\n\n"
        "As demais alternativas resultam de cálculos incorretos — como usar a população total no denominador (mortalidade) "
        "em vez do número de casos (letalidade), ou erros aritméticos."
    ),
    20: (
        "A alternativa A é correta porque a Lei 8.142/90 estabeleceu o controle social como pilar do SUS, com Conselhos "
        "de Saúde (permanentes, deliberativos) e Conferências de Saúde (a cada 4 anos) em cada esfera de governo. "
        "Essa participação comunitária foi uma inovação fundamental do sistema.\n\n"
        "B) A equidade é princípio doutrinário do SUS, incorporada na legislação. "
        "C) O financiamento público per capita no Brasil é muito inferior ao de países da OCDE. "
        "D) A cobertura da ESF já ultrapassou 60% da população. "
        "E) O SUS segue princípio de descentralização, não de centralização."
    ),
    21: (
        "A alternativa A é correta porque a idade corrigida é calculada subtraindo da idade cronológica as semanas que "
        "faltaram para completar 40 semanas. Nascido com 32 semanas, faltaram 8 semanas (2 meses). "
        "Idade corrigida = 4 meses - 2 meses = 2 meses. A correção deve ser usada até 2 anos para avaliação do crescimento.\n\n"
        "B) Resultaria de descontar apenas 6 semanas. "
        "C) Resultaria de descontar apenas 5 semanas. "
        "D) Resultaria de descontar apenas 3 semanas. "
        "E) A idade corrigida é obrigatória para prematuros na avaliação do crescimento."
    ),
    22: (
        "A alternativa E é correta porque, embora o paciente esteja neurologicamente estável (Glasgow 15, sem sinais focais), "
        "passaram-se apenas 20 minutos do trauma — tempo insuficiente para descartar complicações. O protocolo PECARN para TCE "
        "pediátrico indica observação por 4-6 horas antes da alta. O hematoma frontal e a sonolência transitória são achados "
        "de risco intermediário que justificam observação, mas não TC imediata.\n\n"
        "A) Idade < 2 anos é fator de risco, mas isoladamente não indica TC. "
        "B) Queda de 80 cm não é mecanismo grave pelo PECARN para essa faixa etária (> 90 cm seria). "
        "C) Liberar com apenas 20 minutos de observação é imprudente. "
        "D) Sonolência breve e reativa pode ser normal após o susto — não indica TC isoladamente."
    ),
    23: (
        "A alternativa D é correta porque, segundo o Ministério da Saúde, toda criança com diarreia aguda deve receber "
        "zinco (20 mg/dia para > 6 meses, 10 mg/dia para < 6 meses) por 10-14 dias. O zinco reduz a duração e gravidade "
        "do episódio diarreico e diminui a recorrência nos meses seguintes. A criança está hidratada (Plano A).\n\n"
        "A) Não há indicação de suspender lácteos em diarreia aguda sem intolerância comprovada. "
        "B) A criança está hidratada — mucosas úmidas, turgor preservado, lágrimas presentes. "
        "C) Plano A é o correto para paciente sem desidratação; Plano B é para desidratação leve/moderada. "
        "E) Soro glicosado não é recomendado — usa-se SRO (sais de reidratação oral)."
    ),
    24: (
        "A alternativa C é correta porque, após ITU febril em lactente com USG normal, a cintilografia renal com DMSA "
        "é o exame indicado para avaliar cicatrizes renais. Deve ser realizada 4-6 meses após o episódio agudo para "
        "diferenciar lesão aguda de cicatriz permanente. O DMSA é o padrão-ouro para detecção de cicatrizes renais.\n\n"
        "A) Urograma excretor é obsoleto na pediatria, substituído por métodos menos invasivos. "
        "B) Uretrocistografia é indicada para ITU recorrente ou USG alterada, não como próximo passo neste caso. "
        "D) DTPA avalia função tubular e filtração, não cicatrizes renais. "
        "E) TC é excessivamente irradiante para lactentes e não é primeira escolha."
    ),
    25: (
        "A alternativa C é correta porque a mãe foi inadequadamente tratada — o tratamento foi iniciado no último mês "
        "de gravidez, sem tempo para resposta sorológica adequada (necessário pelo menos 30 dias antes do parto). O RN "
        "com VDRL positivo e exames normais (sem neurossífilis) deve receber penicilina cristalina EV por 10 dias "
        "(50.000 UI/kg/dose, 12/12h na 1ª semana, 8/8h após).\n\n"
        "A) Penicilina procaína por 7 dias não é o esquema preconizado neste cenário. "
        "B) 7 dias é insuficiente — o protocolo exige 10 dias. "
        "D) Benzatina dose única só quando mãe foi adequadamente tratada e RN assintomático com VDRL não reagente. "
        "E) Aguardar expõe o RN ao risco de complicações da sífilis congênita não tratada."
    ),
}

count = 0
for q in data['questoes']:
    if q['numero'] in explicacoes:
        q['explicacao'] = explicacoes[q['numero']]
        count += 1

with open('medpassei/UFSC 2022.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'Updated {count} explanations (Q1-Q25)')
