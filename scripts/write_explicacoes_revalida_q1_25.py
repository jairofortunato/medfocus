import json

with open('medpassei/REVALIDA INEP 2022.json', encoding='utf-8') as f:
    data = json.load(f)

explicacoes = {
    1: (
        "A alternativa C é correta porque o paciente apresenta bloqueio atrioventricular total (BAVT) sintomático, "
        "evidenciado pela síncope, bradicardia de 42 bpm e ondas A em canhão no pulso jugular (dissociação atrioventricular). "
        "O BAVT com instabilidade hemodinâmica ou sintomas como síncope tem indicação formal de implante de marca-passo "
        "definitivo, que é o tratamento definitivo para restabelecer a frequência cardíaca adequada.\n\n"
        "A) Cardioversão elétrica é indicada para taquiarritmias instáveis, não para bradicardia. "
        "B) Ablação de via anômala é o tratamento para síndromes de pré-excitação como Wolff-Parkinson-White, não para BAVT. "
        "D) Isolamento elétrico das veias pulmonares é o tratamento para fibrilação atrial, sem relação com o BAVT."
    ),
    2: (
        "A alternativa A é correta porque em homem idoso, tabagista, com hematúria macroscópica, sintomas irritativos "
        "vesicais recorrentes e espessamento irregular da parede vesical na TC, a principal hipótese é carcinoma invasor "
        "de bexiga. A uretrocistoscopia é o exame padrão-ouro para visualização direta da lesão vesical e biópsia, "
        "permitindo diagnóstico histológico e estadiamento inicial.\n\n"
        "B) A urografia excretora avalia o trato urinário superior, e o carcinoma de células renais não explica o espessamento vesical. "
        "C) Cálculo coraliforme se apresenta em rim, não na bexiga, e a RM não seria o exame inicial. "
        "D) O quadro clínico e de imagem aponta para lesão vesical, não prostática; a USG transretal com biópsia é para próstata."
    ),
    3: (
        "A alternativa B é correta porque, segundo o Ministério da Saúde, aos 6 meses de idade a introdução alimentar "
        "deve começar com frutas in natura oferecidas raspadas, amassadas ou picadas, respeitando a consistência adequada "
        "para a idade e estimulando a mastigação. As frutas devem ser oferecidas na forma natural, sem adição de açúcar, "
        "e não na forma de sucos.\n\n"
        "A) Carne triturada e peneirada tem consistência inadequada; o correto é oferecer carne desfiada ou em pedaços pequenos na papa salgada. "
        "C) Sucos não são recomendados no primeiro ano de vida segundo as diretrizes atuais do Ministério da Saúde. "
        "D) A introdução do ovo inteiro (clara e gema) pode ser feita simultaneamente a partir dos 6 meses, sem necessidade de separar."
    ),
    4: (
        "A alternativa D é correta porque em puérpera com sangramento vaginal abundante no pós-parto imediato, a "
        "primeira conduta deve ser identificar a causa da hemorragia. A retenção de restos placentários é causa frequente "
        "de hemorragia pós-parto (atonia por subinvolução). O exame da placenta para verificar integridade e a curetagem "
        "uterina em caso de escavações (cotilédones faltantes) é a conduta prioritária.\n\n"
        "A) Misoprostol retal é indicado para atonia uterina refratária à ocitocina, mas a causa deve ser identificada antes. "
        "B) Laparotomia com histerectomia é medida extrema reservada para hemorragias refratárias a todas as medidas conservadoras. "
        "C) Conduta expectante é inadequada diante de sangramento abundante no pós-parto imediato, que exige intervenção ativa."
    ),
    5: (
        "A alternativa D é correta porque a paciente apresenta transtorno depressivo com tentativa de suicídio, "
        "configurando sofrimento psíquico grave que ultrapassa a capacidade resolutiva da UBS. O CAPS (Centro de "
        "Atenção Psicossocial) é o serviço de referência na Rede de Atenção Psicossocial para acompanhamento intensivo "
        "de casos graves, incluindo risco de suicídio, oferecendo atendimento multidisciplinar.\n\n"
        "A) Manter apenas na UBS é insuficiente para um caso com tentativa de suicídio que já falhou no tratamento inicial. "
        "B) A internação em hospital psiquiátrico vai contra a lógica da Reforma Psiquiátrica; deve ser último recurso. "
        "C) A internação em hospital geral é indicada para casos de emergência clínica, não para acompanhamento longitudinal."
    ),
    6: (
        "A alternativa A é correta porque a paciente tem DRC estágio 3b com proteinúria, e o bloqueio do sistema "
        "renina-angiotensina-aldosterona com IECA ou BRA é a principal estratégia para reduzir a proteinúria e retardar "
        "a progressão da doença renal crônica. A nefroproteção conferida por essas drogas é independente do efeito "
        "anti-hipertensivo e está bem estabelecida nas diretrizes.\n\n"
        "B) Trocar HCTZ por diurético de alça pode ser necessário em DRC avançada, mas não aborda a proteinúria. "
        "C) Espironolactona tem risco de hipercalemia na DRC e carvedilol não é primeira linha para nefroproteção. "
        "D) Manter sem alterações ignora a proteinúria, que é fator de progressão da DRC e exige intervenção."
    ),
    7: (
        "A alternativa B é correta porque diverticulite complicada com abscesso de 4 cm (> 3 cm) requer antibioticoterapia "
        "venosa associada à drenagem percutânea guiada por imagem. A drenagem do abscesso é essencial para controle do "
        "foco infeccioso, e a antibioticoterapia isolada é insuficiente para abscessos dessa dimensão. Essa é a classificação "
        "Hinchey Ib/II.\n\n"
        "A) ATB venosa exclusiva é adequada para abscessos menores que 3 cm ou fleimão, não para abscessos de 4 cm. "
        "C) Alta com ATB oral é conduta para diverticulite não complicada, sem abscesso. "
        "D) Laparotomia com cirurgia de Hartmann é reservada para peritonite generalizada ou perfuração livre (Hinchey III/IV)."
    ),
    8: (
        "A alternativa B é correta porque o adolescente apresenta velocidade de crescimento de 5 cm/ano (2,5 cm em 6 meses), "
        "que é normal para o período pré-puberal, idade óssea compatível com a cronológica e pais com estatura baixa. "
        "Esse padrão caracteriza baixa estatura familiar, onde o potencial genético determina a estatura final e a velocidade "
        "de crescimento é normal.\n\n"
        "A) Na puberdade atrasada (retardo constitucional), a idade óssea estaria atrasada em relação à cronológica. "
        "C) A velocidade de crescimento de 5 cm/ano é normal para a fase pré-puberal, não está reduzida. "
        "D) Idade óssea igual à cronológica afasta distúrbio constitucional do crescimento, que cursa com atraso da idade óssea."
    ),
    9: (
        "A alternativa D é correta porque mulher jovem com sangramento uterino aumentado, abortamentos de repetição e "
        "espessamento endometrial na USG sugere pólipo endometrial. Os pólipos endometriais causam sangramento uterino "
        "anormal e podem interferir na implantação embrionária, levando a abortamentos. A histeroscopia é o método "
        "diagnóstico e terapêutico padrão-ouro para lesões intracavitárias.\n\n"
        "A) Patologia cervical com colposcopia não explica o espessamento endometrial nem os abortamentos. "
        "B) Gestação ectópica não se apresenta com sangramento menstrual aumentado crônico e espessamento endometrial. "
        "C) Miomas geralmente são intramurais ou subserosos; a laparoscopia não avalia a cavidade uterina como a histeroscopia."
    ),
    10: (
        "A alternativa C é correta porque a paciente está em tratamento com sertralina 50 mg há 10 semanas (tempo "
        "adequado para avaliar resposta), mas mantém sintomas ansiosos. A conduta apropriada é associar psicoterapia "
        "estruturada (como terapia cognitivo-comportamental, que tem evidência robusta para ansiedade) e reavaliar a "
        "dose ou a medicação, considerando que 50 mg pode ser subdose para ansiedade.\n\n"
        "A) Prescrever benzodiazepínico e encaminhar à emergência é conduta desproporcional para ansiedade sem crise aguda. "
        "B) Manter mesma dose e apenas monitorar é insuficiente, pois já se passaram 10 semanas sem resposta adequada. "
        "D) Trocar para fluoxetina + clonazepam + clorpromazina é polifarmácia excessiva e desnecessária nesse momento."
    ),
    11: (
        "A alternativa D é correta porque o quadro de lesões cutâneas em alvo (target lesions) com acometimento mucoso "
        "oral surgindo poucos dias após introdução de medicamento é clássico de farmacodermia, especificamente eritema "
        "multiforme ou síndrome de Stevens-Johnson. A relação temporal com o fármaco e a morfologia das lesões em alvo "
        "são características definidoras.\n\n"
        "A) Pênfigo vulgar apresenta bolhas flácidas e sinal de Nikolsky, sem relação com uso de medicamento recente. "
        "B) Lúpus cutâneo apresenta lesões fotossensíveis e não surge agudamente após uso de medicação. "
        "C) A síndrome da pele escaldada estafilocócica (SSSS) é mais comum em crianças e não apresenta lesões em alvo."
    ),
    12: (
        "A alternativa D é correta porque o paciente apresenta dor em cólica no hipocôndrio direito, cálculos na vesícula "
        "biliar, exames laboratoriais normais e via biliar principal de calibre normal. Esse quadro é de colelitíase "
        "sintomática, e o tratamento padrão é a colecistectomia videolaparoscópica, que é o procedimento de escolha por "
        "ser minimamente invasivo e eficaz.\n\n"
        "A) Coledocolitíase requer dilatação da via biliar ou alteração de enzimas canaliculares, ausentes neste caso. "
        "B) Colecistite aguda apresentaria sinais inflamatórios como febre, leucocitose e sinal de Murphy positivo. "
        "C) Pólipo vesicular não se apresenta como cálculos na USG, e a colangio-RM seria para investigar via biliar."
    ),
    13: (
        "A alternativa C é correta porque lactente de 6 meses com quadro viral de vias aéreas superiores (coriza, tosse, "
        "febre) que evolui com sibilância e desconforto respiratório, com estertores e sibilos bilaterais, apresenta "
        "bronquiolite viral aguda. O tratamento é de suporte com monitorização, hidratação e oxigenioterapia se necessário, "
        "sem evidência de benefício de broncodilatadores ou corticoides.\n\n"
        "A) Resfriado comum não cursa com sibilância e desconforto respiratório; broncodilatador não é indicado. "
        "B) Pneumonia bacteriana apresentaria consolidação focal, e ATB não é indicado na bronquiolite viral. "
        "D) Asma raramente é diagnosticada antes dos 2 anos; beta-agonista e corticoide não têm benefício na bronquiolite."
    ),
    14: (
        "A alternativa C é correta porque a dispareunia pode ter múltiplas etiologias, e a falta de lubrificação vaginal "
        "causada por contraceptivos hormonais (especialmente progestágenos isolados e alguns combinados) é uma causa "
        "frequente e bem documentada. Os contraceptivos hormonais podem reduzir a lubrificação por diminuição do "
        "estrogênio local, levando a dispareunia de penetração.\n\n"
        "A) A dispareunia pode ter causas psicossociais como ansiedade, conflitos de relacionamento e história de abuso. "
        "B) A endometriose é causa clássica de dispareunia profunda, sendo importante diagnóstico diferencial. "
        "D) A dispareunia de penetração pode ter causas não infecciosas como vaginismo, atrofia e lubrificação insuficiente."
    ),
    15: (
        "A alternativa D é correta porque a educação em saúde baseada na perspectiva freireana e nas diretrizes do SUS "
        "valoriza o diálogo e a escuta ativa. A roda de conversa que acolhe tanto percepções positivas quanto negativas "
        "sobre a vacina permite a troca de saberes, respeita a autonomia dos participantes e favorece a construção "
        "coletiva do conhecimento, promovendo adesão genuína à vacinação.\n\n"
        "A) Palestra para convencer é modelo bancário e autoritário, que não respeita o saber popular. "
        "B) Acolher apenas percepções positivas ignora as dúvidas legítimas da população, impedindo o diálogo verdadeiro. "
        "C) Palestra com números adota abordagem tecnicista que não promove participação ativa nem diálogo."
    ),
    16: (
        "A alternativa B é correta porque o genfibrozila é o fibrato com maior risco de interação farmacocinética "
        "com as estatinas. Ele inibe a glucuronidação das estatinas, aumentando seus níveis plasmáticos e o risco de "
        "miopatia e rabdomiólise. O paciente em uso de rosuvastatina que desenvolveu mialgia, fraqueza e elevação de CPK "
        "provavelmente iniciou genfibrozila, precipitando a toxicidade muscular.\n\n"
        "A) Ezetimibe tem perfil de segurança favorável e raramente causa miopatia quando associado a estatinas. "
        "C) Ácido nicotínico pode aumentar discretamente o risco de miopatia, mas muito menos que o genfibrozila. "
        "D) Ômega 3 não tem interação significativa com estatinas e não causa miotoxicidade."
    ),
    17: (
        "A alternativa B é correta porque o paciente apresenta abscesso perianal, caracterizado por dor perianal há "
        "5 dias, febre e massa flutuante. O tratamento do abscesso perianal é cirúrgico com drenagem imediata sob "
        "anestesia, independentemente do uso de antibióticos. A drenagem é curativa e não deve ser postergada, pois "
        "a antibioticoterapia isolada não resolve a coleção purulenta.\n\n"
        "A) ATB venosa isolada é insuficiente para tratar abscesso já formado e flutuante. "
        "C) Termoterapia e observação retardam o tratamento definitivo e aumentam o risco de complicações como fístula. "
        "D) TC de pelve é desnecessária quando o exame físico já demonstra abscesso flutuante e o diagnóstico é clínico."
    ),
    18: (
        "A alternativa D é correta porque a asma materna é fator de risco reconhecido para a síndrome do desconforto "
        "respiratório (SDR) neonatal, pois está associada a atraso na maturação pulmonar fetal. A inflamação crônica "
        "das vias aéreas maternas e o uso de corticoides pode interferir na produção de surfactante pelo pneumócito "
        "tipo II do feto.\n\n"
        "A) A cor branca não é fator de risco estabelecido para SDR; na verdade, a prematuridade é o principal fator. "
        "B) Recém-nascidos PIG (pequenos para idade gestacional) tendem a ter maior maturidade pulmonar relativa pelo estresse crônico. "
        "C) O sexo feminino é fator protetor, pois a maturação pulmonar é mais precoce nas meninas."
    ),
    19: (
        "A alternativa A é correta porque mulheres submetidas à cirurgia bariátrica que engravidam com intervalo curto "
        "entre a cirurgia e a concepção (geralmente menos de 12 a 18 meses) apresentam maior risco de prematuridade, "
        "além de deficiências nutricionais. O período de perda ponderal acelerada compromete o aporte nutricional ao "
        "feto e aumenta complicações obstétricas.\n\n"
        "B) O TOTG entre 24-28 semanas não é obrigatório em todas as pós-bariátricas, pois pode haver falso-negativo pela alteração absortiva. "
        "C) Ferro IV não é obrigatório para todas; a suplementação deve ser guiada por exames laboratoriais. "
        "D) Estimular carboidratos rápidos é contraindicado, pois pode precipitar síndrome de dumping na pós-bariátrica."
    ),
    20: (
        "A alternativa B é correta porque o paciente está em uso de estatina para dislipidemia e apresenta mialgia "
        "com elevação de CPK, quadro clássico de miopatia induzida por estatinas. As estatinas são a principal causa "
        "medicamentosa de miopatia, e o risco aumenta com esforço físico intenso (trabalhador da construção civil), "
        "podendo evoluir para rabdomiólise se não identificado precocemente.\n\n"
        "A) A obesidade per se não causa miopatia com elevação de CPK dessa forma. "
        "C) Hipotireoidismo pode causar miopatia, mas não é a causa mais provável num paciente sabidamente em uso de estatina. "
        "D) Diabetes mellitus não é causa direta de miopatia com elevação de CPK como apresentado."
    ),
    21: (
        "A alternativa A é correta porque o teste da urease em biópsia gástrica (teste rápido da urease ou CLOtest) é "
        "o exame de primeira escolha para diagnóstico de H. pylori quando o paciente já está sendo submetido à endoscopia "
        "digestiva alta. O teste é rápido, barato, com alta sensibilidade e especificidade, aproveitando a biópsia já "
        "realizada durante o procedimento endoscópico.\n\n"
        "B) O teste respiratório com C13 é excelente, mas é preferido para controle de erradicação, não durante endoscopia. "
        "C) A pesquisa de antígeno fecal por ELISA é método não invasivo, indicado quando não se realiza endoscopia. "
        "D) O histopatológico com HE detecta H. pylori, mas é menos sensível e mais demorado que o teste da urease."
    ),
    22: (
        "A alternativa D é correta porque em paciente com neoplasia esofágica avançada com fístula traqueoesofágica, "
        "a prótese endoscópica autoexpansível é o melhor método paliativo. Ela restabelece a perviedade do lúmen "
        "esofágico para deglutição e, ao mesmo tempo, oclui a fístula traqueoesofágica, prevenindo broncoaspiração "
        "e melhorando significativamente a qualidade de vida.\n\n"
        "A) A jejunostomia permite alimentação, mas não resolve a fístula traqueoesofágica nem permite deglutição. "
        "B) A sonda nasoenteral é desconfortável, não oclui a fístula e tem pior qualidade de vida a longo prazo. "
        "C) A gastrostomia endoscópica alimenta o paciente, mas também não aborda a fístula traqueoesofágica."
    ),
    23: (
        "A alternativa C é correta porque o adolescente apresenta desvio da coluna vertebral com teste de Adams positivo "
        "(gibosidade torácica) e assimetria do tórax, configurando escoliose. A conduta diagnóstica é solicitar "
        "radiografia panorâmica da coluna para determinar o ângulo de Cobb, que quantifica a curvatura e orienta o "
        "tratamento (observação, colete ou cirurgia).\n\n"
        "A) Escoliose familiar sem exames é conduta inadequada, pois é necessário quantificar a curva para definir tratamento. "
        "B) Lordose não apresenta teste de Adams positivo nem assimetria torácica; o quadro é de escoliose. "
        "D) Lordose com espinha bífida não corresponde aos achados clínicos de gibosidade e assimetria torácica."
    ),
    24: (
        "A alternativa A é correta porque o resultado de ASC-H (células escamosas atípicas, não podendo excluir lesão "
        "de alto grau) no exame citopatológico exige encaminhamento imediato para colposcopia. O ASC-H tem risco "
        "significativo de lesão intraepitelial de alto grau (HSIL) subjacente, e a colposcopia com biópsia dirigida "
        "é necessária para esclarecer o diagnóstico.\n\n"
        "B) Manter colpocitologia anual seria conduta para ASC-US com resultado negativo em repetição, não para ASC-H. "
        "C) Exérese da zona de transformação sem colposcopia prévia é tratamento sem diagnóstico, conduta inadequada. "
        "D) Repetir em 6 meses é conduta para ASC-US, não para ASC-H que requer investigação imediata."
    ),
    25: (
        "A alternativa D é correta porque gestante com VDRL 1:4 sem tratamento prévio para sífilis deve ser tratada "
        "como sífilis latente tardia (ou de duração ignorada), que requer penicilina G benzatina 2.400.000 UI "
        "intramuscular, uma dose por semana, durante 3 semanas consecutivas (total de 7.200.000 UI). Na gestação, "
        "a penicilina é o único tratamento considerado eficaz para prevenir sífilis congênita.\n\n"
        "A) Esperar e repetir VDRL mensalmente sem tratar expõe o feto ao risco de sífilis congênita. "
        "B) Em caso de alergia à penicilina na gestante, deve-se realizar dessensibilização, pois não há alternativa eficaz. "
        "C) Após tratamento, o VDRL deve ser repetido mensalmente durante toda a gestação, não apenas no último trimestre."
    ),
}

for q in data['questoes']:
    num = q.get('numero')
    if num in explicacoes:
        q['explicacao'] = explicacoes[num]

with open('medpassei/REVALIDA INEP 2022.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Explicações escritas para questões 1-25 em medpassei/REVALIDA INEP 2022.json")
