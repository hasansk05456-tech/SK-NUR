export type Language = 'bn' | 'en' | 'ar';

export type MainTab = 'home' | 'quran' | 'prayer' | 'tasbih' | 'more';

export type MoreSubView =
  | 'menu'
  | 'duas'
  | 'hadith'
  | 'calendar'
  | 'qibla'
  | 'knowledge'
  | 'ramadan'
  | 'zakat'
  | 'names'
  | 'media'
  | 'notifications'
  | 'android_drive'
  | 'profile';

export type CalculationMethodKey =
  | 'Karachi'
  | 'MuslimWorldLeague'
  | 'UmmAlQura'
  | 'Egyptian'
  | 'NorthAmerica'
  | 'Singapore'
  | 'Tehran'
  | 'Turkey';

export type MadhabKey = 'Hanafi' | 'Shafi';

export interface LocationConfig {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  isAutoGPS: boolean;
}

export interface SurahMeta {
  number: number;
  arabicName: string;
  englishName: string;
  englishTranslation: string;
  bengaliName: string;
  ayahCount: number;
  revelationType: 'Meccan' | 'Medinan';
  juz: number;
  startGlobalAyah: number;
}

export interface AyahItem {
  numberInSurah: number;
  globalNumber: number;
  arabic: string;
  transliteration: string;
  bengali: string;
  english: string;
}

export interface DuaItem {
  id: string;
  category: string;
  titleEn: string;
  titleBn: string;
  arabic: string;
  bengaliPronunciation: string;
  bengaliMeaning: string;
  englishMeaning: string;
  reference: string;
}

export interface HadithItem {
  id: string;
  book: 'bukhari' | 'muslim' | 'abudawud' | 'tirmidhi' | 'nasai' | 'ibnmajah';
  bookNameEn: string;
  bookNameBn: string;
  chapterEn: string;
  chapterBn: string;
  narrator: string;
  arabic: string;
  bengali: string;
  english: string;
  reference: string;
}

export interface IslamicNameItem {
  id: string;
  name: string;
  arabic: string;
  bengaliPronunciation: string;
  bengaliMeaning: string;
  englishMeaning: string;
  gender: 'boy' | 'girl';
}

export interface TasbihPreset {
  id: string;
  arabic: string;
  transliteration: string;
  bengali: string;
  meaningEn: string;
  meaningBn: string;
  defaultTarget: number;
}

export interface CustomReminder {
  id: string;
  title: string;
  time: string;
  enabled: boolean;
  type: 'prayer' | 'azkar' | 'quran' | 'hadith' | 'jumuah' | 'ramadan' | 'custom';
}

export interface WorshipDayLog {
  prayersCompleted: string[];
  quranAyahsRead: number;
  tasbihCount: number;
  fasted: boolean;
  taraweeh: boolean;
}

export interface AppSettings {
  language: Language;
  darkMode: boolean;
  arabicFontSize: number;
  calculationMethod: CalculationMethodKey;
  madhab: MadhabKey;
  location: LocationConfig;
  notificationsEnabled: boolean;
  adhanSoundEnabled: boolean;
  prayerReminders: Record<string, boolean>;
  azkarMorningReminder: boolean;
  azkarEveningReminder: boolean;
  dailyQuranReminder: boolean;
  dailyHadithReminder: boolean;
  jumuahReminder: boolean;
  ramadanReminder: boolean;
  profileName: string;
  profileEmail: string;
  privacyHideStats: boolean;
}

export interface UserPersistedState {
  settings: AppSettings;
  bookmarkedAyahs: string[]; // "surah:ayah"
  bookmarkedHadiths: string[];
  favoriteDuas: string[];
  favoriteNames: string[];
  lastReadQuran: {surah: number; ayah: number; timestamp: string} | null;
  tasbihLifetimeCount: number;
  tasbihDailyHistory: Record<string, number>;
  customTasbihs: TasbihPreset[];
  worshipLogs: Record<string, WorshipDayLog>; // YYYY-MM-DD -> log
  ramadanChecklist: Record<string, boolean>;
  customReminders: CustomReminder[];
}
