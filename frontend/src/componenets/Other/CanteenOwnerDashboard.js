import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  LogOut,
  Store,
  TrendingUp,
  DollarSign,
  Package,
  ShoppingBag,
  Utensils,
  Users,
  Star,
  Calendar,
  ArrowRight,
  Shield
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/auth';

const CanteenOwnerDashboard = () => {
  const [owner, setOwner] = useState(null);
  const [statistics, setStatistics] = useState({
    totalItems: 0,
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    averageRating: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  useEffect(() => {
    loadOwnerProfile();
    loadStatistics();
  }, []);

  const loadOwnerProfile = async () => {
    try {
      const session = localStorage.getItem('userSession');
      if (!session) {
        window.location.href = '/login';
        return;
      }

      const userSession = JSON.parse(session);
      if (userSession.userType !== 'canteen_owner') {
        window.location.href = '/login';
        return;
      }

      const ownerId = userSession.id;
      
      const response = await fetch(`${API_BASE_URL}/canteen-owner/profile/${ownerId}`);
      if (!response.ok) throw new Error('Failed to load profile');
      
      const data = await response.json();
      setOwner(data);
    } catch (error) {
      console.error('Error loading profile:', error);
      showNotificationMessage('Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    // Get statistics from localStorage or API
    try {
      const savedItems = localStorage.getItem('canteenFoodItems');
      const savedOrders = localStorage.getItem('studentOrders');
      
      if (savedItems) {
        const items = JSON.parse(savedItems);
        setStatistics(prev => ({ ...prev, totalItems: items.length }));
      }
      
      if (savedOrders) {
        const orders = JSON.parse(savedOrders);
        const totalOrders = orders.length;
        const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        const preparingOrders = orders.filter(o => o.status === 'preparing').length;
        const readyOrders = orders.filter(o => o.status === 'ready').length;
        
        setStatistics(prev => ({
          ...prev,
          totalOrders,
          totalSales,
          pendingOrders,
          preparingOrders,
          readyOrders
        }));
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
      // Set sample data for demo
      setStatistics({
        totalItems: 24,
        totalOrders: 156,
        totalSales: 245000,
        pendingOrders: 8,
        preparingOrders: 12,
        readyOrders: 6,
        averageRating: 4.6,
        totalCustomers: 342
      });
    }
  };

  const showNotificationMessage = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    window.location.href = '/login';
  };

  const handleGoToManagement = () => {
    window.location.href = '/canteen-owner';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex p-4 bg-white rounded-full mb-4 shadow-lg">
            <div className="w-8 h-8 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-500">Loading dashboard...</p>
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
                <Store className="w-8 h-8 text-[#22C55E]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Canteen <span className="text-[#22C55E]">Owner Dashboard</span>
                </h1>
                <p className="text-slate-300 mt-1">Manage your canteen, track orders, and view sales</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { loadOwnerProfile(); loadStatistics(); }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#22C55E] to-[#16a34a] rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {owner?.fullName?.split(' ')[0] || 'Owner'}!</h2>
              <p className="text-white/90">Here's your canteen performance overview.</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Store className="w-12 h-12" />
            </div>
          </div>
        </div>

        {/* Owner Details Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-[#22C55E]" />
              Owner Details
            </h2>
            <p className="text-slate-300 text-sm mt-1">Your personal and account information</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[#0F172A] border-b border-slate-200 pb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#22C55E]" />
                  Personal Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Full Name</p>
                      <p className="text-sm font-medium text-[#0F172A]">{owner?.fullName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Email Address</p>
                      <p className="text-sm font-medium text-[#0F172A]">{owner?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Phone Number</p>
                      <p className="text-sm font-medium text-[#0F172A]">{owner?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[#0F172A] border-b border-slate-200 pb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#22C55E]" />
                  Account Information
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Role</p>
                      <p className="text-sm font-medium text-[#0F172A] capitalize">{owner?.role?.toLowerCase()?.replace('_', ' ')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Member Since</p>
                      <p className="text-sm font-medium text-[#0F172A]">
                        {owner?.createdAt ? new Date(owner.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-600">Account Status: {owner?.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-sm text-slate-600">Verified Owner</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Items</p>
                <p className="text-2xl font-bold text-[#22C55E]">{statistics.totalItems}</p>
              </div>
              <div className="p-3 bg-[#22C55E]/10 rounded-xl">
                <Utensils className="w-6 h-6 text-[#22C55E]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Orders</p>
                <p className="text-2xl font-bold text-[#06B6D4]">{statistics.totalOrders}</p>
              </div>
              <div className="p-3 bg-[#06B6D4]/10 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-[#06B6D4]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Sales</p>
                <p className="text-2xl font-bold text-[#F59E0B]">LKR {statistics.totalSales.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-[#F59E0B]/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-[#F59E0B]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Avg Rating</p>
                <p className="text-2xl font-bold text-purple-500">{statistics.averageRating}</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <Star className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Pending Orders</p>
                <p className="text-3xl font-bold">{statistics.pendingOrders}</p>
              </div>
              <Package className="w-8 h-8 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Preparing Orders</p>
                <p className="text-3xl font-bold">{statistics.preparingOrders}</p>
              </div>
              <Clock className="w-8 h-8 opacity-80" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Ready for Pickup</p>
                <p className="text-3xl font-bold">{statistics.readyOrders}</p>
              </div>
              <CheckCircle className="w-8 h-8 opacity-80" />
            </div>
          </div>
        </div>

        {/* Go to Management Button */}
        <button
          onClick={handleGoToManagement}
          className="w-full py-4 bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all text-lg"
        >
          <Store className="w-5 h-5" />
          Go to Canteen Management
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

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
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default CanteenOwnerDashboard;