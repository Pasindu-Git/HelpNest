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
  Send,
  Eye,
  RefreshCw,
  AlertCircle,
  User,
  Video,
  Building,
  ChevronRight,
  Info,
  TrendingUp,
  Plus,
  Clock as ClockIcon,
  Mail,
  Link,
  ExternalLink,
  Sparkles,
  Shield,
  GraduationCap,
  Star
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/study-sessions';

const StudentStudySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [registeredSessions, setRegisteredSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Request form state
  const [requestForm, setRequestForm] = useState({
    subject: '',
    date: '',
    time: '',
    duration: 2,
    location: '',
    locationType: 'physical',
    meetingUrl: '',
    description: '',
    expectedParticipants: 5
  });

  // Get student email from session
  const getStudentEmail = () => {
    const session = localStorage.getItem('userSession');
    if (session) {
      const userSession = JSON.parse(session);
      return userSession.email;
    }
    return null;
  };

  const getStudentName = () => {
    const session = localStorage.getItem('userSession');
    if (session) {
      const userSession = JSON.parse(session);
      return userSession.fullName || '';
    }
    return '';
  };

  const getStudentIdNumber = () => {
    const session = localStorage.getItem('userSession');
    if (session) {
      const userSession = JSON.parse(session);
      return userSession.studentId || '';
    }
    return '';
  };

  // Load sessions from backend
  useEffect(() => {
    loadSessions();
    loadMySessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/student/available`);
      if (!response.ok) throw new Error('Failed to load sessions');
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error loading sessions:', error);
      showNotificationMessage('Failed to load sessions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadMySessions = async () => {
    try {
      const studentEmail = getStudentEmail();
      if (!studentEmail) return;
      
      const response = await fetch(`${API_BASE_URL}/student/my-sessions/${studentEmail}`);
      if (!response.ok) throw new Error('Failed to load registered sessions');
      const data = await response.json();
      setRegisteredSessions(data);
    } catch (error) {
      console.error('Error loading registered sessions:', error);
    }
  };

  const showNotificationMessage = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const validateRequestForm = () => {
    const errors = {};
    if (!requestForm.subject) errors.subject = 'Subject is required';
    if (!requestForm.date) errors.date = 'Date is required';
    if (!requestForm.time) errors.time = 'Time is required';
    if (!requestForm.location) errors.location = 'Location is required';
    if (requestForm.locationType === 'online' && !requestForm.meetingUrl) {
      errors.meetingUrl = 'Meeting URL is required for online sessions';
    }
    if (requestForm.locationType === 'online' && requestForm.meetingUrl) {
      const urlPattern = /^(https?:\/\/)?(www\.)?(meet\.google\.com|zoom\.us|teams\.microsoft\.com)/;
      if (!urlPattern.test(requestForm.meetingUrl)) {
        errors.meetingUrl = 'Please enter a valid meeting URL (Google Meet, Zoom, or Teams)';
      }
    }
    if (!requestForm.description) errors.description = 'Description is required';
    if (requestForm.expectedParticipants < 1) errors.expectedParticipants = 'Minimum 1 participant expected';
    return errors;
  };

  const validateRegistration = () => {
    const errors = {};
    if (!studentName) errors.name = 'Student name is required';
    if (studentName.length < 3) errors.name = 'Name must be at least 3 characters';
    if (!studentId) errors.studentId = 'Student ID is required';
    const sdRegex = /^SD\d{7}$/;
    if (!sdRegex.test(studentId)) errors.studentId = 'Student ID must be in format SD followed by 7 digits';
    if (!email) errors.email = 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) errors.email = 'Please enter a valid email address';
    return errors;
  };

  const handleCreateRequest = () => {
    setRequestForm({
      subject: '',
      date: '',
      time: '',
      duration: 2,
      location: '',
      locationType: 'physical',
      meetingUrl: '',
      description: '',
      expectedParticipants: 5
    });
    setFormErrors({});
    setShowRequestModal(true);
  };

  const submitRequest = async () => {
    const errors = validateRequestForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotificationMessage('Please fix the errors in the form', 'error');
      return;
    }

    const studentEmail = getStudentEmail();
    const studentFullName = getStudentName();
    const studentIdNumber = getStudentIdNumber();

    if (!studentEmail || !studentFullName || !studentIdNumber) {
      showNotificationMessage('Please login first to request a session', 'error');
      return;
    }

    const requestData = {
      ...requestForm,
      studentName: studentFullName,
      studentId: studentIdNumber,
      email: studentEmail
    };

    try {
      const response = await fetch(`${API_BASE_URL}/student/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) throw new Error('Failed to submit request');

      showNotificationMessage('Your session request has been submitted for admin approval!', 'success');
      setShowRequestModal(false);
      
    } catch (error) {
      console.error('Error submitting request:', error);
      showNotificationMessage('Failed to submit request', 'error');
    }
  };

  const handleRegister = (session) => {
    const studentEmail = getStudentEmail();
    const studentFullName = getStudentName();
    const studentIdNumber = getStudentIdNumber();

    if (!studentEmail || !studentFullName || !studentIdNumber) {
      showNotificationMessage('Please login first to register for sessions', 'error');
      return;
    }

    setSelectedSession(session);
    setStudentName(studentFullName);
    setStudentId(studentIdNumber);
    setEmail(studentEmail);
    setFormErrors({});
    setShowRegisterModal(true);
  };

  const confirmRegistration = async () => {
    const errors = validateRegistration();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotificationMessage('Please fix the errors in the form', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/student/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          studentName,
          studentId,
          email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Registration failed');
      }

      showNotificationMessage(`Successfully registered for ${selectedSession.subject}!`, 'success');
      setShowRegisterModal(false);
      
      // Refresh data
      await loadSessions();
      await loadMySessions();
      
    } catch (error) {
      console.error('Error registering:', error);
      showNotificationMessage(error.message || 'Failed to register', 'error');
    }
  };

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

  const filteredSessions = sessions.filter(session => {
    const matchesSubject = filterSubject === 'all' || session.subject === filterSubject;
    const matchesLocation = filterLocation === 'all' || session.locationType === filterLocation;
    const matchesSearch = session.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (session.instructor && session.instructor.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSubject && matchesLocation && matchesSearch;
  });

  const renderStars = (rating, size = 'w-4 h-4') => {
    const rounded = Math.round(rating || 0);
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${size} ${index < rounded ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex p-4 bg-white rounded-full mb-4 shadow-lg">
            <div className="w-8 h-8 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-500">Loading sessions...</p>
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
                <Sparkles className="w-8 h-8 text-[#22C55E]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-[#22C55E] bg-clip-text text-transparent">
                  Study Support Hub
                </h1>
                <p className="text-slate-300 mt-1">Join study sessions and learn together</p>
              </div>
            </div>
            <button
              onClick={handleCreateRequest}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#22C55E] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              Request New Session
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

        {/* Filters */}
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
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E] bg-white"
              >
                <option value="all">All Locations</option>
                <option value="physical">🏢 Physical</option>
                <option value="online">💻 Online</option>
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

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSessions.map((session) => {
            const isRegistered = registeredSessions.some(reg => reg.id === session.id);
            const availableSeats = session.maxParticipants - session.currentParticipants;
            const isFull = availableSeats === 0;

            return (
              <div key={session.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-[#22C55E]/30">
                {/* Card Header */}
                <div className={`p-5 ${session.studentRequest ? 'bg-gradient-to-r from-purple-50 to-pink-50' : 'bg-gradient-to-r from-slate-50 to-white'} border-b border-slate-100`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {session.studentRequest && (
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Student Request
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {isFull ? 'Full' : `${availableSeats} seats left`}
                        </span>
                      </div>
                      <h3 className="font-bold text-[#0F172A] text-lg group-hover:text-[#22C55E] transition-colors">
                        {session.subject}
                      </h3>
                      <p className="text-sm text-slate-500">by {session.instructor}</p>
                      {session.studentRequest && (
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-white/80 rounded-full">
                          <div className="flex items-center gap-1">
                            {renderStars(session.creatorOverallRating, 'w-3.5 h-3.5')}
                          </div>
                          <span className="text-xs font-medium text-slate-700">
                            {session.creatorOverallRating?.toFixed?.(1) || '0.0'} overall
                          </span>
                          <span className="text-xs text-slate-500">
                            ({session.creatorTotalRatings || 0} ratings)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-slate-600 mt-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-[#22C55E]" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-[#22C55E]" />
                      <span>{session.time} ({session.duration}h)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {session.locationType === 'online' ? (
                        <Video className="w-4 h-4 text-[#06B6D4]" />
                      ) : (
                        <Building className="w-4 h-4 text-[#22C55E]" />
                      )}
                      <span className="truncate max-w-[150px]">{session.location}</span>
                    </div>
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="p-5 space-y-4">
                  <p className="text-sm text-slate-600 line-clamp-2">{session.description}</p>
                  
                  {session.locationType === 'online' && session.meetingUrl && (
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <a 
                        href={session.meetingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Link className="w-3 h-3" />
                        Join Meeting Link
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">{session.currentParticipants}/{session.maxParticipants} enrolled</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRegister(session)}
                    disabled={isFull || isRegistered}
                    className={`w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      isRegistered
                        ? 'bg-green-100 text-green-600 cursor-default'
                        : isFull
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white hover:shadow-lg transform hover:scale-[1.02]'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Registered
                      </>
                    ) : isFull ? (
                      <>
                        <XCircle className="w-4 h-4" />
                        Session Full
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Register Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No study sessions found</p>
            <button
              onClick={handleCreateRequest}
              className="mt-4 px-6 py-2 bg-[#22C55E] text-white rounded-xl hover:bg-[#16a34a] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Request a Session
            </button>
          </div>
        )}
      </div>

      {/* Request Session Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#22C55E]" />
                  Request a Study Session
                </h3>
                <p className="text-sm text-slate-500">Create a session request for admin approval</p>
              </div>
              <button onClick={() => setShowRequestModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Subject *</label>
                  <input
                    type="text"
                    value={requestForm.subject}
                    onChange={(e) => setRequestForm({ ...requestForm, subject: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                      formErrors.subject ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="e.g., Advanced JavaScript, Machine Learning"
                  />
                  {formErrors.subject && <p className="text-xs text-red-500 mt-1">{formErrors.subject}</p>}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Expected Participants *</label>
                  <input
                    type="number"
                    value={requestForm.expectedParticipants}
                    onChange={(e) => setRequestForm({ ...requestForm, expectedParticipants: parseInt(e.target.value) })}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                      formErrors.expectedParticipants ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    min="1"
                  />
                  {formErrors.expectedParticipants && <p className="text-xs text-red-500 mt-1">{formErrors.expectedParticipants}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Date *</label>
                  <input
                    type="date"
                    value={requestForm.date}
                    onChange={(e) => setRequestForm({ ...requestForm, date: e.target.value })}
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
                    value={requestForm.time}
                    onChange={(e) => setRequestForm({ ...requestForm, time: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                      formErrors.time ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.time && <p className="text-xs text-red-500 mt-1">{formErrors.time}</p>}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Duration (hours)</label>
                  <select
                    value={requestForm.duration}
                    onChange={(e) => setRequestForm({ ...requestForm, duration: parseInt(e.target.value) })}
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
                    value={requestForm.locationType}
                    onChange={(e) => setRequestForm({ ...requestForm, locationType: e.target.value, meetingUrl: '' })}
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
                    value={requestForm.location}
                    onChange={(e) => setRequestForm({ ...requestForm, location: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                      formErrors.location ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder={requestForm.locationType === 'online' ? 'e.g., Google Meet, Zoom' : 'e.g., Room 301, Main Building'}
                  />
                  {formErrors.location && <p className="text-xs text-red-500 mt-1">{formErrors.location}</p>}
                </div>
              </div>
              
              {requestForm.locationType === 'online' && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Meeting URL *</label>
                  <input
                    type="url"
                    value={requestForm.meetingUrl}
                    onChange={(e) => setRequestForm({ ...requestForm, meetingUrl: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                      formErrors.meetingUrl ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="https://meet.google.com/..."
                  />
                  {formErrors.meetingUrl && <p className="text-xs text-red-500 mt-1">{formErrors.meetingUrl}</p>}
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Description *</label>
                <textarea
                  value={requestForm.description}
                  onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                  rows="3"
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] resize-none ${
                    formErrors.description ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="Describe what will be covered in this session..."
                />
                {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-700 font-medium">Your request will be reviewed by admin</p>
                    <p className="text-xs text-slate-500">You'll receive an email notification once reviewed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
              <button onClick={() => setShowRequestModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">
                Cancel
              </button>
              <button onClick={submitRequest} className="px-4 py-2 bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white rounded-xl font-medium flex items-center gap-2 hover:shadow-lg transition-all">
                <Send className="w-4 h-4" />
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegisterModal && selectedSession && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#0F172A]">Register for Session</h3>
                <p className="text-sm text-slate-500">{selectedSession.subject}</p>
              </div>
              <button onClick={() => setShowRegisterModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-[#22C55E]/10 to-[#06B6D4]/10 p-4 rounded-xl">
                <p className="text-sm"><strong>📅 Date:</strong> {selectedSession.date}</p>
                <p className="text-sm"><strong>⏰ Time:</strong> {selectedSession.time} ({selectedSession.duration} hours)</p>
                <p className="text-sm"><strong>📍 Location:</strong> {selectedSession.location}</p>
                <p className="text-sm"><strong>👥 Available:</strong> {selectedSession.maxParticipants - selectedSession.currentParticipants} seats</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Student Name *</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                    formErrors.name ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  disabled
                />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Student ID *</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="SD2024001"
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                    formErrors.studentId ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  disabled
                />
                {formErrors.studentId && <p className="text-xs text-red-500 mt-1">{formErrors.studentId}</p>}
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@gmail.com"
                  className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                    formErrors.email ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  disabled
                />
                {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
              </div>
            </div>
            
            <div className="border-t border-slate-200 px-6 py-4 flex gap-3">
              <button onClick={() => setShowRegisterModal(false)} className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl">
                Cancel
              </button>
              <button onClick={confirmRegistration} className="flex-1 px-4 py-2 bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                <CheckCircle className="w-4 h-4" />
                Confirm Registration
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

export default StudentStudySessions;
