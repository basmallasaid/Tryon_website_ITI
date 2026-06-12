import { ExternalLink } from 'lucide-react';

export default function StoreRow({ store }) {
  return (
    <tr className="border-b border-admin-border/40 hover:bg-admin-brand-activeBg/30 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
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
          <div>
            <p className="text-sm font-medium text-admin-text-primary">{store.name}</p>
            <p className="text-[11px] text-admin-text-muted">{store.id.slice(-8).toUpperCase()}</p>
          </div>
        </div>
      </td>

      <td className="py-3 px-4">
        <a
          href={store.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-admin-brand hover:underline"
        >
          {store.websiteLabel}
          <ExternalLink className="w-3 h-3" />
        </a>
      </td>

      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-admin-text-primary">{store.discountPercent || 0}%</span>
          <span className="inline-block px-2 py-0.5 text-[11px] font-medium bg-admin-brand-bg text-admin-brand rounded-full">
            {store.couponCode}
          </span>
        </div>
        <p className="text-[11px] text-admin-text-muted mt-0.5 truncate max-w-[180px]">{store.discountDescription}</p>
      </td>

      <td className="py-3 px-4">
        <span className="text-sm font-medium text-admin-text-primary">{store.products.toLocaleString()}</span>
      </td>

      <td className="py-3 px-4">
        <span
          className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-full ${
            store.status === 'Active'
              ? 'bg-admin-success/10 text-admin-success'
              : 'bg-admin-danger/10 text-admin-danger'
          }`}
        >
          {store.status}
        </span>
      </td>

      <td className="py-3 px-4 text-sm text-admin-text-secondary whitespace-nowrap">
        {store.joined}
      </td>
    </tr>
  );
}
