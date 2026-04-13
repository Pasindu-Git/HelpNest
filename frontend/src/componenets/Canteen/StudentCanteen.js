import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Coffee, 
  Pizza, 
  Sandwich, 
  IceCream, 
  Apple,
  Search,
  Star,
  Clock,
  MapPin,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  User,
  Mail,
  Phone,
  MessageSquare,
  Flame,
  Utensils,
  Layers,
  Shield,
  Truck
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/canteen';

const StudentCanteen = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Student details
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('Canteen Pickup');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Categories
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
    loadCartFromLocal();
  }, []);

  const loadFoodItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/student/items`);
      if (!response.ok) throw new Error('Failed to fetch food items');
      const data = await response.json();
      setFoodItems(data);
    } catch (error) {
      console.error('Error loading food items:', error);
      showNotificationMessage('Failed to load menu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCartFromLocal = () => {
    const savedCart = localStorage.getItem('studentCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCartToLocal = (newCart) => {
    localStorage.setItem('studentCart', JSON.stringify(newCart));
  };

  const showNotificationMessage = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const checkStock = async (itemId, requestedQuantity) => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/check-stock/${itemId}?requestedQuantity=${requestedQuantity}`);
      if (!response.ok) throw new Error('Failed to check stock');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking stock:', error);
      return { available: false, stock: 0 };
    }
  };

  const addToCart = async (item) => {
    if (item.stock <= 0) {
      showNotificationMessage(`Sorry! ${item.name} is out of stock`, 'error');
      return;
    }
    
    const cartQuantity = cart.find(cartItem => cartItem.id === item.id)?.quantity || 0;
    if (cartQuantity + 1 > item.stock) {
      showNotificationMessage(`Only ${item.stock} ${item.name}(s) available!`, 'error');
      return;
    }
    
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      const newCart = cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCart(newCart);
      saveCartToLocal(newCart);
    } else {
      const newCart = [...cart, { ...item, quantity: 1 }];
      setCart(newCart);
      saveCartToLocal(newCart);
    }
    showNotificationMessage(`${item.name} added to cart!`, 'success');
  };

  const updateQuantity = async (itemId, change) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    const foodItem = foodItems.find(f => f.id === itemId);
    
    if (change > 0 && item.quantity + change > foodItem.stock) {
      showNotificationMessage(`Only ${foodItem.stock} ${foodItem.name}(s) available!`, 'error');
      return;
    }
    
    if (item.quantity + change === 0) {
      removeFromCart(itemId);
    } else {
      const newCart = cart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity + change }
          : cartItem
      );
      setCart(newCart);
      saveCartToLocal(newCart);
    }
  };

  const removeFromCart = (itemId) => {
    const newCart = cart.filter(item => item.id !== itemId);
    setCart(newCart);
    saveCartToLocal(newCart);
    showNotificationMessage('Item removed from cart', 'success');
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const validateCheckout = () => {
    const errors = {};
    
    if (!studentName) errors.name = 'Student name is required';
    if (studentName.length < 3) errors.name = 'Name must be at least 3 characters';
    
    if (!studentId) errors.studentId = 'Student ID is required';
    const sdRegex = /^SD\d{7}$/;
    if (studentId && !sdRegex.test(studentId)) errors.studentId = 'Must be format SD followed by 7 digits';
    
    if (!email) errors.email = 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) errors.email = 'Please enter a valid email address';
    if (email && !email.toLowerCase().endsWith('@gmail.com')) errors.email = 'Please use Gmail address';
    
    if (!phone) errors.phone = 'Phone number is required';
    const phoneRegex = /^[0-9]{10}$/;
    if (phone && !phoneRegex.test(phone.replace(/[^0-9]/g, ''))) errors.phone = 'Enter valid 10-digit number';
    
    setFormErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      showNotificationMessage('Please fix the errors in the form', 'error');
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
    if (!validateCheckout()) return;
    if (cart.length === 0) {
      showNotificationMessage('Your cart is empty!', 'error');
      return;
    }

    const orderData = {
      studentName,
      studentId,
      email,
      phone,
      deliveryLocation,
      specialInstructions,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    };

    try {
      const response = await fetch(`${API_BASE_URL}/student/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to place order');
      }

      // Clear cart
      setCart([]);
      saveCartToLocal([]);
      
      // Refresh food items to update stock
      await loadFoodItems();
      
      showNotificationMessage(`Order placed successfully! Total: LKR ${data.total.toLocaleString()}. Estimated pickup: ${data.estimatedPickupTime}`, 'success');
      
      setShowCheckout(false);
      
      // Reset form
      setStudentName('');
      setStudentId('');
      setEmail('');
      setPhone('');
      setSpecialInstructions('');
      setFormErrors({});
      
    } catch (error) {
      console.error('Error placing order:', error);
      showNotificationMessage(error.message || 'Failed to place order', 'error');
    }
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return { text: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100', canOrder: false };
    if (stock <= 5) return { text: `Only ${stock} left`, color: 'text-orange-600', bg: 'bg-orange-100', canOrder: true };
    return { text: `${stock} available`, color: 'text-green-600', bg: 'bg-green-100', canOrder: true };
  };

  const filteredItems = foodItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
                  Campus Canteen
                </h1>
                <p className="text-slate-300 mt-1">Order delicious meals from your favorite canteen</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCart(true)}
                className="relative flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#22C55E] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
              <button
                onClick={() => loadFoodItems()}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {showNotification && (
          <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300 max-w-md">
            <div className={`${notificationType === 'success' ? 'bg-gradient-to-r from-[#22C55E] to-[#16a34a]' : 'bg-gradient-to-r from-red-500 to-red-600'} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-sm`}>
              {notificationType === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-medium whitespace-pre-line">{notificationMessage}</span>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[#22C55E] text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search for food items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
          />
        </div>

        {/* Food Items Grid */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
              <div className="w-8 h-8 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-500">Loading menu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const stockStatus = getStockStatus(item.stock);
              const isOutOfStock = item.stock <= 0;
              
              return (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group">
                  <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url(${item.imageUrl})` }}>
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          Out of Stock
                        </span>
                      </div>
                    )}
                    {item.tags && item.tags.includes('popular') && !isOutOfStock && (
                      <div className="absolute top-2 left-2 bg-[#22C55E] text-white text-xs px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 inline mr-1 fill-white" />
                        Popular
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-[#0F172A] text-lg">{item.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${stockStatus.bg} ${stockStatus.color} flex items-center gap-1`}>
                            <Layers className="w-3 h-3" />
                            {stockStatus.text}
                          </span>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-[#22C55E]">LKR {item.price.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{item.rating || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-500">{item.prepTime} mins</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-xs text-slate-500">{item.calories} cal</span>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      disabled={isOutOfStock}
                      className={`w-full py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                        isOutOfStock
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white hover:shadow-lg'
                      }`}
                    >
                      {isOutOfStock ? (
                        <>
                          <XCircle className="w-4 h-4" />
                          Out of Stock
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add to Cart
                        </>
                      )}
                    </button>
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
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#0F172A]">Your Cart</h3>
              <button onClick={() => setShowCart(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Your cart is empty</p>
                  <p className="text-sm text-slate-400 mt-1">Add some delicious items!</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-4">
                    {cart.map((item) => {
                      const foodItem = foodItems.find(f => f.id === item.id);
                      const maxQuantity = foodItem?.stock || 0;
                      
                      return (
                        <div key={item.id} className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-slate-500">LKR {item.price.toLocaleString()} each</p>
                            {maxQuantity < item.quantity && (
                              <p className="text-xs text-red-500 mt-1">Only {maxQuantity} available</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              disabled={item.quantity >= maxQuantity}
                              className={`p-1 rounded-lg transition-colors ${
                                item.quantity >= maxQuantity
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-slate-100 hover:bg-slate-200'
                              }`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-[#22C55E]">LKR {calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#0F172A]">Checkout</h3>
              <button onClick={() => setShowCheckout(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                    formErrors.name ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="Enter your full name"
                />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                    formErrors.studentId ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="SD2024001"
                />
                {formErrors.studentId && <p className="text-xs text-red-500 mt-1">{formErrors.studentId}</p>}
                <p className="text-xs text-slate-400 mt-1">Format: SD followed by 7 digits</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                    formErrors.email ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="student@gmail.com"
                />
                {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                    formErrors.phone ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="0771234567"
                />
                {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
                <p className="text-xs text-slate-400 mt-1">Enter 10-digit phone number</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Delivery Location
                </label>
                <select
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                >
                  <option value="Canteen Pickup">Canteen Pickup</option>
                  <option value="Library">Library</option>
                  <option value="Student Center">Student Center</option>
                  <option value="Academic Building">Academic Building</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows="2"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] resize-none"
                  placeholder="Any special requests? (e.g., less spicy, extra sauce)"
                />
              </div>
              
              <div className="bg-gradient-to-r from-slate-50 to-white p-4 rounded-xl border border-slate-200">
                <h4 className="font-semibold text-[#0F172A] mb-2 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#22C55E]" />
                  Order Summary
                </h4>
                <div className="space-y-1 max-h-32 overflow-y-auto mb-3">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.name} x {item.quantity}</span>
                      <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span className="text-[#22C55E] text-lg">LKR {calculateTotal().toLocaleString()}</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Truck className="w-4 h-4" />
                  <span>Estimated pickup time: 20-30 minutes</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-200 px-6 py-4 flex gap-3">
              <button onClick={() => setShowCheckout(false)} className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Back to Cart
              </button>
              <button onClick={placeOrder} className="flex-1 px-4 py-2 bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                <CreditCard className="w-4 h-4" />
                Place Order
              </button>
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

export default StudentCanteen;