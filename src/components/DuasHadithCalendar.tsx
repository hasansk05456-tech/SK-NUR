import React, {useMemo, useState} from 'react';
import {Bell, Bookmark, Calendar as CalendarIcon, Heart, Search} from 'lucide-react';
import {useSkNur} from '../context/SkNurContext';
import {DUA_CATEGORIES, DUAS_LIST} from '../data/duasData';
import {HADITH_BOOKS, HADITH_COLLECTION} from '../data/hadithData';
import {ISLAMIC_EVENTS} from '../data/knowledgeAndNames';

export const DuasView: React.FC = () => {
  const {state, toggleDuaFavorite} = useSkNur();
  const isBn = state.settings.language === 'bn';
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');
  const [onlyFav, setOnlyFav] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DUAS_LIST.filter((d) => {
      if (cat !== 'all' && d.category !== cat) return false;
      if (onlyFav && !state.favoriteDuas.includes(d.id)) return false;
      if (!q) return true;
      return (
        d.titleEn.toLowerCase().includes(q) ||
        d.titleBn.toLowerCase().includes(q) ||
        d.bengaliMeaning.toLowerCase().includes(q) ||
        d.englishMeaning.toLowerCase().includes(q)
      );
    });
  }, [cat, search, onlyFav, state.favoriteDuas]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isBn ? 'দোয়া খুঁজুন...' : 'Search Duas...'}
            className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-white dark:bg-[#0B261E] border border-slate-200 dark:border-emerald-900/60 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <button
          type="button"
          onClick={() => setOnlyFav((v) => !v)}
          className={`min-h-[44px] px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border ${
            onlyFav
              ? 'bg-emerald-800 text-white border-emerald-800'
              : 'bg-white dark:bg-[#0B261E] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-emerald-900/60'
          }`}
        >
          <Heart className="w-4 h-4" fill={onlyFav ? 'currentColor' : 'none'} />
          <span>{isBn ? 'পছন্দের দোয়া' : 'Favorites'} ({state.favoriteDuas.length})</span>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {DUA_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCat(c.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 min-h-[40px] transition-colors ${
              cat === c.id
                ? 'bg-emerald-800 text-white'
                : 'bg-white dark:bg-[#0B261E] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-emerald-900/60'
            }`}
          >
            {isBn ? c.labelBn : c.labelEn}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((dua) => {
          const fav = state.favoriteDuas.includes(dua.id);
          return (
            <article
              key={dua.id}
              className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-bengali">
                    {isBn ? dua.titleBn : dua.titleEn}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{dua.reference}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleDuaFavorite(dua.id)}
                  aria-label="Favorite Dua"
                  className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl ${
                    fav ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' : 'text-slate-400'
                  }`}
                >
                  <Heart className="w-4 h-4" fill={fav ? 'currentColor' : 'none'} />
                </button>
              </div>
              <p className="font-arabic text-2xl text-right text-slate-900 dark:text-white leading-loose">
                {dua.arabic}
              </p>
              <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300 font-bengali">
                {isBn ? 'উচ্চারণ: ' : 'Pronunciation: '}
                {dua.bengaliPronunciation}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-200 font-bengali leading-relaxed">
                {isBn ? dua.bengaliMeaning : dua.englishMeaning}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export const HadithView: React.FC = () => {
  const {state, toggleHadithBookmark} = useSkNur();
  const isBn = state.settings.language === 'bn';
  const [book, setBook] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return HADITH_COLLECTION.filter((h) => {
      if (book !== 'all' && h.book !== book) return false;
      if (onlyBookmarks && !state.bookmarkedHadiths.includes(h.id)) return false;
      if (!q) return true;
      return (
        h.english.toLowerCase().includes(q) ||
        h.bengali.toLowerCase().includes(q) ||
        h.reference.toLowerCase().includes(q) ||
        h.bookNameEn.toLowerCase().includes(q)
      );
    });
  }, [book, search, onlyBookmarks, state.bookmarkedHadiths]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isBn ? 'হাদিস বা গ্রন্থ খুঁজুন...' : 'Search Hadith or reference...'}
            className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-white dark:bg-[#0B261E] border border-slate-200 dark:border-emerald-900/60 text-sm text-slate-900 dark:text-white"
          />
        </div>
        <button
          type="button"
          onClick={() => setOnlyBookmarks((v) => !v)}
          className={`min-h-[44px] px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border ${
            onlyBookmarks
              ? 'bg-emerald-800 text-white border-emerald-800'
              : 'bg-white dark:bg-[#0B261E] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-emerald-900/60'
          }`}
        >
          <Bookmark className="w-4 h-4" fill={onlyBookmarks ? 'currentColor' : 'none'} />
          <span>{isBn ? 'বুকমার্ক' : 'Saved'} ({state.bookmarkedHadiths.length})</span>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {HADITH_BOOKS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setBook(b.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 min-h-[40px] ${
              book === b.id
                ? 'bg-emerald-800 text-white'
                : 'bg-white dark:bg-[#0B261E] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-emerald-900/60'
            }`}
          >
            {isBn ? b.nameBn : b.nameEn}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((h) => {
          const saved = state.bookmarkedHadiths.includes(h.id);
          return (
            <article
              key={h.id}
              className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-emerald-800 dark:text-[#F5E6BE]">
                    {isBn ? h.bookNameBn : h.bookNameEn}
                  </span>
                  <span className="mx-1.5">·</span>
                  <span>{isBn ? h.chapterBn : h.chapterEn}</span>
                  <span className="mx-1.5">·</span>
                  <span>{h.reference}</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleHadithBookmark(h.id)}
                  className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl ${
                    saved ? 'text-[#C89F3C] bg-[#C89F3C]/10' : 'text-slate-400'
                  }`}
                >
                  <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
                </button>
              </div>
              <p className="font-arabic text-2xl text-right text-slate-900 dark:text-white leading-loose">
                {h.arabic}
              </p>
              <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 font-bengali leading-relaxed">
                {h.bengali}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {h.english}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Narrator: {h.narrator}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
};

const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  'Rabi al-Awwal',
  'Rabi al-Thani',
  'Jumada al-Awwal',
  'Jumada al-Thani',
  'Rajab',
  'Shaban',
  'Ramadan',
  'Shawwal',
  'Dhul Qadah',
  'Dhul Hijjah',
];

export const CalendarView: React.FC = () => {
  const {state, now, hijriInfo, bengaliInfo, t, addCustomReminder} = useSkNur();
  const isBn = state.settings.language === 'bn';
  const [remNotice, setRemNotice] = useState<string | null>(null);

  const handleSetEventReminder = (eventName: string) => {
    addCustomReminder({
      title: eventName,
      time: '08:00',
      enabled: true,
      type: 'custom',
    });
    setRemNotice(isBn ? `রিমাইন্ডার যোগ করা হয়েছে: ${eventName}` : `Reminder added: ${eventName}`);
  };

  return (
    <div className="space-y-6">
      {/* Today's Triple Date Card */}
      <div className="rounded-3xl bg-[#042F24] text-white p-6 border border-[#C89F3C]/35 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-black/30 p-4 border border-white/10">
          <p className="text-xs text-[#F5E6BE]">{isBn ? 'হিজরি তারিখ' : 'Hijri Date'}</p>
          <p className="text-xl font-bold mt-1">{hijriInfo.formattedEn}</p>
          <p className="font-arabic text-lg text-emerald-200 mt-1">{hijriInfo.formattedAr}</p>
        </div>
        <div className="rounded-2xl bg-black/30 p-4 border border-white/10">
          <p className="text-xs text-[#F5E6BE]">{isBn ? 'বাংলা তারিখ' : 'Bengali Date'}</p>
          <p className="text-xl font-bold mt-1 font-bengali">{bengaliInfo.formattedBn}</p>
          <p className="text-xs text-emerald-100/75 mt-1">Revised Bangabda</p>
        </div>
        <div className="rounded-2xl bg-black/30 p-4 border border-white/10">
          <p className="text-xs text-[#F5E6BE]">{isBn ? 'ইংরেজি তারিখ' : 'English Date'}</p>
          <p className="text-xl font-bold mt-1">
            {now.toLocaleDateString('en-US', {day: 'numeric', month: 'long', year: 'numeric'})}
          </p>
          <p className="text-xs text-emerald-100/75 mt-1">
            {now.toLocaleDateString('en-US', {weekday: 'long'})}
          </p>
        </div>
      </div>

      {/* Moon Sighting Notice */}
      <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 p-4 text-xs sm:text-sm text-amber-900 dark:text-amber-200 font-bengali">
        {t.moonSightingNote}
      </div>

      {remNotice && (
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/40 p-3 text-xs font-semibold text-emerald-900 dark:text-[#F5E6BE]">
          {remNotice}
        </div>
      )}

      {/* 12 Hijri Months */}
      <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-emerald-700 dark:text-[#D4AF37]" />
          <span>{isBn ? 'হিজরি ১২ মাসের তালিকা' : '12 Islamic Hijri Months'}</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {HIJRI_MONTHS.map((m, i) => {
            const isCurrent = hijriInfo.monthIndex === i + 1;
            return (
              <div
                key={m}
                className={`p-3 rounded-xl border text-xs ${
                  isCurrent
                    ? 'bg-emerald-800 text-white border-emerald-800 font-bold'
                    : 'border-slate-200 dark:border-emerald-900/60 text-slate-700 dark:text-slate-200'
                }`}
              >
                <span className="font-mono-tabular opacity-75">{i + 1}. </span>
                <span>{m}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Important Islamic Dates */}
      <div className="rounded-2xl bg-white dark:bg-[#0B261E] border border-slate-200 dark:border-emerald-900/60 divide-y divide-slate-100 dark:divide-emerald-900/50">
        {ISLAMIC_EVENTS.map((ev) => (
          <div key={ev.id} className="p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white font-bengali">
                {isBn ? ev.nameBn : ev.nameEn}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {ev.hijriDay} {HIJRI_MONTHS[ev.hijriMonth - 1]} · {hijriInfo.year} AH
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleSetEventReminder(isBn ? ev.nameBn : ev.nameEn)}
              className="min-h-[40px] px-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/50 text-emerald-800 dark:text-[#F5E6BE] text-xs font-semibold flex items-center gap-1.5 shrink-0"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isBn ? 'রিমাইন্ডার' : 'Remind'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
