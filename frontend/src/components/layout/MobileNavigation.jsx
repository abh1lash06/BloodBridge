import React, { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { X } from 'lucide-react';
export function MobileNavigation({ isOpen, onClose }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} aria-hidden="true"/>

      {/* Drawer */}
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 z-10 shadow-2xl animate-in slide-in-from-left duration-200">
        <button type="button" onClick={onClose} className="absolute top-4 right-3 p-1.5 text-slate-400 hover:text-white rounded-lg" aria-label="Close navigation">
          <X className="w-5 h-5"/>
        </button>
        <Sidebar onCloseMobile={onClose}/>
      </div>
    </div>);
}
