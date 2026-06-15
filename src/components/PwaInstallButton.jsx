import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const PwaInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      setDeferredPrompt(e);
      setShow(true);
    };

    const installedHandler = () => {
      setIsInstalled(true);
      setShow(false);
    };

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-secondary text-white text-sm font-bold hover:opacity-90 transition-all active:scale-95 cursor-pointer"
      title="Install App"
    >
      <Download size={18} />
      <span className="hidden sm:inline">Install App</span>
    </button>
  );
};

export default PwaInstallButton;
