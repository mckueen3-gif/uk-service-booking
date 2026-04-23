
import fs from 'fs';
const path = 'src/app/member/profile/components/ProfileContent.tsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace('{t?.common?.merchantPortal || "Merchant Dashboard"}', '{t?.common?.merchantPortal?.displayName || t?.common?.merchantPortal || "Merchant Dashboard"}');
fs.writeFileSync(path, content, 'utf8');
console.log('Fixed ProfileContent.tsx');
