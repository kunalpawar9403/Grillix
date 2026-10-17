import React, { useState } from 'react';
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
  CheckCircle2,
  MapPin,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RestaurantLocationMap } from '../components/map/RestaurantLocationMap';

export const RestaurantDetailScreen = () => {
  const { 
    goBack, 
    navigateTo, 
    selectedRestaurant, 
    showToast 
  } = useApp();

  const [activeMediaTab, setActiveMediaTab] = useState('photo'); // 'photo' | 'map'

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(selectedRestaurant?.address || '');
    }
    showToast(`Copied: ${selectedRestaurant?.address || ''}`);
  };

  const handleOpenDirections = () => {
    const lat = selectedRestaurant?.lat || 19.0657;
    const lng = selectedRestaurant?.lng || 72.8687;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
    showToast('Opening real turn-by-turn Indian GPS directions...');
  };

  const handleRequestUber = () => {
    const lat = selectedRestaurant?.lat || 19.0657;
    const lng = selectedRestaurant?.lng || 72.8687;
    const url = `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encodeURIComponent(selectedRestaurant?.name || 'GRILLIX')}`;
    window.open(url, '_blank');
    showToast('Dispatching ride request to kitchen location...');
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
              Restaurant
            </span>
            <button
              onClick={() => navigateTo('menu')}
              className="px-4 py-1.5 rounded-full text-xs font-bold text-[#243019] hover:text-[#315B0B]"
            >
              Dishes
            </button>
          </div>

          <button
            onClick={() => {
              setActiveMediaTab('map');
              showToast(`Pinpoint calibrated for ${selectedRestaurant?.name}`);
            }}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
            title="Calibrate Map Pinpoint"
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
                <span className="text-sm font-bold text-[#243019]">{selectedRestaurant?.shortAddress}</span>
              </div>
            </div>
            <button 
              onClick={() => navigateTo('discovery')}
              className="w-10 h-10 rounded-xl bg-[#315B0B] text-[#A8E83C] flex items-center justify-center shadow-xs hover:bg-[#244507] transition-colors"
              title="View All Indian Hubs Map"
            >
              <Sparkles size={18} />
            </button>
          </div>
        </div>

        {/* Schedule Banner (lime banner) */}
        <div className="bg-[#A8E83C] text-[#244507] rounded-t-3xl px-6 py-3.5 flex items-center justify-between font-bold text-sm shadow-sm">
          <div className="flex items-center space-x-2.5">
            <Clock size={18} strokeWidth={2.4} />
            <span>{selectedRestaurant?.hours}</span>
          </div>
          <span className="text-xs bg-[#244507] text-[#A8E83C] px-3 py-1 rounded-full font-extrabold">
            Open Now • {selectedRestaurant?.distance} away
          </span>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-b-3xl rounded-tr-none p-5 sm:p-7 border-x border-b border-[#D0D8C2] shadow-sm space-y-5">
          
          {/* Media Header with Tab Switcher: Photos vs Real Map of India */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 bg-[#EEF4E3] p-1 rounded-xl border border-[#D0D8C2]">
                <button
                  onClick={() => setActiveMediaTab('photo')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    activeMediaTab === 'photo'
                      ? 'bg-[#244507] text-[#A8E83C] shadow-xs'
                      : 'text-[#243019] hover:bg-[#E3EBD3]'
                  }`}
                >
                  <ImageIcon size={13} />
                  <span>Kitchen Photo</span>
                </button>
                <button
                  onClick={() => setActiveMediaTab('map')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    activeMediaTab === 'map'
                      ? 'bg-[#244507] text-[#A8E83C] shadow-xs'
                      : 'text-[#243019] hover:bg-[#E3EBD3]'
                  }`}
                >
                  <MapPin size={13} />
                  <span>Real Map of India 🇮🇳</span>
                </button>
              </div>

              <span className="text-[11px] font-bold text-[#747B68] hidden sm:inline">
                GPS: {selectedRestaurant?.lat?.toFixed(4)}, {selectedRestaurant?.lng?.toFixed(4)}
              </span>
            </div>

            {/* Media Canvas: Photo or Interactive Real Map */}
            {activeMediaTab === 'photo' ? (
              <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-stone-100 shadow-inner">
                <img
                  src={selectedRestaurant?.image}
                  alt={selectedRestaurant?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-[#244507]/85 backdrop-blur-md text-[#A8E83C] text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1">
                  <Star size={13} className="fill-current" />
                  <span>{selectedRestaurant?.rating} ({selectedRestaurant?.reviewsCount} reviews)</span>
                </div>
                <button
                  onClick={() => setActiveMediaTab('map')}
                  className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-[#244507] hover:bg-white text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-lg flex items-center space-x-1.5 transition-all active:scale-95 border border-[#D0D8C2]"
                >
                  <MapPin size={14} className="text-[#315B0B]" />
                  <span>View on Real Map of India</span>
                </button>
              </div>
            ) : (
              <div className="w-full">
                <RestaurantLocationMap 
                  restaurant={selectedRestaurant}
                  className="w-full h-72 sm:h-80"
                />
              </div>
            )}
          </div>

          {/* Restaurant Title & Address Row */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243019] tracking-tight">
                  {selectedRestaurant?.name}
                </h1>
                <span className="bg-[#EEF4E3] text-[#244507] border border-[#D0D8C2] text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                  {selectedRestaurant?.city}
                </span>
              </div>
              <p className="text-sm text-[#747B68] mt-1 leading-relaxed max-w-xl flex items-center space-x-1.5">
                <MapPin size={15} className="text-[#315B0B] shrink-0" />
                <span>{selectedRestaurant?.address}</span>
              </p>
            </div>
            <button 
              onClick={() => showToast(`Store Code: GRX-${selectedRestaurant?.id?.toUpperCase() || 'IND'}`)}
              className="w-10 h-10 rounded-full border border-[#D0D8C2] flex items-center justify-center text-[#747B68] hover:text-[#243019] hover:bg-[#EEF4E3] transition-colors shrink-0"
              title="Store Details Code"
            >
              <Code size={18} />
            </button>
          </div>

          {/* Action Pills Row */}
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              onClick={() => showToast(`Calling ${selectedRestaurant?.name} Kitchen (+91 98201 54321)...`)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-full border border-[#D0D8C2] bg-[#EEF4E3] hover:bg-[#E3EBD3] text-xs font-bold text-[#243019] transition-all active:scale-95"
            >
              <Phone size={14} className="text-[#315B0B]" />
              <span>Contact Kitchen</span>
            </button>

            <button
              onClick={handleOpenDirections}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-full border border-[#315B0B] bg-[#315B0B] text-white hover:bg-[#244507] text-xs font-bold transition-all active:scale-95 shadow-sm"
              title="Open Google Maps Navigation"
            >
              <Navigation size={14} />
              <span>Turn-by-Turn GPS</span>
              <ExternalLink size={12} className="opacity-75" />
            </button>

            <button
              onClick={handleRequestUber}
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

          {/* Permanent Real Map of India Location Card (if in photo mode, show this below) */}
          {activeMediaTab === 'photo' && (
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-[#315B0B]" />
                  <h3 className="text-sm font-extrabold text-[#243019]">
                    Real GPS Location & Express Zone (India)
                  </h3>
                </div>
                <button
                  onClick={() => navigateTo('discovery')}
                  className="text-xs font-bold text-[#315B0B] hover:underline"
                >
                  View All Indian Hubs →
                </button>
              </div>
              <RestaurantLocationMap 
                restaurant={selectedRestaurant}
                className="w-full h-56 sm:h-64"
              />
            </div>
          )}

          {/* Amenities & Sustainability */}
          <div className="pt-2 border-t border-[#EEF4E3]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#747B68] mb-2.5">
              Kitchen Highlights & Facilities
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {selectedRestaurant?.amenities?.map((item, idx) => (
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
              <span>Order from this Kitchen</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
