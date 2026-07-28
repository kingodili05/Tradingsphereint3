import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail, balanceAdjustmentEmailHtml } from '@/lib/email';

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

  const { data: adminProfile } = await supabaseAdmin
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!(adminProfile as any)?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { userId, amount, currency, adjustmentType, newBalance } = await req.json();

  if (!userId || typeof amount !== 'number' || amount <= 0 || !currency ||
      !['increase', 'decrease'].includes(adjustmentType) || typeof newBalance !== 'number') {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('full_name, email')
    .eq('id', userId)
    .single();

  const email = (profile as any)?.email;
  if (!email) {
    return NextResponse.json({ error: 'User email not found' }, { status: 404 });
  }

  const name = (profile as any)?.full_name || 'Valued Customer';
  const isIncrease = adjustmentType === 'increase';

  const html = balanceAdjustmentEmailHtml({
    name,
    amount,
    currency,
    adjustmentType,
    newBalance,
  });

  const formattedAmount = currency === 'USD'
    ? `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    : `${amount} ${currency}`;

  const subject = isIncrease
    ? `Account Credited — ${formattedAmount} added to your balance`
    : `Account Debited — ${formattedAmount} deducted from your balance`;

  const result = await sendEmail({ to: email, subject, html });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
