import { Dictionary } from '../dictionary';

export const ja: Dictionary = {
  nav: { 
    browse: "サービスを探す", join: "エキスパートとして登録", login: "ログイン", logout: "ログアウト", 
    dashboard: "ダッシュボード", aiDiagnosis: "AI診断", education: "教育サポート" 
  },
  common: { viewProfile: "プロフィールを表示", reviews: "件のレビュー", hr: "時間", copy: "コピー", copied: "コピーしました！" },
  hero: { title: "最高のアドバイザーを見つける", subtitle: "お住まいの地域の認定プロフェッショナルとつながる。", searchPlaceholder: "どのようなサービスが必要ですか？", badge: "英国No.1サービスマーケットプレイス" },
  faq: {
    title: "よくある質問",
    subtitle: "英国サービス予約プラットフォームについて知っておくべきすべてのこと。",
    categories: { payments: "お支払い", disputes: "トラブル解決", bookings: "予約" },
    aura: { title: "Aura AIアシスタント", subtitle: "すぐにお困りですか？パーソナライズされたアドバイスについてAuraとチャットしましょう。", cta: "Auraとチャットする" },
    questions: {
      payments: [
        { q: "サービス料金はどのように支払いますか？", a: "お支払いはStripeを通じて安全に処理されます。作業の完了が確認されるまで、資金はエスクローで保管されます。" },
        { q: "隠れた手数料はありますか？", a: "いいえ。提示された金額をお支払いいただきます。見積もりには少額のプラットフォーム手数料が含まれています。" }
      ],
      disputes: [
        { q: "作業内容に満足できない場合はどうすればよいですか？", a: "当社のAI仲裁者が、当初の範囲と作業写真を照らし合わせて公平な解決を確認します。" },
        { q: "返金をリクエストするにはどうすればよいですか？", a: "販売者が合意された条件を満たさなかった場合、ダッシュボードから紛争を申し立てることができます。" }
      ],
      bookings: [
        { q: "予約をキャンセルできますか？", a: "はい、予定時間の24時間前までであれば、全額返金でキャンセル可能です。" },
        { q: "担当のエキスパートに連絡するにはどうすればよいですか？", a: "予約が確定すると、専用の安全なチャットチャネルを利用できるようになります。" }
      ]
    }
  },
  footer: { tagline: "英国トップクラスの認定プロフェッショナルとつながる。", explore: "探す", legal: "法的情報", support: "サポート", rights: "© 2024 UK Service Hub. All rights reserved.", terms: "利用規約", privacy: "プライバシーポリシー", cookies: "クッキーポリシー", help: "ヘルプセンター", contact: "お問い合わせ", aiDiagnosis: "AI診断", homeCleaning: "ハウスクリーニング", plumbingServices: "配管サービス", automotiveServices: "自動車修理" },
  search: { 
    filters: "フィルター", keyword: "キーワード", location: "場所", category: "カテゴリー", minRating: "最低評価", verifiedOnly: "認証済みのみ", 
    apply: "フィルターを適用", sortBy: "並べ替え", sortRating: "評価", sortJobs: "実績数", sortDistance: "距離", sortPrice: "料金", 
    foundCount: "{{count}}名のエキスパートが見つかりました", searching: "エキスパートを検索中...", noResults: "該当するエキスパートが見つかりません", 
    noResultsHint: "フィルターを調整するか、別の地域で検索してみてください。", clearFilters: "すべてクリア", 
    basePrice: "推定開始価格", viewDetails: "詳細を見る", listView: "リスト", mapView: "マップ", searchThisArea: "このエリアを検索",
    verified: "認証済み", insured: "保険加入済み", priceAudit: "AI価格監査：適正", defaultDesc: "プロフェッショナル・サービスプロバイダー"
  },
  booking: {
    steps: { details: "作業内容", schedule: "スケジュール", confirmation: "確認とお支払い" },
    titles: { details: "作業内容について教えてください", schedule: "希望の時間を選択", confirm: "予約を確定する", success: "予約が確定しました！" },
    labels: { date: "日付", time: "時間", make: "メーカー", model: "モデル", address: "住所", notes: "補足事項", agree: "規約と2%のプラットフォーム利用料に同意します", summary: "お支払い内訳", paid: "支払い済み", merchant: "エキスパート", service: "サービス" },
    buttons: { next: "次へ", prev: "戻る", pay: "安全に支払う", home: "ホームに戻る", dashboard: "ダッシュボードへ" },
    messages: { finalizing: "予約を確定しています...", wait: "ページを更新しないでください", contact24h: "エキスパートから24時間以内に連絡があります。", safety: "安全のため、すべてのお支払いはエスクローで保護されています。", noReviews: "レビューはまだありません", recommended: "おすすめ", replyFromMaster: "エキスパートからの返信" },
  },
  merchant: {
    verified: "認定エキスパート", background: "バックグラウンド調査済み", portfolio: "過去の実績", reviewTitle: "カスタマーレビュー", realReviews: "認証済み予約からの実際のレビュー", verifiedBooking: "認証済み予約", pricingAnalysis: "AI価格分析", bookingChannel: "プロフェッショナル予約チャネル", viewServices: "すべてのサービスを見る", guarantee: "サービス保証", fastResponse: "迅速な対応", contactExpert: "エキスパートに相談", noReviews: "レビューはまだありません", reply: "返信",
    dashboard: {
      title: "マーチャント・コンソール", welcome: "おかえりなさい、", previewProfile: "公開プロフィールを確認", manageServices: "サービス管理",
      stats: { totalBookings: "累計予約数", rating: "平均評価", pendingBalance: "決済待ち", availableBalance: "出金可能額", totalJobs: "総案件数", escrowHeld: "エスクロー保持中", availableNow: "現在利用可能", reviews: "レビュー数" },
      syncStatus: "同期ステータス",
      lastSynced: "最終同期",
      refresh: "更新",
      syncing: "データを同期中...",
      syncFailed: "同期に失敗しました。再試行してください",
      wallet: {
        syncing: "ウォレットデータを同期中...",
        synced: "ウォレットデータの同期完了",
        generating: "アカウント設定を完了しています...",
        referralTitle: "友達を紹介して2%キャッシュバックを受け取ろう",
        referralDesc: "あなたの専用コードを共有しましょう。友達が最初のサービスを予約すると、2%が還元されます。",
        historyTitle: "取引履歴",
        historyEmpty: "取引履歴はありません",
        type: "タイプ",
        description: "説明",
        amount: "金額",
        date: "日付",
        referralListTitle: "自分の紹介記録",
        referralListDesc: "招待した友達からの受動的所得を追跡します",
        referee: "紹介されたユーザー",
        earned: "獲得合計",
        expiry: "紹介料の有効期限",
        status: "ステータス",
        active: "有効",
        expired: "期限切れ",
        joinedAt: "登録日",
        validUntil: "有効期限",
        availableNow: "現在利用可能"
      },
      bookings: { title: "最近の予約", viewAll: "すべての予約を見る", empty: "最近の予約はありません", completed: "完了", actions: { confirm: "確定", complete: "完了にする", variation: "追加支払いをリクエスト" } },
      status: { pending: "保留中", confirmed: "確定済み", completed: "完了", cancelled: "キャンセル済み" },
      variations: { label: "追加作業リクエスト", status: "ステータス", pending: "顧客の確認待ち", approved: "承認済み", rejected: "拒否済み", arbiterActive: "AI仲裁者が確認中" },
      arbiterReasoning: "AI仲裁分析",
      tips: { title: "成長のヒント", growth: "あと5件の案件を完了すると「ゴールド」ステータスになり、手数料が7%に下がります。" },
      quickLinks: { title: "クイックリンク", schedule: "スケジュール", earnings: "収益履歴", support: "サポート" },
      modal: { title: "追加支払いをリクエスト", amount: "追加金額 (£)", reason: "追加費用の理由", reasonPlaceholder: "例：壁の裏に追加の漏水を発見", photo: "写真の証拠", photoHint: "AI検証のために写真のアップロードが必須です", submit: "リクエストを送信", submitting: "証拠をアップロード中..." },
      avatar: { upload: "プロフィール写真をアップロード", hint: "推奨：プロフェッショナルな顔写真または会社ロゴ。", success: "アバターを更新しました！", errorSize: "画像は2MB以下にしてください" },
    },
    portfolio_mgr: {
      title: "ポートフォリオ", subtitle: "最高の実績を披露して予約を増やしましょう。", addBtn: "実績を追加", emptyTitle: "実績がまだありません", emptyDesc: "過去のプロジェクト写真を追加して、新しい顧客との信頼を築きましょう。",
      modal: { title: "実績を追加", itemTitle: "プロジェクト名", itemTitlePlaceholder: "例：ロンドンでのボイラー設置", category: "カテゴリー", uploadPhoto: "写真をアップロード", errorSize: "写真は5MB以下にしてください", details: "プロジェクト詳細", aiBtn: "AIで生成", aiGenerating: "AI執筆中...", detailsPlaceholder: "作業内容、課題、成果について説明してください。", cancel: "キャンセル", publish: "実績を公開" },
      deleteConfirm: "この実績を削除してもよろしいですか？", addError: "追加に失敗しました。", aiError: "AI生成に失敗しました。手動で入力してください。"
    },
  },
  education_sec: {
    hero: { badge: "英国エリート講師", title1: "新しいスキルをマスター", title2: "世界の専門家と学ぶ", subtitle: "学術、言語、専門スキルのトップ講師とつながる。あなたの成功のためにデザインされた1対1の個別学習。", searchPlaceholder: "何を学びたいですか？", searchBtn: "講師を探す" },
    forYou: { title: "あなたへのおすすめ", match: "AIマッチ度", viewProfile: "プロフィールを表示" },
    categories: { title: "カテゴリーから探す", browseBtn: "すべて見る", items: { academic: { title: "アカデミック・ハブ", desc: "IELTS, GCSE, A-Levelsなど" }, languages: { title: "ランゲージ・ラボ", desc: "英語、中国語、スペイン語..." }, coding: { title: "コード・アカデミー", desc: "Python, Web開発, AI..." }, music: { title: "音楽・アート", desc: "ピアノ、デザイン、美術" } } },
    search: { filters: "検索フィルター", mode: "授業形式", online: "オンライン", offline: "対面", hybrid: "ハイブリッド", priceRange: "時給", level: "講師レベル", student: "大学生", pro: "プロ講師", expert: "修士・博士", apply: "フィルターを適用", resultsTitle: "受講可能な講師", foundCount: "{{count}}名の講師が見つかりました", placeholder: "科目や名前で検索" },
    common: { reviews: "レビュー", hr: "時間", bookTrial: "試聴を予約" },
    tutorCard: { demoDesc: "博士号を持ち、10年以上の経験を持つ情熱的な教育者。100名以上の学生の目標達成をサポートしてきました。" },
    tutorProfile: { verified: "認定講師", about: "自己紹介", education: "学歴", experience: "指導経験", portfolio: "合格・成功実績", reviews: "受講生のレビュー", availability: "週間スケジュール", bookNow: "レッスンを予約", aiTrial: "AI評価トライアル", trialChallenge: "AIチャレンジに挑戦して割引をゲット！", startChallenge: "チャレンジ開始", cancel: "キャンセル" }
  },
  home: {
    hero: { badge: "英国認定ローカルマスター", title1: "高評価のプロを", title2: "予約する", subtitle: "英国トップ1%の専門家に即座にアクセス。認証済み、保険加入済み、AI監視による品質保証。", searchPlaceholder: "探しているのは...", locationPlaceholder: "ロンドン、英国", aiMatch: "スマートマッチ", searchBtn: "エキスパートを検索" },
    recommendation: { title1: "あなたに", title2: "ぴったりの提案", subtitle: "最近のニーズと場所に基づいたトップスペシャリスト。", browse: "すべてのプロを見る" },
    recommendationResults: {
      trendingTitle: "トレンド",
      topRatedTitle: "最高評価",
      ukWideTitle: "英国エリート",
      professionalTitle: "認定プロフェッショナル",
      homeRepair: "住宅修理",
      deepCleaning: "ディープクリーニング",
      accounting: "会計・税務",
      autoRepair: "自動車修理",
      homeSub: "信頼できる修理記録",
      cleanSub: "プロの清掃サービス",
      accountSub: "認定税務アドバイザー",
      autoSub: "専門的なメカニックサービス",
      assetMatch: "AI資産マッチング",
      trending: "トレンド"
    },
    aiCTA: { badge: "GEMINI AI 搭載", title1: "何が原因か不明ですか？", title2: "AIで即座に診断", subtitle: "問題の写真をアップロードするだけ。AIが原因を特定し、費用を推定し、最適なプロを数秒で見つけます。", button: "無料AI診断を試す" },
    referralCTA: { badge: "紹介報酬", title: "2%の不労所得を獲得", subtitle: "友人を紹介すると、その後5年間のすべての予約額の2%を受け取れます（友人1人あたり最大£200）。", button: "コミッション獲得を始める", referralLabel: "あなたの個人紹介コード：" },
    educationCTA: "教育ダッシュボードへ",
    eliteLocal: "エリート・ローカル",
    eliteBadge: "エリート・プロ",
    defaultCategory: "サービスエキスパート",
    noResults: "このカテゴリーにエキスパートは見つかりませんでした。",
    categories: { plumbing: "配管", repairs: "修理", renovation: "リフォーム", education: "教育", accounting: "会計", legal: "法律", commercial: "商業", cleaning: "清掃", car: "自動車" },
    sections: {
      plumbing: { title: "配管・電気", desc: "緊急の漏水から配線の引き直しまで、認定された英国マスターに相談。", items: ["パイプ修理", "配線工事", "家電設置", "ボイラー点検", "スイッチ交換", "スマートホーム"] },
      repairs: { title: "便利屋・補修", desc: "家具の組み立て、壁の補修、ドアの交換。家の中の「困った」を解決。", items: ["家具組み立て", "ドア・窓", "壁の補修", "棚の設置", "塗装", "軽作業"] },
      accounting: { title: "会計・税務", desc: "在英邦人や中小企業向け。ビジネスの申告をサポート。", items: ["所得税", "年次決算", "VAT申告", "給与計算", "Xero相談", "税務分析"] },
      renovation: { title: "リフォーム・改装", desc: "キッチンの拡張からフルリノベーションまで。透明な価格と品質保証。", items: ["キッチン・バス", "増築", "インテリア設計", "塗装装飾", "床材施工", "造園"] },
      education: { title: "教育・習い事", desc: "1対1の家庭教師とプロのトレーニング。あなたに合わせた進度で。", items: ["語学講師", "IELTS/TOEFL", "プログラミング", "音楽・アート", "ビジネススキル", "学問サポート"] },
      cleaning: { title: "プロの清掃", desc: "退去時のディープクリーニングから定期清掃まで、細部まで丁寧に。", items: ["定期清掃", "退去時清掃", "カーペット洗浄", "窓拭き", "オフィス清掃", "除菌・消毒"] },
      legal: { title: "法律コンサル", desc: "法遵守、ビザ、法的文書。権利を守るために専門家に相談。", items: ["契約書作成", "ビザ相談", "不動産法", "紛争解決", "商法", "公証業務"] },
      commercial: { title: "商業用サービス", desc: "店舗やオフィス向け。内装、移転、電気メンテナンス。", items: ["店舗内装", "オフィス移転", "商業用電気", "防火設備", "ITネットワーク", "空調設備"] }
    },
    popularTitle: "人気", popularIn: "in", allUK: "全英対応",
    noProjects: { title: "このカテゴリーに案件はありません", desc: "お住まいの地域のトップエキスパートを募集中です。" },
    reviews: { excellent: "素晴らしい", basedOn: "に基づいた", verified: "認証済み", countLabel: "件のレビュー" }
  },
  location: { selectCity: "都市を選択", detecting: "検出中...", switch: "切り替え", nearby: "近くのサービス" },
  diagnosis: {
    badge: "DRIVEN BY GEMINI AI",
    title1: "プロの修理診断",
    title2: "数秒で完了",
    subtitle: "推測はやめましょう。AIが写真を分析し、予約前に即座に原因、作業範囲、適正価格を推定します。",
    features: {
      instant: { title: "即時の洞察", desc: "折り返し連絡を待つ必要はありません。アップロード直後にテクニカル分析を提供。" },
      pricing: { title: "適正な市場価格", desc: "英国の実際のデータを使用して、お住まいの地域の正確な価格帯を提示します。" },
      verified: { title: "認証済み事前予約", desc: "診断後、問題に特化したトップ1%のエキスパートに直接つながることができます。" }
    },
    cta: "すべてのサービスを見る",
    tool: {
      title: "AI即時診断",
      subtitle: "写真をアップロードして、AIに修理費用と範囲を推定させましょう。",
      step1: "1. 証拠写真をアップロード",
      step2: "2. カテゴリーを選択",
      step3: "3. 状況を説明 (任意)",
      uploadHint: "写真を撮るか選択",
      replaceHint: "クリックして写真を変更",
      submit: "無料AI診断を実行",
      loading: "AIが分析中...",
      disclaimer: "AIの推定はあくまで目安です。正式な見積もりは専門家から提供されます。",
      newDiagnosis: "新しい診断",
      categories: { plumbing: "配管", auto: "自動車", renovation: "リフォーム", electrical: "電気", cleaning: "清掃" },
      resultTitle: "AI診断結果",
      detectedIssue: "検出された問題",
      recommendedSolution: "推奨される解決策",
      estimatedCostLabel: "推定価格帯",
      ukStandard: "英国標準価格",
      includesLabor: "部品代・工賃込み",
      bookSpecialist: "このプロを予約する",
      confidence: "信頼度",
      analyzedPhoto: "分析された写真",
      guaranteedRepairs: "修理保証",
      disputeResolution: "トラブル解決サポート",
      fastTurnaround: "迅速な対応",
      responseHours: "{category}のプロは通常2時間以内に返信します。",
      errorPhotoCategory: "写真のアップロードとカテゴリーの選択が必要です。",
      errorUnexpected: "予期しないエラーが発生しました。もう一度お試しください。",
      uploadFormatHint: "JPG, PNG対応",
      descriptionPlaceholder: "詳しい状況を教えてください...",
      strictMode: "厳格なビジョンモード",
      strictModeHint: "高精度な視覚推理 (詳細分析)"
    }
  },
  onboarding: {
    hero: { title: "ConciergeAIでビジネスを拡大", subtitle: "英国で最もエリートな認定プロフェッショナルネットワークに参加しましょう。" },
    steps: { profile: "ビジネスプロフィール", credentials: "英国資格情報", contract: "サービス契約" },
    sectors: { title: "セクターを選択", professional: { title: "プロフェッショナル", desc: "会計、法律、コンサルティング", industries: ["会計", "税務相談", "法的サービス", "経営戦略"] }, education: { title: "教育", desc: "講師、トレーナー、コーチ", industries: ["学術講師", "語学トレーニング", "スキルコーチ", "音楽講師"] }, technical: { title: "テクニカル", desc: "技術職、修理、エンジニアリング", industries: ["配管", "電気", "自動車", "リフォーム"] } },
    contract: { title: "標準サービス契約", scrollingNotice: "一番下までスクロールして規約に同意してください。", agree: "ConciergeAI基本合意書を読み、同意します。", clauses: { platform_fee: { title: "1. プラットフォーム利用料", body: "ConciergeAIは予約完了時に9%の手数料を申し受けます。" }, payments: { title: "2. エスクローと支払い", body: "顧客の支払いは安全なエスクローで保持されます。顧客が完了を確認してから48時間後に出金可能になります。" }, conduct: { title: "3. プロフェッショナル基準", body: "エキスパートは最低4.0の評価を維持する必要があります。英国の安全基準を満たさない場合、即座にアカウント停止となる場合があります。" } } },
    buttons: { start: "はじめる", next: "次へ", back: "戻る", submit: "登録を完了" }
  }
};
