import { useState } from 'react';
import { ArrowLeft, UserPlus, Shirt, RefreshCw, ShieldCheck } from 'lucide-react';

export default function AddUserSection({ onBack }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'User',
    tryOnUsed: 0,
    tryOnTotal: 5,
    recyclingUsed: 0,
    recyclingTotal: 5,
    status: 'Active',
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 text-admin-text-secondary hover:text-admin-text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">Add New User</h1>
              <p className="text-sm text-admin-text-secondary mt-1">Create a new user account and assign access permissions.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-8 py-3 bg-admin-brand text-white rounded-xl text-sm font-bold shadow-md hover:bg-admin-brand-light transition-colors">
            <UserPlus className="w-4 h-4" />
            Save User
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile */}
          <div className="bg-white border border-admin-border/30 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-5 h-5 text-admin-brand"><UserPlus className="w-5 h-5" /></div>
              <h2 className="text-xl font-medium text-admin-text-primary">User Profile</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="e.g. Sara Al-Rashidi"
                  className="w-full px-4 py-3.5 bg-admin-brand-bg border border-admin-border rounded-xl text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="sara@example.com"
                  className="w-full px-4 py-3.5 bg-admin-brand-bg border border-admin-border rounded-xl text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-2 tracking-wider">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => update('role', e.target.value)}
                  className="w-full px-4 py-3.5 bg-admin-brand-bg border border-admin-border rounded-xl text-sm text-admin-text-primary outline-none focus:border-admin-brand transition-colors"
                >
                  <option value="User">User</option>
                  <option value="Premium">Premium</option>
                  <option value="Store Owner">Store Owner</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quotas */}
          <div className="bg-white border border-admin-border/30 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-5 h-5 text-admin-brand"><ShieldCheck className="w-5 h-5" /></div>
              <h2 className="text-xl font-medium text-admin-text-primary">Usage Quotas</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Shirt className="w-4 h-4 text-brand-secondary" />
                  <span className="text-xs font-medium text-admin-text-secondary tracking-wider">Virtual Try-On</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] text-admin-text-muted mb-1">Used</label>
                    <input
                      type="number"
                      min={0}
                      value={form.tryOnUsed}
                      onChange={(e) => update('tryOnUsed', Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-admin-text-muted mb-1">Total</label>
                    <input
                      type="number"
                      min={1}
                      value={form.tryOnTotal}
                      onChange={(e) => update('tryOnTotal', Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none"
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <RefreshCw className="w-4 h-4 text-[#2B7FFF]" />
                  <span className="text-xs font-medium text-admin-text-secondary tracking-wider">Recycling</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] text-admin-text-muted mb-1">Used</label>
                    <input
                      type="number"
                      min={0}
                      value={form.recyclingUsed}
                      onChange={(e) => update('recyclingUsed', Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-admin-text-muted mb-1">Total</label>
                    <input
                      type="number"
                      min={1}
                      value={form.recyclingTotal}
                      onChange={(e) => update('recyclingTotal', Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white border border-admin-border/30 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-admin-text-primary">Account Status</p>
                <p className="text-xs text-admin-text-secondary mt-0.5">Activate the user account immediately</p>
              </div>
              <button
                onClick={() => update('status', form.status === 'Active' ? 'Suspended' : 'Active')}
                className={`relative w-12 h-7 rounded-full transition-colors ${form.status === 'Active' ? 'bg-admin-brand' : 'bg-admin-border'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${form.status === 'Active' ? 'translate-x-5' : ''}`} />
              </button>
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
          <h1 className="text-xl font-bold text-admin-text-primary">Add User</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-5">
          <div className="bg-white border border-admin-border rounded-2xl p-5 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="e.g. Sara Al-Rashidi"
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="sara@example.com"
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => update('role', e.target.value)}
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none"
                >
                  <option value="User">User</option>
                  <option value="Premium">Premium</option>
                  <option value="Store Owner">Store Owner</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white border border-admin-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheck className="w-4 h-4 text-admin-brand" />
              <h3 className="text-xs font-bold text-admin-text-primary tracking-widest uppercase">Usage Quotas</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shirt className="w-3.5 h-3.5 text-brand-secondary" />
                  <span className="text-xs font-medium text-admin-text-secondary">Virtual Try-On</span>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[10px] text-admin-text-muted mb-1">Used</label>
                    <input type="number" min={0} value={form.tryOnUsed} onChange={(e) => update('tryOnUsed', Number(e.target.value))} className="w-full px-3 py-2.5 bg-admin-brand-bg border border-admin-border rounded-lg text-sm outline-none text-admin-text-primary" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-admin-text-muted mb-1">Total</label>
                    <input type="number" min={1} value={form.tryOnTotal} onChange={(e) => update('tryOnTotal', Number(e.target.value))} className="w-full px-3 py-2.5 bg-admin-brand-bg border border-admin-border rounded-lg text-sm outline-none text-admin-text-primary" />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-3.5 h-3.5 text-[#2B7FFF]" />
                  <span className="text-xs font-medium text-admin-text-secondary">Recycling</span>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[10px] text-admin-text-muted mb-1">Used</label>
                    <input type="number" min={0} value={form.recyclingUsed} onChange={(e) => update('recyclingUsed', Number(e.target.value))} className="w-full px-3 py-2.5 bg-admin-brand-bg border border-admin-border rounded-lg text-sm outline-none text-admin-text-primary" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-admin-text-muted mb-1">Total</label>
                    <input type="number" min={1} value={form.recyclingTotal} onChange={(e) => update('recyclingTotal', Number(e.target.value))} className="w-full px-3 py-2.5 bg-admin-brand-bg border border-admin-border rounded-lg text-sm outline-none text-admin-text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-admin-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-admin-text-primary">Account Status</p>
                <p className="text-xs text-admin-text-secondary">Activate the user account immediately</p>
              </div>
              <button
                onClick={() => update('status', form.status === 'Active' ? 'Suspended' : 'Active')}
                className={`relative w-12 h-7 rounded-full transition-colors ${form.status === 'Active' ? 'bg-admin-brand' : 'bg-admin-border'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${form.status === 'Active' ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 bg-white border-t border-admin-border/30">
          <button className="w-full flex items-center justify-center gap-2 py-4 bg-admin-brand text-white rounded-2xl text-base font-medium shadow-md hover:bg-admin-brand-light transition-colors">
            <UserPlus className="w-5 h-5" />
            Save & Create User
          </button>
        </div>
      </div>
    </>
  );
}
