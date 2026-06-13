import { useTranslation } from 'react-i18next';
import adminI18n from './adminI18n';

export function useAdminTranslation(ns = 'translation') {
  const { t, i18n } = useTranslation(ns, { i18n: adminI18n });
  return { t, i18n };
}

export default useAdminTranslation;
