
import fs from 'fs';
import path from 'path';

const localesDir = 'src/lib/i18n/locales';
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  console.log(`Fixing common.merchantPortal in ${file}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Use regex to find merchantPortal: "..." and replace with merchantPortal: { displayName: "..." }
  // Only if it's not already an object.
  content = content.replace(/merchantPortal:\s*"([^"]+)"/g, 'merchantPortal: { displayName: "$1" }');
  
  fs.writeFileSync(filePath, content, 'utf8');
});
