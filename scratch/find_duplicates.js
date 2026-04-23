
import fs from 'fs';
import path from 'path';

const localesDir = 'src/lib/i18n/locales';
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  console.log(`Cleaning up ${file}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find all occurrences of merchant_dashboard: { ... }
  // This is tricky with nested braces.
  // But we know it usually ends with }, at the next level.
  
  const occurrences = [];
  let pos = content.indexOf('merchant_dashboard: {');
  while (pos !== -1) {
    occurrences.push(pos);
    pos = content.indexOf('merchant_dashboard: {', pos + 1);
  }
  
  if (occurrences.length > 1) {
    console.log(`  Found ${occurrences.length} occurrences in ${file}. Cleaning up...`);
    
    // Simplest way: the last one usually wins in JS, but it might be incomplete.
    // I'll take the FIRST one (which is usually the complete one) and delete the others.
    // OR: Just manually fix en.ts and check others.
  }
});
