import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Truck,
  RefreshCw,
  ChevronRight,
  Package,
  Utensils,
  Receipt
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/student/orders';

const StudentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  useEffect(() => {
    loadOrders();
    loadStatistics();
  }, []);

  const getStudentEmail = () => {
    const session = localStorage.getItem('userSession');
    if (session) {
      const userSession = JSON.parse(session);
      return userSession.email;
    }
    return null;
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const email = getStudentEmail();
      
      if (!email) {
        window.location.href = '/login';
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/student/${email}`);
      
      if (!response.ok) throw new Error('Failed to load orders');
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        throw new Error(data.message || 'Failed to load orders');
      }
      
    } catch (error) {
      console.error('Error loading orders:', error);
      showNotificationMessage('Failed to load orders', 'error');
      // Load sample data for demo when backend is not available
      loadSampleOrders();
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const email = getStudentEmail();
      if (!email) return;
      
      const response = await fetch(`${API_BASE_URL}/statistics/${email}`);
      
      if (!response.ok) throw new Error('Failed to load statistics');
      
      const data = await response.json();
      setStatistics(data);
      
    } catch (error) {
      console.error('Error loading statistics:', error);
      // Use calculated stats from orders if API fails
      if (orders.length > 0) {
        calculateStatsFromOrders(orders);
      }
    }
  };

  const calculateStatsFromOrders = (ordersList) => {
    const stats = {
      totalOrders: ordersList.length,
      pendingOrders: ordersList.filter(o => o.status === 'pending').length,
      preparingOrders: ordersList.filter(o => o.status === 'preparing').length,
      readyOrders: ordersList.filter(o => o.status === 'ready').length,
      deliveredOrders: ordersList.filter(o => o.status === 'delivered').length,
      cancelledOrders: ordersList.filter(o => o.status === 'cancelled').length,
      totalSpent: ordersList
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.total || 0), 0)
    };
    setStatistics(stats);
  };

  const loadSampleOrders = () => {
    const sampleOrders = [
      {
        id: 1001,
        studentName: 'John Doe',
        studentId: 'SD2024001',
        email: 'student@gmail.com',
        phone: '0771234567',
        deliveryLocation: 'Canteen Pickup',
        total: 1800,
        status: 'delivered',
        orderDate: '2024-03-15T10:30:00',
        estimatedPickupTime: '10:50 AM',
        items: [
          { name: 'Chicken Biryani', quantity: 1, price: 1250 },
          { name: 'Cappuccino', quantity: 1, price: 550 }
        ],
        trackingUpdates: [
          { time: '2024-03-15T10:30:00', message: 'Order placed successfully' },
          { time: '2024-03-15T10:35:00', message: 'Order confirmed' },
          { time: '2024-03-15T10:45:00', message: 'Order is being prepared' },
          { time: '2024-03-15T10:55:00', message: 'Order is ready for pickup' },
          { time: '2024-03-15T11:10:00', message: 'Order has been delivered' }
        ]
      },
      {
        id: 1002,
        studentName: 'John Doe',
        studentId: 'SD2024001',
        email: 'student@gmail.com',
        phone: '0771234567',
        deliveryLocation: 'Library',
        total: 2550,
        status: 'preparing',
        orderDate: '2024-03-16T13:00:00',
        estimatedPickupTime: '1:25 PM',
        items: [
          { name: 'Margherita Pizza', quantity: 1, price: 1650 },
          { name: 'French Fries', quantity: 2, price: 450 }
        ],
        trackingUpdates: [
          { time: '2024-03-16T13:00:00', message: 'Order placed successfully' },
          { time: '2024-03-16T13:05:00', message: 'Order confirmed' },
          { time: '2024-03-16T13:10:00', message: 'Order is being prepared' }
        ]
      }
    ];
    setOrders(sampleOrders);
    calculateStatsFromOrders(sampleOrders);
  };

  const showNotificationMessage = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const email = getStudentEmail();
        if (!email) return;
        
        const response = await fetch(`${API_BASE_URL}/${orderId}?email=${email}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || data.error || 'Failed to cancel order');
        }
        
        // Remove order from list or update status
        setOrders(orders.filter(order => order.id !== orderId));
        await loadStatistics();
        showNotificationMessage('Order cancelled successfully!', 'success');
        
      } catch (error) {
        console.error('Error cancelling order:', error);
        showNotificationMessage(error.message || 'Failed to cancel order', 'error');
      }
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleNewOrder = () => {
    window.location.href = '/student-canteen';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'preparing': return 'bg-yellow-100 text-yellow-700';
      case 'ready': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'preparing': return <Clock className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'delivered': return 'Delivered';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready for Pickup';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex p-4 bg-white rounded-full mb-4 shadow-lg">
            <div className="w-8 h-8 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0]">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
          <div className={`${notificationType === 'success' ? 'bg-gradient-to-r from-[#22C55E] to-[#16a34a]' : 'bg-gradient-to-r from-red-500 to-red-600'} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-sm`}>
            {notificationType === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{notificationMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1e293b] to-[#0F172A] text-white sticky top-0 z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#22C55E]/20 rounded-2xl backdrop-blur-sm">
                <ShoppingBag className="w-8 h-8 text-[#22C55E]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  My <span className="text-[#22C55E]">Orders</span>
                </h1>
                <p className="text-slate-300 mt-1">Track and manage your food orders</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { loadOrders(); loadStatistics(); }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleNewOrder}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#22C55E] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] rounded-xl transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Make New Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Orders</p>
                <p className="text-2xl font-bold text-[#22C55E]">{statistics.totalOrders}</p>
              </div>
              <Package className="w-8 h-8 text-[#22C55E] opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Orders</p>
                <p className="text-2xl font-bold text-orange-500">
                  {statistics.pendingOrders + statistics.preparingOrders + statistics.readyOrders}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Ready for Pickup</p>
                <p className="text-2xl font-bold text-blue-500">{statistics.readyOrders}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Spent</p>
                <p className="text-2xl font-bold text-purple-500">
                  LKR {statistics.totalSpent.toLocaleString()}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-md">
            <ShoppingBag className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No orders yet</p>
            <p className="text-sm text-slate-400 mt-2">Start ordering your favorite meals!</p>
            <button
              onClick={handleNewOrder}
              className="mt-4 px-6 py-2 bg-[#22C55E] text-white rounded-xl hover:bg-[#16a34a] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Make New Order
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Order Header */}
                <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="font-bold text-[#0F172A] text-lg">Order #{order.id}</p>
                        <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      {(order.status === 'pending' || order.status === 'preparing') && (
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Order Body */}
                <div className="p-5">
                  {/* Items */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">Items Ordered:</p>
                    <div className="space-y-1">
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
                  </div>
                  
                  {/* Delivery Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">Pickup: {order.deliveryLocation || 'Canteen'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">Est. Pickup: {order.estimatedPickupTime || '20-30 min'}</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar for Active Orders */}
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Order Placed</span>
                        <span>Confirmed</span>
                        <span>Preparing</span>
                        <span>Ready</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-[#22C55E] to-[#16a34a] transition-all"
                          style={{ 
                            width: order.status === 'pending' ? '25%' : 
                                   order.status === 'preparing' ? '50%' : 
                                   order.status === 'ready' ? '75%' : '100%'
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#22C55E]" />
                Order Details #{selectedOrder.id}
              </h3>
              <button onClick={() => setShowOrderModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Customer Info */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#22C55E]" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Name</p>
                    <p className="text-sm font-medium">{selectedOrder.studentName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Student ID</p>
                    <p className="text-sm font-medium">{selectedOrder.studentId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm">{selectedOrder.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="text-sm">{selectedOrder.phone}</p>
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#22C55E]" />
                  Items Ordered
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b border-slate-100">
                      <span>{item.name} x {item.quantity}</span>
                      <span>LKR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 font-bold">
                    <span>Total</span>
                    <span className="text-[#22C55E] text-lg">LKR {selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Delivery Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Pickup Location
                  </p>
                  <p className="text-sm font-medium">{selectedOrder.deliveryLocation || 'Canteen'}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Order Status
                  </p>
                  <p className={`inline-flex items-center gap-1 text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {getStatusText(selectedOrder.status)}
                  </p>
                </div>
              </div>
              
              {/* Tracking Timeline */}
              {selectedOrder.trackingUpdates && selectedOrder.trackingUpdates.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#22C55E]" />
                    Order Timeline
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.trackingUpdates.map((update, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-2 h-2 bg-[#22C55E] rounded-full mt-1.5"></div>
                          {idx !== selectedOrder.trackingUpdates.length - 1 && (
                            <div className="absolute top-4 left-0.5 w-0.5 h-8 bg-[#22C55E]/30"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-700">{update.message}</p>
                          <p className="text-xs text-slate-400">{new Date(update.time).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Special Instructions */}
              {selectedOrder.specialInstructions && (
                <div className="bg-yellow-50 rounded-xl p-3">
                  <p className="text-xs text-yellow-700 mb-1">Special Instructions:</p>
                  <p className="text-sm text-yellow-800">{selectedOrder.specialInstructions}</p>
                </div>
              )}
            </div>
            
            <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
              <button onClick={() => setShowOrderModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Close
              </button>
              {(selectedOrder.status === 'pending' || selectedOrder.status === 'preparing') && (
                <button
                  onClick={() => {
                    handleDeleteOrder(selectedOrder.id);
                    setShowOrderModal(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
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

export default StudentOrders;