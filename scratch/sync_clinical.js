const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'src/lib/i18n/locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

const clinicalTranslations = {
  'en.ts': 'Clinical Standard',
  'zh-TW.ts': '臨床標準',
  'hi.ts': 'नैदानिक मानक',
  'ja.ts': '臨床標準',
  'ko.ts': '임상 표준',
  'pa.ts': 'ਕਲੀਨਿਕਲ ਮਿਆਰ',
  'pl.ts': 'Standard kliniczny',
  'ro.ts': 'Standard clinic',
  'ur.ts': 'کلینیکل معیار',
  'ar.ts': 'معيار طبي', // and ar.ts already has it, but we handle it just in case
};

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip ar.ts if it already has clinicalStandard
  if (file === 'ar.ts' && content.includes('clinicalStandard:')) {
      console.log(`${file}: ALREADY HAS clinicalStandard`);
      return;
  }

  // Find ukStandard and append clinicalStandard after it
  // Match patterns like: ukStandard: "..."
  // or ukStandard: '...'
  const regex = /ukStandard:\s*["'](.*?)["']/g;
  if (content.match(regex)) {
      content = content.replace(regex, `ukStandard: "$1", clinicalStandard: "${clinicalTranslations[file]}"`);
      fs.writeFileSync(filePath, content);
      console.log(`${file}: SUCCESS`);
  } else {
      console.log(`${file}: FAILED to find ukStandard`);
  }
});
