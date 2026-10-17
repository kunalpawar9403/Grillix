import React from 'react';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Tag, 
  ArrowRight 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HowItWorksScreen = () => {
  const { goBack, navigateTo, showToast } = useApp();

  return (
    <div className="w-full min-h-screen pb-28 md:pb-16 animate-fadeIn bg-[#EEF4E3]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6 space-y-4">
        
        {/* Top Header matching reference */}
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>

          <h1 className="text-lg sm:text-xl font-extrabold text-[#243019] tracking-tight">
            How It Works
          </h1>

          <button
            onClick={() => showToast('Rewards terms and conditions')}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Large Dark Olive Green Card matching screenshot */}
        <div className="bg-[#2B470E] text-white rounded-3xl sm:rounded-4xl p-6 sm:p-8 space-y-7 shadow-sm border border-[#244507]">
          
          {/* Section 1: Earn Pts */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Earn Pts
            </h2>
            <p className="text-xs sm:text-sm text-[#EEF4E3]/90 leading-relaxed">
              Scan in store or order ahead to get 10 points for every eligible ₹10 spent*
            </p>
          </div>

          <div className="h-px bg-white/15 w-full"></div>

          {/* Section 2: Get more */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Get more
            </h2>
            <p className="text-xs sm:text-sm text-[#EEF4E3]/90 leading-relaxed">
              Discover extra ways to earn points with seasonal promotions and partner offers. Keep an eye out for special rewards that make your healthy choices even more rewarding.
            </p>
          </div>

          <div className="h-px bg-white/15 w-full"></div>

          {/* Section 3: Redeem */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Redeem
            </h2>
            <p className="text-xs sm:text-sm text-[#EEF4E3]/90 leading-relaxed">
              Turn your points into perks with ease. Whether it's a free signature bowl, a special add-on, or limited-time offers, redeeming is quick and rewarding.
            </p>
          </div>

        </div>

        {/* Bottom Cream Card matching screenshot */}
        <div className="bg-white rounded-3xl p-5 border border-[#D0D8C2] shadow-xs flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#EEF4E3] border border-[#D0D8C2] flex items-center justify-center text-[#315B0B] shrink-0 mt-0.5">
            <Tag size={18} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm sm:text-base font-extrabold text-[#243019]">
              Order More And Get More Rewards
            </h3>
            <p className="text-xs text-[#747B68] mt-1 leading-relaxed">
              Earn points with every order and unlock exclusive rewards. The more you order, the faster you unlock fresh perks.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigateTo('menu')}
                className="text-xs font-bold text-[#315B0B] hover:text-[#244507] flex items-center space-x-1"
              >
                <span>Start an Order</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
