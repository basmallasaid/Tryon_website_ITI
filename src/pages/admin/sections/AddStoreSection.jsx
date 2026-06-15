import { useState, useEffect } from 'react';
import { ArrowLeft, Info, Image as ImageIcon, Tag, CheckCircle } from 'lucide-react';
import { createStoreApi, updateStoreApi } from '../../../api/adminApi';

export default function AddStoreSection({ onBack, editingStore }) {
  const isEditing = !!editingStore;

  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [isActive, setIsActive] = useState(true);
  const [logoUrl, setLogoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditing && editingStore) {
      setStoreName(editingStore.name || '');
      setDescription(editingStore.description || '');
      const url = editingStore.website_url || '';
      setWebsiteUrl(url.replace(/^https?:\/\//, ''));
      setDiscountCode(editingStore.discount_code || '');
      setDiscountPercent(editingStore.discount_percent || 0);
      setIsActive(editingStore.is_active ?? true);
      setLogoUrl(editingStore.logo_url || '');
    }
  }, [isEditing, editingStore]);

  const handleSubmit = async () => {
    if (!storeName.trim() || !description.trim() || !websiteUrl.trim() || !logoUrl.trim()) {
      alert('Please fill all required fields (Name, Description, Website, Logo URL).');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: storeName.trim(),
        description: description.trim(),
        website_url: websiteUrl.startsWith('http') ? websiteUrl.trim() : `https://${websiteUrl.trim()}`,
        logo_url: logoUrl.trim(),
        discount_code: discountCode.trim() || null,
        discount_percent: discountPercent || null,
        is_active: isActive,
      };
      if (isEditing) {
        await updateStoreApi(editingStore._id, payload);
      } else {
        await createStoreApi(payload);
      }
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} store.`);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-admin-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-admin-text-primary mb-2">{isEditing ? 'Store Updated!' : 'Store Created!'}</h2>
          <p className="text-sm text-admin-text-secondary mb-6">"{storeName}" has been {isEditing ? 'updated' : 'added to the network'}.</p>
          <button onClick={onBack} className="px-6 py-3 bg-admin-brand text-white rounded-xl text-sm font-medium hover:bg-admin-brand-light transition-colors">
            Back to Stores
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">{isEditing ? 'Edit Store' : 'Add New Store'}</h1>
            <p className="text-sm text-admin-text-secondary mt-1">{isEditing ? 'Update store configuration and brand identity.' : 'Configure your new digital storefront and brand identity.'}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="px-6 py-3 border border-admin-border rounded-xl text-sm font-medium text-admin-text-secondary hover:bg-admin-brand-activeBg transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="flex items-center gap-2 px-8 py-3 bg-admin-brand text-white rounded-xl text-sm font-bold shadow-md hover:bg-admin-brand-light transition-colors disabled:opacity-50">
              {submitting ? 'Saving…' : isEditing ? 'Update Store' : 'Save Store'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Store Profile */}
          <div className="bg-surface-elevated border border-admin-border/30 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-5 h-5 text-admin-brand"><Info className="w-5 h-5" /></div>
              <h2 className="text-xl font-medium text-admin-text-primary">Store Profile</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Store Name *</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Milan Flagship Digital"
                  className="w-full px-4 py-3.5 bg-admin-brand-bg border border-admin-border rounded-xl text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief overview of the store's focus and target collection..."
                  rows={4}
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-xl text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Website URL *</label>
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
          <div className="bg-surface-elevated border border-admin-border/30 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-5 h-5 text-admin-brand"><ImageIcon className="w-5 h-5" /></div>
              <h2 className="text-xl font-medium text-admin-text-primary">Brand Assets</h2>
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-medium text-admin-text-secondary tracking-wider">Brand Logo URL *</label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-3.5 bg-admin-brand-bg border border-admin-border rounded-xl text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
              />
              {logoUrl && (
                <div className="w-24 h-24 rounded-full border border-admin-border overflow-hidden">
                  <img src={logoUrl} alt="Logo preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </div>
          </div>

          {/* Commerce */}
          <div className="bg-surface-elevated border border-admin-border/30 rounded-2xl p-8 shadow-sm">
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
                  <span className="text-xs text-admin-text-secondary mt-1 block">{discountPercent}%</span>
                </div>
              </div>
              <div className="flex items-center gap-3 pb-1">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${isActive ? 'bg-admin-brand' : 'bg-admin-border'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-surface-elevated rounded-full shadow-sm transition-transform ${isActive ? 'translate-x-5' : ''}`} />
                </button>
                <span className="text-sm text-admin-text-primary whitespace-nowrap">Active Status</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <div className="flex items-center gap-3 px-4 py-4 bg-surface-elevated/80 backdrop-blur-md border-b border-admin-border/30">
          <button onClick={onBack} className="p-2 -ml-2 text-admin-text-secondary hover:text-admin-text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-admin-text-primary">{isEditing ? 'Edit Store' : 'Add Store'}</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-5">
          {/* Logo Preview */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-admin-text-muted bg-admin-input flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo preview" className="w-full h-full rounded-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <ImageIcon className="w-7 h-7 text-admin-text-muted" />
              )}
            </div>
            <span className="text-xs font-medium text-admin-text-secondary">Store Logo</span>
          </div>

          {/* Basic Information */}
          <div className="bg-surface-elevated border border-admin-border rounded-2xl p-5 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Store Name *</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Milan Flagship"
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us about this store location..."
                  rows={3}
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Website URL *</label>
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://dolapy.com/store"
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Logo URL *</label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted"
                />
              </div>
            </div>
          </div>

          {/* Commerce Settings */}
          <div className="bg-surface-elevated border border-admin-border rounded-2xl p-5 shadow-sm">
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
                  <span className={`absolute top-1 left-1 w-5 h-5 bg-surface-elevated rounded-full shadow-sm transition-transform ${isActive ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 bg-surface-elevated border-t border-admin-border/30 flex items-center gap-3">
          <button onClick={onBack} className="flex-1 py-3 border border-admin-border rounded-xl text-sm font-medium text-admin-text-secondary">Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} className="flex-[2] flex items-center justify-center gap-2 py-3 bg-admin-brand text-white rounded-xl text-sm font-medium shadow-md hover:bg-admin-brand-light transition-colors disabled:opacity-50">
            <CheckCircle className="w-5 h-5" />
            {submitting ? 'Saving…' : isEditing ? 'Update Store' : 'Save & Create Store'}
          </button>
        </div>
      </div>
    </>
  );
}
