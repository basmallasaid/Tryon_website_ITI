import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, ChevronDown, Send, CheckCircle, Users, User, Mail, Smartphone, Globe, Clock } from 'lucide-react';
import { broadcastNotificationApi, sendToUserNotificationApi, getUsersApi } from '../../../api/adminApi';

const CHANNELS = [
  { id: 'app', label: 'In-App', icon: Smartphone, desc: 'Show inside the app' },
  { id: 'email', label: 'Email', icon: Mail, desc: 'Send via email' },
  { id: 'website', label: 'Push', icon: Globe, desc: 'Browser push notification' },
];

function TargetSection({ sendMode, setSendMode, emailSearch, setEmailSearch, targetEmail, setTargetEmail, showDropdown, setShowDropdown, filteredUsers }) {
  const handleSelect = (email) => {
    setTargetEmail(email);
    setEmailSearch('');
    setShowDropdown(false);
  };

  return (
    <div className="bg-admin-brand-bg border border-admin-border/40 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-medium text-admin-text-primary mb-6">Target</h2>

      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => { setSendMode('broadcast'); setEmailSearch(''); setTargetEmail(''); }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            sendMode === 'broadcast' ? 'bg-admin-brand text-white' : 'bg-admin-border/20 text-admin-text-secondary hover:bg-admin-border/40'
          }`}
        >
          <Users className="w-4 h-4" /> Broadcast to All
        </button>
        <button
          onClick={() => setSendMode('individual')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            sendMode === 'individual' ? 'bg-admin-brand text-white' : 'bg-admin-border/20 text-admin-text-secondary hover:bg-admin-border/40'
          }`}
        >
          <User className="w-4 h-4" /> Individual User
        </button>
      </div>

      {sendMode === 'individual' && (
        <div className="relative">
          <label className="block text-xs font-medium text-admin-text-primary mb-2">User Email *</label>
          {targetEmail && (
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1.5 bg-admin-brand/10 text-admin-brand rounded-full text-xs font-medium">
                {targetEmail}
              </span>
              <button
                onClick={() => { setTargetEmail(''); setEmailSearch(''); }}
                className="text-admin-text-muted hover:text-accent-orange text-xs"
              >
                ✕
              </button>
            </div>
          )}
          {!targetEmail && (
            <input
              type="email"
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              placeholder="Search by name or email..."
              className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
            />
          )}
          {showDropdown && emailSearch.trim() && !targetEmail && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-surface-elevated border border-admin-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.slice(0, 10).map((u) => {
                  const name = [u.profile?.first_name, u.profile?.last_name].filter(Boolean).join(' ') || u.email;
                  return (
                    <button
                      key={u._id}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(u.email)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-admin-brand-activeBg transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-full bg-admin-brand/10 flex items-center justify-center text-[10px] font-bold text-admin-brand">
                        {u.profile?.first_name?.[0] || u.email[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-admin-text-primary truncate">{name}</p>
                        <p className="text-xs text-admin-text-muted truncate">{u.email}</p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-xs text-admin-text-muted">No users found. Press Enter to use this email.</div>
              )}
            </div>
          )}
          {showDropdown && emailSearch.trim() && !targetEmail && (
            <div
              className="absolute z-20 bottom-0 left-0 right-0 bg-surface-elevated border border-admin-border rounded-b-lg px-4 py-2 cursor-pointer hover:bg-admin-brand-activeBg"
              onMouseDown={(e) => {
                e.preventDefault();
                setTargetEmail(emailSearch.trim());
                setEmailSearch('');
                setShowDropdown(false);
              }}
            >
              <p className="text-xs text-admin-brand font-medium">Use "{emailSearch.trim()}" as email</p>
            </div>
          )}
          <p className="text-[11px] text-admin-text-muted mt-2">Type to search users or enter an email directly.</p>
        </div>
      )}
    </div>
  );
}

function MobileTargetSection({ sendMode, setSendMode, emailSearch, setEmailSearch, targetEmail, setTargetEmail, showDropdown, setShowDropdown, filteredUsers }) {
  const handleSelect = (email) => {
    setTargetEmail(email);
    setEmailSearch('');
    setShowDropdown(false);
  };

  return (
    <div className="bg-admin-brand-bg border border-admin-border/40 rounded-xl p-4">
      <h2 className="text-lg font-medium text-admin-text-primary mb-4">Target</h2>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => { setSendMode('broadcast'); setEmailSearch(''); setTargetEmail(''); }}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
            sendMode === 'broadcast' ? 'bg-admin-brand text-white' : 'bg-surface-elevated border border-admin-border text-admin-text-secondary'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Broadcast
        </button>
        <button
          onClick={() => setSendMode('individual')}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
            sendMode === 'individual' ? 'bg-admin-brand text-white' : 'bg-surface-elevated border border-admin-border text-admin-text-secondary'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Individual
        </button>
      </div>

      {sendMode === 'individual' && (
        <div className="relative">
          {targetEmail && (
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1.5 bg-admin-brand/10 text-admin-brand rounded-full text-xs font-medium">
                {targetEmail}
              </span>
              <button
                onClick={() => { setTargetEmail(''); setEmailSearch(''); }}
                className="text-admin-text-muted hover:text-accent-orange text-xs"
              >
                ✕
              </button>
            </div>
          )}
          {!targetEmail && (
            <input
              type="email"
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              placeholder="Search by name or email..."
              className="w-full px-4 py-3 bg-surface-elevated border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
            />
          )}
          {showDropdown && emailSearch.trim() && !targetEmail && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-surface-elevated border border-admin-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.slice(0, 8).map((u) => {
                  const name = [u.profile?.first_name, u.profile?.last_name].filter(Boolean).join(' ') || u.email;
                  return (
                    <button
                      key={u._id}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(u.email)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-admin-brand-activeBg transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-full bg-admin-brand/10 flex items-center justify-center text-[10px] font-bold text-admin-brand">
                        {u.profile?.first_name?.[0] || u.email[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-admin-text-primary truncate">{name}</p>
                        <p className="text-xs text-admin-text-muted truncate">{u.email}</p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-3 text-xs text-admin-text-muted">No users found.</div>
              )}
            </div>
          )}
          {showDropdown && emailSearch.trim() && !targetEmail && (
            <div
              className="absolute z-20 bottom-0 left-0 right-0 bg-surface-elevated border border-admin-border rounded-b-lg px-4 py-2.5 cursor-pointer hover:bg-admin-brand-activeBg"
              onMouseDown={(e) => {
                e.preventDefault();
                setTargetEmail(emailSearch.trim());
                setEmailSearch('');
                setShowDropdown(false);
              }}
            >
              <p className="text-xs text-admin-brand font-medium">Use "{emailSearch.trim()}" as email</p>
            </div>
          )}
          <p className="text-[11px] text-admin-text-muted mt-2">Type to search or enter email directly.</p>
        </div>
      )}
    </div>
  );
}

export default function AddNotificationSection({ onBack, prefillEmail = '', prefillTitle = '', prefillMessage = '', prefillChannels = ['app'] }) {
  const [sendMode, setSendMode] = useState(prefillEmail ? 'individual' : 'broadcast');
  const [title, setTitle] = useState(prefillTitle);
  const [message, setMessage] = useState(prefillMessage);
  const [targetEmail, setTargetEmail] = useState(prefillEmail);
  const [emailSearch, setEmailSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sentCount, setSentCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [channels, setChannels] = useState(prefillChannels);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const toggleChannel = (id) => {
    setChannels((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== id);
      }
      return [...prev, id];
    });
  };

  useEffect(() => {
    if (sendMode === 'individual') {
      getUsersApi()
        .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
        .catch(() => {});
    }
  }, [sendMode]);

  const filteredUsers = users.filter((u) => {
    if (!emailSearch.trim()) return true;
    const q = emailSearch.toLowerCase();
    const name = [u.profile?.first_name, u.profile?.last_name].filter(Boolean).join(' ');
    return u.email.toLowerCase().includes(q) || name.toLowerCase().includes(q);
  });

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      alert('Please fill in both title and message.');
      return;
    }
    if (sendMode === 'individual' && !targetEmail.trim()) {
      alert('Please select or enter a user email.');
      return;
    }
    if (channels.length === 0) {
      alert('Please select at least one delivery channel.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        message: message.trim(),
        channels,
        data: { type: 'general' },
      };

      if (scheduleEnabled && scheduledDate && scheduledTime) {
        payload.scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
      }

      if (sendMode === 'broadcast') {
        const res = await broadcastNotificationApi(payload);
        setSentCount(res.data?.deviceCount || 0);
        const chLabels = channels.map((c) => CHANNELS.find((ch) => ch.id === c)?.label).filter(Boolean).join(', ');
        if (scheduleEnabled) {
          setSuccessMessage(`Scheduled for ${scheduledDate} at ${scheduledTime} via ${chLabels}.`);
        } else {
          setSuccessMessage(`Broadcast to all users via ${chLabels}.`);
        }
      } else {
        const res = await sendToUserNotificationApi({ ...payload, email: targetEmail.trim() });
        setSentCount(res.data?.deviceCount || 0);
        const chLabels = channels.map((c) => CHANNELS.find((ch) => ch.id === c)?.label).filter(Boolean).join(', ');
        if (scheduleEnabled) {
          setSuccessMessage(`Scheduled for ${scheduledDate} at ${scheduledTime} via ${chLabels}.`);
        } else {
          setSuccessMessage(`Sent to ${targetEmail.trim()} via ${chLabels}.`);
        }
      }
      setSuccess(true);
    } catch (err) {
      alert('Failed to send notification.');
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
            <h2 className="text-2xl font-bold text-admin-text-primary mb-2">{scheduleEnabled ? 'Notification Scheduled!' : 'Notification Sent!'}</h2>
            <p className="text-sm text-admin-text-secondary mb-2">"{title}"</p>
            <p className="text-xs text-admin-text-muted mb-6">{successMessage}</p>
            <button onClick={onBack} className="px-6 py-3 bg-admin-brand text-white rounded-xl text-sm font-medium hover:bg-admin-brand-light transition-colors">
              Back to Notifications
            </button>
          </div>
        </div>
        <div className="lg:hidden flex items-center justify-center min-h-screen p-8">
          <div className="text-center max-w-md">
            <CheckCircle className="w-16 h-16 text-admin-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-admin-text-primary mb-2">{scheduleEnabled ? 'Notification Scheduled!' : 'Notification Sent!'}</h2>
            <p className="text-sm text-admin-text-secondary mb-2">"{title}"</p>
            <p className="text-xs text-admin-text-muted mb-6">{successMessage}</p>
            <button onClick={onBack} className="px-6 py-3 bg-admin-brand text-white rounded-xl text-sm font-medium hover:bg-admin-brand-light transition-colors">
              Back to Notifications
            </button>
          </div>
        </div>
      </>
    );
  }

  const targetProps = {
    sendMode, setSendMode, emailSearch, setEmailSearch,
    targetEmail, setTargetEmail, showDropdown, setShowDropdown, filteredUsers,
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block p-8">
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">Create New Notification</h1>
          <p className="text-sm text-admin-text-secondary mt-1">Configure and target your push notification to reach the right audience.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-admin-brand-bg border border-admin-border/40 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-medium text-admin-text-primary mb-6">Notification Content</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-admin-text-primary mb-2">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New Summer Collection is here!"
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-primary mb-2">Message *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe the notification content..."
                  rows={4}
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-admin-brand-bg border border-admin-border/40 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-medium text-admin-text-primary mb-2">Send To</h2>
            <p className="text-xs text-admin-text-muted mb-4">Choose where to deliver this notification. At least one required.</p>
            <div className="flex gap-3">
              {CHANNELS.map(({ id, label, icon: Icon, desc }) => {
                const selected = channels.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleChannel(id)}
                    className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      selected
                        ? 'border-admin-brand bg-admin-brand/5'
                        : 'border-admin-border/40 bg-surface-elevated hover:border-admin-border'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selected ? 'bg-admin-brand text-white' : 'bg-admin-border/20 text-admin-text-muted'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-medium ${selected ? 'text-admin-brand' : 'text-admin-text-primary'}`}>{label}</p>
                      <p className="text-[10px] text-admin-text-muted">{desc}</p>
                    </div>
                    <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selected ? 'border-admin-brand bg-admin-brand' : 'border-admin-border'
                    }`}>
                      {selected && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <TargetSection {...targetProps} />

          <div className="bg-admin-brand-bg border border-admin-border/40 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-admin-brand" />
                <h2 className="text-xl font-medium text-admin-text-primary">Schedule</h2>
              </div>
              <button
                onClick={() => setScheduleEnabled(!scheduleEnabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${scheduleEnabled ? 'bg-admin-brand' : 'bg-admin-border/60'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${scheduleEnabled ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
            {scheduleEnabled && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-admin-text-primary mb-2">Date *</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-brand transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-admin-text-primary mb-2">Time *</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-brand transition-colors"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-4 pb-12">
            <button onClick={onBack} className="px-6 py-3 text-sm font-medium text-admin-text-primary rounded-xl hover:bg-admin-border/20 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={submitting || !title.trim() || !message.trim() || (sendMode === 'individual' && !targetEmail.trim()) || (scheduleEnabled && (!scheduledDate || !scheduledTime))}
              className="px-8 py-3 bg-admin-brand text-white rounded-xl text-sm font-bold shadow-md hover:bg-admin-brand-light transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {scheduleEnabled ? <Calendar className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              {submitting ? 'Sending…' : scheduleEnabled ? 'Schedule' : sendMode === 'individual' ? 'Send to User' : 'Broadcast Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden min-h-screen bg-surface-elevated pb-24">
        <div className="sticky top-0 z-10 bg-surface-elevated border-b border-admin-border/30">
          <div className="flex items-center justify-between px-4 py-4">
            <button onClick={onBack} className="p-1">
              <ArrowLeft className="w-5 h-5 text-admin-text-primary" />
            </button>
            <h1 className="text-lg font-bold text-admin-text-primary">Add Notification</h1>
            <div className="w-7" />
          </div>
        </div>

        <div className="p-4 space-y-4">
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
                <label className="block text-xs font-medium text-admin-text-primary mb-2">Notification Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New Seasonal Collection Drop"
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-admin-text-primary mb-2">Message Body *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter the main message users will see..."
                  rows={4}
                  className="w-full px-4 py-3 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none placeholder:text-admin-text-muted focus:border-admin-brand transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-admin-brand-bg border border-admin-border/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 text-admin-brand">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-admin-brand tracking-wider">SEND TO</span>
            </div>
            <div className="space-y-2">
              {CHANNELS.map(({ id, label, icon: Icon, desc }) => {
                const selected = channels.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleChannel(id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      selected
                        ? 'border-admin-brand bg-admin-brand/5'
                        : 'border-admin-border/40 bg-surface-elevated'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      selected ? 'bg-admin-brand text-white' : 'bg-admin-border/20 text-admin-text-muted'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-medium ${selected ? 'text-admin-brand' : 'text-admin-text-primary'}`}>{label}</p>
                      <p className="text-[10px] text-admin-text-muted">{desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selected ? 'border-admin-brand bg-admin-brand' : 'border-admin-border'
                    }`}>
                      {selected && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <MobileTargetSection {...targetProps} />

          <div className="bg-admin-brand-bg border border-admin-border/40 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-admin-brand" />
                <span className="text-xs font-bold text-admin-brand tracking-wider">SCHEDULE</span>
              </div>
              <button
                onClick={() => setScheduleEnabled(!scheduleEnabled)}
                className={`relative w-11 h-6 rounded-full transition-colors ${scheduleEnabled ? 'bg-admin-brand' : 'bg-admin-border/60'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${scheduleEnabled ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
            {scheduleEnabled && (
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-admin-text-primary mb-1.5">Date *</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2.5 bg-white border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-brand transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-admin-text-primary mb-1.5">Time *</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-brand transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface-elevated border-t border-admin-border/30">
          <button
            onClick={handleSend}
            disabled={submitting || !title.trim() || !message.trim() || (sendMode === 'individual' && !targetEmail.trim()) || (scheduleEnabled && (!scheduledDate || !scheduledTime))}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-admin-brand text-white rounded-xl text-sm font-bold shadow-md hover:bg-admin-brand-light transition-colors disabled:opacity-50"
          >
            {scheduleEnabled ? <Calendar className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            {submitting ? 'Sending…' : scheduleEnabled ? 'Schedule' : sendMode === 'individual' ? 'Send to User' : 'Broadcast Now'}
          </button>
        </div>
      </div>
    </>
  );
}
