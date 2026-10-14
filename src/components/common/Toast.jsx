import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce duration-300 pointer-events-none">
      <div className="bg-[#244507] text-[#EEF4E3] border border-[#A8E83C]/40 px-4 py-2.5 rounded-full shadow-xl flex items-center space-x-2 text-xs sm:text-sm font-bold backdrop-blur-md">
        <CheckCircle2 size={16} className="text-[#A8E83C]" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
