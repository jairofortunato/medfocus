/**
 * Complete 21-area medical taxonomy for study-by-topic feature.
 * Each area has named subtopics. Both area and subtopico names must match
 * exactly the values used in the `topicos` JSONB field of questions.
 */

export function slugifyTopico(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface SubtopicoInfo {
  name: string;
  slug: string;
}

export interface AreaTaxonomy {
  name: string;
  slug: string;
  subtopicos: SubtopicoInfo[];
}

function makeArea(name: string, subtopicos: string[]): AreaTaxonomy {
  return {
    name,
    slug: slugifyTopico(name),
    subtopicos: subtopicos.map((s) => ({ name: s, slug: slugifyTopico(s) })),
  };
}

export const TAXONOMY: AreaTaxonomy[] = [
  makeArea('Cardiologia', [
    'Hipertensão Arterial Sistêmica',
    'Síndrome Coronariana Aguda (Angina, IAM)',
    'Insuficiência Cardíaca',
    'Arritmias e Distúrbios de Condução',
    'Valvopatias',
    'Endocardite Infecciosa',
    'Pericardite e Miocardite',
    'Emergências Cardiovasculares',
  ]),
  makeArea('Pneumologia', [
    'DPOC',
    'Asma',
    'Pneumonia Bacteriana Viral e Atípica',
    'Infecções de Vias Aéreas Superiores (IVAS)',
    'Tuberculose',
    'Derrame Pleural e Pneumotórax',
    'Tromboembolismo Pulmonar (TEP)',
    'Neoplasias Pulmonares',
    'Doenças Pulmonares Intersticiais',
    'Síndrome da Apneia do Sono (SAOS)',
  ]),
  makeArea('Infectologia', [
    'HIV/AIDS',
    'Tuberculose',
    'Dengue e Arboviroses',
    'Malária',
    'Parasitoses Sistêmicas',
    'Infecções Sexualmente Transmissíveis (IST/DST)',
    'Sepse e Infecções Bacterianas Graves',
    'Fungoses e Infecções Oportunistas',
    'Doenças Exantemáticas',
    'Imunizações e Profilaxias',
  ]),
  makeArea('Gastroenterologia / Hepatologia', [
    'Doenças do Esôfago',
    'Úlcera Péptica e H. pylori',
    'Doenças Inflamatórias Intestinais',
    'Hepatites Virais',
    'Cirrose e Hipertensão Portal',
    'Pancreatite Aguda e Crônica',
    'Colelitíase e Doenças das Vias Biliares',
    'Câncer Gástrico e Esofágico',
    'Câncer Colorretal',
    'Doenças Anorretais Benignas',
  ]),
  makeArea('Nefrologia', [
    'Insuficiência Renal Aguda (IRA)',
    'Doença Renal Crônica (DRC)',
    'Glomerulopatias',
    'Distúrbios Hidroeletrolíticos',
    'Distúrbios Ácido-Base',
    'Infecções do Trato Urinário (ITU)',
    'Litíase Renal',
  ]),
  makeArea('Reumatologia', [
    'Artrite Reumatoide',
    'Lúpus Eritematoso Sistêmico (LES)',
    'Espondiloartropatias',
    'Artropatias por Microcristais (Gota, Pseudogota)',
    'Vasculites',
    'Esclerose Sistêmica e Miopatias Inflamatórias',
    'Osteoporose e Doenças Ósseas Metabólicas',
    'Síndrome de Sjögren e Outras Doenças do Tecido Conjuntivo',
  ]),
  makeArea('Endocrinologia', [
    'Diabetes Mellitus',
    'Hipotireoidismo e Hipertireoidismo',
    'Nódulo e Câncer de Tireoide',
    'Distúrbios da Suprarrenal',
    'Distúrbios da Hipófise',
    'Dislipidemia',
    'Obesidade e Síndrome Metabólica',
    'Distúrbios do Cálcio e Paratormônio',
  ]),
  makeArea('Neurologia', [
    'Acidente Vascular Cerebral (AVC)',
    'Cefaleias',
    'Epilepsia e Convulsões',
    'Doença de Parkinson',
    'Doença de Alzheimer',
    'Outras Doenças Neurodegenerativas',
    'Esclerose Múltipla e Doenças Desmielinizantes',
    'Neuroinfecções',
    'Neuropatias Periféricas',
    'Miopatias e Doenças da Junção Neuromuscular',
    'Distúrbios do Movimento',
  ]),
  makeArea('Psiquiatria', [
    'Transtornos do Humor',
    'Transtornos de Ansiedade',
    'Esquizofrenia e Psicoses',
    'Transtornos por Uso de Substâncias',
    'Transtornos Alimentares',
    'TDAH e Transtornos do Neurodesenvolvimento',
    'Emergências Psiquiátricas e Suicídio',
    'Demência e Delirium',
  ]),
  makeArea('Hematologia', [
    'Anemias',
    'Leucemias e Linfomas',
    'Mieloma Múltiplo e Mielodisplasias',
    'Distúrbios da Coagulação e Trombose',
    'Hemoterapia e Transfusão',
  ]),
  makeArea('Oncologia', [
    'Câncer de Mama',
    'Câncer de Colo de Útero',
    'Câncer de Endométrio e Ovário',
    'Câncer de Próstata',
    'Câncer de Pulmão',
    'Câncer Gástrico e Esofágico',
    'Câncer Colorretal',
    'Câncer de Bexiga e Rim',
    'Câncer de Pele',
    'Leucemias e Linfomas',
    'Mieloma Múltiplo',
    'Neoplasias de Cabeça e Pescoço',
    'Nódulo e Câncer de Tireoide',
    'Oncologia Geral',
  ]),
  makeArea('Cirurgia Geral', [
    'Abdome Agudo Inflamatório',
    'Abdome Agudo Obstrutivo',
    'Abdome Agudo Perfurativo',
    'Abdome Agudo Vascular',
    'Abdome Agudo Hemorrágico',
    'Trauma',
    'Hérnias',
    'Câncer Gástrico e Esofágico — cirúrgico',
    'Câncer Colorretal — cirúrgico',
    'Doenças Benignas do Cólon',
    'Doenças Anorretais Cirúrgicas',
    'Pré e Pós-operatório',
  ]),
  makeArea('Ortopedia / Traumatologia', [
    'Fraturas e Luxações — Membros Superiores',
    'Fraturas e Luxações — Membros Inferiores e Quadril',
    'Lesões do Joelho',
    'Lesões do Ombro',
    'Artropatias Degenerativas (Osteoartrose)',
    'Coluna Vertebral',
    'Emergências Ortopédicas',
    'Osteomielite e Artrite Séptica',
  ]),
  makeArea('Ginecologia e Obstetrícia', [
    'Pré-natal Normal',
    'Atenção ao Parto Normal e Distócias',
    'Distúrbios Hipertensivos na Gestação',
    'Hemorragias Obstétricas',
    'Infecções na Gestação',
    'Gestação de Alto Risco e Doenças Clínicas na Gestação',
    'Trabalho de Parto Prematuro e RPM',
    'Puerpério e Aleitamento Materno',
    'Gestação Múltipla',
    'Contracepção',
    'Climatério e Menopausa',
    'Infertilidade e Reprodução Assistida',
    'Endometriose e Dor Pélvica Crônica',
    'Miomas e Tumores Benignos do Útero',
    'Neoplasias Ginecológicas',
    'Patologia Mamária',
    'Ciclo Menstrual Anovulação e Amenorreia',
    'Incontinência Urinária e Prolapso Genital',
  ]),
  makeArea('Pediatria', [
    'Reanimação Neonatal',
    'Icterícia Neonatal',
    'Doenças Pulmonares Neonatais',
    'Outros Temas Neonatais',
    'Crescimento Desenvolvimento e Imunizações',
    'Doenças Exantemáticas da Infância',
    'Infecções Respiratórias Pediátricas',
    'Diarreia e Desidratação',
    'Distúrbios Neurológicos Pediátricos',
    'Cardiopatias Congênitas',
    'Desnutrição Anemia e Vitamina D',
    'Emergências Pediátricas',
  ]),
  makeArea('Medicina Preventiva / Saúde Coletiva', [
    'Epidemiologia',
    'Bioestatística',
    'Vigilância em Saúde e Notificação Compulsória',
    'Atenção Primária e Saúde da Família',
    'SUS',
    'Rastreamento e Prevenção',
    'Bioética e Ética Médica',
    'Saúde do Trabalhador',
    'Saúde Mental na Comunidade',
  ]),
  makeArea('Medicina de Urgência e Terapia Intensiva', [
    'Ressuscitação Cardiopulmonar',
    'Choque',
    'Intoxicações Agudas e Antídotos',
    'Distúrbios Metabólicos Agudos',
    'Ventilação Mecânica e Suporte Respiratório',
    'Monitorização e Suporte em UTI',
    'Trauma',
    'Emergências Neurológicas',
  ]),
  makeArea('Oftalmologia', [
    'Síndrome do Olho Vermelho',
    'Retinopatia Diabética e Hipertensiva',
    'Glaucoma',
    'Catarata e Ametropias',
    'Emergências Oftalmológicas',
  ]),
  makeArea('Otorrinolaringologia', [
    'Otites',
    'Rinossinusites',
    'Amigdalites Faringites e Laringites',
    'Vertigens e Labirintopatias',
    'Neoplasias de Cabeça e Pescoço',
  ]),
  makeArea('Dermatologia', [
    'Dermatoses Inflamatórias',
    'Infecções de Pele',
    'Doenças Bolhosas Autoimunes',
    'Neoplasias de Pele',
    'Manifestações Cutâneas de Doenças Sistêmicas',
  ]),
  makeArea('Urologia', [
    'Câncer de Próstata e Rastreamento',
    'Câncer de Bexiga e Rim',
    'Hiperplasia Prostática Benigna e Disfunção Miccional',
    'Litíase Urinária',
    'Infecções Urológicas Complicadas',
  ]),
];

/** Find an area by its slug */
export function getAreaBySlug(slug: string): AreaTaxonomy | undefined {
  return TAXONOMY.find((a) => a.slug === slug);
}

/** Find a subtopico within an area by both slugs */
export function getSubtopicoBySlug(
  areaSlug: string,
  subSlug: string
): { area: AreaTaxonomy; subtopico: SubtopicoInfo } | undefined {
  const area = getAreaBySlug(areaSlug);
  if (!area) return undefined;
  const subtopico = area.subtopicos.find((s) => s.slug === subSlug);
  if (!subtopico) return undefined;
  return { area, subtopico };
}

/** All area slugs */
export const TAXONOMY_AREA_SLUGS = TAXONOMY.map((a) => a.slug);
