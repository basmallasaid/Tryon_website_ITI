import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Plus, Upload, X, Shirt, CheckCircle } from 'lucide-react';
import { getStoresApi, createProductApi, updateProductApi } from '../../../api/adminApi';

const steps = ['Basic Info', 'Media', 'Category', 'Commerce', 'Settings'];

const categoryMap = {
  'Dresses & Gowns': 'dress',
  'Footwear': 'acc',
  'Outerwear': 'top',
  'Accessories': 'acc',
  'Eyewear': 'acc',
  'Tops': 'top',
  'Bottoms': 'bottom',
};

const reverseCategoryMap = {
  dress: 'Dresses & Gowns',
  top: 'Outerwear',
  bottom: 'Bottoms',
  acc: 'Accessories',
};

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1.5 h-6 bg-admin-brand rounded-full" />
      <h3 className="text-xl font-bold text-admin-text-primary tracking-[-0.2px]">{title}</h3>
    </div>
  );
}

export default function AddProductSection({ onBack, editingProduct }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [stores, setStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const isEditing = !!editingProduct;

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [storeId, setStoreId] = useState('');
  const [primaryCategory, setPrimaryCategory] = useState('Dresses & Gowns');
  const [colorTags, setColorTags] = useState(['Luxury', 'Evening', 'Silk']);
  const [tagInput, setTagInput] = useState('');
  const [seasonTags, setSeasonTags] = useState([]);
  const [seasonInput, setSeasonInput] = useState('');
  const [price, setPrice] = useState('');
  const [purchaseUrl, setPurchaseUrl] = useState('');
  const [tryOn, setTryOn] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await getStoresApi();
        const data = Array.isArray(res.data) ? res.data : [];
        setStores(data);
        if (isEditing && editingProduct) {
          const store = data.find(s => s._id === editingProduct.store_id);
          if (store) setStoreId(store._id);
          else if (data.length > 0) setStoreId(data[0]._id);
        } else if (data.length > 0) {
          setStoreId(data[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch stores:', err);
      } finally {
        setLoadingStores(false);
      }
    };
    fetchStores();
  }, [isEditing, editingProduct]);

  useEffect(() => {
    if (isEditing && editingProduct) {
      setProductName(editingProduct.name || '');
      setDescription(editingProduct.description || '');
      setPrice(editingProduct.price?.toString() || '');
      setPurchaseUrl(editingProduct.purchase_url || '');
      setTryOn(editingProduct.try_on_enabled ?? true);
      setImageUrl(editingProduct.images?.[0] || '');
      setStoreId(editingProduct.store_id || '');
      setColorTags(editingProduct.color_tags?.length ? editingProduct.color_tags : ['Luxury', 'Evening', 'Silk']);
      setSeasonTags(editingProduct.season_tags || []);
      const catLabel = reverseCategoryMap[editingProduct.category];
      if (catLabel) setPrimaryCategory(catLabel);
    }
  }, [isEditing, editingProduct]);

  const addTag = () => {
    if (tagInput.trim() && !colorTags.includes(tagInput.trim())) {
      setColorTags([...colorTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (t) => setColorTags(colorTags.filter((tag) => tag !== t));

  const addSeason = () => {
    if (seasonInput.trim() && !seasonTags.includes(seasonInput.trim())) {
      setSeasonTags([...seasonTags, seasonInput.trim()]);
      setSeasonInput('');
    }
  };

  const removeSeason = (t) => setSeasonTags(seasonTags.filter((s) => s !== t));

  const handleSubmit = async () => {
    if (!productName.trim() || !description.trim() || !price || !purchaseUrl.trim() || !storeId) {
      alert('Please fill all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        store_id: storeId,
        name: productName.trim(),
        description: description.trim(),
        category: categoryMap[primaryCategory] || 'acc',
        price: parseFloat(price),
        currency: 'USD',
        purchase_url: purchaseUrl.trim(),
        images: imageUrl ? [imageUrl.trim()] : [],
        color_tags: colorTags,
        season_tags: seasonTags,
        try_on_enabled: tryOn,
        is_active: true,
      };
      if (isEditing) {
        await updateProductApi(editingProduct._id, payload);
      } else {
        await createProductApi(payload);
      }
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} product.`);
    } finally {
      setSubmitting(false);
    }
  };

  const progress = Math.round((currentStep / steps.length) * 100);

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-admin-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-admin-text-primary mb-2">{isEditing ? 'Product Updated!' : 'Product Created!'}</h2>
          <p className="text-sm text-admin-text-secondary mb-6">"{productName}" has been {isEditing ? 'updated' : 'added to the catalog'}.</p>
          <button onClick={onBack} className="px-6 py-3 bg-admin-brand text-white rounded-xl text-sm font-medium hover:bg-admin-brand-light transition-colors">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const Stepper = () => (
    <div className="flex items-center justify-between mb-10 relative">
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-admin-border" />
      {steps.map((step, i) => {
        const num = i + 1;
        const isActive = num === currentStep;
        const isDone = num < currentStep;
        return (
          <div key={step} className="flex flex-col items-center gap-2 relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              isDone ? 'bg-admin-brand text-white' : isActive ? 'bg-admin-brand text-white' : 'bg-admin-category text-admin-text-muted'
            }`}>
              {isDone ? '✓' : num}
            </div>
            <span className={`text-xs font-medium ${isActive ? 'text-admin-brand' : 'text-admin-text-muted'}`}>{step}</span>
          </div>
        );
      })}
    </div>
  );

  const isLastStep = currentStep === steps.length;

  const DesktopFooter = () => (
    <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-white/90 backdrop-blur-md border-t border-admin-border/40">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-admin-brand text-white flex items-center justify-center text-xs font-bold">{currentStep}</div>
          <span className="text-sm text-admin-text-secondary">Step {currentStep} of {steps.length}: Product Details</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="px-6 py-2 text-sm font-medium text-admin-text-secondary hover:text-admin-text-primary transition-colors">Cancel & Discard</button>
        <div className="w-px h-6 bg-admin-border" />
        {isLastStep ? (
          <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 px-6 py-2 bg-admin-success text-white rounded-xl text-sm font-medium hover:opacity-90 transition-colors disabled:opacity-50">
            {submitting ? (isEditing ? 'Updating…' : 'Creating…') : (isEditing ? 'Update Product' : 'Create Product')}
          </button>
        ) : (
          <button onClick={() => setCurrentStep((s) => Math.min(s + 1, steps.length))} className="flex items-center gap-2 px-6 py-2 bg-admin-brand text-white rounded-xl text-sm font-medium hover:bg-admin-brand-light transition-colors">
            Save & Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex flex-col min-h-screen">
        <div className="flex-1 overflow-y-auto px-8 pt-8 pb-32">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-5 h-5 text-admin-brand"><Shirt className="w-5 h-5" /></div>
            <h1 className="text-2xl font-bold text-admin-text-primary tracking-[-0.2px]">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
          </div>

          <Stepper />

          <div className="space-y-10 max-w-[1048px]">
            {/* Basic Information */}
            <section>
              <SectionHeader title="Basic Information" />
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Product Name *</label>
                  <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Midnight Silk Gala Gown" className="w-full px-4 py-3.5 bg-white border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Description *</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the materials, fit, and aesthetic details..." rows={4} className="w-full px-4 py-3 bg-white border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Assigned Store *</label>
                  <select value={storeId} onChange={(e) => setStoreId(e.target.value)} className="w-full px-4 py-3.5 bg-white border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none">
                    {loadingStores ? (
                      <option>Loading stores…</option>
                    ) : stores.length === 0 ? (
                      <option>No stores available</option>
                    ) : (
                      stores.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)
                    )}
                  </select>
                </div>
              </div>
            </section>

            {/* Product Media */}
            <section>
              <SectionHeader title="Product Media" />
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Image URL</label>
                  <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="w-full px-4 py-3.5 bg-white border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors" />
                </div>
                {imageUrl && (
                  <div className="w-32 h-32 rounded-xl border border-admin-border overflow-hidden">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                )}
              </div>
            </section>

            {/* Classification */}
            <section>
              <SectionHeader title="Classification" />
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Category *</label>
                  <select value={primaryCategory} onChange={(e) => setPrimaryCategory(e.target.value)} className="w-full px-4 py-3.5 bg-white border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none">
                    {Object.keys(categoryMap).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Color Tags</label>
                  <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-white border border-admin-border rounded-lg min-h-[50px]">
                    {colorTags.map((t) => (
                      <span key={t} className="flex items-center gap-1 px-3 py-1 bg-admin-success/20 text-admin-success text-xs font-bold rounded-full">
                        {t}
                        <button onClick={() => removeTag(t)} className="hover:text-admin-danger transition-colors"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag..." className="flex-1 min-w-[80px] text-xs text-admin-text-primary outline-none placeholder:text-admin-text-muted" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Season Tags</label>
                  <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-white border border-admin-border rounded-lg min-h-[50px]">
                    {seasonTags.map((t) => (
                      <span key={t} className="flex items-center gap-1 px-3 py-1 bg-admin-amber/20 text-admin-amber text-xs font-bold rounded-full">
                        {t}
                        <button onClick={() => removeSeason(t)} className="hover:text-admin-danger transition-colors"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                    <input type="text" value={seasonInput} onChange={(e) => setSeasonInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSeason())} placeholder="e.g. spring, summer..." className="flex-1 min-w-[80px] text-xs text-admin-text-primary outline-none placeholder:text-admin-text-muted" />
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing & Commerce */}
            <section>
              <SectionHeader title="Pricing & Commerce" />
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Price (USD) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-admin-text-muted">$</span>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="w-full pl-8 pr-4 py-3.5 bg-white border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Purchase URL *</label>
                  <input type="url" value={purchaseUrl} onChange={(e) => setPurchaseUrl(e.target.value)} placeholder="https://yourstore.com/product" className="w-full px-4 py-3.5 bg-white border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors" />
                </div>
              </div>
            </section>

            {/* Advanced Settings */}
            <section>
              <SectionHeader title="Advanced Settings" />
              <div className="flex items-center justify-between p-6 bg-admin-brand-bg border border-admin-border rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-admin-brand/10 rounded-xl flex items-center justify-center">
                    <Shirt className="w-5 h-5 text-admin-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-admin-text-primary">Enable AI Virtual Try-On</p>
                    <p className="text-xs text-admin-text-secondary">Allow customers to see this product on their own body using AR.</p>
                  </div>
                </div>
                <button onClick={() => setTryOn(!tryOn)} className={`relative w-12 h-7 rounded-full transition-colors ${tryOn ? 'bg-admin-brand' : 'bg-admin-border'}`}>
                  <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${tryOn ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </section>
          </div>
        </div>

        <DesktopFooter />
      </div>

      {/* Mobile */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <div className="flex items-center gap-3 px-4 py-4 bg-white/80 backdrop-blur-md border-b border-admin-border/30">
          <button onClick={onBack} className="p-2 -ml-2 text-admin-text-secondary hover:text-admin-text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-admin-text-primary">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-6">
          {/* Mobile Stepper */}
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-admin-border" />
            {steps.map((step, i) => {
              const num = i + 1;
              const isActive = num === currentStep;
              const isDone = num < currentStep;
              return (
                <div key={step} className="flex flex-col items-center gap-1.5 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isDone || isActive ? 'bg-admin-brand text-white' : 'bg-admin-category text-admin-text-muted'
                  }`}>
                    {isDone ? '✓' : num}
                  </div>
                  <span className={`text-[10px] font-medium ${isActive ? 'text-admin-brand' : 'text-admin-text-muted'}`}>{step}</span>
                </div>
              );
            })}
          </div>

          {/* Basic Information */}
          <div className="bg-white border border-admin-border rounded-2xl p-5 shadow-sm">
            <SectionHeader title="Basic Information" />
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Product Name *</label>
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. Midnight Silk Gala Gown" className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted" />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Description *</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the materials, fit, and aesthetic details..." rows={3} className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Assigned Store *</label>
                <select value={storeId} onChange={(e) => setStoreId(e.target.value)} className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none">
                  {loadingStores ? (
                    <option>Loading stores…</option>
                  ) : stores.length === 0 ? (
                    <option>No stores available</option>
                  ) : (
                    stores.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Product Media */}
          <div className="bg-white border border-admin-border rounded-2xl p-5 shadow-sm">
            <SectionHeader title="Product Media" />
            <div className="space-y-3">
              <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Image URL</label>
              <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted" />
              {imageUrl && (
                <div className="w-24 h-24 rounded-xl border border-admin-border overflow-hidden">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </div>
          </div>

          {/* Classification */}
          <div className="bg-white border border-admin-border rounded-2xl p-5 shadow-sm">
            <SectionHeader title="Classification" />
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Category *</label>
                <select value={primaryCategory} onChange={(e) => setPrimaryCategory(e.target.value)} className="w-full px-3 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-xs text-admin-text-primary outline-none">
                  {Object.keys(categoryMap).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Color Tags</label>
                <div className="flex flex-wrap items-center gap-2 px-3 py-3 bg-admin-brand-bg border border-admin-border rounded-lg min-h-[44px]">
                  {colorTags.map((t) => (
                    <span key={t} className="flex items-center gap-1 px-2.5 py-0.5 bg-admin-success/20 text-admin-success text-[11px] font-bold rounded-full">
                      {t}
                      <button onClick={() => removeTag(t)}><X className="w-2.5 h-2.5" /></button>
                    </span>
                  ))}
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag..." className="flex-1 min-w-[60px] text-xs text-admin-text-primary outline-none placeholder:text-admin-text-muted" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Season Tags</label>
                <div className="flex flex-wrap items-center gap-2 px-3 py-3 bg-admin-brand-bg border border-admin-border rounded-lg min-h-[44px]">
                  {seasonTags.map((t) => (
                    <span key={t} className="flex items-center gap-1 px-2.5 py-0.5 bg-admin-amber/20 text-admin-amber text-[11px] font-bold rounded-full">
                      {t}
                      <button onClick={() => removeSeason(t)}><X className="w-2.5 h-2.5" /></button>
                    </span>
                  ))}
                  <input type="text" value={seasonInput} onChange={(e) => setSeasonInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSeason())} placeholder="e.g. spring, summer..." className="flex-1 min-w-[60px] text-xs text-admin-text-primary outline-none placeholder:text-admin-text-muted" />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white border border-admin-border rounded-2xl p-5 shadow-sm">
            <SectionHeader title="Pricing & Commerce" />
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Price (USD) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-admin-text-muted">$</span>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="w-full pl-7 pr-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Purchase URL *</label>
                <input type="url" value={purchaseUrl} onChange={(e) => setPurchaseUrl(e.target.value)} placeholder="https://yourstore.com/product" className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted" />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white border border-admin-border rounded-2xl p-5 shadow-sm">
            <SectionHeader title="Advanced Settings" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-admin-brand/10 rounded-xl flex items-center justify-center shrink-0">
                  <Shirt className="w-4 h-4 text-admin-brand" />
                </div>
                <div>
                  <p className="text-sm font-medium text-admin-text-primary">AI Virtual Try-On</p>
                  <p className="text-[11px] text-admin-text-secondary">Enable AR for customers</p>
                </div>
              </div>
              <button onClick={() => setTryOn(!tryOn)} className={`relative w-11 h-6 rounded-full transition-colors ${tryOn ? 'bg-admin-brand' : 'bg-admin-border'}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${tryOn ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 bg-white border-t border-admin-border/30 flex items-center gap-3">
          <button onClick={onBack} className="flex-1 py-3 border border-admin-border rounded-xl text-sm font-medium text-admin-text-secondary">Cancel</button>
          {isLastStep ? (
            <button onClick={handleSubmit} disabled={submitting} className="flex-[2] flex items-center justify-center gap-2 py-3 bg-admin-success text-white rounded-xl text-sm font-medium shadow-md disabled:opacity-50">
              {submitting ? (isEditing ? 'Updating…' : 'Creating…') : (isEditing ? 'Update Product' : 'Create Product')}
            </button>
          ) : (
            <button onClick={() => setCurrentStep((s) => Math.min(s + 1, steps.length))} className="flex-[2] flex items-center justify-center gap-2 py-3 bg-admin-brand text-white rounded-xl text-sm font-medium shadow-md">
              Save & Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
