export interface User {
  id: string;
  email: string;
  created_at: string;
  last_login: string;
}

export interface SlangTerm {
  id: string;
  term: string;
  meaning: string;
  created_at: string;
  user_id: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  is_ai: boolean;
  created_at: string;
  user_id: string;
}