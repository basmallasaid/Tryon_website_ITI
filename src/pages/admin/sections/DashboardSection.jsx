import { Store, Package, Shirt, RefreshCw, TrendingUp, CalendarDays } from 'lucide-react';
import MetricCard from '../MetricCard';
import ActiveProductsBar from '../ActiveProductsBar';
import TotalUsersCard from '../TotalUsersCard';
import QuickActionsPanel from '../QuickActionsPanel';
import TopCategoriesChart from '../TopCategoriesChart';

const metrics = [
  { label: 'Total Stores', value: '128', icon: Store, iconColor: 'text-admin-brand', overlayBg: 'bg-admin-brand/10', badge: '+4.5%', badgeColor: 'text-admin-success' },
  { label: 'Total Products', value: '42,904', icon: Package, iconColor: 'text-admin-success', overlayBg: 'bg-admin-success/10', badge: '+12.2%', badgeColor: 'text-admin-success' },
  { label: 'Try-On times', value: '85', icon: Shirt, iconColor: 'text-admin-amber', overlayBg: 'bg-admin-amber/10', badge: 'Enabled', badgeColor: 'text-admin-text-secondary' },
  { label: 'Recycle times', value: '85', icon: RefreshCw, iconColor: 'text-admin-amber', overlayBg: 'bg-admin-amber/10', badge: 'Enabled', badgeColor: 'text-admin-text-secondary' },
  { label: 'Monthly Revenue', value: '$0', icon: TrendingUp, iconColor: 'text-admin-danger', overlayBg: 'bg-admin-danger/10', badge: 'Peak', badgeColor: 'text-admin-success' },
];

export default function DashboardSection() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[32px] font-semibold text-admin-text-primary leading-10 tracking-[-0.64px]">
              Dashboard Overview
            </h1>
            <p className="text-sm text-admin-text-secondary mt-1">
              Welcome back. Here is a summary of your global fashion ecosystem.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-admin-brand-bg border border-admin-border rounded-lg shadow-sm text-xs font-medium text-admin-text-primary" style={{ letterSpacing: '0.24px' }}>
            <CalendarDays className="w-[10.5px] h-[11.67px]" />
            Last 30 Days
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
        </div>

        <div className="flex gap-[26px] mb-8">
          <ActiveProductsBar />
          <TotalUsersCard />
        </div>

        <div className="flex gap-8 mb-8">
          <QuickActionsPanel />
          <TopCategoriesChart />
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden px-4 py-6 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary tracking-[-0.64px]">
            Dashboard Overview
          </h1>
          <p className="text-base text-admin-text-secondary mt-2 leading-6">
            Welcome back. Here is a summary of your global fashion ecosystem.
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
