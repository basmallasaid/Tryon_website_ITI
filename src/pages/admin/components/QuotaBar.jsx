export default function QuotaBar({ icon: Icon, iconColor, used, total, barColor }) {
  const pct = total > 0 ? Math.round((used / total) * 100) : 0;
  const isFull = pct >= 100;

  return (
    <div className="flex items-center gap-2">
      <Icon className={`w-3 h-3 shrink-0 ${iconColor}`} />
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary font-normal">{used}/{total}</span>
          <span className={`text-xs ${isFull ? 'font-semibold text-admin-danger' : 'text-text-disabled'}`}>{pct}%</span>
        </div>
        <div className="w-full h-1.5 bg-admin-brand-bg rounded-full mt-0.5">
          <div
            className={`h-full rounded-full transition-all ${isFull ? 'bg-admin-danger' : barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
