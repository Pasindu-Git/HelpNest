import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Coffee, 
  Wifi, 
  User, 
  School, 
  Calendar, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Star,
  ChevronRight,
  ArrowRight,
  Image,
  X,
  Clock,
  Check,
  Mail,
  IdCard
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/feedbacks';

const FeedbackManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [sdNumber, setSdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [userReactions, setUserReactions] = useState({});
  const [feedbacks, setFeedbacks] = useState([]);
  const [statistics, setStatistics] = useState({
    totalFeedbacks: 0,
    totalLikes: 0,
    totalDislikes: 0,
    pendingIssues: 0,
    resolvedIssues: 0,
    inProgressIssues: 0,
    categoryCount: {}
  });
  const [loading, setLoading] = useState(true);

  // Category data with icons and descriptions
  const categories = [
    {
      id: 'academic',
      name: 'Academic',
      icon: BookOpen,
      color: '#22C55E',
      bgColor: 'bg-green-50',
      description: 'Courses, curriculum, teaching quality, exams',
      problems: [
        'Course content is outdated',
        'Teaching methodology needs improvement',
        'Exam difficulty too high/low',
        'Assignment workload unreasonable',
        'Lack of practical sessions',
        'Poor feedback on submissions'
      ]
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure',
      icon: School,
      color: '#06B6D4',
      bgColor: 'bg-cyan-50',
      description: 'Classrooms, labs, library, buildings',
      problems: [
        'Classroom equipment not working',
        'Lab computers are slow',
        'Library lacks study space',
        'Poor ventilation in rooms',
        'Maintenance issues',
        'Accessibility concerns'
      ]
    },
    {
      id: 'technology',
      name: 'Technology',
      icon: Wifi,
      color: '#22C55E',
      bgColor: 'bg-green-50',
      description: 'WiFi, portal, digital tools',
      problems: [
        'WiFi connectivity issues',
        'Student portal is slow',
        'Moodle/Canvas problems',
        'LMS not user friendly',
        'Email system glitches',
        'Need better tech support'
      ]
    },
    {
      id: 'facilities',
      name: 'Campus Facilities',
      icon: Coffee,
      color: '#06B6D4',
      bgColor: 'bg-cyan-50',
      description: 'Cafeteria, hostel, transport, sports',
      problems: [
        'Cafeteria food quality',
        'Hostel accommodation issues',
        'Transport schedule problems',
        'Sports facilities inadequate',
        'Medical facilities lacking',
        'Parking space shortage'
      ]
    },
    {
      id: 'administration',
      name: 'Administration',
      icon: User,
      color: '#22C55E',
      bgColor: 'bg-green-50',
      description: 'Staff, processes, support services',
      problems: [
        'Slow administrative processes',
        'Unhelpful staff behavior',
        'Documentation issues',
        'Scholarship delays',
        'Registration problems',
        'Lack of student support'
      ]
    },
    {
      id: 'studentLife',
      name: 'Student Life',
      icon: Calendar,
      color: '#06B6D4',
      bgColor: 'bg-cyan-50',
      description: 'Events, clubs, mental health, culture',
      problems: [
        'Lack of extracurricular activities',
        'Mental health support needed',
        'Campus safety concerns',
        'Communication about events',
        'Student clubs inactive',
        'Career guidance missing'
      ]
    }
  ];

  // Load feedbacks from backend
  useEffect(() => {
    loadFeedbacks();
    loadStatistics();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch feedbacks');
      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics`);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  // Validation functions
  const validateSDNumber = (sd) => {
    const sdRegex = /^SD\d{7}$/;
    if (!sd) return 'SD Number is required';
    if (!sdRegex.test(sd)) return 'SD Number must be in format SD followed by 7 digits (e.g., SD2024001)';
    return '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    if (!email.toLowerCase().endsWith('@gmail.com')) return 'Please use your Gmail email address (must end with @gmail.com)';
    return '';
  };

  const validateFeedback = (text) => {
    if (!text.trim()) return 'Feedback text is required';
    if (text.trim().length < 10) return 'Feedback must be at least 10 characters';
    if (text.trim().length > 500) return 'Feedback cannot exceed 500 characters';
    return '';
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: 'Image size should be less than 5MB' });
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, image: 'Please upload a valid image file' });
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors({ ...errors, image: '' });
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    const sdError = validateSDNumber(sdNumber);
    const emailError = validateEmail(email);
    const feedbackError = validateFeedback(feedbackText);
    
    const newErrors = {};
    if (sdError) newErrors.sdNumber = sdError;
    if (emailError) newErrors.email = emailError;
    if (feedbackError) newErrors.feedback = feedbackError;
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if (!selectedCategory) {
      setErrors({ ...errors, category: 'Please select a category' });
      return;
    }
    
    const feedbackData = {
      category: selectedCategory.id,
      feedbackText: feedbackText,
      sdNumber: sdNumber,
      email: email,
      imageUrl: imagePreview || null
    };
    
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData)
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to submit feedback');
      }
      
      const newFeedback = await response.json();
      setFeedbacks([newFeedback, ...feedbacks]);
      setFeedbackText('');
      setSdNumber('');
      setEmail('');
      setImage(null);
      setImagePreview(null);
      setErrors({});
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      loadStatistics();
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };
  
  const handleReaction = async (feedbackId, type) => {
    const currentReaction = userReactions[feedbackId];
    
    try {
      const response = await fetch(`${API_BASE_URL}/${feedbackId}/reaction`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reactionType: type })
      });
      
      if (!response.ok) throw new Error('Failed to update reaction');
      
      const updatedFeedback = await response.json();
      
      setFeedbacks(feedbacks.map(f => 
        f.id === feedbackId ? updatedFeedback : f
      ));
      
      if (currentReaction === type) {
        setUserReactions({ ...userReactions, [feedbackId]: null });
      } else {
        setUserReactions({ ...userReactions, [feedbackId]: type });
      }
      
      loadStatistics();
    } catch (error) {
      console.error('Error updating reaction:', error);
    }
  };
  
  const getCategoryById = (categoryId) => {
    return categories.find(c => c.id === categoryId);
  };
  
  const filteredFeedbacks = selectedCategory 
    ? feedbacks.filter(f => f.category === selectedCategory.id)
    : feedbacks;
    
  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-orange-100 text-orange-700';
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'resolved': return <Check className="w-3 h-3" />;
      case 'in-progress': return <Clock className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* Header Section */}
      <div className="bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-[#22C55E]/20 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-[#22C55E]" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Student <span className="text-[#22C55E]">Feedback</span> Hub
                </h1>
              </div>
              <p className="text-slate-300 text-lg max-w-2xl">
                Share your thoughts, report issues, and help us build a better campus experience
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5 border border-white/20">
              <ThumbsUp className="w-4 h-4 text-[#22C55E]" />
              <span className="text-sm font-medium">{statistics.totalFeedbacks} feedbacks shared</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {submitted && (
          <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
            <div className="bg-[#22C55E] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Feedback submitted successfully!</span>
            </div>
          </div>
        )}
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Categories & Form */}
          <div className="lg:col-span-1 space-y-6">
            {/* Category Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <h2 className="font-semibold text-[#0F172A] flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#22C55E]" />
                  Categorized Problems
                </h2>
                <p className="text-sm text-slate-500 mt-1">Select a category to share feedback</p>
              </div>
              <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto custom-scroll">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 group ${
                      selectedCategory?.id === category.id
                        ? 'bg-[#22C55E]/10 border-2 border-[#22C55E] shadow-md'
                        : 'bg-slate-50 border-2 border-transparent hover:border-[#22C55E]/30 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${selectedCategory?.id === category.id ? 'bg-[#22C55E] text-white' : 'bg-white text-[#0F172A] shadow-sm'}`}>
                        <category.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-[#0F172A] flex items-center justify-between">
                          {category.name}
                          <ChevronRight className={`w-4 h-4 transition-transform ${selectedCategory?.id === category.id ? 'translate-x-1 text-[#22C55E]' : 'text-slate-400'}`} />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{category.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Feedback Form */}
            {selectedCategory && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 animate-in slide-in-from-left-5 fade-in duration-300">
                <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-[#22C55E]/5 to-transparent">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#22C55E]/10 rounded-lg">
                      <selectedCategory.icon className="w-4 h-4 text-[#22C55E]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0F172A]">Report Issue: {selectedCategory.name}</h3>
                      <p className="text-xs text-slate-500">Please fill all details below</p>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmitFeedback} className="p-5 space-y-4">
                  {/* SD Number */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                      <IdCard className="w-4 h-4" />
                      SD Number
                    </label>
                    <input
                      type="text"
                      value={sdNumber}
                      onChange={(e) => setSdNumber(e.target.value)}
                      placeholder="SD2024001"
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent ${
                        errors.sdNumber ? 'border-red-500 bg-red-50' : 'border-slate-200'
                      }`}
                    />
                    {errors.sdNumber && (
                      <p className="text-xs text-red-500 mt-1">{errors.sdNumber}</p>
                    )}
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@gmail.com"
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent ${
                        errors.email ? 'border-red-500 bg-red-50' : 'border-slate-200'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  {/* Quick Problem Tags */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Common issues in this category</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory.problems.slice(0, 4).map((problem, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFeedbackText(problem)}
                          className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-[#22C55E]/10 text-slate-700 rounded-full transition-colors"
                        >
                          {problem}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Feedback Text */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Your feedback</label>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      rows="4"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent resize-none ${
                        errors.feedback ? 'border-red-500 bg-red-50' : 'border-slate-200'
                      }`}
                      placeholder="Describe the issue or suggestion in detail (min. 10 characters)..."
                    />
                    {errors.feedback && (
                      <p className="text-xs text-red-500 mt-1">{errors.feedback}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      {feedbackText.length}/500 characters
                    </p>
                  </div>
                  
                  {/* Image Upload */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Add Image (Optional)
                    </label>
                    <div className="mt-1 flex items-center gap-4">
                      <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 transition-colors">
                        Choose Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      {imagePreview && (
                        <div className="relative">
                          <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    {errors.image && (
                      <p className="text-xs text-red-500 mt-1">{errors.image}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">Max size: 5MB (JPG, PNG, GIF)</p>
                  </div>
                  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full px-5 py-3 bg-[#22C55E] hover:bg-[#1ea34e] text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    Submit Feedback
                  </button>
                </form>
              </div>
            )}
            
            {/* Stats Card */}
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1e293b] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-5 h-5 text-[#22C55E] fill-[#22C55E]" />
                <h4 className="font-semibold">Impact Tracker</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-[#22C55E]">{statistics.totalFeedbacks}</p>
                  <p className="text-xs text-slate-300">Total Feedbacks</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#06B6D4]">{statistics.totalLikes}</p>
                  <p className="text-xs text-slate-300">Total Likes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-400">{statistics.pendingIssues}</p>
                  <p className="text-xs text-slate-300">Pending Issues</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">{statistics.resolvedIssues}</p>
                  <p className="text-xs text-slate-300">Resolved</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Feedbacks List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-white">
                <div>
                  <h2 className="font-semibold text-[#0F172A] flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#22C55E]" />
                    Recent Feedback
                    {selectedCategory && (
                      <span className="text-sm font-normal text-slate-500 ml-2">
                        - {selectedCategory.name}
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">See what students are saying</p>
                </div>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-sm text-[#06B6D4] hover:text-[#22C55E] flex items-center gap-1 transition-colors"
                  >
                    View all
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
              
              <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto custom-scroll">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
                      <div className="w-8 h-8 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-slate-500">Loading feedbacks...</p>
                  </div>
                ) : filteredFeedbacks.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
                      <MessageSquare className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500">No feedback yet in this category</p>
                    <p className="text-sm text-slate-400 mt-1">Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  filteredFeedbacks.map((feedback) => {
                    const category = getCategoryById(feedback.category);
                    return (
                      <div key={feedback.id} className="p-5 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-xl ${category?.bgColor || 'bg-slate-100'} flex-shrink-0`}>
                            {category && <category.icon className="w-5 h-5" style={{ color: category.color }} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-[#0F172A]">
                                {feedback.studentName}
                              </span>
                              <span className="text-xs text-slate-400">•</span>
                              <span className="text-xs text-slate-500">{feedback.sdNumber}</span>
                              <span className="text-xs text-slate-400">•</span>
                              <span className="text-xs text-slate-500">{feedback.createdAt}</span>
                              {category && (
                                <>
                                  <span className="text-xs text-slate-400">•</span>
                                  <span 
                                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                                    style={{ backgroundColor: `${category.color}15`, color: category.color }}
                                  >
                                    {category.name}
                                  </span>
                                </>
                              )}
                              <span className="text-xs text-slate-400">•</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${getStatusColor(feedback.status)}`}>
                                {getStatusIcon(feedback.status)}
                                {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-slate-700 leading-relaxed">{feedback.text}</p>
                            {feedback.imageUrl && (
                              <div className="mt-3">
                                <img src={feedback.imageUrl} alt="Feedback attachment" className="max-w-full h-48 object-cover rounded-lg border border-slate-200" />
                              </div>
                            )}
                            <div className="mt-3 flex items-center gap-4">
                              <button
                                onClick={() => handleReaction(feedback.id, 'like')}
                                className={`flex items-center gap-1.5 text-sm transition-all ${
                                  userReactions[feedback.id] === 'like'
                                    ? 'text-[#22C55E]'
                                    : 'text-slate-400 hover:text-[#22C55E]'
                                }`}
                              >
                                <ThumbsUp className={`w-4 h-4 ${userReactions[feedback.id] === 'like' ? 'fill-[#22C55E]' : ''}`} />
                                <span>{feedback.likes}</span>
                              </button>
                              <button
                                onClick={() => handleReaction(feedback.id, 'dislike')}
                                className={`flex items-center gap-1.5 text-sm transition-all ${
                                  userReactions[feedback.id] === 'dislike'
                                    ? 'text-red-500'
                                    : 'text-slate-400 hover:text-red-500'
                                }`}
                              >
                                <ThumbsDown className="w-4 h-4" />
                                <span>{feedback.dislikes}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            
            {/* Helpful Tip */}
            <div className="mt-6 bg-gradient-to-r from-[#06B6D4]/5 to-[#22C55E]/5 rounded-xl p-4 border border-[#06B6D4]/20">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-[#22C55E]/10 rounded-lg">
                  <ThumbsUp className="w-4 h-4 text-[#22C55E]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0F172A]">Your voice matters!</p>
                  <p className="text-xs text-slate-600 mt-0.5">All feedback is reviewed by the student affairs committee. Constructive suggestions help improve campus life for everyone.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #22C55E;
          border-radius: 10px;
        }
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
        @keyframes slide-in-from-left-5 {
          from {
            transform: translateX(-10px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animate-in {
          animation-duration: 0.3s;
          animation-fill-mode: both;
        }
        .slide-in-from-right-5 {
          animation-name: slide-in-from-right-5;
        }
        .slide-in-from-left-5 {
          animation-name: slide-in-from-left-5;
        }
        .fade-in {
          animation-name: fade-in;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default FeedbackManagement;