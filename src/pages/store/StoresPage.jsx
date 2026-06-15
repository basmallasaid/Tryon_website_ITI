import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import FilterSidebar from '../../components/store/FilterSidebar';
import ProductCard from '../../components/store/ProductCard';
import { getAllProducts, getAllStores } from '../../api/userApi';
import { getProducts, saveProducts, getStores, saveStores, getCacheMeta, saveCacheMeta, dataHash } from '../../services/indexedDB';
import {
  SlidersHorizontal,
  Search,
  ChevronDown,
  LayoutGrid,
  List as ListIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { translateProducts } from '../../utils/translate';
import EmptyState from '../../components/EmptyState';

const normalizeId = id => {
  if (!id) return null;
  if (typeof id === 'object') {
    return String(id.$oid || id._id || '');
  }
  return String(id);
};

const StoresPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [products, setProducts] = useState([]);
  const [translatedProducts, setTranslatedProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const translationCache = useRef({});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [options, setOptions] = useState({
    categories: [],
    brands: [],
    colors: [],
    seasons: [],
  });

  const [maxPriceLimit, setMaxPriceLimit] = useState(0);

  const [filters, setFilters] = useState({
    selectedBrands: [],
    selectedCategories: [],
    selectedSeasons: [],
    maxPrice: 0,
    selectedColors: [],
    tryOnOnly: false,
  });

  const applyData = useCallback((prodData, storeData) => {
    setProducts(prodData);
    setStores(storeData);

    const categories = [
      ...new Set(
        prodData.map(p => p.category?.trim().toUpperCase()).filter(Boolean),
      ),
    ];
    const brands = storeData.map(s => ({
      id: normalizeId(s._id || s.id),
      name: s.name?.trim().toUpperCase(),
    }));
    const colors = [
      ...new Set(
        prodData
          .flatMap(p => p.color_tags || [])
          .map(c => c?.trim().toUpperCase())
          .filter(Boolean),
      ),
    ];
    const seasons = [
      ...new Set(
        prodData
          .flatMap(p => p.season_tags || [])
          .map(s => s?.trim().toUpperCase())
          .filter(Boolean),
      ),
    ];

    const prices = prodData
      .map(p => Number(p.price))
      .filter(n => !isNaN(n));
    const maxP = prices.length ? Math.max(...prices) : 2000;

    setOptions({ categories, brands, colors, seasons });
    setMaxPriceLimit(maxP);
    setFilters(prev => ({ ...prev, maxPrice: maxP }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);

        const [cachedProducts, cachedStores] = await Promise.all([
          getProducts().catch(() => []),
          getStores().catch(() => []),
        ]);
        if (cachedProducts.length && cachedStores.length && !cancelled) {
          applyData(cachedProducts, cachedStores);
          setLoading(false);
        }

        const [prodRes, storeRes] = await Promise.all([
          getAllProducts(),
          getAllStores(),
        ]);
        if (cancelled) return;

        const prodData = prodRes?.data ?? [];
        const storeData = storeRes?.data ?? [];

        const prodHash = dataHash(prodData);
        const meta = await getCacheMeta(null, 'products').catch(() => null);
        if (meta && prodHash === meta.dataHash) {
          await saveCacheMeta(null, 'products', { dataHash: prodHash }).catch(() => {});
          if (cachedProducts.length > 0) return;
        }

        applyData(prodData, storeData);

        saveProducts(prodData).catch(() => {});
        saveStores(storeData).catch(() => {});
        saveCacheMeta(null, 'products', { dataHash: prodHash }).catch(() => {});
        saveCacheMeta(null, 'stores', { dataHash: dataHash(storeData) }).catch(() => {});
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [applyData]);

  const handleTranslate = useCallback(async () => {
    if (products.length === 0) return;
    const cacheKey = products.map(p => p._id).join(',');
    if (translationCache.current[cacheKey]) {
      setTranslatedProducts(translationCache.current[cacheKey]);
      return;
    }
    try {
      setTranslating(true);
      const translated = await translateProducts(products);
      translationCache.current[cacheKey] = translated;
      setTranslatedProducts(translated);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setTranslating(false);
    }
  }, [products]);

  useEffect(() => {
    if (isArabic && products.length > 0 && translatedProducts.length === 0) {
      handleTranslate();
    }
  }, [isArabic, products, translatedProducts.length, handleTranslate]);

  const displayProducts =
    isArabic && translatedProducts.length > 0 ? translatedProducts : products;

  const filteredProducts = useMemo(() => {
    setCurrentPage(1);
    return displayProducts.filter(product => {
      const productStoreId = normalizeId(product.store_id);
      const nameMatch = product.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const brandMatch =
        filters.selectedBrands.length === 0 ||
        filters.selectedBrands.includes(productStoreId);
      const categoryMatch =
        filters.selectedCategories.length === 0 ||
        filters.selectedCategories.includes(product.category?.toUpperCase());
      const seasonMatch =
        filters.selectedSeasons.length === 0 ||
        (product.season_tags || []).some(s =>
          filters.selectedSeasons.includes(s.toUpperCase()),
        );
      const colorMatch =
        filters.selectedColors.length === 0 ||
        (product.color_tags || []).some(c =>
          filters.selectedColors.includes(c.toUpperCase()),
        );
      const priceMatch = Number(product.price) <= filters.maxPrice;
      const tryOnMatch = !filters.tryOnOnly || product.try_on_enabled === true;

      return (
        nameMatch &&
        brandMatch &&
        categoryMatch &&
        seasonMatch &&
        priceMatch &&
        colorMatch &&
        tryOnMatch
      );
    });
  }, [displayProducts, filters, searchQuery]);

  // --- حساب المنتجات المعروضة حالياً ---
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const showProducts = loading || translating;

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 sm:px-6 lg:px-10 py-6 font-roboto ">
      <div className="max-w-[1440px] mx-auto flex flex-col xl:flex-row gap-8 xl:gap-12">
        <FilterSidebar
          options={options}
          filters={filters}
          setFilters={setFilters}
          maxPriceLimit={maxPriceLimit}
          products={products}
        />

        <div className="flex-1 p-2 md:p-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight mb-3">
              {t('stores.title')}
            </h1>
            <p className="text-text-secondary text-[15px] font-medium mb-6">
              {t('stores.discountSubtitle')}{' '}
              <span className="bg-gradient-to-r from-[#8ED321] to-[#40B9FF] bg-clip-text text-transparent font-bold cursor-pointer hover:underline">
                {t('stores.installApp')}
              </span>
            </p>

            <div className="relative mb-6">
              <div className="absolute inset-y-0 ltr:left-4 rtl:right-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-text-disabled" />
              </div>
              <input
                type="text"
                placeholder={t('stores.searchPlaceholder')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full ltr:pl-12 rtl:pr-12 pr-4 py-4 bg-surface-elevated border-transparent rounded-[1.2rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-secondary font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between bg-surface-elevated px-6 py-4 rounded-[1.5rem] shadow-sm border border-[var(--border)] gap-4">
              <p className="text-sm font-medium text-text-secondary">
                {t('stores.showing')}{' '}
                <span className="text-text-primary font-bold">
                  {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredProducts.length,
                  )}
                </span>{' '}
                {t('stores.of')} {filteredProducts.length}{' '}
                {t('stores.products')}
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 cursor-pointer group">
                  <span className="text-xs text-text-disabled font-medium tracking-tight">
                    {t('stores.sortBy')}
                  </span>
                  <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                    {t('stores.newest')}
                  </span>
                  <ChevronDown size={16} className="text-text-disabled" />
                </div>
                <div className="flex items-center gap-1 bg-[var(--bg-secondary)] p-1.5 rounded-2xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-surface-elevated text-primary shadow-sm' : 'text-text-disabled'}`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-surface-elevated text-primary shadow-sm' : 'text-text-disabled'}`}
                  >
                    <ListIcon size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {showProducts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div
                  key={i}
                  className="aspect-[4/6] bg-[var(--bg-secondary)] rounded-[2rem] animate-pulse"
                />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <EmptyState message={t('stores.noProducts')} />
          ) : (
            <>
              <div
                className={`grid gap-8 transition-all duration-500 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 2xl:grid-cols-3' : 'grid-cols-1'}`}
              >
                {currentProducts.map((product, idx) => (
                  <ProductCard
                    key={normalizeId(product._id) || idx}
                    product={product}
                    viewMode={viewMode}
                    store={stores.find(
                      s =>
                        normalizeId(s._id || s.id) ===
                        normalizeId(product.store_id),
                    )}
                  />
                ))}
              </div>

              {/* --- Modern Pagination UI --- */}
              {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-4">
                  <button
                    onClick={() =>
                      setCurrentPage(prev => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-3 rounded-2xl bg-surface-elevated border border-[var(--border)] text-text-disabled hover:text-primary hover:border-primary disabled:opacity-30 disabled:hover:text-text-disabled transition-all shadow-sm"
                  >
                    <ChevronLeft
                      size={24}
                      className={isArabic ? 'rotate-180' : ''}
                    />
                  </button>

                  <div className="flex items-center gap-2 bg-surface-elevated/50 backdrop-blur-sm p-1.5 rounded-[1.5rem] border border-[var(--border)] shadow-sm">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl text-sm font-black transition-all duration-300 ${
                          currentPage === i + 1
                            ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110'
                            : 'text-text-disabled hover:bg-[var(--bg-secondary)]'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(prev => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-2xl bg-surface-elevated border border-[var(--border)] text-text-disabled hover:text-primary hover:border-primary disabled:opacity-30 disabled:hover:text-text-disabled transition-all shadow-sm"
                  >
                    <ChevronRight
                      size={24}
                      className={isArabic ? 'rotate-180' : ''}
                    />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoresPage;
