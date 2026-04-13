import React, { useEffect, useState } from 'react';
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
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  ChevronRight
} from 'lucide-react';

const About = () => {
  const [isVisible, setIsVisible] = useState({});

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

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Students', color: '#22C55E' },
    { icon: BookOpen, value: '500+', label: 'Study Sessions', color: '#06B6D4' },
    { icon: Coffee, value: '50+', label: 'Canteen Items', color: '#F59E0B' },
    { icon: Armchair, value: '2,000+', label: 'Seats Available', color: '#8B5CF6' },
    { icon: MessageSquare, value: '1,500+', label: 'Feedbacks', color: '#EC4899' },
    { icon: Calendar, value: '200+', label: 'Events Hosted', color: '#EF4444' },
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Study Sessions',
      description: 'Join collaborative study groups and workshops led by experienced peers and faculty members.',
      color: '#22C55E',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600'
    },
    {
      icon: Armchair,
      title: 'Seat Reservations',
      description: 'Reserve your perfect study spot in advance from multiple campus locations.',
      color: '#06B6D4',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600'
    },
    {
      icon: Coffee,
      title: 'Smart Canteen',
      description: 'Order delicious meals and beverages from campus canteens with easy pickup.',
      color: '#F59E0B',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600'
    },
    {
      icon: MessageSquare,
      title: 'Feedback System',
      description: 'Share your thoughts and suggestions to help improve campus facilities.',
      color: '#EC4899',
      image: 'https://images.unsplash.com/photo-1557425955-df376b5903c8?w=600'
    },
  ];

  const teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Project Director',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Leading educational technology initiatives for over 15 years.',
      social: { linkedin: '#', twitter: '#', email: 'sarah@campusportal.com' }
    },
    {
      name: 'Prof. Michael Chen',
      role: 'Technical Lead',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      bio: 'Full-stack developer passionate about creating meaningful student experiences.',
      social: { linkedin: '#', twitter: '#', email: 'michael@campusportal.com' }
    },
    {
      name: 'Emily Rodriguez',
      role: 'Student Experience',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Former student now dedicated to improving campus life for all.',
      social: { linkedin: '#', twitter: '#', email: 'emily@campusportal.com' }
    },
    {
      name: 'David Kim',
      role: 'Operations Manager',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Ensuring smooth operations and excellent service delivery.',
      social: { linkedin: '#', twitter: '#', email: 'david@campusportal.com' }
    },
  ];

  const values = [
    { icon: Target, title: 'Excellence', description: 'Striving for the highest quality in everything we do.' },
    { icon: Users, title: 'Community', description: 'Building a supportive and inclusive campus environment.' },
    { icon: Lightbulb, title: 'Innovation', description: 'Embracing new technologies to enhance learning.' },
    { icon: Heart, title: 'Care', description: 'Putting student wellbeing at the heart of our services.' },
    { icon: Shield, title: 'Integrity', description: 'Operating with transparency and ethical standards.' },
    { icon: Globe, title: 'Diversity', description: 'Celebrating and respecting all backgrounds and perspectives.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1e293b] to-[#0F172A] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#22C55E] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#06B6D4] rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Sparkles className="w-4 h-4 text-[#22C55E]" />
              <span className="text-sm">About Campus Portal</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-[#22C55E] bg-clip-text text-transparent">
              Transforming Student Life
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We're on a mission to create the ultimate digital ecosystem for students, 
              making campus life more connected, efficient, and enjoyable.
            </p>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#F1F5F9" className="dark:fill-slate-900">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl fade-up">
            <div className="w-14 h-14 bg-[#22C55E]/10 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-7 h-7 text-[#22C55E]" />
            </div>
            <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-3">Our Mission</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              To empower students with innovative digital solutions that streamline academic life, 
              foster collaboration, and create a seamless campus experience for everyone.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl fade-up">
            <div className="w-14 h-14 bg-[#06B6D4]/10 rounded-xl flex items-center justify-center mb-4">
              <Eye className="w-7 h-7 text-[#06B6D4]" />
            </div>
            <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-3">Our Vision</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              To become the leading digital campus platform in Sri Lanka, setting new standards 
              for student engagement and campus management excellence.
            </p>
          </div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${stat.color}20` }}>
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <div className="text-2xl font-bold text-[#0F172A] dark:text-white">{stat.value}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white mb-4">
            What We Offer
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Comprehensive solutions designed to enhance every aspect of student life
          </p>
        </div>
        <div className="space-y-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;
            return (
              <div key={index} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center fade-up`}>
                <div className="flex-1">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${feature.color}20` }}>
                    <Icon className="w-8 h-8" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <a href="#" className="inline-flex items-center gap-2 text-[#22C55E] hover:gap-3 transition-all">
                    Learn more <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
                <div className="flex-1">
                  <div className="rounded-2xl overflow-hidden shadow-xl">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all fade-up">
                  <Icon className="w-10 h-10 text-[#22C55E] mb-3" />
                  <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-slate-400">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Passionate individuals dedicated to improving student life
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all fade-up">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-1">{member.name}</h3>
                <p className="text-sm text-[#22C55E] mb-2">{member.role}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{member.bio}</p>
                <div className="flex gap-3">
                  <a href={member.social.linkedin} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-[#0077B5] hover:text-white transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href={member.social.twitter} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-[#1DA1F2] hover:text-white transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href={`mailto:${member.social.email}`} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-[#22C55E] hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-r from-[#22C55E]/10 to-[#06B6D4]/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] dark:text-white mb-4">
              What Students Say
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Real stories from our campus community
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg fade-up">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  "Campus Portal has completely transformed how I manage my study time. 
                  The seat reservation system is a lifesaver during exam season!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#22C55E] to-[#06B6D4] flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F172A] dark:text-white">John Doe</p>
                    <p className="text-xs text-slate-500">Computer Science, 3rd Year</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-[#22C55E] to-[#06B6D4] rounded-2xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
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

export default About;