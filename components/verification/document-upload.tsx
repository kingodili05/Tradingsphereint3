'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, File, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'sonner';

interface DocumentUploadProps {
  documentType: 'identity' | 'residency' | 'profile_picture';
  title: string;
  description: string;
  acceptedFormats: string[];
  onUploadComplete?: () => void;
}

export function DocumentUpload({
  documentType,
  title,
  description,
  acceptedFormats,
  onUploadComplete
}: DocumentUploadProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    status: 'pending' | 'approved' | 'rejected';
    uploadDate: string;
    adminNotes?: string;
  } | null>(null);

  // Check for existing uploaded document
  useEffect(() => {
    checkExistingDocument();
  }, [user, documentType]);

  const checkExistingDocument = async () => {
    if (!supabase || !user) return;

    try {
      const { data, error } = await supabase
        .from('verification_documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('document_type', documentType)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setUploadedFile({
          name: data.file_name,
          status: data.verification_status as any,
          uploadDate: data.created_at,
          adminNotes: data.admin_notes || undefined,
        });
      }
    } catch (error) {
      // No existing document found - this is fine
      console.log('No existing document found');
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFormats.includes(`.${fileExtension}`)) {
      toast.error(`Invalid file type. Accepted formats: ${acceptedFormats.join(', ')}`);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Set selected file for preview
    setSelectedFile(file);
    
    // Create preview URL for images
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    toast.success('File selected successfully. Click "Upload Document" to submit.');
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !user) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileName = `${user.id}/${documentType}/${Date.now()}_${selectedFile.name}`;
      const filePath = fileName;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('verification-documents')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message?.includes('Bucket not found')) {
          throw new Error('File storage not configured. Please contact support.');
        }
        throw uploadError;
      }

      // Save document record to database
      const { error: dbError } = await supabase
        .from('verification_documents')
        .insert({
          user_id: user.id,
          document_type: documentType,
          file_path: filePath,
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          mime_type: selectedFile.type,
          verification_status: 'pending'
        });

      if (dbError) throw dbError;

      setUploadedFile({
        name: selectedFile.name,
        status: 'pending',
        uploadDate: new Date().toISOString(),
      });

      // Send notification message to admins about new document upload
      await supabase
        .from('messages')
        .insert({
          user_id: user.id,
          sender_id: user.id,
          title: `New ${documentType} document uploaded for verification`,
          content: `User ${user.email} has uploaded a ${documentType} document (${selectedFile.name}) for verification. Please review in the admin panel.`,
          message_type: 'admin',
          is_important: true,
        });

      // Clear selected file and preview
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast.success('Document uploaded successfully! Admins will review it shortly.');
      onUploadComplete?.();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // Clean up preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="space-y-4">
        {/* Instructions for Production Setup */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="text-yellow-600">⚠️</div>
            <div>
              <h4 className="font-semibold text-yellow-900">Demo Mode</h4>
              <p className="text-sm text-yellow-800">
                Document upload is running in demo mode. In production, create a 'verification-documents' 
                bucket in Supabase Storage to enable actual file storage.
              </p>
            </div>
          </div>
        </div>

        {uploadedFile ? (
          <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{uploadedFile.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(uploadedFile.status)}
                <Badge className={getStatusColor(uploadedFile.status)}>
                  {uploadedFile.status.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Uploaded: {new Date(uploadedFile.uploadDate).toLocaleString()}
            </div>
            {uploadedFile.adminNotes && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                <strong>Admin Notes:</strong> {uploadedFile.adminNotes}
              </div>
            )}
            {(uploadedFile.status === 'rejected' || !uploadedFile) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUploadedFile(null);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="w-full"
              >
                Upload New Document
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={handleUploadAreaClick}
            >
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                {selectedFile ? `Selected: ${selectedFile.name}` : `Click to upload your ${documentType} document`}
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: {acceptedFormats.join(', ')} (Max 5MB)
              </p>
            </div>

            {/* File Preview */}
            {selectedFile && (
              <div className="border rounded-lg p-4 space-y-3 bg-blue-50">
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{selectedFile.name}</div>
                    <div className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
                    </div>
                  </div>
                </div>
                
                {previewUrl && (
                  <div className="mt-3">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="max-w-full h-32 object-contain mx-auto border rounded"
                    />
                  </div>
                )}
              </div>
            )}

            <Input
              ref={fileInputRef}
              type="file"
              accept={acceptedFormats.join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex space-x-2">
              <Button
                onClick={handleUploadAreaClick}
                disabled={uploading}
                variant="outline"
                className="flex-1"
              >
                {selectedFile ? 'Choose Different File' : 'Choose File'}
              </Button>
              
              {selectedFile && (
                <Button
                  onClick={handleFileUpload}
                  disabled={uploading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={uploading}
                >
                  {uploading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    selectedFile ? 'Upload Document' : 'Choose File First'
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
    </div>
  );
}