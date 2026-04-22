'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase-client';
import { CheckCircle, XCircle, Download, Eye, User, FileText, Home } from 'lucide-react';
import { toast } from 'sonner';

interface VerificationDocument {
  id: string;
  user_id: string;
  document_type: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  verification_status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  admin_notes: string | null;
  created_at: string;
  profiles: {
    id: string;
    full_name: string;
    email: string;
  };
}

export function VerificationReview() {
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<VerificationDocument | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    if (!supabase) return;

    setLoading(true);

    const { data, error } = await supabase
      .from('verification_documents')
      .select(`
        *,
        profiles!verification_documents_user_id_fkey (
          id,
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (data && !error) {
      setDocuments(data as VerificationDocument[]);
    }

    setLoading(false);
  };

  const handleDocumentReview = async (documentId: string, status: 'approved' | 'rejected') => {
    if (!supabase || !selectedDocument) return;

    setProcessing(true);

    try {
      // Get current user for reviewer tracking
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      // Update document status
      const { error: docError } = await supabase
        .from('verification_documents')
        .update({
          verification_status: status,
          reviewed_by: currentUser?.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes || null,
        })
        .eq('id', documentId);

      if (docError) throw docError;

      // Update user's verification status if approved
      if (status === 'approved') {
        const verificationField = `is_${selectedDocument.document_type}_verified`;
        
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            [verificationField]: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedDocument.user_id);

        if (profileError) throw profileError;

        // Send notification to user
        await supabase
          .from('messages')
          .insert({
            user_id: selectedDocument.user_id,
            sender_id: currentUser?.id,
            title: `${selectedDocument.document_type} Verification Approved`,
            content: `Your ${selectedDocument.document_type} verification has been approved. You now have access to additional platform features.`,
            message_type: 'system',
            is_important: true,
          });
      } else {
        // Send rejection notification
        await supabase
          .from('messages')
          .insert({
            user_id: selectedDocument.user_id,
            sender_id: currentUser?.id,
            title: `${selectedDocument.document_type} Verification Rejected`,
            content: `Your ${selectedDocument.document_type} verification was not approved. ${adminNotes ? `Reason: ${adminNotes}` : 'Please upload a clearer document and try again.'}`,
            message_type: 'alert',
            is_important: true,
          });
      }

      toast.success(`Document ${status} successfully`);
      setSelectedDocument(null);
      setAdminNotes('');
      await fetchDocuments();
    } catch (error: any) {
      toast.error('Failed to update document status: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const downloadDocument = async (filePath: string, fileName: string) => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase.storage
        .from('verification-documents')
        .download(filePath);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`Document ${fileName} downloaded successfully`);
    } catch (error: any) {
      // Handle specific storage configuration errors
      if (error?.message?.includes('Bucket not found') || 
          error?.message?.includes('bucket not found') ||
          error?.statusCode === '404' ||
          error?.body?.includes('Bucket not found')) {
        toast.error('Document storage not configured. Please set up the verification-documents bucket in Supabase Storage.');
      } else if (error?.status === 404 || error?.statusCode === '404') {
        toast.error('Document not found. The file may have been moved or deleted.');
      } else if (error?.status === 403 || error?.statusCode === '403') {
        toast.error('Access denied. Please check storage bucket permissions.');
      } else {
        const errorMessage = error?.message || 'Unknown error occurred';
        toast.error(`Failed to download document: ${fileName}. ${errorMessage}`);
      }
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'identity': return <User className="h-4 w-4" />;
      case 'residency': return <Home className="h-4 w-4" />;
      case 'profile_picture': return <User className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No documents uploaded</p>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedDocument?.id === doc.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {getDocumentTypeIcon(doc.document_type)}
                          <span className="font-medium capitalize">{doc.document_type} Verification</span>
                        </div>
                        <Badge className={getStatusColor(doc.verification_status)}>
                          {doc.verification_status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {doc.profiles.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{doc.profiles.full_name}</span>
                        <span className="text-xs text-muted-foreground">({doc.profiles.email})</span>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <div>File: {doc.file_name}</div>
                        <div>Size: {formatFileSize(doc.file_size)}</div>
                        <div>Uploaded: {new Date(doc.created_at).toLocaleString()}</div>
                        {doc.reviewed_at && (
                          <div>Reviewed: {new Date(doc.reviewed_at).toLocaleString()}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Document Review Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Document Review</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDocument ? (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold capitalize">
                        {selectedDocument.document_type} Verification
                      </h3>
                      <Badge className={getStatusColor(selectedDocument.verification_status)}>
                        {selectedDocument.verification_status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">User</div>
                        <div className="font-medium">{selectedDocument.profiles.full_name}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Email</div>
                        <div className="font-medium">{selectedDocument.profiles.email}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">File Name</div>
                        <div className="font-medium">{selectedDocument.file_name}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">File Size</div>
                        <div className="font-medium">{formatFileSize(selectedDocument.file_size)}</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadDocument(selectedDocument.file_path, selectedDocument.file_name)}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // In a real implementation, this would open the document in a viewer
                          downloadDocument(selectedDocument.file_path, selectedDocument.file_name);
                        }}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>

                {selectedDocument.verification_status === 'pending' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Admin Notes</Label>
                      <Textarea
                        placeholder="Add notes about this verification..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleDocumentReview(selectedDocument.id, 'approved')}
                        disabled={processing}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {processing ? 'Processing...' : 'Approve'}
                      </Button>
                      <Button
                        onClick={() => handleDocumentReview(selectedDocument.id, 'rejected')}
                        disabled={processing}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        {processing ? 'Processing...' : 'Reject'}
                      </Button>
                    </div>
                  </div>
                )}

                {selectedDocument.verification_status !== 'pending' && selectedDocument.admin_notes && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <Label className="font-semibold">Admin Notes:</Label>
                    <p className="text-sm text-gray-700 mt-1">{selectedDocument.admin_notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a document from the list to review</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}