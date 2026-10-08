import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Bell, CalendarCheck, CheckCheck, CheckCircle2, Clock, Package, } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { formatDateTime } from '@/lib/utils';
export function NotificationsPage() {
    const [filter, setFilter] = useState('all');
    const { notifications, isLoading, isError, refetch, markAsRead, markAllAsRead, isMarkingAllRead, unreadCount, } = useNotifications();
    const { user } = useAuth();
    const navigate = useNavigate();
    const safeNotifications = Array.isArray(notifications)
        ? notifications
        : [];
    const filteredNotifications = safeNotifications.filter((item) => {
        if (filter === 'unread') {
            return !item.read;
        }
        return true;
    });
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'DONOR_ACCEPTED':
            case 'HOSPITAL_RESERVATION_FULFILLED':
            case 'REQUEST_FULFILLED':
                return (_jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-600" }));
            case 'DONOR_REJECTED':
            case 'REQUEST_CANCELLED':
                return (_jsx(AlertTriangle, { className: "w-5 h-5 text-rose-600" }));
            case 'HOSPITAL_RESERVED':
            case 'HOSPITAL_RESERVATION_RELEASED':
                return (_jsx(CalendarCheck, { className: "w-5 h-5 text-purple-600" }));
            case 'DONOR_MATCHED':
                return (_jsx(Package, { className: "w-5 h-5 text-indigo-600" }));
            default:
                return (_jsx(Clock, { className: "w-5 h-5 text-sky-600" }));
        }
    };
    const handleActionClick = (item) => {
        if (!item.read) {
            markAsRead(item.id);
        }
        const type = item.type || '';
        const referenceType = item.referenceType || '';
        if (user?.role === 'PATIENT' &&
            referenceType === 'BLOOD_REQUEST' &&
            item.referenceId) {
            navigate(`/patient/requests/${item.referenceId}`);
            return;
        }
        if (user?.role === 'PATIENT' &&
            (type === 'REQUEST_FULFILLED' ||
                type === 'REQUEST_CANCELLED') &&
            item.referenceId) {
            navigate(`/patient/requests/${item.referenceId}`);
            return;
        }
        if (user?.role === 'DONOR' &&
            type.startsWith('DONOR_')) {
            navigate('/donor/matches');
            return;
        }
        if (user?.role === 'HOSPITAL' &&
            type.startsWith('HOSPITAL_')) {
            navigate('/hospital/reservations');
        }
    };
    return (_jsxs(PageContainer, { title: "Notifications", description: "Stay informed about emergency requests, donor responses, and hospital fulfillment status.", action: unreadCount > 0 ? (_jsx(Button, { variant: "outline", size: "sm", onClick: () => markAllAsRead(), isLoading: isMarkingAllRead, leftIcon: _jsx(CheckCheck, { className: "w-4 h-4 text-rose-600" }), children: "Mark All as Read" })) : undefined, children: [_jsxs("div", { className: "flex items-center gap-2 border-b border-slate-200 pb-3", children: [_jsxs("button", { type: "button", onClick: () => setFilter('all'), className: `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === 'all'
                            ? 'bg-rose-600 text-white'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`, children: ["All (", safeNotifications.length, ")"] }), _jsxs("button", { type: "button", onClick: () => setFilter('unread'), className: `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === 'unread'
                            ? 'bg-rose-600 text-white'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`, children: ["Unread (", unreadCount, ")"] })] }), isLoading ? (_jsx("div", { className: "py-12 flex justify-center", children: _jsx(Spinner, { size: "lg", label: "Loading notifications..." }) })) : isError ? (_jsx(ErrorState, { title: "Could not load notifications", message: "Failed to retrieve notification records from the server.", onRetry: () => refetch() })) : filteredNotifications.length === 0 ? (_jsx(EmptyState, { icon: _jsx(Bell, { className: "w-6 h-6" }), title: filter === 'unread'
                    ? "You're all caught up"
                    : 'No notifications', description: filter === 'unread'
                    ? 'No unread notifications at this time.'
                    : 'No notification records have been generated yet.' })) : (_jsx("div", { className: "space-y-3", children: filteredNotifications.map((item) => (_jsx(Card, { className: `transition-colors cursor-pointer hover:border-slate-300 ${!item.read
                        ? 'bg-rose-50/30 border-rose-200'
                        : 'bg-white'}`, onClick: () => handleActionClick(item), children: _jsxs(CardContent, { className: "p-4 sm:p-5 flex items-start gap-4", children: [_jsx("div", { className: "p-2.5 rounded-xl bg-slate-100 shrink-0 mt-0.5", children: getNotificationIcon(item.type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between gap-2 mb-1", children: [_jsx("h4", { className: "text-sm font-semibold text-slate-900 truncate", children: item.title ||
                                                    'System Notification' }), _jsx("span", { className: "text-[11px] text-slate-400 shrink-0", children: formatDateTime(item.createdAt) })] }), _jsx("p", { className: "text-xs text-slate-600 leading-relaxed mb-3", children: item.message }), _jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-slate-100/80", children: [_jsxs("div", { className: "flex items-center gap-2", children: [!item.read && (_jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800", children: "Unread" })), item.type && (_jsx("span", { className: "text-[10px] uppercase font-mono text-slate-400", children: item.type }))] }), _jsxs("span", { className: "text-xs font-medium text-rose-600 flex items-center gap-1", children: ["View Details", _jsx(ArrowRight, { className: "w-3 h-3" })] })] })] })] }) }, item.id))) }))] }));
}
