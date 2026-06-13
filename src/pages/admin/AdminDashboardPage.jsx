import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, SlidersHorizontal, UserPlus, ChevronDown, X, RotateCcw } from 'lucide-react';
import AdminLayout from './AdminLayout';
import DashboardSection from './sections/DashboardSection';
import StoresSection from './sections/StoresSection';
import AddStoreSection from './sections/AddStoreSection';
import ProductsSection from './sections/ProductsSection';
import AddProductSection from './sections/AddProductSection';
import NotificationsSection from './sections/NotificationsSection';
import AddNotificationSection from './sections/AddNotificationSection';
import EmailCenterSection from './sections/EmailCenterSection';
import UsersSection from './sections/UsersSection';
import AddUserSection from './sections/AddUserSection';
import ApiManagementSection from './sections/ApiManagementSection';
import SettingsSection from './sections/SettingsSection';
import { getContactMessagesApi, getEmailUnreadCountApi } from '../../api/adminApi';

const ROLE_OPTIONS = ['All', 'Admin', 'Premium', 'User'];

export default function AdminDashboardPage() {
  const [activePage, setActivePage] = useState('dashboard');
  const [showAddStore, setShowAddStore] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddNotification, setShowAddNotification] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingStore, setEditingStore] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [unreadContacts, setUnreadContacts] = useState(0);
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [deletionNotificationUser, setDeletionNotificationUser] = useState(null);
  const filterDropdownRef = useRef(null);

  const fetchCounts = useCallback(async () => {
    try {
      const [contactRes, emailRes] = await Promise.all([
        getContactMessagesApi(),
        getEmailUnreadCountApi(),
      ]);
      const contacts = Array.isArray(contactRes.data) ? contactRes.data : [];
      const contactCount = contacts.filter((c) => !c.read).length;
      const emailCount = emailRes.data?.unreadCount || 0;
      setUnreadContacts(contactCount + emailCount);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target)) {
        setShowFilterDropdown(false);
      }
    };
    if (showFilterDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilterDropdown]);

  const handleAddStore = () => {
    setActivePage('stores');
    setEditingStore(null);
    setShowAddStore(true);
  };
  const handleBackFromAddStore = () => {
    setShowAddStore(false);
    setEditingStore(null);
  };
  const handleEditStore = (store) => {
    setEditingStore(store);
    setShowAddStore(true);
  };

  const handleAddProduct = () => {
    setActivePage('products');
    setShowAddProduct(true);
  };
  const handleBackFromAddProduct = () => setShowAddProduct(false);

  const handleAddNotification = () => {
    setActivePage('notifications');
    setShowAddNotification(true);
  };
  const handleBackFromAddNotification = () => {
    setShowAddNotification(false);
    setDeletionNotificationUser(null);
  };
  const handleAddUser = () => {
    setActivePage('users');
    setEditingUser(null);
    setShowAddUser(true);
  };
  const handleBackFromAddUser = () => {
    setShowAddUser(false);
    setEditingUser(null);
  };
  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowAddUser(true);
  };
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddProduct(true);
  };
  const handleBackFromEditProduct = () => {
    setEditingProduct(null);
    setShowAddProduct(false);
  };

  const navigate = page => {
    setActivePage(page);
    setShowAddStore(false);
    setShowAddProduct(false);
    setShowAddNotification(false);
    setShowAddUser(false);
    setEditingProduct(null);
    setEditingStore(null);
    setEditingUser(null);
    setDeletionNotificationUser(null);
  };

  const handleSendDeletionNotification = (user) => {
    setDeletionNotificationUser(user);
    setActivePage('notifications');
    setShowAddNotification(true);
  };

  const sectionMap = {
    dashboard: <DashboardSection />,
    stores: <StoresSection onAddStore={handleAddStore} onEditStore={handleEditStore} />,
    products: <ProductsSection onAddProduct={handleAddProduct} onEditProduct={handleEditProduct} />,
    notifications: (
      <NotificationsSection onAddNotification={handleAddNotification} />
    ),
    emailCenter: <EmailCenterSection onReadChange={fetchCounts} />,
    users: <UsersSection onAddUser={handleAddUser} roleFilter={userRoleFilter} onResetFilter={() => setUserRoleFilter('All')} onSendDeletionNotification={handleSendDeletionNotification} onEditUser={handleEditUser} />,
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
    ) : activePage === 'users' && !showAddUser ? (
      <div className="flex items-center gap-2">
        <div className="relative" ref={filterDropdownRef}>
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-medium transition-colors ${
              userRoleFilter !== 'All'
                ? 'bg-admin-brand-bg border-admin-brand text-admin-brand'
                : 'bg-admin-brand-bg border-admin-border text-admin-text-secondary hover:bg-admin-brand-activeBg'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter
            {userRoleFilter !== 'All' && (
              <span className="ml-1 px-1.5 py-0.5 bg-admin-brand text-white rounded-full text-[10px]">
                {userRoleFilter}
              </span>
            )}
            <ChevronDown className={`w-3 h-3 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showFilterDropdown && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-admin-border/40 rounded-xl shadow-lg z-50 py-1">
              <div className="px-3 py-2 border-b border-admin-border/30">
                <span className="text-[10px] font-bold text-admin-text-muted uppercase tracking-wider">Role</span>
              </div>
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setUserRoleFilter(role);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-admin-brand-activeBg/50 transition-colors ${
                    userRoleFilter === role ? 'text-admin-brand font-medium' : 'text-admin-text-secondary'
                  }`}
                >
                  <span>{role}</span>
                  {userRoleFilter === role && (
                    <div className="w-1.5 h-1.5 rounded-full bg-admin-brand" />
                  )}
                </button>
              ))}
              {userRoleFilter !== 'All' && (
                <>
                  <div className="border-t border-admin-border/30 my-1" />
                  <button
                    onClick={() => {
                      setUserRoleFilter('All');
                      setShowFilterDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-admin-danger hover:bg-admin-danger/10 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Clear filter
                  </button>
                </>
              )}
            </div>
          )}
        </div>
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
    currentSection = <AddStoreSection onBack={handleBackFromAddStore} editingStore={editingStore} />;
  } else if (showAddProduct) {
    currentSection = <AddProductSection onBack={handleBackFromAddProduct} editingProduct={editingProduct} />;
  } else if (showAddNotification) {
    currentSection = (
      <AddNotificationSection
        onBack={handleBackFromAddNotification}
        prefillEmail={deletionNotificationUser?.email || ''}
        prefillTitle="Account Deletion Warning"
        prefillMessage={`Dear ${deletionNotificationUser?.name || 'User'},\n\nWe noticed that your account has been inactive. If you do not contact our support team within 30 days, your account and all associated data will be permanently deleted.\n\nIf you believe this is an error or wish to keep your account, please reach out to us as soon as possible.\n\nThank you,\nThe DOLAPY Team`}
        prefillChannels={['app', 'email', 'website']}
      />
    );
  } else if (showAddUser) {
    currentSection = <AddUserSection onBack={handleBackFromAddUser} editingUser={editingUser} />;
  } else {
    currentSection = sectionMap[activePage];
  }

  return (
    <AdminLayout
      activePage={activePage}
      setActivePage={navigate}
      topBarActions={topBarActions}
      unreadContacts={unreadContacts}
    >
      {currentSection}
    </AdminLayout>
  );
}
