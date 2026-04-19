import json

with open('medpassei/UFSC 2022.json', encoding='utf-8') as f:
    data = json.load(f)

explicacoes = {
    76: (
        "A alternativa D é correta porque o pseudocisto pancreático é a complicação mais comum a longo prazo "
        "da pancreatite aguda. Forma-se a partir do encapsulamento de coleções líquidas peripancreáticas após "
        "4-6 semanas do episódio agudo, com parede de tecido fibroso/granulação (sem revestimento epitelial). "
        "A maioria resolve espontaneamente; intervenção é necessária se sintomático, infectado ou > 6 cm.\n\n"
        "A) Icterícia obstrutiva é incomum como complicação tardia. "
        "B) Pancreatite crônica pode ocorrer, mas não é a complicação mais frequente. "
        "C) Abscesso pancreático é complicação aguda/subaguda, não de longo prazo. "
        "E) Trombose de veia esplênica pode ocorrer, mas é menos frequente que pseudocisto."
    ),
    77: (
        "A alternativa B é correta porque vômitos de repetição por obstrução duodenal causam perda de HCl "
        "(hipocloremia), perda de potássio (hipocalemia), desidratação (hipovolemia) e alcalose metabólica "
        "hipoclorêmica. A perda de H+ pelo vômito e a contração de volume perpetuam a alcalose. A hipocalemia "
        "agrava a alcalose pela troca renal de K+ por H+.\n\n"
        "A) Hipercalemia não ocorre — há perda de K+ nos vômitos e pelo rim. "
        "C) Normocalemia e normocloremia não são esperadas com vômitos prolongados. "
        "D) Hipervolemia não ocorre — há desidratação. "
        "E) Acidose metabólica é o oposto do esperado em vômitos altos (gástricos/duodenais)."
    ),
    78: (
        "A alternativa A é correta porque o esôfago de Barrett com displasia de alto grau tem risco significativo "
        "de progressão para adenocarcinoma esofágico (até 30-40% em alguns estudos). A esofagectomia é o tratamento "
        "mais definitivo. Alternativas menos invasivas como ablação endoscópica (radiofrequência) também podem ser "
        "consideradas em centros especializados, mas a esofagectomia permanece como opção padrão.\n\n"
        "B) Cirurgia antirrefluxo não trata a displasia já estabelecida. "
        "C) e D) Observação com endoscopia é conduta para Barrett sem displasia ou com displasia de baixo grau — "
        "com displasia de alto grau, a conduta é intervencionista. "
        "E) IBP controla o refluxo, mas não reverte a displasia de alto grau."
    ),
    79: (
        "A alternativa E é correta porque a embolização arterial seletiva é uma alternativa segura e eficaz "
        "para controle de sangramento em pacientes hemodinamicamente estáveis com adenoma hepático roto. Evita "
        "uma cirurgia de urgência em fígado inflamado e permite posterior ressecção eletiva em melhores condições.\n\n"
        "A) Adenomas com mutação da beta-catenina têm maior risco de malignização, não de sangramento. "
        "B) Adenomas em homens têm maior risco de malignização, não em mulheres. "
        "C) Adenomas com mutação da beta-catenina têm maior risco de malignidade, não os inflamatórios. "
        "D) Ressecções econômicas (não anatômicas) são suficientes — o adenoma não tem comportamento infiltrativo."
    ),
    80: (
        "A alternativa D é correta. A fórmula de Parkland calcula a reposição volêmica nas primeiras 24h de "
        "queimadura: 4 mL × peso (kg) × % SCQ = 4 × 80 × 35 = 11.200 mL de cristaloide. Metade é infundida "
        "nas primeiras 8h e a outra metade nas 16h seguintes. O débito urinário (0,5-1 mL/kg/h) guia ajustes.\n\n"
        "A) 2.800 mL = 1 × 80 × 35 — fator de multiplicação incorreto. "
        "B) 5.600 mL = 2 × 80 × 35 — fator de multiplicação incorreto. "
        "C) 8.400 mL = 3 × 80 × 35 — fator de multiplicação incorreto. "
        "E) 14.000 mL = 5 × 80 × 35 — fator de multiplicação incorreto."
    ),
    81: (
        "A alternativa D é correta porque T4 e T3 são sintetizados a partir da tireoglobulina (proteína "
        "precursora produzida pelas células foliculares) por iodação dos resíduos de tirosina. Ficam armazenados "
        "no coloide folicular até serem liberados por proteólise da tireoglobulina sob estímulo do TSH.\n\n"
        "A) É o inverso: a maior parte do T3 circulante é produzida pela conversão periférica de T4 (por desiodases), "
        "não o contrário. "
        "B) O iodo é obtido principalmente pela dieta (sal iodado, frutos do mar), não apenas por suplementação. "
        "C) Apenas 20% do T3 é produzido na tireoide; 80% vem da conversão periférica de T4. "
        "E) Os receptores de hormônios tireoidianos são nucleares (intranucleares), não transmembrana."
    ),
    82: (
        "A alternativa E é correta porque os análogos do GLP-1 (liraglutida, semaglutida, dulaglutida) "
        "mimetizam o efeito incretínico: estimulam a secreção de insulina de forma glicose-dependente, "
        "suprimem o glucagon, retardam o esvaziamento gástrico e promovem saciedade, favorecendo perda de peso.\n\n"
        "A) Os inibidores de SGLT2 atuam no túbulo proximal renal (não no glomérulo), bloqueando a reabsorção "
        "de glicose e reduzindo (não aumentando) a hiperfiltração. "
        "B) Os inibidores de DPP-4 atuam aumentando os níveis de incretinas (GLP-1/GIP), não a sensibilidade "
        "à insulina. "
        "C) As sulfonilureias aumentam a secreção de insulina (não glucagon) — por isso causam hipoglicemia. "
        "D) A metformina age principalmente reduzindo a produção hepática de glicose e aumentando a sensibilidade "
        "periférica à insulina, não na absorção intestinal de carboidratos."
    ),
    83: (
        "A alternativa A é correta porque o STOP-BANG ≥ 5 indica alto risco para síndrome da apneia obstrutiva "
        "do sono (SAOS). O exame padrão-ouro para diagnóstico é a polissonografia tipo 1 (em laboratório, "
        "com supervisão), que monitora EEG, EMG, EOG, fluxo aéreo, esforço respiratório, oximetria e ECG.\n\n"
        "B) Poligrafia respiratória (tipo 3) é alternativa quando a PSG tipo 1 não está disponível, mas não é "
        "o padrão-ouro. "
        "C) Dosagem de melatonina não faz parte da investigação de SAOS. "
        "D) TC de região cervical não é exame de rotina para diagnóstico de SAOS. "
        "E) Avaliação ortodôntica pode ser complementar, mas não é o exame diagnóstico."
    ),
    84: (
        "A alternativa B é correta porque, segundo a Resolução CFM 2.173/2017, antes de iniciar o protocolo "
        "de morte encefálica, é necessário tratar a causa do coma por tempo mínimo de 6 horas (ou 24h se "
        "causa hipóxico-isquêmica). Além disso, a temperatura deve ser ≥ 35°C (o paciente está a 34,5°C, "
        "necessitando aquecimento). O protocolo exige estabilização clínica prévia.\n\n"
        "A) A temperatura mínima para os testes é 35°C, não 34,5°C — está abaixo do limiar. "
        "C) A TC de crânio é obrigatória para identificar a causa da lesão encefálica. "
        "D) Pupilas fixas e midriáticas OU médias são compatíveis com ME — não contraindicam o protocolo. "
        "E) Craniectomia descompressiva é tratamento, não procedimento do protocolo de ME."
    ),
    85: (
        "A alternativa C é correta porque a bacteremia persistente (hemoculturas positivas persistentemente) "
        "é o achado mais indicativo de endocardite infecciosa, sendo um dos critérios maiores de Duke. O "
        "paciente tem fator de risco (procedimento invasivo — colonoscopia com biópsia) e quadro compatível "
        "(febre prolongada, emagrecimento, queda do estado geral).\n\n"
        "A) Nódulos de Osler são achados sugestivos, mas menos frequentes e menos específicos. "
        "B) Petéquias são achados inespecíficos. "
        "D) Sopro cardíaco novo é critério maior, mas sopro sistólico em foco aórtico em idoso pode ser "
        "esclerose valvar degenerativa — menos específico que bacteremia persistente. "
        "E) IC direita pode ocorrer em endocardite de valvas direitas, mas é menos indicativo que bacteremia."
    ),
    86: (
        "A alternativa A é correta porque a paciente com provável COVID-19 grave (obesa, SpO2 90% apesar de "
        "O2 a 15L/min, FR 32, linhas B bilaterais = SDRA) apresenta hipoxemia refratária que indica intubação "
        "orotraqueal e ventilação mecânica protetora (VC 4-6 mL/kg de peso ideal). A \"hipoxemia silenciosa\" "
        "(sem dispneia apesar de SpO2 baixa) não deve retardar a IOT.\n\n"
        "B) Ivermectina não tem evidência de benefício na COVID-19. O corticoide (dexametasona) é indicado, mas "
        "não associado à ivermectina. "
        "C) Retardar a IOT em paciente com SpO2 90% sob O2 a 15L/min aumenta mortalidade. "
        "D) Anticoagulação plena não é indicada empiricamente sem diagnóstico de TEP. "
        "E) Azitromicina não tem benefício comprovado na COVID-19."
    ),
    87: (
        "A alternativa B é correta porque taquicardia com QRS alargado em paciente com cardiopatia estrutural "
        "prévia (IAM prévio) é taquicardia ventricular (TV) até que se prove o contrário. Estatisticamente, "
        "em pacientes com antecedente de IAM, mais de 80% das taquicardias de QRS largo são TV.\n\n"
        "A) Adenosina é tratamento para taquicardia supraventricular, não para TV. "
        "C) TV pode cursar com PA normal — estabilidade hemodinâmica não descarta TV. "
        "D) TV é geralmente mais maligna que TSV com aberrância, não o contrário. "
        "E) A diferenciação é importante: TV pode ser tratada com amiodarona ou cardioversão, "
        "enquanto TSV responde a manobras vagais ou adenosina."
    ),
    88: (
        "A alternativa D é correta porque o paciente apresenta sepse com choque séptico (hipotensão + "
        "taquicardia). O pacote da primeira hora (Surviving Sepsis Campaign) inclui: dosar lactato sérico, "
        "coletar hemoculturas antes do antibiótico, iniciar antibioticoterapia de amplo espectro, e infundir "
        "30 mL/kg de cristaloide em bolus para pacientes com hipotensão ou lactato ≥ 4.\n\n"
        "A) O vasopressor pode ser iniciado durante a ressuscitação volêmica se necessário, não apenas após. "
        "B) Noradrenalina é o vasopressor de primeira escolha; vasopressina é segunda linha, não equivalente. "
        "C) O clearance do lactato é usado para guiar a terapêutica, não apenas como marcador prognóstico. "
        "E) Dopamina não é mais recomendada como primeira escolha — noradrenalina é preferida."
    ),
    89: (
        "A alternativa C é correta porque o quadro — abaulamento de hemitórax direito, abolição de MV, macicez "
        "à percussão e diminuição da ausculta da voz nos 2/3 inferiores direitos — configura síndrome de "
        "derrame pleural volumoso. A ultrassonografia de tórax é o melhor exame à beira-leito para confirmar "
        "derrame pleural, estimar volume e guiar toracocentese.\n\n"
        "A) O diagnóstico sindrômico está correto, mas ecocardiograma não é o exame para confirmar derrame pleural. "
        "B) Atelectasia cursa com retração (não abaulamento) do hemitórax e desvio do mediastino ipsilateral. "
        "D) Massa tumoral é possível, mas o quadro sindrômico é mais compatível com derrame pleural. "
        "E) Radiografia é uma opção, mas a USG é mais sensível e permite diagnóstico e procedimento à beira-leito."
    ),
    90: (
        "A alternativa E é correta porque as vacinas de RNA mensageiro (Pfizer/BioNTech e Moderna) apresentaram "
        "taxas de eficácia superiores a 90% contra infecção sintomática nos estudos de fase 3, enquanto vacinas "
        "de vírus inativado (CoronaVac) apresentaram eficácia menor (50-80% contra infecção sintomática).\n\n"
        "A) Nenhuma vacina contra COVID-19 utilizada no Brasil contém vírus vivo atenuado — CoronaVac é inativada. "
        "B) Não há correlação estabelecida entre reação a outras vacinas e efeitos colaterais das vacinas COVID-19. "
        "C) Miocardite é rara e mais associada a jovens do sexo masculino após vacinas de mRNA, não a imunodeficientes. "
        "D) As vacinas estimulam anticorpos contra a proteína Spike, não contra a transcriptase reversa."
    ),
    91: (
        "A alternativa B é correta porque o quadro — uso de AINE seguido de febre, odinofagia, bolhas com "
        "descolamento epidérmico extenso (sinal de Nikolsky positivo), comprometimento de mucosa oral e "
        "conjuntival — é clássico de necrólise epidérmica tóxica (NET), definida como > 30% de descolamento "
        "da superfície corporal. A NET é uma emergência dermatológica com mortalidade de 25-50%, requerendo "
        "UTI com cuidados semelhantes a grandes queimados.\n\n"
        "A) Psoríase bolhosa não apresenta descolamento epidérmico ao atrito nem comprometimento mucoso extenso. "
        "C) Sarampo causa manchas de Koplik na mucosa oral, não bolhas e descolamento epidérmico. "
        "D) Síndrome de Stevens-Johnson é definida como < 10% de descolamento — aqui é > 30%, configurando NET. "
        "E) Pênfigo vulgar é doença autoimune crônica, não reação medicamentosa aguda."
    ),
    92: (
        "A alternativa A é correta porque a relação entre creatinina sérica e TFG não é linear: nas fases "
        "precoces da DRC (estágios 1-2), pode haver perda significativa de TFG (de 120 para 60 mL/min) "
        "enquanto a creatinina permanece dentro da faixa normal. Isso ocorre porque a creatinina só se eleva "
        "significativamente quando a TFG cai abaixo de 50-60 mL/min.\n\n"
        "B) A correlação é ruim nas fases precoces — justamente o ponto da questão. "
        "C) Nas fases avançadas, a creatinina é um bom indicador — pequenas mudanças na TFG geram grandes "
        "variações na creatinina. "
        "D) A creatinina deve ser monitorada em todos os estágios. "
        "E) A relação não é inversamente proporcional de forma uniforme em todo o curso."
    ),
    93: (
        "A alternativa B é correta porque a avaliação de fibrose na DHGNA deve ser feita preferencialmente "
        "de forma não invasiva, combinando escores bioquímicos (FIB-4, NAFLD Fibrosis Score) com elastografia "
        "hepática (FibroScan, ARFI ou RM). A biópsia hepática é reservada para casos duvidosos. Essa abordagem "
        "evita procedimento invasivo em uma doença altamente prevalente.\n\n"
        "A) Metformina não é contraindicada em doença hepática gordurosa — na verdade, pode ser benéfica. "
        "C) Diagnóstico diferencial com outras hepatopatias é obrigatório, mesmo com perfil metabólico sugestivo. "
        "D) O grau de esteatose na USG não se correlaciona com gravidade da fibrose/inflamação. "
        "E) Estatinas são seguras e podem ser mantidas com aminotransferases até 3× o limite superior."
    ),
    94: (
        "A alternativa E é correta porque a intoxicação por antidepressivos tricíclicos (amitriptilina) causa "
        "síndrome anticolinérgica: midríase, taquicardia, pele seca e quente, retenção urinária (globo vesical), "
        "constipação, agitação e confusão mental. O mnemônico: \"quente como uma lebre, seco como um osso, "
        "vermelho como uma beterraba, cego como um morcego, louco como um chapeleiro\".\n\n"
        "A) Sialorreia é achado da síndrome colinérgica (organofosforados), não anticolinérgica — "
        "na anticolinérgica há boca seca (xerostomia). "
        "B) Alterações no ECG são comuns e graves (alargamento de QRS, prolongamento de QT, arritmias). "
        "C) Colinesterase é dosada na intoxicação por organofosforados, não por tricíclicos. "
        "D) Atropina agravaria o quadro anticolinérgico — é usada na intoxicação colinérgica, não anticolinérgica."
    ),
    95: (
        "A alternativa C é correta porque, segundo o I Consenso Brasileiro de DRGE, pacientes com sintomas "
        "típicos de DRGE (pirose e regurgitação) e endoscopia normal podem receber teste terapêutico com IBP. "
        "Se não houver resposta ao teste terapêutico, a pHmetria esofágica de 24h está indicada para confirmar "
        "ou excluir DRGE e correlacionar sintomas com episódios de refluxo.\n\n"
        "A) Sintomas típicos com endoscopia normal podem ser DRGE não erosiva — não se descarta o diagnóstico. "
        "B) Manometria é indicada antes de cirurgia antirrefluxo, não como primeiro passo na investigação. "
        "D) O teste terapêutico com IBP está indicado para sintomas típicos, independente de extraesofágicos. "
        "E) Medidas comportamentais (elevar cabeceira, perder peso, evitar alimentos gatilho) são fundamentais no tratamento."
    ),
    96: (
        "A alternativa E é correta porque o padrão de instabilidade em relacionamentos interpessoais, "
        "variações extremas de humor (da depressão à euforia em curto intervalo), impulsividade "
        "(tentativas de suicídio impulsivas em contexto de conflito) e discursos contraditórios dependendo "
        "da audiência são característicos do transtorno de personalidade borderline (TPB).\n\n"
        "A) Delirium cursa com flutuação do nível de consciência e atenção, não apenas do humor. "
        "B) Transtorno bipolar tem episódios de semanas/meses, não flutuações em horas. "
        "C) Os relatos contraditórios não são delírios — são mudanças relacionais típicas do TPB. "
        "D) Tentativas impulsivas de suicídio no TPB têm alto risco de recorrência e necessitam de rede de apoio."
    ),
    97: (
        "A alternativa C é correta porque a paciente apresenta AVC isquêmico agudo (déficit motor à esquerda + "
        "hiperdensidade da ACM direita = trombo). Após fibrinólise sem melhora, a RM de crânio em caráter de "
        "urgência (difusão + perfusão) é indicada para avaliar se existe mismatch (área de penumbra isquêmica "
        "recuperável). Se houver mismatch significativo, a trombectomia mecânica é indicada — pode ser realizada "
        "até 24h em casos selecionados (estudos DAWN e DEFUSE-3).\n\n"
        "A) A janela para trombectomia pode se estender até 24h com base em critérios de imagem, não apenas 4:30h. "
        "B) Trombectomia após fibrinólise não é contraindicada — é justamente a conduta em oclusão de grande vaso. "
        "D) RM é necessária para selecionar candidatos à trombectomia — não atrasa, otimiza a indicação. "
        "E) Trombectomia sem penumbra significativa não tem benefício comprovado."
    ),
    98: (
        "A alternativa A é correta porque o quadro — idoso com anemia macrocítica, língua despapilada (glossite "
        "atrófica), LDH elevado e bilirrubina indireta elevada — é clássico de anemia megaloblástica por "
        "deficiência de vitamina B12. A eritropoiese ineficaz na carência de B12 causa destruição intramedular "
        "de precursores (hemólise intramedular), elevando LDH e bilirrubina indireta.\n\n"
        "B) Os achados de LDH e BI elevados na B12 simulam hemólise, mas a causa é eritropoiese ineficaz. "
        "C) Mielograma não é obrigatório — dosagem de B12 e ácido fólico séricos definem o diagnóstico. "
        "D) Anemia aplásica é rara e não explica a macrocitose com LDH/BI elevados. "
        "E) Na carência de B12, os reticulócitos estão baixos (reticulocitopenia), não elevados."
    ),
    99: (
        "A alternativa D é correta porque, segundo o CEM e resoluções do CFM, quando um médico plantonista "
        "não pode comparecer ao plantão, é responsabilidade do responsável técnico do serviço providenciar "
        "um substituto ou cobrir pessoalmente o plantão. O médico que está saindo deve comunicar ao responsável "
        "técnico da UPA a situação.\n\n"
        "A) Apenas avisar que ficará sem médico é insuficiente — o RT tem obrigação de resolver. "
        "B) Não é responsabilidade do RT do hospital A resolver o problema da UPA. "
        "C) O problema é da UPA, não do outro hospital (B). "
        "E) O médico tem compromisso no hospital A — é vedado abandonar um plantão para cobrir outro sem "
        "que haja substituto."
    ),
    100: (
        "A alternativa B é correta porque, embora o enunciado não forneça os dados do LCR diretamente, "
        "o perfil descrito (febre + cefaleia + sinais meníngeos em jovem com LCR sugestivo de meningite "
        "bacteriana) indica uso de dexametasona associada ao antibiótico para reduzir sequelas neurológicas. "
        "No entanto, se o agente for pneumococo (sem indicação de meningococo), não há indicação de "
        "quimioprofilaxia para contatos nem de precauções respiratórias adicionais.\n\n"
        "A) Precauções por aerossol e quimioprofilaxia seriam indicadas para meningococo, não para pneumococo. "
        "C) Corticosteroide (dexametasona) está indicado na meningite bacteriana. "
        "D) Quimioprofilaxia com rifampicina é indicada apenas para contatos de meningite meningocócica. "
        "E) Precauções por aerossol e quimioprofilaxia não se aplicam a meningite pneumocócica."
    ),
}

count = 0
for q in data['questoes']:
    if q['numero'] in explicacoes:
        q['explicacao'] = explicacoes[q['numero']]
        count += 1

with open('medpassei/UFSC 2022.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'Updated {count} explanations (Q76-Q100)')
