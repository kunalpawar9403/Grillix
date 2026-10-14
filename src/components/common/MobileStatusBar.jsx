import React from 'react';
import { Wifi, Battery } from 'lucide-react';

export const MobileStatusBar = ({ dark = false, showIsland = true }) => {
  return (
    <div className={`w-full px-7 pt-3 pb-2 flex items-center justify-between text-xs font-semibold select-none z-30 ${dark ? 'text-white' : 'text-[#243019]'}`}>
      <span className="tracking-tight text-[13px] font-bold">9:54</span>
      
      {showIsland && (
        <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2.5 space-x-1.5 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-[#111111] border border-[#222]"></div>
          <div className="w-2 h-2 rounded-full bg-[#0a1804] border border-[#1b380b]"></div>
        </div>
      )}

      <div className="flex items-center space-x-1.5 text-[11px]">
        {/* Signal bars */}
        <div className="flex items-end space-x-0.5 h-3">
          <div className={`w-0.5 h-1 rounded-sm ${dark ? 'bg-white' : 'bg-[#243019]'}`}></div>
          <div className={`w-0.5 h-1.5 rounded-sm ${dark ? 'bg-white' : 'bg-[#243019]'}`}></div>
          <div className={`w-0.5 h-2 rounded-sm ${dark ? 'bg-white' : 'bg-[#243019]'}`}></div>
          <div className={`w-0.5 h-2.5 rounded-sm ${dark ? 'bg-white' : 'bg-[#243019]'}`}></div>
        </div>
        <Wifi size={13} strokeWidth={2.5} />
        <Battery size={15} strokeWidth={2.5} className="fill-current" />
      </div>
    </div>
  );
};
