import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Plus, 
  Clock, 
  ChevronRight,
  ShoppingBag,
  ChefHat,
  ArrowRight,
  LogIn
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FOOD_ITEMS } from '../data/mockData';

export const HomeScreen = () => {
  const { 
    navigateTo, 
    addToCart, 
    setSearchQuery, 
    showToast,
    setSelectedProduct,
    currentUser,
    cartItemCount,
    currentTable
  } = useApp();

  const [activeSearch, setActiveSearch] = useState('');
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  const heroSlides = [
    {
      id: 0,
      image: '/images/hero-spinach.jpg',
      tag: 'Seasonal Harvest',
      subtag: '100% Organic Local Greens',
      title: 'Eat Fresh. Feel Good.',
      desc: 'Fuel your wellness journey with nutrient-packed greens, slow-roasted proteins, and scratch-made superfood dressings.'
    },
    {
      id: 1,
      image: '/images/fresh-salad-bowl.jpg',
      tag: "Chef's Signature",
      subtag: 'Scratch-Crafted Daily',
      title: 'Nourish Your Body.',
      desc: 'Farm-to-fork harvest bowls bursting with vibrant crisp produce, warm grains, and clean proteins.'
    },
    {
      id: 2,
      image: '/images/rainbow-quinoa-bowl.jpg',
      tag: 'Custom Kitchen',
      subtag: '100% Seed-Oil-Free',
      title: 'Built For Wellness.',
      desc: 'Explore custom macro targets, wholesome warm grain foundations, and nutrient-dense dressings.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    } else if (diff < -45) {
      setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
    setTouchStartX(null);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (activeSearch.trim()) {
      setSearchQuery(activeSearch);
      navigateTo('menu');
    }
  };

  const handleAddQuick = (e, item) => {
    e.stopPropagation();
    addToCart(item, 1);
  };

  return (
    <div className="w-full pb-28 md:pb-16 animate-fadeIn">
      {/* Mobile Top App Bar: Brand Logo & Name on Left, Login on Right */}
      <div className="md:hidden px-4 sm:px-5 py-3 flex items-center justify-between gap-2.5">
        {/* Left Side: Brand Logo and Name */}
        <button 
          onClick={() => navigateTo('home')} 
          className="flex items-center space-x-2 text-left focus:outline-none shrink-0 group"
          aria-label="GRILLIX Home"
        >
          <div className="w-9 h-9 rounded-xl bg-[#315B0B] flex items-center justify-center text-white shadow-xs group-hover:bg-[#244507] transition-all">
            <svg className="w-5 h-5 text-[#A8E83C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-[#244507] leading-none block">
              GRILLIX
            </span>
            <span className="block text-[9px] uppercase font-bold tracking-wider text-[#747B68] leading-tight">
              Fresh & Healthy
            </span>
          </div>
        </button>

        {/* Right Side: Cart & Login / User Account */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* Cart Bag button with live badge */}
          <button
            onClick={() => navigateTo('cart')}
            className="relative w-9 h-9 rounded-full bg-[#244507] text-[#A8E83C] flex items-center justify-center active:scale-95 transition-all shadow-xs shrink-0"
            aria-label="Shopping Bag Cart"
            title="View Cart"
          >
            <ShoppingBag size={17} strokeWidth={2.2} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-[#A8E83C] text-[#0F2002] font-black text-xs leading-none rounded-full flex items-center justify-center border-2 border-white shadow-md ring-1 ring-black/15 select-none animate-scale">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Dine-In Table Badge on Right (No Profile Needed) */}
          <button 
            onClick={() => navigateTo('cart')} 
            className="flex items-center space-x-1.5 bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#315B0B]/30 px-3 py-1.5 rounded-full text-xs font-black text-[#244507] shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
            aria-label="Table Order"
            title={`Dine-in Table #${currentTable}`}
          >
            <span className="w-2 h-2 rounded-full bg-[#315B0B] animate-pulse"></span>
            <span>Table #{currentTable}</span>
          </button>
        </div>
      </div>

      {/* Hero Section Container with continuous sliding multi-image carousel */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-3 sm:mt-4 md:mt-6 lg:mt-8">
        <div 
          className="relative rounded-3xl md:rounded-4xl overflow-hidden shadow-lg border border-[#D0D8C2]/50 group"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Hero Height Container */}
          <div className="relative h-[380px] sm:h-[430px] md:h-[480px] lg:h-[520px] w-full overflow-hidden">
            
            {/* Continuous Sliding Image Track */}
            <div 
              className="flex w-full h-full transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentHeroSlide * 100}%)` }}
            >
              {heroSlides.map((slide) => (
                <div key={slide.id} className="w-full h-full shrink-0 relative">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05]"
                  />
                  {/* Soft gradient overlays for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#244507]/85 via-[#244507]/35 to-black/30"></div>
                </div>
              ))}
            </div>
            
            {/* Top Desktop Headline & Badge (Desktop only) */}
            <div className="absolute top-6 left-8 hidden md:flex items-center space-x-3 z-20 pointer-events-none">
              <span className="bg-[#A8E83C] text-[#244507] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm transition-all duration-300">
                {heroSlides[currentHeroSlide].tag}
              </span>
              <span className="text-white/90 text-xs font-semibold backdrop-blur-md bg-black/20 px-3 py-1 rounded-full transition-all duration-300">
                {heroSlides[currentHeroSlide].subtag}
              </span>
            </div>

            {/* Carousel Dots indicator matching Screen 1 in flowchart - Interactive & Animated */}
            <div className="absolute top-4 right-4 flex items-center space-x-1.5 z-20">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentHeroSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentHeroSlide === idx
                      ? 'w-6 bg-[#A8E83C]'
                      : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Hero Headlines (Live transition matching active slide) */}
            <div className="absolute bottom-24 sm:bottom-28 left-5 sm:left-8 right-5 sm:right-8 z-20 pointer-events-none">
              <span className="text-[#A8E83C] text-[11px] sm:text-xs font-black uppercase tracking-wider block mb-1 drop-shadow-xs">
                GRILLIX FRESH HARVEST • 0{currentHeroSlide + 1}
              </span>
              <h1 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-md leading-tight transition-all duration-300">
                {heroSlides[currentHeroSlide].title}
              </h1>
              <p className="hidden md:block text-[#EEF4E3]/90 text-sm md:text-base max-w-xl mt-2 leading-relaxed drop-shadow-sm transition-all duration-300">
                {heroSlides[currentHeroSlide].desc}
              </p>
            </div>

            {/* Floating Search Bar on bottom of Hero */}
            <div className="absolute bottom-5 left-4 right-4 sm:left-8 sm:right-8 z-20">
              <form 
                onSubmit={handleSearchSubmit}
                className="flex items-center space-x-2"
              >
                <div className="flex-1 relative flex items-center bg-[#2B470E]/80 hover:bg-[#2B470E]/90 focus-within:bg-[#223B0A]/95 backdrop-blur-md rounded-2xl md:rounded-full border border-white/20 px-4 py-3 sm:py-3.5 transition-all shadow-md">
                  <Search size={18} className="text-[#A8E83C] mr-3 shrink-0" />
                  <input
                    type="text"
                    value={activeSearch}
                    onChange={(e) => setActiveSearch(e.target.value)}
                    placeholder="Search Menu for Order • Everywhere"
                    className="w-full bg-transparent text-sm sm:text-base text-white placeholder-white/70 focus:outline-none"
                  />
                </div>

                {/* Right Sparkle / AI Star Button */}
                <button
                  type="button"
                  onClick={() => {
                    showToast('AI Nutrition Assistant: Analyzing your healthy profile...');
                    setTimeout(() => {
                      navigateTo('menu');
                    }, 500);
                  }}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl md:rounded-full bg-[#3B5B16]/90 hover:bg-[#4E761E] border border-white/25 backdrop-blur-md flex items-center justify-center text-[#A8E83C] shadow-md transition-all active:scale-95 shrink-0"
                  aria-label="AI Recommendations"
                  title="AI Personalized Nutrition"
                >
                  <Sparkles size={22} className="animate-pulse-subtle" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Section Ordering: Mobile shows Products first then Bowl Banner, Desktop shows Bowl Banner first */}
      <div className="flex flex-col">
        {/* NEW FEATURE: Build Your Own Harvest Bowl Feature Callout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10 md:mt-12 order-2 md:order-1 w-full">
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#244507] via-[#2F530B] to-[#1E3A06] text-white shadow-md border border-[#315B0B] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="relative z-10 space-y-2 text-center md:text-left max-w-xl">
              <div className="inline-flex items-center space-x-2 bg-[#A8E83C] text-[#244507] text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                <ChefHat size={14} />
                <span>Interactive Bowl Builder</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Build Your Custom Harvest Bowl
              </h2>
              <p className="text-xs sm:text-sm text-[#D0D8C2] leading-relaxed">
                Design your personalized meal with warm wild grains, farm-fresh roasted veggies, clean proteins, and scratch seed-oil-free dressings with live macro calculation.
              </p>
              {currentUser?.dietary?.length > 0 && (
                <div className="pt-1 flex flex-wrap gap-1.5 justify-center md:justify-start">
                  <span className="text-[11px] text-[#A8E83C] font-bold">Preferences active:</span>
                  {currentUser.dietary.map(d => (
                    <span key={d} className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-white/90 font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigateTo('custom-bowl')}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#A8E83C] hover:bg-white text-[#244507] font-extrabold text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 group"
              >
                <span>Start Building Bowl</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-[#A8E83C]/10 rounded-full blur-2xl pointer-events-none"></div>
          </div>
        </div>

        {/* AI Personalized Picks (Products) Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10 md:mt-12 order-1 md:order-2 w-full">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#243019] tracking-tight">
                AI Personalized Picks
              </h2>
              <span className="hidden sm:inline-block bg-[#A8E83C]/40 text-[#244507] text-[11px] font-bold px-2 py-0.5 rounded-full">
                Tailored for you
              </span>
            </div>

            <button
              onClick={() => navigateTo('menu')}
              className="text-sm font-semibold text-[#315B0B] hover:text-[#244507] flex items-center space-x-1 group"
            >
              <span>See More</span>
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Horizontal Scroll on Mobile / Multi-column Grid on Desktop */}
          <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 scroll-smooth">
            {FOOD_ITEMS.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedProduct(item);
                  navigateTo('product-detail', { product: item });
                }}
                className="group cursor-pointer shrink-0 w-[170px] sm:w-[210px] md:w-auto relative rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-[#D0D8C2]/70 bg-[#E3EBD3] transition-all duration-300 hover:-translate-y-1"
              >
                {/* Food Image */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#244507]/10">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/green-veggie-bowl.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Quick Add Button */}
                  <button
                    onClick={(e) => handleAddQuick(e, item)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/40 hover:bg-[#A8E83C] hover:text-[#244507] backdrop-blur-md border border-white/60 flex items-center justify-center text-white transition-all shadow-sm active:scale-90"
                    aria-label={`Add ${item.name} to bag`}
                    title="Quick Add to Bag"
                  >
                    <Plus size={16} strokeWidth={2.6} />
                  </button>

                  {/* Category or Tag Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#244507]/75 backdrop-blur-sm text-[#A8E83C] text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10">
                      ₹{item.menuPrice.toFixed(0)}
                    </span>
                  </div>

                  {/* Card Bottom Label */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs font-semibold leading-tight line-clamp-2 drop-shadow-sm group-hover:text-[#A8E83C] transition-colors">
                      {item.tagline || item.name}
                    </p>
                    <span className="text-[10px] text-white/70 block mt-0.5">
                      {item.calories} CALS • {item.deliveryTime}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Restaurant Discovery Teaser */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14">
        <div className="bg-[#E3EBD3] rounded-3xl p-6 sm:p-8 border border-[#D0D8C2] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 bg-[#315B0B] text-[#A8E83C] text-xs font-bold px-3 py-1 rounded-full">
              <Clock size={13} />
              <span>Kitchens Open Now</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#243019]">
              Nearest Kitchen: Park Meadows
            </h3>
            <p className="text-sm text-[#747B68] max-w-lg">
              8423 Park Meadows Center Drive #E160 Lone Tree, CO • Pickup ready in 15-20 mins
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={() => navigateTo('discovery')}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-bold text-sm shadow-md transition-all active:scale-95 text-center"
            >
              View Map & Locations
            </button>
            <button
              onClick={() => navigateTo('menu')}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-full bg-white hover:bg-[#F5F8EF] text-[#244507] font-bold text-sm border border-[#D0D8C2] transition-all text-center"
            >
              Order Online
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
