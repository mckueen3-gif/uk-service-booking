const fs = require('fs');
const path = require('path');

const localesDir = 'C:\\Users\\MCQueen\\.gemini\\antigravity\\scratch\\uk_service_booking\\src\\lib\\i18n\\locales';
const files = fs.readdirSync(localesDir);

files.forEach(file => {
  if (file.endsWith('.ts')) {
    const filePath = path.join(localesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace "ServiceHub" with "ConciergeAI"
    content = content.replace(/ServiceHub/g, 'ConciergeAI');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${file}`);
  }
});
