export default function TopCategoriesChart({ categories = [], topPercent = 0, loading = false }) {
  return (
    <div className="flex-1 bg-white border-2 border-[#D5D9DE] rounded-panel p-6 flex flex-col gap-6">
      <h3 className="text-xl font-medium text-admin-text-primary tracking-[-0.2px]">Top Categories</h3>
      <div className="flex items-center gap-8">
        <div
          className="w-[124px] h-[124px] rounded-full flex items-center justify-center flex-shrink-0"
          style={{ border: '16px solid #1550D3' }}
        >
          <span className="text-xs font-bold text-admin-text-primary">{loading ? '—' : `${topPercent}%`}</span>
        </div>
        <div className="flex flex-col gap-2">
          {loading ? (
            <span className="text-xs text-admin-text-secondary">Loading…</span>
          ) : categories.length === 0 ? (
            <span className="text-xs text-admin-text-secondary">No data</span>
          ) : (
            categories.map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full flex-shrink-0 ${color}`} />
                <span className="text-xs font-medium text-admin-text-primary" style={{ letterSpacing: '0.24px' }}>{label}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
