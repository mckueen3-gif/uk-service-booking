
import fs from 'fs';
import path from 'path';

const localesDir = 'src/lib/i18n/locales';
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  console.log(`Processing ${file}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace "merchant: {" with "merchant_dashboard: {"
  // But be careful not to replace other things. 
  // It's usually at the top level.
  content = content.replace('\n  merchant: {', '\n  merchant_dashboard: {');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Renamed merchant to merchant_dashboard in ${file}`);
});
