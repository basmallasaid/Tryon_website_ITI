import adminI18n from '../../../i18n/admin/adminI18n';

export default function TopCategoriesChart({
  categories = [],
  topPercent = 0,
  loading = false,
}) {
  const { t } = adminI18n;
  return (
    <div className="flex-1 bg-surface-elevated border-2 border-admin-border rounded-panel p-6 flex flex-col gap-6">
      <h3 className="text-xl font-medium text-admin-text-primary tracking-[-0.2px]">
        {t('admin.dashboard.topCategories')}
      </h3>
      <div className="flex items-center gap-8">
        <div
          className="w-[124px] h-[124px] rounded-full flex items-center justify-center flex-shrink-0"
          style={{ border: '16px solid var(--admin-brand)' }}
        >
          <span className="text-xs font-bold text-admin-text-primary">
            {loading ? '—' : `${topPercent}%`}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {loading ? (
            <span className="text-xs text-admin-text-secondary">
              {t('admin.dashboard.loading')}
            </span>
          ) : categories.length === 0 ? (
            <span className="text-xs text-admin-text-secondary">
              {t('admin.dashboard.noData')}
            </span>
          ) : (
            categories.map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${color}`}
                />
                <span
                  className="text-xs font-medium text-admin-text-primary"
                  style={{ letterSpacing: '0.24px' }}
                >
                  {label}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
