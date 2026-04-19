-- Add area column to questions table
ALTER TABLE questions ADD COLUMN area TEXT;

-- Add check constraint for allowed medical areas
ALTER TABLE questions ADD CONSTRAINT questions_area_check CHECK (
  area IN (
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
    'Urologia'
  )
);

-- Create index for filtering by area
CREATE INDEX idx_questions_area ON questions (area);
