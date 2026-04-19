export const MEDICAL_AREAS = [
    'Cardiologia',
    'Cirurgia',
    'Dermatologia',
    'Endocrinologia',
    'Gastroenterologia',
    'Geriatria',
    'Ginecologia e obstetrícia',
    'Hematologia',
    'Infectologia',
    'Medicina preventiva',
    'Nefrologia',
    'Neurologia',
    'Oftalmologia',
    'Oncologia',
    'Ortopedia e traumatologia',
    'Otorrinolaringologia',
    'Pediatria',
    'Pneumologia',
    'Psiquiatria',
    'Reumatologia',
    'Urologia',
] as const;

export type MedicalArea = typeof MEDICAL_AREAS[number];

export function isValidMedicalArea(area: string): area is MedicalArea {
    return (MEDICAL_AREAS as readonly string[]).includes(area);
}

// Grandes especialidades (excluídas de "Clínica Médica")
export const SPECIALTY_AREAS = [
    'Cirurgia',
    'Pediatria',
    'Ginecologia e obstetrícia',
    'Medicina preventiva',
] as const;

// "Clínica Médica" = tudo exceto as 4 grandes especialidades
export const CLINICA_MEDICA_AREAS = MEDICAL_AREAS.filter(
    (a) => !(SPECIALTY_AREAS as readonly string[]).includes(a)
);

// Todas as opções de estudo por área (21 áreas + Clínica Médica)
export const STUDY_AREAS = ['Clínica Médica', ...MEDICAL_AREAS] as const;
export type StudyArea = typeof STUDY_AREAS[number];

export function slugifyArea(area: string): string {
    return area
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function areaFromSlug(slug: string): string | undefined {
    return STUDY_AREAS.find((a) => slugifyArea(a) === slug);
}
