import { useState, useEffect, useRef } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const verify = async () => {
      // إذا كان المتصفح أصلاً يقول أوفلاين
      if (!navigator.onLine) {
        if (mountedRef.current) setIsOnline(false);
        return;
      }
      
      // التأكد من الإنترنت فعلياً (مهم جداً للكمبيوتر)
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);
        await fetch('/favicon.png?t=' + Date.now(), { // إضافة timestamp لمنع الكاش
          method: 'HEAD',
          signal: controller.signal,
        });
        clearTimeout(timeout);
        if (mountedRef.current) setIsOnline(true);
      } catch {
        if (mountedRef.current) setIsOnline(false);
      }
    };

    window.addEventListener('online', verify);
    window.addEventListener('offline', () => setIsOnline(false));

    verify(); // فحص عند التحميل

    // فحص دوري كل 5 ثواني للكمبيوتر لضمان الدقة
    const interval = setInterval(verify, 5000);

    return () => {
      mountedRef.current = false;
      window.removeEventListener('online', verify);
      window.removeEventListener('offline', () => setIsOnline(false));
      clearInterval(interval);
    };
  }, []);

  return isOnline;
}