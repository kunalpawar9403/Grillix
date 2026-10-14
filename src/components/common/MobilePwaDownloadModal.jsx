import React, { useState, useEffect } from 'react';
import { X, Download, Share, PlusSquare, Sparkles, CheckCircle2 } from 'lucide-react';

export const MobilePwaDownloadModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Only run in browser environment
    if (typeof window === 'undefined') return;

    // 2. Check if already running as an installed PWA (standalone)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isInStandaloneMode) {
      setIsStandalone(true);
      return;
    }

    // 3. STRICT CHECK: ONLY show for mobile view (< 768px), NEVER desktop view
    const isMobileView = window.innerWidth < 768;
    if (!isMobileView) {
      return;
    }

    // 4. Check if user already dismissed it this session
    const alreadyDismissed = sessionStorage.getItem('grillix_pwa_dismissed');
    if (alreadyDismissed) {
      return;
    }

    // 5. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // 6. Capture beforeinstallprompt on Android/Chromium
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 7. Pop up when website opens on mobile view (slight 600ms entrance delay for smooth loading)
    const showTimer = setTimeout(() => {
      // Re-verify screen width before opening
      if (window.innerWidth < 768) {
        setIsOpen(true);
      }
    }, 600);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      clearTimeout(showTimer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('grillix_pwa_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        handleClose();
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      // Show iOS step-by-step guidance
    } else {
      handleClose();
    }
  };

  // Do not render if not open or if installed
  if (!isOpen || isStandalone) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn md:hidden">
      {/* Click outside to dismiss */}
      <div className="absolute inset-0" onClick={handleClose}></div>

      {/* Mobile Bottom Sheet Card */}
      <div className="relative w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-6 shadow-2xl border-t border-[#D0D8C2] z-10 animate-slideUp">
        
        {/* Top drag handle indicator for native mobile sheet look */}
        <div className="w-12 h-1.5 bg-[#D0D8C2] rounded-full mx-auto mb-4"></div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#EEF4E3] hover:bg-[#E3EBD3] flex items-center justify-center text-[#243019] transition-all active:scale-95"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* App Identity Row */}
        <div className="flex items-center space-x-3.5 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-[#244507] p-2 flex items-center justify-center text-white shadow-md border border-[#315B0B] shrink-0">
            <svg className="w-8 h-8 text-[#A8E83C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-lg tracking-tight text-[#244507]">GRILLIX App</span>
              <span className="bg-[#A8E83C] text-[#244507] text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Official</span>
            </div>
            <p className="text-xs text-[#747B68] font-medium">Eat Fresh, Live Healthy</p>
            <div className="flex items-center space-x-1 text-[11px] text-[#315B0B] font-bold mt-0.5">
              <span>★ 4.9 (1.2k+ reviews)</span>
              <span>•</span>
              <span>Fast Mobile App</span>
            </div>
          </div>
        </div>

        {/* Value Proposition Highlights */}
        <div className="bg-[#EEF4E3] rounded-2xl p-3.5 mb-4 border border-[#D0D8C2]/70 space-y-2">
          <div className="flex items-center space-x-2.5 text-xs text-[#243019] font-bold">
            <CheckCircle2 size={15} className="text-[#315B0B] shrink-0" />
            <span>1-tap instant ordering & reordering</span>
          </div>
          <div className="flex items-center space-x-2.5 text-xs text-[#243019] font-bold">
            <CheckCircle2 size={15} className="text-[#315B0B] shrink-0" />
            <span>Interactive custom bowl builder with live macros</span>
          </div>
          <div className="flex items-center space-x-2.5 text-xs text-[#243019] font-bold">
            <CheckCircle2 size={15} className="text-[#315B0B] shrink-0" />
            <span>Real-time GPS order tracking & mobile rewards</span>
          </div>
        </div>

        {/* iOS Specific Instructions (if iPhone/iPad Safari) */}
        {isIOS ? (
          <div className="bg-white border-2 border-[#D0D8C2] rounded-2xl p-3.5 mb-4 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-[#244507] font-black uppercase tracking-wider text-[11px]">
              <Sparkles size={14} className="text-[#315B0B]" />
              <span>How to Install on iPhone:</span>
            </div>
            <div className="flex items-center space-x-2 text-[#243019] font-medium">
              <span className="w-5 h-5 rounded-full bg-[#EEF4E3] text-[#315B0B] font-black flex items-center justify-center text-[11px] shrink-0">1</span>
              <span>Tap the <strong>Share</strong> button <Share size={13} className="inline mx-1 text-[#315B0B]" /> in Safari</span>
            </div>
            <div className="flex items-center space-x-2 text-[#243019] font-medium">
              <span className="w-5 h-5 rounded-full bg-[#EEF4E3] text-[#315B0B] font-black flex items-center justify-center text-[11px] shrink-0">2</span>
              <span>Select <strong>Add to Home Screen</strong> <PlusSquare size={13} className="inline mx-1 text-[#315B0B]" /></span>
            </div>
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="space-y-2">
          {deferredPrompt ? (
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 px-4 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-black text-sm tracking-wide shadow-md transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <Download size={17} />
              <span>INSTALL GRILLIX APP</span>
            </button>
          ) : !isIOS ? (
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 px-4 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-black text-sm tracking-wide shadow-md transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <Download size={17} />
              <span>ADD TO HOME SCREEN</span>
            </button>
          ) : null}

          <button
            onClick={handleClose}
            className="w-full py-2.5 px-4 rounded-full bg-transparent hover:bg-[#EEF4E3] text-[#747B68] font-bold text-xs text-center transition-colors"
          >
            Continue in Browser
          </button>
        </div>

      </div>
    </div>
  );
};
