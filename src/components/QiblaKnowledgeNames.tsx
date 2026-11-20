import React, {useEffect, useMemo, useState} from 'react';
import {Compass, Heart, Navigation, Search} from 'lucide-react';
import {useSkNur} from '../context/SkNurContext';
import {
  FIVE_PILLARS,
  GHUSL_GUIDE,
  ISLAMIC_NAMES,
  ISLAMIC_QUIZ_QUESTIONS,
  PROPHET_STORIES,
  SALAH_STEPS,
  SIX_KALIMAS,
  WUDU_STEPS,
} from '../data/knowledgeAndNames';
import {getDistanceToMakkahKm, getQiblaAngle} from '../lib/prayerUtils';

const KAABA_IMG = '/src/assets/images/makkah_kaaba_card_1795107030352.jpg';

export const QiblaView: React.FC = () => {
  const {state} = useSkNur();
  const isBn = state.settings.language === 'bn';
  const {latitude, longitude, name} = state.settings.location;

  const qiblaBearing = useMemo(() => getQiblaAngle(latitude, longitude), [latitude, longitude]);
  const distanceKm = useMemo(
    () => getDistanceToMakkahKm(latitude, longitude),
    [latitude, longitude]
  );

  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [sensorActive, setSensorActive] = useState<boolean>(false);
  const [sensorNotice, setSensorNotice] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      const webkitHeading = (e as unknown as {webkitCompassHeading?: number}).webkitCompassHeading;
      if (typeof webkitHeading === 'number') {
        setDeviceHeading(webkitHeading);
        setSensorActive(true);
      } else if (typeof e.alpha === 'number') {
        setDeviceHeading((360 - e.alpha) % 360);
        setSensorActive(true);
      }
    };
    window.addEventListener('deviceorientation', handler, true);
    return () => window.removeEventListener('deviceorientation', handler, true);
  }, []);

  const requestCompassPermission = async () => {
    const DevOrient = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    if (typeof DevOrient?.requestPermission === 'function') {
      try {
        const res = await DevOrient.requestPermission();
        if (res === 'granted') {
          setSensorActive(true);
          setSensorNotice(isBn ? 'কম্পাস সেন্সর সক্রিয় হয়েছে।' : 'Compass sensor activated.');
        } else {
          setSensorNotice(isBn ? 'কম্পাস অনুমতি পাওয়া যায়নি।' : 'Compass permission denied.');
        }
      } catch {
        setSensorNotice('Could not access motion sensor.');
      }
    } else {
      setSensorNotice(
        isBn
          ? 'ফোন ধরে ৮-আকারে ঘুরিয়ে ক্যালিব্রেট করুন (ডেস্কটপে নিচের স্লাইডার ব্যবহার করতে পারেন)।'
          : 'Move phone in a figure-8 to calibrate, or use the manual heading dial on desktop.'
      );
    }
  };

  const needleAngle = (qiblaBearing - deviceHeading + 360) % 360;
  const aligned = Math.abs(((needleAngle + 180) % 360) - 180) < 6;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 rounded-3xl bg-[#042F24] text-white p-6 sm:p-8 border border-[#C89F3C]/35 flex flex-col items-center text-center">
        <p className="text-xs text-[#F5E6BE] font-semibold">
          {name} · {distanceKm.toLocaleString()} km to Makkah
        </p>
        <h3 className="font-display text-2xl font-bold mt-1">
          {isBn ? 'পবিত্র কাবা শরীফের দিক (কিবলা)' : 'Qibla Direction'}
        </h3>

        <div className="relative my-7 w-64 h-64 rounded-full bg-black/35 border-4 border-[#C89F3C]/40 flex items-center justify-center shadow-2xl">
          {/* Dial Cardinals */}
          <span className="absolute top-3 text-xs font-bold text-[#F5E6BE]">N</span>
          <span className="absolute bottom-3 text-xs font-bold text-white/60">S</span>
          <span className="absolute right-3 text-xs font-bold text-white/60">E</span>
          <span className="absolute left-3 text-xs font-bold text-white/60">W</span>

          {/* Rotating Qibla Pointer */}
          <div
            className="w-44 h-44 flex items-center justify-center transition-transform duration-200 ease-out"
            style={{transform: `rotate(${needleAngle}deg)`}}
          >
            <div className="flex flex-col items-center -mt-12">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center border-2 ${
                  aligned
                    ? 'bg-[#D4AF37] border-white text-[#042F24]'
                    : 'bg-black border-[#D4AF37] text-[#F5E6BE]'
                }`}
              >
                <Navigation className="w-5 h-5" />
              </div>
              <div className="w-1 h-16 bg-gradient-to-b from-[#D4AF37] to-transparent rounded-full mt-1" />
            </div>
          </div>

          <div className="absolute w-4 h-4 rounded-full bg-[#D4AF37] ring-4 ring-[#042F24]" />
        </div>

        <div className="space-y-1">
          <p className="font-mono-tabular text-2xl font-bold text-[#F5E6BE]">
            {qiblaBearing.toFixed(1)}° {aligned ? '· Aligned to Qibla' : ''}
          </p>
          <p className="text-xs text-emerald-100/80">
            {sensorActive
              ? isBn
                ? 'লাইভ ডিভাইস কম্পাস সক্রিয়'
                : 'Live device magnetometer active'
              : isBn
                ? 'ম্যানুয়াল দিক পরীক্ষা (সেন্সর না থাকলে)'
                : 'Manual heading preview (rotate slider below)'}
          </p>
        </div>

        <div className="w-full max-w-xs mt-4 space-y-3">
          <input
            type="range"
            min={0}
            max={359}
            value={Math.round(deviceHeading)}
            onChange={(e) => setDeviceHeading(Number(e.target.value))}
            className="w-full accent-[#D4AF37]"
          />
          <button
            type="button"
            onClick={requestCompassPermission}
            className="w-full min-h-[44px] rounded-xl bg-[#D4AF37] text-[#042F24] text-xs font-bold flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>{isBn ? 'কম্পাস ক্যালিব্রেট / চালু করুন' : 'Enable / Calibrate Compass'}</span>
          </button>
          {sensorNotice && <p className="text-xs text-emerald-200">{sensorNotice}</p>}
        </div>
      </div>

      <div className="lg:col-span-5 space-y-4">
        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-emerald-900/60 bg-white dark:bg-[#0B261E]">
          <img
            src={KAABA_IMG}
            alt="Masjid al-Haram and the Sacred Kaaba"
            referrerPolicy="no-referrer"
            className="w-full h-56 object-cover"
          />
          <div className="p-5 space-y-2">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {isBn ? 'কিবলা কম্পাস ক্যালিব্রেশন নির্দেশিকা' : 'Compass Calibration Instructions'}
            </h4>
            <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-4 font-bengali">
              <li>
                {isBn
                  ? 'ফোনটি সমতলভাবে হাতের তালুতে রাখুন এবং ধাতব বস্তু বা চুম্বক থেকে দূরে রাখুন।'
                  : 'Hold your phone flat and away from metallic cases or magnetic mounts.'}
              </li>
              <li>
                {isBn
                  ? 'সঠিক দিক পেতে ফোনটিকে বাতাসে "8" (আট) আকৃতিতে ২-৩ বার ঘুরিয়ে নিন।'
                  : 'Wave your phone in a figure-8 motion 2–3 times to calibrate the magnetometer.'}
              </li>
              <li>
                {isBn
                  ? `আপনার অবস্থান (${name}) থেকে মক্কা শরীফের দূরত্ব ${distanceKm.toLocaleString()} কিমি।`
                  : `Distance from ${name} to Masjid al-Haram is ${distanceKm.toLocaleString()} km.`}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export const KnowledgeView: React.FC = () => {
  const {state} = useSkNur();
  const isBn = state.settings.language === 'bn';
  const [tab, setTab] = useState<'kalimas' | 'pillars' | 'wudu' | 'salah' | 'prophets' | 'quiz'>('kalimas');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const quizScore = ISLAMIC_QUIZ_QUESTIONS.reduce((acc, q) => {
    return acc + (quizAnswers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          {id: 'kalimas', en: 'Six Kalimas', bn: '৬ কালিমা'},
          {id: 'pillars', en: 'Iman & 5 Pillars', bn: 'ঈমান ও ৫ স্তম্ভ'},
          {id: 'wudu', en: 'Wudu & Ghusl', bn: 'অজু ও গোসল'},
          {id: 'salah', en: 'Salah Guide', bn: 'নামাজ শিক্ষা'},
          {id: 'prophets', en: "Prophets' Stories", bn: 'নবীদের জীবনী'},
          {id: 'quiz', en: 'Islamic Quiz', bn: 'ইসলামিক কুইজ'},
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id as typeof tab)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 min-h-[40px] ${
              tab === item.id
                ? 'bg-emerald-800 text-white'
                : 'bg-white dark:bg-[#0B261E] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-emerald-900/60'
            }`}
          >
            {isBn ? item.bn : item.en}
          </button>
        ))}
      </div>

      {tab === 'kalimas' && (
        <div className="space-y-4">
          {SIX_KALIMAS.map((k) => (
            <article
              key={k.number}
              className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-3"
            >
              <h3 className="text-base font-bold text-emerald-900 dark:text-[#F5E6BE]">
                {isBn ? k.titleBn : k.titleEn}
              </h3>
              <p className="font-arabic text-2xl text-right text-slate-900 dark:text-white leading-loose">
                {k.arabic}
              </p>
              <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300 font-bengali">
                {k.bengaliPronunciation}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-200 font-bengali">
                {isBn ? k.bengaliMeaning : k.englishMeaning}
              </p>
            </article>
          ))}
        </div>
      )}

      {tab === 'pillars' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FIVE_PILLARS.map((p) => (
            <div
              key={p.step}
              className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-2"
            >
              <span className="font-mono-tabular text-xs font-bold text-emerald-700 dark:text-[#D4AF37]">
                0{p.step}.
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isBn ? p.titleBn : p.titleEn}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-bengali leading-relaxed">
                {isBn ? p.descBn : p.descEn}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === 'wudu' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {WUDU_STEPS.map((w) => (
              <div
                key={w.step}
                className="rounded-2xl bg-white dark:bg-[#0B261E] p-4 border border-slate-200 dark:border-emerald-900/60"
              >
                <p className="text-sm font-bold text-emerald-800 dark:text-[#F5E6BE]">
                  {w.step}. {isBn ? w.titleBn : w.titleEn}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-bengali">
                  {isBn ? w.detailBn : w.detailEn}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isBn ? 'ফরজ গোসলের সঠিক নিয়ম' : 'Complete Ghusl (Purification Bath) Guide'}
            </h3>
            {GHUSL_GUIDE.map((g) => (
              <div key={g.step} className="pt-2 border-t border-slate-100 dark:border-emerald-900/50">
                <p className="text-sm font-bold text-emerald-800 dark:text-[#F5E6BE]">
                  {g.step}. {isBn ? g.titleBn : g.titleEn}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-bengali">
                  {isBn ? g.detailBn : g.detailEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'salah' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SALAH_STEPS.map((s) => (
            <div
              key={s.step}
              className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-1.5"
            >
              <p className="text-sm font-bold text-emerald-800 dark:text-[#F5E6BE]">
                {isBn ? `ধাপ ${s.step}: ${s.titleBn}` : `Step ${s.step}: ${s.titleEn}`}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-bengali leading-relaxed">
                {isBn ? s.detailBn : s.detailEn}
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === 'prophets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROPHET_STORIES.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-2"
            >
              <h3 className="text-base font-bold text-emerald-900 dark:text-[#F5E6BE]">
                {isBn ? p.nameBn : p.nameEn}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-200 font-bengali leading-relaxed">
                {isBn ? p.lessonBn : p.lessonEn}
              </p>
            </article>
          ))}
        </div>
      )}

      {tab === 'quiz' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#042F24] text-white p-4 flex items-center justify-between">
            <span className="text-sm font-semibold">
              {isBn ? 'ইসলামিক জ্ঞান কুইজ' : 'Islamic Knowledge Quiz'}
            </span>
            <span className="font-mono-tabular text-sm font-bold text-[#F5E6BE]">
              Score: {quizScore} / {ISLAMIC_QUIZ_QUESTIONS.length}
            </span>
          </div>

          {ISLAMIC_QUIZ_QUESTIONS.map((q, idx) => {
            const chosen = quizAnswers[q.id];
            const hasAnswered = chosen !== undefined;
            return (
              <div
                key={q.id}
                className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-3"
              >
                <p className="text-sm font-bold text-slate-900 dark:text-white font-bengali">
                  {idx + 1}. {isBn ? q.questionBn : q.questionEn}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correctIndex;
                    const isPicked = chosen === optIdx;
                    let cls =
                      'border-slate-200 dark:border-emerald-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-emerald-950/50';
                    if (hasAnswered) {
                      if (isCorrect) {
                        cls = 'bg-emerald-700 text-white border-emerald-700';
                      } else if (isPicked) {
                        cls = 'bg-rose-600 text-white border-rose-600';
                      }
                    }
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setQuizAnswers((prev) => ({...prev, [q.id]: optIdx}))}
                        className={`text-left px-4 py-2.5 rounded-xl border text-xs font-semibold min-h-[44px] transition-colors ${cls}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {hasAnswered && (
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 font-bengali">
                    {q.explanationBn}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const IslamicNamesView: React.FC = () => {
  const {state, toggleNameFavorite} = useSkNur();
  const isBn = state.settings.language === 'bn';
  const [gender, setGender] = useState<'all' | 'boy' | 'girl'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ISLAMIC_NAMES.filter((n) => {
      if (gender !== 'all' && n.gender !== gender) return false;
      if (!q) return true;
      return (
        n.name.toLowerCase().includes(q) ||
        n.bengaliPronunciation.toLowerCase().includes(q) ||
        n.bengaliMeaning.toLowerCase().includes(q) ||
        n.englishMeaning.toLowerCase().includes(q)
      );
    });
  }, [gender, search]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-emerald-950 rounded-xl">
          {[
            {id: 'all', en: 'All', bn: 'সব'},
            {id: 'boy', en: 'Boys', bn: 'ছেলেদের নাম'},
            {id: 'girl', en: 'Girls', bn: 'মেয়েদের নাম'},
          ].map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGender(g.id as typeof gender)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold min-h-[40px] ${
                gender === g.id
                  ? 'bg-white dark:bg-emerald-800 text-emerald-950 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {isBn ? g.bn : g.en}
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isBn ? 'নাম বা অর্থ খুঁজুন...' : 'Search name or meaning...'}
            className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-white dark:bg-[#0B261E] border border-slate-200 dark:border-emerald-900/60 text-sm text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((item) => {
          const fav = state.favoriteNames.includes(item.id);
          return (
            <div
              key={item.id}
              className="rounded-2xl bg-white dark:bg-[#0B261E] p-4 border border-slate-200 dark:border-emerald-900/60 flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {isBn ? item.bengaliPronunciation : item.name}
                  </span>
                  <span className="font-arabic text-lg text-emerald-800 dark:text-[#F5E6BE]">
                    {item.arabic}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-bengali">
                  {isBn ? item.bengaliMeaning : item.englishMeaning}
                </p>
                <p className="text-[11px] text-slate-400">
                  {item.gender === 'boy' ? (isBn ? 'ছেলে' : 'Boy') : isBn ? 'মেয়ে' : 'Girl'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleNameFavorite(item.id)}
                className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl ${
                  fav ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' : 'text-slate-400'
                }`}
              >
                <Heart className="w-4 h-4" fill={fav ? 'currentColor' : 'none'} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
