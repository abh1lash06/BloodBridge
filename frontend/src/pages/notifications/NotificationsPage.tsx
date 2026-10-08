import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarCheck,
  CheckCheck,
  CheckCircle2,
  Clock,
  Package,
} from 'lucide-react';

import { PageContainer } from '@/components/layout/PageContainer';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { formatDateTime } from '@/lib/utils';
import { AppNotification } from '@/types/notification';

export function NotificationsPage() {
  const [filter, setFilter] =
    useState<'all' | 'unread'>('all');

  const {
    notifications,
    isLoading,
    isError,
    refetch,
    markAsRead,
    markAllAsRead,
    isMarkingAllRead,
    unreadCount,
  } = useNotifications();

  const { user } = useAuth();
  const navigate = useNavigate();

  const safeNotifications = Array.isArray(
    notifications
  )
    ? notifications
    : [];

  const filteredNotifications =
    safeNotifications.filter((item) => {
      if (filter === 'unread') {
        return !item.read;
      }

      return true;
    });

  const getNotificationIcon = (
    type?: string
  ) => {
    switch (type) {
      case 'DONOR_ACCEPTED':
      case 'HOSPITAL_RESERVATION_FULFILLED':
      case 'REQUEST_FULFILLED':
        return (
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        );

      case 'DONOR_REJECTED':
      case 'REQUEST_CANCELLED':
        return (
          <AlertTriangle className="w-5 h-5 text-rose-600" />
        );

      case 'HOSPITAL_RESERVED':
      case 'HOSPITAL_RESERVATION_RELEASED':
        return (
          <CalendarCheck className="w-5 h-5 text-purple-600" />
        );

      case 'DONOR_MATCHED':
        return (
          <Package className="w-5 h-5 text-indigo-600" />
        );

      default:
        return (
          <Clock className="w-5 h-5 text-sky-600" />
        );
    }
  };

  const handleActionClick = (
    item: AppNotification
  ) => {
    if (!item.read) {
      markAsRead(item.id);
    }

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
    }
  };

  return (
    <PageContainer
      title="Notifications"
      description="Stay informed about emergency requests, donor responses, and hospital fulfillment status."
      action={
        unreadCount > 0 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsRead()}
            isLoading={isMarkingAllRead}
            leftIcon={
              <CheckCheck className="w-4 h-4 text-rose-600" />
            }
          >
            Mark All as Read
          </Button>
        ) : undefined
      }
    >
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-rose-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All ({safeNotifications.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'unread'
              ? 'bg-rose-600 text-white'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <Spinner
            size="lg"
            label="Loading notifications..."
          />
        </div>
      ) : isError ? (
        <ErrorState
          title="Could not load notifications"
          message="Failed to retrieve notification records from the server."
          onRetry={() => refetch()}
        />
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-6 h-6" />}
          title={
            filter === 'unread'
              ? "You're all caught up"
              : 'No notifications'
          }
          description={
            filter === 'unread'
              ? 'No unread notifications at this time.'
              : 'No notification records have been generated yet.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => (
            <Card
              key={item.id}
              className={`transition-colors cursor-pointer hover:border-slate-300 ${
                !item.read
                  ? 'bg-rose-50/30 border-rose-200'
                  : 'bg-white'
              }`}
              onClick={() =>
                handleActionClick(item)
              }
            >
              <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                  {getNotificationIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {item.title ||
                        'System Notification'}
                    </h4>

                    <span className="text-[11px] text-slate-400 shrink-0">
                      {formatDateTime(
                        item.createdAt
                      )}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {item.message}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100/80">
                    <div className="flex items-center gap-2">
                      {!item.read && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Unread
                        </span>
                      )}

                      {item.type && (
                        <span className="text-[10px] uppercase font-mono text-slate-400">
                          {item.type}
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-medium text-rose-600 flex items-center gap-1">
                      View Details
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}