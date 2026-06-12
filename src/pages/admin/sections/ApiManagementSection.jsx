import { Shield, RefreshCw, Image, Shirt, BarChart3, User, Plus } from 'lucide-react';
import ApiKeyCard from '../components/ApiKeyCard';

const apiKeys = [
  {
    id: 1,
    name: 'Recycle Analysis Model',
    icon: RefreshCw,
    iconBg: 'bg-admin-profile',
    iconColor: 'text-admin-brand',
    status: 'Active',
    maskedKey: 'r8_xTpQ2••••••••',
  },
  {
    id: 2,
    name: 'Recycle Image Generation',
    icon: Image,
    iconBg: 'bg-accent-orange/10',
    iconColor: 'text-accent-orange',
    status: 'Active',
    maskedKey: 'AIzaSyBx••••••',
  },
  {
    id: 3,
    name: 'Try On Image Generation',
    icon: Shirt,
    iconBg: 'bg-accent-orange/10',
    iconColor: 'text-accent-orange',
    status: 'Active',
    maskedKey: 'AIzaSyBx••••••',
  },
  {
    id: 4,
    name: 'Try On Analysis Model',
    icon: BarChart3,
    iconBg: 'bg-accent-orange/10',
    iconColor: 'text-accent-orange',
    status: 'Active',
    maskedKey: 'AIzaSyBx••••••',
  },
  {
    id: 5,
    name: 'Avatar Generation Model',
    icon: User,
    iconBg: 'bg-accent-orange/10',
    iconColor: 'text-accent-orange',
    status: 'Active',
    maskedKey: 'AIzaSyBx••••••',
  },
];

function SecurityNoticeCard() {
  return (
    <div className="flex items-start gap-3 bg-[#EDEEF0] rounded-xl p-4">
      <div className="w-10 h-10 flex items-center justify-center shrink-0">
        <Shield className="w-5 h-5 text-brand-secondary" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-admin-text-primary">API keys are encrypted at rest</h3>
        <p className="text-xs text-admin-text-secondary mt-1 leading-5">
          Only partial keys are displayed. Copy the full key from the secure vault. Rotate keys every 90 days for security.
        </p>
      </div>
    </div>
  );
}

export default function ApiManagementSection() {
  // TODO: Replace mock handlers with actual API integration
  const handleAddKey = () => {
    // TODO: Open add key modal/dialog
  };

  const handleEdit = (id) => {
    // TODO: Navigate to key edit view or open edit modal
  };

  const handleDelete = (id) => {
    // TODO: Show confirmation dialog and delete key
  };

  const handleView = (id) => {
    // TODO: Fetch full key from secure vault and display
  };

  const handleCopy = (id, key) => {
    // TODO: Copy full key to clipboard after fetching from vault
    navigator.clipboard.writeText(key);
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block">
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">API Key Management</h1>
          <p className="text-sm text-admin-text-secondary mt-1">{apiKeys.length} active keys</p>
        </div>

        <SecurityNoticeCard />

        <div className="flex flex-col gap-3 mt-6">
          {apiKeys.map((key) => (
            <ApiKeyCard
              key={key.id}
              {...key}
              onEdit={() => handleEdit(key.id)}
              onDelete={() => handleDelete(key.id)}
              onView={() => handleView(key.id)}
              onCopy={() => handleCopy(key.id, key.maskedKey)}
            />
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden px-4 py-6 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary tracking-[-0.64px]">API Key Management</h1>
          <p className="text-sm text-admin-text-secondary mt-1">{apiKeys.length} active keys</p>
        </div>

        <SecurityNoticeCard />

        <div className="flex flex-col gap-3">
          {apiKeys.map((key) => (
            <ApiKeyCard
              key={key.id}
              {...key}
              onEdit={() => handleEdit(key.id)}
              onDelete={() => handleDelete(key.id)}
              onView={() => handleView(key.id)}
              onCopy={() => handleCopy(key.id, key.maskedKey)}
            />
          ))}
        </div>

        <button
          onClick={handleAddKey}
          className="lg:hidden fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-admin-brand text-white shadow-lg flex items-center justify-center hover:bg-admin-brand-light transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}
