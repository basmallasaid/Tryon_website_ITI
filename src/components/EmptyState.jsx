import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import lottie from 'lottie-web';

const EmptyState = ({
  message,
  description,
  buttonText,
  onButtonClick,
  className = '',
}) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const anim = lottie.loadAnimation({
      container: containerRef.current,
      path: '/not-found.json',
      loop: true,
      autoplay: true,
    });
    return () => anim.destroy();
  }, []);

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
    >
      <div ref={containerRef} className="w-64 h-64 md:w-80 md:h-80 mb-8" />
      {message && (
        <h2 className="text-2xl md:text-3xl font-black text-text-primary mb-3 tracking-tight">
          {message}
        </h2>
      )}
      {description && (
        <p className="text-text-disabled font-medium text-base mb-8 max-w-sm">
          {description}
        </p>
      )}
      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="bg-[var(--primary)] text-white px-10 py-3.5 rounded-[1.5rem] font-black shadow-xl hover:scale-105 hover:brightness-90 transition-all active:scale-95 tracking-wider text-sm cursor-pointer"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
