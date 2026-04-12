const fs = require('fs');
const path = require('path');

const localesDir = path.join(process.cwd(), 'src/lib/i18n/locales');
const files = fs.readdirSync(localesDir);

const legalEn = `  legal: {
    ui: {
      chooseLanguage: 'Choose Language',
      downloadPDF: 'Download PDF',
      overview: 'Overview',
      close: 'Close',
      selectLanguage: 'Select your language',
    },
    privacy: {
      title: "Privacy Policy",
      effective: "Effective Date: 15 April 2026",
      lastUpdated: "Last Updated: 9 April 2026",
      intro: "ConciergeAI respects your privacy and is committed to protecting your personal data.",
      office: "Registered office: 61a Bridge Street, Kington, United Kingdom, HR5 3DJ",
      notice: "Please read this Privacy Policy carefully. By using our Services, you acknowledge that you have read and understood this Policy.",
      sections: {
        collect: { title: "1. Data Collection", desc: "We collect data when you visit our website, use our AI tools, or book services.", users: "Identity & Contact Data", experts: "Professional Credentials", special: "Special Category Data", auto: "Automatic Technical Collection" },
        how_collect: { title: "2. How we collect", desc: "We collect data through direct interactions, automated technologies, or third parties like analytics providers." },
        purposes: { 
          title: "3. Purposes", 
          desc: "We only use your data when the law allows us to.", 
          table: [
            { purpose: "Purpose/Activity", basis: "Lawful Basis", examples: "Data Categories" },
            { purpose: "Manage Bookings", basis: "Performance of Contract", examples: "Identity, Contact, Financial" },
            { purpose: "AI Diagnostic Analysis", basis: "Legitimate Interest", examples: "Technical, Images, Usage" }
          ], 
          special_notice: "We do not process special category data unless required by law or with your explicit consent." 
        },
        sharing: { title: "4. Sharing", desc: "We may share data with:", list: ["Service Experts", "Core Technology Providers", "Regulatory Bodies"], sell_notice: "We do not sell your personal data to third parties." },
        transfers: { title: "5. Transfers", desc: "Your data is primarily processed in the UK. Any international transfers insure equivalent protection levels." },
        security: { title: "6. Security", desc: "We have implemented robust encryption and access controls.", notice: "All payment data is encrypted via PCI-compliant processors." },
        retention: { title: "7. Retention", desc: "We retain data only as long as necessary to fulfill the purposes of collection.", img_notice: "Diagnostic images are generally kept for 30-90 days." },
        rights: { title: "8. Your Rights", desc: "You have several rights including:", list: ["Right to Access your data", "Right to Correction", "Right to Erasure", "Withdraw Consent"], final: "To exercise your rights, contact us." },
        cookies: { title: "9. Cookies", desc: "We use cookies to enhance your browsing experience." },
        children: { title: "10. Children", desc: "Our services are not intended for children under 13." },
        third_party: { title: "11. Third Parties", desc: "We are not responsible for the privacy practices of third-party websites." },
        changes: { title: "12. Changes", desc: "We may update this policy at any time." },
        contact: { title: "13. Contact", desc: "For any questions regarding this policy:", addrTitle: "Registered Address", emailTitle: "Email", ico: "Information Commissioner's Office (ICO)" }
      }
    },
    cookies: {
      title: 'Cookie Policy',
      effective: 'Effective Date: 15 April 2026',
      lastUpdated: 'Last Updated: 9 April 2026',
      intro: 'Phoenix Sovereign Intelligence uses cookies and similar tracking technologies (such as pixels, web beacons, local storage, and scripts) on our website and when providing our Services. This Cookie Policy explains what cookies and technologies we use, why we use them, and how you can manage them. It forms part of our Privacy Policy.',
      sections: {
        what: { 
          title: "1. What Are Cookies and Similar Technologies?", 
          desc: "Cookies are small text files placed on your device when you visit a website. We also use similar technologies, including scripts and APIs from third-party providers, to enable core functions, analyse usage, process payments, and power our AI features." 
        },
        types: { 
          title: "2. Types of Cookies and Technologies We Use", 
          items: [
            { name: "Strictly Necessary Cookies", desc: "Essential for the Website to function, including secure login, session management, fraud prevention, and handling AI image uploads or payment processes. These do not require your consent." },
            { name: "Performance and Analytics Cookies", desc: "Help us understand how visitors use the Website, measure performance, and improve our Services and AI diagnosis tool." },
            { name: "Functional and Preference Cookies", desc: "Remember your choices (such as language or account preferences) to provide a better experience." },
            { name: "Targeting / Marketing Cookies", desc: "Used to deliver relevant content or measure marketing effectiveness. We only use them with your explicit consent." },
            { name: "AI Diagnosis Technologies", desc: "When you use our AI diagnosis feature, temporary cookies, local storage, or scripts may be used to handle secure uploads and processing sessions." }
          ] 
        },
        third_party: { 
          title: "3. Third-Party Cookies and Technologies", 
          payment: { title: "Payment Processing", desc: "Stripe: Used for secure payment processing and payouts. Stripe may set cookies for session management, fraud detection, and payment Link functionality." },
          ai: { 
            title: "AI and Machine Learning Providers", 
            providers: [
              { name: "Grok (xAI)", desc: "Powers advanced AI features and responses." },
              { name: "ChatGPT (OpenAI)", desc: "Assists with AI diagnosis and text processing." },
              { name: "Gemini (Google)", desc: "Provides image analysis and generative AI capabilities." }
            ],
            note: "These services are primarily accessed via secure API calls. However, their scripts may set performance or analytics cookies when loaded on the Website."
          },
          other: { title: "Other Common Categories", list: ["Analytics (Google Analytics)", "Identity Verification (Background checks)", "Infrastructure & Hosting"] },
          no_sell: "We do not sell your data. AI providers process data only as necessary to deliver the requested service."
        },
        duration: { title: "4. How Long Do Cookies Last?", session: "Session cookies: Deleted when you close your browser.", persistent: "Persistent cookies: Remain on your device for a set period (days to 2 years) or until deleted." },
        manage: { title: "5. Managing Your Cookie Preferences", intro: "When you first visit our Website, a cookie consent banner will appear. You can choose to Accept All, Reject All, or Customise.", options: ["Clicking 'Cookie Settings' in the footer", "Adjusting your browser settings"], footer: "Non-essential cookies and third-party scripts will only load after you give consent." },
        updates: { title: "6. Updates to This Cookie Policy", desc: "We may update this policy as we add or change third-party tools. We recommend reviewing this page periodically." },
        contact: { title: "7. Contact Us", addr: "61a Bridge Street, Kington, United Kingdom, HR5 3DJ", email: "privacy@conciergeai.uk", ico: "Information Commissioner's Office (ICO)" }
      }
    },
    terms: {
      title: "Terms of Service",
      lastUpdated: "9 April 2026",
      sections: {
        acceptance: { title: "1. Acceptance", desc: "Agree to governance terms by using the service." },
        role: { title: "2. Role", desc: "Marketplace connection platform." },
        booking: { title: "3. Booking", desc: "Managed via Platform for security.", list: ["24h Cancellation Policy", "Scope Confirmation"] },
        dispute: { title: "4. AI Arbitration", desc: "Evidence based resolution via our AI system.", sub: "Manual oversight available." },
        payment: { title: "5. Payments", desc: "Held in escrow until service completion.", list: ["Stripe Secure Payments", "Escrow Protection"] },
        liability: { title: "6. Liability", desc: "Limited to service fee." }
      }
    },
    footer: {
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      home: "Return to Registry"
    }
  }`;

const legalZh = `  legal: {
    ui: {
      chooseLanguage: '選擇語言',
      downloadPDF: '下載 PDF',
      overview: '概覽',
      close: '關閉',
      selectLanguage: '選擇您的語言',
    },
    privacy: {
      title: "隱私政策",
      effective: "生效日期：2026年4月15日",
      lastUpdated: "最後更新：2026年4月9日",
      intro: "ConciergeAI 尊重您的隱私且致力於保護您的個人數據。",
      office: "註冊地址: 61a Bridge Street, Kington, United Kingdom, HR5 3DJ",
      notice: "請仔細閱讀本隱私政策。使用我們的服務即表示您已閱讀並理解本政策。",
      sections: {
        collect: { title: "1. 數據收集", desc: "我們在您訪問網站、使用 AI 工具或註冊服務時收集數據。", users: "身份與聯繫數據", experts: "專業資格數據", special: "特殊類別數據", auto: "自動技術收集" },
        how_collect: { title: "2. 我們如何收集", desc: "我們通過直接互動、自動化技術或第三方（如分析供應商）收集數據。", table: [] },
        purposes: { 
          title: "3. 目的", 
          desc: "我們僅在法律允許的情況下使用您的數據。", 
          table: [
            { purpose: "處理目的", basis: "法律依據", examples: "涉及數據類別" },
            { purpose: "管理預訂", basis: "合同履行", examples: "身份、聯繫、財務" },
            { purpose: "AI 診斷分析", basis: "合法利益", examples: "技術、圖像、使用情況" }
          ], 
          special_notice: "除非法律要求 or 經您明確同意，否則我們不處理特殊類別數據。" 
        },
        sharing: { title: "4. 分享", desc: "我們可能與以下各方分享數據：", list: ["特約服務專家", "核心技術供應商", "監管機構"], sell_notice: "我們不會向第三方出售您的個人數據。" },
        transfers: { title: "5. 轉移", desc: "您的數據主要在英國處理，任何國際轉移都將確保具備同等的保護水平。" },
        security: { title: "6. 安全", desc: "我們已實施強大的加密和訪問控制措施。", notice: "所有支付數據均通過符合 PCI 標準的處理器加密。" },
        retention: { title: "7. 保留", desc: "我們僅在實現收集目的所需的時間內保留數據。", img_notice: "診斷圖像通常保留 30-90 天。" },
        rights: { title: "8. 您的權利", desc: "您擁有多項權利，包括：", list: ["請求訪問您的數據", "請求更正數據", "請求刪除數據", "撤回同意"], final: "如需行使權利，請聯繫我們。" },
        cookies: { title: "9. Cookies", desc: "我們使用 cookies 來提升您的瀏覽體驗。" },
        children: { title: "10. 兒童", desc: "我們的服務不針對 13 歲以下的兒童。" },
        third_party: { title: "11. 第三方", desc: "我們不對第三方網站的隱私慣例負責。" },
        changes: { title: "12. 變更", desc: "政策可能會更新。" },
        contact: { title: "13. 聯繫", desc: "如有關於此政策的任何問題：", addrTitle: "註冊地址", emailTitle: "電子郵件", ico: "信息專員辦公室 (ICO)" }
      }
    },
    cookies: {
      title: 'Cookie 政策',
      effective: '生效日期：2026年4月15日',
      lastUpdated: '最後更新：2026年4月9日',
      intro: 'Phoenix Sovereign Intelligence 在我們的網站以及提供服務（包括 AI 診斷工具、預訂系統、專家匹配、支付處理和推薦計劃）時使用 Cookies 及類似的追蹤技術。本政策解釋了我們使用哪些技術、原因以及您如何管理它們。',
      sections: {
        what: { 
          title: "1. 什麼是 Cookies 與類似技術？", 
          desc: "Cookies 是您訪問網站時放置在設備上的小型文本文件。我們還使用類似技術（包括來自第三方供應商的脚本和 API）來啟用核心功能、分析使用情況、處理支付並驅動我們的 AI 功能。" 
        },
        types: { 
          title: "2. 我們使用的 Cookies 與技術類別", 
          items: [
            { name: "絕對必要 Cookies", desc: "網站運行所必需，包括安全登錄、會話管理、欺詐預防，以及處理 AI 圖像上傳或支付流程。這些不需要您的同意。" },
            { name: "性能與分析 Cookies", desc: "幫助我們了解訪客如何使用網站、衡量性能，並改進我們的服務與 AI 診斷工具。" },
            { name: "功能與偏好 Cookies", desc: "記住您的選擇（如語言或帳戶偏好），以提供更好的體驗。" },
            { name: "定向 / 營銷 Cookies", desc: "用於提供相關內容或衡量營銷效果。我們僅在獲得您明確同意的情況下使用。" },
            { name: "AI 診斷技術", desc: "當您使用 AI 診斷功能時，可能會使用臨時 Cookies、本地存儲或脚本來處理安全上傳和分析會話。" }
          ] 
        },
        third_party: { 
          title: "3. 第三方 Cookies 與技術", 
          payment: { title: "支付處理", desc: "Stripe：用於安全的支付處理和結算。Stripe 可能會設置 Cookies 用於會話管理、欺詐檢測和支付鏈接功能。" },
          ai: { 
            title: "AI 與機器學習服務商", 
            providers: [
              { name: "Grok (xAI)", desc: "驅動高級 AI 功能與回覆。" },
              { name: "ChatGPT (OpenAI)", desc: "協助 AI 診斷與文本處理。" },
              { name: "Gemini (Google)", desc: "提供圖像分析與生成式 AI 能力。" }
            ],
            note: "這些服務主要通過安全 API 調用訪問。然而，當在網站上加載時，其脚本可能會設置性能或分析型 Cookies。"
          },
          other: { title: "其他常見類別", list: ["分析型 (Google Analytics)", "身份驗證與背景調查", "基礎設施與託管服務"] },
          no_sell: "我們不出售您的數據。AI 服務商僅在提供所請求服務的必要範圍內處理數據。"
        },
        duration: { title: "4. Cookies 的保留時間", session: "會話 Cookies：當您關閉瀏覽器時刪除。", persistent: "持久性 Cookies：在您的設備上保留設定的時間段（數天至 2 年），或直到被刪除。" },
        manage: { title: "5. 管理您的 Cookie 偏好", intro: "當您首次訪問我們的網站時，會出現 Cookie 同意橫幅。您可以選擇：全部接受、全部拒絕（非必要項）或自定義。", options: ["點擊頁尾的「Cookie 設置」", "調整您的瀏覽器設置"], footer: "非必要 Cookies 和第三方脚本僅在您給予同意後才會加載。" },
        updates: { title: "6. 本 Cookie 政策的更新", desc: "隨著我們增加或更改第三方工具，我們可能會更新此政策。建議您定期查看此頁面。" },
        contact: { title: "7. 聯絡我們", addr: "61a Bridge Street, Kington, United Kingdom, HR5 3DJ", email: "privacy@conciergeai.uk", ico: "信息專員辦公室 (ICO)" }
      }
    },
    terms: {
      title: "服務條款",
      lastUpdated: "2026年4月9日",
      sections: {
        acceptance: { title: "1. 接受", desc: "使用本服務即表示您同意這些條款。" },
        role: { title: "2. 角色", desc: "我們是一個連接用戶與服務專家的平台。" },
        booking: { title: "3. 預訂", desc: "所有預訂必須通過平台完成以確保安全。", list: ["24小時取消政策", "服務範圍確認"] },
        dispute: { title: "4. AI 仲裁", desc: "糾紛將通過我們的 AI 仲裁系統初步處理。", sub: "必要時可要求人工覆核。" },
        payment: { title: "5. 付款", desc: "資金由第三方託管，直至服務完成。", list: ["Stripe 安全支付", "託管賬戶保護"] },
        liability: { title: "6. 責任", desc: "我們的責任僅限於收取的服務費用。" }
      }
    },
    footer: {
      terms: "服務條款",
      privacy: "隱私政策",
      home: "返回註冊中心"
    }
  }`;

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find index of root-level legal block
    const rootLegalIndex = content.indexOf('\n  legal: {');
    const isZh = (file === 'zh-TW.ts');
    const block = isZh ? legalZh : legalEn;

    if (rootLegalIndex !== -1) {
       console.log(`Updating existing legal in ${file}...`);
       // Find the end of the legal block
       let balance = 1;
       let endIdx = -1;
       const startIndex = content.indexOf('{', rootLegalIndex);
       for (let i = startIndex + 1; i < content.length; i++) {
         if (content[i] === '{') balance++;
         if (content[i] === '}') balance--;
         if (balance === 0) {
           endIdx = i;
           break;
         }
       }

       if (endIdx !== -1) {
         const before = content.substring(0, rootLegalIndex);
         const after = content.substring(endIdx + 1);
         fs.writeFileSync(filePath, before + '\n' + block + after);
       }
    } else {
       console.log(`Appending legal to ${file}...`);
       const lastBraceIndex = content.lastIndexOf('};');
       if (lastBraceIndex !== -1) {
         const body = content.substring(0, lastBraceIndex).trim();
         const separator = body.endsWith(',') ? '\n' : ',\n';
         fs.writeFileSync(filePath, body + separator + block + '\n};');
       }
    }
  } catch (err) {
    console.error(`Error processing ${file}: ${err.message}`);
  }
});
