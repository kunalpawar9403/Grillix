import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Plus, 
  Minus, 
  ShoppingBag, 
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProductDetailScreen = () => {
  const { 
    goBack, 
    selectedProduct, 
    addToCart, 
    navigateTo, 
    cartItemCount
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  const product = selectedProduct;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setTimeout(() => {
      navigateTo('cart');
    }, 400);
  };

  return (
    <div className="w-full min-h-screen pb-28 md:pb-16 animate-fadeIn bg-[#EEF4E3]">
      <div className="max-w-4xl mx-auto px-0 sm:px-6 lg:px-8 pt-0 sm:pt-4">
        
        {/* Main Card Container */}
        <div className="bg-white rounded-none sm:rounded-4xl overflow-hidden border-b sm:border border-[#D0D8C2] shadow-sm">
          
          {/* Top Hero Food Photography */}
          <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full bg-[#E3EBD3]">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/green-veggie-bowl.jpg';
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25"></div>

            {/* Floating Top Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <button
                onClick={goBack}
                className="w-10 h-10 rounded-full bg-[#244507]/60 hover:bg-[#244507]/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all active:scale-95 shadow-md"
                aria-label="Back"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => navigateTo('cart')}
                className="relative w-10 h-10 rounded-full bg-[#244507]/70 hover:bg-[#244507]/90 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#A8E83C] transition-all active:scale-95 shadow-md"
                aria-label="Shopping Bag Cart"
                title="View Cart"
              >
                <ShoppingBag size={18} strokeWidth={2.2} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-[#A8E83C] text-[#0F2002] font-black text-xs leading-none rounded-full flex items-center justify-center border-2 border-white shadow-md ring-1 ring-black/15 select-none animate-scale">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Product Info Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Title & Description */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#243019] tracking-tight">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#747B68] mt-2.5 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* 4-Item Stats Bar matching screenshot */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-6 rounded-2xl bg-[#EEF4E3] border border-[#D0D8C2] text-center">
              <div>
                <span className="block text-[9px] sm:text-xs text-[#747B68] font-bold">Menu Price</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#315B0B]">${product.menuPrice.toFixed(2)}</span>
              </div>
              <div>
                <span className="block text-[9px] sm:text-xs text-[#747B68] font-bold">Est. Calories</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#243019]">{product.calories}</span>
              </div>
              <div>
                <span className="block text-[9px] sm:text-xs text-[#747B68] font-bold">Ingredients</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#243019]">{product.ingredientCount}</span>
              </div>
              <div>
                <span className="block text-[9px] sm:text-xs text-[#747B68] font-bold">Delivery</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#243019]">{product.deliveryTime}</span>
              </div>
            </div>

            {/* Macro Breakdown Pills */}
            {product.nutrition && (
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 sm:p-3.5 rounded-2xl bg-[#EEF4E3]/70 border border-[#D0D8C2] text-xs">
                <span className="font-extrabold text-[#243019]">Macros:</span>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold">
                  <span className="text-[#315B0B] bg-white sm:bg-transparent px-1.5 py-0.5 rounded sm:rounded-none">P: {product.nutrition.protein}</span>
                  <span className="text-[#747B68] hidden sm:inline">•</span>
                  <span className="text-[#243019] bg-white sm:bg-transparent px-1.5 py-0.5 rounded sm:rounded-none">C: {product.nutrition.carbs}</span>
                  <span className="text-[#747B68] hidden sm:inline">•</span>
                  <span className="text-[#747B68] bg-white sm:bg-transparent px-1.5 py-0.5 rounded sm:rounded-none">Fiber: {product.nutrition.fiber}</span>
                  <span className="text-[#747B68] hidden sm:inline">•</span>
                  <span className="text-[#747B68] bg-white sm:bg-transparent px-1.5 py-0.5 rounded sm:rounded-none">Fat: {product.nutrition.fat}</span>
                </div>
              </div>
            )}

            {/* Ingredients Section */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="text-lg font-extrabold text-[#243019]">Ingredients</h3>
                <button
                  onClick={() => setShowAllIngredients(true)}
                  className="px-4 py-1.5 rounded-full border border-[#D0D8C2] bg-[#EEF4E3] hover:bg-[#E3EBD3] text-xs font-bold text-[#243019] transition-all"
                >
                  See All
                </button>
              </div>

              {/* Horizontal Scroll Ingredients Cards matching reference */}
              <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
                {product.ingredients?.map((ing) => (
                  <div
                    key={ing.id}
                    className="shrink-0 w-24 sm:w-28 bg-[#EEF4E3] rounded-2xl p-2 border border-[#D0D8C2] text-center flex flex-col items-center shadow-xs"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white mb-2 shadow-inner">
                      <img
                        src={ing.image}
                        alt={ing.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/spinach-ingredient.jpg';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-bold text-[#243019] truncate w-full italic">
                      {ing.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions: Quantity Selector & Add to Bag */}
            <div className="pt-4 border-t border-[#EEF4E3] flex items-center space-x-4">
              {/* Quantity selector pill */}
              <div className="flex items-center space-x-3 bg-[#EEF4E3] border border-[#D0D8C2] rounded-full px-3 py-2 shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#243019] hover:bg-[#E3EBD3] transition-colors shadow-xs"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="font-extrabold text-sm text-[#243019] w-6 text-center">
                  {quantity < 10 ? `0${quantity}` : quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full bg-[#315B0B] flex items-center justify-center text-white hover:bg-[#244507] transition-colors shadow-xs"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-6 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <ShoppingBag size={18} />
                <span>Add to Bag • ${(product.menuPrice * quantity).toFixed(2)}</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* "See All" Ingredients Modal */}
      {showAllIngredients && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#EEF4E3] max-w-lg w-full rounded-3xl p-6 border border-[#D0D8C2] shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D0D8C2]">
              <div>
                <h3 className="text-xl font-bold text-[#243019]">Complete Ingredients</h3>
                <p className="text-xs text-[#747B68]">100% farm-traceable, non-GMO produce</p>
              </div>
              <button
                onClick={() => setShowAllIngredients(false)}
                className="p-2 rounded-full hover:bg-[#D5E1C3] text-[#243019]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {product.ingredients?.map((ing) => (
                <div key={ing.id} className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-[#D0D8C2]">
                  <img src={ing.image} alt={ing.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#243019]">{ing.name}</h4>
                    <p className="text-xs text-[#747B68]">{ing.amount}</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#315B0B] bg-[#EEF4E3] px-2 py-0.5 rounded-full">
                    Organic
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowAllIngredients(false)}
                className="w-full py-3 rounded-full bg-[#315B0B] text-white font-bold text-sm shadow-md"
              >
                Close Ingredients
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
