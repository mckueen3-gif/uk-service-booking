
import fs from 'fs';
import path from 'path';

const localesDir = 'src/lib/i18n/locales';
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  console.log(`Processing ${file}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Rename any existing "merchant: {" to "merchant_dashboard: {"
  content = content.replace(/(\n\s*)merchant:\s*\{/g, '$1merchant_dashboard: {');

  // 2. Fix cases where merchant_dashboard keys are at the root level (broken blocks)
  // We look for common markers like "expertTitle:" or "zero_lead_fee:"
  // If they are not inside merchant_dashboard, we need to fix it.
  
  if (!content.includes('merchant_dashboard: {')) {
    // If it's missing entirely, add a basic version from English as a placeholder
    // Or better, try to find where it should be.
    console.log(`  Warning: ${file} is missing merchant_dashboard block!`);
  }

  // 3. Ensure critical keys for the screenshot are present
  // zero_lead_fee, previewProfile, manageServices
  const criticalKeys = ['zero_lead_fee', 'previewProfile', 'manageServices'];
  criticalKeys.forEach(key => {
    if (content.includes('merchant_dashboard: {') && !content.includes(`${key}:`)) {
       // Insert into stats or labels or just at the top of merchant_dashboard
       content = content.replace('merchant_dashboard: {', `merchant_dashboard: {\n    ${key}: "${key}",`);
       console.log(`  Added missing key ${key} to ${file}`);
    }
  });

  fs.writeFileSync(filePath, content, 'utf8');
});
