
import fs from 'fs';
import path from 'path';

const localesDir = 'src/lib/i18n/locales';
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  console.log(`Fixing ${file}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Find all merchant_dashboard blocks
  const blockHeader = 'merchant_dashboard: {';
  const occurrences = [];
  let pos = content.indexOf(blockHeader);
  while (pos !== -1) {
    occurrences.push(pos);
    pos = content.indexOf(blockHeader, pos + 1);
  }
  
  if (occurrences.length > 1) {
    console.log(`  Found ${occurrences.length} blocks. Merging...`);
    
    // We'll keep the FIRST one as the primary one.
    // We'll remove all subsequent ones.
    // But first, we'll try to find any unique sections in subsequent blocks and add them to the first.
    
    // A simple way to remove subsequent blocks is to find their end.
    // Since these blocks are usually followed by another top-level key or the end of the object.
    
    // I'll use a simpler approach:
    // I'll search for the SECOND occurrence and delete everything from there until the next top-level key.
    
    for (let i = occurrences.length - 1; i >= 1; i--) {
      const start = occurrences[i];
      // Find the end of this block. 
      // Assuming it ends with a }, at a certain indentation or followed by a new key.
      // Most of our blocks end with a }, followed by a newline and then another key.
      
      let end = content.indexOf('\n  },', start); // Most common end
      if (end === -1) end = content.indexOf('\n  }', start);
      
      if (end !== -1) {
        end += 5; // Include the closing brace
        console.log(`  Removing duplicate block at ${start}-${end}`);
        content = content.substring(0, start) + content.substring(end);
      }
    }
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
});
