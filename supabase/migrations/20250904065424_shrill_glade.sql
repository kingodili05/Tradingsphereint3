/*
  # Create Verification Documents Table

  This migration creates the verification documents storage system.

  ## 1. New Tables
    - `verification_documents` - Store uploaded verification documents
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `document_type` (text)
      - `file_path` (text)
      - `file_name` (text)
      - `file_size` (bigint)
      - `mime_type` (text)
      - `verification_status` (text)
      - `reviewed_by` (uuid, references profiles)
      - `reviewed_at` (timestamp)
      - `admin_notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  ## 2. Security
    - Enable RLS on verification_documents table
    - Users can read their own documents
    - Users can insert their own documents
    - Admins can read and update all documents
*/

CREATE TABLE IF NOT EXISTS verification_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('identity', 'residency', 'profile_picture')),
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_verification_documents_user_id ON verification_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_documents_status ON verification_documents(verification_status);
CREATE INDEX IF NOT EXISTS idx_verification_documents_type ON verification_documents(document_type);

-- Enable RLS
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for verification_documents table
CREATE POLICY "Users can read own verification documents"
  ON verification_documents
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own verification documents"
  ON verification_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all verification documents"
  ON verification_documents
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update all verification documents"
  ON verification_documents
  FOR UPDATE
  TO authenticated
  USING (public.is_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_verification_documents_updated_at
  BEFORE UPDATE ON verification_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();