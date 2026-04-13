import React, { useState, useEffect } from 'react';
import {
  Home,
  Info,
  MessageSquare,
  Calendar,
  Coffee,
  Armchair,
  GraduationCap,
  LogOut,
  LogIn,
  UserPlus,
  User,
  Menu,
  X,
  ChevronDown,
  Bell,
  Settings,
  HelpCircle,
  Sun,
  Moon,
  BookOpen,
  LayoutDashboard,
  Users,
  Shield,
  Zap,
  Globe,
  Heart,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ClipboardList,
  Utensils
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    // Check for user session
    const session = localStorage.getItem('userSession');
    if (session) {
      setUser(JSON.parse(session));
    }

    // Handle scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Set active link based on current path
    setActiveLink(window.location.pathname);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('savedUserType');
    window.location.href = '/student-login';
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About Us', path: '/about', icon: Info },
    { name: 'Study Sessions', path: '/student-sessions', icon: BookOpen },
    { name: 'Slot Reservations', path: '/slot-reservation', icon: Armchair },
    { name: 'Smart Canteen', path: '/student-canteen', icon: Coffee },
    { name: 'Feedback', path: '/feedbacks', icon: MessageSquare },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return activeLink === path;
    }
    return activeLink.startsWith(path);
  };

  return (
    <>
     

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-slate-900/95 shadow-xl backdrop-blur-md' 
          : 'bg-white dark:bg-slate-900 shadow-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 cursor-pointer">
              <div className="p-2 bg-gradient-to-r from-[#22C55E] to-[#06B6D4] rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-[#0F172A] dark:text-white">
                  Campus Portal
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Student Hub</p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.path}
                    href={link.path}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      isActive(link.path)
                        ? 'bg-[#22C55E] text-white shadow-md'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </a>
                );
              })}
            </div>

            {/* User Section */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#22C55E] to-[#06B6D4] flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user.fullName?.charAt(0).toUpperCase() || user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {user.fullName?.split(' ')[0] || user.name?.split(' ')[0] || 'Student'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {user.userType === 'student' ? 'Student' : user.role || 'User'}
                      </p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in slide-in-from-right-5 fade-in duration-200">
                        {/* User Info */}
                        <div className="p-4 bg-gradient-to-r from-[#22C55E]/10 to-[#06B6D4]/10 border-b border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#22C55E] to-[#06B6D4] flex items-center justify-center">
                              <span className="text-white text-lg font-bold">
                                {user.fullName?.charAt(0).toUpperCase() || user.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {user.fullName || user.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {user.email}
                              </p>
                              {user.studentId && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                  ID: {user.studentId}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <a
                            href="/student-dashboard"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </a>
                        
                          <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <a
                    href="/student-login"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </a>
                  <a
                    href="/student-register"
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-[#22C55E] text-white hover:bg-[#16a34a] transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                  </a>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg animate-in slide-in-from-top-5 fade-in duration-200">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(link.path)
                        ? 'bg-[#22C55E] text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </a>
                );
              })}
              
              {/* Quick Links in Mobile */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-2">
                <p className="text-xs text-slate-500 dark:text-slate-400 px-4 pb-2">Quick Links</p>
                <a
                  href="/events"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Calendar className="w-4 h-4" />
                  Events
                </a>
                <a
                  href="/announcements"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Bell className="w-4 h-4" />
                  Announcements
                </a>
                <a
                  href="/help"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <HelpCircle className="w-4 h-4" />
                  Help Center
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @keyframes slide-in-from-right-5 {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slide-in-from-top-5 {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-in {
          animation-duration: 0.2s;
          animation-fill-mode: both;
        }
        .slide-in-from-right-5 {
          animation-name: slide-in-from-right-5;
        }
        .slide-in-from-top-5 {
          animation-name: slide-in-from-top-5;
        }
        .fade-in {
          animation-name: fade-in;
        }
      `}</style>
    </>
  );
};

export default Navbar;