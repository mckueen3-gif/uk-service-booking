import { Dictionary } from '../dictionary';

export const ro: Dictionary = {
  nav: { 
    browse: "Răsfoiește servicii", join: "Alătură-te ca expert", login: "Autentificare", logout: "Deconectare", 
    dashboard: "Panoul meu", aiDiagnosis: "Diagnostic AI", education: "Educație" 
  },
  common: { viewProfile: "Vezi profil", reviews: "recenzii", hr: "oră", copy: "Copiază", copied: "Copiat!" },
  hero: { title: "Găsește cei mai buni furnizori de servicii", subtitle: "Conectează-te cu profesioniști certificați din zona ta.", searchPlaceholder: "De ce serviciu ai nevoie?", badge: "Piața de servicii nr. 1 din Marea Britanie" },
  faq: {
    title: "Întrebări frecvente",
    subtitle: "Tot ce trebuie să știi despre platforma de rezervare a serviciilor din Marea Britanie.",
    categories: { payments: "Plăți", disputes: "Dispute", bookings: "Rezervări" },
    aura: { title: "Asistent Aura AI", subtitle: "Ai nevoie de ajutor instant? Chat cu Aura pentru sfaturi personalizate.", cta: "Chat cu Aura" },
    questions: {
      payments: [
        { q: "Cum plătesc pentru servicii?", a: "Plățile sunt gestionate în siguranță prin Stripe. Reținem fondurile în escrow până când confirmarea lucrării este completă." },
        { q: "Există taxe ascunse?", a: "Nu. Plătești prețul cotat. Percepem o mică taxă de platformă deja inclusă în estimare." }
      ],
      disputes: [
        { q: "Ce se întâmplă dacă lucrarea este nesatisfăcătoare?", a: "Arbitrul nostru AI revizuiește fotografiile lucrării în raport cu domeniul inițial pentru a asigura o rezoluție corectă." },
        { q: "Cum solicit o rambursare?", a: "Poți deschide o dispută prin intermediul panoului tău de control dacă specialistul nu respectă termenii conveniți." }
      ],
      bookings: [
        { q: "Pot anula o rezervare?", a: "Da, poți anula cu până la 24 de ore înainte de ora programată pentru o rambursare completă." },
        { q: "Cum îmi contactez specialistul?", a: "Odată ce o rezervare este confirmată, vei avea acces la un canal de chat securizat direct." }
      ]
    }
  },
  footer: { tagline: "Conectează-te cu cei mai buni profesioniști certificați din Marea Britanie.", explore: "Explorează", legal: "Legal", support: "Suport", rights: "© 2024 UK Service Hub. Toate drepturile rezervate.", terms: "Termeni de serviciu", privacy: "Politica de confidențialitate", cookies: "Politica de cookie-uri", help: "Centru de ajutor", contact: "Contactează suportul", aiDiagnosis: "Diagnostic AI", homeCleaning: "Curățenie acasă", plumbingServices: "Servicii instalații", automotiveServices: "Servicii auto" },
  search: { 
    filters: "Filtre", keyword: "Cuvânt cheie", location: "Locație", category: "Categorie", minRating: "Rating minim", verifiedOnly: "Doar verificați", 
    apply: "Aplică filtre", sortBy: "Sortează după", sortRating: "Rating", sortJobs: "Lucrări finalizate", sortDistance: "Distanță", sortPrice: "Preț", 
    foundCount: "S-au găsit {{count}} specialiști", searching: "Se caută profesioniști...", noResults: "Niciun specialist găsit", 
    noResultsHint: "Încearcă să ajustezi filtrele sau să cauți în altă zonă.", clearFilters: "Șterge tot", 
    basePrice: "Preț estimat de pornire", viewDetails: "Vezi detalii", listView: "Listă", mapView: "Hartă", searchThisArea: "Caută în această zonă",
    verified: "Verificat", insured: "Asigurat", priceAudit: "Audit preț AI: Corect", defaultDesc: "Furnizor de servicii profesionale"
  },
  booking: {
    steps: { details: "Detalii lucrare", schedule: "Programare", confirmation: "Recenzie și Plată" },
    titles: { details: "Spune-ne despre lucrare", schedule: "Alege o oră potrivită", confirm: "Confirmă rezervarea", success: "Rezervare confirmată!" },
    labels: { date: "Data", time: "Ora", make: "Marcă", model: "Model", address: "Adresa proprietății", notes: "Instrucțiuni suplimentare", agree: "Sunt de acord cu termenii și taxa de platformă de 2%", summary: "Rezumat plată", paid: "Plătit", merchant: "Specialist", service: "Serviciu" },
    buttons: { next: "Continuă", prev: "Înapoi", pay: "Plătește în siguranță", home: "Înapoi la pagina principală", dashboard: "Mergi la panou" },
    messages: { finalizing: "Finalizăm rezervarea...", wait: "Te rugăm să nu reîmprospătezi pagina", contact24h: "Specialistul tău te va contacta în termen de 24 de ore.", safety: "Toate plățile sunt reținute în escrow pentru siguranța ta.", noReviews: "Nicio recenzie încă", recommended: "Top Recomandat", replyFromMaster: "Răspuns de la specialist" },
  },
  merchant: {
    verified: "Expert verificat", background: "Verificare antecedent", portfolio: "Lucrări anterioare", reviewTitle: "Recenzii clienți", realReviews: "Recenzii reale din rezervări verificate", verifiedBooking: "Rezervare verificată", pricingAnalysis: "Analiză preț AI", bookingChannel: "Canal de rezervare profesional", viewServices: "Vezi toate serviciile", guarantee: "Garanția serviciului", fastResponse: "Răspuns rapid", contactExpert: "Contactează expertul", noReviews: "Nicio recenzie încă", reply: "Răspunde",
    dashboard: {
      title: "Consola specialistului", welcome: "Bine ai revenit,", previewProfile: "Previzualizare profil public", manageServices: "Gestionare servicii",
      stats: { totalBookings: "Rezervări totale", rating: "Rating mediu", pendingBalance: "Decontare în așteptare", availableBalance: "Disponibil pentru plată", totalJobs: "Total joburi", escrowHeld: "Reținut în escrow", availableNow: "Disponibil acum", reviews: "Recenzii" },
      syncStatus: "Status sincronizare",
      lastSynced: "Ultima sincronizare",
      refresh: "Actualizează",
      syncing: "Sincronizarea datelor...",
      syncFailed: "Sincronizarea a eșuat, vă rugăm să reîncercați",
      wallet: {
        syncing: "Sincronizarea datelor portofelului...",
        synced: "Datele portofelului au fost sincronizate",
        generating: "Se finalizează configurarea contului...",
        referralTitle: "Recomandă un prieten, primești 2% cashback",
        referralDesc: "Partajează codul tău unic. Când prietenul tău rezervă primul serviciu, vei câștiga 2% înapoi.",
        historyTitle: "Istoricul tranzacțiilor",
        historyEmpty: "Nu s-au găsit tranzacții",
        type: "Tip",
        description: "Descriere",
        amount: "Sumă",
        date: "Dată",
        referralListTitle: "Recordul meu de recomandări",
        referralListDesc: "Urmărește venitul pasiv de la prietenii pe care i-ai invitat",
        referee: "Utilizator recomandat",
        earned: "Total câștigat",
        expiry: "Expirarea comisionului",
        status: "Status",
        active: "Activ",
        expired: "Expirat",
        joinedAt: "Înregistrat la",
        validUntil: "Valabil până la",
        availableNow: "Disponibil acum"
      },
      bookings: { title: "Programări recente", viewAll: "Vezi toate rezervările", empty: "Nicio rezervare recentă", completed: "Finalizat", actions: { confirm: "Confirmă", complete: "Marchează ca finalizat", variation: "Solicită extra" } },
      status: { pending: "În așteptare", confirmed: "Confirmat", completed: "Finalizat", cancelled: "Anulat" },
      variations: { label: "Solicitare lucrare suplimentară", status: "Status", pending: "Se așteaptă clientul", approved: "Aprobat", rejected: "Respins", arbiterActive: "Arbitrul AI revizuiește" },
      arbiterReasoning: "Analiză arbitru AI",
      tips: { title: "Sfaturi pentru creștere", growth: "Finalizează încă 5 joburi pentru a atinge statutul 'Gold' și a reduce comisionul la 7%." },
      quickLinks: { title: "Link-uri rapide", schedule: "Programul meu", earnings: "Istoric câștiguri", support: "Suport specialist" },
      modal: { title: "Solicitare plată lucrare suplimentară", amount: "Sumă adițională (£)", reason: "Motiv cost variabil", reasonPlaceholder: "ex: S-a găsit o scurgere suplimentară în spatele peretelui", photo: "Dovadă foto", photoHint: "O fotografie a problemei este obligatorie pentru verificarea AI", submit: "Trimite solicitarea", submitting: "Se încarcă dovada..." },
      avatar: { upload: "Încarcă fotografie de profil", hint: "Recomandat: Portret profesional sau logo-ul companiei.", success: "Avatar actualizat!", errorSize: "Imaginea trebuie să fie sub 2MB" },
    },
    portfolio_mgr: {
      title: "Portofoliu de cazuri", subtitle: "Prezintă-ți cele mai bune lucrări pentru a câștiga mai multe rezervări.", addBtn: "Adaugă element portofoliu", emptyTitle: "Niciun caz adăugat încă", emptyDesc: "Adaugă fotografii ale proiectelor tale anterioare pentru a câștiga încrederea noilor clienți.",
      modal: { title: "Adaugă caz portofoliu", itemTitle: "Titlu proiect", itemTitlePlaceholder: "ex: Instalare centrală termică", category: "Categorie", uploadPhoto: "Încarcă fotografie caz", errorSize: "Fotografia trebuie să fie sub 5MB", details: "Detalii proiect", aiBtn: "Generează cu AI", aiGenerating: "AI scrie...", detailsPlaceholder: "Descrie lucrarea efectuată, provocările și rezultatul.", cancel: "Anulează", publish: "Publică cazul" },
      deleteConfirm: "Sigur dorești să ștergi acest caz?", addError: "Nu s-a putut adăuga elementul de portofoliu.", aiError: "Generarea AI a eșuat. Te rugăm să introduci manual."
    },
  },
  education_sec: {
    hero: { badge: "Tutori de elită din UK", title1: "Stăpânește noi abilități", title2: "Cu experți globali", subtitle: "Conectează-te cu tutori de top pentru studii academice, limbi străine și abilități profesionale. Învățare 1-la-1 personalizată pentru succesul tău.", searchPlaceholder: "Ce vrei să înveți?", searchBtn: "Găsește tutori" },
    forYou: { title: "Recomandat pentru tine", match: "Scor potrivire AI", viewProfile: "Vezi profil" },
    categories: { title: "Explorează categorii", browseBtn: "Răsfoiește tot", items: { academic: { title: "Hub Academic", desc: "IELTS, GCSE, A-Levels și altele" }, languages: { title: "Laborator vizual limbi", desc: "Engleză, Chineză, Spaniolă..." }, coding: { title: "Academia de Codare", desc: "Python, Web Dev, AI..." }, music: { title: "Muzică și Artă", desc: "Pian, Design, Arte plastice" } } },
    search: { filters: "Filtre de căutare", mode: "Mod de predare", online: "Online", offline: "În persoană", hybrid: "Hibrid", priceRange: "Tarif orar", level: "Nivel tutor", student: "Student universitar", pro: "Profesor profesionist", expert: "Master/Doctorat", apply: "Aplică filtre", resultsTitle: "Tutori disponibili", foundCount: "{{count}} tutori găsiți", placeholder: "Caută după subiect sau nume" },
    common: { reviews: "Recenzii", hr: "oră", bookTrial: "Rezervă lecție de probă" },
    tutorCard: { demoDesc: "Educator pasionat cu doctorat și peste 10 ani de experiență, ajutând peste 100 de studenți să își atingă obiectivele." },
    tutorProfile: { verified: "Educator verificat", about: "Despre mine", education: "Educație", experience: "Experiență în predare", portfolio: "Povești de succes ale studenților", reviews: "Recenzii studenți", availability: "Program săptămânal", bookNow: "Rezervă o lecție", aiTrial: "Lecție de probă cu evaluare AI", trialChallenge: "Încearcă provocarea AI pentru o reducere la sesiune!", startChallenge: "Începe provocarea", cancel: "Anulează" }
  },
  home: {
    hero: { badge: "Maeștri locali certificați din UK", title1: "Rezervă experți", title2: "locali de top", subtitle: "Acces instantaneu la primii 1% dintre profesioniștii de servicii din UK. Verificați, asigurați și monitorizați de AI pentru calitate garantată.", searchPlaceholder: "Am nevoie de...", locationPlaceholder: "Londra, UK", aiMatch: "Potrivire inteligentă", searchBtn: "Caută experți" },
    recommendation: { title1: "Personalizat", title2: "Pentru tine", subtitle: "Specialiști de top care se potrivesc nevoilor și locației tale recente.", browse: "Vezi toți specialiștii" },
    aiCTA: { badge: "POWERED BY GEMINI AI", title1: "Nu ești sigur ce e în neregulă?", title2: "Obține diagnostic AI instant", subtitle: "Încarcă o fotografie a problemei tale. AI-ul nostru identifică problema, estimează costurile și găsește specialistul potrivit în câteva secunde.", button: "Încearcă diagnostic AI gratuit" },
    referralCTA: { badge: "Recompense recomandare", title: "Câștigă 2% venit pasiv", subtitle: "Recomandă un prieten și primește 2% din fiecare rezervare pe care o face în următorii 5 ani (până la 200 lire per prieten).", button: "Începe să câștigi comision", referralLabel: "Codul tău personal de recomandare:" },
    educationCTA: "Vizitează panoul de educație",
    eliteLocal: "Elită Locală",
    eliteBadge: "Elite Pro",
    defaultCategory: "Expert servicii",
    noResults: "Niciun specialist găsit în această categorie.",
    categories: { plumbing: "Instalații", repairs: "Reparații", renovation: "Renovări", education: "Educație", accounting: "Contabilitate", legal: "Legal", commercial: "Comercial", cleaning: "Curățenie", car: "Auto" },
    sections: {
      plumbing: { title: "Instalații și Electricitate", desc: "De la scurgeri de urgență la recablare completă, te conectăm cu maeștri certificați din UK.", items: ["Reparații țevi", "Recablare", "Instalare aparate", "Service centrală", "Întrerupătoare", "Smart Home"] },
      repairs: { title: "Handyman acasă", desc: "Asamblare mobilier, reparare pereți, înlocuire uși - toate sarcinile casnice enervante rezolvate.", items: ["Asamblare mobilier", "Uși/Ferestre", "Reparare pereți", "Rafturi", "Vopsire", "Sarcini diverse"] },
      accounting: { title: "Contabilitate și Taxe", desc: "Creat special pentru rezidenții britanici din străinătate și IMM-uri. Depuneri conforme pentru afacerea ta.", items: ["Impozit pe venit", "Conturi anuale", "Depunere TVA", "Salarizare", "Consultanță Xero", "Analiză fiscală"] },
      renovation: { title: "Renovări case", desc: "De la extinderi de bucătărie la renovări complete. Progres transparent și garanția calității.", items: ["Bucătărie/Baie", "Extinderi", "Design interior", "Vopsire", "Podele", "Peisagistică"] },
      education: { title: "Educație și Învățare", desc: "Tutori 1-la-1 și formare profesională. Progres personalizat la îndemâna ta.", items: ["Tutori de limbi", "IELTS/TOEFL", "Codare", "Muzică și Artă", "Abilități de afaceri", "Ajutor academic"] },
      cleaning: { title: "Curățenie profesională", desc: "Curățenie profundă la finalul închirierii sau curățenie regulată cu atenție la detalii.", items: ["Curățenie regulată", "Final de închiriere", "Curățare covoare", "Spălare ferestre", "Curățenie birouri", "Dezinfectare"] },
      legal: { title: "Consultanță juridică", desc: "Conformitate, vize și documentație juridică. Contactează experți pentru a-ți proteja drepturile.", items: ["Redactare contracte", "Sfaturi vize", "Drept imobiliar", "Rezoluție dispute", "Drept comercial", "Notar"] },
      commercial: { title: "Servicii comerciale", desc: "Construit pentru spații de afaceri. Amenajare magazine, mutări birouri și întreținere electrică.", items: ["Amenajare magazine", "Relocare birouri", "Electricitate comercială", "Siguranță la incendiu", "Rețele IT", "HVAC"] }
    },
    popularTitle: "Popular", popularIn: "în", allUK: "Tot UK-ul",
    noProjects: { title: "Niciun proiect găsit în această categorie", desc: "Recrutăm activ experți de top în zona ta." },
    reviews: { excellent: "Excelent", basedOn: "pe baza a", verified: "Verificat", countLabel: "recenzii" }
  },
  location: { selectCity: "Selectează orașul", detecting: "Detectăm...", switch: "Schimbă", nearby: "Servicii din apropiere" },
  diagnosis: {
    badge: "DRIVEN BY GEMINI AI",
    title1: "Reparație expertă",
    title2: "În câteva secunde",
    subtitle: "Nu mai ghici. AI-ul nostru îți analizează fotografiile pentru a oferi perspective instantanee, sfere de reparații și estimări corecte de preț înainte de a rezerva.",
    features: {
      instant: { title: "Perspective instant", desc: "Nu mai aștepta apeluri. Obține o analiză tehnică imediat după încărcare." },
      pricing: { title: "Prețuri corecte de piață", desc: "Folosim date reale de servicii din UK pentru a oferi intervale de preț precise pentru zona ta." },
      verified: { title: "Pre-rezervare certificată", desc: "După diagnostic, conectează-te direct cu primii 1% dintre experții specializați în problema ta." }
    },
    cta: "Răsfoiește toate serviciile",
    tool: {
      title: "Diagnostic AI instant",
      subtitle: "Încarcă o fotografie și lasă AI-ul nostru să estimeze costul și sfera reparației.",
      step1: "1. Încarcă dovada foto",
      step2: "2. Selectează categoria",
      step3: "3. Descrie problema (opțional)",
      uploadHint: "Fă sau încarcă o fotografie",
      replaceHint: "Click pentru a schimba fotografia",
      submit: "Generează diagnostic AI gratuit",
      loading: "Generăm perspective AI...",
      disclaimer: "Estimările AI sunt doar orientative. Cotațiile oficiale sunt oferite de profesioniști.",
      newDiagnosis: "Diagnostic nou",
      categories: { plumbing: "Instalații", auto: "Automotive", renovation: "Renovări", electrical: "Electrice", cleaning: "Curățenie profesională" },
      resultTitle: "Rezultate diagnostic AI",
      detectedIssue: "Problemă detectată",
      recommendedSolution: "Soluție recomandată",
      estimatedCostLabel: "Interval preț estimat",
      ukStandard: "Prețuri standard UK",
      includesLabor: "Include piese și manoperă",
      bookSpecialist: "Rezervă acest specialist",
      confidence: "Încredere",
      analyzedPhoto: "Fotografia analizată",
      guaranteedRepairs: "Reparații garantate",
      disputeResolution: "Suport rezoluție dispute",
      fastTurnaround: "Finalizare rapidă",
      responseHours: "Specialiștii în {category} răspund de obicei în 2 ore.",
      errorPhotoCategory: "Te rugăm să încarci o fotografie și să selectezi o categorie.",
      errorUnexpected: "A apărut o eroare neașteptată. Te rugăm să încerci din nou.",
      uploadFormatHint: "Suportă JPG, PNG",
      descriptionPlaceholder: "Spune-ne mai multe despre ce s-a întâmplat...",
      strictMode: "Mod Vedere Strict",
      strictModeHint: "Raționament vizual de înaltă fidelitate (analiză profundă)"
    }
  },
  onboarding: {
    hero: { title: "Crește-ți afacerea cu ServiceHub", subtitle: "Alătură-te celei mai de elită rețele de profesioniști certificați din Marea Britanie." },
    steps: { profile: "Profil de afaceri", credentials: "Acreditări UK", contract: "Acord de servicii" },
    sectors: { title: "Alege sectorul tău", professional: { title: "Profesional", desc: "Contabilitate, Legal, Consultanță", industries: ["Contabilitate", "Consultanță fiscală", "Servicii juridice", "Strategie de afaceri"] }, education: { title: "Educație", desc: "Tutori, Traineri, Coachi", industries: ["Tutori academici", "Formare lingvistică", "Skill Coaching", "Profesori de muzică"] }, technical: { title: "Tehnic", desc: "Meserii, Reparații, Inginerie", industries: ["Instalații", "Electricitate", "Automotive", "Renovări"] } },
    contract: { title: "Acord de servicii standard", scrollingNotice: "Te rugăm să derulezi până jos pentru a accepta termenii.", agree: "Am citit și sunt de acord cu Acordul Master ServiceHub.", clauses: { platform_fee: { title: "1. Taxa de serviciu a platformei", body: "ServiceHub percepe un comision de 8% pentru rezervările finalizate cu succes." }, payments: { title: "2. Escrow și Plăți", body: "Plățile clienților sunt păstrate în escrow securizat. Plățile sunt declanșate la 48 de ore după ce clientul confirmă finalizarea lucrării." }, conduct: { title: "3. Standarde profesionale", body: "Specialiștii trebuie să mențină un rating minim de 4.0 stele. Nerespectarea standardelor de siguranță din UK poate duce la suspendarea imediată a contului." } } },
    buttons: { start: "Începe acum", next: "Pasul următor", back: "Pasul anterior", submit: "Finalizează înregistrarea" }
  }
};
