import React from 'react';
import { 
  ChevronLeft, 
  Star,
  MapPin,
  Clock,
  Phone,
  Bike,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANT, RESTAURANTS } from '../data/mockData';
import { RestaurantFinderMap } from '../components/map/RestaurantFinderMap';

export const DiscoveryScreen = () => {
  const { 
    goBack, 
    navigateTo, 
    selectedRestaurant, 
    setSelectedRestaurant
  } = useApp();

  const currentRest = selectedRestaurant || RESTAURANT;

  return (
    <div className="w-full min-h-screen pb-28 md:pb-12 animate-fadeIn bg-[#EEF4E3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        
        {/* Top Header Controls */}
        <div className="py-3 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={goBack}
              className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
              aria-label="Back"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#315B0B]">
                  Flagship Central Kitchen & Dining
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#244507] tracking-tight">
                {currentRest.name}
              </h1>
            </div>
          </div>

          <button
            onClick={() => navigateTo('menu')}
            className="flex items-center space-x-2 bg-[#244507] hover:bg-[#315B0B] text-[#A8E83C] px-4 py-2 rounded-full font-black text-xs transition-all shadow-md active:scale-95 shrink-0"
          >
            <span>Order Menu</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* 2-Column Grid: Live Map on Left, Restaurant Showcase on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-2">
          
          {/* Live Map Column */}
          <div className="lg:col-span-7 h-[420px] sm:h-[480px] lg:h-[620px] rounded-3xl overflow-hidden border border-[#D0D8C2] shadow-sm relative">
            <RestaurantFinderMap 
              restaurants={RESTAURANTS}
              selectedRestaurant={currentRest}
              onSelectRestaurant={(r) => setSelectedRestaurant(r)}
              className="w-full h-full"
            />
          </div>

          {/* Single Restaurant Details Column */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 space-y-5 border border-[#D0D8C2] shadow-sm flex flex-col justify-between">
            
            <div className="space-y-4">
              {/* Photo & Rating Banner */}
              <div className="relative h-44 rounded-2xl overflow-hidden bg-stone-100 border border-[#D0D8C2]/60 shadow-xs">
                <img
                  src={currentRest.image}
                  alt={currentRest.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div>
                    <h3 className="font-extrabold text-base">{currentRest.shortName}</h3>
                    <p className="text-xs text-[#d4f598] font-medium">{currentRest.shortAddress}</p>
                  </div>
                  <div className="bg-[#244507]/90 backdrop-blur-md px-2.5 py-1 rounded-xl flex items-center space-x-1 text-xs font-black text-[#A8E83C] border border-[#A8E83C]/30">
                    <Star size={12} className="fill-current" />
                    <span>{currentRest.rating} ({currentRest.reviewsCount})</span>
                  </div>
                </div>
              </div>

              {/* Key Quick Facts Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#EEF4E3] p-3 rounded-2xl border border-[#D0D8C2]/60 space-y-1">
                  <div className="flex items-center space-x-1.5 text-[#315B0B] font-extrabold">
                    <Clock size={14} />
                    <span>Operating Hours</span>
                  </div>
                  <p className="font-bold text-[#243019]">{currentRest.hours}</p>
                  <span className="text-[10px] text-emerald-700 font-semibold">● Open Now for Delivery</span>
                </div>

                <div className="bg-[#EEF4E3] p-3 rounded-2xl border border-[#D0D8C2]/60 space-y-1">
                  <div className="flex items-center space-x-1.5 text-[#315B0B] font-extrabold">
                    <Bike size={14} />
                    <span>Delivery Speed</span>
                  </div>
                  <p className="font-bold text-[#243019]">20 - 30 Mins Avg</p>
                  <span className="text-[10px] text-[#747B68] font-semibold">Zero-emission EV Fleet</span>
                </div>
              </div>

              {/* Address & Contact Row */}
              <div className="bg-[#F6FAF0] p-4 rounded-2xl border border-[#D0D8C2]/80 space-y-2 text-xs">
                <div className="flex items-start space-x-2.5">
                  <MapPin size={16} className="text-[#315B0B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-[#243019] block">Restaurant Address</span>
                    <p className="text-[#747B68] leading-relaxed">{currentRest.address}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#D0D8C2]/50 text-xs">
                  <div className="flex items-center space-x-2 text-[#243019] font-bold">
                    <Phone size={13} className="text-[#315B0B]" />
                    <span>{currentRest.phone}</span>
                  </div>
                  <span className="text-[11px] text-[#315B0B] font-extrabold bg-[#EEF4E3] px-2.5 py-1 rounded-full border border-[#D0D8C2]/60">
                    FSSAI 5-Star Clean
                  </span>
                </div>
              </div>

              {/* Amenities Tags */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-[#747B68] block mb-2">
                  Kitchen & Dining Highlights
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentRest.amenities.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold bg-[#EEF4E3] text-[#244507] px-3 py-1 rounded-full border border-[#D0D8C2]/70 flex items-center space-x-1"
                    >
                      <Sparkles size={11} className="text-[#315B0B]" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#D0D8C2] grid grid-cols-2 gap-3">
              <button
                onClick={() => navigateTo('menu')}
                className="w-full bg-[#244507] hover:bg-[#315B0B] text-white py-3 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-md active:scale-95 text-center"
              >
                Order for Delivery
              </button>
              <button
                onClick={() => navigateTo('custom-bowl')}
                className="w-full bg-[#E3EBD3] hover:bg-[#D5E1C3] text-[#244507] border border-[#D0D8C2] py-3 rounded-2xl font-black text-xs sm:text-sm transition-all active:scale-95 text-center"
              >
                Build Custom Bowl
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
