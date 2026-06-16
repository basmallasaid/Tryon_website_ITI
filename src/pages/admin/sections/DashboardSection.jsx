import { useState, useEffect } from 'react';
import { Store, Package, Shirt, RefreshCw, TrendingUp, CalendarDays } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import ActiveProductsBar from '../components/ActiveProductsBar';
import TotalUsersCard from '../components/TotalUsersCard';
import QuickActionsPanel from '../components/QuickActionsPanel';
import TopCategoriesChart from '../components/TopCategoriesChart';
import { getStoresApi, getProductsApi, getNotificationsApi } from '../../../api/adminApi';
import adminI18n from '../../../i18n/admin/adminI18n';

export default function DashboardSection({ onNavigate }) {
  const { t } = adminI18n;
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [storesRes, productsRes, notifRes] = await Promise.all([
          getStoresApi(),
          getProductsApi(),
          getNotificationsApi(),
        ]);
        setStores(storesRes.data);
        setProducts(productsRes.data);
        setUnreadCount(notifRes.data.unreadCount || 0);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const totalStores = stores.length;
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.is_active).length;
  const tryOnEnabled = products.filter((p) => p.try_on_enabled).length;
  const activePercent = totalProducts > 0 ? Math.round((activeProducts / totalProducts) * 100) : 0;

  const categoryCount = {};
  products.forEach((p) => {
    const cat = p.category || 'other';
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  const sortedCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1]);
  const topCategoryPercent = sortedCategories.length > 0
    ? Math.round((sortedCategories[0][1] / totalProducts) * 100)
    : 0;

  const categoryLabels = { top: t('admin.products.tops'), bottom: t('admin.products.bottoms'), dress: t('admin.products.dresses'), acc: t('admin.products.accessories') };
  const categoryColors = ['bg-admin-brand', 'bg-admin-success', 'bg-admin-category'];

  const metrics = [
    { label: t('admin.dashboard.totalStores'), value: loading ? '—' : totalStores.toLocaleString(), icon: Store, iconColor: 'text-admin-brand', overlayBg: 'bg-admin-brand/10', badge: `${totalStores}`, badgeColor: 'text-admin-success' },
    { label: t('admin.dashboard.totalProducts'), value: loading ? '—' : totalProducts.toLocaleString(), icon: Package, iconColor: 'text-admin-success', overlayBg: 'bg-admin-success/10', badge: `${activeProducts} ${t('admin.dashboard.active')}`, badgeColor: 'text-admin-success' },
    { label: t('admin.dashboard.tryOnEnabled'), value: loading ? '—' : tryOnEnabled.toLocaleString(), icon: Shirt, iconColor: 'text-admin-amber', overlayBg: 'bg-admin-amber/10', badge: t('admin.dashboard.enabled'), badgeColor: 'text-admin-text-secondary' },
    { label: t('admin.dashboard.unreadNotifications'), value: loading ? '—' : unreadCount.toLocaleString(), icon: RefreshCw, iconColor: 'text-admin-amber', overlayBg: 'bg-admin-amber/10', badge: unreadCount > 0 ? t('admin.dashboard.new') : t('admin.dashboard.allRead'), badgeColor: unreadCount > 0 ? 'text-admin-brand' : 'text-admin-text-secondary' },
    { label: t('admin.dashboard.activeRate'), value: loading ? '—' : `${activePercent}%`, icon: TrendingUp, iconColor: 'text-admin-danger', overlayBg: 'bg-admin-danger/10', badge: t('admin.dashboard.ofTotal'), badgeColor: 'text-admin-success' },
  ];

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[32px] font-semibold text-admin-text-primary leading-10 tracking-[-0.64px]">
              {t('admin.dashboard.dashboardOverview')}
            </h1>
            <p className="text-sm text-admin-text-secondary mt-1">
              {t('admin.dashboard.dashboardDesc')}
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-admin-brand-bg border border-admin-border rounded-lg shadow-sm text-xs font-medium text-admin-text-primary" style={{ letterSpacing: '0.24px' }}>
            <CalendarDays className="w-[10.5px] h-[11.67px]" />
            {t('admin.dashboard.last30Days')}
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
        </div>

        <div className="flex gap-[26px] mb-8">
          <ActiveProductsBar activeProducts={activeProducts} totalProducts={totalProducts} activePercent={activePercent} loading={loading} />
          <TotalUsersCard totalStores={totalStores} loading={loading} />
        </div>

        <div className="flex gap-8 mb-8">
          <QuickActionsPanel onNavigate={onNavigate} />
          <TopCategoriesChart
            categories={sortedCategories.map(([cat, count], i) => ({
              color: categoryColors[i] || 'bg-admin-border',
              label: categoryLabels[cat] || cat,
              count,
            }))}
            loading={loading}
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden px-4 py-6 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary tracking-[-0.64px]">
            {t('admin.dashboard.dashboardOverview')}
          </h1>
          <p className="text-base text-admin-text-secondary mt-2 leading-6">
            {t('admin.dashboard.dashboardDesc')}
          </p>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide [&::-webkit-scrollbar]:hidden">
          {metrics.map((m) => <MetricCard key={m.label} {...m} mobile />)}
        </div>

        <QuickActionsPanel />
      </div>
    </>
  );
}
