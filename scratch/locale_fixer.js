
import fs from 'fs';
import path from 'path';

const localesDir = 'src/lib/i18n/locales';
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  console.log(`Processing ${file}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Basic check for common block
  if (content.includes('common: {')) {
    if (!content.includes('merchantPortal:')) {
      // Insert after common: {
      content = content.replace('common: {', 'common: {\n    merchantPortal: "Merchant Portal",');
      console.log(`  Added merchantPortal to ${file}`);
    } else {
      console.log(`  merchantPortal already exists in ${file}`);
    }
  } else {
    console.log(`  No common block found in ${file}, skipping.`);
  }
  
  // Ensure valid UTF-8 and save
  fs.writeFileSync(filePath, content, 'utf8');
});
