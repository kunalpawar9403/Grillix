import React from 'react';
import { Home, LayoutGrid, ShoppingBag, Clock, UtensilsCrossed } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileBottomNav = () => {
  const { currentScreen, navigateTo, cartItemCount, currentTable } = useApp();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full pointer-events-auto select-none">
      <nav 
        aria-label="Mobile Navigation"
        className="w-full bg-white border-t border-[#EAEFE6] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] relative"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Exact 5-column grid: every item occupies identical 20% width on the same horizontal baseline */}
        <div className="max-w-md mx-auto h-14 grid grid-cols-5 items-center justify-items-center relative px-2">
          
          {/* 1. Digital Menu Card */}
          <button
            onClick={() => navigateTo('menu')}
            className="w-12 h-12 flex items-center justify-center rounded-full transition-transform active:scale-90"
            aria-label="Menu"
            title="Digital Menu Card"
          >
            <LayoutGrid 
              size={21} 
              strokeWidth={2.2}
              className={currentScreen === 'menu' || currentScreen === 'product-detail' ? 'text-[#3B7B19]' : 'text-[#9BA595] hover:text-[#3B7B19]'} 
            />
          </button>

          {/* 2. Restaurant Story & Table */}
          <button
            onClick={() => navigateTo('discovery')}
            className="w-12 h-12 flex items-center justify-center rounded-full transition-transform active:scale-90"
            aria-label="Restaurant Story"
            title="Our Restaurant & Table"
          >
            <Home 
              size={22} 
              className={currentScreen === 'home' || currentScreen === 'discovery' ? 'text-[#3B7B19] fill-[#3B7B19]' : 'text-[#9BA595] hover:text-[#3B7B19]'} 
            />
          </button>

          {/* 3. Center Elevated Leaf Circle (Custom Bowl & Grills) */}
          <div className="w-12 h-12 flex items-center justify-center relative">
            <button
              onClick={() => navigateTo('custom-bowl')}
              className={`absolute -top-6 w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-b from-[#8DC31C] to-[#72AE10] text-white shadow-[0_8px_18px_rgba(114,174,16,0.48)] transition-all duration-200 active:scale-90 hover:brightness-105 ${
                currentScreen === 'custom-bowl' ? 'ring-4 ring-[#8DC31C]/35 scale-105' : ''
              }`}
              aria-label="Custom Bowl Builder"
              title="Build Custom Bowl"
            >
              <svg 
                className="w-6 h-6 text-white" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M4.5 20.5C5 18.5 6.2 17.5 8 17" />
                <path d="M8 17C5 11.5 8.5 5 18 4.5C19 14 13.5 17.5 8 17Z" />
                <path d="M8 17C10 14.5 12 12.5 14.5 9.5" />
              </svg>
            </button>
          </div>

          {/* 4. Table Cart & Order */}
          <button
            onClick={() => navigateTo('cart')}
            className="w-12 h-12 flex items-center justify-center rounded-full transition-transform active:scale-90 relative"
            aria-label="Table Order Cart"
            title={`Table #${currentTable} Order`}
          >
            <ShoppingBag 
              size={21} 
              strokeWidth={2.2}
              className={
                currentScreen === 'cart' 
                  ? 'text-[#3B7B19]' 
                  : 'text-[#9BA595] hover:text-[#3B7B19]'
              } 
            />
            {cartItemCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[17px] h-[17px] bg-[#3B7B19] text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* 5. Live Kitchen Order Tracker (Replaced Profile) */}
          <button
            onClick={() => navigateTo('order-tracking')}
            className="w-12 h-12 flex items-center justify-center rounded-full transition-transform active:scale-90 relative"
            aria-label="Kitchen Tracking"
            title="Live Kitchen Status"
          >
            <UtensilsCrossed 
              size={20} 
              strokeWidth={2.2}
              className={currentScreen === 'order-tracking' ? 'text-[#3B7B19]' : 'text-[#9BA595] hover:text-[#3B7B19]'} 
            />
          </button>

        </div>
      </nav>
    </div>
  );
};
