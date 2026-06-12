import { MoreVertical, Store } from 'lucide-react';

const tagColors = {
  Footwear: 'bg-admin-success/20 text-admin-success',
  Accessories: 'bg-admin-success/20 text-admin-success',
  Outerwear: 'bg-admin-success/20 text-admin-success',
  Eyewear: 'bg-admin-success/20 text-admin-success',
  "Spring '24": 'bg-admin-amber/20 text-admin-amber',
  "Winter '24": 'bg-admin-amber/20 text-admin-amber',
  'Limited Edition': 'bg-admin-brand/10 text-admin-brand',
  'Core Collection': 'bg-admin-amber/20 text-admin-amber',
};

export default function ProductCard({ product }) {
  return (
    <div className="bg-white border border-admin-border/40 rounded-2xl p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-xl bg-admin-category flex items-center justify-center overflow-hidden shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
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
          {product.category}
        </span>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${tagColors[product.season] || 'bg-admin-input text-admin-text-secondary'}`}>
          {product.season}
        </span>
      </div>
    </div>
  );
}
