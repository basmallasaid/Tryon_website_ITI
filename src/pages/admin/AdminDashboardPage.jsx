import { useState } from 'react';
import { Plus, SlidersHorizontal, UserPlus } from 'lucide-react';
import AdminLayout from './AdminLayout';
import DashboardSection from './sections/DashboardSection';
import StoresSection from './sections/StoresSection';
import AddStoreSection from './sections/AddStoreSection';
import ProductsSection from './sections/ProductsSection';
import AddProductSection from './sections/AddProductSection';
import PromotionsSection from './sections/PromotionsSection';
import NotificationsSection from './sections/NotificationsSection';
import AddNotificationSection from './sections/AddNotificationSection';
import EmailCenterSection from './sections/EmailCenterSection';
import UsersSection from './sections/UsersSection';
import AddUserSection from './sections/AddUserSection';
import ApiManagementSection from './sections/ApiManagementSection';
import SettingsSection from './sections/SettingsSection';

export default function AdminDashboardPage() {
  const [activePage, setActivePage] = useState('dashboard');
  const [showAddStore, setShowAddStore] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddNotification, setShowAddNotification] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  const handleAddStore = () => {
    setActivePage('stores');
    setShowAddStore(true);
  };
  const handleBackFromAddStore = () => setShowAddStore(false);

  const handleAddProduct = () => {
    setActivePage('products');
    setShowAddProduct(true);
  };
  const handleBackFromAddProduct = () => setShowAddProduct(false);

  const handleAddNotification = () => {
    setActivePage('notifications');
    setShowAddNotification(true);
  };
  const handleBackFromAddNotification = () => setShowAddNotification(false);
  const handleAddUser = () => {
    setActivePage('users');
    setShowAddUser(true);
  };
  const handleBackFromAddUser = () => setShowAddUser(false);

  const navigate = page => {
    setActivePage(page);
    setShowAddStore(false);
    setShowAddProduct(false);
    setShowAddNotification(false);
    setShowAddUser(false);
  };

  const sectionMap = {
    dashboard: <DashboardSection />,
    stores: <StoresSection onAddStore={handleAddStore} />,
    products: <ProductsSection onAddProduct={handleAddProduct} />,
    promotions: <PromotionsSection />,
    notifications: (
      <NotificationsSection onAddNotification={handleAddNotification} />
    ),
    emailCenter: <EmailCenterSection />,
    users: <UsersSection onAddUser={handleAddUser} />,
    apiManagement: <ApiManagementSection />,
    settings: <SettingsSection />,
  };

  const topBarActions =
    activePage === 'stores' && !showAddStore ? (
      <button
        onClick={handleAddStore}
        className="flex items-center gap-2 px-4 py-2 bg-admin-brand text-white rounded-xl text-xs font-medium hover:bg-admin-brand-light transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Store
      </button>
    ) : activePage === 'products' && !showAddProduct ? (
      <button
        onClick={handleAddProduct}
        className="flex items-center gap-2 px-4 py-2 bg-admin-brand text-white rounded-xl text-xs font-medium hover:bg-admin-brand-light transition-colors"
      >
        <Plus className="w-4 h-4" /> Add product
      </button>
    ) : activePage === 'notifications' && !showAddNotification ? (
      <button
        onClick={handleAddNotification}
        className="flex items-center gap-2 px-4 py-2 bg-admin-brand text-white rounded-xl text-xs font-medium hover:bg-admin-brand-light transition-colors"
      >
        <Plus className="w-4 h-4" /> Add notifications
      </button>
    ) : activePage === 'apiManagement' ? (
      <button className="flex items-center gap-2 px-4 py-2 bg-admin-brand text-white rounded-xl text-xs font-medium hover:bg-admin-brand-light transition-colors">
        <Plus className="w-4 h-4" /> Add API Key
      </button>
    ) : activePage === 'users' && !showAddUser ? (
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-4 py-2 bg-admin-brand-bg border border-admin-border rounded-lg text-xs font-medium text-admin-text-secondary hover:bg-admin-brand-activeBg transition-colors">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filter
        </button>
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 px-4 py-2 bg-admin-brand text-white rounded-lg text-xs font-medium hover:bg-admin-brand-light transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Add User
        </button>
      </div>
    ) : null;

  let currentSection;
  if (showAddStore) {
    currentSection = <AddStoreSection onBack={handleBackFromAddStore} />;
  } else if (showAddProduct) {
    currentSection = <AddProductSection onBack={handleBackFromAddProduct} />;
  } else if (showAddNotification) {
    currentSection = (
      <AddNotificationSection onBack={handleBackFromAddNotification} />
    );
  } else if (showAddUser) {
    currentSection = <AddUserSection onBack={handleBackFromAddUser} />;
  } else {
    currentSection = sectionMap[activePage];
  }

  return (
    <AdminLayout
      activePage={activePage}
      setActivePage={navigate}
      topBarActions={topBarActions}
    >
      {currentSection}
    </AdminLayout>
  );
}
