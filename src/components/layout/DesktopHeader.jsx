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
  Shield,
  Bell,
  UtensilsCrossed
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
    callWaiter,
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
    { id: 'menu', label: 'Culinary Menu', screen: 'menu' },
    { id: 'discovery', label: 'Our Restaurant & Story', screen: 'discovery' },
    { id: 'home', label: 'Dine-In Showcase', screen: 'home' }
  ];

  const secondaryNavLinks = [];

  const allNavLinks = [...primaryNavLinks];

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

          {/* Pure Restaurant Showcase Controls */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Table Badge */}
            <button
              onClick={() => navigateTo('menu')}
              className="flex items-center space-x-1.5 bg-[#E3EBD3] hover:bg-[#D8E2C6] border border-[#315B0B]/30 px-3.5 py-1.5 rounded-full text-xs font-black text-[#244507] transition-all shadow-xs shrink-0 cursor-pointer"
              title={`Table #${currentTable || '1'} Active • View Digital Menu`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#315B0B] animate-pulse"></span>
              <span className="tracking-tight uppercase">Table #{currentTable || '1'}</span>
            </button>

            {/* Quick Call Server Button */}
            <button
              onClick={() => callWaiter('Assistance')}
              className="hidden sm:flex items-center space-x-1.5 bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#244507] transition-all shrink-0 active:scale-95 cursor-pointer shadow-xs"
              title="Call waiter/server to your table"
            >
              <Bell size={13} className="text-[#315B0B]" />
              <span>Call Server</span>
            </button>

            {/* Admin QR Portal Link */}
            <a
              href={getAdminUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 bg-[#244507]/10 hover:bg-[#244507]/20 border border-[#315B0B]/20 px-3 py-1.5 rounded-full text-[11px] font-bold text-[#315B0B] transition-colors"
              title="Admin Panel: Generate & Print Table QR Codes"
            >
              <Shield size={12} />
              <span>Admin QR Portal</span>
              <ExternalLink size={10} className="text-[#747B68]" />
            </a>
          </div>


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
