import React, {useState} from 'react';
import {
  BookOpen,
  Clock,
  Download,
  Home,
  LayoutGrid,
  Moon,
  Pause,
  Play,
  Repeat,
  Square,
  Sun,
  WifiOff,
} from 'lucide-react';
import {motion, AnimatePresence} from 'motion/react';
import {useSkNur} from '../context/SkNurContext';
import {useOnlineStatus, usePWAInstall} from '../hooks/usePWAInstall';
import {islamicAudio} from '../lib/audioEngine';
import {InstallAppModal} from './InstallAppModal';
import type {Language, MainTab} from '../types/islamic';

const ICON_ASSET = '/src/assets/images/sk_nur_app_icon_1795107028776.jpg';

export const SplashScreen: React.FC<{onDone: () => void}> = ({onDone}) => {
  return (
    <motion.div
      initial={{opacity: 1}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.45}}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#042F24] text-white islamic-geo-pattern px-6"
    >
      <motion.div
        initial={{scale: 0.88, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        transition={{duration: 0.5, ease: [0.16, 1, 0.3, 1]}}
        className="flex flex-col items-center text-center"
      >
        <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl ring-2 ring-[#D4AF37]/50 mb-6 bg-[#064E3B] flex items-center justify-center">
          <img
            src={ICON_ASSET}
            alt="SK NUR Official Emblem"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="font-display text-4xl font-bold tracking-wide text-white">SK NUR</h1>
        <p className="mt-2 text-sm text-[#F5E6BE] font-bengali">
          নূর ও হেদায়েতের পূর্ণাঙ্গ ইসলামিক জীবনসঙ্গী
        </p>
        <div className="mt-8 w-44 h-1 rounded-full bg-white/15 overflow-hidden">
          <motion.div
            initial={{x: '-100%'}}
            animate={{x: '0%'}}
            transition={{duration: 1.05, ease: 'easeOut'}}
            onAnimationComplete={onDone}
            className="h-full bg-[#D4AF37]"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export const TopHeader: React.FC = () => {
  const {state, t, setLanguage, toggleDarkMode, setActiveTab, setMoreSubView} = useSkNur();
  const {isInstalled} = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState(false);

  const langs: {code: Language; label: string}[] = [
    {code: 'bn', label: 'বাং'},
    {code: 'en', label: 'EN'},
    {code: 'ar', label: 'عر'},
  ];

  return (
    <>
      <header className="sticky top-0 z-30 h-14 bg-white/90 dark:bg-[#061C15]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-emerald-900/50">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('home');
              setMoreSubView('menu');
            }}
            className="flex items-center gap-2.5 min-h-[44px] whitespace-nowrap shrink-0 text-left focus-visible:outline-2 focus-visible:outline-emerald-600 rounded-lg"
          >
            <img
              src={ICON_ASSET}
              alt="SK NUR"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-[#C89F3C]/40"
            />
            <span className="font-display text-xl font-bold tracking-tight text-emerald-950 dark:text-white">
              SK NUR
            </span>
          </button>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="hover:text-emerald-800 dark:hover:text-[#F5E6BE] transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
            >
              {t.navHome}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quran')}
              className="hover:text-emerald-800 dark:hover:text-[#F5E6BE] transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
            >
              {t.navQuran}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('prayer')}
              className="hover:text-emerald-800 dark:hover:text-[#F5E6BE] transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
            >
              {t.navPrayer}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tasbih')}
              className="hover:text-emerald-800 dark:hover:text-[#F5E6BE] transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
            >
              {t.navTasbih}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('more');
                setMoreSubView('menu');
              }}
              className="hover:text-emerald-800 dark:hover:text-[#F5E6BE] transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
            >
              {t.navMore}
            </button>
          </nav>

          {/* Zone 3: Language + Theme + Primary Install CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-slate-100 dark:bg-emerald-950/80 rounded-lg p-0.5 border border-slate-200 dark:border-emerald-800/60">
              {langs.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap min-h-[32px] ${
                    state.settings.language === l.code
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-700 dark:text-[#F5E6BE] hover:bg-slate-100 dark:hover:bg-emerald-900/50 transition-colors"
            >
              {state.settings.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {!isInstalled && (
              <button
                type="button"
                onClick={() => setShowInstallModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
              >
                <Download className="w-4 h-4" />
                <span>
                  {state.settings.language === 'bn' ? 'ইনস্টল / APK' : 'Install / APK'}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      <InstallAppModal open={showInstallModal} onClose={() => setShowInstallModal(false)} />
    </>
  );
};

export const BottomNavigation: React.FC = () => {
  const {activeTab, setActiveTab, setMoreSubView, t} = useSkNur();

  const tabs: {id: MainTab; label: string; icon: React.ReactNode}[] = [
    {id: 'home', label: t.navHome, icon: <Home className="w-5 h-5" />},
    {id: 'quran', label: t.navQuran, icon: <BookOpen className="w-5 h-5" />},
    {id: 'prayer', label: t.navPrayer, icon: <Clock className="w-5 h-5" />},
    {
      id: 'tasbih',
      label: t.navTasbih,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="3" r="1.5" fill="currentColor" />
          <circle cx="19" cy="8" r="1.3" fill="currentColor" />
          <circle cx="5" cy="8" r="1.3" fill="currentColor" />
        </svg>
      ),
    },
    {id: 'more', label: t.navMore, icon: <LayoutGrid className="w-5 h-5" />},
  ];

  return (
    <nav
      aria-label="Primary Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-[#061C15]/95 backdrop-blur-md border-t border-slate-200 dark:border-emerald-900/60 pb-safe"
    >
      <div className="grid grid-cols-5 items-center h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'more') setMoreSubView('menu');
              }}
              className={`flex flex-col items-center justify-center min-h-[44px] h-full transition-colors ${
                isActive
                  ? 'text-emerald-800 dark:text-[#F5E6BE]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span className={isActive ? 'scale-105 transition-transform' : ''}>{tab.icon}</span>
              <span className="text-[11px] font-semibold mt-0.5 whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export const FloatingAudioAndOfflineBar: React.FC = () => {
  const {audioState} = useSkNur();
  const isOnline = useOnlineStatus();

  return (
    <>
      {!isOnline && (
        <div className="fixed top-16 right-4 z-40 flex items-center gap-2 rounded-xl bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Mode</span>
        </div>
      )}

      <AnimatePresence>
        {audioState.src && (
          <motion.div
            initial={{y: 40, opacity: 0}}
            animate={{y: 0, opacity: 1}}
            exit={{y: 40, opacity: 0}}
            className="fixed bottom-18 md:bottom-4 left-3 right-3 md:left-auto md:right-6 md:w-96 z-30 rounded-2xl bg-[#042F24] text-white border border-[#C89F3C]/40 shadow-2xl px-4 py-2.5 flex items-center justify-between gap-3"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#F5E6BE] truncate">{audioState.title}</p>
              <p className="text-[11px] text-emerald-200/80 truncate">{audioState.subtitle}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => islamicAudio.toggleRepeat()}
                aria-label="Toggle repeat"
                className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl transition-colors ${
                  audioState.repeat ? 'bg-[#C89F3C] text-[#042F24]' : 'hover:bg-white/10 text-emerald-100'
                }`}
              >
                <Repeat className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => islamicAudio.togglePlayPause()}
                aria-label={audioState.isPlaying ? 'Pause' : 'Play'}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white"
              >
                {audioState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => islamicAudio.stop()}
                aria-label="Stop audio"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl hover:bg-white/10 text-emerald-100"
              >
                <Square className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
