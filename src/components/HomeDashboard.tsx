import React, {useState} from 'react';
import {
  BookHeart,
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  Compass,
  Download,
  FolderUp,
  GraduationCap,
  HeartHandshake,
  HelpCircle,
  MapPin,
  MoonStar,
  Music,
  Scale,
  Smartphone,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import {useSkNur} from '../context/SkNurContext';
import {usePWAInstall} from '../hooks/usePWAInstall';
import {DAILY_VERSES} from '../data/quranMeta';
import {HADITH_COLLECTION} from '../data/hadithData';
import {DUAS_LIST} from '../data/duasData';
import {formatCountdown, formatTimeShort} from '../lib/prayerUtils';
import {LocationPickerModal} from './LocationPickerModal';
import {InstallAppModal} from './InstallAppModal';
import {AppInstallationGuideModal} from './AppInstallationGuideModal';
import type {MoreSubView} from '../types/islamic';

const HERO_MOSQUE_IMG = '/src/assets/images/hero_mosque_courtyard_1795107030320.jpg';

export const HomeDashboard: React.FC = () => {
  const {
    state,
    t,
    now,
    prayerDay,
    hijriInfo,
    bengaliInfo,
    setActiveTab,
    openMoreFeature,
    openQuranSurah,
    todayWorship,
    togglePrayerCompleted,
  } = useSkNur();

  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const dailyVerse = DAILY_VERSES[dayOfYear % DAILY_VERSES.length];
  const dailyHadith = HADITH_COLLECTION[dayOfYear % HADITH_COLLECTION.length];
  const dailyDua = DUAS_LIST[dayOfYear % DUAS_LIST.length];

  const isBn = state.settings.language === 'bn';
  const {isInstallable, isInstalled, install} = usePWAInstall();
  const [dismissedPrompt, setDismissedPrompt] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const countdown = formatCountdown(prayerDay.nextPrayerTime, now);

  const prayerRows = [
    {key: 'Fajr', label: t.fajr, time: prayerDay.fajr},
    {key: 'Dhuhr', label: t.dhuhr, time: prayerDay.dhuhr},
    {key: 'Asr', label: t.asr, time: prayerDay.asr},
    {key: 'Maghrib', label: t.maghrib, time: prayerDay.maghrib},
    {key: 'Isha', label: t.isha, time: prayerDay.isha},
  ];

  const englishDateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const quickActions: {
    label: string;
    sub: string;
    icon: React.ReactNode;
    onClick: () => void;
  }[] = [
    {
      label: t.duasTitle,
      sub: isBn ? 'সকাল-সন্ধ্যা ও মাসনূন' : 'Masnoon & Azkar',
      icon: <HeartHandshake className="w-5 h-5" />,
      onClick: () => openMoreFeature('duas'),
    },
    {
      label: t.hadithTitle,
      sub: isBn ? 'সহীহ সিহাহ সিত্তাহ' : '6 Authentic Books',
      icon: <BookHeart className="w-5 h-5" />,
      onClick: () => openMoreFeature('hadith'),
    },
    {
      label: t.qiblaTitle,
      sub: isBn ? 'লাইভ কাবা দিক' : 'Live Kaaba Bearing',
      icon: <Compass className="w-5 h-5" />,
      onClick: () => openMoreFeature('qibla'),
    },
    {
      label: t.calendarTitle,
      sub: isBn ? 'হিজরি ও বাংলা' : 'Hijri & Bengali',
      icon: <Calendar className="w-5 h-5" />,
      onClick: () => openMoreFeature('calendar'),
    },
    {
      label: t.ramadanTitle,
      sub: isBn ? 'সেহরি ও ইফতার' : 'Sehri & Iftar',
      icon: <MoonStar className="w-5 h-5" />,
      onClick: () => openMoreFeature('ramadan'),
    },
    {
      label: t.zakatTitle,
      sub: isBn ? 'নিসাব ও ২.৫% হিসাব' : '2.5% Nisab Tool',
      icon: <Scale className="w-5 h-5" />,
      onClick: () => openMoreFeature('zakat'),
    },
    {
      label: t.knowledgeTitle,
      sub: isBn ? '৬ কালিমা, অজু ও নামাজ' : 'Kalimas, Salah, Quiz',
      icon: <GraduationCap className="w-5 h-5" />,
      onClick: () => openMoreFeature('knowledge'),
    },
    {
      label: t.namesTitle,
      sub: isBn ? 'শিশুদের অর্থসহ নাম' : 'Baby Boy & Girl Names',
      icon: <Sparkles className="w-5 h-5" />,
      onClick: () => openMoreFeature('names'),
    },
    {
      label: t.mediaTitle,
      sub: isBn ? 'তেলাওয়াত ও আজান' : 'Quran Audio & Adhan',
      icon: <Music className="w-5 h-5" />,
      onClick: () => openMoreFeature('media'),
    },
    {
      label: t.androidDriveTitle,
      sub: isBn ? 'APK প্রজেক্ট ও ড্রাইভ' : 'Android Project & Sync',
      icon: <FolderUp className="w-5 h-5" />,
      onClick: () => openMoreFeature('android_drive' as MoreSubView),
    },
    {
      label: t.profileTitle,
      sub: isBn ? 'ভাষা, থিম ও অ্যাকাউন্ট' : 'Account & Settings',
      icon: <User className="w-5 h-5" />,
      onClick: () => openMoreFeature('profile'),
    },
    {
      label: t.quranTitle,
      sub: isBn ? '১১৪ সূরা ও ৩০ পারা' : '114 Surahs Offline',
      icon: <BookOpen className="w-5 h-5" />,
      onClick: () => setActiveTab('quran'),
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Friendly, non-intrusive BeforeInstallPrompt Install App prompt */}
      {isInstallable && !isInstalled && !dismissedPrompt && (
        <aside
          aria-label={t.installApp}
          className="rounded-2xl bg-white dark:bg-[#0B261E] px-4 py-3.5 border border-[#D4AF37]/50 shadow-xs flex flex-wrap items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/sk-nur-logo.png"
              alt="SK NUR"
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#D4AF37]/60 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white font-bengali">
                {isBn ? 'হোম স্ক্রিনে SK NUR অ্যাপ ইনস্টল করুন' : 'Install SK NUR App'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-300 font-bengali">
                {isBn
                  ? 'অফলাইন কোরআন, নামাজের সময় ও তসবি ব্যবহার করতে ১ ট্যাপে ইনস্টল করুন।'
                  : 'Install for quick home-screen launch and full offline access.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => void install()}
              className="min-h-[40px] px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>{t.installApp}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowGuideModal(true)}
              className="min-h-[40px] px-3 rounded-xl border border-slate-200 dark:border-emerald-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-emerald-900/50 whitespace-nowrap"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isBn ? 'গাইড' : 'Guide'}</span>
            </button>
            <button
              type="button"
              onClick={() => setDismissedPrompt(true)}
              aria-label="Dismiss install prompt"
              className="min-h-[40px] min-w-[40px] rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-900/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Hero Banner with Mosque Courtyard Artwork & Measured Scrim */}
      <section className="relative rounded-3xl overflow-hidden shadow-xl border border-emerald-900/20 dark:border-emerald-800/40 bg-[#042F24]">
        <img
          src={HERO_MOSQUE_IMG}
          alt="Serene Mosque Courtyard at Twilight"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#032119]/95 via-[#042F24]/80 to-[#042F24]/55" />

        <div className="relative z-10 p-5 sm:p-8 text-white grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-[#F5E6BE]">
              <button
                type="button"
                onClick={() => setShowLocationPicker(true)}
                className="inline-flex items-center gap-1.5 font-semibold underline decoration-[#D4AF37]/60 underline-offset-4 hover:text-white transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {state.settings.location.name}, {state.settings.location.country}
                </span>
                <span className="text-[11px] opacity-85">
                  ({isBn ? 'পরিবর্তন' : 'Change'})
                </span>
              </button>
              <span aria-hidden="true">·</span>
              <span>{hijriInfo.formattedEn}</span>
              <span aria-hidden="true">·</span>
              <span className="font-bengali">{bengaliInfo.formattedBn}</span>
            </div>

            <div>
              <p className="text-sm text-emerald-100/90 font-medium">{t.greetingSalam}</p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mt-0.5 text-balance">
                {state.settings.profileName !== 'SK NUR User'
                  ? state.settings.profileName
                  : 'SK NUR'}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/80 mt-1">{englishDateStr}</p>
            </div>
          </div>

          {/* Next Prayer Countdown Focus */}
          <div className="lg:col-span-5 bg-black/35 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#D4AF37]/30 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-[#F5E6BE] font-medium">{t.nextPrayer}</p>
              <p className="text-2xl font-bold text-white mt-0.5">{prayerDay.nextPrayer}</p>
              <p className="text-xs text-emerald-100/80 mt-0.5 font-mono-tabular">
                {formatTimeShort(prayerDay.nextPrayerTime)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-emerald-200/80">{t.timeRemaining}</p>
              <p className="font-mono-tabular text-2xl sm:text-3xl font-bold text-[#F5E6BE] tracking-tight mt-0.5">
                -{countdown}
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('prayer')}
                className="mt-1.5 text-xs font-semibold text-white underline underline-offset-4 hover:text-[#F5E6BE]"
              >
                {isBn ? 'সম্পূর্ণ সময়সূচী →' : 'Full Timetable →'}
              </button>
            </div>
          </div>
        </div>

        {/* 5 Daily Prayers Horizontal Strip */}
        <div className="relative z-10 bg-black/45 backdrop-blur-md border-t border-white/10 px-4 sm:px-8 py-3 grid grid-cols-5 gap-2">
          {prayerRows.map((row) => {
            const isNext = prayerDay.nextPrayer === row.key;
            const completed = todayWorship.prayersCompleted.includes(row.key);
            return (
              <button
                key={row.key}
                type="button"
                onClick={() => togglePrayerCompleted(row.key)}
                title={isBn ? 'নামাজ আদায় টিক দিন' : 'Mark prayer completed'}
                className={`rounded-xl py-2 px-1.5 text-center transition-colors min-h-[44px] flex flex-col items-center justify-center ${
                  isNext
                    ? 'bg-[#D4AF37]/25 ring-1 ring-[#D4AF37]/70 text-white'
                    : 'hover:bg-white/10 text-emerald-50'
                }`}
              >
                <span className="text-[11px] font-medium opacity-90 flex items-center gap-1">
                  {completed ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-300 shrink-0" />
                  ) : (
                    <Circle className="w-3 h-3 opacity-40 shrink-0" />
                  )}
                  <span className="truncate">{row.label}</span>
                </span>
                <span className="font-mono-tabular text-xs sm:text-sm font-semibold mt-0.5">
                  {formatTimeShort(row.time)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Continue Reading + Worship Summary Strip */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => openQuranSurah(state.lastReadQuran?.surah || 1)}
          className="md:col-span-2 text-left rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 shadow-xs hover:border-emerald-600/50 transition-colors flex items-center justify-between gap-4 min-h-[84px]"
        >
          <div>
            <p className="text-xs font-medium text-emerald-700 dark:text-[#F5E6BE]">
              {isBn ? 'সর্বশেষ পাঠ' : 'Continue Quran Reading'}
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Surah #{state.lastReadQuran?.surah || 1} · Ayah {state.lastReadQuran?.ayah || 1}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isBn
                ? `আজ পাঠ করেছেন: ${todayWorship.quranAyahsRead} আয়াত`
                : `Today's Quran progress: ${todayWorship.quranAyahsRead} Ayahs`}
            </p>
          </div>
          <span className="px-4 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold whitespace-nowrap shrink-0">
            {isBn ? 'পড়া শুরু করুন' : 'Resume'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tasbih')}
          className="text-left rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 shadow-xs hover:border-emerald-600/50 transition-colors flex items-center justify-between gap-4 min-h-[84px]"
        >
          <div>
            <p className="text-xs font-medium text-emerald-700 dark:text-[#F5E6BE]">
              {t.todayCount} {t.tasbihTitle}
            </p>
            <p className="font-mono-tabular text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
              {todayWorship.tasbihCount}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono-tabular">
              {t.lifetimeCount}: {state.tasbihLifetimeCount}
            </p>
          </div>
          <span className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/60 text-emerald-900 dark:text-[#F5E6BE] text-xs font-semibold">
            {isBn ? 'তসবি' : 'Count'}
          </span>
        </button>
      </section>

      {/* Daily Spiritual Reflections: Verse, Hadith, Dua */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <article className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-emerald-800 dark:text-[#F5E6BE]">{t.dailyVerse}</span>
              <span>{isBn ? dailyVerse.surahNameBn : dailyVerse.surahNameEn}</span>
            </div>
            <p className="font-arabic text-2xl text-right text-slate-900 dark:text-white leading-loose">
              {dailyVerse.arabic}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-bengali">
              {isBn ? dailyVerse.bengali : dailyVerse.english}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('quran')}
            className="text-xs font-semibold text-emerald-800 dark:text-[#F5E6BE] hover:underline self-start min-h-[36px]"
          >
            {isBn ? 'পবিত্র কোরআন পড়ুন →' : 'Open Holy Quran →'}
          </button>
        </article>

        <article className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-emerald-800 dark:text-[#F5E6BE]">{t.dailyHadith}</span>
              <span>{dailyHadith.reference}</span>
            </div>
            <p className="font-arabic text-xl text-right text-slate-900 dark:text-white leading-loose">
              {dailyHadith.arabic}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-bengali">
              {isBn ? dailyHadith.bengali : dailyHadith.english}
            </p>
          </div>
          <button
            type="button"
            onClick={() => openMoreFeature('hadith')}
            className="text-xs font-semibold text-emerald-800 dark:text-[#F5E6BE] hover:underline self-start min-h-[36px]"
          >
            {isBn ? 'আরও হাদিস দেখুন →' : 'Read More Hadith →'}
          </button>
        </article>

        <article className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-emerald-800 dark:text-[#F5E6BE]">{t.dailyDua}</span>
              <span>{dailyDua.reference}</span>
            </div>
            <p className="font-arabic text-xl text-right text-slate-900 dark:text-white leading-loose">
              {dailyDua.arabic}
            </p>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 font-bengali">
              {dailyDua.bengaliPronunciation}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-bengali">
              {isBn ? dailyDua.bengaliMeaning : dailyDua.englishMeaning}
            </p>
          </div>
          <button
            type="button"
            onClick={() => openMoreFeature('duas')}
            className="text-xs font-semibold text-emerald-800 dark:text-[#F5E6BE] hover:underline self-start min-h-[36px]"
          >
            {isBn ? 'সব দোয়া দেখুন →' : 'Browse All Duas →'}
          </button>
        </article>
      </section>

      {/* Quick Access Feature Grid */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.quickAccess}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {quickActions.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              className="group text-left rounded-2xl bg-white dark:bg-[#0B261E] p-4 border border-slate-200 dark:border-emerald-900/60 hover:border-emerald-600/60 dark:hover:border-[#D4AF37]/50 transition-all min-h-[76px] flex items-center gap-3.5"
            >
              <span className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/60 text-emerald-800 dark:text-[#F5E6BE] flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {item.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {item.sub}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>
      {/* Phone Install & APK Download Banner */}
      <section className="rounded-2xl bg-[#042F24] text-white p-5 border border-[#D4AF37]/35 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <span className="w-11 h-11 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F5E6BE] flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-white font-bengali">
              {isBn
                ? 'SK NUR ফোনে ইনস্টল ও APK লিংক'
                : 'Install SK NUR on Phone & Get APK'}
            </h2>
            <p className="text-xs text-emerald-100/80 mt-0.5 font-bengali">
              {isBn
                ? 'Chrome ইনস্টল লিংক, অনলাইন APK তৈরি (PWABuilder), Android Studio ZIP ও Google Drive শেয়ার।'
                : 'Open Chrome install link, build APK online via PWABuilder, or download Android Studio ZIP.'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowInstallModal(true)}
            className="min-h-[42px] px-4 rounded-xl bg-[#D4AF37] hover:bg-[#e5c252] text-[#042F24] text-xs font-bold whitespace-nowrap transition-colors"
          >
            {isBn ? 'ইনস্টল ও APK লিংক দেখুন' : 'Open Install & APK Links'}
          </button>
          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="min-h-[42px] px-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{isBn ? 'ইনস্টল ও শেয়ার গাইড' : 'Install Guide'}</span>
          </button>
          <button
            type="button"
            onClick={() => openMoreFeature('android_drive' as MoreSubView)}
            className="min-h-[42px] px-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold whitespace-nowrap transition-colors"
          >
            {isBn ? 'Google Drive হাব' : 'Drive Hub'}
          </button>
        </div>
      </section>

      <LocationPickerModal
        open={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
      />
      <InstallAppModal
        open={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
      <AppInstallationGuideModal
        open={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        onOpenInstallHub={() => setShowInstallModal(true)}
      />
    </div>
  );
};
