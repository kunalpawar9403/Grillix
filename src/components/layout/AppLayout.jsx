import React from 'react';
import { useApp } from '../../context/AppContext';
import { DesktopHeader } from './DesktopHeader';
import { DesktopFooter } from './DesktopFooter';
import { MobileBottomNav } from '../common/MobileBottomNav';
import { MobileStatusBar } from '../common/MobileStatusBar';
import { Toast } from '../common/Toast';
import { ScanMobileModal } from '../common/ScanMobileModal';
import { QrCode } from 'lucide-react';

import { HomeScreen } from '../../pages/HomeScreen';
import { DiscoveryScreen } from '../../pages/DiscoveryScreen';
import { RestaurantDetailScreen } from '../../pages/RestaurantDetailScreen';
import { MenuScreen } from '../../pages/MenuScreen';
import { ProductDetailScreen } from '../../pages/ProductDetailScreen';
import { CartScreen } from '../../pages/CartScreen';
import { OrderTrackingScreen } from '../../pages/OrderTrackingScreen';
import { RewardsScreen } from '../../pages/RewardsScreen';
import { HowItWorksScreen } from '../../pages/HowItWorksScreen';
import { GiftCardsScreen } from '../../pages/GiftCardsScreen';
import { AccountScreen } from '../../pages/AccountScreen';
import { AuthScreen } from '../../pages/AuthScreen';
import { CustomBowlScreen } from '../../pages/CustomBowlScreen';

export const AppLayout = () => {
  const { 
    currentScreen, 
    deviceMode, 
    setDeviceMode,
    isScanModalOpen,
    setIsScanModalOpen
  } = useApp();

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'discovery':
        return <DiscoveryScreen />;
      case 'restaurant-detail':
        return <RestaurantDetailScreen />;
      case 'menu':
        return <MenuScreen />;
      case 'custom-bowl':
        return <CustomBowlScreen />;
      case 'product-detail':
        return <ProductDetailScreen />;
      case 'cart':
        return <CartScreen />;
      case 'order-tracking':
        return <OrderTrackingScreen />;
      case 'rewards':
        return <RewardsScreen />;
      case 'how-it-works':
        return <HowItWorksScreen />;
      case 'gift-cards':
        return <GiftCardsScreen />;
      case 'account':
        return <AccountScreen />;
      case 'auth':
        return <AuthScreen />;
      default:
        return <HomeScreen />;
    }
  };

  // If in iPhone mockup frame mode on desktop
  if (deviceMode === 'mobile-mockup') {
    return (
      <div className="min-h-screen bg-[#DDE7CD] flex flex-col items-center justify-start py-6 px-4 selection:bg-[#A8E83C]">
        <Toast />
        <ScanMobileModal isOpen={isScanModalOpen} onClose={() => setIsScanModalOpen(false)} />

        {/* Floating Top Control for Device Toggle & PWA Scan */}
        <div className="mb-6 bg-[#244507] text-[#EEF4E3] px-5 py-2.5 rounded-full shadow-lg flex items-center space-x-3 border border-[#315B0B] z-50">
          <span className="text-xs font-bold text-[#A8E83C]">iPhone 15 Pro Mode</span>
          <button
            onClick={() => setIsScanModalOpen(true)}
            className="text-xs bg-[#A8E83C] text-[#244507] hover:bg-white px-3 py-1 rounded-full font-extrabold transition-all flex items-center space-x-1"
            title="Scan QR Code to open on physical phone"
          >
            <QrCode size={13} />
            <span>Scan on Real Phone</span>
          </button>
          <button
            onClick={() => setDeviceMode('responsive')}
            className="text-xs bg-[#315B0B] hover:bg-[#A8E83C] hover:text-[#244507] text-white px-3 py-1 rounded-full font-bold transition-all"
          >
            Switch to Desktop
          </button>
        </div>

        {/* iPhone 15 Pro Hardware Frame */}
        <div className="relative w-[393px] h-[852px] max-h-[92vh] bg-black rounded-[52px] p-[11px] shadow-[0_25px_70px_rgba(36,69,7,0.35)] border-[4px] border-[#2B3023] ring-1 ring-black/40 overflow-hidden flex flex-col">
          {/* Inner Phone Screen */}
          <div className="relative w-full h-full bg-[#EEF4E3] rounded-[42px] overflow-hidden flex flex-col [transform:translateZ(0)]">
            {/* Status Bar */}
            <MobileStatusBar dark={currentScreen === 'home'} />

            {/* Screen Content - Scrollable */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative">
              {renderActiveScreen()}
            </div>

            {/* Mobile Bottom Nav touching bottom */}
            <MobileBottomNav />
          </div>
        </div>
      </div>
    );
  }

  // Standard Responsive Layout (Mobile, Tablet, Desktop)
  return (
    <div className="min-h-screen flex flex-col bg-[#EEF4E3] text-[#243019] relative w-full max-w-full overflow-x-hidden">
      <Toast />
      <ScanMobileModal isOpen={isScanModalOpen} onClose={() => setIsScanModalOpen(false)} />
      
      {/* Desktop Header - Hidden on Mobile to give 100% native phone experience */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      {/* Main Screen Content */}
      <main className="flex-1 w-full">
        {renderActiveScreen()}
      </main>

      {/* Floating Bottom Navigation on mobile/tablet */}
      <div className="md:hidden">
        <MobileBottomNav />
      </div>

      {/* Floating Quick Scan PWA Pill on Desktop */}
      <div className="hidden lg:block fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsScanModalOpen(true)}
          className="bg-[#244507] hover:bg-[#315B0B] text-[#A8E83C] border-2 border-[#A8E83C]/40 px-4 py-3 rounded-full shadow-2xl flex items-center space-x-2.5 text-xs font-extrabold transition-all hover:scale-105 active:scale-95 group"
          title="Open Scannable PWA QR Code for mobile"
        >
          <div className="w-7 h-7 rounded-full bg-[#A8E83C] text-[#244507] flex items-center justify-center group-hover:rotate-12 transition-transform">
            <QrCode size={15} strokeWidth={2.5} />
          </div>
          <span>Scan to Test on Phone</span>
        </button>
      </div>

      {/* Responsive Desktop Footer - Hidden on Mobile */}
      <div className="hidden md:block">
        <DesktopFooter />
      </div>
    </div>
  );
};
