import React, { useState } from 'react';
import { 
  ChevronLeft, 
  CheckCircle2, 
  ChefHat, 
  UtensilsCrossed, 
  Sparkles, 
  Bell, 
  Droplet, 
  Receipt, 
  Plus, 
  Clock, 
  MessageSquare,
  ShieldCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export const OrderTrackingScreen = () => {
  const { 
    goBack, 
    navigateTo, 
    orderStatus, 
    currentOrderId,
    currentTable,
    allOrders,
    updateOrderStatus,
    callWaiter,
    showToast 
  } = useApp();

  const [activeRequest, setActiveRequest] = useState(null);

  // Find current order details if exists in allOrders
  const currentOrder = allOrders.find((o) => o.id === currentOrderId) || {
    id: currentOrderId || 'GRX-DINE-901',
    tableNumber: currentTable || '1',
    total: 348.00,
    items: ['Rainbow Veggie Quinoa Power Bowl', 'Detox Cold-Pressed Green Juice'],
    date: 'Just now',
    chefNotes: 'Serve drinks first'
  };

  const stages = [
    { id: 'Received', label: 'Received', icon: CheckCircle2, desc: 'Kitchen acknowledged ticket' },
    { id: 'Cooking in Kitchen', label: 'Cooking', icon: ChefHat, desc: 'Chef tossing farm-fresh greens' },
    { id: 'Ready to Serve', label: 'Plated', icon: UtensilsCrossed, desc: 'Plated hot & ready for server' },
    { id: 'Served to Table', label: 'Served', icon: Sparkles, desc: 'Enjoy your meal at Table #' + (currentOrder.tableNumber || currentTable) },
  ];

  const getStageIndex = () => {
    if (orderStatus === 'Received') return 0;
    if (orderStatus === 'Cooking in Kitchen' || orderStatus === 'Preparing') return 1;
    if (orderStatus === 'Ready to Serve' || orderStatus === 'Ready') return 2;
    if (orderStatus === 'Served to Table' || orderStatus === 'Served' || orderStatus === 'Delivered') return 3;
    return 0;
  };

  const currentStageIndex = getStageIndex();

  const handleNextStatusSimulation = () => {
    if (orderStatus === 'Received') updateOrderStatus(currentOrderId, 'Cooking in Kitchen');
    else if (orderStatus === 'Cooking in Kitchen' || orderStatus === 'Preparing') updateOrderStatus(currentOrderId, 'Ready to Serve');
    else if (orderStatus === 'Ready to Serve' || orderStatus === 'Ready') {
      updateOrderStatus(currentOrderId, 'Served to Table');
      try {
        confetti({
          particleCount: 110,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#315B0B', '#A8E83C', '#244507', '#EEF4E3']
        });
      } catch {}
    } else {
      showToast('Order has already been served! Order more items anytime.');
    }
  };

  const handleServiceRequest = (type) => {
    setActiveRequest(type);
    callWaiter(type);
    setTimeout(() => {
      setActiveRequest(null);
    }, 4000);
  };

  return (
    <div className="w-full min-h-screen pb-32 md:pb-16 animate-fadeIn bg-[#EEF4E3]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-3 sm:pt-6 space-y-4 sm:space-y-5">
        
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
            <span className="text-[11px] font-bold text-[#747B68] uppercase tracking-wider block">
              DINE-IN KITCHEN TRACKER
            </span>
            <h1 className="text-base sm:text-lg font-black text-[#243019] tracking-tight">
              Table #{currentOrder.tableNumber || currentTable} • Order #{currentOrder.id.slice(-5)}
            </h1>
          </div>

          <div className="w-10 h-10 rounded-full bg-[#244507] text-[#A8E83C] font-black text-xs flex items-center justify-center shadow-xs">
            T{currentOrder.tableNumber || currentTable}
          </div>
        </div>

        {/* Live Status Hero Card */}
        <div className="bg-gradient-to-br from-[#244507] via-[#2F530B] to-[#1C3605] text-white rounded-3xl sm:rounded-4xl p-6 sm:p-7 shadow-lg border border-[#315B0B] space-y-6 relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#A8E83C]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div className="space-y-1">
              <span className="text-xs font-black bg-[#A8E83C] text-[#0F2002] px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                Table #{currentOrder.tableNumber || currentTable} • {stages[currentStageIndex].label}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white pt-1">
                {currentStageIndex === 0 && 'Order Sent to Kitchen'}
                {currentStageIndex === 1 && 'Chef is Cooking Your Bowls'}
                {currentStageIndex === 2 && 'Plated & Ready to Serve'}
                {currentStageIndex === 3 && 'Served at Your Table!'}
              </h2>
              <p className="text-xs text-[#D8E6C5]">
                {stages[currentStageIndex].desc}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/15 text-center shrink-0">
              <span className="text-[10px] text-white/70 block uppercase font-bold">Est. Kitchen Time</span>
              <span className="text-lg font-black text-[#A8E83C] font-mono">15-20m</span>
            </div>
          </div>

          {/* 4-Stage Horizontal Stepper */}
          <div className="relative z-10 pt-2">
            <div className="grid grid-cols-4 gap-1 sm:gap-2">
              {stages.map((stg, idx) => {
                const Icon = stg.icon;
                const isCompleted = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={stg.id} className="flex flex-col items-center text-center space-y-2">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-[#A8E83C] text-[#0F2002] shadow-lg ring-4 ring-[#A8E83C]/30 scale-105'
                        : isCompleted
                        ? 'bg-[#315B0B] text-white border border-[#A8E83C]/40'
                        : 'bg-white/10 text-white/40'
                    }`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <span className={`text-[10px] sm:text-xs font-bold block ${
                        isCurrent ? 'text-[#A8E83C] font-black' : isCompleted ? 'text-white' : 'text-white/40'
                      }`}>
                        {stg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dev Simulation Button */}
          <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs text-white/70">
            <span>Live Kitchen Status Simulation</span>
            <button
              onClick={handleNextStatusSimulation}
              className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-black text-[11px] transition-all active:scale-95"
            >
              Advance Next Stage ➔
            </button>
          </div>
        </div>

        {/* Quick Table Service Actions (Dine-In Assistance) */}
        <div className="bg-white rounded-3xl p-5 border border-[#D0D8C2] shadow-xs space-y-3">
          <h3 className="text-xs font-black text-[#243019] uppercase tracking-wider flex items-center space-x-1.5">
            <Bell size={14} className="text-[#315B0B]" />
            <span>Table #{currentOrder.tableNumber || currentTable} Service Requests</span>
          </h3>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleServiceRequest('Call Waiter')}
              className={`p-3 rounded-2xl border text-center transition-all active:scale-95 flex flex-col items-center justify-center space-y-1 ${
                activeRequest === 'Call Waiter'
                  ? 'bg-[#315B0B] text-white border-[#315B0B]'
                  : 'bg-[#EEF4E3] hover:bg-[#E3EBD3] text-[#243019] border-[#D0D8C2]'
              }`}
            >
              <Bell size={18} className="text-[#315B0B]" />
              <span className="text-[11px] font-bold">Call Server</span>
            </button>

            <button
              onClick={() => handleServiceRequest('Water Request')}
              className={`p-3 rounded-2xl border text-center transition-all active:scale-95 flex flex-col items-center justify-center space-y-1 ${
                activeRequest === 'Water Request'
                  ? 'bg-[#315B0B] text-white border-[#315B0B]'
                  : 'bg-[#EEF4E3] hover:bg-[#E3EBD3] text-[#243019] border-[#D0D8C2]'
              }`}
            >
              <Droplet size={18} className="text-blue-600" />
              <span className="text-[11px] font-bold">Water Please</span>
            </button>

            <button
              onClick={() => handleServiceRequest('Request Bill')}
              className={`p-3 rounded-2xl border text-center transition-all active:scale-95 flex flex-col items-center justify-center space-y-1 ${
                activeRequest === 'Request Bill'
                  ? 'bg-[#315B0B] text-white border-[#315B0B]'
                  : 'bg-[#EEF4E3] hover:bg-[#E3EBD3] text-[#243019] border-[#D0D8C2]'
              }`}
            >
              <Receipt size={18} className="text-amber-600" />
              <span className="text-[11px] font-bold">Request Bill</span>
            </button>
          </div>

          {activeRequest && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs text-center font-bold animate-fadeIn">
              🔔 Staff notified for Table #{currentOrder.tableNumber || currentTable}! Someone is on their way.
            </div>
          )}
        </div>

        {/* Order Details Ticket */}
        <div className="bg-white rounded-3xl p-5 border border-[#D0D8C2] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEF4E3]">
            <div>
              <span className="text-xs font-black text-[#243019] block">Kitchen Ticket Items</span>
              <span className="text-[11px] text-[#747B68]">{currentOrder.date}</span>
            </div>
            <span className="text-xs font-bold text-[#315B0B] bg-[#EEF4E3] px-2.5 py-1 rounded-full">
              Dine-In
            </span>
          </div>

          <div className="space-y-2">
            {currentOrder.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs font-semibold text-[#243019]">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#315B0B]"></span>
                  <span>{item}</span>
                </div>
                <span className="text-[10px] text-[#747B68] font-bold">Chef Plated</span>
              </div>
            ))}
          </div>

          {currentOrder.chefNotes && (
            <div className="bg-[#EEF4E3] rounded-2xl p-3 text-xs text-[#243019] border border-[#D0D8C2]/60">
              <span className="font-bold text-[#315B0B] block text-[10px] uppercase tracking-wider">Chef Special Request:</span>
              <p className="italic text-[#747B68] mt-0.5">{currentOrder.chefNotes}</p>
            </div>
          )}

          <div className="pt-3 border-t border-[#EEF4E3] flex items-center justify-between">
            <span className="text-xs font-bold text-[#747B68]">Bill Total (incl. 5% GST):</span>
            <span className="text-base font-black text-[#315B0B]">₹{parseFloat(currentOrder.total).toFixed(2)}</span>
          </div>
        </div>

        {/* Action Button: Order More Dishes */}
        <button
          onClick={() => navigateTo('menu')}
          className="w-full py-4 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center space-x-2 active:scale-[0.98]"
        >
          <Plus size={18} />
          <span>ORDER MORE DISHES FOR TABLE #{currentOrder.tableNumber || currentTable}</span>
        </button>

      </div>
    </div>
  );
};
