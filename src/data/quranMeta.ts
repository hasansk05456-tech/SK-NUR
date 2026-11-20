import type {AyahItem, SurahMeta} from '../types/islamic';

interface RawSurah {
  n: number;
  ar: string;
  en: string;
  tr: string;
  bn: string;
  ayahs: number;
  rev: 'Meccan' | 'Medinan';
  juz: number;
}

const RAW_SURAHS: RawSurah[] = [
  {n: 1, ar: 'الفاتحة', en: 'Al-Fatihah', tr: 'The Opener', bn: 'আল-ফাতিহা', ayahs: 7, rev: 'Meccan', juz: 1},
  {n: 2, ar: 'البقرة', en: 'Al-Baqarah', tr: 'The Cow', bn: 'আল-বাকারা', ayahs: 286, rev: 'Medinan', juz: 1},
  {n: 3, ar: 'آل عمران', en: 'Ali Imran', tr: 'Family of Imran', bn: 'আলে ইমরান', ayahs: 200, rev: 'Medinan', juz: 3},
  {n: 4, ar: 'النساء', en: 'An-Nisa', tr: 'The Women', bn: 'আন-নিসা', ayahs: 176, rev: 'Medinan', juz: 4},
  {n: 5, ar: 'المائدة', en: "Al-Ma'idah", tr: 'The Table Spread', bn: 'আল-মায়িদাহ', ayahs: 120, rev: 'Medinan', juz: 6},
  {n: 6, ar: 'الأنعام', en: "Al-An'am", tr: 'The Cattle', bn: 'আল-আনআম', ayahs: 165, rev: 'Meccan', juz: 7},
  {n: 7, ar: 'الأعراف', en: "Al-A'raf", tr: 'The Heights', bn: 'আল-আরাফ', ayahs: 206, rev: 'Meccan', juz: 8},
  {n: 8, ar: 'الأنفال', en: 'Al-Anfal', tr: 'The Spoils of War', bn: 'আল-আনফাল', ayahs: 75, rev: 'Medinan', juz: 9},
  {n: 9, ar: 'التوبة', en: 'At-Tawbah', tr: 'The Repentance', bn: 'আত-তাওবাহ', ayahs: 129, rev: 'Medinan', juz: 10},
  {n: 10, ar: 'يونس', en: 'Yunus', tr: 'Jonah', bn: 'ইউনুস', ayahs: 109, rev: 'Meccan', juz: 11},
  {n: 11, ar: 'هود', en: 'Hud', tr: 'Hud', bn: 'হুদ', ayahs: 123, rev: 'Meccan', juz: 11},
  {n: 12, ar: 'يوسف', en: 'Yusuf', tr: 'Joseph', bn: 'ইউসুফ', ayahs: 111, rev: 'Meccan', juz: 12},
  {n: 13, ar: 'الرعد', en: "Ar-Ra'd", tr: 'The Thunder', bn: 'আর-রাদ', ayahs: 43, rev: 'Medinan', juz: 13},
  {n: 14, ar: 'إبراهيم', en: 'Ibrahim', tr: 'Abraham', bn: 'ইবরাহীম', ayahs: 52, rev: 'Meccan', juz: 13},
  {n: 15, ar: 'الحجر', en: 'Al-Hijr', tr: 'The Rocky Tract', bn: 'আল-হিজর', ayahs: 99, rev: 'Meccan', juz: 14},
  {n: 16, ar: 'النحل', en: 'An-Nahl', tr: 'The Bee', bn: 'আন-নাহল', ayahs: 128, rev: 'Meccan', juz: 14},
  {n: 17, ar: 'الإسراء', en: 'Al-Isra', tr: 'The Night Journey', bn: 'বনী ইসরাঈল', ayahs: 111, rev: 'Meccan', juz: 15},
  {n: 18, ar: 'الكهف', en: 'Al-Kahf', tr: 'The Cave', bn: 'আল-কাহফ', ayahs: 110, rev: 'Meccan', juz: 15},
  {n: 19, ar: 'مريم', en: 'Maryam', tr: 'Mary', bn: 'মারইয়াম', ayahs: 98, rev: 'Meccan', juz: 16},
  {n: 20, ar: 'طه', en: 'Taha', tr: 'Ta-Ha', bn: 'ত্বোয়া-হা', ayahs: 135, rev: 'Meccan', juz: 16},
  {n: 21, ar: 'الأنبياء', en: 'Al-Anbya', tr: 'The Prophets', bn: 'আল-আম্বিয়া', ayahs: 112, rev: 'Meccan', juz: 17},
  {n: 22, ar: 'الحج', en: 'Al-Hajj', tr: 'The Pilgrimage', bn: 'আল-হাজ্জ', ayahs: 78, rev: 'Medinan', juz: 17},
  {n: 23, ar: 'المؤمنون', en: "Al-Mu'minun", tr: 'The Believers', bn: 'আল-মুমিনূন', ayahs: 118, rev: 'Meccan', juz: 18},
  {n: 24, ar: 'النور', en: 'An-Nur', tr: 'The Light', bn: 'আন-নূর', ayahs: 64, rev: 'Medinan', juz: 18},
  {n: 25, ar: 'الفرقان', en: 'Al-Furqan', tr: 'The Criterion', bn: 'আল-ফুরকান', ayahs: 77, rev: 'Meccan', juz: 18},
  {n: 26, ar: 'الشعراء', en: "Ash-Shu'ara", tr: 'The Poets', bn: 'আশ-শুয়ারা', ayahs: 227, rev: 'Meccan', juz: 19},
  {n: 27, ar: 'النمل', en: 'An-Naml', tr: 'The Ant', bn: 'আন-নামল', ayahs: 93, rev: 'Meccan', juz: 19},
  {n: 28, ar: 'القصص', en: 'Al-Qasas', tr: 'The Stories', bn: 'আল-কাসাস', ayahs: 88, rev: 'Meccan', juz: 20},
  {n: 29, ar: 'العنكبوت', en: 'Al-Ankabut', tr: 'The Spider', bn: 'আল-আনকাবুত', ayahs: 69, rev: 'Meccan', juz: 20},
  {n: 30, ar: 'الروم', en: 'Ar-Rum', tr: 'The Romans', bn: 'আর-রূম', ayahs: 60, rev: 'Meccan', juz: 21},
  {n: 31, ar: 'لقمان', en: 'Luqman', tr: 'Luqman', bn: 'লুকমান', ayahs: 34, rev: 'Meccan', juz: 21},
  {n: 32, ar: 'السجدة', en: 'As-Sajdah', tr: 'The Prostration', bn: 'আস-সাজদাহ', ayahs: 30, rev: 'Meccan', juz: 21},
  {n: 33, ar: 'الأحزاب', en: 'Al-Ahzab', tr: 'The Combined Forces', bn: 'আল-আহযাব', ayahs: 73, rev: 'Medinan', juz: 21},
  {n: 34, ar: 'سبإ', en: 'Saba', tr: 'Sheba', bn: 'সাবা', ayahs: 54, rev: 'Meccan', juz: 22},
  {n: 35, ar: 'فاطر', en: 'Fatir', tr: 'Originator', bn: 'ফাতির', ayahs: 45, rev: 'Meccan', juz: 22},
  {n: 36, ar: 'يس', en: 'Ya-Sin', tr: 'Ya Sin', bn: 'ইয়াসীন', ayahs: 83, rev: 'Meccan', juz: 22},
  {n: 37, ar: 'الصافات', en: 'As-Saffat', tr: 'Those Ranged in Ranks', bn: 'আস-সাফফাত', ayahs: 182, rev: 'Meccan', juz: 23},
  {n: 38, ar: 'ص', en: 'Sad', tr: 'Sad', bn: 'ছোয়াদ', ayahs: 88, rev: 'Meccan', juz: 23},
  {n: 39, ar: 'الزمر', en: 'Az-Zumar', tr: 'The Troops', bn: 'আয-যুমার', ayahs: 75, rev: 'Meccan', juz: 23},
  {n: 40, ar: 'غافر', en: 'Ghafir', tr: 'The Forgiver', bn: 'আল-মুমিন / গাফির', ayahs: 85, rev: 'Meccan', juz: 24},
  {n: 41, ar: 'فصلت', en: 'Fussilat', tr: 'Explained in Detail', bn: 'হা-মীম সাজদাহ', ayahs: 54, rev: 'Meccan', juz: 24},
  {n: 42, ar: 'الشورى', en: 'Ash-Shuraa', tr: 'The Consultation', bn: 'আশ-শূরা', ayahs: 53, rev: 'Meccan', juz: 25},
  {n: 43, ar: 'الزخرف', en: 'Az-Zukhruf', tr: 'Ornaments of Gold', bn: 'আয-যুখরুফ', ayahs: 89, rev: 'Meccan', juz: 25},
  {n: 44, ar: 'الدخان', en: 'Ad-Dukhan', tr: 'The Smoke', bn: 'আদ-দুখান', ayahs: 59, rev: 'Meccan', juz: 25},
  {n: 45, ar: 'الجاثية', en: 'Al-Jathiyah', tr: 'The Crouching', bn: 'আল-জাসিয়াহ', ayahs: 37, rev: 'Meccan', juz: 25},
  {n: 46, ar: 'الأحقاف', en: 'Al-Ahqaf', tr: 'The Wind-Curved Sandhills', bn: 'আল-আহকাফ', ayahs: 35, rev: 'Meccan', juz: 26},
  {n: 47, ar: 'محمد', en: 'Muhammad', tr: 'Muhammad', bn: 'মুহাম্মাদ', ayahs: 38, rev: 'Medinan', juz: 26},
  {n: 48, ar: 'الفتح', en: 'Al-Fath', tr: 'The Victory', bn: 'আল-ফাতহ', ayahs: 29, rev: 'Medinan', juz: 26},
  {n: 49, ar: 'الحجرات', en: 'Al-Hujurat', tr: 'The Rooms', bn: 'আল-হুজুরাত', ayahs: 18, rev: 'Medinan', juz: 26},
  {n: 50, ar: 'ق', en: 'Qaf', tr: 'Qaf', bn: 'ক্বাফ', ayahs: 45, rev: 'Meccan', juz: 26},
  {n: 51, ar: 'الذاريات', en: 'Adh-Dhariyat', tr: 'The Winnowing Winds', bn: 'আয-যারিয়াত', ayahs: 60, rev: 'Meccan', juz: 26},
  {n: 52, ar: 'الطور', en: 'At-Tur', tr: 'The Mount', bn: 'আত-তূর', ayahs: 49, rev: 'Meccan', juz: 27},
  {n: 53, ar: 'النجم', en: 'An-Najm', tr: 'The Star', bn: 'আন-নাজম', ayahs: 62, rev: 'Meccan', juz: 27},
  {n: 54, ar: 'القمر', en: 'Al-Qamar', tr: 'The Moon', bn: 'আল-ক্বামার', ayahs: 55, rev: 'Meccan', juz: 27},
  {n: 55, ar: 'الرحمن', en: 'Ar-Rahman', tr: 'The Beneficent', bn: 'আর-রহমান', ayahs: 78, rev: 'Medinan', juz: 27},
  {n: 56, ar: 'الواقعة', en: "Al-Waqi'ah", tr: 'The Inevitable', bn: 'আল-ওয়াকিয়াহ', ayahs: 96, rev: 'Meccan', juz: 27},
  {n: 57, ar: 'الحديد', en: 'Al-Hadid', tr: 'The Iron', bn: 'আল-হাদীদ', ayahs: 29, rev: 'Medinan', juz: 27},
  {n: 58, ar: 'المجادلة', en: 'Al-Mujadila', tr: 'The Pleading Woman', bn: 'আল-মুজাদালাহ', ayahs: 22, rev: 'Medinan', juz: 28},
  {n: 59, ar: 'الحشر', en: 'Al-Hashr', tr: 'The Exile', bn: 'আল-হাশর', ayahs: 24, rev: 'Medinan', juz: 28},
  {n: 60, ar: 'الممتحنة', en: 'Al-Mumtahanah', tr: 'She that is to be examined', bn: 'আল-মুমতাহিনাহ', ayahs: 13, rev: 'Medinan', juz: 28},
  {n: 61, ar: 'الصف', en: 'As-Saf', tr: 'The Ranks', bn: 'আস-সাফ', ayahs: 14, rev: 'Medinan', juz: 28},
  {n: 62, ar: 'الجمعة', en: "Al-Jumu'ah", tr: 'The Congregation, Friday', bn: 'আল-জুমুআহ', ayahs: 11, rev: 'Medinan', juz: 28},
  {n: 63, ar: 'المنافقون', en: 'Al-Munafiqun', tr: 'The Hypocrites', bn: 'আল-মুনাফিকূন', ayahs: 11, rev: 'Medinan', juz: 28},
  {n: 64, ar: 'التغابن', en: 'At-Taghabun', tr: 'The Mutual Disillusion', bn: 'আত-তাগাবুন', ayahs: 18, rev: 'Medinan', juz: 28},
  {n: 65, ar: 'الطلاق', en: 'At-Talaq', tr: 'The Divorce', bn: 'আত-তালাক্ব', ayahs: 12, rev: 'Medinan', juz: 28},
  {n: 66, ar: 'التحريم', en: 'At-Tahrim', tr: 'The Prohibition', bn: 'আত-তাহরীম', ayahs: 12, rev: 'Medinan', juz: 28},
  {n: 67, ar: 'الملك', en: 'Al-Mulk', tr: 'The Sovereignty', bn: 'আল-মুলক', ayahs: 30, rev: 'Meccan', juz: 29},
  {n: 68, ar: 'القلم', en: 'Al-Qalam', tr: 'The Pen', bn: 'আল-ক্বলম', ayahs: 52, rev: 'Meccan', juz: 29},
  {n: 69, ar: 'الحاقة', en: 'Al-Haqqah', tr: 'The Reality', bn: 'আল-হাক্কাহ', ayahs: 52, rev: 'Meccan', juz: 29},
  {n: 70, ar: 'المعارج', en: "Al-Ma'arij", tr: 'The Ascending Stairways', bn: 'আল-মাআরিজ', ayahs: 44, rev: 'Meccan', juz: 29},
  {n: 71, ar: 'نوح', en: 'Nuh', tr: 'Noah', bn: 'নূহ', ayahs: 28, rev: 'Meccan', juz: 29},
  {n: 72, ar: 'الجن', en: 'Al-Jinn', tr: 'The Jinn', bn: 'আল-জিন', ayahs: 28, rev: 'Meccan', juz: 29},
  {n: 73, ar: 'المزمل', en: 'Al-Muzzammil', tr: 'The Enshrouded One', bn: 'আল-মুযযাম্মিল', ayahs: 20, rev: 'Meccan', juz: 29},
  {n: 74, ar: 'المدثر', en: 'Al-Muddaththir', tr: 'The Cloaked One', bn: 'আল-মুদ্দাসসির', ayahs: 56, rev: 'Meccan', juz: 29},
  {n: 75, ar: 'القيامة', en: 'Al-Qiyamah', tr: 'The Resurrection', bn: 'আল-কিয়ামাহ', ayahs: 40, rev: 'Meccan', juz: 29},
  {n: 76, ar: 'الإنسان', en: 'Al-Insan', tr: 'The Man', bn: 'আদ-দাহর / আল-ইনসান', ayahs: 31, rev: 'Medinan', juz: 29},
  {n: 77, ar: 'المرسلات', en: 'Al-Mursalat', tr: 'The Emissaries', bn: 'আল-মুরসালাত', ayahs: 50, rev: 'Meccan', juz: 29},
  {n: 78, ar: 'النبإ', en: 'An-Naba', tr: 'The Tidings', bn: 'আন-নাবা', ayahs: 40, rev: 'Meccan', juz: 30},
  {n: 79, ar: 'النازعات', en: "An-Nazi'at", tr: 'Those who drag forth', bn: 'আন-নাযিয়াত', ayahs: 46, rev: 'Meccan', juz: 30},
  {n: 80, ar: 'عبس', en: 'Abasa', tr: 'He Frowned', bn: 'আবাসা', ayahs: 42, rev: 'Meccan', juz: 30},
  {n: 81, ar: 'التكوير', en: 'At-Takwir', tr: 'The Overthrowing', bn: 'আত-তাকভীর', ayahs: 29, rev: 'Meccan', juz: 30},
  {n: 82, ar: 'الإنفطار', en: 'Al-Infitar', tr: 'The Cleaving', bn: 'আল-ইনফিতার', ayahs: 19, rev: 'Meccan', juz: 30},
  {n: 83, ar: 'المطففين', en: 'Al-Mutaffifin', tr: 'The Defrauding', bn: 'আল-মুতাফফিফীন', ayahs: 36, rev: 'Meccan', juz: 30},
  {n: 84, ar: 'الإنشقاق', en: 'Al-Inshiqaq', tr: 'The Sundering', bn: 'আল-ইনশিক্বাক', ayahs: 25, rev: 'Meccan', juz: 30},
  {n: 85, ar: 'البروج', en: 'Al-Buruj', tr: 'The Mansions of the Stars', bn: 'আল-বুরূজ', ayahs: 22, rev: 'Meccan', juz: 30},
  {n: 86, ar: 'الطارق', en: 'At-Tariq', tr: 'The Nightcomer', bn: 'আত-তারিক্ব', ayahs: 17, rev: 'Meccan', juz: 30},
  {n: 87, ar: 'الأعلى', en: "Al-A'la", tr: 'The Most High', bn: 'আল-আলা', ayahs: 19, rev: 'Meccan', juz: 30},
  {n: 88, ar: 'الغاشية', en: 'Al-Ghashiyah', tr: 'The Overwhelming', bn: 'আল-গাশিয়াহ', ayahs: 26, rev: 'Meccan', juz: 30},
  {n: 89, ar: 'الفجر', en: 'Al-Fajr', tr: 'The Dawn', bn: 'আল-ফাজর', ayahs: 30, rev: 'Meccan', juz: 30},
  {n: 90, ar: 'البلد', en: 'Al-Balad', tr: 'The City', bn: 'আল-বালাদ', ayahs: 20, rev: 'Meccan', juz: 30},
  {n: 91, ar: 'الشمس', en: 'Ash-Shams', tr: 'The Sun', bn: 'আশ-শামস', ayahs: 15, rev: 'Meccan', juz: 30},
  {n: 92, ar: 'الليل', en: 'Al-Layl', tr: 'The Night', bn: 'আল-লাইল', ayahs: 21, rev: 'Meccan', juz: 30},
  {n: 93, ar: 'الضحى', en: 'Ad-Duhaa', tr: 'The Morning Hours', bn: 'আদ-দুহা', ayahs: 11, rev: 'Meccan', juz: 30},
  {n: 94, ar: 'الشرح', en: 'Ash-Sharh', tr: 'The Relief', bn: 'আল-ইনশিরাহ', ayahs: 8, rev: 'Meccan', juz: 30},
  {n: 95, ar: 'التين', en: 'At-Tin', tr: 'The Fig', bn: 'আত-তীন', ayahs: 8, rev: 'Meccan', juz: 30},
  {n: 96, ar: 'العلق', en: 'Al-Alaq', tr: 'The Clot', bn: 'আল-আলাক', ayahs: 19, rev: 'Meccan', juz: 30},
  {n: 97, ar: 'القدر', en: 'Al-Qadr', tr: 'The Power', bn: 'আল-ক্বদর', ayahs: 5, rev: 'Meccan', juz: 30},
  {n: 98, ar: 'البينة', en: 'Al-Bayyinah', tr: 'The Clear Proof', bn: 'আল-বাইয়্যিনাহ', ayahs: 8, rev: 'Medinan', juz: 30},
  {n: 99, ar: 'الزلزلة', en: 'Az-Zalzalah', tr: 'The Earthquake', bn: 'আয-যিলযাল', ayahs: 8, rev: 'Medinan', juz: 30},
  {n: 100, ar: 'العاديات', en: 'Al-Adiyat', tr: 'The Courser', bn: 'আল-আদিয়াত', ayahs: 11, rev: 'Meccan', juz: 30},
  {n: 101, ar: 'القارعة', en: "Al-Qari'ah", tr: 'The Calamity', bn: 'আল-কারিয়াহ', ayahs: 11, rev: 'Meccan', juz: 30},
  {n: 102, ar: 'التكاثر', en: 'At-Takathur', tr: 'The Rivalry in world increase', bn: 'আত-তাকাসুর', ayahs: 8, rev: 'Meccan', juz: 30},
  {n: 103, ar: 'العصر', en: 'Al-Asr', tr: 'The Declining Day', bn: 'আল-আসর', ayahs: 3, rev: 'Meccan', juz: 30},
  {n: 104, ar: 'الهمزة', en: 'Al-Humazah', tr: 'The Traducer', bn: 'আল-হুমাযাহ', ayahs: 9, rev: 'Meccan', juz: 30},
  {n: 105, ar: 'الفيل', en: 'Al-Fil', tr: 'The Elephant', bn: 'আল-ফীল', ayahs: 5, rev: 'Meccan', juz: 30},
  {n: 106, ar: 'قريش', en: 'Quraysh', tr: 'Quraysh', bn: 'কুরাইশ', ayahs: 4, rev: 'Meccan', juz: 30},
  {n: 107, ar: 'الماعون', en: "Al-Ma'un", tr: 'The Small kindnesses', bn: 'আল-মাউন', ayahs: 7, rev: 'Meccan', juz: 30},
  {n: 108, ar: 'الكوثر', en: 'Al-Kawthar', tr: 'The Abundance', bn: 'আল-কাওসার', ayahs: 3, rev: 'Meccan', juz: 30},
  {n: 109, ar: 'الكافرون', en: 'Al-Kafirun', tr: 'The Disbelievers', bn: 'আল-কাফিরূন', ayahs: 6, rev: 'Meccan', juz: 30},
  {n: 110, ar: 'النصر', en: 'An-Nasr', tr: 'The Divine Support', bn: 'আন-নাসর', ayahs: 3, rev: 'Medinan', juz: 30},
  {n: 111, ar: 'المسد', en: 'Al-Masad', tr: 'The Palm Fiber', bn: 'আল-লাহাব', ayahs: 5, rev: 'Meccan', juz: 30},
  {n: 112, ar: 'الإخلاص', en: 'Al-Ikhlas', tr: 'The Sincerity', bn: 'আল-ইখলাস', ayahs: 4, rev: 'Meccan', juz: 30},
  {n: 113, ar: 'الفلق', en: 'Al-Falaq', tr: 'The Daybreak', bn: 'আল-ফালাক', ayahs: 5, rev: 'Meccan', juz: 30},
  {n: 114, ar: 'الناس', en: 'An-Nas', tr: 'Mankind', bn: 'আন-নাস', ayahs: 6, rev: 'Meccan', juz: 30},
];

let cumulative = 1;
export const ALL_SURAHS: SurahMeta[] = RAW_SURAHS.map((s) => {
  const item: SurahMeta = {
    number: s.n,
    arabicName: s.ar,
    englishName: s.en,
    englishTranslation: s.tr,
    bengaliName: s.bn,
    ayahCount: s.ayahs,
    revelationType: s.rev,
    juz: s.juz,
    startGlobalAyah: cumulative,
  };
  cumulative += s.ayahs;
  return item;
});

export interface JuzInfo {
  juzNumber: number;
  nameAr: string;
  nameBn: string;
  startSurah: number;
  startAyah: number;
}

export const ALL_JUZ: JuzInfo[] = [
  {juzNumber: 1, nameAr: 'الم', nameBn: 'আলিফ-লাম-মীম', startSurah: 1, startAyah: 1},
  {juzNumber: 2, nameAr: 'سيقول', nameBn: 'সায়াকূলু', startSurah: 2, startAyah: 142},
  {juzNumber: 3, nameAr: 'تلك الرسل', nameBn: 'তিলকার-রুসুলু', startSurah: 2, startAyah: 253},
  {juzNumber: 4, nameAr: 'لن تنالوا', nameBn: 'লান তানালু', startSurah: 3, startAyah: 93},
  {juzNumber: 5, nameAr: 'والمحصنات', nameBn: 'ওয়াল মুহসানাতু', startSurah: 4, startAyah: 24},
  {juzNumber: 6, nameAr: 'لا يحب الله', nameBn: 'লা ইয়ুহিব্বুল্লাহু', startSurah: 4, startAyah: 148},
  {juzNumber: 7, nameAr: 'وإذا سمعوا', nameBn: 'ওয়া ইযা সামিঊ', startSurah: 5, startAyah: 82},
  {juzNumber: 8, nameAr: 'ولو أننا', nameBn: 'ওয়া লাউ আন্নানা', startSurah: 6, startAyah: 111},
  {juzNumber: 9, nameAr: 'قال الملأ', nameBn: 'ক্বালাল মালাউ', startSurah: 7, startAyah: 88},
  {juzNumber: 10, nameAr: 'واعلموا', nameBn: 'ওয়া’লামূ', startSurah: 8, startAyah: 41},
  {juzNumber: 11, nameAr: 'يعتذرون', nameBn: 'ইয়া’তাযিরূনা', startSurah: 9, startAyah: 93},
  {juzNumber: 12, nameAr: 'وما من دابة', nameBn: 'ওয়ামা মিন দাব্বাতিন', startSurah: 11, startAyah: 6},
  {juzNumber: 13, nameAr: 'وما أبرئ', nameBn: 'ওয়ামা উবাররিউ', startSurah: 12, startAyah: 53},
  {juzNumber: 14, nameAr: 'ربما', nameBn: 'রুবামা', startSurah: 15, startAyah: 1},
  {juzNumber: 15, nameAr: 'سبحان الذي', nameBn: 'সুবহানাল্লাযী', startSurah: 17, startAyah: 1},
  {juzNumber: 16, nameAr: 'قال ألم', nameBn: 'ক্বালা আলাম', startSurah: 18, startAyah: 75},
  {juzNumber: 17, nameAr: 'اقترب للناس', nameBn: 'ইক্বতারাবা লিন্নাসি', startSurah: 21, startAyah: 1},
  {juzNumber: 18, nameAr: 'قد أفلح', nameBn: 'ক্বাদ আফলাহা', startSurah: 23, startAyah: 1},
  {juzNumber: 19, nameAr: 'وقال الذين', nameBn: 'ওয়া ক্বালাল্লাযীনা', startSurah: 25, startAyah: 21},
  {juzNumber: 20, nameAr: 'أمن خلق', nameBn: 'আম্মান খালাক্বা', startSurah: 27, startAyah: 56},
  {juzNumber: 21, nameAr: 'اتل ما أوحي', nameBn: 'উতলু মা উহিয়া', startSurah: 29, startAyah: 46},
  {juzNumber: 22, nameAr: 'ومن يقنت', nameBn: 'ওয়া মান ইয়াক্বনুত', startSurah: 33, startAyah: 31},
  {juzNumber: 23, nameAr: 'وما لي', nameBn: 'ওয়ামা লিয়া', startSurah: 36, startAyah: 28},
  {juzNumber: 24, nameAr: 'فمن أظلم', nameBn: 'ফামান আযলামু', startSurah: 39, startAyah: 32},
  {juzNumber: 25, nameAr: 'إليه يرد', nameBn: 'ইলাইহি ইয়ুরাদ্দু', startSurah: 41, startAyah: 47},
  {juzNumber: 26, nameAr: 'حم', nameBn: 'হা-মীম', startSurah: 46, startAyah: 1},
  {juzNumber: 27, nameAr: 'قال فما خطبكم', nameBn: 'ক্বালা ফামা খাতবুকুম', startSurah: 51, startAyah: 31},
  {juzNumber: 28, nameAr: 'قد سمع الله', nameBn: 'ক্বাদ সামিয়াল্লাহু', startSurah: 58, startAyah: 1},
  {juzNumber: 29, nameAr: 'تبارك الذي', nameBn: 'তাবারাকাল্লাযী', startSurah: 67, startAyah: 1},
  {juzNumber: 30, nameAr: 'عم يتساءلون', nameBn: 'আম্মা ইয়াতাসাআলূন', startSurah: 78, startAyah: 1},
];

export const OFFLINE_BUNDLED_SURAHS: Record<number, AyahItem[]> = {
  1: [
    {
      numberInSurah: 1,
      globalNumber: 1,
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      transliteration: 'Bismillaahir Rahmaanir Raheem',
      bengali: 'পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি।',
      english: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    },
    {
      numberInSurah: 2,
      globalNumber: 2,
      arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      transliteration: 'Alhamdu lillaahi Rabbil aalameen',
      bengali: 'সমস্ত প্রশংসা জগতসমূহের প্রতিপালক আল্লাহর জন্য।',
      english: '[All] praise is [due] to Allah, Lord of the worlds -',
    },
    {
      numberInSurah: 3,
      globalNumber: 3,
      arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
      transliteration: 'Ar-Rahmaanir-Raheem',
      bengali: 'যিনি পরম করুণাময়, অসীম দয়ালু।',
      english: 'The Entirely Merciful, the Especially Merciful,',
    },
    {
      numberInSurah: 4,
      globalNumber: 4,
      arabic: 'مَالِكِ يَوْمِ الدِّينِ',
      transliteration: 'Maaliki Yawmid-Deen',
      bengali: 'বিচার দিনের মালিক।',
      english: 'Sovereign of the Day of Recompense.',
    },
    {
      numberInSurah: 5,
      globalNumber: 5,
      arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      transliteration: 'Iyyaaka na’budu wa iyyaaka nasta’een',
      bengali: 'আমরা কেবল তোমারই ইবাদত করি এবং কেবল তোমারই সাহায্য প্রার্থনা করি।',
      english: 'It is You we worship and You we ask for help.',
    },
    {
      numberInSurah: 6,
      globalNumber: 6,
      arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      transliteration: 'Ihdinas-Siraatal Mustaqeem',
      bengali: 'আমাদেরকে সরল পথ প্রদর্শন কর।',
      english: 'Guide us to the straight path -',
    },
    {
      numberInSurah: 7,
      globalNumber: 7,
      arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      transliteration: "Siraatal-lazeena an'amta 'alaihim ghayril-maghdoobi 'alaihim wa lad-daaalleen",
      bengali: 'তাদের পথ, যাদেরকে তুমি নিয়ামত দান করেছ, তাদের পথ নয় যাদের প্রতি ক্রোধ বর্ষিত হয়েছে এবং যারা পথভ্রষ্ট হয়েছে।',
      english: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
    },
  ],
  103: [
    {
      numberInSurah: 1,
      globalNumber: 6177,
      arabic: 'وَالْعَصْرِ',
      transliteration: "Wal-'asr",
      bengali: 'শপথ সময়ের (যুগের),',
      english: 'By time,',
    },
    {
      numberInSurah: 2,
      globalNumber: 6178,
      arabic: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
      transliteration: 'Innal insaana lafee khusr',
      bengali: 'নিশ্চয়ই মানুষ ক্ষতির মধ্যে নিপতিত,',
      english: 'Indeed, mankind is in loss,',
    },
    {
      numberInSurah: 3,
      globalNumber: 6179,
      arabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
      transliteration: 'Illal lazeena aamanoo wa ‘amilus saalihaati wa tawaasaw bil haqqi wa tawaasaw bis sabr',
      bengali: 'তবে তারা ব্যতীত, যারা ঈমান এনেছে, সৎকর্ম করেছে এবং পরস্পরকে সত্যের উপদেশ দিয়েছে ও ধৈর্যের উপদেশ দিয়েছে।',
      english: 'Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.',
    },
  ],
  108: [
    {
      numberInSurah: 1,
      globalNumber: 6205,
      arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
      transliteration: "Innaa a'tainaakal kawthar",
      bengali: 'নিশ্চয়ই আমি আপনাকে কাউসার দান করেছি।',
      english: 'Indeed, We have granted you, [O Muhammad], al-Kawthar.',
    },
    {
      numberInSurah: 2,
      globalNumber: 6206,
      arabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
      transliteration: 'Fasalli li rabbika wanhar',
      bengali: 'অতএব আপনার প্রতিপালকের উদ্দেশ্যে নামাজ পড়ুন এবং কুরবানি করুন।',
      english: 'So pray to your Lord and sacrifice [to Him alone].',
    },
    {
      numberInSurah: 3,
      globalNumber: 6207,
      arabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
      transliteration: 'Inna shaani-aka huwal abtar',
      bengali: 'নিশ্চয়ই আপনার শত্রুই নির্বংশ হবে।',
      english: 'Indeed, your enemy is the one cut off.',
    },
  ],
  112: [
    {
      numberInSurah: 1,
      globalNumber: 6222,
      arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      transliteration: 'Qul huwal laahu ahad',
      bengali: 'বলুন, তিনি আল্লাহ, এক ও অদ্বিতীয়।',
      english: 'Say, "He is Allah, [who is] One,',
    },
    {
      numberInSurah: 2,
      globalNumber: 6223,
      arabic: 'اللَّهُ الصَّمَدُ',
      transliteration: 'Allaahus-samad',
      bengali: 'আল্লাহ অমুখাপেক্ষী (সকলেই তাঁর মুখাপেক্ষী)।',
      english: 'Allah, the Eternal Refuge.',
    },
    {
      numberInSurah: 3,
      globalNumber: 6224,
      arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
      transliteration: 'Lam yalid wa lam yoolad',
      bengali: 'তিনি কাউকে জন্ম দেননি এবং তাঁকেও জন্ম দেওয়া হয়নি।',
      english: 'He neither begets nor is born,',
    },
    {
      numberInSurah: 4,
      globalNumber: 6225,
      arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
      transliteration: 'Wa lam yakul-lahoo kufuwan ahad',
      bengali: 'এবং তাঁর সমতুল্য কেউ নেই।',
      english: 'Nor is there to Him any equivalent."',
    },
  ],
  113: [
    {
      numberInSurah: 1,
      globalNumber: 6226,
      arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
      transliteration: "Qul a'oozu bi rabbil-falaq",
      bengali: 'বলুন, আমি আশ্রয় প্রার্থনা করছি উষার প্রতিপালকের,',
      english: 'Say, "I seek refuge in the Lord of daybreak',
    },
    {
      numberInSurah: 2,
      globalNumber: 6227,
      arabic: 'مِن شَرِّ مَا خَلَقَ',
      transliteration: 'Min sharri maa khalaq',
      bengali: 'তিনি যা সৃষ্টি করেছেন তার অনিষ্ট থেকে,',
      english: 'From the evil of that which He created',
    },
    {
      numberInSurah: 3,
      globalNumber: 6228,
      arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
      transliteration: 'Wa min sharri ghaasiqin izaa waqab',
      bengali: 'এবং অন্ধকার রাতের অনিষ্ট থেকে, যখন তা গভীর হয়,',
      english: 'And from the evil of darkness when it settles',
    },
    {
      numberInSurah: 4,
      globalNumber: 6229,
      arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
      transliteration: "Wa min sharrin-naffaathaati fil 'uqad",
      bengali: 'এবং গ্রন্থিতে ফুঁৎকার দানকারিণীদের অনিষ্ট থেকে,',
      english: 'And from the evil of the blowers in knots',
    },
    {
      numberInSurah: 5,
      globalNumber: 6230,
      arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
      transliteration: 'Wa min sharri haasidin izaa hasad',
      bengali: 'এবং হিংসুকের অনিষ্ট থেকে, যখন সে হিংসা করে।',
      english: 'And from the evil of an envier when he envies."',
    },
  ],
  114: [
    {
      numberInSurah: 1,
      globalNumber: 6231,
      arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
      transliteration: "Qul a'oozu bi rabbin-naas",
      bengali: 'বলুন, আমি আশ্রয় প্রার্থনা করছি মানুষের প্রতিপালকের,',
      english: 'Say, "I seek refuge in the Lord of mankind,',
    },
    {
      numberInSurah: 2,
      globalNumber: 6232,
      arabic: 'مَلِكِ النَّاسِ',
      transliteration: 'Malikin-naas',
      bengali: 'মানুষের অধিপতির,',
      english: 'The Sovereign of mankind.',
    },
    {
      numberInSurah: 3,
      globalNumber: 6233,
      arabic: 'إِلَٰهِ النَّاسِ',
      transliteration: 'Ilaahin-naas',
      bengali: 'মানুষের উপাস্যের,',
      english: 'The God of mankind,',
    },
    {
      numberInSurah: 4,
      globalNumber: 6234,
      arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
      transliteration: 'Min sharril waswaasil khannaas',
      bengali: 'আত্মগোপনকারী কুমন্ত্রণাদাতার অনিষ্ট থেকে,',
      english: 'From the evil of the retreating whisperer -',
    },
    {
      numberInSurah: 5,
      globalNumber: 6235,
      arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
      transliteration: 'Allazee yuwaswisu fee sudoorin-naas',
      bengali: 'যে মানুষের অন্তরে কুমন্ত্রণা দেয়,',
      english: 'Who whispers [evil] into the breasts of mankind -',
    },
    {
      numberInSurah: 6,
      globalNumber: 6236,
      arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
      transliteration: 'Minal jinnati wan-naas',
      bengali: 'জিন ও মানুষের মধ্য থেকে।',
      english: 'From among the jinn and mankind."',
    },
  ],
};

const QURAN_CACHE_PREFIX = 'sknur_surah_cache_v1_';

export function getCachedSurahNumbers(): number[] {
  const cached = new Set<number>(Object.keys(OFFLINE_BUNDLED_SURAHS).map(Number));
  if (typeof localStorage !== 'undefined') {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(QURAN_CACHE_PREFIX)) {
        const num = Number(k.replace(QURAN_CACHE_PREFIX, ''));
        if (!Number.isNaN(num)) cached.add(num);
      }
    }
  }
  return Array.from(cached).sort((a, b) => a - b);
}

export async function fetchSurahAyahs(surahNumber: number): Promise<{
  ayahs: AyahItem[];
  fromCache: boolean;
}> {
  const cacheKey = `${QURAN_CACHE_PREFIX}${surahNumber}`;
  try {
    const rawCached = localStorage.getItem(cacheKey);
    if (rawCached) {
      return {ayahs: JSON.parse(rawCached) as AyahItem[], fromCache: true};
    }
  } catch {
    // ignore storage errors
  }

  try {
    const url = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih,bn.bengali,en.transliteration`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Quran API unavailable');
    const json = (await res.json()) as {
      data?: Array<{
        ayahs: Array<{number: number; numberInSurah: number; text: string}>;
      }>;
    };
    const editions = json.data;
    if (!editions || editions.length < 4) throw new Error('Incomplete editions');

    const [arEd, enEd, bnEd, trEd] = editions;
    const ayahs: AyahItem[] = arEd.ayahs.map((a, idx) => ({
      numberInSurah: a.numberInSurah,
      globalNumber: a.number,
      arabic: a.text,
      english: enEd.ayahs[idx]?.text || '',
      bengali: bnEd.ayahs[idx]?.text || '',
      transliteration: trEd.ayahs[idx]?.text || '',
    }));

    try {
      localStorage.setItem(cacheKey, JSON.stringify(ayahs));
    } catch {
      // storage quota full
    }

    return {ayahs, fromCache: false};
  } catch {
    if (OFFLINE_BUNDLED_SURAHS[surahNumber]) {
      return {ayahs: OFFLINE_BUNDLED_SURAHS[surahNumber], fromCache: true};
    }
    throw new Error('Could not load Surah while offline. Connect once to download and cache.');
  }
}

export const DAILY_VERSES = [
  {
    surahNameEn: 'Ash-Sharh (94:5-6)',
    surahNameBn: 'সূরা আল-ইনশিরাহ (৯৪:৫-৬)',
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    bengali: 'নিশ্চয়ই কষ্টের সাথেই স্বস্তি রয়েছে। নিশ্চয়ই কষ্টের সাথেই স্বস্তি রয়েছে।',
    english: 'For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.',
  },
  {
    surahNameEn: 'Al-Baqarah (2:152)',
    surahNameBn: 'সূরা আল-বাকারা (২:১৫২)',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    bengali: 'অতএব তোমরা আমাকে স্মরণ করো, আমিও তোমাদের স্মরণ করব এবং আমার কৃতজ্ঞতা আদায় করো, অকৃতজ্ঞ হয়ো না।',
    english: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.',
  },
  {
    surahNameEn: 'Ar-Ra’d (13:28)',
    surahNameBn: 'সূরা আর-রাদ (১৩:২৮)',
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    bengali: 'জেনে রেখো, আল্লাহর স্মরণেই অন্তরসমূহ প্রশান্ত হয়।',
    english: 'Unquestionably, by the remembrance of Allah hearts are assured.',
  },
];
