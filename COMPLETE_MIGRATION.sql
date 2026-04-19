-- COPY AND PASTE THIS INTO YOUR SUPABASE SQL EDITOR --

-- Add area column to questions table
ALTER TABLE questions ADD COLUMN IF NOT EXISTS area TEXT;

-- Add check constraint for allowed medical areas
-- Note: We drop it first in case it already exists but with different values
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_area_check;

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
CREATE INDEX IF NOT EXISTS idx_questions_area ON questions (area);

-- Refresh PostgREST cache (optional but recommended)
NOTIFY pgrst, 'reload schema';
