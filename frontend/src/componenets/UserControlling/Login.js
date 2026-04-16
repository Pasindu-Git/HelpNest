import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  GraduationCap,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  LogIn,
  Shield,
  Users,
  Building,
  Coffee,
  BookOpen,
  MessageSquare,
  UserCog,
  Utensils,
  Fingerprint,
  Sparkles,
  ShoppingBag,
  TrendingUp
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/auth';

const UnifiedLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('student'); // 'student' or 'staff'
  const [staffRole, setStaffRole] = useState('admin'); // 'admin' or 'canteen'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved email if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedUserType = localStorage.getItem('savedUserType');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
    if (savedUserType) {
      setUserType(savedUserType);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showNotificationMessage = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotificationMessage('Please fix the errors in the form', 'error');
      return;
    }

    setIsLoading(true);

    try {
      let response;
      let data;
      
      if (userType === 'student') {
        // Student Login API call
        response = await fetch(`${API_BASE_URL}/student/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
        
        data = await response.json();
        
        if (response.ok && data.success) {
          // Save student session
          const session = {
            id: data.user.id,
            fullName: data.user.fullName,
            studentId: data.user.studentId,
            email: data.user.email,
            phone: data.user.phone,
            faculty: data.user.faculty,
            yearOfStudy: data.user.yearOfStudy,
            userType: 'student',
            loginTime: new Date().toISOString(),
            isLoggedIn: true
          };
          
          localStorage.setItem('userSession', JSON.stringify(session));
          
          // Save email if remember me is checked
          if (rememberMe) {
            localStorage.setItem('rememberedEmail', formData.email);
            localStorage.setItem('savedUserType', userType);
          } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('savedUserType');
          }
          
          showNotificationMessage(`Welcome back, ${data.user.fullName}! Redirecting to Student Dashboard...`, 'success');
          
          setTimeout(() => {
            window.location.href = '/student-dashboard';
          }, 2000);
        } else {
          showNotificationMessage(data.message || 'Login failed. Please try again.', 'error');
        }
      } else {
        // Staff Login (Admin or Canteen Owner)
        const endpoint = staffRole === 'admin' ? '/admin/login' : '/canteen/login';
        
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
        
        data = await response.json();
        
        if (response.ok && data.success) {
          // Save staff session
          const session = {
            id: data.user.id,
            name: data.user.fullName,
            email: data.user.email,
            role: data.user.role,
            userType: 'staff',
            staffRole: staffRole,
            loginTime: new Date().toISOString(),
            isLoggedIn: true
          };
          
          localStorage.setItem('userSession', JSON.stringify(session));
          
          // Save email if remember me is checked
          if (rememberMe) {
            localStorage.setItem('rememberedEmail', formData.email);
            localStorage.setItem('savedUserType', userType);
            localStorage.setItem('savedStaffRole', staffRole);
          } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('savedUserType');
            localStorage.removeItem('savedStaffRole');
          }
          
          showNotificationMessage(`Welcome back, ${data.user.fullName}! Redirecting to ${staffRole === 'admin' ? 'Admin' : 'Canteen Owner'} Dashboard...`, 'success');
          
          setTimeout(() => {
            if (staffRole === 'admin') {
              window.location.href = '/admin-dashboard';
            } else {
              window.location.href = '/canteen-owner';
            }
          }, 2000);
        } else {
          showNotificationMessage(data.message || 'Login failed. Please try again.', 'error');
        }
      }
      
    } catch (error) {
      console.error('Login error:', error);
      showNotificationMessage('Network error. Please check your connection.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleForgotPassword = () => {
    if (userType === 'student') {
      showNotificationMessage('Password reset link sent to your email!', 'success');
    } else {
      showNotificationMessage('Please contact system administrator to reset your password.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1e293b] to-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#22C55E]/20 rounded-2xl backdrop-blur-sm">
                <GraduationCap className="w-8 h-8 text-[#22C55E]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Campus <span className="text-[#22C55E]">Portal</span>
                </h1>
                <p className="text-slate-300 mt-1">Unified access for students and staff</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Notification */}
        {showNotification && (
          <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
            <div className={`${notificationType === 'success' ? 'bg-gradient-to-r from-[#22C55E] to-[#16a34a]' : notificationType === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-sm max-w-md`}>
              {notificationType === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-medium">{notificationMessage}</span>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* User Type Selection */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#22C55E]/10 to-[#06B6D4]/10 px-6 py-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#22C55E]" />
                  Select User Type
                </h2>
                <p className="text-sm text-slate-600 mt-1">Choose how you want to login</p>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Student Button */}
                <button
                  onClick={() => {
                    setUserType('student');
                    setFormData({ email: '', password: '' });
                    setErrors({});
                  }}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    userType === 'student'
                      ? 'border-[#22C55E] bg-green-50 shadow-md'
                      : 'border-slate-200 hover:border-[#22C55E]/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${userType === 'student' ? 'bg-[#22C55E]' : 'bg-slate-100'}`}>
                      <GraduationCap className={`w-6 h-6 ${userType === 'student' ? 'text-white' : 'text-slate-500'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#0F172A]">Student Login</h3>
                      <p className="text-xs text-slate-500">Access canteen ordering, seat reservation, and feedback</p>
                    </div>
                    {userType === 'student' && (
                      <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                    )}
                  </div>
                </button>

                {/* Staff Button */}
                <button
                  onClick={() => {
                    setUserType('staff');
                    setFormData({ email: '', password: '' });
                    setErrors({});
                  }}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    userType === 'staff'
                      ? 'border-[#22C55E] bg-green-50 shadow-md'
                      : 'border-slate-200 hover:border-[#22C55E]/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${userType === 'staff' ? 'bg-[#22C55E]' : 'bg-slate-100'}`}>
                      <UserCog className={`w-6 h-6 ${userType === 'staff' ? 'text-white' : 'text-slate-500'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#0F172A]">Staff Login</h3>
                      <p className="text-xs text-slate-500">For administrators and canteen owners</p>
                    </div>
                    {userType === 'staff' && (
                      <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                    )}
                  </div>
                </button>

                {/* Staff Role Selection (only show when staff is selected) */}
                {userType === 'staff' && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Select Staff Role</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setStaffRole('admin')}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          staffRole === 'admin'
                            ? 'border-[#22C55E] bg-green-50'
                            : 'border-slate-200 hover:border-[#22C55E]/50'
                        }`}
                      >
                        <Shield className={`w-5 h-5 mx-auto mb-1 ${staffRole === 'admin' ? 'text-[#22C55E]' : 'text-slate-400'}`} />
                        <span className="text-sm font-medium">Administrator</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStaffRole('canteen')}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          staffRole === 'canteen'
                            ? 'border-[#22C55E] bg-green-50'
                            : 'border-slate-200 hover:border-[#22C55E]/50'
                        }`}
                      >
                        <Utensils className={`w-5 h-5 mx-auto mb-1 ${staffRole === 'canteen' ? 'text-[#22C55E]' : 'text-slate-400'}`} />
                        <span className="text-sm font-medium">Canteen Owner</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-slate-200">
                <h3 className="font-semibold text-[#0F172A] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Portal Features
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {userType === 'student' ? (
                  <>
                    <div className="flex items-center gap-3 text-sm">
                      <Coffee className="w-4 h-4 text-[#22C55E]" />
                      <span>Order food from campus canteens</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Building className="w-4 h-4 text-[#06B6D4]" />
                      <span>Reserve study spots across campus</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <MessageSquare className="w-4 h-4 text-purple-500" />
                      <span>Share feedback and suggestions</span>
                    </div>
                  </>
                ) : (
                  <>
                    {staffRole === 'admin' ? (
                      <>
                        <div className="flex items-center gap-3 text-sm">
                          <Shield className="w-4 h-4 text-[#22C55E]" />
                          <span>Manage all campus areas and seats</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Users className="w-4 h-4 text-[#06B6D4]" />
                          <span>View and manage student feedback</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Building className="w-4 h-4 text-purple-500" />
                          <span>Generate reports and analytics</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 text-sm">
                          <Utensils className="w-4 h-4 text-[#22C55E]" />
                          <span>Manage canteen menu items</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <ShoppingBag className="w-4 h-4 text-[#06B6D4]" />
                          <span>View and process student orders</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <TrendingUp className="w-4 h-4 text-purple-500" />
                          <span>Track sales and inventory</span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#22C55E]/10 to-[#06B6D4]/10 px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                <LogIn className="w-5 h-5 text-[#22C55E]" />
                {userType === 'student' ? 'Student Login' : staffRole === 'admin' ? 'Administrator Login' : 'Canteen Owner Login'}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                {userType === 'student' 
                  ? 'Enter your credentials to access student services' 
                  : 'Enter your staff credentials to access the dashboard'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#22C55E]" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] transition-all ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder={userType === 'student' ? "student@gmail.com" : staffRole === 'admin' ? "admin@campus.com" : "canteen@campus.com"}
                  autoComplete="email"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#22C55E]" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] transition-all pr-10 ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#22C55E] rounded border-slate-300 focus:ring-[#22C55E]"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-[#22C55E] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-lg ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Login
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Demo Credentials */}
              <div className="bg-slate-50 rounded-xl p-4 mt-4">
                <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                  <Fingerprint className="w-3 h-3" />
                  Demo Credentials:
                </p>
                {userType === 'student' ? (
                  <>
                    <p className="text-xs text-slate-600">📧 Email: student@gmail.com</p>
                    <p className="text-xs text-slate-600">🔑 Password: Student@123</p>
                    <p className="text-xs text-slate-400 mt-1">*Register first if not available</p>
                  </>
                ) : staffRole === 'admin' ? (
                  <>
                    <p className="text-xs text-slate-600">📧 Email: admin@campus.com</p>
                    <p className="text-xs text-slate-600">🔑 Password: Admin@123</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-slate-600">📧 Email: canteen@campus.com</p>
                    <p className="text-xs text-slate-600">🔑 Password: Canteen@123</p>
                  </>
                )}
              </div>

              {/* Registration Link for Students */}
              {userType === 'student' && (
                <div className="text-center pt-2">
                  <p className="text-sm text-slate-600">
                    Don't have an account?{' '}
                    <a href="/student-register" className="text-[#22C55E] font-semibold hover:underline">
                      Register here
                    </a>
                  </p>
                </div>
              )}
            </form>
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
        .animate-in { animation-duration: 0.3s; animation-fill-mode: both; }
        .slide-in-from-right-5 { animation-name: slide-in-from-right-5; }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default UnifiedLogin;