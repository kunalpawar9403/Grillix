/* oxlint-disable react/only-export-components */
import React, { useState, useEffect } from 'react';
import { 
  USER_PROFILE, 
  FOOD_ITEMS, 
  RESTAURANTS, 
  INITIAL_CART_ITEMS 
} from '../data/mockData';
import confetti from 'canvas-confetti';
import { AppContext, useApp } from './appContextInstance';

export { AppContext, useApp };

export const AppProvider = ({ children }) => {
  // Navigation & Screen management
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'discovery' | 'gift-cards' | 'menu'
  const [currentScreen, setCurrentScreen] = useState('home'); 
  // Screen options: 'home', 'discovery', 'restaurant-detail', 'menu', 'product-detail', 'cart', 'rewards', 'how-it-works', 'gift-cards', 'order-tracking', 'account', 'custom-bowl', 'auth'
  
  // Navigation history for back button support
  const [screenHistory, setScreenHistory] = useState(['home']);

  // Selected Entities
  const [selectedRestaurant, setSelectedRestaurant] = useState(RESTAURANTS[0]);
  const [selectedProduct, setSelectedProduct] = useState(FOOD_ITEMS[0]);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [menuFilter, setMenuFilter] = useState('Featured');
  const [discoveryFilter, setDiscoveryFilter] = useState('Restaurants'); // 'Restaurants' | 'Dishes'
  const [giftCardFilter, setGiftCardFilter] = useState('Featured');

  // Cart State with localStorage persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('grillix_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
    return INITIAL_CART_ITEMS;
  });

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // User Authentication & Profile
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('grillix_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read user from localStorage', e);
    }
    return {
      isLoggedIn: true,
      name: USER_PROFILE.name,
      email: USER_PROFILE.email,
      handle: USER_PROFILE.handle,
      avatar: USER_PROFILE.avatar,
      points: USER_PROFILE.points,
      dietary: ['Organic Greens', 'High Protein', 'Non-GMO'],
      tier: 'Gold Tier Member',
      addresses: [RESTAURANTS[0].address],
      phone: '+1 (415) 890-3321',
      orders: [
        { id: '2933160654848', date: 'Today, 12:15 PM', total: 31.90, status: 'In Delivery', items: ['Fresh Salad Bowl', 'Green Veggie Bowl'] },
        { id: '1849204820194', date: 'Yesterday, 6:40 PM', total: 24.80, status: 'Delivered', items: ['Golden Sesame Crispy Tofu Bowl (x2)'] }
      ]
    };
  });

  // Derived user points
  const userPoints = currentUser?.points ?? USER_PROFILE.points;

  const setUserPoints = (updater) => {
    setCurrentUser((prev) => {
      const current = prev?.points ?? USER_PROFILE.points;
      const nextPts = typeof updater === 'function' ? updater(current) : updater;
      return {
        ...prev,
        points: Math.max(0, nextPts)
      };
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem('grillix_user', JSON.stringify(currentUser));
    } catch (e) {
      console.warn('Could not save user to localStorage', e);
    }
  }, [currentUser]);

  // Order Tracking Simulation
  const [orderStatus, setOrderStatus] = useState('Received'); // 'Received' | 'Preparing' | 'Ready' | 'Delivering'
  const [currentOrderId, setCurrentOrderId] = useState('2933160654848');

  // Device view mode toggle for desktop inspection
  const [deviceMode, setDeviceMode] = useState('responsive'); // 'responsive' | 'mobile-mockup'

  // Scan on Mobile PWA Modal
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('grillix_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cart]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const navigateTo = (screen, payload = null) => {
    if (payload?.restaurant) {
      setSelectedRestaurant(payload.restaurant);
    }
    if (payload?.product) {
      setSelectedProduct(payload.product);
    }
    
    // Map main bottom nav tabs
    if (screen === 'home') setActiveTab('home');
    if (screen === 'discovery' || screen === 'restaurant-detail') setActiveTab('discovery');
    if (screen === 'gift-cards') setActiveTab('gift-cards');
    if (screen === 'menu' || screen === 'custom-bowl') setActiveTab('menu');

    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop();
      const prevScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('home');
      setActiveTab('home');
    }
  };

  // Cart operations
  const addToCart = (product, quantity = 1, customizations = 'Standard') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.item.id === product.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      } else {
        return [...prev, { item: product, quantity, customizations }];
      }
    });
    showToast(`Added ${product.name} to bag`);
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.item.id !== productId));
    showToast('Item removed from bag');
  };

  const applyPromo = (code) => {
    setPromoError('');
    const clean = code.trim().toUpperCase();
    if (clean === 'FRESH' || clean === 'GRILLIX' || clean === 'FATHER') {
      setAppliedPromo({ code: clean, discount: 5.00, desc: '$5.00 Off Fresh Promo' });
      showToast('Promo code applied: $5.00 discount!');
    } else if (clean === 'HEALTHY10') {
      setAppliedPromo({ code: clean, discountPercent: 10, desc: '10% Healthy Living Discount' });
      showToast('Promo code applied: 10% discount!');
    } else if (clean === 'FREEKOMBUCHA') {
      setAppliedPromo({ code: clean, discount: 6.50, desc: 'Free Kombucha Reward Applied' });
      showToast('Reward voucher applied: Free Kombucha!');
    } else if (clean === 'FREEFOCACCIA') {
      setAppliedPromo({ code: clean, discount: 4.50, desc: 'Free Rosemary Focaccia Reward Applied' });
      showToast('Reward voucher applied: Free Focaccia!');
    } else if (clean === 'GRILLIX5OFF') {
      setAppliedPromo({ code: clean, discount: 5.00, desc: '$5.00 Loyalty Voucher Applied' });
      showToast('Reward voucher applied: $5.00 Off!');
    } else if (clean === 'FREEAVO') {
      setAppliedPromo({ code: clean, discount: 2.00, desc: 'Free Avocado Add-on Voucher' });
      showToast('Reward voucher applied: Free Avocado!');
    } else {
      setPromoError('Invalid promo code. Try "FRESH" or "HEALTHY10"');
    }
  };

  // Calculations
  const cartSubtotal = cart.reduce((acc, curr) => acc + (curr.item.menuPrice * curr.quantity), 0);
  const cartItemCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discount) discountAmount = appliedPromo.discount;
    else if (appliedPromo.discountPercent) discountAmount = (cartSubtotal * appliedPromo.discountPercent) / 100;
  }
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  // Place order & save to user orders
  const checkout = () => {
    if (cart.length === 0) {
      showToast('Your bag is currently empty!');
      return;
    }
    const newId = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
    setCurrentOrderId(newId);
    setOrderStatus('Received');
    
    // Add rewards points for purchase ($1 = 10 pts)
    const earned = Math.round(cartTotal * 10);

    const orderItemsSummary = cart.map(c => `${c.item.name}${c.quantity > 1 ? ` (x${c.quantity})` : ''}`);

    const newPlacedOrder = {
      id: newId,
      date: 'Just now',
      total: Number(cartTotal.toFixed(2)),
      status: 'In Delivery',
      items: orderItemsSummary
    };

    setCurrentUser((prev) => ({
      ...prev,
      points: (prev?.points ?? 0) + earned,
      orders: [newPlacedOrder, ...(prev?.orders || [])]
    }));

    // Confetti celebration
    try {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#315B0B', '#A8E83C', '#244507', '#EEF4E3']
      });
    } catch (e) {
      console.warn('Confetti error', e);
    }

    navigateTo('order-tracking');
  };

  // Reorder action: re-adds past order items to bag
  const reorder = (order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach(rawName => {
        const cleanName = rawName.replace(/\s*\(x\d+\)$/, '').trim();
        const matched = FOOD_ITEMS.find(f => 
          f.name.toLowerCase().includes(cleanName.toLowerCase()) || 
          cleanName.toLowerCase().includes(f.name.toLowerCase())
        ) || FOOD_ITEMS[0];
        addToCart(matched, 1, 'Quick reorder favorite');
      });
      showToast(`Reordered items from order #${order.id.slice(-4)}`);
      navigateTo('cart');
    }
  };

  // Redeem perk action
  const redeemPerk = (perk) => {
    if (userPoints < perk.pointsCost) {
      showToast(`You need ${perk.pointsCost - userPoints} more points to redeem this!`);
      return false;
    }

    setUserPoints((p) => p - perk.pointsCost);
    applyPromo(perk.code);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
    showToast(`Redeemed ${perk.title}! Promo applied to bag.`);
    return true;
  };

  // Auth Operations
  const login = ({ email, fullName, dietary }) => {
    const rawName = fullName?.trim() || (email ? email.split('@')[0].replace(/[._]/g, ' ') : 'Jhon Snow');
    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const handle = '@' + (email ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') : 'jhonsnow');

    const updatedUser = {
      isLoggedIn: true,
      name: name,
      email: email || 'shahinurstk02@gmail.com',
      handle: handle,
      avatar: currentUser?.avatar || '/images/avatar-jhon.jpg',
      points: (currentUser?.points && currentUser.isLoggedIn ? currentUser.points : 450) + 50,
      dietary: dietary && dietary.length > 0 ? dietary : (currentUser?.dietary?.length ? currentUser.dietary : ['Organic Greens', 'High Protein']),
      tier: 'Gold Tier Member',
      addresses: currentUser?.addresses?.length ? currentUser.addresses : [RESTAURANTS[0].address],
      phone: currentUser?.phone || '+1 (415) 890-3321',
      orders: currentUser?.orders || []
    };

    setCurrentUser(updatedUser);
    showToast(`Welcome back, ${name}!`);
    return updatedUser;
  };

  const register = ({ fullName, email, dietary }) => {
    const rawName = fullName?.trim() || 'New Member';
    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const handle = '@' + (email ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') : 'member');

    const newUser = {
      isLoggedIn: true,
      name: name,
      email: email || 'member@grillixfresh.com',
      handle: handle,
      avatar: '/images/avatar-jhon.jpg',
      points: 150, // 150 Welcome Points
      dietary: dietary && dietary.length > 0 ? dietary : ['Organic Greens'],
      tier: 'Gold Tier Member',
      addresses: [RESTAURANTS[0].address],
      phone: '+1 (415) 555-0199',
      orders: []
    };

    setCurrentUser(newUser);
    try {
      confetti({
        particleCount: 110,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#315B0B', '#A8E83C', '#244507', '#EEF4E3']
      });
    } catch (e) {
      console.warn('Registration confetti error', e);
    }
    showToast(`Welcome to GRILLIX, ${name}! 150 Welcome Points added 🎉`);
    return newUser;
  };

  const logout = () => {
    const loggedOutUser = {
      isLoggedIn: false,
      name: '',
      email: '',
      handle: '',
      avatar: '',
      points: 0,
      dietary: [],
      tier: 'Guest',
      addresses: [],
      phone: '',
      orders: []
    };
    setCurrentUser(loggedOutUser);
    showToast('Signed out successfully. Come back hungry!');
    navigateTo('home');
  };

  const updateDietaryPreferences = (newDietary) => {
    setCurrentUser((prev) => ({
      ...prev,
      dietary: newDietary
    }));
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentScreen,
        setCurrentScreen,
        navigateTo,
        goBack,
        selectedRestaurant,
        setSelectedRestaurant,
        selectedProduct,
        setSelectedProduct,
        searchQuery,
        setSearchQuery,
        menuFilter,
        setMenuFilter,
        discoveryFilter,
        setDiscoveryFilter,
        giftCardFilter,
        setGiftCardFilter,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        cartSubtotal,
        cartItemCount,
        cartTotal,
        discountAmount,
        promoCode,
        setPromoCode,
        appliedPromo,
        promoError,
        applyPromo,
        userPoints,
        setUserPoints,
        currentUser,
        setCurrentUser,
        login,
        register,
        logout,
        reorder,
        redeemPerk,
        updateDietaryPreferences,
        orderStatus,
        setOrderStatus,
        currentOrderId,
        checkout,
        deviceMode,
        setDeviceMode,
        isScanModalOpen,
        setIsScanModalOpen,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
