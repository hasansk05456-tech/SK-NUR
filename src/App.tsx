import React, {useState} from 'react';
import {AnimatePresence} from 'motion/react';
import {SkNurProvider, useSkNur} from './context/SkNurContext';
import {
  BottomNavigation,
  FloatingAudioAndOfflineBar,
  SplashScreen,
  TopHeader,
} from './components/SplashAndChrome';
import {HomeDashboard} from './components/HomeDashboard';
import {QuranSection} from './components/QuranSection';
import {PrayerSection} from './components/PrayerSection';
import {TasbihSection} from './components/TasbihSection';
import {MoreHub} from './components/MoreHub';

const AppShell: React.FC = () => {
  const {activeTab, state} = useSkNur();
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return sessionStorage.getItem('sknur_splash_seen') !== '1';
    } catch {
      return true;
    }
  });
  const isRtl = state.settings.language === 'ar';

  const handleSplashDone = () => {
    try {
      sessionStorage.setItem('sknur_splash_seen', '1');
    } catch {
      // Ignore storage error
    }
    setShowSplash(false);
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col">
      <AnimatePresence>
        {showSplash && <SplashScreen onDone={handleSplashDone} />}
      </AnimatePresence>

      <TopHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-24 md:pb-12">
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'quran' && <QuranSection />}
        {activeTab === 'prayer' && <PrayerSection />}
        {activeTab === 'tasbih' && <TasbihSection />}
        {activeTab === 'more' && <MoreHub />}
      </main>

      <FloatingAudioAndOfflineBar />
      <BottomNavigation />
    </div>
  );
};

export default function App() {
  return (
    <SkNurProvider>
      <AppShell />
    </SkNurProvider>
  );
}
