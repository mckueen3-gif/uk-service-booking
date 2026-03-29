import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: MailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[MAIL_MOCK] Skip sending as RESEND_API_KEY is missing');
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'ServiceHub <onboarding@resend.dev>', // Use verified domain late
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
      <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #0f766e;">預約確認通知</h1>
        <p>您好 ${data.customerName}，您的服務預約已成功發送並進入待處理狀態。</p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <p><strong>服務項目：</strong> ${data.serviceName}</p>
          <p><strong>預期日期：</strong> ${data.date}</p>
          <p><strong>支付金額：</strong> £${data.price.toFixed(2)}</p>
        </div>
        <p>稍後商家確認後，您將收到進一步更新。您也可以前往 <a href="http://localhost:3000/dashboard">會員控制台</a> 追蹤進度。</p>
        <hr />
        <p style="font-size: 12px; color: #94a3b8;">感謝您使用 UK ServiceHub。</p>
      </div>
    `
  });
}

/**
 * 新預約提醒 - 發送給商家
 */
export async function sendMerchantJobAlert(merchantEmail: string, data: {
  merchantName: string;
  serviceName: string;
  customerName: string;
  date: string;
}) {
  return sendEmail({
    to: merchantEmail,
    subject: `【新訂單】您有新的預約請求待確認！`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #2563eb;">新進預約提醒</h1>
        <p>您好 ${data.merchantName}，客戶 <strong>${data.customerName}</strong> 剛剛預約了您的 <strong>${data.serviceName}</strong>。</p>
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border: 1px solid #bae6fd;">
          <p><strong>請求服務：</strong> ${data.serviceName}</p>
          <p><strong>建議日期：</strong> ${data.date}</p>
        </div>
        <p>請盡快前往 <a href="http://localhost:3000/dashboard">商家後台</a> 點擊「確認預約」或「拒絕預約」以保持良好的服務評分。</p>
        <hr />
        <p style="font-size: 12px; color: #94a3b8;">此信件由 UK ServiceHub 管理系統自動發出。</p>
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
  const color = isConfirmed ? "#10b981" : "#ef4444";

  return sendEmail({
    to: customerEmail,
    subject: `【狀態更新】您的服務預約狀態已變更`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: ${color};">${statusZH}</h2>
        <p>您好 ${data.customerName}，您的預約 #${data.bookingId.slice(-6)} 狀態已更新。</p>
        <p><strong>服務內容：</strong> ${data.serviceName}</p>
        <p><strong>最新狀態：</strong> <span style="font-weight: 800; color: ${color};">${data.status}</span></p>
        ${isConfirmed ? '<p>專家已準備好為您服務，請準時等候。</p>' : '<p>很抱歉商家無法在該時段提供服務，系統將為您自動發起退款或可以重新預約其他時段。</p>'}
        <p>您隨時可以前往 <a href="http://localhost:3000/dashboard">控制台</a> 查看詳情。</p>
      </div>
    `
  });
}
