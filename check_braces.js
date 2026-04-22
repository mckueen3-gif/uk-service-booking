const fs = require('fs');
const content = fs.readFileSync('src/lib/i18n/locales/zh-TW.ts', 'utf8');
const lines = content.split('\n');
let level = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let c of line) {
        if (c === '{') level++;
        if (c === '}') level--;
    }
    if (level <= 0 && i !== 0 && i < lines.length - 2) {
        console.log(`Object closed prematurely at line ${i + 1}: ${line}`);
        break;
    }
}
console.log(`Final level: ${level}`);
