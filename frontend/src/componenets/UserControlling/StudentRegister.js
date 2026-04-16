import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Phone, 
  MapPin, 
  GraduationCap,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  UserPlus,
  BookOpen,
  Coffee,
  Home,
  Building
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/students';

const StudentRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    faculty: '',
    yearOfStudy: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const faculties = [
    'Faculty of Computing',
    'Faculty of Engineering',
    'Faculty of Business',
    'Faculty of Science',
    'Faculty of Humanities',
    'Faculty of Medicine'
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Final Year'];

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      newErrors.fullName = 'Name can only contain letters and spaces';
    }

    // Student ID validation
    if (!formData.studentId) {
      newErrors.studentId = 'Student ID is required';
    } else if (!/^SD\d{7}$/.test(formData.studentId)) {
      newErrors.studentId = 'Student ID must be format SD followed by 7 digits (e.g., SD2024001)';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      newErrors.email = 'Please use your Gmail email address (@gmail.com)';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Faculty validation
    if (!formData.faculty) {
      newErrors.faculty = 'Please select your faculty';
    }

    // Year of Study validation
    if (!formData.yearOfStudy) {
      newErrors.yearOfStudy = 'Please select your year of study';
    }

    // Terms agreement
    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showNotificationMessage = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotificationMessage('Please fix the errors in the form', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          studentId: formData.studentId,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          faculty: formData.faculty,
          yearOfStudy: formData.yearOfStudy,
          address: formData.address
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Registration failed');
      }

      if (data.success) {
        showNotificationMessage(data.message || 'Registration successful! Please check your email to verify your account.', 'success');
        
        // Clear form
        setFormData({
          fullName: '',
          studentId: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          faculty: '',
          yearOfStudy: '',
          address: ''
        });
        setAgreeTerms(false);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          window.location.href = '/student-login';
        }, 3000);
      } else {
        showNotificationMessage(data.message || 'Registration failed', 'error');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      showNotificationMessage(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
                  Student <span className="text-[#22C55E]">Registration</span>
                </h1>
                <p className="text-slate-300 mt-1">Create your account to access campus services</p>
              </div>
            </div>
            <a 
              href="/student-login" 
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            >
              <User className="w-4 h-4" />
              Already have an account? Login
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Notification */}
        {showNotification && (
          <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
            <div className={`${notificationType === 'success' ? 'bg-gradient-to-r from-[#22C55E] to-[#16a34a]' : 'bg-gradient-to-r from-red-500 to-red-600'} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-sm max-w-md`}>
              {notificationType === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-medium whitespace-pre-line">{notificationMessage}</span>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#22C55E]/10 to-[#06B6D4]/10 px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#22C55E]" />
              Create New Account
            </h2>
            <p className="text-sm text-slate-600 mt-1">Fill in your details to register as a student</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                  <User className="w-4 h-4 text-[#22C55E]" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] transition-all ${
                    errors.fullName ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              {/* Student ID */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#22C55E]" />
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] transition-all ${
                    errors.studentId ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="SD2024001"
                  disabled={isLoading}
                />
                {errors.studentId && <p className="text-xs text-red-500 mt-1">{errors.studentId}</p>}
                <p className="text-xs text-slate-400 mt-1">Format: SD followed by 7 digits</p>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#22C55E]" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] transition-all ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="student@gmail.com"
                  disabled={isLoading}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                <p className="text-xs text-slate-400 mt-1">Verification email will be sent to this address</p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#22C55E]" />
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] transition-all ${
                    errors.phone ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="0771234567"
                  disabled={isLoading}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                <p className="text-xs text-slate-400 mt-1">Enter 10-digit phone number</p>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#22C55E]" />
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] transition-all pr-10 ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="Create a password"
                    disabled={isLoading}
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
                <p className="text-xs text-slate-400 mt-1">Minimum 6 characters with uppercase, lowercase, and number</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#22C55E]" />
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] transition-all pr-10 ${
                      errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Faculty */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#22C55E]" />
                  Faculty <span className="text-red-500">*</span>
                </label>
                <select
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] transition-all ${
                    errors.faculty ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  disabled={isLoading}
                >
                  <option value="">Select your faculty</option>
                  {faculties.map(faculty => (
                    <option key={faculty} value={faculty}>{faculty}</option>
                  ))}
                </select>
                {errors.faculty && <p className="text-xs text-red-500 mt-1">{errors.faculty}</p>}
              </div>

              {/* Year of Study */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#22C55E]" />
                  Year of Study <span className="text-red-500">*</span>
                </label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] transition-all ${
                    errors.yearOfStudy ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  disabled={isLoading}
                >
                  <option value="">Select your year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.yearOfStudy && <p className="text-xs text-red-500 mt-1">{errors.yearOfStudy}</p>}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#22C55E]" />
                  Address (Optional)
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] transition-all resize-none"
                  placeholder="Enter your address (optional)"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-[#22C55E] rounded border-slate-300 focus:ring-[#22C55E]"
                disabled={isLoading}
              />
              <label htmlFor="agreeTerms" className="text-sm text-slate-600">
                I agree to the <a href="#" className="text-[#22C55E] hover:underline">Terms and Conditions</a> and 
                <a href="#" className="text-[#22C55E] hover:underline ml-1">Privacy Policy</a>
              </label>
            </div>
            {errors.agreeTerms && <p className="text-xs text-red-500 mt-1">{errors.agreeTerms}</p>}

            {/* Submit Button */}
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
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Register Now
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Login Link for Mobile */}
            <div className="text-center pt-4 border-t border-slate-200 md:hidden">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <a href="/student-login" className="text-[#22C55E] font-semibold hover:underline">
                  Login here
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Coffee className="w-5 h-5 text-[#22C55E]" />
              </div>
              <h3 className="font-semibold text-[#0F172A]">Canteen Orders</h3>
            </div>
            <p className="text-sm text-slate-500">Order food from campus canteens easily</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="w-5 h-5 text-[#06B6D4]" />
              </div>
              <h3 className="font-semibold text-[#0F172A]">Seat Reservation</h3>
            </div>
            <p className="text-sm text-slate-500">Reserve study spots across campus</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Home className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="font-semibold text-[#0F172A]">Feedback System</h3>
            </div>
            <p className="text-sm text-slate-500">Share your feedback and suggestions</p>
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

export default StudentRegister;