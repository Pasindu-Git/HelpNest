import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Edit,
  Trash2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  BookOpen,
  Coffee,
  School,
  Wifi,
  Home,
  Building,
  Star,
  Send,
  X,
  Save,
  ChevronRight,
  Image as ImageIcon,
  ZoomIn
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/feedbacks';

const StudentFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    id: null,
    text: '',
    category: '',
    imagePreview: null,
    imageFile: null
  });
  const [formErrors, setFormErrors] = useState({});

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'academic', name: 'Academic', icon: BookOpen, color: '#22C55E' },
    { id: 'infrastructure', name: 'Infrastructure', icon: Building, color: '#06B6D4' },
    { id: 'technology', name: 'Technology', icon: Wifi, color: '#22C55E' },
    { id: 'facilities', name: 'Campus Facilities', icon: Home, color: '#06B6D4' },
    { id: 'administration', name: 'Administration', icon: User, color: '#22C55E' },
    { id: 'studentLife', name: 'Student Life', icon: Coffee, color: '#06B6D4' }
  ];

  const statuses = [
    { id: 'all', name: 'All Status' },
    { id: 'pending', name: 'Pending', color: 'bg-orange-100 text-orange-700' },
    { id: 'in-progress', name: 'In Progress', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'resolved', name: 'Resolved', color: 'bg-green-100 text-green-700' },
    { id: 'rejected', name: 'Rejected', color: 'bg-red-100 text-red-700' }
  ];

  const getStudentEmail = () => {
    const session = localStorage.getItem('userSession');
    if (session) {
      const userSession = JSON.parse(session);
      return userSession.email;
    }
    return null;
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  useEffect(() => {
    filterFeedbacks();
  }, [feedbacks, searchTerm, filterCategory, filterStatus]);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const email = getStudentEmail();
      
      if (!email) {
        window.location.href = '/login';
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/student/${email}`);
      
      if (!response.ok) throw new Error('Failed to load feedbacks');
      
      const data = await response.json();
      setFeedbacks(data);
      
    } catch (error) {
      console.error('Error loading feedbacks:', error);
      showNotificationMessage('Failed to load feedbacks', 'error');
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

  const filterFeedbacks = () => {
    let filtered = [...feedbacks];
    
    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(f => f.category === filterCategory);
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(f => f.status === filterStatus);
    }
    
    setFilteredFeedbacks(filtered);
  };

  const validateEditForm = () => {
    const errors = {};
    if (!editForm.text.trim()) {
      errors.text = 'Feedback text is required';
    } else if (editForm.text.trim().length < 10) {
      errors.text = 'Feedback must be at least 10 characters';
    } else if (editForm.text.trim().length > 500) {
      errors.text = 'Feedback cannot exceed 500 characters';
    }
    if (!editForm.category) {
      errors.category = 'Category is required';
    }
    return errors;
  };

  const handleEditFeedback = (feedback) => {
    setEditForm({
      id: feedback.id,
      text: feedback.text,
      category: feedback.category,
      imagePreview: feedback.imageUrl || null,
      imageFile: null
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotificationMessage('Image size should be less than 5MB', 'error');
        return;
      }
      if (!file.type.startsWith('image/')) {
        showNotificationMessage('Please upload a valid image file', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, imagePreview: reader.result, imageFile: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setEditForm({ ...editForm, imagePreview: null, imageFile: null });
  };

  const handleUpdateFeedback = async () => {
    const errors = validateEditForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotificationMessage('Please fix the errors in the form', 'error');
      return;
    }
    
    try {
      const email = getStudentEmail();
      const updateData = {
        category: editForm.category,
        text: editForm.text,
        email: email,
        imageUrl: editForm.imagePreview || null
      };
      
      const response = await fetch(`${API_BASE_URL}/${editForm.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update feedback');
      }
      
      await loadFeedbacks();
      showNotificationMessage('Feedback updated successfully!', 'success');
      setShowEditModal(false);
      
    } catch (error) {
      console.error('Error updating feedback:', error);
      showNotificationMessage(error.message || 'Failed to update feedback', 'error');
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      try {
        const email = getStudentEmail();
        const response = await fetch(`${API_BASE_URL}/${feedbackId}?email=${email}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to delete feedback');
        }
        
        await loadFeedbacks();
        showNotificationMessage('Feedback deleted successfully!', 'success');
        
      } catch (error) {
        console.error('Error deleting feedback:', error);
        showNotificationMessage(error.message || 'Failed to delete feedback', 'error');
      }
    }
  };

  const handleViewFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setShowViewModal(true);
  };

  const handleNewFeedback = () => {
    window.location.href = '/feedbacks';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-orange-100 text-orange-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'resolved': return <CheckCircle className="w-3 h-3" />;
      case 'in-progress': return <Clock className="w-3 h-3" />;
      case 'rejected': return <XCircle className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      academic: '#22C55E',
      infrastructure: '#06B6D4',
      technology: '#22C55E',
      facilities: '#06B6D4',
      administration: '#22C55E',
      studentLife: '#06B6D4'
    };
    return colors[category] || '#0F172A';
  };

  const getCategoryIcon = (categoryId) => {
    const cat = categories.find(c => c.id === categoryId);
    if (cat && cat.icon) {
      const Icon = cat.icon;
      return <Icon className="w-4 h-4" />;
    }
    return <MessageSquare className="w-4 h-4" />;
  };

  const stats = {
    total: feedbacks.length,
    pending: feedbacks.filter(f => f.status === 'pending').length,
    inProgress: feedbacks.filter(f => f.status === 'in-progress').length,
    resolved: feedbacks.filter(f => f.status === 'resolved').length,
    rejected: feedbacks.filter(f => f.status === 'rejected').length,
    totalLikes: feedbacks.reduce((sum, f) => sum + (f.likes || 0), 0),
    withImages: feedbacks.filter(f => f.imageUrl).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex p-4 bg-white rounded-full mb-4 shadow-lg">
            <div className="w-8 h-8 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-500">Loading your feedbacks...</p>
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
                <MessageSquare className="w-8 h-8 text-[#22C55E]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  My <span className="text-[#22C55E]">Feedbacks</span>
                </h1>
                <p className="text-slate-300 mt-1">View, edit, and manage your submitted feedbacks</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadFeedbacks}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleNewFeedback}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#22C55E] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] rounded-xl transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                New Feedback
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Total</p>
                <p className="text-2xl font-bold text-[#22C55E]">{stats.total}</p>
              </div>
              <MessageSquare className="w-6 h-6 text-[#22C55E] opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Pending</p>
                <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
              </div>
              <AlertCircle className="w-6 h-6 text-orange-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">In Progress</p>
                <p className="text-2xl font-bold text-yellow-500">{stats.inProgress}</p>
              </div>
              <Clock className="w-6 h-6 text-yellow-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Resolved</p>
                <p className="text-2xl font-bold text-green-500">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Total Likes</p>
                <p className="text-2xl font-bold text-purple-500">{stats.totalLikes}</p>
              </div>
              <ThumbsUp className="w-6 h-6 text-purple-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">With Images</p>
                <p className="text-2xl font-bold text-pink-500">{stats.withImages}</p>
              </div>
              <ImageIcon className="w-6 h-6 text-pink-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
              >
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search feedbacks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
              />
            </div>
          </div>
        </div>

        {/* Feedbacks List */}
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-md">
            <MessageSquare className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No feedbacks found</p>
            <p className="text-sm text-slate-400 mt-2">Share your thoughts about campus facilities!</p>
            <button
              onClick={handleNewFeedback}
              className="mt-4 px-6 py-2 bg-[#22C55E] text-white rounded-xl hover:bg-[#16a34a] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Submit Feedback
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFeedbacks.map((feedback) => (
              <div key={feedback.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="p-4 border-b border-slate-100" style={{ backgroundColor: `${getCategoryColor(feedback.category)}10` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${getCategoryColor(feedback.category)}20` }}>
                        {getCategoryIcon(feedback.category)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0F172A]">{feedback.categoryName}</h3>
                        <p className="text-xs text-slate-500">{new Date(feedback.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(feedback.status)}`}>
                      {getStatusIcon(feedback.status)}
                      {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                {/* Image Preview */}
                {feedback.imageUrl && (
                  <div 
                    className="relative h-40 bg-slate-100 cursor-pointer group"
                    onClick={() => setShowImageViewer(feedback)}
                  >
                    <img 
                      src={feedback.imageUrl} 
                      alt="Feedback attachment" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
                
                {/* Body */}
                <div className="p-4">
                  <p className="text-sm text-slate-700 line-clamp-3 mb-3">{feedback.text}</p>
                  
                  {/* Reactions */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" /> {feedback.likes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsDown className="w-3 h-3" /> {feedback.dislikes || 0}
                    </span>
                  </div>
                  
                  {/* Admin Response Preview */}
                  {feedback.adminNote && (
                    <div className="bg-green-50 rounded-lg p-2 mb-3">
                      <p className="text-xs text-green-700 font-medium mb-1">Admin Response:</p>
                      <p className="text-xs text-green-600 line-clamp-2">{feedback.adminNote}</p>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleViewFeedback(feedback)}
                      className="flex-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleEditFeedback(feedback)}
                      className="flex-1 px-3 py-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteFeedback(feedback.id)}
                      className="flex-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Feedback Modal */}
      {showViewModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#22C55E]" />
                Feedback Details
              </h3>
              <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Image if exists */}
              {selectedFeedback.imageUrl && (
                <div className="rounded-xl overflow-hidden">
                  <img 
                    src={selectedFeedback.imageUrl} 
                    alt="Feedback attachment" 
                    className="w-full max-h-64 object-cover cursor-pointer"
                    onClick={() => setShowImageViewer(selectedFeedback)}
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${getCategoryColor(selectedFeedback.category)}20` }}>
                    {getCategoryIcon(selectedFeedback.category)}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F172A]">{selectedFeedback.categoryName}</p>
                    <p className="text-xs text-slate-500">Submitted on {new Date(selectedFeedback.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(selectedFeedback.status)}`}>
                  {getStatusIcon(selectedFeedback.status)}
                  {selectedFeedback.status.charAt(0).toUpperCase() + selectedFeedback.status.slice(1)}
                </span>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedFeedback.text}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{selectedFeedback.likes || 0} people found this helpful</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm">{selectedFeedback.dislikes || 0} people disagreed</span>
                </div>
              </div>
              
              {selectedFeedback.adminNote && (
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Admin Response
                  </p>
                  <p className="text-sm text-green-700">{selectedFeedback.adminNote}</p>
                </div>
              )}
              
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm font-medium text-slate-700 mb-2">Submitted by</p>
                <p className="text-sm">{selectedFeedback.studentName}</p>
                <p className="text-xs text-slate-500">{selectedFeedback.sdNumber} • {selectedFeedback.email}</p>
              </div>
            </div>
            
            <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditFeedback(selectedFeedback);
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Feedback Modal with Image Upload */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                <Edit className="w-5 h-5 text-yellow-500" />
                Edit Feedback
              </h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Category */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Category *</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                    formErrors.category ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {formErrors.category && <p className="text-xs text-red-500 mt-1">{formErrors.category}</p>}
              </div>
              
              {/* Feedback Text */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Your Feedback *</label>
                <textarea
                  value={editForm.text}
                  onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                  rows="6"
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] resize-none ${
                    formErrors.text ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="Describe your feedback in detail (minimum 10 characters)..."
                />
                {formErrors.text && <p className="text-xs text-red-500 mt-1">{formErrors.text}</p>}
                <p className="text-xs text-slate-400 mt-1">{editForm.text.length}/500 characters</p>
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Attach Image (Optional)
                </label>
                <div className="mt-1">
                  <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 transition-colors inline-flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {editForm.imagePreview && (
                    <div className="mt-3 relative inline-block">
                      <img 
                        src={editForm.imagePreview} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg border border-slate-200"
                      />
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
                <p className="text-xs text-slate-400 mt-1">Max size: 5MB (JPG, PNG, GIF)</p>
              </div>
              
              <div className="bg-yellow-50 rounded-xl p-3">
                <p className="text-xs text-yellow-700 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Note: Once you update your feedback, it will be reviewed by admin again.
                </p>
              </div>
            </div>
            
            <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button
                onClick={handleUpdateFeedback}
                className="px-4 py-2 bg-[#22C55E] text-white rounded-xl font-medium hover:bg-[#16a34a] transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Update Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {showImageViewer && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setShowImageViewer(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 transition-colors"
            >
              <XCircle className="w-8 h-8" />
            </button>
            <img 
              src={showImageViewer.imageUrl} 
              alt="Full view" 
              className="max-w-full max-h-[85vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 rounded-b-lg">
              <p className="text-sm">Submitted by: {showImageViewer.studentName}</p>
              <p className="text-xs">{showImageViewer.text?.substring(0, 100)}...</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
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

export default StudentFeedbacks;