import { ExternalLink } from 'lucide-react';

export default function StoreCard({ store }) {
  return (
    <div className="bg-white rounded-xl border border-admin-border/40 p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        {store.logo ? (
          <img
            src={store.logo}
            alt={store.name}
            className="w-10 h-10 rounded-full object-cover border border-admin-border/50"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-admin-brand/10 flex items-center justify-center text-sm font-bold text-admin-brand border border-admin-border/50">
            {store.name?.charAt(0) || '?'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-admin-text-primary truncate">{store.name}</p>
          <a
            href={store.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-admin-brand hover:underline"
          >
            {store.websiteLabel}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <span
          className={`shrink-0 px-2.5 py-1 text-[11px] font-semibold rounded-full ${
            store.status === 'Active'
              ? 'bg-admin-success/10 text-admin-success'
              : 'bg-admin-danger/10 text-admin-danger'
          }`}
        >
          {store.status}
        </span>
      </div>

      <div className="border-t border-admin-border/30 pt-3 flex items-center justify-between text-[11px] text-admin-text-secondary">
        <span>
          Products: <span className="font-medium text-admin-text-primary">{store.products.toLocaleString()}</span>
        </span>
        <span>
          Discount: <span className="font-medium text-admin-brand">{store.discountPercent || 0}%</span>
        </span>
      </div>
    </div>
  );
}
