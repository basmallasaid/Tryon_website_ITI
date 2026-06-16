import { useState, useEffect } from 'react';
import { ArrowLeft, Zap, Bell, Mail, Smartphone, Save } from 'lucide-react';
import { getAutomatedNotificationsApi, updateAutomatedNotificationApi } from '../../../api/adminApi';
import adminI18n from '../../../i18n/admin/adminI18n';

const OPERATIONS = ['tryon', 'recycle', 'matching'];

const OP_ICONS = { tryon: '👔', recycle: '♻️', matching: '🎨' };

function Toggle({ checked, onChange }) {
  return (
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-admin-brand' : 'bg-admin-border/60'}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${checked ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

export default function AutomatedNotificationsSection({ onBack }) {
  const { t } = adminI18n;
  const [rules, setRules] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await getAutomatedNotificationsApi();
        const map = {};
        (Array.isArray(res.data) ? res.data : res.data.rules || []).forEach((r) => { map[r.operation] = r; });
        setRules(map);
      } catch (err) {
        console.error('Failed to load automated notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, []);

  const updateRule = (operation, field, value) => {
    setRules((prev) => ({
      ...prev,
      [operation]: { ...prev[operation], [field]: value },
    }));
  };

  const toggleChannel = (operation, channel) => {
    setRules((prev) => {
      const rule = prev[operation] || {};
      const channels = { ...rule.channels, [channel]: !rule.channels?.[channel] };
      return { ...prev, [operation]: { ...rule, channels } };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const op of OPERATIONS) {
        if (rules[op]) {
          await updateAutomatedNotificationApi(op, rules[op]);
        }
      }
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2000);
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(false);
    }
  };

  const opLabel = (op) => {
    const key = `admin.automatedNotifications.${op === 'tryon' ? 'tryOn' : op}`;
    return t(key);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-admin-border/20 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-admin-text-primary" />
          </button>
          <h1 className="text-2xl sm:text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">{t('admin.automatedNotifications.title')}</h1>
        </div>
        <p className="text-sm text-admin-text-muted py-16 text-center">{t('admin.automatedNotifications.loading')}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-[1000px] mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={onBack} className="p-2 hover:bg-admin-border/20 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-admin-text-primary" />
        </button>
        <h1 className="text-2xl sm:text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">{t('admin.automatedNotifications.title')}</h1>
      </div>
      <p className="text-sm text-admin-text-secondary mt-1 mb-8 ml-12">{t('admin.automatedNotifications.description')}</p>

      <div className="flex flex-col gap-4 sm:gap-6">
        {OPERATIONS.map((op) => {
          const rule = rules[op] || {};
          return (
            <div key={op} className="bg-surface-elevated border border-admin-border/40 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{OP_ICONS[op]}</span>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-admin-text-primary">{opLabel(op)}</h3>
                    <p className="text-[11px] text-admin-text-muted">
                      {rule.enabled ? t('admin.automatedNotifications.enabled') : t('admin.automatedNotifications.disabled')}
                    </p>
                  </div>
                </div>
                <Toggle checked={rule.enabled !== false} onChange={() => updateRule(op, 'enabled', !rule.enabled)} />
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-medium text-admin-text-secondary mb-1.5">{t('admin.automatedNotifications.titleTemplate')}</label>
                  <input
                    type="text"
                    value={rule.titleTemplate || ''}
                    onChange={(e) => updateRule(op, 'titleTemplate', e.target.value)}
                    className="w-full px-3 py-2 bg-admin-brand-activeBg/30 border border-admin-border/40 rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-brand transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-admin-text-secondary mb-1.5">{t('admin.automatedNotifications.bodyTemplate')}</label>
                  <textarea
                    value={rule.bodyTemplate || ''}
                    onChange={(e) => updateRule(op, 'bodyTemplate', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-admin-brand-activeBg/30 border border-admin-border/40 rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-brand transition-colors resize-none"
                  />
                  <p className="text-[10px] text-admin-text-muted mt-1">{t('admin.automatedNotifications.placeholders')}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-admin-text-secondary mb-2">{t('admin.automatedNotifications.channels')}</label>
                  <div className="flex gap-3">
                    {[
                      { key: 'app', icon: Smartphone, label: t('admin.automatedNotifications.app') },
                      { key: 'email', icon: Mail, label: t('admin.automatedNotifications.email') },
                      { key: 'push', icon: Bell, label: t('admin.automatedNotifications.push') },
                    ].map(({ key, icon: Icon, label }) => (
                      <button
                        key={key}
                        onClick={() => toggleChannel(op, key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          rule.channels?.[key]
                            ? 'bg-admin-brand/10 text-admin-brand border border-admin-brand/30'
                            : 'bg-admin-brand-activeBg/30 text-admin-text-muted border border-admin-border/30'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-0 mt-6 flex items-center justify-end gap-3 px-4 py-3 bg-admin-page/80 backdrop-blur-sm rounded-2xl">
        {savedMsg && <span className="text-sm text-admin-success font-medium mr-auto">{t('admin.automatedNotifications.saved')}</span>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 text-sm text-white bg-admin-brand rounded-xl shadow-sm hover:bg-admin-brand-light transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? t('admin.common.loading') : t('admin.automatedNotifications.save')}
        </button>
      </div>
    </div>
  );
}
