import json

with open('medpassei/REVALIDA INEP 2022.json', encoding='utf-8') as f:
    data = json.load(f)

explicacoes = {
    26: (
        "A alternativa C esta correta porque o quadro clinico — diarreia sanguinolenta cronica com muco e sangue, "
        "colonoscopia mostrando inflamacao ulcerada continua do reto ate o colon transverso — e classico de retocolite "
        "ulcerativa (RCU). A inflamacao continua ascendente a partir do reto e o padrao tipico da RCU, diferentemente "
        "da doenca de Crohn que e segmentar. Na crise moderada a grave, o tratamento inicial e com corticosteroide "
        "(prednisona) para inducao de remissao, associado a mesalazina para manutencao.\n\n"
        "A) A doenca de Crohn apresenta acometimento segmentar (areas salteadas), transmural, podendo afetar qualquer "
        "segmento do trato gastrointestinal, nao continuo como descrito. "
        "B) A colite microscopica cursa com diarreia aquosa cronica sem sangramento, e a colonoscopia e macroscopicamente "
        "normal — incompativel com ulceracoes extensas. "
        "D) A colite pseudomembranosa e causada por Clostridioides difficile, geralmente associada a uso previo de "
        "antibioticos, e nao apresenta evolucao cronica de 1 ano."
    ),
    27: (
        "A alternativa C esta correta porque o quadro — vomitos biliosos, dor colica abdominal, parada de eliminacao "
        "de gases e fezes, em paciente com cirurgia abdominal previa (ulcera perfurada ha 5 anos) — sugere obstrucao "
        "intestinal por bridas/aderencias. Na obstrucao intestinal adesiva sem sinais de estrangulamento ou peritonite, "
        "a conduta inicial e conservadora: sonda nasogastrica (SNG) para descompressao, hidratacao venosa, correcao "
        "de disturbios hidroeletroliticos e observacao clinica por 24-48 horas. A maioria dos casos resolve com "
        "tratamento conservador.\n\n"
        "A) A videolaparoscopia diagnostica nao e a conduta inicial em obstrucao adesiva sem complicacao. "
        "B) A laparotomia de emergencia e indicada apenas se houver sinais de estrangulamento, peritonite ou falha "
        "do tratamento conservador. "
        "D) A descompressao colonica (sonda retal) e indicada para volvo de sigmoide, nao para obstrucao de "
        "intestino delgado por bridas."
    ),
    28: (
        "A alternativa B esta correta porque o quadro — lactente de 23 meses com massa abdominal palpavel, tomografia "
        "mostrando massa suprarrenal calcificada que ultrapassa a linha media — e classico de neuroblastoma. O "
        "neuroblastoma e o tumor solido extracraniano mais comum na infancia, originado da crista neural (medula "
        "adrenal), com pico de incidencia antes dos 5 anos. A presenca de calcificacoes e o cruzamento da linha "
        "media sao achados caracteristicos que o diferenciam de outros tumores.\n\n"
        "A) O linfoma e mais comum em criancas maiores e nao se apresenta tipicamente como massa suprarrenal "
        "calcificada. "
        "C) O tumor de Wilms (nefroblastoma) e de origem renal, nao suprarrenal, e classicamente nao cruza a "
        "linha media nem apresenta calcificacoes proeminentes. "
        "D) O feocromocitoma e extremamente raro em lactentes e manifesta-se com crises hipertensivas, nao como "
        "massa abdominal assintomatica."
    ),
    29: (
        "A alternativa A esta correta porque o quadro — mulher jovem com dor pelvica aguda, massa anexial de 8 cm "
        "e ausencia de fluxo ao Doppler — e altamente sugestivo de torcao ovariana. A torcao do pediculoo vascular "
        "do ovario causa isquemia, resultando em ausencia de fluxo sanguineo ao Doppler colorido. E uma emergencia "
        "ginecologica que requer intervencao cirurgica (laparoscopia) para destorcao ou ooforectomia, pois o atraso "
        "pode levar a necrose ovariana.\n\n"
        "B) O abscesso tubo-ovariano cursa com febre, leucocitose e sinais inflamatorios; o Doppler mostraria "
        "hipervascularizacao, nao ausencia de fluxo. "
        "C) O endometrioma e um cisto de conteudo achocolatado (sangue antigo) associado a dor cronica e "
        "dismenorreia, nao dor aguda com ausencia de fluxo. "
        "D) O cisto hemorragico apresenta dor aguda, mas mantem fluxo ao Doppler na parede do cisto e nao "
        "costuma cursar com ausencia completa de fluxo."
    ),
    30: (
        "A alternativa C esta correta porque o quadro — enfermeira com vesiculas e fissuras nas maos ha 6 meses, "
        "com melhora durante as ferias — e classico de dermatite de contato por latex. Profissionais de saude que "
        "usam luvas de latex diariamente estao em alto risco. A melhora no periodo de ferias (quando nao ha "
        "exposicao ao alergeno) e evidencia forte de etiologia ocupacional alergenica, reforando o diagnostico "
        "de dermatite de contato.\n\n"
        "A) A fotodermatose acomete areas expostas ao sol, mas as maos (dentro de luvas) nao sao areas de "
        "fotoexposicao tipica neste contexto. "
        "B) As ceratoses actinicas sao lesoes pre-malignas cronicas em areas fotoexpostas, tipicas de idosos, "
        "nao de mulher jovem com lesoes vesiculares nas maos. "
        "D) A melhora nas ferias nao descarta alergia — pelo contrario, confirma a relacao causal com o "
        "ambiente de trabalho."
    ),
    31: (
        "A alternativa A esta correta porque o quadro — paciente hospitalizada de 54 anos com alucinacoes, "
        "sincope e hipotensao ortostatica durante internacao com uso de multiplos medicamentos — sugere efeitos "
        "adversos medicamentosos (delirium ou efeitos anticolinergicos/dopaminergicos). A conduta prioritaria e "
        "revisar e ajustar os medicamentos em uso, identificando o farmaco causador da hipotensao ortostatica e "
        "das alucinacoes, realizando a desprescricao quando indicado.\n\n"
        "B) A contencao quimica/fisica so e indicada em situacoes de risco iminente para o paciente ou terceiros, "
        "nao como primeira medida. "
        "C) Solicitar acompanhante e medida complementar valida, mas nao resolve a causa base (efeito adverso "
        "medicamentoso). "
        "D) Substituir todos os medicamentos simultaneamente e perigoso e desnecessario — deve-se ajustar de "
        "forma individualizada e gradual."
    ),
    32: (
        "A alternativa A esta correta porque, segundo as diretrizes de rastreamento do cancer colorretal, pacientes "
        "com 1 a 2 adenomas tubulares menores que 10 mm sao considerados de baixo risco e devem repetir a "
        "colonoscopia em 5-10 anos. Porem, quando ha 3 ou mais adenomas tubulares (mesmo que < 1 cm), o risco "
        "e intermediario e a colonoscopia de seguimento deve ser realizada em 3 anos. A presenca de tres adenomas "
        "eleva o risco de metacronismo e justifica vigilancia mais estreita.\n\n"
        "B) O intervalo de 7-10 anos e recomendado para pacientes de baixo risco (1-2 adenomas tubulares pequenos "
        "sem displasia de alto grau), nao para 3 adenomas. "
        "C) A transversectomia e uma cirurgia oncologica indicada para neoplasias malignas do colon transverso, "
        "nao para adenomas benignos. "
        "D) A colectomia total e indicada em polipose adenomatosa familiar ou cancer colorretal hereditario, nao "
        "para tres adenomas tubulares pequenos."
    ),
    33: (
        "A alternativa B esta correta porque o quadro — neonato de 5 dias de vida com papulas e pustulas "
        "eritematosas em tronco e membros, com presenca de eosinofilos no conteudo — e classico de eritema "
        "toxico neonatal. E uma condicao benigna e autolimitada, muito comum em recem-nascidos a termo entre "
        "o 2o e o 5o dia de vida. A presenca de eosinofilos no esfregaco da pustula e o achado laboratorial "
        "patognomonico que diferencia de outras dermatoses neonatais.\n\n"
        "A) A miliaria rubra decorre de obstrucao dos ductos sudoriparos e apresenta vesiculas pequenas, nao "
        "pustulas com eosinofilia. "
        "C) A pustulose cefalica neonatal (acne neonatal) acomete predominantemente a face (regiao cefalica), "
        "nao tronco e membros difusamente. "
        "D) A melanose pustulosa transitoria neonatal apresenta pustulas que rompem facilmente deixando maculas "
        "hiperpigmentadas, sendo mais comum em recem-nascidos de pele escura e esta presente desde o nascimento."
    ),
    34: (
        "A alternativa C esta correta porque o quadro — mulher idosa de 70 anos com prurido vulvar cronico, "
        "leucoplasia e lesao ulcerada — levanta forte suspeita de carcinoma de vulva. O cancer de vulva e mais "
        "frequente em idosas e pode apresentar-se sobre lesoes pre-existentes como liquen escleroso. A presenca "
        "de ulceracao sobre leucoplasia em paciente idosa exige biopsia obrigatoria para confirmacao histopatologica "
        "e definicao da conduta terapeutica.\n\n"
        "A) O cancroide (cancro mole) e uma IST aguda com ulceras dolorosas de base suja, sem relacao com prurido "
        "cronico e leucoplasia em idosa. "
        "B) A doenca de Behcet cursa com ulceras orais e genitais recorrentes, geralmente em pacientes mais jovens, "
        "sem leucoplasia associada. "
        "D) A NIV usual/HSIL e mais prevalente em mulheres mais jovens, associada ao HPV, e tipicamente nao se "
        "apresenta como ulceracao sobre leucoplasia em idosa."
    ),
    35: (
        "A alternativa D esta correta porque, na educacao em saude com adolescentes, a metodologia mais adequada "
        "e a problematizacao — uma abordagem pedagogica baseada em Paulo Freire que parte da realidade dos "
        "participantes, estimulando a reflexao critica atraves de perguntas disparadoras. Essa metodologia ativa "
        "promove protagonismo, escuta qualificada e construcao coletiva de conhecimento, sendo especialmente "
        "eficaz com adolescentes por valorizar suas experiencias e percepcoes sobre a violencia.\n\n"
        "A) A palestra sobre beneficios da vacinacao e uma metodologia passiva e nao aborda o tema proposto "
        "(violencia). "
        "B) A roda de conversa sobre percepcoes positivas da vacina tambem nao aborda o tema da violencia "
        "e limita a discussao a um tema diferente. "
        "C) A palestra com numeros da COVID e uma abordagem transmissiva (bancaria), nao participativa, e "
        "tambem nao aborda o tema da violencia."
    ),
    36: (
        "A alternativa C esta correta porque o quadro — homem de 69 anos com bradicinesia ha 6 meses, rigidez, "
        "tremor de repouso e marcha em pequenos passos (shuffling gait) — e classico de doenca de Parkinson. "
        "A tetrade classica parkinsoniana inclui tremor de repouso, bradicinesia, rigidez e instabilidade postural. "
        "O tremor de repouso (tipo pill-rolling) e o sinal mais especifico, e a bradicinesia e obrigatoria para "
        "o diagnostico clinico.\n\n"
        "A) A demencia vascular cursa com deficit cognitivo progressivo em degraus, associado a fatores de risco "
        "cerebrovasculares, e nao apresenta a tetrade parkinsoniana. "
        "B) O tremor essencial e predominantemente postural/de acao (nao de repouso) e bilateral, sem bradicinesia "
        "ou rigidez associadas. "
        "D) A doenca de Alzheimer e uma demencia de inicio insidioso com comprometimento de memoria episodica "
        "como sintoma principal, sem sinais motores extrapiramidais tipicos."
    ),
    37: (
        "A alternativa C esta correta porque, no atendimento pre-hospitalar de vitima em decubito ventral (prona) "
        "com capacete, a sequencia correta e: primeiro retira-se o capacete com estabilizacao manual da coluna "
        "cervical, depois realiza-se o rolamento em bloco (de prona para supina) mantendo o alinhamento do eixo "
        "cabeca-pescoco-tronco, e por ultimo aplica-se o colar cervical com o paciente ja em decubito dorsal. O "
        "capacete deve ser retirado antes do rolamento para permitir acesso adequado a via aerea.\n\n"
        "A) Nao se coloca o colar cervical antes do rolamento quando o paciente esta em prona, pois o colar e "
        "aplicado com o paciente em supino. "
        "B) O rolamento nao pode ser feito antes da retirada do capacete, pois o capacete impede o correto "
        "alinhamento cervical durante a manobra. "
        "D) O colar cervical nao pode ser colocado primeiro com o paciente em prona e com o capacete ainda no lugar."
    ),
    38: (
        "A alternativa A esta correta porque a hernia inguinal em prematuros com conteudo intestinal documentado "
        "exige correcao cirurgica eletiva precoce, e nao expectante. Em prematuros, a hernia inguinal tem alto "
        "risco de encarceramento (ate 30%), portanto a cirurgia deve ser programada logo apos o diagnostico, "
        "assim que o paciente tenha condicoes clinicas. A solicitacao de hemograma pre-operatorio e parte da "
        "avaliacao pre-cirurgica de rotina.\n\n"
        "B) A ultrassonografia inguinal e desnecessaria quando o diagnostico clinico ja esta estabelecido pela "
        "presenca de conteudo intestinal palpavel no canal inguinal. "
        "C) Aguardar 1 ano nao e adequado em prematuros, pois o risco de encarceramento e muito elevado nessa "
        "faixa etaria e a resolucao espontanea nao ocorre em hernia inguinal verdadeira. "
        "D) Aguardar 2 anos e ainda mais arriscado e nao tem justificativa clinica — a conduta expectante se "
        "aplica a hernia umbilical, nao inguinal."
    ),
    39: (
        "A alternativa D esta correta porque a paciente com antecedente de pre-eclampsia grave e anticorpos "
        "antifosfolipideos positivos preenche criterios para sindrome antifosfolipidea (SAF) obstetrica. Na "
        "SAF com trombose ou mau passado obstetrico, o tratamento na gestacao e AAS em dose baixa (100 mg/dia) "
        "associado a enoxaparina em dose terapeutica (1 mg/kg de 12/12h). A dose terapeutica, e nao profilatica, "
        "e necessaria pela presenca de anticorpos antifosfolipideos confirmados e historia obstetrica grave.\n\n"
        "A) Enoxaparina 40 mg/dia isolada (dose profilatica) e insuficiente para SAF obstetrica e nao inclui "
        "o AAS. "
        "B) AAS isolado e insuficiente para pacientes com SAF — necessita anticoagulacao associada. "
        "C) AAS com enoxaparina em dose profilatica e a conduta para trombofilia de baixo risco, nao para "
        "SAF com criterios clinicos e laboratoriais confirmados."
    ),
    40: (
        "A alternativa A esta correta porque o quadro — trabalhador de pet shop em Sao Paulo com lesao nodular "
        "de distribuicao linfangitica no antebraco apos arranhadura de gato — e classico de esporotricose. A "
        "esporotricose e causada pelo fungo Sporothrix spp., cuja forma mais comum e a linfocutanea: nodulo no "
        "local da inoculacao com disseminacao por via linfatica ascendente (nodulos em rosario). O gato e o "
        "principal transmissor no Brasil, especialmente no Rio de Janeiro e Sao Paulo.\n\n"
        "B) A cromoblastomicose apresenta lesoes verrucosas cronicas, geralmente em membros inferiores, sem "
        "padrao linfangitico. "
        "C) A leishmaniose tegumentar cursa com ulcera com borda elevada (moldura), sem padrao linfangitico "
        "tipico, e a transmissao e por flebotomineos, nao por gatos. "
        "D) A blastomicose sul-americana (paracoccidioidomicose) apresenta lesoes mucosas (estomatite moriforme) "
        "e pulmonares, nao padrao linfangitico cutaneo pos-arranhadura."
    ),
    41: (
        "A alternativa B esta correta porque o quadro — homem de 55 anos com linfadenopatia cervical e axilar "
        "progressiva ha 2 meses, associada a sintomas B (febre, sudorese noturna e perda ponderal >10%) — e "
        "altamente sugestivo de linfoma. A presenca de sintomas constitucionais (sintomas B) em paciente com "
        "linfadenopatia persistente e indolor exige biopsia ganglionar excisional para diagnostico histopatologico "
        "e classificacao do linfoma.\n\n"
        "A) A infeccao por CMV causa linfadenopatia difusa, mas e autolimitada e nao justifica linfadenopatia "
        "progressiva de 2 meses com sintomas B tao exuberantes. "
        "C) A mononucleose infecciosa e tipica de adultos jovens, autolimitada, e nao cursa com perda ponderal "
        "de 10% e sudorese noturna prolongada. "
        "D) Metastase de tireoide e uma hipotese menos provavel sem nodulo tireoidiano palpavel, e a apresentacao "
        "com linfadenopatia axilar bilateral nao e tipica de cancer de tireoide."
    ),
    42: (
        "A alternativa C esta correta porque o quadro — prurido ocular, lacrimejamento, secrecao purulenta com "
        "palpebras aderidas ao despertar, unilateral, com reacao conjuntival papilar — e classico de conjuntivite "
        "bacteriana aguda. O Staphylococcus aureus e o agente mais comum de conjuntivite bacteriana aguda em "
        "adultos. A presenca de secrecao purulenta (nao aquosa) e o acometimento unilateral inicial sao pistas "
        "importantes para etiologia bacteriana.\n\n"
        "A) A conjuntivite por adenovirus e tipicamente bilateral, com secrecao aquosa ou mucosa (nao purulenta) "
        "e reacao folicular, nao papilar. "
        "B) A conjuntivite herpetica cursa com vesiculas palpebrais e lesoes dendriticas na cornea, nao com "
        "secrecao purulenta. "
        "D) A conjuntivite por Chlamydia trachomatis tem evolucao subaguda/cronica com reacao folicular "
        "predominante, nao papilar com secrecao purulenta aguda."
    ),
    43: (
        "A alternativa C esta correta porque o quadro — crianca de 4 anos com crise convulsiva tonico-clonica "
        "generalizada, duracao menor que 15 minutos, episodio unico, associada a febre de 39 graus e sem sinais "
        "focais — preenche todos os criterios de convulsao febril simples. A conduta adequada e tranquilizar os "
        "pais, explicando que convulsoes febris simples sao benignas, nao causam dano neurologico e nao requerem "
        "investigacao complementar (EEG, TC ou RNM) nem tratamento antiepileptico. O acompanhamento longitudinal "
        "em puericultura e suficiente.\n\n"
        "A) Encaminhar ao especialista nao e necessario na convulsao febril simples — a avaliacao e conduzida "
        "pelo pediatra. "
        "B) A tomografia cerebral na emergencia nao e indicada na convulsao febril simples — so e necessaria se "
        "houver sinais focais, convulsao complexa ou suspeita de lesao estrutural. "
        "D) A internacao para investigacao e desnecessaria e excessiva para convulsao febril simples em crianca "
        "sem sinais de alarme."
    ),
    44: (
        "A alternativa D esta correta porque, no cancer de mama, o fator prognostico mais importante e o "
        "comprometimento de linfonodos axilares (estadiamento linfonodal). A pesquisa do linfonodo sentinela "
        "determina se houve disseminacao linfatica, sendo o principal preditor de sobrevida e recorrencia. "
        "Pacientes com linfonodos positivos tem prognostico significativamente pior que aquelas com axila negativa, "
        "independentemente do tamanho tumoral ou status de receptores.\n\n"
        "A) O tipo histologico (ductal vs. lobular) tem menor impacto prognostico que o status linfonodal — "
        "ambos os tipos podem ter bom ou mau prognostico dependendo do estadiamento. "
        "B) O tamanho do tumor e um fator prognostico importante, mas inferior ao comprometimento linfonodal "
        "na determinacao da sobrevida global. "
        "C) Os receptores hormonais (estrogenio e progesterona) sao fatores preditivos de resposta terapeutica, "
        "mas o status linfonodal supera-os como fator prognostico isolado."
    ),
    45: (
        "A alternativa B esta correta porque, segundo os dados do boletim epidemiologico brasileiro sobre "
        "hospitalizacoes e obitos por COVID-19 estratificados por raca/cor, a populacao branca apresentou melhor "
        "sobrevida hospitalar que as demais racas/etnias somadas. Esse dado reflete as desigualdades estruturais "
        "em saude no Brasil, onde populacoes negra, parda e indigena enfrentam barreiras de acesso, maior "
        "prevalencia de comorbidades e piores condicoes socioeconomicas, resultando em maior letalidade "
        "hospitalar.\n\n"
        "A) Os dados nao demonstram que houve mais obitos na populacao indigena que na amarela em termos "
        "absolutos. "
        "C) Nao ha dados que comprovem mais internacoes na populacao preta que na parda — a populacao parda "
        "e numericamente maior no Brasil. "
        "D) Amarelos e indigenas juntos nao tiveram mais internacoes que pardos, pois a populacao parda "
        "representa a maior parcela demografica do pais."
    ),
    46: (
        "A alternativa C esta correta porque o quadro — homem idoso com cancer de prostata, dor e edema em "
        "membro inferior e sinal de Homans positivo — e altamente sugestivo de trombose venosa profunda (TVP). "
        "O melhor exame para diagnostico de TVP e a ultrassonografia com Doppler (duplex scan), que avalia "
        "compressibilidade venosa e fluxo sanguineo. E o exame de escolha por ser nao invasivo, acessivel, "
        "sem radiacao e com alta sensibilidade e especificidade para TVP proximal.\n\n"
        "A) A flebografia (venografia) e o padrao-ouro historico, mas e invasiva, usa contraste iodado e foi "
        "substituida pelo Doppler na pratica clinica. "
        "B) A arteriografia avalia arteria, nao veias — e indicada para doenca arterial periferica, nao TVP. "
        "D) A ultrassonografia de partes moles avalia tecidos superficiais e nao e adequada para avaliacao "
        "do fluxo venoso e compressibilidade vascular."
    ),
    47: (
        "A alternativa C esta correta porque o quadro — disfagia, tosse noturna, dor toracica e pirose em "
        "homem de 40 anos — sugere doenca do refluxo gastroesofagico (DRGE) com possivel esofagite ou complicacoes "
        "esofagicas. O melhor exame inicial e a endoscopia digestiva alta (EDA) com biopsia, que permite "
        "visualizacao direta da mucosa, identificacao de esofagite, estenoses, esofago de Barrett ou neoplasia, "
        "e coleta de material para analise histopatologica.\n\n"
        "A) A esofagomanometria avalia a motilidade esofagica e e indicada para investigacao de disturbios motores "
        "(acalasia), nao como exame inicial para disfagia com pirose. "
        "B) A pHmetria de 24 horas quantifica o refluxo acido e e util quando a EDA e normal ou para "
        "confirmacao diagnostica pre-cirurgica, nao como exame inicial. "
        "D) A esofagogastroduodenografia contrastada (seriografia) e menos sensivel que a EDA para detectar "
        "lesoes mucosas e nao permite biopsia."
    ),
    48: (
        "A alternativa C esta correta porque, na faixa etaria de 1 ano (lactente), os acidentes mais comuns sao "
        "asfixia (engasgo com alimentos e objetos pequenos), quedas (da propria altura, do carrinho, do trocador) "
        "e aspiracao de corpo estranho. Nessa fase, a crianca esta iniciando a deambulacao, leva objetos a boca "
        "e explora o ambiente, o que a torna especialmente vulneravel a esses tipos de acidentes. A orientacao "
        "anticipatoria aos pais na puericultura deve focar nesses riscos.\n\n"
        "A) O atropelamento e mais comum em criancas maiores (escolares) que brincam na rua, e a queimadura "
        "solar nao e o acidente mais prevalente nessa faixa etaria. "
        "B) A queda do carrinho e possivel, mas o atropelamento nao e o acidente mais comum em lactentes de "
        "1 ano que ainda nao circulam sozinhos. "
        "D) Embora aspiracoes sejam comuns, a queimadura por agua de banheira nao esta entre os acidentes mais "
        "prevalentes nessa faixa etaria especifica."
    ),
    49: (
        "A alternativa A esta correta porque a contracepcao de emergencia e uma situacao de urgencia onde o "
        "fator tempo e determinante para a eficacia do metodo (idealmente ate 72 horas apos a relacao "
        "desprotegida). O Conselho Federal de Medicina permite a teleconsulta e a prescricao a distancia em "
        "situacoes de urgencia. A orientacao e a prescricao sao adequadas nesse contexto, pois a demora em "
        "agendar consulta presencial pode comprometer a eficacia da contracepcao de emergencia.\n\n"
        "B) Negar orientacao sem exame presencial e inadequado, pois a contracepcao de emergencia nao exige "
        "exame fisico previo e a urgencia justifica a teleconsulta. "
        "C) Orientar sem prescrever e insuficiente — a paciente precisa da receita para adquirir o medicamento "
        "e a urgencia justifica a prescricao remota. "
        "D) Restringir a teleconsulta sem prescricao nao atende a urgencia da situacao, pois a paciente "
        "precisa do medicamento o mais rapido possivel."
    ),
    50: (
        "A alternativa A esta correta porque a paciente de 72 anos com hipertensao arterial estagio 1 confirmada "
        "(PAS 160-179 / PAD 90-99), sem sintomas e sem lesao de orgao-alvo, se enquadra no tratamento "
        "farmacologico com diuretico tiazidico como primeira escolha em idosos. Segundo as diretrizes brasileiras "
        "para idosos (>= 60 anos), a meta pressarica e menos agressiva: PA < 150x90 mmHg, pois metas muito "
        "baixas podem causar hipotensao ortostatica e eventos adversos nessa populacao.\n\n"
        "B) Apenas mudanca de estilo de vida e insuficiente para hipertensao estagio 1 em idosa — o tratamento "
        "farmacologico esta indicado, e a meta < 140x90 nao e a recomendada para >= 60 anos. "
        "C) A MAPA e desnecessaria quando a PA ja esta confirmada em medidas repetidas, e a meta < 120x80 "
        "e excessivamente rigorosa para idosos. "
        "D) A combinacao BCC + BRA e indicada para hipertensao estagio 2 ou refrataria, e a meta < 130x80 "
        "nao e a recomendada para idosos hipertensos sem comorbidades."
    ),
}

count = 0
for q in data['questoes']:
    if q['numero'] in explicacoes:
        q['explicacao'] = explicacoes[q['numero']]
        count += 1

with open('medpassei/REVALIDA INEP 2022.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Explicacoes escritas para {count} questoes (Q26-Q50).")
