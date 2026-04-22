'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase-client';
import {
  CheckCircle, XCircle, Download, Eye, User, FileText, Home,
  AlertTriangle, RefreshCw, ExternalLink, Image as ImageIcon,
} from 'lucide-react';
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

const BUCKET = 'verification-documents';

export function VerificationReview() {
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [selected, setSelected] = useState<VerificationDocument | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => { fetchDocuments(); }, []);

  useEffect(() => {
    if (selected) {
      loadPreview(selected);
    } else {
      setPreviewUrl(null);
      setPreviewError(null);
    }
  }, [selected?.id]);

  const fetchDocuments = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('verification_documents')
      .select(`*, profiles!verification_documents_user_id_fkey(id, full_name, email)`)
      .order('created_at', { ascending: false });
    if (data && !error) setDocuments(data as VerificationDocument[]);
    setLoading(false);
  };

  const isPendingStorage = (filePath: string) => filePath.startsWith('pending-storage/');

  const getRealPath = (filePath: string) =>
    filePath.startsWith('pending-storage/') ? filePath.replace('pending-storage/', '') : filePath;

  const loadPreview = async (doc: VerificationDocument) => {
    if (!supabase) return;
    setPreviewUrl(null);
    setPreviewError(null);

    if (isPendingStorage(doc.file_path)) {
      setPreviewError('no-storage');
      return;
    }

    setPreviewLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(doc.file_path, 3600); // 1-hour signed URL

      if (error) {
        if (error.message?.toLowerCase().includes('bucket')) {
          setPreviewError('no-bucket');
        } else if (error.message?.toLowerCase().includes('not found')) {
          setPreviewError('not-found');
        } else {
          setPreviewError(error.message);
        }
      } else {
        setPreviewUrl(data.signedUrl);
      }
    } catch (e: any) {
      setPreviewError(e.message || 'Failed to load preview');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleView = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownload = async () => {
    if (!supabase || !selected) return;
    if (isPendingStorage(selected.file_path)) {
      toast.error('File was not stored (storage bucket was not set up when this document was submitted). See setup instructions below.');
      return;
    }
    try {
      if (previewUrl) {
        // Use the signed URL directly for download
        const a = document.createElement('a');
        a.href = previewUrl;
        a.download = selected.file_name;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success('Download started');
        return;
      }
      const { data, error } = await supabase.storage.from(BUCKET).download(selected.file_path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = selected.file_name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Downloaded: ' + selected.file_name);
    } catch (e: any) {
      toast.error('Download failed: ' + (e.message || 'Unknown error'));
    }
  };

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (!supabase || !selected) return;
    setProcessing(true);
    try {
      const { data: { user: admin } } = await supabase.auth.getUser();

      const { error: docErr } = await supabase
        .from('verification_documents')
        .update({
          verification_status: status,
          reviewed_by: admin?.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes || null,
        })
        .eq('id', selected.id);
      if (docErr) throw docErr;

      if (status === 'approved') {
        const field = selected.document_type === 'identity'
          ? 'is_identity_verified'
          : selected.document_type === 'residency'
          ? 'is_residency_verified'
          : null;

        if (field) {
          await supabase.from('profiles').update({ [field]: true, updated_at: new Date().toISOString() }).eq('id', selected.user_id);
        }

        await supabase.from('messages').insert({
          user_id: selected.user_id,
          sender_id: admin?.id,
          title: `${selected.document_type === 'identity' ? 'Identity' : 'Address'} Verification Approved ✅`,
          content: `Great news! Your ${selected.document_type} verification has been approved. Your account is now fully verified.`,
          message_type: 'system',
          is_important: true,
        });
      } else {
        await supabase.from('messages').insert({
          user_id: selected.user_id,
          sender_id: admin?.id,
          title: `${selected.document_type === 'identity' ? 'Identity' : 'Address'} Verification Requires Attention`,
          content: `Your ${selected.document_type} verification could not be approved at this time. ${adminNotes ? `Reason: ${adminNotes}` : 'Please upload a clearer document and resubmit.'}`,
          message_type: 'alert',
          is_important: true,
        });
      }

      toast.success(`Document ${status}`);
      setSelected(null);
      setAdminNotes('');
      await fetchDocuments();
    } catch (e: any) {
      toast.error('Failed to update: ' + e.message);
    } finally {
      setProcessing(false);
    }
  };

  const statusColor = (s: string) =>
    s === 'approved' ? 'bg-green-500' : s === 'rejected' ? 'bg-red-500' : 'bg-yellow-500';

  const formatSize = (b: number) => {
    if (b === 0) return '0 B';
    const k = 1024, sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return `${(b / k ** i).toFixed(1)} ${sizes[i]}`;
  };

  const filtered = filterStatus === 'all' ? documents : documents.filter(d => d.verification_status === filterStatus);
  const pendingCount = documents.filter(d => d.verification_status === 'pending').length;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse border rounded-lg p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter + refresh bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterStatus === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? `All (${documents.length})` : s === 'pending' ? `Pending (${pendingCount})` : s}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={fetchDocuments} className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Document list ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Submissions ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <p className="text-muted-foreground text-center py-10 text-sm">No documents found</p>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {filtered.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => { setSelected(doc); setAdminNotes(doc.admin_notes || ''); }}
                    className={`border rounded-xl p-3.5 cursor-pointer transition-all ${
                      selected?.id === doc.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:border-gray-300 hover:bg-gray-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {doc.document_type === 'identity'
                          ? <User className="h-4 w-4 text-blue-500 shrink-0" />
                          : <Home className="h-4 w-4 text-purple-500 shrink-0" />}
                        <span className="font-semibold text-sm capitalize">
                          {doc.document_type === 'identity' ? 'Identity ID' : doc.document_type === 'residency' ? 'Proof of Address' : doc.document_type}
                        </span>
                        {isPendingStorage(doc.file_path) && (
                          <span title="No file stored — bucket was missing at upload time">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                          </span>
                        )}
                      </div>
                      <Badge className={`${statusColor(doc.verification_status)} text-white text-[10px] shrink-0`}>
                        {doc.verification_status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[9px]">
                          {doc.profiles.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium truncate">{doc.profiles.full_name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{doc.profiles.email}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-xs text-muted-foreground">{doc.file_name} · {formatSize(doc.file_size)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Review panel ── */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Document Review</CardTitle>
          </CardHeader>
          <CardContent>
            {!selected ? (
              <div className="text-center py-16 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a submission to review</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Meta */}
                <div className="rounded-xl border p-4 space-y-3 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold capitalize text-sm">
                      {selected.document_type === 'identity' ? 'Identity Verification' : 'Address Verification'}
                    </span>
                    <Badge className={`${statusColor(selected.verification_status)} text-white text-xs`}>
                      {selected.verification_status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-muted-foreground text-xs">Name</p><p className="font-medium">{selected.profiles.full_name}</p></div>
                    <div><p className="text-muted-foreground text-xs">Email</p><p className="font-medium truncate">{selected.profiles.email}</p></div>
                    <div><p className="text-muted-foreground text-xs">File</p><p className="font-medium truncate">{selected.file_name}</p></div>
                    <div><p className="text-muted-foreground text-xs">Size</p><p className="font-medium">{formatSize(selected.file_size)}</p></div>
                    <div><p className="text-muted-foreground text-xs">Type</p><p className="font-medium uppercase">{selected.mime_type.split('/')[1]}</p></div>
                    <div><p className="text-muted-foreground text-xs">Submitted</p><p className="font-medium">{new Date(selected.created_at).toLocaleDateString()}</p></div>
                  </div>
                </div>

                {/* Document preview */}
                <div className="rounded-xl border overflow-hidden bg-gray-50">
                  {isPendingStorage(selected.file_path) ? (
                    <div className="p-5 flex flex-col items-center gap-3 text-center">
                      <AlertTriangle className="h-8 w-8 text-amber-500" />
                      <div>
                        <p className="font-semibold text-sm text-amber-700">File Not Stored</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          This document was submitted before the storage bucket was configured.
                          The user needs to resubmit after you create the <code className="bg-amber-100 px-1 rounded">verification-documents</code> bucket.
                          See the SQL setup instructions below.
                        </p>
                      </div>
                    </div>
                  ) : previewLoading ? (
                    <div className="p-8 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : previewError === 'no-bucket' ? (
                    <div className="p-5 flex flex-col items-center gap-2 text-center">
                      <AlertTriangle className="h-7 w-7 text-red-500" />
                      <p className="font-semibold text-sm text-red-700">Storage Bucket Not Found</p>
                      <p className="text-xs text-muted-foreground">Run the SQL below to create the <code className="bg-red-50 px-1 rounded">verification-documents</code> bucket in Supabase.</p>
                    </div>
                  ) : previewError === 'not-found' ? (
                    <div className="p-5 flex flex-col items-center gap-2 text-center">
                      <FileText className="h-7 w-7 text-gray-400" />
                      <p className="text-sm text-muted-foreground">File not found in storage. It may have been deleted.</p>
                    </div>
                  ) : previewError ? (
                    <div className="p-5 text-center">
                      <p className="text-xs text-red-600">{previewError}</p>
                      <Button variant="ghost" size="sm" className="mt-2" onClick={() => loadPreview(selected)}>
                        <RefreshCw className="h-3.5 w-3.5 mr-1" /> Retry
                      </Button>
                    </div>
                  ) : previewUrl ? (
                    selected.mime_type.startsWith('image/') ? (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Document preview"
                          className="w-full max-h-64 object-contain bg-gray-100 rounded-t-xl"
                        />
                        <div className="p-2 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleView}>
                            <ExternalLink className="h-3.5 w-3.5" /> Open Full Size
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleDownload}>
                            <Download className="h-3.5 w-3.5" /> Download
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 flex flex-col items-center gap-3">
                        <FileText className="h-10 w-10 text-gray-400" />
                        <p className="text-sm text-muted-foreground">PDF document ready</p>
                        <div className="flex gap-2 w-full">
                          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleView}>
                            <Eye className="h-3.5 w-3.5" /> View PDF
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={handleDownload}>
                            <Download className="h-3.5 w-3.5" /> Download
                          </Button>
                        </div>
                      </div>
                    )
                  ) : null}
                </div>

                {/* Admin action */}
                {selected.verification_status === 'pending' && (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-semibold uppercase tracking-wide">Admin Notes (optional)</Label>
                      <Textarea
                        placeholder="Add notes for the user (shown on rejection)..."
                        value={adminNotes}
                        onChange={e => setAdminNotes(e.target.value)}
                        rows={2}
                        className="mt-1.5 text-sm resize-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleReview('approved')} disabled={processing}
                        className="flex-1 bg-green-600 hover:bg-green-700 gap-1.5">
                        <CheckCircle className="h-4 w-4" />
                        {processing ? 'Processing…' : 'Approve'}
                      </Button>
                      <Button onClick={() => handleReview('rejected')} disabled={processing}
                        variant="destructive" className="flex-1 gap-1.5">
                        <XCircle className="h-4 w-4" />
                        {processing ? 'Processing…' : 'Reject'}
                      </Button>
                    </div>
                  </div>
                )}

                {selected.verification_status !== 'pending' && selected.admin_notes && (
                  <div className="rounded-xl border p-3 bg-gray-50">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Admin Notes</p>
                    <p className="text-sm">{selected.admin_notes}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Storage setup instructions */}
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            One-Time Setup: Create Supabase Storage Bucket
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-amber-700 mb-3">
            Run the following SQL in your Supabase project's <strong>SQL Editor</strong> once to enable document storage and admin access. Documents submitted before this setup will show a warning and the user will need to resubmit.
          </p>
          <pre className="bg-gray-900 text-green-400 text-xs rounded-xl p-4 overflow-x-auto whitespace-pre leading-relaxed select-all">
{`-- Create the verification-documents storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verification-documents',
  'verification-documents',
  false,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Users: upload own files
CREATE POLICY "Users upload own verification docs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'verification-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Users: read own files
CREATE POLICY "Users read own verification docs"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'verification-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins: read all files
CREATE POLICY "Admins read all verification docs"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'verification-documents'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Admins: delete files
CREATE POLICY "Admins delete verification docs"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'verification-documents'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
