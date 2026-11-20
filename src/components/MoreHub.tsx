import React from 'react';
import {
  ArrowLeft,
  Bell,
  BookHeart,
  Calendar,
  Compass,
  FolderUp,
  GraduationCap,
  HeartHandshake,
  MoonStar,
  Music,
  Scale,
  Sparkles,
  User,
} from 'lucide-react';
import {useSkNur} from '../context/SkNurContext';
import {CalendarView, DuasView, HadithView} from './DuasHadithCalendar';
import {IslamicNamesView, KnowledgeView, QiblaView} from './QiblaKnowledgeNames';
import {MediaView, RamadanView, ZakatView} from './RamadanZakatMedia';
import {
  AndroidDriveHubView,
  NotificationsView,
  ProfileSettingsView,
} from './NotificationsProfileDrive';
import type {MoreSubView} from '../types/islamic';

export const MoreHub: React.FC = () => {
  const {state, t, moreSubView, setMoreSubView} = useSkNur();
  const isBn = state.settings.language === 'bn';

  const features: {
    id: MoreSubView;
    title: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'duas',
      title: t.duasTitle,
      desc: isBn ? 'সকাল-সন্ধ্যা, ঘুম, খাবার, সফর ও নামাজের দোয়া' : 'Morning, Evening, Travel, Wudu & Salah Duas',
      icon: <HeartHandshake className="w-5 h-5" />,
    },
    {
      id: 'hadith',
      title: t.hadithTitle,
      desc: isBn ? 'সহীহ বুখারী, মুসলিম, তিরমিযী ও সিহাহ সিত্তাহ' : 'Bukhari, Muslim, Abu Dawood, Tirmidhi, Nasai, Ibn Majah',
      icon: <BookHeart className="w-5 h-5" />,
    },
    {
      id: 'calendar',
      title: t.calendarTitle,
      desc: isBn ? 'হিজরি, বাংলা ও ইংরেজি তারিখ এবং ইসলামিক দিবস' : 'Hijri, Bengali & English Dates + Islamic Events',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'qibla',
      title: t.qiblaTitle,
      desc: isBn ? 'কাবা শরীফের সঠিক দিক ও দূরত্ব নির্ণয়' : 'Live Compass Bearing & Distance to Makkah',
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: 'knowledge',
      title: t.knowledgeTitle,
      desc: isBn ? '৬ কালিমা, অজু, নামাজ, গোসল, নবীদের জীবনী ও কুইজ' : 'Six Kalimas, Pillars, Wudu, Salah, Stories & Quiz',
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      id: 'ramadan',
      title: t.ramadanTitle,
      desc: isBn ? 'সেহরি ও ইফতারের সময়, রোজা ও তারাবি ট্র্যাকার' : 'Sehri/Iftar Calendar, Fasting & Taraweeh Tracker',
      icon: <MoonStar className="w-5 h-5" />,
    },
    {
      id: 'zakat',
      title: t.zakatTitle,
      desc: isBn ? 'নগদ, স্বর্ণ, রুপা ও ব্যবসার ২.৫% যাকাত হিসাব' : 'Cash, Gold, Silver, Business & Nisab Calculator',
      icon: <Scale className="w-5 h-5" />,
    },
    {
      id: 'names',
      title: t.namesTitle,
      desc: isBn ? 'মুসলিম ছেলে ও মেয়েদের অর্থসহ সুন্দর নাম' : 'Muslim Baby Boy & Girl Names with Meanings',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: 'media',
      title: t.mediaTitle,
      desc: isBn ? 'কোরআন তেলাওয়াত ও আজান অডিও প্লেয়ার' : 'Quran Recitations & Maqam Hijaz Adhan Audio',
      icon: <Music className="w-5 h-5" />,
    },
    {
      id: 'notifications',
      title: t.notificationsTitle,
      desc: isBn ? 'নামাজ, যিকির, জুমুআ ও কাস্টম রিমাইন্ডার' : 'Prayer, Azkar, Jumuah & Custom Alerts',
      icon: <Bell className="w-5 h-5" />,
    },
    {
      id: 'android_drive',
      title: t.androidDriveTitle,
      desc: isBn ? 'Android Studio প্রজেক্ট, লোগো PNG ও Google Drive' : 'Android Studio ZIP, PNG Icon & Google Drive Share',
      icon: <FolderUp className="w-5 h-5" />,
    },
    {
      id: 'profile',
      title: t.profileTitle,
      desc: isBn ? 'Google সাইন-ইন, ভাষা, ডার্ক মোড ও ব্যাকআপ' : 'Account, Language, Theme, Backup & Privacy',
      icon: <User className="w-5 h-5" />,
    },
  ];

  const currentMeta = features.find((f) => f.id === moreSubView);

  if (moreSubView !== 'menu') {
    return (
      <div className="space-y-5 pb-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMoreSubView('menu')}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white dark:bg-[#0B261E] border border-slate-200 dark:border-emerald-900/60 text-slate-800 dark:text-white hover:bg-emerald-800 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              {currentMeta?.title || t.navMore}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{currentMeta?.desc}</p>
          </div>
        </div>

        {moreSubView === 'duas' && <DuasView />}
        {moreSubView === 'hadith' && <HadithView />}
        {moreSubView === 'calendar' && <CalendarView />}
        {moreSubView === 'qibla' && <QiblaView />}
        {moreSubView === 'knowledge' && <KnowledgeView />}
        {moreSubView === 'ramadan' && <RamadanView />}
        {moreSubView === 'zakat' && <ZakatView />}
        {moreSubView === 'names' && <IslamicNamesView />}
        {moreSubView === 'media' && <MediaView />}
        {moreSubView === 'notifications' && <NotificationsView />}
        {moreSubView === 'android_drive' && <AndroidDriveHubView />}
        {moreSubView === 'profile' && <ProfileSettingsView />}
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {isBn ? 'সকল ইসলামিক সেবা ও টুলস' : 'All Islamic Features & Tools'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {isBn
            ? 'দোয়া, হাদিস, ক্যালেন্ডার, কিবলা, রমজান, যাকাত ও Google Drive সিঙ্ক'
            : 'Duas, Hadith, Calendar, Qibla, Ramadan, Zakat, Android Project & Drive Sync'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {features.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setMoreSubView(f.id)}
            className="group text-left rounded-2xl bg-white dark:bg-[#0B261E] p-4 sm:p-5 border border-slate-200 dark:border-emerald-900/60 hover:border-emerald-600/60 transition-all flex items-start gap-4 min-h-[88px]"
          >
            <span className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/60 text-emerald-800 dark:text-[#F5E6BE] flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
              {f.icon}
            </span>
            <div className="min-w-0">
              <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {f.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {f.desc}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
