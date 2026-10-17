import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  ShoppingBag, 
  Sparkles, 
  ChevronDown, 
  Menu as MenuIcon,
  X,
  User,
  LogOut,
  Clock,
  Award,
  ExternalLink,
  Shield
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RESTAURANTS } from '../../data/mockData';
import { getAdminUrl } from '../../utils/navigation';

export const DesktopHeader = () => {
  const { 
    currentScreen, 
    navigateTo, 
    cartItemCount, 
    userPoints, 
    selectedRestaurant, 
    setSelectedRestaurant,
    searchQuery,
    setSearchQuery,
    currentUser,
    currentTable,
    logout
  } = useApp();

  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const locationRef = useRef(null);
  const userMenuRef = useRef(null);
  const moreMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setLocationDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryNavLinks = [
    { id: 'menu', label: 'Menu', screen: 'menu' },
    { id: 'custom-bowl', label: 'Build Bowl', screen: 'custom-bowl', isSpecial: true },
    { id: 'discovery', label: 'Our Restaurant', screen: 'discovery' },
    { id: 'rewards', label: 'Rewards', screen: 'rewards' },
  ];

  const secondaryNavLinks = [
    { id: 'gift-cards', label: 'Gift Cards', screen: 'gift-cards' },
    { id: 'how-it-works', label: 'How It Works', screen: 'how-it-works' },
    { id: 'order-tracking', label: 'Track Order', screen: 'order-tracking' },
  ];

  const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('menu');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#EEF4E3]/95 backdrop-blur-md border-b border-[#D0D8C2]/80 shadow-xs transition-all">

      {/* Sleek, Compact Desktop Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 lg:gap-4">
        
        {/* Brand Logo & Location */}
        <div className="flex items-center space-x-3.5 lg:space-x-4 shrink-0">
          <button 
            onClick={() => navigateTo('home')} 
            className="flex items-center space-x-2 group text-left focus:outline-none shrink-0"
            aria-label="GRILLIX Home"
          >
            <div className="w-8 h-8 rounded-xl bg-[#315B0B] flex items-center justify-center text-white shadow-xs group-hover:bg-[#244507] transition-all">
              <svg className="w-5 h-5 text-[#A8E83C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#244507] group-hover:text-[#315B0B] transition-colors leading-none block">
                GRILLIX
              </span>
              <span className="block text-[8px] uppercase font-bold tracking-widest text-[#747B68] leading-tight">
                Fresh & Healthy
              </span>
            </div>
          </button>

          {/* Restaurant Location & Live Delivery Badge (Desktop) */}
          <button
            onClick={() => navigateTo('discovery')}
            className="hidden xl:flex items-center space-x-2 bg-[#E3EBD3] hover:bg-[#D8E2C6] px-3.5 py-1.5 rounded-full border border-[#D0D8C2] text-xs font-bold text-[#243019] transition-all hover:shadow-xs group shrink-0"
            title="View Restaurant Location & Delivery Zone"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
            <MapPin size={13} className="text-[#315B0B] shrink-0" />
            <span className="max-w-[170px] truncate">{selectedRestaurant?.shortAddress || 'Spine Rd, Moshi, Pune'}</span>
            <span className="text-[10px] bg-[#244507] text-[#A8E83C] px-2 py-0.5 rounded-full font-black ml-1">
              Live Kitchen
            </span>
          </button>
        </div>

        {/* Short, Concise Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 shrink-0">
          {primaryNavLinks.map((link) => {
            const isActive = currentScreen === link.screen;
            const isBuildBowl = link.isSpecial;
            return (
              <button
                key={link.id}
                onClick={() => navigateTo(link.screen)}
                className={`px-3 py-1.5 rounded-full text-xs lg:text-[13px] font-bold whitespace-nowrap transition-all duration-150 flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-[#244507] text-[#A8E83C] shadow-xs'
                    : isBuildBowl
                      ? 'text-[#244507] bg-[#DDE8CD] hover:bg-[#D0DEB8] border border-[#244507]/15'
                      : 'text-[#243019] hover:bg-[#E3EBD3]'
                }`}
              >
                {isBuildBowl && (
                  <Sparkles size={12} className={isActive ? 'text-[#A8E83C]' : 'text-[#315B0B]'} />
                )}
                <span>{link.label}</span>
              </button>
            );
          })}

          {/* "More" dropdown for secondary links */}
          <div ref={moreMenuRef} className="relative">
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className="px-2.5 py-1.5 rounded-full text-xs lg:text-[13px] font-bold text-[#747B68] hover:text-[#243019] hover:bg-[#E3EBD3] transition-colors flex items-center space-x-1"
            >
              <span>More</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${moreMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {moreMenuOpen && (
              <div className="absolute left-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-[#D0D8C2] p-1.5 z-50 animate-fadeIn">
                {secondaryNavLinks.map((subLink) => (
                  <button
                    key={subLink.id}
                    onClick={() => {
                      navigateTo(subLink.screen);
                      setMoreMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      currentScreen === subLink.screen
                        ? 'bg-[#EEF4E3] text-[#244507]'
                        : 'text-[#243019] hover:bg-[#F5F8EF]'
                    }`}
                  >
                    {subLink.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Side Controls: Search, Points, Cart, Profile */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Compact Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden 2xl:block w-36 focus-within:w-44 transition-all duration-200">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#E3EBD3]/70 hover:bg-[#E3EBD3] focus:bg-white text-xs text-[#243019] placeholder-[#747B68] rounded-full pl-7 pr-6 py-1.5 border border-[#D0D8C2] focus:outline-none focus:border-[#315B0B] transition-all font-medium"
            />
            <Search size={12} className="absolute left-2.5 top-2 text-[#747B68]" />
            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-[#747B68] hover:text-[#243019]"
                aria-label="Clear search"
              >
                <X size={11} />
              </button>
            )}
          </form>

          {/* Signed In State vs Signed Out State */}
          {currentUser?.isLoggedIn ? (
            <>
              {/* Loyalty Points Pill */}
              <button
                onClick={() => navigateTo('rewards')}
                className="hidden sm:flex items-center space-x-1.5 bg-[#E3EBD3] hover:bg-[#D8E2C6] border border-[#D0D8C2] px-2.5 py-1.5 rounded-full text-xs font-bold text-[#244507] transition-all whitespace-nowrap shrink-0"
                title="Your Rewards Balance"
              >
                <Sparkles size={12} className="text-[#315B0B]" />
                <span>{userPoints.toLocaleString()}</span>
                <span className="text-[10px] text-[#747B68] font-semibold">PTS</span>
              </button>



              {/* Dine-In Table Badge */}
              <button
                onClick={() => navigateTo('cart')}
                className="flex items-center space-x-1.5 bg-[#E3EBD3] hover:bg-[#D8E2C6] border border-[#315B0B]/30 px-3 py-1 rounded-full text-xs font-black text-[#244507] transition-all shadow-2xs shrink-0"
                title={`Dine-in active at Table #${currentTable}`}
              >
                <span className="w-2 h-2 rounded-full bg-[#315B0B] animate-pulse"></span>
                <span>Table #{currentTable}</span>
              </button>

              {/* Cart Bag Button */}
              <button
                onClick={() => navigateTo('cart')}
                className="relative w-8 h-8 rounded-full bg-[#244507] text-[#A8E83C] hover:bg-[#315B0B] transition-colors focus:outline-none shadow-sm active:scale-95 flex items-center justify-center shrink-0"
                aria-label="Shopping Bag"
                title="Shopping Bag"
              >
                <ShoppingBag size={15} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-4.5 px-1 bg-[#A8E83C] text-[#0F2002] font-black text-[10px] leading-none rounded-full flex items-center justify-center border-2 border-white shadow-md select-none animate-scale">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Profile Avatar with Dropdown */}
              <div ref={userMenuRef} className="relative shrink-0">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-1.5 bg-[#E3EBD3]/80 hover:bg-[#D8E2C6] border border-[#D0D8C2] pl-1 pr-2 py-0.5 rounded-full group focus:outline-none transition-all shadow-xs"
                  title="My Account Menu"
                >
                  <div className="relative">
                    <img
                      src={currentUser.avatar || '/images/avatar-jhon.jpg'}
                      alt={currentUser.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/avatar-jhon.jpg';
                      }}
                      className="w-6 h-6 rounded-full object-cover border border-[#315B0B]"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#A8E83C] border border-white"></span>
                  </div>
                  <span className="text-xs font-bold text-[#243019] max-w-[75px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={12} className={`text-[#747B68] transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-[#D0D8C2] py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-[#EEF4E3]">
                      <p className="text-xs font-bold text-[#243019] truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-[#747B68] truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        navigateTo('account');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#243019] hover:bg-[#EEF4E3] flex items-center space-x-2.5 transition-colors"
                    >
                      <User size={15} className="text-[#315B0B]" />
                      <span>Profile & Diet Tags</span>
                    </button>

                    <button
                      onClick={() => {
                        navigateTo('rewards');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#243019] hover:bg-[#EEF4E3] flex items-center space-x-2.5 transition-colors"
                    >
                      <Award size={15} className="text-[#315B0B]" />
                      <span>Rewards ({userPoints} PTS)</span>
                    </button>

                    <button
                      onClick={() => {
                        navigateTo('order-tracking');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#243019] hover:bg-[#EEF4E3] flex items-center space-x-2.5 transition-colors"
                    >
                      <Clock size={15} className="text-[#315B0B]" />
                      <span>Order Tracking</span>
                    </button>

                    <a
                      href={getAdminUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#243019] hover:bg-[#EEF4E3] flex items-center justify-between transition-colors"
                      title="Open Kitchen Partner Console"
                    >
                      <div className="flex items-center space-x-2.5">
                        <Shield size={15} className="text-[#315B0B]" />
                        <span>Partner Console</span>
                      </div>
                      <ExternalLink size={12} className="text-[#747B68]" />
                    </a>

                    <div className="my-1 border-t border-[#EEF4E3]"></div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center space-x-2.5 transition-colors"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Cart Bag Button */}
              <button
                onClick={() => navigateTo('cart')}
                className="relative w-9 h-9 rounded-full bg-[#244507] text-[#A8E83C] hover:bg-[#315B0B] transition-colors focus:outline-none shadow-sm active:scale-95 flex items-center justify-center shrink-0"
                aria-label="Shopping Bag"
                title="Shopping Bag"
              >
                <ShoppingBag size={17} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-[#A8E83C] text-[#0F2002] font-black text-xs leading-none rounded-full flex items-center justify-center border-2 border-white shadow-md ring-1 ring-black/15 select-none animate-scale">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Sign In / Register Button */}
              <button
                onClick={() => navigateTo('auth')}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white text-xs font-extrabold transition-all shadow-sm active:scale-95 shrink-0"
                title="Sign In or Register"
              >
                <User size={13} />
                <span>Log In</span>
              </button>
            </>
          )}


          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#244507] hover:bg-[#E3EBD3] rounded-full transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Nav Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#EEF4E3] border-b border-[#D0D8C2] px-6 py-4 space-y-3 animate-fadeIn">
          {allNavLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                navigateTo(link.screen);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm ${
                currentScreen === link.screen
                  ? 'bg-[#244507] text-[#A8E83C]'
                  : 'text-[#243019] hover:bg-[#E3EBD3]'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#D0D8C2] flex items-center justify-between">
            <span className="text-xs text-[#747B68]">Kitchen: {selectedRestaurant.name}</span>
            <button 
              onClick={() => {
                navigateTo('discovery');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-[#315B0B]"
            >
              Change Location
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
