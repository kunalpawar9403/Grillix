import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Smartphone, 
  Copy, 
  Check, 
  X, 
  Wifi, 
  Sparkles, 
  Download 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ScanMobileModal = ({ isOpen, onClose }) => {
  const { showToast } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);

  // Network IP detected on host machine
  const networkIp = '192.168.1.6';
  const defaultPort = '5173';
  
  // Choose between local network IP and current origin
  const [urlType, setUrlType] = useState('network'); // 'network' | 'current'

  const targetUrl = urlType === 'network'
    ? `http://${networkIp}:${defaultPort}/`
    : typeof window !== 'undefined' ? window.location.origin : `http://${networkIp}:${defaultPort}/`;

  useEffect(() => {
    // Generate QR Code data URL
    QRCode.toDataURL(targetUrl, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#244507',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    }).then((url) => {
      setQrDataUrl(url);
    }).catch((err) => {
      console.error('QR code generation error:', err);
    });
  }, [targetUrl]);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      showToast(`Copied to clipboard: ${targetUrl}`);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        showToast('GRILLIX PWA installed to device!');
      }
      setInstallPrompt(null);
    } else {
      showToast('To install, tap Share [↑] -> "Add to Home Screen" in your mobile browser');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#EEF4E3] max-w-lg w-full rounded-4xl p-6 sm:p-8 border border-[#D0D8C2] shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#243019] flex items-center justify-center border border-[#D0D8C2] transition-colors"
          aria-label="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center space-x-2 bg-[#244507] text-[#A8E83C] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Smartphone size={13} />
            <span>Scan & View On Mobile PWA</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#243019] tracking-tight">
            Experience GRILLIX on Phone
          </h2>
          <div className="flex justify-center space-x-2 pt-1">
            <button
              onClick={() => setUrlType('network')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                urlType === 'network' 
                  ? 'bg-[#244507] text-[#A8E83C]' 
                  : 'bg-white text-[#747B68] border border-[#D0D8C2]'
              }`}
            >
              Wi-Fi Network ({networkIp})
            </button>
            <button
              onClick={() => setUrlType('current')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                urlType === 'current' 
                  ? 'bg-[#244507] text-[#A8E83C]' 
                  : 'bg-white text-[#747B68] border border-[#D0D8C2]'
              }`}
            >
              Localhost Origin
            </button>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="bg-white rounded-3xl p-5 border border-[#D0D8C2] shadow-sm flex flex-col items-center justify-center space-y-3">
          {qrDataUrl ? (
            <div className="relative p-2 bg-white rounded-2xl border-2 border-[#D0D8C2]/60 shadow-xs">
              <img
                src={qrDataUrl}
                alt="GRILLIX Mobile PWA QR Code"
                className="w-56 h-56 object-contain rounded-xl"
              />
              {/* Center Emblem */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-xl bg-[#315B0B] border-2 border-white flex items-center justify-center text-[#A8E83C] shadow-md">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-56 h-56 flex items-center justify-center bg-stone-100 rounded-2xl">
              <span className="text-xs text-[#747B68]">Generating QR code...</span>
            </div>
          )}

          {/* Wi-Fi Note */}
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#315B0B] bg-[#EEF4E3] px-3 py-1 rounded-full">
            <Wifi size={13} />
            <span>Connect your phone to same Wi-Fi network</span>
          </div>

          {/* URL Pill & Copy Button */}
          <div className="w-full flex items-center justify-between bg-[#EEF4E3] rounded-2xl px-3.5 py-2.5 border border-[#D0D8C2] text-xs">
            <span className="font-mono font-bold text-[#243019] truncate pr-2">
              {targetUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-1 px-3 py-1 rounded-xl bg-[#315B0B] text-white hover:bg-[#244507] font-bold text-xs shrink-0 transition-all active:scale-95 shadow-xs"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* PWA Install Instructions */}
        <div className="mt-5 space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#243019] flex items-center space-x-1.5">
            <Sparkles size={14} className="text-[#315B0B]" />
            <span>How to Install as Native App:</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {/* iOS */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#D0D8C2]">
              <div className="font-extrabold text-[#243019] flex items-center space-x-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#315B0B]"></span>
                <span>iPhone / iOS Safari</span>
              </div>
              <ol className="text-[11px] text-[#747B68] space-y-1 list-decimal list-inside leading-relaxed">
                <li>Scan QR code with Camera.</li>
                <li>Tap Share icon <strong className="text-[#243019]">[↑]</strong>.</li>
                <li>Tap <strong className="text-[#243019]">"Add to Home Screen"</strong>.</li>
              </ol>
            </div>

            {/* Android */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#D0D8C2]">
              <div className="font-extrabold text-[#243019] flex items-center space-x-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-[#A8E83C] border border-[#315B0B]"></span>
                <span>Android / Chrome</span>
              </div>
              <ol className="text-[11px] text-[#747B68] space-y-1 list-decimal list-inside leading-relaxed">
                <li>Scan QR code to open URL.</li>
                <li>Tap Chrome menu <strong className="text-[#243019]">⋮</strong>.</li>
                <li>Tap <strong className="text-[#243019]">"Install App"</strong>.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Direct Install CTA button (Chrome/Edge/Android) */}
        {installPrompt && (
          <div className="mt-4">
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md transition-all active:scale-[0.98]"
            >
              <Download size={16} />
              <span>Install GRILLIX PWA to this Device</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
