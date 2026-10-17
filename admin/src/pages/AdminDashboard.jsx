import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  ShoppingBag, 
  Package, 
  Bike, 
  CheckCircle2, 
  Plus, 
  Search, 
  Clock, 
  Power, 
  ExternalLink, 
  Shield, 
  Edit2, 
  Phone, 
  UserPlus, 
  Trash2, 
  RotateCcw, 
  TrendingUp, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  X, 
  ChevronRight, 
  Flame, 
  AlertCircle, 
  Store, 
  Ticket, 
  Printer, 
  Sliders, 
  MapPin, 
  Mail, 
  FileText, 
  Check, 
  Calendar, 
  Percent, 
  Truck, 
  Settings, 
  Users,
  Bell,
  ChevronDown,
  ArrowUpRight,
  BarChart3,
  Layers,
  Menu as MenuIcon,
  LogOut,
  QrCode,
  UtensilsCrossed,
  Download,
  Eye
} from 'lucide-react';
import QRCode from 'qrcode';
import { useAdmin } from '../context/AdminContext';
import { getStorefrontUrl } from '../utils/navigation';

const TableQRCodeImage = ({ url, size = 160, className = '' }) => {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(url, {
      width: size * 2,
      margin: 1,
      color: {
        dark: '#0a1408',
        light: '#ffffff'
      }
    }).then(res => {
      if (isMounted) setDataUrl(res);
    }).catch(err => {
      console.error('Failed to generate QR code', err);
    });
    return () => { isMounted = false; };
  }, [url, size]);

  if (!dataUrl) {
    return (
      <div 
        style={{ width: size, height: size }} 
        className={`bg-white/10 animate-pulse rounded-2xl flex items-center justify-center text-[10px] text-[#8fa778] ${className}`}
      >
        Generating QR...
      </div>
    );
  }

  return (
    <img 
      src={dataUrl} 
      alt="Table QR Code" 
      style={{ width: size, height: size }}
      className={`rounded-2xl bg-white p-2.5 shadow-md ${className}`} 
    />
  );
};

const downloadTableQr = (tableNumber, url) => {
  QRCode.toDataURL(url, { width: 600, margin: 2, color: { dark: '#0a1408', light: '#ffffff' } })
    .then(dataUri => {
      const link = document.createElement('a');
      link.download = `Grillix_Table_${tableNumber}_QR.png`;
      link.href = dataUri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(console.error);
};

const getTableQrUrl = (tableNumber) => {
  if (typeof window !== 'undefined') {
    if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port === '5175') {
      return `http://localhost:5174/?table=${tableNumber}`;
    }
    return `${window.location.origin}/?table=${tableNumber}`;
  }
  return `/?table=${tableNumber}`;
};

export const AdminDashboard = () => {
  const { 
    kitchenStatus, 
    toggleKitchenStatus,
    allOrders, 
    updateOrderStatus, 
    updateOrder,
    cancelOrder,
    deleteOrder,
    assignRiderToOrder,
    assignTableToOrder,
    tables = [],
    addTable,
    updateTableStatus,
    updateTable,
    deleteTable,
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
    adminLogout,
    resetAllData,
    showToast,
    toastMessage
  } = useAdmin();

  // Navigation tab: 'overview' | 'orders' | 'menu' | 'settings' | 'riders' | 'users' | 'coupons' | 'analytics'
  const [activeTab, setActiveTab] = useState('overview');
  const [orderFilter, setOrderFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState('Moshi Flagship (PCMC Pune)');

  // Table QR & Dine-In State
  const [selectedTableForPrint, setSelectedTableForPrint] = useState(null);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [tableSectionFilter, setTableSectionFilter] = useState('all');
  const [newTableForm, setNewTableForm] = useState({
    number: '',
    name: '',
    section: 'Main Dining Hall',
    capacity: 4
  });

  // 1. EDIT DISH MODAL STATE
  const [showEditDishModal, setShowEditDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);

  // 2. ADD DISH MODAL STATE
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [newDishForm, setNewDishForm] = useState({
    name: '',
    shortName: '',
    category: 'Bowls',
    price: '',
    calories: '450',
    description: '',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    spiceLevel: 2,
    prepTime: '15-20 min',
    dietary: 'Organic, Vegan'
  });

  // 3. EDIT ORDER MODAL STATE
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // 4. PRINT KOT / RECEIPT MODAL STATE
  const [printOrder, setPrintOrder] = useState(null);

  // 5. RESTAURANT SETTINGS FORM STATE
  const [settingsForm, setSettingsForm] = useState(restaurantSettings);
  useEffect(() => {
    setSettingsForm(restaurantSettings);
  }, [restaurantSettings]);

  // 6. RIDER MODALS STATE
  const [showAddRiderModal, setShowAddRiderModal] = useState(false);
  const [showEditRiderModal, setShowEditRiderModal] = useState(false);
  const [editingRider, setEditingRider] = useState(null);
  const [newRiderForm, setNewRiderForm] = useState({
    name: '',
    phone: '',
    vehicle: 'Ather 450X EV (Plate #MH-02-GR-901)',
    battery: 90
  });

  // 7. USER MODALS STATE
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Moshi, Pune',
    address: '',
    tier: 'Green Pioneer',
    points: 250,
    dietary: 'Vegetarian'
  });

  // 8. COUPON MODALS STATE
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [showEditCouponModal, setShowEditCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [newCouponForm, setNewCouponForm] = useState({
    code: '',
    type: 'flat',
    value: 50,
    minOrder: 299,
    maxDiscount: 100,
    desc: ''
  });

  // Inline Quick Price Edit
  const [quickPriceId, setQuickPriceId] = useState(null);
  const [quickPriceInput, setQuickPriceInput] = useState('');

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filter & Search Orders
  const filteredOrders = allOrders.filter(o => {
    const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
    const matchesSearch = 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Financial Metrics
  const activeOrdersCount = allOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const completedOrdersCount = allOrders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = allOrders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
  const aov = allOrders.length > 0 ? (totalRevenue / allOrders.length).toFixed(2) : '0.00';

  // ----------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------

  // Create Dish
  const handleCreateDish = (e) => {
    e.preventDefault();
    if (!newDishForm.name.trim() || !newDishForm.price) {
      showToast('⚠️ Please provide dish name and price');
      return;
    }
    const priceNum = parseFloat(newDishForm.price);
    const dish = {
      id: `dish-${Date.now()}`,
      name: newDishForm.name.trim(),
      shortName: newDishForm.shortName.trim() || newDishForm.name.trim().slice(0, 16),
      category: newDishForm.category,
      price: priceNum,
      menuPrice: priceNum,
      calories: parseInt(newDishForm.calories) || 450,
      description: newDishForm.description.trim() || 'Prepared fresh using handpicked organic ingredients.',
      rating: 5.0,
      ratingCount: 1,
      inStock: true,
      image: newDishForm.image.trim() || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
      spiceLevel: parseInt(newDishForm.spiceLevel) || 1,
      prepTime: newDishForm.prepTime || '15-20 min',
      dietary: newDishForm.dietary.split(',').map(s => s.trim()).filter(Boolean)
    };
    addMenuItem(dish);
    setShowAddDishModal(false);
    setNewDishForm({
      name: '',
      shortName: '',
      category: 'Bowls',
      price: '',
      calories: '450',
      description: '',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
      spiceLevel: 2,
      prepTime: '15-20 min',
      dietary: 'Organic, Vegan'
    });
  };

  // Save Edited Dish
  const handleSaveEditDish = (e) => {
    e.preventDefault();
    if (!editingDish) return;
    const priceNum = parseFloat(editingDish.price) || 299;
    updateMenuItem(editingDish.id, {
      ...editingDish,
      price: priceNum,
      menuPrice: priceNum,
      calories: parseInt(editingDish.calories) || 450,
      spiceLevel: parseInt(editingDish.spiceLevel) || 1
    });
    setShowEditDishModal(false);
    setEditingDish(null);
  };

  // Save Edited Order
  const handleSaveEditOrder = (e) => {
    e.preventDefault();
    if (!editingOrder) return;
    updateOrder(editingOrder.id, {
      customerName: editingOrder.customerName,
      customerPhone: editingOrder.customerPhone,
      address: editingOrder.address,
      assignedRider: editingOrder.assignedRider,
      total: parseFloat(editingOrder.total) || 0,
      deliveryNotes: editingOrder.deliveryNotes,
      paymentMethod: editingOrder.paymentMethod
    });
    setShowEditOrderModal(false);
    setEditingOrder(null);
  };

  // Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateRestaurantSettings(settingsForm);
  };

  // Add Table
  const handleAddTable = (e) => {
    e.preventDefault();
    if (!newTableForm.number.trim()) {
      showToast('⚠️ Please enter a table number');
      return;
    }
    const t = {
      id: `table-${Date.now()}`,
      number: newTableForm.number.trim(),
      name: newTableForm.name.trim() || `Table ${newTableForm.number.trim()}`,
      section: newTableForm.section || 'Main Dining Hall',
      capacity: parseInt(newTableForm.capacity) || 4,
      status: 'Available',
      currentOrderId: null
    };
    addTable(t);
    setShowAddTableModal(false);
    setNewTableForm({ number: '', name: '', section: 'Main Dining Hall', capacity: 4 });
  };

  // Add Rider
  const handleAddRider = (e) => {
    e.preventDefault();
    if (!newRiderForm.name.trim() || !newRiderForm.phone.trim()) {
      showToast('⚠️ Please enter rider name and phone');
      return;
    }
    const r = {
      id: `rider-${Date.now()}`,
      name: newRiderForm.name.trim(),
      phone: newRiderForm.phone.trim(),
      vehicle: newRiderForm.vehicle.trim() || 'Ather 450X EV',
      rating: 5.0,
      activeDeliveries: 0,
      tripsCompleted: 0,
      battery: parseInt(newRiderForm.battery) || 100,
      onDuty: true
    };
    addRider(r);
    setShowAddRiderModal(false);
    setNewRiderForm({ name: '', phone: '', vehicle: '', battery: 90 });
  };

  // Save Edit Rider
  const handleSaveEditRider = (e) => {
    e.preventDefault();
    if (!editingRider) return;
    updateRider(editingRider.id, {
      name: editingRider.name,
      phone: editingRider.phone,
      vehicle: editingRider.vehicle,
      battery: parseInt(editingRider.battery) || 80,
      onDuty: editingRider.onDuty
    });
    setShowEditRiderModal(false);
    setEditingRider(null);
  };

  // Add User
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) {
      showToast('⚠️ Please enter name and email');
      return;
    }
    const u = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: newUserForm.name.trim(),
      email: newUserForm.email.trim(),
      phone: newUserForm.phone.trim() || '+91 98000 00000',
      city: newUserForm.city,
      address: newUserForm.address.trim() || `${newUserForm.city}, India`,
      tier: newUserForm.tier,
      points: parseInt(newUserForm.points) || 200,
      dietary: newUserForm.dietary,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
    addNewUser(u);
    setShowAddUserModal(false);
    setNewUserForm({
      name: '',
      email: '',
      phone: '',
      city: 'Moshi, Pune',
      address: '',
      tier: 'Green Pioneer',
      points: 250,
      dietary: 'Vegetarian'
    });
  };

  // Save Edit User
  const handleSaveEditUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      phone: editingUser.phone,
      city: editingUser.city,
      address: editingUser.address,
      tier: editingUser.tier,
      points: parseInt(editingUser.points) || 0,
      dietary: editingUser.dietary
    });
    setShowEditUserModal(false);
    setEditingUser(null);
  };

  // Add Coupon
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCouponForm.code.trim()) {
      showToast('⚠️ Please enter a coupon code');
      return;
    }
    const c = {
      code: newCouponForm.code.trim().toUpperCase(),
      type: newCouponForm.type,
      value: parseFloat(newCouponForm.value) || 0,
      minOrder: parseFloat(newCouponForm.minOrder) || 0,
      maxDiscount: parseFloat(newCouponForm.maxDiscount) || 100,
      desc: newCouponForm.desc.trim() || `${newCouponForm.code.toUpperCase()} Special Discount`,
      active: true
    };
    addCoupon(c);
    setShowAddCouponModal(false);
    setNewCouponForm({
      code: '',
      type: 'flat',
      value: 50,
      minOrder: 299,
      maxDiscount: 100,
      desc: ''
    });
  };

  // Save Edit Coupon
  const handleSaveEditCoupon = (e) => {
    e.preventDefault();
    if (!editingCoupon) return;
    updateCoupon(editingCoupon.code, {
      type: editingCoupon.type,
      value: parseFloat(editingCoupon.value) || 0,
      minOrder: parseFloat(editingCoupon.minOrder) || 0,
      maxDiscount: parseFloat(editingCoupon.maxDiscount) || 100,
      desc: editingCoupon.desc,
      active: editingCoupon.active
    });
    setShowEditCouponModal(false);
    setEditingCoupon(null);
  };

  // Sidebar Menu Configuration
  const navSections = [
    {
      heading: 'CORE OPERATIONS',
      items: [
        { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
        { id: 'orders', label: 'Live Orders', icon: ShoppingBag, count: allOrders.length },
        { id: 'menu', label: 'Menu & Dishes', icon: Edit2, count: menuItems.length },
      ]
    },
    {
      heading: 'MANAGEMENT & CRM',
      items: [
        { id: 'tables', label: 'Tables & QR Codes', icon: QrCode, count: tables.length },
        { id: 'users', label: 'Customer CRM', icon: Users, count: allUsers.length },
        { id: 'coupons', label: 'Promo Coupons', icon: Ticket, count: coupons.length },
      ]
    },
    {
      heading: 'SYSTEM & CONFIG',
      items: [
        { id: 'settings', label: 'Restaurant & POS Setup', icon: Store },
        { id: 'analytics', label: 'Financial Reports', icon: TrendingUp },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#091106] text-[#e8f2db] font-sans selection:bg-[#a8e83c] selection:text-[#091106] flex">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#16290b] border-2 border-[#a8e83c] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 animate-bounce">
          <Sparkles size={18} className="text-[#a8e83c] shrink-0" />
          <span className="text-xs sm:text-sm font-black">{toastMessage}</span>
        </div>
      )}

      {/* ==================================================== */}
      {/* LEFT SIDEBAR NAVIGATION (Modern Enterprise Admin Look) */}
      {/* ==================================================== */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f1b0a] border-r border-[#1e3412] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Sidebar Header with Brand & Outlet Switcher */}
        <div className="p-5 border-b border-[#1e3412] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#244709] to-[#a8e83c] flex items-center justify-center text-[#091106] font-black text-xl shadow-lg ring-2 ring-[#a8e83c]/30">
                G
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-white text-base tracking-tight">GRILLIX</span>
                  <span className="text-[9px] font-black bg-[#a8e83c] text-[#091106] px-1.5 py-0.5 rounded-full uppercase">
                    Admin
                  </span>
                </div>
                <span className="text-[10px] text-[#8fa778] block font-mono">v2.5 Enterprise POS</span>
              </div>
            </div>

            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden text-[#8fa778] hover:text-white p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Single Flagship Restaurant Identity Badge */}
          <div className="bg-[#15270e] border border-[#233d15] rounded-2xl p-2.5 flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center space-x-2 truncate">
              <span className="w-2 h-2 rounded-full bg-[#a8e83c] animate-pulse shrink-0"></span>
              <div className="truncate">
                <span className="font-extrabold text-white truncate text-[11px] block">GRILLIX Central Kitchen</span>
                <span className="text-[9px] text-[#8fa778] font-mono block">Moshi, Pune (PCMC)</span>
              </div>
            </div>
            <span className="text-[9px] font-black bg-[#244709] text-[#a8e83c] px-2 py-0.5 rounded-full border border-[#a8e83c]/30">
              Live
            </span>
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 no-scrollbar">
          {navSections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <span className="px-3 text-[10px] font-black uppercase tracking-wider text-[#698254]">
                {sec.heading}
              </span>
              <div className="space-y-0.5 pt-1">
                {sec.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#a8e83c] text-[#091106] shadow-md font-black'
                          : 'text-[#a1b88c] hover:bg-[#16290f] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon size={16} className={isActive ? 'text-[#091106]' : 'text-[#8fa778]'} />
                        <span>{item.label}</span>
                      </div>
                      {item.count !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                          isActive ? 'bg-[#091106] text-[#a8e83c]' : 'bg-[#1b3113] text-[#a8e83c]'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer with Admin Profile & Storefront Link */}
        <div className="p-4 border-t border-[#1e3412] space-y-3 bg-[#0d1708]">
          
          {/* Admin User Card */}
          <div className="bg-[#15270e] p-2.5 rounded-2xl border border-[#233d15] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#274b10] border border-[#a8e83c] flex items-center justify-center font-black text-xs text-[#a8e83c] shrink-0">
                  {adminUser?.name ? adminUser.name.slice(0, 2).toUpperCase() : 'KP'}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate">{adminUser?.name || 'Kunal Pawar'}</span>
                  <span className="text-[10px] text-[#8fa778] block truncate">{adminUser?.role || 'Head of Operations'}</span>
                </div>
              </div>
              
              <button
                onClick={toggleKitchenStatus}
                className={`w-2.5 h-2.5 rounded-full ${kitchenStatus === 'Online' ? 'bg-[#a8e83c]' : 'bg-red-500'} animate-pulse shrink-0`}
                title={kitchenStatus === 'Online' ? 'Kitchen is Online' : 'Kitchen is Paused'}
              />
            </div>

            {/* Logout / Sign Out Button */}
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to log out of the Admin Console?')) {
                  adminLogout();
                }
              }}
              className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white text-xs font-bold transition-colors border border-red-900/40"
              title="Log out of Admin Console"
            >
              <LogOut size={12} />
              <span>Log Out</span>
            </button>
          </div>

          {/* Quick link to Storefront */}
          <a
            href={getStorefrontUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-xl bg-[#1b3311] hover:bg-[#254618] text-[#a8e83c] text-xs font-bold transition-colors border border-[#294c1a]"
            title="Open Customer Food Delivery Store"
          >
            <span>Customer Storefront</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </aside>

      {/* Overlay Backdrop for Mobile Sidebar */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ==================================================== */}
      {/* MAIN ADMIN WORKSPACE (Right Column) */}
      {/* ==================================================== */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#0f1b0a]/90 backdrop-blur-md border-b border-[#1e3412] h-18 px-4 sm:px-8 flex items-center justify-between gap-4">
          
          {/* Mobile Hamburger & Page Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#8fa778] hover:text-white rounded-xl bg-[#15270e]"
            >
              <MenuIcon size={20} />
            </button>

            <div>
              <div className="flex items-center space-x-2 text-[11px] text-[#8fa778]">
                <span>Grillix</span>
                <span>/</span>
                <span className="text-[#a8e83c] font-bold capitalize">
                  {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-white capitalize leading-tight">
                {activeTab === 'overview' && 'Operations Command Center'}
                {activeTab === 'orders' && 'Live Kitchen Orders & Dispatch'}
                {activeTab === 'menu' && 'Menu & Inventory Management'}
                {activeTab === 'settings' && 'Restaurant & Outlet Profile'}
                {activeTab === 'riders' && 'Delivery Fleet Logistics'}
                {activeTab === 'users' && 'Customer CRM & Loyalty'}
                {activeTab === 'coupons' && 'Promotions & Discounts'}
                {activeTab === 'analytics' && 'Financial Sales Analytics'}
              </h1>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Live IST Clock */}
            <div className="hidden md:flex items-center space-x-2 bg-[#15270e] px-3.5 py-1.5 rounded-full border border-[#233d15] text-xs font-mono font-bold text-[#c9e0b1]">
              <span className="w-2 h-2 rounded-full bg-[#a8e83c] animate-pulse"></span>
              <span>{currentTime} IST</span>
            </div>

            {/* Quick Kitchen Status Button */}
            <button
              onClick={toggleKitchenStatus}
              className={`flex items-center space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-full font-bold text-xs transition-all ${
                kitchenStatus === 'Online'
                  ? 'bg-[#224709] hover:bg-[#2d5c0d] text-[#a8e83c] border border-[#a8e83c]/40'
                  : 'bg-red-950 hover:bg-red-900 text-red-200 border border-red-500/40'
              }`}
            >
              <Power size={13} className={kitchenStatus === 'Online' ? 'text-[#a8e83c]' : 'text-red-400'} />
              <span className="hidden sm:inline">{kitchenStatus === 'Online' ? 'Accepting Orders' : 'Paused'}</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-9 h-9 rounded-full bg-[#15270e] hover:bg-[#203915] flex items-center justify-center text-[#c9e0b1] border border-[#233d15] transition-colors relative"
                title="Recent Alerts"
              >
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#a8e83c]"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-[#12200d] border border-[#213c14] rounded-2xl p-3 shadow-2xl z-50 text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#213c14]">
                    <span className="font-black text-white text-xs">Recent Kitchen Activity</span>
                    <span className="text-[10px] text-[#8fa778]">Live Feed</span>
                  </div>
                  <div className="space-y-1.5">
                    {allOrders.slice(0, 3).map(o => (
                      <div key={o.id} className="p-2 rounded-xl bg-[#192c12] space-y-0.5">
                        <div className="flex justify-between font-bold text-white text-[11px]">
                          <span>Order #{o.id}</span>
                          <span className="text-[#a8e83c]">₹{o.total}</span>
                        </div>
                        <p className="text-[10px] text-[#8fa778] truncate">{o.customerName} • {o.status}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                showToast(soundEnabled ? '🔇 Kitchen sound alerts muted' : '🔊 Kitchen audio alerts active');
              }}
              className="w-9 h-9 rounded-full bg-[#15270e] hover:bg-[#203915] flex items-center justify-center text-[#c9e0b1] border border-[#233d15] transition-colors"
              title="Toggle Kitchen Alert Sounds"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Top Bar Sign Out Button */}
            <button
              onClick={() => {
                if (window.confirm('Sign out of Grillix Kitchen Partner Console?')) {
                  adminLogout();
                }
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-900/40 text-xs font-bold transition-colors"
              title="Log Out of Partner Console"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="p-4 sm:p-8 space-y-6 max-w-7xl">
          
          {/* ==================================================== */}
          {/* SCREEN: OVERVIEW (THE DEDICATED ADMIN DASHBOARD LOOK) */}
          {/* ==================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Welcome Hero Card */}
              <div className="relative overflow-hidden bg-gradient-to-r from-[#14260d] via-[#1a3212] to-[#14260d] border border-[#284c1a] rounded-3xl p-6 sm:p-7 shadow-lg">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#a8e83c] text-[#091106] uppercase tracking-wider">
                        Live Operations
                      </span>
                      <span className="text-xs text-[#9bb084] font-medium">Bandra Central Kitchen</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Welcome back, Kunal! 👨‍🍳
                    </h2>
                    <p className="text-xs text-[#a0b58a] max-w-xl">
                      Kitchen acceptance is <b className="text-white">Active</b>. You have <b className="text-[#a8e83c]">{activeOrdersCount} orders</b> currently in preparation or out for delivery. Next estimated peak rush starts around 07:30 PM.
                    </p>
                  </div>

                  {/* Hero Quick Action Buttons */}
                  <div className="flex items-center flex-wrap gap-2 shrink-0">
                    <button
                      onClick={() => setShowAddDishModal(true)}
                      className="flex items-center space-x-1.5 bg-[#a8e83c] hover:bg-[#bcf856] text-[#091106] px-4 py-2.5 rounded-2xl font-black text-xs transition-all shadow-md active:scale-95"
                    >
                      <Plus size={15} />
                      <span>Add Dish</span>
                    </button>
                    <button
                      onClick={() => setShowAddCouponModal(true)}
                      className="flex items-center space-x-1.5 bg-[#1e3813] hover:bg-[#284b1a] text-white px-4 py-2.5 rounded-2xl font-bold text-xs transition-all border border-[#2f551c]"
                    >
                      <Ticket size={15} className="text-[#a8e83c]" />
                      <span>New Coupon</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="flex items-center space-x-1.5 bg-[#1e3813] hover:bg-[#284b1a] text-white px-4 py-2.5 rounded-2xl font-bold text-xs transition-all border border-[#2f551c]"
                    >
                      <ShoppingBag size={15} className="text-[#a8e83c]" />
                      <span>View Orders</span>
                    </button>
                  </div>
                </div>

                {/* Subtle Background Glow */}
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#a8e83c]/10 rounded-full blur-3xl pointer-events-none" />
              </div>

              {/* 6 Executive KPI Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                
                <div className="bg-[#12200d] border border-[#213c14] rounded-3xl p-4 space-y-1 shadow-sm hover:border-[#386022] transition-colors">
                  <div className="flex items-center justify-between text-[#8fa778]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Gross Sales</span>
                    <TrendingUp size={16} className="text-[#a8e83c]" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-[#a8e83c]">
                    ₹{totalRevenue.toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-1 text-[10px] text-emerald-400 font-bold">
                    <span>↑ +18.4%</span>
                    <span className="text-[#8fa778] font-normal">vs y'day</span>
                  </div>
                </div>

                <div className="bg-[#12200d] border border-[#213c14] rounded-3xl p-4 space-y-1 shadow-sm hover:border-[#386022] transition-colors">
                  <div className="flex items-center justify-between text-[#8fa778]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Live Tickets</span>
                    <Package size={16} className="text-amber-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">{activeOrdersCount}</div>
                  <div className="text-[10px] text-amber-300 font-bold">In Prep / Delivery</div>
                </div>

                <div className="bg-[#12200d] border border-[#213c14] rounded-3xl p-4 space-y-1 shadow-sm hover:border-[#386022] transition-colors">
                  <div className="flex items-center justify-between text-[#8fa778]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Delivered</span>
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">{completedOrdersCount}</div>
                  <div className="text-[10px] text-[#8fa778]">Orders fulfilled</div>
                </div>

                <div className="bg-[#12200d] border border-[#213c14] rounded-3xl p-4 space-y-1 shadow-sm hover:border-[#386022] transition-colors">
                  <div className="flex items-center justify-between text-[#8fa778]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Avg Order (AOV)</span>
                    <BarChart3 size={16} className="text-[#a8e83c]" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">₹{aov}</div>
                  <div className="text-[10px] text-emerald-400 font-bold">+5.2% basket size</div>
                </div>

                <div className="bg-[#12200d] border border-[#213c14] rounded-3xl p-4 space-y-1 shadow-sm hover:border-[#386022] transition-colors">
                  <div className="flex items-center justify-between text-[#8fa778]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Dining Tables</span>
                    <QrCode size={16} className="text-[#a8e83c]" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">{tables.length}</div>
                  <div className="text-[10px] text-emerald-400 font-bold">{tables.filter(t => t.status === 'Occupied').length} Seated • QR Active</div>
                </div>

                <div className="bg-[#12200d] border border-[#213c14] rounded-3xl p-4 space-y-1 shadow-sm hover:border-[#386022] transition-colors">
                  <div className="flex items-center justify-between text-[#8fa778]">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Menu Health</span>
                    <Store size={16} className="text-purple-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">{menuItems.length}</div>
                  <div className="text-[10px] text-emerald-400 font-bold">100% In Stock</div>
                </div>

              </div>

              {/* Two Column Layout: Charts & Live Feeds */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left 2 Columns: Hourly Rush Chart & Live Feed */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Hourly Order Rush Bar Chart */}
                  <div className="bg-[#12200d] border border-[#213c14] rounded-3xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-extrabold text-white text-sm">Hourly Sales & Order Volume (IST)</h3>
                        <p className="text-[11px] text-[#8fa778]">Peak rushes at 1:00 PM lunch & 8:00 PM dinner</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#a8e83c] bg-[#1a3013] px-2.5 py-1 rounded-full">
                        Today's Trend
                      </span>
                    </div>

                    {/* Chart Bars */}
                    <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
                      {[
                        { hour: '10 AM', orders: 4, height: '30%', color: 'bg-[#294c1a]' },
                        { hour: '11 AM', orders: 9, height: '55%', color: 'bg-[#315b0b]' },
                        { hour: '12 PM', orders: 16, height: '85%', color: 'bg-[#a8e83c]' },
                        { hour: '01 PM', orders: 20, height: '100%', color: 'bg-[#a8e83c]' },
                        { hour: '02 PM', orders: 11, height: '60%', color: 'bg-[#315b0b]' },
                        { hour: '03 PM', orders: 5, height: '35%', color: 'bg-[#294c1a]' },
                        { hour: '04 PM', orders: 6, height: '40%', color: 'bg-[#294c1a]' },
                        { hour: '05 PM', orders: 8, height: '50%', color: 'bg-[#315b0b]' },
                        { hour: '06 PM', orders: 14, height: '75%', color: 'bg-[#315b0b]' },
                        { hour: '07 PM', orders: 18, height: '90%', color: 'bg-[#a8e83c]' },
                        { hour: '08 PM', orders: 19, height: '95%', color: 'bg-[#a8e83c]' },
                      ].map((bar, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                          <span className="text-[10px] font-bold text-[#a8e83c] opacity-0 group-hover:opacity-100 transition-opacity">
                            {bar.orders}
                          </span>
                          <div 
                            className={`w-full rounded-t-xl transition-all duration-300 group-hover:brightness-125 ${bar.color}`} 
                            style={{ height: bar.height }}
                          />
                          <span className="text-[9px] text-[#8fa778] font-mono tracking-tighter truncate">
                            {bar.hour.split(' ')[0]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Kitchen Feed (Most Recent Orders) */}
                  <div className="bg-[#12200d] border border-[#213c14] rounded-3xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                        <h3 className="font-extrabold text-white text-sm">Real-time Orders Pipeline</h3>
                      </div>
                      <button 
                        onClick={() => setActiveTab('orders')} 
                        className="text-xs font-bold text-[#a8e83c] hover:underline flex items-center space-x-1"
                      >
                        <span>View All ({allOrders.length})</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {allOrders.slice(0, 4).map(order => (
                        <div 
                          key={order.id} 
                          className="bg-[#172911] border border-[#233d15] rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#386022] transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-black text-white text-xs">#{order.id}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-[#224013] text-[#a8e83c]">
                                {order.status}
                              </span>
                              <span className="text-[10px] text-[#8fa778]">{order.date}</span>
                            </div>
                            <p className="text-xs font-bold text-white">
                              {order.customerName} <span className="text-[#8fa778] font-normal">• {order.items.join(', ')}</span>
                            </p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end space-x-3">
                            <span className="text-sm font-black text-[#a8e83c]">₹{parseFloat(order.total).toFixed(2)}</span>
                            
                            {order.status === 'Received' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'Preparing')}
                                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                              >
                                Prep
                              </button>
                            )}
                            {order.status === 'Preparing' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'Ready')}
                                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                              >
                                Ready
                              </button>
                            )}
                            {order.status === 'Ready' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'Delivering')}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                              >
                                Dispatch
                              </button>
                            )}
                            {order.status === 'Delivering' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'Delivered')}
                                className="px-3 py-1.5 rounded-xl bg-[#a8e83c] text-[#091106] font-black text-xs"
                              >
                                Complete
                              </button>
                            )}
                            {order.status === 'Delivered' && (
                              <span className="text-xs font-bold text-[#8fa778]">Fulfilled ✓</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Column: Widgets */}
                <div className="space-y-6">
                  
                  {/* Category Sales Distribution */}
                  <div className="bg-[#12200d] border border-[#213c14] rounded-3xl p-5 space-y-4 shadow-sm">
                    <h3 className="font-extrabold text-white text-sm">Category Revenue Mix</h3>
                    
                    <div className="space-y-3 text-xs">
                      {[
                        { cat: 'Superfood Bowls', percent: 52, amount: '₹12,480', color: 'bg-[#a8e83c]' },
                        { cat: 'Organic Salads', percent: 22, amount: '₹5,280', color: 'bg-emerald-400' },
                        { cat: 'Artisan Sandwiches', percent: 16, amount: '₹3,840', color: 'bg-amber-400' },
                        { cat: 'Cold-Pressed Juices', percent: 10, amount: '₹2,400', color: 'bg-purple-400' },
                      ].map((c, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between font-bold">
                            <span className="text-white">{c.cat}</span>
                            <span className="text-[#a8e83c]">{c.amount} ({c.percent}%)</span>
                          </div>
                          <div className="w-full h-2 bg-[#192c12] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.percent}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dining Tables Live Status Widget */}
                  <div className="bg-[#12200d] border border-[#213c14] rounded-3xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                        <QrCode size={16} className="text-[#a8e83c]" />
                        Dining Tables & Stands
                      </h3>
                      <button onClick={() => setActiveTab('tables')} className="text-xs font-bold text-[#a8e83c] hover:underline cursor-pointer">
                        View All
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {tables.slice(0, 5).map(t => (
                        <div key={t.id} className="p-3 bg-[#172911] rounded-2xl flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#203a15] text-[#a8e83c] flex items-center justify-center font-black text-xs">
                              #{t.number}
                            </div>
                            <div>
                              <span className="font-bold text-white text-xs block">Table {t.number}</span>
                              <span className="text-[10px] text-[#8fa778]">{t.section} • {t.capacity} Seats</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              t.status === 'Occupied' 
                                ? 'bg-amber-500/20 text-amber-300' 
                                : t.status === 'Reserved'
                                ? 'bg-indigo-500/20 text-indigo-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}>
                              {t.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Kitchen Announcements Box */}
                  <div className="bg-gradient-to-br from-[#1a3212] to-[#14270e] border border-[#2c4e1d] rounded-3xl p-5 space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-black text-[#a8e83c] uppercase">
                      <Sparkles size={14} />
                      <span>Kitchen Operational Notice</span>
                    </div>
                    <p className="text-xs text-[#c9e0b1]">
                      {restaurantSettings.announcement}
                    </p>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="text-xs font-bold text-white hover:underline pt-1 block"
                    >
                      Update Announcement →
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB: ORDERS KANBAN & EDIT */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Filter Bar & Search */}
              <div className="bg-[#12200d] border border-[#213c14] rounded-3xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3">
                {/* Order Status Chips */}
                <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
                  {['all', 'Received', 'Cooking in Kitchen', 'Ready to Serve', 'Served to Table', 'Completed', 'Cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => setOrderFilter(status)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                        orderFilter === status
                          ? 'bg-[#a8e83c] text-[#091106] font-black'
                          : 'bg-[#192c12] text-[#8fa778] hover:text-white'
                      }`}
                    >
                      {status === 'all' ? 'All Orders' : status}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8fa778]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search table #, customer, order ID..."
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-[#688053] focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>
              </div>

              {/* Orders Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-[#8fa778] bg-[#12200d] border border-[#213c14] rounded-3xl">
                    <UtensilsCrossed size={40} className="mx-auto text-[#3b5e23] mb-2" />
                    <p className="font-bold">No active table tickets found</p>
                    <p className="text-xs text-[#688053] mt-1">Orders scanned from table QR codes appear here in real-time</p>
                  </div>
                ) : (
                  filteredOrders.map(order => {
                    const statusColors = {
                      Received: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                      'Cooking in Kitchen': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
                      Preparing: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
                      'Ready to Serve': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
                      Ready: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
                      'Served to Table': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                      Served: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                      Delivered: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                      Completed: 'bg-stone-500/20 text-stone-300 border-stone-500/40',
                      Cancelled: 'bg-red-500/20 text-red-300 border-red-500/40',
                    };

                    return (
                      <div 
                        key={order.id} 
                        className="bg-[#12200d] border border-[#213c14] rounded-3xl p-5 space-y-4 hover:border-[#386022] transition-colors shadow-sm flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {/* Card Header with Table Badge */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="bg-[#a8e83c] text-[#091106] font-black px-2.5 py-1 rounded-xl text-xs tracking-tight shadow-xs">
                                TABLE #{order.tableNumber || '1'}
                              </span>
                              <div>
                                <span className="text-xs font-black text-white block">#{order.id.slice(-6)}</span>
                                <span className="text-[10px] text-[#8fa778] block font-medium">{order.date}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${statusColors[order.status] || 'bg-stone-800 text-stone-200'}`}>
                                {order.status}
                              </span>
                              <button
                                onClick={() => setPrintOrder(order)}
                                className="p-1.5 rounded-lg bg-[#192c12] hover:bg-[#254219] text-[#8fa778] hover:text-[#a8e83c] transition-colors"
                                title="Print Kitchen Order Ticket (KOT)"
                              >
                                <Printer size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingOrder({ ...order });
                                  setShowEditOrderModal(true);
                                }}
                                className="p-1.5 rounded-lg bg-[#192c12] hover:bg-[#254219] text-[#8fa778] hover:text-[#a8e83c] transition-colors"
                                title="Edit Order Details"
                              >
                                <Edit2 size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Table & Guest Info */}
                          <div className="bg-[#172911] rounded-2xl p-3 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between font-bold text-white">
                              <span>{order.customerName}</span>
                              <span className="text-[#a8e83c] font-mono">{order.customerPhone}</span>
                            </div>
                            <div className="flex items-center justify-between text-[#8fa778] text-[11px]">
                              <span>Dining Zone:</span>
                              <span className="font-bold text-white">{order.tableSection || 'Main Dining Hall'}</span>
                            </div>
                            {order.chefNotes && (
                              <div className="pt-1 border-t border-[#233d15] text-[11px] text-amber-300 flex items-start space-x-1 font-medium italic">
                                <Flame size={12} className="text-amber-400 shrink-0 mt-0.5" />
                                <span>Chef Note: {order.chefNotes}</span>
                              </div>
                            )}
                          </div>

                          {/* Items List */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8fa778]">Dishes in Ticket:</span>
                            <ul className="text-xs text-[#c9e0b1] space-y-0.5">
                              {order.items.map((item, idx) => (
                                <li key={idx} className="flex items-center space-x-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#a8e83c]"></span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Payment & Table info */}
                          <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1e3613]">
                            <div>
                              <span className="text-[10px] text-[#8fa778] block">Payment:</span>
                              <span className="font-bold text-white">{order.paymentMethod}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-[#8fa778] block">Bill Total:</span>
                              <span className="font-black text-[#a8e83c] text-sm">₹{parseFloat(order.total).toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Table Assignment Selector */}
                          <div className="pt-1">
                            <label className="text-[10px] font-bold uppercase text-[#8fa778] block mb-1">
                              Assigned Table:
                            </label>
                            <select
                              value={order.tableNumber || '1'}
                              onChange={(e) => assignTableToOrder(order.id, e.target.value)}
                              className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#a8e83c]"
                            >
                              {tables.map(t => (
                                <option key={t.id} value={t.number}>
                                  Table #{t.number} • {t.name} ({t.section})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Status Transition Action Buttons */}
                        <div className="pt-2 border-t border-[#1e3613] space-y-1.5">
                          <span className="text-[10px] font-bold text-[#8fa778] block">Kitchen Pipeline Actions:</span>
                          <div className="grid grid-cols-2 gap-1.5">
                            {order.status === 'Received' && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'Cooking in Kitchen')}
                                className="col-span-2 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center space-x-1"
                              >
                                <span>👨‍🍳 Start Cooking</span>
                              </button>
                            )}
                            {(order.status === 'Cooking in Kitchen' || order.status === 'Preparing') && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'Ready to Serve')}
                                className="col-span-2 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center space-x-1"
                              >
                                <span>🍽️ Plated & Ready to Serve</span>
                              </button>
                            )}
                            {(order.status === 'Ready to Serve' || order.status === 'Ready') && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'Served to Table')}
                                className="col-span-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center space-x-1"
                              >
                                <span>✅ Served to Table #{order.tableNumber || '1'}</span>
                              </button>
                            )}
                            {(order.status === 'Served to Table' || order.status === 'Delivered') && (
                              <button
                                onClick={() => updateOrderStatus(order.id, 'Completed')}
                                className="col-span-2 py-2 rounded-xl bg-[#a8e83c] hover:bg-white text-[#091106] font-black text-xs transition-colors shadow-sm flex items-center justify-center space-x-1"
                              >
                                <span>💵 Settle Bill & Free Table</span>
                              </button>
                            )}
                            {order.status === 'Completed' && (
                              <div className="col-span-2 py-2 text-center text-xs font-bold text-stone-400 bg-[#172911] rounded-xl">
                                Completed & Table Cleared ✓
                              </div>
                            )}
                            {order.status === 'Cancelled' && (
                              <div className="col-span-2 py-2 text-center text-xs font-bold text-red-300 bg-red-950/40 rounded-xl">
                                Cancelled ({order.cancelReason || 'Order Voided'})
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB: MENU & DISHES FULL EDITOR */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'menu' && (
            <div className="space-y-4">
              
              <div className="bg-[#12200d] border border-[#213c14] rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-white text-base">Menu & Inventory Catalog</h3>
                  <p className="text-xs text-[#8fa778]">Add new recipes, update price in ₹ INR, edit photos, and toggle stock availability</p>
                </div>

                <button
                  onClick={() => setShowAddDishModal(true)}
                  className="flex items-center space-x-1.5 bg-[#a8e83c] hover:bg-[#bcf856] text-[#091106] px-4 py-2.5 rounded-full font-black text-xs transition-all shadow-md shrink-0 active:scale-95"
                >
                  <Plus size={16} />
                  <span>Add New Dish</span>
                </button>
              </div>

              {/* Menu List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {menuItems.map(item => {
                  const itemPrice = parseFloat(item.price ?? item.menuPrice ?? 299) || 299;
                  return (
                    <div 
                      key={item.id} 
                      className="bg-[#12200d] border border-[#213c14] rounded-3xl overflow-hidden flex flex-col justify-between hover:border-[#3d6b24] transition-all shadow-lg group hover:shadow-[#a8e83c]/5"
                    >
                      {/* Image Container with Badges */}
                      <div className="relative w-full h-44 overflow-hidden bg-[#182d10]">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80';
                          }}
                        />
                        
                        {/* Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#12200d] via-transparent to-black/30 pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-auto">
                          <span className="text-[11px] bg-[#091106]/85 backdrop-blur-md text-[#a8e83c] px-2.5 py-1 rounded-full font-bold border border-[#a8e83c]/30 shadow-sm">
                            {item.category || 'Featured'}
                          </span>
                          <button
                            onClick={() => toggleMenuItemStock(item.id)}
                            className={`text-[11px] px-2.5 py-1 rounded-full font-black backdrop-blur-md shadow-sm transition-all active:scale-95 ${
                              item.inStock !== false
                                ? 'bg-emerald-500/90 text-white border border-emerald-400'
                                : 'bg-red-500/90 text-white border border-red-400'
                            }`}
                            title="Click to toggle availability"
                          >
                            {item.inStock !== false ? '● In Stock' : '✕ Sold Out'}
                          </button>
                        </div>

                        {/* Dietary Chips on Image */}
                        {item.dietary && item.dietary.length > 0 && (
                          <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 flex-wrap">
                            {item.dietary.slice(0, 2).map((d, i) => (
                              <span key={i} className="text-[10px] bg-[#091106]/80 text-[#d4f598] px-2 py-0.5 rounded-md backdrop-blur-sm font-medium border border-[#213c14]">
                                {d}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Details Body */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex items-baseline justify-between gap-2">
                            <h4 className="font-extrabold text-white text-base leading-snug line-clamp-1" title={item.name}>
                              {item.name}
                            </h4>
                            {item.calories && (
                              <span className="text-[10px] text-[#8fa778] shrink-0 font-medium">{item.calories} kcal</span>
                            )}
                          </div>

                          <p className="text-xs text-[#8fa778] line-clamp-2 leading-relaxed">
                            {item.description || item.tagline || 'Farm-fresh organic ingredients prepared with cold-pressed oils.'}
                          </p>
                        </div>

                        {/* Price & Actions Row */}
                        <div className="pt-3 border-t border-[#1e3613] flex items-center justify-between gap-2">
                          {quickPriceId === item.id ? (
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-[#a8e83c] font-bold">₹</span>
                              <input
                                type="number"
                                value={quickPriceInput}
                                onChange={(e) => setQuickPriceInput(e.target.value)}
                                className="w-20 bg-[#192c12] border border-[#a8e83c] rounded-lg px-2 py-1 text-xs text-white"
                                autoFocus
                              />
                              <button
                                onClick={() => {
                                  updateMenuItemPrice(item.id, quickPriceInput);
                                  setQuickPriceId(null);
                                }}
                                className="bg-[#a8e83c] text-[#091106] px-2 py-1 rounded-lg text-xs font-bold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setQuickPriceId(null)}
                                className="text-[#8fa778] hover:text-white px-1 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1.5">
                              <span className="font-black text-[#a8e83c] text-lg">
                                ₹{itemPrice.toFixed(2)}
                              </span>
                              <button
                                onClick={() => {
                                  setQuickPriceId(item.id);
                                  setQuickPriceInput(itemPrice.toString());
                                }}
                                className="text-[#8fa778] hover:text-[#a8e83c] p-1 rounded-md transition-colors"
                                title="Quick Price Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                            </div>
                          )}

                          <div className="flex items-center space-x-1.5">
                            <button
                              onClick={() => {
                                setEditingDish({ ...item, price: itemPrice });
                                setShowEditDishModal(true);
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-[#1b3113] hover:bg-[#28491d] text-white text-xs font-bold transition-colors flex items-center space-x-1.5 active:scale-95 border border-[#2d501b]"
                              title="Edit all fields of dish"
                            >
                              <Edit2 size={13} />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${item.name}" from menu?`)) {
                                  deleteMenuItem(item.id);
                                }
                              }}
                              className="p-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors border border-red-900/30"
                              title="Delete Dish"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB: RESTAURANT PROFILE & OPERATIONS SETTINGS */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="bg-[#12200d] border border-[#213c14] rounded-3xl p-6 space-y-6">
                <div>
                  <h3 className="font-extrabold text-white text-lg">Kitchen & Outlet Configuration</h3>
                  <p className="text-xs text-[#8fa778]">
                    Edit business parameters, opening hours, delivery fees, and emergency customer announcements
                  </p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  
                  {/* Basic Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[#8fa778] font-bold block mb-1">Outlet / Kitchen Name *</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.name}
                        onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                        className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#a8e83c]"
                      />
                    </div>

                    <div>
                      <label className="text-[#8fa778] font-bold block mb-1">Brand Tagline</label>
                      <input
                        type="text"
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#a8e83c]"
                      />
                    </div>
                  </div>

                  {/* Contact & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[#8fa778] font-bold block mb-1">Kitchen Phone Number *</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#a8e83c]"
                      />
                    </div>

                    <div>
                      <label className="text-[#8fa778] font-bold block mb-1">Kitchen Email *</label>
                      <input
                        type="email"
                        required
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#a8e83c]"
                      />
                    </div>

                    <div>
                      <label className="text-[#8fa778] font-bold block mb-1">City, State & Pincode</label>
                      <input
                        type="text"
                        value={settingsForm.city}
                        onChange={(e) => setSettingsForm({ ...settingsForm, city: e.target.value })}
                        className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#a8e83c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#8fa778] font-bold block mb-1">Full Physical Kitchen Address</label>
                    <input
                      type="text"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#a8e83c]"
                    />
                  </div>

                  {/* Operations & Pricing */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                    <div>
                      <label className="text-[#8fa778] font-bold block mb-1">Opening Time</label>
                      <input
                        type="text"
                        value={settingsForm.openTime}
                        onChange={(e) => setSettingsForm({ ...settingsForm, openTime: e.target.value })}
                        placeholder="08:00 AM"
                        className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                      />
                    </div>

                    <div>
                      <label className="text-[#8fa778] font-bold block mb-1">Closing Time</label>
                      <input
                        type="text"
                        value={settingsForm.closeTime}
                        onChange={(e) => setSettingsForm({ ...settingsForm, closeTime: e.target.value })}
                        placeholder="11:30 PM"
                        className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                      />
                    </div>

                    <div>
                      <label className="text-[#8fa778] font-bold block mb-1">Est. Prep Time (mins)</label>
                      <input
                        type="number"
                        value={settingsForm.prepTimeMinutes}
                        onChange={(e) => setSettingsForm({ ...settingsForm, prepTimeMinutes: parseInt(e.target.value) || 20 })}
                        className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                      />
                    </div>

                    <div>
                      <label className="text-[#8fa778] font-bold block mb-1">Delivery Radius (km)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={settingsForm.deliveryRadiusKm}
                        onChange={(e) => setSettingsForm({ ...settingsForm, deliveryRadiusKm: parseFloat(e.target.value) || 5 })}
                        className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                      />
                    </div>
                  </div>

                  {/* Delivery & Tax Parameters */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[#8fa778] font-bold block mb-1">Min Order Value (₹)</label>
                      <input
                        type="number"
                        value={settingsForm.minOrderValue}
                        onChange={(e) => setSettingsForm({ ...settingsForm, minOrderValue: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                      />
                    </div>

                    <div>
                      <label className="text-[#8fa778] font-bold block mb-1">Delivery Charge (₹)</label>
                      <input
                        type="number"
                        value={settingsForm.deliveryFee}
                        onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFee: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                      />
                    </div>

                    <div>
                      <label className="text-[#8fa778] font-bold block mb-1">Free Delivery Above (₹)</label>
                      <input
                        type="number"
                        value={settingsForm.freeDeliveryThreshold}
                        onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                      />
                    </div>

                    <div>
                      <label className="text-[#8fa778] font-bold block mb-1">GST Tax Rate (%)</label>
                      <input
                        type="number"
                        value={settingsForm.taxRatePercent}
                        onChange={(e) => setSettingsForm({ ...settingsForm, taxRatePercent: parseFloat(e.target.value) || 5 })}
                        className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                      />
                    </div>
                  </div>

                  {/* Emergency Customer Alert Announcement */}
                  <div>
                    <label className="text-[#8fa778] font-bold block mb-1">
                      Customer Alert / Announcement Banner (Shows across store)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.announcement}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                      className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#a8e83c]"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setSettingsForm(restaurantSettings)}
                      className="px-5 py-2.5 rounded-xl bg-[#192c12] text-[#8fa778] hover:text-white font-bold"
                    >
                      Discard Changes
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#a8e83c] hover:bg-[#bcf856] text-[#091106] font-black shadow-lg"
                    >
                      Save Kitchen Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB: DINING TABLES & QR CODES */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'tables' && (
            <div className="space-y-6">
              {/* Header card with Action buttons */}
              <div className="bg-[#12200d] border border-[#213c14] rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <div className="w-10 h-10 rounded-2xl bg-[#192c12] border border-[#2c4c1a] text-[#a8e83c] flex items-center justify-center">
                      <QrCode size={22} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-lg flex items-center gap-2">
                        Dining Tables & Menu QR Codes
                        <span className="text-xs bg-[#a8e83c]/20 text-[#a8e83c] border border-[#a8e83c]/30 px-2.5 py-0.5 rounded-full font-bold">
                          Dine-In System
                        </span>
                      </h3>
                      <p className="text-xs text-[#8fa778]">
                        Customers scan table QR with phone camera to instantly browse menu & place orders to kitchen
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <button
                    onClick={() => setShowAddTableModal(true)}
                    className="flex-1 md:flex-initial flex items-center justify-center space-x-2 bg-[#a8e83c] hover:bg-[#bcf856] text-[#091106] px-5 py-3 rounded-2xl font-black text-xs transition-all shadow-lg active:scale-95"
                  >
                    <Plus size={16} />
                    <span>Add New Dining Table</span>
                  </button>
                </div>
              </div>

              {/* Quick KPI stats bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#12200d] border border-[#213c14] rounded-2xl p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#192c12] text-[#a8e83c] flex items-center justify-center font-black text-base">
                    {tables.length}
                  </div>
                  <div>
                    <div className="text-[11px] text-[#8fa778] font-bold">TOTAL TABLES</div>
                    <div className="text-sm font-extrabold text-white">{tables.length} Active Stands</div>
                  </div>
                </div>

                <div className="bg-[#12200d] border border-[#213c14] rounded-2xl p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-base">
                    {tables.filter(t => t.status === 'Occupied').length}
                  </div>
                  <div>
                    <div className="text-[11px] text-[#8fa778] font-bold">OCCUPIED / SEATED</div>
                    <div className="text-sm font-extrabold text-amber-400">
                      {tables.filter(t => t.status === 'Occupied').length} Tables Dining
                    </div>
                  </div>
                </div>

                <div className="bg-[#12200d] border border-[#213c14] rounded-2xl p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-base">
                    {tables.filter(t => t.status === 'Available').length}
                  </div>
                  <div>
                    <div className="text-[11px] text-[#8fa778] font-bold">AVAILABLE NOW</div>
                    <div className="text-sm font-extrabold text-emerald-400">
                      {tables.filter(t => t.status === 'Available').length} Ready for Guests
                    </div>
                  </div>
                </div>

                <div className="bg-[#12200d] border border-[#213c14] rounded-2xl p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-black text-base">
                    {tables.filter(t => t.status === 'Reserved').length}
                  </div>
                  <div>
                    <div className="text-[11px] text-[#8fa778] font-bold">RESERVED</div>
                    <div className="text-sm font-extrabold text-indigo-400">
                      {tables.filter(t => t.status === 'Reserved').length} Bookings
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Filter Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
                {['all', 'Main Dining Hall', 'Garden Patio', 'VIP Lounge', 'Rooftop Terrace'].map(sec => (
                  <button
                    key={sec}
                    onClick={() => setTableSectionFilter(sec)}
                    className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                      tableSectionFilter === sec
                        ? 'bg-[#a8e83c] text-[#091106] shadow-md font-black'
                        : 'bg-[#12200d] text-[#8fa778] hover:text-white border border-[#213c14]'
                    }`}
                  >
                    {sec === 'all' ? 'All Sections' : sec}
                  </button>
                ))}
              </div>

              {/* Table Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {tables
                  .filter(t => tableSectionFilter === 'all' || t.section === tableSectionFilter)
                  .map(table => {
                    const qrUrl = getTableQrUrl(table.number);
                    const statusColors = {
                      Available: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                      Occupied: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                      Reserved: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
                      Cleaning: 'bg-stone-500/15 text-stone-300 border-stone-500/30'
                    };

                    return (
                      <div 
                        key={table.id}
                        className="bg-[#12200d] border border-[#213c14] rounded-3xl p-5 flex flex-col justify-between hover:border-[#a8e83c]/40 transition-all shadow-lg group"
                      >
                        <div>
                          {/* Table Top Header */}
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xl font-black text-white">Table #{table.number}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#192c12] text-[#8fa778] border border-[#2c4c1a] font-bold">
                                  👥 {table.capacity} Seats
                                </span>
                              </div>
                              <div className="text-xs text-[#8fa778] font-medium mt-0.5">
                                {table.section}
                              </div>
                            </div>

                            {/* Status Selector Dropdown */}
                            <select
                              value={table.status}
                              onChange={(e) => updateTableStatus(table.id, e.target.value)}
                              className={`text-[11px] px-2.5 py-1 rounded-xl font-black border focus:outline-none cursor-pointer ${
                                statusColors[table.status] || statusColors.Available
                              }`}
                            >
                              <option value="Available" className="bg-[#12200d] text-emerald-300">● Available</option>
                              <option value="Occupied" className="bg-[#12200d] text-amber-300">● Occupied</option>
                              <option value="Reserved" className="bg-[#12200d] text-indigo-300">● Reserved</option>
                              <option value="Cleaning" className="bg-[#12200d] text-stone-300">● Cleaning</option>
                            </select>
                          </div>

                          {/* Center QR Display */}
                          <div className="bg-[#0b1408] rounded-2xl p-4 my-3 flex flex-col items-center justify-center border border-[#1a3013]">
                            <TableQRCodeImage url={qrUrl} size={150} />
                            <div className="mt-3 text-center">
                              <span className="text-[10px] text-[#8fa778] font-mono block truncate max-w-[200px]" title={qrUrl}>
                                {qrUrl}
                              </span>
                              <span className="text-[11px] font-bold text-[#a8e83c] mt-0.5 block">
                                Point camera to open Menu
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="space-y-2 pt-2 border-t border-[#1a3013]">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => setSelectedTableForPrint(table)}
                              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-[#192c12] hover:bg-[#254219] text-[#a8e83c] font-black text-xs transition-colors cursor-pointer"
                              title="Print Table Tent Stand"
                            >
                              <Printer size={13} />
                              <span>Print Stand</span>
                            </button>

                            <button
                              onClick={() => downloadTableQr(table.number, qrUrl)}
                              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-[#192c12] hover:bg-[#254219] text-white font-bold text-xs transition-colors cursor-pointer"
                              title="Download QR Image"
                            >
                              <Download size={13} />
                              <span>PNG QR</span>
                            </button>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => window.open(qrUrl, '_blank')}
                              className="flex-1 flex items-center justify-center space-x-1 py-2 px-2.5 rounded-xl bg-[#15250f] hover:bg-[#1f3716] text-[#8fa778] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <ExternalLink size={12} />
                              <span>Test Menu Link</span>
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Delete Table #${table.number}?`)) {
                                  deleteTable(table.id);
                                }
                              }}
                              className="p-2 rounded-xl bg-red-950/30 hover:bg-red-900/60 text-red-400 transition-colors cursor-pointer"
                              title="Delete Table"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB: CUSTOMER CRM */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="bg-[#12200d] border border-[#213c14] rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-white text-base">Customer Database & CRM</h3>
                  <p className="text-xs text-[#8fa778]">Manage accounts, delivery addresses, loyalty tier, and points</p>
                </div>

                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="flex items-center space-x-1.5 bg-[#a8e83c] hover:bg-[#bcf856] text-[#091106] px-4 py-2.5 rounded-full font-black text-xs transition-all shadow-md shrink-0 active:scale-95"
                >
                  <UserPlus size={16} />
                  <span>Add Customer</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {allUsers.map(user => (
                  <div key={user.id} className="bg-[#12200d] border border-[#213c14] rounded-3xl p-4 space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-11 h-11 rounded-full object-cover border-2 border-[#a8e83c]" 
                        />
                        <div>
                          <h4 className="font-bold text-white text-sm">{user.name}</h4>
                          <span className="text-[10px] bg-[#1a3013] text-[#a8e83c] px-2 py-0.5 rounded-full font-bold">
                            {user.tier}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-[#8fa778] bg-[#172911] p-2.5 rounded-2xl">
                        <p className="truncate text-white font-mono text-[11px]">{user.email}</p>
                        <p className="text-[11px]">{user.phone}</p>
                        <p className="text-[11px] truncate">{user.address}</p>
                        <div className="pt-1 flex items-center justify-between text-[11px]">
                          <span className="text-[#a8e83c] font-bold">{user.points} PTS</span>
                          <span className="text-stone-300">{user.dietary}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center space-x-2 border-t border-[#1e3613]">
                      <button
                        onClick={() => {
                          setEditingUser({ ...user });
                          setShowEditUserModal(true);
                        }}
                        className="flex-1 py-1.5 rounded-xl bg-[#192c12] hover:bg-[#254219] text-white text-xs font-bold transition-colors flex items-center justify-center space-x-1"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>

                      {user.id !== 'usr-ind-01' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete customer ${user.name}?`)) {
                              deleteUser(user.id);
                            }
                          }}
                          className="p-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB: PROMO COUPONS & OFFERS */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="bg-[#12200d] border border-[#213c14] rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-white text-base">Promotional Coupons & Deals Engine</h3>
                  <p className="text-xs text-[#8fa778]">Create discount codes, configure minimum order rules, and toggle active status</p>
                </div>

                <button
                  onClick={() => setShowAddCouponModal(true)}
                  className="flex items-center space-x-1.5 bg-[#a8e83c] hover:bg-[#bcf856] text-[#091106] px-4 py-2.5 rounded-full font-black text-xs transition-all shadow-md shrink-0 active:scale-95"
                >
                  <Plus size={16} />
                  <span>Create New Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {coupons.map(coupon => (
                  <div key={coupon.code} className="bg-[#12200d] border border-[#213c14] rounded-3xl p-5 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-white text-base bg-[#192c12] px-3 py-1 rounded-xl border border-[#2c4c1a]">
                            {coupon.code}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => toggleCoupon(coupon.code)}
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-black ${
                            coupon.active
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-stone-700 text-stone-300'
                          }`}
                        >
                          {coupon.active ? 'Active' : 'Paused'}
                        </button>
                      </div>

                      <p className="text-xs text-[#c9e0b1] font-medium">{coupon.desc}</p>

                    <div className="bg-[#172911] rounded-2xl p-3 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#8fa778]">Discount:</span>
                        <span className="font-bold text-[#a8e83c]">
                          {coupon.type === 'percent' ? `${coupon.value}% OFF` : `₹${coupon.value} Flat OFF`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#8fa778]">Min Order Required:</span>
                        <span className="font-bold text-white">₹{coupon.minOrder}</span>
                      </div>
                      {coupon.type === 'percent' && coupon.maxDiscount && (
                        <div className="flex items-center justify-between">
                          <span className="text-[#8fa778]">Max Discount Limit:</span>
                          <span className="font-bold text-white">₹{coupon.maxDiscount}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center space-x-2 border-t border-[#1e3613]">
                    <button
                      onClick={() => {
                        setEditingCoupon({ ...coupon });
                        setShowEditCouponModal(true);
                      }}
                      className="flex-1 py-2 rounded-xl bg-[#192c12] hover:bg-[#254219] text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1"
                    >
                      <Edit2 size={12} />
                      <span>Edit Coupon</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete coupon code ${coupon.code}?`)) {
                          deleteCoupon(coupon.code);
                        }
                      }}
                      className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB: ANALYTICS & INSIGHTS */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="bg-[#12200d] border border-[#213c14] rounded-3xl p-6 space-y-6">
              <h3 className="font-extrabold text-white text-lg">Sales Velocity & Operations Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#172911] p-4 rounded-2xl space-y-1 border border-[#213c14]">
                  <span className="text-xs text-[#8fa778]">Average Order Value (AOV)</span>
                  <div className="text-2xl font-black text-white">
                    ₹{(totalRevenue / (allOrders.length || 1)).toFixed(2)}
                  </div>
                </div>

                <div className="bg-[#172911] p-4 rounded-2xl space-y-1 border border-[#213c14]">
                  <span className="text-xs text-[#8fa778]">Preferred Payment Method</span>
                  <div className="text-2xl font-black text-[#a8e83c]">UPI (Google Pay / PhonePe)</div>
                </div>

                <div className="bg-[#172911] p-4 rounded-2xl space-y-1 border border-[#213c14]">
                  <span className="text-xs text-[#8fa778]">On-Time Kitchen Dispatch</span>
                  <div className="text-2xl font-black text-emerald-400">98.4% On Schedule</div>
                </div>
              </div>

              {/* Popular Items Breakdown */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8fa778]">Top Performing Dishes Today</span>
                <div className="space-y-2">
                  {[
                    { name: 'Green Veggie Bowl', orders: 48, revenue: 11952, percent: 85 },
                    { name: 'Rainbow Veggie Quinoa Power Bowl', orders: 36, revenue: 10764, percent: 65 },
                    { name: 'Golden Sesame Crispy Tofu Bowl', orders: 29, revenue: 8381, percent: 50 },
                    { name: 'Detox Cold-Pressed Green Juice', orders: 22, revenue: 3278, percent: 38 },
                  ].map((dish, idx) => (
                    <div key={idx} className="bg-[#172911] p-3 rounded-2xl space-y-1.5 border border-[#213c14]">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-white">{dish.name}</span>
                        <span className="text-[#a8e83c]">₹{dish.revenue.toLocaleString()} ({dish.orders} orders)</span>
                      </div>
                      <div className="w-full h-2 bg-[#091106] rounded-full overflow-hidden">
                        <div className="h-full bg-[#a8e83c] rounded-full" style={{ width: `${dish.percent}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
      </div>

      {/* ==================================================== */}
      {/* MODAL 1: ADD NEW DISH */}
      {/* ==================================================== */}
      {showAddDishModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#12200d] border border-[#2c4c1a] rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl animate-scale max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base">Add New Kitchen Dish</h3>
              <button onClick={() => setShowAddDishModal(false)} className="text-[#8fa778] hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-3 text-xs">
              <div>
                <label className="text-[#8fa778] block mb-1 font-bold">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={newDishForm.name}
                  onChange={(e) => setNewDishForm({ ...newDishForm, name: e.target.value })}
                  placeholder="e.g. Mumbai Masala Spiced Paneer Bowl"
                  className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Price in ₹ INR *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={newDishForm.price}
                    onChange={(e) => setNewDishForm({ ...newDishForm, price: e.target.value })}
                    placeholder="349.00"
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Calories (kcal)</label>
                  <input
                    type="number"
                    value={newDishForm.calories}
                    onChange={(e) => setNewDishForm({ ...newDishForm, calories: e.target.value })}
                    placeholder="420"
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Category</label>
                  <select
                    value={newDishForm.category}
                    onChange={(e) => setNewDishForm({ ...newDishForm, category: e.target.value })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  >
                    <option value="Bowls">Bowls</option>
                    <option value="Salads">Salads</option>
                    <option value="Sandwiches">Sandwiches</option>
                    <option value="Warm Bowls">Warm Bowls</option>
                    <option value="Juices & Smoothies">Juices & Smoothies</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Preparation Time</label>
                  <input
                    type="text"
                    value={newDishForm.prepTime}
                    onChange={(e) => setNewDishForm({ ...newDishForm, prepTime: e.target.value })}
                    placeholder="15-20 min"
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#8fa778] block mb-1 font-bold">Image URL</label>
                <input
                  type="url"
                  value={newDishForm.image}
                  onChange={(e) => setNewDishForm({ ...newDishForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                />
              </div>

              <div>
                <label className="text-[#8fa778] block mb-1 font-bold">Description</label>
                <textarea
                  rows={2}
                  value={newDishForm.description}
                  onChange={(e) => setNewDishForm({ ...newDishForm, description: e.target.value })}
                  placeholder="Fresh organic ingredients with chef special dressing..."
                  className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddDishModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#192c12] text-[#8fa778] hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#a8e83c] hover:bg-[#bcf856] text-[#091106] font-black"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 2: EDIT EXISTING DISH */}
      {/* ==================================================== */}
      {showEditDishModal && editingDish && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#12200d] border border-[#2c4c1a] rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl animate-scale max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base">Edit Dish: {editingDish.name}</h3>
              <button onClick={() => setShowEditDishModal(false)} className="text-[#8fa778] hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditDish} className="space-y-3 text-xs">
              <div>
                <label className="text-[#8fa778] block mb-1 font-bold">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={editingDish.name}
                  onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                  className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Price in ₹ INR *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={editingDish.price}
                    onChange={(e) => setEditingDish({ ...editingDish, price: e.target.value })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Calories (kcal)</label>
                  <input
                    type="number"
                    value={editingDish.calories}
                    onChange={(e) => setEditingDish({ ...editingDish, calories: e.target.value })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Category</label>
                  <select
                    value={editingDish.category}
                    onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  >
                    <option value="Bowls">Bowls</option>
                    <option value="Salads">Salads</option>
                    <option value="Sandwiches">Sandwiches</option>
                    <option value="Warm Bowls">Warm Bowls</option>
                    <option value="Juices & Smoothies">Juices & Smoothies</option>
                    <option value="Featured">Featured</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Spice Level (1-4)</label>
                  <select
                    value={editingDish.spiceLevel || 1}
                    onChange={(e) => setEditingDish({ ...editingDish, spiceLevel: parseInt(e.target.value) })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  >
                    <option value={1}>Mild (1)</option>
                    <option value={2}>Medium (2)</option>
                    <option value={3}>Spicy (3)</option>
                    <option value={4}>Extra Hot (4)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#8fa778] block mb-1 font-bold">Image URL</label>
                <input
                  type="text"
                  value={editingDish.image}
                  onChange={(e) => setEditingDish({ ...editingDish, image: e.target.value })}
                  className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                />
              </div>

              <div>
                <label className="text-[#8fa778] block mb-1 font-bold">Description</label>
                <textarea
                  rows={2}
                  value={editingDish.description}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditDishModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#192c12] text-[#8fa778] hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#a8e83c] hover:bg-[#bcf856] text-[#091106] font-black"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 3: EDIT ORDER DETAILS */}
      {/* ==================================================== */}
      {showEditOrderModal && editingOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#12200d] border border-[#2c4c1a] rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl animate-scale">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base">Edit Order #{editingOrder.id}</h3>
              <button onClick={() => setShowEditOrderModal(false)} className="text-[#8fa778] hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditOrder} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={editingOrder.customerName}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customerName: e.target.value })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Phone Number</label>
                  <input
                    type="text"
                    value={editingOrder.customerPhone}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customerPhone: e.target.value })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Assigned Table *</label>
                  <select
                    value={editingOrder.tableNumber || '1'}
                    onChange={(e) => setEditingOrder({ ...editingOrder, tableNumber: e.target.value })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[#a8e83c]"
                  >
                    {tables.map(t => (
                      <option key={t.id} value={t.number}>Table #{t.number} ({t.section})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Total Amount in ₹ INR</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingOrder.total}
                    onChange={(e) => setEditingOrder({ ...editingOrder, total: e.target.value })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#8fa778] block mb-1 font-bold">Chef Special Cooking Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Extra spicy, no onions, well-done roast"
                  value={editingOrder.chefNotes || editingOrder.deliveryNotes || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, chefNotes: e.target.value, deliveryNotes: e.target.value })}
                  className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Cancel order #${editingOrder.id}?`)) {
                      cancelOrder(editingOrder.id);
                      setShowEditOrderModal(false);
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 font-bold"
                >
                  Cancel Order
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEditOrderModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#192c12] text-[#8fa778] hover:text-white font-bold"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#a8e83c] hover:bg-[#bcf856] text-[#091106] font-black"
                  >
                    Save Order
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 4: PRINT KITCHEN ORDER TICKET (KOT) */}
      {/* ==================================================== */}
      {printOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-stone-900 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl animate-scale font-mono text-xs">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div>
                <h4 className="font-black text-sm uppercase">KITCHEN ORDER TICKET (KOT)</h4>
                <p className="text-[10px] text-stone-500">{restaurantSettings.name}</p>
              </div>
              <button onClick={() => setPrintOrder(null)} className="text-stone-400 hover:text-stone-800">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between items-center bg-stone-100 p-2 rounded-xl border border-stone-300">
                <span className="font-black text-sm uppercase text-stone-900">TABLE #{printOrder.tableNumber || '1'}</span>
                <span className="text-[10px] bg-stone-900 text-white px-2 py-0.5 rounded-full font-bold">DINE-IN</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Ticket #: <b>{printOrder.id}</b></span>
                <span>{printOrder.date}</span>
              </div>
              <div>Guest: <b>{printOrder.customerName}</b> ({printOrder.customerPhone})</div>
              <div>Dining Zone: <b>{printOrder.tableSection || 'Main Dining Hall'}</b></div>
              {(printOrder.chefNotes || printOrder.deliveryNotes) && (
                <div className="bg-amber-100 p-1.5 rounded-lg text-amber-950 font-bold mt-1 text-[11px]">
                  CHEF NOTE: {printOrder.chefNotes || printOrder.deliveryNotes}
                </div>
              )}
            </div>

            <div className="border-t border-b border-dashed border-stone-400 py-2 space-y-1">
              <span className="font-bold uppercase text-[10px] text-stone-500">KITCHEN PREP ITEMS:</span>
              {printOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between font-bold text-xs">
                  <span>1x {item}</span>
                  <span className="text-emerald-700 font-mono">[COOK]</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-xs font-bold pt-1">
              <span>TABLE BILL TOTAL:</span>
              <span className="text-sm font-black">₹{parseFloat(printOrder.total).toFixed(2)}</span>
            </div>

            <div className="pt-2 text-center text-[10px] text-stone-500 border-t border-stone-200">
              Kitchen Dispatch: Table #{printOrder.tableNumber || '1'} • Expeditor Desk
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                  setPrintOrder(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-stone-900 text-white font-black text-xs hover:bg-stone-800 flex items-center justify-center space-x-1"
              >
                <Printer size={13} />
                <span>Print Chit</span>
              </button>
              <button
                onClick={() => setPrintOrder(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: PRINTABLE TABLE TENT QR STAND */}
      {/* ==================================================== */}
      {selectedTableForPrint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#12200d] border border-[#2c4c1a] rounded-3xl p-6 w-full max-w-lg space-y-6 shadow-2xl animate-scale my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#213c14]">
              <div>
                <h3 className="font-extrabold text-white text-lg">Table Tent QR Stand</h3>
                <p className="text-xs text-[#8fa778]">Ready-to-print acrylic stand card for dining tables</p>
              </div>
              <button 
                onClick={() => setSelectedTableForPrint(null)}
                className="w-8 h-8 rounded-full bg-[#192c12] text-[#8fa778] hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Printable Preview Container */}
            <div 
              id="printable-table-tent" 
              className="bg-[#091106] border-2 border-[#a8e83c] rounded-3xl p-8 text-center space-y-5 shadow-2xl relative overflow-hidden"
            >
              {/* Corner decor */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#a8e83c]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Restaurant Branding */}
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 bg-[#12200d] border border-[#213c14] px-3.5 py-1 rounded-full text-xs text-[#a8e83c] font-black tracking-wider uppercase">
                  <Flame size={13} className="text-[#a8e83c]" />
                  <span>Grillix Smokehouse</span>
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">SCAN TO DINE & ORDER</h2>
                <p className="text-xs text-[#8fa778]">Freshly grilled dishes served straight to your table</p>
              </div>

              {/* Table Number Spotlight */}
              <div className="bg-[#12200d] border border-[#2c4c1a] rounded-2xl py-3 px-6 inline-block mx-auto shadow-inner">
                <div className="text-xs font-bold text-[#8fa778] tracking-widest uppercase">YOUR TABLE</div>
                <div className="text-4xl font-black text-[#a8e83c] tracking-tight">
                  TABLE #{selectedTableForPrint.number}
                </div>
                <div className="text-xs text-stone-300 font-semibold mt-0.5">
                  {selectedTableForPrint.section} • Capacity {selectedTableForPrint.capacity} Guests
                </div>
              </div>

              {/* Big High-Res QR Code */}
              <div className="flex justify-center py-2">
                <div className="bg-white p-4 rounded-3xl shadow-2xl border-4 border-[#a8e83c]">
                  <TableQRCodeImage 
                    url={getTableQrUrl(selectedTableForPrint.number)} 
                    size={200} 
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-[#12200d]/80 rounded-2xl p-4 text-xs space-y-2 text-left border border-[#213c14]">
                <div className="font-black text-white text-center text-xs uppercase tracking-wider mb-2">
                  How to Order in 3 Easy Steps:
                </div>
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#a8e83c] text-[#091106] font-black text-[11px] flex items-center justify-center shrink-0">1</span>
                  <span className="text-[#b5caa4]">Open your phone camera & aim at the QR code above.</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#a8e83c] text-[#091106] font-black text-[11px] flex items-center justify-center shrink-0">2</span>
                  <span className="text-[#b5caa4]">Browse digital menu, customize cooking spice & add dishes.</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#a8e83c] text-[#091106] font-black text-[11px] flex items-center justify-center shrink-0">3</span>
                  <span className="text-[#b5caa4]">Tap <strong>"Send Order to Kitchen"</strong>. Food is brought to your table!</span>
                </div>
              </div>

              {/* Table Wi-Fi Info */}
              <div className="pt-2 text-[11px] text-[#8fa778] flex items-center justify-center space-x-4">
                <span>📶 <strong>Free Guest Wi-Fi:</strong> Grillix_Guest</span>
                <span>🔑 <strong>Password:</strong> smokegrill</span>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTableForPrint(null)}
                className="px-5 py-2.5 rounded-xl bg-[#192c12] text-[#8fa778] hover:text-white font-bold text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => downloadTableQr(selectedTableForPrint.number, getTableQrUrl(selectedTableForPrint.number))}
                className="px-5 py-2.5 rounded-xl bg-[#1f3816] hover:bg-[#2b4c1f] text-white font-bold text-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Download size={14} />
                <span>Download PNG</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-[#a8e83c] hover:bg-[#bcf856] text-[#091106] font-black text-xs flex items-center space-x-1.5 shadow-lg cursor-pointer"
              >
                <Printer size={14} />
                <span>Print Table Tent Stand</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD NEW DINING TABLE */}
      {/* ==================================================== */}
      {showAddTableModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#12200d] border border-[#2c4c1a] rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-scale">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-white text-base">Add New Dining Table</h3>
                <p className="text-xs text-[#8fa778]">Assign table number, dining section, and seating capacity</p>
              </div>
              <button onClick={() => setShowAddTableModal(false)} className="text-[#8fa778] hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddTable} className="space-y-4 text-xs">
              <div>
                <label className="text-[#8fa778] block mb-1 font-bold">Table Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9 or VIP-2"
                  value={newTableForm.number}
                  onChange={(e) => setNewTableForm({ ...newTableForm, number: e.target.value })}
                  className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-[#a8e83c]"
                />
              </div>

              <div>
                <label className="text-[#8fa778] block mb-1 font-bold">Table Label / Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Window Corner Booth"
                  value={newTableForm.name}
                  onChange={(e) => setNewTableForm({ ...newTableForm, name: e.target.value })}
                  className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#a8e83c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Dining Section</label>
                  <select
                    value={newTableForm.section}
                    onChange={(e) => setNewTableForm({ ...newTableForm, section: e.target.value })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#a8e83c]"
                  >
                    <option value="Main Dining Hall">Main Dining Hall</option>
                    <option value="Garden Patio">Garden Patio</option>
                    <option value="VIP Lounge">VIP Lounge</option>
                    <option value="Rooftop Terrace">Rooftop Terrace</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Seating Capacity (Guests)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newTableForm.capacity}
                    onChange={(e) => setNewTableForm({ ...newTableForm, capacity: parseInt(e.target.value) || 2 })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-[#1a3013]">
                <button
                  type="button"
                  onClick={() => setShowAddTableModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#192c12] text-[#8fa778] hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#a8e83c] hover:bg-[#bcf856] text-[#091106] font-black shadow-lg cursor-pointer"
                >
                  Create Table & QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 6: ADD / EDIT CUSTOMER */}
      {/* ==================================================== */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#12200d] border border-[#2c4c1a] rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-scale">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base">Register Customer Account</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-[#8fa778] hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="text-[#8fa778] block mb-1 font-bold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  placeholder="e.g. Sneha Kulkarni"
                  className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Email *</label>
                  <input
                    type="email"
                    required
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="sneha@example.com"
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Phone</label>
                  <input
                    type="tel"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    placeholder="+91 98200 55667"
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#8fa778] block mb-1 font-bold">City / Location</label>
                <input
                  type="text"
                  value={newUserForm.city}
                  onChange={(e) => setNewUserForm({ ...newUserForm, city: e.target.value })}
                  className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                />
              </div>

              <div>
                <label className="text-[#8fa778] block mb-1 font-bold">Delivery Address</label>
                <input
                  type="text"
                  value={newUserForm.address}
                  onChange={(e) => setNewUserForm({ ...newUserForm, address: e.target.value })}
                  placeholder="Flat 502, Green Meadows, Bandra"
                  className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#192c12] text-[#8fa778] hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#a8e83c] hover:bg-[#bcf856] text-[#091106] font-black"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#12200d] border border-[#2c4c1a] rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-scale">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base">Edit Customer: {editingUser.name}</h3>
              <button onClick={() => setShowEditUserModal(false)} className="text-[#8fa778] hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3 text-xs">
              <div>
                <label className="text-[#8fa778] block mb-1 font-bold">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Email *</label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Phone</label>
                  <input
                    type="tel"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#8fa778] block mb-1 font-bold">Address</label>
                <input
                  type="text"
                  value={editingUser.address}
                  onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                  className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Loyalty Points</label>
                  <input
                    type="number"
                    value={editingUser.points}
                    onChange={(e) => setEditingUser({ ...editingUser, points: e.target.value })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>

                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Loyalty Tier</label>
                  <select
                    value={editingUser.tier}
                    onChange={(e) => setEditingUser({ ...editingUser, tier: e.target.value })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  >
                    <option value="Bronze Tier">Bronze Tier</option>
                    <option value="Silver Tier">Silver Tier</option>
                    <option value="Gold Pioneer">Gold Pioneer</option>
                    <option value="Green Pioneer">Green Pioneer</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#192c12] text-[#8fa778] hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#a8e83c] hover:bg-[#bcf856] text-[#091106] font-black"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 7: ADD / EDIT COUPON */}
      {/* ==================================================== */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#12200d] border border-[#2c4c1a] rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-scale">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base">Create Discount Coupon</h3>
              <button onClick={() => setShowAddCouponModal(false)} className="text-[#8fa778] hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCoupon} className="space-y-3 text-xs">
              <div>
                <label className="text-[#8fa778] block mb-1 font-bold">Coupon Promo Code *</label>
                <input
                  type="text"
                  required
                  value={newCouponForm.code}
                  onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. MONSOON20"
                  className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-[#a8e83c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Discount Type</label>
                  <select
                    value={newCouponForm.type}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, type: e.target.value })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  >
                    <option value="flat">Flat ₹ INR OFF</option>
                    <option value="percent">Percentage % OFF</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={newCouponForm.value}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, value: e.target.value })}
                    placeholder="50"
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Min Order Cart (₹)</label>
                  <input
                    type="number"
                    value={newCouponForm.minOrder}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, minOrder: e.target.value })}
                    placeholder="299"
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>

                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Max Cap (₹, for % type)</label>
                  <input
                    type="number"
                    value={newCouponForm.maxDiscount}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, maxDiscount: e.target.value })}
                    placeholder="100"
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#8fa778] block mb-1 font-bold">Display Description</label>
                <input
                  type="text"
                  value={newCouponForm.desc}
                  onChange={(e) => setNewCouponForm({ ...newCouponForm, desc: e.target.value })}
                  placeholder="Flat ₹50 OFF on orders above ₹299"
                  className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddCouponModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#192c12] text-[#8fa778] hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#a8e83c] hover:bg-[#bcf856] text-[#091106] font-black"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditCouponModal && editingCoupon && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#12200d] border border-[#2c4c1a] rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-scale">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base">Edit Coupon: {editingCoupon.code}</h3>
              <button onClick={() => setShowEditCouponModal(false)} className="text-[#8fa778] hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditCoupon} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Discount Type</label>
                  <select
                    value={editingCoupon.type}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, type: e.target.value })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  >
                    <option value="flat">Flat ₹ INR OFF</option>
                    <option value="percent">Percentage % OFF</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={editingCoupon.value}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, value: e.target.value })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Min Order Cart (₹)</label>
                  <input
                    type="number"
                    value={editingCoupon.minOrder}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrder: e.target.value })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>

                <div>
                  <label className="text-[#8fa778] block mb-1 font-bold">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={editingCoupon.maxDiscount || 100}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, maxDiscount: e.target.value })}
                    className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#8fa778] block mb-1 font-bold">Description</label>
                <input
                  type="text"
                  value={editingCoupon.desc}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, desc: e.target.value })}
                  className="w-full bg-[#192c12] border border-[#2c4c1a] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#a8e83c]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditCouponModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#192c12] text-[#8fa778] hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#a8e83c] hover:bg-[#bcf856] text-[#091106] font-black"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
