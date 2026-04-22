import { Resend } from 'resend'

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'support@tradingsphereint.online'
export const FROM_EMAIL = process.env.RESEND_FROM || 'onboarding@resend.dev'
const SITE_NAME = 'TradingSphereIntl'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tradingsphereint.online'

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[]
  subject: string
  html: string
}) {
  const resend = getResend()
  if (!resend) {
    console.warn('[Email] RESEND_API_KEY not configured. Skipping email to:', to)
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

  try {
    const { error } = await resend.emails.send({
      from: `${SITE_NAME} <${FROM_EMAIL}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    })

    if (error) {
      console.error('[Email] Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('[Email] Failed to send to', to, ':', error.message)
    return { success: false, error: error.message }
  }
}

// ─── Email Templates ──────────────────────────────────────────────────────────

function baseLayout(content: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${SITE_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:#1a3c8f;padding:28px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">
                📈 ${SITE_NAME}
              </h1>
              <p style="margin:4px 0 0;color:#a8c0f0;font-size:13px;">Professional Investment Platform</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:36px 40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8f9fb;border-top:1px solid #e8edf3;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#888;font-size:12px;">
                © ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.<br/>
                786 Eddy St, Providence, Rhode Island 02905, USA<br/>
                <a href="mailto:${ADMIN_EMAIL}" style="color:#1a3c8f;text-decoration:none;">${ADMIN_EMAIL}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function contactAdminEmailHtml(data: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}) {
  return baseLayout(`
    <h2 style="margin:0 0 6px;color:#1a3c8f;font-size:20px;">New Contact Form Submission</h2>
    <p style="margin:0 0 24px;color:#666;font-size:14px;">Someone submitted the contact form on ${SITE_NAME}.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8edf3;border-radius:6px;overflow:hidden;margin-bottom:24px;">
      <tr style="background:#f8f9fb;">
        <td style="padding:10px 16px;color:#888;font-size:13px;font-weight:600;width:120px;border-bottom:1px solid #e8edf3;">Name</td>
        <td style="padding:10px 16px;color:#222;font-size:14px;border-bottom:1px solid #e8edf3;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding:10px 16px;color:#888;font-size:13px;font-weight:600;border-bottom:1px solid #e8edf3;">Email</td>
        <td style="padding:10px 16px;font-size:14px;border-bottom:1px solid #e8edf3;">
          <a href="mailto:${data.email}" style="color:#1a3c8f;">${data.email}</a>
        </td>
      </tr>
      ${data.phone ? `
      <tr style="background:#f8f9fb;">
        <td style="padding:10px 16px;color:#888;font-size:13px;font-weight:600;border-bottom:1px solid #e8edf3;">Phone</td>
        <td style="padding:10px 16px;color:#222;font-size:14px;border-bottom:1px solid #e8edf3;">${data.phone}</td>
      </tr>` : ''}
      <tr ${data.phone ? '' : 'style="background:#f8f9fb;"'}>
        <td style="padding:10px 16px;color:#888;font-size:13px;font-weight:600;border-bottom:1px solid #e8edf3;">Subject</td>
        <td style="padding:10px 16px;color:#222;font-size:14px;border-bottom:1px solid #e8edf3;">${data.subject}</td>
      </tr>
    </table>

    <p style="margin:0 0 8px;color:#888;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
    <div style="background:#f8f9fb;border:1px solid #e8edf3;border-radius:6px;padding:16px;color:#333;font-size:14px;line-height:1.6;white-space:pre-wrap;">${data.message}</div>

    <div style="margin-top:28px;padding:16px;background:#eef3ff;border-radius:6px;border-left:3px solid #1a3c8f;">
      <p style="margin:0;color:#1a3c8f;font-size:13px;">
        Reply directly to <strong>${data.name}</strong> at <strong>${data.email}</strong>.
      </p>
    </div>
  `)
}

export function contactAcknowledgementEmailHtml(name: string) {
  return baseLayout(`
    <h2 style="margin:0 0 16px;color:#1a3c8f;font-size:22px;">We received your message!</h2>
    <p style="margin:0 0 16px;color:#444;font-size:15px;line-height:1.7;">
      Hi <strong>${name}</strong>,<br/><br/>
      Thank you for reaching out to ${SITE_NAME}. We have received your message and our support team will get back to you within <strong>24–48 business hours</strong>.
    </p>
    <p style="margin:0 0 24px;color:#444;font-size:15px;line-height:1.7;">
      If your inquiry is urgent, please call us at <a href="tel:+19132823212" style="color:#1a3c8f;">+1-913-282-3212</a> or email <a href="mailto:${ADMIN_EMAIL}" style="color:#1a3c8f;">${ADMIN_EMAIL}</a>.
    </p>
    <a href="${SITE_URL}" style="display:inline-block;background:#1a3c8f;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:600;">
      Visit Platform
    </a>
  `)
}

export function welcomeEmailHtml(name: string) {
  return baseLayout(`
    <h2 style="margin:0 0 8px;color:#1a3c8f;font-size:24px;">Welcome to ${SITE_NAME}! 🎉</h2>
    <p style="margin:0 0 8px;color:#666;font-size:14px;">Your email has been verified successfully.</p>

    <p style="margin:20px 0 16px;color:#444;font-size:15px;line-height:1.7;">
      Hi <strong>${name}</strong>,<br/><br/>
      Congratulations! Your account is now fully verified and active. You now have full access to our professional investment platform.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="padding:0 8px 0 0;" width="50%">
          <div style="background:#f0f7ff;border-radius:8px;padding:16px;border:1px solid #d0e4ff;">
            <p style="margin:0 0 6px;color:#1a3c8f;font-size:20px;">📊</p>
            <p style="margin:0 0 4px;color:#1a3c8f;font-size:14px;font-weight:600;">Live Trading</p>
            <p style="margin:0;color:#666;font-size:12px;">Access real-time markets and execute trades</p>
          </div>
        </td>
        <td style="padding:0 0 0 8px;" width="50%">
          <div style="background:#f0fff4;border-radius:8px;padding:16px;border:1px solid #c3f0d0;">
            <p style="margin:0 0 6px;color:#1a3c8f;font-size:20px;">💰</p>
            <p style="margin:0 0 4px;color:#1a3c8f;font-size:14px;font-weight:600;">Portfolio Growth</p>
            <p style="margin:0;color:#666;font-size:12px;">Grow your wealth with expert signals</p>
          </div>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 24px;color:#444;font-size:14px;line-height:1.7;">
      To get started, fund your account and explore our trading packages. Our team is here to help you every step of the way.
    </p>

    <a href="${SITE_URL}/dashboard" style="display:inline-block;background:#1a3c8f;color:#fff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:15px;font-weight:600;">
      Go to Dashboard →
    </a>

    <p style="margin:28px 0 0;color:#888;font-size:13px;border-top:1px solid #e8edf3;padding-top:20px;">
      Need help? Contact our support team at <a href="mailto:${ADMIN_EMAIL}" style="color:#1a3c8f;">${ADMIN_EMAIL}</a> or call <a href="tel:+19132823212" style="color:#1a3c8f;">+1-913-282-3212</a>.
    </p>
  `)
}

export function withdrawalApprovedEmailHtml(data: {
  name: string
  amount: number
  currency: string
  method: string
}) {
  const formattedAmount = data.currency === 'USD'
    ? `$${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    : `${data.amount} ${data.currency}`

  return baseLayout(`
    <h2 style="margin:0 0 8px;color:#16a34a;font-size:22px;">Withdrawal Approved ✅</h2>
    <p style="margin:0 0 24px;color:#666;font-size:14px;">Your withdrawal request has been processed.</p>

    <p style="margin:0 0 20px;color:#444;font-size:15px;line-height:1.7;">
      Hi <strong>${data.name}</strong>,<br/><br/>
      Great news! Your withdrawal request has been <strong>approved and processed</strong> by our finance team.
    </p>

    <div style="background:#f0fff4;border:1px solid #c3f0d0;border-radius:8px;padding:20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="color:#888;font-size:13px;padding-bottom:8px;">Amount</td>
          <td style="text-align:right;font-size:22px;font-weight:700;color:#16a34a;">${formattedAmount}</td>
        </tr>
        <tr>
          <td style="color:#888;font-size:13px;padding-bottom:8px;">Currency</td>
          <td style="text-align:right;color:#333;font-size:14px;">${data.currency}</td>
        </tr>
        <tr>
          <td style="color:#888;font-size:13px;">Method</td>
          <td style="text-align:right;color:#333;font-size:14px;text-transform:capitalize;">${data.method.replace(/_/g, ' ')}</td>
        </tr>
      </table>
    </div>

    <p style="margin:0 0 24px;color:#444;font-size:14px;line-height:1.7;">
      Please allow <strong>1–5 business days</strong> for the funds to appear in your account depending on your withdrawal method.
    </p>

    <a href="${SITE_URL}/dashboard" style="display:inline-block;background:#1a3c8f;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:600;">
      View Dashboard
    </a>

    <p style="margin:24px 0 0;color:#888;font-size:13px;">
      Questions? Contact <a href="mailto:${ADMIN_EMAIL}" style="color:#1a3c8f;">${ADMIN_EMAIL}</a>
    </p>
  `)
}

export function withdrawalRejectedEmailHtml(data: {
  name: string
  amount: number
  currency: string
  reason?: string
}) {
  const formattedAmount = data.currency === 'USD'
    ? `$${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    : `${data.amount} ${data.currency}`

  return baseLayout(`
    <h2 style="margin:0 0 8px;color:#dc2626;font-size:22px;">Withdrawal Request Update</h2>
    <p style="margin:0 0 24px;color:#666;font-size:14px;">An update regarding your recent withdrawal request.</p>

    <p style="margin:0 0 20px;color:#444;font-size:15px;line-height:1.7;">
      Hi <strong>${data.name}</strong>,<br/><br/>
      We regret to inform you that your withdrawal request for <strong>${formattedAmount}</strong> was <strong>not approved</strong> at this time.
    </p>

    ${data.reason ? `
    <div style="background:#fff5f5;border:1px solid #fecaca;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="margin:0 0 6px;color:#dc2626;font-size:13px;font-weight:600;">Reason:</p>
      <p style="margin:0;color:#555;font-size:14px;">${data.reason}</p>
    </div>` : ''}

    <p style="margin:0 0 24px;color:#444;font-size:14px;line-height:1.7;">
      Your funds have <strong>not been deducted</strong> and remain available in your account. If you believe this is an error or need assistance, please contact our support team.
    </p>

    <a href="${SITE_URL}/dashboard" style="display:inline-block;background:#1a3c8f;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:600;">
      View Dashboard
    </a>

    <p style="margin:24px 0 0;color:#888;font-size:13px;">
      Contact support: <a href="mailto:${ADMIN_EMAIL}" style="color:#1a3c8f;">${ADMIN_EMAIL}</a> | <a href="tel:+19132823212" style="color:#1a3c8f;">+1-913-282-3212</a>
    </p>
  `)
}
