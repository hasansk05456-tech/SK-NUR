import React, {useMemo, useState} from 'react';
import {CheckSquare, MoonStar, Play, Scale, Square, Volume2} from 'lucide-react';
import {useSkNur} from '../context/SkNurContext';
import {computePrayerDay, formatTimeShort} from '../lib/prayerUtils';
import {ALL_SURAHS} from '../data/quranMeta';
import {islamicAudio} from '../lib/audioEngine';

const RAMADAN_IMG = '/src/assets/images/ramadan_lantern_banner_1795107029679.jpg';

const RAMADAN_CHECKLIST_ITEMS = [
  {id: 'fajr_jamah', en: 'Fajr & Morning Azkar', bn: 'ফজর নামাজ ও সকালের যিকির'},
  {id: 'quran_juz', en: 'Read 1 Juz / 20 Pages of Quran', bn: 'কোরআন তেলাওয়াত (কমপক্ষে ৪ পৃষ্ঠা / ১ পারা)'},
  {id: 'charity', en: 'Daily Sadaqah (Charity)', bn: 'দৈনিক সদকা / দান'},
  {id: 'taraweeh', en: 'Taraweeh & Witr Prayer', bn: 'তারাবি ও বিতর নামাজ'},
  {id: 'istighfar', en: '100x Istighfar Before Iftar', bn: 'ইফতারের আগে ১০০ বার ইস্তিগফার'},
];

export const RamadanView: React.FC = () => {
  const {
    state,
    now,
    prayerDay,
    hijriInfo,
    todayWorship,
    toggleRamadanDayFlag,
    toggleRamadanChecklistItem,
    openMoreFeature,
  } = useSkNur();
  const isBn = state.settings.language === 'bn';

  // Approximate days until next Ramadan (month 9)
  const daysToRamadan = useMemo(() => {
    if (hijriInfo.monthIndex === 9) return 0;
    const monthsLeft =
      hijriInfo.monthIndex < 9 ? 9 - hijriInfo.monthIndex : 12 - hijriInfo.monthIndex + 9;
    return Math.max(1, monthsLeft * 29 - hijriInfo.day);
  }, [hijriInfo.monthIndex, hijriInfo.day]);

  const schedule30Days = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(now.getTime() + i * 86400000);
      const pt = computePrayerDay(
        d,
        state.settings.location.latitude,
        state.settings.location.longitude,
        state.settings.calculationMethod,
        state.settings.madhab
      );
      arr.push({dayNum: i + 1, date: d, sehriEnd: pt.fajr, iftar: pt.maghrib});
    }
    return arr;
  }, [
    now.toDateString(),
    state.settings.location.latitude,
    state.settings.location.longitude,
    state.settings.calculationMethod,
    state.settings.madhab,
  ]);

  return (
    <div className="space-y-6">
      {/* Ramadan Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#042F24] text-white border border-[#C89F3C]/35">
        <img
          src={RAMADAN_IMG}
          alt="Ramadan Lantern and Holy Quran"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#032119]/95 via-[#042F24]/80 to-[#042F24]/55" />
        <div className="relative z-10 p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-xs font-semibold text-[#F5E6BE]">
              {hijriInfo.monthIndex === 9
                ? isBn
                  ? 'রমজান মুবারক!'
                  : 'Ramadan Mubarak!'
                : isBn
                  ? `পরবর্তী রমজান বাকি প্রায় ${daysToRamadan} দিন`
                  : `Approx. ${daysToRamadan} days until Ramadan`}
            </p>
            <h3 className="font-display text-3xl font-bold mt-1">
              {isBn ? 'সেহরি ও ইফতারের সময়সূচী' : 'Sehri & Iftar Times'}
            </h3>
            <p className="text-xs text-emerald-100/80 mt-1">{state.settings.location.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-black/40 backdrop-blur-md p-4 border border-[#D4AF37]/30">
              <p className="text-xs text-[#F5E6BE]">
                {isBn ? 'সেহরির শেষ সময়' : 'Sehri Ends (Fajr)'}
              </p>
              <p className="font-mono-tabular text-2xl font-bold mt-1">
                {formatTimeShort(prayerDay.fajr)}
              </p>
            </div>
            <div className="rounded-2xl bg-black/40 backdrop-blur-md p-4 border border-[#D4AF37]/30">
              <p className="text-xs text-[#F5E6BE]">
                {isBn ? 'ইফতারের সময়' : 'Iftar (Maghrib)'}
              </p>
              <p className="font-mono-tabular text-2xl font-bold mt-1">
                {formatTimeShort(prayerDay.maghrib)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fasting Tracker + Taraweeh + Zakat Shortcut */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => toggleRamadanDayFlag('fasted')}
          className={`p-5 rounded-2xl border text-left transition-colors min-h-[84px] ${
            todayWorship.fasted
              ? 'bg-emerald-800 text-white border-emerald-700'
              : 'bg-white dark:bg-[#0B261E] text-slate-900 dark:text-white border-slate-200 dark:border-emerald-900/60'
          }`}
        >
          <p className="text-xs opacity-80">{isBn ? 'আজকের রোজা ট্র্যাকার' : "Today's Fast"}</p>
          <p className="text-base font-bold mt-1">
            {todayWorship.fasted
              ? isBn
                ? '✓ আজ রোজা রেখেছি (আলহামদুলিল্লাহ)'
                : '✓ Fast Recorded Today'
              : isBn
                ? 'রোজা রেকর্ড করতে ট্যাপ করুন'
                : 'Tap to Mark Fasted'}
          </p>
        </button>

        <button
          type="button"
          onClick={() => toggleRamadanDayFlag('taraweeh')}
          className={`p-5 rounded-2xl border text-left transition-colors min-h-[84px] ${
            todayWorship.taraweeh
              ? 'bg-emerald-800 text-white border-emerald-700'
              : 'bg-white dark:bg-[#0B261E] text-slate-900 dark:text-white border-slate-200 dark:border-emerald-900/60'
          }`}
        >
          <p className="text-xs opacity-80">{isBn ? 'তারাবি নামাজ (২০ রাকাত)' : 'Taraweeh Prayer'}</p>
          <p className="text-base font-bold mt-1">
            {todayWorship.taraweeh
              ? isBn
                ? '✓ তারাবি আদায় সম্পন্ন'
                : '✓ Taraweeh Completed'
              : isBn
                ? 'তারাবি আদায় হলে ট্যাপ করুন'
                : 'Tap to Mark Taraweeh'}
          </p>
        </button>

        <button
          type="button"
          onClick={() => openMoreFeature('zakat')}
          className="p-5 rounded-2xl bg-[#042F24] text-white border border-[#D4AF37]/40 text-left hover:bg-[#064E3B] transition-colors min-h-[84px]"
        >
          <p className="text-xs text-[#F5E6BE] flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" />
            <span>{isBn ? 'যাকাত ও ফিতরা' : 'Zakat Calculator'}</span>
          </p>
          <p className="text-base font-bold mt-1">
            {isBn ? 'যাকাত হিসাব করুন →' : 'Calculate 2.5% Zakat →'}
          </p>
        </button>
      </div>

      {/* Sehri & Iftar Duas + Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isBn ? 'সেহরি ও ইফতারের দোয়া' : 'Sehri & Iftar Duas'}
          </h3>
          <div className="space-y-2 pb-3 border-b border-slate-100 dark:border-emerald-900/50">
            <p className="text-xs font-bold text-emerald-800 dark:text-[#F5E6BE]">
              {isBn ? 'রোজার নিয়ত (সেহরি)' : 'Sehri Intention'}
            </p>
            <p className="font-arabic text-xl text-right text-slate-900 dark:text-white">
              نَوَيْتُ أَنْ أَصُومَ غَدًا مِنْ شَهْرِ رَمَضَانَ الْمُبَارَكِ فَرْضًا لَكَ يَا اللَّهُ
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-bengali">
              নাওয়াইতু আন আসূমা গাদাম মিন শাহরি রামাদানাল মুবারাকি ফারদাল্লাকা ইয়া আল্লাহ।
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-emerald-800 dark:text-[#F5E6BE]">
              {isBn ? 'ইফতারের দোয়া' : 'Iftar Dua'}
            </p>
            <p className="font-arabic text-xl text-right text-slate-900 dark:text-white">
              ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-bengali">
              যাহাবায-যামাউ ওয়াবতাল্লাতিল উরূকু, ওয়া সাবাতাল আজরু ইনশাআল্লাহ।
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isBn ? 'দৈনিক রমজান চেকলিস্ট' : 'Daily Ramadan Ibadah Checklist'}
          </h3>
          <div className="space-y-2">
            {RAMADAN_CHECKLIST_ITEMS.map((item) => {
              const checked = !!state.ramadanChecklist[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleRamadanChecklistItem(item.id)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-emerald-900/60 flex items-center gap-3 min-h-[48px] hover:bg-slate-50 dark:hover:bg-emerald-950/40"
                >
                  {checked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-700 dark:text-[#D4AF37] shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                  <span
                    className={`text-sm font-bengali ${
                      checked
                        ? 'line-through text-slate-400'
                        : 'text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {isBn ? item.bn : item.en}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 30-Day Sehri & Iftar Calendar */}
      <div className="rounded-2xl bg-white dark:bg-[#0B261E] border border-slate-200 dark:border-emerald-900/60 overflow-x-auto">
        <div className="p-4 border-b border-slate-100 dark:border-emerald-900/50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MoonStar className="w-4 h-4 text-emerald-700 dark:text-[#D4AF37]" />
            <span>
              {isBn
                ? '৩০ দিনের সেহরি ও ইফতার ক্যালেন্ডার (আপনার লোকেশন অনুযায়ী)'
                : '30-Day Sehri & Iftar Timetable (Location Calculated)'}
            </span>
          </h3>
        </div>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-emerald-900 text-white">
              <th className="p-3">#</th>
              <th className="p-3">Date</th>
              <th className="p-3">{isBn ? 'সেহরি শেষ' : 'Sehri Ends'}</th>
              <th className="p-3">{isBn ? 'ইফতার' : 'Iftar'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-emerald-900/50 font-mono-tabular">
            {schedule30Days.map((row) => (
              <tr key={row.dayNum}>
                <td className="p-3">{row.dayNum}</td>
                <td className="p-3">{row.date.toLocaleDateString([], {day: '2-digit', month: 'short'})}</td>
                <td className="p-3">{formatTimeShort(row.sehriEnd)}</td>
                <td className="p-3">{formatTimeShort(row.iftar)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ZakatView: React.FC = () => {
  const {state} = useSkNur();
  const isBn = state.settings.language === 'bn';

  const [currency, setCurrency] = useState<'BDT' | 'USD'>('BDT');
  const [nisabBase, setNisabBase] = useState<'silver' | 'gold'>('silver');
  const [cash, setCash] = useState<string>('150000');
  const [savings, setSavings] = useState<string>('50000');
  const [goldGrams, setGoldGrams] = useState<string>('0');
  const [goldPricePerGram, setGoldPricePerGram] = useState<string>('10500');
  const [silverGrams, setSilverGrams] = useState<string>('0');
  const [silverPricePerGram, setSilverPricePerGram] = useState<string>('160');
  const [businessAssets, setBusinessAssets] = useState<string>('0');
  const [liabilities, setLiabilities] = useState<string>('0');

  const n = (v: string) => Math.max(0, Number(v) || 0);
  const goldValue = n(goldGrams) * n(goldPricePerGram);
  const silverValue = n(silverGrams) * n(silverPricePerGram);
  const grossWealth = n(cash) + n(savings) + goldValue + silverValue + n(businessAssets);
  const netWealth = Math.max(0, grossWealth - n(liabilities));

  const silverNisab = 612.36 * n(silverPricePerGram);
  const goldNisab = 87.48 * n(goldPricePerGram);
  const threshold = nisabBase === 'silver' ? silverNisab : goldNisab;
  const isEligible = netWealth >= threshold && threshold > 0;
  const zakatDue = isEligible ? netWealth * 0.025 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#0B261E] p-5 sm:p-6 border border-slate-200 dark:border-emerald-900/60 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isBn ? 'সম্পদের বিবরণ লিখুন' : 'Enter Eligible Assets'}
          </h3>
          <div className="flex items-center gap-2">
            <select
              value={currency}
              onChange={(e) => {
                const next = e.target.value as 'BDT' | 'USD';
                setCurrency(next);
                if (next === 'USD') {
                  setGoldPricePerGram('85');
                  setSilverPricePerGram('1.05');
                } else {
                  setGoldPricePerGram('10500');
                  setSilverPricePerGram('160');
                }
              }}
              className="min-h-[40px] px-3 rounded-xl bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 text-xs font-semibold"
            >
              <option value="BDT">BDT (৳)</option>
              <option value="USD">USD ($)</option>
            </select>

            <select
              value={nisabBase}
              onChange={(e) => setNisabBase(e.target.value as 'silver' | 'gold')}
              className="min-h-[40px] px-3 rounded-xl bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 text-xs font-semibold"
            >
              <option value="silver">{isBn ? 'রুপার নিসাব (৬১২.৩৬ গ্রাম)' : 'Silver Nisab (612.36g)'}</option>
              <option value="gold">{isBn ? 'স্বর্ণের নিসাব (৮৭.৪৮ গ্রাম)' : 'Gold Nisab (87.48g)'}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {label: isBn ? 'নগদ অর্থ (হাতে)' : 'Cash on Hand', val: cash, set: setCash},
            {label: isBn ? 'ব্যাংক সঞ্চয়' : 'Bank Savings', val: savings, set: setSavings},
            {label: isBn ? 'স্বর্ণ (গ্রাম)' : 'Gold (Grams)', val: goldGrams, set: setGoldGrams},
            {label: isBn ? 'প্রতি গ্রাম স্বর্ণের মূল্য' : 'Gold Price / Gram', val: goldPricePerGram, set: setGoldPricePerGram},
            {label: isBn ? 'রুপা (গ্রাম)' : 'Silver (Grams)', val: silverGrams, set: setSilverGrams},
            {label: isBn ? 'প্রতি গ্রাম রুপার মূল্য' : 'Silver Price / Gram', val: silverPricePerGram, set: setSilverPricePerGram},
            {label: isBn ? 'ব্যবসায়িক পণ্য ও বিনিয়োগ' : 'Business Stock & Investments', val: businessAssets, set: setBusinessAssets},
            {label: isBn ? 'স্বল্পমেয়াদী ঋণ / দায় (বাদ যাবে)' : 'Short-term Debts / Liabilities', val: liabilities, set: setLiabilities},
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                {field.label}
              </label>
              <input
                type="number"
                min={0}
                value={field.val}
                onChange={(e) => field.set(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 font-mono-tabular text-sm text-slate-900 dark:text-white"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5 space-y-4">
        <div className="rounded-3xl bg-[#042F24] text-white p-6 border border-[#C89F3C]/40 space-y-4">
          <p className="text-xs font-semibold text-[#F5E6BE]">
            {isBn ? 'যাকাত হিসাবের সারসংক্ষেপ (২.৫%)' : 'Zakat Calculation Summary (2.5%)'}
          </p>
          <div>
            <p className="text-xs text-emerald-100/80">{isBn ? 'প্রদেয় যাকাত' : 'Total Zakat Due'}</p>
            <p className="font-mono-tabular text-4xl font-bold text-[#F5E6BE] mt-1">
              {currency === 'BDT' ? '৳' : '$'}
              {zakatDue.toLocaleString(undefined, {maximumFractionDigits: 2})}
            </p>
          </div>

          <div className="divide-y divide-white/10 text-xs space-y-2 pt-2">
            <div className="flex justify-between pt-2">
              <span className="text-emerald-100/80">{isBn ? 'মোট সম্পদ' : 'Gross Assets'}</span>
              <span className="font-mono-tabular font-semibold">{grossWealth.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-emerald-100/80">{isBn ? 'নিট যাকাতযোগ্য সম্পদ' : 'Net Zakatable Wealth'}</span>
              <span className="font-mono-tabular font-semibold">{netWealth.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-emerald-100/80">{isBn ? 'নিসাব সীমা' : 'Nisab Threshold'}</span>
              <span className="font-mono-tabular font-semibold">
                {Math.round(threshold).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-emerald-100/80">{isBn ? 'যাকাত অবস্থা' : 'Eligibility'}</span>
              <span className="font-bold text-[#F5E6BE]">
                {isEligible
                  ? isBn
                    ? 'যাকাত ফরজ হয়েছে'
                    : 'Zakat Obligatory'
                  : isBn
                    ? 'নিসাবের নিচে'
                    : 'Below Nisab'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MediaView: React.FC = () => {
  const {state} = useSkNur();
  const isBn = state.settings.language === 'bn';

  const featuredSurahs = [
    ALL_SURAHS[0], // Al-Fatiha
    ALL_SURAHS[35], // Ya-Sin
    ALL_SURAHS[54], // Ar-Rahman
    ALL_SURAHS[66], // Al-Mulk
    ALL_SURAHS[111], // Al-Ikhlas
    ALL_SURAHS[112], // Al-Falaq
    ALL_SURAHS[113], // An-Nas
  ];

  const playSurahFirstAyah = (surahNum: number, title: string) => {
    const meta = ALL_SURAHS.find((s) => s.number === surahNum);
    if (!meta) return;
    const url = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${meta.startGlobalAyah}.mp3`;
    islamicAudio.playUrl(url, {
      title,
      subtitle: 'Qari Mishary Rashid Alafasy · Islamic Network',
      mode: 'quran',
      surahNumber: surahNum,
      ayahNumber: 1,
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#042F24] text-white p-6 border border-[#C89F3C]/35 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-bold">
            {isBn ? 'কোরআন তেলাওয়াত ও আজান অডিও' : 'Quran Recitation & Adhan Audio'}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1">
            {isBn
              ? 'অনুমোদিত তেলাওয়াত ও অফলাইন আজান ধ্বনি ব্যাকগ্রাউন্ড প্লেয়ারসহ'
              : 'Verified Quran audio recitations & Maqam Hijaz Adhan chime with persistent player'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => islamicAudio.playAdhanChime('SK NUR Adhan — Maqam Hijaz')}
          className="px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#042F24] text-xs font-bold flex items-center gap-2 min-h-[44px]"
        >
          <Volume2 className="w-4 h-4" />
          <span>{isBn ? 'আজান অডিও শুনুন' : 'Play Adhan Audio'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {featuredSurahs.map((s) => (
          <button
            key={s.number}
            type="button"
            onClick={() =>
              playSurahFirstAyah(
                s.number,
                `${s.number}. ${isBn ? s.bengaliName : s.englishName}`
              )
            }
            className="text-left rounded-2xl bg-white dark:bg-[#0B261E] p-4 border border-slate-200 dark:border-emerald-900/60 hover:border-emerald-600/60 flex items-center justify-between gap-3 min-h-[72px]"
          >
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {s.number}. {isBn ? s.bengaliName : s.englishName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mishary Alafasy · {s.ayahCount} Ayahs
              </p>
            </div>
            <span className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
              <Play className="w-4 h-4" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
