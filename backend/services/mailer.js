/**
 * SRA TruthGuard Backend Nodemailer SMTP Dispatcher
 * Official System Sender: zainulcorp71@gmail.com
 */

const nodemailer = require('nodemailer');

const SENDER_EMAIL = process.env.GMAIL_USER || 'zainulcorp71@gmail.com';
const GMAIL_APP_PASS = process.env.GMAIL_APP_PASSWORD || process.env.EMAIL_PASS || '';

let transporter = null;

if (GMAIL_APP_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SENDER_EMAIL,
      pass: GMAIL_APP_PASS
    }
  });
}

/**
 * Dispatch real automated OTP email to user inbox
 */
async function sendOtpEmail(to, otp, purpose = 'Verification', userName = '') {
  const subject = purpose === 'registration'
    ? `[SRA TruthGuard] Your Registration Verification Code: ${otp}`
    : purpose === 'forgot_password'
    ? `[SRA TruthGuard] Your Password Reset Code: ${otp}`
    : `[SRA TruthGuard] Security Verification Code: ${otp}`;

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px; max-width: 500px; margin: 0 auto; border: 1px solid rgba(255,255,255,0.1);">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #38bdf8; margin: 0;">🛡️ SRA TruthGuard</h2>
        <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">Institutional AI-Powered Fact-Checking Platform</p>
      </div>
      <div style="background: rgba(255,255,255,0.04); padding: 20px; border-radius: 8px; border: 1px solid rgba(56,189,248,0.2); text-align: center;">
        <p style="font-size: 15px; margin-top: 0;">Hello${userName ? ` <strong>${userName}</strong>` : ''},</p>
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">
          Use the 6-digit security code below to complete your <strong>${purpose.replace('_', ' ').toUpperCase()}</strong>.
        </p>
        <div style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; padding: 16px; background: rgba(0,0,0,0.4); border-radius: 8px; margin: 16px 0; border: 1px dashed #38bdf8;">
          ${otp}
        </div>
        <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">
          ⏳ This verification code is valid for <strong>10 minutes</strong>. Do not share it with anyone.
        </p>
      </div>
      <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #64748b;">
        <p>Sent by SRA TruthGuard Verification Engine (<a href="mailto:${SENDER_EMAIL}" style="color: #38bdf8;">${SENDER_EMAIL}</a>)</p>
      </div>
    </div>
  `;

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"SRA TruthGuard Verification Engine" <${SENDER_EMAIL}>`,
        to,
        subject,
        html
      });
      console.log(`[Mailer] OTP email dispatched to ${to}: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('[Mailer] Failed to send email via SMTP:', err);
      return { success: false, error: err.message };
    }
  } else {
    console.log(`[Mailer - Simulation] OTP generated for ${to} from ${SENDER_EMAIL}: [ ${otp} ] (Set GMAIL_APP_PASSWORD in .env for live inbox delivery)`);
    return { success: true, simulated: true, otp };
  }
}

module.exports = {
  sendOtpEmail,
  SENDER_EMAIL
};
