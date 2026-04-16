import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  Clock,
  MessageSquare,
  LogOut,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  ChevronRight,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Armchair,
  Award,
  School,
  CalendarDays,
  IdCard,
  Smartphone,
  LocateFixed,
  Building,
  Coffee,
  Home
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/students';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    totalBookings: 0,
    totalEvents: 0,
    totalFeedbacks: 0
  });
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  useEffect(() => {
    loadStudentProfile();
  }, []);

  const loadStudentProfile = async () => {
    try {
      setLoading(true);
      
      // Get session from localStorage
      const session = localStorage.getItem('userSession');
      if (!session) {
        window.location.href = '/login';
        return;
      }
      
      const userSession = JSON.parse(session);
      const studentId = userSession.id;
      
      if (!studentId) {
        window.location.href = '/login';
        return;
      }
      
      // Fetch student profile
      const profileResponse = await fetch(`${API_BASE_URL}/profile/${studentId}`);
      if (!profileResponse.ok) throw new Error('Failed to load profile');
      const profileData = await profileResponse.json();
      setStudent(profileData);
      
      // Fetch student statistics
      const statsResponse = await fetch(`${API_BASE_URL}/statistics/${studentId}`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStatistics(statsData);
      }
      
    } catch (error) {
      console.error('Error loading profile:', error);
      showNotificationMessage('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
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
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('savedUserType');
    window.location.href = '/login';
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: '#22C55E', path: '/student-dashboard' },
    { id: 'orders', label: 'My Food Orders', icon: ShoppingBag, color: '#22C55E', path: '/student-orders' },
    { id: 'bookings', label: 'Seat Reservations', icon: Armchair, color: '#06B6D4', path: '/student-bookings' },
    { id: 'sessions', label: 'Registered Sessions', icon: Calendar, color: '#8B5CF6', path: '/student-registered-sessions' },
    { id: 'feedbacks', label: 'My Feedbacks', icon: MessageSquare, color: '#F59E0B', path: '/student-feedbacks' }
  ];

  const handleNavigation = (path) => {
    window.location.href = path;
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
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] flex">
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
              <GraduationCap className="w-6 h-6 text-[#22C55E]" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h2 className="font-bold text-lg">Campus Portal</h2>
                <p className="text-xs text-slate-400">Student Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Student Info */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#22C55E] to-[#16a34a] flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="font-semibold text-sm truncate">{student?.fullName || 'Student Name'}</p>
                <p className="text-xs text-slate-400">{student?.studentId || 'SD2024001'}</p>
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
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-slate-800/50 group`}
              >
                <Icon className="w-5 h-5" style={{ color: item.color }} />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium flex-1 text-left text-slate-300 group-hover:text-white">
                    {item.label}
                  </span>
                )}
                {!sidebarCollapsed && (
                  <ChevronRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
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
          className="absolute -right-3 top-24 bg-white rounded-full p-1 shadow-md border border-slate-200"
        >
          <ChevronRight className={`w-4 h-4 text-slate-600 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#0F172A]">Student Profile</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Welcome back, {student?.fullName?.split(' ')[0] || 'Student'}!
                </p>
              </div>
              <button
                onClick={loadStudentProfile}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area - Student Registration Details */}
        <div className="p-8">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-[#22C55E] to-[#16a34a] rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome to Campus Portal!</h2>
                <p className="text-white/90">Your student profile information is displayed below.</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl">
                <GraduationCap className="w-12 h-12" />
              </div>
            </div>
          </div>

          {/* Student Details Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-[#22C55E]" />
                Student Registration Details
              </h2>
              <p className="text-slate-300 text-sm mt-1">Your personal and academic information</p>
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
                        <p className="text-sm font-medium text-[#0F172A]">{student?.fullName || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <IdCard className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500">Student ID</p>
                        <p className="text-sm font-medium text-[#0F172A]">{student?.studentId || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500">Email Address</p>
                        <p className="text-sm font-medium text-[#0F172A]">{student?.email || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Smartphone className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500">Phone Number</p>
                        <p className="text-sm font-medium text-[#0F172A]">{student?.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#0F172A] border-b border-slate-200 pb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#22C55E]" />
                    Academic Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <School className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500">Faculty</p>
                        <p className="text-sm font-medium text-[#0F172A]">{student?.faculty || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CalendarDays className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500">Year of Study</p>
                        <p className="text-sm font-medium text-[#0F172A]">{student?.yearOfStudy || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500">Batch</p>
                        <p className="text-sm font-medium text-[#0F172A]">{student?.batch || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500">Campus</p>
                        <p className="text-sm font-medium text-[#0F172A]">Main Campus, Colombo</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#22C55E]" />
                  Address
                </h3>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-700">{student?.address || 'No address provided'}</p>
                </div>
              </div>

              {/* Account Status */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-600">Account Status: {student?.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                    <span className="text-sm text-slate-600">Email {student?.isVerified ? 'Verified' : 'Not Verified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-slate-600">Member since: {student?.registeredAt ? new Date(student.registeredAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Total Orders</p>
                  <p className="text-2xl font-bold text-[#22C55E]">{statistics.totalOrders}</p>
                </div>
                <ShoppingBag className="w-8 h-8 text-[#22C55E] opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Seat Bookings</p>
                  <p className="text-2xl font-bold text-[#06B6D4]">{statistics.totalBookings}</p>
                </div>
                <Armchair className="w-8 h-8 text-[#06B6D4] opacity-50" />
              </div>
            </div>
        
            <div className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Feedbacks Given</p>
                  <p className="text-2xl font-bold text-[#F59E0B]">{statistics.totalFeedbacks}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-[#F59E0B] opacity-50" />
              </div>
            </div>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <button
              onClick={() => handleNavigation('/student-orders')}
              className="bg-gradient-to-r from-[#22C55E] to-[#16a34a] p-4 rounded-xl text-white text-left hover:shadow-lg transition-all"
            >
              <ShoppingBag className="w-6 h-6 mb-2" />
              <p className="font-semibold">My Orders</p>
              <p className="text-xs opacity-90">Track your food orders</p>
            </button>
            
            <button
              onClick={() => handleNavigation('/student-bookings')}
              className="bg-gradient-to-r from-[#06B6D4] to-[#0891b2] p-4 rounded-xl text-white text-left hover:shadow-lg transition-all"
            >
              <Armchair className="w-6 h-6 mb-2" />
              <p className="font-semibold">Seat Bookings</p>
              <p className="text-xs opacity-90">View your reservations</p>
            </button>
            
            <button
              onClick={() => handleNavigation('/student-events')}
              className="bg-gradient-to-r from-[#8B5CF6] to-[#7c3aed] p-4 rounded-xl text-white text-left hover:shadow-lg transition-all"
            >
              <Calendar className="w-6 h-6 mb-2" />
              <p className="font-semibold">My Sessions</p>
              <p className="text-xs opacity-90">Registered sessions</p>
            </button>
            
            <button
              onClick={() => handleNavigation('/student-feedbacks')}
              className="bg-gradient-to-r from-[#F59E0B] to-[#d97706] p-4 rounded-xl text-white text-left hover:shadow-lg transition-all"
            >
              <MessageSquare className="w-6 h-6 mb-2" />
              <p className="font-semibold">My Feedbacks</p>
              <p className="text-xs opacity-90">View feedback history</p>
            </button>
          </div>
        </div>
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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-in { animation-duration: 0.3s; animation-fill-mode: both; }
        .slide-in-from-right-5 { animation-name: slide-in-from-right-5; }
        .animate-spin { animation: spin 1s linear infinite; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
};

export default StudentDashboard;