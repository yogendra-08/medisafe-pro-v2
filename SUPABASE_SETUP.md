# Supabase Setup Guide for MediSafe Pro

This guide will help you set up Supabase for authentication, storage, and database functionality.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Note down your project URL and anon key

## 2. Set Up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Google AI Configuration
GEMINI_API_KEY=your_google_ai_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:9002
NODE_ENV=development
```

## 3. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL from `supabase-schema.sql` to create the necessary tables and policies

## 4. Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure your site URL: `http://localhost:9002`
3. Add redirect URLs:
   - `http://localhost:9002/auth/callback`
   - `http://localhost:9002/auth/reset-password`

## 5. Set Up Storage

1. In your Supabase dashboard, go to Storage
2. Create a new bucket called `documents`
3. Set the bucket to private
4. Create a storage policy for the `documents` bucket:

```sql
-- Allow users to upload files to their own folder
CREATE POLICY "Users can upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own files
CREATE POLICY "Users can view their own files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own files
CREATE POLICY "Users can update their own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## 6. Configure Google OAuth (Optional)

If you want to enable Google sign-in:

1. Go to Authentication > Providers in your Supabase dashboard
2. Enable Google provider
3. Add your Google OAuth credentials (Client ID and Secret)

## 7. Test the Setup

1. Start your development server: `npm run dev`
2. Try to sign up/sign in
3. Test file upload functionality
4. Verify that documents are stored in Supabase

## Migration Notes

- Firebase authentication has been replaced with Supabase Auth
- Google Sheets integration has been replaced with Supabase Storage and Database
- All file uploads now go to Supabase Storage
- Document metadata is stored in Supabase Database
- Row Level Security (RLS) is enabled for data protection

## Troubleshooting

- If you get authentication errors, check your Supabase URL and anon key
- If file uploads fail, verify your storage bucket is set up correctly
- If database queries fail, ensure the schema has been applied correctly 