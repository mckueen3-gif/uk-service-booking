const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/lib/i18n/locales');
const targetFiles = ['ar.ts', 'hi.ts', 'ja.ts', 'ko.ts', 'pa.ts', 'pl.ts', 'ro.ts', 'ur.ts'];

const translations = {
  ar: {
    title: "المحاسبة والضرائب",
    subtitle: "مركز مالي أوتوماتيكي في المملكة المتحدة: مراقبة ضريبة القيمة المضافة وتوقعات الضرائب.",
    statusActive: "الاشتراك نشط",
    statusInactive: "الاشتراك غير نشط",
    grossRevenue: "الإيرادات الإجمالية",
    grossRevenueDesc: "إجمالي التدفق الوارد من منصات ConciergeAI",
    taxPayable: "الضريبة المستحقة التقديرية",
    taxPayableDesc: "محسوبة بناءً على شرائح ضريبة الدخل في المملكة المتحدة لعام 24/25.",
    vatRadar: "رادار تسجيل ضريبة القيمة المضافة",
    vatRadarDesc: "تتبع القرب من عتبة 90,000 جنيه إسترليني.",
    monthlyBreakdown: "تدقيق الأداء الشهري",
    revenue: "الإيرادات",
    fees: "رسوم المنصة",
    netProfit: "صافي الربح",
    exportCsv: "تصدير سجل التدقيق CSV",
    upgradeTitle: "فتح المحاسبة المتخصصة",
    upgradeDesc: "الدفاتر المحاسبية الآلية، ملخصات سنة الضرائب، وتصدير بيانات CSV.",
    upgradeCost: "£4.99 / شهرياً",
    upgradeBtn: "تفعيل الوصول المميز",
    taxYear: "سنة الضرائب",
    regNumber: "رقم التسجيل (UTR/CRN)"
  },
  hi: {
    title: "लेखांकन और कर",
    subtitle: "स्वचालित यूके वित्तीय केंद्र: वैट निगरानी और कर पूर्वानुमान।",
    statusActive: "सदस्यता सक्रिय",
    statusInactive: "सदस्यता निष्क्रिय",
    grossRevenue: "सकल राजस्व",
    grossRevenueDesc: "ConciergeAI प्लेटफॉर्म्स से कुल अंतर्वाह",
    taxPayable: "अनुमानित कर देय",
    taxPayableDesc: "24/25 यूके आयकर बैंड्स के आधार पर गणना की गई।",
    vatRadar: "वैट पंजीकरण रडार",
    vatRadarDesc: "£90,000 थ्रेशोल्ड के निकटता को ट्रैक करना।",
    monthlyBreakdown: "मासिक प्रदर्शन ऑडिट",
    revenue: "राजस्व",
    fees: "प्लेटफॉर्म शुल्क",
    netProfit: "शुद्ध लाभ",
    exportCsv: "CSV ऑडिट लॉग निर्यात करें",
    upgradeTitle: "विशेषज्ञ लेखांकन अनलॉक करें",
    upgradeDesc: "स्वचालित बहीखाता, कर वर्ष सारांश, और CSV डेटा निर्यात।",
    upgradeCost: "£4.99 / माह",
    upgradeBtn: "प्रीमियम एक्सेस सक्रिय करें",
    taxYear: "कर वर्ष",
    regNumber: "पंजीकरण संख्या (UTR/CRN)"
  },
  ja: {
    title: "会計と税務",
    subtitle: "自動化されたUK財務センター：VAT監視と税金予測。",
    statusActive: "サブスクリプション有効",
    statusInactive: "サブスクリプション無効",
    grossRevenue: "総収益",
    grossRevenueDesc: "ConciergeAIプラットフォームからの総流入",
    taxPayable: "推定納税額",
    taxPayableDesc: "24/25 UK所得税バンドに基づいて計算。",
    vatRadar: "VAT登録レーダー",
    vatRadarDesc: "£90,000閾値への近さを追跡。",
    monthlyBreakdown: "月次パフォーマンス監査",
    revenue: "収益",
    fees: "プラットフォーム手数料",
    netProfit: "純利益",
    exportCsv: "CSV監査ログをエクスポート",
    upgradeTitle: "専門会計をアンロック",
    upgradeDesc: "自動簿記、税年度サマリー、CSVデータエクスポート。",
    upgradeCost: "£4.99 / 月",
    upgradeBtn: "プレミアムアクセスを有効化",
    taxYear: "税年度",
    regNumber: "登録番号 (UTR/CRN)"
  },
  ko: {
    title: "회계 및 세금",
    subtitle: "자동화된 UK 재무 센터: VAT 모니터링 및 세금 예측.",
    statusActive: "구독 활성",
    statusInactive: "구독 비활성",
    grossRevenue: "총 수익",
    grossRevenueDesc: "ConciergeAI 플랫폼에서 총 유입",
    taxPayable: "예상 납부 세금",
    taxPayableDesc: "24/25 UK 소득세 구간에 기반하여 계산됨.",
    vatRadar: "VAT 등록 레이더",
    vatRadarDesc: "£90,000 임계값 근접도 추적.",
    monthlyBreakdown: "월별 성과 감사",
    revenue: "수익",
    fees: "플랫폼 수수료",
    netProfit: "순이익",
    exportCsv: "CSV 감사 로그 내보내기",
    upgradeTitle: "전문 회계 잠금 해제",
    upgradeDesc: "자동 부기, 세금 연도 요약, CSV 데이터 내보내기.",
    upgradeCost: "£4.99 / 월",
    upgradeBtn: "프리미엄 액세스 활성화",
    taxYear: "세금 연도",
    regNumber: "등록 번호 (UTR/CRN)"
  },
  pa: {
    title: "ਹਿਸਾਬਕੀ ਤੇ ਕਰ",
    subtitle: "ਆਟੋਮੈਟਿਕ ਯੂਕੇ ਵਿੱਤੀ ਕੇਂਦਰ: ਵੀਏਟੀ ਨਿਗਰਾਨੀ ਤੇ ਕਰ ਅਨੁਮਾਨ।",
    statusActive: "ਸਬਸਕ੍ਰਿਪਸ਼ਨ ਐਕਟਿਵ",
    statusInactive: "ਸਬਸਕ੍ਰਿਪਸ਼ਨ ਨਾਕਾਰਗ",
    grossRevenue: "ਕੁੱਲ ਆਮਦਨ",
    grossRevenueDesc: "ਕਨਸੀਜੇਏਆਈ ਪਲੇਟਫਾਰਮਾਂ ਤੋਂ ਕੁੱਲ ਆਮਦ",
    taxPayable: "अਨੁਮਾਨਿਤ ਕਰ ਅਦਾਇਗੀ",
    taxPayableDesc: "24/25 ਯੂਕੇ ਆਮਦਨ ਕਰ ਬੈਂਡਾਂ ਅਧਾਰਤ ਗਣਨਾ।",
    vatRadar: "ਵੀਏਟੀ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਰਾਡਾਰ",
    vatRadarDesc: "£90,000 ਥ੍ਰੈਸ਼ਹੋਲਡ ਨਾਲ ਨੇੜਤਾ ਟਰੈਕਿੰਗ।",
    monthlyBreakdown: "ਮਹੀਨਾਵਾਰ ਪ੍ਰਦਰਸ਼ਨ ਆਡਿਟ",
    revenue: "ਆਮਦਨ",
    fees: "ਪਲੇਟਫਾਰਮ ਫੀਸ",
    netProfit: "ਨੈੱਟ ਲਾਭ",
    exportCsv: "CSV ਆਡਿਟ ਲੌਗ ਐਕਸਪੋਰਟ ਕਰੋ",
    upgradeTitle: "ਸਪੈਸ਼ਲਿਸਟ ਹਿਸਾਬਕੀ ਖੋਲ੍ਹੋ",
    upgradeDesc: "ਆਟੋਮੈਟਿਕ ਬੁੱਕ ਕੀਪਿੰਗ, ਕਰ ਸਾਲ ਸੰਖੇਪ, ਤੇ CSV ਡਾਟਾ ਐਕਸਪੋਰਟ।",
    upgradeCost: "£4.99 / ਮਹੀਨਾ",
    upgradeBtn: "ਪ੍ਰੀਮੀਅਮ ਐਕਸੈੱਸ ਐਕਟੀਵੇਟ ਕਰੋ",
    taxYear: "ਕਰ ਸਾਲ",
    regNumber: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਨੰਬਰ (UTR/CRN)"
  },
  pl: {
    title: "Księgowość i Podatki",
    subtitle: "Zautomatyzowane centrum finansowe UK: Monitorowanie VAT i prognozowanie podatków.",
    statusActive: "Subskrypcja Aktywna",
    statusInactive: "Subskrypcja Nieaktywna",
    grossRevenue: "Przychody Brutto",
    grossRevenueDesc: "Całkowity napływ z platform ConciergeAI",
    taxPayable: "Szacowany Podatek do Zapłaty",
    taxPayableDesc: "Obliczone na podstawie pasm podatku dochodowego UK 24/25.",
    vatRadar: "Radar Rejestracji VAT",
    vatRadarDesc: "Śledzenie bliskości progu £90,000.",
    monthlyBreakdown: "Miesięczny Audyt Wydajności",
    revenue: "Przychody",
    fees: "Opłaty Platformy",
    netProfit: "Zysk Netto",
    exportCsv: "Eksportuj Log Audytu CSV",
    upgradeTitle: "Odblokuj Specjalistyczną Księgowość",
    upgradeDesc: "Zautomatyzowana księgowość, podsumowania roku podatkowego i eksport danych CSV.",
    upgradeCost: "£4.99 / Miesiąc",
    upgradeBtn: "Aktywuj Dostęp Premium",
    taxYear: "Rok Podatkowy",
    regNumber: "Nr Rej. (UTR/CRN)"
  },
  ro: {
    title: "Contabilitate și Taxe",
    subtitle: "Centrul financiar automatizat UK: Monitorizare VAT și prognoză taxe.",
    statusActive: "Abonament Activ",
    statusInactive: "Abonament Inactiv",
    grossRevenue: "Venit Brut",
    grossRevenueDesc: "Flux total intrare din platformele ConciergeAI",
    taxPayable: "Taxă de Plată Estimată",
    taxPayableDesc: "Calculată pe baza benzilor de impozit pe venit UK 24/25.",
    vatRadar: "Radar Înregistrare VAT",
    vatRadarDesc: "Urmărirea apropierii de pragul de £90,000.",
    monthlyBreakdown: "Audit Performanță Lunară",
    revenue: "Venituri",
    fees: "Taxe Platformă",
    netProfit: "Profit Net",
    exportCsv: "Export Log Audit CSV",
    upgradeTitle: "Deblochează Contabilitate Specializată",
    upgradeDesc: "Contabilitate automată, rezumate an fiscal și export date CSV.",
    upgradeCost: "£4.99 / Lună",
    upgradeBtn: "Activează Acces Premium",
    taxYear: "An Fiscal",
    regNumber: "Nr. Înreg. (UTR/CRN)"
  },
  ur: {
    title: "اکاؤنٹنگ اور ٹیکس",
    subtitle: "آٹومیٹڈ یو کے فنانشل سینٹر: ویٹ مانیٹرنگ اور ٹیکس فورکاسٹنگ۔",
    statusActive: "سبسکرپشن فعال",
    statusInactive: "سبسکرپشن غیر فعال",
    grossRevenue: "مجموعی آمدنی",
    grossRevenueDesc: "ConciergeAI پلیٹ فارمز سے کل انفلؤ",
    taxPayable: "اندازاً ٹیکس ادا کرنے کے قابل",
    taxPayableDesc: "24/25 یو کے انکم ٹیکس بینڈز की بنیاد پر حساب کیا گیا۔",
    vatRadar: "ویٹ رجسٹریشن ریڈار",
    vatRadarDesc: "£90,000 تھرش ہولڈ کی قربت کو ٹریکنگ।",
    monthlyBreakdown: "ماہانہ پرفارمنس آڈٹ",
    revenue: "آمدنی",
    fees: "پلیٹ فارم فیس",
    netProfit: "نیٹ منافع",
    exportCsv: "CSV آڈٹ لاگ ایکسपोर्ट करें",
    upgradeTitle: "اسپیشلسٹ اکاؤنٹنگ ان لاک کریں",
    upgradeDesc: "آٹومیٹڈ بک کیپنگ، ٹیکس ईئر سمریاں، اور CSV ڈیٹا ایکسپورٹس।",
    upgradeCost: "£4.99 / ماہ",
    upgradeBtn: "پریمیم ایکسس ایکٹیویٹ کریں",
    taxYear: "ٹیکس ईئر",
    regNumber: "رجسٹریشن नंबर (UTR/CRN)"
  }
};

targetFiles.forEach(file => {
  const filePath = path.join(localesDir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const lang = file.split('.')[0];
  const t = translations[lang];

  // Check if accounting already exists in dashboard block
  if (content.match(/accounting:\s*{[\s\S]*?}/)) {
      console.log(`${file}: accounting already exists, skipping or could update if needed.`);
      // Optional: Replace existing if it's just a string or incomplete
      // content = content.replace(/accounting:\s*".*?"/, `accounting: ${JSON.stringify(t, null, 2)}`);
  }

  // Find avatar and inject accounting after it
  const avatarRegex = /(avatar:\s*{[\s\S]*?},)/;
  if (content.match(avatarRegex)) {
    const accountingStr = `\n      accounting: ${JSON.stringify(t, null, 8).replace(/"([^"]+)":/g, '$1:').slice(0, -1)}      }`;
    content = content.replace(avatarRegex, `$1${accountingStr}`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Injected accounting into ${file}`);
  } else {
    console.log(`Could not find avatar in ${file}`);
  }
});
