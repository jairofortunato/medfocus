import json

with open('medpassei/REVALIDA INEP 2022.json', encoding='utf-8') as f:
    data = json.load(f)

explicacoes = {
    51: (
        "A alternativa B e correta porque o quadro clinico — homem idoso, tabagista pesado (40 macosano), "
        "tosse com expectoracao purulenta e hemoptoicos, emagrecimento e baqueteamento digital — e altamente "
        "sugestivo de neoplasia pulmonar. A radiografia mostrando massa com derrame pleural reforça o diagnostico. "
        "A pneumonia pos-obstrutiva ocorre quando o tumor obstrui um bronquio, causando infeccao distal com "
        "expectoracao purulenta. Esse conjunto — massa, derrame pleural e pneumonia pos-obstrutiva — e a triade "
        "classica da neoplasia broncogenica avancada.\n\n"
        "A) Silicose causa fibrose nodular bilateral, nao massa isolada; tuberculose e pneumotorax nao explicam o baqueteamento e a massa com derrame. "
        "C) TEP causa dor toracica subita e dispneia, nao massa pulmonar; neoplasia de cabeca e pescoco nao justifica a imagem toracica. "
        "D) Granulomatose eosinofilica acomete jovens e causa cistos pulmonares; IVAS e um diagnostico banal que nao explica o quadro consumptivo."
    ),
    52: (
        "A alternativa B e correta porque diante de derrame pleural confirmado por radiografia, a toracocentese "
        "diagnostica e o proximo passo obrigatorio. A analise do liquido pleural (bioquimica, citologia, "
        "bacteriologia) permite diferenciar transudato de exsudato e orientar a etiologia — infecciosa, "
        "neoplasica ou inflamatoria. Em homem jovem com tosse produtiva e dor pleuritica, a investigacao do "
        "liquido e prioritaria.\n\n"
        "A) A TC de torax pode ser util posteriormente, mas nao e o proximo passo — primeiro se analisa o liquido. "
        "C) A USG de torax auxilia na marcacao do ponto de puncao, mas nao substitui a toracocentese como conduta. "
        "D) Pesquisa de BAAR pode ser feita no liquido pleural apos a toracocentese, mas nao como exame isolado inicial."
    ),
    53: (
        "A alternativa D e correta porque a ausencia de cicatriz vacinal de BCG nao indica falha vacinal nem "
        "necessidade de revacinacao. Segundo o Ministerio da Saude, ate 10% dos vacinados com BCG nao "
        "desenvolvem cicatriz, sem que isso signifique falta de protecao imunologica. A conduta e orientar "
        "a mae de que a ausencia de cicatriz nao implica necessidade de revacinar, e a crianca esta protegida.\n\n"
        "A) A prova tuberculinica nao e indicada para avaliar resposta a BCG — ela detecta infeccao por M. tuberculosis, nao imunidade vacinal. "
        "B) Revacinar BCG nao e mais recomendado pelo PNI desde 2006, independentemente da presenca de cicatriz. "
        "C) Investigar imunodeficiencia pela ausencia isolada de cicatriz de BCG nao tem indicacao — seria necessario haver infeccoes de repeticao ou quadros sugestivos."
    ),
    54: (
        "A alternativa B e correta porque a gestante com antecedente de parto prematuro e colo curto (20 mm) "
        "no segundo trimestre tem alto risco de prematuridade. A progesterona micronizada vaginal 200 mg/noite "
        "e a conduta padrao recomendada pela FEBRASGO e pela FIGO para prevencao de parto prematuro espontaneo "
        "em pacientes com colo curto (< 25 mm). Essa medicacao reduz a contratilidade uterina e promove "
        "remodelamento cervical, diminuindo o risco de prematuridade em ate 45%.\n\n"
        "A) Cerclagem eletiva e indicada em insuficiencia cervical com historia de perdas no segundo trimestre, mas o parto anterior com 21 semanas pode nao configurar esse diagnostico isoladamente — a progesterona e a primeira linha. "
        "C) Acido folico e omega 3 nao tem evidencia para prevencao de parto prematuro em pacientes com colo curto. "
        "D) Cultura de estreptococo grupo B e realizada entre 35-37 semanas e nao tem relacao com prevencao de prematuridade."
    ),
    55: (
        "A alternativa D e correta porque o quadro — febre ha 5 dias, mialgia, cefaleia, dor retroorbitaria e "
        "prova do laco positiva — e classico de dengue. A prova do laco positiva indica fragilidade capilar, "
        "achado tipico da dengue. Em area indigena, a dengue e endemica no Brasil e deve ser a primeira hipotese. "
        "A conduta correta e hidratacao oral vigorosa e solicitacao de hemograma para avaliar hemoconcentracao "
        "e plaquetopenia, classificando o caso segundo os criterios de gravidade.\n\n"
        "A) COVID-19 nao cursa com prova do laco positiva; azitromicina e corticoide nao tem indicacao para COVID leve. "
        "B) Chikungunya causa artralgia intensa (principal diferencial), nao dor retroorbitaria; AINE e contraindicado na suspeita de dengue pelo risco de sangramento. "
        "C) Zika causa exantema e conjuntivite nao purulenta como manifestacoes principais, com febre baixa — nao explica a febre prolongada e prova do laco positiva."
    ),
    56: (
        "A alternativa A e correta porque o paciente apresenta quadro de pneumonia (dispneia, tosse, febre) "
        "com frequencia respiratoria elevada. A opacificacao de hemitorax esquerdo na radiografia corresponde "
        "a consolidacao parenquimatosa e/ou derrame pleural associado, achados compativeis com pneumonia "
        "extensa ou pneumonia complicada com derrame. A opacificacao homogenea de um hemitorax e o padrao "
        "radiologico esperado neste contexto clinico.\n\n"
        "B) Hipertransparencia sugere pneumotorax ou enfisema, nao pneumonia. "
        "C) Linha pleural visivel e sinal de pneumotorax, incompativel com consolidacao infecciosa. "
        "D) Linhas horizontais na periferia (linhas B de Kerley) sao tipicas de edema pulmonar intersticial/insuficiencia cardiaca, nao de pneumonia."
    ),
    57: (
        "A alternativa D e correta porque nas queimaduras eletricas a corrente percorre os tecidos internos "
        "(musculos, vasos, nervos) causando destruicao profunda que nao se reflete na extensao das lesoes "
        "cutaneas. A pele pode apresentar apenas pequenas lesoes de entrada e saida, enquanto internamente "
        "ha necrose muscular extensa, rabdomiolise e lesao de orgaos. Por isso, a avaliacao pela area de "
        "superficie corporal queimada subestima gravemente a lesao real.\n\n"
        "A) A perda de consciencia pode decorrer de tetanizacao da musculatura respiratoria, parada cardiaca ou trauma craniano associado — nao necessariamente arritmia isolada. "
        "B) As lesoes de entrada e saida nao definem com precisao o trajeto interno da corrente, pois ela segue os tecidos de menor resistencia. "
        "C) As lesoes cutaneas nao definem a profundidade da queimadura eletrica — a destruicao interna e desproporcionalmente maior."
    ),
    58: (
        "A alternativa B e correta porque no teste de oximetria neonatal (teste do coracaozinho), quando a "
        "diferenca entre a oximetria pre-ductal e pos-ductal e maior que 3%, o resultado e considerado "
        "alterado. Porem, o protocolo determina que o exame deve ser repetido em 1 hora antes de prosseguir "
        "com investigacao. Somente se o resultado se mantiver alterado na repeticao e que se indica o "
        "ecocardiograma. Isso evita falsos positivos por instabilidade transitoria.\n\n"
        "A) Alta hospitalar com resultado alterado e inadequada — ha suspeita de cardiopatia congenita que precisa ser esclarecida. "
        "C) O ecocardiograma so e indicado apos confirmacao da alteracao na repeticao do exame em 1 hora. "
        "D) O ECG nao e o exame de escolha para investigacao de cardiopatia congenita neonatal — o ecocardiograma e o padrao-ouro."
    ),
    59: (
        "A alternativa D e correta porque na sindrome dos ovarios policisticos (SOP) ha aumento tonico da "
        "secrecao de LH pela hipofise, com FSH normal ou baixo, resultando em relacao LH/FSH elevada "
        "(tipicamente > 2,5). Esse desequilibrio favorece a producao androgênica ovariana e a anovulacao "
        "cronica. O LH elevado e um dos achados hormonais mais caracteristicos da SOP, embora nao seja "
        "criterio diagnostico obrigatorio.\n\n"
        "A) Na SOP a insulinemia esta elevada (resistencia insulinica), nao baixa — a hiperinsulinemia contribui para a hiperandrogenismo. "
        "B) A dopamina hipotalamica esta normal na SOP; dopamina aumentada inibiria a prolactina, o que nao e caracteristico. "
        "C) O S-DHEA e um marcador de androgenio adrenal e nao e padrao-ouro para SOP — o diagnostico segue os criterios de Rotterdam."
    ),
    60: (
        "A alternativa D e correta porque, segundo os criterios do Ministerio da Saude para classificacao de "
        "pre-natal de alto risco, o uso de drogas licitas (tabagismo) e a obesidade (IMC >= 30) sao condicoes "
        "clinicas previas que classificam a gestante como alto risco. A idade de 36 anos nao e criterio de "
        "alto risco (o corte e >= 35 anos apenas quando associado a outros fatores ou >= 40 isoladamente, "
        "dependendo do protocolo). A resposta enfatiza que sao as drogas licitas e o IMC elevado que determinam "
        "o alto risco.\n\n"
        "A) Cirurgia uterina previa e fator de risco, mas IMC 33 (nao 19) e o valor correto; alem disso, a idade isolada nao e criterio principal. "
        "B) IMC 19 e normal, nao configura risco; nao aceitacao da gravidez e fator psicossocial, nao clinico. "
        "C) Cirurgia uterina e relevante, mas situacao conjugal instavel isoladamente nao e criterio de alto risco clinico."
    ),
    61: (
        "A alternativa C e correta porque a fluoxetina (ISRS) e o antidepressivo de primeira escolha na "
        "bulimia nervosa com depressao comorbida. A fluoxetina tem evidencia robusta para reducao dos episodios "
        "de compulsao alimentar e purgacao, alem do efeito antidepressivo. A dose recomendada na bulimia "
        "(60 mg/dia) e superior a dose usual para depressao. E o unico antidepressivo aprovado pelo FDA "
        "especificamente para bulimia nervosa.\n\n"
        "A) Citalopram e um ISRS eficaz para depressao, mas nao tem a mesma evidencia da fluoxetina especificamente para bulimia. "
        "B) Venlafaxina (IRSN) nao e primeira linha para bulimia e tem mais efeitos colaterais. "
        "D) Topiramato e um antiepileptico usado off-label para compulsao alimentar, mas nao e antidepressivo e nao trata a depressao."
    ),
    62: (
        "A alternativa B e correta porque em paciente vitima de acidente automobilistico, hemodinamicamente "
        "estavel, com suspeita de fratura toracolombar, o exame de imagem inicial e a radiografia simples "
        "da coluna (AP e perfil). A radiografia e rapida, acessivel e permite identificar fraturas, "
        "desalinhamentos e alteracoes grosseiras. Exames mais complexos (TC, RM) sao solicitados conforme "
        "os achados da radiografia.\n\n"
        "A) A mielografia e um exame invasivo e ultrapassado, reservado para situacoes muito especificas — nao e exame inicial. "
        "C) A RM e excelente para avaliar lesao medular e de partes moles, mas nao e o exame inicial no trauma — e solicitada apos a radiografia. "
        "D) A TC pode ser necessaria para detalhamento, mas a radiografia simples e o primeiro exame por ser mais acessivel e rapida."
    ),
    63: (
        "A alternativa A e correta porque o recem-nascido prematuro tardio (36 semanas), filho de mae diabetica, "
        "com ictericia zona III de Kramer e bilirrubina de 18 mg/dL tem indicacao de fototerapia. Filhos de "
        "maes diabeticas tem maior risco de hiperbilirrubinemia por policitemia e hemolise. Com bilirrubina "
        "de 18 mg/dL em prematuro, o nivel ultrapassa o limiar para fototerapia nos nomogramas de Bhutani, "
        "exigindo tratamento imediato para prevenir encefalopatia bilirrubinica.\n\n"
        "B) Observacao e inadequada — bilirrubina de 18 mg/dL em prematuro ja ultrapassou o nivel de intervencao. "
        "C) Hidratacao venosa isolada nao reduz bilirrubina de forma eficaz — a fototerapia e o tratamento padrao. "
        "D) Exsanguineotransfusao e reservada para niveis muito mais elevados (geralmente > 25 mg/dL) ou falha da fototerapia — nao e a primeira medida."
    ),
    64: (
        "A alternativa B e correta porque morte materna indireta e aquela decorrente de doenca preexistente "
        "ou que se desenvolveu durante a gestacao, nao devida a causas obstetricas diretas, mas agravada "
        "pelos efeitos fisiologicos da gravidez. COVID-19 e uma doenca infecciosa que, embora nao seja causa "
        "obstetrica direta, foi agravada pelo estado gravídico-puerperal (pos-cesarea, imunossupressao "
        "fisiologica). Portanto, classifica-se como morte materna indireta.\n\n"
        "A) Morte materna direta decorre de complicacoes obstetricas propriamente ditas (hemorragia, eclampsia, infeccao puerperal), nao de COVID-19. "
        "C) Morte materna suspeita e usada quando a causa nao esta esclarecida e necessita investigacao — aqui a causa e conhecida. "
        "D) Morte nao obstetrica ocorre por causas acidentais ou incidentais sem relacao com a gravidez — COVID-19 na puerpera tem agravamento pelo ciclo gravidico-puerperal."
    ),
    65: (
        "A alternativa C e correta porque a presenca de IgG positivo com IgM negativo e avidez alta indica "
        "infeccao pregressa por Toxoplasma gondii, ocorrida ha mais de 3-4 meses. A alta avidez confirma que "
        "os anticorpos IgG sao maduros, excluindo infeccao recente. A gestante esta imune e nao ha risco de "
        "transmissao vertical. A conduta e tranquilizar a mae e nao ha necessidade de tratamento ou "
        "medidas preventivas adicionais.\n\n"
        "A) Nao se trata de falso-positivo — IgG positivo com alta avidez confirma infeccao real e antiga. "
        "B) Toxoplasmose aguda cursaria com IgM positivo e/ou avidez baixa — nao e o caso. "
        "D) Gestante suscetivel teria IgG e IgM ambos negativos — aqui ha imunidade comprovada."
    ),
    66: (
        "A alternativa C e correta porque a intoxicacao por benzodiazepinicos (clonazepam) cursa com rebaixamento "
        "do nivel de consciencia, depressao respiratoria e hipotonia. O tratamento consiste em medidas de "
        "suporte (via aerea pervia, ventilacao, monitorizacao) e administracao de flumazenil, que e o "
        "antagonista especifico dos receptores benzodiazepinicas GABA-A. O flumazenil reverte a sedacao e "
        "a depressao respiratoria causadas por benzodiazepinicos.\n\n"
        "A) Observacao apenas e insuficiente — clonazepam tem meia-vida longa (18-50h), nao curta, e o paciente pode descompensar. "
        "B) Naloxona e antagonista opioide, sem efeito em intoxicacao por benzodiazepinicos; esvaziamento gastrico tardio tem pouco beneficio. "
        "D) Metadona e agonista opioide e agravaria a depressao do SNC; lavagem gastrica isolada nao e a conduta principal."
    ),
    67: (
        "A alternativa C e correta porque o quadro — dor abdominal em colica, distensao, parada de eliminacao "
        "de gases e fezes, historia de cirurgia previa por cancer de sigmoide e radiografia mostrando distensao "
        "colonica — e classico de obstrucao intestinal baixa. A presenca de distensao colonica sem distensao "
        "de delgado indica valvula ileocecal competente, que impede o refluxo do conteudo colonico para o "
        "intestino delgado, aumentando o risco de perfuracao cecal.\n\n"
        "A) Distensao de delgado e colon sugeriria valvula ileocecal incompetente, o que nao e o padrao descrito. "
        "B) Pneumoperitonio indicaria perfuracao de viscera oca (abdome agudo perfurativo), nao obstrucao simples. "
        "D) Constipacao simples nao causa distensao colonica importante nem parada completa de eliminacao de gases."
    ),
    68: (
        "A alternativa A e correta porque a ultrassonografia abdominal e o melhor exame de imagem para "
        "diagnostico de estenose hipertrofica do piloro. O quadro classico — lactente de 40 dias com vomitos "
        "em jato nao biliosos apos mamadas e oliva pilorica palpavel — e altamente sugestivo. A USG confirma "
        "o diagnostico ao demonstrar espessamento do musculo pilorico (> 3 mm de espessura e > 15 mm de "
        "comprimento). E um exame nao invasivo, sem radiacao e com alta sensibilidade e especificidade.\n\n"
        "B) A RM nao e indicada como exame inicial para estenose pilorica — e cara, demorada e desnecessaria. "
        "C) A radiografia panoramica pode mostrar distensao gastrica, mas nao e o exame de escolha para confirmar o diagnostico. "
        "D) A TC envolve radiacao ionizante e nao e necessaria quando a USG tem alta acuracia diagnostica."
    ),
    69: (
        "A alternativa D e correta porque, segundo o Codigo de Etica Medica e as resolucoes do CFM sobre "
        "telemedicina e comunicacao digital, grupos de mensagens para discussao clinica devem ser compostos "
        "exclusivamente por medicos e as informacoes dos pacientes devem ser tratadas como sigilosas e "
        "confidenciais. E vedada a identificacao do paciente em grupos que incluam nao medicos, e mesmo "
        "entre medicos o sigilo deve ser preservado.\n\n"
        "A) Grupos de medicos para discussao clinica sao permitidos pela etica medica, desde que sigam regras de sigilo. "
        "B) A identificacao do paciente nao e permitida mesmo com concordancia dos profissionais — o sigilo e um dever etico inviolavel. "
        "C) A responsabilidade pelas informacoes compartilhadas e de cada membro individualmente, nao apenas do administrador do grupo."
    ),
    70: (
        "A alternativa B e correta porque, segundo as diretrizes do Ministerio da Saude do Brasil, o "
        "rastreamento de cancer de colo uterino por citologia oncotica (Papanicolaou) e indicado para "
        "mulheres de 25 a 64 anos. Quando o primeiro exame e normal, deve ser repetido em 1 ano. Se dois "
        "exames consecutivos anuais forem normais, o intervalo passa a ser trienal (a cada 3 anos). "
        "Portanto, para o primeiro resultado normal, a conduta e repetir em 1 ano.\n\n"
        "A) A faixa de 15-35 anos esta incorreta e colposcopia nao e indicada para resultado normal. "
        "C) Repetir em 3 anos so se aplica apos dois exames anuais consecutivos normais, nao no primeiro resultado. "
        "D) A faixa de 15-35 anos esta errada e nao ha indicacao de tratamento para citologia normal."
    ),
    71: (
        "A alternativa D e correta porque paciente com neoplasia maligna de mama em quimioterapia que "
        "desenvolve edema, proteinuria macica (8 g/24h) e hipoalbuminemia apresenta sindrome nefrotica. "
        "A nefropatia membranosa e a causa mais comum de sindrome nefrotica paraneoplasica em tumores solidos, "
        "especialmente mama e pulmao. O deposito de imunocomplexos na membrana basal glomerular leva a "
        "proteinuria macica, sendo uma manifestacao paraneoplasica classica.\n\n"
        "A) Disfuncao hepatica por metastases causaria ascite e ictericia, nao proteinuria macica isolada. "
        "B) Angioedema por quimioterapia causa edema localizado (face, labios), nao proteinuria e hipoalbuminemia. "
        "C) Cardiotoxicidade/IC causaria edema com congestao pulmonar e jugular ingurgitada, sem proteinuria significativa."
    ),
    72: (
        "A alternativa C e correta porque cistos mamarios simples sao lesoes benignas muito frequentes, "
        "classificadas como BI-RADS 2 na ultrassonografia. Um cisto simples de 3 cm em mulher de 32 anos "
        "assintomatica nao requer intervencao — apenas controle clinico e imaginologico periodico. Cistos "
        "simples nao tem potencial de malignizacao e a conduta conservadora e segura.\n\n"
        "A) Supressao hormonal nao e indicada para cistos simples — nao ha evidencia de beneficio. "
        "B) Cirurgia e absolutamente desnecessaria para cisto simples assintomatico — seria intervencionismo excessivo. "
        "D) PAAF (puncao aspirativa) e indicada para cistos complicados, sintomaticos ou com conteudo solido, nao para cistos simples assintomaticos."
    ),
    73: (
        "A alternativa A e correta porque lactentes com sindrome de Down frequentemente apresentam hipotonia "
        "e dificuldade de succao, mas o aleitamento materno deve ser estimulado. A conduta correta e "
        "oferecer o seio materno (para manter o estimulo e o vinculo), complementar com leite ordenhado "
        "ou formula quando necessario, e realizar ordenha a cada 3 horas para manter a producao lactea. "
        "A oferta de formula a noite garante aporte calorico adequado durante o periodo de maior intervalo.\n\n"
        "B) Estimulacao perioral e valida, porem formula exclusiva priva o bebe dos beneficios do leite materno e nao deve ser a primeira opcao. "
        "C) Evitar o seio e incorreto — mesmo com dificuldade de succao, o contato com a mama e terapeutico e deve ser mantido. "
        "D) Contraindicar amamentacao em sindrome de Down nao tem fundamento — nao ha contraindicacao ao aleitamento materno."
    ),
    74: (
        "A alternativa D e correta porque pre-eclampsia com sinais de gravidade e definida, entre outros "
        "criterios, por pressao arterial >= 160x110 mmHg mantida apos medidas repetidas (intervalo de 4 horas). "
        "A PA de 150x110 mmHg sustentada por 4 horas atende ao criterio de PAS >= 150 persistente associada "
        "a PAD >= 110, configurando pre-eclampsia grave. Esse criterio pressórico e o mais utilizado para "
        "definir gravidade e indicar sulfato de magnesio e antecipacao do parto.\n\n"
        "A) Proteinuria >= 5 g/24h nao e mais criterio de gravidade nas diretrizes atuais (ACOG 2013/FEBRASGO) — a magnitude da proteinuria nao define gravidade. "
        "B) Creatinina de 0,9 mg/dL esta dentro da normalidade para gestante — nao indica comprometimento renal. "
        "C) LDH de 490 U/L esta discretamente elevada, mas nao atinge o limiar de gravidade (> 600 U/L sugere hemolise na sindrome HELLP)."
    ),
    75: (
        "A alternativa A e correta porque a abordagem mais adequada para enfrentar o alcoolismo em "
        "populacao indigena e a roda de conversa com participacao de lideres locais. Essa estrategia "
        "respeita a organizacao social e cultural da comunidade, promove o protagonismo indigena e facilita "
        "a adesao da populacao masculina. A participacao dos lideres confere legitimidade a acao e permite "
        "construir solucoes culturalmente sensiveis e contextualizadas.\n\n"
        "B) Palestra expositiva no polo base e uma abordagem verticalizada e passiva, que nao promove dialogo nem respeita a dinamica cultural indigena. "
        "C) Reuniao de planejamento interna exclui a comunidade do processo decisorio, contrariando os principios da atencao diferenciada a saude indigena. "
        "D) Encaminhamento para internacao como primeira medida e inadequado — medicaliza o problema sem abordar os determinantes socioculturais do alcoolismo na comunidade."
    ),
}

for q in data.get('questoes', data if isinstance(data, list) else []):
    num = q.get('numero', q.get('number'))
    if num in explicacoes:
        q['explicacao'] = explicacoes[num]

with open('medpassei/REVALIDA INEP 2022.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Explicacoes escritas para questoes 51-75 ({len(explicacoes)} questoes).")
