import React, { useState } from 'react';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Plus, 
  Minus, 
  Trash2, 
  Tag, 
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ChefHat,
  UtensilsCrossed,
  Check
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
    taxAmount,
    currentTable,
    setCurrentTable,
    chefNotes,
    setChefNotes,
    appliedPromo, 
    promoError, 
    applyPromo, 
    checkout,
    navigateTo 
  } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [showTableModal, setShowTableModal] = useState(false);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromo(inputCode);
    }
  };

  const handleConfirmTable = (tNum) => {
    setCurrentTable(tNum);
    try {
      localStorage.setItem('grillix_dinein_table', tNum);
    } catch {}
    setShowTableModal(false);
  };

  return (
    <div className="w-full min-h-screen pb-32 md:pb-16 animate-fadeIn bg-[#EEF4E3]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-extrabold text-[#243019] tracking-tight">
              Table #{currentTable} Order
            </h1>
            <span className="text-[11px] font-bold text-[#315B0B] block">Dine-In • Fresh Central Kitchen</span>
          </div>

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
            <h2 className="text-xl font-extrabold text-[#243019]">Your table order is empty</h2>
            <p className="text-xs text-[#747B68] mt-1.5 max-w-sm mx-auto">
              Scan through our fresh menu and add grain bowls, organic salads, and fresh drinks to Table #{currentTable}.
            </p>
            <button
              onClick={() => navigateTo('menu')}
              className="mt-6 px-6 py-3 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              Explore Menu Card
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Dine-In Table Identity Banner */}
            <div className="bg-gradient-to-r from-[#244507] via-[#2D500B] to-[#1E3906] text-white rounded-3xl p-4 sm:p-5 flex items-center justify-between border border-[#315B0B] shadow-sm">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#A8E83C] text-[#0F2002] flex items-center justify-center font-black text-xl shadow-md shrink-0">
                  {currentTable}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-sm sm:text-base text-white">Dine-In • Table #{currentTable}</span>
                    <span className="bg-[#A8E83C]/20 border border-[#A8E83C]/40 text-[#A8E83C] text-[10px] font-black px-2 py-0.5 rounded-full">
                      Seated
                    </span>
                  </div>
                  <p className="text-xs text-white/80">Moshi Flagship Kitchen • Direct Table Service</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTableModal(true)}
                className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all shrink-0 active:scale-95"
              >
                Change Table
              </button>
            </div>

            {/* Cart Items List */}
            {cart.map((entry) => {
              const { item, quantity, customizations } = entry;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-[#D0D8C2] shadow-xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-[#D0D8C2]/60 shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-xs sm:text-sm text-[#243019] truncate">
                        {item.name}
                      </h3>
                      <p className="text-[#315B0B] font-black text-xs sm:text-sm mt-0.5">
                        ₹{item.menuPrice}
                      </p>
                      {customizations && customizations.length > 0 && (
                        <p className="text-[10px] text-[#747B68] truncate mt-0.5">
                          {customizations.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <div className="flex items-center space-x-1.5 bg-[#EEF4E3] border border-[#D0D8C2] rounded-full p-1">
                      <button
                        onClick={() => updateQuantity(item.id, quantity - 1)}
                        className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#243019] hover:bg-[#E3EBD3] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        {quantity === 1 ? <Trash2 size={12} className="text-red-500" /> : <Minus size={12} />}
                      </button>
                      <span className="w-5 text-center text-xs font-black text-[#243019]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, quantity + 1)}
                        className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#243019] hover:bg-[#E3EBD3] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Special Chef Instructions */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#D0D8C2] shadow-xs space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-[#243019]">
                <ChefHat size={16} className="text-[#315B0B]" />
                <span>Special Instructions for Kitchen Chef</span>
              </div>
              <input
                type="text"
                value={chefNotes}
                onChange={(e) => setChefNotes(e.target.value)}
                placeholder="e.g. Less spicy, dressing on side, extra napkins, serve drinks first..."
                className="w-full bg-[#EEF4E3] border border-[#D0D8C2] rounded-2xl px-3.5 py-2.5 text-xs text-[#243019] placeholder-[#747B68] focus:outline-none focus:border-[#315B0B] font-medium"
              />
            </div>

            {/* Promo Code Section */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#D0D8C2] shadow-xs space-y-3">
              <form onSubmit={handleApplyPromo} className="flex items-center space-x-2">
                <div className="flex-1 flex items-center space-x-2 bg-[#EEF4E3] border border-[#D0D8C2] rounded-2xl px-3.5 py-2.5">
                  <Tag size={16} className="text-[#747B68] shrink-0" />
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Enter dining voucher code"
                    className="w-full bg-transparent text-xs sm:text-sm text-[#243019] placeholder-[#747B68] focus:outline-none font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#315B0B] hover:bg-[#244507] text-white font-bold text-xs sm:text-sm transition-all shadow-xs active:scale-95"
                >
                  Apply
                </button>
              </form>

              {promoError && (
                <p className="text-[11px] text-red-600 font-semibold">{promoError}</p>
              )}

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs bg-[#EEF4E3] p-2.5 rounded-xl border border-[#315B0B]/30 text-[#315B0B] font-bold">
                  <span>Voucher {appliedPromo.code} applied!</span>
                  <span>-₹{discountAmount.toFixed(0)}</span>
                </div>
              )}
            </div>

            {/* Subtotal & Checkout Section */}
            <div className="bg-[#E3EBD3] rounded-3xl p-5 border border-[#D0D8C2] shadow-xs space-y-3.5">
              
              <div className="flex items-center justify-between text-xs text-[#747B68] font-semibold border-b border-[#D0D8C2]/60 pb-2">
                <span>Dishes Subtotal</span>
                <span className="text-[#243019] font-bold">₹{cartSubtotal.toFixed(0)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-xs text-[#315B0B] font-bold border-b border-[#D0D8C2]/60 pb-2">
                  <span>Voucher Discount ({appliedPromo?.code})</span>
                  <span>-₹{discountAmount.toFixed(0)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-[#747B68] font-semibold border-b border-[#D0D8C2]/60 pb-2">
                <div className="flex items-center space-x-1">
                  <span>Table Service & Cutlery</span>
                  <span className="text-[10px] text-[#315B0B] bg-white/70 px-1.5 py-0.2 rounded font-mono font-bold">
                    Dine-In
                  </span>
                </div>
                <span className="text-[#315B0B] font-black">
                  FREE
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#747B68] font-semibold border-b border-[#D0D8C2]/60 pb-2">
                <span>Restaurant GST (5%)</span>
                <span className="text-[#243019] font-bold">₹{taxAmount.toFixed(0)}</span>
              </div>

              <div className="flex items-center justify-between text-base font-extrabold text-[#243019] pt-1">
                <span>Total to Pay</span>
                <span className="text-[#315B0B] text-xl font-black">
                  ₹{cartTotal.toFixed(0)}
                </span>
              </div>

              <button
                onClick={checkout}
                className="w-full py-4 rounded-full font-black text-sm sm:text-base tracking-wider uppercase shadow-md transition-all duration-200 flex items-center justify-center space-x-2 bg-[#315B0B] hover:bg-[#244507] text-white hover:shadow-lg active:scale-[0.98]"
              >
                <span>SEND ORDER TO KITCHEN</span>
                <ArrowRight size={18} />
              </button>
            </div>

          </div>
        )}

        {/* Change Table Modal */}
        {showTableModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-[#D0D8C2] animate-scale">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF4E3] text-[#315B0B] flex items-center justify-center mx-auto mb-2">
                  <UtensilsCrossed size={22} />
                </div>
                <h3 className="text-base font-black text-[#243019]">Select Your Dining Table</h3>
                <p className="text-xs text-[#747B68] mt-0.5">Which table are you currently seated at?</p>
              </div>

              <div className="grid grid-cols-4 gap-2 py-2">
                {['1', '2', '3', '4', '5', '6', '7', '8'].map(num => (
                  <button
                    key={num}
                    onClick={() => handleConfirmTable(num)}
                    className={`py-3 rounded-2xl font-black text-sm transition-all flex flex-col items-center justify-center ${
                      currentTable === num
                        ? 'bg-[#315B0B] text-white shadow-md ring-2 ring-[#A8E83C]'
                        : 'bg-[#EEF4E3] text-[#243019] hover:bg-[#E3EBD3]'
                    }`}
                  >
                    <span>#{num}</span>
                    <span className="text-[9px] font-normal opacity-80">Table</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowTableModal(false)}
                className="w-full py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
