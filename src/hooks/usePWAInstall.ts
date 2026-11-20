import {useEffect, useState} from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{outcome: 'accepted' | 'dismissed'; platform: string}>;
}

// Module-level singleton store so late-mounting modals/views never miss beforeinstallprompt
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;
let globalIsInstalled = false;
let listenersInitialized = false;
const subscribers = new Set<() => void>();

function notifySubscribers() {
  subscribers.forEach((cb) => cb());
}

function initGlobalPWAListeners() {
  if (listenersInitialized || typeof window === 'undefined') return;
  listenersInitialized = true;

  globalIsInstalled =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as {standalone?: boolean}).standalone === true;

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    globalDeferredPrompt = e as BeforeInstallPromptEvent;
    notifySubscribers();
  });

  window.addEventListener('appinstalled', () => {
    globalIsInstalled = true;
    globalDeferredPrompt = null;
    notifySubscribers();
  });

  const mediaQuery = window.matchMedia('(display-mode: standalone)');
  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', (ev) => {
      if (ev.matches) {
        globalIsInstalled = true;
        globalDeferredPrompt = null;
        notifySubscribers();
      }
    });
  }
}

initGlobalPWAListeners();

export function usePWAInstall() {
  const [, setTick] = useState(0);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    initGlobalPWAListeners();
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleUpdate = () => setTick((t) => t + 1);
    subscribers.add(handleUpdate);
    return () => {
      subscribers.delete(handleUpdate);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!globalDeferredPrompt) return false;
    try {
      await globalDeferredPrompt.prompt();
      const {outcome} = await globalDeferredPrompt.userChoice;
      if (outcome === 'accepted') {
        globalIsInstalled = true;
        globalDeferredPrompt = null;
        notifySubscribers();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return {
    isInstallable: !!globalDeferredPrompt,
    isInstalled: globalIsInstalled,
    isIOS,
    install,
  };
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
