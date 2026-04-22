import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  sendEmail,
  withdrawalApprovedEmailHtml,
  withdrawalRejectedEmailHtml,
  withdrawalReceivedEmailHtml,
} from '@/lib/email'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { withdrawalId, status } = body

    if (!withdrawalId || !['submitted', 'completed', 'failed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    // For admin actions (completed/failed), verify caller is admin
    if (status !== 'submitted') {
      const { data: callerProfile } = await supabaseAdmin
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!callerProfile?.is_admin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const { data: withdrawal, error: wErr } = await supabaseAdmin
      .from('withdrawals')
      .select('*, profiles!withdrawals_user_id_fkey(full_name, first_name, email)')
      .eq('id', withdrawalId)
      .single()

    if (wErr || !withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 })
    }

    const profile = (withdrawal as any).profiles
    const name = profile?.full_name || profile?.first_name || 'Valued Client'
    const email = profile?.email

    if (!email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 404 })
    }

    if (status === 'submitted') {
      await sendEmail({
        to: email,
        subject: 'Withdrawal Request Received — TradingSphereIntl',
        html: withdrawalReceivedEmailHtml({
          name,
          amount: withdrawal.amount,
          currency: withdrawal.currency,
          method: withdrawal.withdrawal_method,
        }),
      })
    } else if (status === 'completed') {
      await sendEmail({
        to: email,
        subject: 'Your withdrawal has been processed — TradingSphereIntl',
        html: withdrawalApprovedEmailHtml({
          name,
          amount: withdrawal.amount,
          currency: withdrawal.currency,
          method: withdrawal.withdrawal_method,
        }),
      })
    } else {
      await sendEmail({
        to: email,
        subject: 'Withdrawal request update — TradingSphereIntl',
        html: withdrawalRejectedEmailHtml({
          name,
          amount: withdrawal.amount,
          currency: withdrawal.currency,
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[Withdrawal Notification API] Error:', error.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
