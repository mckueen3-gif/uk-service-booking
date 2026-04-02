import { Dictionary } from '../dictionary';

export const ko: Dictionary = {
  nav: { 
    browse: "서비스 둘러보기", join: "전문가로 참여", login: "로그인", logout: "로그아웃", 
    dashboard: "내 대시보드", aiDiagnosis: "AI 진단", education: "교육 지원" 
  },
  common: { viewProfile: "프로필 보기", reviews: "개의 리뷰", hr: "시간", copy: "복사", copied: "복사됨!" },
  hero: { title: "최고의 서비스 제공업체 찾기", subtitle: "귀하의 지역에 있는 인증된 전문가와 연결하세요.", searchPlaceholder: "어떤 서비스가 필요하신가요?", badge: "영국 No.1 서비스 마켓플레이스" },
  faq: {
    title: "자주 묻는 질문",
    subtitle: "영국 서비스 예약 플랫폼에 대해 알아야 할 모든 것.",
    categories: { payments: "결제", disputes: "분쟁 해결", bookings: "예약" },
    aura: { title: "Aura AI 어시스턴트", subtitle: "즉각적인 도움이 필요하신가요? 맞춤형 조언을 위해 Aura와 채팅하세요.", cta: "Aura와 채팅하기" },
    questions: {
      payments: [
        { q: "서비스 요금은 어떻게 결제하나요?", a: "결제는 Stripe를 통해 안전하게 처리됩니다. 작업 완료가 확인될 때까지 자금을 에스크로에 보관합니다." },
        { q: "숨겨진 수수료가 있나요?", a: "아니요. 견적된 가격만 지불하시면 됩니다. 소액의 플랫폼 수수료가 이미 견적에 포함되어 있습니다." }
      ],
      disputes: [
        { q: "작업 결과가 만족스럽지 않으면 어떻게 하나요?", a: "당사의 AI 중재자가 초기 범위와 작업 사진을 검토하여 공정한 해결을 보장합니다." },
        { q: "환불을 어떻게 요청하나요?", a: "판매자가 합의된 조건을 충족하지 못할 경우 대시보드를 통해 분쟁을 제기할 수 있습니다." }
      ],
      bookings: [
        { q: "예약을 취소할 수 있나요?", a: "네, 예정된 시간 24시간 전까지 취소하면 전액 환불이 가능합니다." },
        { q: "담당 전문가에게 어떻게 연락하나요?", a: "예약이 확정되면 직접적이고 안전한 채팅 채널을 이용할 수 있습니다." }
      ]
    }
  },
  footer: { tagline: "영국 최고의 인증된 전문가와 연결하세요.", explore: "탐색", legal: "법적 정보", support: "지원", rights: "© 2024 UK Service Hub. All rights reserved.", terms: "이용 약관", privacy: "개인정보 처리방침", cookies: "쿠키 정책", help: "도움말 센터", contact: "고객 지원", aiDiagnosis: "AI 진단", homeCleaning: "홈 클리닝", plumbingServices: "배관 서비스", automotiveServices: "자동차 수리" },
  search: { 
    filters: "필터", keyword: "키워드", location: "위치", category: "카테고리", minRating: "최소 평점", verifiedOnly: "인증됨만", 
    apply: "필터 적용", sortBy: "정렬 기준", sortRating: "평점순", sortJobs: "작업 완료순", sortDistance: "거리순", sortPrice: "가격순", 
    foundCount: "{{count}}명의 전문가를 찾았습니다", searching: "전문가 검색 중...", noResults: "일치하는 전문가가 없습니다", 
    noResultsHint: "필터를 조정하거나 다른 지역에서 검색해 보세요.", clearFilters: "모두 지우기", 
    basePrice: "예상 시작 가격", viewDetails: "상세 보기", listView: "리스트", mapView: "지도", searchThisArea: "이 지역 검색",
    verified: "인증됨", insured: "보험 가입됨", priceAudit: "AI 가격 감사: 적정", defaultDesc: "전문 서비스 제공업체"
  },
  booking: {
    steps: { details: "작업 상세", schedule: "일정 선택", confirmation: "검토 및 결제" },
    titles: { details: "작업에 대해 알려주세요", schedule: "가능한 시간 선택", confirm: "예약 확정", success: "예약이 확정되었습니다!" },
    labels: { date: "날짜", time: "시간", make: "제조사", model: "모델", address: "주소", notes: "추가 안내 사항", agree: "약관 및 2% 플랫폼 이용료에 동의합니다", summary: "결제 요약", paid: "결제 완료", merchant: "전문가", service: "서비스" },
    buttons: { next: "계속하기", prev: "뒤로 가기", pay: "안전하게 결제", home: "홈으로 돌아가기", dashboard: "대시보드로 가기" },
    messages: { finalizing: "예약을 확정 중입니다...", wait: "페이지를 새로고침하지 마세요", contact24h: "전문가가 24시간 이내에 연락드릴 것입니다.", safety: "안전을 위해 모든 결제는 에스크로로 보호됩니다.", noReviews: "아직 리뷰가 없습니다", recommended: "최고 추천", replyFromMaster: "전문가의 답변" },
  },
  merchant: {
    verified: "인증된 전문가", background: "범죄 경력 조회 완료", portfolio: "이전 작업", reviewTitle: "고객 리뷰", realReviews: "인증된 예약의 실제 리뷰", verifiedBooking: "인증된 예약", pricingAnalysis: "AI 가격 분석", bookingChannel: "전문 예약 채널", viewServices: "모든 서비스 보기", guarantee: "서비스 보장", fastResponse: "빠른 응답", contactExpert: "전문가에게 문의", noReviews: "아직 리뷰가 없습니다", reply: "답변",
    dashboard: {
      title: "판매 콘솔", welcome: "환영합니다,", previewProfile: "공개 프로필 미리보기", manageServices: "서비스 관리",
      stats: { totalBookings: "누적 예약", rating: "평균 평점", pendingBalance: "정산 예정", availableBalance: "출금 가능 금액", totalJobs: "총 작업 건수", escrowHeld: "에스크로 보관 중", availableNow: "현재 이용 가능", reviews: "리뷰 수" },
      syncStatus: "동기화 상태",
      lastSynced: "마지막 동기화",
      refresh: "새로고침",
      syncing: "데이터 동기화 중...",
      syncFailed: "동기화 실패, 다시 시도해 주세요",
      wallet: {
        syncing: "지갑 데이터 동기화 중...",
        synced: "지갑 데이터 동기화됨",
        generating: "계정 설정을 완료하는 중...",
        referralTitle: "친구를 추천하고 2% 캐시백을 받으세요",
        referralDesc: "전용 코드를 공유하세요. 친구가 첫 서비스를 예약하면 2% 캐시백이 적립됩니다.",
        historyTitle: "거래 내역",
        historyEmpty: "거래 내역이 없습니다",
        type: "유형",
        description: "설명",
        amount: "금액",
        date: "날짜",
        referralListTitle: "내 추천 기록",
        referralListDesc: "초대한 친구들로부터 발생하는 수동 수입을 확인하세요",
        referee: "추천받은 사용자",
        earned: "총 수익",
        expiry: "수수료 유효기간",
        status: "상태",
        active: "활성",
        expired: "만료됨",
        joinedAt: "가입일",
        validUntil: "유효기간",
        availableNow: "현재 이용 가능"
      },
      bookings: { title: "최근 예약", viewAll: "모든 예약 보기", empty: "최근 예약이 없습니다", completed: "완료", actions: { confirm: "확정", complete: "완료 표시", variation: "추가 결제 요청" } },
      status: { pending: "대기 중", confirmed: "확정됨", completed: "완료", cancelled: "취소됨" },
      variations: { label: "추가 작업 요청", status: "상태", pending: "고객 확인 대기 중", approved: "승인됨", rejected: "거절됨", arbiterActive: "AI 중재자 검토 중" },
      arbiterReasoning: "AI 중재 분석",
      tips: { title: "성장 팁", growth: "'골드' 등급이 되어 수수료를 7%로 낮추려면 5개의 작업을 더 완료하세요." },
      quickLinks: { title: "빠른 링크", schedule: "내 일정", earnings: "수익 내역", support: "판매자 지원" },
      modal: { title: "추가 작업 결제 요청", amount: "추가 금액 (£)", reason: "비용 발생 사유", reasonPlaceholder: "예: 벽 뒤에 추가적인 누수 발견", photo: "사진 증빙", photoHint: "AI 인증을 위해 문제 사진 업로드가 필수입니다", submit: "요청 보내기", submitting: "증빙 업로드 중..." },
      avatar: { upload: "프로필 사진 업로드", hint: "권장: 전문적인 인물 사진 또는 회사 로고.", success: "아바타가 업데이트되었습니다!", errorSize: "이미지는 2MB 미만이어야 합니다" },
    },
    portfolio_mgr: {
      title: "사례 포트폴리오", subtitle: "최고의 작업을 보여주어 더 많은 예약을 받으세요.", addBtn: "포트폴리오 추가", emptyTitle: "추가된 사례가 없습니다", emptyDesc: "과거 프로젝트 사진을 추가하여 새로운 고객과 신뢰를 쌓으세요.",
      modal: { title: "포트폴리오 사례 추가", itemTitle: "프로젝트 제목", itemTitlePlaceholder: "예: 런던 콤비 보일러 설치", category: "카테고리", uploadPhoto: "사례 사진 업로드", errorSize: "사진은 5MB 미만이어야 합니다", details: "프로젝트 상세", aiBtn: "AI로 생성", aiGenerating: "AI 작성 중...", detailsPlaceholder: "수행한 작업, 과제, 결과를 설명해 주세요.", cancel: "취소", publish: "사례 게시" },
      deleteConfirm: "이 사례를 삭제하시겠습니까?", addError: "포트폴리오 추가 실패.", aiError: "AI 생성에 실패했습니다. 수동으로 입력해 주세요."
    },
  },
  education_sec: {
    hero: { badge: "영국 엘리트 튜터", title1: "새로운 기술 마스터", title2: "글로벌 전문가와 함께", subtitle: "학업, 언어, 전문 기술을 위한 최고 수준의 튜터와 연결하세요. 당신의 성공을 위해 설계된 맞춤형 1:1 학습.", searchPlaceholder: "무엇을 배우고 싶으신가요?", searchBtn: "튜터 찾기" },
    forYou: { title: "당신을 위한 추천", match: "AI 매칭 점수", viewProfile: "프로필 보기" },
    categories: { title: "카테고리 둘러보기", browseBtn: "모두 보기", items: { academic: { title: "학업 허브", desc: "IELTS, GCSE, A-Levels 등" }, languages: { title: "언어 랩", desc: "영어, 중국어, 스페인어..." }, coding: { title: "코드 아카데미", desc: "Python, 웹 개발, AI..." }, music: { title: "음악 및 예술", desc: "피아노, 디자인, 미술" } } },
    search: { filters: "검색 필터", mode: "수업 방식", online: "온라인", offline: "대면", hybrid: "혼합", priceRange: "시간당 비용", level: "튜터 레벨", student: "대학생", pro: "전문 교사", expert: "석사/박사", apply: "필터 적용", resultsTitle: "이용 가능한 튜터", foundCount: "{{count}}명의 튜터를 찾았습니다", placeholder: "과목 또는 이름으로 검색" },
    common: { reviews: "리뷰", hr: "시간", bookTrial: "체험 수업 예약" },
    tutorCard: { demoDesc: "PhD 학위와 10년 이상의 경험을 가진 열정적인 교육자로, 100명 이상의 학생이 목표를 달성하도록 도왔습니다." },
    tutorProfile: { verified: "인증된 교육자", about: "자기 소개", education: "학력", experience: "교육 경험", portfolio: "학생 성공 사례", reviews: "학생 리뷰", availability: "주간 일정", bookNow: "수업 예약", aiTrial: "AI 평가 체험", trialChallenge: "수업 할인을 위해 AI 과목 챌린지에 도전하세요!", startChallenge: "챌린지 시작", cancel: "취소" }
  },
  home: {
    hero: { badge: "인증된 영국 현지 마스터", title1: "최고 평점의", title2: "현지 전문가 예약", subtitle: "영국 상위 1% 서비스 전문가에게 즉시 액세스하세요. 품질 보증을 위해 인증되고 보험에 가입되었으며 AI로 모니터링됩니다.", searchPlaceholder: "필요한 서비스...", locationPlaceholder: "런던, 영국", aiMatch: "스마트 매칭", searchBtn: "전문가 검색" },
    recommendation: { title1: "개인화된", title2: "당신을 위한 추천", subtitle: "최근 요구 사항 및 위치와 일치하는 최고의 전문가.", browse: "모든 전문가 둘러보기" },
    recommendationResults: {
      trendingTitle: "트렌드",
      topRatedTitle: "최고 평점",
      ukWideTitle: "영국 엘리트",
      professionalTitle: "공인 전문가",
      homeRepair: "주택 수리",
      deepCleaning: "딥 클리닝",
      accounting: "회계 및 세무",
      autoRepair: "자동차 수리",
      homeSub: "신뢰할 수 있는 수리 전문가",
      cleanSub: "전문 청소 서비스",
      accountSub: "공인 세무 자문",
      autoSub: "전문 정비 서비스",
      assetMatch: "AI 자산 매칭",
      trending: "현재 트렌드"
    },
    aiCTA: { badge: "GEMINI AI 기반", title1: "무엇이 문제인지 모르시겠나요?", title2: "즉각적인 AI 진단 받기", subtitle: "문제 사진을 업로드하세요. AI가 문제를 식별하고 비용을 추정하며 몇 초 만에 적합한 전문가를 찾아드립니다.", button: "무료 AI 진단 시도하기" },
    referralCTA: { badge: "추천 보상", title: "2% 패시브 인컴 벌기", subtitle: "친구를 추천하고 향후 5년 동안 그들이 예약할 때마다 2%를 받으세요 (친구당 최대 £200).", button: "커미션 수익 시작하기", referralLabel: "귀하의 개인 추천 코드:" },
    educationCTA: "교육 대시보드 방문",
    eliteLocal: "엘리트 로컬",
    eliteBadge: "엘리트 프로",
    defaultCategory: "서비스 전문가",
    noResults: "이 카테고리에서 전문가를 찾을 수 없습니다.",
    categories: { plumbing: "배관", repairs: "수리", renovation: "리노베이션", education: "교육", accounting: "회계", legal: "법률", commercial: "상업용", cleaning: "청소", car: "자동차" },
    sections: {
      plumbing: { title: "배관 및 전기", desc: "긴급 누수부터 전체 배선 교체까지, 인증된 영국의 마스터와 연결해 드립니다.", items: ["파이프 수리", "배선 교체", "기기 설치", "보일러 서비스", "스위치", "스마트 홈"] },
      repairs: { title: "홈 핸디맨", desc: "조립, 벽 패칭, 문 교체 - 모든 귀찮은 집안일이 해결됩니다.", items: ["가구 조립", "문/창문", "벽 패칭", "선반 설치", "페인팅", "핸디 태스크"] },
      accounting: { title: "회계 및 세무", desc: "영국 해외 거주자 및 중소기업을 위해 맞춤 설계되었습니다. 비즈니스를 위한 규정 준수 신고.", items: ["소득세", "연간 결산", "VAT 신고", "급여 관리", "Xero 컨설팅", "세무 분석"] },
      renovation: { title: "홈 리노베이션", desc: "주방 확장부터 전체 리노베이션까지. 투명한 진행 과정과 품질 보증.", items: ["주방/욕실", "확장", "인테리어 디자인", "페인팅", "바닥재", "조경"] },
      education: { title: "교육 및 학습", desc: "1:1 교사와 전문 교육. 귀하에게 맞춤형 진행 과정을 제공합니다.", items: ["언어 튜터", "IELTS/TOEFL", "코딩", "음악 및 예술", "비즈니스 기술", "학습 지원"] },
      cleaning: { title: "전문 청소", desc: "임대 종료 딥 클리닝 또는 세심한 정기 홈 클리닝.", items: ["정기 청소", "임대 종료 청소", "카페트 청소", "창문 청소", "사무실 청소", "소독"] },
      legal: { title: "법률 컨설팅", desc: "규정 준수, 비자 및 법률 문서. 권리 보호를 위해 전문가에게 문의하세요.", items: ["계약서 작성", "비자 조언", "부동산법", "분쟁 해결", "상법", "공증"] },
      commercial: { title: "상업용 서비스", desc: "비즈니스 공간을 위해 구축되었습니다. 샵피팅, 사무실 이전 및 전기 유지 관리.", items: ["샵피팅", "사무실 이전", "상업용 전기", "소방 안전", "IT 네트워킹", "HVAC"] }
    },
    popularTitle: "인기 항목", popularIn: "지역:", allUK: "영국 전역",
    noProjects: { title: "이 카테고리에서 프로젝트를 찾을 수 없습니다", desc: "해당 지역의 최고 전문가를 적극적으로 모집 중입니다." },
    reviews: { excellent: "최고", basedOn: "기준:", verified: "인증됨", countLabel: "개의 리뷰" }
  },
  location: { selectCity: "도시 선택", detecting: "감지 중...", switch: "전환", nearby: "주변 서비스" },
  diagnosis: {
    badge: "DRIVEN BY GEMINI AI",
    title1: "전문 수리 진단",
    title2: "단 몇 초 만에",
    subtitle: "추측은 그만하세요. AI가 사진을 분석하여 예약 전에 즉각적인 통찰력, 수리 범위 및 공정한 영국 가격 추정치를 제공합니다.",
    features: {
      instant: { title: "즉각적인 통찰력", desc: "더 이상 콜백을 기다리지 마세요. 업로드 직후 기술 분석을 받으세요." },
      pricing: { title: "공정한 시장 가격", desc: "귀하의 지역에 대한 정확한 가격 범위를 제공하기 위해 실제 영국 서비스 데이터를 사용합니다." },
      verified: { title: "인증된 사전 예약", desc: "진단 후 귀하의 문제에 특화된 상위 1% 전문가와 직접 연결하세요." }
    },
    cta: "모든 서비스 둘러보기",
    tool: {
      title: "즉각적인 AI 진단",
      subtitle: "사진을 업로드하고 AI가 수리 비용과 범위를 추정하게 하세요.",
      step1: "1. 사진 증빙 업로드",
      step2: "2. 카테고리 선택",
      step3: "3. 문제 설명 (선택 사항)",
      uploadHint: "사진 찍기 또는 업로드",
      replaceHint: "사진 교체하려면 클릭",
      submit: "무료 AI 진단 생성",
      loading: "AI 통찰력 생성 중...",
      disclaimer: "AI 추정치는 참고용입니다. 공식 견적은 전문가가 제공합니다.",
      newDiagnosis: "새 진단",
      categories: { plumbing: "배관", auto: "자동차", renovation: "리노베이션", electrical: "전기", cleaning: "전문 청소" },
      resultTitle: "AI 진단 결과",
      detectedIssue: "감지된 문제",
      recommendedSolution: "권장 해결책",
      estimatedCostLabel: "예상 가격 범위",
      ukStandard: "영국 표준 가격",
      includesLabor: "부품 및 인건비 포함",
      bookSpecialist: "이 전문가 예약",
      confidence: "신뢰도",
      analyzedPhoto: "분석된 사진",
      guaranteedRepairs: "수리 보장",
      disputeResolution: "분쟁 해결 지원",
      fastTurnaround: "빠른 처리",
      responseHours: "{category} 전문가는 보통 2시간 이내에 응답합니다.",
      errorPhotoCategory: "사진을 업로드하고 카테고리를 선택해 주세요.",
      errorUnexpected: "예기치 않은 오류가 발생했습니다. 다시 시도해 주세요.",
      uploadFormatHint: "JPG, PNG 지원",
      descriptionPlaceholder: "무슨 일이 일어났는지 자세히 알려주세요...",
      strictMode: "엄격한 비전 모드",
      strictModeHint: "고정밀 시각적 추론 (정밀 분석)"
    }
  },
  onboarding: {
    hero: { title: "ConciergeAI와 함께 비즈니스 성장", subtitle: "영국에서 가장 엘리트하고 인증된 서비스 전문가 네트워크에 참여하세요." },
    steps: { profile: "비즈니스 프로필", credentials: "영국 인증 정보", contract: "서비스 계약" },
    sectors: { title: "섹터 선택", professional: { title: "프로페셔널", desc: "회계, 법률, 컨설팅", industries: ["회계 사", "세무 컨설팅", "법률 서비스", "비즈니스 전략"] }, education: { title: "교육", desc: "튜터, 트레이너, 코치", industries: ["학술 튜터", "언어 교육", "기술 코칭", "음악 교사"] }, technical: { title: "테크니컬", desc: "기술직, 수리, 엔지니어링", industries: ["배관", "전기", "자동차", "리노베이션"] } },
    contract: { title: "표준 서비스 계약", scrollingNotice: "약관에 동의하려면 끝까지 스क्रोल해 주세요.", agree: "ConciergeAI 마스터 계약을 읽었으며 이에 동의합니다.", clauses: { platform_fee: { title: "1. 플랫폼 서비스 수수료", body: "ConciergeAI는 예약 성공 시 9%의 수수료를 부과합니다." }, payments: { title: "2. 에스크로 및 지급", body: "고객 결제는 안전한 에스크로에 보관됩니다. 고객이 작업 완료를 확인한 후 48시간 후에 지급이 활성화됩니다." }, conduct: { title: "3. 전문성 표준", body: "전문가는 최소 4.0점의 평점을 유지해야 합니다. 영국 안전 기준을 충족하지 못할 경우 즉시 계정이 정지될 수 있습니다." } } },
    buttons: { start: "시작하기", next: "다음 단계", back: "이전 단계", submit: "온보딩 완료" }
  }
};
