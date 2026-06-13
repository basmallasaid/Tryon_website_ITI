import { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminTopBar from './components/AdminTopBar';
import AdminMobileHeader from './components/AdminMobileHeader';
import AdminBottomNav from './components/AdminBottomNav';
import { useAdminTranslation } from '../../i18n/admin/useAdminTranslation';

export default function AdminLayout({ activePage, setActivePage, topBarActions, unreadContacts, children }) {
  const { i18n } = useAdminTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="font-geist bg-admin-page min-h-screen">
      <AdminSidebar className="hidden lg:flex" activePage={activePage} setActivePage={setActivePage} unreadContacts={unreadContacts} />

      <AdminMobileHeader className="lg:hidden" unreadContacts={unreadContacts} />

      <main className={isRTL ? 'lg:mr-[280px]' : 'lg:ml-[280px]'}>
        <AdminTopBar className="hidden lg:flex sticky top-0 z-10 bg-white h-[60px]" actions={topBarActions} unreadContacts={unreadContacts} />

        <div className="pb-[72px] lg:pb-0 lg:p-8">
          {children}
        </div>
      </main>

      <AdminBottomNav className="lg:hidden fixed bottom-0 left-0 right-0 z-10" activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}
