import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  MapPin,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X,
  User,
  Mail,
  Phone,
  Shield,
  Award,
  TrendingUp,
  BookOpen,
  Coffee,
  Armchair,
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

// Import admin components
import AdminSessionManagement from '../sessionManagemnt/Adminstudysession';
import AdminFeedbackManagement from '../FeedBackManagemnt/AdminDashboardFeedback';
import AdminAreaManagement from '../Seatbooking/AdminAreaManagement';

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [admin, setAdmin] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [statistics, setStatistics] = useState({
    totalSessions: 0,
    totalFeedbacks: 0,
    totalAreas: 0,
    totalSeats: 0,
    pendingFeedbacks: 0,
    upcomingSessions: 0,
    totalRegistrations: 0,
    averageRating: 0
  });

  useEffect(() => {
    // Get admin from session
    const session = localStorage.getItem('userSession');
    if (session) {
      const userSession = JSON.parse(session);
      if (userSession.userType === 'staff' && userSession.staffRole === 'admin') {
        setAdmin(userSession);
      } else {
        window.location.href = '/login';
      }
    } else {
      window.location.href = '/login';
    }
    
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    // Simulate loading statistics
    setTimeout(() => {
      setStatistics({
        totalSessions: 24,
        totalFeedbacks: 156,
        totalAreas: 9,
        totalSeats: 248,
        pendingFeedbacks: 12,
        upcomingSessions: 8,
        totalRegistrations: 342,
        averageRating: 4.6
      });
    }, 500);
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

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#22C55E', path: '/admin-dashboard' },
    { id: 'sessions', label: 'Study Sessions', icon: Calendar, color: '#06B6D4', path: '/admin-sessions' },
    { id: 'feedback', label: 'Feedback Management', icon: MessageSquare, color: '#F59E0B', path: '/admin-feedback' },
    { id: 'areas', label: 'Area Management', icon: MapPin, color: '#8B5CF6', path: '/admin-areas' },
  ];

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    if (item.path !== '/admin-dashboard') {
      window.location.href = item.path;
    }
  };

  const renderDashboardContent = () => {
    return (
      <div className="p-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#22C55E] to-[#06B6D4] rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {admin?.name || 'Admin'}!</h2>
              <p className="text-white/90">Here's what's happening with your campus today.</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl">
              <Shield className="w-12 h-12" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Sessions</p>
                <p className="text-3xl font-bold text-[#0F172A] dark:text-white">{statistics.totalSessions}</p>
              </div>
              <div className="p-3 bg-[#22C55E]/10 rounded-xl">
                <Calendar className="w-6 h-6 text-[#22C55E]" />
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600">+{statistics.upcomingSessions} upcoming</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Feedbacks</p>
                <p className="text-3xl font-bold text-[#0F172A] dark:text-white">{statistics.totalFeedbacks}</p>
              </div>
              <div className="p-3 bg-[#F59E0B]/10 rounded-xl">
                <MessageSquare className="w-6 h-6 text-[#F59E0B]" />
              </div>
            </div>
            <div className="mt-2 text-xs text-orange-600">{statistics.pendingFeedbacks} pending review</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Areas</p>
                <p className="text-3xl font-bold text-[#0F172A] dark:text-white">{statistics.totalAreas}</p>
              </div>
              <div className="p-3 bg-[#8B5CF6]/10 rounded-xl">
                <MapPin className="w-6 h-6 text-[#8B5CF6]" />
              </div>
            </div>
            <div className="mt-2 text-xs text-purple-600">{statistics.totalSeats} total seats</div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Avg Rating</p>
                <p className="text-3xl font-bold text-[#0F172A] dark:text-white">{statistics.averageRating}</p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <div className="mt-2 text-xs text-yellow-600">From {statistics.totalFeedbacks} reviews</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => handleNavigation({ id: 'sessions', path: '/admin-sessions' })}
            className="bg-gradient-to-r from-[#06B6D4] to-[#0891b2] p-5 rounded-xl text-white text-left hover:shadow-lg transition-all group"
          >
            <Calendar className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-lg">Manage Sessions</p>
            <p className="text-sm opacity-90">Create and manage study sessions</p>
          </button>

          <button
            onClick={() => handleNavigation({ id: 'feedback', path: '/admin-feedback' })}
            className="bg-gradient-to-r from-[#F59E0B] to-[#d97706] p-5 rounded-xl text-white text-left hover:shadow-lg transition-all group"
          >
            <MessageSquare className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-lg">Review Feedbacks</p>
            <p className="text-sm opacity-90">Respond to student feedback</p>
          </button>

          <button
            onClick={() => handleNavigation({ id: 'areas', path: '/admin-areas' })}
            className="bg-gradient-to-r from-[#8B5CF6] to-[#7c3aed] p-5 rounded-xl text-white text-left hover:shadow-lg transition-all group"
          >
            <MapPin className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-lg">Manage Areas</p>
            <p className="text-sm opacity-90">Configure study areas and seats</p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-[#0F172A] dark:text-white">Recent Activity</h3>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {[
              { action: 'New feedback received', details: 'Academic category - 5 star rating', time: '5 minutes ago', icon: MessageSquare, color: '#F59E0B' },
              { action: 'Session registration', details: '15 students joined OOP session', time: '1 hour ago', icon: Calendar, color: '#06B6D4' },
              { action: 'Area updated', details: 'Library Floor 3 layout modified', time: '3 hours ago', icon: MapPin, color: '#8B5CF6' },
              { action: 'New session created', details: 'Web Development workshop added', time: '5 hours ago', icon: Calendar, color: '#22C55E' },
            ].map((activity, idx) => {
              const Icon = activity.icon;
              return (
                <div key={idx} className="px-6 py-4 flex items-center gap-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${activity.color}15` }}>
                    <Icon className="w-4 h-4" style={{ color: activity.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#0F172A] dark:text-white">{activity.action}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{activity.details}</p>
                  </div>
                  <p className="text-xs text-slate-400">{activity.time}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] dark:from-slate-900 dark:to-slate-800 flex">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
          <div className={`${notificationType === 'success' ? 'bg-gradient-to-r from-[#22C55E] to-[#16a34a]' : 'bg-gradient-to-r from-red-500 to-red-600'} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-sm`}>
            {notificationType === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{notificationMessage}</span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-gradient-to-b from-[#0F172A] to-[#1e293b] text-white transition-all duration-300 flex flex-col shadow-2xl relative`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#22C55E]/20 rounded-xl">
              <Shield className="w-6 h-6 text-[#22C55E]" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h2 className="font-bold text-lg">Admin Portal</h2>
                <p className="text-xs text-slate-400">Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Admin Info */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#22C55E] to-[#06B6D4] flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="font-semibold text-sm">{admin?.name || 'Administrator'}</p>
                <p className="text-xs text-slate-400">System Admin</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-[#22C55E] to-[#16a34a] shadow-lg'
                    : 'hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-5 h-5" style={{ color: item.color }} />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium flex-1 text-left text-slate-300 group-hover:text-white">
                    {item.label}
                  </span>
                )}
                {!sidebarCollapsed && activeTab === item.id && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 transition-all text-red-400 hover:text-red-300"
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-24 bg-white dark:bg-slate-800 rounded-full p-1 shadow-md border border-slate-200 dark:border-slate-700"
        >
          <ChevronRight className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#0F172A] dark:text-white">
                  {sidebarItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Welcome to your admin dashboard
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5 text-slate-500" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'dashboard' && renderDashboardContent()}
        {activeTab === 'sessions' && <AdminSessionManagement />}
        {activeTab === 'feedback' && <AdminFeedbackManagement />}
        {activeTab === 'areas' && <AdminAreaManagement />}
      </div>

      <style>{`
        @keyframes slide-in-from-right-5 {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-in { animation-duration: 0.3s; animation-fill-mode: both; }
        .slide-in-from-right-5 { animation-name: slide-in-from-right-5; }
        .fade-in { animation-name: fade-in; }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;