import React from 'react';
import { Home, LayoutGrid, Bell, MapPin, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getAdminUrl } from '../../utils/navigation';

export const MobileBottomNav = () => {
  const { currentScreen, navigateTo, currentTable, callWaiter } = useApp();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full pointer-events-auto select-none">
      <nav 
        aria-label="Mobile Navigation"
        className="w-full bg-white border-t border-[#EAEFE6] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] relative"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="max-w-md mx-auto h-14 grid grid-cols-4 items-center justify-items-center relative px-3">
          
          {/* 1. Digital Menu Card */}
          <button
            onClick={() => navigateTo('menu')}
            className={`w-12 h-12 flex flex-col items-center justify-center rounded-2xl transition-all active:scale-90 ${
              currentScreen === 'menu' || currentScreen === 'product-detail'
                ? 'text-[#3B7B19] font-black'
                : 'text-[#848F7E] hover:text-[#3B7B19]'
            }`}
            aria-label="Menu"
            title="Digital Menu Card"
          >
            <LayoutGrid size={21} strokeWidth={2.2} />
            <span className="text-[9px] font-bold mt-0.5">Menu</span>
          </button>

          {/* 2. Restaurant Showcase & Ambiance */}
          <button
            onClick={() => navigateTo('home')}
            className={`w-12 h-12 flex flex-col items-center justify-center rounded-2xl transition-all active:scale-90 ${
              currentScreen === 'home'
                ? 'text-[#3B7B19] font-black'
                : 'text-[#848F7E] hover:text-[#3B7B19]'
            }`}
            aria-label="Restaurant Showcase"
            title="Restaurant Showcase"
          >
            <Home size={21} strokeWidth={2.2} />
            <span className="text-[9px] font-bold mt-0.5">Showcase</span>
          </button>

          {/* 3. Location, Story & Dining Sections */}
          <button
            onClick={() => navigateTo('discovery')}
            className={`w-12 h-12 flex flex-col items-center justify-center rounded-2xl transition-all active:scale-90 ${
              currentScreen === 'discovery'
                ? 'text-[#3B7B19] font-black'
                : 'text-[#848F7E] hover:text-[#3B7B19]'
            }`}
            aria-label="Story & Location"
            title="Our Story & Location"
          >
            <MapPin size={21} strokeWidth={2.2} />
            <span className="text-[9px] font-bold mt-0.5">Story</span>
          </button>

          {/* 4. Call Server Button */}
          <button
            onClick={() => callWaiter('Assistance')}
            className="w-12 h-12 flex flex-col items-center justify-center rounded-2xl text-[#848F7E] hover:text-[#3B7B19] transition-all active:scale-90"
            aria-label="Call Server"
            title={`Call server to Table #${currentTable || '1'}`}
          >
            <Bell size={21} strokeWidth={2.2} />
            <span className="text-[9px] font-bold mt-0.5">Server</span>
          </button>

        </div>
      </nav>
    </div>
  );
};
