import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Gift,
  Leaf
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthScreen = () => {
  const { goBack, navigateTo, login, register, showToast } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedDiet, setSelectedDiet] = useState(['Organic Greens']);

  const diets = ['Organic Greens', 'High Protein', 'Gluten-Free', 'Vegan', 'Keto'];

  const toggleDiet = (item) => {
    if (selectedDiet.includes(item)) {
      setSelectedDiet(selectedDiet.filter((d) => d !== item));
    } else {
      setSelectedDiet([...selectedDiet, item]);
    }
  };

  const handleQuickDemo = () => {
    setEmail('kunalpawar9403@gmail.com');
    setPassword('FreshLiving2026!');
    setFullName('Kunal Pawar');
    showToast('Loaded demo credentials for Kunal Pawar');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in your email and password');
      return;
    }

    if (mode === 'register') {
      register({
        fullName: fullName || email.split('@')[0],
        email,
        password,
        dietary: selectedDiet
      });
    } else {
      login({
        fullName: fullName || (email.toLowerCase().includes('kunal') ? 'Kunal Pawar' : email.split('@')[0]),
        email,
        password,
        dietary: selectedDiet
      });
    }

    // Direct user straight to their Profile / Account page to view and verify their logged-in details!
    setTimeout(() => {
      navigateTo('account');
    }, 400);
  };

  return (
    <div className="w-full min-h-screen pb-28 md:pb-16 animate-fadeIn bg-[#EEF4E3]">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="w-10 h-10 rounded-full bg-[#E3EBD3] hover:bg-[#D5E1C3] border border-[#D0D8C2] flex items-center justify-center text-[#243019] transition-all active:scale-95 shadow-xs"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#315B0B] flex items-center justify-center text-[#A8E83C] shadow-xs">
              <Leaf size={18} />
            </div>
            <span className="font-extrabold text-lg text-[#244507] tracking-tight">GRILLIX</span>
          </div>

          <button
            onClick={handleQuickDemo}
            className="text-xs font-bold text-[#315B0B] hover:text-[#244507] bg-[#E3EBD3] px-3 py-1.5 rounded-full border border-[#D0D8C2]"
            title="Auto-fill demo credentials"
          >
            Quick Demo
          </button>
        </div>

        {/* Welcome Incentive Card */}
        <div className="bg-[#244507] text-[#EEF4E3] rounded-3xl p-5 border border-[#315B0B] shadow-sm relative overflow-hidden">
          <div className="relative z-10 space-y-1">
            <div className="inline-flex items-center space-x-1.5 bg-[#A8E83C] text-[#244507] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              <Gift size={11} />
              <span>New Member Bonus</span>
            </div>
            <h3 className="text-lg font-extrabold text-white">
              {mode === 'register' ? 'Join & Claim 150 Bonus Points' : 'Welcome to Healthy Dining'}
            </h3>
            <p className="text-xs text-[#D0D8C2] leading-relaxed">
              Earn 10 points for every $1 spent, unlock secret seasonal harvests, and get your first delivery free.
            </p>
          </div>
          <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-[#A8E83C]/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* Main Auth Card */}
        <div className="bg-white rounded-4xl p-6 sm:p-8 border border-[#D0D8C2] shadow-sm space-y-6">
          
          {/* Segmented Mode Selector */}
          <div className="bg-[#EEF4E3] p-1 rounded-full border border-[#D0D8C2] flex items-center">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-[#315B0B] text-white shadow-xs'
                  : 'text-[#243019] hover:text-[#315B0B]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                mode === 'register'
                  ? 'bg-[#315B0B] text-white shadow-xs'
                  : 'text-[#243019] hover:text-[#315B0B]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                login({
                  fullName: 'Kunal Pawar',
                  email: 'kunalpawar9403@gmail.com',
                  password: 'AppleSecureAuth',
                  dietary: selectedDiet
                });
                navigateTo('account');
              }}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-black text-white hover:bg-neutral-800 text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.09 1.73-.95 2.76 1.01.08 2.05-.51 2.68-1.26z"/>
              </svg>
              <span>Apple ID</span>
            </button>

            <button
              onClick={() => {
                login({
                  fullName: 'Kunal Pawar',
                  email: 'kunalpawar9403@gmail.com',
                  password: 'GoogleSecureAuth',
                  dietary: selectedDiet
                });
                navigateTo('account');
              }}
              className="flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-[#EEF4E3] hover:bg-[#E3EBD3] text-[#243019] border border-[#D0D8C2] text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[#D0D8C2]/80"></div>
            <span className="bg-white px-3 text-[11px] font-bold text-[#747B68] uppercase tracking-wider relative">
              Or continue with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-[#243019] mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-3.5 text-[#747B68]" />
                  <input
                    type="text"
                    required
                    placeholder="Kunal Pawar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#EEF4E3] rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#243019] placeholder-[#747B68] border border-[#D0D8C2] focus:outline-none focus:border-[#315B0B] font-semibold"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#243019] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-[#747B68]" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#EEF4E3] rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-[#243019] placeholder-[#747B68] border border-[#D0D8C2] focus:outline-none focus:border-[#315B0B] font-semibold"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#243019]">Password</label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={() => showToast('Password reset link dispatched to your inbox!')}
                    className="text-[11px] font-bold text-[#315B0B] hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-[#747B68]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#EEF4E3] rounded-2xl pl-10 pr-11 py-3 text-xs sm:text-sm text-[#243019] placeholder-[#747B68] border border-[#D0D8C2] focus:outline-none focus:border-[#315B0B] font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#747B68] hover:text-[#243019]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Extra Registration Dietary Selection */}
            {mode === 'register' && (
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold text-[#243019]">
                  Personalize Your AI Nutrition
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {diets.map((diet) => {
                    const active = selectedDiet.includes(diet);
                    return (
                      <button
                        type="button"
                        key={diet}
                        onClick={() => toggleDiet(diet)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center space-x-1 ${
                          active
                            ? 'bg-[#315B0B] text-white shadow-xs'
                            : 'bg-[#EEF4E3] text-[#243019] border border-[#D0D8C2]'
                        }`}
                      >
                        {active && <Check size={11} strokeWidth={3} />}
                        <span>{diet}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center space-x-2 cursor-pointer font-medium text-[#243019]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#315B0B] accent-[#315B0B] focus:ring-0"
                />
                <span>Remember this device</span>
              </label>
              <div className="flex items-center space-x-1 text-[11px] text-[#315B0B] font-bold">
                <ShieldCheck size={13} />
                <span>256-bit Encrypted</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
              >
                <span>{mode === 'register' ? 'Create Account & Claim 150 Pts' : 'Sign In to GRILLIX'}</span>
                <ArrowRight size={17} />
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
