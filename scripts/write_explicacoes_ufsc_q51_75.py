import json

with open('medpassei/UFSC 2022.json', encoding='utf-8') as f:
    data = json.load(f)

explicacoes = {
    51: (
        "A alternativa D é correta porque o balão intrauterino (balão de Bakri) é indicado para tamponamento "
        "uterino na hemorragia pós-parto, especialmente em casos de atonia uterina e sangramento de leito "
        "placentário em placenta prévia após cesariana, quando o útero não responde a uterotônicos.\n\n"
        "A) Neoplasia cervical é contraindicação ao balão intrauterino. "
        "B) Laceração uterina requer sutura cirúrgica, não tamponamento. "
        "C) Retenção de restos placentários requer curetagem/revisão da cavidade. "
        "E) Placenta percreta (invasão além da serosa) requer abordagem cirúrgica — o balão não resolve a invasão transmural."
    ),
    52: (
        "A alternativa A é correta porque, segundo o protocolo do MS/OPAS/FEBRASGO, glicemia de jejum entre "
        "92-125 mg/dL no primeiro trimestre já fecha o diagnóstico de diabetes mellitus gestacional (DMG), sem "
        "necessidade de TOTG. Com glicemia de 93 mg/dL, o diagnóstico está confirmado e o tratamento (dieta, "
        "exercício e monitorização glicêmica) deve ser iniciado imediatamente.\n\n"
        "B) Hemoglobina glicada não faz parte do protocolo de rastreio de DMG no Brasil, e o TOTG é com 75g, não 100g. "
        "C) Com glicemia ≥ 92, o diagnóstico já está feito — não se espera o TOTG de 24-28 semanas. "
        "D) O TOTG no primeiro trimestre não é rotina quando a glicemia de jejum já é diagnóstica. "
        "E) Metformina não é primeira linha no DMG — o tratamento começa com dieta e atividade física."
    ),
    53: (
        "A alternativa C é correta porque placenta prévia é definida como tecido placentário total ou parcialmente "
        "inserido no segmento inferior do útero, diagnosticada após 28 semanas de gestação. Antes dessa idade "
        "gestacional, o diagnóstico não é definitivo, pois a \"migração placentária\" pode ocorrer com o crescimento uterino.\n\n"
        "A) A USG é o exame de escolha, não a TC. A RM pode ser usada como complementar para acretismo. "
        "B) Os principais fatores de risco para acretismo são: cesariana prévia, placenta prévia e curetagem anterior. "
        "D) A maioria das placentas baixas no segundo trimestre migra até o termo — apenas 10-20% se mantêm. "
        "E) Sangramento vivo indolor é o quadro clássico da placenta prévia. Hipertonia uterina localizada sugere DPP."
    ),
    54: (
        "A alternativa A é correta porque a placenta humana é do tipo hemocorial — o trofoblasto invade o "
        "endométrio até atingir os vasos sanguíneos maternos, de modo que o sangue materno banha diretamente "
        "as vilosidades coriônicas. Essa classificação se baseia no número de camadas teciduais entre o sangue "
        "materno e fetal.\n\n"
        "B) Epiteliocorial: placenta de equinos e suínos — epitélio materno intacto. "
        "C) Sindesmocorial: placenta de ruminantes — o epitélio materno é erodido. "
        "D) Endoteliocorial: placenta de cães e gatos — o endotélio vascular materno permanece. "
        "E) Sinepiteliocorial: variante da sindesmocorial em alguns ruminantes."
    ),
    55: (
        "A alternativa B é correta porque o quadro — gestante com pré-eclâmpsia, dor em hipogástrio, hipertensão "
        "grave (170×110), taquicardia, aumento localizado do tônus uterino e taquicardia fetal — é clássico de "
        "descolamento prematuro de placenta (DPP). A conduta é amniotomia (romper bolsa para reduzir pressão "
        "intrauterina e acelerar o parto) e resolução imediata da gestação.\n\n"
        "A) DPP não é trabalho de parto prematuro — não se deve inibir, e sim resolver. "
        "C) Estabilizar a PA é importante, mas a prioridade é resolver a gestação — não aguardar USG. "
        "D) Novamente, não é TPP — a hipertonia localizada indica DPP, não contração de trabalho de parto. "
        "E) Placenta prévia cursa com sangramento indolor e útero sem hipertonia, diferente deste caso."
    ),
    56: (
        "A alternativa E é correta porque colo curto (< 25 mm) em gestante assintomática entre 16-24 semanas "
        "é indicação de progesterona vaginal (200 mg/dia) para prevenção de parto prematuro. Essa é a conduta "
        "padrão recomendada pela FEBRASGO e pela FIGO para redução do risco de prematuridade.\n\n"
        "A) Repouso absoluto, corticoide e antibiótico não são indicados para colo curto assintomático. "
        "B) Nifedipina é tocolítico para trabalho de parto prematuro ativo, não para colo curto assintomático. "
        "C) Cerclagem por videolaparoscopia não é técnica padrão; cerclagem cervical é indicada em insuficiência "
        "cervical com história de perdas recorrentes, não como primeira medida para colo curto isolado. "
        "D) Conduta expectante sem tratamento não é adequada com colo de 18 mm — há risco significativo de prematuridade."
    ),
    57: (
        "A alternativa C é correta porque a soroconversão (IgM+ → IgM+/IgG+) entre 8 e 16 semanas confirma "
        "infecção aguda por toxoplasmose durante a gestação. A conduta é iniciar espiramicina 3g/dia imediatamente "
        "(para reduzir transmissão vertical) e programar amniocentese para pesquisa de Toxoplasma por PCR no "
        "líquido amniótico, que pode ser realizada a partir de 18 semanas de IG.\n\n"
        "A) O teste de avidez não é útil com 16 semanas — ele é confiável apenas quando realizado antes de 16 semanas. "
        "B) Amniocentese imediata não é indicada antes de 18 semanas — risco de falso negativo. "
        "D) O esquema tríplice (sulfadiazina + pirimetamina + ácido folínico) só é indicado após confirmação "
        "de infecção fetal por PCR no líquido amniótico. "
        "E) A soroconversão já está documentada — repetir sorologia atrasaria o tratamento."
    ),
    58: (
        "A alternativa A é correta porque o teste da nitrazina avalia o pH do líquido vaginal. O pH normal da "
        "vagina é ácido (4,5-6,0), enquanto o líquido amniótico é alcalino (7,0-7,5). Um pH de 7,1 é sugestivo "
        "de presença de líquido amniótico, corroborando o diagnóstico de rotura prematura de membranas (RPM).\n\n"
        "B) Bolsão de 2,6 cm está dentro da normalidade — oligodrâmnio seria bolsão < 2 cm. "
        "C) Microglobulina alfa-placentária negativo afasta RPM, não confirma. "
        "D) Ausência de arborização (cristalização negativa) afasta RPM. O teste positivo mostra arborização em folha de samambaia. "
        "E) Amniocentese para maturidade pulmonar não é exame para diagnóstico de RPM."
    ),
    59: (
        "A alternativa D é correta porque as manobras de Leopold-Zweifel são 4 tempos sequenciais: "
        "1° tempo — delimitar e palpar o fundo uterino (identifica a situação fetal); "
        "2° tempo — palpar dorso e membros (identifica a posição fetal); "
        "3° tempo — explorar mobilidade do polo que se apresenta (manobra de Leopold com uma mão); "
        "4° tempo — verificar o grau de penetração/encaixamento do polo fetal na pelve (com ambas as mãos).\n\n"
        "A) Inverte os tempos 3 e 4, e 4° tempo usa ambas as mãos, não indicador e polegar. "
        "B) Verificar BCF não faz parte das manobras de Leopold. "
        "C) Começa pelo 2° tempo — a sequência correta inicia pela palpação do fundo uterino. "
        "E) BCF não faz parte das manobras de Leopold."
    ),
    60: (
        "A alternativa A é correta porque na gestação há aumento de 50% na taxa de filtração glomerular (TFG) "
        "e no fluxo plasmático renal, resultando em maior filtração e excreção de sódio pela urina. Essa é uma "
        "das modificações fisiológicas renais mais importantes da gestação.\n\n"
        "B) A absorção intestinal de cálcio aumenta na gestação (mediada pela vitamina D), compensando a demanda fetal. "
        "C) Os lipídeos totais e lipoproteínas aumentam na gestação — a hiperlipidemia gestacional é fisiológica. "
        "D) A tireoide aumenta de volume na gestação (10-15%), não diminui. O hCG estimula a tireoide. "
        "E) A adeno-hipófise aumenta de volume na gestação (até 135%), principalmente pela hiperplasia dos lactotrofos."
    ),
    61: (
        "A alternativa E é correta porque o estudo CRASH-2 demonstrou que o ácido tranexâmico reduz a mortalidade "
        "por hemorragia em 32% se administrado na primeira hora, 21% entre 1-3 horas, mas aumenta o risco de morte "
        "se dado após 3 horas do trauma. Por isso, a administração precoce (< 3h) é fundamental.\n\n"
        "A) O benefício depende do tempo — após 3h pode ser deletério. "
        "B) O CRASH-2 não demonstrou aumento significativo de eventos tromboembólicos. "
        "C) O CRASH-3 demonstrou tendência de redução de mortalidade em TCE leve/moderado quando administrado precocemente. "
        "D) O benefício foi demonstrado tanto em trauma contuso quanto penetrante."
    ),
    62: (
        "A alternativa A é correta porque o quadro clínico — hipoglicemia de jejum (tríade de Whipple: sintomas "
        "hipoglicêmicos + glicemia baixa + melhora com alimentação) com nódulo hipervascular no pâncreas — é "
        "clássico de insulinoma. Mais de 90% são benignos e solitários. Como o tumor está em corpo pancreático, "
        "em contato com o ducto principal e com atrofia distal, a enucleação não é segura — a pancreatectomia "
        "corpo-caudal é o tratamento indicado.\n\n"
        "B) A maioria dos insulinomas é benigna (> 90%), não maligna. "
        "C) A enucleação seria ideal para tumores pequenos afastados do ducto pancreático — aqui há contato íntimo com o ducto. "
        "D) e E) Glucagonoma causa hiperglicemia, eritema necrolítico migratório e perda de peso — o quadro descrito é de hipoglicemia."
    ),
    63: (
        "A alternativa B é correta porque a veia hepática média (ou veia supra-hepática média) corre na cisão "
        "principal do fígado (linha de Cantlie), dividindo-o em hemifígado direito e esquerdo. Essa é a referência "
        "anatômica fundamental na segmentação hepática de Couinaud.\n\n"
        "A) O ducto hepático esquerdo drena os segmentos 2, 3 e 4 (não 5 e 6, que são do lobo direito). "
        "C) A veia cava inferior está à direita da aorta, não à esquerda. "
        "D) As veias supra-hepáticas drenam na veia cava inferior (retro-hepática), não na cava superior. "
        "E) O segmento I (lobo caudado) é posterior à veia cava; o segmento III é lateral esquerdo."
    ),
    64: (
        "A alternativa C é correta porque a visão crítica de segurança (Critical View of Safety) de Strasberg "
        "exige três critérios: 1) o triângulo hepatocístico (ou triângulo de Calot) deve ser dissecado e limpo "
        "de tecido gorduroso e fibroso; 2) o terço inferior da vesícula deve ser separado do fígado, expondo a "
        "placa cística; 3) apenas 2 estruturas devem ser vistas entrando na vesícula (ducto cístico e artéria "
        "cística). Essa técnica previne lesão inadvertida da via biliar principal.\n\n"
        "A) O colédoco NÃO deve ser dissecado — isso aumenta o risco de lesão. "
        "B) São 2 estruturas, não 3. "
        "D) O triângulo deve ser dissecado, não mantido intacto. "
        "E) A placa cística deve ser exposta, não mantida intacta."
    ),
    65: (
        "A alternativa D é correta porque em paciente idosa com hérnia hiatal tipo I (deslizamento) que responde "
        "ao IBP, a cirurgia não está indicada. O tratamento conservador com IBP é preferível quando há bom controle "
        "sintomático, especialmente em pacientes com comorbidades e risco cirúrgico elevado.\n\n"
        "A) Hérnia tipo III é a combinação de tipo I (deslizamento) + tipo II (paraesofágica), não deslizamento + outras estruturas. "
        "B) Cerca de 90% das hérnias hiatais são tipo I, não 10%. "
        "C) A maioria das hérnias hiatais são tipo I (90%), não tipo II. "
        "E) Hérnias tipo II assintomáticas em idosos podem ser acompanhadas conservadoramente — a indicação cirúrgica "
        "universal independente de condições clínicas é excessiva."
    ),
    66: (
        "A alternativa B é correta porque as hérnias lombares mais comuns ocorrem pelo triângulo lombar superior "
        "(de Grynfelt-Lesshaft), que tem como limites o 12° arco costal superiormente, músculo quadrado lombar "
        "medialmente e músculo oblíquo interno lateralmente.\n\n"
        "A) Hérnia de Spiegel ocorre entre o músculo reto abdominal e a linha semilunar, não envolve divertículo de Meckel "
        "(essa é a hérnia de Littre). "
        "C) O triângulo lombar superior é de Grynfelt, não de Petit (que é o triângulo lombar inferior). "
        "D) A descrição corresponde à hérnia de Spiegel, não de Richter (que é a herniação da borda antimesentérica). "
        "E) A hérnia de Littre é a herniação do divertículo de Meckel; Richter é a herniação parcial da parede intestinal."
    ),
    67: (
        "A alternativa E é correta porque, segundo a Resolução CFM 2.172/2017, as cirurgias autorizadas para "
        "tratamento de DM2 com IMC 30-34,9 são: bypass gástrico em Y de Roux e gastrectomia vertical (sleeve). "
        "Essas duas técnicas demonstraram benefício metabólico significativo nessa faixa de IMC.\n\n"
        "A) Não é apenas o bypass — a gastrectomia vertical também é autorizada. "
        "B) A banda gástrica não é autorizada para cirurgia metabólica nessa faixa de IMC. "
        "C) e D) O duodenal switch não está entre as cirurgias autorizadas para IMC 30-34,9."
    ),
    68: (
        "A alternativa B é correta porque a fase inflamatória da cicatrização (primeiras 48-72h) é caracterizada "
        "por hemostasia, aumento da permeabilidade vascular, migração celular por quimiotaxia (neutrófilos primeiro, "
        "depois macrófagos), secreção de citocinas e fatores de crescimento, e ativação das células migrantes.\n\n"
        "A) Queloide ultrapassa os limites da cicatriz original (diferente da cicatriz hipertrófica) e tem alta "
        "taxa de recidiva após excisão. "
        "C) Hemostasia e inflamação ocorrem na fase inflamatória, não na proliferativa. A fase proliferativa "
        "envolve angiogênese, formação de tecido de granulação e epitelização. "
        "D) A formação do tecido de granulação ocorre na fase proliferativa, não na maturacional. "
        "E) A contração e remodelação ocorrem na fase maturacional (não inflamatória), podendo durar até 1-2 anos."
    ),
    69: (
        "A alternativa A é correta porque o tumor desmoide (fibromatose agressiva) é um tumor localmente "
        "agressivo de partes moles, sem potencial metastático, que ocorre frequentemente na parede abdominal, "
        "associado a cicatrizes cirúrgicas, uso de estrogênio e gestação. 10-15% dos casos estão associados a "
        "polipose adenomatosa familiar (PAF), síndrome de Gardner ou síndrome de Turcot.\n\n"
        "B) É mais comum em mulheres jovens em idade reprodutiva, não em crianças ou idosos. "
        "C) A recidiva local é alta (até 40-60%), não extremamente incomum. "
        "D) O tratamento conservador com vigilância ativa é opção válida para tumores pequenos/assintomáticos — "
        "regressão espontânea pode ocorrer. "
        "E) Há associação estabelecida com estrogênio (anticoncepcional oral e gestação)."
    ),
    70: (
        "A alternativa D é correta porque a excisão total do mesorreto (TME) é o padrão-ouro no tratamento "
        "cirúrgico do câncer de reto. A dissecção deve ser realizada no plano avascular entre a fáscia própria "
        "do reto (mesorretal) e a fáscia pré-sacral, preservando a integridade da fáscia própria. A violação "
        "dessa fáscia aumenta significativamente a recorrência local.\n\n"
        "A) A artéria retal média é ramo da artéria ilíaca interna (hipogástrica), não da externa. "
        "B) A fáscia de Denonvilliers é a fáscia retovesical/retovaginal, não a pré-sacral. "
        "C) As artérias retais médias cursam pelos ligamentos laterais do reto, não pelas asas laterais. "
        "E) O cólon tem origem do intestino médio (ceco ao transverso) e do intestino posterior (descendente ao sigmoide)."
    ),
    71: (
        "A alternativa C é correta porque na classificação de Nyhus: Tipo I = hérnia indireta com anel interno "
        "normal; Tipo II = hérnia indireta com anel interno dilatado; Tipo IIIA = hérnia direta; Tipo IIIB = "
        "hérnia indireta com defeito da parede posterior; Tipo IIIC = hérnia femoral; Tipo IVA = hérnia "
        "recorrente direta; Tipo IVB = recorrente indireta; Tipo IVC = recorrente femoral.\n\n"
        "A) Hérnia femoral primária é tipo IIIC, não IVC. "
        "B) Hérnia direta primária é tipo IIIA. "
        "D) Recorrente indireta é tipo IVB. "
        "E) Hérnia direta com defeito da parede posterior é tipo IIIA."
    ),
    72: (
        "A alternativa E é correta porque pacientes estáveis com ferimentos penetrantes dentro da cardiac box "
        "(área delimitada pelas clavículas, apêndice xifoide e linhas mamilares) devem ser avaliados com FAST "
        "e/ou janela pericárdica subxifoidiana. Se positivo para hemopericárdio, indica-se toracotomia ou "
        "esternotomia mediana para reparo cardíaco definitivo.\n\n"
        "A) A \"Zona de Beck\" não é terminologia padrão do ATLS para indicação de toracotomia de emergência. "
        "B) Na \"cardiac box\" com suspeita de lesão cardíaca, o Rx de tórax isolado é insuficiente — FAST é mais informativo. "
        "C) Na lesão esofágica tardia (> 24h), a esofagostomia + drenagem + exclusão é preferível à esofagectomia. "
        "D) A câmara cardíaca mais comumente acometida em trauma penetrante é o ventrículo direito (por ser mais anterior)."
    ),
    73: (
        "A alternativa C é correta porque pacientes com icterícia obstrutiva apresentam deficiência de absorção "
        "de vitamina K (lipossolúvel — depende de bile para absorção intestinal). A vitamina K é cofator essencial "
        "para a síntese hepática dos fatores II, VII, IX e X, e sua deficiência prolonga o TAP/INR.\n\n"
        "A) Tumores hepáticos primários (hepatocarcinoma) têm fluxo preferencialmente arterial, não venoso. "
        "B) O fluxo hepatofugal ocorre na hipertensão portal avançada, mas não na maioria dos cirróticos. "
        "D) O fígado regenera rapidamente — recupera seu volume em 2-3 semanas, não 6 meses. "
        "E) Ressecções de até 70-80% do volume hepático podem ser realizadas com segurança, desde que o fígado "
        "remanescente seja saudável."
    ),
    74: (
        "A alternativa A é correta porque a presença de disfagia pré-operatória é o principal fator de risco "
        "para disfagia permanente após fundoplicatura de Nissen. Pacientes com disfagia prévia podem ter "
        "dismotilidade esofágica associada que se agrava com a válvula antirrefluxo, resultando em disfagia "
        "persistente pós-operatória.\n\n"
        "B) Regurgitação como sintoma principal não é fator de risco para disfagia pós-operatória. "
        "C) PHmetria com índice de sintomas positivo confirma DRGE, mas não prediz disfagia pós-cirúrgica. "
        "D) Hérnia paraesofágica não é fator de risco específico para disfagia permanente. "
        "E) Distúrbio motor inespecífico pode ser indicação de fundoplicatura parcial, mas não é o principal "
        "fator de risco para disfagia permanente."
    ),
    75: (
        "A alternativa C é correta porque os linfomas gástricos podem se apresentar como massa tumoral, "
        "úlcera ou espessamento difuso de pregas gástricas. O linfoma MALT (linfoma de tecido linfoide "
        "associado à mucosa) é o subtipo mais comum, frequentemente associado à infecção por H. pylori.\n\n"
        "A) O adenocarcinoma é a neoplasia gástrica mais frequente (90-95%), não o linfoma. "
        "B) Anorexia e perda de peso são sintomas comuns nos linfomas gástricos. "
        "D) Os linfomas gástricos frequentemente são doença localizada ao diagnóstico, diferente de outros linfomas. "
        "E) O tratamento de primeira linha do MALT localizado é a erradicação do H. pylori, não cirurgia."
    ),
}

count = 0
for q in data['questoes']:
    if q['numero'] in explicacoes:
        q['explicacao'] = explicacoes[q['numero']]
        count += 1

with open('medpassei/UFSC 2022.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'Updated {count} explanations (Q51-Q75)')
