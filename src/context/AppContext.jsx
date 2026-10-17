/* oxlint-disable react/only-export-components */
import React, { useState, useEffect } from 'react';
import { 
  INITIAL_USERS,
  USER_PROFILE, 
  FOOD_ITEMS, 
  RESTAURANT,
  RESTAURANTS, 
  INITIAL_CART_ITEMS 
} from '../data/mockData';
import confetti from 'canvas-confetti';
import { AppContext, useApp } from './appContextInstance';
import { 
  playOrderPlacedSound, 
  playStatusUpdateSound, 
  playDeliveredSound, 
  playAdminAlertSound 
} from '../utils/soundEffects';

export { AppContext, useApp };

// Version Migration to guarantee fresh Indian data for all users & remove old cache
const DATA_VERSION = 'grillix_v3_fresh_inr_users';
try {
  if (typeof window !== 'undefined' && localStorage.getItem('grillix_data_ver') !== DATA_VERSION) {
    localStorage.removeItem('grillix_user');
    localStorage.removeItem('grillix_cart');
    localStorage.removeItem('grillix_all_users');
    localStorage.setItem('grillix_data_ver', DATA_VERSION);
  }
} catch (e) {
  console.warn('Migration warning', e);
}

export const INITIAL_RIDERS = [
  { id: 'rider-1', name: 'Vikram Singh', phone: '+91 98201 44321', vehicle: 'Ather 450X EV (Plate #GR-402)', rating: 4.9, activeDeliveries: 1, tripsCompleted: 342 },
  { id: 'rider-2', name: 'Aisha Khan', phone: '+91 98334 11980', vehicle: 'Honda Activa 6G (Plate #GR-718)', rating: 4.8, activeDeliveries: 0, tripsCompleted: 219 },
  { id: 'rider-3', name: 'Rohit Shinde', phone: '+91 98112 77654', vehicle: 'Eco Cargo E-Bike (Plate #GR-109)', rating: 5.0, activeDeliveries: 0, tripsCompleted: 480 },
];

export const INITIAL_ORDERS = [
  {
    id: 'GRX-IND-101',
    customerName: 'Aarav Mehta',
    customerPhone: '+91 98331 22441',
    address: 'Villa 12, Palm Meadows, Whitefield, Bengaluru 560066',
    date: 'Today, 12:45 PM',
    total: 518.00,
    status: 'Delivering',
    items: ['Golden Sesame Crispy Tofu Bowl', 'Green Veggie Bowl'],
    assignedRider: 'Vikram Singh',
    paymentMethod: 'UPI (Google Pay)',
    deliveryNotes: 'Leave with security at main gate'
  },
  {
    id: 'GRX-IND-102',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 98114 77890',
    address: 'Flat 701, Riverdale Heights, Koregaon Park, Pune 411001',
    date: 'Today, 12:50 PM',
    total: 319.00,
    status: 'Preparing',
    items: ['Herb & Bean Patty Sandwich'],
    assignedRider: 'Aisha Khan',
    paymentMethod: 'PhonePe UPI',
    deliveryNotes: 'Call upon arrival'
  },
  {
    id: 'GRX-IND-103',
    customerName: 'Rohan Verma',
    customerPhone: '+91 98990 12345',
    address: 'Tower B-402, DLF Phase 5, Golf Course Rd, Gurugram 122009',
    date: 'Today, 12:55 PM',
    total: 279.00,
    status: 'Received',
    items: ['Avocado Citrus & Baby Fennel Salad'],
    assignedRider: 'Unassigned',
    paymentMethod: 'Paytm UPI',
    deliveryNotes: 'Please ring bell'
  }
];

export const AppProvider = ({ children }) => {
  // Navigation & Screen management
  const [activeTab, setActiveTab] = useState('home');
  const [currentScreen, setCurrentScreen] = useState('home'); 
  
  // Navigation history for back button support
  const [screenHistory, setScreenHistory] = useState(['home']);

  // Selected Entities
  const [selectedRestaurant, setSelectedRestaurant] = useState(RESTAURANT || RESTAURANTS[0]);
  const [selectedProduct, setSelectedProduct] = useState(FOOD_ITEMS[0]);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [menuFilter, setMenuFilter] = useState('Featured');
  const [discoveryFilter, setDiscoveryFilter] = useState('Restaurants'); // 'Restaurants' | 'Dishes'
  const [giftCardFilter, setGiftCardFilter] = useState('Featured');

  // All Registered Users state
  const [allUsers, setAllUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('grillix_all_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read all_users from localStorage', e);
    }
    return INITIAL_USERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('grillix_all_users', JSON.stringify(allUsers));
    } catch {}
  }, [allUsers]);

  // Cart State with localStorage persistence (starts empty)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('grillix_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read cart from localStorage', e);
    }
    return INITIAL_CART_ITEMS; // []
  });

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // User Authentication & Profile (Fresh initial Kunal Pawar with 0 orders)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('grillix_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read user from localStorage', e);
    }
    return {
      isLoggedIn: true,
      id: INITIAL_USERS[0].id,
      name: INITIAL_USERS[0].name,
      email: INITIAL_USERS[0].email,
      handle: INITIAL_USERS[0].handle,
      avatar: INITIAL_USERS[0].avatar,
      points: INITIAL_USERS[0].points,
      dietary: INITIAL_USERS[0].dietary,
      tier: INITIAL_USERS[0].tier,
      addresses: [INITIAL_USERS[0].address],
      phone: INITIAL_USERS[0].phone,
      orders: [] // Fresh empty order history
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
  const [orderStatus, setOrderStatus] = useState('Delivering'); // 'Received' | 'Preparing' | 'Ready' | 'Delivering' | 'Delivered'
  const [currentOrderId, setCurrentOrderId] = useState('2933160654848');

  // Dynamic Menu Items (Admin editable & in-stock toggles)
  const [menuItems, setMenuItems] = useState(FOOD_ITEMS);

  // Restaurant Kitchen Live Orders Pipeline (synced with Admin via grillix_admin_orders)
  const [allOrders, setAllOrders] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('grillix_admin_orders');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      }
    } catch {}
    return INITIAL_ORDERS;
  });

  // Dine-In Table Selection (auto-detected from URL ?table=X or localStorage)
  const [currentTable, setCurrentTable] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTable = params.get('table');
        if (urlTable) {
          localStorage.setItem('grillix_dinein_table', urlTable);
          return urlTable;
        }
        const saved = localStorage.getItem('grillix_dinein_table');
        if (saved) return saved;
      } catch {}
    }
    return '1';
  });

  // Special kitchen instructions for chef
  const [chefNotes, setChefNotes] = useState('');

  // Auto-detect table from URL parameter on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTable = params.get('table');
      if (urlTable && urlTable !== currentTable) {
        setCurrentTable(urlTable);
        try {
          localStorage.setItem('grillix_dinein_table', urlTable);
        } catch {}
        showToast(`🍽️ Welcome! Dine-In Table #${urlTable} selected`);
      }
    }
  }, []);

  // Delivery Fleet Partners (empty fallback for legacy references)
  const [deliveryRiders, setDeliveryRiders] = useState(INITIAL_RIDERS);

  // Kitchen Online / Paused status
  const [kitchenStatus, setKitchenStatus] = useState('Online');

  // Device view mode toggle for desktop inspection
  const [deviceMode, setDeviceMode] = useState('responsive'); // 'responsive' | 'mobile-mockup'

  // Scan on Mobile PWA Modal
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  // Sync live orders from shared API & cross-tab BroadcastChannel / localStorage
  useEffect(() => {
    // 1. Cross-tab BroadcastChannel listener (real-time order status updates)
    let bc = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('grillix_sync_channel');
        bc.onmessage = (event) => {
          if (event.data?.type === 'ORDER_STATUS_UPDATE') {
            const { orderId, status } = event.data;
            setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
            if (orderId === currentOrderId) {
              setOrderStatus(status);
              if (status === 'Delivered') {
                playDeliveredSound();
                showToast('🎉 Your order has been delivered!');
              } else {
                playStatusUpdateSound();
                showToast(`Order status updated: ${status}`);
              }
            }
          }
        };
      }
    } catch (e) {}

    // 2. Storage event listener (syncs immediately when Admin or Storefront updates in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'grillix_admin_orders' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAllOrders(parsed);
            const myOrder = parsed.find(o => o.id === currentOrderId);
            if (myOrder && myOrder.status !== orderStatus) {
              setOrderStatus(myOrder.status);
              if (myOrder.status === 'Delivered') {
                playDeliveredSound();
                showToast('🎉 Your order has been delivered!');
              } else {
                playStatusUpdateSound();
                showToast(`Order status updated: ${myOrder.status}`);
              }
            }
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 3. Periodic API Polling for cross-device synchronization on Vercel
    const fetchLiveOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const remoteOrders = await res.json();
          if (Array.isArray(remoteOrders) && remoteOrders.length > 0) {
            setAllOrders(prev => {
              const map = new Map();
              // Remote orders from cloud/api
              remoteOrders.forEach(o => { if (o && o.id) map.set(o.id, o); });
              // Keep local un-synced orders
              prev.forEach(o => { if (o && o.id && !map.has(o.id)) map.set(o.id, o); });
              const merged = Array.from(map.values());
              try {
                localStorage.setItem('grillix_admin_orders', JSON.stringify(merged));
              } catch {}
              return merged;
            });
            const myOrder = remoteOrders.find(o => o.id === currentOrderId);
            if (myOrder && myOrder.status !== orderStatus) {
              setOrderStatus(myOrder.status);
              if (myOrder.status === 'Delivered') {
                playDeliveredSound();
                showToast('🎉 Your order has been delivered!');
              } else {
                playStatusUpdateSound();
                showToast(`Order status updated: ${myOrder.status}`);
              }
            }
          }
        }
      } catch (e) {}
    };

    fetchLiveOrders();
    const timer = setInterval(fetchLiveOrders, 3000);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(timer);
    };
  }, [currentOrderId, orderStatus]);

  // Persist allOrders to localStorage whenever updated
  useEffect(() => {
    try {
      if (allOrders && allOrders.length > 0) {
        localStorage.setItem('grillix_admin_orders', JSON.stringify(allOrders));
      }
    } catch {}
  }, [allOrders]);

  // Live Restaurant & Delivery Settings from Admin API
  const [restaurantSettings, setRestaurantSettings] = useState({
    name: 'GRILLIX Restaurant & Central Kitchen',
    tagline: 'Farm-Fresh Gourmet Bowls & Superfoods',
    phone: '+91 98200 44888',
    email: 'kitchen.moshi@grillix.in',
    address: 'Shop 12, Grand Spine Avenue, Pune-Nashik Highway, Moshi',
    city: 'Pune, Maharashtra 412105',
    openTime: '08:00 AM',
    closeTime: '11:30 PM',
    prepTimeMinutes: 25,
    deliveryRadiusKm: 8.5,
    minOrderValue: 149,
    deliveryFee: 39,
    freeDeliveryThreshold: 499,
    taxRatePercent: 5,
    deliveryEnabled: true,
    announcement: '🌿 Using 100% hydroponic organic greens and cold-pressed olive oils in Moshi, Pune!'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/restaurant-settings');
        if (res.ok) {
          const data = await res.json();
          if (data && data.name) {
            setRestaurantSettings(prev => ({ ...prev, ...data }));
          }
        }
      } catch (e) {}
    };

    fetchSettings();
    const interval = setInterval(fetchSettings, 3500);
    return () => clearInterval(interval);
  }, []);

  // Update order status from Admin or Customer side
  const updateOrderStatus = (orderId, newStatus) => {
    setAllOrders((prev) => {
      const updated = prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord));
      try {
        localStorage.setItem('grillix_admin_orders', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('grillix_sync_channel');
        bc.postMessage({ type: 'ORDER_STATUS_UPDATE', orderId, status: newStatus });
        bc.close();
      }
    } catch {}

    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus })
      }).catch(() => {});
    } catch {}

    if (orderId === currentOrderId) {
      setOrderStatus(newStatus);
      if (newStatus === 'Delivered') {
        playDeliveredSound();
        showToast('🎉 Order delivered successfully!');
      } else {
        playStatusUpdateSound();
        showToast(`Order status updated to: ${newStatus}`);
      }
    } else {
      playStatusUpdateSound();
      showToast(`Order #${orderId.slice(-4)} updated to: ${newStatus}`);
    }

    // Keep user past orders in sync
    setCurrentUser((prev) => ({
      ...prev,
      orders: (prev?.orders || []).map((o) =>
        o.id === orderId ? { ...o, status: newStatus === 'Delivering' ? 'In Delivery' : newStatus } : o
      )
    }));
  };

  // Assign delivery rider
  const assignRiderToOrder = (orderId, riderName) => {
    setAllOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, assignedRider: riderName } : ord))
    );
    showToast(`Assigned ${riderName} to order #${orderId.slice(-4)}`);
  };

  // Toggle item in stock / sold out
  const toggleMenuItemStock = (itemId) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isOutOfStock: !item.isOutOfStock } : item
      )
    );
    showToast('Menu item availability updated');
  };

  // Update dish price
  const updateMenuItemPrice = (itemId, newPrice) => {
    const parsed = parseFloat(newPrice);
    if (isNaN(parsed) || parsed <= 0) {
      showToast('Please enter a valid price');
      return;
    }
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, menuPrice: parsed } : item
      )
    );
    showToast(`Price updated to $${parsed.toFixed(2)}`);
  };

  // Add new dish to menu
  const addMenuItem = (newItem) => {
    setMenuItems((prev) => [newItem, ...prev]);
    showToast(`Added "${newItem.name}" to menu!`);
  };

  const toggleKitchenStatus = () => {
    setKitchenStatus((prev) => {
      const next = prev === 'Online' ? 'Paused' : 'Online';
      showToast(`Kitchen status: ${next}`);
      return next;
    });
  };

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
      setAppliedPromo({ code: clean, discount: 50.00, desc: '₹50 Off Fresh Promo' });
      showToast('Promo code applied: $5.00 discount!');
    } else if (clean === 'HEALTHY10') {
      setAppliedPromo({ code: clean, discountPercent: 10, desc: '10% Healthy Living Discount' });
      showToast('Promo code applied: 10% discount!');
    } else if (clean === 'FREEKOMBUCHA') {
      setAppliedPromo({ code: clean, discount: 149.00, desc: 'Free Kombucha Reward Applied' });
      showToast('Reward voucher applied: Free Kombucha!');
    } else if (clean === 'FREEFOCACCIA') {
      setAppliedPromo({ code: clean, discount: 129.00, desc: 'Free Rosemary Focaccia Reward Applied' });
      showToast('Reward voucher applied: Free Focaccia!');
    } else if (clean === 'GRILLIX5OFF') {
      setAppliedPromo({ code: clean, discount: 50.00, desc: '₹50 Loyalty Voucher Applied' });
      showToast('Reward voucher applied: $5.00 Off!');
    } else if (clean === 'FREEAVO') {
      setAppliedPromo({ code: clean, discount: 40.00, desc: 'Free Avocado Add-on Voucher' });
      showToast('Reward voucher applied: Free Avocado!');
    } else {
      setPromoError('Invalid promo code. Try "FRESH" or "HEALTHY10"');
    }
  };

  // Calculations for Dine-In Table Ordering (Zero delivery fee!)
  const cartSubtotal = cart.reduce((acc, curr) => acc + (curr.item.menuPrice * curr.quantity), 0);
  const cartItemCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discount) discountAmount = appliedPromo.discount;
    else if (appliedPromo.discountPercent) discountAmount = (cartSubtotal * appliedPromo.discountPercent) / 100;
  }

  const dineInTaxPercent = 5;
  const taxAmount = Number(((cartSubtotal - discountAmount) * (dineInTaxPercent / 100)).toFixed(2));
  const deliveryFee = 0;
  const isDeliveryFree = true;
  const freeDeliveryThreshold = 0;
  const freeDeliveryRemaining = 0;
  const minOrderValue = 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + taxAmount);

  // Call waiter or request table service
  const callWaiter = (requestType = 'Service') => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('grillix_sync_channel');
        bc.postMessage({ 
          type: 'TABLE_CALL', 
          tableNumber: currentTable || '1',
          request: requestType,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        });
        bc.close();
      }
    } catch {}
    playAdminAlertSound();
    showToast(`🔔 Server alerted for Table #${currentTable || '1'} (${requestType})!`);
  };

  // Place order & send to restaurant kitchen
  const checkout = () => {
    if (cart.length === 0) {
      showToast('Your table order is currently empty!');
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
      tableNumber: currentTable || '1',
      orderType: 'Dine-In',
      customerName: currentUser?.name || 'Guest Diner',
      customerPhone: currentUser?.phone || '+91 98201 44321',
      address: `Dine-In Table #${currentTable || '1'} • GRILLIX Moshi, Pune`,
      tableSection: 'Main Dining Hall',
      date: 'Just now',
      total: Number(cartTotal.toFixed(2)),
      subtotal: cartSubtotal,
      taxAmount: taxAmount,
      deliveryFee: 0,
      status: 'Received',
      items: orderItemsSummary,
      paymentMethod: 'Pay at Counter / UPI',
      chefNotes: chefNotes || 'Dine-in order'
    };

    // Add to Admin orders pipeline
    setAllOrders((prev) => [newPlacedOrder, ...prev]);

    // 1. Immediately persist to localStorage for cross-tab instant sync
    try {
      const stored = localStorage.getItem('grillix_admin_orders');
      let currentList = [];
      if (stored) {
        try { currentList = JSON.parse(stored); } catch {}
      }
      if (!Array.isArray(currentList)) currentList = [];
      const updatedList = [newPlacedOrder, ...currentList.filter(o => o.id !== newId)];
      localStorage.setItem('grillix_admin_orders', JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Could not save order to localStorage', e);
    }

    // 2. Broadcast immediately to any open Admin tab/window
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('grillix_sync_channel');
        bc.postMessage({ type: 'NEW_ORDER', order: newPlacedOrder });
        bc.close();
      }
    } catch (e) {}

    // 3. Send order to shared API (persists in memory and cloud store)
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlacedOrder)
      }).catch(err => console.warn('Sync post error', err));
    } catch (e) {}

    // Add to customer's order history
    setCurrentUser((prev) => ({
      ...prev,
      points: (prev?.points ?? 0) + earned,
      orders: [newPlacedOrder, ...(prev?.orders || [])]
    }));

    // Reset cart
    setCart([]);
    setAppliedPromo(null);

    // Audio chime alerts
    playOrderPlacedSound();
    playAdminAlertSound();

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

    showToast('Order received! Kitchen notified.');
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

  // Switch to another registered Indian user
  const switchUser = (userId) => {
    const target = allUsers.find(u => u.id === userId);
    if (!target) return;
    const switched = {
      ...target,
      isLoggedIn: true,
      addresses: target.addresses || [target.address],
      orders: target.orders || []
    };
    setCurrentUser(switched);
    showToast(`Switched account to: ${target.name} (${target.city || 'India'})`);
  };

  // Add brand new user
  const addNewUser = (userData) => {
    const id = `user-${Date.now()}`;
    const name = userData.name || 'New Member';
    const email = userData.email || `${name.toLowerCase().replace(/\s+/g, '')}@grillixfresh.in`;
    const newUserObj = {
      id,
      name,
      handle: '@' + (userData.handle ? userData.handle.replace('@', '') : name.toLowerCase().replace(/[^a-z0-9]/g, '')),
      email,
      avatar: userData.avatar || '/images/avatar-jhon.jpg',
      points: Number(userData.points) || 150,
      homePointsDisplay: Math.floor((Number(userData.points) || 150) / 10),
      address: userData.address || 'Flat 502, Green Meadows Residency, Spine Road, Moshi, Pune 412105',
      city: userData.city || 'Moshi, Pune',
      tier: userData.tier || 'Gold Tier Member',
      phone: userData.phone || '+91 98200 12345',
      dietary: userData.dietary || ['Organic Greens'],
      ordersCount: 0,
      favoriteKitchen: userData.favoriteKitchen || 'GRILLIX Central Kitchen (Moshi, Pune)'
    };

    setAllUsers(prev => [newUserObj, ...prev]);
    showToast(`Created new user profile: ${name}`);
    return newUserObj;
  };

  // Delete user
  const deleteUser = (userId) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
    if (currentUser?.id === userId) {
      const fallback = allUsers.find(u => u.id !== userId) || INITIAL_USERS[0];
      switchUser(fallback.id);
    }
    showToast('User removed');
  };

  // Reset all application data to fresh Indian store state
  const resetAllData = () => {
    try {
      localStorage.removeItem('grillix_user');
      localStorage.removeItem('grillix_cart');
      localStorage.removeItem('grillix_all_users');
      localStorage.setItem('grillix_data_ver', DATA_VERSION);
    } catch {}

    setCart([]);
    setAppliedPromo(null);
    setAllUsers(INITIAL_USERS);
    setCurrentUser({
      isLoggedIn: true,
      id: INITIAL_USERS[0].id,
      name: INITIAL_USERS[0].name,
      email: INITIAL_USERS[0].email,
      handle: INITIAL_USERS[0].handle,
      avatar: INITIAL_USERS[0].avatar,
      points: INITIAL_USERS[0].points,
      dietary: INITIAL_USERS[0].dietary,
      tier: INITIAL_USERS[0].tier,
      addresses: [INITIAL_USERS[0].address],
      phone: INITIAL_USERS[0].phone,
      orders: []
    });
    setAllOrders(INITIAL_ORDERS);
    setOrderStatus('Received');
    setCurrentOrderId('GRX-IND-101');
    playAdminAlertSound();
    showToast('✨ All data refreshed to fresh state!');
  };

  // Auth Operations
  const login = ({ email, fullName, dietary }) => {
    const rawName = fullName?.trim() || (email ? email.split('@')[0].replace(/[._]/g, ' ') : 'Kunal Pawar');
    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const handle = '@' + (email ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') : 'kunalpawar');

    // Check if user already exists in allUsers
    const existing = allUsers.find(u => u.email?.toLowerCase() === email?.toLowerCase());

    const updatedUser = existing ? {
      ...existing,
      isLoggedIn: true,
      addresses: existing.addresses || [existing.address]
    } : {
      id: `user-${Date.now()}`,
      isLoggedIn: true,
      name: name,
      email: email || 'kunalpawar9403@gmail.com',
      handle: handle,
      avatar: currentUser?.avatar || '/images/avatar-jhon.jpg',
      points: 200,
      dietary: dietary && dietary.length > 0 ? dietary : ['Organic Greens', 'High Protein'],
      tier: 'Gold Tier Member',
      addresses: [RESTAURANTS[0].address],
      phone: '+91 98201 44321',
      orders: []
    };

    if (!existing) {
      setAllUsers(prev => [updatedUser, ...prev]);
    }

    setCurrentUser(updatedUser);
    showToast(`Welcome back, ${name}!`);
    return updatedUser;
  };

  const register = ({ fullName, email, dietary, phone, city, address }) => {
    const rawName = fullName?.trim() || 'New Member';
    const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const handle = '@' + (email ? email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '') : 'member');

    const newUser = {
      id: `user-${Date.now()}`,
      isLoggedIn: true,
      name: name,
      email: email || 'member@grillixfresh.in',
      handle: handle,
      avatar: '/images/avatar-jhon.jpg',
      points: 150, // 150 Welcome Points
      dietary: dietary && dietary.length > 0 ? dietary : ['Organic Greens'],
      tier: 'Gold Tier Member',
      addresses: [address || RESTAURANTS[0].address],
      address: address || RESTAURANTS[0].address,
      city: city || 'Moshi, Pune',
      phone: phone || '+91 98201 44321',
      orders: []
    };

    setAllUsers(prev => [newUser, ...prev]);
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
        deliveryFee,
        isDeliveryFree,
        freeDeliveryThreshold,
        freeDeliveryRemaining,
        minOrderValue,
        restaurantSettings,
        promoCode,
        setPromoCode,
        appliedPromo,
        promoError,
        applyPromo,
        userPoints,
        setUserPoints,
        currentUser,
        setCurrentUser,
        allUsers,
        setAllUsers,
        switchUser,
        addNewUser,
        deleteUser,
        resetAllData,
        login,
        register,
        logout,
        reorder,
        redeemPerk,
        updateDietaryPreferences,
        orderStatus,
        setOrderStatus,
        currentOrderId,
        setCurrentOrderId,
        currentTable,
        setCurrentTable,
        chefNotes,
        setChefNotes,
        callWaiter,
        taxAmount,
        checkout,
        // Admin & Menu Management
        menuItems,
        setMenuItems,
        toggleMenuItemStock,
        updateMenuItemPrice,
        addMenuItem,
        allOrders,
        setAllOrders,
        updateOrderStatus,
        deliveryRiders,
        setDeliveryRiders,
        assignRiderToOrder,
        kitchenStatus,
        setKitchenStatus,
        toggleKitchenStatus,
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
