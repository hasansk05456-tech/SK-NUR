import React, {createContext, useContext, useEffect, useMemo, useRef, useState, useCallback} from 'react';
import type {User} from 'firebase/auth';
import {
  computePrayerDay,
  getBengaliDateInfo,
  getHijriDateInfo,
  PRESET_CITIES,
  reverseGeocodeLocation,
  type ComputedPrayerDay,
} from '../lib/prayerUtils';
import {
  getAccessToken,
  googleSignIn,
  initAuth,
  logout as firebaseLogout,
} from '../lib/authAndDrive';
import {TRANSLATIONS, type TranslationBundle} from '../lib/i18n';
import {islamicAudio, type AudioTrackState} from '../lib/audioEngine';
import type {
  AppSettings,
  CustomReminder,
  Language,
  LocationConfig,
  MainTab,
  MoreSubView,
  TasbihPreset,
  UserPersistedState,
  WorshipDayLog,
} from '../types/islamic';

const STORAGE_KEY = 'sknur_app_state_v1';

const DEFAULT_SETTINGS: AppSettings = {
  language: 'bn',
  darkMode: false,
  arabicFontSize: 28,
  calculationMethod: 'Karachi',
  madhab: 'Hanafi',
  location: PRESET_CITIES[0],
  notificationsEnabled: false,
  adhanSoundEnabled: true,
  prayerReminders: {
    Fajr: true,
    Dhuhr: true,
    Asr: true,
    Maghrib: true,
    Isha: true,
  },
  azkarMorningReminder: true,
  azkarEveningReminder: true,
  dailyQuranReminder: true,
  dailyHadithReminder: true,
  jumuahReminder: true,
  ramadanReminder: true,
  profileName: 'SK NUR User',
  profileEmail: '',
  privacyHideStats: false,
};

const DEFAULT_REMINDERS: CustomReminder[] = [
  {id: 'r-morning', title: 'Morning Azkar & Surah Yasin', time: '06:00', enabled: true, type: 'azkar'},
  {id: 'r-quran', title: 'Daily Quran Reading (10 Ayahs)', time: '07:30', enabled: true, type: 'quran'},
  {id: 'r-evening', title: 'Evening Azkar & Istighfar', time: '17:45', enabled: true, type: 'azkar'},
  {id: 'r-jumuah', title: 'Jumuah Preparation & Surah Al-Kahf', time: '11:30', enabled: true, type: 'jumuah'},
];

const DEFAULT_STATE: UserPersistedState = {
  settings: DEFAULT_SETTINGS,
  bookmarkedAyahs: ['1:1', '2:255'],
  bookmarkedHadiths: ['bukhari-1'],
  favoriteDuas: ['morning-1', 'parents-1'],
  favoriteNames: ['b1', 'g1'],
  lastReadQuran: {surah: 1, ayah: 1, timestamp: new Date().toISOString()},
  tasbihLifetimeCount: 0,
  tasbihDailyHistory: {},
  customTasbihs: [],
  worshipLogs: {},
  ramadanChecklist: {},
  customReminders: DEFAULT_REMINDERS,
};

function loadInitialState(): UserPersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<UserPersistedState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings || {}),
        location: {
          ...DEFAULT_SETTINGS.location,
          ...(parsed.settings?.location || {}),
        },
        prayerReminders: {
          ...DEFAULT_SETTINGS.prayerReminders,
          ...(parsed.settings?.prayerReminders || {}),
        },
      },
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function getTodayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

interface SkNurContextValue {
  state: UserPersistedState;
  t: TranslationBundle;
  now: Date;
  prayerDay: ComputedPrayerDay;
  hijriInfo: ReturnType<typeof getHijriDateInfo>;
  bengaliInfo: ReturnType<typeof getBengaliDateInfo>;
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  moreSubView: MoreSubView;
  setMoreSubView: (view: MoreSubView) => void;
  openMoreFeature: (view: MoreSubView) => void;
  selectedSurahNumber: number;
  setSelectedSurahNumber: (n: number) => void;
  openQuranSurah: (surahNumber: number) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  setLanguage: (lang: Language) => void;
  toggleDarkMode: () => void;
  detectGPSLocation: () => Promise<string>;
  toggleAyahBookmark: (key: string) => void;
  toggleHadithBookmark: (id: string) => void;
  toggleDuaFavorite: (id: string) => void;
  toggleNameFavorite: (id: string) => void;
  recordQuranRead: (surah: number, ayah: number) => void;
  incrementTasbihStats: (amount?: number) => void;
  addCustomTasbih: (preset: TasbihPreset) => void;
  togglePrayerCompleted: (prayerName: string) => void;
  toggleRamadanDayFlag: (field: 'fasted' | 'taraweeh') => void;
  toggleRamadanChecklistItem: (key: string) => void;
  addCustomReminder: (reminder: Omit<CustomReminder, 'id'>) => void;
  toggleCustomReminder: (id: string) => void;
  deleteCustomReminder: (id: string) => void;
  restoreFullState: (incoming: Partial<UserPersistedState>) => void;
  resetAllLocalData: () => void;
  googleUser: User | null;
  driveTokenReady: boolean;
  isSigningIn: boolean;
  signInWithGoogle: () => Promise<string | null>;
  signOutGoogle: () => Promise<void>;
  audioState: AudioTrackState;
  todayWorship: WorshipDayLog;
  syncToServer: () => Promise<boolean>;
}

const SkNurContext = createContext<SkNurContextValue | null>(null);

export const SkNurProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [state, setState] = useState<UserPersistedState>(loadInitialState);
  const [now, setNow] = useState<Date>(() => new Date());
  const [activeTab, setActiveTabState] = useState<MainTab>('home');
  const [moreSubView, setMoreSubViewState] = useState<MoreSubView>('menu');
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number>(
    () => loadInitialState().lastReadQuran?.surah || 1
  );
  const isHandlingPopStateRef = useRef(false);

  const pushNavHistory = useCallback((tab: MainTab, sub: MoreSubView) => {
    if (typeof window === 'undefined' || isHandlingPopStateRef.current) return;
    try {
      const current = window.history.state as {sknurTab?: MainTab; sknurSub?: MoreSubView} | null;
      if (current?.sknurTab === tab && current?.sknurSub === sub) return;
      window.history.pushState({sknurTab: tab, sknurSub: sub}, '');
    } catch {
      // Ignore restricted history environments
    }
  }, []);

  const setActiveTab = useCallback(
    (tab: MainTab) => {
      setActiveTabState(tab);
      const nextSub = tab === 'more' ? moreSubView : 'menu';
      if (tab !== 'more') {
        setMoreSubViewState('menu');
      }
      pushNavHistory(tab, nextSub);
    },
    [moreSubView, pushNavHistory]
  );

  const setMoreSubView = useCallback(
    (view: MoreSubView) => {
      setMoreSubViewState(view);
      pushNavHistory('more', view);
    },
    [pushNavHistory]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (!window.history.state?.sknurTab) {
        window.history.replaceState({sknurTab: 'home', sknurSub: 'menu'}, '');
      }
    } catch {
      // Ignore
    }

    const handlePopState = (e: PopStateEvent) => {
      const st = e.state as {sknurTab?: MainTab; sknurSub?: MoreSubView} | null;
      isHandlingPopStateRef.current = true;
      if (st?.sknurTab) {
        setActiveTabState(st.sknurTab);
        setMoreSubViewState(st.sknurSub || 'menu');
      } else {
        setActiveTabState('home');
        setMoreSubViewState('menu');
      }
      window.setTimeout(() => {
        isHandlingPopStateRef.current = false;
      }, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [driveTokenReady, setDriveTokenReady] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [audioState, setAudioState] = useState<AudioTrackState>(() => islamicAudio.getState());

  useEffect(() => {
    const unsub = islamicAudio.subscribe(setAudioState);
    return unsub;
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota error
    }
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    if (state.settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.settings.darkMode]);

  useEffect(() => {
    const unsub = initAuth(
      (user) => {
        setGoogleUser(user);
        setDriveTokenReady(!!getAccessToken());
      },
      (user) => {
        setGoogleUser(user);
        setDriveTokenReady(false);
      }
    );
    return () => unsub();
  }, []);

  const t = TRANSLATIONS[state.settings.language];

  const prayerDay = useMemo(
    () =>
      computePrayerDay(
        now,
        state.settings.location.latitude,
        state.settings.location.longitude,
        state.settings.calculationMethod,
        state.settings.madhab
      ),
    [
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      state.settings.location.latitude,
      state.settings.location.longitude,
      state.settings.calculationMethod,
      state.settings.madhab,
    ]
  );

  const hijriInfo = useMemo(() => getHijriDateInfo(now), [now.toDateString()]);
  const bengaliInfo = useMemo(() => getBengaliDateInfo(now), [now.toDateString()]);

  const todayKey = getTodayKey(now);
  const todayWorship: WorshipDayLog = state.worshipLogs[todayKey] || {
    prayersCompleted: [],
    quranAyahsRead: 0,
    tasbihCount: 0,
    fasted: false,
    taraweeh: false,
  };

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: {...prev.settings, ...partial},
    }));
  }, []);

  const setLanguage = useCallback(
    (language: Language) => {
      updateSettings({language});
    },
    [updateSettings]
  );

  const toggleDarkMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      settings: {...prev.settings, darkMode: !prev.settings.darkMode},
    }));
  }, []);

  const detectGPSLocation = useCallback(async (): Promise<string> => {
    if (!('geolocation' in navigator)) {
      throw new Error('Geolocation is not supported on this browser.');
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const rev = await reverseGeocodeLocation(lat, lng);
          const loc: LocationConfig = {
            name: rev?.name || `GPS (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
            country: rev?.country || 'Current Location',
            latitude: lat,
            longitude: lng,
            isAutoGPS: true,
          };
          updateSettings({location: loc});
          resolve(loc.name);
        },
        (err) => {
          reject(new Error(err.message || 'Location permission denied.'));
        },
        {enableHighAccuracy: true, timeout: 10000}
      );
    });
  }, [updateSettings]);

  const openMoreFeature = useCallback(
    (view: MoreSubView) => {
      setActiveTabState('more');
      setMoreSubViewState(view);
      pushNavHistory('more', view);
    },
    [pushNavHistory]
  );

  const openQuranSurah = useCallback(
    (surahNumber: number) => {
      setSelectedSurahNumber(surahNumber);
      setActiveTabState('quran');
      setMoreSubViewState('menu');
      pushNavHistory('quran', 'menu');
    },
    [pushNavHistory]
  );

  const toggleAyahBookmark = useCallback((key: string) => {
    setState((prev) => {
      const exists = prev.bookmarkedAyahs.includes(key);
      return {
        ...prev,
        bookmarkedAyahs: exists
          ? prev.bookmarkedAyahs.filter((k) => k !== key)
          : [...prev.bookmarkedAyahs, key],
      };
    });
  }, []);

  const toggleHadithBookmark = useCallback((id: string) => {
    setState((prev) => {
      const exists = prev.bookmarkedHadiths.includes(id);
      return {
        ...prev,
        bookmarkedHadiths: exists
          ? prev.bookmarkedHadiths.filter((k) => k !== id)
          : [...prev.bookmarkedHadiths, id],
      };
    });
  }, []);

  const toggleDuaFavorite = useCallback((id: string) => {
    setState((prev) => {
      const exists = prev.favoriteDuas.includes(id);
      return {
        ...prev,
        favoriteDuas: exists
          ? prev.favoriteDuas.filter((k) => k !== id)
          : [...prev.favoriteDuas, id],
      };
    });
  }, []);

  const toggleNameFavorite = useCallback((id: string) => {
    setState((prev) => {
      const exists = prev.favoriteNames.includes(id);
      return {
        ...prev,
        favoriteNames: exists
          ? prev.favoriteNames.filter((k) => k !== id)
          : [...prev.favoriteNames, id],
      };
    });
  }, []);

  const recordQuranRead = useCallback((surah: number, ayah: number) => {
    const key = getTodayKey();
    setState((prev) => {
      const curLog = prev.worshipLogs[key] || {
        prayersCompleted: [],
        quranAyahsRead: 0,
        tasbihCount: 0,
        fasted: false,
        taraweeh: false,
      };
      return {
        ...prev,
        lastReadQuran: {surah, ayah, timestamp: new Date().toISOString()},
        worshipLogs: {
          ...prev.worshipLogs,
          [key]: {...curLog, quranAyahsRead: curLog.quranAyahsRead + 1},
        },
      };
    });
  }, []);

  const incrementTasbihStats = useCallback((amount = 1) => {
    const key = getTodayKey();
    setState((prev) => {
      const curLog = prev.worshipLogs[key] || {
        prayersCompleted: [],
        quranAyahsRead: 0,
        tasbihCount: 0,
        fasted: false,
        taraweeh: false,
      };
      return {
        ...prev,
        tasbihLifetimeCount: prev.tasbihLifetimeCount + amount,
        tasbihDailyHistory: {
          ...prev.tasbihDailyHistory,
          [key]: (prev.tasbihDailyHistory[key] || 0) + amount,
        },
        worshipLogs: {
          ...prev.worshipLogs,
          [key]: {...curLog, tasbihCount: curLog.tasbihCount + amount},
        },
      };
    });
  }, []);

  const addCustomTasbih = useCallback((preset: TasbihPreset) => {
    setState((prev) => ({
      ...prev,
      customTasbihs: [...prev.customTasbihs, preset],
    }));
  }, []);

  const togglePrayerCompleted = useCallback((prayerName: string) => {
    const key = getTodayKey();
    setState((prev) => {
      const curLog = prev.worshipLogs[key] || {
        prayersCompleted: [],
        quranAyahsRead: 0,
        tasbihCount: 0,
        fasted: false,
        taraweeh: false,
      };
      const exists = curLog.prayersCompleted.includes(prayerName);
      const updated = exists
        ? curLog.prayersCompleted.filter((p) => p !== prayerName)
        : [...curLog.prayersCompleted, prayerName];
      return {
        ...prev,
        worshipLogs: {
          ...prev.worshipLogs,
          [key]: {...curLog, prayersCompleted: updated},
        },
      };
    });
  }, []);

  const toggleRamadanDayFlag = useCallback((field: 'fasted' | 'taraweeh') => {
    const key = getTodayKey();
    setState((prev) => {
      const curLog = prev.worshipLogs[key] || {
        prayersCompleted: [],
        quranAyahsRead: 0,
        tasbihCount: 0,
        fasted: false,
        taraweeh: false,
      };
      return {
        ...prev,
        worshipLogs: {
          ...prev.worshipLogs,
          [key]: {...curLog, [field]: !curLog[field]},
        },
      };
    });
  }, []);

  const toggleRamadanChecklistItem = useCallback((itemKey: string) => {
    setState((prev) => ({
      ...prev,
      ramadanChecklist: {
        ...prev.ramadanChecklist,
        [itemKey]: !prev.ramadanChecklist[itemKey],
      },
    }));
  }, []);

  const addCustomReminder = useCallback((reminder: Omit<CustomReminder, 'id'>) => {
    const id = `rem-${Date.now()}`;
    setState((prev) => ({
      ...prev,
      customReminders: [...prev.customReminders, {...reminder, id}],
    }));
  }, []);

  const toggleCustomReminder = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      customReminders: prev.customReminders.map((r) =>
        r.id === id ? {...r, enabled: !r.enabled} : r
      ),
    }));
  }, []);

  const deleteCustomReminder = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      customReminders: prev.customReminders.filter((r) => r.id !== id),
    }));
  }, []);

  const restoreFullState = useCallback((incoming: Partial<UserPersistedState>) => {
    setState((prev) => ({
      ...prev,
      ...incoming,
      settings: {
        ...prev.settings,
        ...(incoming.settings || {}),
      },
    }));
  }, []);

  const resetAllLocalData = useCallback(() => {
    setState(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setIsSigningIn(true);
    try {
      const res = await googleSignIn();
      setGoogleUser(res.user);
      setDriveTokenReady(true);
      if (res.user.displayName || res.user.email) {
        updateSettings({
          profileName: res.user.displayName || state.settings.profileName,
          profileEmail: res.user.email || state.settings.profileEmail,
        });
      }
      return res.accessToken;
    } finally {
      setIsSigningIn(false);
    }
  }, [state.settings.profileName, state.settings.profileEmail, updateSettings]);

  const signOutGoogle = useCallback(async () => {
    await firebaseLogout();
    setGoogleUser(null);
    setDriveTokenReady(false);
  }, []);

  const syncToServer = useCallback(async (): Promise<boolean> => {
    const uid = googleUser?.email || state.settings.profileEmail || 'local-device';
    try {
      const res = await fetch(`/api/sync/${encodeURIComponent(uid)}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(state),
      });
      return res.ok;
    } catch {
      return false;
    }
  }, [googleUser?.email, state]);

  return (
    <SkNurContext.Provider
      value={{
        state,
        t,
        now,
        prayerDay,
        hijriInfo,
        bengaliInfo,
        activeTab,
        setActiveTab,
        moreSubView,
        setMoreSubView,
        openMoreFeature,
        selectedSurahNumber,
        setSelectedSurahNumber,
        openQuranSurah,
        updateSettings,
        setLanguage,
        toggleDarkMode,
        detectGPSLocation,
        toggleAyahBookmark,
        toggleHadithBookmark,
        toggleDuaFavorite,
        toggleNameFavorite,
        recordQuranRead,
        incrementTasbihStats,
        addCustomTasbih,
        togglePrayerCompleted,
        toggleRamadanDayFlag,
        toggleRamadanChecklistItem,
        addCustomReminder,
        toggleCustomReminder,
        deleteCustomReminder,
        restoreFullState,
        resetAllLocalData,
        googleUser,
        driveTokenReady,
        isSigningIn,
        signInWithGoogle,
        signOutGoogle,
        audioState,
        todayWorship,
        syncToServer,
      }}
    >
      {children}
    </SkNurContext.Provider>
  );
};

export function useSkNur(): SkNurContextValue {
  const ctx = useContext(SkNurContext);
  if (!ctx) throw new Error('useSkNur must be used inside SkNurProvider');
  return ctx;
}
