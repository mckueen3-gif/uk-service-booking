
import fs from 'fs';
import path from 'path';

const localesDir = 'src/lib/i18n/locales';
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  const buffer = fs.readFileSync(filePath);
  
  // Convert to string using utf-8, but replace invalid sequences
  const content = buffer.toString('utf8');
  
  // Re-encode back to clean UTF-8
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Sanitized ${file}`);
});
