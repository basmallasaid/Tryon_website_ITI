import React, { useEffect, useMemo, useState } from 'react';
import FilterSidebar from '../../components/store/FilterSidebar';
import ProductCard from '../../components/store/ProductCard';
import { getAllProducts, getAllStores } from '../../api/userApi';
import { LayoutGrid, List, ChevronDown, SlidersHorizontal } from 'lucide-react';
const normalizeId = (id) => {
  if (!id) return null;

  if (typeof id === 'object') {
    return String(id.$oid || id._id || '');
  }

  return String(id);
};

const StoresPage = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [prodRes, storeRes] = await Promise.all([
          getAllProducts(),
          getAllStores(),
        ]);

        const prodData = prodRes?.data ?? [];
        const storeData = storeRes?.data ?? [];

        setProducts(prodData);
        setStores(storeData);

        console.log('Products:', prodData);
        console.log('Stores:', storeData);

        const categories = [
          ...new Set(prodData.map((p) => p.category).filter(Boolean)),
        ];

        const brands = storeData.map((s) => ({
          id: normalizeId(s._id || s.id),
          name: s.name,
        }));

        const colors = [
          ...new Set(prodData.flatMap((p) => p.color_tags || [])),
        ];

        const seasons = [
          ...new Set(prodData.flatMap((p) => p.season_tags || [])),
        ];

        const prices = prodData
          .map((p) => Number(p.price))
          .filter((n) => !isNaN(n));

        const maxP = prices.length ? Math.max(...prices) : 2000;

        setOptions({
          categories,
          brands,
          colors,
          seasons,
        });

        setMaxPriceLimit(maxP);
        setFilters((prev) => ({
          ...prev,
          maxPrice: maxP,
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productStoreId = normalizeId(product.store_id);

      const brandMatch =
        filters.selectedBrands.length === 0 ||
        filters.selectedBrands.includes(productStoreId);

      const categoryMatch =
        filters.selectedCategories.length === 0 ||
        filters.selectedCategories.includes(product.category);

      const seasonMatch =
        filters.selectedSeasons.length === 0 ||
        (product.season_tags || []).some((season) =>
          filters.selectedSeasons.includes(season)
        );

      const priceMatch = Number(product.price) <= filters.maxPrice;

      const colorMatch =
        filters.selectedColors.length === 0 ||
        (product.color_tags || []).some((color) =>
          filters.selectedColors.includes(color)
        );

      const tryOnMatch =
        !filters.tryOnOnly || product.try_on_enabled === true;

      return (
        brandMatch &&
        categoryMatch &&
        seasonMatch &&
        priceMatch &&
        colorMatch &&
        tryOnMatch
      );
    });
  }, [products, filters]);

  return (
    <div className="min-h-screen bg-[#FCFDFF] p-10 font-roboto">
  <div className="max-w-[1440px] mx-auto flex gap-12">
     <FilterSidebar
          options={options}
          filters={filters}
          setFilters={setFilters}
          maxPriceLimit={maxPriceLimit}
          products={products}
        />

    <div className="flex-1">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Stores</h1>
        <p className="text-gray-400 text-sm font-medium">Curated collections from the world's most iconic brands.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col gap-4">
               <div className="aspect-[3/4] bg-gray-100 rounded-[1.5rem] animate-pulse" />
               <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
               <div className="h-4 w-1/4 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, idx) => (
            <ProductCard 
              key={normalizeId(product._id) || idx} 
              product={product} 
              store={stores.find(s => normalizeId(s._id || s.id) === normalizeId(product.store_id))}
            />
          ))}
        </div>
      )}
      
      {!loading && filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border border-dashed border-gray-200">
           <div className="p-5 bg-gray-50 rounded-full mb-4">
              <SlidersHorizontal size={30} className="text-gray-300" />
           </div>
           <p className="text-gray-500 font-bold">No products match your criteria.</p>
           <button onClick={() => window.location.reload()} className="mt-4 text-[#40B9FF] font-bold text-sm hover:underline">Clear all filters</button>
        </div>
      )}
    </div>
  </div>
</div>
  );
};

export default StoresPage;