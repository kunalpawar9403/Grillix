import React from 'react';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Crosshair, 
  Tag, 
  CheckCircle2, 
  ChefHat, 
  Package, 
  Bike,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OrderTrackingScreen = () => {
  const { 
    goBack, 
    navigateTo, 
    orderStatus, 
    setOrderStatus, 
    currentOrderId,
    currentUser,
    showToast 
  } = useApp();

  const stages = [
    { id: 'Received', time: '12:00', label: 'Received', icon: CheckCircle2 },
    { id: 'Preparing', time: '12:19', label: 'Preparing', icon: ChefHat },
    { id: 'Ready', time: '12:40', label: 'Ready Box', icon: Package },
    { id: 'Delivering', time: 'ETA 15m', label: 'Delivering', icon: Bike },
  ];

  const currentStageIndex = stages.findIndex((s) => s.id === orderStatus);

  const handleNextStatus = () => {
    if (orderStatus === 'Received') setOrderStatus('Preparing');
    else if (orderStatus === 'Preparing') setOrderStatus('Ready');
    else if (orderStatus === 'Ready') setOrderStatus('Delivering');
    else {
      showToast('Order delivered! Thank you for choosing GRILLIX!');
      navigateTo('home');
    }
  };

  return (
    <div className="w-full min-h-screen pb-28 md:pb-16 animate-fadeIn bg-[#EEF4E3]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6 space-y-4">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>

          <h1 className="text-lg sm:text-xl font-extrabold text-[#243019] tracking-tight">
            Order Tracking
          </h1>

          <button
            onClick={() => showToast('Courier contact information')}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Live Route Map Graphic */}
        <div className="relative h-64 sm:h-72 rounded-3xl overflow-hidden bg-[#385514] border border-[#385514]/40 shadow-sm">
          <svg className="w-full h-full" viewBox="0 0 400 220" preserveAspectRatio="none">
            <defs>
              <pattern id="trackGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#2F4711" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="#385514" />
            <rect width="100%" height="100%" fill="url(#trackGrid)" />

            {/* Roads */}
            <path d="M-20,160 L420,60" stroke="#48691A" strokeWidth="16" />
            <path d="M-20,160 L420,60" stroke="#53791E" strokeWidth="10" />

            <path d="M70,-20 L70,240" stroke="#48691A" strokeWidth="14" />
            <path d="M70,-20 L70,240" stroke="#53791E" strokeWidth="8" />

            <path d="M280,-20 L280,240" stroke="#48691A" strokeWidth="14" />
            <path d="M280,-20 L280,240" stroke="#53791E" strokeWidth="8" />

            {/* Route delivery line connecting Pickup to Delivery */}
            <path 
              d="M70,70 Q180,40 280,140" 
              fill="none" 
              stroke="#A8E83C" 
              strokeWidth="4" 
              strokeDasharray="6,4"
              className="animate-pulse"
            />
          </svg>

          {/* Pickup Point Marker */}
          <div className="absolute top-[28%] left-[16%] flex flex-col items-center">
            <span className="bg-[#244507] text-[#A8E83C] text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 shadow-sm border border-white/20">
              Pickup Point
            </span>
            <div className="w-7 h-7 rounded-full bg-[#315B0B] border-2 border-white flex items-center justify-center text-white shadow-md">
              <Package size={14} />
            </div>
          </div>

          {/* Delivery Point Marker (User avatar) */}
          <div className="absolute top-[58%] left-[68%] flex flex-col items-center">
            <span className="bg-[#244507] text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 shadow-sm border border-white/20">
              Delivery Point
            </span>
            <div className="w-9 h-9 rounded-full border-2 border-[#A8E83C] overflow-hidden shadow-lg">
              <img 
                src={currentUser?.avatar || '/images/avatar-jhon.jpg'} 
                alt={currentUser?.name || "User"} 
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/images/avatar-jhon.jpg';
                }}
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Crosshair button on map */}
          <button 
            onClick={() => showToast('Centering on active courier location')}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#244507]/70 backdrop-blur-md text-white flex items-center justify-center shadow-md hover:bg-[#244507]"
          >
            <Crosshair size={16} />
          </button>
        </div>

        {/* Delivery Address Card matching Screen 5 in diagram */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#D0D8C2] shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF4E3] border border-[#D0D8C2] flex items-center justify-center text-[#315B0B] shrink-0">
              <MapPin size={18} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#315B0B] block">Delivery Location</span>
              <p className="text-xs sm:text-sm font-extrabold text-[#243019] truncate">742 Evergreen Terrace, Springfield</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#315B0B] bg-[#EEF4E3] px-2.5 py-1 rounded-full border border-[#D0D8C2] shrink-0">
            ETA 15m
          </span>
        </div>

        {/* Order Details & Status Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#D0D8C2] shadow-xs space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#243019]">
                Order {orderStatus}
              </h2>
              <div className="flex items-center space-x-2 text-xs text-[#747B68] mt-1 font-semibold">
                <span className="text-[#315B0B] font-bold">12 AM Scheduled</span>
                <span>To 01PM delivery</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-[#747B68] block">Order Number</span>
              <span className="text-xs font-mono font-bold text-[#243019]">#{currentOrderId}</span>
            </div>
          </div>

          {/* Progress Timeline matching reference */}
          <div className="pt-2">
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
              {stages.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <div key={stage.id} className="space-y-1">
                    <span className={`block text-[11px] ${isPassed ? 'text-[#315B0B] font-bold' : 'text-[#747B68]'}`}>
                      {stage.time}
                    </span>
                    <span className={`block text-xs font-bold truncate ${isCurrent ? 'text-[#243019]' : 'text-[#747B68]'}`}>
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-2 bg-[#EEF4E3] rounded-full overflow-hidden mt-3 border border-[#D0D8C2]/60">
              <div 
                className="h-full bg-[#315B0B] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStageIndex + 1) / stages.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Simulation Step Button */}
          <div className="pt-2">
            <button
              onClick={handleNextStatus}
              className="w-full py-3.5 px-4 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] leading-tight text-center"
            >
              {orderStatus === 'Delivering' ? 'Confirm To Receive Order' : `Simulate: Advance Status to ${stages[Math.min(stages.length - 1, currentStageIndex + 1)].label}`}
            </button>
          </div>
        </div>

        {/* Loyalty Reward Notification matching reference */}
        <div className="bg-white rounded-3xl p-5 border border-[#D0D8C2] shadow-xs flex items-start space-x-3.5">
          <div className="w-9 h-9 rounded-2xl bg-[#EEF4E3] border border-[#D0D8C2] flex items-center justify-center text-[#315B0B] shrink-0 mt-0.5">
            <Tag size={16} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-[#243019]">
              You will get 350pts & points are on the way!
            </h4>
            <p className="text-xs text-[#747B68] mt-0.5">
              You'll see them in your account within 24h.
            </p>
          </div>
        </div>

        {/* Action Buttons: Home & Menu */}
        <div className="grid grid-cols-2 gap-3 pt-1 pb-4">
          <button
            onClick={() => navigateTo('home')}
            className="py-3.5 px-4 rounded-full bg-white hover:bg-[#F4F7EE] text-[#243019] border border-[#D0D8C2] font-extrabold text-xs sm:text-sm text-center shadow-xs transition-all active:scale-95"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigateTo('menu')}
            className="py-3.5 px-4 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-extrabold text-xs sm:text-sm text-center shadow-md transition-all active:scale-95"
          >
            Order More Dishes
          </button>
        </div>

      </div>
    </div>
  );
};
