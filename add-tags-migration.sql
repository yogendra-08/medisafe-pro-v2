-- Migration to add tags column to documents table
-- Run this in your Supabase SQL Editor if you have existing data

-- Add tags column to documents table
ALTER TABLE documents ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Update existing documents to have empty tags array
UPDATE documents SET tags = '{}' WHERE tags IS NULL; 