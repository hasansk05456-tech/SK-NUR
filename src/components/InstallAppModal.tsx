import React, {useEffect, useState} from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  Download,
  ExternalLink,
  FolderUp,
  HelpCircle,
  Loader2,
  Package,
  RefreshCw,
  Share2,
  Smartphone,
  X,
} from 'lucide-react';
import {useSkNur} from '../context/SkNurContext';
import {usePWAInstall} from '../hooks/usePWAInstall';
import {
  getActiveInstallUrl,
  getPwaBuilderUrl,
  isRunningInIframe,
  SHARED_APP_URL,
  shareDownloadedFile,
  triggerReliableDownload,
  type InstallInfoResponse,
} from '../lib/installLinks';
import {AppInstallationGuideModal} from './AppInstallationGuideModal';

interface InstallAppModalProps {
  open: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({open, onClose}) => {
  const {state, openMoreFeature} = useSkNur();
  const {isInstallable, isInstalled, isIOS, install} = usePWAInstall();
  const [copied, setCopied] = useState<'current' | 'shared' | null>(null);
  const [installInfo, setInstallInfo] = useState<InstallInfoResponse | null>(null);
  const [checkingLive, setCheckingLive] = useState(false);
  const [customPublicUrl, setCustomPublicUrl] = useState('');
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [downloadFeedback, setDownloadFeedback] = useState<{
    type: 'ok' | 'err';
    text: string;
    directUrl?: string;
  } | null>(null);

  const fetchInstallInfo = async (fresh = false) => {
    setCheckingLive(true);
    try {
      const r = await fetch(`/api/install-info${fresh ? '?fresh=1' : ''}`, {cache: 'no-store'});
      if (r.ok) {
        const data = (await r.json()) as InstallInfoResponse;
        setInstallInfo(data);
      }
    } catch {
      // Silent fallback to client origin
    } finally {
      setCheckingLive(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    void fetchInstallInfo(false);
  }, [open]);

  if (!open) return null;

  const isBn = state.settings.language === 'bn';
  const currentUrl = getActiveInstallUrl();
  const sharedLive = installInfo?.sharedUrlLive ?? false;
  const publicUrlForApk =
    customPublicUrl.trim().startsWith('https://')
      ? customPublicUrl.trim()
      : sharedLive
        ? SHARED_APP_URL
        : currentUrl;
  const pwabuilderUrl = getPwaBuilderUrl(publicUrlForApk);
  const zipDownloadUrl = `/api/download/android-project.zip?appUrl=${encodeURIComponent(publicUrlForApk)}`;
  const logoDownloadUrl = '/api/download/sk-nur-logo.png';
  const inIframe = isRunningInIframe();
  const canWebShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleCopyLink = async (textToCopy: string, which: 'current' | 'shared') => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(which);
      window.setTimeout(() => setCopied(null), 2500);
    } catch {
      setCopied(null);
    }
  };

  const handleShareLink = async (urlToShare: string) => {
    if (canWebShare) {
      try {
        await navigator.share({
          title: 'SK NUR — Islamic Lifestyle App',
          text: isBn
            ? 'SK NUR ইসলামিক অ্যাপ (কোরআন, নামাজ, দোয়া, তসবি, ক্যালেন্ডার):'
            : 'SK NUR Complete Islamic Companion App:',
          url: urlToShare,
        });
        return;
      } catch {
        // Fallback to copy
      }
    }
    await handleCopyLink(urlToShare, 'shared');
  };

  const handleNativeInstall = async () => {
    const accepted = await install();
    if (accepted) {
      onClose();
    }
  };

  const handleDownload = async (key: string, url: string, filename: string) => {
    setDownloadingKey(key);
    setDownloadFeedback(null);
    try {
      const {sizeBytes} = await triggerReliableDownload(url, filename);
      const kb = Math.round(sizeBytes / 1024);
      setDownloadFeedback({
        type: 'ok',
        text: isBn
          ? `${filename} (${kb} KB) ডাউনলোড শুরু হয়েছে! ফোনে প্রিভিউ ফ্রেম ডাউনলোড আটকালে নিচের "নতুন ট্যাবে সরাসরি ডাউনলোড" চাপুন।`
          : `${filename} (${kb} KB) download triggered! If your browser blocked the frame download, tap "Direct Download (New Tab)" below.`,
        directUrl: url,
      });
    } catch {
      setDownloadFeedback({
        type: 'err',
        text: isBn
          ? 'ফ্রেমের ভেতর ডাউনলোড ব্লক হয়েছে—নিচের "নতুন ট্যাবে সরাসরি ডাউনলোড" বাটনে চাপুন।'
          : 'Download blocked inside preview frame — tap Direct Download (New Tab) below.',
        directUrl: url,
      });
    } finally {
      setDownloadingKey(null);
    }
  };

  const handleShareZip = async () => {
    setDownloadingKey('share');
    try {
      const ok = await shareDownloadedFile(
        zipDownloadUrl,
        'SK-NUR-Android-Studio-Project.zip',
        'SK NUR Android Project',
        'application/zip'
      );
      if (!ok) {
        await handleDownload('zip', zipDownloadUrl, 'SK-NUR-Android-Studio-Project.zip');
      }
    } catch {
      // User dismissed share sheet
    } finally {
      setDownloadingKey(null);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isBn ? 'SK NUR অ্যাপ ইনস্টল ও ডাউনলোড' : 'Install & Download SK NUR'}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-xs p-0 sm:p-4"
    >
      <div className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#081F18] border border-slate-200 dark:border-emerald-800/70 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#042F24] text-white px-5 py-4 flex items-center justify-between gap-3 border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/sk-nur-logo.png"
              alt="SK NUR"
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#D4AF37]/60 shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold truncate">
                {isBn ? 'SK NUR ডাউনলোড ও ইনস্টল' : 'Download & Install SK NUR'}
              </h3>
              <p className="text-[11px] text-[#F5E6BE]/90 truncate">
                com.sknur.islamicapp · Offline PWA + Android
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
          {/* 1. Direct Phone Install */}
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/70 p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <Smartphone className="w-5 h-5 text-emerald-800 dark:text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-emerald-950 dark:text-white">
                  {isBn
                    ? '১. সরাসরি ফোনে অ্যাপ ইনস্টল (Chrome / Safari)'
                    : '1. Direct Phone Install (Chrome / Safari)'}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isInstalled
                    ? isBn
                      ? 'আপনার ফোনে SK NUR ইতিমধ্যে ইনস্টল করা আছে।'
                      : 'SK NUR is already installed on this device.'
                    : inIframe
                      ? isBn
                        ? 'প্রিভিউ ফ্রেমের ভেতর ব্রাউজার ইনস্টল অপশন লুকানো থাকে। নিচের বাটনে চাপ দিয়ে সরাসরি আপনার Chrome ব্রাউজারে খুলুন, তারপর ৩-ডট মেনু (⋮) থেকে "Install app" বা "Add to Home screen" চাপুন।'
                        : 'Open the live link below outside the preview frame in Chrome/Safari, then tap Install app / Add to Home screen.'
                      : isIOS
                        ? isBn
                          ? 'iPhone/iPad Safari-তে নিচে Share আইকনে চাপুন এবং "Add to Home Screen" সিলেক্ট করুন।'
                          : 'On iPhone/iPad Safari, tap Share → "Add to Home Screen".'
                        : isBn
                          ? 'নিচের বাটনে চাপলেই SK NUR সরাসরি ফোনে ইনস্টল হয়ে অফলাইনে কাজ করবে।'
                          : 'Tap below to install SK NUR directly on your phone.'}
                </p>
              </div>
            </div>

            {!isInstalled && isInstallable && !inIframe && (
              <button
                type="button"
                onClick={handleNativeInstall}
                className="w-full min-h-[44px] px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{isBn ? 'এখনই ফোনে ইনস্টল করুন' : 'Install SK NUR Now'}</span>
              </button>
            )}

            <div className="rounded-xl bg-white dark:bg-[#042119] border border-emerald-200/80 dark:border-emerald-800/70 p-2.5 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                aria-label="Current App URL"
                className="flex-1 min-w-0 bg-transparent text-xs font-mono text-slate-700 dark:text-emerald-100 outline-none select-all"
              />
              <button
                type="button"
                onClick={() => handleCopyLink(currentUrl, 'current')}
                className="min-h-[36px] px-3 rounded-lg bg-slate-100 dark:bg-emerald-900 text-slate-800 dark:text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
              >
                {copied === 'current' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>
                  {copied === 'current' ? (isBn ? 'কপি হয়েছে' : 'Copied') : isBn ? 'কপি' : 'Copy'}
                </span>
              </button>
            </div>

            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>
                {isBn
                  ? 'আপনার ফোনের Chrome-এ খুলুন ও ইনস্টল করুন'
                  : 'Open in Chrome to Install App'}
              </span>
            </a>

            <button
              type="button"
              onClick={() => setShowGuideModal(true)}
              className="w-full min-h-[40px] px-4 rounded-xl bg-white dark:bg-[#06261C] border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-[#F5E6BE] text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>
                {isBn
                  ? 'Android ও iPhone ভিজ্যুয়াল ইনস্টল + শেয়ার গাইড দেখুন'
                  : 'Open Visual Install Guide (Android & iOS)'}
              </span>
            </button>

            {/* Public Share Link section for sending to other people */}
            <div className="rounded-xl bg-white/80 dark:bg-[#06261C] border border-emerald-200/80 dark:border-emerald-800 p-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {isBn
                    ? 'অন্যদের পাঠানোর পাবলিক শেয়ার লিংক:'
                    : 'Public Share Link (For Everyone):'}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-bold ${
                      sharedLive
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {sharedLive
                      ? isBn
                        ? '● লাইভ আছে'
                        : '● Live'
                      : isBn
                        ? '○ Publish বাকি'
                        : '○ Not Published Yet'}
                  </span>
                  <button
                    type="button"
                    onClick={() => void fetchInstallInfo(true)}
                    disabled={checkingLive}
                    className="min-h-[28px] px-2 rounded-lg bg-slate-100 dark:bg-emerald-900 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${checkingLive ? 'animate-spin' : ''}`} />
                    <span>{isBn ? 'চেক' : 'Check'}</span>
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 dark:bg-[#041A13] border border-slate-200 dark:border-emerald-800/70 p-2 flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={SHARED_APP_URL}
                  aria-label="Public Share URL"
                  className="flex-1 min-w-0 bg-transparent text-[11px] font-mono text-slate-700 dark:text-emerald-100 outline-none select-all"
                />
                <button
                  type="button"
                  onClick={() => handleCopyLink(SHARED_APP_URL, 'shared')}
                  className="min-h-[32px] px-2.5 rounded-lg bg-slate-200/80 dark:bg-emerald-900 text-slate-800 dark:text-white text-[11px] font-semibold flex items-center gap-1 shrink-0"
                >
                  {copied === 'shared' ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copied === 'shared' ? (isBn ? 'কপি' : 'Copied') : isBn ? 'কপি' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => void handleShareLink(sharedLive ? SHARED_APP_URL : currentUrl)}
                  className="min-h-[32px] px-2.5 rounded-lg bg-emerald-800 text-white text-[11px] font-semibold flex items-center gap-1 shrink-0"
                >
                  <Share2 className="w-3 h-3" />
                  <span>{isBn ? 'শেয়ার' : 'Share'}</span>
                </button>
              </div>

              {!sharedLive && (
                <div className="flex items-start gap-1.5 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    {isBn
                      ? 'এই পাবলিক লিংকটি এখনই কাজ করতে হলে AI Studio স্ক্রিনের উপরের ডানদিকে "Share / Deploy" বাটনে ক্লিক করে অ্যাপটি Publish করুন—তারপর উপরের "চেক" চাপলেই লিংকটি সবার ফোনে খুলবে।'
                      : 'Click the Share / Deploy button in AI Studio top bar to publish this public link, then tap Check.'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 2. Reliable File Downloads (Android Studio ZIP + PNG Logo) */}
          <div className="rounded-2xl bg-slate-50 dark:bg-[#0B261E] border border-slate-200 dark:border-emerald-900/60 p-4 space-y-3">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {isBn
                ? '২. সরাসরি ফাইল ডাউনলোড (Android প্রজেক্ট ও লোগো)'
                : '2. Direct File Downloads (Android Studio ZIP & Logo)'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={downloadingKey === 'zip'}
                onClick={() =>
                  handleDownload('zip', zipDownloadUrl, 'SK-NUR-Android-Studio-Project.zip')
                }
                className="min-h-[44px] px-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                {downloadingKey === 'zip' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isBn ? 'Android প্রজেক্ট (.zip)' : 'Download Android (.zip)'}</span>
              </button>

              <button
                type="button"
                disabled={downloadingKey === 'logo'}
                onClick={() => handleDownload('logo', logoDownloadUrl, 'SK-NUR-Logo.png')}
                className="min-h-[44px] px-3.5 rounded-xl bg-white dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-center gap-2 hover:border-emerald-600"
              >
                {downloadingKey === 'logo' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 text-emerald-700 dark:text-[#D4AF37]" />
                )}
                <span>{isBn ? 'অফিসিয়াল লোগো (.png)' : 'Download Logo (.png)'}</span>
              </button>
            </div>

            {/* Guaranteed top-level tab download fallback for sandboxed iframes */}
            <div className="flex flex-wrap gap-2">
              <a
                href={zipDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-h-[40px] px-3 rounded-xl border border-emerald-700/40 text-emerald-900 dark:text-[#F5E6BE] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/40"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>
                  {isBn
                    ? 'নতুন ট্যাবে ZIP ডাউনলোড'
                    : 'Direct ZIP (New Tab)'}
                </span>
              </a>

              <a
                href={logoDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-h-[40px] px-3 rounded-xl border border-emerald-700/40 text-emerald-900 dark:text-[#F5E6BE] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/40"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>
                  {isBn ? 'নতুন ট্যাবে লোগো ডাউনলোড' : 'Direct Logo (New Tab)'}
                </span>
              </a>

              {canWebShare && (
                <button
                  type="button"
                  onClick={handleShareZip}
                  disabled={downloadingKey === 'share'}
                  className="min-h-[40px] px-3 rounded-xl bg-slate-200 dark:bg-emerald-900 text-slate-900 dark:text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isBn ? 'ফোনে সেভ/শেয়ার' : 'Share File'}</span>
                </button>
              )}
            </div>

            {downloadFeedback && (
              <div
                className={`rounded-xl p-3 text-xs space-y-2 ${
                  downloadFeedback.type === 'ok'
                    ? 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-700'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-100 border border-amber-300 dark:border-amber-700'
                }`}
              >
                <p>{downloadFeedback.text}</p>
                {downloadFeedback.directUrl && (
                  <a
                    href={downloadFeedback.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold underline underline-offset-4"
                  >
                    <span>
                      {isBn ? 'নতুন ট্যাবে সরাসরি ডাউনলোড করুন' : 'Direct Download (New Tab)'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* 3. Real APK via PWABuilder */}
          <div className="rounded-2xl bg-amber-50/70 dark:bg-[#102A21] border border-[#D4AF37]/40 p-4 space-y-3">
            <div className="flex items-start gap-2.5">
              <Package className="w-5 h-5 text-[#9A7418] dark:text-[#D4AF37] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {isBn
                    ? '৩. অনলাইনে আসল .APK ফাইল তৈরি (PWABuilder)'
                    : '3. Build Signed .APK Online (PWABuilder)'}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {isBn
                    ? 'অ্যাপটি Publish করার পর পাবলিক লিংক (বা নিজের যেকোনো HTTPS লিংক) ব্যবহার করে ৩০ সেকেন্ডে আসল signed SK-NUR.apk ডাউনলোড করতে পারবেন:'
                    : 'Use your published HTTPS app link below to generate a signed SK-NUR.apk and Play Store .aab via PWABuilder:'}
                </p>
              </div>
            </div>

            <input
              type="url"
              value={customPublicUrl}
              onChange={(e) => setCustomPublicUrl(e.target.value)}
              placeholder={
                isBn
                  ? `পাবলিক URL (ফাঁকা রাখলে: ${publicUrlForApk})`
                  : `Optional custom HTTPS URL`
              }
              className="w-full min-h-[40px] px-3 rounded-xl bg-white dark:bg-[#042119] border border-amber-300/70 dark:border-emerald-800 text-xs font-mono text-slate-800 dark:text-emerald-100"
            />

            <a
              href={pwabuilderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[44px] px-4 rounded-xl bg-[#D4AF37] hover:bg-[#c5a12f] text-[#042F24] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>
                {isBn
                  ? 'অনলাইনে .APK তৈরি করুন (PWABuilder)'
                  : 'Build Real .APK Online (PWABuilder)'}
              </span>
            </a>

            <button
              type="button"
              onClick={() => {
                onClose();
                openMoreFeature('android_drive');
              }}
              className="w-full min-h-[42px] px-4 rounded-xl border border-emerald-700/40 text-emerald-900 dark:text-[#F5E6BE] text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-colors"
            >
              <FolderUp className="w-4 h-4" />
              <span>
                {isBn
                  ? 'Google Drive আপলোড ও শেয়ার হাব খুলুন'
                  : 'Open Google Drive & Full APK Hub'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <AppInstallationGuideModal
        open={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
    </div>
  );
};
