import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import lottie from 'lottie-web';

const MESSAGE_KEYS = [
  'loading.msg1',
  'loading.msg2',
  'loading.msg3',
  'loading.msg4',
  'loading.msg5',
  'loading.msg6',
  'loading.msg7',
  'loading.msg8',
  'loading.msg9',
  'loading.msg10',
];

const LoadingScreen = ({ visible }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const containerRef = useRef(null);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;
    setMessageIndex(0);
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGE_KEYS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [visible]);

  useEffect(() => {
    if (!visible || !containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      path: '/sales_man_v2.json',
      loop: true,
      autoplay: true,
    });
    return () => anim.destroy();
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)] animate-fadeInScale"
    >
      <div ref={containerRef} className="w-72 h-72 md:w-96 md:h-96 mb-10" />
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[var(--primary)] animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="h-2 w-2 rounded-full bg-[var(--secondary)] animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <p className="text-text-secondary font-bold text-lg md:text-xl mt-6 text-center px-4 max-w-md transition-all duration-500">
        {t(MESSAGE_KEYS[messageIndex])}
      </p>
    </div>
  );
};

export default LoadingScreen;
