-- Support images in exam questions (X-rays, tables, charts, etc.)
CREATE TABLE question_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_type TEXT NOT NULL DEFAULT 'page' CHECK (image_type IN ('page', 'figure', 'table', 'xray')),
  display_order SMALLINT NOT NULL DEFAULT 0,
  alt_text TEXT,
  page_number SMALLINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (question_id, image_url)
);

CREATE INDEX idx_question_images_question ON question_images (question_id);

ALTER TABLE question_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read question_images"
  ON question_images FOR SELECT
  TO authenticated
  USING (true);
