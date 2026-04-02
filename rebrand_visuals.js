const fs = require('fs');
const path = require('path');

const rootDir = path.join(process.cwd(), 'src');

const replacements = [
  // Tailwind classes
  { from: /emerald/g, to: 'amber' },
  // Hardcoded Hex codes
  { from: /#059669/gi, to: '#d4af37' },
  { from: /#047857/gi, to: '#b8860b' },
  { from: /#10b981/gi, to: '#facc15' },
  { from: /#34d399/gi, to: '#fde047' },
  { from: /rgba\(4, 120, 87/g, to: 'rgba(212, 175, 55' },
  { from: /rgba\(5, 150, 105/g, to: 'rgba(212, 175, 55' }
];

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walkDir(filePath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let originalContent = content;
            
            for (const r of replacements) {
                content = content.replace(r.from, r.to);
            }
            
            if (content !== originalContent) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated: ${filePath}`);
            }
        }
    }
}

console.log("Starting visual rebranding migration...");
walkDir(rootDir);
console.log("Visual rebranding completed.");
