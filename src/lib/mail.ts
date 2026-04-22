import { Resend } from 'resend';

interface MailOptions {
  to: string | string[];
  subject: string;
  html: string;
}

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export async function sendEmail({ to, subject, html }: MailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[MAIL_MOCK] Skip sending as RESEND_API_KEY is missing');
    return null;
  }

  try {
    if (!resend) {
      console.log('[MAIL_MOCK] Skip sending as Resend client is not initialized');
      return null;
    }
    const { data, error } = await resend.emails.send({
      from: 'ConciergeAI <onboarding@resend.dev>', // Use verified domain later
      to,
      subject,
      html,
    });

    if (error) {
      console.error('[MAIL_ERROR] API returned error:', error);
      return null;
    }

    console.log('[MAIL_LOG] Email sent successfully:', data?.id);
    return data;
  } catch (error) {
    console.error('[MAIL_ERROR] Failed to send email:', error);
    return null;
  }
}

/**
 * 預約成功通知 - 發送給客戶
 */
export async function sendBookingConfirmationEmail(customerEmail: string, data: {
  customerName: string;
  serviceName: string;
  date: string;
  price: number;
}) {
  return sendEmail({
    to: customerEmail,
    subject: `【預約成功】您的服務已排定 - ${data.serviceName}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
        <div style="background: #0f766e; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">預約成功確認</h1>
        </div>
        <div style="padding: 32px;">
          <p>您好 ${data.customerName}，感謝您選擇 ConciergeAI。</p>
          <p>您的預約申請已成功發送給專家，並處於待處理狀態。專家確認後，您將收到進一步更新。</p>
          <div style="background: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 24px 0;">
            <p style="margin: 0 0 10px 0;"><strong>服務項目：</strong> ${data.serviceName}</p>
            <p style="margin: 0 0 10px 0;"><strong>預計日期：</strong> ${data.date}</p>
            <p style="margin: 0;"><strong>支付金額：</strong> £${data.price.toFixed(2)}</p>
          </div>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${baseUrl}/merchant-portal" style="background: #0f766e; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">查看訂單詳情</a>
          </div>
        </div>
        <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
          <p style="margin: 0;">ConciergeAI © 2026. This is an automated notification.</p>
        </div>
      </div>
    `
  });
}

/**
 * 新預約提醒 - 發送給商家 (精英金黑主題)
 */
export async function sendMerchantJobAlert(merchantEmail: string, data: {
  merchantName: string;
  serviceName: string;
  customerName: string;
  date: string;
}) {
  return sendEmail({
    to: merchantEmail,
    subject: `【新訂單預警】您有待處理的新預約請求！`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #e2e8f0; max-width: 600px; margin: 0 auto; background: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid #334155;">
        <div style="background: linear-gradient(135deg, #fbbf24 0%, #b45309 100%); padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">新訂單預警通知</h1>
        </div>
        <div style="padding: 40px; background: #ffffff; color: #1e293b;">
          <p style="font-size: 18px;">您好 <strong>${data.merchantName}</strong>，</p>
          <p>客戶 <strong>${data.customerName}</strong> 剛剛在平台上為您建立了一項新預約。請儘速響應以維持您的星級排名。</p>
          
          <div style="background: #f8fafc; padding: 24px; border-radius: 12px; border: 2px solid #fbbf24; border-left-width: 8px; margin: 24px 0;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">訂單詳情</p>
            <p style="margin: 0 0 8px 0; font-size: 18px;"><strong>服務：</strong> ${data.serviceName}</p>
            <p style="margin: 0; font-size: 18px;"><strong>時段：</strong> ${data.date}</p>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="${baseUrl}/merchant-portal" style="background: #1e293b; color: #fbbf24; padding: 18px 36px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 18px; border: 2px solid #fbbf24; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); display: inline-block;">立即確認預約</a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; background: #fffbeb; padding: 12px; border-radius: 8px; border: 1px solid #fef3c7;">
            💡 <strong>小提示：</strong> 快速響應的商家平均轉換率高出 3 倍。
          </p>
        </div>
        <div style="background: #1e293b; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0 0 8px 0;">ConciergeAI © 2026. Premier Network of Verified Specialists.</p>
          <p style="margin: 0;">此信件由系統自動發出，請勿直接回覆。</p>
        </div>
      </div>
    `
  });
}

/**
 * 預約狀態變更 - 發送給客戶
 */
export async function sendStatusUpdateEmail(customerEmail: string, data: {
  customerName: string;
  serviceName: string;
  status: string;
  bookingId: string;
}) {
  const isConfirmed = data.status === "CONFIRMED";
  const statusZH = isConfirmed ? "已確認 (Confirmed)" : "已取消 (Cancelled)";
  const color = isConfirmed ? "#facc15" : "#ef4444";
  const headerBg = isConfirmed ? "#facc15" : "#ef4444";

  return sendEmail({
    to: customerEmail,
    subject: `【訂單更新】您的服務狀態已變更 - ${data.serviceName}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
        <div style="background: ${headerBg}; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0;">${statusZH}</h2>
        </div>
        <div style="padding: 32px;">
          <p>您好 ${data.customerName}，您的預約 #${data.bookingId.slice(-6).toUpperCase()} 狀態已更新。</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 24px 0;">
            <p><strong>服務內容：</strong> ${data.serviceName}</p>
            <p><strong>最新狀態：</strong> <span style="font-weight: 800; color: ${color};">${data.status}</span></p>
          </div>
          ${isConfirmed ? '<p style="color: #0f766e; font-weight: bold;">專家已準備好為您服務，請準時等候。</p>' : '<p style="color: #ef4444;">很抱歉商家無法在該時段提供服務，系統將自動處理後續事宜。</p>'}
          <div style="text-align: center; margin: 32px 0;">
            <a href="${baseUrl}/dashboard" style="background: #1e293b; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">進入會員控制台</a>
          </div>
        </div>
        <div style="background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
          <p style="margin: 0;">ConciergeAI © 2026. This is an automated notification.</p>
        </div>
      </div>
    `
  });
}
