import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, depositReceivedEmailHtml, depositApprovedEmailHtml, depositRejectedEmailHtml } from '@/lib/email';

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

  const { depositId, event } = await req.json();
  if (!depositId || !event) {
    return NextResponse.json({ error: 'Missing depositId or event' }, { status: 400 });
  }

  const { data: deposit } = await supabaseAdmin
    .from('deposits')
    .select('*, profiles(full_name, email)')
    .eq('id', depositId)
    .single();

  if (!deposit) {
    return NextResponse.json({ error: 'Deposit not found' }, { status: 404 });
  }

  const profile = (deposit as any).profiles;
  const name = profile?.full_name || user.email || 'Valued Customer';
  const email = profile?.email || user.email || '';

  if (!email) {
    return NextResponse.json({ error: 'User email not found' }, { status: 400 });
  }

  let html: string;
  let subject: string;

  switch (event) {
    case 'submitted':
      html = depositReceivedEmailHtml({
        name,
        amount: deposit.amount,
        currency: deposit.currency,
        method: deposit.payment_method,
      });
      subject = `Deposit Request Received — ${deposit.currency} ${deposit.amount}`;
      break;

    case 'approved':
      html = depositApprovedEmailHtml({
        name,
        amount: deposit.amount,
        currency: deposit.currency,
        method: deposit.payment_method,
      });
      subject = `Deposit Approved — ${deposit.currency} ${deposit.amount} credited to your account`;
      break;

    case 'rejected':
      html = depositRejectedEmailHtml({
        name,
        amount: deposit.amount,
        currency: deposit.currency,
      });
      subject = `Deposit Request Update — ${deposit.currency} ${deposit.amount}`;
      break;

    default:
      return NextResponse.json({ error: 'Unknown event' }, { status: 400 });
  }

  await sendEmail({ to: email, subject, html });

  return NextResponse.json({ success: true });
}
