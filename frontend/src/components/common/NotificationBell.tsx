import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  CheckCheck,
  ExternalLink,
} from 'lucide-react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDateTime } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { AppNotification } from '@/types/notification';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isMarkingAllRead,
  } = useNotifications();

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
  }, []);

  const recentNotifications = Array.isArray(notifications)
    ? notifications.slice(0, 5)
    : [];

  const handleNotificationClick = (
    item: AppNotification
  ) => {
    if (!item.read) {
      markAsRead(item.id);
    }

    setIsOpen(false);

    const type = item.type || '';
    const referenceType =
      item.referenceType || '';

    if (
      user?.role === 'PATIENT' &&
      referenceType === 'BLOOD_REQUEST' &&
      item.referenceId
    ) {
      navigate(
        `/patient/requests/${item.referenceId}`
      );
      return;
    }

    if (
      user?.role === 'DONOR' &&
      type.startsWith('DONOR_')
    ) {
      navigate('/donor/matches');
      return;
    }

    if (
      user?.role === 'HOSPITAL' &&
      type.startsWith('HOSPITAL_')
    ) {
      navigate('/hospital/reservations');
      return;
    }

    if (
      user?.role === 'PATIENT' &&
      (
        type === 'REQUEST_FULFILLED' ||
        type === 'REQUEST_CANCELLED'
      ) &&
      item.referenceId
    ) {
      navigate(
        `/patient/requests/${item.referenceId}`
      );
    }
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
        aria-expanded={isOpen}
        className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
      >
        <Bell className="w-5 h-5" />

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold leading-none ring-2 ring-white animate-pulse">
            {unreadCount > 99
              ? '99+'
              : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">
                Notifications
              </span>

              {unreadCount > 0 && (
                <span className="text-[11px] font-medium bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead()}
                disabled={isMarkingAllRead}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {recentNotifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                You're all caught up. No notifications yet.
              </div>
            ) : (
              recentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() =>
                    handleNotificationClick(notif)
                  }
                  className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors text-left flex items-start gap-3 ${
                    !notif.read
                      ? 'bg-rose-50/40'
                      : ''
                  }`}
                >
                  <div className="mt-1 shrink-0">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        !notif.read
                          ? 'bg-rose-600'
                          : 'bg-transparent'
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {notif.title && (
                      <h5 className="text-xs font-semibold text-slate-900 truncate mb-0.5">
                        {notif.title}
                      </h5>
                    )}

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>

                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {formatDateTime(
                        notif.createdAt
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 border-t border-slate-100 bg-slate-50 text-center">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1"
            >
              View all notifications
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}