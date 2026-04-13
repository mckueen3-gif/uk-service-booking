const fs = require('fs');
const filePath = 'src/lib/i18n/locales/ar.ts';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove misplaced trustedBy at line 378 (inside hero)
// We'll use a more precise replacement than line numbers if possible, 
// but since I know the exact content from previous view_file:
const oldHeroLine = '      popularTags: ["تجديد المنزل", "تقديم الضرائب", "تنظيف عميق", "مساعدة قانونية"], trustedBy: "موثوق به من قبل سكان المملكة المتحدة وموثق من قبل" },';
const newHeroLine = '      popularTags: ["تجديد المنزل", "تقديم الضرائب", "تنظيف عميق", "مساعدة قانونية"] },';

if (content.includes(oldHeroLine)) {
    content = content.replace(oldHeroLine, newHeroLine);
    console.log('Misplaced trustedBy removed from hero.');
} else {
    console.log('Target hero line not found. Attempting regex...');
    content = content.replace(/popularTags: \[.*?\], trustedBy: ".*?" \},/, 'popularTags: ["تجديد المنزل", "تقديم الضرائب", "تنظيف عميق", "مساعدة قانونية"] },');
}

// 2. Ensure trustedBy is at the top level of home
// The home object ends after the howItWorks object.
const searchPattern = /howItWorks: {[\s\S]*?}\s*}\s*,/g; // This targets the end of home
content = content.replace(/(howItWorks: {[\s\S]*?})\s*}\s*(\s*,\s*location:)/, (match, howItWorks, location) => {
    return `${howItWorks}\n    },\n    trustedBy: "موثوق به من قبل سكان المملكة المتحدة وموثق من قبل"\n  }${location}`;
});

fs.writeFileSync(filePath, content);
console.log('ar.ts fixed successfully.');
