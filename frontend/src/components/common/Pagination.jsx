import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
export function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1)
        return null;
    return (_jsxs("div", { className: "flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200 sm:px-6 rounded-b-xl", children: [_jsxs("div", { className: "text-xs text-slate-500", children: ["Page ", _jsx("span", { className: "font-semibold text-slate-700", children: currentPage }), " of", ' ', _jsx("span", { className: "font-semibold text-slate-700", children: totalPages })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => onPageChange(currentPage - 1), disabled: currentPage <= 1, leftIcon: _jsx(ChevronLeft, { className: "w-3.5 h-3.5" }), children: "Previous" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => onPageChange(currentPage + 1), disabled: currentPage >= totalPages, rightIcon: _jsx(ChevronRight, { className: "w-3.5 h-3.5" }), children: "Next" })] })] }));
}
