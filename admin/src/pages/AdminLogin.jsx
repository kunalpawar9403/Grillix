import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  Store,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const AdminLogin = () => {
  const { adminLogin, restaurantSettings, showToast } = useAdmin();
  const [email, setEmail] = useState('admin@grillix.in');
  const [password, setPassword] = useState('grillix123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const success = adminLogin(email, password);
      setLoading(false);
      if (!success) {
        showToast('⚠️ Invalid email or password');
      }
    }, 400);
  };

  const handleQuickDemoLogin = () => {
    setEmail('admin@grillix.in');
    setPassword('grillix123');
    setLoading(true);
    setTimeout(() => {
      adminLogin('admin@grillix.in', 'grillix123');
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#070e05] text-[#e8f2db] flex flex-col justify-between p-4 sm:p-6 font-sans selection:bg-[#a8e83c] selection:text-[#070e05] relative overflow-hidden">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#a8e83c]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#2d580a]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#244709] to-[#a8e83c] flex items-center justify-center text-[#070e05] font-black text-xl shadow-lg ring-2 ring-[#a8e83c]/30">
            G
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-white text-base tracking-tight">GRILLIX</span>
              <span className="text-[10px] font-black bg-[#a8e83c] text-[#070e05] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Partner Admin
              </span>
            </div>
            <span className="text-[11px] text-[#8fa778] font-medium hidden sm:inline">
              Kitchen Operations & Partner Control Panel
            </span>
          </div>
        </div>

        <a
          href="http://localhost:5174"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#12210b] hover:bg-[#1c3511] text-[#a8e83c] text-xs font-bold transition-colors border border-[#213e13]"
          title="Open Customer Storefront on Port 5174"
        >
          <span>Storefront (Port 5174)</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Center Login Box */}
      <div className="max-w-md w-full mx-auto my-8 z-10 space-y-6">
        
        {/* Card Box */}
        <div className="bg-[#0e1a0b]/90 backdrop-blur-xl border border-[#203913] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#172b0f] text-[#a8e83c] flex items-center justify-center mx-auto border border-[#28491a] shadow-inner">
              <Lock size={22} />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Sign In to Kitchen Admin
            </h2>
            <p className="text-xs text-[#8fa778]">
              Authorized station access for <b className="text-white">{restaurantSettings.name}</b>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[#8fa778] font-bold block">Admin Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fa778]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@grillix.in"
                  className="w-full bg-[#14260e] border border-[#234015] rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-[#5a7247] focus:outline-none focus:border-[#a8e83c] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-[#8fa778] font-bold block">Password</label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fa778]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#14260e] border border-[#234015] rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-[#5a7247] focus:outline-none focus:border-[#a8e83c] transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8fa778] hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-[#8fa778] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-[#14260e] border-[#234015] text-[#a8e83c] focus:ring-0"
                />
                <span>Remember this terminal</span>
              </label>
              <span className="text-[11px] text-[#a8e83c] font-semibold">Port 5175 Protected</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-[#a8e83c] hover:bg-[#bcf856] text-[#070e05] font-black text-sm transition-all shadow-lg active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Log In to Partner Console</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="border-t border-[#1e3412] w-full" />
            <span className="bg-[#0e1a0b] px-3 text-[10px] font-bold uppercase tracking-wider text-[#698254] shrink-0">
              Instant Demo Access
            </span>
          </div>

          {/* Quick Demo Sign In Button */}
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 rounded-2xl bg-[#172b0f] hover:bg-[#203a15] text-white font-bold text-xs transition-colors border border-[#294c1a] flex items-center justify-center space-x-2"
          >
            <Sparkles size={14} className="text-[#a8e83c]" />
            <span>1-Click Demo Login (Kunal Pawar)</span>
          </button>

          {/* Credentials Helper Pill */}
          <div className="bg-[#13230c] border border-[#213c14] rounded-2xl p-3 text-xs space-y-1">
            <span className="text-[10px] font-black uppercase text-[#a8e83c] tracking-wider block">
              Default Admin Credentials:
            </span>
            <div className="flex items-center justify-between font-mono text-[11px] text-[#c9e0b1]">
              <span>Email: <b>admin@grillix.in</b></span>
              <span>Pass: <b>grillix123</b></span>
            </div>
          </div>

        </div>

        {/* Security Badge Footer */}
        <div className="flex items-center justify-center space-x-2 text-[11px] text-[#8fa778] text-center">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Restricted Kitchen Operations Console • 256-bit TLS Encrypted</span>
        </div>

      </div>

      {/* Bottom Legal / Copyright */}
      <div className="max-w-6xl w-full mx-auto text-center text-xs text-[#5a7247] z-10 pt-4">
        © 2026 GRILLIX Partner Network. All kitchen operations and telemetry monitored.
      </div>

    </div>
  );
};
