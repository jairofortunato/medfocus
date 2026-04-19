import json

with open('medpassei/REVALIDA INEP 2022.json', encoding='utf-8') as f:
    data = json.load(f)

explicacoes = {
    76: (
        "A alternativa D é correta porque a reação anafilática ao óxido de etileno é uma complicação reconhecida da "
        "primeira sessão de hemodiálise. O óxido de etileno é utilizado na esterilização dos dialisadores e pode "
        "desencadear hipersensibilidade tipo I (mediada por IgE) em pacientes sensibilizados, manifestando-se com "
        "dispneia, hipotensão e eosinofilia logo após o início da sessão. A troca por dialisadores esterilizados "
        "por radiação gama ou vapor elimina o problema.\n\n"
        "A) Embolia gasosa pela punção é rara e se manifesta com colapso cardiovascular súbito e alteração neurológica, não com eosinofilia. "
        "B) Síndrome do desequilíbrio dialítico ocorre geralmente ao final da sessão ou após horas, com sintomas neurológicos (cefaleia, náusea, convulsão), não com eosinofilia. "
        "C) Rápida ultrafiltração causa hipotensão por hipovolemia, sem componente alérgico como eosinofilia ou dispneia broncoespástica."
    ),
    77: (
        "A alternativa C é correta porque homem jovem com aumento testicular indolor e progressivo, nódulo endurecido "
        "intratesticular ao exame físico, massa sólida ao USG e marcadores tumorais elevados (AFP e beta-HCG) apresenta "
        "quadro clássico de tumor de testículo (tumor de células germinativas não seminomatoso). A elevação simultânea "
        "de AFP e beta-HCG é altamente sugestiva de componente não seminomatoso. A conduta é orquiectomia radical "
        "inguinal para diagnóstico e tratamento.\n\n"
        "A) Torção de cordão espermático se apresenta com dor escrotal aguda e intensa, não com aumento indolor progressivo por 6 meses. "
        "B) Hérnia inguinal escrotal se reduz com manobra de Valsalva e não forma massa sólida intratesticular ao USG. "
        "D) Orquiepididimite se apresenta com dor, edema e sinais inflamatórios, sem massa sólida fixa nem elevação de marcadores tumorais."
    ),
    78: (
        "A alternativa B é correta porque o recém-nascido é filho de mãe com VDRL positivo sem tratamento adequado "
        "durante o pré-natal (sem pré-natal), porém apresenta exame físico normal, hemograma normal, líquor normal "
        "e radiografia de ossos longos normal. Nessa situação, segundo o Ministério da Saúde, trata-se de sífilis "
        "congênita com exames complementares normais, indicando-se penicilina G benzatina 50.000 UI/kg em dose "
        "única intramuscular.\n\n"
        "A) Apenas observação e sorologia em 1 mês é insuficiente, pois a mãe não foi tratada adequadamente e o RN deve ser tratado. "
        "C) Penicilina cristalina IV por 10 dias é indicada quando há alteração liquórica (neurossífilis) ou outras alterações nos exames. "
        "D) Penicilina procaína IM por 10 dias é indicada quando há alterações clínicas ou laboratoriais (exceto liquor), não quando todos os exames são normais."
    ),
    79: (
        "A alternativa D é correta porque em paciente alérgica à penicilina submetida a cesariana, a profilaxia "
        "antibiótica padrão com cefalosporinas (cefazolina) não pode ser utilizada devido ao risco de reação cruzada. "
        "A clindamicina 900 mg IV é a alternativa recomendada para profilaxia cirúrgica em cesarianas em pacientes "
        "com alergia a betalactâmicos, cobrindo adequadamente cocos gram-positivos e anaeróbios da flora genital.\n\n"
        "A) Evitar profilaxia expõe a paciente com múltiplas cesarianas prévias a risco elevado de infecção de sítio cirúrgico. "
        "B) Vancomicina 1g pode ser usada em situações específicas, mas não é a primeira escolha por seu espectro limitado contra anaeróbios e tempo de infusão prolongado. "
        "C) Ampicilina 2g é um betalactâmico e está contraindicada em paciente alérgica à penicilina pelo risco de reação cruzada."
    ),
    80: (
        "A alternativa A é correta porque a Política Nacional de Atenção Integral à Saúde das Pessoas Privadas de "
        "Liberdade (PNAISP) garante o acesso à saúde da população prisional por meio de ações pactuadas entre as "
        "esferas federal, estadual e municipal. A adesão é voluntária, e os serviços são organizados em parceria "
        "entre Secretarias de Saúde e de Administração Penitenciária, respeitando os princípios do SUS de "
        "universalidade, integralidade e equidade.\n\n"
        "B) A Estratégia Saúde da Família pode e deve desenvolver ações de saúde em unidades prisionais que façam parte de seu território. "
        "C) As equipes de saúde prisional devem incluir profissionais de saúde mental, conforme a política de atenção integral. "
        "D) A adesão à PNAISP é voluntária, não obrigatória, cabendo aos estados e municípios a decisão de aderir."
    ),
    81: (
        "A alternativa B é correta porque o paciente apresenta AVC isquêmico agudo (hemiparesia esquerda de início "
        "súbito) dentro da janela terapêutica de 4,5 horas, sendo elegível para trombólise intravenosa com alteplase "
        "(rtPA). A PA de 185x100 mmHg está no limite, mas pode ser tratada para atingir < 185/110 antes da infusão. "
        "A glicemia de 180 mg/dL não contraindica o trombolítico (contraindica-se apenas se < 50 mg/dL). A fibrilação "
        "atrial é a provável causa cardioembólica, mas o tratamento agudo é a trombólise.\n\n"
        "A) Cardioversão química da FA não é prioridade no AVC agudo; a FA será abordada após estabilização neurológica. "
        "C) Insulina IV em bolus não é indicada para glicemia de 180, que não é criticamente elevada nem contraindica a trombólise. "
        "D) Nitroprussiato para redução agressiva da PA não é recomendado no AVC agudo; a redução deve ser gradual e apenas se necessário para viabilizar a trombólise."
    ),
    82: (
        "A alternativa D é correta porque em paciente de 83 anos com múltiplas comorbidades graves (diabetes, "
        "cardiopatia severa, IAM prévio), o rastreamento de câncer de próstata não está indicado. As diretrizes "
        "recomendam não rastrear homens com expectativa de vida inferior a 10 anos, pois o rastreamento não "
        "trará benefício em termos de mortalidade e pode causar danos (biópsias, tratamentos desnecessários). "
        "A decisão compartilhada leva à não indicação neste caso.\n\n"
        "A) USG transretal não é método de rastreamento de câncer de próstata; é usado para guiar biópsia. "
        "B) Toque retal + PSA seria o rastreamento padrão, mas não é indicado neste paciente pela baixa expectativa de vida. "
        "C) PSA isolado também não está indicado, pelo mesmo motivo de expectativa de vida limitada."
    ),
    83: (
        "A alternativa B é correta porque, segundo o Código de Ética Médica e o Estatuto da Criança e do Adolescente, "
        "o sigilo médico do adolescente pode ser quebrado quando há situação de risco à vida ou à saúde. O uso de "
        "drogas por menor de idade configura situação de risco, autorizando o médico a comunicar aos responsáveis "
        "legais. Portanto, o médico não cometeu infração ética, pois a quebra de sigilo foi justificada pela "
        "necessidade de proteção do menor.\n\n"
        "A) Não configura infração, pois o sigilo pode ser legitimamente quebrado em situação de risco para menores. "
        "C) A justificativa não é porque a mãe já sabia, e sim porque o uso de drogas por menor é situação de risco que autoriza a quebra de sigilo. "
        "D) A autonomia do adolescente existe, mas é limitada em situações de risco à saúde, prevalecendo o princípio da proteção."
    ),
    84: (
        "A alternativa C é correta porque mulher com migrânea com aura tem contraindicação absoluta (categoria 4 da OMS) "
        "ao uso de contraceptivos hormonais combinados com estrogênio, devido ao risco aumentado de AVC isquêmico. "
        "Isso inclui ACO combinados, anel vaginal e injetáveis combinados. O DIU de cobre é método não hormonal, "
        "altamente eficaz, de longa duração, e não apresenta contraindicações relacionadas à enxaqueca com aura.\n\n"
        "A) ACO combinado + injetável combinado são ambos contraindicados pela presença de estrogênio na composição. "
        "B) Anel vaginal contém etinilestradiol e etonogestrel, sendo contraceptivo combinado contraindicado na migrânea com aura. "
        "D) Manter injetável combinado é inadequado pelo mesmo motivo: contém estrogênio e aumenta o risco cerebrovascular."
    ),
    85: (
        "A alternativa B é correta porque o conceito de valor em saúde (value-based healthcare) propõe que o sistema "
        "de saúde deve ser orientado para alcançar os melhores desfechos clínicos relevantes para o paciente com o "
        "custo mais adequado possível. Não se trata de cortar custos indiscriminadamente, mas de otimizar a relação "
        "entre resultado clínico e recursos empregados, promovendo eficiência e qualidade assistencial.\n\n"
        "A) O sistema suplementar complementa o SUS, mas isso não define o conceito de valor em saúde, que é uma abordagem assistencial. "
        "C) Postergar atendimento não tem relação com valor em saúde; ao contrário, pode piorar desfechos e aumentar custos. "
        "D) Restringir atendimento a pacientes graves contradiz o princípio de valor, que se aplica a toda a linha de cuidado."
    ),
    86: (
        "A alternativa C é correta porque a paciente apresenta quadro de poliartrite crônica após infecção aguda febril "
        "há 4 meses, com sorologia positiva para Chikungunya. A fase crônica da Chikungunya (sintomas articulares > 3 "
        "meses) pode cursar com artrite persistente incapacitante, e o tratamento preconizado é o metotrexato ou "
        "hidroxicloroquina, conforme as diretrizes do Ministério da Saúde para a fase crônica.\n\n"
        "A) CMV não causa poliartrite crônica com esse padrão, e paracetamol é tratamento apenas sintomático, inadequado para a fase crônica. "
        "B) Febre Mayaro pode causar artralgia, mas a sorologia positiva confirma Chikungunya, não Mayaro. "
        "D) Dengue não cursa com artrite crônica persistente; a artralgia da dengue é autolimitada na fase aguda."
    ),
    87: (
        "A alternativa A é correta porque o calázio é uma lesão granulomatosa crônica resultante da obstrução e "
        "inflamação crônica de uma glândula de Meibomius (glândula tarsal). Apresenta-se como nódulo indolor na "
        "face interna da pálpebra, após resolução de processo inflamatório agudo prévio (hordéolo). O tratamento "
        "pode ser conservador com compressas mornas ou excisão cirúrgica em casos persistentes.\n\n"
        "B) Hordéolo é a infecção aguda da glândula, com dor, hiperemia e edema; o caso descreve lesão crônica já sem sinais inflamatórios agudos. "
        "C) Canaliculite é infecção do canalículo lacrimal, com secreção e edema no canto medial do olho, não nódulo palpebral. "
        "D) Dacriocistite é infecção do saco lacrimal, com edema e dor infraorbitária medial, sem relação com nódulo tarsal."
    ),
    88: (
        "A alternativa D é correta porque o quadro de agitação, midríase, boca seca e rubor facial em criança após "
        "ingestão de medicamento da avó configura síndrome anticolinérgica clássica (quente, seco, vermelho, "
        "dilatado, agitado). A dexclorfeniramina é um anti-histamínico de primeira geração com potente efeito "
        "anticolinérgico, sendo a causa mais provável dentre as opções, pois é medicamento de uso comum em idosos "
        "para alergias.\n\n"
        "A) Dipirona causa hipotermia e hipotensão em intoxicação, sem efeitos anticolinérgicos. "
        "B) Salbutamol causa taquicardia e tremor, mas não midríase nem boca seca (não tem efeito anticolinérgico). "
        "C) Clorpromazina causa sedação, miose e hipotensão (efeito antidopaminérgico e alfa-bloqueador), oposto ao quadro descrito."
    ),
    89: (
        "A alternativa A é correta porque gestante com duas pré-eclâmpsia prévias, RCIU e diástole zero na artéria "
        "umbilical com 35 semanas de gestação apresenta comprometimento grave do fluxo uteroplacentário. A diástole "
        "zero indica resistência placentária muito elevada com risco iminente de sofrimento fetal. Com 35 semanas "
        "(feto viável), a conduta é a resolução da gestação por cesariana, pois a maturidade fetal já é adequada "
        "e manter a gestação expõe o feto a risco de óbito.\n\n"
        "B) Neuroproteção fetal com sulfato de magnésio é indicada antes de 32 semanas; com 35 semanas não há essa indicação. "
        "C) Perfil biofísico fetal a cada 3 dias pode postergar indevidamente a resolução em um feto já com comprometimento grave. "
        "D) Dopplervelocimetria semanal é conduta expectante excessivamente conservadora diante de diástole zero com 35 semanas."
    ),
    90: (
        "A alternativa D é correta porque, segundo as diretrizes de planejamento familiar do Ministério da Saúde, "
        "não é necessária a realização de colpocitologia oncótica (Papanicolaou) prévia para prescrição de "
        "anticoncepcionais hormonais orais combinados. O exame ginecológico e citopatológico são importantes "
        "para rastreamento de câncer cervical, mas não são pré-requisitos para início de contracepção hormonal.\n\n"
        "A) A avaliação global da saúde reprodutiva é atribuição de toda a equipe multiprofissional, não exclusiva de médicos e enfermeiros. "
        "B) Orientação sobre métodos de barreira é função compartilhada por toda a equipe de saúde, não específica da enfermagem. "
        "C) A esterilização cirúrgica pode ser realizada após 25 anos OU com pelo menos 2 filhos vivos, não exigindo ambos os critérios."
    ),
    91: (
        "A alternativa B é correta porque homem idoso com confusão, febre, tosse produtiva e consolidação lobar na "
        "radiografia apresenta pneumonia adquirida na comunidade. O escore CURB-65 elevado (confusão + ureia elevada "
        "provável + FR > 30 + PA baixa provável + idade > 65) indica pneumonia grave com necessidade de internação "
        "hospitalar, antibioticoterapia intravenosa e coleta de exames complementares (hemoculturas, gasometria, "
        "hemograma).\n\n"
        "A) Tratamento ambulatorial com ATB oral é inadequado para CURB-65 alto, pois há risco de mortalidade elevada. "
        "C) TC de abdome e sintomáticos não abordam a pneumonia nem a confusão, que é provavelmente secundária ao quadro infeccioso. "
        "D) TC de encéfalo e haloperidol tratam a confusão como causa neurológica primária, mas neste caso é delirium por pneumonia."
    ),
    92: (
        "A alternativa A é correta porque a massa irredutível e dolorosa localizada abaixo do ligamento inguinal e "
        "medial aos vasos femorais é a localização anatômica clássica da hérnia femoral (ou crural). A hérnia femoral "
        "emerge pelo canal femoral, medialmente à veia femoral, e apresenta alto risco de encarceramento e "
        "estrangulamento, sendo mais comum em mulheres. O quadro de vômitos e distensão confirma obstrução intestinal.\n\n"
        "B) Hérnia incisional ocorre em cicatrizes cirúrgicas prévias, e não há menção de cirurgia abdominal anterior. "
        "C) Hérnia inguinal direta protrai acima do ligamento inguinal pelo triângulo de Hesselbach, não abaixo do ligamento. "
        "D) Hérnia inguinal indireta também protrai acima do ligamento inguinal, pelo anel inguinal interno, não na posição descrita."
    ),
    93: (
        "A alternativa C é correta porque o quadro de rigidez muscular, espasmos, hipertermia e estado de consciência "
        "alterado em criança após ingestão de medicamento configura síndrome neuroléptica maligna, causada por "
        "antipsicóticos como o haloperidol. A tríade clássica inclui rigidez muscular intensa, hipertermia e "
        "instabilidade autonômica, podendo evoluir para rabdomiólise e insuficiência renal.\n\n"
        "A) Cardiopatia congênita cianótica não se apresenta com rigidez muscular, espasmos e hipertermia. "
        "B) Intoxicação por captopril causa hipotensão e hipercalemia, sem rigidez muscular ou hipertermia. "
        "D) Ingestão de benzodiazepínico causa sedação, hipotonia e depressão respiratória, oposto ao quadro de rigidez e hipertermia."
    ),
    94: (
        "A alternativa C é correta porque em gestante com candidíase vulvovaginal de repetição, os azólicos orais "
        "(fluconazol, itraconazol) são contraindicados na gravidez pelo risco teratogênico. O tratamento "
        "recomendado é tópico com miconazol creme vaginal por 10 a 14 dias para o episódio agudo, seguido de "
        "terapia de manutenção semanal com miconazol tópico para prevenir recorrências. Essa abordagem é segura "
        "na gestação e eficaz para reduzir recidivas.\n\n"
        "A) Fluconazol oral é contraindicado na gestação, especialmente no primeiro trimestre, pelo risco de malformações fetais. "
        "B) Itraconazol oral também é contraindicado na gestação; apenas tratamento tópico é permitido. "
        "D) Miconazol creme por apenas 7 dias pode ser insuficiente para candidíase recorrente; o protocolo recomenda 10-14 dias no episódio agudo."
    ),
    95: (
        "A alternativa A é correta porque a violência doméstica é agravo de notificação compulsória, conforme a Lei "
        "10.778/2003 e a Portaria do Ministério da Saúde. A notificação é obrigatória e deve ser feita pelo "
        "profissional de saúde que atende a vítima, independentemente de autorização da paciente. Além disso, o "
        "acompanhamento longitudinal pela Unidade de Saúde da Família garante seguimento integral com abordagem "
        "multidisciplinar e vínculo com a equipe.\n\n"
        "B) Encaminhamento para psiquiatria não é a conduta prioritária; a notificação é obrigatória e o acompanhamento deve ser na atenção primária. "
        "C) A denúncia ao canal 180 é direito da mulher, mas o dever do profissional de saúde é a notificação de agravo, não a denúncia policial. "
        "D) A denúncia ao 180 não substitui a notificação compulsória, e psiquiatria não é prioridade inicial."
    ),
    96: (
        "A alternativa B é correta porque mulher jovem com dor generalizada há mais de 3 meses, distúrbio do sono "
        "e 11 de 18 pontos dolorosos positivos ao exame físico, com exames laboratoriais normais e sem outras "
        "alterações, preenche os critérios diagnósticos de fibromialgia. A fibromialgia é caracterizada por dor "
        "musculoesquelética difusa crônica, fadiga, distúrbio do sono e pontos dolorosos específicos à digitopressão, "
        "sem alterações laboratoriais ou de imagem.\n\n"
        "A) Polimiosite apresenta fraqueza muscular proximal e elevação de enzimas musculares (CPK, aldolase), ausentes neste caso. "
        "C) Síndrome da fadiga crônica tem predomínio de fadiga incapacitante sobre a dor, e não tem pontos dolorosos como critério. "
        "D) Polimialgia reumática acomete idosos > 50 anos, com VHS e PCR elevados, e responde dramaticamente a corticoides."
    ),
    97: (
        "A alternativa B é correta porque o quadro de enfisema subcutâneo imediato e ausência de murmúrio vesicular "
        "à direita após punção de veia jugular indica pneumotórax iatrogênico. A conduta imediata é retirar o cateter "
        "da punção e comprimir o local para evitar embolia gasosa e mais entrada de ar. O pneumotórax por punção "
        "venosa central é complicação conhecida, e a estabilização inicial inclui cessar o procedimento e avaliar "
        "necessidade de drenagem torácica.\n\n"
        "A) USG diagnóstica pode confirmar o pneumotórax, mas não é a conduta imediata prioritária; primeiro deve-se cessar a causa. "
        "C) Soro glicosado 5% 500 ml não trata pneumotórax e não tem relação com a complicação descrita. "
        "D) Radiografia de tórax para controle é útil após estabilização, mas não é a conduta imediata diante de pneumotórax sintomático."
    ),
    98: (
        "A alternativa B é correta porque criança de 3 anos com edema, oligúria, proteinúria maciça (nefrótica) e "
        "hipoalbuminemia, com pressão arterial normal, apresenta síndrome nefrótica idiopática (doença de lesões "
        "mínimas, causa mais comum nessa faixa etária). O tratamento de primeira linha é corticoterapia com "
        "prednisona 2 mg/kg/dia por 4-6 semanas, com excelente resposta (> 90% dos casos de lesões mínimas "
        "respondem ao corticoide).\n\n"
        "A) Diurético pode ser usado como adjuvante para controle do edema severo, mas não é o tratamento principal da doença. "
        "C) Antibiótico não tem papel no tratamento da síndrome nefrótica, exceto se houver infecção associada (peritonite bacteriana espontânea). "
        "D) Anti-inflamatório não esteroidal não trata síndrome nefrótica e pode piorar a função renal."
    ),
    99: (
        "A alternativa A é correta porque o VDRL (Venereal Disease Research Laboratory) é o teste não treponêmico "
        "utilizado para monitoramento da resposta ao tratamento da sífilis. Após tratamento adequado, espera-se "
        "queda de pelo menos duas diluições (ex: de 1:16 para 1:4) em até 6 meses. O seguimento mensal com VDRL "
        "na gestante é fundamental para detectar reinfecção (aumento de títulos) ou falha terapêutica.\n\n"
        "B) TPHA é teste treponêmico que permanece positivo por toda a vida após infecção, não servindo para monitoramento terapêutico. "
        "C) FTA-ABS é teste treponêmico confirmatório que também permanece positivo indefinidamente, sem utilidade no seguimento. "
        "D) Penicilina procaína não é exame laboratorial; é opção terapêutica e não se aplica como método de seguimento."
    ),
    100: (
        "A alternativa A é correta porque a doença mão-pé-boca, causada pelo Coxsackievirus (enterovírus), é "
        "altamente contagiosa e o manejo inclui isolamento domiciliar por 7 dias (período de maior transmissão) "
        "e tratamento sintomático com analgésicos e antipiréticos. A doença é autolimitada, sem necessidade de "
        "antiviral específico, e a criança deve ser afastada da creche para evitar surtos.\n\n"
        "B) Notificação à vigilância epidemiológica não é obrigatória para casos isolados de doença mão-pé-boca, exceto em surtos. "
        "C) Penciclovir é antiviral tópico para herpes labial, sem indicação para doença mão-pé-boca causada por enterovírus. "
        "D) Internação com hidratação é desnecessária, pois o quadro é benigno e autolimitado na maioria dos casos."
    ),
}

questoes = data['questoes'] if isinstance(data, dict) else data

for q in questoes:
    num = q.get('numero')
    if num in explicacoes:
        q['explicacao'] = explicacoes[num]

with open('medpassei/REVALIDA INEP 2022.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Explicações escritas para questões 76-100 em medpassei/REVALIDA INEP 2022.json")
