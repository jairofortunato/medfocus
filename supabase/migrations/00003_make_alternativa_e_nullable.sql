-- Allow questions with only A-D alternatives (e.g. UNIFESP exams)
ALTER TABLE questions ALTER COLUMN alternativa_e DROP NOT NULL;
