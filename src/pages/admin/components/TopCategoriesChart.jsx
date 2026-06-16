import { useMemo } from 'react';
import adminI18n from '../../../i18n/admin/adminI18n';

const HEX_COLORS = {
  'bg-admin-brand': '#40B9FF',
  'bg-admin-success': '#006C49',
  'bg-admin-category': '#E2E1ED',
  'bg-admin-amber': '#825100',
  'bg-admin-danger': '#BA1A1A',
  'bg-admin-border': '#C3C5D7',
};

export default function TopCategoriesChart({
  categories = [],
  loading = false,
}) {
  const { t } = adminI18n;

  const total = useMemo(
    () => categories.reduce((sum, c) => sum + (c.count || 0), 0),
    [categories]
  );

  const conicGradient = useMemo(() => {
    if (total === 0) return 'conic-gradient(#C3C5D7 0% 100%)';
    const segments = [];
    let acc = 0;
    categories.forEach((cat) => {
      const pct = (cat.count / total) * 100;
      const hex = HEX_COLORS[cat.color] || '#C3C5D7';
      segments.push(`${hex} ${acc}% ${acc + pct}%`);
      acc += pct;
    });
    return `conic-gradient(${segments.join(', ')})`;
  }, [categories, total]);

  return (
    <div className="flex-1 bg-surface-elevated border-2 border-admin-border rounded-panel p-6 flex flex-col gap-6">
      <h3 className="text-xl font-medium text-admin-text-primary tracking-[-0.2px]">
        {t('admin.dashboard.topCategories')}
      </h3>
      <div className="flex items-center gap-8">
        {/* Doughnut */}
        <div className="relative w-[124px] h-[124px] flex-shrink-0">
          <div
            className="w-full h-full rounded-full"
            style={{ background: loading ? '#C3C5D7' : conicGradient }}
          />
          <div className="absolute inset-0 m-auto w-[72px] h-[72px] rounded-full bg-surface-elevated" />
        </div>
        {/* Legend */}
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
            categories.map(({ color, label, count }) => {
              const hex = HEX_COLORS[color] || '#C3C5D7';
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={label} className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: hex }}
                  />
                  <span
                    className="text-xs font-medium text-admin-text-primary"
                    style={{ letterSpacing: '0.24px' }}
                  >
                    {label}
                  </span>
                  <span className="text-[10px] text-admin-text-muted ml-auto">
                    {pct}%
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
