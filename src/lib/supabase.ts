import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket for file uploads
export const storage = supabase.storage;

// Database types
export interface File {
  id: string;
  name: string;
  url: string;
  size: number;
  mime_type: string;
  user_id: string;
  document_type?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  file_id?: string;
  user_id: string;
  summary?: string;
  document_type?: string;
  created_at: string;
  updated_at: string;
} 