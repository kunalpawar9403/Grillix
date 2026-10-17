import React from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, ShieldCheck, Sparkles, Sprout, ArrowRight, ExternalLink } from 'lucide-react';
import { getAdminUrl } from '../../utils/navigation';

export const DesktopFooter = () => {
  const { navigateTo, setUserPoints, showToast } = useApp();

  return (
    <footer className="bg-[#244507] text-[#EEF4E3] pt-14 pb-24 lg:pb-12 border-t border-[#315B0B] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#315B0B]/80">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#315B0B] flex items-center justify-center text-[#A8E83C]">
                <Sprout size={24} />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white">GRILLIX</span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-[#A8E83C]">
                  Eat Fresh, Live Healthy
                </span>
              </div>
            </div>
            <p className="text-sm text-[#D0D8C2] max-w-sm leading-relaxed">
              Wholesome scratch-cooked bowls, vibrant organic greens, and nutrient-dense protein plates crafted to power your active lifestyle.
            </p>
            <div className="flex items-center space-x-3 text-xs text-[#A8E83C]">
              <span className="flex items-center space-x-1">
                <ShieldCheck size={14} />
                <span>100% Non-GMO</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Sparkles size={14} />
                <span>Organic Greens</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Heart size={14} />
                <span>Zero Seed Oils</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A8E83C] mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm text-[#D0D8C2]">
              <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home & Picks</button></li>
              <li><button onClick={() => navigateTo('menu')} className="hover:text-white transition-colors">Full Kitchen Menu</button></li>
              <li><button onClick={() => navigateTo('discovery')} className="hover:text-white transition-colors">Nearby Locations</button></li>
              <li><button onClick={() => navigateTo('rewards')} className="hover:text-white transition-colors">Loyalty Rewards</button></li>
              <li><button onClick={() => navigateTo('gift-cards')} className="hover:text-white transition-colors">Send a Gift Card</button></li>
              <li className="pt-1 border-t border-[#315B0B]">
                <a 
                  href={getAdminUrl()} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors flex items-center space-x-1 font-bold text-[#A8E83C]"
                  title="Open Kitchen Admin Console"
                >
                  <span>Kitchen Partner Portal</span>
                  <ExternalLink size={12} className="inline ml-1" />
                </a>
              </li>
            </ul>
          </div>

          {/* Nutrition & Values */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A8E83C] mb-4">Transparency</h4>
            <ul className="space-y-2.5 text-sm text-[#D0D8C2]">
              <li>
                <button 
                  onClick={() => {
                    navigateTo('menu');
                    showToast('Viewing dishes with complete protein, carbs & calorie breakdowns');
                  }} 
                  className="hover:text-white text-left transition-colors"
                >
                  Calorie & Macro Guide
                </button>
              </li>
              <li>
                <button 
                  onClick={() => showToast('Allergen Info: 100% Non-GMO, gluten-free & vegan options available')} 
                  className="hover:text-white text-left transition-colors"
                >
                  Allergen Information
                </button>
              </li>
              <li>
                <button 
                  onClick={() => showToast('Partnered with organic regenerative family farms across CO & CA')} 
                  className="hover:text-white text-left transition-colors"
                >
                  Farm Partners
                </button>
              </li>
              <li>
                <button 
                  onClick={() => showToast('100% compostable fiber bowls & electric eco-couriers')} 
                  className="hover:text-white text-left transition-colors"
                >
                  Carbon Neutral Delivery
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('how-it-works')} className="hover:text-white text-left transition-colors">
                  How Rewards Work
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A8E83C] mb-2">Fresh In Your Inbox</h4>
            <p className="text-xs text-[#D0D8C2]">Subscribe for weekly seasonal harvests and 100 bonus loyalty points.</p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.elements.newsletterEmail;
                if (!input.value.trim() || !input.value.includes('@')) {
                  showToast('Please enter a valid email address');
                  return;
                }
                setUserPoints((p) => p + 100);
                showToast(`Thanks for subscribing! 100 bonus loyalty points added 🎉`);
                input.value = '';
              }}
              className="flex"
            >
              <input 
                name="newsletterEmail"
                type="email" 
                placeholder="you@email.com"
                className="bg-[#1A3304] text-xs text-white placeholder-[#747B68] rounded-l-xl px-3 py-2 border border-[#315B0B] focus:outline-none focus:border-[#A8E83C] w-full"
              />
              <button 
                type="submit"
                className="bg-[#A8E83C] text-[#244507] px-3.5 py-2 rounded-r-xl font-bold hover:bg-[#b8f553] transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#747B68] gap-4">
          <p>© 2026 GRILLIX Healthy Foods Co. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 sm:gap-6 text-[#D0D8C2]">
            <button 
              onClick={() => showToast('Privacy Policy: We never sell or share your personal food data.')} 
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => showToast('Terms of Service: Freshness guaranteed on every single delivery.')} 
              className="hover:text-white transition-colors"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => showToast('Accessibility: WCAG AAA high contrast color compliance.')} 
              className="hover:text-white transition-colors"
            >
              Accessibility
            </button>
            <button 
              onClick={() => showToast('Cookie Preferences: Strictly essential functional cookies active.')} 
              className="hover:text-white transition-colors"
            >
              Cookie Preferences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
