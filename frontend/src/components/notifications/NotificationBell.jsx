import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, 
  Sparkles, 
  Clock, 
  CheckSquare, 
  Info, 
  CheckCheck, 
  X, 
  ExternalLink 
} from 'lucide-react';

export function NotificationBell() {
  const { 
    notifications, 
    unreadCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification 
  } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (notif) => {
    markNotificationAsRead(notif.id);
    if (notif.job_id) {
      setIsOpen(false);
      navigate(`/jobs/${notif.job_id}`);
    }
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return 'Recently';
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'match':
        return <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'deadline':
        return <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'application':
        return <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <Info className="w-4 h-4 text-brand-600 dark:text-brand-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="In-App Notifications"
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Bell className="w-4 h-4" />
        
        {/* Unread Badge Count */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-extrabold text-white bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-950 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-3 z-50 animate-fade-in">
          
          {/* Header */}
          <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                In-App Alerts
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950/80 dark:text-brand-400 border border-brand-200/50 dark:border-brand-800/50">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {notifications && notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`group relative p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition cursor-pointer ${
                    !notif.is_read ? 'bg-brand-50/40 dark:bg-brand-950/20' : ''
                  }`}
                >
                  {/* Type Icon */}
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 mt-0.5">
                    {getIconForType(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-xs ${!notif.is_read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'} truncate`}>
                        {notif.title}
                      </p>
                      {!notif.is_read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-400 flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-slate-400">
                        {formatTimestamp(notif.created_at)}
                      </span>
                      {notif.job_id && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-brand-600 dark:text-brand-400 font-semibold group-hover:underline">
                          View Job <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dismiss Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    title="Dismiss alert"
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-opacity absolute top-3 right-3"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-8 text-center px-4 space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCheck className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  All caught up!
                </p>
                <p className="text-[11px] text-slate-500">
                  You have no unread in-app alerts at the moment.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/dashboard');
              }}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Go to Candidate Dashboard →
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
