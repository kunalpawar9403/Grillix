import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  FOOD_ITEMS, 
  INITIAL_USERS 
} from '../data/mockData';
import { 
  playStatusUpdateSound, 
  playDeliveredSound, 
  playAdminAlertSound 
} from '../utils/soundEffects';
import { getApiBase } from '../utils/navigation';

export const INITIAL_TABLES = [
  { id: 'T-01', number: '1', name: 'Table 1', section: 'Main Dining Hall', capacity: 2, status: 'Occupied', activeOrderId: 'GRX-DINE-101' },
  { id: 'T-02', number: '2', name: 'Table 2', section: 'Main Dining Hall', capacity: 4, status: 'Occupied', activeOrderId: 'GRX-DINE-102' },
  { id: 'T-03', number: '3', name: 'Table 3', section: 'Main Dining Hall', capacity: 4, status: 'Available', activeOrderId: null },
  { id: 'T-04', number: '4', name: 'Table 4', section: 'Main Dining Hall', capacity: 6, status: 'Available', activeOrderId: null },
  { id: 'T-05', number: '5', name: 'Table 5', section: 'Garden Patio', capacity: 4, status: 'Occupied', activeOrderId: 'GRX-DINE-103' },
  { id: 'T-06', number: '6', name: 'Table 6', section: 'Garden Patio', capacity: 2, status: 'Available', activeOrderId: null },
  { id: 'T-07', number: '7', name: 'VIP Cabin 1', section: 'Private VIP Lounge', capacity: 8, status: 'Reserved', activeOrderId: null },
  { id: 'T-08', number: '8', name: 'Terrace Table 1', section: 'Rooftop Terrace', capacity: 4, status: 'Available', activeOrderId: null },
];

export const INITIAL_RIDERS = [];

export const INITIAL_ORDERS = [
  {
    id: 'GRX-DINE-101',
    tableNumber: '1',
    orderType: 'Dine-In',
    customerName: 'Aarav Mehta',
    customerPhone: '+91 98331 22441',
    tableSection: 'Main Dining Hall',
    date: 'Today, 12:45 PM',
    total: 518.00,
    status: 'Ready to Serve', // Received | Cooking in Kitchen | Ready to Serve | Served to Table | Completed
    items: ['Golden Sesame Crispy Tofu Bowl', 'Green Veggie Bowl'],
    paymentMethod: 'UPI (Google Pay)',
    chefNotes: 'Serve dressing on the side, extra napkins'
  },
  {
    id: 'GRX-DINE-102',
    tableNumber: '2',
    orderType: 'Dine-In',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 98114 77890',
    tableSection: 'Main Dining Hall',
    date: 'Today, 12:50 PM',
    total: 319.00,
    status: 'Cooking in Kitchen',
    items: ['Herb & Bean Patty Sandwich'],
    paymentMethod: 'PhonePe UPI',
    chefNotes: 'Medium spicy, crisp the bread'
  },
  {
    id: 'GRX-DINE-103',
    tableNumber: '5',
    orderType: 'Dine-In',
    customerName: 'Rohan Verma',
    customerPhone: '+91 98990 12345',
    tableSection: 'Garden Patio',
    date: 'Today, 12:55 PM',
    total: 279.00,
    status: 'Received',
    items: ['Avocado Citrus & Baby Fennel Salad'],
    paymentMethod: 'Paytm Wallet',
    chefNotes: 'No onions please'
  },
  {
    id: 'GRX-DINE-100',
    tableNumber: '3',
    orderType: 'Dine-In',
    customerName: 'Kunal Pawar',
    customerPhone: '+91 98200 11223',
    tableSection: 'Main Dining Hall',
    date: 'Today, 12:30 PM',
    total: 588.00,
    status: 'Served to Table',
    items: ['Tofu Crunch High-Protein Bowl', 'Detox Cold-Pressed Green Juice'],
    paymentMethod: 'Credit Card (HDFC)',
    chefNotes: 'Served and customer dining'
  }
];

export const INITIAL_SETTINGS = {
  name: 'GRILLIX Restaurant & Central Kitchen - Moshi Flagship',
  tagline: 'Farm-Fresh Gourmet Bowls & Superfoods • Dine-In & QR Ordering',
  phone: '+91 98200 44888',
  email: 'kitchen.moshi@grillix.in',
  address: 'Shop 12, Grand Spine Avenue, Pune-Nashik Highway, Moshi',
  city: 'Pune, Maharashtra 412105',
  openTime: '08:00 AM',
  closeTime: '11:30 PM',
  prepTimeMinutes: 20,
  tableCount: 8,
  dineInServiceEnabled: true,
  taxRatePercent: 5,
  announcement: '🌿 Welcome to GRILLIX! Scan any table QR code to view our fresh digital menu and order directly to your table.'
};

export const INITIAL_COUPONS = [
  { code: 'GRILLIX50', type: 'flat', value: 50, minOrder: 299, desc: 'Flat ₹50 OFF on orders above ₹299', active: true },
  { code: 'SUPERGREEN', type: 'percent', value: 20, maxDiscount: 100, minOrder: 399, desc: '20% OFF up to ₹100 on warm bowls', active: true },
  { code: 'FREEDEL', type: 'free_delivery', value: 39, minOrder: 249, desc: 'Free Express Delivery across Moshi & PCMC Pune', active: true },
];

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  // Kitchen Online / Paused
  const [kitchenStatus, setKitchenStatus] = useState(() => {
    try {
      return localStorage.getItem('grillix_admin_kitchen_status') || 'Online';
    } catch {
      return 'Online';
    }
  });

  // Orders State with LocalStorage
  const [allOrders, setAllOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('grillix_admin_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read admin orders from storage', e);
    }
    return INITIAL_ORDERS;
  });

  // Menu Items State with LocalStorage (Ensure normalized price property)
  const [menuItems, setMenuItems] = useState(() => {
    try {
      const saved = localStorage.getItem('grillix_admin_menu');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(item => {
            const validPrice = item.price !== undefined && !isNaN(parseFloat(item.price))
              ? parseFloat(item.price)
              : (parseFloat(item.menuPrice) || 299);
            return {
              ...item,
              price: validPrice,
              menuPrice: validPrice
            };
          });
        }
      }
    } catch (e) {
      console.warn('Could not read admin menu from storage', e);
    }
    return FOOD_ITEMS.map(item => {
      const validPrice = item.price !== undefined && !isNaN(parseFloat(item.price))
        ? parseFloat(item.price)
        : (parseFloat(item.menuPrice) || 299);
      return {
        ...item,
        price: validPrice,
        menuPrice: validPrice
      };
    });
  });

  // Restaurant Tables State for Dine-In & QR Code ordering
  const [tables, setTables] = useState(() => {
    try {
      const saved = localStorage.getItem('grillix_admin_tables');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read admin tables from storage', e);
    }
    return INITIAL_TABLES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('grillix_admin_tables', JSON.stringify(tables));
    } catch {}
  }, [tables]);

  // Riders Fleet State (Empty fallback for legacy references)
  const [deliveryRiders, setDeliveryRiders] = useState(INITIAL_RIDERS);

  // Users State with LocalStorage
  const [allUsers, setAllUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('grillix_admin_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read admin users from storage', e);
    }
    return INITIAL_USERS;
  });

  // Restaurant Settings
  const [restaurantSettings, setRestaurantSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('grillix_admin_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read settings from storage', e);
    }
    return INITIAL_SETTINGS;
  });

  // Coupons State
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('grillix_admin_coupons');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read coupons from storage', e);
    }
    return INITIAL_COUPONS;
  });

  // Admin Authentication State
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('grillix_admin_auth');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read admin auth', e);
    }
    return {
      isLoggedIn: true,
      name: 'Kunal Pawar',
      email: 'admin@grillix.in',
      role: 'Head of Operations & Kitchen General Manager',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      lastLogin: 'Today, 04:05 PM'
    };
  });

  useEffect(() => {
    try {
      if (adminUser) {
        localStorage.setItem('grillix_admin_auth', JSON.stringify(adminUser));
      } else {
        localStorage.removeItem('grillix_admin_auth');
      }
    } catch {}
  }, [adminUser]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  const adminLogin = (email, password) => {
    if (!email || !password) {
      showToast('⚠️ Please enter both admin email and password');
      return false;
    }
    const user = {
      isLoggedIn: true,
      name: email.toLowerCase().includes('kunal') || email === 'admin@grillix.in' ? 'Kunal Pawar' : 'Kitchen Partner Admin',
      email: email.trim(),
      role: 'Head of Operations & Kitchen General Manager',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      lastLogin: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
    setAdminUser(user);
    playAdminAlertSound();
    showToast(`🔓 Welcome back to Grillix Admin, ${user.name}!`);
    return true;
  };

  const adminLogout = () => {
    setAdminUser(null);
    try {
      localStorage.removeItem('grillix_admin_auth');
    } catch {}
    showToast('👋 You have successfully signed out of Admin Console');
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('grillix_admin_kitchen_status', kitchenStatus);
    } catch {}
  }, [kitchenStatus]);

  useEffect(() => {
    try {
      localStorage.setItem('grillix_admin_orders', JSON.stringify(allOrders));
    } catch {}
  }, [allOrders]);

  useEffect(() => {
    try {
      localStorage.setItem('grillix_admin_menu', JSON.stringify(menuItems));
    } catch {}
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem('grillix_admin_riders', JSON.stringify(deliveryRiders));
    } catch {}
  }, [deliveryRiders]);

  useEffect(() => {
    try {
      localStorage.setItem('grillix_admin_users', JSON.stringify(allUsers));
    } catch {}
  }, [allUsers]);

  useEffect(() => {
    try {
      localStorage.setItem('grillix_admin_settings', JSON.stringify(restaurantSettings));
    } catch {}
  }, [restaurantSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('grillix_admin_coupons', JSON.stringify(coupons));
    } catch {}
  }, [coupons]);

  // Real-time cross-tab and cross-device sync
  useEffect(() => {
    // 1. Listen for new orders and status updates on BroadcastChannel
    let bc = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('grillix_sync_channel');
        bc.onmessage = (event) => {
          if (event.data?.type === 'NEW_ORDER') {
            const newOrder = event.data.order;
            if (newOrder && newOrder.id) {
              setAllOrders(prev => {
                if (prev.some(o => o.id === newOrder.id)) return prev;
                playAdminAlertSound();
                showToast(`🔔 New Order #${newOrder.id} received from Storefront! Total: ₹${newOrder.total}`);
                const nextOrders = [newOrder, ...prev];
                try {
                  localStorage.setItem('grillix_admin_orders', JSON.stringify(nextOrders));
                } catch {}
                return nextOrders;
              });
            }
          } else if (event.data?.type === 'ORDER_STATUS_UPDATE') {
            const { orderId, status } = event.data;
            setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
          }
        };
      }
    } catch (e) {}

    // 2. Listen for changes in localStorage from other tabs
    const handleStorageChange = (e) => {
      if (e.key === 'grillix_admin_orders' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAllOrders(prev => {
              const prevIds = new Set(prev.map(o => o.id));
              const newlyAdded = parsed.filter(o => o && o.id && !prevIds.has(o.id));
              if (newlyAdded.length > 0) {
                playAdminAlertSound();
                showToast(`🔔 New Order #${newlyAdded[0].id} received from Storefront! Total: ₹${newlyAdded[0].total}`);
              }
              return parsed;
            });
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Live sync from Frontend API (http://localhost:5174/api/orders or /api/orders on Vercel)
  useEffect(() => {
    const syncFromFrontend = async () => {
      try {
        // Also check if localStorage has orders that aren't in state
        try {
          const localSaved = localStorage.getItem('grillix_admin_orders');
          if (localSaved) {
            const parsed = JSON.parse(localSaved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setAllOrders(prev => {
                const prevIds = new Set(prev.map(o => o.id));
                const newlyAdded = parsed.filter(o => o && o.id && !prevIds.has(o.id));
                if (newlyAdded.length > 0) {
                  playAdminAlertSound();
                  showToast(`🔔 New Order #${newlyAdded[0].id} received from Storefront! Total: ₹${newlyAdded[0].total}`);
                  return parsed;
                }
                return prev;
              });
            }
          }
        } catch {}

        const [ordersRes, statusRes, settingsRes] = await Promise.allSettled([
          fetch(`${getApiBase()}/api/orders`),
          fetch(`${getApiBase()}/api/kitchen-status`),
          fetch(`${getApiBase()}/api/restaurant-settings`)
        ]);

        if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
          const liveOrders = await ordersRes.value.json();
          if (Array.isArray(liveOrders) && liveOrders.length > 0) {
            setAllOrders(prev => {
              const map = new Map();
              // Live orders from API
              liveOrders.forEach(o => { if (o && o.id) map.set(o.id, o); });
              // Keep any existing local orders
              prev.forEach(o => { if (o && o.id && !map.has(o.id)) map.set(o.id, o); });
              const merged = Array.from(map.values());

              const prevIds = new Set(prev.map(o => o.id));
              const newlyAdded = merged.filter(o => o && o.id && !prevIds.has(o.id));
              if (newlyAdded.length > 0) {
                playAdminAlertSound();
                showToast(`🔔 New Order #${newlyAdded[0].id} received from Storefront! Total: ₹${newlyAdded[0].total}`);
              }
              try {
                localStorage.setItem('grillix_admin_orders', JSON.stringify(merged));
              } catch {}
              return merged;
            });
          }
        }

        if (statusRes.status === 'fulfilled' && statusRes.value.ok) {
          const statusData = await statusRes.value.json();
          if (statusData && statusData.status) {
            setKitchenStatus(statusData.status);
          }
        }

        if (settingsRes.status === 'fulfilled' && settingsRes.value.ok) {
          const settingsData = await settingsRes.value.json();
          if (settingsData && settingsData.name) {
            setRestaurantSettings(prev => ({ ...prev, ...settingsData }));
          }
        }
      } catch (e) {
        // Fallback to local state
      }
    };

    syncFromFrontend();
    const interval = setInterval(syncFromFrontend, 2500);
    return () => clearInterval(interval);
  }, []);

  // Show Toast Helper
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3500);
  };

  // Kitchen Status Toggle
  const toggleKitchenStatus = () => {
    setKitchenStatus((prev) => {
      const next = prev === 'Online' ? 'Paused' : 'Online';
      fetch(`${getApiBase()}/api/kitchen-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next })
      }).catch(() => {});
      showToast(next === 'Online' ? '🟢 Kitchen is now accepting orders!' : '⏸️ Kitchen is paused for new orders');
      return next;
    });
  };

  // 1. ORDERS ACTIONS
  const updateOrderStatus = (orderId, newStatus) => {
    setAllOrders((prev) => {
      const next = prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord));
      try {
        localStorage.setItem('grillix_admin_orders', JSON.stringify(next));
      } catch {}
      return next;
    });

    // Broadcast across tabs
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('grillix_sync_channel');
        bc.postMessage({ type: 'ORDER_STATUS_UPDATE', orderId, status: newStatus });
        bc.close();
      }
    } catch {}

    // Sync to Frontend API so customer tracking advances in real time
    fetch(`${getApiBase()}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status: newStatus })
    }).catch(() => {});

    if (newStatus === 'Served to Table' || newStatus === 'Served' || newStatus === 'Delivered') {
      playDeliveredSound();
      showToast(`🎉 Order #${orderId} served to table!`);
    } else if (newStatus === 'Cooking in Kitchen' || newStatus === 'Preparing') {
      playStatusUpdateSound();
      showToast(`👨‍🍳 Order #${orderId} is now cooking in kitchen!`);
    } else if (newStatus === 'Ready to Serve' || newStatus === 'Ready') {
      playAdminAlertSound();
      showToast(`🍽️ Order #${orderId} is plated & ready to serve!`);
    } else if (newStatus === 'Completed') {
      playDeliveredSound();
      showToast(`💵 Order #${orderId} completed & billed.`);
    } else {
      playStatusUpdateSound();
      showToast(`Order #${orderId} advanced to "${newStatus}"`);
    }
  };

  const updateOrder = (orderId, updatedFields) => {
    setAllOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, ...updatedFields } : ord))
    );

    fetch(`${getApiBase()}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, ...updatedFields })
    }).catch(() => {});

    showToast(`📝 Order #${orderId} details saved successfully!`);
  };

  const cancelOrder = (orderId, reason = 'Cancelled by Kitchen Admin') => {
    setAllOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: 'Cancelled', cancelReason: reason } : ord))
    );

    fetch(`${getApiBase()}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status: 'Cancelled', cancelReason: reason })
    }).catch(() => {});

    showToast(`❌ Order #${orderId} has been cancelled.`);
  };

  const deleteOrder = (orderId) => {
    setAllOrders((prev) => prev.filter((ord) => ord.id !== orderId));
    showToast(`🗑️ Order #${orderId} removed from records.`);
  };

  const assignTableToOrder = (orderId, tableNumber) => {
    setAllOrders((prev) => {
      const next = prev.map((ord) => (ord.id === orderId ? { ...ord, tableNumber } : ord));
      try { localStorage.setItem('grillix_admin_orders', JSON.stringify(next)); } catch {}
      return next;
    });
    showToast(`🍽️ Assigned Table #${tableNumber} to order #${orderId}`);
  };

  const assignRiderToOrder = assignTableToOrder; // Backwards compatibility

  // Table Management Actions
  const addTable = (tableData) => {
    const nextNum = tableData.number || String(tables.length + 1);
    const newTable = {
      id: `T-${String(nextNum).padStart(2, '0')}`,
      number: String(nextNum),
      name: tableData.name || `Table ${nextNum}`,
      section: tableData.section || 'Main Dining Hall',
      capacity: parseInt(tableData.capacity) || 4,
      status: 'Available',
      activeOrderId: null
    };
    setTables(prev => [...prev, newTable]);
    showToast(`✅ Added Table #${newTable.number} (${newTable.section})`);
    return newTable;
  };

  const updateTableStatus = (tableId, newStatus) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, status: newStatus } : t));
    showToast(`Table status updated to ${newStatus}`);
  };

  const updateTable = (tableId, updatedFields) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, ...updatedFields } : t));
    showToast(`Table details updated`);
  };

  const deleteTable = (tableId) => {
    setTables(prev => prev.filter(t => t.id !== tableId));
    showToast(`🗑️ Table removed`);
  };

  // 2. MENU & INVENTORY ACTIONS
  const toggleMenuItemStock = (itemId) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, inStock: item.inStock === false ? true : false } : item
      )
    );
    showToast('Inventory stock status updated');
  };

  const updateMenuItemPrice = (itemId, newPrice) => {
    const num = parseFloat(newPrice);
    if (isNaN(num) || num <= 0) {
      showToast('⚠️ Please enter a valid price in ₹ INR');
      return;
    }
    setMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, price: num, menuPrice: num } : item))
    );
    showToast(`Updated price to ₹${num.toFixed(2)}`);
  };

  const updateMenuItem = (itemId, updatedData) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const normalizedPrice = updatedData.price !== undefined
          ? (parseFloat(updatedData.price) || item.price || 299)
          : (updatedData.menuPrice !== undefined ? (parseFloat(updatedData.menuPrice) || item.price || 299) : item.price);
        return {
          ...item,
          ...updatedData,
          price: normalizedPrice,
          menuPrice: normalizedPrice
        };
      })
    );
    showToast(`✅ Saved changes to dish "${updatedData.name || 'item'}"`);
  };

  const deleteMenuItem = (itemId) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
    showToast('🗑️ Dish removed from menu');
  };

  const addMenuItem = (dish) => {
    setMenuItems((prev) => [dish, ...prev]);
    playAdminAlertSound();
    showToast(`✨ Added new dish "${dish.name}" to menu!`);
  };

  // 3. RESTAURANT SETTINGS & DELIVERY ACTIONS
  const updateRestaurantSettings = (newSettings) => {
    setRestaurantSettings(newSettings);
    // Post to Frontend API so customer storefront updates delivery fees & policies immediately
    fetch(`${getApiBase()}/api/restaurant-settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    }).catch(() => {});
    showToast('🏢 Restaurant profile & delivery controls saved & live!');
  };

  // 4. DELIVERY RIDERS ACTIONS
  const addRider = (newRider) => {
    setDeliveryRiders((prev) => [newRider, ...prev]);
    showToast(`🛵 Rider ${newRider.name} added to delivery fleet`);
  };

  const updateRider = (riderId, updatedData) => {
    setDeliveryRiders((prev) =>
      prev.map((r) => (r.id === riderId ? { ...r, ...updatedData } : r))
    );
    showToast(`🛵 Updated profile for ${updatedData.name || 'rider'}`);
  };

  const toggleRiderDuty = (riderId) => {
    setDeliveryRiders((prev) =>
      prev.map((r) => (r.id === riderId ? { ...r, onDuty: !r.onDuty } : r))
    );
    showToast('Rider duty status updated');
  };

  const deleteRider = (riderId) => {
    setDeliveryRiders((prev) => prev.filter((r) => r.id !== riderId));
    showToast('Rider removed from fleet');
  };

  // 5. CUSTOMER USERS ACTIONS
  const addNewUser = (newUser) => {
    setAllUsers((prev) => [newUser, ...prev]);
    showToast(`👤 Created customer account for ${newUser.name}`);
  };

  const updateUser = (userId, updatedData) => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updatedData } : u))
    );
    showToast(`👤 Updated customer profile for ${updatedData.name || 'user'}`);
  };

  const deleteUser = (userId) => {
    setAllUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast('Customer account removed');
  };

  // 6. PROMO COUPONS ACTIONS
  const addCoupon = (newCoupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
    showToast(`🎟️ Created coupon code ${newCoupon.code}`);
  };

  const updateCoupon = (code, updatedData) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, ...updatedData } : c))
    );
    showToast(`🎟️ Updated coupon ${code}`);
  };

  const toggleCoupon = (code) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
    showToast('Coupon status updated');
  };

  const deleteCoupon = (code) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    showToast(`Coupon ${code} removed`);
  };

  // 7. GLOBAL RESET TO DEMO DATA
  const resetAllData = () => {
    setAllOrders(INITIAL_ORDERS);
    setMenuItems(FOOD_ITEMS.map(item => ({ ...item, price: item.price ?? item.menuPrice ?? 299 })));
    setDeliveryRiders(INITIAL_RIDERS);
    setAllUsers(INITIAL_USERS);
    setRestaurantSettings(INITIAL_SETTINGS);
    setCoupons(INITIAL_COUPONS);
    setKitchenStatus('Online');
    try {
      localStorage.removeItem('grillix_admin_orders');
      localStorage.removeItem('grillix_admin_menu');
      localStorage.removeItem('grillix_admin_riders');
      localStorage.removeItem('grillix_admin_users');
      localStorage.removeItem('grillix_admin_settings');
      localStorage.removeItem('grillix_admin_coupons');
      localStorage.removeItem('grillix_admin_kitchen_status');
    } catch {}
    showToast('🔄 Reset kitchen operations data to initial defaults');
  };

  return (
    <AdminContext.Provider
      value={{
        kitchenStatus,
        toggleKitchenStatus,
        allOrders,
        updateOrderStatus,
        updateOrder,
        cancelOrder,
        deleteOrder,
        assignRiderToOrder,
        menuItems,
        toggleMenuItemStock,
        updateMenuItemPrice,
        updateMenuItem,
        deleteMenuItem,
        addMenuItem,
        tables,
        addTable,
        updateTableStatus,
        updateTable,
        deleteTable,
        assignTableToOrder,
        deliveryRiders,
        addRider,
        updateRider,
        toggleRiderDuty,
        deleteRider,
        allUsers,
        addNewUser,
        updateUser,
        deleteUser,
        restaurantSettings,
        updateRestaurantSettings,
        coupons,
        addCoupon,
        updateCoupon,
        toggleCoupon,
        deleteCoupon,
        adminUser,
        adminLogin,
        adminLogout,
        resetAllData,
        showToast,
        toastMessage,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
