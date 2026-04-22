import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, ADMIN_EMAIL } from '@/lib/email';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { documentType } = await req.json();

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single();

  const userName = profile?.full_name || user.email || 'Unknown User';
  const userEmail = profile?.email || user.email || '';
  const docLabel = documentType === 'identity' ? 'Identity (Government ID)' : 'Proof of Address';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tradingsphereint.online';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#1a3c8f;padding:28px 40px;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">📈 TradingSphereIntl</h1>
            <p style="margin:4px 0 0;color:#a8c0f0;font-size:13px;">Professional Investment Platform</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <h2 style="margin:0 0 6px;color:#1a3c8f;font-size:20px;">🔐 New Document Verification Request</h2>
            <p style="margin:0 0 24px;color:#666;font-size:14px;">A user has submitted a document for verification review.</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8edf3;border-radius:6px;overflow:hidden;margin-bottom:24px;">
              <tr style="background:#f8f9fb;">
                <td style="padding:10px 16px;color:#888;font-size:13px;font-weight:600;width:140px;border-bottom:1px solid #e8edf3;">User</td>
                <td style="padding:10px 16px;color:#222;font-size:14px;border-bottom:1px solid #e8edf3;">${userName}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;color:#888;font-size:13px;font-weight:600;border-bottom:1px solid #e8edf3;">Email</td>
                <td style="padding:10px 16px;font-size:14px;border-bottom:1px solid #e8edf3;">
                  <a href="mailto:${userEmail}" style="color:#1a3c8f;">${userEmail}</a>
                </td>
              </tr>
              <tr style="background:#f8f9fb;">
                <td style="padding:10px 16px;color:#888;font-size:13px;font-weight:600;border-bottom:1px solid #e8edf3;">Document Type</td>
                <td style="padding:10px 16px;color:#222;font-size:14px;font-weight:600;border-bottom:1px solid #e8edf3;">${docLabel}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;color:#888;font-size:13px;font-weight:600;">Submitted At</td>
                <td style="padding:10px 16px;color:#222;font-size:14px;">${new Date().toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short' })} ET</td>
              </tr>
            </table>

            <div style="background:#fff8e6;border:1px solid #f0c040;border-radius:8px;padding:16px;margin-bottom:24px;">
              <p style="margin:0;color:#92620a;font-size:13px;">
                ⚠️ Action required: Log in to the admin dashboard and navigate to <strong>Verification Requests</strong> to review and approve or reject this document.
              </p>
            </div>

            <a href="${siteUrl}/admin/users" style="display:inline-block;background:#1a3c8f;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:600;">
              Go to Admin Dashboard →
            </a>
          </td>
        </tr>
        <tr>
          <td style="background:#f8f9fb;border-top:1px solid #e8edf3;padding:20px 40px;text-align:center;">
            <p style="margin:0;color:#888;font-size:12px;">
              © ${new Date().getFullYear()} TradingSphereIntl. All rights reserved.<br/>
              <a href="mailto:${ADMIN_EMAIL}" style="color:#1a3c8f;text-decoration:none;">${ADMIN_EMAIL}</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Action Required] Verification Request — ${userName} (${docLabel})`,
    html,
  });

  return NextResponse.json({ success: true });
}
