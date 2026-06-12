export default function MetricCard({ icon: Icon, iconColor, overlayBg, badge, badgeColor, label, value, mobile }) {
  if (mobile) {
    return (
      <div className="min-w-[260px] w-[260px] h-[160px] bg-admin-brand-bg border border-admin-border rounded-card p-6 flex flex-col gap-1 shadow-sm flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className={`p-2 rounded-lg ${overlayBg}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <span className={`text-base font-normal ${badgeColor}`}>{badge}</span>
        </div>
        <p className="text-base font-normal text-admin-text-secondary pt-3" style={{ letterSpacing: '0.24px' }}>{label}</p>
        <p className="text-2xl font-semibold text-admin-text-primary tracking-[-0.24px]">{value}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-[206px] h-[160px] bg-admin-brand-bg border border-admin-border rounded-card p-6 flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <div className={`p-2 rounded-lg ${overlayBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <span className={`text-xs font-medium ${badgeColor}`} style={{ letterSpacing: '0.24px' }}>{badge}</span>
      </div>
      <p className="text-xs font-medium text-admin-text-secondary pt-3" style={{ letterSpacing: '0.24px' }}>{label}</p>
      <p className="text-[32px] font-semibold text-admin-text-primary leading-10 tracking-[-0.64px]">{value}</p>
    </div>
  );
}
