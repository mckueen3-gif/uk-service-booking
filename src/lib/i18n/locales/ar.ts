import { Dictionary } from '../dictionary';

export const ar: any = {
  nav: { browse: "تصفح الخدمات", join: "انضم كمحرف", login: "تسجيل الدخول", register: "إنشاء حساب", logout: "تسجيل الخروج", dashboard: "لوحة التحكم", aiDiagnosis: "تشخيص AI", education: "قطاع التعليم", quickActions: "إجراءات سريعة", exploreServices: "استكشاف الخدمات" },
  legal: { ui: { selectLanguage: "الاتصال العالمي", close: "إكمال البروتوكول" } },
  landing_pages: {
    plumbing: {
      hero: {
        badge: "دقة من النخبة",
        title1: "هندسة متفوقة",
        title2: "السباكة والطاقة",
        subtitle: "تواصل مع خبراء معتمدين في المملكة المتحدة للسباكة الدقيقة والكهرباء وتكامل الأجهزة. مراقبة بواسطة الذكاء الاصطناعي لضمان الجودة.",
        searchPlaceholder: "إصلاح الأنابيب، صيانة الغلايات، إعادة الأسلاك...",
        searchBtn: "مسح العقد"
      },
      sub_categories: {
        pipe: { title: "إصلاح الأنابيب", desc: "كشف التسرب في حالات الطوارئ واستبدال الأجهزة بدقة." },
        wiring: { title: "إعادة أسلاك النظام", desc: "المعايرة الكهربائية الاحترافية وتكامل العقد." },
        appliance: { title: "تكامل الأجهزة", desc: "نشر واختبار الأجهزة الصحية والمطبخية." },
        boiler: { title: "تدقيق الغلايات", desc: "الصيانة الحرارية التنظيمية وتشخيص الأداء." },
        switch: { title: "المفاتيح الكهربائية", desc: "استبدال المكونات الكهربائية عالية التكامل." },
        smart: { title: "الأتمتة الذكية", desc: "أتمتة المنزل عبر شبكة متداخلة ونشر المستشعرات." }
      }
    },
    repairs: {
      hero: {
        badge: "السلامة الإنشائية",
        title1: "استعادة الممتلكات",
        title2: "صيانة متميزة",
        subtitle: "من تجميع الأثاث إلى المعالجة الإنشائية. أفضل 1٪ من خبراء الصيانة في المملكة المتحدة تحت تصرفك.",
        searchPlaceholder: "تجميع الأثاث، إصلاح الجدران...",
        searchBtn: "بحث الاتصال"
      },
      sub_categories: {
        furniture: { title: "تجميع الأثاث", desc: "تجميع دقيق للأجهزة الموديلية المعقدة." },
        structural: { title: "التركيبات الإنشائية", desc: "تركيب ومعايرة التركيبات عالية الأحمال." },
        wall: { title: "ترميم الجدران", desc: "إصلاح السطح واستعادة الطلاء الإنشائي." },
        mounting: { title: "التركيب المودبلي", desc: "النشر الآمن لوحدات الحائط الرقمية والفيزيائية." },
        coating: { title: "الطلاء", desc: "معالجات السطح الجمالية والوقائية." },
        tactics: { title: "تكتيكات عامة", desc: "بروتوكولات الصيانة المنزلية للأغراض العامة." }
      }
    },
    renovation: {
      hero: {
        badge: "التطور المعماري",
        title1: "إعادة هندسة",
        title2: "مساحة المعيشة",
        subtitle: "حول عقارك مع نخبة خبراء التجديد في المملكة المتحدة. تتبع شفاف ونتائج مضمونة الجودة.",
        searchPlaceholder: "توسعة المطبخ، تحويل العلية...",
        searchBtn: "بدء المشروع"
      },
      sub_categories: {
        culinary: { title: "المطبخ والصحة", desc: "إعادة هندسة المطبخ والحمام بالكامل." },
        expansion: { title: "وحدات التوسعة", desc: "توسعات العلية والوحدات لزيادة حجم العقار." },
        layout: { title: "التنسيق المكاني", desc: "التصميم الهولوجرامي وإعادة التكوين الإنشائي." },
        floor: { title: "تشبيك الأرضيات", desc: "نشر الأرضيات عالية المتانة والتشطيب." },
        landscape: { title: "تنسيق المواقع", desc: "هندسة بيئة العقار الخارجية." },
        design: { title: "سياق التصميم", desc: "المخططات المعمارية والمنطق الجمالي." }
      }
    },
    accounting: {
      hero: {
        badge: "الحوكمة المالية",
        title1: "إتقان دفتر",
        title2: "رأس المال",
        subtitle: "نخبة المحاسبين والمخططين الماليين في المملكة المتحدة للشركات الصغيرة والمتوسطة والمهنيين. ضمان الامتثال التشغيلي وتحسين الضرائب.",
        searchPlaceholder: "الإقرارات الضريبية، الحسابات السنوية، الرواتب...",
        searchBtn: "خبراء التدقيق"
      },
      sub_categories: {
        income: { title: "تدقيق الدخل", desc: "التقييم الذاتي ومعايرة ضريبة الدخل الشخصي." },
        accounts: { title: "الحسابات السنوية", desc: "التقارير المالية للشركات وإغلاق الدفاتر." },
        tax: { title: "تقديم الضرائب", desc: "إعداد الضرائب الجاهزة لـ HMRC وإرسالها." },
        payroll: { title: "تشبيك الرواتب", desc: "أنظمة دفع رأس المال البشري الفعالة." },
        xero: { title: "تحسين Xero", desc: "تكامل المحاسبة السحابية والتدريب." },
        fiscal: { title: "التحليل المالي", desc: "تتبع أداء الأعمال بعمق." }
      }
    },
    legal: {
      hero: {
        badge: "الامتثال للنظام البيئي",
        title1: "مشورة الخبراء و",
        title2: "الأطر القانونية",
        subtitle: "تواصل مع خبراء قانونيين معتمدين في المملكة المتحدة لبروتوكولات التأشيرة وصياغة العقود ودعم تسوية المنازعات.",
        searchPlaceholder: "مساعدة التأشيرة، قانون العقارات، العقود...",
        searchBtn: "مشورة الاتصال"
      },
      sub_categories: {
        drafting: { title: "صياغة SLA", desc: "تجميع العقود والاتفاقيات عالية الدقة." },
        visa: { title: "معايرة التأشيرة", desc: "دعم بروتوكول التأشيرة والهجرة في المملكة المتحدة." },
        property: { title: "أطر الملكية", desc: "الخدمات القانونية للعقارات والمنطق القانوني." },
        arbitration: { title: "التحكيم", desc: "بروتوكولات تسوية المنازعات والوساطة المحايدة." },
        law: { title: "قانون السوق", desc: "دعم الحوكمة المؤسسية والتجارية." },
        notary: { title: "كاتب عدل", desc: "التحقق من الوثائق الرسمية والمصادقة عليها." }
      }
    },
    cleaning: {
      hero: {
        badge: "الأمن الحيوي والنظافة",
        title1: "تطهير",
        title2: "بيئتك",
        subtitle: "بروتوكولات تنظيف النخبة للعقارات السكنية والتجارية. تطهير عالي التكامل واهتمام دقيق بالتفاصيل.",
        searchPlaceholder: "تنظيف عميق، نهاية عقد الإيجار...",
        searchBtn: "نشر المتخصصين"
      },
      sub_categories: {
        hygiene: { title: "النظافة المتكررة", desc: "تطهير الممتلكات المتكرر والمعياري." },
        tenancy: { title: "نهاية الإيجار", desc: "تنظيف عميق لانتقالات الإشغال." },
        textile: { title: "تنظيف المنسوجات", desc: "ترميم السجاد والمفروشات الاحترافي." },
        aperture: { title: "تنظيف الفتحات", desc: "بروتوكولات تطهير النوافذ العالية والزجاج." },
        office: { title: "تطهير المكاتب", desc: "إدارة النظافة لمناطق العمل التجارية." },
        bio: { title: "الأمن الحيوي", desc: "إزالة التلوث والتطهير من الدرجة السريرية." }
      }
    },
    car: {
      hero: {
        badge: "صيانة الأجهزة",
        title1: "هندسة السيارات",
        title2: "الدقيقة",
        subtitle: "حافظ على أجهزتك المحمولة مع ميكانيكا محترفين في المملكة المتحدة. تشخيصات في الموقع وخدمات عالية الأداء تحت تصرفك.",
        searchPlaceholder: "تشخيص المحرك، تحضير MOT، الفرامل...",
        searchBtn: "مسح الميكانيكا"
      },
      sub_categories: {
        engine: { title: "تشخيص المحرك", desc: "اكتشاف الأعطال المتقدم وضبط الأداء." },
        brakes: { title: "الفرامل والقابض", desc: "معايرة نظام الاحتكاك الحرج للسلامة." },
        mot: { title: "تحضير MOT", desc: "فحوصات التفتيش التنظيمية والعلاج." },
        ac: { title: "معايرة التكييف", desc: "إعادة تعبئة الغاز ونظافة نظام التحكم في المناخ." },
        bodywork: { title: "ترميم الهيكل", desc: "معالجة الغلاف الإنشائي والجمالي." },
        battery: { title: "الطاقة والإطارات", desc: "إدارة صحة البطارية وكثافة الإطارات." }
      }
    },
    commercial: {
      hero: {
        badge: "البنية التحتية للمؤسسات",
        title1: "تحسين",
        title2: "عقدة عملك",
        subtitle: "دعم بنية تحتية شامل للمساحات التجارية في المملكة المتحدة. تجهيز المحلات، هجرة المكاتب، والصيانة الصناعية.",
        searchPlaceholder: "تجهيز المحلات، شبكة IT، HVAC...",
        searchBtn: "تدقيق الموردين"
      },
      sub_categories: {
        fitting: { title: "تجهيز الوحدات", desc: "هندسة التصميم الداخلي للمساحات التجارية والتجزئة." },
        relocation: { title: "نقل العقدة", desc: "بروتوكولات هجرة المكاتب والصناعية السلسة." },
        industrial: { title: "الطاقة الصناعية", desc: "نشر شبكة الكهرباء عالية الجهد." },
        fire: { title: "أمن الحريق", desc: "أنظمة شبكة السلامة والكشف التنظيمية." },
        mesh: { title: "شبكة IT", desc: "شبكات المؤسسات وتوصيل البيانات." },
        hvac: { title: "ضوابط HVAC", desc: "أنظمة الإدارة البيئية الصناعية." }
      }
    }
  },
  common: { viewProfile: "عرض الملف الشخصي", reviews: "تقييمات", hr: "ساعة", copy: "نسخ",
    copied: "تم النسخ!",
    aiMatchingSub: "خبراء معايرة بالذكا الاصطناعي يطابقون احتياجات بروتوكولك.",
    exploreSub: "استكشف البروتوكولات المتخصصة داخل قطاع {category}.",
    escrow: {
      title: "محمي بـ ConciergeAI Escrow",
      subtitle: "يتم مراقبة كل جلسة في قطاع {category} بواسطة الذكاء الاصطناعي لضمان الجودة والنزاهة المالية.",
      specialists: "متخصصون موثقون",
      fees: "رسوم خدمات المنصة",
      support: "دعم التحكيم بالذكاء الاصطناعي"
    }
  },
  hero: { title: "ابحث عن نخبة خبراء الخدمات", subtitle: "نصلك بالمحترفين المعتمدين في منطقتك.", searchPlaceholder: "ما الخدمة التي تحتاجها؟", badge: "المنصة رقم 1 لحجز الخدمات في المملكة المتحدة" },
  faq: {
    title: "الأسئلة الشائعة",
    subtitle: "كل ما تحتاج معرفته عن منصة حجز الخدمات في المملكة المتحدة.",
    categories: { payments: "المدفوعات", disputes: "النزاعات", bookings: "الحجوزات" },
    aura: { title: "مساعد Aura AI", subtitle: "هل تحتاج مساعدة فورية؟ تحدث مع Aura للحصول على توصيات.", cta: "تحدث مع Aura" },
    questions: {
      payments: [
        { q: "كيف أقوم بالدفع مقابل الخدمة؟", a: "تتم معالجة المدفوعات بأمان عبر Stripe. نحتفظ بالأموال في حساب ضمان حتى تؤكد اكتمال العمل." },
        { q: "هل هناك رسوم خفية؟", a: "لا. المنصة لا تتقاضى أي رسوم خدمة من العملاء. أنت تدفع فقط مقابل العمالة والمواد المعتمدة." }
      ],
      disputes: [
        { q: "ماذا لو كان العمل غير مرضي؟", a: "يقوم محكمو الذكاء الاصطناعي لدينا بمراجعة الصور بناءً على نطاق العمل الأصلي لضمان حل عادل." },
        { q: "كيف أطلب استرداد الأموال؟", a: "يمكنك فتح نزاع من خلال لوحة التحكم الخاصة بك إذا لم يلتزم الخبير بالشروط المتفق عليها." }
      ],
      bookings: [
        { q: "هل يمكنني إلغاء الحجز؟", a: "نعم، يمكنك الإلغاء قبل 24 ساعة من الموعد المحدد لاسترداد المبلغ بالكامل." },
        { q: "كيف أتواصل مع الخبير الخاص بي؟", a: "بمجرد تأكيد الحجز، ستتمكن من الوصول إلى قناة دردشة آمنة." }
      ]
    }
  },
  aura: {
    welcome: "مرحباً! أنا Aura، منسق الخدمات الخاص بك في المملكة المتحدة. كيف يمكنني مساعدتك اليوم؟",
    offline: "غير متصل",
    ready: "متصل - جاهزة للمساعدة",
    placeholder: "اسأل Aura أي شيء...",
    error: "عذراً، أواجه مشكلة في الاتصال حالياً. يرجى المحاولة لاحقاً.",
    footer: "دعم AI آمن • إصدار المنصة 1.2",
    suggestions: {
      refund: "كيفية استرداد الأموال؟",
      dispute: "نزاع حول الإصلاح؟",
      warranty: "شروط الضمان",
      booking: "بخصوص الحجز",
      refundQuery: "كيف يمكنني طلب استرداد الأموال؟ ما هو الإجراء؟",
      disputeQuery: "ماذا أفعل إذا كنت غير راضٍ عن جودة الإصلاح أو السعر؟",
      warrantyQuery: "هل هناك ضمان على الخدمات المقدمة من خلال المنصة؟",
      bookingQuery: "كيف يمكنني حجز فني بالقرب مني؟"
    }
  },
  footer: { 
    tagline: "نصلك بصفوة المحترفين المعتمدين في المملكة المتحدة.", 
    explore: "استكشف", 
    legal: "قانوني", 
    support: "الدعم", 
    rights: "جميع الحقوق محفوظة.", 
    terms: "شروط الخدمة", 
    privacy: "سياسة الخصوصية", 
    cookies: "سياسة الكوكيز", 
    help: "مركز المساعدة", 
    contact: "اتصل بنا", 
    aiDiagnosis: "تشخيص الذكاء الاصطناعي", 
    homeCleaning: "تنظيف المنزل", 
    plumbingServices: "خدمات السباكة", 
    automotiveServices: "خدمات السيارات", 
    trustSignal: "ممتاز على Trustpilot",
    address: "London, UK",
    phone: "+44 20 1234 5678",
    email: "support@conciergeai.uk",
    aboutUs: "ConciergeAI نصل أصحاب المنازل في المملكة المتحدة بـ أفضل 1% من خبراء الخدمة المعتمدين.",
    companyNo: "12345678",
    vatNo: "GB123456789",
    social: {
      facebook: "https://facebook.com/conciergeai",
      twitter: "https://twitter.com/conciergeai",
      instagram: "https://instagram.com/conciergeai",
      linkedin: "https://linkedin.com/company/conciergeai"
    }
  },
  search: { 
    filters: "الفلاتر", keyword: "الكلمة المفتاحية", location: "الموقع", category: "الفئة", minRating: "أقل تقييم", verifiedOnly: "المعتمدون فقط", 
    apply: "تطبيق", sortBy: "ترتيب حسب", sortRating: "الأعلى تقييماً", sortJobs: "الأكثر عملاً", sortDistance: "الأقرب", sortPrice: "السعر: من الأقل للأعلى", 
    foundCount: "تم العثور على {{count}} محترف", searching: "جاري البحث عن خبراء...", noResults: "لم يتم العثور على خبراء يطابقون بحثك",
    noResultsHint: "حاول تعديل الفلاتر أو البحث في منطقة مختلفة.", clearFilters: "مسح الكل", 
    basePrice: "يبدأ من", viewDetails: "عرض التفاصيل", listView: "عرض القائمة", mapView: "عرض الخريطة", searchThisArea: "ابحث في هذه المنطقة",
    verified: "معتمد", insured: "مؤمن عليه", priceAudit: "تدقيق السعر AI: عادل", defaultDesc: "خبير خدمات محترف"
  },
  booking: {
    steps: { details: "التفاصيل", schedule: "الجدول", confirmation: "التأكيد" },
    titles: { details: "أخبرنا عن احتياجاتك", schedule: "اختر موعداً", confirm: "أكد حجزك", success: "تم تأكيد الحجز!" },
    labels: { date: "التاريخ", time: "الوقت", make: "الماركة", model: "الموديل", address: "العنوان", notes: "ملاحظات", agree: "أوافق على الشروط (رسوم منصة مجانية للعملاء)", summary: "ملخص الدفع", paid: "مدفوع", merchant: "الخبير", service: "الخدمة" },
    buttons: { next: "التالي", prev: "السابق", pay: "دفع آمن", home: "الرئيسية", dashboard: "لوحة التحكم" },
    messages: { finalizing: "جاري إنهاء حجزك...", wait: "يرجى عدم تحديث الصفحة", contact24h: "سيتصل بك الخبير خلال 24 ساعة.", safety: "لأمانك، يتم الاحتفاظ بجميع المدفوعات في حساب ضمان.", noReviews: "لا توجد تقييمات بعد", recommended: "موصى به بشدة", replyFromMaster: "رد من الخبير" } },
  merchant: {
    verified: "متخصص معتمد", background: "تم التحقق من الخلفية", portfolio: "معرض الأعمال", reviewTitle: "تقييمات العملاء", realReviews: "تقييمات حقيقية من حجوزات معتمدة", verifiedBooking: "حجز معتمد", pricingAnalysis: "تحليل الأسعار AI", bookingChannel: "قناة حجز احترافية", viewServices: "عرض كافة الخدمات", guarantee: "ضمان الخدمة", fastResponse: "استجابة سريعة", contactExpert: "اتصل بالخبير", noReviews: "لا توجد تقييمات", reply: "رد",
    dashboard: {
      title: "لوحة تحكم التاجر", welcome: "مرحباً بك مجدداً،", previewProfile: "معاينة الملف العام", manageServices: "إدارة الخدمات",
      stats: { totalBookings: "إجمالي الحجوزات", rating: "التقييم", pendingBalance: "الرصيد المعلق", availableBalance: "الرصيد المتاح", totalJobs: "إجمالي المهام", escrowHeld: "في الضمان", availableNow: "متاح الآن", reviews: "التقييمات" },
      syncStatus: "حالة المزامنة",
      lastSynced: "آخر مزامنة",
      refresh: "تحديث",
      syncing: "جاري المزامنة...",
      syncFailed: "فشلت المزامنة، حاول مجدداً",
      wallet: {
        syncing: "جاري مزامنة المحفظة...",
        synced: "تم مزامنة المحفظة",
        generating: "جاري إعداد الحساب...",
        referralTitle: "رشح صديقاً واحصل على 2% مكافآت قسائم",
        referralDesc: "شارك كودك الفريد. ستحصل على 2% في شكل قسائم إلكترونية للمتاجر والسوبر ماركت عند حجز صديقك لخدمته الأولى.",
        historyTitle: "سجل العمليات",
        historyEmpty: "لا توجد عمليات بعد",
        type: "النوع",
        description: "الوصف",
        amount: "المبلغ",
        date: "التاريخ",
        referralListTitle: "ترشيحاتي",
        referralListDesc: "تتبع دخلك السلبي من الأصدقاء المدعوين",
        referee: "الصديق",
        earned: "إجمالي الربح",
        expiry: "تنتهي العمولة",
        status: "الحالة",
        active: "نشط",
        expired: "منتهي",
        joinedAt: "انضم في",
        validUntil: "صالح حتى",
        availableNow: "متاح الآن",
        rewards: {
          title: "استبدال القسائم الإلكترونية",
          subtitle: "* استبدال غير نقدي. قسائم لمتاجر التجزئة الكبرى (Tesco, Amazon). يتم المعالجة خلال 24 ساعة.",
          myVault: "محفظتي",
          redeemBtn: "تبديل",
          statusProcessing: "جاري المعالجة...",
          statusReady: "جاهز",
          voucherDisclaimer: "صالح في المتاجر الكبرى وأنظمة الدفع الرئيسية.",
          confirmRedeem: "هل أنت متأكد من رغبتك في تبديل المكافأة؟ سيتم الإصدار خلال 24 ساعة.",
          requestSuccess: "تم الطلب بنجاح! جاري تخصيص كودك. يرجى التحقق من محفظتك لاحقاً." } },
      bookings: { title: "الحجوزات الأخيرة", viewAll: "عرض الكل", empty: "لا توجد حجوزات أخيرة", completed: "مكتمل", actions: { confirm: "تأكيد", complete: "تحديد كمكتمل", variation: "طلب دفع إضافي" } },
      status: { pending: "قيد الانتظار", confirmed: "مؤكد", completed: "مكتمل", cancelled: "ملغي" },
      variations: { label: "تغيير السعر", status: "الحالة", pending: "في انتظار العميل", approved: "تمت الموافقة", rejected: "مرفوض", arbiterActive: "تحكيم AI نشط" },
      arbiterReasoning: "تحليل التحكيم AI",
      tips: { title: "نصائح النمو", growth: "حافظ على جودة خدمة عالية لضمان الظهور المتميز واستمرارية المهام." },
      quickLinks: { title: "روابط سريعة", schedule: "الجدول", earnings: "الأرباح", support: "الدعم" },
      modal: { title: "طلب دفع إضافي", amount: "المبلغ الإضافي (£)", reason: "السبب", reasonPlaceholder: "مثلاً: تسريب إضافي تحت الأرضية", photo: "دليل صوري", photoHint: "مطلوب للتحقق بواسطة AI", submit: "إرسال الطلب", submitting: "جاري الرفع..." },
      avatar: { upload: "رفع صورة", hint: "يفضل صورة احترافية أو شعار الشركة.", success: "تم تحديث الصورة!", errorSize: "يجب أن يكون الحجم أقل من 2 ميجابايت" },
      accounting: {
        title: "المحاسبة والضرائب",
        subtitle: "مركز مالي أوتوماتيكي في المملكة المتحدة: مراقبة ضريبة القيمة المضافة وتوقعات الضرائب.",
        statusActive: "الاشتراك نشط",
        statusInactive: "الاشتراك غير نشط",
        grossRevenue: "الإيرادات الإجمالية",
        grossRevenueDesc: "إجمالي التدفق الوارد من منصات ConciergeAI",
        taxPayable: "الضريبة المستحقة التقديرية",
        taxPayableDesc: "محسوبة بناءً على شرائح ضريبة الدخل في المملكة المتحدة لعام 24/25.",
        vatRadar: "رادار تسجيل ضريبة القيمة المضافة",
        vatRadarDesc: "تتبع القرب من عتبة 90,000 جنيه إسترليني.",
        monthlyBreakdown: "تدقيق الأداء الشهري",
        revenue: "الإيرادات",
        fees: "رسوم المنصة",
        netProfit: "صافي الربح",
        exportCsv: "تصدير سجل التدقيق CSV",
        upgradeTitle: "فتح المحاسبة المتخصصة",
        upgradeDesc: "الدفاتر المحاسبية الآلية، ملخصات سنة الضرائب، وتصدير بيانات CSV.",
        upgradeCost: "£4.99 / شهرياً",
        upgradeBtn: "تفعيل الوصول المميز",
        taxYear: "سنة الضرائب",
        regNumber: "رقم التسجيل (UTR/CRN)"
      }
    },
    portfolio_mgr: {
      title: "إدارة الأعمال", subtitle: "اعرض أفضل أعمالك لجذب المزيد من العملاء.", addBtn: "إضافة عمل", emptyTitle: "لا توجد أعمال", emptyDesc: "أضف صوراً لمشاريعك السابقة لبناء الثقة.",
      modal: { title: "إضافة عمل", itemTitle: "العنوان", itemTitlePlaceholder: "مثلاً: تركيب غلاية في لندن", category: "الفئة", uploadPhoto: "رفع صور المشروع", errorSize: "يجب أن يكون الحجم أقل من 5 ميجابايت", details: "التفاصيل", aiBtn: "توليد بالذكاء الاصطناعي", aiGenerating: "جاري الكتابة...", detailsPlaceholder: "صف العمل الذي قمت به والنتائج.", cancel: "إلغاء", publish: "نشر" },
      deleteConfirm: "هل أنت متأكد من حذف هذا العمل؟", addError: "فشل الإضافة.", aiError: "فشل AI، يرجى الإدخال يدوياً."
    } },
  education_sec: { hero: { badge: "نخبة مدرسي المملكة المتحدة", title1: "أتقن مهارات جديدة", title2: "مع كبار الخبراء", subtitle: "تواصل مع مدرسي النخبة للأكاديميين واللغات والمهارات المهنية. تعلم خاص مصمم لنجاحك.", searchPlaceholder: "ماذا تريد أن تتعلم؟", searchBtn: "ابحث عن مدرس" },
    forYou: { title: "توصيات لك", match: "مطابقة AI", viewProfile: "عرض الملف" },
    categories: { title: "تصفح الفئات", browseBtn: "عرض الكل", items: { 
      academic: { title: "Academic Excellence", desc: "GCSE, A-Levels, IB, 11+ Entrance Prep" }, 
      language: { title: "Global Languages", desc: "IELTS, Duolingo, Business English & more" }, 
      stem: { title: "STEM & AI", desc: "Python, Generative AI, Coding, Data Science" }, 
      arts: { title: "Creative Arts", desc: "Portfolio, Piano, Design, Fine Arts" }, 
      finance: { title: "Elite Certifications", desc: "CFA, ACCA, PMP, Professional Certs" }, 
      career: { title: "Career Strategy", desc: "Interview Prep, Leadership, MBA Strategy" }, 
      junior: { title: "Junior Scholars", desc: "Phonics, Logic, Talent Development" }, 
      masterclass: { title: "Knowledge Workshops", desc: "Investment, Lifestyle, Masterclasses" },
      sen: { title: "Special Education (SEN)", desc: "ADHD, Dyslexia, Autism, Mental Health" }
    } },
    search: { filters: "فلاتر البحث", mode: "النمط", online: "أونلاين", offline: "حضوري", hybrid: "هجين", priceRange: "نطاق السعر (ساعة)", level: "المستوى", student: "طالب جامعي", pro: "مدرس محترف", expert: "خبير (ماجستير/دكتوراه)", apply: "تطبيق", resultsTitle: "المدرسون المتاحون", foundCount: "تم العثور على {{count}} مدرس", placeholder: "ابحث عن مادة أو اسم" },
    common: { reviews: "تقييمات", hr: "ساعة", bookTrial: "حجز حصة تجريبية" },
    tutorCard: { demoDesc: "مدرس شغوف حاصل على دكتوراه مع خبرة تزيد عن 10 سنوات، ساعد أكثر من 100 طالب في تحقيق أهدافهم." },
    tutorProfile: { 
      verified: "مدرس معتمد", about: "عن المدرس", education: "التعليم", experience: "الخبرة", portfolio: "قصص نجاح الطلاب", reviews: "تقييمات الطلاب", availability: "الجدول الأسبوعي", bookNow: "احجز الآن", 
      aiTrial: "تقييم AI", trialChallenge: "تحدي التشخيص الأكاديمي", startChallenge: "ابدأ التحدي", cancel: "ليس الآن",
      loadingChallenge: "جاري تحضير التحدي بواسطة AI...",
      analyzing: "جاري تحليل منهج {subject}",
      questionLabel: "سؤال",
      of: "من",
      explanation: "الشرح:",
      nextQuestion: "السؤال التالي",
      finishChallenge: "إنهاء التحدي",
      scoreResult: "نسبة نتيجتك:",
      assessment: "تقييم AI:",
      assessmentLevels: {
        excellent: "أساس قوي جداً",
        progress: "إمكانات نمو هائلة",
        starting: "بداية رحلة التعلم"
      },
      assessmentDesc: "تم إرسال بيانات التشخيص للمدرس لتخصيص خطتك الدراسية!",
      bookFirstLesson: "احجز حصتك الأولى",
      tryAgain: "إعادة التحدي"
    },
    visitDashboard: "استكشف مركز التعليم"
  }, 
  home: { hero: { badge: "محترفون محليون معتمدون", title1: "احجز أفضل", title2: "الخبراء المحليين", subtitle: "وصول فوري إلى أفضل 1% من المتخصصين في المملكة المتحدة. جميعهم معتمدون ومؤمن عليهم ومراقبون بواسطة AI.", searchPlaceholder: "أنا أحتاج...", locationPlaceholder: "لندن، المملكة المتحدة", aiMatch: "مطابقة ذكية", searchBtn: "بحث الاتصال",
      suggestions: [
        "ابحث عن مهندس Gas Safe في تشيلسي…",
        "احجز مدرسًا بتصنيف عليا لـ GCSE…",
        "هل تحتاج تنظيفًا عميقًا لمكتبك؟",
        "مساعدة قانونية متخصصة لنزاعات العقارات…",
        "محاسب ضرائب محترف في لندن…"
      ],
      popularLabel: "شائع",
      popularTags: ["تجديد المنزل", "تقديم الضرائب", "تنظيف عميق", "مساعدة قانونية"] },
    recommendation: { title1: "موصى به", title2: "لك", subtitle: "أفضل المحترفين بناءً على احتياجاتك وموقعك الحالي.", browse: "عرض الكل" },
    recommendationResults: {
      trendingTitle: "رائج في {{city}}: {{category}}",
      topRatedTitle: "الأعلى تقييماً في {{city}}: {{category}}",
      ukWideTitle: "نخبة المملكة المتحدة: {{category}}",
      professionalTitle: "خدمات احترافية في {{city}}",
      homeRepair: "إصلاح المنازل",
      deepCleaning: "تنظيف عميق",
      accounting: "محاسبة وقانون",
      autoRepair: "ميكانيكا سيارات",
      homeSub: "خبراء إصلاح موثوقون بالقرب منك",
      cleanSub: "متخصصون متاحون اليوم",
      accountSub: "محاسبون ومساعدون قانونيون بمرتبة النخبة",
      autoSub: "ميكانيكيون محترفون لسيارتك",
      assetMatch: "مطابقة الأصول",
      trending: "رائج محلياً"
    },
    aiCTA: { badge: "مدعوم بواسطة ChatGPT, Gemini & Grok", title1: "لا تعرف ما المشكلة؟", title2: "احصل على تشخيص AI فوري", subtitle: "ارفع صورة للمشكلة. سيتعرف الذكاء الاصطناعي على العطل ويقدر التكلفة ويجد لك الخبير المناسب في ثوانٍ.", button: "ابدأ التشخيص المجاني" },
    referralCTA: { badge: "مكافآت الترشيح", title: "اكسب 2% دخل سلبي", subtitle: "رشح أصدقاءك واحصل على 2% من جميع حجوزاتهم للسنوات الخمس القادمة في شكل قسائم تسوق (غير قابلة للسحب النقدي).", button: "ابدأ الكسب الآن", referralLabel: "كود الترشيح الخاص بك:", voucherDisclaimer: "* المكافآت قابلة للاستبدال كقسائم فقط. لا يوجد سحب نقدي." },
    educationCTA: "انتقل إلى التعليم",
    eliteLocal: "نخبة المنطقة",
    eliteBadge: "خبير نخبة",
    defaultCategory: "خبير خدمات",
    noResults: "لم يتم العثور على محترفين في هذه الفئة حالياً.",
    trustedBy: "موثوق به من قبل سكان المملكة المتحدة وموثق من قبل",
    categories: { plumbing: "سباكة", repairs: "إصلاحات", renovation: "ترميم", education: "تعليم", accounting: "محاسبة", legal: "قانون", commercial: "تجاري", cleaning: "تنظيف", car: "سيارات" },
    sections: {
      plumbing: { title: "السباكة والخدمات الفنية", desc: "من التسريبات الطارئة إلى الأسلاك المعقدة، نصلك بفنيين معتمدين.", items: ["إصلاح التسريب", "كهرباء", "تركيب أجهزة", "صيانة غلايات", "مقابس", "منزل ذكي"] },
      repairs: { title: "إصلاحات المنزل", desc: "تجميع الأثاث، إصلاح الجدران، تغيير الأقفال - كل مهام المنزل.", items: ["تجميع أثاث", "نجارة", "ترميم جدران", "رفوف", "طلاء", "إصلاحات عامة"] },
      accounting: { title: "المحاسبة والضرائب", desc: "مخصص للطلاب والشركات الصغيرة. ابقَ متوافقاً مع الضرائب.", items: ["إقرار ضريبي", "حسابات سنوية", "ضريبة القيمة المضافة", "رواتب", "استشارات Xero", "تحليل مالي"] },
      renovation: { title: "الترميم والتجديد", desc: "من توسعات المطابخ إلى التجديد الشامل. إدارة شفافة وجودة مضمونة.", items: ["مطابخ وحمامات", "توسعة منزل", "تصميم داخلي", "طلاء احترافي", "أرضيات", "حدائق"] },
      education: { title: "التعليم والتعلم", desc: "مدرسون ومدربون محترفون. خطط تعلم مخصصة.", items: ["مدرسو لغات", "IELTS/TOEFL", "برمجة", "موسيقى وفنون", "مهارات أعمال", "دروس تقوية"] },
      cleaning: { title: "تنظيف احترافي", desc: "تنظيف عميق عند انتهاء الإيجار أو تنظيف منزلي دوري دقيق.", items: ["تنظيف دوري", "تنظيف انتهاء عقد", "غسيل سجاد", "تنظيف نوافذ", "تنظيف مكاتب", "تطهير"] },
      legal: { title: "الاستشارات القانونية", desc: "طلبات التأشيرة، صياغة العقود وغيرها. تواصل مع خبراء لحماية حقوقك.", items: ["صياغة عقود", "تأشيرات", "قانون العقارات", "حل النزاعات", "قانون أعمال", "توثيق"] },
      commercial: { title: "الخدمات التجارية", desc: "للمساحات التجارية. تجهيزات المتاجر، نقل المكاتب وصيانة الكهرباء.", items: ["تجهيز محلات", "نقل مكاتب", "كهرباء صناعية", "سلامة حرائق", "شبكات IT", "تكييف مركزي"] }
    },
    popularTitle: "رائج", popularIn: "في", allUK: "كل المملكة المتحدة",
    noProjects: { title: "لا توجد مشاريع في هذه الفئة", desc: "نحن نقوم بنشاط بضم كبار الخبراء في منطقتك." },
    reviews: { excellent: "ممتاز", basedOn: "بناءً على", verified: "موثق", countLabel: "تقييم" },
    howItWorks: {
      title: "كيف يعمل",
      subtitle: "بروتوكول حجز الخدمات الأكثر تقدمًا في المملكة المتحدة، مدعومًا بالذكاء الاصطناعي.",
      step1Title: "تشخيص AI",
      step1Desc: "قم بتحميل المشكلات لتحديد الأعطال الفورية وتقدير التكلفة الدقيقة.",
      step2Title: "المطابقة الذكية",
      step2Desc: "تحدد شبكتنا أفضل 1% من المتخصصين المعايرين لمشكلتك المحددة.",
      step3Title: "أمان الضمان",
      step3Desc: "يتم الاحتفاظ بالمدفوعات في حساب ضمان آمن حتى تؤكد نجاح العملية.",
      step4Title: "ضمان الخدمة",
      step4Desc: "تتم مراقبة كل جلسة بواسطة الذكاء الاصطناعي لضمان الجودة ودعم حل النزاعات."
    }
  },
  location: { selectCity: "اختر المدينة", detecting: "جاري تحديد الموقع...", switch: "تبديل", nearby: "خدمات قريبة" },
  diagnosis: {
    badge: "مدعوم بتقنية ChatGPT, Gemini & Grok",
    title1: "إصلاحات الخبراء",
    title2: "بسرعة البرق",
    subtitle: "توقف عن التخمين. يحلل الذكاء الاصطناعي صورك لتقديم رؤى فورية ونطاق إصلاح وتقديرات تكلفة عادلة قبل الحجز.",
    features: {
      instant: { title: "رؤى فورية", desc: "لا داعي لانتظار المكالمات. احصل على تحليل تقني فور رفع الصورة." },
      pricing: { title: "أسعار عادلة", desc: "نستخدم بيانات الخدمة الحقيقية لتقديم نطاق تكلفة دقيق لمنطقتك." },
      verified: { title: "حجز معتمد", desc: "بعد التشخيص، تواصل مباشرة مع أفضل 1% من الخبراء المناسبين لمشكلتك." }
    },
    cta: "تصفح كل الخدمات",
    tool: {
      title: "تشخيص AI فوري",
      subtitle: "ارفع صورة ليقوم الذكاء الاصطناعي بتقدير التكلفة والنطاق.",
      step1: "1. رفع صور الدليل",
      step2: "2. اختر الفئة",
      step3: "3. وصف المشكلة (اختياري)",
      uploadHint: "التقط أو ارفع صورة",
      replaceHint: "انقر لتغيير الصورة",
      submit: "توليد تشخيص AI مجاني",
      loading: "جاري تحليل البيانات...",
      disclaimer: "تقديرات AI إرشادية فقط. السعر النهائي يقدمه الخبير.",
      newDiagnosis: "تشخيص جديد",
      categories: { plumbing: "سباكة", auto: "سيارات", renovation: "ترميم", electrical: "كهرباء", cleaning: "تنظيف" },
      resultTitle: "نتائج تحليل AI",
      detectedIssue: "المشكلة المكتشفة",
      recommendedSolution: " الحل الموصى به",
      estimatedCostLabel: "نطاق التكلفة التقديري",
      ukStandard: "معيار المملكة المتحدة",
      clinicalStandard: "معيار طبي",
      includesLabor: "يشمل القطع والعمالة",
      bookSpecialist: "احجز هذا المتخصص",
      confidence: "مستوى الثقة",
      analyzedPhoto: "الصورة التي تم تحليلها",
      guaranteedRepairs: "إصلاحات مضمونة",
      disputeResolution: "دعم حل النزاعات",
      fastTurnaround: "إنجاز سريع",
      responseHours: "يرد خبراء {category} عادة خلال ساعتين.",
      errorPhotoCategory: "يرجى رفع صورة واختيار فئة.",
      errorUnexpected: "حدث خطأ غير متوقع. حاول مرة أخرى.",
      uploadFormatHint: "يدعم JPG, PNG",
      descriptionPlaceholder: "صف العطل بمزيد من التفاصيل...",
      strictMode: "وضع الرؤية الدقيقة",
      strictModeHint: "تحليل بصري عالي الدقة (عميق)",
      authRequired: "للأعضاء فقط: يرجى تسجيل الدخول لاستخدام تشخيص الذكاء الاصطناعي", 
      limitReached: "تم الوصول إلى الحد اليومي (5/5)", 
      limitReachedHint: "يمكنك الاتصال بخبرائنا الموصى بهم مباشرة أو المحاولة مرة أخرى غدًا.", 
      remaining: "الاستخدامات اليومية المتبقية", 
      findSpecialist: "اتصل بخبير الآن"
    }
  },
  onboarding: {
    hero: { title: "وسع أعمالك مع ConciergeAI", subtitle: "انضم إلى شبكة النخبة من خبراء الخدمة المعتمدين في المملكة المتحدة." },
    steps: { profile: "الملف العملي", credentials: "الاعتمادات", contract: "اتفاقية الخدمة" },
    sectors: { title: "اختر قطاعك العملي", professional: { title: "خدمات احترافية", desc: "محاسبة، قانون، استشارات", industries: ["محاسب", "خبير ضرائب", "قانوني", "استراتيجي"] }, education: { title: "مشاريع تعليمية", desc: "مدرسون، مدربون", industries: ["مدرس أكاديمي", "مدرب لغات", "مدرب مهارات", "مدرس موسيقى"] }, technical: { title: "خدمات تقنية", desc: "حرفيون، صيانة، هندسة", industries: ["سباك", "كهربائي", "ميكانيكي", "مرمم منازل"] } },
    contract: { title: "اتفاقية الخدمة الموحدة", scrollingNotice: "يرجى التمرير للنهاية للموافقة بك الشروط.", agree: "لقد قرأت وأوافق على اتفاقية ConciergeAI الرئيسية.", clauses: { platform_fee: { title: "1. رسوم الخدمة", body: "تقتطع المنصة عمولة قدرها 9% على المهام المكتملة بنجاح." }, payments: { title: "2. الضمان والتسوية", body: "توضع دفعات العملاء في حساب ضمان آمن. يتم تحرير السيولة بعد 48 ساعة من تأكيد اكتمال المهمة." }, conduct: { title: "3. معايير السلوك المهني", body: "يجب على الخبراء الحفاظ على تقييم أعلى من 4.0. يؤدي الفشل في تلبية بروتوكولات السلامة إلى إنهاء الحساب فوراً." } } },
    buttons: { start: "ابدأ الآن", next: "التالي", back: "رجوع", submit: "إكمال الانضمام" }
  },
  admin: {
    sidebar: { overview: "نظرة عامة", analytics: "التحليلات", bookings: "الحجوزات", verifications: "التحققات", disputes: "النزاعات", merchants: "التجار", payouts: "المدفوعات", users: "المستخدمين", settings: "الإعدادات", terminal: "الطرفية" },
    header: { internal: "العمليات الداخلية", operations: "لوحة العمليات", node: "العقدة النشطة" },
    stats: { gmv: "إجمالي حجم البضائع", netRevenue: "صافي الإيرادات", bookings: "الحجوزات", dailyAvg: "المتوسط اليومي", processed: "تمت معالجتها", volume24h: "حجم 24 ساعة", syncing: "جاري المزامنة..." },
    analytics: { gmvTitle: "GMV", gmvSub: "تحليلات الإيرادات", sectorDist: "توزيع القطاعات", volTitle: "حجم السوق", live: "مباشر" },
    bookings: { title: "الحجوزات", sub: "المعاملات الحية", search: "بحث...", id: "المعرف", customer: "العميل", amount: "المبلغ", status: "الحالة", service: "الخدمة" },
    verifications: { title: "التحققات", sub: "فحوصات الخلفية", evidence: "الأدلة", extraction: "الاستخراج", passport: "جواز السفر", faceMatch: "تطابق الوجه", confidence: "الثقة", fullName: "الاسم الكامل", idNumber: "رقم الهوية", expiryDate: "الانتهاء", dob: "تاريخ الميلاد" },
    disputes: { title: "النزاعات", sub: "التحكيم", reasoning: "التبرير", gallery: "المعرض", verdict: "الحكم", confidence: "الثقة" },
    payouts: { title: "المدفوعات", sub: "تسوية التاجر", snapshot: "لُقطة", pending: "قيد الانتظار", volume: "الحجم", security: "الأمان", adjudication: "الفصل", method: "الطريقة" },
    users: { title: "المستخدمين", sub: "قاعدة بيانات المستخدمين", stats: "الإحصائيات", registeredAt: "انضم في", referrals: "الإحالات" },
    commissions: { title: "العمولات", sub: "التحكم في الإيرادات", plateformFee: "رسوم المنصة", marketplaceFee: "رسوم السوق", adminControl: "تحكم المسؤول", weightedAvg: "المتوسط المرجح", totalJobs: "إجمالي الوظائف", deliveryVolume: "حجم التسليم", merchantDetails: "تفاصيل التاجر" },
    disputes_mgr: { empty: "لا توجد نزاعات معلقة.", viewDetails: "مراجعة", status: { open: "مفتوح", processing: "قيد المعالجة", settled: "تمت تسويته" } },
    merchants_mgr: { empty: "لم يتم العثور على خبراء.", status: { active: "نشط", suspended: "معلق", pending: "قيد الانتظار" } },
    settings_mgr: {
      title: "تكوين الشبكة العالمية",
      sub: "إدارة العلامة التجارية العالمية، والبروتوكولات القانونية، ونواقل الاتصال",
      companyInfo: "بيانات الشركة",
      socialLinks: "روابط التواصل",
      legalLinks: "الوثائق القانونية",
      tabs: { branding: "العلامة التجارية", contact: "الاتصال", legal: "القانوني", social: "التواصل الاجتماعي" },
      fields: { companyName: "اسم العمل", aboutUs: "المهمة", logoUrl: "رابط الشعار", officeAddress: "العنوان", contactPhone: "الهاتف", contactEmail: "البريد الإلكتروني", companyRegistration: "رقم التسجيل", vatRegistration: "الرقم الضريبي", facebook: "FB", twitter: "X", instagram: "IG", linkedin: "LI" },
      save: "تحديث الإعدادات",
      saving: "جاري المزامنة...",
      success: "تم الحفظ",
      error: "خطأ في البروتوكول"
    }
  },
  auth: {
    login: {
      title: "تسجيل الدخول",
      subtitle: "سجل الدخول لإدارة خدماتك وحجوزاتك.",
      emailLabel: "البريد الإلكتروني",
      emailPlaceholder: "example@concierge.ai",
      passwordLabel: "كلمة المرور",
      passwordPlaceholder: "أدخل كلمة المرور",
      forgotPassword: "نسيت كلمة المرور؟",
      submit: "تسجيل الدخول",
      loading: "جاري الدخول...",
      or: "أو",
      google: "الدخول بواسطة Google",
      navToRegister: "جديد على المنصة؟",
      createAccount: "سجل الآن",
      error: "فشل الدخول. تحقق من بياناتك.",
      success: "تم الدخول بنجاح. جاري التحويل."
    },
    register: {
      title: "إنشاء حساب",
      subtitle: "انضم إلى شبكة ConciergeAI النخبوية.",
      firstNameLabel: "الاسم الأول",
      lastNameLabel: "الكنية",
      emailLabel: "البريد الإلكتروني",
      emailPlaceholder: "example@concierge.ai",
      accountTypeLabel: "دور الحساب",
      passwordLabel: "كلمة المرور",
      passwordHint: "6 أحرف على الأقل",
      referralLabel: "كود الترشيح (اختياري)",
      referralPlaceholder: "مثلاً ALPHA-99",
      submit: "إنشاء الحساب",
      loading: "جاري المعالجة...",
      or: "أو",
      google: "التسجيل بواسطة Google",
      navToLogin: "لديك حساب بالفعل؟",
      signIn: "سجل دخولك هنا",
      roles: { customer: "عميل", merchant: "خبير" }
    },
    forgotPassword: {
      title: "استعادة الحساب",
      subtitle: "أدخل بريدك لاستلام رابط الاستعادة.",
      emailLabel: "البريد الإلكتروني",
      emailPlaceholder: "example@concierge.ai",
      submit: "إرسال رابط الاستعادة",
      loading: "جاري الإرسال...",
      back: "العودة للدخول",
      success: "تم إرسال الرابط لبريدك.",
      error: "فشل الإرسال. تحقق من البيانات.",
      successDetail: "تم إرسال رابط الاستعادة إلى {email}."
    },
    resetPassword: {
      title: "إعادة ضبط كلمة المرور",
      subtitle: "أدخل كلمة المرور الجديدة أدناه.",
      passwordLabel: "كلمة المرور الجديدة",
      confirmPasswordLabel: "تأكيد كلمة المرور",
      submit: "تحديث",
      loading: "جاري التحديث...",
      back: "العودة للدخول",
      success: "تم التحديث بنجاح.",
      invalidToken: "الرابط غير صالح أو منتهي.",
      notMatch: "كلمات المرور غير متطابقة.",
      error: "خطأ في النظام. اتصل بالدعم.",
      successDetail: "تم تحديث كلمة المرور. جاري التحويل للدخول...",
      invalidTokenDetail: "رابط إعادة الضبط هذا منتهي الصلاحية.",
      requestNewLink: "طلب رابط جديد"
    },
    errors: {
      missingFields: "يرجى ملء جميع الحقول.",
      passwordTooShort: "يجب أن تكون كلمة المرور 6 أحرف على الأقل.",
      emailExists: "هذا البريد مسجل مسبقاً في النظام.",
      invalidCredentials: "بيانات الدخول غير صحيحة.",
      serverError: "خطأ داخلي في النظام. حاول لاحقاً.",
      resetFailed: "فشل في معالجة الطلب.",
      invalidReset: "رابط إعادة ضبط غير صالح."
    },
    loading: {
      preparing: "جاري تهيئة الجلسة...",
      initializing: "جاري تشغيل النظام..."
    }
  }
};
