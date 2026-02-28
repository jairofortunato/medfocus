-- ============================================================
-- Med Estudo Focado - Complete Database Schema
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. EXAMS
-- ============================================================
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  ano SMALLINT NOT NULL,
  total_questoes SMALLINT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_exams_slug ON exams (slug);
CREATE INDEX idx_exams_is_active ON exams (is_active) WHERE is_active = true;

-- ============================================================
-- 2. TAGS
-- ============================================================
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tags_slug ON tags (slug);

-- ============================================================
-- 3. QUESTIONS
-- ============================================================
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  numero SMALLINT NOT NULL,
  enunciado TEXT NOT NULL,
  alternativa_a TEXT NOT NULL,
  alternativa_b TEXT NOT NULL,
  alternativa_c TEXT NOT NULL,
  alternativa_d TEXT NOT NULL,
  alternativa_e TEXT NOT NULL,
  resposta_correta CHAR(1) NOT NULL CHECK (resposta_correta IN ('A', 'B', 'C', 'D', 'E')),
  explicacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (exam_id, numero)
);

CREATE INDEX idx_questions_exam_id ON questions (exam_id);
CREATE INDEX idx_questions_exam_numero ON questions (exam_id, numero);

-- ============================================================
-- 4. QUESTION_TAGS (join table)
-- ============================================================
CREATE TABLE question_tags (
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (question_id, tag_id)
);

CREATE INDEX idx_question_tags_tag_id ON question_tags (tag_id);

-- ============================================================
-- 5. PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 6. STUDY_SESSIONS
-- ============================================================
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  planned_duration_secs INTEGER NOT NULL DEFAULT 1500,
  actual_duration_secs INTEGER,
  session_type TEXT NOT NULL DEFAULT 'pomodoro' CHECK (session_type IN ('pomodoro', 'free_study')),
  questions_answered SMALLINT NOT NULL DEFAULT 0,
  questions_correct SMALLINT NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_study_sessions_user_id ON study_sessions (user_id);
CREATE INDEX idx_study_sessions_user_exam ON study_sessions (user_id, exam_id);
CREATE INDEX idx_study_sessions_started_at ON study_sessions (user_id, started_at DESC);

-- ============================================================
-- 7. USER_ANSWERS
-- ============================================================
CREATE TABLE user_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer CHAR(1) NOT NULL CHECK (selected_answer IN ('A', 'B', 'C', 'D', 'E')),
  is_correct BOOLEAN NOT NULL,
  time_spent_ms INTEGER,
  session_id UUID REFERENCES study_sessions(id) ON DELETE SET NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, question_id)
);

CREATE INDEX idx_user_answers_user_id ON user_answers (user_id);
CREATE INDEX idx_user_answers_user_question ON user_answers (user_id, question_id);
CREATE INDEX idx_user_answers_session ON user_answers (session_id) WHERE session_id IS NOT NULL;

-- ============================================================
-- 8. USER_EXAM_PROGRESS
-- ============================================================
CREATE TABLE user_exam_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  current_question_numero SMALLINT NOT NULL DEFAULT 1,
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, exam_id)
);

CREATE INDEX idx_user_exam_progress_user ON user_exam_progress (user_id);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get tag statistics for a user on an exam
CREATE OR REPLACE FUNCTION get_tag_statistics(p_user_id UUID, p_exam_id UUID)
RETURNS TABLE (
  tag_name TEXT,
  tag_slug TEXT,
  total BIGINT,
  answered BIGINT,
  correct BIGINT,
  percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.nome AS tag_name,
    t.slug AS tag_slug,
    COUNT(DISTINCT q.id) AS total,
    COUNT(DISTINCT ua.id) AS answered,
    COUNT(DISTINCT CASE WHEN ua.is_correct THEN ua.id END) AS correct,
    CASE
      WHEN COUNT(DISTINCT ua.id) > 0
      THEN ROUND((COUNT(DISTINCT CASE WHEN ua.is_correct THEN ua.id END)::NUMERIC / COUNT(DISTINCT ua.id)) * 100, 1)
      ELSE 0
    END AS percentage
  FROM tags t
  JOIN question_tags qt ON qt.tag_id = t.id
  JOIN questions q ON q.id = qt.question_id AND q.exam_id = p_exam_id
  LEFT JOIN user_answers ua ON ua.question_id = q.id AND ua.user_id = p_user_id
  GROUP BY t.id, t.nome, t.slug
  ORDER BY percentage DESC, t.nome ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get study streak (consecutive days with study sessions)
CREATE OR REPLACE FUNCTION get_study_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  streak INTEGER := 0;
  check_date DATE := CURRENT_DATE;
  has_session BOOLEAN;
BEGIN
  LOOP
    SELECT EXISTS (
      SELECT 1 FROM study_sessions
      WHERE user_id = p_user_id
        AND started_at::DATE = check_date
    ) INTO has_session;

    IF NOT has_session THEN
      -- Allow checking yesterday if today has no session yet
      IF check_date = CURRENT_DATE AND streak = 0 THEN
        check_date := check_date - 1;
        CONTINUE;
      END IF;
      EXIT;
    END IF;

    streak := streak + 1;
    check_date := check_date - 1;
  END LOOP;

  RETURN streak;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- updated_at triggers
CREATE TRIGGER set_exams_updated_at
  BEFORE UPDATE ON exams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_exam_progress ENABLE ROW LEVEL SECURITY;

-- Content tables: SELECT only for authenticated users
CREATE POLICY "Authenticated users can read exams"
  ON exams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read tags"
  ON tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read question_tags"
  ON question_tags FOR SELECT
  TO authenticated
  USING (true);

-- Profiles: SELECT all, INSERT/UPDATE own
CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- User answers: SELECT + INSERT own, NO UPDATE/DELETE (answer locking)
CREATE POLICY "Users can read own answers"
  ON user_answers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answers"
  ON user_answers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Study sessions: SELECT + INSERT + UPDATE own
CREATE POLICY "Users can read own sessions"
  ON study_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON study_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON study_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User exam progress: SELECT + INSERT + UPDATE own
CREATE POLICY "Users can read own progress"
  ON user_exam_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_exam_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_exam_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
