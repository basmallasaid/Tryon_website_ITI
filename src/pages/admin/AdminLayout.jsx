import { useEffect } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminTopBar from './components/AdminTopBar';
import AdminMobileHeader from './components/AdminMobileHeader';
import AdminBottomNav from './components/AdminBottomNav';
import { useAdminTranslation } from '../../i18n/admin/useAdminTranslation';
import { AdminDarkModeProvider, useAdminDarkMode } from './context/AdminDarkModeContext';

function AdminLayoutInner({ activePage, setActivePage, topBarActions, unreadContacts, children }) {
  const { i18n } = useAdminTranslation();
  const { isDarkMode } = useAdminDarkMode();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isRTL, i18n.language]);

  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = isDarkMode ? '#111111' : '#f4f3f5';
    return () => { document.body.style.backgroundColor = prev; };
  }, [isDarkMode]);

  return (
      <div className={`font-geist min-h-screen admin-theme ${isDarkMode ? 'admin-dark' : ''}`} style={{ backgroundColor: 'var(--color-admin-page)' }}>
        <AdminSidebar className="hidden lg:flex" activePage={activePage} setActivePage={setActivePage} unreadContacts={unreadContacts} />

        <AdminMobileHeader className="lg:hidden" unreadContacts={unreadContacts} />

      <main className={isRTL ? 'lg:mr-[280px]' : 'lg:ml-[280px]'}>
        <AdminTopBar className="hidden lg:flex sticky top-0 z-10 bg-surface-elevated h-[60px]" actions={topBarActions} unreadContacts={unreadContacts} />

          <div className="pb-[72px] lg:pb-0 lg:p-8">
            {children}
          </div>
        </main>

        <AdminBottomNav className="lg:hidden fixed bottom-0 left-0 right-0 z-10" activePage={activePage} setActivePage={setActivePage} />
      </div>
  );
}

export default function AdminLayout(props) {
  return (
    <AdminDarkModeProvider>
      <AdminLayoutInner {...props} />
    </AdminDarkModeProvider>
  );
}
