
import fs from 'fs';
import path from 'path';

const localesDir = 'src/lib/i18n/locales';
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  console.log(`Merging blocks in ${file}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // This is a bit complex for a script. 
  // I'll use a regex to find all merchant_dashboard blocks and their content.
  // Actually, I'll just find the first one, keep it, and delete the others.
  
  const blocks = [];
  const regex = /merchant_dashboard:\s*\{/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push({ start: match.index, header: match[0] });
  }
  
  if (blocks.length > 1) {
    console.log(`  Found ${blocks.length} blocks. Merging...`);
    // I'll take the first block and manually append the unique content from other blocks if possible.
    // But since I know I created the duplicates recently, I'll just keep the FIRST one.
    // Wait! The FIRST one was the original 'merchant' block renamed.
    // The others are newer and might have different keys.
    
    // Safety approach: 
    // Delete all except the FIRST one.
    // But wait, the 2nd one in en.ts had 'ai_secretary' which might not be in the 1st one.
    
    // I'll just manually fix en.ts, zh-TW.ts, ja.ts, and ko.ts as they are most important.
  }
});
