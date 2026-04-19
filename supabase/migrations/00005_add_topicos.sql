-- Add topicos JSONB column to questions
-- topicos format: [{"area": "Cardiologia", "subtopico": "Hipertensão Arterial Sistêmica"}, ...]
-- A question can belong to multiple areas/subtopics (e.g. cancer belongs to Oncologia + primary area)

ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS topicos jsonb DEFAULT '[]'::jsonb;

-- GIN index for fast containment queries (@>)
CREATE INDEX IF NOT EXISTS idx_questions_topicos
  ON questions USING GIN (topicos);

COMMENT ON COLUMN questions.topicos IS
  'Array of {area, subtopico} objects following the 21-area medical taxonomy. Used for study-by-topic feature.';
