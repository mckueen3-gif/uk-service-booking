const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'src/lib/i18n/locales');
const files = fs.readdirSync(localesDir);

const translations = {
  'en.ts': 'Explore Education Hub',
  'zh-TW.ts': '探索教育專區',
  'ar.ts': 'استكشف مركز التعليم',
  'hi.ts': 'शिक्षा केंद्र का अन्वेषण करें',
  'ja.ts': '教育ハブを探索する',
  'ko.ts': '교육 허브 탐색',
  'pa.ts': 'ਸਿੱਖਿਆ ਕੇਂਦਰ ਦੀ ਪੜਚੋਲ ਕਰੋ',
  'pl.ts': 'Odkryj centrum edukacji',
  'ro.ts': 'Explorează Centrul de Educație',
  'ur.ts': 'تعلیمی مرکز کو دریافت کریں',
};

files.forEach(file => {
  if (translations[file]) {
    const filePath = path.join(localesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if visitDashboard already exists in education_sec
    if (content.includes('visitDashboard:')) {
      console.log(`${file}: found visitDashboard, skipping.`);
      return;
    }

    // Find the end of education_sec (which ends with tuteeProfile or tutorProfile)
    const searchPattern = /education_sec:\s*{([\s\S]*?)},\s*home:/;
    const match = content.match(searchPattern);

    if (match) {
        const inner = match[1];
        // Insert visitDashboard before the closing brace of education_sec
        const lastBraceIndex = content.lastIndexOf('}', match.index + match[0].length - 8); 
        // Safer way: replace the end of the education_sec object
        const newInner = inner.trim();
        const replacement = `education_sec: { ${newInner},\n    visitDashboard: "${translations[file]}"\n  }, \n  home:`;
        const newContent = content.replace(searchPattern, replacement);
        
        fs.writeFileSync(filePath, newContent);
        console.log(`${file}: SUCCESS`);
    } else {
        console.log(`${file}: FAILED to find marker`);
    }
  }
});
