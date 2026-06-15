import { useState } from 'react';
import { ArrowLeft, User, Store, Star, Shirt, RefreshCw, Minus, Plus, CheckCircle } from 'lucide-react';
import { createAdminUserApi, updateUserApi } from '../../../api/adminApi';
import AddIcon from '../../../icons/AddIcon';
import ShieldCheckIcon from '../../../icons/ShieldCheckIcon';

const roles = [
  { id: 'user', icon: User, title: 'User', description: 'Standard enterprise access with individual limits.' },
  { id: 'admin', icon: Star, title: 'Admin', description: 'Full access to dashboard and all management tools.' },
  { id: 'premium', icon: Store, title: 'Premium', description: 'Advanced tools and unlimited catalog syncing.' },
];

export default function AddUserSection({ onBack, editingUser }) {
  const isEditing = !!editingUser;
  const [form, setForm] = useState({
    firstName: editingUser?.profile?.first_name || '',
    lastName: editingUser?.profile?.last_name || '',
    email: editingUser?.email || '',
    password: '',
    role: editingUser?.role || 'user',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.email.trim()) {
      alert('Email is required.');
      return;
    }
    if (!isEditing && !form.password.trim()) {
      alert('Password is required.');
      return;
    }
    if (isEditing && form.password.trim() && form.password.trim().length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      if (isEditing) {
        const payload = {
          email: form.email.trim(),
          first_name: form.firstName.trim() || null,
          last_name: form.lastName.trim() || null,
          role: form.role,
        };
        if (form.password.trim()) {
          payload.password = form.password.trim();
        }
        await updateUserApi(editingUser.id, payload);
      } else {
        await createAdminUserApi({
          email: form.email.trim(),
          password: form.password,
          first_name: form.firstName.trim() || null,
          last_name: form.lastName.trim() || null,
          role: form.role,
        });
      }
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} user.`);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <div className="hidden lg:flex items-center justify-center min-h-screen p-8">
          <div className="text-center max-w-md">
            <CheckCircle className="w-16 h-16 text-admin-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-admin-text-primary mb-2">{isEditing ? 'User Updated!' : 'User Created!'}</h2>
            <p className="text-sm text-admin-text-secondary mb-6">{form.email} has been {isEditing ? 'updated' : 'added'}.</p>
            <button onClick={onBack} className="px-6 py-3 bg-admin-brand text-white rounded-xl text-sm font-medium hover:bg-admin-brand-light transition-colors">
              Back to Users
            </button>
          </div>
        </div>
        <div className="lg:hidden flex items-center justify-center min-h-screen p-8">
          <div className="text-center max-w-md">
            <CheckCircle className="w-16 h-16 text-admin-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-admin-text-primary mb-2">{isEditing ? 'User Updated!' : 'User Created!'}</h2>
            <p className="text-sm text-admin-text-secondary mb-6">{form.email} has been {isEditing ? 'updated' : 'added'}.</p>
            <button onClick={onBack} className="px-6 py-3 bg-admin-brand text-white rounded-xl text-sm font-medium hover:bg-admin-brand-light transition-colors">
              Back to Users
            </button>
          </div>
        </div>
      </>
    );
  }

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
              <h1 className="text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">{isEditing ? 'Edit User' : 'Add New User'}</h1>
              <p className="text-sm text-admin-text-secondary mt-1">{isEditing ? 'Update user account details and permissions.' : 'Create a new user account and assign access permissions.'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="px-8 py-3 border border-admin-border text-admin-text-secondary rounded-xl text-sm font-bold hover:bg-admin-brand-bg transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !form.email.trim() || (!isEditing && !form.password.trim())}
              className="flex items-center gap-2 px-8 py-3 bg-admin-brand text-white rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition-colors disabled:opacity-50"
            >
              {submitting ? (isEditing ? 'Updating…' : 'Creating…') : (isEditing ? 'Update User' : 'Add User')}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* User Identity Card */}
          <div className="bg-surface-elevated border border-admin-border/30 rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <AddIcon className="w-5 h-5 text-admin-brand" />
              <h2 className="text-base text-admin-text-primary">User Identity</h2>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-base text-admin-text-secondary mb-2">First Name</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={e => update('firstName', e.target.value)}
                    placeholder="Alexander"
                    className="w-full pt-[13px] pb-[14px] px-4 bg-admin-brand-bg border border-admin-border rounded-lg text-base text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-base text-admin-text-secondary mb-2">Last Name</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={e => update('lastName', e.target.value)}
                    placeholder="McQueen"
                    className="w-full pt-[13px] pb-[14px] px-4 bg-admin-brand-bg border border-admin-border rounded-lg text-base text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-base text-admin-text-secondary mb-2">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="alexander@dolapy.com"
                  className="w-full pt-[13px] pb-[14px] px-4 bg-admin-brand-bg border border-admin-border rounded-lg text-base text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-base text-admin-text-secondary mb-2">
                  Password {isEditing ? '(leave blank to keep current)' : '*'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder={isEditing ? 'Min 6 characters (optional)' : 'Min 6 characters'}
                  className="w-full pt-[13px] pb-[14px] px-4 bg-admin-brand-bg border border-admin-border rounded-lg text-base text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Account Role */}
          <div className="bg-surface-elevated border border-admin-border/30 rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-5 h-5 text-admin-brand"><ShieldCheckIcon className="w-5 h-5" /></div>
              <h2 className="text-xl font-medium text-admin-text-primary">Account Role</h2>
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
                        ? 'border-admin-brand bg-admin-brand-bg shadow-sm'
                        : 'border-admin-border bg-surface-elevated hover:border-admin-brand/40'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selected ? 'bg-admin-brand text-white' : 'bg-admin-brand-bg text-admin-text-secondary'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-semibold mb-1 ${selected ? 'text-admin-brand' : 'text-admin-text-primary'}`}>{role.title}</h3>
                      <p className="text-xs text-admin-text-secondary leading-relaxed">{role.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-admin-brand' : 'border-admin-border'}`}>
                      {selected && <div className="w-2.5 h-2.5 rounded-full bg-admin-brand" />}
                    </div>
                  </button>
                );
              })}
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
          <h1 className="text-xl font-bold text-admin-text-primary">{isEditing ? 'Edit User' : 'Add User'}</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-5">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">First Name</label>
                <input type="text" value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="Alexander" className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-secondary/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Last Name</label>
                <input type="text" value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="McQueen" className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-secondary/50" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">Email Address *</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="alexander@dolapy.com" className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-secondary/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-admin-text-secondary mb-1.5 px-1">
                Password {isEditing ? '(leave blank to keep current)' : '*'}
              </label>
              <input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder={isEditing ? 'Min 6 characters (optional)' : 'Min 6 characters'} className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-secondary/50" />
            </div>
          </div>

          <h3 className="text-xs font-bold text-admin-text-primary tracking-widest uppercase">Account Role</h3>
          <div className="space-y-3">
            {roles.map(role => {
              const Icon = role.icon;
              const selected = form.role === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => update('role', role.id)}
                  className={`w-full flex items-center gap-3 text-left p-4 rounded-xl border transition-all ${selected ? 'border-admin-brand bg-admin-brand-bg' : 'border-admin-border bg-surface-elevated'}`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${selected ? 'bg-admin-brand text-white' : 'bg-admin-brand-bg text-admin-text-secondary'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm font-semibold ${selected ? 'text-admin-brand' : 'text-admin-text-primary'}`}>{role.title}</span>
                    <p className="text-xs text-admin-text-secondary mt-0.5">{role.description}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-admin-brand' : 'border-admin-border'}`}>
                    {selected && <div className="w-2 h-2 rounded-full bg-admin-brand" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 py-4 bg-surface-elevated border-t border-admin-border/30">
          <button
            onClick={handleSubmit}
            disabled={submitting || !form.email.trim() || (!isEditing && !form.password.trim())}
            className="w-full flex items-center justify-center gap-2 py-4 bg-admin-brand text-white rounded-2xl text-base font-medium shadow-md hover:opacity-90 transition-colors disabled:opacity-50"
          >
            {submitting ? (isEditing ? 'Updating…' : 'Creating…') : (isEditing ? 'Update User' : 'Add User')}
          </button>
        </div>
      </div>
    </>
  );
}
