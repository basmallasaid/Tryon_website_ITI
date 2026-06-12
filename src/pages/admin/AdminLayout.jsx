import { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminTopBar from './components/AdminTopBar';
import AdminMobileHeader from './components/AdminMobileHeader';
import AdminBottomNav from './components/AdminBottomNav';

export default function AdminLayout({ activePage, setActivePage, children }) {
  return (
    <div className="font-geist bg-admin-page min-h-screen">
      <AdminSidebar className="hidden lg:flex" activePage={activePage} setActivePage={setActivePage} />

      <AdminMobileHeader className="lg:hidden" />

      <main className="lg:ml-[280px]">
        <AdminTopBar className="hidden lg:flex sticky top-0 z-10 bg-white h-[110px]" />

        <div className="pb-[72px] lg:pb-0 lg:p-8 mt-[186px] lg:mt-0">
          {children}
        </div>
      </main>

      <AdminBottomNav className="lg:hidden fixed bottom-0 left-0 right-0 z-10" activePage={activePage} setActivePage={setActivePage} />
    </div>
  );
}
