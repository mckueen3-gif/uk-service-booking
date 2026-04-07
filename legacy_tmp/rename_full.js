const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\MCQueen\\.gemini\\antigravity\\scratch\\uk_service_booking\\src';

function walk(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('ServiceHub')) {
        // Replace Case-Insensitive or specific patterns
        content = content.replace(/ServiceHub/g, 'ConciergeAI');
        content = content.replace(/servicehub/g, 'conciergeai');
        fs.writeFileSync(fullPath, content);
        console.log(`Deep Updated: ${fullPath}`);
      }
    }
  });
}

walk(srcDir);
