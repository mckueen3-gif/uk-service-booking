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
        // If not found, append before the last };
        content = content.replace(/\s*\}\s*;\s*$/, `,\n  ${key}: ${newValue}\n};\n`);
        console.log(`Key ${key} appended to ${filePath}`);
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
      console.log(`Key ${key} updated in ${filePath}`);
    }
  }

  fs.writeFileSync(fullPath, content);
}

const aiSecretaryEN = `{
      title: "Aura",
      subtitle: "AI Secretary",
      desc: "Aura acts as your 24/7 business manager, handling client inquiries and securing bookings while you focus on the work.",
      status_label: "System Status",
      online: "ONLINE & ACTIVE",
      offline: "OFFLINE / STANDBY",
      knowledge_base_title: "Business Internal Knowledge",
      knowledge_base_desc: "Provide Aura with specific details about your expertise, pricing logic, service procedures, or common client questions. The more Aura knows, the better she closes deals.",
      knowledge_placeholder: "e.g. 'I specialize in full-home rewiring. Basic callout is £80. I don't work on Sunday...'",
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
      security_policy_desc: "Aura's training data is proprietary to your merchant node. We never use your business logic to train models for competitors.",
      success_update: "AI Brain updated successfully. Aura is now relearning your business context."
    }`;

const aiSecretaryZH = `{
      title: "Aura",
      subtitle: "AI 秘書",
      desc: "Aura 擔任您的 24/7 業務經理，處理客戶諮詢並確保預約，讓您專注於工作。",
      status_label: "系統狀態",
      online: "在線並啟用",
      offline: "離線 / 待命",
      knowledge_base_title: "業務內部知識",
      knowledge_base_desc: "向 Aura 提供有關您的專業知識、定價邏輯、服務流程或常見客戶問題的具體詳情。Aura 了解得越多，成交效果就越好。",
      knowledge_placeholder: "例如：「我擅長全屋重新配線。基本出勤費為 £80。我週日不工作...」",
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
      security_policy_desc: "Aura 的訓練數據歸您的商家節點所有。我們絕不使用您的業務邏輯為競爭對手訓練模型。",
      success_update: "AI 大腦更新成功。Aura 正在重新學習您的業務背景。"
    }`;

const aiSecretaryJA = `{
      title: "Aura",
      subtitle: "AI 秘書",
      desc: "Aura は 24 時間 365 日体制のビジネス マネージャーとして機能し、お客様が仕事に専念している間にクライアントからの問い合わせに対応し、予約を確保します。",
      status_label: "システムステータス",
      online: "オンライン & アクティブ",
      offline: "オフライン / スタンバイ",
      knowledge_base_title: "ビジネス内部知識",
      knowledge_base_desc: "お客様の専門知識、価格設定ロジック、サービス手順、または一般的なクライアントの質問に関する詳細を Aura に提供してください。Aura がより多くを知るほど、成約率は向上します。",
      knowledge_placeholder: "例: 「私は住宅の全面配線工事を専門としています。基本出張費は 80 ポンドです。日曜日は休みです...」",
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
      security_policy_desc: "Aura のトレーニング データは、お客様のマーチャント ノードに固有のものです。競合他社のためにモデルをトレーニングするために、お客様のビジネス ロジックを使用することはありません。",
      success_update: "AI ブレインが正常に更新されました。Aura は現在、ビジネス コンテキストを再学習しています。"
    }`;

const aiSecretaryKO = `{
      title: "Aura",
      subtitle: "AI 비서",
      desc: "Aura는 24/7 비즈니스 관리자로서 귀하가 업무에 집중하는 동안 고객 문의를 처리하고 예약을 확보합니다.",
      status_label: "시스템 상태",
      online: "온라인 및 활성",
      offline: "오프라인 / 대기",
      knowledge_base_title: "비즈니스 내부 지식",
      knowledge_base_desc: "전문 지식, 가격 책정 로직, 서비스 절차 또는 일반적인 고객 질문에 대한 구체적인 내용을 Aura에 제공하세요. Aura가 더 많이 알수록 더 나은 결과를 얻을 수 있습니다.",
      knowledge_placeholder: "예: '저는 주택 전체 배선 전문입니다. 기본 출장비는 80파운드입니다. 일요일은 근무하지 않습니다...'",
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
      security_policy_desc: "Aura의 교육 데이터는 귀하의 상점 노드에 고유합니다. 당사는 경쟁업체를 위한 모델을 교육하기 위해 귀하의 비즈니스 로직을 사용하지 않습니다.",
      success_update: "AI 브레인이 성공적으로 업데이트되었습니다. Aura가 비즈니스 컨텍스트를 다시 학습하고 있습니다."
    }`;

const toolsEN = {
  diagnosis: { name: "AI Diagnosis", desc: "Visual damage assessment & lead capture system" },
  whatsapp: { name: "WhatsApp", desc: "Instant notifications for new leads and queries" },
  seo: { name: "SEO", desc: "Boost Google rankings & optimize metadata" },
  ad_copy: { name: "AI Ad Copy", desc: "Generate high-converting social media & ad slogans" },
  video: { name: "Elite Video", desc: "Professional video import & AI knowledge syncing" }
};

const toolsZH = {
  diagnosis: { name: "AI 智能診斷", desc: "視覺化損害評估與獲客引導系統" },
  whatsapp: { name: "WhatsApp 實時對接", desc: "即時獲取新訂單與客戶諮詢通知" },
  seo: { name: "SEO 專家檔案優化", desc: "提升 Google 排名並優化元數據" },
  ad_copy: { name: "AI 廣告文案", desc: "自動生成高轉換率的社群媒體和廣告標語" },
  video: { name: "精英影片剪輯", desc: "專業影片導入與 AI 知識同步" }
};

const toolsJA = {
  diagnosis: { name: "AI 診断", desc: "視覚的な損傷評価とリード獲得システム" },
  whatsapp: { name: "WhatsApp 連携", desc: "新しいリードと問い合わせの即時通知" },
  seo: { name: "SEO プロファイル最適化", desc: "Google検索順位の向上とメタデータの最適化" },
  ad_copy: { name: "AI 広告コピー", desc: "高コンバージョンな広告とスローガンを自動生成" },
  video: { name: "エリートビデオ編集", desc: "プロフェッショナルなビデオ導入とAI知識の同期" }
};

const toolsKO = {
  diagnosis: { name: "AI 진단", desc: "시각적 손상 평가 및 잠재 고객 확보 시스템" },
  whatsapp: { name: "WhatsApp 연동", desc: "새로운 리드 및 문의에 대한 즉각적인 알림" },
  seo: { name: "SEO 프로필 최적화", desc: "Google 검색 순위 향상 및 메타데이터 최적화" },
  ad_copy: { name: "AI 광고 카피", desc: "고전환 소셜 미디어 및 광고 문구를 자동으로 생성" },
  video: { name: "엘리트 비디오 편집", desc: "전문 비디오 가져오기 및 AI 지식 동기화" }
};

function getDashboard(lang, aiSec, tools) {
  const common = {
    'en': { title: "Expert Dashboard", welcome: "Welcome back, {name}", toolsTitle: "Latest Available Items" },
    'zh-TW': { title: "專家控制台", welcome: "歡迎回來，{name}", toolsTitle: "最新可用項目" },
    'ja': { title: "エキスパートダッシュボード", welcome: "{name}さん、おかえ리なさい", toolsTitle: "最新のツール" },
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

fixFile('src/lib/i18n/locales/en.ts', { 'merchant_dashboard': getDashboard('en', aiSecretaryEN, toolsEN) });
fixFile('src/lib/i18n/locales/zh-TW.ts', { 'merchant_dashboard': getDashboard('zh-TW', aiSecretaryZH, toolsZH) });
fixFile('src/lib/i18n/locales/ja.ts', { 'merchant_dashboard': getDashboard('ja', aiSecretaryJA, toolsJA) });
fixFile('src/lib/i18n/locales/ko.ts', { 'merchant_dashboard': getDashboard('ko', aiSecretaryKO, toolsKO) });
