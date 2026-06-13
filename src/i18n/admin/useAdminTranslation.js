import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import adminI18n from './adminI18n';

export function useAdminTranslation(ns = 'translation') {
  const { t, i18n } = useTranslation(ns, { i18n: adminI18n });
  const [lng, setLng] = useState(adminI18n.language);

  useEffect(() => {
    const handler = (l) => setLng(l);
    adminI18n.on('languageChanged', handler);
    return () => adminI18n.off('languageChanged', handler);
  }, []);

  return { t, i18n: adminI18n };
}

export default useAdminTranslation;
