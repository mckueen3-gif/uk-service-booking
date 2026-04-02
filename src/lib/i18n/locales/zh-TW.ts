import { Dictionary } from '../dictionary';

export const zhTW: Dictionary = {
  nav: { 
    browse: "瀏覽服務", join: "成為專家", login: "登入", logout: "登出", 
    dashboard: "我的控制面板", aiDiagnosis: "AI 診斷", education: "教育輔導" 
  },
  common: { viewProfile: "查看檔案", reviews: "則評價", hr: "小時", copy: "複製", copied: "已複製！" },
  hero: { title: "尋找頂尖服務供應商", subtitle: "聯繫您所在地區經過認證的專業人士。", searchPlaceholder: "您需要什麼服務？", badge: "英國排名第一的服務平台" },
  faq: {
    title: "常見問題",
    subtitle: "關於英國服務預訂平台您需要了解的一切。",
    categories: { payments: "付款", disputes: "爭議", bookings: "預訂" },
    aura: { title: "Aura AI 助手", subtitle: "需要即時幫助？與 Aura 聊天以獲得個人化建議。", cta: "與 Aura 聊天" },
    questions: {
      payments: [
        { q: "我該如何支付服務費用？", a: "付款透過 Stripe 安全處理。我們會將資金託管，直到工作確認完成。" },
        { q: "有任何隱藏費用嗎？", a: "沒有。您支付報價。我們收取的少量平台費用已包含在估價中。" }
      ],
      disputes: [
        { q: "如果工作不令人滿意怎麼辦？", a: "我們的 AI 仲裁員會根據初始範圍審查工作照片，以確保公平解決。" },
        { q: "如何申請退款？", a: "如果服務商未能滿足商定條款，您可以透過控制面板發起爭議。" }
      ],
      bookings: [
        { q: "我可以取消預訂嗎？", a: "是的，您可以在預定時間前 24 小時取消並獲得全額退款。" },
        { q: "我該如何聯繫我的專家？", a: "預訂確認後，您將可以訪問直接的安全聊天頻道。" }
      ]
    }
  },
  footer: { tagline: "聯繫英國頂尖認證專業人士。", explore: "探索", legal: "法律", support: "技術支援", rights: "© 2024 UK Service Hub. 保留所有權利。", terms: "服務條款", privacy: "隱私政策", cookies: "Cookie 政策", help: "幫助中心", contact: "聯繫支援", aiDiagnosis: "AI 診斷", homeCleaning: "家庭清潔", plumbingServices: "水電服務", automotiveServices: "汽車維修" },
  search: { 
    filters: "篩選條件", keyword: "關鍵字", location: "地點", category: "類別", minRating: "最低評分", verifiedOnly: "僅顯示已驗證", 
    apply: "應用篩選", sortBy: "排序方式", sortRating: "評分", sortJobs: "完成數量", sortDistance: "距離", sortPrice: "價格", 
    foundCount: "找到 {{count}} 位專家", searching: "正在搜尋專業人士...", noResults: "未找到符合條件的專家", 
    noResultsHint: "請嘗試調整篩選條件或搜尋其他地區。", clearFilters: "清除全部", 
    basePrice: "預估起步價", viewDetails: "查看詳情", listView: "列表", mapView: "地圖", searchThisArea: "搜尋此區域",
    verified: "已驗證", insured: "已投保", priceAudit: "AI 價格稽核：合理", defaultDesc: "專業服務供應商"
  },
  booking: {
    steps: { details: "工作細節", schedule: "預約時間", confirmation: "確認與付款" },
    titles: { details: "告訴我們工作的具體內容", schedule: "選擇合適的時間", confirm: "確認您的預訂", success: "預訂成功！" },
    labels: { date: "日期", time: "時間", make: "廠牌", model: "型號", address: "物業地址", notes: "額外說明", agree: "我同意服務條款及 2% 平台費用", summary: "費用清單", paid: "已支付", merchant: "服務專家", service: "服務項目" },
    buttons: { next: "繼續", prev: "返回", pay: "安全支付", home: "回首頁", dashboard: "前去控制面板" },
    messages: { finalizing: "正在完成您的預訂...", wait: "請勿重新整理頁面", contact24h: "您的專家將在 24 小時內與您聯繫。", safety: "所有款項均由託管處理，以保障您的安全。", noReviews: "暫無評價", recommended: "首選推薦", replyFromMaster: "專家的回覆" },
  },
  merchant: {
    verified: "認證專家", background: "背景調查已完成", portfolio: "先前案例", reviewTitle: "客戶評價", realReviews: "來自真實預訂的評價", verifiedBooking: "已驗證預訂", pricingAnalysis: "AI 價格分析", bookingChannel: "專業預訂頻道", viewServices: "查看所有服務", guarantee: "服務保障", fastResponse: "快速響應", contactExpert: "聯繫專家", noReviews: "暫無評價", reply: "回覆",
    dashboard: {
      title: "商家控制台", welcome: "歡迎回來，", previewProfile: "預覽公開檔案", manageServices: "管理服務",
      stats: { totalBookings: "累計預訂", rating: "平均評分", pendingBalance: "待結算款項", availableBalance: "可提現餘額", totalJobs: "總工作量", escrowHeld: "託管中資金", availableNow: "目前可用", reviews: "評價數" },
      syncStatus: "同步狀態",
      lastSynced: "上次同步",
      refresh: "刷新",
      syncing: "正在同步資料...",
      syncFailed: "同步失敗，請重試",
      wallet: {
        syncing: "正在同步錢包數據...",
        synced: "錢包數據已同步",
        generating: "正在完成帳戶設定...",
        referralTitle: "推薦好友，享 2% 回饋",
        referralDesc: "分享您的專屬推薦碼，好友首次預約後您將獲得 2% 回饋累積下來。",
        historyTitle: "點數明細",
        historyEmpty: "目前尚無交易紀錄",
        type: "類型",
        description: "說明",
        amount: "金額",
        date: "日期",
        referralListTitle: "我的推薦紀錄",
        referralListDesc: "追蹤由您邀請加入的夥伴及其貢獻的 2% 永久收益",
        referee: "被推薦用戶",
        earned: "累積收益",
        expiry: "佣金有效期",
        status: "狀態",
        active: "收益中",
        expired: "已過期",
        joinedAt: "註冊於",
        validUntil: "截止",
        availableNow: "目前可用"
      },
      bookings: { title: "近期預約", viewAll: "查看所有預訂", empty: "近期無預約", completed: "已完成", actions: { confirm: "確認", complete: "標記為完成", variation: "請求額外支付" } },
      status: { pending: "等待中", confirmed: "已確認", completed: "已完成", cancelled: "已取消" },
      variations: { label: "額外工作請求", status: "狀態", pending: "等待客戶確認", approved: "已批准", rejected: "已拒絕", arbiterActive: "AI 仲裁審核中" },
      arbiterReasoning: "AI 仲裁分析",
      tips: { title: "成長建議", growth: "再完成 5 個工作即可達到「金牌」身分，平台佣金將降至 7%。" },
      quickLinks: { title: "快速連結", schedule: "我的行程", earnings: "收入記錄", support: "商家支援" },
      modal: { title: "請求額外費用", amount: "額外金額 (£)", reason: "產生額外費用的原因", reasonPlaceholder: "例如：在牆後發現了額外的漏水點", photo: "照片證明", photoHint: "必須上傳照片，以便 AI 進行驗證", submit: "發送請求", submitting: "正在上傳證明..." },
      avatar: { upload: "上傳個人照片", hint: "推薦：專業頭像或公司 Logo。", success: "頭像已更新！", errorSize: "圖片大小必須在 2MB 以內" },
    },
    portfolio_mgr: {
      title: "案例組合", subtitle: "展示您最優秀的工作以贏得更多預訂。", addBtn: "新增案例", emptyTitle: "尚未新增案例", emptyDesc: "新增您的過往項目照片，建立潛在客戶的信任。",
      modal: { title: "新增案例", itemTitle: "項目標題", itemTitlePlaceholder: "例如：倫敦全屋電路改造", category: "類別", uploadPhoto: "上傳案例照片", errorSize: "照片大小必須在 5MB 以內", details: "項目詳情", aiBtn: "使用 AI 生成", aiGenerating: "AI 寫作中...", detailsPlaceholder: "描述所做的工作、面臨的挑戰以及最終成果。", cancel: "取消", publish: "發布案例" },
      deleteConfirm: "您確定要刪除此案例嗎？", addError: "新增案例失敗。", aiError: "AI 生成失敗。請手動輸入。"
    },
  },
  education_sec: {
    hero: { badge: "英國頂尖導師", title1: "掌握新技能", title2: "與全球專家學習", subtitle: "聯繫學術、語言和專業技能領域的頂級導師。為您的成功量身定制 1 對 1 學習路徑。", searchPlaceholder: "您想學習什麼？", searchBtn: "尋找導師" },
    forYou: { title: "為您推薦", match: "AI 匹配度", viewProfile: "查看檔案" },
    categories: { title: "探索類別", browseBtn: "瀏覽全部", items: { academic: { title: "學術輔導", desc: "IELTS, GCSE, A-Levels 等" }, languages: { title: "語言學習", desc: "英語、中文、西班牙語..." }, coding: { title: "程式開發", desc: "Python, 網頁開發, AI..." }, music: { title: "音樂與藝術", desc: "鋼琴、設計、美術" } } },
    search: { filters: "搜索篩選", mode: "授課模式", online: "線上", offline: "面對面", hybrid: "混合模式", priceRange: "時薪範圍", level: "導師等級", student: "在校大學生", pro: "專業老師", expert: "專家/博士", apply: "應用篩選", resultsTitle: "可選導師", foundCount: "找到 {{count}} 位匹配導師", placeholder: "按科目或姓名搜尋" },
    common: { reviews: "評價", hr: "小時", bookTrial: "預定試聽" },
    tutorCard: { demoDesc: "資深教育者，擁有博士學位及超過 10 年經驗，已協助超過 100 位學生達成學習目標。" },
    tutorProfile: { verified: "認證教育者", about: "關於我", education: "教育背景", experience: "教學經驗", portfolio: "學生成功案例", reviews: "學生評價", availability: "每週行程", bookNow: "立即預訂", aiTrial: "AI 評估試聽", trialChallenge: "嘗試 AI 學科挑戰，贏取課後優惠！", startChallenge: "開始挑戰", cancel: "取消" }
  },
  home: {
    hero: { badge: "經過認證的英國本地大師", title1: "預約頂級評分", title2: "本地專家", subtitle: "即時聯繫英國前 1% 的服務專業人士。經過驗證、已投保並由 AI 監控，確保品質卓越。", searchPlaceholder: "我需要...", locationPlaceholder: "倫敦, 英國", aiMatch: "智能匹配", searchBtn: "搜尋專家" },
    recommendation: { title1: "量身定制", title2: "為您推薦", subtitle: "根據您最近的需求和地點匹配頂級專家。", browse: "瀏覽所有專家" },
    aiCTA: { badge: "GEMINI AI 驅動", title1: "不知道出了什麼問題？", title2: "獲得即時 AI 診斷", subtitle: "上傳問題照片。我們的 AI 會在幾秒鐘內識別出問題、估算成本並找到合適的專家。", button: "嘗試免費 AI 診斷" },
    referralCTA: { badge: "推薦獎勵", title: "賺取 2% 被動收入", subtitle: "推薦朋友，在接下來的 5 年內，他們每次預訂您都能獲得 2% 的佣金（每位朋友最高 £200）。", button: "開始賺取獎金", referralLabel: "您的專屬推廣碼：" },
    educationCTA: "訪問教育輔導面板",
    eliteLocal: "本地精英",
    eliteBadge: "專業精英",
    defaultCategory: "服務專家",
    noResults: "在此類別下未找到專家。",
    categories: { plumbing: "水電工程", repairs: "家庭維修", renovation: "房屋裝修", education: "教育輔導", accounting: "會計稅務", legal: "法律諮詢", commercial: "商業服務", cleaning: "專業清潔", car: "汽車維修" },
    sections: {
      plumbing: { title: "水電與工程", desc: "從緊急漏水到全屋重新佈線，我們為您聯繫認證的英國大師。", items: ["水管維修", "重新佈線", "電器安裝", "鍋爐保養", "開關安裝", "智能家居"] },
      repairs: { title: "家居雜工", desc: "組裝家具、修補牆壁、更換門窗 - 解決所有煩人的家務雜事。", items: ["家具組裝", "門窗維修", "牆壁修補", "層架安裝", "油漆粉刷", "各類雜事"] },
      accounting: { title: "會計與稅務", desc: "專為英國海外居民及中小企業定制。確保您的業務申報合規。", items: ["個人所得稅", "年度帳目", "增值稅申報", "薪資管理", "Xero 諮詢", "稅務分析"] },
      renovation: { title: "房屋裝修", desc: "從廚房擴建到全屋翻新。進度透明，品質保證。", items: ["廚房/衛浴", "房屋擴建", "室內設計", "油漆裝飾", "地板鋪設", "景觀美化"] },
      education: { title: "教育與學習", desc: "1 對 1 導師和專業培訓。為您量身定制進度。", items: ["語言指導", "IELTS/TOEFL", "程式寫作", "音樂與藝術", "商業技能", "學術提升"] },
      cleaning: { title: "專業清潔", desc: "退租深度清潔或定期家庭清潔，注重每個細節。", items: ["定期清潔", "退租清潔", "地毯清潔", "窗戶清潔", "辦公室清潔", "專業消毒"] },
      legal: { title: "法律諮詢", desc: "合規、簽證和法律文件。聯繫專家保障您的權益。", items: ["合約起草", "簽證諮詢", "房產法律", "糾紛解決", "商業法", "公證服務"] },
      commercial: { title: "商業服務", desc: "專為商業空間打造。店鋪裝修、辦公室搬遷和電力維護。", items: ["店鋪規劃", "辦公室搬遷", "商業電力", "消防安全", "IT 網絡", "暖通空調"] }
    },
    popularTitle: "熱門項目", popularIn: "在", allUK: "全英國",
    noProjects: { title: "此類別下未找到項目", desc: "我們正在積極召募您所在地區的頂尖專家。" },
    reviews: { excellent: "優異", basedOn: "基於", verified: "已驗證", countLabel: "則評價" }
  },
  location: { selectCity: "選擇城市", detecting: "偵測中...", switch: "切換", nearby: "附近服務" },
  diagnosis: {
    badge: "由 GEMINI AI 驅動",
    title1: "專業維修",
    title2: "秒級識別",
    subtitle: "停止猜測。我們的 AI 分析您的照片，在您預訂前提供即時洞察、維修範圍和公平的英國價格估算。",
    features: {
      instant: { title: "即時洞察", desc: "不再等待回電。上傳後立即獲得技術分析。" },
      pricing: { title: "公平市場定價", desc: "我們使用實時英國服務數據，為您的地區提供準確的價格範圍。" },
      verified: { title: "認證預預訂", desc: "診斷後，直接聯繫專注於您問題的前 1% 專家。" }
    },
    cta: "瀏覽所有服務",
    tool: {
      title: "即時 AI 診斷",
      subtitle: "上傳照片，讓我們的 AI 估算維修成本和範圍。",
      step1: "1. 上傳照片證明",
      step2: "2. 選擇分類",
      step3: "3. 描述問題 (可選)",
      uploadHint: "拍攝照片或上傳",
      replaceHint: "點擊更換照片",
      submit: "生成免費 AI 診斷",
      loading: "生成 AI 洞察中...",
      disclaimer: "AI 估算僅供參考。正式報價由專業人士提供。",
      newDiagnosis: "新診斷",
      categories: { plumbing: "水電與熱能", auto: "汽車維修", renovation: "房屋裝修", electrical: "電力工程", cleaning: "專業清潔" },
      resultTitle: "AI 診斷結果",
      detectedIssue: "偵測到的問題",
      recommendedSolution: "建議解決方案",
      estimatedCostLabel: "預估價格範圍",
      ukStandard: "英國標準定價",
      includesLabor: "包含零件與人工",
      bookSpecialist: "預約此專家",
      confidence: "置信度",
      analyzedPhoto: "分析的照片",
      guaranteedRepairs: "維修保障",
      disputeResolution: "支援爭議解決",
      fastTurnaround: "快速處理時間",
      responseHours: "{category} 專家通常在 2 小時內回覆。",
      errorPhotoCategory: "請上傳照片並選擇類別。",
      errorUnexpected: "發生預期外的錯誤：",
      uploadFormatHint: "支援格式：JPG, PNG, WebP (最大 10MB)",
      descriptionPlaceholder: "選填：描述問題詳情（例如：『大雨後水管開始漏水』或『引擎發出喀噠聲』）",
      strictMode: "嚴格視覺模式",
      strictModeHint: "高精度視覺推理 (深度分析模式)"
    }
  },
  onboarding: {
    hero: { title: "加入 ServiceHub 擴展您的業務", subtitle: "加入英國最精銳的認證服務專家網絡。" },
    steps: { profile: "商家檔案", credentials: "英國資質", contract: "服務協議" },
    sectors: { title: "選擇您的行業", professional: { title: "專業服務", desc: "會計、法律、諮詢", industries: ["會計師", "稅務諮詢", "法律服務", "商業戰略"] }, education: { title: "教育輔導", desc: "導師、培訓師、教練", industries: ["學科導師", "語言培訓", "技能教練", "音樂老師"] }, technical: { title: "技術維修", desc: "技工、維修、工程", industries: ["水電工", "電力工程師", "汽車維修", "房屋裝修"] } },
    contract: { title: "標準服務協議", scrollingNotice: "請滾動到底部以接受條款。", agree: "我已閱讀並同意 ServiceHub 主協議。", clauses: { platform_fee: { title: "1. 平台服務費", body: "ServiceHub 對成功預訂收取 8% 的佣金。新專家的前 5 個工作完全免佣金。" }, payments: { title: "2. 託管與撥款", body: "客戶付款保存在安全託管中。在客戶確認工作完成 48 小時後觸發撥款。" }, conduct: { title: "3. 專業標準", body: "專家必須保持最低 4.0 星評分。未能達到英國安全標準可能導致帳戶立即停權。" } } },
    buttons: { start: "馬上開始", next: "下一步", back: "上一步", submit: "完成入駐" }
  }
};
