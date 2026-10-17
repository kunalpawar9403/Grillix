import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Package, 
  Bike, 
  CheckCircle2, 
  Plus, 
  Search, 
  DollarSign, 
  Clock, 
  Power, 
  ExternalLink,
  Shield,
  Edit2,
  Phone,
  Eye,
  UserPlus,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playAdminAlertSound } from '../utils/soundEffects';

export const AdminScreen = () => {
  const { 
    navigateTo, 
    allOrders, 
    updateOrderStatus, 
    deliveryRiders, 
    assignRiderToOrder,
    menuItems, 
    toggleMenuItemStock, 
    updateMenuItemPrice, 
    addMenuItem,
    kitchenStatus, 
    toggleKitchenStatus,
    allUsers = [],
    switchUser,
    addNewUser,
    deleteUser,
    resetAllData,
    showToast,
    currentOrderId,
    setCurrentOrderId
  } = useApp();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu' | 'riders' | 'users' | 'analytics'
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'Received' | 'Preparing' | 'Ready' | 'Delivering' | 'Delivered'
  const [searchTerm, setSearchTerm] = useState('');

  // Add Item Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCalories, setNewItemCalories] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Bowls');
  const [newItemDesc, setNewItemDesc] = useState('');

  // Add Customer Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserCity, setNewUserCity] = useState('Pune, MH');
  const [newUserAddress, setNewUserAddress] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Editing price state: { itemId: string, value: string }
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [priceInput, setPriceInput] = useState('');

  // Metrics computation
  const activeOrdersCount = allOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const completedOrdersCount = allOrders.filter(o => o.status === 'Delivered').length;
  const totalRevenue = allOrders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

  // Filter orders
  const filteredOrders = allOrders.filter(o => {
    const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
    const matchesSearch = 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.address?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateDish = (e) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice) {
      showToast('Please provide at least a name and price');
      return;
    }

    const priceNum = parseFloat(newItemPrice);
    const newDish = {
      id: `dish-${Date.now()}`,
      name: newItemName.trim(),
      shortName: newItemName.trim().slice(0, 15),
      tagline: 'Freshly crafted kitchen specialty',
      description: newItemDesc.trim() || 'Prepared fresh with organic locally sourced greens and cold-pressed extra virgin dressing.',
      menuPrice: isNaN(priceNum) ? 12.50 : priceNum,
      calories: parseInt(newItemCalories) || 550,
      ingredientCount: 8,
      deliveryTime: '25m',
      category: newItemCategory,
      categories: ['Featured', newItemCategory],
      badge: 'Chef Special',
      dietary: ['Organic', 'Gluten-Free'],
      image: '/images/green-veggie-bowl.jpg',
      isOutOfStock: false
    };

    addMenuItem(newDish);
    setShowAddModal(false);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemCalories('');
    setNewItemDesc('');
  };

  const handleSavePrice = (itemId) => {
    updateMenuItemPrice(itemId, priceInput);
    setEditingPriceId(null);
  };

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showToast('Please provide name and email');
      return;
    }
    addNewUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim() || '+91 98200 12345',
      city: newUserCity,
      address: newUserAddress.trim() || `${newUserName.trim()}'s Residence, ${newUserCity}`,
      points: 150
    });
    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setNewUserAddress('');
  };

  return (
    <div className="w-full min-h-screen pb-32 md:pb-16 animate-fadeIn bg-[#F3F6EC] text-[#243019]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">
        
        {/* Top Header & Store Control Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#D0D8C2] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#244507] text-[#A8E83C] flex items-center justify-center shadow-md">
              <Shield size={24} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#244507] tracking-tight">
                  Kitchen Partner Portal
                </h1>
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#244507] text-[#A8E83C] px-2.5 py-0.5 rounded-full">
                  Admin Console
                </span>
              </div>
              <p className="text-xs text-[#747B68] font-semibold">
                GRILLIX Cloud Kitchen #01 • Park Meadows Location
              </p>
            </div>
          </div>

          {/* Controls: Kitchen Online Switch & Return to User App */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={toggleKitchenStatus}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-extrabold text-xs transition-all shadow-xs ${
                kitchenStatus === 'Online'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              <Power size={14} />
              <span>Kitchen: {kitchenStatus}</span>
            </button>

            <button
              onClick={() => {
                playAdminAlertSound();
                showToast('Chime notification tested');
              }}
              className="px-3 py-2 rounded-full bg-[#EEF4E3] hover:bg-[#D8E2C6] text-[#244507] font-bold text-xs border border-[#D0D8C2] transition-all"
              title="Test Order Chime"
            >
              🔔 Test Bell
            </button>

            <button
              onClick={resetAllData}
              className="flex items-center space-x-1 px-3.5 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-300 transition-all active:scale-95"
              title="Flush stale cache and reset all orders and users"
            >
              <RotateCcw size={13} />
              <span>Reset Fresh State</span>
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
            >
              <span>Back to Store App</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#D0D8C2] shadow-xs flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF4E3] text-[#315B0B] flex items-center justify-center shrink-0">
              <DollarSign size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#747B68] block">Today's Revenue</span>
              <span className="text-lg sm:text-xl font-black text-[#244507]">
                ₹{totalRevenue.toFixed(0)}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#D0D8C2] shadow-xs flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF4E3] text-[#315B0B] flex items-center justify-center shrink-0">
              <ShoppingBag size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#747B68] block">Active In Pipeline</span>
              <span className="text-lg sm:text-xl font-black text-[#315B0B]">
                {activeOrdersCount} Orders
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#D0D8C2] shadow-xs flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF4E3] text-[#315B0B] flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#747B68] block">Delivered Today</span>
              <span className="text-lg sm:text-xl font-black text-[#244507]">
                {completedOrdersCount + 42}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#D0D8C2] shadow-xs flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EEF4E3] text-[#315B0B] flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#747B68] block">Avg Prep Time</span>
              <span className="text-lg sm:text-xl font-black text-[#244507]">
                11.4 mins
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#D0D8C2] pb-1 overflow-x-auto no-scrollbar">
          {[
            { id: 'orders', label: 'Live Orders Pipeline', count: activeOrdersCount },
            { id: 'menu', label: 'Menu & Stock Control', count: menuItems.length },
            { id: 'riders', label: 'Delivery Fleet', count: deliveryRiders.length },
            { id: 'users', label: 'Customers & Users', count: allUsers.length },
            { id: 'analytics', label: 'Kitchen Insights' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-[#244507] text-[#A8E83C] shadow-xs'
                  : 'text-[#747B68] hover:bg-white hover:text-[#243019]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeTab === tab.id ? 'bg-[#A8E83C] text-[#244507]' : 'bg-[#E3EBD3] text-[#315B0B]'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: LIVE ORDERS PIPELINE */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Status filter pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
                {['all', 'Received', 'Preparing', 'Ready', 'Delivering', 'Delivered'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      orderFilter === status
                        ? 'bg-[#315B0B] text-white shadow-xs'
                        : 'bg-white hover:bg-[#EEF4E3] text-[#747B68] border border-[#D0D8C2]'
                    }`}
                  >
                    {status === 'all' ? 'All Orders' : status}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#747B68]" />
                <input
                  type="text"
                  placeholder="Search order #, customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white rounded-full text-xs border border-[#D0D8C2] focus:outline-none focus:border-[#315B0B] font-semibold text-[#243019]"
                />
              </div>
            </div>

            {/* Orders Grid / Cards */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#D0D8C2]">
                <Package size={36} className="mx-auto text-stone-400 mb-2" />
                <h3 className="font-bold text-sm text-[#243019]">No orders matching this filter</h3>
                <p className="text-xs text-[#747B68] mt-1">Incoming orders from customers will appear here in real-time.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((ord) => {
                  const isCurrentActive = ord.id === currentOrderId;
                  return (
                    <div
                      key={ord.id}
                      className={`bg-white rounded-3xl p-5 border transition-all space-y-3.5 shadow-xs flex flex-col justify-between ${
                        isCurrentActive ? 'border-[#315B0B] ring-2 ring-[#315B0B]/20' : 'border-[#D0D8C2]'
                      }`}
                    >
                      <div>
                        {/* Header: Order ID & Status Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-mono font-black text-[#244507] block">
                              #{ord.id.slice(-6)}
                            </span>
                            <span className="text-[11px] text-[#747B68] font-semibold">{ord.date}</span>
                          </div>

                          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            ord.status === 'Received' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                            ord.status === 'Preparing' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                            ord.status === 'Ready' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                            ord.status === 'Delivering' ? 'bg-lime-100 text-[#244507] border border-lime-300' :
                            'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                            {ord.status}
                          </span>
                        </div>

                        {/* Customer Info */}
                        <div className="pt-2 border-t border-[#EEF4E3] mt-2 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold text-[#243019]">{ord.customerName}</span>
                            <span className="text-[11px] text-[#747B68]">{ord.customerPhone}</span>
                          </div>
                          <p className="text-[11px] text-[#747B68] line-clamp-1">📍 {ord.address}</p>
                          {ord.deliveryNotes && (
                            <p className="text-[10px] font-bold text-[#315B0B] bg-[#EEF4E3] px-2 py-0.5 rounded-lg inline-block">
                              Note: {ord.deliveryNotes}
                            </p>
                          )}
                        </div>

                        {/* Items summary */}
                        <div className="pt-2 border-t border-[#EEF4E3] space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[#747B68] block">Items</span>
                          {ord.items?.map((itemText, i) => (
                            <div key={i} className="text-xs font-medium text-[#243019] flex items-center justify-between">
                              <span className="truncate pr-2">• {itemText}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer: Rider assignment & Status buttons */}
                      <div className="pt-3 border-t border-[#EEF4E3] space-y-2.5">
                        {/* Rider selection dropdown */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[10px] font-bold text-[#747B68]">Rider:</span>
                          <select
                            value={ord.assignedRider || 'Vikram Singh'}
                            onChange={(e) => assignRiderToOrder(ord.id, e.target.value)}
                            className="bg-[#EEF4E3] text-[#244507] text-[11px] font-bold px-2 py-1 rounded-xl border border-[#D0D8C2] focus:outline-none"
                          >
                            {deliveryRiders.map(r => (
                              <option key={r.id} value={r.name}>{r.name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Order Total & Action Button */}
                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <span className="text-[10px] text-[#747B68] block">Total</span>
                            <span className="text-sm font-black text-[#315B0B]">
                              ₹{Number(ord.total).toFixed(0)}
                            </span>
                          </div>

                          {/* Quick Step Buttons */}
                          <div className="flex items-center space-x-1.5">
                            {ord.status === 'Received' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'Preparing')}
                                className="px-3 py-1.5 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white text-xs font-bold shadow-xs transition-all"
                              >
                                Start Cooking 👨‍🍳
                              </button>
                            )}

                            {ord.status === 'Preparing' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'Ready')}
                                className="px-3 py-1.5 rounded-full bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-all"
                              >
                                Mark Ready 📦
                              </button>
                            )}

                            {ord.status === 'Ready' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'Delivering')}
                                className="px-3 py-1.5 rounded-full bg-lime-700 hover:bg-lime-800 text-white text-xs font-bold shadow-xs transition-all"
                              >
                                Dispatch Rider 🛵
                              </button>
                            )}

                            {ord.status === 'Delivering' && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, 'Delivered')}
                                className="px-3 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all"
                              >
                                Complete ✅
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setCurrentOrderId(ord.id);
                                navigateTo('order-tracking');
                              }}
                              className="w-8 h-8 rounded-full bg-[#EEF4E3] hover:bg-[#D5E1C3] text-[#244507] flex items-center justify-center transition-all"
                              title="Track on Real Map"
                            >
                              <Eye size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MENU & STOCK CONTROL */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#244507]">
                  Dishes & Inventory Management ({menuItems.length})
                </h3>
                <p className="text-xs text-[#747B68]">
                  Toggle dishes Out of Stock or edit prices on the fly.
                </p>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white text-xs font-extrabold shadow-md transition-all active:scale-95"
              >
                <Plus size={16} />
                <span>Add New Bowl</span>
              </button>
            </div>

            {/* Menu Items Table */}
            <div className="bg-white rounded-3xl border border-[#D0D8C2] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EEF4E3] text-[#244507] font-black uppercase tracking-wider text-[10px] border-b border-[#D0D8C2]">
                    <tr>
                      <th className="py-3 px-4">Dish</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Calories</th>
                      <th className="py-3 px-4">Stock Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEF4E3]">
                    {menuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-[#FAFBF7] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 max-w-xs">
                              <span className="font-extrabold text-[#243019] block truncate">{item.name}</span>
                              <span className="text-[10px] text-[#747B68] block truncate">{item.tagline}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-bold text-[#747B68]">
                          {item.category || 'Featured'}
                        </td>

                        <td className="py-3 px-4 font-extrabold text-[#315B0B]">
                          {editingPriceId === item.id ? (
                            <div className="flex items-center space-x-1">
                              <input
                                type="number"
                                step="10"
                                value={priceInput}
                                onChange={(e) => setPriceInput(e.target.value)}
                                className="w-16 px-1.5 py-0.5 bg-[#EEF4E3] border border-[#315B0B] rounded text-xs font-bold"
                              />
                              <button
                                onClick={() => handleSavePrice(item.id)}
                                className="text-[10px] bg-[#315B0B] text-white px-2 py-0.5 rounded font-bold"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1.5">
                              <span>₹{Number(item.menuPrice).toFixed(0)}</span>
                              <button
                                onClick={() => {
                                  setEditingPriceId(item.id);
                                  setPriceInput(item.menuPrice.toString());
                                }}
                                className="text-stone-400 hover:text-stone-700"
                                title="Edit Price"
                              >
                                <Edit2 size={12} />
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4 font-semibold text-[#747B68]">
                          {item.calories} kcal
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => toggleMenuItemStock(item.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                              item.isOutOfStock
                                ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            {item.isOutOfStock ? 'Sold Out' : 'In Stock'}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => toggleMenuItemStock(item.id)}
                            className="text-xs text-[#315B0B] hover:underline font-bold"
                          >
                            Toggle Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DELIVERY FLEET */}
        {activeTab === 'riders' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#244507]">
                Active Delivery Partners ({deliveryRiders.length})
              </h3>
              <p className="text-xs text-[#747B68]">
                Real-time fleet tracking, phone contact, and dispatch management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {deliveryRiders.map((rider) => (
                <div key={rider.id} className="bg-white rounded-3xl p-5 border border-[#D0D8C2] shadow-xs space-y-3.5">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF4E3] border-2 border-[#315B0B] flex items-center justify-center font-black text-sm text-[#244507]">
                      {rider.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#243019]">{rider.name}</h4>
                      <span className="text-[11px] font-bold text-[#A8E83C] bg-[#244507] px-2 py-0.5 rounded-full inline-block mt-0.5">
                        ★ {rider.rating} Rating
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-[#747B68] pt-2 border-t border-[#EEF4E3]">
                    <p className="flex items-center space-x-1.5">
                      <Bike size={13} className="text-[#315B0B]" />
                      <span className="font-semibold">{rider.vehicle}</span>
                    </p>
                    <p className="flex items-center space-x-1.5">
                      <Phone size={13} className="text-[#315B0B]" />
                      <span className="font-semibold">{rider.phone}</span>
                    </p>
                    <p className="text-[11px] font-bold text-[#315B0B] pt-1">
                      {rider.tripsCompleted} lifetime trips completed
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#EEF4E3] flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      ● Active on road
                    </span>
                    <button
                      onClick={() => showToast(`Calling ${rider.name}...`)}
                      className="px-3 py-1 rounded-full bg-[#EEF4E3] hover:bg-[#D5E1C3] text-[#244507] text-xs font-bold transition-all"
                    >
                      Call Partner
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: KITCHEN INSIGHTS & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-extrabold text-[#244507]">
                Cloud Kitchen Performance & Analytics
              </h3>
              <p className="text-xs text-[#747B68]">
                Real-time sales breakdown, customer retention, and peak hour trends.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Sales Breakdown */}
              <div className="bg-white rounded-3xl p-6 border border-[#D0D8C2] shadow-xs space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#747B68]">
                  Sales by Category
                </h4>
                
                <div className="space-y-3">
                  {[
                    { label: 'Warm Bowls & Greens', share: 48, revenue: '₹42,850' },
                    { label: 'Protein Plates & Salmon', share: 32, revenue: '₹28,600' },
                    { label: 'Custom Build-Your-Own Bowls', share: 14, revenue: '₹12,450' },
                    { label: 'Artisan Kombucha & Drinks', share: 6, revenue: '₹5,400' }
                  ].map((cat) => (
                    <div key={cat.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-[#243019]">
                        <span>{cat.label}</span>
                        <span>{cat.revenue} ({cat.share}%)</span>
                      </div>
                      <div className="w-full h-2 bg-[#EEF4E3] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#315B0B] rounded-full"
                          style={{ width: `${cat.share}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operations Health */}
              <div className="bg-white rounded-3xl p-6 border border-[#D0D8C2] shadow-xs space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#747B68]">
                  Operational Health Metrics
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#EEF4E3] p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-[#747B68] block">Kitchen On-Time Rate</span>
                    <span className="text-xl font-black text-[#315B0B]">98.6%</span>
                  </div>
                  <div className="bg-[#EEF4E3] p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-[#747B68] block">Customer Rating</span>
                    <span className="text-xl font-black text-[#315B0B]">4.92 / 5.0</span>
                  </div>
                  <div className="bg-[#EEF4E3] p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-[#747B68] block">Rider Dispatch Lag</span>
                    <span className="text-xl font-black text-[#315B0B]">2.3 mins</span>
                  </div>
                  <div className="bg-[#EEF4E3] p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-[#747B68] block">Eco Box Packaging</span>
                    <span className="text-xl font-black text-[#315B0B]">100% Bio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMERS & USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full sm:max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#747B68]" />
                <input
                  type="text"
                  placeholder="Search registered customers by name, phone, city..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white rounded-2xl text-xs font-bold border border-[#D0D8C2] focus:outline-none focus:border-[#315B0B] text-[#243019]"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white text-xs font-black flex items-center space-x-1.5 shadow-xs transition-all active:scale-95"
                >
                  <UserPlus size={14} />
                  <span>New Customer</span>
                </button>
              </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {allUsers
                .filter(u => 
                  !userSearchTerm.trim() ||
                  u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                  u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                  u.city?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                  u.phone?.toLowerCase().includes(userSearchTerm.toLowerCase())
                )
                .map((user) => (
                  <div 
                    key={user.id || user.email}
                    className="bg-white rounded-3xl p-5 border border-[#D0D8C2] shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={user.avatar || '/images/avatar-jhon.jpg'} 
                          alt={user.name} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#315B0B] shadow-xs"
                        />
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <h3 className="text-sm font-black text-[#243019]">{user.name}</h3>
                            <span className="text-[10px] bg-[#EEF4E3] text-[#244507] px-2 py-0.5 rounded-full font-bold">
                              {user.city ? user.city.split(',')[0] : 'India'}
                            </span>
                          </div>
                          <span className="text-xs text-[#747B68] font-bold block">{user.handle}</span>
                          <span className="text-[11px] text-[#747B68]">{user.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#EEF4E3] rounded-2xl p-3 text-xs space-y-1 text-[#243019] border border-[#D0D8C2]/60">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-[#747B68]">Phone:</span>
                        <span>{user.phone || '+91 98201 44321'}</span>
                      </div>
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-[#747B68]">Loyalty:</span>
                        <span className="text-[#315B0B]">★ {user.points || 150} PTS</span>
                      </div>
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-[#747B68]">Tier:</span>
                        <span className="text-[#244507]">{user.tier || 'Member'}</span>
                      </div>
                      <div className="pt-1 text-[11px] text-[#747B68] truncate">
                        📍 {user.address}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-1 border-t border-[#EEF4E3]">
                      <button
                        onClick={() => {
                          switchUser(user.id);
                          navigateTo('account');
                        }}
                        className="flex-1 py-2 rounded-xl bg-[#244507] hover:bg-[#315B0B] text-[#A8E83C] font-extrabold text-xs transition-all active:scale-95 flex items-center justify-center space-x-1"
                      >
                        <span>Switch & View App</span>
                        <ExternalLink size={12} />
                      </button>

                      {allUsers.length > 1 && (
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 flex items-center justify-center transition-all"
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

      </div>

      {/* Add New Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-[#D0D8C2] shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEF4E3]">
              <h3 className="text-base font-black text-[#244507]">Add New Dish to GRILLIX</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#747B68] block mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Avocado Truffle Harvest Bowl"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-[#EEF4E3] text-xs font-bold px-3.5 py-2.5 rounded-2xl border border-[#D0D8C2] focus:outline-none focus:border-[#315B0B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#747B68] block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="10"
                    required
                    placeholder="299"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full bg-[#EEF4E3] text-xs font-bold px-3.5 py-2.5 rounded-2xl border border-[#D0D8C2] focus:outline-none focus:border-[#315B0B]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#747B68] block mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    placeholder="650"
                    value={newItemCalories}
                    onChange={(e) => setNewItemCalories(e.target.value)}
                    className="w-full bg-[#EEF4E3] text-xs font-bold px-3.5 py-2.5 rounded-2xl border border-[#D0D8C2] focus:outline-none focus:border-[#315B0B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#747B68] block mb-1">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full bg-[#EEF4E3] text-xs font-bold px-3.5 py-2.5 rounded-2xl border border-[#D0D8C2] focus:outline-none focus:border-[#315B0B]"
                >
                  <option value="Bowls">Bowls</option>
                  <option value="Salads">Salads</option>
                  <option value="Protein Plates">Protein Plates</option>
                  <option value="Warm Bowls">Warm Bowls</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#747B68] block mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Fresh organic ingredients and dressing..."
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full bg-[#EEF4E3] text-xs font-medium px-3.5 py-2 rounded-2xl border border-[#D0D8C2] focus:outline-none focus:border-[#315B0B]"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-full bg-[#EEF4E3] hover:bg-[#D5E1C3] text-[#244507] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-black text-xs shadow-md transition-all active:scale-95"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Customer Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 border border-[#D0D8C2] shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEF4E3]">
              <h3 className="text-base font-black text-[#244507]">Register New Customer</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-stone-400 hover:text-stone-700 font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#747B68] block mb-1">Customer Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Rao"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-[#EEF4E3] text-xs font-bold px-3.5 py-2.5 rounded-2xl border border-[#D0D8C2] focus:outline-none focus:border-[#315B0B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#747B68] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="vikram.rao@gmail.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full bg-[#EEF4E3] text-xs font-bold px-3.5 py-2.5 rounded-2xl border border-[#D0D8C2] focus:outline-none focus:border-[#315B0B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#747B68] block mb-1">Mobile (+91)</label>
                  <input
                    type="tel"
                    placeholder="+91 98201 12345"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    className="w-full bg-[#EEF4E3] text-xs font-bold px-3.5 py-2.5 rounded-2xl border border-[#D0D8C2] focus:outline-none focus:border-[#315B0B]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#747B68] block mb-1">City Hub</label>
                  <select
                    value={newUserCity}
                    onChange={(e) => setNewUserCity(e.target.value)}
                    className="w-full bg-[#EEF4E3] text-xs font-bold px-3.5 py-2.5 rounded-2xl border border-[#D0D8C2] focus:outline-none focus:border-[#315B0B]"
                  >
                    <option value="Mumbai, MH">Mumbai</option>
                    <option value="Bengaluru, KA">Bengaluru</option>
                    <option value="Pune, MH">Pune</option>
                    <option value="Gurugram, DL">Gurugram / NCR</option>
                    <option value="Hyderabad, TS">Hyderabad</option>
                    <option value="Chennai, TN">Chennai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#747B68] block mb-1">Delivery Address</label>
                <input
                  type="text"
                  placeholder="Flat / Villa number, Street, Landmark"
                  value={newUserAddress}
                  onChange={(e) => setNewUserAddress(e.target.value)}
                  className="w-full bg-[#EEF4E3] text-xs font-medium px-3.5 py-2.5 rounded-2xl border border-[#D0D8C2] focus:outline-none focus:border-[#315B0B]"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 py-3 rounded-full bg-[#EEF4E3] hover:bg-[#D5E1C3] text-[#244507] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#315B0B] hover:bg-[#244507] text-white font-black text-xs shadow-md transition-all active:scale-95"
                >
                  Register Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
