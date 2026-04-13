const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'src/lib/i18n/locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.ts'));

// Reference source
const enContent = fs.readFileSync(path.join(localesDir, 'en.ts'), 'utf8');

/**
 * Deep merge missing properties from source to target while preserving target's values.
 * This is a text-based approximate parser for TS objects.
 */
function syncProperties(targetContent, sourceContent, filename) {
    let result = targetContent;

    // 1. Ensure 'trustedBy' is in 'home' root
    if (!result.includes('trustedBy:')) {
        result = result.replace(/home:\s*{/, 'home: {\n    trustedBy: "Trusted by UK Residents & Verified by",');
    }

    // 2. Ensure 'clinicalStandard' is in 'diagnosis.tool'
    if (!result.includes('clinicalStandard:')) {
        result = result.replace(/ukStandard:\s*"[^"]*"/, (match) => `${match}, clinicalStandard: "Clinical Standard"`);
    }

    // 3. Ensure 'voucherDisclaimer' is in 'merchant.dashboard.wallet.rewards'
    if (!result.includes('voucherDisclaimer:')) {
        result = result.replace(/statusReady:\s*"[^"]*"/, (match) => `${match}, voucherDisclaimer: "* Rewards redeemable for retail vouchers only. No cash withdrawal."`);
    }

    // 4. Ensure 'referralLabel' is in 'referralCTA'
    if (!result.includes('referralLabel:')) {
        result = result.replace(/button:\s*"[^"]*"/, (match) => `${match}, referralLabel: "Your Unique Node Code:"`);
    }
    
    // 5. Ensure 'voucherDisclaimer' is in 'referralCTA' (duplicate name, same object)
    if (result.match(/referralCTA:[\s\S]*?button:[\s\S]*?}/) && !result.match(/referralCTA:[\s\S]*?voucherDisclaimer:/)) {
        result = result.replace(/(referralCTA:[\s\S]*?})(\s*,?\s*educationCTA)/, (match, p1, p2) => {
             return p1.replace(/}$/, ', voucherDisclaimer: "* Rewards redeemable for retail vouchers only. No cash withdrawal." }') + p2;
        });
    }

    return result;
}

files.forEach(file => {
    if (file === 'en.ts') return;
    const filePath = path.join(localesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const updated = syncProperties(content, enContent, file);
    fs.writeFileSync(filePath, updated);
    console.log(`Synced: ${file}`);
});
