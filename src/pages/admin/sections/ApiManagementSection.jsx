import { useState, useEffect, useCallback } from 'react';
import { Shield, RefreshCw, Image, Shirt, BarChart3, User, Copy, Check, AlertTriangle, X } from 'lucide-react';
import EditIcon from '../../../icons/EditIcon';
import { getApiKeysApi, getApiKeyByIdApi, updateApiKeyApi, deleteApiKeyApi } from '../../../api/adminApi';
import { useAdminTranslation } from '../../../i18n/admin/useAdminTranslation';

const serviceIcons = {
  'Recycle Analysis Model': { icon: RefreshCw, iconBg: 'bg-admin-profile', iconColor: 'text-admin-brand' },
  'Recycle Image Generation': { icon: Image, iconBg: 'bg-accent-orange/10', iconColor: 'text-accent-orange' },
  'Try On Image Generation': { icon: Shirt, iconBg: 'bg-accent-orange/10', iconColor: 'text-accent-orange' },
  'Try On Analysis Model': { icon: BarChart3, iconBg: 'bg-accent-orange/10', iconColor: 'text-accent-orange' },
  'Avatar Generation Model': { icon: User, iconBg: 'bg-accent-orange/10', iconColor: 'text-accent-orange' },
};

function getStatusColor(status) {
  if (status === 'Active') return 'bg-admin-success/10 text-admin-success';
  if (status === 'Inactive') return 'bg-admin-danger/10 text-admin-danger';
  return 'bg-admin-border/20 text-admin-text-muted';
}

function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel, danger }) {
  const { t } = useAdminTranslation();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-admin-surface rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? 'bg-red-100' : 'bg-amber-100'}`}>
          <AlertTriangle className={`w-6 h-6 ${danger ? 'text-red-600' : 'text-amber-600'}`} />
        </div>
        <h3 className="text-lg font-bold text-admin-text-primary text-center">{title}</h3>
        <p className="text-sm text-admin-text-secondary text-center mt-2">{message}</p>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-admin-border rounded-xl text-sm font-medium text-admin-text-primary hover:bg-admin-brand-bg transition-colors">
            {t('admin.apiManagement.cancel')}
          </button>
          <button onClick={onConfirm} className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-admin-brand hover:bg-admin-brand-light'}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function EditDialog({ open, apiKey, onSave, onCancel }) {
  const { t } = useAdminTranslation();
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    if (apiKey) {
      setName(apiKey.name);
      setKey('');
      setStatus(apiKey.status);
    }
  }, [apiKey]);

  if (!open || !apiKey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-admin-surface rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-admin-text-primary">{t('admin.apiManagement.editKey')}</h3>
          <button onClick={onCancel} className="p-1 rounded-lg hover:bg-admin-border/20 transition-colors">
            <X className="w-5 h-5 text-admin-text-muted" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-admin-text-primary mb-1.5">{t('admin.apiManagement.name')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-admin-input border border-admin-border/40 rounded-xl text-sm text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-brand/30 focus:border-admin-brand transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text-primary mb-1.5">{t('admin.apiManagement.apiKey')}</label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={t('admin.apiManagement.keepCurrentKey')}
              className="w-full px-4 py-2.5 bg-admin-input border border-admin-border/40 rounded-xl text-sm text-admin-text-primary placeholder:text-admin-text-muted/50 focus:outline-none focus:ring-2 focus:ring-admin-brand/30 focus:border-admin-brand transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-text-primary mb-1.5">{t('admin.apiManagement.status')}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-admin-input border border-admin-border/40 rounded-xl text-sm text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-brand/30 focus:border-admin-brand transition-colors"
            >
              <option value="Active">{t('admin.apiManagement.active')}</option>
              <option value="Inactive">{t('admin.apiManagement.inactive')}</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-admin-border rounded-xl text-sm font-medium text-admin-text-primary hover:bg-admin-brand-bg transition-colors">
            {t('admin.apiManagement.cancel')}
          </button>
          <button onClick={() => onSave(apiKey._id, { name, ...(key && { key }), status })} className="flex-1 py-2.5 bg-admin-brand text-white rounded-xl text-sm font-medium hover:bg-admin-brand-light transition-colors">
            {t('admin.apiManagement.saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );
}

function ApiKeyRow({ api, onCopy, copiedId, onEdit, onDelete }) {
  const { t } = useAdminTranslation();
  const svc = serviceIcons[api.service] || { icon: Shield, iconBg: 'bg-admin-profile', iconColor: 'text-admin-text-secondary' };
  const Icon = svc.icon;

  return (
    <div className="bg-admin-surface rounded-xl border border-admin-border/40 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${svc.iconBg}`}>
            <Icon className={`w-5 h-5 ${svc.iconColor}`} />
          </div>
          <span className="text-sm font-medium text-admin-text-primary truncate">{api.name}</span>
          <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full shrink-0 ${getStatusColor(api.status)}`}>
            {api.status}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <button onClick={() => onEdit(api)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-admin-brand-activeBg transition-colors text-admin-text-secondary" title={t('admin.apiManagement.editTooltip')}>
            <EditIcon className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(api)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-admin-brand-activeBg transition-colors text-admin-text-secondary" title={t('admin.apiManagement.deleteTooltip')}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>
      </div>
      <div className="flex items-center justify-between bg-admin-input rounded-xl px-4 py-2.5">
        <span className="text-sm font-mono tracking-wider text-admin-text-secondary">{api.maskedKey}</span>
        <button onClick={() => onCopy(api)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-admin-brand-activeBg transition-colors text-admin-text-secondary" title={t('admin.apiManagement.copyTooltip')}>
          {copiedId === api._id ? <Check className="w-4 h-4 text-admin-success" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function SecurityNoticeCard() {
  const { t } = useAdminTranslation();
  return (
    <div className="flex items-start gap-3 bg-[#EDEEF0] rounded-xl p-4">
      <div className="w-10 h-10 flex items-center justify-center shrink-0">
        <Shield className="w-5 h-5 text-brand-secondary" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-admin-text-primary">{t('admin.apiManagement.encryptedNotice')}</h3>
        <p className="text-xs text-admin-text-secondary mt-1 leading-5">
          {t('admin.apiManagement.encryptedDesc')}
        </p>
      </div>
    </div>
  );
}

export default function ApiManagementSection() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const { t } = useAdminTranslation();

  const fetchKeys = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getApiKeysApi();
      setApiKeys(res.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  const handleCopy = async (api) => {
    try {
      const res = await getApiKeyByIdApi(api._id);
      await navigator.clipboard.writeText(res.data.key);
      setCopiedId(api._id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // silent
    }
  };

  const handleEditSave = async (id, data) => {
    try {
      await updateApiKeyApi(id, data);
      setEditItem(null);
      fetchKeys();
    } catch {
      // silent
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;
    try {
      await deleteApiKeyApi(deleteItem._id);
      setDeleteItem(null);
      fetchKeys();
    } catch {
      // silent
    }
  };

  const activeCount = apiKeys.filter((k) => k.status === 'Active').length;

  return (
    <>
      <ConfirmDialog
        open={!!deleteItem}
        title={t('admin.apiManagement.deleteKey')}
        message={t('admin.apiManagement.deleteKeyConfirm', { name: deleteItem?.name })}
        confirmLabel={t('admin.apiManagement.delete')}
        danger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteItem(null)}
      />

      <EditDialog
        open={!!editItem}
        apiKey={editItem}
        onSave={handleEditSave}
        onCancel={() => setEditItem(null)}
      />

      {/* Desktop */}
      <div className="hidden lg:block pb-8">
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">{t('admin.apiManagement.title')}</h1>
          <p className="text-sm text-admin-text-secondary mt-1">{t('admin.apiManagement.activeKeys', { count: activeCount })}</p>
        </div>

        <SecurityNoticeCard />

        {loading ? (
          <div className="flex items-center justify-center py-16 text-admin-text-muted text-sm">{t('admin.apiManagement.loading')}</div>
        ) : apiKeys.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-admin-text-muted text-sm">{t('admin.apiManagement.noKeys')}</div>
        ) : (
          <div className="flex flex-col gap-3 mt-6">
            {apiKeys.map((api) => (
              <ApiKeyRow
                key={api._id}
                api={api}
                onCopy={handleCopy}
                copiedId={copiedId}
                onEdit={setEditItem}
                onDelete={setDeleteItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile */}
      <div className="lg:hidden px-4 py-6 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary tracking-[-0.64px]">{t('admin.apiManagement.title')}</h1>
          <p className="text-sm text-admin-text-secondary mt-1">{t('admin.apiManagement.activeKeys', { count: activeCount })}</p>
        </div>

        <SecurityNoticeCard />

        {loading ? (
          <div className="flex items-center justify-center py-16 text-admin-text-muted text-sm">{t('admin.apiManagement.loading')}</div>
        ) : apiKeys.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-admin-text-muted text-sm">{t('admin.apiManagement.noKeys')}</div>
        ) : (
          <div className="flex flex-col gap-3">
            {apiKeys.map((api) => (
              <ApiKeyRow
                key={api._id}
                api={api}
                onCopy={handleCopy}
                copiedId={copiedId}
                onEdit={setEditItem}
                onDelete={setDeleteItem}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
