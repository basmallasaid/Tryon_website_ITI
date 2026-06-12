import { useState } from 'react';
import { ArrowLeft, User, Store, Star, Shirt, RefreshCw, Minus, Plus } from 'lucide-react';
import AddIcon from '../../../icons/AddIcon';
import ShieldCheckIcon from '../../../icons/ShieldCheckIcon';

const roles = [
  { id: 'User', icon: User, title: 'User', description: 'Standard enterprise access with individual limits.' },
  { id: 'Store Owner', icon: Store, title: 'Store Owner', description: 'Management rights for a single store location.' },
  { id: 'Premium', icon: Star, title: 'Premium', description: 'Advanced tools and unlimited catalog syncing.' },
];

function Stepper({ value, onChange, min = 0 }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#C3C5D7] bg-white text-[#434654] hover:bg-[#FAF8FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-12 text-center text-xl font-semibold text-[#191B23]">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#C3C5D7] bg-white text-[#434654] hover:bg-[#FAF8FF] transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function AddUserSection({ onBack }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    employeeId: '',
    role: 'User',
    tryOnLimit: 25,
    recycleLimit: 10,
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

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
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="px-8 py-3 border border-[#C3C5D7] text-[#434654] rounded-xl text-sm font-bold hover:bg-[#FAF8FF] transition-colors">
              Cancel
            </button>
            <button className="flex items-center gap-2 px-8 py-3 bg-[#1550D3] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#1550D3]/90 transition-colors">
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* User Identity Card */}
          <div className="bg-white border border-[#C3C5D7]/30 rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <AddIcon className="w-5 h-5 text-[#1550D3]" />
              <h2 className="text-base text-[#191B23]">User Identity</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-base text-[#434654] mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="e.g. Alexander McQueen"
                  className="w-full pt-[13px] pb-[14px] px-4 bg-[#FAF8FF] border border-[#C3C5D7] rounded-lg text-base text-[#191B23] outline-none placeholder:text-[#6B7280] focus:border-[#1550D3] transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-base text-[#434654] mb-2">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="alexander@dolapy.com"
                    className="w-full pt-[13px] pb-[14px] px-4 bg-[#FAF8FF] border border-[#C3C5D7] rounded-lg text-base text-[#191B23] outline-none placeholder:text-[#6B7280] focus:border-[#1550D3] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-base text-[#434654] mb-2">Employee ID</label>
                  <input
                    type="text"
                    value={form.employeeId}
                    onChange={e => update('employeeId', e.target.value)}
                    placeholder="DLP-9921-X"
                    className="w-full pt-[13px] pb-[14px] px-4 bg-[#FAF8FF] border border-[#C3C5D7] rounded-lg text-base text-[#191B23] outline-none placeholder:text-[#6B7280] focus:border-[#1550D3] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Permissions & Limits Card */}
          <div className="bg-white border border-[#C3C5D7]/30 rounded-xl p-8 shadow-sm space-y-8">
            {/* Account Role */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-5 h-5 text-[#1550D3]"><ShieldCheckIcon className="w-5 h-5" /></div>
                <h2 className="text-xl font-medium text-[#191B23]">Account Role</h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {roles.map(role => {
                  const Icon = role.icon;
                  const selected = form.role === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => update('role', role.id)}
                      className={`relative flex items-center gap-4 text-left p-5 rounded-xl border transition-all ${
                        selected
                          ? 'border-[#1550D3] bg-[#FAF8FF] shadow-sm'
                          : 'border-[#C3C5D7] bg-white hover:border-[#1550D3]/40'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selected ? 'bg-[#1550D3] text-white' : 'bg-[#FAF8FF] text-[#434654]'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-semibold mb-1 ${selected ? 'text-[#1550D3]' : 'text-[#191B23]'}`}>{role.title}</h3>
                        <p className="text-xs text-[#434654] leading-relaxed">{role.description}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-[#1550D3]' : 'border-[#C3C5D7]'}`}>
                        {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#1550D3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-[#C3C5D7]/50" />

            {/* Usage Limits */}
            <div>
              <h2 className="text-xl font-medium text-[#191B23] mb-6">Usage Limits</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#FAF8FF] border border-[#C3C5D7] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Shirt className="w-4 h-4 text-[#1550D3]" />
                      <span className="text-sm font-medium text-[#191B23]">Try-On Limit</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#1550D3] bg-[#1550D3]/10 px-2 py-1 rounded-md tracking-wider">MONTHLY</span>
                  </div>
                  <Stepper value={form.tryOnLimit} onChange={v => update('tryOnLimit', v)} min={0} />
                  <p className="text-xs text-[#434654] mt-3">Maximum virtual fitting room sessions allowed.</p>
                </div>
                <div className="bg-[#FAF8FF] border border-[#C3C5D7] rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-[#1550D3]" />
                      <span className="text-sm font-medium text-[#191B23]">Recycle Limit</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#1550D3] bg-[#1550D3]/10 px-2 py-1 rounded-md tracking-wider">SUSTAINABILITY</span>
                  </div>
                  <Stepper value={form.recycleLimit} onChange={v => update('recycleLimit', v)} min={0} />
                  <p className="text-xs text-[#434654] mt-3">Garment recycling program participation cap.</p>
                </div>
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
          <h1 className="text-xl font-bold text-admin-text-primary">Add User</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#434654] mb-1.5 px-1">Full Name</label>
              <input type="text" value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Alexander McQueen" className="w-full px-4 py-3 bg-[#FAF8FF] border border-[#C3C5D7] rounded-lg text-sm text-[#191B23] outline-none placeholder:text-[#434654]/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#434654] mb-1.5 px-1">Email Address</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="alexander@dolapy.com" className="w-full px-4 py-3 bg-[#FAF8FF] border border-[#C3C5D7] rounded-lg text-sm text-[#191B23] outline-none placeholder:text-[#434654]/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#434654] mb-1.5 px-1">Employee ID</label>
              <input type="text" value={form.employeeId} onChange={e => update('employeeId', e.target.value)} placeholder="DLP-9921-X" className="w-full px-4 py-3 bg-[#FAF8FF] border border-[#C3C5D7] rounded-lg text-sm text-[#191B23] outline-none placeholder:text-[#434654]/50" />
            </div>
          </div>

          <h3 className="text-xs font-bold text-[#191B23] tracking-widest uppercase">Account Role</h3>
          <div className="space-y-3">
            {roles.map(role => {
              const Icon = role.icon;
              const selected = form.role === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => update('role', role.id)}
                  className={`w-full flex items-center gap-3 text-left p-4 rounded-xl border transition-all ${selected ? 'border-[#1550D3] bg-[#FAF8FF]' : 'border-[#C3C5D7] bg-white'}`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${selected ? 'bg-[#1550D3] text-white' : 'bg-[#FAF8FF] text-[#434654]'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-semibold ${selected ? 'text-[#1550D3]' : 'text-[#191B23]'}`}>{role.title}</span>
                    <p className="text-xs text-[#434654] mt-0.5">{role.description}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-[#1550D3]' : 'border-[#C3C5D7]'}`}>
                    {selected && <div className="w-2 h-2 rounded-full bg-[#1550D3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <h3 className="text-xs font-bold text-[#191B23] tracking-widest uppercase">Usage Limits</h3>
          <div className="space-y-4">
            <div className="bg-[#FAF8FF] border border-[#C3C5D7] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[#191B23]">Try-On Limit</span>
                <span className="text-[10px] font-bold text-[#1550D3] bg-[#1550D3]/10 px-2 py-1 rounded-md">MONTHLY</span>
              </div>
              <Stepper value={form.tryOnLimit} onChange={v => update('tryOnLimit', v)} min={0} />
              <p className="text-xs text-[#434654] mt-2">Maximum virtual fitting room sessions allowed.</p>
            </div>
            <div className="bg-[#FAF8FF] border border-[#C3C5D7] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[#191B23]">Recycle Limit</span>
                <span className="text-[10px] font-bold text-[#1550D3] bg-[#1550D3]/10 px-2 py-1 rounded-md">SUSTAINABILITY</span>
              </div>
              <Stepper value={form.recycleLimit} onChange={v => update('recycleLimit', v)} min={0} />
              <p className="text-xs text-[#434654] mt-2">Garment recycling program participation cap.</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 bg-white border-t border-admin-border/30">
          <button className="w-full flex items-center justify-center gap-2 py-4 bg-[#1550D3] text-white rounded-2xl text-base font-medium shadow-md hover:bg-[#1550D3]/90 transition-colors">
            <Plus className="w-5 h-5" />
            Add
          </button>
        </div>
      </div>
    </>
  );
}
