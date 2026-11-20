import React, {useEffect, useState} from 'react';
import {
  Bell,
  Check,
  CloudUpload,
  Copy,
  Download,
  ExternalLink,
  FolderUp,
  Loader2,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Trash2,
} from 'lucide-react';
import {useSkNur} from '../context/SkNurContext';
import {
  deleteDriveFile,
  downloadDriveJsonFile,
  getAccessToken,
  listSkNurDriveFiles,
  uploadMultipartToDrive,
  type DriveFileSummary,
} from '../lib/authAndDrive';
import {usePWAInstall} from '../hooks/usePWAInstall';
import {
  getActiveInstallUrl,
  getPwaBuilderUrl,
  isRunningInIframe,
  SHARED_APP_URL,
  triggerReliableDownload,
  type InstallInfoResponse,
} from '../lib/installLinks';
import {InstallAppModal} from './InstallAppModal';
import type {Language} from '../types/islamic';

const GoogleSignInButton: React.FC<{onClick: () => void; loading: boolean; label: string}> = ({
  onClick,
  loading,
  label,
}) => (
  <button type="button" onClick={onClick} disabled={loading} className="gsi-material-button">
    <div className="gsi-material-button-state" />
    <div className="gsi-material-button-content-wrapper">
      <div className="gsi-material-button-icon">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          style={{display: 'block'}}
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
      </div>
      <span className="gsi-material-button-contents">{loading ? 'Signing in...' : label}</span>
    </div>
  </button>
);

export const NotificationsView: React.FC = () => {
  const {
    state,
    updateSettings,
    addCustomReminder,
    toggleCustomReminder,
    deleteCustomReminder,
  } = useSkNur();
  const isBn = state.settings.language === 'bn';
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('08:00');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addCustomReminder({title: newTitle.trim(), time: newTime, enabled: true, type: 'custom'});
    setNewTitle('');
  };

  const toggles: {key: keyof typeof state.settings; en: string; bn: string}[] = [
    {key: 'azkarMorningReminder', en: 'Morning Azkar Reminder', bn: 'সকালের যিকির রিমাইন্ডার'},
    {key: 'azkarEveningReminder', en: 'Evening Azkar Reminder', bn: 'সন্ধ্যার যিকির রিমাইন্ডার'},
    {key: 'dailyQuranReminder', en: 'Daily Quran Reading Reminder', bn: 'দৈনিক কোরআন পাঠ রিমাইন্ডার'},
    {key: 'dailyHadithReminder', en: 'Daily Hadith Notification', bn: 'দৈনিক হাদিস নোটিফিকেশন'},
    {key: 'jumuahReminder', en: 'Friday (Jumuah) Reminder', bn: 'জুমুআ ও সূরা কাহাফ রিমাইন্ডার'},
    {key: 'ramadanReminder', en: 'Ramadan Sehri & Iftar Alerts', bn: 'রমজান সেহরি ও ইফতার অ্যালার্ট'},
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 divide-y divide-slate-100 dark:divide-emerald-900/50">
        {toggles.map((item) => {
          const active = Boolean(state.settings[item.key]);
          return (
            <div key={item.key} className="py-3 flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-slate-900 dark:text-white font-bengali">
                {isBn ? item.bn : item.en}
              </span>
              <button
                type="button"
                onClick={() => updateSettings({[item.key]: !active})}
                className={`min-h-[36px] px-3.5 rounded-xl text-xs font-bold ${
                  active
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 dark:bg-emerald-950 text-slate-500 dark:text-slate-400'
                }`}
              >
                {active ? 'ON' : 'OFF'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-700 dark:text-[#D4AF37]" />
          <span>{isBn ? 'কাস্টম ইসলামিক রিমাইন্ডার' : 'Custom Islamic Reminders'}</span>
        </h3>

        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={isBn ? 'রিমাইন্ডারের নাম (যেমন: সূরা মুলক পাঠ)' : 'Reminder title...'}
            className="flex-1 min-h-[44px] px-3.5 rounded-xl bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 text-sm text-slate-900 dark:text-white"
            required
          />
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="min-h-[44px] px-3 rounded-xl bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 font-mono-tabular text-sm text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="min-h-[44px] px-4 rounded-xl bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{isBn ? 'যোগ করুন' : 'Add'}</span>
          </button>
        </form>

        <div className="divide-y divide-slate-100 dark:divide-emerald-900/50">
          {state.customReminders.map((rem) => (
            <div key={rem.id} className="py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{rem.title}</p>
                <p className="font-mono-tabular text-xs text-slate-500 dark:text-slate-400">
                  {rem.time}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleCustomReminder(rem.id)}
                  className={`min-h-[36px] px-3 rounded-lg text-xs font-bold ${
                    rem.enabled
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 dark:bg-emerald-950 text-slate-400'
                  }`}
                >
                  {rem.enabled ? 'ON' : 'OFF'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteCustomReminder(rem.id)}
                  aria-label="Delete reminder"
                  className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ProfileSettingsView: React.FC = () => {
  const {
    state,
    updateSettings,
    setLanguage,
    toggleDarkMode,
    googleUser,
    driveTokenReady,
    isSigningIn,
    signInWithGoogle,
    signOutGoogle,
    restoreFullState,
    resetAllLocalData,
    syncToServer,
  } = useSkNur();

  const isBn = state.settings.language === 'bn';
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<null | {
    title: string;
    description: string;
    onConfirm: () => Promise<void> | void;
  }>(null);

  const handleExportLocalJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SK-NUR-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    setStatusMsg(isBn ? 'ব্যাকআপ ফাইল ডাউনলোড হয়েছে।' : 'Local backup exported.');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      setConfirmAction({
        title: isBn ? 'ব্যাকআপ রিস্টোর নিশ্চিত করুন' : 'Confirm Restore Backup',
        description: isBn
          ? `আপনি কি "${file.name}" থেকে আপনার সব তথ্য ও সেটিংস রিস্টোর করতে চান? বর্তমান লোকাল ডেটা পরিবর্তন হবে।`
          : `Restore SK NUR data and settings from "${file.name}"? This will overwrite your current local progress.`,
        onConfirm: () => {
          restoreFullState(parsed);
          setStatusMsg(isBn ? 'তথ্য সফলভাবে রিস্টোর হয়েছে!' : 'Backup restored successfully.');
        },
      });
    } catch {
      setStatusMsg('Invalid backup JSON file.');
    }
  };

  const handleCloudSync = async () => {
    const ok = await syncToServer();
    setStatusMsg(
      ok
        ? isBn
          ? 'সার্ভার ডাটাবেসে তথ্য সংরক্ষিত হয়েছে।'
          : 'Synced to SK NUR backend database.'
        : 'Server sync failed.'
    );
  };

  return (
    <div className="space-y-6">
      {/* Account & Google Sign-In */}
      <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {googleUser?.photoURL ? (
              <img
                src={googleUser.photoURL}
                alt={googleUser.displayName || 'User'}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#C89F3C]"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-lg">
                {(state.settings.profileName || 'S').charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {googleUser?.displayName || state.settings.profileName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {googleUser?.email || state.settings.profileEmail || 'Offline Local Profile'}
              </p>
            </div>
          </div>

          {!googleUser || !driveTokenReady ? (
            <GoogleSignInButton
              onClick={() => signInWithGoogle()}
              loading={isSigningIn}
              label="Sign in with Google"
            />
          ) : (
            <button
              type="button"
              onClick={() => signOutGoogle()}
              className="min-h-[44px] px-4 rounded-xl border border-slate-200 dark:border-emerald-800 text-xs font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              {isBn ? 'আপনার নাম' : 'Display Name'}
            </label>
            <input
              type="text"
              value={state.settings.profileName}
              onChange={(e) => updateSettings({profileName: e.target.value})}
              className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 text-sm text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              {isBn ? 'ইমেইল' : 'Email'}
            </label>
            <input
              type="email"
              value={state.settings.profileEmail}
              onChange={(e) => updateSettings({profileEmail: e.target.value})}
              placeholder="name@example.com"
              className="w-full min-h-[44px] px-3.5 rounded-xl bg-slate-50 dark:bg-emerald-950 border border-slate-200 dark:border-emerald-800 text-sm text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Language, Theme & Privacy */}
      <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {isBn ? 'ভাষা, থিম ও প্রাইভেসি' : 'Language, Appearance & Privacy'}
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-slate-700 dark:text-slate-200">
            {isBn ? 'অ্যাপের ভাষা নির্বাচন' : 'App Language'}
          </span>
          <div className="flex gap-2">
            {(
              [
                {code: 'bn', label: 'বাংলা'},
                {code: 'en', label: 'English'},
                {code: 'ar', label: 'العربية'},
              ] as {code: Language; label: string}[]
            ).map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold min-h-[40px] ${
                  state.settings.language === l.code
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 dark:bg-emerald-950 text-slate-700 dark:text-slate-300'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-emerald-900/50">
          <span className="text-sm text-slate-700 dark:text-slate-200">
            {isBn ? 'ডার্ক / লাইট মোড' : 'Dark / Light Mode'}
          </span>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="min-h-[40px] px-4 rounded-xl bg-emerald-800 text-white text-xs font-semibold"
          >
            {state.settings.darkMode ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-emerald-900/50">
          <span className="text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-[#D4AF37]" />
            <span>{isBn ? 'প্রাইভেসি মোড (হোমে পরিসংখ্যান লুকান)' : 'Privacy Mode'}</span>
          </span>
          <button
            type="button"
            onClick={() => updateSettings({privacyHideStats: !state.settings.privacyHideStats})}
            className={`min-h-[36px] px-3.5 rounded-xl text-xs font-bold ${
              state.settings.privacyHideStats
                ? 'bg-emerald-800 text-white'
                : 'bg-slate-100 dark:bg-emerald-950 text-slate-500'
            }`}
          >
            {state.settings.privacyHideStats ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 border border-slate-200 dark:border-emerald-900/60 space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {isBn ? 'ডেটা ব্যাকআপ ও রিস্টোর' : 'Data Backup & Restore'}
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExportLocalJson}
            className="min-h-[44px] px-4 rounded-xl bg-emerald-800 text-white text-xs font-semibold flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{isBn ? 'ব্যাকআপ ডাউনলোড (JSON)' : 'Download Backup'}</span>
          </button>

          <label className="min-h-[44px] px-4 rounded-xl border border-slate-200 dark:border-emerald-800 text-xs font-semibold flex items-center gap-2 cursor-pointer text-slate-800 dark:text-slate-200">
            <RefreshCw className="w-4 h-4" />
            <span>{isBn ? 'ব্যাকআপ রিস্টোর করুন' : 'Restore File'}</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            type="button"
            onClick={handleCloudSync}
            className="min-h-[44px] px-4 rounded-xl bg-slate-100 dark:bg-emerald-950 text-emerald-900 dark:text-[#F5E6BE] text-xs font-semibold"
          >
            {isBn ? 'সার্ভারে সিঙ্ক করুন' : 'Sync to Server'}
          </button>

          <button
            type="button"
            onClick={() =>
              setConfirmAction({
                title: isBn ? 'সব ডেটা রিসেট করবেন?' : 'Reset All Local Data?',
                description: isBn
                  ? 'এতে আপনার বুকমার্ক, তসবি হিসাব ও সেটিংস মুছে যাবে।'
                  : 'This will permanently clear all local bookmarks, Tasbih history, and preferences.',
                onConfirm: () => {
                  resetAllLocalData();
                  setStatusMsg('Local data reset.');
                },
              })
            }
            className="min-h-[44px] px-4 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold"
          >
            {isBn ? 'ডেটা রিসেট' : 'Reset Data'}
          </button>
        </div>
        {statusMsg && <p className="text-xs text-emerald-700 dark:text-emerald-300">{statusMsg}</p>}
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0A221B] p-6 border border-slate-200 dark:border-emerald-800 space-y-4">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              {confirmAction.title}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">{confirmAction.description}</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="min-h-[44px] px-4 rounded-xl border border-slate-200 dark:border-emerald-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const fn = confirmAction.onConfirm;
                  setConfirmAction(null);
                  await fn();
                }}
                className="min-h-[44px] px-4 rounded-xl bg-emerald-800 text-white text-xs font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AndroidDriveHubView: React.FC = () => {
  const {
    state,
    googleUser,
    driveTokenReady,
    isSigningIn,
    signInWithGoogle,
    restoreFullState,
  } = useSkNur();
  const {isInstallable, isInstalled, install} = usePWAInstall();
  const isBn = state.settings.language === 'bn';
  const currentUrl = getActiveInstallUrl();
  const inIframe = isRunningInIframe();

  const [installInfo, setInstallInfo] = useState<InstallInfoResponse | null>(null);
  const [driveFiles, setDriveFiles] = useState<DriveFileSummary[]>([]);
  const [busy, setBusy] = useState(false);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const [downloadNote, setDownloadNote] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copiedAppUrl, setCopiedAppUrl] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<null | {
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => Promise<void>;
  }>(null);

  useEffect(() => {
    fetch('/api/install-info')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: InstallInfoResponse | null) => {
        if (data) setInstallInfo(data);
      })
      .catch(() => {});
  }, []);

  const sharedLive = installInfo?.sharedUrlLive ?? false;
  const appUrl = sharedLive ? SHARED_APP_URL : currentUrl;
  const pwabuilderUrl = getPwaBuilderUrl(appUrl);
  const zipDownloadUrl = `/api/download/android-project.zip?appUrl=${encodeURIComponent(appUrl)}`;
  const logoDownloadUrl = '/api/download/sk-nur-logo.png';

  const handleReliableDownload = async (key: string, url: string, filename: string) => {
    setDownloadingKey(key);
    setDownloadNote(null);
    try {
      const {sizeBytes} = await triggerReliableDownload(url, filename);
      const kb = Math.round(sizeBytes / 1024);
      setDownloadNote(
        isBn
          ? `${filename} (${kb} KB) ডাউনলোড শুরু হয়েছে। ফ্রেমের ভেতর সেভ না হলে নিচের "নতুন ট্যাবে ডাউনলোড" লিংকে চাপুন।`
          : `${filename} (${kb} KB) download started. If blocked by preview frame, use the "New Tab Download" link below.`
      );
    } catch {
      setDownloadNote(
        isBn
          ? 'ফ্রেম থেকে ডাউনলোড ব্লক হয়েছে—নিচের "নতুন ট্যাবে ডাউনলোড" লিংকে ক্লিক করুন।'
          : 'Frame blocked download — tap the New Tab Download link below.'
      );
    } finally {
      setDownloadingKey(null);
    }
  };

  const handleCopyAppUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedAppUrl(true);
      window.setTimeout(() => setCopiedAppUrl(false), 2500);
    } catch {
      setCopiedAppUrl(false);
    }
  };

  const loadDriveFiles = async () => {
    const token = getAccessToken();
    if (!token) return;
    setBusy(true);
    try {
      const files = await listSkNurDriveFiles(token);
      setDriveFiles(files);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to list Google Drive files');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (driveTokenReady) {
      loadDriveFiles();
    }
  }, [driveTokenReady]);

  const handleUploadBackupToDrive = async () => {
    const token = getAccessToken();
    if (!token) return;
    setBusy(true);
    setMessage(null);
    try {
      const fileName = `SK-NUR-Backup-${new Date().toISOString().slice(0, 10)}.json`;
      const blob = new Blob([JSON.stringify(state, null, 2)], {type: 'application/json'});
      const uploaded = await uploadMultipartToDrive(token, fileName, 'application/json', blob, false);
      setMessage(
        isBn
          ? `Google Drive-এ ব্যাকআপ আপলোড সম্পন্ন হয়েছে: ${uploaded.name}`
          : `Uploaded backup to Google Drive: ${uploaded.name}`
      );
      await loadDriveFiles();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Backup upload failed');
    } finally {
      setBusy(false);
    }
  };

  const handleUploadAndroidProjectToDrive = async () => {
    const token = getAccessToken();
    if (!token) return;
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch('/api/download/android-project.zip');
      if (!res.ok) throw new Error('Could not package Android Studio project');
      const zipBlob = await res.blob();
      const uploaded = await uploadMultipartToDrive(
        token,
        'SK-NUR-Android-Studio-Project.zip',
        'application/zip',
        zipBlob,
        true
      );
      const link = uploaded.webViewLink || uploaded.webContentLink || null;
      setShareLink(link);
      setMessage(
        isBn
          ? 'Android Studio প্রজেক্ট Google Drive-এ আপলোড ও পাবলিক শেয়ার লিংক তৈরি হয়েছে!'
          : 'Android Studio project uploaded to Google Drive with public shareable link!'
      );
      await loadDriveFiles();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  const handleUploadLogoToDrive = async () => {
    const token = getAccessToken();
    if (!token) return;
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch('/api/download/sk-nur-logo.png');
      const pngBlob = await res.blob();
      const uploaded = await uploadMultipartToDrive(
        token,
        'SK-NUR-Logo.png',
        'image/png',
        pngBlob,
        true
      );
      const link = uploaded.webViewLink || uploaded.webContentLink || null;
      setShareLink(link);
      setMessage(isBn ? 'SK NUR লোগো Google Drive-এ আপলোড হয়েছে!' : 'SK NUR Logo uploaded to Drive!');
      await loadDriveFiles();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Logo upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Direct Downloads & Mobile Install */}
      <div className="rounded-3xl bg-[#042F24] text-white p-6 border border-[#C89F3C]/35 space-y-4">
        <div className="flex items-start gap-4">
          <img
            src="/sk-nur-logo.png"
            alt="SK NUR App Icon"
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#D4AF37]/60 shrink-0"
          />
          <div>
            <h3 className="font-display text-2xl font-bold">
              SK NUR · com.sknur.islamicapp
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/85 mt-1 font-bengali">
              {isBn
                ? 'অ্যান্ড্রয়েড স্টুডিও প্রজেক্ট, অফিসিয়াল PNG লোগো, PWA সরাসরি ইনস্টল এবং Google Drive শেয়ারিং হাব।'
                : 'Android Studio Kotlin project, official PNG launcher icon, direct mobile install, and Google Drive sharing hub.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          {!isInstalled && (
            <button
              type="button"
              onClick={() => {
                if (isInstallable && !inIframe) {
                  void install();
                } else {
                  setShowInstallModal(true);
                }
              }}
              className="min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>
                {isBn ? 'সরাসরি ফোনে ইনস্টল / লিংক' : 'Install Directly on Phone'}
              </span>
            </button>
          )}

          <a
            href={pwabuilderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#D4AF37] text-[#042F24] text-xs font-bold flex items-center gap-2 hover:bg-[#e5c252] transition-colors"
          >
            <Package className="w-4 h-4" />
            <span>
              {isBn
                ? 'অনলাইনে .APK তৈরি করুন (PWABuilder)'
                : 'Build Real .APK Online (PWABuilder)'}
            </span>
          </a>

          <button
            type="button"
            disabled={downloadingKey === 'zip'}
            onClick={() =>
              handleReliableDownload('zip', zipDownloadUrl, 'SK-NUR-Android-Studio-Project.zip')
            }
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            {downloadingKey === 'zip' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>
              {isBn
                ? 'Android Studio প্রজেক্ট (.zip)'
                : 'Android Studio Project (.zip)'}
            </span>
          </button>

          <button
            type="button"
            disabled={downloadingKey === 'logo'}
            onClick={() => handleReliableDownload('logo', logoDownloadUrl, 'SK-NUR-Logo.png')}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            {downloadingKey === 'logo' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isBn ? 'SK NUR লোগো (PNG)' : 'Download Logo (PNG)'}</span>
          </button>
        </div>

        {/* Guaranteed direct new-tab download fallbacks (works even when iframe blocks blob/download attribute) */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-100/90">
          <a
            href={zipDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-[#F5E6BE] inline-flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isBn ? 'নতুন ট্যাবে ZIP ডাউনলোড' : 'Direct ZIP (New Tab)'}</span>
          </a>
          <span aria-hidden="true">·</span>
          <a
            href={logoDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-[#F5E6BE] inline-flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isBn ? 'নতুন ট্যাবে লোগো ডাউনলোড' : 'Direct Logo (New Tab)'}</span>
          </a>
        </div>

        {downloadNote && (
          <div className="rounded-xl bg-emerald-950/90 border border-[#D4AF37]/40 p-3 text-xs text-[#F5E6BE]">
            {downloadNote}
          </div>
        )}

        {/* Shareable Live Phone URL inside hub */}
        <div className="rounded-2xl bg-black/30 border border-white/15 p-3.5 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold text-[#F5E6BE] font-bengali">
              {isBn
                ? 'ফোনের Chrome-এ ইনস্টল করার ডাইরেক্ট লিংক (Preview iframe-এর বাইরে):'
                : 'Direct Phone Install Link (Open outside preview frame in Chrome):'}
            </p>
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-emerald-300 hover:text-white underline underline-offset-4 inline-flex items-center gap-1"
            >
              <span>{isBn ? 'Chrome-এ ওপেন করুন' : 'Open in Chrome'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-black/40 border border-white/10 px-3 py-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              aria-label="Live SK NUR App URL"
              className="flex-1 min-w-0 bg-transparent text-xs font-mono text-emerald-100 outline-none select-all"
            />
            <button
              type="button"
              onClick={handleCopyAppUrl}
              className="min-h-[34px] px-3 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
            >
              {copiedAppUrl ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAppUrl ? (isBn ? 'কপি হয়েছে' : 'Copied') : isBn ? 'কপি লিংক' : 'Copy'}</span>
            </button>
          </div>
          {!sharedLive && (
            <p className="text-[11px] text-amber-200/90 leading-relaxed font-bengali">
              {isBn
                ? 'বিঃদ্রঃ অন্য কারো ফোনে এই অ্যাপ শেয়ার করতে চাইলে আগে AI Studio-র উপরের Share / Publish বাটন থেকে অ্যাপটি Publish করুন, নইলে পাবলিক লিংক কাজ করবে না।'
                : 'Note: To allow other users to open and install SK NUR on their phones, publish/share the app via AI Studio Share first.'}
            </p>
          )}
        </div>
      </div>

      {/* Google Drive Cloud Upload & Share */}
      <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 sm:p-6 border border-slate-200 dark:border-emerald-900/60 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderUp className="w-5 h-5 text-emerald-700 dark:text-[#D4AF37]" />
              <span>{isBn ? 'Google Drive আপলোড ও শেয়ার লিংক' : 'Google Drive Sync & Share'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isBn
                ? 'আপনার অনুমতি সাপেক্ষে Google Drive-এ ব্যাকআপ ও Android প্রজেক্ট আপলোড করে শেয়ারযোগ্য লিংক তৈরি করুন।'
                : 'Upload your SK NUR backup or Android Studio package directly to Google Drive and create a shareable link.'}
            </p>
          </div>

          {!googleUser || !driveTokenReady ? (
            <GoogleSignInButton
              onClick={() => signInWithGoogle()}
              loading={isSigningIn}
              label="Sign in with Google"
            />
          ) : (
            <span className="text-xs font-semibold text-emerald-800 dark:text-[#F5E6BE] flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Connected: {googleUser.email}</span>
            </span>
          )}
        </div>

        {driveTokenReady && (
          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              type="button"
              disabled={busy}
              onClick={handleUploadAndroidProjectToDrive}
              className="min-h-[44px] px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
              <span>
                {isBn
                  ? 'Drive-এ Android প্রজেক্ট আপলোড ও লিংক তৈরি'
                  : 'Upload Android Project & Create Share Link'}
              </span>
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={handleUploadBackupToDrive}
              className="min-h-[44px] px-4 rounded-xl border border-slate-200 dark:border-emerald-800 text-xs font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200"
            >
              <CloudUpload className="w-4 h-4" />
              <span>{isBn ? 'ডেটা ব্যাকআপ সেভ করুন' : 'Backup User Data to Drive'}</span>
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={handleUploadLogoToDrive}
              className="min-h-[44px] px-4 rounded-xl border border-slate-200 dark:border-emerald-800 text-xs font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200"
            >
              <CloudUpload className="w-4 h-4" />
              <span>{isBn ? 'লোগো PNG আপলোড' : 'Upload Logo PNG'}</span>
            </button>
          </div>
        )}

        {message && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/40 p-3 text-xs font-medium text-emerald-900 dark:text-[#F5E6BE]">
            {message}
          </div>
        )}

        {shareLink && (
          <div className="rounded-xl bg-slate-50 dark:bg-emerald-950/60 p-4 border border-emerald-700/30 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-emerald-900 dark:text-[#F5E6BE]">
                {isBn ? 'শেয়ারযোগ্য Google Drive লিংক (Anyone with link):' : 'Shareable Google Drive Link:'}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5">{shareLink}</p>
            </div>
            <a
              href={shareLink}
              target="_blank"
              rel="noreferrer"
              className="min-h-[40px] px-3.5 rounded-xl bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open</span>
            </a>
          </div>
        )}

        {driveFiles.length > 0 && (
          <div className="pt-2 space-y-2">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {isBn ? 'আপনার Google Drive-এ সংরক্ষিত SK NUR ফাইল:' : 'Your SK NUR Files in Google Drive:'}
            </p>
            <div className="divide-y divide-slate-100 dark:divide-emerald-900/50 border border-slate-200 dark:border-emerald-900/60 rounded-xl">
              {driveFiles.map((f) => (
                <div key={f.id} className="p-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{f.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {f.modifiedTime ? new Date(f.modifiedTime).toLocaleString() : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {f.name.endsWith('.json') && (
                      <button
                        type="button"
                        onClick={() =>
                          setConfirmModal({
                            title: isBn ? 'Google Drive থেকে রিস্টোর?' : 'Restore Backup from Drive?',
                            description: isBn
                              ? `"${f.name}" থেকে ডেটা রিস্টোর করলে বর্তমান লোকাল প্রগ্রেস পরিবর্তন হবে।`
                              : `Restoring "${f.name}" will overwrite your local bookmarks, Tasbih stats, and settings.`,
                            confirmLabel: 'Restore',
                            onConfirm: async () => {
                              const token = getAccessToken();
                              if (!token) return;
                              const json = await downloadDriveJsonFile(token, f.id);
                              restoreFullState(json);
                              setMessage('Restored from Google Drive!');
                            },
                          })
                        }
                        className="min-h-[36px] px-3 rounded-lg bg-emerald-800 text-white text-xs font-semibold"
                      >
                        Restore
                      </button>
                    )}
                    {f.webViewLink && (
                      <a
                        href={f.webViewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="min-h-[36px] px-3 rounded-lg border border-slate-200 dark:border-emerald-800 text-xs font-semibold flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmModal({
                          title: isBn ? 'Google Drive থেকে ফাইল মুছবেন?' : 'Delete File from Google Drive?',
                          description: isBn
                            ? `আপনি কি নিশ্চিতভাবে "${f.name}" ফাইলটি আপনার Google Drive থেকে মুছে ফেলতে চান?`
                            : `Are you sure you want to permanently delete "${f.name}" from your Google Drive?`,
                          confirmLabel: 'Delete',
                          onConfirm: async () => {
                            const token = getAccessToken();
                            if (!token) return;
                            await deleteDriveFile(token, f.id);
                            setMessage(`Deleted ${f.name}`);
                            await loadDriveFiles();
                          },
                        })
                      }
                      aria-label={`Delete ${f.name}`}
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bengali APK & Android Studio Instructions */}
      <div className="rounded-2xl bg-white dark:bg-[#0B261E] p-5 sm:p-6 border border-slate-200 dark:border-emerald-900/60 space-y-3 font-bengali">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          ফোনে ইনস্টল ও আসল .APK ফাইল তৈরি করার সহজ গাইড (বাংলায়)
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          কেন আগে ইনস্টল হচ্ছিল না? এই প্রিভিউ পেজটি একটি ফ্রেমের (iframe) ভেতরে চলে, তাই ব্রাউজার সেখানে সরাসরি ইনস্টল পপআপ দেখায় না; এবং এই সার্ভারের ভেতরে Android SDK না থাকায় সার্ভার থেকে সরাসরি বাইনারি <code>.apk</code> কম্পাইল হয় না। এখন নিচের যেকোনো একটি সহজ পদ্ধতিতে অ্যাপটি ইনস্টল বা আসল APK তৈরি করতে পারবেন:
        </p>
        <ol className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 space-y-2 list-decimal pl-5 leading-relaxed">
          <li>
            <strong>পদ্ধতি ১ — সরাসরি ফোনে ইনস্টল (১ মিনিটে):</strong> উপরের <strong>Chrome-এ ওপেন করুন</strong> লিংকে ট্যাপ করে বাইরের Chrome ব্রাউজারে অ্যাপটি খুলুন, তারপর Chrome মেনু (⋮) থেকে <strong>Install app / Add to Home screen</strong> চাপুন—SK NUR লোগোসহ সরাসরি ফোনে ইনস্টল হয়ে অফলাইনে কাজ করবে।
          </li>
          <li>
            <strong>পদ্ধতি ২ — পিসি ছাড়াই অনলাইনে আসল .APK তৈরি (PWABuilder):</strong> উপরের <strong>অনলাইনে .APK তৈরি করুন (PWABuilder)</strong> বাটনে ক্লিক করুন &gt; <strong>Package for Stores</strong> &gt; <strong>Android</strong> &gt; <strong>Generate Package</strong> চাপলে ৩০ সেকেন্ডের মধ্যে আসল signed <code>SK-NUR.apk</code> ও Play Store <code>.aab</code> ডাউনলোড হয়ে যাবে।
          </li>
          <li>
            <strong>পদ্ধতি ৩ — Android Studio / GitHub Actions থেকে APK ও AAB:</strong> <strong>Android Studio প্রজেক্ট (.zip)</strong> ডাউনলোড করে Android Studio-তে <strong>Build &gt; Generate Signed Bundle / APK</strong> থেকে রিলিজ APK/AAB তৈরি করুন অথবা GitHub Actions-এ বিল্ড করুন।
          </li>
          <li>
            <strong>পদ্ধতি ৪ — Google Drive-এ শেয়ার:</strong> ডাউনলোড করা <code>SK-NUR.apk</code> বা প্রজেক্ট ফাইল উপরে Sign in করে Google Drive-এ আপলোড করে পাবলিক লিংক তৈরি করতে পারবেন।
          </li>
        </ol>
      </div>

      <InstallAppModal open={showInstallModal} onClose={() => setShowInstallModal(false)} />

      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0A221B] p-6 border border-slate-200 dark:border-emerald-800 space-y-4">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              {confirmModal.title}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {confirmModal.description}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="min-h-[44px] px-4 rounded-xl border border-slate-200 dark:border-emerald-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const fn = confirmModal.onConfirm;
                  setConfirmModal(null);
                  await fn();
                }}
                className="min-h-[44px] px-4 rounded-xl bg-emerald-800 text-white text-xs font-semibold"
              >
                {confirmModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
