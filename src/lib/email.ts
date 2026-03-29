import { Resend } from 'resend';

// Only instantiate if the API key exists and is a valid format, prevents crashing in build/dev
const apiKey = process.env.RESEND_API_KEY;
export const resend = (apiKey && apiKey.length > 5) ? new Resend(apiKey) : null;

export async function sendPlatformEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!resend) {
    console.warn(`[Mock Email Sent to ${to}] Subject: ${subject}`);
    return { success: true, mock: true };
  }

  try {
    const data = await resend.emails.send({
      from: 'UK Service Booking <noreply@uk-services.com>', // Replace with verified domain in production
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Resend API Error:", error);
    return { success: false, error };
  }
}

// Pre-built Template 1: AI Dispute Resolved
export function getDisputeResolvedTemplate({ disputeId, decision, amount }: { disputeId: string, decision: string, amount: string }) {
  const isRefund = decision === 'REFUND_CUSTOMER';
  const color = isRefund ? '#ef4444' : '#10b981';
  const title = isRefund ? '您的訂單爭議已退款' : '師傅已成功收到放款';
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: ${color}; padding: 20px; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">${title}</h1>
      </div>
      <div style="padding: 30px;">
        <p>您好，</p>
        <p>系統底層的 <strong>Google Gemini 1.5 Pro AI 仲裁核心</strong> 已經完成了針對案件 #${disputeId.toUpperCase()} 的深度判決。</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid ${color}; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">⚖️ 最終裁定結果：${decision}</h3>
          <p style="margin: 0;">涉及金額：<strong>£${amount}</strong></p>
        </div>
        <p>Stripe Escrow 系統已同步解除鎖定，資金正在安全移轉中。</p>
        <a href="https://uk-services.com/dashboard/disputes/${disputeId}" style="display: inline-block; background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">
          登入平台查看完整 JSON 分析報告
        </a>
      </div>
      <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
        UK Service Booking Ltd. © 2026<br>
        本郵件由 AI 自動產出，請勿直接回覆。
      </div>
    </div>
  `;
}
