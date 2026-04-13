import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  DollarSign,
  Users,
  TrendingUp,
  Star,
  Clock,
  Calendar,
  BarChart,
  PieChart,
  Download,
  Eye,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Package,
  Truck,
  Settings,
  Menu,
  Coffee,
  Pizza,
  Sandwich,
  IceCream,
  Salad,
  Leaf,
  Zap,
  Award,
  TrendingDown,
  Utensils,
  Apple,
  Save,
  Layers,
  Shield,
  Mail,
  Phone,
  MapPin,
  User,
  Image as ImageIcon,
  X
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/canteen';

const CanteenOwner = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [activeTab, setActiveTab] = useState('menu');
  const [formErrors, setFormErrors] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [statistics, setStatistics] = useState({
    totalItems: 0,
    totalOrders: 0,
    totalSales: 0,
    todaySales: 0,
    totalItemsSold: 0,
    averageRating: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    categoryCount: {},
    topSellingItems: []
  });
  
  // Item form state
  const [itemForm, setItemForm] = useState({
    name: '',
    category: 'main',
    price: 0,
    stock: 0,
    description: '',
    image: '',
    available: true,
    prepTime: 15,
    calories: 0,
    tags: []
  });

  const categories = [
    { id: 'all', name: 'All Items', icon: ShoppingBag },
    { id: 'main', name: 'Main Course', icon: Pizza },
    { id: 'snacks', name: 'Snacks', icon: Sandwich },
    { id: 'beverages', name: 'Beverages', icon: Coffee },
    { id: 'desserts', name: 'Desserts', icon: IceCream },
    { id: 'healthy', name: 'Healthy', icon: Apple }
  ];

  // Load data from backend
  useEffect(() => {
    loadFoodItems();
    loadOrders();
    loadStatistics();
  }, []);

  const loadFoodItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/items`);
      if (!response.ok) throw new Error('Failed to fetch food items');
      const data = await response.json();
      setFoodItems(data);
    } catch (error) {
      console.error('Error loading food items:', error);
      showNotificationMessage('Failed to load food items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics`);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const showNotificationMessage = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const validateItemForm = () => {
    const errors = {};
    if (!itemForm.name) errors.name = 'Item name is required';
    if (itemForm.name.length < 3) errors.name = 'Name must be at least 3 characters';
    if (itemForm.price <= 0) errors.price = 'Price must be greater than 0';
    if (itemForm.stock < 0) errors.stock = 'Stock cannot be negative';
    if (!itemForm.description) errors.description = 'Description is required';
    if (itemForm.description.length < 10) errors.description = 'Description must be at least 10 characters';
    if (itemForm.prepTime <= 0) errors.prepTime = 'Preparation time must be greater than 0';
    if (itemForm.calories < 0) errors.calories = 'Calories cannot be negative';
    return errors;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotificationMessage('Image size should be less than 5MB', 'error');
        return;
      }
      if (!file.type.startsWith('image/')) {
        showNotificationMessage('Please upload a valid image file', 'error');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setItemForm({ ...itemForm, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setItemForm({ ...itemForm, image: '' });
  };

  const handleAddItem = () => {
    setItemForm({
      name: '',
      category: 'main',
      price: 0,
      stock: 0,
      description: '',
      image: '',
      available: true,
      prepTime: 15,
      calories: 0,
      tags: []
    });
    setImagePreview(null);
    setImageFile(null);
    setIsEditing(false);
    setFormErrors({});
    setShowItemModal(true);
  };

  const handleEditItem = (item) => {
    setItemForm({
      name: item.name,
      category: item.category,
      price: item.price,
      stock: item.stock,
      description: item.description,
      image: item.imageUrl || '',
      available: item.available,
      prepTime: item.prepTime,
      calories: item.calories,
      tags: item.tags || []
    });
    setImagePreview(item.imageUrl);
    setImageFile(null);
    setSelectedItem(item);
    setIsEditing(true);
    setFormErrors({});
    setShowItemModal(true);
  };

  const handleSaveItem = async () => {
    const errors = validateItemForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotificationMessage('Please fix the errors in the form', 'error');
      return;
    }

    try {
      let response;
      if (isEditing && selectedItem) {
        response = await fetch(`${API_BASE_URL}/items/${selectedItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemForm)
        });
      } else {
        response = await fetch(`${API_BASE_URL}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemForm)
        });
      }

      if (!response.ok) throw new Error('Failed to save item');
      
      await loadFoodItems();
      await loadStatistics();
      showNotificationMessage(isEditing ? 'Item updated successfully!' : 'New item added successfully!');
      setShowItemModal(false);
    } catch (error) {
      console.error('Error saving item:', error);
      showNotificationMessage('Failed to save item', 'error');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete item');
        
        await loadFoodItems();
        await loadStatistics();
        showNotificationMessage('Item deleted successfully!');
      } catch (error) {
        console.error('Error deleting item:', error);
        showNotificationMessage('Failed to delete item', 'error');
      }
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) throw new Error('Failed to update order status');
      
      await loadOrders();
      await loadStatistics();
      showNotificationMessage(`Order #${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order:', error);
      showNotificationMessage('Failed to update order status', 'error');
    }
  };

  const filteredItems = foodItems.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalSales = statistics.totalSales;
  const totalOrders = statistics.totalOrders;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
  const totalItemsSold = statistics.totalItemsSold;

  const getStockStatus = (stock) => {
    if (stock <= 0) return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
    if (stock <= 5) return { text: `Only ${stock} left`, color: 'text-orange-600', bg: 'bg-orange-100' };
    return { text: `${stock} in stock`, color: 'text-green-600', bg: 'bg-green-100' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1e293b] to-[#0F172A] text-white sticky top-0 z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#22C55E]/20 rounded-2xl backdrop-blur-sm">
                <Utensils className="w-8 h-8 text-[#22C55E]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-[#22C55E] bg-clip-text text-transparent">
                  Canteen Owner Portal
                </h1>
                <p className="text-slate-300 mt-1">Manage menu, track orders, and view sales</p>
              </div>
            </div>
            <button
              onClick={handleAddItem}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#22C55E] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              Add New Item
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {showNotification && (
          <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
            <div className={`${notificationType === 'success' ? 'bg-gradient-to-r from-[#22C55E] to-[#16a34a]' : 'bg-gradient-to-r from-red-500 to-red-600'} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-sm`}>
              {notificationType === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-medium">{notificationMessage}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Sales</p>
                <p className="text-2xl font-bold text-[#22C55E]">LKR {totalSales.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-[#22C55E] opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Orders</p>
                <p className="text-2xl font-bold text-[#0F172A]">{totalOrders}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Avg Order Value</p>
                <p className="text-2xl font-bold text-purple-600">LKR {averageOrderValue.toFixed(0)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Items Sold</p>
                <p className="text-2xl font-bold text-orange-600">{totalItemsSold}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-orange-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-lg">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'menu'
                ? 'bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Menu className="w-4 h-4 inline mr-2" />
            Menu Management ({foodItems.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Orders ({orders.length})
          </button>
        </div>

        {/* Menu Management Tab */}
        {activeTab === 'menu' && (
          <>
            {/* Filters */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-5 mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center flex-1">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#22C55E]" />
                    <span className="text-sm font-medium text-slate-700">Category:</span>
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#22C55E] bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Items Grid */}
            {loading ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
                  <div className="w-8 h-8 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-slate-500">Loading items...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item.stock);
                  return (
                    <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                      <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${item.imageUrl})` }} />
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-[#0F172A] text-lg">{item.name}</h3>
                            <p className="text-xs text-slate-500 capitalize">{item.category}</p>
                          </div>
                          <span className="text-lg font-bold text-[#22C55E]">LKR {item.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${stockStatus.bg} ${stockStatus.color} flex items-center gap-1`}>
                            <Layers className="w-3 h-3" />
                            {stockStatus.text}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{item.rating || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="text-xs">{item.prepTime} mins</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-xs">{item.totalSold || 0} sold</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="flex-1 py-2 bg-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="flex-1 py-2 bg-red-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && filteredItems.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl">
                <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No items found</p>
              </div>
            )}
          </>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No orders yet</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-5 border-b border-slate-100">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-[#0F172A]">Order #{order.id}</p>
                        <p className="text-sm text-slate-500">{new Date(order.orderDate).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="px-3 py-1 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready for Pickup</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="space-y-2 mb-3">
                      {order.items && order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.name} x {item.quantity}</span>
                          <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-[#22C55E]">LKR {order.total.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-sm font-medium mb-1 flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Customer: {order.studentName}
                      </p>
                      <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                        <Shield className="w-3 h-3" />
                        Student ID: {order.studentId}
                      </p>
                      <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" />
                        Phone: {order.phone}
                      </p>
                      <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        Location: {order.deliveryLocation}
                      </p>
                      {order.specialInstructions && (
                        <p className="text-xs text-slate-600 mt-1">Notes: {order.specialInstructions}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Item Modal with Image Upload */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#0F172A]">
                {isEditing ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button onClick={() => setShowItemModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Item Name *</label>
                <input
                  type="text"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                    formErrors.name ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="Enter item name"
                />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Category *</label>
                  <select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="main">Main Course</option>
                    <option value="snacks">Snacks</option>
                    <option value="beverages">Beverages</option>
                    <option value="desserts">Desserts</option>
                    <option value="healthy">Healthy</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Price (LKR) *</label>
                  <input
                    type="number"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: parseFloat(e.target.value) })}
                    className={`w-full px-4 py-2 border rounded-xl ${
                      formErrors.price ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                  {formErrors.price && <p className="text-xs text-red-500 mt-1">{formErrors.price}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Stock Quantity *</label>
                  <input
                    type="number"
                    value={itemForm.stock}
                    onChange={(e) => setItemForm({ ...itemForm, stock: parseInt(e.target.value) })}
                    className={`w-full px-4 py-2 border rounded-xl ${
                      formErrors.stock ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="Enter stock quantity"
                    min="0"
                  />
                  {formErrors.stock && <p className="text-xs text-red-500 mt-1">{formErrors.stock}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Prep Time (mins) *</label>
                  <input
                    type="number"
                    value={itemForm.prepTime}
                    onChange={(e) => setItemForm({ ...itemForm, prepTime: parseInt(e.target.value) })}
                    className={`w-full px-4 py-2 border rounded-xl ${
                      formErrors.prepTime ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="Preparation time"
                    min="1"
                  />
                  {formErrors.prepTime && <p className="text-xs text-red-500 mt-1">{formErrors.prepTime}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Calories</label>
                  <input
                    type="number"
                    value={itemForm.calories}
                    onChange={(e) => setItemForm({ ...itemForm, calories: parseInt(e.target.value) })}
                    className={`w-full px-4 py-2 border rounded-xl ${
                      formErrors.calories ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="Calories per serving"
                    min="0"
                  />
                  {formErrors.calories && <p className="text-xs text-red-500 mt-1">{formErrors.calories}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Available</label>
                  <label className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={itemForm.available}
                      onChange={(e) => setItemForm({ ...itemForm, available: e.target.checked })}
                      className="w-4 h-4 text-[#22C55E] rounded"
                    />
                    <span className="text-sm text-slate-700">Available for order</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Item Image</label>
                <div className="mt-1 flex items-center gap-4">
                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 transition-colors">
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">Max size: 5MB (JPG, PNG, GIF)</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Description *</label>
                <textarea
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  rows="3"
                  className={`w-full px-4 py-2 border rounded-xl resize-none ${
                    formErrors.description ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="Describe the item (minimum 10 characters)"
                />
                {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
              </div>
            </div>
            
            <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
              <button onClick={() => setShowItemModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">
                Cancel
              </button>
              <button onClick={handleSaveItem} className="px-4 py-2 bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white rounded-xl font-medium flex items-center gap-2">
                <Save className="w-4 h-4" />
                {isEditing ? 'Update Item' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#0F172A]">Order Details</h3>
              <button onClick={() => setShowOrderModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl">
                <p className="font-semibold">Order #{selectedOrder.id}</p>
                <p className="text-sm text-slate-500">{new Date(selectedOrder.orderDate).toLocaleString()}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Customer Details</h4>
                <p className="text-sm">Name: {selectedOrder.studentName}</p>
                <p className="text-sm">Student ID: {selectedOrder.studentId}</p>
                <p className="text-sm">Email: {selectedOrder.email}</p>
                <p className="text-sm">Phone: {selectedOrder.phone}</p>
                <p className="text-sm">Location: {selectedOrder.deliveryLocation}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Items Ordered</h4>
                <div className="space-y-2">
                  {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-[#22C55E]">LKR {selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {selectedOrder.specialInstructions && (
                <div>
                  <h4 className="font-medium mb-1">Special Instructions</h4>
                  <p className="text-sm text-slate-600">{selectedOrder.specialInstructions}</p>
                </div>
              )}
              
              {selectedOrder.feedback && (
                <div>
                  <h4 className="font-medium mb-1">Student Feedback</h4>
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className={`w-4 h-4 ${star <= selectedOrder.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600">{selectedOrder.feedback}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-medium mb-2">Tracking History</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedOrder.trackingUpdates && selectedOrder.trackingUpdates.map((update, idx) => (
                    <div key={idx} className="text-xs text-slate-500">
                      {new Date(update.time).toLocaleString()}: {update.message}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes slide-in-from-right-5 {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-in { animation-duration: 0.3s; animation-fill-mode: both; }
        .slide-in-from-right-5 { animation-name: slide-in-from-right-5; }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default CanteenOwner;