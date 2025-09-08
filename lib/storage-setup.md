# Supabase Storage Setup Instructions

## Step 1: Create Storage Bucket

1. Open your Supabase Dashboard
2. Go to Storage section
3. Click "Create a new bucket"
4. Name: `verification-documents`
5. Set as **Private bucket** (documents contain sensitive information)
6. Enable RLS (Row Level Security)

## Step 2: Configure Storage Policies

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Create storage policies for verification documents
INSERT INTO storage.buckets (id, name, public) VALUES ('verification-documents', 'verification-documents', false);

-- Allow authenticated users to upload their own documents
CREATE POLICY "Users can upload verification documents" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'verification-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to view their own documents
CREATE POLICY "Users can view own documents" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'verification-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow admins to view all documents
CREATE POLICY "Admins can view all documents" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'verification-documents' AND EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
));

-- Allow admins to delete documents if needed
CREATE POLICY "Admins can delete documents" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'verification-documents' AND EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
));
```

## Step 3: Enable File Downloads

The code will automatically work once the bucket is created!