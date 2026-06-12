import { useState, useEffect } from 'react';
import { Filter, X, ChevronLeft, ChevronRight, Plus, SlidersHorizontal } from 'lucide-react';
import ProductRow from '../components/ProductRow';
import ProductCard from '../components/ProductCard';
import { getProductsApi, getStoresApi } from '../../../api/adminApi';

const PAGE_SIZE = 5;

const categoryLabels = { top: 'Tops', bottom: 'Bottoms', dress: 'Dresses', acc: 'Accessories' };

export default function ProductsSection({ onAddProduct }) {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeFilter, setStoreFilter] = useState('All Stores');
  const [categoryFilter, setCategoryFilter] = useState('category');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, storesRes] = await Promise.all([
          getProductsApi(),
          getStoresApi(),
        ]);
        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
        setStores(Array.isArray(storesRes.data) ? storesRes.data : []);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const storeMap = {};
  stores.forEach((s) => { storeMap[s._id] = s.name; });

  const dynamicCategories = ['category', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const mapped = products.map((p) => ({
    id: p._id,
    name: p.name,
    sku: p._id.slice(-8).toUpperCase(),
    image: p.images?.[0] || null,
    store: storeMap[p.store_id?._id || p.store_id] || 'Unknown Store',
    storeId: p.store_id?._id || p.store_id,
    category: p.category,
    categoryLabel: categoryLabels[p.category] || p.category,
    season: p.season_tags?.[0] || '—',
    price: p.price || 0,
    currency: p.currency || 'USD',
    tryOn: p.try_on_enabled,
    status: p.is_active ? 'Active' : 'Draft',
  }));

  const filtered = mapped.filter((p) => {
    const matchStore = storeFilter === 'All Stores' || p.storeId === storeFilter;
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
            <option value="All Stores">All Stores</option>
            {stores.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none min-w-[160px]"
          >
            {dynamicCategories.map((c) => (
              <option key={c} value={c}>{c === 'category' ? 'category' : (categoryLabels[c] || c)}</option>
            ))}
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
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-admin-text-muted">Loading products…</td></tr>
              ) : paginated.length > 0 ? (
                paginated.map((p) => <ProductRow key={p.id} product={p} />)
              ) : (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-admin-text-muted">No products match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-sm text-admin-text-secondary">
          <span>{loading ? 'Loading…' : `Showing ${filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} products`}</span>
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
          <span className="text-sm text-admin-text-secondary">{loading ? '—' : `${filtered.length} total`}</span>
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
          {loading ? (
            <p className="text-center text-sm text-admin-text-muted py-8">Loading products…</p>
          ) : paginated.length > 0 ? (
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
