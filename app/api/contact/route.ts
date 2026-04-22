import { NextRequest, NextResponse } from 'next/server'
import {
  sendEmail,
  ADMIN_EMAIL,
  contactAdminEmailHtml,
  contactAcknowledgementEmailHtml,
} from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Send notification email to admin
    const adminResult = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `[Contact Form] ${subject} — from ${name}`,
      html: contactAdminEmailHtml({ name, email, phone, subject, message }),
    })

    // Send acknowledgement email to the user (non-blocking — don't fail if this fails)
    sendEmail({
      to: email,
      subject: 'We received your message — TradingSphereIntl',
      html: contactAcknowledgementEmailHtml(name),
    }).catch((err) => console.error('[Email] Acknowledgement failed:', err))

    if (!adminResult.success) {
      console.error('[Contact API] Admin email failed:', adminResult.error)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[Contact API] Error:', error.message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
