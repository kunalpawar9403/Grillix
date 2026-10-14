import React, { useState } from 'react';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Plus, 
  Minus, 
  Trash2, 
  Tag, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartScreen = () => {
  const { 
    goBack, 
    cart, 
    updateQuantity, 
    removeFromCart, 
    cartSubtotal, 
    cartTotal,
    discountAmount,
    appliedPromo, 
    promoError, 
    applyPromo, 
    checkout,
    navigateTo 
  } = useApp();

  const [inputCode, setInputCode] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromo(inputCode);
    }
  };

  return (
    <div className="w-full min-h-screen pb-32 md:pb-16 animate-fadeIn bg-[#EEF4E3]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>

          <h1 className="text-lg sm:text-xl font-extrabold text-[#243019] tracking-tight">
            Your bag
          </h1>

          <button
            onClick={() => navigateTo('menu')}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
            aria-label="Add more items"
            title="Browse Menu"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Empty state */}
        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-[#D0D8C2] shadow-xs my-8">
            <div className="w-16 h-16 rounded-full bg-[#EEF4E3] flex items-center justify-center mx-auto text-[#315B0B] mb-4">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-xl font-extrabold text-[#243019]">Your bag is empty</h2>
            <p className="text-xs text-[#747B68] mt-1.5 max-w-sm mx-auto">
              Treat your body to nourishing greens, freshly roasted grain bowls, and plant protein.
            </p>
            <button
              onClick={() => navigateTo('menu')}
              className="mt-6 px-6 py-3 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart Items List */}
            {cart.map((entry) => {
              const { item, quantity, customizations } = entry;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 border border-[#D0D8C2] shadow-xs flex items-center justify-between gap-3 sm:gap-4 transition-all"
                >
                  {/* Left Info */}
                  <div className="flex-1 min-w-0">
                    {/* Pink Tag Badge matching screenshot */}
                    <div className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#D84A6A] mb-1">
                      <Tag size={12} className="rotate-90" />
                      <span>{item.category || 'Featured'}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#243019] truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#747B68] truncate">
                      {customizations || 'Herbed shredded'}
                    </p>

                    <div className="mt-2 text-sm sm:text-base font-extrabold text-[#315B0B]">
                      ${(item.menuPrice * quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Right Thumbnail & Quantity Controls */}
                  <div className="flex flex-col items-end space-y-2 shrink-0">
                    <div className="w-20 h-16 sm:w-24 sm:h-20 rounded-2xl overflow-hidden bg-stone-100 shadow-xs">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Quantity & Delete Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                        title="Remove from bag"
                        aria-label="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>

                      {/* Quantity Pill matching screenshot */}
                      <div className="flex items-center space-x-2 bg-[#EEF4E3] border border-[#D0D8C2] rounded-full px-2.5 py-1 text-xs font-bold text-[#243019] shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-5 text-center font-extrabold">
                          {quantity < 10 ? `0${quantity}` : quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Rewards Incentive Card matching screenshot */}
            <div className="bg-white rounded-3xl p-5 border border-[#D0D8C2] shadow-xs space-y-3.5">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-[#EEF4E3] border border-[#D0D8C2] flex items-center justify-center text-[#315B0B] shrink-0">
                  <Tag size={16} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#243019]">
                    You're about to get Grillix rewarded
                  </h4>
                  <p className="text-xs text-[#747B68] mt-0.5">
                    You're 350 pts from a Free Rosemary Focaccia!
                  </p>
                </div>
              </div>

              {/* Promo Code Input matching screenshot */}
              <form onSubmit={handleApplyPromo} className="flex items-center space-x-2">
                <div className="flex-1 bg-[#EEF4E3] rounded-2xl border border-[#D0D8C2] px-4 py-2.5">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="w-full bg-transparent text-xs sm:text-sm text-[#243019] placeholder-[#747B68] focus:outline-none font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#315B0B] hover:bg-[#244507] text-white font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95"
                >
                  Add
                </button>
              </form>

              {promoError && (
                <p className="text-[11px] text-red-600 font-semibold">{promoError}</p>
              )}

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs bg-[#EEF4E3] p-2.5 rounded-xl border border-[#315B0B]/30 text-[#315B0B] font-bold">
                  <span>Promo {appliedPromo.code} applied!</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* Subtotal & Checkout Section */}
            <div className="bg-[#E3EBD3] rounded-3xl p-5 border border-[#D0D8C2] shadow-xs space-y-4">
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-xs text-[#747B68] font-semibold border-b border-[#D0D8C2]/60 pb-2">
                  <span>Bag Subtotal</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-xs text-[#315B0B] font-bold border-b border-[#D0D8C2]/60 pb-2">
                  <span>Promo Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm sm:text-base font-bold text-[#243019]">
                <span>Total Due</span>
                <span className="text-[#315B0B] text-lg font-extrabold">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={checkout}
                className="w-full py-4 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-black text-sm sm:text-base tracking-wider uppercase shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight size={18} />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
