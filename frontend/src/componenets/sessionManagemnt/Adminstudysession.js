import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  MapPin, 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Star,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
  Video,
  Building,
  Save,
  X,
  Settings,
  BarChart,
  TrendingUp,
  Award,
  Mail,
  Send,
  Link,
  ExternalLink,
  Clock as ClockIcon,
  Sparkles,
  Target,
  Shield,
  Zap,
  Heart,
  Globe,
  Monitor,
  Info,
  Loader
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/study-sessions';

const AdminStudySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [sessionRequests, setSessionRequests] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [formErrors, setFormErrors] = useState({});
  const [activeAdminTab, setActiveAdminTab] = useState('sessions');
  const [adminResponse, setAdminResponse] = useState('');
  const [reminderMessage, setReminderMessage] = useState('');
  const [reminderSession, setReminderSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalSessions: 0,
    upcomingSessions: 0,
    totalRegistrations: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    utilizationRate: 0
  });
  
  // Session form state
  const [sessionForm, setSessionForm] = useState({
    subject: '',
    date: '',
    time: '',
    duration: 2,
    location: '',
    locationType: 'physical',
    meetingUrl: '',
    description: '',
    maxParticipants: 20,
    instructor: ''
  });

  // Subjects list
  const subjects = [
    'OOP (Object Oriented Programming)',
    'DBMS (Database Management Systems)',
    'DSA (Data Structures & Algorithms)',
    'Computer Networks',
    'Software Engineering',
    'Web Development',
    'Artificial Intelligence',
    'Machine Learning',
    'Cloud Computing',
    'Cyber Security'
  ];

  // Load data from backend
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadSessions(),
        loadRequests(),
        loadStatistics()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      showNotificationMessage('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/all`);
      if (!response.ok) throw new Error('Failed to load sessions');
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error loading sessions:', error);
      showNotificationMessage('Failed to load sessions', 'error');
    }
  };

  const loadRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/requests`);
      if (!response.ok) throw new Error('Failed to load requests');
      const data = await response.json();
      setSessionRequests(data);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/statistics`);
      if (!response.ok) throw new Error('Failed to load statistics');
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const showNotificationMessage = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const validateSessionForm = () => {
    const errors = {};
    if (!sessionForm.subject) errors.subject = 'Subject is required';
    if (!sessionForm.date) errors.date = 'Date is required';
    if (!sessionForm.time) errors.time = 'Time is required';
    if (!sessionForm.location) errors.location = 'Location is required';
    if (sessionForm.locationType === 'online' && !sessionForm.meetingUrl) {
      errors.meetingUrl = 'Meeting URL is required for online sessions';
    }
    if (sessionForm.locationType === 'online' && sessionForm.meetingUrl) {
      const urlPattern = /^(https?:\/\/)?(www\.)?(meet\.google\.com|zoom\.us|teams\.microsoft\.com)/;
      if (!urlPattern.test(sessionForm.meetingUrl)) {
        errors.meetingUrl = 'Please enter a valid meeting URL (Google Meet, Zoom, or Teams)';
      }
    }
    if (!sessionForm.description) errors.description = 'Description is required';
    if (sessionForm.maxParticipants < 1) errors.maxParticipants = 'Max participants must be at least 1';
    if (!sessionForm.instructor) errors.instructor = 'Instructor name is required';
    return errors;
  };

  const handleAddSession = () => {
    setSessionForm({
      subject: '',
      date: '',
      time: '',
      duration: 2,
      location: '',
      locationType: 'physical',
      meetingUrl: '',
      description: '',
      maxParticipants: 20,
      instructor: ''
    });
    setIsEditing(false);
    setFormErrors({});
    setShowSessionModal(true);
  };

  const handleEditSession = (session) => {
    setSessionForm({
      subject: session.subject,
      date: session.date,
      time: session.time,
      duration: session.duration,
      location: session.location,
      locationType: session.locationType,
      meetingUrl: session.meetingUrl || '',
      description: session.description,
      maxParticipants: session.maxParticipants,
      instructor: session.instructor
    });
    setSelectedSession(session);
    setIsEditing(true);
    setFormErrors({});
    setShowSessionModal(true);
  };

  const handleSaveSession = async () => {
    const errors = validateSessionForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotificationMessage('Please fix the errors in the form', 'error');
      return;
    }

    try {
      let response;
      if (isEditing && selectedSession) {
        response = await fetch(`${API_BASE_URL}/admin/${selectedSession.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionForm)
        });
      } else {
        response = await fetch(`${API_BASE_URL}/admin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sessionForm)
        });
      }

      if (!response.ok) throw new Error('Failed to save session');
      
      await loadSessions();
      await loadStatistics();
      showNotificationMessage(isEditing ? 'Session updated successfully!' : 'Session created successfully!', 'success');
      setShowSessionModal(false);
    } catch (error) {
      console.error('Error saving session:', error);
      showNotificationMessage('Failed to save session', 'error');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session? All registrations will be removed.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/${sessionId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete session');
        
        await loadSessions();
        await loadStatistics();
        showNotificationMessage('Session deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting session:', error);
        showNotificationMessage('Failed to delete session', 'error');
      }
    }
  };

  const handleSendReminder = async (session) => {
    if (session.registrations?.length === 0) {
      showNotificationMessage('No students registered for this session', 'error');
      return;
    }
    setReminderSession(session);
    setReminderMessage(`📚 Reminder: ${session.subject} Session\n\nDate: ${session.date}\nTime: ${session.time}\nDuration: ${session.duration} hours\nLocation: ${session.location}\n\nSession Details:\n${session.description}\n\n${session.locationType === 'online' && session.meetingUrl ? `\nJoin Meeting: ${session.meetingUrl}\n` : ''}Looking forward to seeing you there!`);
    setShowReminderModal(true);
  };

  const confirmSendReminder = async () => {
    if (!reminderMessage.trim()) {
      showNotificationMessage('Please enter a reminder message', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/${reminderSession.id}/send-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reminderMessage })
      });
      
      if (!response.ok) throw new Error('Failed to send reminder');
      
      const data = await response.json();
      showNotificationMessage(data.message, 'success');
      setShowReminderModal(false);
      setReminderMessage('');
      setReminderSession(null);
    } catch (error) {
      console.error('Error sending reminder:', error);
      showNotificationMessage('Failed to send reminder', 'error');
    }
  };

  const handleApproveRequest = (request) => {
    setSelectedRequest(request);
    setAdminResponse('');
    setShowRequestModal(true);
  };

  const confirmApproveRequest = async (status) => {
    if (!adminResponse.trim()) {
      showNotificationMessage('Please provide a response message for the student', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/requests/${selectedRequest.id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote: adminResponse })
      });
      
      if (!response.ok) throw new Error('Failed to review request');
      
      await loadRequests();
      await loadSessions();
      await loadStatistics();
      
      showNotificationMessage(`Request ${status} successfully!`, 'success');
      setShowRequestModal(false);
      setAdminResponse('');
    } catch (error) {
      console.error('Error reviewing request:', error);
      showNotificationMessage('Failed to review request', 'error');
    }
  };

  const getUniqueSubjects = () => ['all', ...new Set(sessions.map(s => s.subject))];

  const filteredSessions = sessions.filter(session => {
    const matchesSubject = filterSubject === 'all' || session.subject === filterSubject;
    const matchesSearch = session.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex p-4 bg-white rounded-full mb-4 shadow-lg">
            <Loader className="w-8 h-8 text-[#22C55E] animate-spin" />
          </div>
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1e293b] to-[#0F172A] text-white sticky top-0 z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#22C55E]/20 rounded-2xl backdrop-blur-sm">
                <Settings className="w-8 h-8 text-[#22C55E]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-[#22C55E] bg-clip-text text-transparent">
                  Admin Study Sessions
                </h1>
                <p className="text-slate-300 mt-1">Manage sessions, requests, and student registrations</p>
              </div>
            </div>
            <button
              onClick={handleAddSession}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#22C55E] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              Create New Session
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {showNotification && (
          <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
            <div className={`${notificationType === 'success' ? 'bg-gradient-to-r from-[#22C55E] to-[#16a34a]' : 'bg-gradient-to-r from-red-500 to-red-600'} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-sm`}>
              {notificationType === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-medium">{notificationMessage}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Sessions</p>
                <p className="text-3xl font-bold text-[#0F172A]">{statistics.totalSessions}</p>
              </div>
              <div className="p-3 bg-[#22C55E]/10 rounded-xl">
                <BookOpen className="w-6 h-6 text-[#22C55E]" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Participants</p>
                <p className="text-3xl font-bold text-[#22C55E]">{statistics.totalRegistrations}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Utilization Rate</p>
                <p className="text-3xl font-bold text-blue-600">{statistics.utilizationRate}%</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Upcoming Sessions</p>
                <p className="text-3xl font-bold text-yellow-600">{statistics.upcomingSessions}</p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <Calendar className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending Requests</p>
                <p className="text-3xl font-bold text-orange-600">{statistics.pendingRequests}</p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-xl">
                <ClockIcon className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-lg">
          <button
            onClick={() => setActiveAdminTab('sessions')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              activeAdminTab === 'sessions'
                ? 'bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Manage Sessions ({sessions.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('requests')}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              activeAdminTab === 'requests'
                ? 'bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ClockIcon className="w-4 h-4 inline mr-2" />
            Session Requests
            {statistics.pendingRequests > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {statistics.pendingRequests}
              </span>
            )}
          </button>
        </div>

        {/* Search and Filters - Sessions Tab */}
        {activeAdminTab === 'sessions' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-5 mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4 items-center flex-1">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-sm font-medium text-slate-700">Filters:</span>
                </div>
                
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] bg-white"
                >
                  {getUniqueSubjects().map(subject => (
                    <option key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by subject or instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[#22C55E] bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Sessions Table */}
        {activeAdminTab === 'sessions' && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Session Details</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Date & Time</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Location</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">Capacity</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">Registrations</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-[#0F172A]">{session.subject}</p>
                          <p className="text-xs text-slate-500">by {session.instructor}</p>
                          {session.studentRequest && (
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                                <Users className="w-3 h-3" />
                                Student Request
                              </span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                {Number(session.creatorOverallRating || 0).toFixed(1)} overall
                              </span>
                            </div>
                          )}
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-slate-700">{session.date}</p>
                          <p className="text-xs text-slate-500">{session.time} ({session.duration} hrs)</p>
                        </div>
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {session.locationType === 'online' ? (
                            <Video className="w-4 h-4 text-[#06B6D4]" />
                          ) : (
                            <Building className="w-4 h-4 text-[#22C55E]" />
                          )}
                          <span className="text-sm truncate max-w-[150px]">{session.location}</span>
                        </div>
                        {session.locationType === 'online' && session.meetingUrl && (
                          <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1">
                            <Link className="w-3 h-3" />
                            Meeting Link
                          </a>
                        )}
                       </td>
                      <td className="px-6 py-4 text-center">
                        <div>
                          <p className="text-sm font-medium">{session.currentParticipants}/{session.maxParticipants}</p>
                          <div className="w-20 mx-auto bg-slate-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="h-1.5 rounded-full bg-gradient-to-r from-[#22C55E] to-[#16a34a]" 
                              style={{ width: `${(session.currentParticipants / session.maxParticipants) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                       </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedSession(session)}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center gap-1 mx-auto"
                        >
                          <Users className="w-4 h-4" />
                          {session.registrations?.length || 0}
                        </button>
                       </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEditSession(session)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Session"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSendReminder(session)}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Send Reminder"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Session"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredSessions.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No study sessions found</p>
                <button
                  onClick={handleAddSession}
                  className="mt-4 px-6 py-2 bg-[#22C55E] text-white rounded-xl hover:bg-[#16a34a] transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create First Session
                </button>
              </div>
            )}
          </div>
        )}

        {/* Session Requests Table */}
        {activeAdminTab === 'requests' && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Student</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Session Details</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">Date & Time</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">Participants</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessionRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#0F172A]">{request.studentName}</p>
                        <p className="text-xs text-slate-500">{request.studentId}</p>
                        <p className="text-xs text-slate-400">{request.email}</p>
                       </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-sm">{request.subject}</p>
                        <p className="text-xs text-slate-500 line-clamp-2 max-w-xs">{request.description}</p>
                        {request.locationType === 'online' && request.meetingUrl && (
                          <a href={request.meetingUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1">
                            <Link className="w-3 h-3" />
                            Meeting Link
                          </a>
                        )}
                       </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">{request.date}</p>
                        <p className="text-xs text-slate-500">{request.time} ({request.duration}h)</p>
                        <p className="text-xs text-slate-400">{request.location}</p>
                       </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-medium">{request.expectedParticipants}</span>
                       </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          request.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {request.status === 'pending' && <ClockIcon className="w-3 h-3" />}
                          {request.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                          {request.status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                        {request.status !== 'pending' && request.reviewedAt && (
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(request.reviewedAt).toLocaleDateString()}
                          </p>
                        )}
                       </td>
                      <td className="px-6 py-4">
                        {request.status === 'pending' && (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleApproveRequest(request)}
                              className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm hover:shadow-md transition-all flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setAdminResponse('');
                                setShowRequestModal(true);
                              }}
                              className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm hover:shadow-md transition-all flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              Reject
                            </button>
                          </div>
                        )}
                        {request.status !== 'pending' && request.adminNote && (
                          <div className="text-xs text-slate-500 text-center">
                            <p className="font-medium">Admin Note:</p>
                            <p className="truncate max-w-[150px]">{request.adminNote}</p>
                          </div>
                        )}
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {sessionRequests.length === 0 && (
              <div className="text-center py-16">
                <ClockIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No session requests found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Session Modal (Create/Edit) */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#22C55E]" />
                  {isEditing ? 'Edit Session' : 'Create New Session'}
                </h3>
                <p className="text-sm text-slate-500">Fill in the session details below</p>
              </div>
              <button onClick={() => setShowSessionModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Subject *</label>
                  <input
                    type="text"
                    value={sessionForm.subject}
                    onChange={(e) => setSessionForm({ ...sessionForm, subject: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                      formErrors.subject ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="e.g., Advanced JavaScript, Machine Learning"
                  />
                  {formErrors.subject && <p className="text-xs text-red-500 mt-1">{formErrors.subject}</p>}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Instructor *</label>
                  <input
                    type="text"
                    value={sessionForm.instructor}
                    onChange={(e) => setSessionForm({ ...sessionForm, instructor: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                      formErrors.instructor ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="Instructor name"
                  />
                  {formErrors.instructor && <p className="text-xs text-red-500 mt-1">{formErrors.instructor}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Date *</label>
                  <input
                    type="date"
                    value={sessionForm.date}
                    onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                      formErrors.date ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.date && <p className="text-xs text-red-500 mt-1">{formErrors.date}</p>}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Time *</label>
                  <input
                    type="time"
                    value={sessionForm.time}
                    onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                      formErrors.time ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.time && <p className="text-xs text-red-500 mt-1">{formErrors.time}</p>}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Duration (hours)</label>
                  <select
                    value={sessionForm.duration}
                    onChange={(e) => setSessionForm({ ...sessionForm, duration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                  >
                    <option value={1}>1 hour</option>
                    <option value={2}>2 hours</option>
                    <option value={3}>3 hours</option>
                    <option value={4}>4 hours</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Location Type *</label>
                  <select
                    value={sessionForm.locationType}
                    onChange={(e) => setSessionForm({ ...sessionForm, locationType: e.target.value, meetingUrl: '' })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                  >
                    <option value="physical">Physical (In-person)</option>
                    <option value="online">Online (Virtual)</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Location/Venue *</label>
                  <input
                    type="text"
                    value={sessionForm.location}
                    onChange={(e) => setSessionForm({ ...sessionForm, location: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                      formErrors.location ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder={sessionForm.locationType === 'online' ? 'e.g., Google Meet, Zoom' : 'e.g., Room 301, Main Building'}
                  />
                  {formErrors.location && <p className="text-xs text-red-500 mt-1">{formErrors.location}</p>}
                </div>
              </div>
              
              {sessionForm.locationType === 'online' && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Meeting URL *</label>
                  <input
                    type="url"
                    value={sessionForm.meetingUrl}
                    onChange={(e) => setSessionForm({ ...sessionForm, meetingUrl: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                      formErrors.meetingUrl ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="https://meet.google.com/..."
                  />
                  {formErrors.meetingUrl && <p className="text-xs text-red-500 mt-1">{formErrors.meetingUrl}</p>}
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Max Participants *</label>
                <input
                  type="number"
                  value={sessionForm.maxParticipants}
                  onChange={(e) => setSessionForm({ ...sessionForm, maxParticipants: parseInt(e.target.value) })}
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                    formErrors.maxParticipants ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  min="1"
                />
                {formErrors.maxParticipants && <p className="text-xs text-red-500 mt-1">{formErrors.maxParticipants}</p>}
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Description *</label>
                <textarea
                  value={sessionForm.description}
                  onChange={(e) => setSessionForm({ ...sessionForm, description: e.target.value })}
                  rows="3"
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] resize-none ${
                    formErrors.description ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="Describe what students will learn in this session..."
                />
                {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
              </div>
            </div>
            
            <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
              <button onClick={() => setShowSessionModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">
                Cancel
              </button>
              <button onClick={handleSaveSession} className="px-4 py-2 bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white rounded-xl font-medium flex items-center gap-2 hover:shadow-lg transition-all">
                <Save className="w-4 h-4" />
                {isEditing ? 'Update Session' : 'Create Session'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registrations Modal */}
      {selectedSession && !showSessionModal && !showReminderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#0F172A]">Registered Students</h3>
                <p className="text-sm text-slate-500">{selectedSession.subject} - {selectedSession.date}</p>
              </div>
              <button onClick={() => setSelectedSession(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6">
              {!selectedSession.registrations || selectedSession.registrations.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No students registered yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedSession.registrations.map((student, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100">
                      <div>
                        <p className="font-semibold text-[#0F172A]">{student.studentName}</p>
                        <p className="text-sm text-slate-500">{student.studentId} • {student.email}</p>
                        <p className="text-xs text-slate-400">Registered: {new Date(student.registeredAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedSession.registrations?.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => {
                      handleSendReminder(selectedSession);
                      setSelectedSession(null);
                    }}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    Send Reminder to All ({selectedSession.registrations.length}) Students
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Response Modal */}
      {showRequestModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-xl font-bold text-[#0F172A]">Review Session Request</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-slate-50 to-white p-4 rounded-xl">
                <p className="text-sm"><strong>Student:</strong> {selectedRequest.studentName}</p>
                <p className="text-sm"><strong>Subject:</strong> {selectedRequest.subject}</p>
                <p className="text-sm"><strong>Date:</strong> {selectedRequest.date} at {selectedRequest.time}</p>
                <p className="text-sm"><strong>Location:</strong> {selectedRequest.location}</p>
                <p className="text-sm"><strong>Expected Participants:</strong> {selectedRequest.expectedParticipants}</p>
                <p className="text-sm mt-2"><strong>Description:</strong></p>
                <p className="text-sm text-slate-600 mt-1">{selectedRequest.description}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Admin Response (will be sent to student) *</label>
                <textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] resize-none"
                  placeholder="Enter your response or reason for approval/rejection..."
                />
              </div>
            </div>
            <div className="border-t border-slate-200 px-6 py-4 flex gap-3">
              <button onClick={() => setShowRequestModal(false)} className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">
                Cancel
              </button>
              <button onClick={() => confirmApproveRequest('rejected')} className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                Reject
              </button>
              <button onClick={() => confirmApproveRequest('approved')} className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && reminderSession && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-xl font-bold text-[#0F172A]">Send Reminder Email</h3>
              <p className="text-sm text-slate-500">To {reminderSession.registrations?.length || 0} students</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                <p className="text-sm font-semibold text-[#0F172A]">Session: {reminderSession.subject}</p>
                <p className="text-xs text-slate-500 mt-1">Date: {reminderSession.date} at {reminderSession.time}</p>
                <p className="text-xs text-slate-500">Location: {reminderSession.location}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Reminder Message</label>
                <textarea
                  value={reminderMessage}
                  onChange={(e) => setReminderMessage(e.target.value)}
                  rows="8"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] resize-none font-mono text-sm"
                  placeholder="Enter reminder message..."
                />
                <p className="text-xs text-slate-400 mt-1">This message will be sent to all registered students</p>
              </div>
            </div>
            <div className="border-t border-slate-200 px-6 py-4 flex gap-3">
              <button onClick={() => setShowReminderModal(false)} className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">
                Cancel
              </button>
              <button onClick={confirmSendReminder} className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                <Mail className="w-4 h-4" />
                Send Reminder
              </button>
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

export default AdminStudySessions;
