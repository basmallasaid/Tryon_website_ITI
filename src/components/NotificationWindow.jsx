import { useState, useEffect, useRef } from "react";
import { X, Trash2, Bell, ChevronDown, ChevronUp } from "lucide-react";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../api/notificationApi";

const NotificationWindow = ({ isArabic, onClose, onUnreadChange, isMobile }) => {
  const [notifications, setNotifications] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const windowRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications);
      onUnreadChange?.(data.unreadCount);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (windowRef.current && !windowRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClearAll = async () => {
    try {
      await clearAllNotifications();
      setNotifications([]);
      setExpandedId(null);
      onUnreadChange?.(0);
    } catch (err) {
      console.error("Failed to clear notifications:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      const removed = notifications.find((n) => n._id === id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (expandedId === id) setExpandedId(null);
      if (removed && !removed.read) {
        onUnreadChange?.(unreadCount - 1);
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleToggleExpand = async (notif) => {
    setExpandedId((prev) => (prev === notif._id ? null : notif._id));

    if (!notif.read) {
      try {
        await markAsRead(notif._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
        );
        onUnreadChange?.(unreadCount - 1);
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  const formatTime = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      ref={windowRef}
      onMouseDown={(e) => e.stopPropagation()}
      className={`${
        isMobile
          ? "relative w-full min-[641px]:w-[380px] max-h-[70vh] min-[641px]:max-h-[520px]"
          : "absolute top-full mt-4 w-[380px] max-w-[calc(100vw-2rem)] max-h-[520px]"
      } bg-surface-elevated rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-[var(--border)] z-[100] animate-fadeInScale flex flex-col overflow-hidden ${
        !isMobile ? (isArabic ? "left-0" : "right-0 max-[480px]:-right-2") : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-brand-secondary" />
          <h3 className="text-base font-bold text-text-primary">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="text-xs font-bold bg-accent-pink text-white px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs font-bold text-accent-pink hover:opacity-80 transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-[var(--accent-light)]"
            >
              Clear all
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--bg-secondary)] text-text-disabled hover:text-text-secondary transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-disabled">
            <Bell size={40} className="mb-3 opacity-30 animate-pulse" />
            <p className="text-sm font-bold">Loading...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-disabled">
            <Bell size={40} className="mb-3 opacity-30" />
            <p className="text-sm font-bold">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className={`border-b border-[var(--border)] transition-colors ${
                !notif.read ? "bg-brand-secondary/5" : "hover:bg-[var(--bg-secondary)]"
              }`}
            >
              <div
                className="flex items-start gap-3 px-5 py-3.5 cursor-pointer"
                onClick={() => handleToggleExpand(notif)}
              >
                {/* Unread dot */}
                <div className="mt-1.5 flex-shrink-0">
                  {!notif.read ? (
                    <span className="block w-2.5 h-2.5 bg-brand-secondary rounded-full" />
                  ) : (
                    <span className="block w-2.5 h-2.5" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`text-sm truncate ${
                        !notif.read
                          ? "font-black text-text-primary"
                          : "font-bold text-text-secondary"
                      }`}
                    >
                      {notif.title}
                    </p>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notif._id);
                        }}
                        className="p-1 rounded-md text-text-disabled hover:text-accent-orange transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                      {expandedId === notif._id ? (
                        <ChevronUp size={14} className="text-text-disabled" />
                      ) : (
                        <ChevronDown size={14} className="text-text-disabled" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-text-disabled font-medium mt-0.5">
                    {formatTime(notif.createdAt)}
                  </p>
                  {/* Expanded body */}
                  {expandedId === notif._id && (
                    <p className="text-sm text-text-secondary mt-2 leading-relaxed animate-fadeInScale">
                      {notif.body}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationWindow;
