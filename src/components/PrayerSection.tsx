import React, {useMemo, useState} from 'react';
import {
  Bell,
  BellOff,
  CheckCircle2,
  Circle,
  Compass,
  Loader2,
  MapPin,
  Search,
  Sunrise,
  Sunset,
  Volume2,
} from 'lucide-react';
import {useSkNur} from '../context/SkNurContext';
import {
  CALCULATION_METHODS,
  computePrayerDay,
  formatCountdown,
  formatTimeShort,
  PRESET_CITIES,
} from '../lib/prayerUtils';
import {islamicAudio} from '../lib/audioEngine';
import {LocationPickerModal} from './LocationPickerModal';
import type {CalculationMethodKey, MadhabKey} from '../types/islamic';

export const PrayerSection: React.FC = () => {
  const {
    state,
    t,
    now,
    prayerDay,
    updateSettings,
    detectGPSLocation,
    openMoreFeature,
    todayWorship,
    togglePrayerCompleted,
  } = useSkNur();

  const isBn = state.settings.language === 'bn';
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);
  const [showMonthly, setShowMonthly] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const handleGPS = async () => {
    setGpsLoading(true);
    setGpsStatus(null);
    try {
      const locName = await detectGPSLocation();
      setGpsStatus(isBn ? `লোকেশন আপডেট হয়েছে: ${locName}` : `Updated: ${locName}`);
    } catch (err) {
      setGpsStatus(err instanceof Error ? err.message : 'GPS failed');
    } finally {
      setGpsLoading(false);
    }
  };

  const handleEnableNotifications = async () => {
    if (!('Notification' in window)) {
      setGpsStatus('Browser notifications are not supported here.');
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      updateSettings({notificationsEnabled: true});
      new Notification('SK NUR Adhan Reminders Enabled', {
        body: `Next prayer: ${prayerDay.nextPrayer} at ${formatTimeShort(prayerDay.nextPrayerTime)}`,
        icon: '/pwa-192x192.png',
      });
    } else {
      updateSettings({notificationsEnabled: false});
      setGpsStatus(isBn ? 'নোটিফিকেশন অনুমতি দেওয়া হয়নি।' : 'Notification permission denied.');
    }
  };

  const toggleSinglePrayerReminder = (key: string) => {
    updateSettings({
      prayerReminders: {
        ...state.settings.prayerReminders,
        [key]: !state.settings.prayerReminders[key],
      },
    });
  };

  const monthlyTimetable = useMemo(() => {
    if (!showMonthly) return [];
    const list = [];
    const base = new Date(now.getFullYear(), now.getMonth(), 1);
    for (let i = 0; i < 30; i++) {
      const d = new Date(base.getTime() + i * 86400000);
      const pt = computePrayerDay(
        d,
        state.settings.location.latitude,
        state.settings.location.longitude,
        state.settings.calculationMethod,
        state.settings.madhab
      );
      list.push({date: d, pt});
    }
    return list;
  }, [
    showMonthly,
    now.getMonth(),
    now.getFullYear(),
    state.settings.location.latitude,
    state.settings.location.longitude,
    state.settings.calculationMethod,
    state.settings.madhab,
  ]);

  const prayers = [
    {key: 'Fajr', label: t.fajr, time: prayerDay.fajr},
    {key: 'Dhuhr', label: t.dhuhr, time: prayerDay.dhuhr},
    {key: 'Asr', label: t.asr, time: prayerDay.asr},
    {key: 'Maghrib', label: t.maghrib, time: prayerDay.maghrib},
    {key: 'Isha', label: t.isha, time: prayerDay.isha},
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Top Countdown & Sun Times */}
      <div className="rounded-3xl bg-[#042F24] text-white p-6 border border-[#C89F3C]/35 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <button
            type="button"
            onClick={() => setShowLocationPicker(true)}
            className="text-xs font-medium text-[#F5E6BE] flex items-center gap-1.5 underline decoration-[#D4AF37]/60 underline-offset-4 hover:text-white"
          >
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>
              {state.settings.location.name}, {state.settings.location.country}
            </span>
          </button>
          <h2 className="font-display text-3xl font-bold mt-1">{prayerDay.nextPrayer}</h2>
          <p className="font-mono-tabular text-3xl font-bold text-[#F5E6BE] mt-2">
            -{formatCountdown(prayerDay.nextPrayerTime, now)}
          </p>
          <p className="text-xs text-emerald-100/80 mt-1">
            {isBn ? 'সময়' : 'Starts at'}: {formatTimeShort(prayerDay.nextPrayerTime)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-black/30 p-3.5 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-[#F5E6BE]">
              <Sunrise className="w-4 h-4" />
              <span>{t.sunrise}</span>
            </div>
            <p className="font-mono-tabular text-base font-bold mt-1">
              {formatTimeShort(prayerDay.sunrise)}
            </p>
          </div>
          <div className="rounded-2xl bg-black/30 p-3.5 border border-white/10">
            <div className="flex items-center gap-1.5 text-xs text-[#F5E6BE]">
              <Sunset className="w-4 h-4" />
              <span>{t.sunset}</span>
            </div>
            <p className="font-mono-tabular text-base font-bold mt-1">
              {formatTimeShort(prayerDay.maghrib)}
            </p>
          </div>
          <div className="rounded-2xl bg-black/30 p-3.5 border border-white/10">
            <p className="text-xs text-emerald-200/80">
              {isBn ? 'তাহাজ্জুদ (শেষ তৃতীয়াংশ)' : 'Tahajjud (Last 3rd)'}
            </p>
            <p className="font-mono-tabular text-base font-bold mt-1">
              {formatTimeShort(prayerDay.lastThirdOfTheNight)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => openMoreFeature('qibla')}
            className="rounded-2xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 p-3.5 border border-[#D4AF37]/40 text-left transition-colors"
          >
            <div className="flex items-center gap-1.5 text-xs text-[#F5E6BE] font-semibold">
              <Compass className="w-4 h-4" />
              <span>{t.qiblaTitle}</span>
            </div>
            <p className="text-xs text-white/90 mt-1">{isBn ? 'কিবলা দিক দেখুন →' : 'Open Compass →'}</p>
          </button>
        </div>
      </div>

      {/* Daily Prayer Rows with Completion & Reminder Toggles */}
      <div className="rounded-2xl bg-white dark:bg-[#0B261E] border border-slate-200 dark:border-emerald-900/60 divide-y divide-slate-100 dark:divide-emerald-900/50">
        {prayers.map((p) => {
          const isNext = prayerDay.nextPrayer === p.key;
          const completed = todayWorship.prayersCompleted.includes(p.key);
          const remEnabled = state.settings.prayerReminders[p.key] ?? true;
          return (
            <div
              key={p.key}
              className={`px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 ${
                isNext ? 'bg-emerald-50/70 dark:bg-emerald-900/30' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => togglePrayerCompleted(p.key)}
                className="flex items-center gap-3 min-h-[44px] text-left flex-1"
              >
                {completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
                )}
                <div>
                  <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {p.label}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isNext
                      ? isBn
                        ? 'পরবর্তী ওয়াক্ত'
                        : 'Upcoming Prayer'
                      : completed
                        ? isBn
                          ? 'আদায় সম্পন্ন'
                          : 'Completed'
                        : isBn
                          ? 'টিক দিতে ট্যাপ করুন'
                          : 'Tap to mark prayed'}
                  </p>
                </div>
              </button>

              <div className="flex items-center gap-3">
                <span className="font-mono-tabular text-base font-bold text-slate-900 dark:text-[#F5E6BE]">
                  {formatTimeShort(p.time)}
                </span>
                <button
                  type="button"
                  onClick={() => toggleSinglePrayerReminder(p.key)}
                  aria-label={`Toggle ${p.key} reminder`}
                  className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl transition-colors ${
                    remEnabled
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-[#F5E6BE]'
                      : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-emerald-950'
                  }`}
                >
                  {remEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Location, Method, Madhab & Adhan Audio Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isBn ? 'অবস্থান ও হিসাব পদ্ধতি' : 'Location & Calculation Settings'}
          </h3>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowLocationPicker(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#e5c252] text-[#042F24] text-xs font-bold min-h-[44px]"
            >
              <Search className="w-4 h-4" />
              <span>{isBn ? 'ইন্ডিয়া / সব লোকেশন খুঁজুন' : 'Search India / Any City'}</span>
            </button>

            <button
              type="button"
              onClick={handleGPS}
              disabled={gpsLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold min-h-[44px]"
            >
              {gpsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
              <span>{isBn ? 'অটো GPS' : 'Auto GPS'}</span>
            </button>

            <select
              aria-label="Select City"
              value={
                PRESET_CITIES.find(
                  (c) =>
                    c.name === state.settings.location.name &&
                    c.country === state.settings.location.country
                )?.name || ''
              }
              onChange={(e) => {
                const city = PRESET_CITIES.find((c) => c.name === e.target.value);
                if (city) updateSettings({location: city});
              }}
              className="min-h-[44px] px-3 rounded-xl bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 text-xs font-medium text-slate-800 dark:text-white"
            >
              <option value="" disabled>
                {isBn ? 'শহর / জেলা নির্বাচন করুন' : 'Select City / District'}
              </option>
              <optgroup label="India (ভারত)">
                {PRESET_CITIES.filter((c) => c.country === 'India').map((c) => (
                  <option key={`in-${c.name}`} value={c.name}>
                    {c.name}, India
                  </option>
                ))}
              </optgroup>
              <optgroup label="Bangladesh (বাংলাদেশ)">
                {PRESET_CITIES.filter((c) => c.country === 'Bangladesh').map((c) => (
                  <option key={`bd-${c.name}`} value={c.name}>
                    {c.name}, Bangladesh
                  </option>
                ))}
              </optgroup>
              <optgroup label="Global">
                {PRESET_CITIES.filter(
                  (c) => c.country !== 'India' && c.country !== 'Bangladesh'
                ).map((c) => (
                  <option key={`gl-${c.name}`} value={c.name}>
                    {c.name}, {c.country}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {gpsStatus && <p className="text-xs text-emerald-700 dark:text-emerald-300">{gpsStatus}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {isBn ? 'হিসাব পদ্ধতি' : 'Calculation Method'}
              </label>
              <select
                value={state.settings.calculationMethod}
                onChange={(e) =>
                  updateSettings({calculationMethod: e.target.value as CalculationMethodKey})
                }
                className="w-full min-h-[44px] px-3 rounded-xl bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 text-xs text-slate-800 dark:text-white"
              >
                {CALCULATION_METHODS.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {isBn ? 'আসর মাজহাব' : 'Asr Juristic Method'}
              </label>
              <select
                value={state.settings.madhab}
                onChange={(e) => updateSettings({madhab: e.target.value as MadhabKey})}
                className="w-full min-h-[44px] px-3 rounded-xl bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 text-xs text-slate-800 dark:text-white"
              >
                <option value="Hanafi">Hanafi (Standard South Asia)</option>
                <option value="Shafi">Shafi / Maliki / Hanbali</option>
              </select>
            </div>
          </div>
        </div>

        {/* Adhan Notifications & Monthly Timetable Trigger */}
        <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isBn ? 'আজান নোটিফিকেশন ও মাসিক সূচি' : 'Adhan Alerts & Monthly Timetable'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isBn
                ? 'পাঁচ ওয়াক্ত নামাজের আগে রিমাইন্ডার এবং আজান ধ্বনি চালু করুন।'
                : 'Enable browser prayer reminders and test the soothing Hijaz Adhan chime.'}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleEnableNotifications}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold min-h-[44px]"
              >
                <Bell className="w-4 h-4" />
                <span>
                  {state.settings.notificationsEnabled
                    ? isBn
                      ? 'নোটিফিকেশন চালু আছে'
                      : 'Notifications Active'
                    : isBn
                      ? 'নোটিফিকেশন চালু করুন'
                      : 'Enable Prayer Alerts'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => islamicAudio.playAdhanChime('SK NUR Adhan Chime')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-[#F5E6BE] text-xs font-semibold hover:bg-slate-50 dark:hover:bg-emerald-900/50 min-h-[44px]"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isBn ? 'আজান ধ্বনি শুনুন' : 'Play Adhan Chime'}</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowMonthly((v) => !v)}
            className="w-full min-h-[44px] rounded-xl bg-slate-100 dark:bg-emerald-950 text-emerald-900 dark:text-[#F5E6BE] text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
          >
            {showMonthly
              ? isBn
                ? 'মাসিক সময়সূচী লুকান'
                : 'Hide 30-Day Timetable'
              : isBn
                ? '৩০ দিনের মাসিক সময়সূচী দেখুন'
                : 'View 30-Day Monthly Timetable'}
          </button>
        </div>
      </div>

      {/* 30-Day Monthly Timetable */}
      {showMonthly && (
        <div className="rounded-2xl bg-white dark:bg-[#0B261E] border border-slate-200 dark:border-emerald-900/60 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-emerald-900 text-white">
                <th className="p-3">Date</th>
                <th className="p-3">{t.fajr}</th>
                <th className="p-3">{t.sunrise}</th>
                <th className="p-3">{t.dhuhr}</th>
                <th className="p-3">{t.asr}</th>
                <th className="p-3">{t.maghrib}</th>
                <th className="p-3">{t.isha}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-emerald-900/50 font-mono-tabular">
              {monthlyTimetable.map((row) => (
                <tr
                  key={row.date.toISOString()}
                  className={
                    row.date.toDateString() === now.toDateString()
                      ? 'bg-emerald-50 dark:bg-emerald-900/40 font-bold'
                      : ''
                  }
                >
                  <td className="p-3 whitespace-nowrap">
                    {row.date.toLocaleDateString([], {day: '2-digit', month: 'short'})}
                  </td>
                  <td className="p-3">{formatTimeShort(row.pt.fajr)}</td>
                  <td className="p-3">{formatTimeShort(row.pt.sunrise)}</td>
                  <td className="p-3">{formatTimeShort(row.pt.dhuhr)}</td>
                  <td className="p-3">{formatTimeShort(row.pt.asr)}</td>
                  <td className="p-3">{formatTimeShort(row.pt.maghrib)}</td>
                  <td className="p-3">{formatTimeShort(row.pt.isha)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <LocationPickerModal
        open={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
      />
    </div>
  );
};
