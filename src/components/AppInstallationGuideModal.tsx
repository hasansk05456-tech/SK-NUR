import React, {useState} from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  ExternalLink,
  Globe,
  HelpCircle,
  MoreVertical,
  PlusSquare,
  Share,
  Smartphone,
  X,
} from 'lucide-react';
import {useSkNur} from '../context/SkNurContext';
import {getActiveInstallUrl, SHARED_APP_URL} from '../lib/installLinks';

interface AppInstallationGuideModalProps {
  open: boolean;
  onClose: () => void;
  onOpenInstallHub?: () => void;
}

type GuideTab = 'android' | 'ios' | 'share_fix';

export const AppInstallationGuideModal: React.FC<AppInstallationGuideModalProps> = ({
  open,
  onClose,
  onOpenInstallHub,
}) => {
  const {state} = useSkNur();
  const isBn = state.settings.language === 'bn';
  const [tab, setTab] = useState<GuideTab>(() => {
    if (typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent)) {
      return 'ios';
    }
    return 'android';
  });

  if (!open) return null;

  const currentUrl = getActiveInstallUrl();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isBn ? 'অ্যাপ ইনস্টল ও শেয়ার গাইড' : 'App Installation Guide'}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4"
    >
      <div className="w-full sm:max-w-xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#081F18] border border-slate-200 dark:border-emerald-800/70 shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-[#042F24] text-white px-5 py-4 flex items-center justify-between gap-3 border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F5E6BE] flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold truncate">
                {isBn ? 'অ্যাপ ইনস্টল ও শেয়ার গাইড' : 'App Installation Guide'}
              </h3>
              <p className="text-[11px] text-[#F5E6BE]/90 truncate font-bengali">
                {isBn
                  ? 'Android, iPhone ও লিংক শেয়ারের ধাপে ধাপে নিয়ম'
                  : 'Step-by-step instructions for Android, iOS & Sharing'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="min-h-[40px] min-w-[40px] rounded-xl flex items-center justify-center hover:bg-white/10 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5 font-bengali">
          {/* Tab Switcher */}
          <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-[#041A13] p-1 rounded-2xl border border-slate-200 dark:border-emerald-900/60">
            <button
              type="button"
              onClick={() => setTab('android')}
              className={`min-h-[40px] px-2 rounded-xl text-xs font-bold transition-colors ${
                tab === 'android'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Android (Chrome)
            </button>
            <button
              type="button"
              onClick={() => setTab('ios')}
              className={`min-h-[40px] px-2 rounded-xl text-xs font-bold transition-colors ${
                tab === 'ios'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              iPhone / iPad (iOS)
            </button>
            <button
              type="button"
              onClick={() => setTab('share_fix')}
              className={`min-h-[40px] px-2 rounded-xl text-xs font-bold transition-colors ${
                tab === 'share_fix'
                  ? 'bg-[#D4AF37] text-[#042F24] shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isBn ? 'শেয়ার ও এরর ফিক্স' : 'Share & Fix Errors'}
            </button>
          </div>

          {tab === 'android' && (
            <div className="space-y-4">
              {/* Visual SVG Diagram for Android Chrome */}
              <div className="rounded-2xl bg-emerald-50/70 dark:bg-[#0B261E] border border-emerald-200 dark:border-emerald-800/70 p-4">
                <p className="text-xs font-bold text-emerald-900 dark:text-[#F5E6BE] mb-3 text-center">
                  {isBn
                    ? 'Android Chrome ব্রাউজারে যেভাবে ইনস্টল করবেন:'
                    : 'Visual Guide: Installing on Android Chrome'}
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {/* Diagram Step 1 */}
                  <div className="rounded-xl bg-white dark:bg-[#041D15] p-2.5 border border-emerald-200/80 dark:border-emerald-800 flex flex-col items-center">
                    <svg viewBox="0 0 80 56" className="w-full max-w-[76px] h-14 mb-2" aria-hidden="true">
                      <rect x="4" y="4" width="72" height="48" rx="8" fill="#064E3B" opacity="0.12" stroke="#064E3B" strokeWidth="1.5" />
                      <rect x="8" y="10" width="50" height="12" rx="4" fill="#fff" stroke="#94a3b8" strokeWidth="1" />
                      <circle cx="66" cy="12" r="1.7" fill="#D4AF37" />
                      <circle cx="66" cy="16" r="1.7" fill="#D4AF37" />
                      <circle cx="66" cy="20" r="1.7" fill="#D4AF37" />
                      <circle cx="66" cy="16" r="7" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="2 2" />
                    </svg>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white">
                      {isBn ? '১. উপরে ৩-ডট (⋮)' : '1. Tap 3-Dot (⋮)'}
                    </span>
                  </div>

                  {/* Diagram Step 2 */}
                  <div className="rounded-xl bg-white dark:bg-[#041D15] p-2.5 border border-emerald-200/80 dark:border-emerald-800 flex flex-col items-center">
                    <svg viewBox="0 0 80 56" className="w-full max-w-[76px] h-14 mb-2" aria-hidden="true">
                      <rect x="10" y="6" width="60" height="44" rx="7" fill="#fff" stroke="#064E3B" strokeWidth="1.5" />
                      <rect x="16" y="13" width="48" height="7" rx="2" fill="#e2e8f0" />
                      <rect x="16" y="24" width="48" height="10" rx="3" fill="#064E3B" />
                      <text x="40" y="31" fontSize="5.5" fill="#F5E6BE" textAnchor="middle" fontWeight="bold">Install app</text>
                      <rect x="16" y="38" width="48" height="6" rx="2" fill="#e2e8f0" />
                    </svg>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white">
                      {isBn ? '২. Install app' : '2. Install app'}
                    </span>
                  </div>

                  {/* Diagram Step 3 */}
                  <div className="rounded-xl bg-white dark:bg-[#041D15] p-2.5 border border-emerald-200/80 dark:border-emerald-800 flex flex-col items-center">
                    <svg viewBox="0 0 80 56" className="w-full max-w-[76px] h-14 mb-2" aria-hidden="true">
                      <rect x="24" y="4" width="32" height="48" rx="6" fill="#042F24" stroke="#D4AF37" strokeWidth="1.5" />
                      <rect x="31" y="14" width="18" height="18" rx="4" fill="#064E3B" stroke="#D4AF37" strokeWidth="1.2" />
                      <text x="40" y="25" fontSize="6" fill="#F5E6BE" textAnchor="middle" fontWeight="bold">SK</text>
                      <rect x="33" y="46" width="14" height="2" rx="1" fill="#D4AF37" />
                    </svg>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white">
                      {isBn ? '৩. হোম স্ক্রিনে আইকন' : '3. App Ready'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Steps */}
              <ol className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                <li className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-[#0B261E] p-3 border border-slate-200 dark:border-emerald-900/60">
                  <Globe className="w-5 h-5 text-emerald-700 dark:text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {isBn ? 'ধাপ ১: Google Chrome-এ খুলুন' : 'Step 1: Open in Google Chrome'}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {isBn
                        ? 'আপনি যদি AI Studio প্রিভিউ ফ্রেম বা WhatsApp-এর ভেতরে থাকেন, তাহলে নিচের "Chrome-এ খুলুন" বাটনে ট্যাপ করে মূল Chrome ব্রাউজারে অ্যাপটি ওপেন করুন।'
                        : 'If you are inside an embedded preview frame or in-app browser, open the app directly in Google Chrome first.'}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-[#0B261E] p-3 border border-slate-200 dark:border-emerald-900/60">
                  <MoreVertical className="w-5 h-5 text-emerald-700 dark:text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {isBn ? 'ধাপ ২: উপরের ৩-ডট (⋮) মেনু চাপুন' : 'Step 2: Tap Chrome Menu (⋮)'}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {isBn
                        ? 'অটোমেটিক "Install" পপআপ না এলে Chrome-এর উপরে ডানদিকের ৩-ডট (⋮) আইকনে ট্যাপ করুন।'
                        : 'If the automatic install prompt does not appear, tap the three-dot (⋮) button at the top-right of Chrome.'}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-[#0B261E] p-3 border border-slate-200 dark:border-emerald-900/60">
                  <Download className="w-5 h-5 text-emerald-700 dark:text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {isBn
                        ? 'ধাপ ৩: "Install app" বা "Add to Home screen" চাপুন'
                        : 'Step 3: Tap "Install app" or "Add to Home screen"'}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {isBn
                        ? '"Install" কনফার্ম করলে SK NUR অফিসিয়াল লোগোসহ আপনার ফোনের অ্যাপ ড্রয়ারে ইনস্টল হবে এবং অফলাইনেও কাজ করবে।'
                        : 'Confirm Install — SK NUR will be added to your Android app drawer with its emblem and offline support.'}
                    </p>
                  </div>
                </li>
              </ol>

              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>
                  {isBn ? 'এখনই Chrome-এ অ্যাপটি খুলুন' : 'Open App in Chrome Now'}
                </span>
              </a>
            </div>
          )}

          {tab === 'ios' && (
            <div className="space-y-4">
              {/* Visual SVG Diagram for iOS Safari */}
              <div className="rounded-2xl bg-emerald-50/70 dark:bg-[#0B261E] border border-emerald-200 dark:border-emerald-800/70 p-4">
                <p className="text-xs font-bold text-emerald-900 dark:text-[#F5E6BE] mb-3 text-center">
                  {isBn
                    ? 'iPhone / iPad-এর Safari ব্রাউজারে যেভাবে ইনস্টল করবেন:'
                    : 'Visual Guide: Installing on iPhone / iPad (Safari)'}
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-white dark:bg-[#041D15] p-2.5 border border-emerald-200/80 dark:border-emerald-800 flex flex-col items-center">
                    <svg viewBox="0 0 80 56" className="w-full max-w-[76px] h-14 mb-2" aria-hidden="true">
                      <rect x="8" y="6" width="64" height="44" rx="7" fill="#064E3B" opacity="0.1" stroke="#064E3B" strokeWidth="1.5" />
                      <rect x="8" y="37" width="64" height="13" rx="0" fill="#fff" stroke="#cbd5e1" strokeWidth="1" />
                      <rect x="34" y="40" width="12" height="9" rx="2" fill="none" stroke="#064E3B" strokeWidth="1.5" />
                      <path d="M40 46 V38 M37 41 L40 38 L43 41" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white">
                      {isBn ? '১. নিচে Share (↑)' : '1. Tap Share (↑)'}
                    </span>
                  </div>

                  <div className="rounded-xl bg-white dark:bg-[#041D15] p-2.5 border border-emerald-200/80 dark:border-emerald-800 flex flex-col items-center">
                    <svg viewBox="0 0 80 56" className="w-full max-w-[76px] h-14 mb-2" aria-hidden="true">
                      <rect x="10" y="6" width="60" height="44" rx="7" fill="#fff" stroke="#064E3B" strokeWidth="1.5" />
                      <rect x="16" y="14" width="48" height="7" rx="2" fill="#e2e8f0" />
                      <rect x="16" y="25" width="48" height="11" rx="3" fill="#064E3B" />
                      <text x="40" y="32.5" fontSize="4.8" fill="#F5E6BE" textAnchor="middle" fontWeight="bold">+ Add to Home</text>
                      <rect x="16" y="40" width="48" height="5" rx="2" fill="#e2e8f0" />
                    </svg>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white">
                      {isBn ? '২. Add to Home' : '2. Add to Home'}
                    </span>
                  </div>

                  <div className="rounded-xl bg-white dark:bg-[#041D15] p-2.5 border border-emerald-200/80 dark:border-emerald-800 flex flex-col items-center">
                    <svg viewBox="0 0 80 56" className="w-full max-w-[76px] h-14 mb-2" aria-hidden="true">
                      <rect x="24" y="4" width="32" height="48" rx="6" fill="#042F24" stroke="#D4AF37" strokeWidth="1.5" />
                      <rect x="31" y="14" width="18" height="18" rx="4" fill="#064E3B" stroke="#D4AF37" strokeWidth="1.2" />
                      <text x="40" y="25" fontSize="6" fill="#F5E6BE" textAnchor="middle" fontWeight="bold">SK</text>
                      <text x="40" y="42" fontSize="5" fill="#F5E6BE" textAnchor="middle" fontWeight="bold">Add ✓</text>
                    </svg>
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white">
                      {isBn ? '৩. Add চাপুন' : '3. Tap Add'}
                    </span>
                  </div>
                </div>
              </div>

              <ol className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                <li className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-[#0B261E] p-3 border border-slate-200 dark:border-emerald-900/60">
                  <Globe className="w-5 h-5 text-emerald-700 dark:text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {isBn ? 'ধাপ ১: Safari ব্রাউজারে খুলুন' : 'Step 1: Open in Safari'}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {isBn
                        ? 'আইফোনে অ্যাপ ইনস্টল করতে অবশ্যই Safari ব্রাউজারে লিংকটি ওপেন করুন।'
                        : 'On iPhone/iPad, Apple requires Safari to add PWAs to the Home Screen.'}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-[#0B261E] p-3 border border-slate-200 dark:border-emerald-900/60">
                  <Share className="w-5 h-5 text-emerald-700 dark:text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {isBn ? 'ধাপ ২: Share আইকন (↑) চাপুন' : 'Step 2: Tap the Share Icon (↑)'}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {isBn
                        ? 'Safari স্ক্রিনের নিচের মাঝখানে থাকা বক্স ও তীরচিহ্ন (↑) আইকনে ট্যাপ করুন।'
                        : 'Tap the square-with-arrow Share icon at the bottom bar of Safari.'}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-[#0B261E] p-3 border border-slate-200 dark:border-emerald-900/60">
                  <PlusSquare className="w-5 h-5 text-emerald-700 dark:text-[#D4AF37] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {isBn
                        ? 'ধাপ ৩: "Add to Home Screen" > "Add" চাপুন'
                        : 'Step 3: Tap "Add to Home Screen" → "Add"'}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {isBn
                        ? 'নিচের দিকে স্ক্রল করে Add to Home Screen সিলেক্ট করুন এবং উপরে ডানদিকে Add চাপুন।'
                        : 'Scroll down in the Share sheet, select Add to Home Screen, then tap Add.'}
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          )}

          {tab === 'share_fix' && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/70 dark:border-amber-700/60 p-4 space-y-2">
                <p className="text-sm font-bold text-amber-950 dark:text-amber-100 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    {isBn
                      ? 'কাউকে লিংক দিলে কেন এরর (404 / লগইন) দেখায়?'
                      : 'Why Shared Links Fail Until Published'}
                  </span>
                </p>
                <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  {isBn
                    ? 'আপনি এখন যে প্রিভিউ লিংকে কাজ করছেন (ais-dev-...) সেটি শুধু আপনার নিজস্ব Google অ্যাকাউন্টের জন্য। আর সবার জন্য থাকা শেয়ার লিংক (ais-pre-...) তখনই চালু হয় যখন আপনি AI Studio থেকে অ্যাপটি Share / Deploy করেন।'
                    : 'The development preview link (ais-dev-...) is restricted to your personal Google account. The public Shared URL (ais-pre-...) returns 404 until you publish/share the app in AI Studio.'}
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="rounded-xl bg-slate-50 dark:bg-[#0B261E] p-3.5 border border-slate-200 dark:border-emerald-900/60 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-[#D4AF37] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {isBn
                        ? 'সেটিং ১: AI Studio থেকে অ্যাপটি Share / Publish করুন'
                        : 'Fix 1: Publish via AI Studio Share / Deploy Button'}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {isBn
                        ? 'Google AI Studio-র উপরের ডানদিকের বারে থাকা "Share" (বা "Deploy / Rocket") বাটনে ক্লিক করে অ্যাপটি Publish করুন ও অ্যাক্সেস "Anyone with the link / Public" দিন। এরপর এই লিংকটি সবাই খুলতে পারবে:'
                        : 'Click the Share / Deploy button in the top-right bar of Google AI Studio and set visibility to public/anyone with link. Then this public link works for everyone:'}
                    </p>
                    <p className="text-[11px] font-mono bg-white dark:bg-[#041A13] p-2 rounded-lg border border-slate-200 dark:border-emerald-800 break-all text-emerald-900 dark:text-emerald-200">
                      {SHARED_APP_URL}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-[#0B261E] p-3.5 border border-slate-200 dark:border-emerald-900/60 flex items-start gap-3">
                  <Smartphone className="w-5 h-5 text-emerald-700 dark:text-[#D4AF37] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {isBn
                        ? 'সেটিং ২: প্রিভিউ ফ্রেমের বাইরে খুলে ডাউনলোড ও ইনস্টল করুন'
                        : 'Fix 2: Open Outside the Preview Iframe'}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {isBn
                        ? 'AI Studio-র প্রিভিউ বক্সের ভেতরে থাকলে ব্রাউজার ডাউনলোড ও ইনস্টল পপআপ আটকে দেয়। প্রিভিউয়ের কোনায় থাকা "Open in new tab" বা অ্যাপের ভেতরের "Chrome-এ খুলুন" বাটনে ক্লিক করে নতুন ট্যাবে খুললে সহজেই ডাউনলোড ও ইনস্টল হবে।'
                        : 'Embedded iframes block browser install prompts and some file downloads. Open the app in a standalone Chrome/Safari tab first.'}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-[#0B261E] p-3.5 border border-slate-200 dark:border-emerald-900/60 flex items-start gap-3">
                  <Download className="w-5 h-5 text-emerald-700 dark:text-[#D4AF37] shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {isBn
                        ? 'সেটিং ৩: সরাসরি .APK ফাইল শেয়ার করতে চাইলে'
                        : 'Fix 3: Sharing a Standalone .APK File'}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {isBn
                        ? 'সেটিং ১-এ পাবলিক লিংক লাইভ করার পর "ইনস্টল ও APK" হাবে থাকা PWABuilder বাটন দিয়ে আসল SK-NUR.apk তৈরি করে Google Drive-এ আপলোড করে লিংক শেয়ার করুন।'
                        : 'After publishing the public link in Step 1, generate SK-NUR.apk via the PWABuilder button and upload it to Google Drive for anyone to download.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer CTA */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-emerald-900/60">
            {onOpenInstallHub && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenInstallHub();
                }}
                className="flex-1 min-h-[44px] px-4 rounded-xl bg-[#D4AF37] hover:bg-[#e5c252] text-[#042F24] text-xs font-bold transition-colors"
              >
                {isBn ? 'ডাউনলোড, APK ও শেয়ার হাব খুলুন' : 'Open Download & APK Links'}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 rounded-xl border border-slate-200 dark:border-emerald-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              {isBn ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
