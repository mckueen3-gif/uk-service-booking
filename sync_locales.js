const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src/lib/i18n/locales');
const targetLocales = ['ar.ts', 'hi.ts', 'ja.ts', 'ko.ts'];

const translations = {
  ar: {
    aboutUs: "تقوم كونسيرج ايه آي بربط أفضل 1٪ من المهنيين المعتمدين في المملكة المتحدة مع أصحاب المنازل. من خلال الربط القائم على الذكاء الاصطناعي والتحقق الصارم، نضمن إنجاز كل وظيفة بشكل صحيح.",
    trustSignal: "ممتاز على Trustpilot",
    settings_mgr: {
      title: "تكوين المنصة",
      sub: "إدارة العلامة التجارية العالمية والمعلومات القانونية وتفاصيل الاتصال",
      tabs: { branding: "العلامة التجارية والهوية", contact: "معلومات الاتصال", legal: "قانوني وتنظيمي", social: "التواجد الاجتماعي" },
      save: "تحديث الإعدادات النشطة",
      success: "تم نشر الإعدادات بنجاح",
      error: "فشل حرج أثناء النشر"
    }
  },
  hi: {
    aboutUs: "ConciergeAI यूके के शीर्ष 1% प्रमाणित पेशेवरों को घर मालिकों से जोड़ता है। एआई-संचालित मिलान और कठोर सत्यापन के माध्यम से, हम सुनिश्चित करते हैं कि हर काम सही ढंग से किया जाए।",
    trustSignal: "Trustpilot पर उत्कृष्ट",
    settings_mgr: {
      title: "प्लेटफॉर्म कॉन्फ़िगरेशन",
      sub: "वैश्विक ब्रांडिंग, कानूनी जानकारी और संपर्क विवरण प्रबंधित करें",
      tabs: { branding: "ब्रांडिंग और पहचान", contact: "संपर्क जानकारी", legal: "कानूनी और नियामक", social: "सोशल उपस्थिति" },
      save: "सक्रिय सेटिंग्स अपडेट करें",
      success: "सेटिंग्स सफलतापूर्वक प्रसारित हुईं",
      error: "प्रसार के दौरान गंभीर विफलता"
    }
  },
  ja: {
    aboutUs: "ConciergeAIは、英国のトップ1%の認定専門家を住宅所有者と結びつけます。AIを活用したマッチングと厳格な検証を通じて、あらゆる仕事が正しく行われることを保証します。",
    trustSignal: "Trustpilotで「優秀」",
    settings_mgr: {
      title: "プラットフォーム設定",
      sub: "グローバルブランディング、法的情報、連絡先詳細の管理",
      tabs: { branding: "ブランディングとアイデンティティ", contact: "連絡先情報", legal: "法務・規制", social: "ソーシャルプレゼンス" },
      save: "アクティブな設定を更新",
      success: "設定が正常に反映されました",
      error: "反映中に重大な障害が発生しました"
    }
  },
  ko: {
    aboutUs: "ConciergeAI는 영국 상위 1%의 인증된 전문가를 주택 소유자와 연결합니다. AI 기반 매칭과 엄격한 검증을 통해 모든 작업이 올바르게 수행되도록 보장합니다.",
    trustSignal: "Trustpilot에서 우수함",
    settings_mgr: {
      title: "플랫폼 구성",
      sub: "글로벌 브랜딩, 법적 정보 및 연락처 세부 정보 관리",
      tabs: { branding: "브랜딩 및 아이덴티티", contact: "연락처 정보", legal: "법적 및 규제", social: "소셜 존재" },
      save: "활성 설정 업데이트",
      success: "설정이 성공적으로 전파되었습니다",
      error: "전파 중 심각한 오류 발생"
    }
  }
};

targetLocales.forEach(file => {
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const lang = file.split('.')[0];
  const t = translations[lang];

  // Robust Footer replacement: match entire footer object content
  // We'll replace the block between `footer: {` and `  },`
  const footerPattern = /footer: \{([\s\S]*?)\n\s*\},/;
  const newFooter = `footer: { 
    tagline: content.match(/tagline: "(.*?)"/)?.[0]?.split('"')[1] || "Connecting you to the top 1% of certified professionals in the UK.", 
    explore: content.match(/explore: "(.*?)"/)?.[0]?.split('"')[1] || "Explore", 
    legal: content.match(/legal: "(.*?)"/)?.[0]?.split('"')[1] || "Legal", 
    support: content.match(/support: "(.*?)"/)?.[0]?.split('"')[1] || "Support", 
    rights: content.match(/rights: "(.*?)"/)?.[0]?.split('"')[1] || "© 2024 UK Service Hub. All rights reserved.", 
    terms: content.match(/terms: "(.*?)"/)?.[0]?.split('"')[1] || "Terms of Service", 
    privacy: content.match(/privacy: "(.*?)"/)?.[0]?.split('"')[1] || "Privacy Policy", 
    cookies: content.match(/cookies: "(.*?)"/)?.[0]?.split('"')[1] || "Cookie Policy", 
    help: content.match(/help: "(.*?)"/)?.[0]?.split('"')[1] || "Help Center", 
    contact: content.match(/contact: "(.*?)"/)?.[0]?.split('"')[1] || "Contact Support", 
    aiDiagnosis: content.match(/aiDiagnosis: "(.*?)"/)?.[0]?.split('"')[1] || "AI Diagnosis", 
    homeCleaning: content.match(/homeCleaning: "(.*?)"/)?.[0]?.split('"')[1] || "Home Cleaning", 
    plumbingServices: content.match(/plumbingServices: "(.*?)"/)?.[0]?.split('"')[1] || "Plumbing Services", 
    automotiveServices: content.match(/automotiveServices: "(.*?)"/)?.[0]?.split('"')[1] || "Automotive Services", 
    trustSignal: "${t.trustSignal}",
    address: "London, UK",
    phone: "+44 20 1234 5678",
    email: "support@conciergeai.uk",
    aboutUs: "${t.aboutUs}",
    companyNo: "12345678",
    vatNo: "GB123456789",
    social: {
      facebook: "https://facebook.com/conciergeai",
      twitter: "https://twitter.com/conciergeai",
      instagram: "https://instagram.com/conciergeai",
      linkedin: "https://linkedin.com/company/conciergeai"
    }
  },`;

  content = content.replace(footerPattern, newFooter);

  // Robust Admin replacement: Ensure only one settings_mgr exists
  // If settings_mgr exists, replace it. If not, add before final } of admin.
  const settingsMgrStr = `settings_mgr: ${JSON.stringify(t.settings_mgr, null, 6).replace(/"([^"]+)":/g, '$1:')}`;
  
  if (content.includes('settings_mgr:')) {
    content = content.replace(/settings_mgr: \{[\s\S]*?\n\s*\}/, settingsMgrStr);
  } else {
    // Add before the last } of admin object. 
    // Usually admin: { ... } ends with }, auth: {
    content = content.replace(/},\n\s*auth: \{/, `,\n      ${settingsMgrStr}\n    },\n  auth: {`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Deep synced and cleaned ${file}`);
});
