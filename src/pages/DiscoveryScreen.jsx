import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Crosshair, 
  Search, 
  Sparkles, 
  Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANTS } from '../data/mockData';

export const DiscoveryScreen = () => {
  const { 
    goBack, 
    navigateTo, 
    discoveryFilter, 
    setDiscoveryFilter,
    setSelectedRestaurant,
    showToast 
  } = useApp();

  const [searchLocation, setSearchLocation] = useState('Center Drive #E160Lone');

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    navigateTo('restaurant-detail', { restaurant });
  };

  return (
    <div className="w-full min-h-screen pb-28 md:pb-12 animate-fadeIn bg-[#EEF4E3]">
      {/* Container - Responsive layout: mobile full height stack, desktop 2-column */}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 pt-0 sm:pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6">
          
          {/* Map Column (Mobile: top portion; Desktop: interactive left panel) */}
          <div className="lg:col-span-7 relative h-[420px] sm:h-[460px] lg:h-[680px] rounded-none sm:rounded-3xl overflow-hidden shadow-sm bg-[#385514]">
            
            {/* SVG Interactive Stylized Street Map */}
            <div className="absolute inset-0 select-none overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 500 500" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2F4711" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="#385514" />
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Stylized road network */}
                {/* Diagonal Highway */}
                <path d="M-50,450 L550,-50" stroke="#48691A" strokeWidth="24" strokeLinecap="round" />
                <path d="M-50,450 L550,-50" stroke="#53791E" strokeWidth="18" strokeLinecap="round" />
                
                {/* Cross Avenue */}
                <path d="M-20,100 L520,380" stroke="#48691A" strokeWidth="20" />
                <path d="M-20,100 L520,380" stroke="#53791E" strokeWidth="14" />
                
                {/* Vertical Broadway */}
                <path d="M410,-20 L410,520" stroke="#48691A" strokeWidth="16" />
                <path d="M410,-20 L410,520" stroke="#53791E" strokeWidth="10" />

                {/* Curved Waterfront */}
                <path d="M50,-20 C120,180 180,300 250,520" fill="none" stroke="#48691A" strokeWidth="18" />
                <path d="M50,-20 C120,180 180,300 250,520" fill="none" stroke="#53791E" strokeWidth="12" />

                {/* Secondary streets */}
                <path d="M120,140 L380,140" stroke="#466619" strokeWidth="8" strokeDasharray="6,4" />
                <path d="M160,260 L460,260" stroke="#466619" strokeWidth="8" />
                <path d="M220,50 L220,360" stroke="#466619" strokeWidth="8" />
                <path d="M30,300 L260,300" stroke="#466619" strokeWidth="8" />

                {/* Street Name Typography Overlays matching screenshot */}
                <text x="60" y="110" fill="#759C39" fontSize="9" fontWeight="700" letterSpacing="1.2" transform="rotate(-35 60 110)">HYDE PARK</text>
                <text x="140" y="160" fill="#759C39" fontSize="9" fontWeight="700" letterSpacing="1.5" transform="rotate(30 140 160)">HUDSON SQUARE</text>
                <text x="60" y="270" fill="#759C39" fontSize="9" fontWeight="700" letterSpacing="1.2" transform="rotate(22 60 270)">MILLENNIUM PARK</text>
                <text x="395" y="80" fill="#759C39" fontSize="9" fontWeight="700" letterSpacing="1.5">BROADWAY</text>
                <text x="360" y="170" fill="#759C39" fontSize="8" fontWeight="700" letterSpacing="1">HARBOR PARK ST</text>
                <text x="375" y="240" fill="#759C39" fontSize="8" fontWeight="700" letterSpacing="1">CHINA TOWN</text>
              </svg>

              {/* Park Meadows Marker on Map matching screenshot */}
              <div 
                onClick={() => handleSelectRestaurant(RESTAURANTS[0])}
                className="absolute top-[32%] left-[64%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group flex flex-col items-center animate-bounce duration-1000"
              >
                <div className="bg-[#244507]/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md mb-1 border border-[#A8E83C]/40 flex items-center space-x-1 whitespace-nowrap">
                  <span>Park Meadows</span>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-xl overflow-hidden bg-white ring-4 ring-[#A8E83C]/50">
                  <img src={RESTAURANTS[0].image} alt="Park Meadows" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Millennium Park Marker */}
              <div 
                onClick={() => handleSelectRestaurant(RESTAURANTS[1])}
                className="absolute top-[54%] left-[28%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group flex flex-col items-center"
              >
                <div className="bg-[#244507]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md mb-1 border border-[#A8E83C]/30 flex items-center space-x-1 whitespace-nowrap">
                  <span>Millennium Park</span>
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white shadow-lg overflow-hidden bg-white ring-2 ring-[#315B0B]">
                  <img src={RESTAURANTS[1].image} alt="Millennium Park" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Top Controls on Map matching screenshot */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              {/* Back button */}
              <button
                onClick={goBack}
                className="w-10 h-10 rounded-full bg-[#244507]/60 hover:bg-[#244507]/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all active:scale-95 shadow-md"
                aria-label="Go Back"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Toggle Pills: Restaurants vs Dishes */}
              <div className="bg-[#244507]/60 backdrop-blur-md p-1 rounded-full border border-white/20 flex items-center space-x-1">
                <button
                  onClick={() => setDiscoveryFilter('Restaurants')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    discoveryFilter === 'Restaurants'
                      ? 'bg-[#315B0B] text-white shadow-xs'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Restaurants
                </button>
                <button
                  onClick={() => {
                    setDiscoveryFilter('Dishes');
                    navigateTo('menu');
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    discoveryFilter === 'Dishes'
                      ? 'bg-[#315B0B] text-white shadow-xs'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Dishes
                </button>
              </div>

              {/* Locate button */}
              <button
                onClick={() => showToast('GPS location updated')}
                className="w-10 h-10 rounded-full bg-[#244507]/60 hover:bg-[#244507]/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all active:scale-95 shadow-md"
                aria-label="Current Location"
              >
                <Crosshair size={18} />
              </button>
            </div>

            {/* Floating Search Bar on Map matching screenshot */}
            <div className="absolute bottom-12 sm:bottom-6 left-4 right-4 z-20">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-[#244507]/80 hover:bg-[#244507]/90 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-2.5 flex items-center space-x-2.5 shadow-lg text-white">
                  <Search size={18} className="text-[#A8E83C] shrink-0" />
                  <div className="flex-1">
                    <span className="text-[10px] block text-white/70 font-bold leading-none">Park Meadows</span>
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      placeholder="Center Drive #E160Lone"
                      className="bg-transparent text-xs font-semibold text-white focus:outline-none w-full underline decoration-white/40"
                    />
                  </div>
                </div>

                <button
                  onClick={() => showToast('Refined map search')}
                  className="w-11 h-11 rounded-2xl bg-[#3B5B16]/90 hover:bg-[#4E761E] border border-white/25 backdrop-blur-md flex items-center justify-center text-[#A8E83C] shadow-lg transition-all active:scale-95 shrink-0"
                  aria-label="Filter Map"
                >
                  <Sparkles size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Restaurant Bottom Sheet matching screenshot 1 */}
          <div className="lg:col-span-5 bg-white rounded-t-4xl lg:rounded-3xl -mt-6 lg:mt-0 relative z-30 p-5 pt-6 space-y-4 border-t lg:border border-[#D0D8C2] shadow-xl lg:shadow-xs">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h2 className="text-xl font-extrabold text-[#243019]">Kitchen Locations</h2>
                <p className="text-xs text-[#747B68]">Fresh pickup and carbon-neutral courier</p>
              </div>
              <span className="bg-[#EEF4E3] text-[#244507] text-xs font-bold px-3 py-1 rounded-full border border-[#D0D8C2]">
                {RESTAURANTS.length} Near You
              </span>
            </div>

            {/* Restaurant Cards list */}
            {RESTAURANTS.map((rest) => (
              <div
                key={rest.id}
                className="bg-[#EEF4E3] rounded-3xl p-4 border border-[#D0D8C2] shadow-xs flex items-center space-x-3.5 transition-all hover:border-[#315B0B]/50"
              >
                {/* Photo thumbnail */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-stone-200 shadow-xs">
                  <img
                    src={rest.image}
                    alt={rest.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-extrabold text-[#243019] truncate">
                      {rest.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs font-bold text-[#315B0B]">
                      <Star size={12} className="fill-current" />
                      <span>{rest.rating}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#747B68] leading-tight line-clamp-2">
                    {rest.shortAddress || rest.address}
                  </p>

                  <div className="pt-1 flex items-center justify-between">
                    <button
                      onClick={() => handleSelectRestaurant(rest)}
                      className="px-4 py-1.5 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                    >
                      More Details
                    </button>
                    <span className="text-[10px] font-bold text-[#747B68]">
                      {rest.distance} away
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
