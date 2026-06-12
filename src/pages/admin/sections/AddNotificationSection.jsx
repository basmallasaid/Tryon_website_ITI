import { useState } from 'react';
import { ArrowLeft, Upload, Calendar, ChevronDown, Send, Play, MoreVertical } from 'lucide-react';

export default function AddNotificationSection({ onBack }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [deepLinkPath, setDeepLinkPath] = useState('');
  const [audience, setAudience] = useState('All Users');
  const [scheduleTime, setScheduleTime] = useState('');
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block p-8">
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">Create New Notification</h1>
          <p className="text-sm text-admin-text-secondary mt-1">Configure and target your push notification to reach the right audience at the right time.</p>
        </div>

        <div className="space-y-6">
          {/* Notification Content Card */}
          <div className="bg-admin-brand-bg border border-admin-border/40 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-medium text-admin-text-primary mb-6">Notification Content</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-admin-text-primary mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New Summer Collection is here!"
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-primary mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe the notification content..."
                  rows={4}
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-primary mb-2">Image Upload (Dropzone)</label>
                <div className="border-2 border-dashed border-admin-border rounded-xl p-8 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 bg-admin-profile rounded-full flex items-center justify-center">
                    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.5 16C3.98333 16 2.6875 15.475 1.6125 14.425C0.5375 13.375 0 12.0917 0 10.575C0 9.275 0.391667 8.11667 1.175 7.1C1.95833 6.08333 2.98333 5.43333 4.25 5.15C4.66667 3.61667 5.5 2.375 6.75 1.425C8 0.475 9.41667 0 11 0C12.95 0 14.6042 0.679167 15.9625 2.0375C17.3208 3.39583 18 5.05 18 7C19.15 7.13333 20.1042 7.62917 20.8625 8.4875C21.6208 9.34583 22 10.35 22 11.5C22 12.75 21.5625 13.8125 20.6875 14.6875C19.8125 15.5625 18.75 16 17.5 16H12C11.45 16 10.9792 15.8042 10.5875 15.4125C10.1958 15.0208 10 14.55 10 14V8.85L8.4 10.4L7 9L11 5L15 9L13.6 10.4L12 8.85V14H17.5C18.2 14 18.7917 13.7583 19.275 13.275C19.7583 12.7917 20 12.2 20 11.5C20 10.8 19.7583 10.2083 19.275 9.725C18.7917 9.24167 18.2 9 17.5 9H16V7C16 5.61667 15.5125 4.4375 14.5375 3.4625C13.5625 2.4875 12.3833 2 11 2C9.61667 2 8.4375 2.4875 7.4625 3.4625C6.4875 4.4375 6 5.61667 6 7H5.5C4.53333 7 3.70833 7.34167 3.025 8.025C2.34167 8.70833 2 9.53333 2 10.5C2 11.4667 2.34167 12.2917 3.025 12.975C3.70833 13.6583 4.53333 14 5.5 14H8V16H5.5Z" fill="#434654"/>
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-admin-brand">Click to upload or drag and drop</p>
                  <p className="text-[10px] text-admin-text-muted">PNG, JPG or GIF (max. 2MB)</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-primary mb-2">Deep Link (URL)</label>
                <div className="flex">
                  <span className="flex items-center px-4 py-3 bg-admin-profile border border-r-0 border-admin-border rounded-l-lg text-sm text-admin-text-secondary">dolapy://</span>
                  <input
                    type="text"
                    value={deepLinkPath}
                    onChange={(e) => setDeepLinkPath(e.target.value)}
                    placeholder="app/collection/summer-2024"
                    className="flex-1 px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-r-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Targeting & Schedule Card */}
          <div className="bg-admin-brand-bg border border-admin-border/40 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-medium text-admin-text-primary mb-6">Targeting & Schedule</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-admin-text-primary mb-2">Audience Selection</label>
                <div className="relative">
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none appearance-none cursor-pointer focus:border-admin-brand transition-colors"
                  >
                    <option>All Users</option>
                    <option>Active Users</option>
                    <option>New Users</option>
                    <option>Premium Users</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-primary mb-2">Schedule Time</label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-4 py-3 pl-10 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-brand transition-colors"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-4 pb-12">
            <button onClick={onBack} className="px-6 py-3 text-sm font-medium text-admin-text-primary rounded-xl hover:bg-admin-border/20 transition-colors">
              Cancel
            </button>
            <button className="px-8 py-3 border-2 border-admin-brand text-admin-brand rounded-xl text-sm font-bold hover:bg-admin-brand/5 transition-colors">
              Schedule
            </button>
            <button className="px-8 py-3 bg-admin-brand text-white rounded-xl text-sm font-bold shadow-md hover:bg-admin-brand-light transition-colors">
              Send Now
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden min-h-screen bg-white pb-24">
        <div className="sticky top-0 z-10 bg-white border-b border-admin-border/30">
          <div className="flex items-center justify-between px-4 py-4">
            <button onClick={onBack} className="p-1">
              <ArrowLeft className="w-5 h-5 text-admin-text-primary" />
            </button>
            <h1 className="text-lg font-bold text-admin-text-primary">Add Notification</h1>
            <button className="p-1">
              <MoreVertical className="w-5 h-5 text-admin-text-primary" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Content Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 text-admin-brand">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <span className="text-xs font-bold text-admin-brand tracking-wider">CONTENT DETAILS</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-admin-text-primary mb-2">Notification Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New Seasonal Collection Drop"
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-primary mb-2">Message Body</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter the main message users will see..."
                  rows={4}
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-primary mb-2">Deep Link (URL)</label>
                <div className="flex">
                  <span className="flex items-center px-4 py-3 bg-admin-profile border border-r-0 border-admin-border rounded-l-lg text-sm text-admin-text-secondary">dolapy://</span>
                  <input
                    type="text"
                    value={deepLinkPath}
                    onChange={(e) => setDeepLinkPath(e.target.value)}
                    placeholder="app/collection/summer-2024"
                    className="flex-1 px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-r-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Targeting & Schedule */}
          <div className="bg-admin-brand-bg border border-admin-border/40 rounded-xl p-4">
            <h2 className="text-lg font-medium text-admin-text-primary mb-4">Targeting & Schedule</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-admin-text-primary mb-2">Audience Selection</label>
                <div className="relative">
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none appearance-none cursor-pointer focus:border-admin-brand transition-colors"
                  >
                    <option>All Users</option>
                    <option>Active Users</option>
                    <option>New Users</option>
                    <option>Premium Users</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-primary mb-2">Schedule Time</label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-4 py-3 pl-10 bg-white border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-brand transition-colors"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-admin-text-muted pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-admin-border/30">
          <button className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-admin-brand text-white rounded-xl text-sm font-bold shadow-md hover:bg-admin-brand-light transition-colors">
            <Play className="w-4 h-4" /> Create Notification
          </button>
        </div>
      </div>
    </>
  );
}
