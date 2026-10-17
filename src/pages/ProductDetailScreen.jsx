import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Sparkles, 
  ChefHat, 
  Flame, 
  X,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProductDetailScreen = () => {
  const { 
    goBack, 
    selectedProduct, 
    navigateTo, 
    currentTable 
  } = useApp();

  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const product = selectedProduct;

  if (!product) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4 bg-[#EEF4E3]">
        <div className="text-center">
          <p className="text-sm font-bold text-[#243019]">No dish selected.</p>
          <button 
            onClick={() => navigateTo('menu')}
            className="mt-3 px-5 py-2 rounded-full bg-[#315B0B] text-white text-xs font-bold"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25"></div>

            {/* Floating Top Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <button
                onClick={goBack}
                className="w-10 h-10 rounded-full bg-[#244507]/70 hover:bg-[#244507]/90 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all active:scale-95 shadow-md cursor-pointer"
                aria-label="Back to Menu"
                title="Back to Menu"
              >
                <ChevronLeft size={20} />
              </button>

              <span className="bg-[#244507]/80 backdrop-blur-md text-[#A8E83C] text-xs font-black px-3.5 py-1.5 rounded-full border border-white/20 shadow-md">
                Table #{currentTable || '1'} Showcase
              </span>
            </div>
          </div>

          {/* Product Info Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Title & Description */}
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#315B0B] bg-[#EEF4E3] px-2.5 py-0.5 rounded-full">
                  {product.category || "Chef's Signature"}
                </span>
                {product.dietary?.[0] && (
                  <span className="text-[10px] font-bold text-[#747B68] bg-[#F5F8EF] px-2.5 py-0.5 rounded-full">
                    {product.dietary[0]}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#243019] tracking-tight">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#747B68] mt-2.5 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* 4-Item Stats Bar (No Prices, Pure Culinary Details) */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-6 rounded-2xl bg-[#EEF4E3] border border-[#D0D8C2] text-center">
              <div>
                <span className="block text-[9px] sm:text-xs text-[#747B68] font-bold">Calories</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#315B0B]">{product.calories} kcal</span>
              </div>
              <div>
                <span className="block text-[9px] sm:text-xs text-[#747B68] font-bold">Protein</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#243019]">{product.nutrition?.protein || '18g'}</span>
              </div>
              <div>
                <span className="block text-[9px] sm:text-xs text-[#747B68] font-bold">Ingredients</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#243019]">{product.ingredientCount || 8} Fresh</span>
              </div>
              <div>
                <span className="block text-[9px] sm:text-xs text-[#747B68] font-bold">Cook Style</span>
                <span className="text-xs sm:text-sm font-extrabold text-[#315B0B]">Woodfire</span>
              </div>
            </div>

            {/* Macro Breakdown Pills */}
            {product.nutrition && (
              <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[#EEF4E3]/70 border border-[#D0D8C2] text-xs">
                <span className="font-extrabold text-[#243019]">Nutritional Balance:</span>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="text-[#315B0B]">Protein: {product.nutrition.protein}</span>
                  <span className="text-[#747B68]">•</span>
                  <span className="text-[#243019]">Carbs: {product.nutrition.carbs}</span>
                  <span className="text-[#747B68]">•</span>
                  <span className="text-[#747B68]">Fiber: {product.nutrition.fiber}</span>
                  <span className="text-[#747B68]">•</span>
                  <span className="text-[#747B68]">Healthy Fats: {product.nutrition.fat}</span>
                </div>
              </div>
            )}

            {/* Chef's Culinary Philosophy */}
            <div className="p-4 rounded-2xl bg-[#1e3906] text-white flex items-start space-x-3.5 shadow-sm">
              <ChefHat size={22} className="text-[#A8E83C] shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-black text-[#A8E83C] uppercase tracking-wider block text-[11px]">
                  CHEF'S HARVEST PROMISE
                </span>
                <p className="text-[#D0D8C2] leading-relaxed">
                  Crafted strictly from zero-seed-oil cooking fats, 100% organic locally-sourced greens, and slow-roasted proteins grilled over natural applewood charcoal.
                </p>
              </div>
            </div>

            {/* Ingredients Section */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="text-lg font-extrabold text-[#243019]">Farm-to-Table Ingredients</h3>
                <button
                  onClick={() => setShowAllIngredients(true)}
                  className="px-4 py-1.5 rounded-full border border-[#D0D8C2] bg-[#EEF4E3] hover:bg-[#E3EBD3] text-xs font-bold text-[#243019] transition-all cursor-pointer"
                >
                  View All
                </button>
              </div>

              {/* Horizontal Scroll Ingredients Cards */}
              <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
                {product.ingredients?.map((ing) => (
                  <div
                    key={ing.id}
                    className="shrink-0 w-24 sm:w-28 bg-[#EEF4E3] rounded-2xl p-2.5 border border-[#D0D8C2] text-center flex flex-col items-center shadow-xs"
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

            {/* Return to Menu Button */}
            <div className="pt-4 border-t border-[#EEF4E3]">
              <button
                onClick={() => navigateTo('menu')}
                className="w-full py-3.5 px-6 rounded-full bg-[#244507] hover:bg-[#315B0B] text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md transition-all active:scale-[0.99] cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Return to Full Digital Menu</span>
              </button>
            </div>

          </div>
        </div>

        {/* Modal: All Ingredients List */}
        {showAllIngredients && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#EEF4E3] pb-3">
                <h3 className="font-extrabold text-[#243019] text-base">All Recipe Ingredients</h3>
                <button 
                  onClick={() => setShowAllIngredients(false)}
                  className="w-8 h-8 rounded-full bg-[#EEF4E3] flex items-center justify-center text-[#243019]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto no-scrollbar">
                {product.ingredients?.map((ing) => (
                  <div key={ing.id} className="flex items-center space-x-2.5 p-2 rounded-xl bg-[#EEF4E3]">
                    <img 
                      src={ing.image} 
                      alt={ing.name} 
                      className="w-10 h-10 rounded-lg object-cover bg-white" 
                    />
                    <span className="text-xs font-bold text-[#243019]">{ing.name}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowAllIngredients(false)}
                className="w-full py-2.5 rounded-full bg-[#244507] text-white font-bold text-xs"
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
