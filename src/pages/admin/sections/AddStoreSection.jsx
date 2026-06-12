import { useState } from 'react';
import { ArrowLeft, Upload, Info, Image as ImageIcon, Tag, CheckCircle } from 'lucide-react';

export default function AddStoreSection({ onBack }) {
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [isActive, setIsActive] = useState(true);
  const [logo, setLogo] = useState(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">Add New Store</h1>
            <p className="text-sm text-admin-text-secondary mt-1">Configure your new digital storefront and brand identity.</p>
          </div>
          <button className="flex items-center gap-2 px-8 py-3 bg-admin-brand text-white rounded-xl text-sm font-bold shadow-md hover:bg-admin-brand-light transition-colors">
            Save Store
          </button>
        </div>

        <div className="space-y-6">
          {/* Store Profile */}
          <div className="bg-white border border-admin-border/30 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-5 h-5 text-admin-brand"><Info className="w-5 h-5" /></div>
              <h2 className="text-xl font-medium text-admin-text-primary">Store Profile</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Milan Flagship Digital"
                  className="w-full px-4 py-3.5 bg-admin-brand-bg border border-admin-border rounded-xl text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief overview of the store's focus and target collection..."
                  rows={4}
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-xl text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Website URL</label>
                <div className="flex">
                  <span className="flex items-center px-4 py-3.5 bg-admin-profile border border-r-0 border-admin-border rounded-l-xl text-xs text-admin-text-secondary">https://</span>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="dolapy.store/milan-flagship"
                    className="flex-1 px-4 py-3.5 bg-admin-brand-bg border border-admin-border rounded-r-xl text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Brand Assets */}
          <div className="bg-white border border-admin-border/30 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-5 h-5 text-admin-brand"><ImageIcon className="w-5 h-5" /></div>
              <h2 className="text-xl font-medium text-admin-text-primary">Brand Assets</h2>
            </div>
            <div className="flex flex-col items-center">
              <label className="block text-xs font-medium text-admin-text-secondary mb-3 tracking-wider">Brand Logo</label>
              <label className="w-full max-w-[460px] h-[140px] flex flex-col items-center justify-center gap-2 bg-admin-brand-bg border-2 border-dashed border-admin-border rounded-2xl cursor-pointer hover:border-admin-brand transition-colors">
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                {logo ? (
                  <img src={logo} alt="Logo preview" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-admin-text-muted" />
                    <span className="text-sm text-admin-text-secondary">Drop logo here</span>
                    <span className="text-xs text-admin-text-muted">SVG or PNG (Max 2MB)</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Commerce */}
          <div className="bg-white border border-admin-border/30 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-5 h-5 text-admin-brand"><Tag className="w-5 h-5" /></div>
              <h2 className="text-xl font-medium text-admin-text-primary">Commerce</h2>
            </div>
            <div className="flex items-end gap-6">
              <div className="flex-1">
                <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Discount Code</label>
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="WELCOME10"
                  className="w-full px-4 py-3.5 bg-admin-brand-bg border border-admin-border rounded-xl text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Percentage (%)</label>
                <div className="relative">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full accent-admin-brand"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pb-1">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${isActive ? 'bg-admin-brand' : 'bg-admin-border'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isActive ? 'translate-x-5' : ''}`} />
                </button>
                <span className="text-sm text-admin-text-primary whitespace-nowrap">Active Status</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <div className="flex items-center gap-3 px-4 py-4 bg-white/80 backdrop-blur-md border-b border-admin-border/30">
          <button onClick={onBack} className="p-2 -ml-2 text-admin-text-secondary hover:text-admin-text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-admin-text-primary">Add Store</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-5">
          {/* Logo Upload */}
          <div className="flex flex-col items-center gap-3">
            <label className="w-24 h-24 rounded-full border-2 border-dashed border-admin-text-muted bg-admin-input flex items-center justify-center cursor-pointer hover:border-admin-brand transition-colors">
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              {logo ? (
                <img src={logo} alt="Logo preview" className="w-full h-full rounded-full object-cover" />
              ) : (
                <Upload className="w-7 h-7 text-admin-text-muted" />
              )}
            </label>
            <span className="text-xs font-medium text-admin-text-secondary">Upload Store Logo</span>
          </div>

          {/* Basic Information */}
          <div className="bg-white border border-admin-border rounded-2xl p-5 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Milan Flagship"
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about this store location..."
                  rows={3}
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Website URL</label>
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://dolapy.com/store"
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted"
                />
              </div>
            </div>
          </div>

          {/* Commerce Settings */}
          <div className="bg-white border border-admin-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Tag className="w-4 h-4 text-admin-brand" />
              <h3 className="text-xs font-bold text-admin-text-primary tracking-widest uppercase">Commerce Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Discount Code</label>
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="WELCOME10"
                    className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Discount %</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-admin-text-muted">%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-sm font-medium text-admin-text-primary">Store Active</p>
                  <p className="text-xs text-admin-text-secondary">Enable online visibility for this store</p>
                </div>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`relative w-12 h-7 rounded-full transition-colors ${isActive ? 'bg-admin-brand' : 'bg-admin-border'}`}
                >
                  <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${isActive ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 bg-white border-t border-admin-border/30">
          <button className="w-full flex items-center justify-center gap-2 py-4 bg-admin-brand text-white rounded-2xl text-base font-medium shadow-md hover:bg-admin-brand-light transition-colors">
            <CheckCircle className="w-5 h-5" />
            Save & Create Store
          </button>
        </div>
      </div>
    </>
  );
}
