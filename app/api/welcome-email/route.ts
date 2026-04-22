import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, welcomeEmailHtml } from '@/lib/email'

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

    // Verify the user's JWT token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if welcome email was already sent (avoid duplicates)
    const { data: existing } = await supabaseAdmin
      .from('messages')
      .select('id')
      .eq('user_id', user.id)
      .eq('title', 'Welcome to TradingSphereIntl!')
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ success: true, skipped: true })
    }

    // Fetch user profile for their name
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('first_name, email')
      .eq('id', user.id)
      .single()

    const name = profile?.first_name || 'Valued Client'
    const email = profile?.email || user.email!

    // Send the welcome email
    await sendEmail({
      to: email,
      subject: `Welcome to TradingSphereIntl! Your account is verified`,
      html: welcomeEmailHtml(name),
    })

    // Store in-app welcome message
    await supabaseAdmin.from('messages').insert({
      user_id: user.id,
      title: 'Welcome to TradingSphereIntl!',
      content: `Hi ${name}, your email has been verified and your account is fully active. Welcome to the TradingSphereIntl investment platform!`,
      message_type: 'system',
      is_important: true,
    })

    // Also mark email as verified in profile
    await supabaseAdmin
      .from('profiles')
      .update({ is_email_verified: true, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[Welcome Email API] Error:', error.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
