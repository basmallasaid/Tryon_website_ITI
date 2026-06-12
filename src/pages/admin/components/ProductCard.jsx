import { MoreVertical, Store } from 'lucide-react';

const tagColors = {
  top: 'bg-admin-success/20 text-admin-success',
  bottom: 'bg-admin-success/20 text-admin-success',
  dress: 'bg-admin-success/20 text-admin-success',
  acc: 'bg-admin-success/20 text-admin-success',
  spring: 'bg-admin-amber/20 text-admin-amber',
  summer: 'bg-admin-amber/20 text-admin-amber',
  autumn: 'bg-admin-amber/20 text-admin-amber',
  winter: 'bg-admin-amber/20 text-admin-amber',
};

const categoryLabels = { top: 'Tops', bottom: 'Bottoms', dress: 'Dresses', acc: 'Accessories' };

export default function ProductCard({ product }) {
  return (
    <div className="bg-white border border-admin-border/40 rounded-2xl p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-xl bg-admin-category flex items-center justify-center overflow-hidden shrink-0">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-admin-text-muted">{product.name?.charAt(0) || '?'}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-base font-bold text-admin-text-primary leading-tight">{product.name}</p>
              <p className="text-xs text-admin-text-muted font-mono mt-0.5">SKU: {product.sku}</p>
            </div>
            <button className="p-1 text-admin-text-muted hover:text-admin-text-primary">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-admin-text-secondary">
            <Store className="w-3.5 h-3.5" />
            {product.store}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3 flex-wrap">
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${tagColors[product.category] || 'bg-admin-input text-admin-text-secondary'}`}>
          {product.categoryLabel}
        </span>
        {product.season !== '—' && (
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${tagColors[product.season] || 'bg-admin-input text-admin-text-secondary'}`}>
            {product.season}
          </span>
        )}
      </div>
    </div>
  );
}
