import { useState } from 'react';
import { ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import NotificationRow from '../components/NotificationRow';
import NotificationCard from '../components/NotificationCard';

const notifications = [
  {
    id: 1,
    title: 'New Order Received',
    message: 'A new order has been placed by John Doe for 3 items totaling $245.00.',
    type: 'Push',
    date: 'Mar 15, 2024',
    relativeTime: '2m ago',
    read: false,
  },
  {
    id: 2,
    title: 'Product Low Stock Alert',
    message: 'Classic Oxford Shirt in size M is running low. Only 5 units remaining in inventory.',
    type: 'In-App',
    date: 'Mar 15, 2024',
    relativeTime: '1h ago',
    read: false,
  },
  {
    id: 3,
    title: 'Promotion Campaign Active',
    message: 'Summer Sale 2024 promotion is now live. 25% off on all summer collection items.',
    type: 'Push',
    date: 'Mar 14, 2024',
    relativeTime: '3h ago',
    read: true,
  },
  {
    id: 4,
    title: 'Customer Review Posted',
    message: 'Sarah left a 5-star review on Premium Leather Jacket. "Amazing quality!"',
    type: 'In-App',
    date: 'Mar 13, 2024',
    relativeTime: 'yesterday',
    read: true,
  },
];

const ITEMS_PER_PAGE = 4;

export default function NotificationsSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = notifications.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-[28px] sm:text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">
          Notification Center
        </h1>
        <p className="text-sm text-admin-text-secondary mt-2">
          Your recent notifications for <span className="font-semibold text-admin-text-primary">Fashion Store</span>
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-admin-border/40 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-admin-border/40">
          <h2 className="text-sm font-bold text-admin-text-primary">Recent Notifications</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-admin-border/40">
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">Title</th>
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">Message</th>
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">Type</th>
              <th className="text-left text-[11px] font-bold text-admin-text-muted uppercase tracking-wider py-3 px-4">Created Date</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((n) => (
              <NotificationRow key={n.id} notification={n} />
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-4 border-t border-admin-border/40">
          <p className="text-xs text-admin-text-muted">
            Showing {startIdx + 1}-{Math.min(startIdx + ITEMS_PER_PAGE, notifications.length)} of {notifications.length} notifications
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-full border border-admin-border/40 flex items-center justify-center text-admin-text-muted hover:bg-admin-brand-activeBg/30 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-full border border-admin-border/40 flex items-center justify-center text-admin-text-muted hover:bg-admin-brand-activeBg/30 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-admin-brand text-white rounded-xl text-xs font-medium">
            <Bell className="w-4 h-4" /> Create New
          </button>
        </div>
        <div className="bg-white border border-admin-border/40 rounded-2xl overflow-hidden">
          {currentItems.map((n) => (
            <NotificationCard key={n.id} notification={n} />
          ))}
        </div>
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-xs text-admin-text-muted">
            Showing {startIdx + 1}-{Math.min(startIdx + ITEMS_PER_PAGE, notifications.length)} of {notifications.length} notifications
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-full border border-admin-border/40 flex items-center justify-center text-admin-text-muted disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-full border border-admin-border/40 flex items-center justify-center text-admin-text-muted disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
