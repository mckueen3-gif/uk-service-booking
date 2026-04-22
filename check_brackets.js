
import fs from 'fs';

const content = fs.readFileSync('src/lib/i18n/locales/en.ts', 'utf8');
let depth = 0;
const lines = content.split('\n');

for (let i = 600; i < 900; i++) {
    const line = lines[i];
    const open = (line.match(/\{/g) || []).length;
    const close = (line.match(/\}/g) || []).length;
    depth += open - close; // Note: this script needs the total depth from start
}

// Rewriting properly to track from start but only print 600-900
depth = 0;
lines.forEach((line, i) => {
    const open = (line.match(/\{/g) || []).length;
    const close = (line.match(/\}/g) || []).length;
    depth += open - close;
    if (i >= 600 && i <= 900) {
        console.log(`${i + 1}: ${depth} | ${line.trim()}`);
    }
});
