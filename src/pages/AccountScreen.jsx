import React, { useState } from 'react';
import { 
  ChevronLeft, 
  User, 
  MapPin, 
  CreditCard, 
  Award, 
  Heart, 
  LogOut, 
  ChevronRight, 
  Sparkles, 
  Check, 
  ShoppingBag, 
  Clock, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANTS } from '../data/mockData';

export const AccountScreen = () => {
  const { 
    goBack, 
    navigateTo, 
    currentUser, 
    userPoints, 
    updateDietaryPreferences, 
    logout, 
    login, 
    reorder,
    showToast 
  } = useApp();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState('profile'); // 'profile' | 'orders'

  const allPrefs = [
    'Organic Greens', 
    'High Protein', 
    'Non-GMO', 
    'Gluten-Free', 
    'Vegan', 
    'Dairy-Free',
    'Keto Friendly'
  ];

  const userDietary = currentUser?.dietary || ['Organic Greens', 'High Protein'];

  const togglePref = (pref) => {
    let next;
    if (userDietary.includes(pref)) {
      next = userDietary.filter((p) => p !== pref);
      showToast(`Removed filter: ${pref}`);
    } else {
      next = [...userDietary, pref];
      showToast(`Added filter: ${pref}`);
    }
    updateDietaryPreferences(next);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  const handleQuickDemoLogin = () => {
    login({
      fullName: 'Jhon Snow',
      email: 'shahinurstk02@gmail.com',
      password: 'DemoPassword2026',
      dietary: ['Organic Greens', 'High Protein', 'Non-GMO']
    });
  };

  // If user is currently signed out
  if (!currentUser?.isLoggedIn) {
    return (
      <div className="w-full min-h-screen pb-28 md:pb-16 animate-fadeIn bg-[#EEF4E3]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
              aria-label="Back"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#243019] tracking-tight">
              My Profile
            </h1>
            <div className="w-10"></div>
          </div>

          {/* Signed Out Banner Card */}
          <div className="bg-white rounded-3xl p-8 border border-[#D0D8C2] shadow-sm text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-[#EEF4E3] border-2 border-[#D0D8C2] flex items-center justify-center text-[#315B0B] mx-auto shadow-inner">
              <User size={36} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#243019]">Welcome to GRILLIX</h2>
              <p className="text-xs sm:text-sm text-[#747B68] max-w-sm mx-auto leading-relaxed">
                Sign in to your account to view your live orders, redeem loyalty points, and personalize healthy recipe suggestions.
              </p>
            </div>

            {/* Perks list */}
            <div className="bg-[#EEF4E3] rounded-2xl p-4 text-left space-y-2.5 border border-[#D0D8C2]/60">
              <div className="flex items-center space-x-2.5 text-xs text-[#244507] font-semibold">
                <Sparkles size={15} className="text-[#315B0B] shrink-0" />
                <span>Get 150 Welcome Points immediately upon registration</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-[#244507] font-semibold">
                <Check size={15} className="text-[#315B0B] shrink-0" />
                <span>Save delivery addresses & 1-tap reordering</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-[#244507] font-semibold">
                <Check size={15} className="text-[#315B0B] shrink-0" />
                <span>Automatic calorie & allergen dish filtering</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => navigateTo('auth')}
                className="w-full py-3.5 px-6 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md transition-all active:scale-98"
              >
                <span>Sign In / Create Account</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={handleQuickDemoLogin}
                className="w-full py-3 px-6 rounded-full bg-[#EEF4E3] hover:bg-[#E3EBD3] text-[#243019] border border-[#D0D8C2] font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
              >
                <Sparkles size={14} className="text-[#315B0B]" />
                <span>Quick Demo Sign In (Jhon Snow)</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-3xl p-4 border border-[#D0D8C2] shadow-xs divide-y divide-[#EEF4E3]">
            <button
              onClick={() => navigateTo('menu')}
              className="w-full p-3 flex items-center justify-between hover:bg-[#EEF4E3] rounded-2xl transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#EEF4E3] text-[#315B0B] flex items-center justify-center">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#243019] block">Browse Menu</span>
                  <span className="text-[11px] text-[#747B68]">Explore fresh harvest bowls & protein plates</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-[#747B68]" />
            </button>

            <button
              onClick={() => navigateTo('discovery')}
              className="w-full p-3 flex items-center justify-between hover:bg-[#EEF4E3] rounded-2xl transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#EEF4E3] text-[#315B0B] flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-[#243019] block">Find Kitchens</span>
                  <span className="text-[11px] text-[#747B68]">Locate your nearest GRILLIX healthy kitchen</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-[#747B68]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Profile View
  return (
    <div className="w-full min-h-screen pb-28 md:pb-16 animate-fadeIn bg-[#EEF4E3]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>

          <h1 className="text-lg sm:text-xl font-extrabold text-[#243019] tracking-tight">
            Account & Profile
          </h1>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-full transition-all active:scale-95"
            title="Log Out"
          >
            Log Out
          </button>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#D0D8C2] shadow-xs text-center sm:text-left flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5">
          <div className="relative">
            <img
              src={currentUser.avatar || '/images/avatar-jhon.jpg'}
              alt={currentUser.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/images/avatar-jhon.jpg';
              }}
              className="w-20 h-20 rounded-full object-cover border-4 border-[#315B0B] shadow-md"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#A8E83C] border-2 border-white" title="Active Member"></span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-[#243019] truncate">{currentUser.name}</h2>
                <p className="text-xs text-[#747B68] font-bold mt-0.5">{currentUser.handle}</p>
                <p className="text-xs text-[#747B68] truncate">{currentUser.email}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
              <button
                onClick={() => navigateTo('rewards')}
                className="inline-flex items-center space-x-1.5 bg-[#EEF4E3] hover:bg-[#E3EBD3] text-[#315B0B] text-xs font-bold px-3 py-1 rounded-full border border-[#D0D8C2] transition-colors"
                title="View Rewards"
              >
                <Award size={13} />
                <span>{userPoints.toLocaleString()} Loyalty PTS</span>
              </button>
              <span className="bg-[#244507] text-[#A8E83C] text-xs font-bold px-3 py-1 rounded-full">
                {currentUser.tier || 'Gold Tier Member'}
              </span>
            </div>
          </div>
        </div>

        {/* Section Tabs: Profile Preferences vs Order History */}
        <div className="flex bg-[#E3EBD3] p-1 rounded-2xl border border-[#D0D8C2]">
          <button
            onClick={() => setActiveTabSection('profile')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
              activeTabSection === 'profile'
                ? 'bg-white text-[#244507] shadow-xs'
                : 'text-[#747B68] hover:text-[#244507]'
            }`}
          >
            Preferences & Settings
          </button>
          <button
            onClick={() => setActiveTabSection('orders')}
            className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
              activeTabSection === 'orders'
                ? 'bg-white text-[#244507] shadow-xs'
                : 'text-[#747B68] hover:text-[#244507]'
            }`}
          >
            Recent Orders & Tracking
          </button>
        </div>

        {activeTabSection === 'profile' ? (
          <>
            {/* Dietary Preferences Selector */}
            <div className="bg-white rounded-3xl p-6 border border-[#D0D8C2] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-[#243019] flex items-center space-x-2">
                  <Sparkles size={16} className="text-[#315B0B]" />
                  <span>Personalized Nutrition Preferences</span>
                </h3>
                <span className="text-[11px] text-[#315B0B] font-bold bg-[#EEF4E3] px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
              <p className="text-xs text-[#747B68]">
                Dishes matching your tags receive priority placement on your GRILLIX home and menu screens:
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {allPrefs.map((pref) => {
                  const isSelected = userDietary.includes(pref);
                  return (
                    <button
                      key={pref}
                      onClick={() => togglePref(pref)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-[#315B0B] text-white shadow-xs scale-102'
                          : 'bg-[#EEF4E3] text-[#243019] border border-[#D0D8C2] hover:bg-[#E3EBD3]'
                      }`}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                      <span>{pref}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Account Menu Navigation */}
            <div className="bg-white rounded-3xl p-3 border border-[#D0D8C2] shadow-xs divide-y divide-[#EEF4E3]">
              
              <button
                onClick={() => navigateTo('rewards')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-[#EEF4E3] rounded-2xl transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF4E3] text-[#315B0B] flex items-center justify-center">
                    <Award size={18} />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#243019] block">Loyalty Points & Rewards</span>
                    <span className="text-[11px] text-[#747B68]">Balance: {userPoints.toLocaleString()} PTS • Redeem for free bowls</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#747B68]" />
              </button>

              <button
                onClick={() => navigateTo('discovery')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-[#EEF4E3] rounded-2xl transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF4E3] text-[#315B0B] flex items-center justify-center">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#243019] block">Saved Locations & Addresses</span>
                    <span className="text-[11px] text-[#747B68] truncate max-w-xs block">
                      {currentUser.addresses?.[0] || RESTAURANTS[0].shortAddress}
                    </span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#747B68]" />
              </button>

              <button
                onClick={() => navigateTo('gift-cards')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-[#EEF4E3] rounded-2xl transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF4E3] text-[#315B0B] flex items-center justify-center">
                    <Heart size={18} />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#243019] block">Gift Cards</span>
                    <span className="text-[11px] text-[#747B68]">Send digital cards with custom messages</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#747B68]" />
              </button>

              <button
                onClick={() => showToast('Payment secured with Apple Pay & 256-bit SSL encryption')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-[#EEF4E3] rounded-2xl transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EEF4E3] text-[#315B0B] flex items-center justify-center">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#243019] block">Payment Methods</span>
                    <span className="text-[11px] text-[#747B68]">Apple Pay • Visa Card ending in 4082</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#747B68]" />
              </button>

              <button
                onClick={() => navigateTo('auth')}
                className="w-full p-3.5 flex items-center justify-between hover:bg-[#EEF4E3] rounded-2xl transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#244507] text-[#A8E83C] flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-[#243019] block">Switch Account / Register New</span>
                    <span className="text-[11px] text-[#747B68]">Change email or sign in as a different member</span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#747B68]" />
              </button>

            </div>
          </>
        ) : (
          /* Order History Section */
          <div className="space-y-3">
            <div className="bg-white rounded-3xl p-5 border border-[#D0D8C2] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-[#243019] flex items-center space-x-2">
                  <Clock size={16} className="text-[#315B0B]" />
                  <span>Order History</span>
                </h3>
                <button
                  onClick={() => navigateTo('order-tracking')}
                  className="text-xs font-bold text-[#315B0B] hover:underline"
                >
                  Live Tracking Map
                </button>
              </div>

              {currentUser.orders && currentUser.orders.length > 0 ? (
                <div className="space-y-3">
                  {currentUser.orders.map((order) => (
                    <div 
                      key={order.id}
                      className="p-4 rounded-2xl bg-[#EEF4E3] border border-[#D0D8C2] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-extrabold text-[#243019]">Order #{order.id}</span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            order.status === 'In Delivery' 
                              ? 'bg-[#315B0B] text-white animate-pulse' 
                              : 'bg-[#D0D8C2] text-[#243019]'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#747B68]">{order.date}</p>
                        <p className="text-xs text-[#243019] font-medium">
                          {Array.isArray(order.items) ? order.items.join(' • ') : order.items}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#D0D8C2]/50">
                        <span className="text-sm font-extrabold text-[#244507] pr-1">
                          ${order.total.toFixed(2)}
                        </span>
                        <button
                          onClick={() => reorder(order)}
                          className="px-3 py-1.5 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white text-xs font-bold transition-all flex items-center space-x-1 shadow-xs active:scale-95"
                          title="Add items to bag"
                        >
                          <RotateCcw size={12} />
                          <span>Reorder</span>
                        </button>
                        <button
                          onClick={() => navigateTo('order-tracking')}
                          className="px-3 py-1.5 rounded-full bg-[#244507] hover:bg-[#315B0B] text-[#A8E83C] text-xs font-bold transition-all shadow-xs active:scale-95"
                        >
                          Track
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag size={32} className="text-[#747B68] mx-auto mb-2 opacity-60" />
                  <p className="text-sm font-bold text-[#243019]">No past orders yet</p>
                  <p className="text-xs text-[#747B68] mt-1">Place your first order to track it here!</p>
                  <button
                    onClick={() => navigateTo('menu')}
                    className="mt-4 px-5 py-2 rounded-full bg-[#315B0B] text-white text-xs font-bold"
                  >
                    Start Order
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prominent Working Log Out Button */}
        <div className="pt-2 text-center pb-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-sm font-extrabold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 py-3.5 px-8 rounded-full shadow-xs transition-all active:scale-98"
          >
            <LogOut size={16} />
            <span>Sign Out of GRILLIX</span>
          </button>
        </div>

      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-[#D0D8C2] shadow-2xl text-center space-y-4 animate-scale">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
              <LogOut size={24} />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-[#243019]">Sign Out Confirmation</h3>
              <p className="text-xs text-[#747B68] mt-1">
                Are you sure you want to log out of your GRILLIX account? Your cart and preferences will remain saved.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="py-2.5 px-4 rounded-full border border-[#D0D8C2] text-xs font-bold text-[#243019] hover:bg-[#EEF4E3] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="py-2.5 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold transition-colors shadow-sm"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
