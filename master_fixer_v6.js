const fs = require('fs');
const path = require('path');

function fixFile(filePath, replacements) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');

  for (const [key, newValue] of Object.entries(replacements)) {
    const keyPattern = new RegExp(`^  ${key}: \\{`, 'm');
    const match = content.match(keyPattern);
    if (!match) {
        content = content.replace(/\s*\}\s*;\s*$/, `,\n  ${key}: ${newValue}\n};\n`);
        continue;
    }
    
    const start = match.index;
    let end = -1;
    let braceCount = 0;
    for (let i = start + match[0].length - 1; i < content.length; i++) {
      if (content[i] === '{') braceCount++;
      if (content[i] === '}') braceCount--;
      if (braceCount === 0) {
        end = i + 1;
        break;
      }
    }
    
    if (end !== -1) {
      content = content.slice(0, start) + `  ${key}: ${newValue}` + content.slice(end);
    }
  }

  fs.writeFileSync(fullPath, content);
}

const aiSecEN = `{
      title: "Aura",
      subtitle: "AI Secretary",
      desc: "Aura acts as your 24/7 business manager, handling client inquiries and securing bookings while you focus on the work.",
      status_label: "System Status",
      online: "ONLINE & ACTIVE",
      offline: "OFFLINE / STANDBY",
      knowledge_base_title: "Business Internal Knowledge",
      knowledge_base_desc: "Provide Aura with specific details about your expertise, pricing logic, service procedures, or common client questions.",
      knowledge_placeholder: "e.g. 'I specialize in full-home rewiring...'",
      persona_title: "AI Persona & Tone",
      persona_professional: "Professional",
      persona_friendly: "Friendly",
      persona_concise: "Concise & Fast",
      deploy_button: "Deploy AI Updates",
      impact_title: "AI Business Impact",
      impact_inquiries: "Inquiries Managed",
      impact_revenue: "AI Influenced Revenue",
      impact_conversion: "Conversion optimized",
      security_policy_title: "Security First Policy",
      security_policy_desc: "Aura's training data is proprietary to your merchant node.",
      success_update: "AI Brain updated successfully."
    }`;

const promoEN = `{
      title: "Promotion Hub",
      hub: "Overview",
      desc: "Create coupons and discounts that Aura can offer to clients to close deals.",
      referral_btn: "Referral Program Settings",
      success_create: "Coupon created successfully"
    }`;

const aiSecZH = `{
      title: "Aura",
      subtitle: "AI 秘書",
      desc: "Aura 擔任您的 24/7 業務經理，處理客戶諮詢並確保預約，讓您專注於工作。",
      status_label: "系統狀態",
      online: "在線並啟用",
      offline: "離線 / 待命",
      knowledge_base_title: "業務內部知識",
      knowledge_base_desc: "向 Aura 提供有關您的專業知識、定價邏輯、服務流程或常見客戶問題的具體詳情。",
      knowledge_placeholder: "例如：「我擅長全屋重新配線...」",
      persona_title: "AI 人格與語氣",
      persona_professional: "專業",
      persona_friendly: "親切",
      persona_concise: "簡潔快速",
      deploy_button: "部署 AI 更新",
      impact_title: "AI 業務影響",
      impact_inquiries: "已處理諮詢",
      impact_revenue: "AI 影響收入",
      impact_conversion: "優化轉換率",
      security_policy_title: "安全第一政策",
      security_policy_desc: "Aura 的訓練數據歸您的商家節點所有。",
      success_update: "AI 大腦更新成功。"
    }`;

const promoZH = `{
      title: "促銷中心",
      hub: "總覽",
      desc: "創建優惠券和折扣，Aura 可以提供給客戶以促成交易。",
      referral_btn: "推薦計劃設定",
      success_create: "優惠券創建成功"
    }`;

const aiSecJA = `{
      title: "Aura",
      subtitle: "AI 秘書",
      desc: "Aura は 24 時間 365 日体制のビジネス マネージャーとして機能し、お客様が仕事に専念している間にクライアントからの問い合わせに対応し、予約を確保します。",
      status_label: "システムステータス",
      online: "オンライン & アクティブ",
      offline: "オフライン / スタンバイ",
      knowledge_base_title: "ビジネス内部知識",
      knowledge_base_desc: "お客様の専門知識、価格設定ロジック、サービス手順、または一般的なクライアントの質問に関する詳細を Aura に提供してください。",
      knowledge_placeholder: "例: 「私は住宅の全面配線工事を専門としています...」",
      persona_title: "AI ペルソナ & トーン",
      persona_professional: "プロフェッショナル",
      persona_friendly: "フレンドリー",
      persona_concise: "簡潔 & スピーディー",
      deploy_button: "AI アップデートをデプロイ",
      impact_title: "AI ビジネスへの影響",
      impact_inquiries: "管理された問い合わせ",
      impact_revenue: "AI による収益への影響",
      impact_conversion: "最適化されたコンバージョン",
      security_policy_title: "セキュリティ第一ポリシー",
      security_policy_desc: "Aura のトレーニング データは、お客様のマーチャント ノードに固有のものです。",
      success_update: "AI ブレインが正常に更新されました。"
    }`;

const promoJA = `{
      title: "プロモーションハブ",
      hub: "概要",
      desc: "クーポンや割引を作成します。Aura はこれらを顧客に提案して成約を促すことができます。",
      referral_btn: "紹介プログラム設定",
      success_create: "クーポンが作成されました"
    }`;

const aiSecKO = `{
      title: "Aura",
      subtitle: "AI 비서",
      desc: "Aura는 24/7 비즈니스 관리자로서 귀하가 업무에 집중하는 동안 고객 문의를 처리하고 예약을 확보합니다.",
      status_label: "시스템 상태",
      online: "온라인 및 활성",
      offline: "오프라인 / 대기",
      knowledge_base_title: "비즈니스 내부 지식",
      knowledge_base_desc: "전문 지식, 가격 책정 로직, 서비스 절차 또는 일반적인 고객 질문에 대한 구체적인 내용을 Aura에 제공하세요.",
      knowledge_placeholder: "예: '저는 주택 전체 배선 전문입니다...'",
      persona_title: "AI 페르소나 및 톤",
      persona_professional: "전문적",
      persona_friendly: "친절함",
      persona_concise: "간결하고 빠름",
      deploy_button: "AI 업데이트 배포",
      impact_title: "AI 비즈니스 영향",
      impact_inquiries: "관리된 문의",
      impact_revenue: "AI 영향 수익",
      impact_conversion: "최적화된 전환",
      security_policy_title: "보안 우선 정책",
      security_policy_desc: "Aura의 교육 데이터는 귀하의 상점 노드에 고유합니다.",
      success_update: "AI 브레인이 성공적으로 업데이트되었습니다."
    }`;

const promoKO = `{
      title: "프로모션 허브",
      hub: "개요",
      desc: "쿠폰과 할인을 생성하세요. Aura는 이를 고객에게 제공하여 거래를 성사시킬 수 있습니다.",
      referral_btn: "추천 프로그램 설정",
      success_create: "쿠폰이 생성되었습니다"
    }`;

const toolsEN = {
  diagnosis: { name: "AI Diagnosis", desc: "Visual damage assessment system" },
  whatsapp: { name: "WhatsApp", desc: "Instant notifications for new leads" },
  seo: { name: "SEO", desc: "Boost Google rankings & optimize metadata" },
  ad_copy: { name: "AI Ad Copy", desc: "Generate high-converting ad slogans" },
  video: { name: "Elite Video", desc: "Professional video knowledge syncing" }
};

const toolsZH = {
  diagnosis: { name: "AI 智能診斷", desc: "視覺化損害評估與獲客引導系統" },
  whatsapp: { name: "WhatsApp 實時對接", desc: "即時獲取新訂單與客戶諮詢通知" },
  seo: { name: "SEO 專家檔案優化", desc: "提升 Google 排名並優化元數據" },
  ad_copy: { name: "AI 廣告文案", desc: "自動生成高轉換率的廣告標語" },
  video: { name: "精英影片剪輯", desc: "專業影片導入與 AI 知識同步" }
};

const toolsJA = {
  diagnosis: { name: "AI 診断", desc: "視覚的な損傷評価システム" },
  whatsapp: { name: "WhatsApp 連携", desc: "新しいリードの即時通知" },
  seo: { name: "SEO プロファイル最適化", desc: "Google検索順位の向上" },
  ad_copy: { name: "AI 広告コピー", desc: "高コンバージョンな広告を自動生成" },
  video: { name: "エリートビデオ編集", desc: "プロフェッショナルなビデオ同期" }
};

const toolsKO = {
  diagnosis: { name: "AI 진단", desc: "시각적 손상 평가 시스템" },
  whatsapp: { name: "WhatsApp 연동", desc: "새로운 리드에 대한 즉각적인 알림" },
  seo: { name: "SEO 프로필 최적화", desc: "Google 검색 순위 향상" },
  ad_copy: { name: "AI 광고 카피", desc: "고전환 광고 문구를 자동으로 생성" },
  video: { name: "엘리트 비디오 편집", desc: "전문 비디오 지식 동기화" }
};

function getDashboard(lang, aiSec, promo, tools) {
  const common = {
    'en': { title: "Expert Dashboard", welcome: "Welcome back, {name}", toolsTitle: "Latest Available Items" },
    'zh-TW': { title: "專家控制台", welcome: "歡迎回來，{name}", toolsTitle: "最新可用項目" },
    'ja': { title: "エキスパートダッシュボード", welcome: "{name}さん、おかえりなさい", toolsTitle: "最新のツール" },
    'ko': { title: "전문가 대시보드", welcome: "{name}님, 다시 오신 것을 환영합니다", toolsTitle: "최신 도구" }
  }[lang];

  return `{
    title: "${common.title}",
    welcome: "${common.welcome}",
    stats: {
      active_jobs: "Active Tasks",
      monthly_revenue: "Monthly Revenue",
      rating: "Success Rate",
      completion: "Completion",
      pending_leads: "New Leads",
      active_services: "Active Services",
      earnings: "Total Earnings",
      client_rating: "Client Rating"
    },
    ai_secretary: ${aiSec},
    promotions: ${promo},
    tools: {
      title: "${common.toolsTitle}",
      diagnosis: { name: "${tools.diagnosis.name}", desc: "${tools.diagnosis.desc}", badge: "FREE" },
      whatsapp: { name: "${tools.whatsapp.name}", desc: "${tools.whatsapp.desc}", badge: "FREE" },
      seo: { name: "${tools.seo.name}", desc: "${tools.seo.desc}", badge: "FREE" },
      ad_copy: { name: "${tools.ad_copy.name}", desc: "${tools.ad_copy.desc}", badge: "FREE" },
      video: { name: "${tools.video.name}", desc: "${tools.video.desc}", badge: "FREE" }
    }
  }`;
}

fixFile('src/lib/i18n/locales/en.ts', { 'merchant_dashboard': getDashboard('en', aiSecEN, promoEN, toolsEN) });
fixFile('src/lib/i18n/locales/zh-TW.ts', { 'merchant_dashboard': getDashboard('zh-TW', aiSecZH, promoZH, toolsZH) });
fixFile('src/lib/i18n/locales/ja.ts', { 'merchant_dashboard': getDashboard('ja', aiSecJA, promoJA, toolsJA) });
fixFile('src/lib/i18n/locales/ko.ts', { 'merchant_dashboard': getDashboard('ko', aiSecKO, promoKO, toolsKO) });
console.log('Final consolidation complete.');
