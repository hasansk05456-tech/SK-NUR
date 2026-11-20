export const SHARED_APP_URL =
  'https://ais-pre-44jbd5qtkei7m57an74paz-1008180750906.asia-east1.run.app';

export interface InstallInfoResponse {
  appName: string;
  packageId: string;
  appUrl: string;
  sharedUrl: string;
  sharedUrlLive: boolean;
  pwabuilderUrl: string;
  androidZipUrl: string;
  logoUrl: string;
}

export function getActiveInstallUrl(): string {
  if (typeof window === 'undefined') {
    return SHARED_APP_URL;
  }
  const origin = window.location.origin;
  if (
    !origin ||
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    origin.includes('0.0.0.0')
  ) {
    return SHARED_APP_URL;
  }
  return origin;
}

export function getPwaBuilderUrl(siteUrl?: string): string {
  const target = siteUrl || getActiveInstallUrl();
  return `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(target)}`;
}

export function isRunningInIframe(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export async function triggerReliableDownload(
  url: string,
  filename: string
): Promise<{ok: boolean; sizeBytes: number}> {
  const res = await fetch(url, {credentials: 'same-origin', cache: 'no-store'});
  if (!res.ok) {
    throw new Error(`Download failed (${res.status})`);
  }
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 15_000);

  return {ok: true, sizeBytes: blob.size};
}

export async function shareDownloadedFile(
  url: string,
  filename: string,
  title: string,
  mimeType: string
): Promise<boolean> {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return false;
  }
  const res = await fetch(url, {credentials: 'same-origin', cache: 'no-store'});
  if (!res.ok) return false;
  const blob = await res.blob();
  const file = new File([blob], filename, {type: mimeType});
  const nav = navigator as Navigator & {canShare?: (data: ShareData) => boolean};
  if (nav.canShare && !nav.canShare({files: [file]})) {
    return false;
  }
  await navigator.share({
    title,
    text: 'SK NUR — Complete Islamic Companion',
    files: [file],
  });
  return true;
}
