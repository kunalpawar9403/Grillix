import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Phone, 
  MessageSquare, 
  Heart, 
  ShieldCheck, 
  CheckCircle2, 
  ChefHat, 
  Package, 
  Bike, 
  MapPin, 
  Clock, 
  ExternalLink,
  Zap,
  Battery,
  Navigation,
  Thermometer,
  Sparkles,
  PhoneCall,
  Mic,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { LiveDeliveryMap } from '../components/map/LiveDeliveryMap';
import { playStatusUpdateSound } from '../utils/soundEffects';

export const OrderTrackingScreen = () => {
  const { 
    goBack, 
    navigateTo, 
    orderStatus, 
    currentOrderId,
    currentUser,
    allOrders,
    updateOrderStatus,
    deliveryRiders,
    showToast 
  } = useApp();

  const [activeTip, setActiveTip] = useState(null);
  const [selectedInstruction, setSelectedInstruction] = useState('Leave at doorstep');
  const [showCallModal, setShowCallModal] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { from: 'rider', text: 'Namaste! I have picked up your hot GRILLIX bowl from Moshi Central Kitchen. Heading towards Spine Road now!' }
  ]);

  // Call timer simulation
  React.useEffect(() => {
    let timer;
    if (showCallModal) {
      setCallDuration(0);
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showCallModal]);

  // Find current order details if exists in allOrders
  const currentOrder = allOrders.find((o) => o.id === currentOrderId) || {
    id: currentOrderId || 'GRX-IND-901',
    total: 498.00,
    items: ['Fresh Salad Bowl', 'Green Veggie Bowl'],
    address: currentUser?.addresses?.[0] || 'Flat 502, Green Meadows Residency, Spine Road, Moshi, Pune 412105',
    assignedRider: 'Vikram Singh'
  };

  // Find assigned rider info
  const rider = deliveryRiders.find(r => r.name === currentOrder.assignedRider) || deliveryRiders[0];

  const stages = [
    { id: 'Received', time: '12:00', label: 'Received', icon: CheckCircle2, desc: 'Kitchen accepted your order' },
    { id: 'Preparing', time: '12:19', label: 'Preparing', icon: ChefHat, desc: 'Chef tossing fresh organic greens' },
    { id: 'Ready', time: '12:40', label: 'Ready Box', icon: Package, desc: 'Packed in eco-friendly thermal box' },
    { id: 'Delivering', time: 'ETA 12m', label: 'Delivering', icon: Bike, desc: 'Rider on the road' },
  ];

  const currentStageIndex = stages.findIndex((s) => s.id === orderStatus);

  const handleNextStatus = () => {
    if (orderStatus === 'Received') updateOrderStatus(currentOrderId, 'Preparing');
    else if (orderStatus === 'Preparing') updateOrderStatus(currentOrderId, 'Ready');
    else if (orderStatus === 'Ready') updateOrderStatus(currentOrderId, 'Delivering');
    else if (orderStatus === 'Delivering') {
      updateOrderStatus(currentOrderId, 'Delivered');
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#315B0B', '#A8E83C', '#244507', '#EEF4E3']
        });
      } catch {}
    } else {
      showToast('Order is already delivered! Starting a new order?');
      navigateTo('menu');
    }
  };

  const handleSendTip = (amount) => {
    setActiveTip(amount);
    try {
      confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#A8E83C', '#315B0B']
      });
    } catch {}
    showToast(`Added ₹${amount} tip for ${rider.name}! Thank you ❤️`);
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const msg = chatMessage.trim();
    setChatHistory((prev) => [...prev, { from: 'user', text: msg }]);
    setChatMessage('');
    showToast('Instruction sent to rider');

    // Simulate quick reply from rider
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { from: 'rider', text: 'Understood! Approaching your gate along Spine Road now.' }
      ]);
      playStatusUpdateSound();
    }, 1600);
  };

  return (
    <div className="w-full min-h-screen pb-32 md:pb-20 animate-fadeIn bg-[#EEF4E3]">
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

          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-extrabold text-[#243019] tracking-tight">
              Live Order Tracking
            </h1>
            <span className="text-[11px] font-bold text-[#315B0B] bg-[#E3EBD3] px-2.5 py-0.5 rounded-full inline-block mt-0.5">
              Order #{currentOrderId ? currentOrderId.slice(-6) : '901'} • Moshi Central Kitchen
            </span>
          </div>

          <a
            href="http://localhost:5175"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 bg-[#244507] hover:bg-[#315B0B] text-[#A8E83C] px-3 py-1.5 rounded-full font-bold text-xs shadow-xs transition-all active:scale-95"
            title="Open Kitchen Admin Console on Port 5175"
          >
            <span>Kitchen View</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {/* 1. REAL INTERACTIVE LEAFLET MAP INTEGRATION (Zomato / Blinkit style) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#315B0B] animate-pulse"></span>
              <span className="text-xs font-black uppercase tracking-wider text-[#244507]">
                Live EV Delivery Route • Moshi, Pune
              </span>
            </div>
            <span className="text-[10px] font-extrabold text-[#315B0B] bg-[#E3EBD3] px-2.5 py-0.5 rounded-full border border-[#D0D8C2]">
              GPS Live
            </span>
          </div>

          <LiveDeliveryMap 
            orderStatus={orderStatus}
            onOrderDelivered={() => {
              updateOrderStatus(currentOrderId, 'Delivered');
            }}
            customerAddress={currentOrder.address}
            restaurantName="GRILLIX Restaurant & Central Kitchen (Moshi, Pune)"
            riderName={rider.name}
          />

          {/* Real-time EV Rider Telemetry Strip */}
          <div className="bg-white rounded-2xl p-3 border border-[#D0D8C2] shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="flex items-center justify-center space-x-1.5 bg-[#EEF4E3] py-1.5 px-2 rounded-xl text-[#244507] font-bold">
              <Zap size={13} className="text-[#315B0B]" />
              <span>32 km/h</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5 bg-[#EEF4E3] py-1.5 px-2 rounded-xl text-[#244507] font-bold">
              <Battery size={13} className="text-[#315B0B]" />
              <span>86% EV Battery</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5 bg-[#EEF4E3] py-1.5 px-2 rounded-xl text-[#244507] font-bold">
              <Thermometer size={13} className="text-[#315B0B]" />
              <span>65°C Insulated</span>
            </div>
            <div className="flex items-center justify-center space-x-1.5 bg-[#EEF4E3] py-1.5 px-2 rounded-xl text-[#315B0B] font-extrabold">
              <Navigation size={13} />
              <span>Spine Rd, Pune</span>
            </div>
          </div>
        </div>

        {/* 2. RIDER PROFILE & DIRECT CONTACT CARD (Zomato / Blinkit style) */}
        <div className="bg-white rounded-3xl p-5 border border-[#D0D8C2] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="relative">
                <div className="w-13 h-13 rounded-2xl bg-[#EEF4E3] border-2 border-[#315B0B] overflow-hidden flex items-center justify-center shadow-xs">
                  <img
                    src={currentUser?.avatar || '/images/avatar-jhon.jpg'}
                    alt={rider.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-[#315B0B] text-white rounded-full p-0.5 border border-white">
                  <ShieldCheck size={12} />
                </span>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-extrabold text-[#243019]">{rider.name}</h3>
                  <span className="text-[10px] font-bold bg-[#A8E83C]/30 text-[#244507] px-2 py-0.5 rounded-full">
                    ★ {rider.rating}
                  </span>
                </div>
                <p className="text-xs text-[#747B68] font-bold flex items-center space-x-1.5 mt-0.5">
                  <Bike size={13} className="text-[#315B0B] shrink-0" />
                  <span className="truncate">{rider.vehicle}</span>
                </p>
                <span className="text-[10px] text-[#315B0B] font-bold block mt-0.5">
                  {rider.tripsCompleted}+ on-time healthy deliveries
                </span>
              </div>
            </div>

            {/* Call & Chat Quick Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowCallModal(true)}
                className="w-10 h-10 rounded-2xl bg-[#EEF4E3] hover:bg-[#315B0B] hover:text-white text-[#244507] border border-[#D0D8C2] flex items-center justify-center transition-all active:scale-95 shadow-xs"
                title="Call Delivery Partner"
              >
                <Phone size={17} />
              </button>

              <button
                onClick={() => setShowMessageModal(true)}
                className="w-10 h-10 rounded-2xl bg-[#315B0B] hover:bg-[#244507] text-white flex items-center justify-center transition-all active:scale-95 shadow-md"
                title="Message Delivery Partner"
              >
                <MessageSquare size={17} />
              </button>
            </div>
          </div>

          {/* Tip the Delivery Partner */}
          <div className="pt-2 border-t border-[#EEF4E3] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <span className="text-xs font-bold text-[#747B68] flex items-center space-x-1">
              <Heart size={13} className="text-rose-500 fill-rose-500" />
              <span>Tip your delivery partner:</span>
            </span>

            <div className="flex items-center space-x-2">
              {[20, 30, 50, 100].map((tipVal) => (
                <button
                  key={tipVal}
                  onClick={() => handleSendTip(tipVal)}
                  className={`px-3 py-1 rounded-full text-xs font-extrabold transition-all ${
                    activeTip === tipVal
                      ? 'bg-[#244507] text-[#A8E83C] scale-105 shadow-xs'
                      : 'bg-[#EEF4E3] hover:bg-[#D5E1C3] text-[#244507] border border-[#D0D8C2]'
                  }`}
                >
                  +₹{tipVal}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. ORDER STATUS PROGRESS TIMELINE */}
        <div className="bg-white rounded-3xl p-6 border border-[#D0D8C2] shadow-xs space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black text-[#243019]">
                  Order {orderStatus === 'Delivered' ? 'Delivered!' : orderStatus}
                </span>
                {orderStatus === 'Delivering' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#A8E83C] text-[#244507] text-[10px] font-black uppercase tracking-wider animate-pulse">
                    On Road
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs text-[#747B68] mt-1 font-semibold">
                <Clock size={13} className="text-[#315B0B]" />
                <span>
                  {orderStatus === 'Delivered'
                    ? 'Delivered fresh at your doorstep'
                    : orderStatus === 'Delivering'
                      ? 'Estimated arrival in 8–12 minutes • On the road'
                      : orderStatus === 'Ready'
                        ? 'Order packed and assigned to EV rider'
                        : orderStatus === 'Preparing'
                          ? 'Chef preparing fresh organic meal'
                          : 'Order confirmed by Moshi Kitchen'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#747B68] block">Amount Paid</span>
              <span className="text-base font-mono font-black text-[#315B0B]">₹{Number(currentOrder.total).toFixed(0)}</span>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="pt-2">
            <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
              {stages.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const IconComponent = stage.icon;
                return (
                  <div key={stage.id} className="space-y-1.5 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isPassed 
                        ? 'bg-[#315B0B] text-white shadow-xs' 
                        : 'bg-[#EEF4E3] text-[#747B68]'
                    }`}>
                      <IconComponent size={15} />
                    </div>
                    <span className={`block text-xs font-extrabold truncate ${isCurrent ? 'text-[#243019]' : 'text-[#747B68]'}`}>
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-2.5 bg-[#EEF4E3] rounded-full overflow-hidden mt-3 border border-[#D0D8C2]/60">
              <div 
                className="h-full bg-gradient-to-r from-[#315B0B] to-[#A8E83C] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${orderStatus === 'Delivered' ? 100 : Math.max(15, ((currentStageIndex + 1) / stages.length) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Quick Simulation Advancement Button */}
          <div className="pt-1 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleNextStatus}
              className="flex-1 py-3 px-4 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98] text-center"
            >
              {orderStatus === 'Delivered'
                ? 'Order Completed' 
                : orderStatus === 'Delivering'
                  ? 'Confirm To Receive Order'
                  : `Next Stage: Advance to ${stages[Math.min(stages.length - 1, currentStageIndex + 1)].label}`}
            </button>

            <a
              href="http://localhost:5175"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-5 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] text-[#244507] font-bold text-xs transition-all border border-[#D0D8C2] flex items-center justify-center space-x-1"
              title="Open Kitchen Admin on Port 5175"
            >
              <span>Kitchen Portal ↗</span>
            </a>
          </div>
        </div>

        {/* 4. DELIVERY INSTRUCTIONS CARD */}
        <div className="bg-white rounded-3xl p-5 border border-[#D0D8C2] shadow-xs space-y-3">
          <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#243019]">
            <MapPin size={15} className="text-[#315B0B]" />
            <span>Delivery Instructions for Rider</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              'Leave at doorstep',
              'Don\'t ring bell 🔕',
              'Call upon arrival 📞',
              'Leave with guard 👮',
              'Avoid pet barking 🐾'
            ].map((instruction) => (
              <button
                key={instruction}
                onClick={() => {
                  setSelectedInstruction(instruction);
                  showToast(`Rider note updated: "${instruction}"`);
                }}
                className={`p-2.5 rounded-2xl text-xs font-bold text-left transition-all border ${
                  selectedInstruction === instruction
                    ? 'bg-[#EEF4E3] border-[#315B0B] text-[#244507]'
                    : 'bg-white border-[#D0D8C2] text-[#747B68] hover:border-[#315B0B]/40'
                }`}
              >
                {instruction}
              </button>
            ))}
          </div>

          <div className="bg-[#EEF4E3] p-3 rounded-2xl text-xs text-[#244507] flex items-center justify-between">
            <span className="font-semibold truncate">📍 {currentOrder.address}</span>
            <span className="text-[11px] font-bold text-[#315B0B] shrink-0 ml-2">Home</span>
          </div>
        </div>

        {/* 5. ORDER ITEMS SUMMARY */}
        <div className="bg-white rounded-3xl p-5 border border-[#D0D8C2] shadow-xs space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#747B68]">
            Items in this order ({currentOrder.items?.length || 2})
          </h4>

          <div className="space-y-2">
            {currentOrder.items?.map((itemText, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#243019] py-1 border-b border-[#EEF4E3] last:border-none">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#A8E83C]"></span>
                  <span>{itemText}</span>
                </span>
                <span className="text-[#315B0B] font-extrabold">Prepared Fresh</span>
              </div>
            ))}
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

      {/* Direct Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center space-y-4 border border-[#D0D8C2] shadow-2xl animate-fadeIn">
            <div className="relative w-20 h-20 rounded-full bg-[#EEF4E3] text-[#315B0B] flex items-center justify-center mx-auto border-2 border-[#A8E83C]">
              <PhoneCall size={32} className="animate-pulse" />
              <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            
            <div>
              <h3 className="text-lg font-black text-[#243019]">{rider.name}</h3>
              <p className="text-xs text-[#747B68] font-bold">{rider.phone} • Ather 450X</p>
              <div className="mt-2 inline-flex items-center space-x-1.5 bg-[#EEF4E3] px-3 py-1 rounded-full text-xs font-mono font-bold text-[#315B0B]">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>
                  {Math.floor(callDuration / 60).toString().padStart(2, '0')}:
                  {(callDuration % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <p className="text-[10px] text-[#747B68] mt-1 font-semibold">
                🔒 Encrypted GRILLIX PCMC Rider Line
              </p>
            </div>

            {/* In-Call Controls */}
            <div className="flex items-center justify-center space-x-4 pt-1">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                  isMuted ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-[#EEF4E3] text-[#244507] hover:bg-[#D5E1C3]'
                }`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                <Mic size={18} />
              </button>

              <button
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                  isSpeaker ? 'bg-[#315B0B] text-white shadow-xs' : 'bg-[#EEF4E3] text-[#244507]'
                }`}
                title={isSpeaker ? "Speaker On" : "Speaker Off"}
              >
                <Volume2 size={18} />
              </button>
            </div>

            <button
              onClick={() => {
                setShowCallModal(false);
                showToast('Call ended with rider');
              }}
              className="w-full py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* In-App Rider Chat Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-md w-full space-y-3.5 border border-[#D0D8C2] shadow-2xl animate-fadeIn flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEF4E3]">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-[#EEF4E3] border border-[#315B0B] flex items-center justify-center text-[#243019] font-bold text-xs">
                  {rider.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#243019]">{rider.name}</h4>
                  <span className="text-[10px] text-[#315B0B] font-bold">● Active on Moshi Spine Road</span>
                </div>
              </div>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-stone-400 hover:text-stone-700 font-black text-sm"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-2 py-2 min-h-[160px] max-h-[260px]">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-3 rounded-2xl max-w-[80%] text-xs font-medium ${
                    msg.from === 'user'
                      ? 'bg-[#315B0B] text-white rounded-tr-none'
                      : 'bg-[#EEF4E3] text-[#243019] rounded-tl-none border border-[#D0D8C2]'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick replies */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
              {['Near Spine Rd flyover', 'Leave at Gate 2', 'Call upon arrival', 'Leave at door', 'Don\'t ring bell 🔕'].map((quick, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => {
                    setChatHistory(prev => [...prev, { from: 'user', text: quick }]);
                    setTimeout(() => {
                      setChatHistory(prev => [...prev, { from: 'rider', text: 'Understood, taking note of that!' }]);
                      playStatusUpdateSound();
                    }, 1200);
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#EEF4E3] hover:bg-[#D5E1C3] text-[10px] font-bold text-[#243019] whitespace-nowrap border border-[#D0D8C2]"
                >
                  {quick}
                </button>
              ))}
            </div>

            {/* Send input */}
            <form onSubmit={handleSendChatMessage} className="flex items-center space-x-2 pt-1">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type delivery note to rider..."
                className="flex-1 bg-[#EEF4E3] text-xs px-3.5 py-2.5 rounded-full border border-[#D0D8C2] focus:outline-none focus:border-[#315B0B] font-semibold text-[#243019]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white text-xs font-black transition-all active:scale-95"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
