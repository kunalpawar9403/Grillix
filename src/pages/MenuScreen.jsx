import React, { useState } from 'react';
import { 
  ChevronLeft, 
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
  Bell,
  UtensilsCrossed,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FOOD_ITEMS } from '../data/mockData';

export const MenuScreen = () => {
  const { 
    goBack, 
    navigateTo, 
    setSelectedProduct, 
    searchQuery, 
    setSearchQuery, 
    menuItems = FOOD_ITEMS,
    currentTable,
    callWaiter
  } = useApp();

  const [activeCategory, setActiveCategory] = useState('Featured');
  const [activeDiet, setActiveDiet] = useState('All');

  const categoryMeta = [
    { id: 'Featured', label: 'All Featured', icon: Sparkles },
    { id: 'Protein Plates', label: 'Live Fire Grills', icon: Flame },
    { id: 'Salads', label: 'Fresh Salads', icon: Salad },
    { id: 'Warm Bowls', label: 'Artisan Bowls', icon: Soup },
    { id: 'Smoothies & Juices', label: 'Craft Beverages', icon: CupSoda },
    { id: 'Sides & Bakery', label: 'Sides & Bakery', icon: Wheat },
  ];

  const diets = ['All', 'High Protein', 'Vegan', 'Gluten-Free', 'Organic'];

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

  return (
    <div className="w-full min-h-screen pb-28 md:pb-16 animate-fadeIn bg-[#EEF4E3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6">
        
        {/* Top App Bar with Table & Dine-In Status */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <button
            onClick={() => navigateTo('home')}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs shrink-0 cursor-pointer"
            aria-label="Back to Restaurant"
            title="Restaurant Home"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="text-center min-w-0">
            <span className="inline-flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-wider bg-[#E3EBD3] border border-[#315B0B]/30 px-3 py-1 rounded-full text-[#244507] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#315B0B] animate-pulse"></span>
              <span>Table #{currentTable || '1'} • Digital Menu</span>
            </span>
            <h1 className="text-base sm:text-2xl font-black text-[#243019] tracking-tight truncate mt-0.5">
              Chef's Culinary Menu
            </h1>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => callWaiter('Assistance')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] text-[#244507] font-bold text-xs transition-all active:scale-95 shadow-xs cursor-pointer"
              title="Call server to your table"
              aria-label="Call Server"
            >
              <Bell size={15} className="text-[#315B0B]" />
              <span className="hidden sm:inline">Call Server</span>
            </button>
          </div>
        </div>

        {/* Welcome Dine-In Banner when scanned from QR */}
        <div className="mb-5 bg-gradient-to-r from-[#244507] via-[#2D500B] to-[#1E3906] text-white rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#315B0B] shadow-md relative overflow-hidden">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#A8E83C] text-[#244507] flex items-center justify-center shrink-0 shadow-sm font-black text-lg">
              #{currentTable || '1'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#A8E83C]">
                  GRILLIX SMOKEHOUSE & KITCHEN
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-white/90">
                  Dine-In
                </span>
              </div>
              <h2 className="text-sm sm:text-lg font-black text-white mt-0.5">
                Welcome to Table #{currentTable || '1'}
              </h2>
              <p className="text-xs text-[#D0D8C2] mt-0.5 leading-relaxed max-w-xl">
                Browse our woodfire grilled specialties, hand-tossed bowls & craft beverages. Tap any dish to explore its farm-to-table ingredients.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs shrink-0 bg-black/25 px-4 py-2 rounded-2xl border border-white/10 self-start sm:self-auto">
            <UtensilsCrossed size={16} className="text-[#A8E83C]" />
            <div>
              <div className="text-[10px] text-[#A8E83C] font-black">CHEF PREPARATION</div>
              <div className="font-bold text-white text-[11px]">100% Scratch-Cooked Daily</div>
            </div>
          </div>
        </div>

        {/* Search & Results Bar */}
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="flex-1 relative flex items-center bg-white rounded-2xl border border-[#D0D8C2] px-3.5 py-2.5 shadow-xs focus-within:border-[#315B0B] transition-colors">
            <Search size={16} className="text-[#747B68] mr-2.5 shrink-0" />
            <input
              type="text"
              placeholder="Search dishes by name, vegetables, meats, spices..."
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
        </div>

        {/* Categories Carousel Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
          {categoryMeta.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#244507] text-[#A8E83C] shadow-sm'
                    : 'bg-white text-[#243019] border border-[#D0D8C2] hover:bg-[#E3EBD3]'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#A8E83C]' : 'text-[#315B0B]'} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dietary Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-3 mb-5 no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-[#747B68] mr-1 hidden sm:inline">Dietary:</span>
          {diets.map((diet) => (
            <button
              key={diet}
              onClick={() => setActiveDiet(diet)}
              className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                activeDiet === diet
                  ? 'bg-[#315B0B] text-white shadow-2xs'
                  : 'bg-[#E3EBD3] text-[#4F5945] hover:bg-[#D5E1C3]'
              }`}
            >
              {diet}
            </button>
          ))}
        </div>

        {/* Pure Showcase Dishes Grid (No Prices, No Add to Cart) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="group bg-white rounded-3xl overflow-hidden border border-[#D0D8C2] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
            >
              {/* Top Photography with Overlay Badges */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EEF4E3]">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/images/green-veggie-bowl.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                {/* Top Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-[#244507]/90 backdrop-blur-md text-[#A8E83C] text-[10px] font-black px-2.5 py-1 rounded-full border border-white/15 shadow-sm inline-block">
                    {item.badge || item.category}
                  </span>
                </div>

                {/* Calories Indicator */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-[10px] font-bold text-white/95 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                    🔥 {item.calories} Calories
                  </span>
                  {item.nutrition?.protein && (
                    <span className="text-[10px] font-bold text-[#A8E83C] bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      {item.nutrition.protein}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body Details */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#243019] group-hover:text-[#315B0B] transition-colors leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#747B68] mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Dietary Tags & Explore Link */}
                <div className="pt-3 border-t border-[#EEF4E3] flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                    {item.dietary?.slice(0, 2).map((d, idx) => (
                      <span key={idx} className="text-[10px] font-bold text-[#315B0B] bg-[#EEF4E3] px-2 py-0.5 rounded-md">
                        {d}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-black text-[#315B0B] group-hover:text-[#244507] flex items-center space-x-1 shrink-0">
                    <span>Recipe Info</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-[#E3EBD3] rounded-3xl border border-[#D0D8C2] mt-4">
            <Sparkles size={36} className="text-[#315B0B] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#243019]">No culinary dishes match your selection</h3>
            <p className="text-xs text-[#747B68] mt-1">Try resetting the category filter or search term</p>
            <button
              onClick={() => {
                setActiveCategory('Featured');
                setActiveDiet('All');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-[#315B0B] text-white text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
