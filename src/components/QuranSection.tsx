import React, {useEffect, useMemo, useState} from 'react';
import {
  ArrowLeft,
  Bookmark,
  Check,
  Download,
  Loader2,
  Pause,
  Play,
  Repeat,
  Search,
  Volume2,
} from 'lucide-react';
import {useSkNur} from '../context/SkNurContext';
import {
  ALL_JUZ,
  ALL_SURAHS,
  fetchSurahAyahs,
  getCachedSurahNumbers,
} from '../data/quranMeta';
import {islamicAudio} from '../lib/audioEngine';
import type {AyahItem} from '../types/islamic';

export const QuranSection: React.FC = () => {
  const {
    state,
    t,
    selectedSurahNumber,
    setSelectedSurahNumber,
    updateSettings,
    toggleAyahBookmark,
    recordQuranRead,
    audioState,
    todayWorship,
  } = useSkNur();

  const isBn = state.settings.language === 'bn';
  const [subTab, setSubTab] = useState<'surahs' | 'juz' | 'bookmarks'>('surahs');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'reader'>('list');
  const [ayahs, setAyahs] = useState<AyahItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cachedNums, setCachedNums] = useState<number[]>(() => getCachedSurahNumbers());
  const [showTranslit, setShowTranslit] = useState(true);
  const [showBn, setShowBn] = useState(true);
  const [showEn, setShowEn] = useState(true);
  const [batchCaching, setBatchCaching] = useState(false);

  const selectedSurah = useMemo(
    () => ALL_SURAHS.find((s) => s.number === selectedSurahNumber) || ALL_SURAHS[0],
    [selectedSurahNumber]
  );

  const filteredSurahs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_SURAHS;
    return ALL_SURAHS.filter(
      (s) =>
        String(s.number) === q ||
        s.englishName.toLowerCase().includes(q) ||
        s.bengaliName.toLowerCase().includes(q) ||
        s.englishTranslation.toLowerCase().includes(q) ||
        s.arabicName.includes(q)
    );
  }, [search]);

  const loadSurah = async (num: number) => {
    setSelectedSurahNumber(num);
    setViewMode('reader');
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetchSurahAyahs(num);
      setAyahs(res.ayahs);
      setCachedNums(getCachedSurahNumbers());
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to load Surah');
      setAyahs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'reader' && ayahs.length === 0 && !loading) {
      loadSurah(selectedSurahNumber);
    }
  }, [viewMode]);

  const playAyahAudio = (ayah: AyahItem, autoAdvance = true) => {
    const url = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.globalNumber}.mp3`;
    islamicAudio.playUrl(
      url,
      {
        title: `${selectedSurah.englishName} · Ayah ${ayah.numberInSurah}`,
        subtitle: 'Mishary Rashid Alafasy',
        mode: 'quran',
        surahNumber: selectedSurah.number,
        ayahNumber: ayah.numberInSurah,
      },
      autoAdvance
        ? () => {
            const idx = ayahs.findIndex((a) => a.numberInSurah === ayah.numberInSurah);
            if (idx >= 0 && idx + 1 < ayahs.length) {
              playAyahAudio(ayahs[idx + 1], true);
            }
          }
        : undefined
    );
    recordQuranRead(selectedSurah.number, ayah.numberInSurah);
  };

  const cacheJuzAmmaOffline = async () => {
    setBatchCaching(true);
    try {
      for (let num = 78; num <= 114; num++) {
        await fetchSurahAyahs(num);
      }
      setCachedNums(getCachedSurahNumbers());
    } catch {
      // ignore partial failure offline
    } finally {
      setBatchCaching(false);
    }
  };

  if (viewMode === 'reader') {
    return (
      <div className="space-y-4 pb-8">
        {/* Reader Sticky Controls */}
        <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-4 border border-slate-200 dark:border-emerald-900/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-emerald-950 text-slate-700 dark:text-slate-200 hover:bg-emerald-800 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>
                  {selectedSurah.number}. {isBn ? selectedSurah.bengaliName : selectedSurah.englishName}
                </span>
                <span className="font-arabic text-xl text-emerald-800 dark:text-[#F5E6BE]">
                  {selectedSurah.arabicName}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedSurah.revelationType} · {selectedSurah.ayahCount} Ayahs · Juz {selectedSurah.juz}
                {cachedNums.includes(selectedSurah.number) ? ' · Offline Cached' : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {ayahs.length > 0 && (
              <button
                type="button"
                onClick={() => playAyahAudio(ayahs[0], true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold min-h-[40px]"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isBn ? 'সম্পূর্ণ সূরা শুনুন' : 'Play Surah'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => islamicAudio.toggleRepeat()}
              className={`min-h-[40px] px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 ${
                audioState.repeat
                  ? 'bg-[#C89F3C] text-[#042F24] border-[#C89F3C]'
                  : 'border-slate-200 dark:border-emerald-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>{isBn ? 'রিপিট' : 'Repeat'}</span>
            </button>
          </div>
        </div>

        {/* Font Size & Translation Toggles */}
        <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-4 border border-slate-200 dark:border-emerald-900/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
              {isBn ? 'আরবি ফন্ট সাইজ' : 'Arabic Size'}: {state.settings.arabicFontSize}px
            </label>
            <input
              type="range"
              min={20}
              max={42}
              value={state.settings.arabicFontSize}
              onChange={(e) => updateSettings({arabicFontSize: Number(e.target.value)})}
              className="accent-emerald-700 w-28"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowTranslit((v) => !v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium min-h-[36px] ${
                showTranslit
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 dark:bg-emerald-950 text-slate-600 dark:text-slate-300'
              }`}
            >
              Transliteration
            </button>
            <button
              type="button"
              onClick={() => setShowBn((v) => !v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium min-h-[36px] ${
                showBn
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 dark:bg-emerald-950 text-slate-600 dark:text-slate-300'
              }`}
            >
              বাংলা অনুবাদ
            </button>
            <button
              type="button"
              onClick={() => setShowEn((v) => !v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium min-h-[36px] ${
                showEn
                  ? 'bg-emerald-800 text-white'
                  : 'bg-slate-100 dark:bg-emerald-950 text-slate-600 dark:text-slate-300'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Bismillah Banner (except Surah 1 & 9) */}
        {selectedSurah.number !== 1 && selectedSurah.number !== 9 && (
          <div className="rounded-2xl bg-[#042F24] text-[#F5E6BE] p-5 text-center border border-[#C89F3C]/30">
            <p className="font-arabic text-2xl sm:text-3xl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>
        )}

        {loading && (
          <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-12 text-center border border-slate-200 dark:border-emerald-900/60">
            <Loader2 className="w-7 h-7 animate-spin text-emerald-700 mx-auto" />
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {isBn ? 'সূরা লোড হচ্ছে ও অফলাইন ক্যাশে সংরক্ষণ করা হচ্ছে...' : 'Loading Surah and caching for offline use...'}
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 p-6 border border-amber-200 dark:border-amber-800 text-center space-y-3">
            <p className="text-sm text-amber-900 dark:text-amber-200">{errorMsg}</p>
            <button
              type="button"
              onClick={() => loadSurah(selectedSurah.number)}
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !errorMsg && (
          <div className="space-y-3">
            {ayahs.map((ayah) => {
              const bKey = `${selectedSurah.number}:${ayah.numberInSurah}`;
              const isBookmarked = state.bookmarkedAyahs.includes(bKey);
              const isThisPlaying =
                audioState.isPlaying &&
                audioState.surahNumber === selectedSurah.number &&
                audioState.ayahNumber === ayah.numberInSurah;

              return (
                <article
                  key={ayah.numberInSurah}
                  className={`rounded-2xl bg-white dark:bg-[#0B261E] p-5 border transition-colors space-y-4 ${
                    isThisPlaying
                      ? 'border-[#C89F3C] ring-1 ring-[#C89F3C]/40'
                      : 'border-slate-200 dark:border-emerald-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-emerald-900/50">
                    <span className="font-mono-tabular text-xs font-bold text-emerald-800 dark:text-[#F5E6BE]">
                      {selectedSurah.number}:{ayah.numberInSurah}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => playAyahAudio(ayah, true)}
                        aria-label={`Play Ayah ${ayah.numberInSurah}`}
                        className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-emerald-800 dark:text-[#F5E6BE] hover:bg-emerald-50 dark:hover:bg-emerald-900/50"
                      >
                        {isThisPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleAyahBookmark(bKey)}
                        aria-label="Bookmark Ayah"
                        className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl transition-colors ${
                          isBookmarked
                            ? 'text-[#C89F3C] bg-[#C89F3C]/10'
                            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        type="button"
                        onClick={() => recordQuranRead(selectedSurah.number, ayah.numberInSurah)}
                        title={isBn ? 'পঠিত হিসেবে চিহ্নিত করুন' : 'Mark as read'}
                        className="min-h-[40px] px-2.5 flex items-center gap-1 rounded-xl text-xs font-medium text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isBn ? 'পঠিত' : 'Read'}</span>
                      </button>
                    </div>
                  </div>

                  <p
                    className="font-arabic text-right text-slate-900 dark:text-white leading-[2.25]"
                    style={{fontSize: `${state.settings.arabicFontSize}px`}}
                  >
                    {ayah.arabic}
                  </p>

                  {showTranslit && ayah.transliteration && (
                    <p className="text-xs sm:text-sm italic text-emerald-800 dark:text-emerald-300">
                      {ayah.transliteration}
                    </p>
                  )}

                  {showBn && ayah.bengali && (
                    <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 font-bengali leading-relaxed">
                      {ayah.bengali}
                    </p>
                  )}

                  {showEn && ayah.english && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {ayah.english}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Header & Daily Tracker */}
      <div className="rounded-2xl bg-[#042F24] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#C89F3C]/30">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">{t.quranTitle}</h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1">
            {isBn
              ? `১১৪টি সূরা ও ৩০ পারা · আজ পঠিত: ${todayWorship.quranAyahsRead} আয়াত · অফলাইনে সংরক্ষিত: ${cachedNums.length} সূরা`
              : `114 Surahs & 30 Juz · Read today: ${todayWorship.quranAyahsRead} Ayahs · Offline cached: ${cachedNums.length}`}
          </p>
        </div>

        <button
          type="button"
          onClick={cacheJuzAmmaOffline}
          disabled={batchCaching}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#042F24] font-semibold text-xs hover:bg-[#e3c04f] transition-colors min-h-[44px] shrink-0"
        >
          {batchCaching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>
            {batchCaching
              ? isBn
                ? 'ডাউনলোড হচ্ছে...'
                : 'Downloading...'
              : isBn
                ? 'আমপারা অফলাইন সেভ (৭৮-১১৪)'
                : 'Save Juz Amma Offline'}
          </span>
        </button>
      </div>

      {/* Filter Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-emerald-950 rounded-xl">
          <button
            type="button"
            onClick={() => setSubTab('surahs')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold min-h-[40px] transition-colors ${
              subTab === 'surahs'
                ? 'bg-white dark:bg-emerald-800 text-emerald-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {t.surahsTab}
          </button>
          <button
            type="button"
            onClick={() => setSubTab('juz')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold min-h-[40px] transition-colors ${
              subTab === 'juz'
                ? 'bg-white dark:bg-emerald-800 text-emerald-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {t.juzTab}
          </button>
          <button
            type="button"
            onClick={() => setSubTab('bookmarks')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold min-h-[40px] transition-colors ${
              subTab === 'bookmarks'
                ? 'bg-white dark:bg-emerald-800 text-emerald-950 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            {t.bookmarksTab} ({state.bookmarkedAyahs.length})
          </button>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchSurah}
            className="w-full min-h-[44px] pl-10 pr-4 rounded-xl bg-white dark:bg-[#0B261E] border border-slate-200 dark:border-emerald-900/60 text-sm text-slate-900 dark:text-white focus:outline-2 focus:outline-emerald-600"
          />
        </div>
      </div>

      {/* Surah List */}
      {subTab === 'surahs' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSurahs.map((surah) => {
            const isCached = cachedNums.includes(surah.number);
            return (
              <button
                key={surah.number}
                type="button"
                onClick={() => loadSurah(surah.number)}
                className="text-left rounded-2xl bg-white dark:bg-[#0B261E] p-4 border border-slate-200 dark:border-emerald-900/60 hover:border-emerald-600/60 transition-colors flex items-center justify-between gap-3 min-h-[76px]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/60 text-emerald-900 dark:text-[#F5E6BE] font-mono-tabular text-sm font-bold flex items-center justify-center shrink-0">
                    {surah.number}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {isBn ? surah.bengaliName : surah.englishName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {surah.ayahCount} Ayahs · {surah.revelationType}
                      {isCached ? ' · Offline' : ''}
                    </p>
                  </div>
                </div>
                <span className="font-arabic text-xl text-emerald-800 dark:text-[#F5E6BE] shrink-0">
                  {surah.arabicName}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 30 Juz / Para List */}
      {subTab === 'juz' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ALL_JUZ.map((juz) => {
            const surahMeta = ALL_SURAHS.find((s) => s.number === juz.startSurah);
            return (
              <button
                key={juz.juzNumber}
                type="button"
                onClick={() => loadSurah(juz.startSurah)}
                className="text-left rounded-2xl bg-white dark:bg-[#0B261E] p-4 border border-slate-200 dark:border-emerald-900/60 hover:border-emerald-600/60 transition-colors flex items-center justify-between gap-3 min-h-[76px]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-emerald-800 text-white font-mono-tabular text-sm font-bold flex items-center justify-center shrink-0">
                    {juz.juzNumber}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white font-bengali">
                      {isBn ? `পারা ${juz.juzNumber}: ${juz.nameBn}` : `Juz ${juz.juzNumber}`}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Starts: {surahMeta?.englishName} ({juz.startSurah}:{juz.startAyah})
                    </p>
                  </div>
                </div>
                <span className="font-arabic text-xl text-emerald-800 dark:text-[#F5E6BE]">
                  {juz.nameAr}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Bookmarks Tab */}
      {subTab === 'bookmarks' && (
        <div className="space-y-2">
          {state.bookmarkedAyahs.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-8 text-center border border-slate-200 dark:border-emerald-900/60 text-sm text-slate-500 dark:text-slate-400">
              {isBn ? 'এখনও কোনো আয়াত বুকমার্ক করা হয়নি।' : 'No bookmarked Ayahs yet.'}
            </div>
          ) : (
            state.bookmarkedAyahs.map((key) => {
              const [sNum, aNum] = key.split(':').map(Number);
              const meta = ALL_SURAHS.find((s) => s.number === sNum);
              return (
                <div
                  key={key}
                  className="rounded-2xl bg-white dark:bg-[#0B261E] p-4 border border-slate-200 dark:border-emerald-900/60 flex items-center justify-between gap-4"
                >
                  <button
                    type="button"
                    onClick={() => loadSurah(sNum)}
                    className="text-left flex-1 min-h-[44px]"
                  >
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {isBn ? meta?.bengaliName : meta?.englishName} ({sNum}:{aNum})
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isBn ? 'সূরা খুলতে ট্যাপ করুন' : 'Tap to open Surah'}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleAyahBookmark(key)}
                    className="min-h-[40px] px-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    {isBn ? 'মুছুন' : 'Remove'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
