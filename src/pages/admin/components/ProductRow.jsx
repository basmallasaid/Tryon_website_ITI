import { Shirt } from 'lucide-react';

const statusStyles = {
  Active: 'bg-admin-success/10 text-admin-success',
  Draft: 'bg-admin-border/20 text-admin-text-muted',
  'Out of Stock': 'bg-admin-danger/10 text-admin-danger',
};

export default function ProductRow({ product }) {
  return (
    <tr className="border-b border-admin-border/40 hover:bg-admin-brand-activeBg/30 transition-colors">
      <td className="py-3 px-4">
        <input type="checkbox" className="w-4 h-4 rounded border-admin-border accent-admin-brand" />
      </td>

      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-lg bg-admin-category flex items-center justify-center overflow-hidden shrink-0">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-bold text-admin-text-primary">{product.name}</p>
            <p className="text-xs text-admin-text-muted font-mono">SKU: {product.sku}</p>
          </div>
        </div>
      </td>

      <td className="py-3 px-4">
        <p className="text-sm text-admin-text-primary">{product.store}</p>
        <p className="text-xs text-admin-text-muted">{product.category}</p>
      </td>

      <td className="py-3 px-4">
        <span className="inline-block px-2.5 py-1 text-[10px] font-bold uppercase bg-admin-success/20 text-admin-success rounded">
          {product.season}
        </span>
      </td>

      <td className="py-3 px-4">
        <p className="text-base font-bold text-admin-text-primary">${product.price.toFixed(2)}</p>
        <p className="text-[10px] text-admin-text-muted">USD</p>
      </td>

      <td className="py-3 px-4">
        {product.tryOn ? (
          <div className="w-8 h-8 rounded-full bg-admin-brand/10 flex items-center justify-center">
            <Shirt className="w-4 h-4 text-admin-brand" />
          </div>
        ) : (
          <span className="text-admin-text-muted text-sm">—</span>
        )}
      </td>

      <td className="py-3 px-4">
        <span className={`inline-block px-3 py-1 text-[11px] font-bold rounded-full ${statusStyles[product.status] || ''}`}>
          {product.status.toUpperCase()}
        </span>
      </td>
    </tr>
  );
}
