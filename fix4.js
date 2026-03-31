const fs = require('fs');
const file = 'src/lib/i18n/dictionary.ts';

const koStr = `  ko: {
    nav: { browse: "서비스 탐색", join: "전문가로 가입", login: "로그인", logout: "로그아웃", dashboard: "대시보드", aiDiagnosis: "AI 진단" },
    hero: { title: "프리미엄 영국 서비스", subtitle: "빠르고 안전하게 예약하세요.", searchPlaceholder: "서비스 검색...", badge: "신뢰할 수 있는 서비스" },
    faq: { 
      title: "스마트 FAQ", subtitle: "결제 및 분쟁 해결", categories: { payments: "결제", disputes: "분쟁", bookings: "예약" },
      aura: { title: "Aura AI 지원", subtitle: "1:1 맞춤형 도움말", cta: "지금 시작하기" },
      questions: {
        payments: [{ q: "신용카드 결제?", a: "네, 모두 지원합니다." }, { q: "환불?", a: "24시간 내 요청하세요." }],
        disputes: [{ q: "전문가가 안 와요", a: "주문에서 신고하세요." }, { q: "추가 비용?", a: "협의 없이 추가 안 됨." }],
        bookings: [{ q: "일정 변경", a: "48시간 전 무료." }]
      }
    },
    footer: { tagline: "영국 최고의 서비스.", explore: "서비스 찾기", legal: "법적 고지", support: "고객 지원", rights: "모든 권리 보유.", terms: "이용 약관", privacy: "개인정보 보호", cookies: "쿠키 정책", help: "도움말 센터", contact: "연락처", aiDiagnosis: "AI 진단", homeCleaning: "홈 클리닝", plumbingServices: "배관 서비스", automotiveServices: "자동차 서비스" },
    search: { filters: "필터", keyword: "키워드", location: "위치", category: "카테고리", minRating: "최소 평점", verifiedOnly: "인증된 전문가만", apply: "적용", sortBy: "정렬", sortRating: "평점순", sortJobs: "작업순", sortDistance: "거리순", sortPrice: "가격순", foundCount: "명의 전문가", searching: "검색 중...", noResults: "결과 없음", clearFilters: "초기화", basePrice: "시작가", viewDetails: "자세히 보기", listView: "리스트 뷰", mapView: "지도 뷰", searchThisArea: "이 지역 검색" },
    booking: {
      steps: { details: "세부 정보", schedule: "일정", confirmation: "확인" },
      titles: { details: "예약 상세", schedule: "일정 선택", confirm: "확인 및 결제", success: "예약 완료!" },
      labels: { date: "날짜 선택", time: "시간 선택", make: "제조사", model: "모델", address: "주소", notes: "메모", agree: "약관 동의", summary: "예약 요약", paid: "결제 완료", merchant: "전문가", service: "서비스" },
      buttons: { next: "다음 단계", prev: "이전 단계", pay: "예약 요청", home: "홈으로", dashboard: "내 예약" },
      messages: { finalizing: "예약 처리 중...", wait: "결제 시스템 동기화 중입니다.", contact24h: "전문가가 24시간 내에 연락합니다.", safety: "플랫폼 안전 보장", noReviews: "아직 리뷰가 없습니다.", recommended: "추천", replyFromMaster: "마스터의 답변" }
    },
    merchant: {
      verified: "인증됨", background: "전문 배경", portfolio: "포트폴리오", reviewTitle: "고객 리뷰", realReviews: "실제 리뷰", verifiedBooking: "완료된 예약", pricingAnalysis: "서비스 하이라이트", bookingChannel: "빠른 예약", viewServices: "서비스 보기", guarantee: "안전 보장", fastResponse: "빠른 응답", contactExpert: "전문가에게 문의", noReviews: "리뷰 없음", reply: "판매자 답변"
    },
    home: {
      hero: { badge: "영국 최고의 서비스 마켓", title1: "전문가와 연결", title2: "몇 초 만에", subtitle: "다양한 서비스를 빠르게 예약하세요.", searchPlaceholder: "어떤 서비스가 필요하신가요?", locationPlaceholder: "지역 (도시, 우편번호)", aiMatch: "AI 추천 매칭", searchBtn: "검색" },
      recommendation: { title1: "스마트 추천", title2: "AI 서비스", subtitle: "내게 딱 맞는 서비스 매칭.", browse: "둘러보기" },
      aiCTA: {
        badge: "NEW: AI 진단",
        title1: "문제가 생겼나요?",
        title2: "해결 비용을 알아보세요.",
        subtitle: "사진을 올리면 AI가 즉시 분석해 비용을 예상해 드립니다.",
        button: "무료로 진단받기"
      },
      categories: { plumbing: "배관", repairs: "수리", renovation: "리모델링", education: "교육", accounting: "회계", legal: "법률", commercial: "상업시설", cleaning: "청소", car: "자동차" },
      sections: {
        plumbing: { title: "배관 및 전기", desc: "인증된 기술자", items: ["배관 수리", "누수", "전기 배선", "기기 설치", "스마트홈", "수도꼭지"] },
        repairs: { title: "집안일 해결사", desc: "생활 속 수리", items: ["가구 조립", "도어 수리", "벽 복원", "조명", "페인트", "기타 수리"] },
        accounting: { title: "회계 및 세무", desc: "개인/기업 세무", items: ["세무 기장", "연말 정산", "VAT 신고", "급여 관리", "컨설팅", "절세"] },
        renovation: { title: "인테리어 및 시공", desc: "영국 품질 보장", items: ["주방/욕실", "확장 공사", "디자인", "페인트", "바닥재", "조경"] },
        education: { title: "교육 및 튜터", desc: "개인 맞춤 학습", items: ["외국어", "수능/IELTS", "코딩", "피아노/미술", "비즈니스", "논문지도"] },
        cleaning: { title: "전문 청소", desc: "깨끗한 환경", items: ["입주 청소", "이사 청소", "카펫", "창틀", "사무실", "방역"] },
        legal: { title: "법률 파트너", desc: "빠르고 정확한 자문", items: ["계약 검토", "비자", "부동산", "소송", "비즈니스", "공증"] },
        commercial: { title: "상업용 서비스", desc: "매장 및 오피스용", items: ["매장 디자인", "에어컨 청소", "전기공사", "보안기기", "네트워크", "유지보수"] }
      },
      popularTitle: "인기 서비스", popularIn: "지역:", allUK: "영국 전역",
      noProjects: { title: "결과가 없습니다.", desc: "지금 최고의 전문가들을 모시고 있습니다." },
      reviews: { excellent: "최고예요", basedOn: "기준:", verified: "인증된 사용후기" }
    },
    location: { selectCity: "도시 선택", detecting: "위치 확인 중...", switch: "변경", nearby: "주변 서비스" },
    diagnosis: {
      badge: "GEMINI AI 제공",
      title1: "정확한 고장 진단",
      title2: "단 몇 초 만에 완료",
      subtitle: "수리 비용이 얼마인지 불확실하신가요? 사진을 올리면 AI가 즉시 분석해 예상 비용을 알려드립니다.",
      features: {
        instant: { title: "즉각적인 분석", desc: "수리 전문가와 실랑이할 필요 없이, 즉각적이고 객관적인 문제 파악이 가능합니다." },
        pricing: { title: "투명한 시장 가격", desc: "영국 내 평균 수리 단가 데이터를 바탕으로 예상 견적을 제시합니다." },
        verified: { title: "검증된 전문가 매칭", desc: "기술 검증을 마친 상위 1% 전문가에게 수리를 요청할 수 있습니다." }
      },
      cta: "전체 서비스 보기",
      tool: {
        title: "AI 고장 진단기",
        subtitle: "사진을 올리고 예상 수리비와 원인을 알아보세요.",
        step1: "1. 사진 업로드",
        step2: "2. 카테고리 설정",
        step3: "3. 문제 설명 (선택)",
        uploadHint: "사진을 업로드하세요.",
        replaceHint: "클릭하면 사진을 변경합니다.",
        submit: "AI 진단 시작",
        loading: "AI가 문제를 분석하고 있습니다...",
        disclaimer: "AI 견적은 참고용입니다. 정확한 금액은 전문가와 상담하세요.",
        newDiagnosis: "새 진단하기",
        categories: { plumbing: "배관 및 난방", auto: "자동차 수리", renovation: "집수리", electrical: "전기 공사", cleaning: "전문 청소" },
        resultTitle: "AI 분석 결과",
        detectedIssue: "확인된 문제",
        recommendedSolution: "추천 해결책",
        estimatedCostLabel: "예상 수리 비용",
        ukStandard: "영국 기준 견적",
        includesLabor: "부품 및 인건비 포함",
        bookSpecialist: "인증 전문가 부르기",
        confidence: "정확도",
        analyzedPhoto: "분석된 사진",
        guaranteedRepairs: "플랫폼 보증 수리",
        disputeResolution: "문제가 발생하면 플랫폼이 분쟁 해결을 지원합니다.",
        fastTurnaround: "빠른 방문 지원",
        responseHours: "{category} 전문가가 2시간 내로 연락드립니다.",
        errorPhotoCategory: "사진과 카테고리를 입력해주세요.",
        errorUnexpected: "오류가 발생했습니다: ",
        uploadFormatHint: "선명한 JPG, PNG (최대 5MB)",
        descriptionPlaceholder: "예: 어제부터 주방 배수관에서 물이 새고 있습니다..."
      }
    },
    onboarding: {
       hero: { title: "ServiceHub와 함께 비즈니스를 성장시키세요", subtitle: "영국 최고의 전문가들이 함께하는 플랫폼에 가입하세요." },
       steps: { profile: "비즈니스 프로필", credentials: "자격 증명", contract: "계약서 확인" },
       sectors: {
         title: "귀하의 전문 분야를 선택하세요",
         professional: { title: "전문 서비스", desc: "복잡한 서류 및 회계 작업을 처리하는 전문가 팀.", industries: ["회계", "법률", "재무 상담"] },
         education: { title: "교육 및 튜터", desc: "고객의 기술 및 언어 실력을 향상시키는 교육자.", industries: ["외국어 강사", "시험 대비", "기술 교육"] },
         technical: { title: "기술 및 유지 보수", desc: "가정이나 차량 등의 필수 서비스를 제공하는 기술자.", industries: ["배관", "전기", "자동차 수리", "인테리어"] }
       },
       contract: {
         title: "전문 서비스 계약",
         scrollingNotice: "계약 조건에 동의하시려면 스크롤을 맨 아래로 내려 확인해 주십시오.",
         agree: "본 전문 서비스 계약에 동의하며 그 의미를 숙지하였음을 확인합니다.",
         clauses: {
           commission: { title: "1. 플랫폼 서비스 수수료 및 프로모션 혜택", body: "ServiceHub는 성공적인 예약 건에 한하여 8%의 수수료를 부과합니다. 초기 비즈니스 성장을 돕기 위해 귀하의 첫 5건 수주는 100% 수수료 면제 혜택이 적용됩니다." },
           service: { title: "2. 서비스 우수성 기준 및 규정 준수", body: "당사의 파트너는 최소 4.2의 평균 평점을 유지해야 하며 고객 문의에 24시간 이내에 응답해야 합니다. 귀하는 영국 내에서 유효한 필수 라이선스와 보험에 가입되어 있음을 서술합니다." },
           disputes: { title: "3. 플랫폼 분쟁 해결 규정", body: "분쟁 발생 시 플랫폼은 AI 기반의 분쟁 해결 절차를 지원하며 양측이 제공한 작업 기록과 사진 증빙 자료를 바탕으로 가장 합리적인 해결책을 도출합니다." }
         }
       },
       buttons: { start: "시작하기", next: "계속하기", back: "뒤로 가기", submit: "서명하고 가입하기" }
    }
  }`;

const roStr = `  ro: {
    nav: { browse: "Răsfoiește Servicii", join: "Alătură-te ca Expert", login: "Conectare", logout: "Deconectare", dashboard: "Panou Control", aiDiagnosis: "Diagnoza AI" },
    hero: { title: "Piața Premium de Servicii din UK", subtitle: "Găsiți și rezervați experți verificați ușor.", searchPlaceholder: "Ce serviciu căutați?", badge: "Serviciu 100% Garantat" },
    faq: { 
      title: "FAQ Inteligent", subtitle: "Răspunsuri la întrebări frecvente.", categories: { payments: "Plăți", disputes: "Dispute", bookings: "Rezervări" },
      aura: { title: "Aura AI", subtitle: "Asistență 1:1 imediată.", cta: "Începe Chat" },
      questions: {
        payments: [{ q: "Primiți carduri de credit?", a: "Da, toate cardurile." }, { q: "Rambursări?", a: "Peste 24 de ore." }],
        disputes: [{ q: "Expertul nu a apărut?", a: "Raportați în panou." }, { q: "Costuri extra?", a: "Doar dacă acceptați explicit." }],
        bookings: [{ q: "Pot schimba data?", a: "Gratuit cu 48h înainte." }]
      }
    },
    footer: { tagline: "Piața de servicii nr. 1 în UK.", explore: "Explorează", legal: "Conformitate", support: "Suport Client", rights: "Toate drepturile rezervate.", terms: "Termeni", privacy: "Confidențialitate", cookies: "Cookie-uri", help: "Centru de Ajutor", contact: "Contact", aiDiagnosis: "Diagnoza AI", homeCleaning: "Curățenie", plumbingServices: "Instalații", automotiveServices: "Servicii Auto" },
    search: { filters: "Filtre", keyword: "Cuvânt cheie", location: "Locație", category: "Categorie", minRating: "Rating minim", verifiedOnly: "Doar profesioniști verificați", apply: "Aplică Filtre", sortBy: "Sortează după", sortRating: "Rating", sortJobs: "Comenzi", sortDistance: "Distanță", sortPrice: "Preț: mic la mare", foundCount: "experți găsiți", searching: "Căutare...", noResults: "Niciun rezultat", clearFilters: "Șterge filtrele", basePrice: "De la", viewDetails: "Vezi detalii", listView: "Listă", mapView: "Hartă", searchThisArea: "Caută în zonă" },
    booking: {
      steps: { details: "Detalii", schedule: "Programare", confirmation: "Confirmare" },
      titles: { details: "Detalii Rezervare", schedule: "Alege Programul", confirm: "Confirmă & Plătește", success: "Rezervare Finalizată!" },
      labels: { date: "Alege Data", time: "Alege Ora", make: "Marcă", model: "Model", address: "Adresă", notes: "Notițe", agree: "Sunt de acord cu Termenii de utilizare", summary: "Sumar", paid: "Plătit", merchant: "Prestator", service: "Serviciu" },
      buttons: { next: "Următorul pas", prev: "Înapoi", pay: "Plătește Acum", home: "Reveniți", dashboard: "Rezervările mele" },
      messages: { finalizing: "Procesare rezervare...", wait: "Așteptați autentificarea plății.", contact24h: "Veți fi contactat în 24 de ore.", safety: "Plată 100% Securizată", noReviews: "Nicio recenzie.", recommended: "Recomandat", replyFromMaster: "Răspuns Oficial" }
    },
    merchant: {
      verified: "Verificat", background: "Istoric Profesori", portfolio: "Portofoliu", reviewTitle: "Evaluări", realReviews: "Recenzii Reale", verifiedBooking: "Rezervare Verificată", pricingAnalysis: "Puncte forte", bookingChannel: "Canal Rezervare", viewServices: "Vezi prețurile", guarantee: "Garanția Platformei", fastResponse: "Răspuns Rapid", contactExpert: "Contact Expert", noReviews: "Fără recenzii", reply: "Răspuns"
    },
    home: {
      hero: { badge: "UK's Service Platform", title1: "Găsiți Experți", title2: "În Secunde", subtitle: "Zidari, contabili, instalatori aprobați.", searchPlaceholder: "Ce serviciu?", locationPlaceholder: "Oraș/Cod poștal", aiMatch: "Match AI", searchBtn: "Caută" },
      recommendation: { title1: "Recomandări Smart", title2: "Descoperă", subtitle: "Algoritmii găsesc partenerul ideal.", browse: "Află mai mult" },
      aiCTA: {
        badge: "NOU: SUSȚINUT DE AI",
        title1: "Ai nevoie de reparații?",
        title2: "Află un preț estimativ",
        subtitle: "Încarcă o poză și noi te ajutăm imediat cu estimarea daunelor.",
        button: "Testează acum gratuit"
      },
      categories: { plumbing: "Instalații", repairs: "Reparații", renovation: "Renovări", education: "Educație", accounting: "Contabilitate", legal: "Juridic", commercial: "Comercial", cleaning: "Curățenie", car: "Auto" },
      sections: {
        plumbing: { title: "Instalații și Electricitate", desc: "Verificați", items: ["Reparații Țevi", "Cablare", "Instalare", "Servicii Centrală", "Comutatoare", "Smart Home"] },
        repairs: { title: "Meșter Casă", desc: "La domiciuliu", items: ["Montare Mobilier", "Zidărie", "Cablare", "Uși", "Vopsire", "Fixare"] },
        accounting: { title: "Contabilitate", desc: "Certificați", items: ["Cărți Contabile", "Deconturi", "TVA", "Salarizare", "Consultanță", "Taxe"] },
        renovation: { title: "Renovări Case", desc: "Premium", items: ["Bucătării", "Clădiri", "Interioare", "Amenajări", "Podele", "Grădini"] },
        education: { title: "Educație", desc: "Calificați", items: ["Tutori", "Teste", "Limbaje", "Arte", "Școală", "Teme"] },
        cleaning: { title: "Curățenie Generală", desc: "Total", items: ["Locuință", "Chirii", "Covoare", "Geamuri", "Spațiu", "Igiena"] },
        legal: { title: "Asistență Juridică", desc: "Aprobați", items: ["Contracte", "Vize", "Drept penal", "Dispute", "Notari", "Afaceri"] },
        commercial: { title: "Comerciale", desc: "Birouri.", items: ["Mutări", "Clădiri Ofertă", "Siguranță", "Electric", "IT", "AC"] }
      },
      popularTitle: "Cele Mai Căutate Proiecte", popularIn: "în", allUK: "Tot Regatul",
      noProjects: { title: "Nu există momentan oferte", desc: "Stai cu ochii pe aplicația noastră." },
      reviews: { excellent: "Excelent", basedOn: "Bazat pe", verified: "Verificate" }
    },
    location: { selectCity: "Alege oraș", detecting: "Detecție...", switch: "Schimbă", nearby: "Proiecte pe hartă" },
    diagnosis: {
      badge: "ALIMENTAT DE GEMINI AI",
      title1: "Expertiza Reparației",
      title2: "Simplă",
      subtitle: "Nu cheltui bani fără o diagnoză. Analizatorul bazat pe inteligență artificială e soluția sigură.",
      features: {
        instant: { title: "Perspectivă Imediată", desc: "Ai detaliile cerute într-o secundă." },
        pricing: { title: "Prețuri cinstite", desc: "O schemă corectă din baza auto de date din regiunea ta." },
        verified: { title: "Contracte Verificate", desc: "Te conectăm cu experți veritabili." }
      },
      cta: "Explorează tot",
      tool: {
        title: "Reparatorul Dvs Profesional AI",
        subtitle: "Estimați un cost corect printr-un clic.",
        step1: "1. Încarcă Fotografiile",
        step2: "2. Alege Secțiunea",
        step3: "3. Precizează Mentiuni (opțional)",
        uploadHint: "Click pentru poze",
        replaceHint: "Apasă să actualizezi imaginea",
        submit: "Verifică GRATUIT prin AI",
        loading: "Efectuăm investigații...",
        disclaimer: "Factura precisă va putea vizualizată direct alături de antreprenor.",
        newDiagnosis: "Încearcă iarăși un Diagnostic Nou",
        categories: { plumbing: "Baie si conducte", auto: "Probleme Mecanice Auto", renovation: "Arhitectură de apartament", electrical: "Defecțiune cablaj", cleaning: "Depanare Igienică" },
        resultTitle: "Evaluare Finală Modelată",
        detectedIssue: "Scurt Raport privind Cazul Curent",
        recommendedSolution: "Pași spre normalizare",
        estimatedCostLabel: "Indicator Evaluat",
        ukStandard: "Sistem Britanic Reglementat",
        includesLabor: "Asigură cost instrumente + manoperă",
        bookSpecialist: "Caută Personal Pregătit",
        confidence: "Procentaj",
        analyzedPhoto: "Fotografia folosită",
        guaranteedRepairs: "Siguranță Imbatibilă",
        disputeResolution: "Eficiența maximizată și asistență a clienților bazată pe monitorizare continuă asigură soluții neîntrerupte.",
        fastTurnaround: "Într-un timp extrem de limitat veti avea acces",
        responseHours: "Personalul {category} vine în cel mult două ceasuri.",
        errorPhotoCategory: "Asigurați-vă că ați inclus o formă clară foto și că secțiunea vi se asortează.",
        errorUnexpected: "Grevă tehnică! Erori interne: ",
        uploadFormatHint: "Merge rapid cu imagini .PNG, .JPG de dimensiuni max. > 5 MB.",
        descriptionPlaceholder: "Spărtura mi-a provocat necaz de două nopți și miroase..."
      }
    },
    onboarding: {
      hero: { title: "Dezvoltă-ți afacerea cu ServiceHub", subtitle: "Alătură-te celei mai importante piețe din Regatul Unit pentru profesioniști în educație, contabilitate, reparații și multe altele." },
      steps: { profile: "Profil Afacere", credentials: "Certificări", contract: "Revizuire Contract" },
      sectors: {
        title: "Alege domainiul de expertiză",
        professional: { title: "Servicii Profesionale", desc: "Pentru experți certificați care gestionează documentație complexă și consultanță.", industries: ["Contabilitate", "Juridic", "Consultanță Financiară"] },
        education: { title: "Educație și Tutori", desc: "Pentru profesori, instructori de abilități și mentori academici.", industries: ["Tutori Limbi Străine", "Pregătire Examene", "Formare Profesională"] },
        technical: { title: "Tehnic și Întreținere", desc: "Pentru meșteșugari calificați și servicii esențiale pentru casă/mașină.", industries: ["Instalații", "Electricitate", "Reparații Auto", "Renovare"] }
      },
      contract: {
        title: "Acord de Servicii pentru Experți",
        scrollingNotice: "Vă rugăm să derulați până la sfârșitul acordului pentru a confirma acceptarea.",
        agree: "Am citit și sunt de acord cu Acordul de Servicii pentru Experți",
        clauses: {
        commission: { title: "1. Taxă de acces la platformă și stimulente de creștere", body: "ServiceHub aplică o taxă de acces la platformă competitivă de 8% pentru rezervările reușite. Pentru a sprijini creșterea afacerii tale, primele 5 comenzi sunt 100% fără comision. Taxele sunt deduse automat din plata finală." },
        service: { title: "2. Excelență în servicii și conformitate cu reglementările UK", body: "Partenerii trebuie să mențină un rating minim de 4.2 și să răspundă la solicitări în termen de 24 de ore. Certifici că deții toate licențele și asigurările valabile în Regatul Unit relevante pentru profesia ta." },
        disputes: { title: "3. Rezolvarea disputelor prin AI și potrivire inteligentă", body: "Arbitrul nostru AI proprietar oferă o rezoluție instantanee și imparțială. Prin tehnologia AI Smart Matching, ne asigurăm că primești cele mai precise comenzi de rezervare instantanee la nivel local." }
        }
      },
      buttons: { start: "Începe Acum", next: "Continuă", back: "Înapoi", submit: "Semnează și Alătură-te" }
    }
  }`;

const contentLines = fs.readFileSync(file, 'utf8').split(/\\r?\\n/);
let koIdx = -1;
let plIdx = -1;

for (let i = 0; i < contentLines.length; i++) {
  if (contentLines[i] !== undefined && contentLines[i].includes('ko: {') && contentLines[i].trim().startsWith('ko:')) {
    koIdx = i;
  }
  if (contentLines[i] !== undefined && contentLines[i].includes('pl: {') && contentLines[i].trim().startsWith('pl:')) {
    plIdx = i;
  }
}

if (koIdx > -1 && plIdx > -1) {
  const newContentArray = [...contentLines.slice(0, koIdx), koStr + ',', roStr + ',', ...contentLines.slice(plIdx)];
  fs.writeFileSync(file, newContentArray.join('\\n'), 'utf8');
  console.log('Fixed KO and RO dictionary blocks! Build should pass now.');
} else {
  console.log('Could not find ko or pl blocks! koIdx: ' + koIdx + ' plIdx: ' + plIdx);
}
