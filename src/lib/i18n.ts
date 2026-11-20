import type {Language} from '../types/islamic';

export interface TranslationBundle {
  appName: string;
  tagline: string;
  navHome: string;
  navQuran: string;
  navPrayer: string;
  navTasbih: string;
  navMore: string;
  greetingSalam: string;
  nextPrayer: string;
  timeRemaining: string;
  sunrise: string;
  sunset: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  dailyVerse: string;
  dailyHadith: string;
  dailyDua: string;
  quickAccess: string;
  quranTitle: string;
  surahsTab: string;
  juzTab: string;
  bookmarksTab: string;
  searchSurah: string;
  tasbihTitle: string;
  tapToCount: string;
  reset: string;
  target: string;
  lifetimeCount: string;
  todayCount: string;
  duasTitle: string;
  hadithTitle: string;
  calendarTitle: string;
  qiblaTitle: string;
  knowledgeTitle: string;
  ramadanTitle: string;
  zakatTitle: string;
  namesTitle: string;
  mediaTitle: string;
  notificationsTitle: string;
  profileTitle: string;
  androidDriveTitle: string;
  moonSightingNote: string;
  installApp: string;
  offlineReady: string;
}

export const TRANSLATIONS: Record<Language, TranslationBundle> = {
  en: {
    appName: 'SK NUR',
    tagline: 'Your Complete Islamic Companion',
    navHome: 'Home',
    navQuran: 'Quran',
    navPrayer: 'Prayer',
    navTasbih: 'Tasbih',
    navMore: 'More',
    greetingSalam: 'Assalamu Alaikum',
    nextPrayer: 'Next Prayer',
    timeRemaining: 'Remaining',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    fajr: 'Fajr',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    dailyVerse: 'Daily Quran Verse',
    dailyHadith: 'Daily Hadith',
    dailyDua: 'Daily Dua',
    quickAccess: 'Explore Features',
    quranTitle: 'Holy Quran',
    surahsTab: '114 Surahs',
    juzTab: '30 Paras / Juz',
    bookmarksTab: 'Bookmarks',
    searchSurah: 'Search Surah name or number...',
    tasbihTitle: 'Digital Tasbih',
    tapToCount: 'Tap to Count',
    reset: 'Reset',
    target: 'Target',
    lifetimeCount: 'Lifetime Total',
    todayCount: 'Today',
    duasTitle: 'Daily Duas',
    hadithTitle: 'Hadith Collection',
    calendarTitle: 'Islamic Calendar',
    qiblaTitle: 'Qibla Compass',
    knowledgeTitle: 'Islamic Knowledge',
    ramadanTitle: 'Ramadan Special',
    zakatTitle: 'Zakat Calculator',
    namesTitle: 'Islamic Names',
    mediaTitle: 'Audio & Recitation',
    notificationsTitle: 'Islamic Reminders',
    profileTitle: 'Profile & Settings',
    androidDriveTitle: 'Android APK & Google Drive',
    moonSightingNote: 'Note: Exact Islamic dates depend on local crescent moon sighting.',
    installApp: 'Install App',
    offlineReady: 'Offline Ready',
  },
  bn: {
    appName: 'SK NUR',
    tagline: 'আপনার পূর্ণাঙ্গ ইসলামিক জীবনসঙ্গী',
    navHome: 'হোম',
    navQuran: 'কোরআন',
    navPrayer: 'নামাজ',
    navTasbih: 'তসবি',
    navMore: 'আরও',
    greetingSalam: 'আসসালামু আলাইকুম',
    nextPrayer: 'পরবর্তী নামাজ',
    timeRemaining: 'বাকি সময়',
    sunrise: 'সূর্যোদয়',
    sunset: 'সূর্যাস্ত',
    fajr: 'ফজর',
    dhuhr: 'যোহর',
    asr: 'আসর',
    maghrib: 'মাগরিব',
    isha: 'ইশা',
    dailyVerse: 'আজকের কোরআন আয়াত',
    dailyHadith: 'আজকের হাদিস',
    dailyDua: 'আজকের দোয়া',
    quickAccess: 'সব ইসলামিক ফিচার',
    quranTitle: 'পবিত্র কোরআন',
    surahsTab: '১১৪টি সূরা',
    juzTab: '৩০ পারা / জুয',
    bookmarksTab: 'বুকমার্ক',
    searchSurah: 'সূরার নাম বা নম্বর খুঁজুন...',
    tasbihTitle: 'ডিজিটাল তসবি',
    tapToCount: 'গণনা করতে ট্যাপ করুন',
    reset: 'রিসেট',
    target: 'লক্ষ্য',
    lifetimeCount: 'সর্বমোট গণনা',
    todayCount: 'আজকের গণনা',
    duasTitle: 'দৈনন্দিন দোয়া',
    hadithTitle: 'হাদিস শরীফ',
    calendarTitle: 'ইসলামিক ক্যালেন্ডার',
    qiblaTitle: 'কিবলা কম্পাস',
    knowledgeTitle: 'ইসলামিক জ্ঞান',
    ramadanTitle: 'রমজান স্পেশাল',
    zakatTitle: 'যাকাত ক্যালকুলেটর',
    namesTitle: 'ইসলামিক নাম',
    mediaTitle: 'অডিও ও তেলাওয়াত',
    notificationsTitle: 'ইসলামিক রিমাইন্ডার',
    profileTitle: 'প্রোফাইল ও সেটিংস',
    androidDriveTitle: 'Android APK ও Google Drive',
    moonSightingNote: 'দ্রষ্টব্য: কিছু ইসলামিক তারিখ স্থানীয় চাঁদ দেখার ওপর নির্ভরশীল।',
    installApp: 'অ্যাপ ইনস্টল করুন',
    offlineReady: 'অফলাইন প্রস্তুত',
  },
  ar: {
    appName: 'SK NUR',
    tagline: 'رفيقك الإسلامي المتكامل',
    navHome: 'الرئيسية',
    navQuran: 'القرآن',
    navPrayer: 'الصلاة',
    navTasbih: 'التسبيح',
    navMore: 'المزيد',
    greetingSalam: 'السلام عليكم',
    nextPrayer: 'الصلاة القادمة',
    timeRemaining: 'الوقت المتبقي',
    sunrise: 'الشروق',
    sunset: 'الغروب',
    fajr: 'الفجر',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
    dailyVerse: 'آية اليوم',
    dailyHadith: 'حديث اليوم',
    dailyDua: 'دعاء اليوم',
    quickAccess: 'استكشف المميزات',
    quranTitle: 'القرآن الكريم',
    surahsTab: '١١٤ سورة',
    juzTab: '٣٠ جزءاً',
    bookmarksTab: 'المفضلة',
    searchSurah: 'ابحث عن السورة أو رقمها...',
    tasbihTitle: 'المسبحة الرقمية',
    tapToCount: 'اضغط للتسبيح',
    reset: 'إعادة ضبط',
    target: 'الهدف',
    lifetimeCount: 'المجموع الكلي',
    todayCount: 'اليوم',
    duasTitle: 'الأدعية اليومية',
    hadithTitle: 'موسوعة الحديث',
    calendarTitle: 'التقويم الهجري',
    qiblaTitle: 'بوصلة القبلة',
    knowledgeTitle: 'المعرفة الإسلامية',
    ramadanTitle: 'ركن رمضان',
    zakatTitle: 'حاسبة الزكاة',
    namesTitle: 'الأسماء الإسلامية',
    mediaTitle: 'الصوتيات والتلاوات',
    notificationsTitle: 'التنبيهات الإسلامية',
    profileTitle: 'الملف الشخصي والإعدادات',
    androidDriveTitle: 'ملف الأندرويد و Google Drive',
    moonSightingNote: 'ملاحظة: تعتمد بعض التواريخ الهجرية على رؤية الهلال محلياً.',
    installApp: 'تثبيت التطبيق',
    offlineReady: 'جاهز دون اتصال',
  },
};
