import { Dictionary } from '../dictionary';

export const pl: Dictionary = {
  nav: { 
    browse: "Przeglądaj usługi", join: "Dołącz jako ekspert", login: "Zaloguj się", logout: "Wyloguj się", 
    dashboard: "Mój panel", aiDiagnosis: "Diagnoza AI", education: "Edukacja" 
  },
  common: { viewProfile: "Zobacz profil", reviews: "opinii", hr: "godz", copy: "Kopiuj", copied: "Skopiowano!" },
  hero: { title: "Znajdź najlepszych dostawców usług", subtitle: "Połącz się z certyfikowanymi profesjonalistami w Twojej okolicy.", searchPlaceholder: "Jakiej usługi potrzebujesz?", badge: "Rynek usług nr 1 w Wielkiej Brytanii" },
  faq: {
    title: "Często zadawane pytania",
    subtitle: "Wszystko, co musisz wiedzieć o brytyjskiej platformie rezerwacji usług.",
    categories: { payments: "Płatności", disputes: "Spory", bookings: "Rezerwacje" },
    aura: { title: "Asystent Aura AI", subtitle: "Potrzebujesz natychmiastowej pomocy? Porozmawiaj z Aurą, aby uzyskać spersonalizowaną poradę.", cta: "Rozmawiaj z Aurą" },
    questions: {
      payments: [
        { q: "Jak płacić za usługi?", a: "Płatności są obsługiwane bezpiecznie przez Stripe. Środki przechowujemy w depozycie (escrow) do czasu potwierdzenia wykonania zadania." },
        { q: "Czy są jakieś ukryte opłaty?", a: "Nie. Płacisz cenę podaną w ofercie. Pobieramy niewielką opłatę platformową, która jest już wliczona w szacunek." }
      ],
      disputes: [
        { q: "Co jeśli praca jest niesatysfakcjonująca?", a: "Nasz arbiter AI przegląda zdjęcia prac w odniesieniu do początkowego zakresu, aby zapewnić sprawiedliwe rozwiązanie." },
        { q: "Jak poprosić o zwrot pieniędzy?", a: "Możesz otworzyć spór za pośrednictwem panelu, jeśli wykonawca nie dotrzyma uzgodnionych warunków." }
      ],
      bookings: [
        { q: "Czy mogę anulować rezerwację?", a: "Tak, możesz anulować do 24 godzin przed zaplanowanym czasem, aby otrzymać pełny zwrot pieniędzy." },
        { q: "Jak skontaktować się z moim specjalistą?", a: "Po potwierdzeniu rezerwacji będziesz mieć dostęp do bezpośredniego, bezpiecznego kanału czatu." }
      ]
    }
  },
  footer: { tagline: "Połącz się z najlepszymi certyfikowanymi profesjonalistami w Wielkiej Brytanii.", explore: "Eksploruj", legal: "Prawo", support: "Wsparcie", rights: "© 2024 UK Service Hub. Wszelkie prawa zastrzeżone.", terms: "Warunki korzystania", privacy: "Polityka prywatności", cookies: "Polityka plików cookie", help: "Centrum pomocy", contact: "Kontakt ze wsparciem", aiDiagnosis: "Diagnostyka AI", homeCleaning: "Sprzątanie domu", plumbingServices: "Usługi hydrauliczne", automotiveServices: "Usługi motoryzacyjne" },
  search: { 
    filters: "Filtry", keyword: "Słowo kluczowe", location: "Lokalizacja", category: "Kategoria", minRating: "Min. ocena", verifiedOnly: "Tylko zweryfikowani", 
    apply: "Zastosuj filtry", sortBy: "Sortuj według", sortRating: "Ocena", sortJobs: "Wykonane zadania", sortDistance: "Odległość", sortPrice: "Cena", 
    foundCount: "Znaleziono {{count}} specjalistów", searching: "Szukanie profesjonalistów...", noResults: "Brak pasujących specjalistów", 
    noResultsHint: "Spróbuj dostosować filtry lub wyszukać w innym obszarze.", clearFilters: "Wyczyść wszystko", 
    basePrice: "Szacowana cena startowa", viewDetails: "Zobacz szczegóły", listView: "Lista", mapView: "Mapa", searchThisArea: "Szukaj w tym obszarze",
    verified: "Zweryfikowany", insured: "Ubezpieczony", priceAudit: "Audyt ceny AI: Uczciwa", defaultDesc: "Profesjonalny dostawca usług"
  },
  booking: {
    steps: { details: "Szczegóły", schedule: "Harmonogram", confirmation: "Przegląd i płatność" },
    titles: { details: "Opowiedz nam o zadaniu", schedule: "Wybierz dogodny czas", confirm: "Potwierdź rezerwację", success: "Rezerwacja potwierdzona!" },
    labels: { date: "Data", time: "Godzina", make: "Marka", model: "Model", address: "Adres nieruchomości", notes: "Dodatkowe instrukcje", agree: "Zgadzam się na warunki i 2% opłaty platformowej", summary: "Podsumowanie płatności", paid: "Zapłacono", merchant: "Specjalista", service: "Usługa" },
    buttons: { next: "Kontynuuj", prev: "Wróć", pay: "Zapłać bezpiecznie", home: "Wróć do strony głównej", dashboard: "Przejdź do panelu" },
    messages: { finalizing: "Finalizowanie rezerwacji...", wait: "Proszę nie odświeżać strony", contact24h: "Twój specjalista skontaktuje się z Tobą w ciągu 24 godzin.", safety: "Wszystkie płatności są przechowywane w depozycie dla Twojego bezpieczeństwa.", noReviews: "Brak opinii", recommended: "Najczęściej polecane", replyFromMaster: "Odpowiedź od specjalisty" },
  },
  merchant: {
    verified: "Zweryfikowany ekspert", background: "Sprawdzona przeszłość", portfolio: "Poprzednie prace", reviewTitle: "Opinie klientów", realReviews: "Prawdziwe opinie ze zweryfikowanych rezerwacji", verifiedBooking: "Zweryfikowana rezerwacja", pricingAnalysis: "Analiza cen AI", bookingChannel: "Profesjonalny kanał rezerwacji", viewServices: "Zobacz wszystkie usługi", guarantee: "Gwarancja serwisu", fastResponse: "Szybka reakcja", contactExpert: "Skontaktuj się z ekspertem", noReviews: "Brak opinii", reply: "Odpowiedz",
    dashboard: {
      title: "Konsola wykonawcy", welcome: "Witaj ponownie,", previewProfile: "Podgląd profilu publicznego", manageServices: "Zarządzaj usługami",
      stats: { totalBookings: "Wszystkie rezerwacje", rating: "Średnia ocena", pendingBalance: "Oczekiwanie na rozliczenie", availableBalance: "Dostępne do wypłaty", totalJobs: "Suma zadań", escrowHeld: "Przechowywane w depozycie", availableNow: "Dostępne teraz", reviews: "Opinie" },
      syncStatus: "Status synchronizacji",
      lastSynced: "Ostatnia synchronizacja",
      refresh: "Odśwież",
      syncing: "Synchronizowanie danych...",
      syncFailed: "Synchronizacja nie powiodła się, spróbuj ponownie",
      wallet: {
        syncing: "Synchronizowanie danych portfela...",
        synced: "Dane portfela zsynchronizowane",
        generating: "Kończenie konfiguracji konta...",
        referralTitle: "Poleć znajomego, otrzymaj 2% cashbacku",
        referralDesc: "Udostępnij swój unikalny kod. Gdy Twój znajomy zarezerwuje pierwszą usługę, otrzymasz 2% zwrotu.",
        historyTitle: "Historia transakcji",
        historyEmpty: "Nie znaleziono transakcji",
        type: "Typ",
        description: "Opis",
        amount: "Kwota",
        date: "Data",
        referralListTitle: "Moje rekordy poleceń",
        referralListDesc: "Śledź swój dochód pasywny od znajomych, których zaprosiłeś",
        referee: "Polecony użytkownik",
        earned: "Łącznie zarobione",
        expiry: "Wygasanie prowizji",
        status: "Status",
        active: "Aktywny",
        expired: "Wygasł",
        joinedAt: "Dołączył w",
        validUntil: "Ważne do",
        availableNow: "Dostępne teraz"
      },
      bookings: { title: "Ostatnie spotkania", viewAll: "Zobacz wszystkie rezerwacje", empty: "Brak ostatnich rezerwacji", completed: "Zakończone", actions: { confirm: "Potwierdź", complete: "Oznacz jako zakończone", variation: "Poproś o dodatek" } },
      status: { pending: "Oczekujące", confirmed: "Potwierdzone", completed: "Zakończone", cancelled: "Anulowane" },
      variations: { label: "Prośba o dodatkową pracę", status: "Status", pending: "Oczekiwanie na klienta", approved: "Zatwierdzone", rejected: "Odrzucone", arbiterActive: "Arbiter AI w trakcie przeglądu" },
      arbiterReasoning: "Analiza arbitra AI",
      tips: { title: "Wskazówki wzrostu", growth: "Wykonaj 5 kolejnych zadań, aby osiągnąć status 'Złoty' i obniżyć prowizję do 7%." },
      quickLinks: { title: "Szybkie linki", schedule: "Mój grafik", earnings: "Historia zarobków", support: "Wsparcie wykonawcy" },
      modal: { title: "Poproś o płatność za dodatkową pracę", amount: "Dodatkowa kwota (£)", reason: "Powód zmiany kosztu", reasonPlaceholder: "np. znaleziono dodatkowy wyciek za ścianą", photo: "Dowód fotograficzny", photoHint: "Zdjęcie problemu jest obowiązkowe do weryfikacji AI", submit: "Wyślij prośbę", submitting: "Przesyłanie dowodu..." },
      avatar: { upload: "Prześlij zdjęcie profilowe", hint: "Zalecane: Profesjonalne zdjęcie twarzy lub logo firmy.", success: "Awatar zaktualizowany!", errorSize: "Zdjęcie musi mieć mniej niż 2 MB" },
    },
    portfolio_mgr: {
      title: "Portfolio projektów", subtitle: "Pokaż swoje najlepsze prace, aby zdobyć więcej rezerwacji.", addBtn: "Dodaj element portfolio", emptyTitle: "Nie dodano jeszcze żadnych projektów", emptyDesc: "Dodaj zdjęcia swoich poprzednich projektów, aby zbudować zaufanie u nowych klientów.",
      modal: { title: "Dodaj projekt do portfolio", itemTitle: "Tytuł projektu", itemTitlePlaceholder: "np. Instalacja kotła Combi", category: "Kategoria", uploadPhoto: "Prześlij zdjęcie projektu", errorSize: "Zdjęcie musi mieć mniej niż 5 MB", details: "Szczegóły projektu", aiBtn: "Generuj z AI", aiGenerating: "AI pisze...", detailsPlaceholder: "Opisz wykonaną pracę, wyzwania i wynik.", cancel: "Anuluj", publish: "Opublikuj projekt" },
      deleteConfirm: "Czy na pewno chcesz usunąć ten projekt?", addError: "Nie udało się dodać elementu portfolio.", aiError: "Generowanie AI nie powiodło się. Wprowadź ręcznie."
    },
  },
  education_sec: {
    hero: { badge: "Brytyjscy elitarni korepetytorzy", title1: "Opanuj nowe umiejętności", title2: "Z globalnymi ekspertami", subtitle: "Połącz się z korepetytorami najwyższej klasy w naukach akademickich, językach i umiejętnościach zawodowych. Dopasowana nauka 1 na 1 zaprojektowana dla Twojego sukcesu.", searchPlaceholder: "Czego chcesz się nauczyć?", searchBtn: "Znajdź korepetytorów" },
    forYou: { title: "Polecane dla Ciebie", match: "Wynik dopasowania AI", viewProfile: "Zobacz profil" },
    categories: { title: "Eksploruj kategorie", browseBtn: "Przeglądaj wszystkie", items: { academic: { title: "Centrum Akademickie", desc: "IELTS, GCSE, A-Levels i inne" }, languages: { title: "Laboratorium Językowe", desc: "Angielski, chiński, hiszpański..." }, coding: { title: "Akademia Kodowania", desc: "Python, Web Dev, AI..." }, music: { title: "Muzyka i Sztuka", desc: "Pianino, Projektowanie, Sztuki Piękne" } } },
    search: { filters: "Filtry wyszukiwania", mode: "Tryb nauki", online: "Online", offline: "Stacjonarnie", hybrid: "Hybrydowo", priceRange: "Stawka godzinowa", level: "Poziom korepetytora", student: "Student", pro: "Nauczyciel profesjonalny", expert: "Mistrz/Doktor", apply: "Zastosuj filtry", resultsTitle: "Dostępni korepetytorzy", foundCount: "Znaleziono {{count}} korepetytorów", placeholder: "Szukaj według przedmiotu lub nazwiska" },
    common: { reviews: "Opinie", hr: "godz", bookTrial: "Zarezerwuj lekcję próbną" },
    tutorCard: { demoDesc: "Pasjonat edukacji z tytułem doktora i ponad 10-letnim doświadczeniem w pomaganiu 100+ studentom w osiąganiu ich celów." },
    tutorProfile: { verified: "Zweryfikowany edukator", about: "O mnie", education: "Edukacja", experience: "Doświadczenie w nauczaniu", portfolio: "Historie sukcesu uczniów", reviews: "Opinie uczniów", availability: "Tygodniowy grafik", bookNow: "Zarezerwuj lekcję", aiTrial: "Lekcja próbna z oceną AI", trialChallenge: "Podejmij wyzwanie przedmiotowe AI, aby otrzymać zniżkę!", startChallenge: "Rozpocznij wyzwanie", cancel: "Anuluj" }
  },
  home: {
    hero: { badge: "Certyfikowani brytyjscy lokalni mistrzowie", title1: "Rezerwuj najwyżej ocenianych", title2: "Lokalnych ekspertów", subtitle: "Natychmiastowy dostęp do najlepszego 1% brytyjskich profesjonalistów. Zweryfikowani, ubezpieczeni i monitorowani przez AI dla gwarantowanej jakości.", searchPlaceholder: "Potrzebuję...", locationPlaceholder: "Londyn, Wielka Brytania", aiMatch: "Inteligentne dopasowanie", searchBtn: "Szukaj ekspertów" },
    recommendation: { title1: "Spersonalizowane", title2: "Dla Ciebie", subtitle: "Najlepsi specjaliści dopasowani do Twoich ostatnich potrzeb i lokalizacji.", browse: "Przeglądaj wszystkich specjalistów" },
    aiCTA: { badge: "NAPĘDZANE PRZEZ GEMINI AI", title1: "Nie wiesz, co jest nie tak?", title2: "Uzyskaj natychmiastową diagnozę", subtitle: "Prześlij zdjęcie problemu. Nasza AI zidentyfikuje problem, oszacuje koszty i znajdzie odpowiedniego specjalistę w kilka sekund.", button: "Wypróbuj darmową diagnozę AI" },
    referralCTA: { badge: "Nagrody za polecenia", title: "Zarabiaj 2% pasywnego dochodu", subtitle: "Poleć znajomego i otrzymuj 2% od każdej jego rezerwacji przez kolejne 5 lat (do 200 funtów na znajomego).", button: "Zacznij zarabiać prowizję", referralLabel: "Twój osobisty kod polecający:" },
    educationCTA: "Odwiedź panel edukacyjny",
    eliteLocal: "Elita lokalna",
    eliteBadge: "Elita Pro",
    defaultCategory: "Ekspert serwisu",
    noResults: "Nie znaleziono specjalistów w tej kategorii.",
    categories: { plumbing: "Hydraulika", repairs: "Naprawy", renovation: "Remonty", education: "Edukacja", accounting: "Księgowość", legal: "Prawo", commercial: "Komercyjne", cleaning: "Sprzątanie", car: "Motoryzacja" },
    sections: {
      plumbing: { title: "Hydraulika i elektryka", desc: "Od awaryjnych wycieków po kompletną wymianę instalacji, łączymy Cię z certyfikowanymi brytyjskimi mistrzami.", items: ["Naprawa rur", "Wymiana instalacji", "Instalacja urządzeń", "Serwis kotła", "Przełączniki", "Inteligentny dom"] },
      repairs: { title: "Złota rączka", desc: "Montaż mebli, łatanie ścian, wymiana drzwi - rozwiązanie wszystkich irytujących zadań domowych.", items: ["Montaż mebli", "Drzwi/Okna", "Łatanie ścian", "Półki", "Malowanie", "Prace podręczne"] },
      accounting: { title: "Księgowość i podatki", desc: "Dostosowane dla brytyjskich rezydentów zagranicznych i MŚP. Zgodne z przepisami rozliczenia dla Twojej firmy.", items: ["Podatek dochodowy", "Rozliczenia roczne", "Deklaracje VAT", "Lista płac", "Konsultacje Xero", "Analiza podatkowa"] },
      renovation: { title: "Remonty domów", desc: "Od rozbudowy kuchni po pełne remonty. Przejrzysty postęp i gwarancja jakości.", items: ["Kuchnia/Łazienka", "Rozbudowa", "Projektowanie wnętrz", "Malowanie", "Podłogi", "Architektura krajobrazu"] },
      education: { title: "Edukacja i nauka", desc: "Korepetytorzy 1 na 1 i szkolenia zawodowe. Dopasowany postęp na wyciągnięcie ręki.", items: ["Korepetytorzy językowi", "IELTS/TOEFL", "Kodowanie", "Muzyka i Sztuka", "Umiejętności biznesowe", "Pomoc akademicka"] },
      cleaning: { title: "Profesjonalne sprzątanie", desc: "Gruntowne sprzątanie po zakończeniu najmu lub regularne sprzątanie domu z dbałością o szczegóły.", items: ["Regularne sprzątanie", "Sprzątanie po najmie", "Czyszczenie dywanów", "Mycie okien", "Sprzątanie biur", "Dezynfekcja"] },
      legal: { title: "Konsultacje prawne", desc: "Zgodność, wizy i dokumentacja prawna. Skontaktuj się z ekspertami, aby chronić swoje prawa.", items: ["Sporządzanie umów", "Porady wizowe", "Prawo nieruchomości", "Rozstrzyganie sporów", "Prawo gospodarcze", "Notariusz"] },
      commercial: { title: "Usługi komercyjne", desc: "Zbudowane dla przestrzeni biznesowych. Wyposażenie sklepów, przeprowadzki biur i konserwacja instalacji elektrycznych.", items: ["Wyposażenie sklepów", "Relokacja biur", "Elektryka komercyjna", "Bezpieczeństwo ppoż.", "Sieci IT", "HVAC"] }
    },
    popularTitle: "Popularne", popularIn: "w", allUK: "Cała WB",
    noProjects: { title: "Nie znaleziono projektów w tej kategorii", desc: "Aktywnie rekrutujemy najlepszych ekspertów w Twojej okolicy." },
    reviews: { excellent: "Doskonale", basedOn: "na podstawie", verified: "Zweryfikowano", countLabel: "opinii" }
  },
  location: { selectCity: "Wybierz miasto", detecting: "Wykrywanie...", switch: "Przełącz", nearby: "Pobliskie usługi" },
  diagnosis: {
    badge: "NAPĘDZANE PRZEZ GEMINI AI",
    title1: "Ekspercka naprawa",
    title2: "W kilka sekund",
    subtitle: "Przestań zgadywać. Nasza AI analizuje Twoje zdjęcia, aby zapewnić natychmiastowy wgląd, zakres napraw i uczciwe brytyjskie szacunki cenowe przed rezerwacją.",
    features: {
      instant: { title: "Natychmiastowy wgląd", desc: "Koniec z czekaniem na telefon zwrotny. Uzyskaj analizę techniczną natychmiast po przesłaniu zdjęcia." },
      pricing: { title: "Uczciwe ceny rynkowe", desc: "Używamy rzeczywistych brytyjskich danych o usługach, aby zapewnić dokładne zakresy cenowe dla Twojej okolicy." },
      verified: { title: "Certyfikowana rezerwacja wstępna", desc: "Po diagnozie połącz się bezpośrednio z najlepszym 1% ekspertów specjalizujących się w Twoim problemie." }
    },
    cta: "Przeglądaj wszystkie usługi",
    tool: {
      title: "Natychmiastowa diagnoza AI",
      subtitle: "Prześlij zdjęcie i pozwól naszej AI oszacować koszt i zakres naprawy.",
      step1: "1. Prześlij zdjęcie jako dowód",
      step2: "2. Wybierz kategorię",
      step3: "3. Opisz problem (opcjonalnie)",
      uploadHint: "Zrób lub prześlij zdjęcie",
      replaceHint: "Kliknij, aby zmienić zdjęcie",
      submit: "Generuj darmową diagnozę AI",
      loading: "Generowanie analizy AI...",
      disclaimer: "Szacunki AI służą wyłącznie celom orientacyjnym. Oficjalne wyceny są dostarczane przez profesjonalistów.",
      newDiagnosis: "Nowa diagnoza",
      categories: { plumbing: "Hydraulika", auto: "Motoryzacja", renovation: "Remonty", electrical: "Elektryka", cleaning: "Profesjonalne sprzątanie" },
      resultTitle: "Wyniki diagnozy AI",
      detectedIssue: "Wykryty problem",
      recommendedSolution: "Zalecane rozwiązanie",
      estimatedCostLabel: "Szacowany zakres cenowy",
      ukStandard: "Brytyjski standard cenowy",
      includesLabor: "W tym części i robocizna",
      bookSpecialist: "Zarezerwuj tego specjalistę",
      confidence: "Pewność",
      analyzedPhoto: "Analizowane zdjęcie",
      guaranteedRepairs: "Gwarantowane naprawy",
      disputeResolution: "Wsparcie w rozstrzyganiu sporów",
      fastTurnaround: "Szybka realizacja",
      responseHours: "Specjaliści w kategorii {category} zazwyczaj odpowiadają w ciągu 2 godzin.",
      errorPhotoCategory: "Prześlij zdjęcie i wybierz kategorię.",
      errorUnexpected: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie.",
      uploadFormatHint: "Obsługuje JPG, PNG",
      descriptionPlaceholder: "Powiedz nam więcej o tym, co się stało...",
      strictMode: "Tryb ścisłej wizji",
      strictModeHint: "Wysoka dokładność rozumowania wizualnego (głęboka analiza)"
    }
  },
  onboarding: {
    hero: { title: "Rozwijaj swój biznes z ServiceHub", subtitle: "Dołącz do najbardziej elitarnej sieci certyfikowanych profesjonalistów w Wielkiej Brytanii." },
    steps: { profile: "Profil biznesowy", credentials: "Brytyjskie uprawnienia", contract: "Umowa serwisowa" },
    sectors: { title: "Wybierz swój sektor", professional: { title: "Profesjonalne", desc: "Księgowość, prawo, konsulting", industries: ["Księgowość", "Doradztwo podatkowe", "Usługi prawne", "Strategia biznesowa"] }, education: { title: "Edukacja", desc: "Korepetytorzy, trenerzy, coachowie", industries: ["Korepetytorzy akademiccy", "Szkolenia językowe", "Coachingu umiejętności", "Nauczyciele muzyki"] }, technical: { title: "Techniczne", desc: "Rzemiosło, naprawy, inżynieria", industries: ["Hydraulika", "Elektryka", "Motoryzacja", "Remonty"] } },
    contract: { title: "Standardowa umowa serwisowa", scrollingNotice: "Przewiń na dół, aby zaakceptować warunki.", agree: "Przeczytałem i zgadzam się na Umowę Główną ServiceHub.", clauses: { platform_fee: { title: "1. Opłata serwisowa platformy", body: "ServiceHub pobiera 9% prowizji od pomyślnie zrealizowanych rezerwacji." }, payments: { title: "2. Escrow i wypłaty", body: "Płatności klientów są przechowywane w bezpiecznym depozycie escrow. Wypłaty są inicjowane 48 godzin po potwierdzeniu przez klienta zakończenia zadania." }, conduct: { title: "3. Standardy zawodowe", body: "Eksperci muszą utrzymywać minimalną ocenę 4,0 gwiazdki. Brak spełnienia brytyjskich standardów bezpieczeństwa może skutkować natychmiastowym zawieszeniem konta." } } },
    buttons: { start: "Zacznij teraz", next: "Następny krok", back: "Poprzedni krok", submit: "Zakończ rejestrację" }
  }
};
