import React from 'react';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin,
  Globe,
  Heart,
  ArrowUp,
  GraduationCap,
  Coffee,
  Armchair,
  MessageSquare,
  BookOpen,
  Home,
  Info,
  Shield,
  Clock,
  Calendar,
  Award,
  Users,
  Zap,
  Sparkles
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About Us', path: '/about', icon: Info },
    { name: 'Study Sessions', path: '/student-registered-sessions', icon: BookOpen },
    { name: 'Slot Reservations', path: '/slot-reservation', icon: Armchair },
    { name: 'Smart Canteen', path: '/student-canteen', icon: Coffee },
    { name: 'Feedback', path: '/feedbacks', icon: MessageSquare },
  ];



  const resourcesLinks = [
    { name: 'Help Center', path: '/help' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Contact Support', path: '/contact' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com', color: '#1877F2' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com', color: '#1DA1F2' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com', color: '#E4405F' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com', color: '#0077B5' },
    { name: 'GitHub', icon: Github, url: 'https://github.com', color: '#333333' },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#0F172A] to-[#1e293b] text-white mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-[#22C55E] to-[#06B6D4] rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Campus Portal</h3>
                <p className="text-xs text-slate-400">Student Hub</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Your one-stop digital platform for managing study sessions, 
              seat reservations, canteen orders, and feedback. Empowering 
              students to excel in their academic journey.
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{ '--hover-color': social.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#22C55E]" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.path}>
                    <a
                      href={link.path}
                      className="text-sm text-slate-300 hover:text-[#22C55E] transition-colors flex items-center gap-2 group"
                    >
                      <Icon className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

        

          {/* Contact & Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#22C55E]" />
              Get in Touch
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-[#22C55E] mt-0.5 flex-shrink-0" />
                <span>123 Campus Road, Colombo 07, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <Mail className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                <a href="mailto:support@campusportal.com" className="hover:text-[#22C55E] transition-colors">
                  support@campusportal.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <Phone className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                <a href="tel:+94123456789" className="hover:text-[#22C55E] transition-colors">
                  +94 11 234 5678
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <Clock className="w-4 h-4 text-[#22C55E] flex-shrink-0" />
                <span>Mon - Fri: 8:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#22C55E]" />
                Stay Updated
              </h3>
              <p className="text-sm text-slate-400">
                Subscribe to our newsletter for updates on new sessions, events, and campus news.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-[#22C55E] to-[#16a34a] rounded-xl font-medium hover:shadow-lg transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span>&copy; {currentYear} Campus Portal. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <a href="/privacy" className="hover:text-[#22C55E] transition-colors">Privacy Policy</a>
              <span className="hidden md:inline">•</span>
              <a href="/terms" className="hover:text-[#22C55E] transition-colors">Terms of Service</a>
              <span className="hidden md:inline">•</span>
              <a href="/sitemap" className="hover:text-[#22C55E] transition-colors">Sitemap</a>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              <span>for students</span>
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-all group"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              Back to Top
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Bar */}
      <div className="h-1 bg-gradient-to-r from-[#22C55E] via-[#06B6D4] to-[#22C55E]"></div>
    </footer>
  );
};

export default Footer;