import { useState } from 'react';
import AdminLayout from './AdminLayout';
import DashboardSection from './sections/DashboardSection';
import StoresSection from './sections/StoresSection';
import ProductsSection from './sections/ProductsSection';
import PromotionsSection from './sections/PromotionsSection';
import NotificationsSection from './sections/NotificationsSection';
import EmailCenterSection from './sections/EmailCenterSection';
import UsersSection from './sections/UsersSection';
import ApiManagementSection from './sections/ApiManagementSection';
import SettingsSection from './sections/SettingsSection';

const sectionMap = {
  dashboard: <DashboardSection />,
  stores: <StoresSection />,
  products: <ProductsSection />,
  promotions: <PromotionsSection />,
  notifications: <NotificationsSection />,
  emailCenter: <EmailCenterSection />,
  users: <UsersSection />,
  apiManagement: <ApiManagementSection />,
  settings: <SettingsSection />,
};

export default function AdminDashboardPage() {
  const [activePage, setActivePage] = useState('dashboard');
  return (
    <AdminLayout activePage={activePage} setActivePage={setActivePage}>
      {sectionMap[activePage]}
    </AdminLayout>
  );
}
