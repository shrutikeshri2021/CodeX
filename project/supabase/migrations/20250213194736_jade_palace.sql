/*
  # Initial Schema for SlangSavvy

  1. Tables
    - users (managed by Supabase Auth)
    - messages
      - id (uuid, primary key)
      - content (text)
      - is_ai (boolean)
      - created_at (timestamp)
      - user_id (uuid, foreign key)
    - slang_terms
      - id (uuid, primary key)
      - term (text)
      - meaning (text)
      - created_at (timestamp)
      - user_id (uuid, foreign key)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  is_ai boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Slang Terms Table
CREATE TABLE IF NOT EXISTS slang_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL,
  meaning text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE slang_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all slang terms"
  ON slang_terms
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own slang terms"
  ON slang_terms
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);