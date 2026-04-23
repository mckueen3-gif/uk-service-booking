import { LocaleDictionary } from '../types';

export const zhTW: LocaleDictionary = {
  common: {
    merchantPortal: { displayName: "商家控制台" },
    welcome: "歡迎來到 ConciergeAI",
    loading: "載入中...",
    error: "發生錯誤",
    save: "儲存",
    cancel: "取消",
    delete: "刪除",
    edit: "編輯",
    search: "搜尋",
    back: "返回",
    next: "下一步",
    submit: "提交",
    success: "成功",
    failed: "失敗",
    no_data: "無數據",
    all: "全部",
    confirm: "確認",
    close: "關閉",
    more: "更多",
    see_all: "查看全部",
    view_details: "查看詳情",
    status: {
      active: "活躍",
      inactive: "停用",
      pending: "待處理",
      completed: "已完成",
      cancelled: "已取消"
    }
  },
  navigation: {
    home: "首頁",
    dashboard: "控制台",
    experts: "尋找專家",
    education: "教育中心",
    pricing: "定價",
    about: "關於我們",
    contact: "聯繫我們",
    login: "登入",
    register: "註冊",
    profile: "個人資料",
    settings: "設定",
    logout: "登出",
    merchant_portal: "商家入口",
    diagnosis: "AI 診斷"
  },
  merchant_dashboard: {
    manageServices: "管理服務",
    previewProfile: "預覽公開檔案",
    zero_lead_fee: "£0 回覆費 (無限客源)",
    stats: {
      totalBookings: "總預約數",
      rating: "信任評分",
      availableBalance: "可用餘額",
      escrowHeld: "代管中",
      reviews: "評論數",
      totalJobs: "已完成工作",
      availableNow: "目前可用",
      pendingBalance: "待結算餘額",
      noPendingBalance: "無待結算餘額",
      noAvailableBalance: "無可用餘額",
    },
    labels: {
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
    },
    dashboard: {
      title: "商家控制台",
      welcome: "歡迎回來",
      total_earnings: "總收入",
      active_bookings: "活躍預約",
      new_inquiries: "新諮詢",
      rating: "信任評分",
      view_profile: "查看公開資料",
      edit_profile: "編輯資料",
    },
    tools: {
      title: "精英工具箱",
      subtitle: "模組化成長工具箱",
      launch: "啟動工具",
      diagnosis: { name: "AI 視覺診斷", desc: "即時視覺損壞評估系統", badge: "免費" },
      whatsapp: { name: "WhatsApp 助手", desc: "新潛在客戶的即時通知", badge: "免費" },
      seo: { name: "SEO 優化", desc: "提升 Google 排名與優化元數據", badge: "免費" },
      ad_copy: { name: "AI 廣告文案", desc: "生成高轉化的廣告標語", badge: "免費" },
      video: { name: "精英影片", desc: "專業影片知識同步", badge: "免費" }
    },
    setup: {
      title: "專家認證",
      step1: "基本資訊",
      step2: "專業資質",
      step3: "身分驗證",
      step4: "啟動帳戶",
      business_name: "業務名稱",
      category: "服務類別",
      insurance: "責任險證明",
      submit: "提交審核"
    },
    profile_edit: {
      basic: "基本資訊",
      services: "服務項目",
      gallery: "作品集",
      video: "介紹影片",
      save_success: "資料更新成功"
    },
    bookings: {
      title: "預約管理",
      upcoming: "即將到來",
      past: "歷史記錄",
      accept: "接受",
      decline: "拒絕",
      mark_completed: "標記為完成",
      details: "預約詳情",
      customer_info: "客戶資訊",
      service_type: "服務類型",
      time: "預定時間",
      location: "地點",
      photo: "證據 URL",
      submit: "推送變更",
    },
    variations: {
      label: "價格/範圍調整",
      pending: "等待客戶批准",
      approved: "調整已批准",
    },
    toolkit: {
      title: "AI 專家工具箱",
      subtitle: "為精英專家設計的模組化成長工具。",
      back: "返回工具箱",
      enable: "啟用服務",
      disable: "停用",
      active: "啟用中",
      inactive: "暫停",
      configure: "配置模組",
      privacy: {
        title: "精英隱私框架",
        desc: "ConciergeAI 僅在您啟用這些模組時才會激活 AI 專業上下文。您的內部業務邏輯始終保持加密和隔離。",
      },
      modules: {
        aura_secretary: {
          title: "Aura AI 秘書",
          desc: "利用您的業務背景提供自動化客戶支援 and 主動成交。",
          impact: "+15% 預約轉換率"
        },
        promotion_hub: {
          title: "促銷中心",
          desc: "創建優惠券和折扣，Aura 可以提供給客戶以促成交易。",
          impact: "自定義收入增長"
        },
        accounting_ledger: {
          title: "帳本與稅務審計",
          desc: "自動化業務績效追蹤和稅務就緒的財務導出。",
          impact: "HMRC 合規邏輯"
        },
        social_toolkit: {
          title: "社群媒體工具箱",
          desc: "由您的業務基因驅動，生成病毒式社群貼文和標題。",
          impact: "一鍵品牌成長",
          modes: {
            label: "成長策略",
            viral: "病毒式爆紅",
            luxury: "低調奢華"
          },
          reviews: {
            title: "評論轉貼文 AI",
            subtitle: "選擇一個 5 星評論，將其轉化為病毒式營銷資產。"
          },
          preview: {
            title: "貼文預覽",
            expertTip: "專家提示",
            copyBtn: "複製標題",
            copied: "已複製！",
            shareHint: "將此分享到您的動態或 WhatsApp 以吸引新客戶。"
          }
        },
        audit_vault: {
          title: "審計保險庫",
          desc: "專業追蹤您的專家記錄和稅務就緒的導出。",
          impact: "HMRC 合規邏輯"
        }
      }
    },
    audit_vault: {
      title: "審計保險庫",
      subtitle: "為您的專業業務提供自動化的專業記錄。",
      searchPlaceholder: "搜尋收據、客戶或服務...",
      filterBtn: "篩選",
      table: {
        date: "日期",
        id: "收據編號",
        customer: "客戶 / 服務",
        amount: "金額",
        actions: "操作",
      },
      empty: "未找到審計記錄。",
      viewBtn: "查看",
      pdfBtn: "PDF",
      compliance: {
        title: "專業合規",
        desc: "此處生成的所有收據均符合英國標準的自由職業者和小型企業記錄保存指南。可用於您的自我評估或增值稅申報。",
      },
    },
    ai_secretary: {
      title: "Aura",
      subtitle: "AI 秘書",
      desc: "Aura 擔任您的 24/7 業務經理，處理客戶諮詢並確保預約，讓您專注於工作。",
      status_label: "系統狀態",
      online: "在線並啟用",
      offline: "離線 / 待命",
      knowledge_base_title: "業務內部知識",
      knowledge_base_desc: "向 Aura 提供有關您的專業知識、定價邏輯、服務流程或常見客戶問題的具體詳情。Aura 了解得越多，成交效果就越好。",
      knowledge_placeholder: "例如：「我擅長全屋重新配線。基本出勤費為 £80。我週日不工作...」",
      persona_title: "AI 人格與語氣",
      persona_professional: "專業",
      persona_friendly: "親切",
      persona_concise: "簡潔快速",
      deploy_button: "部署 AI 更新",
      impact_title: "AI 業務影響",
      impact_inquiries: "已處理諮詢",
      impact_revenue: "AI 影響收入",
      impact_conversion: "優化轉換率",
      security_policy_title: "安全第一政策",
      security_policy_desc: "Aura 的訓練數據歸您的商家節點所有。我們絕不使用您的業務邏輯為競爭對手訓練模型。",
      success_update: "AI 大腦更新成功。Aura 正在重新學習您的業務背景。"
    },
    promotions: {
      title: "促銷",
      hub: "中心",
      desc: "創建專屬優惠和優惠券。我們的 AI 秘書將在客戶諮詢期間主動使用這些來促成交易。",
      referral_btn: "推薦計畫",
      active_coupons: "活動中優惠券",
      no_coupons: "尚無活動中優惠券。開始您的第一次促銷以增加預約！",
      new_promo: "新增促銷",
      code_label: "優惠券代碼",
      code_placeholder: "例如：SAVE20",
      type_label: "折扣類型",
      type_percent: "百分比",
      type_fixed: "固定金額 £",
      value_label: "面額",
      publish_btn: "發布促銷",
      ai_info: "AI 助手將分析客戶意圖，並在增加預約機會時提供此優惠券。",
      success_create: "優惠券創建成功！AI 秘書現在已了解此優惠。"
    },
    referral_program: {
      title: "商家",
      subtitle: "推薦計畫",
      desc: "給予現有客戶分享您服務的理由，從而提升客戶忠誠度。",
      campaign_title: "首單激勵",
      campaign_status: "活動狀態",
      campaign_status_note: "啟用此項以開始獎勵推薦。",
      voucher_value: "禮券價值",
      incentive_type: "激勵類型",
      how_it_works_title: "運作方式：",
      how_it_works_desc: "當新客戶透過推薦連結訪問您的個人資料時，Aura (AI) 將檢測到連結並在他們第一次預約時提供此折扣。",
      deploy_btn: "部署活動更新",
      perf_title: "推薦績效",
      perf_clicks: "透過推薦的點擊次數",
      perf_conversion: "轉換率",
      perf_avg: "高於行業平均水準",
      link_title: "您的公開推薦連結",
    },
    referral_passive: {
      passive_title: "5 年被動收益",
      title: "5 年被動收益",
      passive_dividend: "{count} 位專家的 {rate} 被動分紅",
      description: "鎖定終身獎勵。當您推薦客戶時，您可以在 5 年內賺取他們在所有專家消費額的 2%。",
      referral_code: "我的病毒式推薦代碼",
      referred_count: "已鎖定的被推薦人",
      total_yield: "預計未來收益",
      active_period: "5 年有效期",
      cross_service_active: "跨服務分紅已啟用",
      history: "收益歷史",
      empty: "尚未記錄到推薦分紅。開始分享以鎖定被動收入。"
    },
    merchant_availability: {
      title: "可用性控制",
      subtitle: "配置您的服務窗口及每日容量。",
      save: "同步協議",
      saving: "儲存中...",
      saved: "可用性設定同步成功。",
      failed: "同步可用性失敗。",
      start: "開始",
      end: "結束",
      closedLabel: "休息日（不營業）",
      closeBtn: "標記為關閉",
      openBtn: "標記為營業",
      settings: {
        title: "全局設定",
        interval: "時間間隔（分鐘）",
        maxDaily: "每日最大預約數",
        hint: "較長的服務窗口有助於緩解不可預見的英國交通波動。"
      },
      tipTitle: "專家提示",
      tipContent: "保持穩定的可用性可顯著提高您的系統排名和曝光度。",
    },
    onboarding_highlights: {
      title: "ConciergeAI 超能力",
      subtitle: "精英專家的終極作業系統。",
      lead_fee_title: "£0 回覆費",
      lead_fee_desc: "保留 100% 的報價。我們從不收取潛在客戶或投標費用。",
      leads_comparison: "與傳統平台相比，每項工作可節省 £5-15。",
      ai_assistant_title: "24/7 AI 秘書",
      ai_assistant_desc: "當您在現場工作時，Aura 會處理諮詢並達成交易。",
      financial_tools_title: "自動化帳本",
      financial_tools_desc: "內建即時收益追蹤和稅務年度摘要。"
    },
  },
  diagnosis: {
    badge: "AI 視覺推理",
    title: "即時修復診斷",
    title1: "視覺",
    title2: "診斷",
    subtitle: "AI 驅動的物業與汽車健康審計。上傳照片即可獲得即時分析與精準估算。",
  },
  merchant_public: {
    verified_expert: "已驗證專家",
    reviews_count: "{count} 條已驗證評論",
    member_since: "自 {year} 年起的精英會員",
    tabs: {
      about: "關於",
      services: "服務",
      reviews: "評價",
      company: "實體資訊",
    },
    about_title: "專家背景",
    about_fallback: "致力於提供高質量專業結果的高級專家。",
    consultation_title: "安全預約渠道",
    book_now: "預約此專家",
    send_message: "加密訊息",
    platform_tip: "安全提示：將所有溝通和付款保持在 ConciergeAI 內以獲得 100% 保護。",
    verified_video: "已驗證專家介紹影片",
    services_title: "提供的服務",
    services_provided: "可用服務",
    matching_search: "匹配搜尋",
    customer_reviews: "{count} 條客戶評論",
    write_review: "撰寫評論",
    review_overview: "基於過去 12 個月的評論",
    quality: "質量",
    reliability: "可靠性",
    communication: "溝通",
    review_summary_title: "AI 分析摘要",
    review_summary_content: "良好的反饋歷史，專注於質量 and 可靠性。",
    review_summary_note: "✦ 由 AI 根據客戶評論生成。",
    owner_label: "負責人",
    operates_label: "服務區域",
    nearby: "及周邊地區",
    nationwide: "全國範圍",
    business_type_label: "業務類型",
    sole_trader: "個體經營者 / 個人",
    vat_label: "增值稅註冊",
    yes: "是",
    no: "否",
    insurance_label: "保險",
    insured_amount: "已投保 £{amount}",
    not_provided: "聯繫以獲取資訊",
    seal_title: "精英信任印章",
    verified_identity: "身份已驗證",
    kyc_checked: "KYC 與資質已檢查",
    liability_insured: "已投保責任險",
    insured_upto: "最高 £{amount}",
    safe_payments: "安全支付",
    protection_desc: "託管與爭議保護",
    completed_jobs: "已完成 {count}+ 項工作",
    share: "分享",
    website: "網站",
    save: "儲存",
    link_copied: "連結已複製",
    added_favorites: "已加入收藏",
  },
  auth: {
    login: {
      title: "登入您的帳戶",
      subtitle: "登入以管理您的服務和預約。",
      emailLabel: "電子郵件地址",
      emailPlaceholder: "example@concierge.ai",
      passwordLabel: "密碼",
      passwordPlaceholder: "輸入您的密碼",
      forgotPassword: "忘記密碼？",
      submit: "登入",
      loading: "登入中...",
      or: "或",
      google: "使用 Google 繼續",
      navToRegister: "新用戶？",
      createAccount: "立即註冊",
      error: "身份驗證失敗。請檢查您的憑據。",
      success: "登入成功。正在重新導向...",
    },
    register: {
      title: "創建帳戶",
      subtitle: "加入 ConciergeAI 專家網絡",
      expertSignupPrompt: "已經是專家？在此註冊",
      firstNameLabel: "名字",
      lastNameLabel: "姓氏",
      emailLabel: "電子郵件地址",
      emailPlaceholder: "example@concierge.ai",
      phoneLabel: "手機號碼",
      searchAddressLabel: "地址識別",
      searchAddressPlaceholder: "輸入英國郵遞區號 (例如：NG15 7HU)",
      addressResultHint: "選擇匹配的地址",
      districtLabel: "行政區",
      cityLabel: "城市",
      countryLabel: "國家",
      accountTypeLabel: "帳戶類型",
      passwordLabel: "密碼",
      passwordHint: "最少 6 個字元",
      referralLabel: "推薦代碼（可選）",
      referralPlaceholder: "例如：ALPHA-99",
      submit: "創建帳戶",
      loading: "處理中",
      or: "或",
      google: "使用 Google 註冊",
      navToLogin: "已有帳戶？",
      signIn: "在此登入",
      roles: { customer: "客戶", merchant: "專家" }
    },
    errors: {
      missingFields: "請填寫所有必填欄位",
      passwordTooShort: "密碼長度至少為 6 個字元",
      emailExists: "使用此電子郵件的帳戶已存在",
      invalidCredentials: "電子郵件或密碼無效。請再試一次。",
      serverError: "服務暫時不可用 - 請稍後再試"
    },
    forgotPassword: {
      title: "找回帳戶",
      subtitle: "輸入您的電子郵件以接收重設連結。",
      emailLabel: "電子郵件地址",
      emailPlaceholder: "example@concierge.ai",
      submit: "發送連結",
      loading: "發送中...",
      back: "返回登入",
      success: "重設連結已發送到您的電子郵件。",
      error: "發送請求時出錯。",
    },
  },
  liveActivity: {
    joined: "剛加入成為專家！",
    booked: "剛預約了",
    verified: "已驗證活動"
  },
  comparison_table: {
    header_features: "功能",
    header_others: "傳統平台",
    label_legacy: "傳統：",
    label_concierge: "ConciergeAI：",
    rows: {
      commission: {
        title: "佣金費用",
        others: "每項工作 15% - 30%",
        concierge: "所有專家僅收 10% 佣金"
      },
      response_fees: {
        title: "回覆 / 潛在客戶費",
        others: "付費點數（每條線索 £2 - £10）",
        concierge: "始終為 £0（完全免費回覆）"
      },
      client_calibre: {
        title: "客戶層級",
        others: "大眾市場",
        concierge: "多元化的高價值客戶群"
      },
      earnings_model: {
        title: "收益模式",
        others: "一次性收入",
        concierge: "推薦分紅 + 電子禮券"
      },
      verifications: {
        title: "資質與合規授權",
        others: "手動 / 緩慢",
        concierge: "SMART AI 即時驗證"
      },
      marketing_support: {
        title: "行銷支援",
        others: "需要付費廣告",
        concierge: "AI 自動匹配（發現模式 - 免費優質線索）"
      },
      communication: {
        title: "溝通渠道",
        others: "分散（電話 / WhatsApp）",
        concierge: "Nexus 安全訊息（對專家完全免費）"
      },
      booking_system: {
        title: "預約系統",
        others: "手動 / 碎片化",
        concierge: "智能化自動排程"
      },
      toolkit: {
        title: "技術工具箱",
        others: "基礎預約記錄",
        concierge: "AI 秘書與設備管理（免費專業工具箱）"
      },
      data_sovereignty: {
        title: "數據主權",
        others: "平台控制",
        concierge: "去中心化專家身份"
      },
      growth: {
        title: "專業成長",
        others: "無提供資源",
        concierge: "教育中心與導師制度"
      }
    }
  },
  home: {
    allUK: "全英國地區",
    categories: {
      plumbing: "水管工程",
      repairs: "維修",
      renovation: "裝修",
      education: "教育",
      accounting: "會計",
      legal: "法律",
      commercial: "商業",
      cleaning: "清潔",
      it: "IT 支援",
      marketing: "行銷",
      design: "設計",
      consulting: "顧問",
      wellness: "健康",
      events: "活動"
    },
    defaultCategory: "專家支援",
    hero: {
      aiMatch: "經計算的匹配",
      badge: "已驗證專家",
      title1: "精英專家。",
      title2: "精準 AI 匹配。",
      subtitle: "英國最高信任度的專屬服務預約平台。秒速審查並聘請頂級專業人士。",
      searchPlaceholder: "今天需要什麼幫助？",
      locationPlaceholder: "輸入城市或郵遞區號",
      searchBtn: "搜尋網絡",
      suggestions: ["緊急水管工", "稅務專家", "房屋翻修", "牛劍專家"],
      popularLabel: "熱門搜尋",
      popularTags: ["水管工程", "會計", "法律", "教育"]
    },
    recommendation: {
      title1: "精英專家",
      title2: "熱門專業類別",
      subtitle: "我們網絡中最穩定且優秀的專家團隊。",
      browse: "瀏覽網絡"
    },
    aiCTA: {
      badge: "Alpha 系統",
      title1: "即時 AI 分析",
      title2: "診斷",
      subtitle: "使用網格智能分析複雜的服務向量。",
      button: "開始免費診斷"
    },
    stats: {
      escrowHeld: "In Escrow",
      reviews: "Reviews",
      expertsJoined: "已加入專家",
      activeCustomers: "活躍客戶",
      networkGrowth: "已驗證的卓越"
    },
    trust: {
      title: "建立在絕對信任之上",
      verified: "背景已調查",
      guarantee: "預約保障",
      secure: "加密交易"
    },
    sections: {
      plumbing: {
        title: "水管與能源",
        desc: "聯繫認證專家進行精準水管維修、電力重新配線和家電集成。",
        items: ["漏水檢測", "鍋爐維修", "電力安全", "智能集成"]
      },
      repairs: {
        title: "結構維修",
        desc: "精英級維護與結構修復。從複雜的家具組裝到室內表面處理。",
        items: ["家具組裝", "牆面修復", "安裝系統", "一般維護"]
      },
      accounting: {
        title: "財務與稅務",
        desc: "HMRC 認證合規專家，處理薪資、增值稅申報和公司帳戶管理。",
        items: ["增值稅申報", "簿記", "薪資管理", "稅務優化"]
      },
      renovation: {
        title: "物業轉型",
        desc: "與精英建築團隊合作進行閣樓改造、廚房現代化和全屋升級。",
        items: ["廚房設計", "閣樓改造", "地板系統", "油漆與裝飾"]
      },
      education: {
        title: "精英教育",
        desc: "為牛劍入學、大學水平數學和專業認證挑選的專家。",
        items: ["大學入學", "STEM 專家支援", "應試技巧", "個人陳述"],
        visitDashboard: "訪問學院中心"
      },
      cleaning: {
        title: "專業衛生",
        desc: "適用於豪華住宅、商業辦公室和租約結束要求的醫院級清潔標準。",
        items: ["深度清潔", "租約結束清潔", "辦公室衛生", "織物護理"]
      },
      legal: {
        title: "專家法律建議",
        desc: "高信任度的律師，處理合同法、物業轉讓和公司監管合規。",
        items: ["物業轉讓", "合同法", "僱傭權益", "家庭法"]
      },
      commercial: {
        title: "企業服務",
        desc: "為設施管理、物流支援和戰略諮詢提供可擴展的 B2B 解決方案。",
        items: ["設施管理", "物流支援", "IT 戰略", "風險評估"]
      }
    },
    growth: {
      activeLeadMatching: "AI 匹配引擎運行中",
      matchTitle1: "遇到困難？讓 AI 幫您尋找",
      matchTitle2: "完美匹配",
      matchSubtitle: "告訴我們您的具體需求 —— 我們的引擎將解析您的意圖並主動為您聯繫評分最高的在地專家。",
      matchingPlaceholder: "例如：我需要在倫敦為我的小型企業尋找一位稅務專家...",
      matchButton: "立即為我匹配",
      verifiedOnly: "僅限已驗證精英",
      localMatching: "在地專家優先",
      analyzingIntent: "正在分析您的請求...",
      matchingSubtitle: "掃描我們的精英網絡，為您的地區尋找最受信任的匹配項。",
      matchesFound: "在您所在地區找到匹配項",
      readyToConfirm: "匹配成功：專家正等待您的簡報",
      topMatch: "最佳匹配",
      jobsLabel: "項工作",
      viewProfile: "安全連接",
      notifyMatches: "立即與匹配的專家聯繫"
    },
    howItWorks: {
      title: "運作方式",
      subtitle: "精英服務流程",
      step1Title: "AI 診斷",
      step1Desc: "上傳照片進行即時分析與精準估算。",
      step2Title: "精英匹配",
      step2Desc: "連接英國頂尖的已驗證專家網絡。",
      step3Title: "安全託管",
      step3Desc: "資金受到保護，直到您授權最終發放。",
      step4Title: "數位保險庫",
      step4Desc: "自動化記錄與專業的審計就緒文件。"
    },
    referralCTA: {
      badge: "戰略收益已啟用",
      title: "推薦與賺取",
      subtitle: "加速我們的精英網絡擴張。推薦頂尖合作夥伴，並從所有平台互動中獲得終身分紅。",
      referralLabel: "網絡許可 ID",
      copyLicense: "複製許可",
      idSecured: "ID 已鎖定",
      voucherDisclaimer: "戰略分紅須經專業審計和 KYC 驗證。",
      rewardTitle: "戰略收益",
      rewardDesc: "來自您網絡的無上限循環收入。"
    },
    eliteLocal: "在地精英",
    noResults: "正在掃描專家節點...",
    referral: {
      refer_btn: "推薦專家並賺取收益",
      id_btn: "網絡授權 ID",
    },
  },
  footer: {
    tagline: "為您連結全英國已驗證的精英服務專家。",
    explore: "探索",
    legal: "法律",
    support: "支援",
    forPros: "專家專區",
    rights: "保留所有權利。",
    terms: "服務條款",
    privacy: "隱私政策",
    cookies: "Cookie 政策",
    help: "幫助中心",
    contact: "聯繫我們",
    aiDiagnosis: "AI 診斷",
    homeCleaning: "居家清潔",
    plumbingServices: "水管服務",
    automotiveServices: "汽車服務",
    merchantRegistration: "加入為專家",
    merchantPortal: { displayName: "商家入口" },
    blog: "部落格",
    trustSignal: "Trustpilot 評分：優秀",
    address: "英國，倫敦",
    phone: "+44 20 1234 5678",
    email: "support@conciergeai.uk",
    aboutUs: "ConciergeAI 致力於為全英國業主連結高信任、精英級的認證服務專家。",
    companyNo: "12345678",
    vatNo: "GB123456789",
    social: {
      facebook: "https://facebook.com/conciergeai",
      twitter: "https://twitter.com/conciergeai",
      instagram: "https://instagram.com/conciergeai",
      linkedin: "https://linkedin.com/company/conciergeai",
    },
  },
  education_sec: {
    hero: {
      badge: "英國已驗證的高質量導師",
      title1: "學習新技能",
      title2: "向專業人士學習",
      subtitle: "聯繫高質量的導師，學習學術、語言和專業技能。為您的成功量身打造個人化學習。",
      searchPlaceholder: "您想學習什麼？",
      searchBtn: "尋找導師",
    },
    forYou: {
      title: "為您推薦",
      match: "AI 匹配分數",
      viewProfile: "查看個人資料",
    },
    categories: {
      title: "按類別瀏覽",
      browseBtn: "查看全部",
      items: {
        academic: {
          title: "學術卓越",
          desc: "GCSE, A-Levels, IB, 11+ 入學準備",
        },
        language: {
          title: "全球語言",
          desc: "IELTS, Duolingo, 商務英語等",
        },
        stem: {
          title: "STEM 與 AI",
          desc: "Python, 生成式 AI, 編碼, 數據科學",
        },
        arts: {
          title: "創意藝術",
          desc: "作品集, 鋼琴, 設計, 美術",
        },
        finance: {
          title: "專業認證",
          desc: "CFA, ACCA, PMP, 專業證照",
        },
        career: {
          title: "職涯戰略",
          desc: "面試準備, 領導力, MBA 戰略",
        },
        junior: {
          title: "小小學者",
          desc: "拼讀, 邏輯, 天賦開發",
        },
        masterclass: {
          title: "知識工作坊",
          desc: "投資, 生活方式, 大師班",
        },
        sen: {
          title: "特殊教育 (SEN)",
          desc: "ADHD, 讀寫障礙, 自閉症, 心理健康",
        },
      },
    },
    search: {
      filters: "高級篩選",
      mode: "教學模式",
      online: "線上",
      offline: "面對面",
      hybrid: "混合",
      priceRange: "價格範圍",
      level: "導師級別",
      student: "大學生",
      pro: "認證專業人士",
      expert: "碩士 / 博士級別",
      apply: "應用篩選",
      resultsTitle: "可用專家",
      foundCount: "找到 {{count}} 位導師",
      placeholder: "按學科或姓名搜尋",
    },
    tutorCard: {
      demoDesc: "充滿熱情的博士導師，擁有超過 10 年經驗。已幫助 100 多名學生實現學術目標。",
    },
    tutorProfile: {
      verified: "已驗證專家",
      about: "關於專家",
      education: "教育背景",
      experience: "教學經驗",
      portfolio: "成功案例",
      reviews: "學生評價",
      availability: "每週時間表",
      bookNow: "立即預約",
      aiTrial: "AI 診斷測試",
      trialChallenge: "學習診斷挑戰",
      startChallenge: "開始挑戰",
      cancel: "稍後再說",
      loadingChallenge: "AI 正在準備您的挑戰...",
      analyzing: "正在分析 {subject} 課程",
      questionLabel: "問題",
      of: "／",
      explanation: "解析：",
      nextQuestion: "下一題",
      finishChallenge: "結束挑戰",
      scoreResult: "得分率：",
      assessment: "AI 評估：",
      not_found: "找不到專家",
      academic_background: "已驗證學術背景",
      assessmentLevels: {
        excellent: "基礎非常紮實",
        progress: "成長潛力巨大",
        starting: "學習的初步階段",
      },
      assessmentDesc: "診斷數據已與導師共享。他們將以此為基礎編寫課程！",
      bookFirstLesson: "預約第一堂課",
      tryAgain: "再試一次",
      feeDisclosure: "ConciergeAI 提供安全預約。平台外的直接支付不在我們的 100% 滿意保證涵蓋範圍內。",
      match: "匹配",
      authPanel: {
        title: "豐富您的體驗",
        desc: "加入我們的精英會員網絡，解鎖 AI 驅動的教育診斷完整功能。",
        dismiss: "以後再說"
      }
    },
    visitDashboard: "探索教育中心",
  },
  aura: {
    welcome: "您好！我是 Aura，您的 Concierge 協調員。今天我能如何幫助您？",
    offline: "離線",
    ready: "在線 - 就緒",
    placeholder: "詢問 Aura 任何問題...",
    error: "抱歉，我現在連接出現問題。請稍後再試。",
    footer: "安全 AI 支援 • 平台版本 1.2",
    suggestions: {
      refund: "如何退款？",
      dispute: "維修問題？",
      warranty: "保固條款",
      booking: "關於預約",
      refundQuery: "我該如何申請退款？流程是什麼？",
      disputeQuery: "如果我對維修的質量或價格不滿意，該怎麼辦？",
      warrantyQuery: "透過平台預約的服務有保固嗎？",
      bookingQuery: "我該如何預約附近的專家？",
    },
  },
  
  member_dashboard: {
    hero: {
      location: "英國",
      helpTitle: "今天在 {location} 我能如何幫助您？",
      aiAssistant: "AI 生活助手",
      placeholder: "詢問 {model} 任何關於在英國生活的問題... (按 Enter 發送)",
      thinking: "思考中...",
      clearChat: "清除對話",
      send: "發送",
      errors: {
        format: "響應格式錯誤",
        unknown: "發生未知錯誤，請稍後再試。",
        network: "網路連接失敗，請檢查您的連線並重試。"
      },
      prompts: {
        travel: "今天最佳的旅行路線？",
        dining: "附近推薦的餐廳",
        study: "如何使用 AI 輔助學習？"
      }
    },
    quick_actions: {
      findExpert: "尋找專家",
      chat: "Nexus 安全聊天",
      diagnosis: "AI 診斷",
      equipment: "設備管理",
      history: "歷史紀錄"
    },
    study_hub: {
      title: "AI 智能學習中心",
      quota: "今日剩餘：{remaining} / {limit}",
      intro: "上傳課堂筆記、考試照片或輸入學科，讓 AI 生成個性化練習題並診斷弱點。",
      tabs: {
        text: "文字輸入",
        photo: "照片識別"
      },
      placeholders: {
        text: "貼上您想要學習或翻譯的文字...",
        analyze: "分析內容",
        selectTutor: "請選擇一位導師..."
      },
      generating: {
        title: "AI 正在分析內容並製作題目...",
        sub: "這通常需要 10-15 秒，請稍候..."
      },
      quiz: {
        complete: "完成測驗並查看 AI 診斷",
        finish: "測驗已完成！",
        report: "AI 學習診斷報告",
        back: "返回學習中心",
        share: "與我的導師分享"
      },
      share: {
        title: "分享給導師",
        desc: "選擇一位導師分享您的 AI 診斷報告，協助他們規劃您的下一堂課：",
        success: "分享成功！",
        successDesc: "您的導師現在可以在他們的控制台中查看您的診斷報告。",
        confirm: "確認分享",
        cancel: "取消"
      }
    },
    bookings: {
      title: "近期預約",
      recentCount: "最近 {count} 條記錄",
      viewAll: "查看全部",
      empty: "尚無預約記錄",
      bookNow: "立即預約服務",
      status: {
        pending: "待處理",
        confirmed: "已確認",
        completed: "已完成",
        cancelled: "已取消",
        disputed: "爭議中"
      },
      joinClass: "進入教室"
    },
    feed: {
      title: "為您推薦",
      subtitle: "頂尖專家 · 每日精選",
      all: "全部",
      loading: "正在載入推薦專家...",
      tips: {
        plumbing: "💧 天氣漸冷，記得檢查管道保溫！",
        education: "📚 現在預約導師，為下學期做準備！",
        legal: "⚖️ 租約即將到期？諮詢律師以保護您的權益。",
        accounting: "🧾 自僱稅務申報截止日期即將到來。",
        cleaning: "✨ 季節性大掃除，讓您的家煥然一新！",
        repairs: "🔧 入冬前檢查家電安全的最佳時機。",
        renovation: "🏠 年底前裝修，在假期前完工！",
        commercial: "💼 Q4 財務規劃，現在諮詢商業顧問。",
        default: "立即預約以享受優質服務體驗。"
      }
    }
  },
  nexus_chat: {
    title: "Nexus 安全訊息",
    subtitle: "高度加密、專業的諮詢渠道",
    secureBanner: "端對端加密連線已建立",
    verifiedExpert: "已驗證 Nexus 專家",
    shareDiagnosis: "分享 AI 診斷",
    bookExpert: "立即預留專家",
    securityDesc: "此對話受到 Nexus 協議加密保護。"
  },
  equipment_mgmt: {
    title: "資產控制面板",
    subtitle: "AI 驅動的價值資產生命週期管理",
    addBtn: "註冊新資產",
    propertyTab: "物業",
    vehicleTab: "車輛",
    noAssets: "尚未註冊資產。",
    lastService: "上次維修",
    nextService: "預測下次保養",
    healthScore: "AI 健康狀態",
    diagnoseBtn: "啟動 AI 掃描",
    details: "資產規格",
    tabs: {
      overview: "總覽",
      maintenance: "維修日誌",
      diagnosis: "AI 診斷"
    },
    types: {
      house: "住宅物業",
      commercial: "商業單位",
      car: "私人汽車",
      van: "商用貨車"
    }
  },
  metadata: {
    title: "ConciergeAI | 聘請英國頂尖在地專家",
    description: "英國首屈一指的精英、已驗證服務專家與導師網絡。"
  },
  social_studio: {
    title: "社群工作室",
    subtitle: "AI 多平台內容引擎",
    quota: "每月配額",
    left: "剩餘",
    pro_active: "專業版狀態啟用中",
    upgrade_cta: "升級以獲得 60/月配額",
    ai_optimize: "AI 優化",
    optimized_hint: "AI 已根據您的編輯進行重新優化。",
    regenerate: "全部重新生成",
    edit_mode: "手動編輯",
    copy_success: "已複製到剪貼簿",
    generate_all: "生成全渠道活動",
    optimization_instructions: "優化簡報（例如：更專業、加入表情符號、在地俚語...）",
    discount_label: "折扣 / 優惠（可選）",
    discount_placeholder: "例如：本週 8 折",
    audience_label: "目標受眾（可選）",
    audience_placeholder: "例如：倫敦業主",
    generate_cta: "✨ 生成我的活動",
    publish_to: "發布至",
    scheduled_success: "活動已排程！ 🎉",
    queued_note: "您的貼文已透過 Ayrshare 網絡排入隊列。",
    publishing: "正在透過 Ayrshare 發布...",
    publish_cta: "🚀 發布至 {{count}} 個平台",
    ai_image_title: "AI 生成活動圖片",
    ready_to_download: "準備下載",
    painting_image: "AI 正在繪製您的圖片...",
    open_full_size: "開啟全尺寸",
    tab_campaign: "活動創建器",
    tab_review: "評論助推器"
  },
  profile: {
    verified: "已驗證",
    roles: {
      admin: "系統管理員",
      merchant: "認證專家",
      member: "精英會員"
    },
    summary: "帳戶總覽",
    memberSince: "註冊時間",
    status: "帳戶狀態",
    active: "活躍"
  },
  merchant: {
    profile: {
      sections: {
        basic: "身份資訊",
        address: "服務地區",
        business: "專家節點"
      },
      labels: {
        name: "全名",
        placeholderName: "您的姓名",
        phone: "聯絡電話",
        placeholderPhone: "例如：+44 7XXX XXXXXX",
        emailReadOnly: "登入電子郵件",
        city: "服務城市",
        postcode: "郵遞區號",
        addressLine1: "詳細地址 1",
        addressLine2: "詳細地址 2",
        businessName: "服務品牌",
        businessNamePlaceholder: "例如：倫敦科技解決方案",
        bio: "專業簡介 / 背景",
        bioPlaceholder: "描述您的專業知識、經驗等..."
      },
      status: {
        saving: "同步中...",
        success: "更新成功"
      },
      save: "更新資料"
    },
    notifications: {
      expertWhatsAppMsg: "您好！我剛剛預約了 {merchantName} 的 {serviceName} 服務，時間是 {date}。預約 ID: {bookingId}",
      notifyExpertWhatsApp: "透過 WhatsApp 通知專家",
      notifyExpertWhatsAppDesc: "發送即時通知給專家，以加快您的預約確認速度。",
    },
    fastResponse: "快速響應",
    toolkit: {
      title: "專家工具箱",
      subtitle: "為精英專家設計的模組化成長工具。",
      back: "返回工具箱",
      privacy: {
        title: "精英隱私框架",
        desc: "ConciergeAI 僅在您啟用這些模組時才會激活 AI 專業上下文。您的內部業務邏輯始終保持加密和隔離。",
      },
      social: {
        title: "社群媒體活動工作室",
        desc: "AI 驅動的多通路促銷 — 在數秒內完成文案、生成圖片並發布。",
        monthly_quota: "每月配額",
        quota_left: "剩餘 {count}",
        pro_status: "專業版狀態啟用中",
        upgrade_plan: "升級至 60/月",
        generate_all: "生成全通路活動",
        regenerate: "全部重新生成",
        edit_manually: "手動編輯",
        optimizing: "AI 正在根據您的編輯進行重新優化。",
        optimization_hint: "優化指令（例如：更專業、加入表情符號、在地俚語...）",
        discount_label: "折扣 / 優惠（可選）",
        discount_placeholder: "例如：本週 8 折",
        audience_label: "目標受眾（可選）",
        audience_placeholder: "例如：倫敦業主",
        generate_cta: "✨ 生成我的活動",
        publish_to: "發布至",
        publish_cta: "🚀 發布至 {count} 個平台",
        success: "活動已排程！ 🎉",
        ayrshare_note: "您的貼文已透過 Ayrshare 網絡排入隊列。",
        ayrshare_status: "正在透過 Ayrshare 發布...",
        ai_image: "AI 生成活動圖片",
        ready: "準備下載",
        painting: "AI 正在繪製您的圖片...",
        full_size: "開啟全尺寸",
        tab_campaign: "活動創建器",
        tab_review: "評論助推器",
        topic_placeholder: "描述您想要促銷的內容（例如：「我正在為北倫敦居民提供未來 48 小時內所有鍋爐維修服務的 85 折優惠」）",
        done: "完成",
        copy_text: "複製文字",
        post_to: "發布至",
        suggested_hashtags: "建議的 SEO 標籤",
        copy_hashtags: "僅複製標籤",
        hashtags_copied: "標籤已複製！",
        upgrade_plan: "升級取得每月 60 個配額",
        review_booster: {
          style_title: "內容風格",
          viral_title: "⚡ 病毒式推廣",
          viral_desc: "高能量、富有表情符號、大膽的鉤子。",
          luxury_title: "👑 低調奢華",
          luxury_desc: "精緻、專業、高級。",
          amplify_title: "放大 5 星評論",
          amplify_desc: "選擇一個評論作為貼文基礎（可選）",
          generate_btn: "生成社群貼文",
          result_title: "您生成的貼文",
          expert_tip: "💡 專家提示",
          empty_state: "選擇一種風格並點擊生成，以根據您的評論創建貼文。"
        },
        visual_magic: {
          tab_label: "視覺魔法",
          title: "AI 視覺內容生成器",
          desc: "描述您的貼文，我們的 AI 將創建驚豔的圖片和量身定制的文案。",
          prompt_label: "貼文內容是什麼？",
          prompt_placeholder: "例如：一位未來的工人在倫敦豪宅修理金色水管...",
          generate_btn: "生成視覺貼文",
          empty_state: "輸入提示語，讓 AI 打造您的下一篇熱門貼文。"
        },
        upgrade: {
          title: "解鎖無限工作室",
          desc: "已達到免費上限？升級至 **Concierge Social Pro** 以獲得最大曝光。",
          feature1: "每月 60 個 AI 活動",
          feature2: "解鎖 AI 影片動畫",
          feature3: "增強型圖片放大",
          feature4: "自定義平台品牌",
          cta: "現在升級只需 £5.00",
          note: "隨時取消。高信任度的專業 AI 工具。"
        }
      },
      whatsapp: {
        title: "WhatsApp 即時連線",
        desc: "新潛在客戶與諮詢的即時通知",
        gateway_active: "網關已啟動",
        active_desc: "您的 WhatsApp 節點已成功連結。您現在將收到每個高意向客戶的即時推送通知。",
        init_connection: "初始化連線",
        init_desc: "連結您的業務 WhatsApp 帳戶，直接在手機上接收即時更新和客戶諮詢通知。",
        syncing: "同步中...",
        link_now: "立即連結 WhatsApp",
        secured: "連線已加密",
        elite_title: "精英專家集成",
        elite_desc: "WhatsApp Connect 是已驗證 ConciergeAI 專家的獨家功能。它允許您保持 100% 的回覆率，這將顯著提升您在我們搜尋算法中的排名。",
        view_docs: "查看文檔",
        features: {
          alerts: { title: "即時線索警報", desc: "在客戶表達對您服務感興趣的瞬間獲得通知。" },
          mobile: { title: "移動管理", desc: "直接透過 WhatsApp 回覆諮詢，無需登入控制台。" },
          sync: { title: "AI 回覆同步", desc: "Aura AI 可以為您起草回覆，供您一鍵審核並發送。" }
        }
      },
      seo: {
        title: "SEO 個人資料優化",
        desc: "提升 Google 排名並優化元數據",
        hero_title: "排名更高，成長更快。",
        hero_desc: "我們的 AI SEO 專家會分析您的個人資料和服務，確保它們針對 Google 搜尋和 ConciergeAI 的內部排名算法進行了全面優化。",
        analyzing: "正在分析個人資料數據...",
        run_audit: "執行 AI SEO 審計",
        score_title: "搜尋曝光率評分",
        checklist_title: "優化清單",
        auto_title: "AI 自動校準",
        auto_desc: "讓我們的 AI 自動更新您的個人資料元數據，以匹配您所在行業的當前搜尋趨勢。",
        apply_auto: "應用自動優化",
        global_title: "全球觸及",
        indexed: "已在 Google UK 索引",
        traffic: "過去 30 天流量 +12%",
        scores: {
          completion: "資料完整度",
          density: "關鍵字密度",
          images: "圖片優化",
          engagement: "客戶互動"
        },
        checklist: [
          "在您的簡介中增加 3 個以上的專業關鍵字。",
          "啟用「Aura AI 秘書」以提升互動指標。",
          "為「水電維修」類別請求 2 個以上的評論。",
          "更新您的服務區域郵遞區號以優化本地 SEO。"
        ]
      }
    }
  },
  sidebar: {
    sections: {
      main: "主功能",
      business: "業務管理",
      assets: "資產",
      account: "個人帳戶"
    },
    labels: {
      overview: "總覽",
      ai_secretary: "AI 秘書",
      bookings: "我的預約",
      messages: "即時訊息",
      schedule: "服務排程",
      services: "服務管理",
      availability: "空檔設定",
      analytics: "表現審計",
      accounting: "帳務與稅務",
      promotions: "促銷中心",
      wallet: "收入錢包",
      garage: "私人車庫",
      properties: "物業組合",
      rewards: "精英積分",
      profile: "個人資料設定",
      logout: "登出協議"
    }
  }
};
