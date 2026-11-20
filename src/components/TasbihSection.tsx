import React, {useMemo, useState} from 'react';
import {Plus, RotateCcw, Vibrate} from 'lucide-react';
import {useSkNur} from '../context/SkNurContext';
import {DEFAULT_TASBIH_PRESETS} from '../data/knowledgeAndNames';
import type {TasbihPreset} from '../types/islamic';

const TARGET_OPTIONS = [33, 99, 100, 500, 1000];

export const TasbihSection: React.FC = () => {
  const {state, t, incrementTasbihStats, addCustomTasbih, todayWorship} = useSkNur();
  const isBn = state.settings.language === 'bn';

  const allPresets = useMemo(
    () => [...DEFAULT_TASBIH_PRESETS, ...state.customTasbihs],
    [state.customTasbihs]
  );

  const [selectedId, setSelectedId] = useState<string>(allPresets[0].id);
  const [count, setCount] = useState<number>(0);
  const [target, setTarget] = useState<number>(33);
  const [vibrateOn, setVibrateOn] = useState<boolean>(true);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customArabic, setCustomArabic] = useState('');
  const [customLabel, setCustomLabel] = useState('');

  const activePreset = allPresets.find((p) => p.id === selectedId) || allPresets[0];

  const handleTap = () => {
    const next = count + 1;
    setCount(next);
    incrementTasbihStats(1);

    if (vibrateOn) {
      const duration = next === target ? 80 : 22;
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(duration);
      }
      const win = window as unknown as {SkNurAndroid?: {vibrate?: (ms: number) => void}};
      win.SkNurAndroid?.vibrate?.(duration);
    }
  };

  const handleSelectPreset = (preset: TasbihPreset) => {
    setSelectedId(preset.id);
    setCount(0);
    setTarget(preset.defaultTarget);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLabel.trim()) return;
    const newPreset: TasbihPreset = {
      id: `custom-${Date.now()}`,
      arabic: customArabic.trim() || customLabel.trim(),
      transliteration: customLabel.trim(),
      bengali: customLabel.trim(),
      meaningEn: 'Custom Dhikr',
      meaningBn: 'ব্যক্তিগত তসবি',
      defaultTarget: target,
    };
    addCustomTasbih(newPreset);
    setSelectedId(newPreset.id);
    setCount(0);
    setCustomArabic('');
    setCustomLabel('');
    setShowCustomForm(false);
  };

  const progress = Math.min(1, count / Math.max(1, target));
  const circumference = 2 * Math.PI * 108;
  const strokeDashoffset = circumference * (1 - progress);

  const recentHistory = Object.entries(state.tasbihDailyHistory)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 7);

  return (
    <div className="space-y-6 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Tactile Tasbih Counter */}
        <div className="lg:col-span-7 rounded-3xl bg-[#042F24] text-white p-6 sm:p-8 border border-[#C89F3C]/35 islamic-geo-pattern flex flex-col items-center text-center">
          <div className="w-full flex items-center justify-between text-xs text-[#F5E6BE] mb-4">
            <span className="font-mono-tabular">
              {t.todayCount}: {todayWorship.tasbihCount}
            </span>
            <span className="font-mono-tabular">
              {t.lifetimeCount}: {state.tasbihLifetimeCount}
            </span>
          </div>

          <p className="font-arabic text-3xl sm:text-4xl text-white leading-relaxed">
            {activePreset.arabic}
          </p>
          <p className="text-base font-bold text-[#F5E6BE] mt-2">
            {isBn ? activePreset.bengali : activePreset.transliteration}
          </p>
          <p className="text-xs text-emerald-100/80 mt-0.5">
            {isBn ? activePreset.meaningBn : activePreset.meaningEn}
          </p>

          {/* Giant Tap Circle with Progress Ring */}
          <button
            type="button"
            onClick={handleTap}
            className="relative my-7 w-60 h-60 rounded-full flex items-center justify-center active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-[#D4AF37] select-none"
          >
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 240 240">
              <circle
                cx="120"
                cy="120"
                r="108"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="10"
                fill="rgba(6,78,59,0.55)"
              />
              <circle
                cx="120"
                cy="120"
                r="108"
                stroke="#D4AF37"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-150"
              />
            </svg>
            <div className="relative z-10 flex flex-col items-center">
              <span className="font-mono-tabular text-5xl font-bold text-white">{count}</span>
              <span className="font-mono-tabular text-xs text-[#F5E6BE] mt-1">
                / {target}
              </span>
              <span className="text-[11px] text-emerald-100/80 mt-2">{t.tapToCount}</span>
            </div>
          </button>

          {/* Target & Control Strip */}
          <div className="w-full flex flex-wrap items-center justify-center gap-2">
            {TARGET_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setTarget(opt)}
                className={`px-3 py-1.5 rounded-xl font-mono-tabular text-xs font-bold min-h-[40px] transition-colors ${
                  target === opt
                    ? 'bg-[#D4AF37] text-[#042F24]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {opt}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setVibrateOn((v) => !v)}
              className={`min-h-[40px] px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
                vibrateOn ? 'bg-emerald-700 text-white' : 'bg-white/10 text-emerald-200'
              }`}
            >
              <Vibrate className="w-4 h-4" />
              <span>{vibrateOn ? 'Vibrate' : 'Muted'}</span>
            </button>

            <button
              type="button"
              onClick={() => setCount(0)}
              className="min-h-[40px] px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.reset}</span>
            </button>
          </div>
        </div>

        {/* Presets, Custom Tasbih & Daily History */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isBn ? 'যিকির নির্বাচন করুন' : 'Select Dhikr'}
              </h3>
              <button
                type="button"
                onClick={() => setShowCustomForm((v) => !v)}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-800 dark:text-[#F5E6BE] min-h-[36px]"
              >
                <Plus className="w-4 h-4" />
                <span>{isBn ? 'কাস্টম তসবি' : 'Custom'}</span>
              </button>
            </div>

            {showCustomForm && (
              <form onSubmit={handleAddCustom} className="space-y-2.5 p-3 rounded-xl bg-slate-50 dark:bg-emerald-950/60">
                <input
                  type="text"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder={isBn ? 'যিকিরের নাম লিখুন (যেমন: দরূদ শরীফ)' : 'Dhikr name (e.g. Durood Sharif)'}
                  className="w-full min-h-[40px] px-3 rounded-lg bg-white dark:bg-[#0B261E] border border-slate-200 dark:border-emerald-800 text-xs text-slate-900 dark:text-white"
                  required
                />
                <input
                  type="text"
                  value={customArabic}
                  onChange={(e) => setCustomArabic(e.target.value)}
                  placeholder={isBn ? 'আরবি টেক্সট (ঐচ্ছিক)' : 'Arabic text (optional)'}
                  className="w-full min-h-[40px] px-3 rounded-lg bg-white dark:bg-[#0B261E] border border-slate-200 dark:border-emerald-800 text-xs text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="w-full min-h-[40px] rounded-lg bg-emerald-800 text-white text-xs font-semibold"
                >
                  {isBn ? 'যোগ করুন' : 'Add Custom Tasbih'}
                </button>
              </form>
            )}

            <div className="space-y-2">
              {allPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-full text-left p-3 rounded-xl border transition-colors flex items-center justify-between gap-3 min-h-[56px] ${
                    selectedId === preset.id
                      ? 'bg-emerald-50 dark:bg-emerald-900/50 border-emerald-700 dark:border-[#D4AF37]'
                      : 'border-slate-200 dark:border-emerald-900/50 hover:bg-slate-50 dark:hover:bg-emerald-950/40'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {isBn ? preset.bengali : preset.transliteration}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isBn ? preset.meaningBn : preset.meaningEn}
                    </p>
                  </div>
                  <span className="font-arabic text-lg text-emerald-800 dark:text-[#F5E6BE]">
                    {preset.arabic}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isBn ? 'দৈনিক তসবি ইতিহাস' : 'Daily Tasbih History'}
            </h3>
            {recentHistory.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isBn ? 'আজ থেকেই যিকির গণনা শুরু করুন।' : 'Tap the counter to record today’s Dhikr.'}
              </p>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-emerald-900/50">
                {recentHistory.map(([day, val]) => (
                  <div key={day} className="py-2 flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300 font-mono-tabular">{day}</span>
                    <span className="font-mono-tabular font-bold text-emerald-800 dark:text-[#F5E6BE]">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
