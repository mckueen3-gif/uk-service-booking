
import fs from 'fs';

const content = fs.readFileSync('src/lib/i18n/locales/zh-TW.ts', 'utf8');
let depth = 0;
const lines = content.split('\n');

lines.forEach((line, i) => {
    const open = (line.match(/\{/g) || []).length;
    const close = (line.match(/\}/g) || []).length;
    depth += open - close;
    if (i >= 600 && i <= 900) {
        console.log(`${i + 1}: ${depth} | ${line.trim()}`);
    }
});
