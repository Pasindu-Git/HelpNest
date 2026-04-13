import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  Coffee,
  Armchair,
  BookOpen,
  MessageSquare,
  Calendar,
  Clock,
  Award,
  Heart,
  Globe,
  Zap,
  Shield,
  Sparkles,
  Target,
  Eye,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  ThumbsUp,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Quote
} from 'lucide-react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState({});

  const slides = [
    {
      id: 1,
      title: 'Welcome to Campus Portal',
      subtitle: 'Your Digital Campus Hub',
      description: 'Access study sessions, reserve seats, order food, and manage your academic life all in one place.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200',
      color: '#22C55E',
      buttonText: 'Explore Now',
      buttonLink: '/student-dashboard'
    },
    {
      id: 2,
      title: 'Study Smarter Together',
      subtitle: 'Join Study Sessions',
      description: 'Collaborate with peers, attend workshops, and enhance your learning experience with our study groups.',
      image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200',
      color: '#06B6D4',
      buttonText: 'Find Sessions',
      buttonLink: '/student-registered-sessions'
    },
    {
      id: 3,
      title: 'Reserve Your Perfect Spot',
      subtitle: 'Smart Seat Booking',
      description: 'Book study spaces across campus in advance. Never worry about finding a place to study again.',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200',
      color: '#8B5CF6',
      buttonText: 'Book Now',
      buttonLink: '/slot-reservation'
    },
    {
      id: 4,
      title: 'Delicious Meals, Fast Service',
      subtitle: 'Smart Canteen',
      description: 'Order your favorite meals from campus canteens with our easy-to-use ordering system.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200',
      color: '#F59E0B',
      buttonText: 'Order Food',
      buttonLink: '/student-canteen'
    },
    {
      id: 5,
      title: 'Your Voice Matters',
      subtitle: 'Share Feedback',
      description: 'Help us improve campus facilities by sharing your thoughts and suggestions.',
      image: 'https://images.unsplash.com/photo-1557425955-df376b5903c8?w=1200',
      color: '#EC4899',
      buttonText: 'Give Feedback',
      buttonLink: '/feedbacks'
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Study Sessions',
      description: 'Join collaborative study groups and workshops led by experienced peers.',
      color: '#22C55E',
      link: '/student-registered-sessions'
    },
    {
      icon: Armchair,
      title: 'Seat Reservations',
      description: 'Reserve your perfect study spot in advance from multiple campus locations.',
      color: '#06B6D4',
      link: '/slot-reservation'
    },
    {
      icon: Coffee,
      title: 'Smart Canteen',
      description: 'Order delicious meals from campus canteens with easy pickup options.',
      color: '#F59E0B',
      link: '/student-canteen'
    },
    {
      icon: MessageSquare,
      title: 'Feedback System',
      description: 'Share your thoughts and help improve campus facilities and services.',
      color: '#EC4899',
      link: '/feedbacks'
    },
    {
      icon: Calendar,
      title: 'Events & Workshops',
      description: 'Stay updated with upcoming campus events and professional workshops.',
      color: '#8B5CF6',
      link: '/events'
    },
    {
      icon: Award,
      title: 'Achievements',
      description: 'Track your progress and earn recognition for your participation.',
      color: '#EF4444',
      link: '/achievements'
    }
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Students', color: '#22C55E' },
    { icon: BookOpen, value: '500+', label: 'Study Sessions', color: '#06B6D4' },
    { icon: Coffee, value: '50+', label: 'Canteen Items', color: '#F59E0B' },
    { icon: Armchair, value: '2,000+', label: 'Seats Available', color: '#8B5CF6' },
  ];

  const testimonials = [
    {
      name: 'John Doe',
      role: 'Computer Science, 3rd Year',
      text: 'Campus Portal has completely transformed how I manage my study time. The seat reservation system is a lifesaver during exam season!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
    },
    {
      name: 'Jane Smith',
      role: 'Engineering, 2nd Year',
      text: 'The canteen ordering system is amazing! I can order my favorite meals ahead of time and skip the queues.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    {
      name: 'Mike Wilson',
      role: 'Business, Final Year',
      text: 'Study sessions have helped me connect with peers and improve my grades significantly. Highly recommended!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
    }
  ];

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-up');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        if (isVisible) {
          el.classList.add('visible');
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] dark:from-slate-900 dark:to-slate-800">
      {/* Hero Carousel Section */}
      <div className="relative h-screen min-h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            
            {/* Content */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-3xl animate-fade-in-up">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
                    <Sparkles className="w-4 h-4" style={{ color: slide.color }} />
                    <span className="text-sm text-white">{slide.subtitle}</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl">
                    {slide.description}
                  </p>
                  <a
                    href={slide.buttonLink}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg transform hover:scale-105"
                    style={{ backgroundColor: slide.color }}
                  >
                    {slide.buttonText}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 h-2 bg-white rounded-full'
                  : 'w-2 h-2 bg-white/50 rounded-full hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Auto-play Toggle */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="absolute bottom-8 right-8 z-30 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
        >
          {isAutoPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
        </button>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12 fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#22C55E]/10 mb-4">
            <Sparkles className="w-4 h-4 text-[#22C55E]" />
            <span className="text-sm text-[#22C55E] font-medium">What We Offer</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white mb-4">
            Everything You Need in One Place
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Comprehensive solutions designed to enhance every aspect of student life
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <a
                key={index}
                href={feature.link}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <Icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center gap-1 text-[#22C55E] font-medium">
                  Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-[#22C55E]/10 to-[#06B6D4]/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Making a difference across the campus community
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${stat.color}15` }}>
                    <Icon className="w-8 h-8" style={{ color: stat.color }} />
                  </div>
                  <div className="text-3xl font-bold text-[#0F172A] dark:text-white">{stat.value}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12 fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Simple steps to get started with Campus Portal
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center fade-up">
            <div className="w-20 h-20 mx-auto bg-[#22C55E]/10 rounded-2xl flex items-center justify-center mb-4 relative">
              <span className="text-2xl font-bold text-[#22C55E]">1</span>
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
                <ArrowRight className="w-6 h-6 text-slate-300" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-2">Register Account</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Create your student account with your email and student ID.
            </p>
          </div>
          <div className="text-center fade-up">
            <div className="w-20 h-20 mx-auto bg-[#06B6D4]/10 rounded-2xl flex items-center justify-center mb-4 relative">
              <span className="text-2xl font-bold text-[#06B6D4]">2</span>
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block">
                <ArrowRight className="w-6 h-6 text-slate-300" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-2">Explore Services</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Browse through study sessions, book seats, or order food.
            </p>
          </div>
          <div className="text-center fade-up">
            <div className="w-20 h-20 mx-auto bg-[#F59E0B]/10 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-[#F59E0B]">3</span>
            </div>
            <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-2">Enjoy Benefits</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Make the most of campus facilities and enhance your student life.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-4">
              <Quote className="w-4 h-4 text-[#22C55E]" />
              <span className="text-sm text-white">Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Students Say
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Real stories from our campus community
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all fade-up">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-xs text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-[#22C55E] to-[#06B6D4] rounded-2xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of students already using Campus Portal to enhance their academic journey.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/student-register" className="px-6 py-3 bg-white text-[#22C55E] rounded-xl font-semibold hover:shadow-lg transition-all">
                Register Now
              </a>
              <a href="/student-login" className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-all">
                Login to Account
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .fade-up {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default Home;