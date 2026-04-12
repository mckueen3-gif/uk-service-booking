const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'src/lib/i18n/locales');
const files = fs.readdirSync(localesDir);

const translations = {
  'en.ts': '* T&C: Voucher rewards are for retail spending and cannot be withdrawn as cash.',
  'zh-TW.ts': '* 條款：獎勵積分僅限於合作商戶消費使用，不可兌換現金。',
  'ar.ts': '* الشروط: مكافآت القسائم مخصصة للإنفاق بالتجزئة ولا يمكن سحبها كاش.',
  'hi.ts': '* नियम: वाउचर पुरस्कार खुदरा खर्च के लिए हैं और इन्हें नकद के रूप में नहीं निकाला जा सकता।',
  'ja.ts': '* 利用規約：バウチャー報酬は小売店での利用専用であり、現金として引き出すことはできません。',
  'ko.ts': '* 약관: 바우처 보상은 소매 지출을 위한 것이며 현금으로 인출할 수 없습니다.',
  'pa.ts': '* ਸ਼ਰਤਾਂ: ਵਾਊਚਰ ਇਨਾਮ ਸਿਰਫ ਖਰੀਦਦਾਰੀ ਲਈ ਹਨ ਅਤੇ ਨਕਦ ਵਜੋਂ ਨਹੀਂ ਕਢਵਾਏ ਜਾ ਸਕਦੇ।',
  'pl.ts': '* Regulamin: Nagrody w postaci voucherów są przeznaczone na zakupy i nie mogą być wypłacone w gotówce.',
  'ro.ts': '* Termeni: Recompensele sub formă de vouchere sunt pentru cumpărături și nu pot fi retrase cash.',
  'ur.ts': '* شرائط: واؤچر انعامات صرف خریداری کے لیے ہیں اور نقد رقم کے طور پر نہیں نکالے جا سکتے۔',
};

files.forEach(file => {
  if (translations[file]) {
    const filePath = path.join(localesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if voucherDisclaimer already exists in referralCTA
    if (content.includes('voucherDisclaimer:')) {
      console.log(`${file}: found voucherDisclaimer, skipping.`);
      return;
    }

    // Find referralCTA object and insert voucherDisclaimer
    const searchPattern = /referralCTA:\s*{([\s\S]*?)}/;
    const match = content.match(searchPattern);

    if (match) {
      const innerContent = match[1];
      const lastCommaIndex = innerContent.lastIndexOf(',');
      let newInnerContent;
      if (lastCommaIndex !== -1) {
         newInnerContent = innerContent.slice(0, lastCommaIndex + 1) + ` voucherDisclaimer: "${translations[file]}"` + innerContent.slice(lastCommaIndex + 1);
      } else {
         newInnerContent = innerContent + `, voucherDisclaimer: "${translations[file]}"`;
      }
      
      const newContent = content.replace(match[0], `referralCTA: {${newInnerContent}}`);
      fs.writeFileSync(filePath, newContent);
      console.log(`${file}: Added voucherDisclaimer to referralCTA.`);
    } else {
      console.log(`${file}: Could not find referralCTA section.`);
    }
  }
});
