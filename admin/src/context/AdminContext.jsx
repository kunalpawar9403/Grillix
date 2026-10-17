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

export const INITIAL_RIDERS = [
  { id: 'rider-1', name: 'Vikram Singh', phone: '+91 98201 44321', vehicle: 'Ather 450X EV (Plate #MH-02-GR-402)', rating: 4.9, activeDeliveries: 1, tripsCompleted: 342, battery: 84, onDuty: true },
  { id: 'rider-2', name: 'Aisha Khan', phone: '+91 98334 11980', vehicle: 'Honda Activa 6G (Plate #MH-02-GR-718)', rating: 4.8, activeDeliveries: 0, tripsCompleted: 219, battery: 92, onDuty: true },
  { id: 'rider-3', name: 'Rohit Shinde', phone: '+91 98112 77654', vehicle: 'Eco Cargo E-Bike (Plate #MH-02-GR-109)', rating: 5.0, activeDeliveries: 0, tripsCompleted: 480, battery: 67, onDuty: true },
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
    paymentMethod: 'Paytm Wallet',
    deliveryNotes: 'Ring bell twice'
  },
  {
    id: 'GRX-IND-100',
    customerName: 'Kunal Pawar',
    customerPhone: '+91 98200 11223',
    address: 'Flat 502, Green Meadows Residency, Spine Road, Moshi, Pune 412105',
    date: 'Yesterday, 8:15 PM',
    total: 588.00,
    status: 'Delivered',
    items: ['Tofu Crunch High-Protein Bowl', 'Detox Cold-Pressed Green Juice'],
    assignedRider: 'Rohit Shinde',
    paymentMethod: 'Credit Card (HDFC)',
    deliveryNotes: 'Delivered at door'
  }
];

export const INITIAL_SETTINGS = {
  name: 'GRILLIX Restaurant & Kitchen - Moshi Flagship',
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
  announcement: '🌿 Using 100% hydroponic organic greens and cold-pressed olive oils in Moshi, Pune!'
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

  // Riders Fleet State with LocalStorage
  const [deliveryRiders, setDeliveryRiders] = useState(() => {
    try {
      const saved = localStorage.getItem('grillix_admin_riders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read admin riders from storage', e);
    }
    return INITIAL_RIDERS;
  });

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

  // Live sync from Frontend API (http://localhost:5174/api/orders, /api/kitchen-status & /api/restaurant-settings)
  useEffect(() => {
    const syncFromFrontend = async () => {
      try {
        const [ordersRes, statusRes, settingsRes] = await Promise.allSettled([
          fetch('http://localhost:5174/api/orders'),
          fetch('http://localhost:5174/api/kitchen-status'),
          fetch('http://localhost:5174/api/restaurant-settings')
        ]);

        if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
          const liveOrders = await ordersRes.value.json();
          if (Array.isArray(liveOrders) && liveOrders.length > 0) {
            setAllOrders(prev => {
              if (prev.length > 0 && liveOrders.length > prev.length) {
                playAdminAlertSound();
                showToast(`🔔 New Order #${liveOrders[0].id} received from Storefront! Total: ₹${liveOrders[0].total}`);
              }
              return liveOrders;
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
      fetch('http://localhost:5174/api/kitchen-status', {
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
    setAllOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );

    // Sync to Frontend API so customer tracking advances in real time
    fetch('http://localhost:5174/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status: newStatus })
    }).catch(() => {});

    if (newStatus === 'Delivered') {
      playDeliveredSound();
      showToast(`🎉 Order #${orderId} marked as Delivered!`);
    } else {
      playStatusUpdateSound();
      showToast(`Order #${orderId} advanced to "${newStatus}"`);
    }
  };

  const updateOrder = (orderId, updatedFields) => {
    setAllOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, ...updatedFields } : ord))
    );

    fetch('http://localhost:5174/api/orders', {
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

    fetch('http://localhost:5174/api/orders', {
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

  const assignRiderToOrder = (orderId, riderName) => {
    setAllOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, assignedRider: riderName } : ord))
    );
    showToast(`🛵 Assigned rider ${riderName} to order #${orderId}`);
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
    fetch('http://localhost:5174/api/restaurant-settings', {
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
