import React from 'react';
import { 
  ChevronLeft, 
  Crosshair, 
  Search, 
  Sparkles, 
  Clock, 
  Phone, 
  Navigation, 
  Car, 
  Copy, 
  Code, 
  Star,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RestaurantDetailScreen = () => {
  const { 
    goBack, 
    navigateTo, 
    selectedRestaurant, 
    showToast 
  } = useApp();

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(selectedRestaurant.address);
    }
    showToast(`Copied: ${selectedRestaurant.address}`);
  };

  return (
    <div className="w-full min-h-screen pb-28 md:pb-14 animate-fadeIn bg-[#EEF4E3]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-6">
        
        {/* Top Header Controls */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Toggle Pills */}
          <div className="bg-[#E3EBD3] p-1 rounded-full border border-[#D0D8C2] flex items-center space-x-1 shadow-xs">
            <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#244507] text-[#A8E83C]">
              Restaurants
            </span>
            <button
              onClick={() => navigateTo('menu')}
              className="px-4 py-1.5 rounded-full text-xs font-bold text-[#243019] hover:text-[#315B0B]"
            >
              Dishes
            </button>
          </div>

          <button
            onClick={() => showToast('Pinpoint calibrated')}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
          >
            <Crosshair size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="bg-[#E3EBD3] rounded-2xl border border-[#D0D8C2] px-4 py-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3 flex-1">
              <Search size={18} className="text-[#315B0B]" />
              <div>
                <span className="text-[11px] block text-[#747B68] font-bold">Search Location</span>
                <span className="text-sm font-bold text-[#243019]">{selectedRestaurant.shortAddress}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#315B0B] text-[#A8E83C] flex items-center justify-center shadow-xs">
              <Sparkles size={18} />
            </div>
          </div>
        </div>

        {/* Schedule Banner (matching the lime banner in screenshot) */}
        <div className="bg-[#A8E83C] text-[#244507] rounded-t-3xl px-6 py-3.5 flex items-center space-x-2.5 font-bold text-sm shadow-sm">
          <Clock size={18} strokeWidth={2.4} />
          <span>{selectedRestaurant.hours}</span>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-b-3xl rounded-tr-none p-5 sm:p-7 border-x border-b border-[#D0D8C2] shadow-sm space-y-5">
          {/* Large Restaurant Interior Photo */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-stone-100 shadow-inner">
            <img
              src={selectedRestaurant.image}
              alt={selectedRestaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-[#244507]/85 backdrop-blur-md text-[#A8E83C] text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
              <Star size={13} className="fill-current" />
              <span>{selectedRestaurant.rating} ({selectedRestaurant.reviewsCount} reviews)</span>
            </div>
          </div>

          {/* Restaurant Title & Address Row */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243019] tracking-tight">
                {selectedRestaurant.name}
              </h1>
              <p className="text-sm text-[#747B68] mt-1 leading-relaxed max-w-xl">
                {selectedRestaurant.address}
              </p>
            </div>
            <button 
              onClick={() => showToast('Store code: GRX-702-CO')}
              className="w-10 h-10 rounded-full border border-[#D0D8C2] flex items-center justify-center text-[#747B68] hover:text-[#243019] hover:bg-[#EEF4E3] transition-colors shrink-0"
              title="Location Details"
            >
              <Code size={18} />
            </button>
          </div>

          {/* Action Pills Row */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              onClick={() => showToast(`Calling ${selectedRestaurant.name} Kitchen...`)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-full border border-[#D0D8C2] bg-[#EEF4E3] hover:bg-[#E3EBD3] text-xs font-bold text-[#243019] transition-all active:scale-95"
            >
              <Phone size={14} className="text-[#315B0B]" />
              <span>More Details</span>
            </button>

            <button
              onClick={() => showToast('Opening Turn-by-Turn GPS Directions...')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-full border border-[#D0D8C2] bg-[#EEF4E3] hover:bg-[#E3EBD3] text-xs font-bold text-[#243019] transition-all active:scale-95"
            >
              <Navigation size={14} className="text-[#315B0B]" />
              <span>Directions</span>
            </button>

            <button
              onClick={() => showToast('Dispatching Uber pickup estimate: 4 mins away')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-full border border-[#D0D8C2] bg-[#EEF4E3] hover:bg-[#E3EBD3] text-xs font-bold text-[#243019] transition-all active:scale-95"
            >
              <Car size={14} className="text-[#315B0B]" />
              <span>Request Uber</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-full border border-[#D0D8C2] bg-[#EEF4E3] hover:bg-[#E3EBD3] text-xs font-bold text-[#243019] transition-all active:scale-95"
            >
              <Copy size={14} className="text-[#315B0B]" />
              <span>Copy Address</span>
            </button>
          </div>

          {/* Amenities & Sustainability */}
          <div className="pt-2 border-t border-[#EEF4E3]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#747B68] mb-2.5">
              Kitchen Highlights
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {selectedRestaurant.amenities.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-1.5 text-[#243019] font-medium">
                  <CheckCircle2 size={14} className="text-[#315B0B]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Big Green Order Now Button */}
          <div className="pt-3">
            <button
              onClick={() => navigateTo('menu')}
              className="w-full py-4 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-extrabold text-base tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <span>Order now</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
