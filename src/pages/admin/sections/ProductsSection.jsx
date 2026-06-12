import { useState } from 'react';
import { Filter, X, ChevronLeft, ChevronRight, Plus, SlidersHorizontal } from 'lucide-react';
import ProductRow from '../components/ProductRow';
import ProductCard from '../components/ProductCard';

const allProducts = [
  { id: 1, name: 'Aura Leather Sneakers', sku: 'AU-24-998', image: 'https://i.pravatar.cc/120?img=11', store: 'Milan Flagship', category: 'Footwear', season: "Spring '24", price: 540, tryOn: true, status: 'Active' },
  { id: 2, name: 'Minimalist Wool Overcoat', sku: 'MW-23-441', image: 'https://i.pravatar.cc/120?img=12', store: 'Paris Boutique', category: 'Outerwear', season: "Spring '24", price: 1250, tryOn: false, status: 'Draft' },
  { id: 3, name: 'Heritage Crossbody Bag', sku: 'HB-24-001', image: 'https://i.pravatar.cc/120?img=13', store: 'Global E-Shop', category: 'Accessories', season: "Spring '24", price: 890, tryOn: true, status: 'Active' },
  { id: 4, name: 'Silk Gala Slip Dress', sku: 'SG-24-322', image: 'https://i.pravatar.cc/120?img=14', store: 'London Flagship', category: 'Evening Wear', season: "Spring '24", price: 1450, tryOn: true, status: 'Out of Stock' },
  { id: 5, name: 'Titanium Aviators', sku: 'TA-0044-G', image: 'https://i.pravatar.cc/120?img=15', store: 'London Flagship', category: 'Eyewear', season: "Spring '24", price: 320, tryOn: true, status: 'Active' },
  { id: 6, name: 'Velvet Nocturne Clutch', sku: 'VC-1102-E', image: 'https://i.pravatar.cc/120?img=16', store: 'Paris Boutique', category: 'Accessories', season: "Winter '24", price: 680, tryOn: true, status: 'Active' },
  { id: 7, name: 'Cashmere Turtleneck', sku: 'CT-7712-M', image: 'https://i.pravatar.cc/120?img=17', store: 'Milan Flagship', category: 'Outerwear', season: "Winter '24", price: 420, tryOn: false, status: 'Draft' },
  { id: 8, name: 'Runway Platform Boots', sku: 'RP-5590-L', image: 'https://i.pravatar.cc/120?img=18', store: 'Global E-Shop', category: 'Footwear', season: "Spring '24", price: 760, tryOn: true, status: 'Active' },
  { id: 9, name: 'Sapphire Pendant Necklace', sku: 'SPN-0088-S', image: 'https://i.pravatar.cc/120?img=19', store: 'London Flagship', category: 'Accessories', season: "Spring '24", price: 2100, tryOn: false, status: 'Out of Stock' },
  { id: 10, name: 'Linen Summer Blazer', sku: 'LSB-3301-M', image: 'https://i.pravatar.cc/120?img=20', store: 'Paris Boutique', category: 'Outerwear', season: "Spring '24", price: 590, tryOn: true, status: 'Active' },
];

const stores = ['All Stores', 'Milan Flagship', 'Paris Boutique', 'Global E-Shop', 'London Flagship'];
const categories = ['category', 'Footwear', 'Outerwear', 'Accessories', 'Evening Wear', 'Eyewear'];
const PAGE_SIZE = 5;

export default function ProductsSection({ onAddProduct }) {
  const [storeFilter, setStoreFilter] = useState('All Stores');
  const [categoryFilter, setCategoryFilter] = useState('category');
  const [page, setPage] = useState(1);

  const filtered = allProducts.filter((p) => {
    const matchStore = storeFilter === 'All Stores' || p.store === storeFilter;
    const matchCat = categoryFilter === 'category' || p.category === categoryFilter;
    return matchStore && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetFilters = () => { setStoreFilter('All Stores'); setCategoryFilter('category'); setPage(1); };
  const hasFilters = storeFilter !== 'All Stores' || categoryFilter !== 'category';

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">Products</h1>
            <p className="text-sm text-admin-text-secondary mt-1">Manage your global product catalog.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <select
            value={storeFilter}
            onChange={(e) => { setStoreFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none min-w-[180px]"
          >
            {stores.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none min-w-[160px]"
          >
            {categories.map((c) => <option key={c} value={c}>{c === 'category' ? 'category' : c}</option>)}
          </select>
          <button className="w-10 h-10 flex items-center justify-center bg-admin-category rounded-lg text-admin-text-secondary hover:bg-admin-border transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          {hasFilters && (
            <button onClick={resetFilters} className="flex items-center gap-1 text-sm text-admin-brand hover:underline ml-1">
              Reset Filters
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl border border-admin-border/40 shadow-sm overflow-hidden mb-6">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-admin-category/50">
                <th className="py-3 px-4 w-12"><input type="checkbox" className="w-4 h-4 rounded border-admin-border accent-admin-brand" /></th>
                <th className="py-3 px-4 text-[11px] font-bold text-admin-text-muted uppercase tracking-wider">Product</th>
                <th className="py-3 px-4 text-[11px] font-bold text-admin-text-muted uppercase tracking-wider">Store & Category</th>
                <th className="py-3 px-4 text-[11px] font-bold text-admin-text-muted uppercase tracking-wider">Season</th>
                <th className="py-3 px-4 text-[11px] font-bold text-admin-text-muted uppercase tracking-wider">Price</th>
                <th className="py-3 px-4 text-[11px] font-bold text-admin-text-muted uppercase tracking-wider text-center">Try-On</th>
                <th className="py-3 px-4 text-[11px] font-bold text-admin-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? (
                paginated.map((p) => <ProductRow key={p.id} product={p} />)
              ) : (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-admin-text-muted">No products match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-sm text-admin-text-secondary">
          <span>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} products</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded flex items-center justify-center hover:bg-admin-brand-activeBg disabled:opacity-40 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-colors ${p === page ? 'bg-admin-brand text-white' : 'hover:bg-admin-brand-activeBg'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 rounded flex items-center justify-center hover:bg-admin-brand-activeBg disabled:opacity-40 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden px-4 py-6 flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold text-admin-text-primary tracking-[-0.64px]">Products</h1>
          <span className="text-sm text-admin-text-secondary">{filtered.length} total</span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onAddProduct} className="flex items-center gap-2 px-4 py-2.5 bg-admin-brand text-white rounded-xl text-xs font-medium shadow-sm">
            <Plus className="w-4 h-4" />
            New Product
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-admin-border rounded-xl text-xs font-medium text-admin-text-secondary">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {paginated.length > 0 ? (
            paginated.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p className="text-center text-sm text-admin-text-muted py-8">No products match your filters.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center text-xs text-admin-text-secondary pt-2 gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg flex items-center justify-center border border-admin-border disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center border border-admin-border disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
