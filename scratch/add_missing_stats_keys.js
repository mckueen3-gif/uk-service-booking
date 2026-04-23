
import fs from 'fs';
import path from 'path';

const localesDir = 'src/lib/i18n/locales';
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  console.log(`Processing ${file}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the stats: { block inside merchant_dashboard
  if (content.includes('stats: {')) {
    if (!content.includes('escrowHeld:')) {
      content = content.replace('stats: {', 'stats: {\n      escrowHeld: "In Escrow",\n      reviews: "Reviews",');
      console.log(`  Added escrowHeld and reviews to stats in ${file}`);
    }
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
});
