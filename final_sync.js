const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src/lib/i18n/locales');
const targetLocales = ['ar.ts', 'hi.ts', 'ja.ts', 'ko.ts', 'pa.ts', 'pl.ts', 'ro.ts', 'ur.ts'];

const translations = {
  ar: {
    footer: {
      trustSignal: "ممتاز على Trustpilot",
      aboutUs: "تقوم كونسيرج ايه آي بربط أفضل 1٪ من المهنيين المعتمدين في المملكة المتحدة مع أصحاب المنازل.",
      companyNo: "12345678",
      vatNo: "GB123456789"
    },
    admin: {
      settings_mgr: {
        title: "تكوين المنصة",
        sub: "إدارة العلامة التجارية العالمية والمعلومات القانونية وتفاصيل الاتصال",
        tabs: { branding: "العلامة التجارية والهوية", contact: "معلومات الاتصال", legal: "قانوني وتنظيمي", social: "التواجد الاجتماعي" },
        fields: { companyName: "اسم العمل", aboutUs: "بيان المهمة المؤسسية", logoUrl: "أصول العلامة التجارية (URL)", officeAddress: "عنوان العمل الفعلي", contactPhone: "خط الدعم الموحد", contactEmail: "قناة الدعم المباشر", companyRegistration: "رقم تسجيل الشركة", vatRegistration: "معرف ضريبة القيمة المضافة", facebook: "Facebook Handle/URL", twitter: "X/Twitter Handle/URL", instagram: "Instagram Handle/URL", linkedin: "صفحة الشركة" },
        save: "تحديث الإعدادات", success: "تم بنجاح", error: "فشل"
      }
    }
  },
  hi: {
    footer: {
      trustSignal: "Trustpilot पर उत्कृष्ट",
      aboutUs: "ConciergeAI यूके के शीर्ष 1% प्रमाणित पेशेवरों को घर मालिकों से जोड़ता है।",
      companyNo: "12345678",
      vatNo: "GB123456789"
    },
    admin: {
      settings_mgr: {
        title: "प्लेटफॉर्म कॉन्फ़िगरेशन",
        sub: "वैश्विक ब्रांडिंग, कानूनी जानकारी और संपर्क विवरण प्रबंधित करें",
        tabs: { branding: "ब्रांडिंग और पहचान", contact: "संपर्क जानकारी", legal: "कानूनी और नियामक", social: "सोशल उपस्थिति" },
        fields: { companyName: "व्यवसाय का नाम", aboutUs: "कॉर्पोरेट मिशन", logoUrl: "लोगो URL", officeAddress: "व्यवसाय का पता", contactPhone: "सहायता लाइन", contactEmail: "ईमेल चैनल", companyRegistration: "पंजीकरण संख्या", vatRegistration: "वैट आईडी", facebook: "Facebook", twitter: "Twitter", instagram: "Instagram", linkedin: "LinkedIn" },
        save: "अपडेट करें", success: "सफल", error: "विफल"
      }
    }
  },
  ja: {
    footer: {
      trustSignal: "Trustpilotで最高評価",
      aboutUs: "ConciergeAIは、英国のトップ1%の認定プロフェッショナルを住宅所有者と結びつけます。",
      companyNo: "12345678",
      vatNo: "GB123456789"
    },
    admin: {
      settings_mgr: {
        title: "プラットフォーム設定",
        sub: "ブランディング、法務、連絡先の管理",
        tabs: { branding: "ブランディング", contact: "連絡先", legal: "法務", social: "ソーシャル" },
        fields: { companyName: "企業名", aboutUs: "ミッション", logoUrl: "ロゴURL", officeAddress: "住所", contactPhone: "電話番号", contactEmail: "メール", companyRegistration: "登録番号", vatRegistration: "VAT ID", facebook: "Facebook", twitter: "Twitter", instagram: "Instagram", linkedin: "LinkedIn" },
        save: "更新", success: "成功", error: "エラー"
      }
    }
  },
  ko: {
    footer: {
      trustSignal: "Trustpilot 우수 평가",
      aboutUs: "ConciergeAI는 영국 상위 1%의 인증된 전문가를 주택 소유자와 연결합니다.",
      companyNo: "12345678",
      vatNo: "GB123456789"
    },
    admin: {
      settings_mgr: {
        title: "플랫폼 구성",
        sub: "브랜딩, 법적 정보 및 연락처 관리",
        tabs: { branding: "브랜딩", contact: "연락처", legal: "법적 정보", social: "소셜" },
        fields: { companyName: "회사명", aboutUs: "사명", logoUrl: "로고 URL", officeAddress: "주소", contactPhone: "전화", contactEmail: "이메일", companyRegistration: "등록번호", vatRegistration: "VAT ID", facebook: "Facebook", twitter: "Twitter", instagram: "Instagram", linkedin: "LinkedIn" },
        save: "업데이트", success: "성공", error: "오류"
      }
    }
  },
  ro: {
    footer: { trustSignal: "Excelent pe Trustpilot", aboutUs: "ConciergeAI conectează proprietarii cu top 1% experți locali.", companyNo: "12345678", vatNo: "GB123456789" },
    admin: {
      settings_mgr: {
         title: "Configurare Platformă", sub: "Branding, legal și contact",
         tabs: { branding: "Branding", contact: "Contact", legal: "Legal", social: "Social" },
         fields: { companyName: "Nume Companie", aboutUs: "Misiune", logoUrl: "Logo URL", officeAddress: "Adresă", contactPhone: "Telefon", contactEmail: "Email", companyRegistration: "Nr. Reg. Com.", vatRegistration: "CIF", facebook: "Facebook", twitter: "Twitter", instagram: "Instagram", linkedin: "LinkedIn" },
         save: "Salvează", success: "Succes", error: "Eroare"
      }
    }
  },
  pl: {
    footer: { trustSignal: "Doskonale na Trustpilot", aboutUs: "ConciergeAI łączy właścicieli domów z top 1% ekspertów.", companyNo: "12345678", vatNo: "GB123456789" },
    admin: {
      settings_mgr: {
         title: "Konfiguracja Platformy", sub: "Zarządzanie brandingiem i kontaktem",
         tabs: { branding: "Branding", contact: "Kontakt", legal: "Prawne", social: "Social" },
         fields: { companyName: "Nazwa firmy", aboutUs: "Misja", logoUrl: "Logo URL", officeAddress: "Adres", contactPhone: "Telefon", contactEmail: "Email", companyRegistration: "Numer KRS", vatRegistration: "NIP", facebook: "Facebook", twitter: "Twitter", instagram: "Instagram", linkedin: "LinkedIn" },
         save: "Zapisz", success: "Sukces", error: "Błąd"
      }
    }
  },
  ur: {
    footer: { trustSignal: "Trustpilot پر بہترین", aboutUs: "ConciergeAI برطانیہ کے اعلی 1 فیصد ماہرین کو گھر کے مالکان سے جوڑتا ہے۔", companyNo: "12345678", vatNo: "GB123456789" },
    admin: {
      settings_mgr: {
         title: "پلیٹ فارم کنفیگریشن", sub: "برانڈنگ اور رابطہ کا انتظام",
         tabs: { branding: "برانڈنگ", contact: "رابطہ", legal: "قانونی", social: "سوشل" },
         fields: { companyName: "کاروبار کا نام", aboutUs: "مشن", logoUrl: "لوگو کا لنک", officeAddress: "پتہ", contactPhone: "فون", contactEmail: "ای میل", companyRegistration: "رجسٹریشن نمبر", vatRegistration: "VAT ID", facebook: "Facebook", twitter: "Twitter", instagram: "Instagram", linkedin: "LinkedIn" },
         save: "اپ ڈیٹ کریں", success: "کامیاب", error: "خرابی"
      }
    }
  },
  pa: {
    footer: { trustSignal: "Trustpilot 'ਤੇ ਸ਼ਾਨਦਾਰ", aboutUs: "ConciergeAI ਘਰ ਦੇ ਮਾਲਕਾਂ ਨੂੰ ਯੂਕੇ ਦੇ ਚੋਟੀ ਦੇ 1% ਮਾਹਰਾਂ ਨਾਲ ਜੋੜਦਾ ਹੈ।", companyNo: "12345678", vatNo: "GB123456789" },
    admin: {
      settings_mgr: {
         title: "ਪਲੇਟਫਾਰਮ ਕੌਂਫਿਗਰੇਸ਼ਨ", sub: "ਬ੍ਰਾਂਡਿੰਗ ਅਤੇ ਸੰਪਰਕ ਪ੍ਰਬੰਧਨ",
         tabs: { branding: "ਬ੍ਰਾਂਡਿੰਗ", contact: "ਸੰਪਰਕ", legal: "ਕਾਨੂੰਨੀ", social: "ਸੋਸ਼ਲ" },
         fields: { companyName: "ਕਾਰੋਬਾਰ ਦਾ ਨਾਮ", aboutUs: "ਮਿਸ਼ਨ", logoUrl: "ਲੋਗੋ URL", officeAddress: "ਪਤਾ", contactPhone: "ਫੋਨ", contactEmail: "ਈਮੇਲ", companyRegistration: "ਰਜਿਸਟਰੇਸ਼ਨ ਨੰਬਰ", vatRegistration: "VAT ID", facebook: "Facebook", twitter: "Twitter", instagram: "Instagram", linkedin: "LinkedIn" },
         save: "ਅੱਪਡੇਟ ਕਰੋ", success: "ਸਫਲ", error: "ਗਲਤੀ"
      }
    }
  }
};

targetLocales.forEach(file => {
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const lang = file.split('.')[0];
  const t = translations[lang];

  // Update Footer: add missing fields if NOT present
  const footerFields = ['address', 'phone', 'email', 'aboutUs', 'companyNo', 'vatNo', 'social'];
  footerFields.forEach(f => {
    if (!content.includes(`${f}:`)) {
       // Insert before the last } of footer
       if (f === 'social') {
          content = content.replace(/},\s*search:/, `,\n    social: {\n      facebook: "#", twitter: "#", instagram: "#", linkedin: "#"\n    }\n  },\n  search:`);
       } else {
          content = content.replace(/},\s*search:/, `,\n    ${f}: "${t.footer[f] || '...'}"\n  },\n  search:`);
       }
    }
  });

  // Ensure settings_mgr is added to admin
  if (content.includes('admin: {')) {
    if (!content.includes('settings_mgr:')) {
      // Add inside admin object
      const settingsStr = `,\n    settings_mgr: ${JSON.stringify(t.admin.settings_mgr, null, 6).replace(/"([^"]+)":/g, '$1:')}`;
      content = content.replace(/},\n\s*auth: \{/, `${settingsStr}\n    },\n  auth: {`);
    } else {
      // Replace existing settings_mgr with correct structure
      const settingsStr = `settings_mgr: ${JSON.stringify(t.admin.settings_mgr, null, 6).replace(/"([^"]+)":/g, '$1:')}`;
      content = content.replace(/settings_mgr: \{[\s\S]*?\n\s+\}/, settingsStr);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Final sync completed for ${file}`);
});
