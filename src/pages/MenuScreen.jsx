import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ShoppingBag, 
  Sparkles, 
  Search, 
  ArrowRight, 
  X,
  ChefHat,
  Flame,
  Salad,
  Soup,
  CupSoda,
  Wheat,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FOOD_ITEMS } from '../data/mockData';

export const MenuScreen = () => {
  const { 
    goBack, 
    navigateTo, 
    setSelectedProduct, 
    addToCart, 
    searchQuery, 
    setSearchQuery, 
    cartItemCount, 
    cartTotal,
    menuItems = FOOD_ITEMS
  } = useApp();

  const [activeCategory, setActiveCategory] = useState('Featured');
  const [activeDiet, setActiveDiet] = useState('All');

  const categoryMeta = [
    { id: 'Featured', label: 'All Featured', icon: Sparkles },
    { id: 'Protein Plates', label: 'Protein Plates', icon: Flame },
    { id: 'Salads', label: 'Fresh Salads', icon: Salad },
    { id: 'Warm Bowls', label: 'Warm Bowls', icon: Soup },
    { id: 'Smoothies & Juices', label: 'Smoothies & Juices', icon: CupSoda },
    { id: 'Sides & Bakery', label: 'Sides & Bakery', icon: Wheat },
  ];

  const diets = ['All', 'High Protein', 'Vegan', 'Gluten-Free', 'Organic'];

  const getCategoryCount = (catId) => {
    if (catId === 'Featured') return menuItems.length;
    return menuItems.filter((item) => 
      item.categories?.includes(catId) || item.category === catId
    ).length;
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === 'Featured' 
      ? true 
      : (item.categories?.includes(activeCategory) || item.category === activeCategory);
    const matchesDiet = activeDiet === 'All' 
      ? true 
      : item.dietary?.includes(activeDiet);
    const matchesSearch = searchQuery 
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesDiet && matchesSearch;
  });

  const handleCardClick = (item) => {
    setSelectedProduct(item);
    navigateTo('product-detail', { product: item });
  };

  const handleQuickAdd = (e, item) => {
    e.stopPropagation();
    addToCart(item, 1);
  };

  return (
    <div className="w-full min-h-screen pb-28 md:pb-16 animate-fadeIn bg-[#EEF4E3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6">
        
        {/* Top App Bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#315B0B] block">
              GRILLIX KITCHEN
            </span>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#243019] tracking-tight">
              Chef's Seasonal Menu
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateTo('cart')}
              className="relative w-10 h-10 rounded-full bg-[#244507] text-[#A8E83C] flex items-center justify-center transition-all active:scale-95 shadow-xs"
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

        {/* Custom Harvest Bowl Callout Banner */}
        <div className="mb-5 bg-gradient-to-r from-[#244507] via-[#2D500B] to-[#1E3906] text-white rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border border-[#315B0B] shadow-sm">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#A8E83C] text-[#244507] flex items-center justify-center shrink-0 shadow-sm">
              <ChefHat size={20} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                Want to build your own bowl?
              </h2>
              <p className="text-xs text-[#D0D8C2] mt-0.5 leading-relaxed">
                Pick your warm grains, roasted vegetables, clean proteins & scratch seed-oil-free dressings.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('custom-bowl')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#A8E83C] hover:bg-white text-[#244507] font-extrabold text-xs whitespace-nowrap transition-all shadow-md active:scale-95 shrink-0 text-center"
          >
            Build Custom Bowl
          </button>
        </div>

        {/* Search & Results Bar */}
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="flex-1 relative flex items-center bg-white rounded-2xl border border-[#D0D8C2] px-3.5 py-2.5 shadow-xs focus-within:border-[#315B0B] transition-colors">
            <Search size={16} className="text-[#747B68] mr-2.5 shrink-0" />
            <input
              type="text"
              placeholder="Search chef's bowls, salads, smoothies, proteins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm text-[#243019] placeholder-[#747B68] focus:outline-none font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="text-[#747B68] hover:text-[#243019] p-0.5"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <span className="text-xs font-bold text-[#315B0B] bg-[#E3EBD3] px-3.5 py-2.5 rounded-2xl border border-[#D0D8C2] whitespace-nowrap shrink-0 shadow-xs">
            {filteredItems.length} Dishes
          </span>
        </div>

        {/* Clean Iconic Category Filter Navigation (Responsive on both Desktop & Mobile) */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 mb-3 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
          {categoryMeta.map((cat) => {
            const isActive = activeCategory === cat.id;
            const Icon = cat.icon;
            const count = getCategoryCount(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all duration-200 flex items-center space-x-2 shrink-0 ${
                  isActive
                    ? 'bg-[#244507] text-[#A8E83C] shadow-md ring-2 ring-[#A8E83C]/40'
                    : 'bg-white text-[#243019] hover:bg-[#E3EBD3] border border-[#D0D8C2] shadow-2xs'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-[#A8E83C]' : 'text-[#315B0B]'} />
                <span>{cat.label}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-[#A8E83C] text-[#0F2002]' : 'bg-[#EEF4E3] text-[#747B68]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Dietary Filter Tags */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-3 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <span className="text-[11px] font-bold text-[#747B68] pr-1.5 shrink-0">Dietary:</span>
          {diets.map((diet) => {
            const active = activeDiet === diet;
            return (
              <button
                key={diet}
                onClick={() => setActiveDiet(diet)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all shrink-0 ${
                  active
                    ? 'bg-[#315B0B] text-white shadow-xs'
                    : 'bg-white text-[#747B68] hover:text-[#243019] border border-[#D0D8C2]'
                }`}
              >
                {diet}
              </button>
            );
          })}
        </div>

        {/* Clean 2-Column Mobile Grid & 3-Column Desktop Grid matching flowchart Screen 2 */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-[#D0D8C2] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
            >
              {/* Top Photography with Overlay Badges & Quick Add */}
              <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-[#EEF4E3]">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/green-veggie-bowl.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"></div>

                {/* Top Badge or Sold Out Badge */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                  {item.isOutOfStock ? (
                    <span className="bg-rose-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-md uppercase tracking-wider inline-block">
                      Sold Out
                    </span>
                  ) : (
                    <span className="bg-[#244507]/85 backdrop-blur-md text-[#A8E83C] text-[9px] sm:text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/15 shadow-sm truncate max-w-[95px] sm:max-w-none inline-block">
                      {item.badge || item.category}
                    </span>
                  )}
                </div>

                {/* Floating Quick Add Circle Button */}
                <button
                  disabled={item.isOutOfStock}
                  onClick={(e) => handleQuickAdd(e, item)}
                  className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-9 sm:h-9 rounded-full backdrop-blur-md border border-white/80 flex items-center justify-center transition-all shadow-md ${
                    item.isOutOfStock
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : 'bg-white/95 hover:bg-[#A8E83C] text-[#244507] active:scale-90 group-hover:scale-105'
                  }`}
                  title={item.isOutOfStock ? "Item Sold Out" : `Quick Add ${item.name}`}
                  aria-label={`Quick Add ${item.name}`}
                >
                  <Plus size={15} strokeWidth={2.8} />
                </button>

                {/* Bottom Overlay Price & Calories */}
                <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between text-white">
                  <span className="text-sm sm:text-lg font-black text-[#A8E83C] drop-shadow-md">
                    ₹{item.menuPrice.toFixed(0)}
                  </span>
                  <span className="text-[9px] sm:text-[11px] font-bold text-white/95 bg-black/45 backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 rounded-full border border-white/10">
                    {item.calories} CALS
                  </span>
                </div>
              </div>

              {/* Card Body Details */}
              <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs sm:text-lg font-extrabold text-[#243019] group-hover:text-[#315B0B] transition-colors leading-snug line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="hidden sm:block text-xs text-[#747B68] mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Nutrition Pills & Quick Add Label */}
                <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-[#EEF4E3] flex items-center justify-between gap-1">
                  <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                    {item.nutrition && (
                      <span className="text-[9px] sm:text-[10px] font-extrabold text-[#315B0B] bg-[#EEF4E3] px-1.5 sm:px-2 py-0.5 rounded-md border border-[#D0D8C2]/60">
                        {item.nutrition.protein}
                      </span>
                    )}
                    {item.dietary?.[0] && (
                      <span className="text-[9px] sm:text-[10px] font-bold text-[#747B68] bg-[#F5F8EF] px-1.5 sm:px-2 py-0.5 rounded-md truncate max-w-[65px] sm:max-w-none">
                        {item.dietary[0]}
                      </span>
                    )}
                  </div>

                  <button
                    disabled={item.isOutOfStock}
                    onClick={(e) => handleQuickAdd(e, item)}
                    className={`text-[11px] sm:text-xs font-black flex items-center space-x-0.5 shrink-0 ${
                      item.isOutOfStock
                        ? 'text-rose-500 cursor-not-allowed'
                        : 'text-[#315B0B] hover:text-[#244507]'
                    }`}
                  >
                    <span>{item.isOutOfStock ? 'Sold Out' : 'Add'}</span>
                    {!item.isOutOfStock && <ShoppingBag size={12} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-[#E3EBD3] rounded-3xl border border-[#D0D8C2] mt-4">
            <Sparkles size={36} className="text-[#315B0B] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#243019]">No dishes match your selection</h3>
            <p className="text-xs text-[#747B68] mt-1">Try resetting the category filter or search term</p>
            <button
              onClick={() => {
                setActiveCategory('Featured');
                setActiveDiet('All');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-[#315B0B] text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Floating Quick Bag Checkout Bar on Mobile */}
        {cartItemCount > 0 && (
          <div className="fixed bottom-20 left-4 right-4 z-30 max-w-md mx-auto animate-fadeIn">
            <button
              onClick={() => navigateTo('cart')}
              className="w-full bg-[#244507] hover:bg-[#315B0B] text-white py-3.5 px-5 rounded-2xl shadow-2xl flex items-center justify-between border border-[#A8E83C]/50 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-full bg-[#A8E83C] text-[#244507] font-black text-xs flex items-center justify-center">
                  {cartItemCount}
                </div>
                <span className="text-xs sm:text-sm font-extrabold tracking-wide">View Bag</span>
              </div>
              <div className="flex items-center space-x-2 font-bold text-xs sm:text-sm text-[#A8E83C]">
                <span>${cartTotal.toFixed(2)}</span>
                <ArrowRight size={16} />
              </div>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
