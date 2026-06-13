import adminI18n from '../../../i18n/admin/adminI18n';

export default function ActiveProductsBar({ activeProducts = 0, totalProducts = 0, activePercent = 0, loading = false }) {
  const { t } = adminI18n;
  return (
    <div className="flex-1 h-[78px] bg-admin-brand-bg border border-admin-border rounded-card px-6 py-4 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-admin-text-secondary" style={{ letterSpacing: '0.24px' }}>
          {t('admin.dashboard.activeProducts')}
        </span>
        <div className="w-[146px] h-1 bg-admin-brand/20 rounded-full overflow-hidden">
          <div className="h-full bg-admin-brand rounded-full transition-all duration-500" style={{ width: loading ? '0%' : `${activePercent}%` }} />
        </div>
      </div>
      <p className="text-xl font-medium text-admin-text-primary tracking-[-0.2px]">{loading ? '—' : activeProducts.toLocaleString()}</p>
    </div>
  );
}
