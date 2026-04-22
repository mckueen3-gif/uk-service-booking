const fs = require('fs');
const path = require('path');

function fixFile(filePath, replacements) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');

  for (const [key, newValue] of Object.entries(replacements)) {
    const keyPattern = new RegExp(`^  ${key}: \\{`, 'm');
    const match = content.match(keyPattern);
    if (!match) {
        // If not found, append before the last };
        content = content.replace(/\s*\}\s*;\s*$/, `,\n  ${key}: ${newValue}\n};\n`);
        console.log(`Key ${key} appended to ${filePath}`);
        continue;
    }
    
    const start = match.index;
    let end = -1;
    let braceCount = 0;
    for (let i = start + match[0].length - 1; i < content.length; i++) {
      if (content[i] === '{') braceCount++;
      if (content[i] === '}') braceCount--;
      if (braceCount === 0) {
        end = i + 1;
        break;
      }
    }
    
    if (end !== -1) {
      content = content.slice(0, start) + `  ${key}: ${newValue}` + content.slice(end);
      console.log(`Key ${key} updated in ${filePath}`);
    }
  }

  fs.writeFileSync(fullPath, content);
}

const labelsEN = `{
      overview: 'Overview',
      ai_secretary: 'AI Secretary',
      promotions: 'Promotion Hub',
      referral_program: 'Referral Program',
      toolkit_portal: 'Modular Toolkit',
      bookings: 'My Bookings',
      messages: 'Live Messages',
      schedule: 'Service Schedule',
      services: 'Service Management',
      availability: 'Availability',
      analytics: 'Performance Audit',
      verification: 'Expert Verification',
      accounting: 'Ledger & Tax',
      wallet: 'Earnings Wallet',
      verified: 'Verified Pro',
      expert: 'ConciergeAI Expert',
      profile: 'Profile Preferences',
      logout: 'Exit Protocol'
    }`;

const labelsZH = `{
      overview: '概覽',
      ai_secretary: 'AI 秘書',
      promotions: '促銷中心',
      referral_program: '推薦計劃',
      toolkit_portal: '專家工具箱',
      bookings: '我的預約',
      messages: '即時訊息',
      schedule: '服務排程',
      services: '服務管理',
      availability: '空檔設置',
      analytics: '數據審計',
      verification: '專家認證',
      accounting: '帳本與稅務',
      wallet: '收益錢包',
      verified: '認證專家',
      expert: 'ConciergeAI 專家',
      profile: '個人資料設置',
      logout: '退出登錄'
    }`;

const labelsJA = `{
      overview: '概要',
      ai_secretary: 'AI 秘書',
      promotions: 'プロモーションハブ',
      referral_program: '紹介プログラム',
      toolkit_portal: 'モジュール式ツールキット',
      bookings: 'マイ予約',
      messages: 'ライブメッセージ',
      schedule: 'サービススケジュール',
      services: 'サービス管理',
      availability: '空き状況',
      analytics: 'パフォーマンス監査',
      verification: 'エキスパート認証',
      accounting: '帳簿と税金',
      wallet: '収益ウォレット',
      verified: '認証済みプロ',
      expert: 'ConciergeAI エキスパート',
      profile: 'プロフィール設定',
      logout: 'ログアウト'
    }`;

const labelsKO = `{
      overview: '개요',
      ai_secretary: 'AI 비서',
      promotions: '프로모션 허브',
      referral_program: '추천 프로그램',
      toolkit_portal: '모듈형 툴킷',
      bookings: '나의 예약',
      messages: '라이브 메시지',
      schedule: '서비스 일정',
      services: '서비스 관리',
      availability: '가용성',
      analytics: '성과 감사',
      verification: '전문가 인증',
      accounting: '장부 및 세금',
      wallet: '수익 지갑',
      verified: '인증된 프로',
      expert: 'ConciergeAI 전문가',
      profile: '프로필 설정',
      logout: '로그아웃'
    }`;

function getMerchant(lang, labels) {
    // We keep existing content by just adding/updating labels
    return `{
    labels: ${labels},
    // ... rest of merchant keys preserved ...
  }`;
}

// Since I want to preserve other merchant keys, I'll update my fixFile to be smarter 
// OR I'll just append labels to merchant if missing.
// Actually, I'll just use a simpler approach: update the labels key specifically.

function fixNestedKey(filePath, parentKey, childKey, newValue) {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');

    const parentPattern = new RegExp(`^  ${parentKey}: \\{`, 'm');
    const parentMatch = content.match(parentPattern);
    if (!parentMatch) return;

    const start = parentMatch.index;
    let end = -1;
    let braceCount = 0;
    for (let i = start + parentMatch[0].length - 1; i < content.length; i++) {
        if (content[i] === '{') braceCount++;
        if (content[i] === '}') braceCount--;
        if (braceCount === 0) {
            end = i + 1;
            break;
        }
    }

    if (end !== -1) {
        let parentContent = content.slice(start, end);
        const childPattern = new RegExp(`^    ${childKey}: \\{`, 'm');
        const childMatch = parentContent.match(childPattern);

        if (childMatch) {
            // Update existing child
            const cStart = childMatch.index;
            let cEnd = -1;
            let cBraceCount = 0;
            for (let i = cStart + childMatch[0].length - 1; i < parentContent.length; i++) {
                if (parentContent[i] === '{') cBraceCount++;
                if (parentContent[i] === '}') cBraceCount--;
                if (cBraceCount === 0) {
                    cEnd = i + 1;
                    break;
                }
            }
            if (cEnd !== -1) {
                parentContent = parentContent.slice(0, cStart) + `    ${childKey}: ${newValue}` + parentContent.slice(cEnd);
            }
        } else {
            // Append child after the first {
            parentContent = parentContent.replace(/^  \w+: \{/, (m) => m + `\n    ${childKey}: ${newValue},`);
        }
        
        content = content.slice(0, start) + parentContent + content.slice(end);
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${parentKey}.${childKey} in ${filePath}`);
    }
}

fixNestedKey('src/lib/i18n/locales/en.ts', 'merchant', 'labels', labelsEN);
fixNestedKey('src/lib/i18n/locales/zh-TW.ts', 'merchant', 'labels', labelsZH);
fixNestedKey('src/lib/i18n/locales/ja.ts', 'merchant', 'labels', labelsJA);
fixNestedKey('src/lib/i18n/locales/ko.ts', 'merchant', 'labels', labelsKO);
