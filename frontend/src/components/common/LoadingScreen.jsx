import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Spinner } from '@/components/ui/Spinner';
export function LoadingScreen({ message = 'Loading BloodBridge...' }) {
    return (_jsxs("div", { className: "min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white font-bold shadow-md shadow-rose-200", children: "BB" }), _jsxs("span", { className: "text-xl font-bold tracking-tight text-slate-900", children: ["Blood", _jsx("span", { className: "text-rose-600", children: "Bridge" })] })] }), _jsx(Spinner, { size: "lg", label: message })] }));
}
