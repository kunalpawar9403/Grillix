import React, { useState } from 'react';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Coffee, 
  X,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { REWARDS_DATA, REDEEMABLE_PERKS } from '../data/mockData';

export const RewardsScreen = () => {
  const { 
    goBack, 
    navigateTo, 
    userPoints, 
    currentUser,
    redeemPerk,
    showToast 
  } = useApp();

  const [showHistoryModal, setShowHistoryModal] = useState(false);

  return (
    <div className="w-full min-h-screen pb-28 md:pb-16 animate-fadeIn bg-[#EEF4E3]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6 space-y-5">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>

          <h1 className="text-lg sm:text-xl font-extrabold text-[#243019] tracking-tight">
            Rewards
          </h1>

          <button
            onClick={() => navigateTo('how-it-works')}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
            title="How It Works"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* User Greeting */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243019]">
            Hi {currentUser?.isLoggedIn ? currentUser.name : 'Valued Guest'}
          </h2>
          <p className="text-xs sm:text-sm text-[#747B68] font-medium mt-0.5">
            You have Earned {userPoints.toLocaleString()} reward points
          </p>
        </div>

        {/* Loyalty Points Card matching screenshot */}
        <div className="bg-white rounded-3xl p-6 border border-[#D0D8C2] shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#243019] tracking-tight">
                {userPoints.toLocaleString()} PTS
              </span>
            </div>

            <div className="flex items-center space-x-1.5 text-xs font-bold text-[#315B0B]">
              <button 
                onClick={() => setShowHistoryModal(true)} 
                className="hover:underline"
              >
                View History
              </button>
              <span>•</span>
              <button 
                onClick={() => navigateTo('how-it-works')} 
                className="hover:underline"
              >
                How It Works
              </button>
            </div>
          </div>

          {/* Barcode Graphic matching screenshot */}
          <div className="py-2">
            <div className="h-10 w-full flex items-center space-x-1 opacity-80 overflow-hidden">
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#244507] rounded-xs"
                  style={{
                    width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1)}px`,
                    height: `${i % 4 === 0 ? 36 : 28}px`,
                  }}
                ></div>
              ))}
            </div>
            <span className="text-[10px] font-mono text-[#747B68] block mt-1 tracking-widest text-center">
              GRX-9948-2849-0192
            </span>
          </div>

          {/* Free drink sub-banner */}
          <div className="pt-3 border-t border-[#EEF4E3] flex items-center space-x-2 text-xs font-bold text-[#243019]">
            <Coffee size={16} className="text-[#315B0B]" />
            <span>{REWARDS_DATA.drinkMilestone}</span>
          </div>
        </div>

        {/* NEW FEATURE: Redeemable Perks & Vouchers */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#D0D8C2] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-[#243019]">Redeem Perks & Vouchers</h3>
              <p className="text-xs text-[#747B68]">Exchange your loyalty points for instant discounts and free bakery items.</p>
            </div>
            <span className="text-xs font-black text-[#315B0B] bg-[#EEF4E3] px-3 py-1 rounded-full">
              {userPoints} PTS Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {REDEEMABLE_PERKS.map((perk) => {
              const canAfford = userPoints >= perk.pointsCost;
              return (
                <div
                  key={perk.id}
                  className="border border-[#D0D8C2] rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-[#315B0B]/50 transition-colors bg-white shadow-xs"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                      <img src={perk.image} alt={perk.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold uppercase text-[#315B0B] bg-[#EEF4E3] px-2 py-0.5 rounded-md inline-block mb-1">
                        {perk.pointsCost} PTS
                      </span>
                      <h4 className="font-extrabold text-xs sm:text-sm text-[#243019] leading-snug">
                        {perk.title}
                      </h4>
                      <p className="text-[11px] text-[#747B68] mt-1 line-clamp-2">
                        {perk.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => redeemPerk(perk)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center space-x-1.5 ${
                      canAfford
                        ? 'bg-[#315B0B] hover:bg-[#244507] text-white shadow-xs active:scale-95'
                        : 'bg-stone-100 text-[#747B68] cursor-not-allowed border border-stone-200'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <Sparkles size={13} />
                        <span>Redeem ({perk.pointsCost} PTS)</span>
                      </>
                    ) : (
                      <span>Need {perk.pointsCost - userPoints} more PTS</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buy More & Get Rewards Promo Section matching screenshot */}
        <div className="bg-white rounded-3xl p-5 border border-[#D0D8C2] shadow-xs space-y-4">
          <h3 className="text-xl font-extrabold text-[#243019]">
            Buy More & Get Rewards
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-44 h-32 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
              <img
                src={REWARDS_DATA.specialPromotion.image}
                alt="Promotion"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <p className="text-xs sm:text-sm font-bold text-[#243019] leading-snug">
                {REWARDS_DATA.specialPromotion.description}
              </p>
              <span className="inline-block text-[11px] text-[#747B68] font-semibold">
                {REWARDS_DATA.specialPromotion.expiry}
              </span>

              <div className="pt-1">
                <button
                  onClick={() => {
                    showToast('Offer saved to your account! Valid on your next order.');
                    navigateTo('menu');
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                >
                  Get Details
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Rewards History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 border border-[#D0D8C2] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF4E3]">
              <h3 className="text-lg font-bold text-[#243019]">Rewards Point History</h3>
              <button onClick={() => setShowHistoryModal(false)} className="p-1 rounded-full text-[#747B68] hover:text-[#243019]">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#EEF4E3] rounded-2xl">
                <div>
                  <h4 className="text-xs font-bold text-[#243019]">Rainbow Quinoa Power Bowl</h4>
                  <span className="text-[10px] text-[#747B68]">Today • Online Order</span>
                </div>
                <span className="text-xs font-extrabold text-[#315B0B]">+148 pts</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#EEF4E3] rounded-2xl">
                <div>
                  <h4 className="text-xs font-bold text-[#243019]">Green Detox Smoothie Perk</h4>
                  <span className="text-[10px] text-[#747B68]">May 1, 2026 • Redeemed</span>
                </div>
                <span className="text-xs font-extrabold text-red-600">-500 pts</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#EEF4E3] rounded-2xl">
                <div>
                  <h4 className="text-xs font-bold text-[#243019]">Welcome Loyalty Bonus</h4>
                  <span className="text-[10px] text-[#747B68]">April 15, 2026 • Account Signup</span>
                </div>
                <span className="text-xs font-extrabold text-[#315B0B]">+3,852 pts</span>
              </div>
            </div>

            <button
              onClick={() => setShowHistoryModal(false)}
              className="w-full py-3 rounded-full bg-[#315B0B] text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
