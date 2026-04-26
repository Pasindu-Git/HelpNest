import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Clock,
  Calendar,
  MapPin,
  Video,
  Building,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Trash2,
  Eye,
  ExternalLink,
  Link,
  Loader,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Award,
  Sparkles,
  Plus,
  Edit,
  Save,
  X,
  Star
} from "lucide-react";

const API_BASE_URL = "http://localhost:8081/api/study-sessions";

const StudentRegisteredSessions = () => {
  const [registeredSessions, setRegisteredSessions] = useState([]);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [createdSessions, setCreatedSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("registered");
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [showUnregisterConfirm, setShowUnregisterConfirm] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [submittingRatingId, setSubmittingRatingId] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");

  const getStudentEmail = () => {
    const session = localStorage.getItem("userSession");
    if (session) {
      const userSession = JSON.parse(session);
      return userSession.email;
    }
    return null;
  };

  const getStudentId = () => {
    const session = localStorage.getItem("userSession");
    if (session) {
      const userSession = JSON.parse(session);
      return userSession.studentId;
    }
    return null;
  };

  const getStudentName = () => {
    const session = localStorage.getItem("userSession");
    if (session) {
      const userSession = JSON.parse(session);
      return userSession.fullName || userSession.name;
    }
    return null;
  };

  useEffect(() => {
    loadData();
    loadCreatedSessions();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadRegisteredSessions(), loadAvailableSessions()]);
    } catch (error) {
      console.error("Error loading data:", error);
      showNotificationMessage("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadRegisteredSessions = async () => {
    try {
      const email = getStudentEmail();

      if (!email) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/student/my-sessions/${email}`
      );

      if (!response.ok) {
        throw new Error("Failed to load registered sessions");
      }

      const data = await response.json();
      setRegisteredSessions(data);
    } catch (error) {
      console.error("Error loading registered sessions:", error);
    }
  };

  const loadAvailableSessions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/student/available`);

      if (!response.ok) {
        throw new Error("Failed to load available sessions");
      }

      const data = await response.json();
      setAvailableSessions(data);
    } catch (error) {
      console.error("Error loading available sessions:", error);
    }
  };

  const loadCreatedSessions = async () => {
    try {
      const studentId = getStudentId();
      if (!studentId) return;

      const response = await fetch(
        `${API_BASE_URL}/student/my-created-sessions/${studentId}`
      );

      if (!response.ok) {
        throw new Error("Failed to load created sessions");
      }

      const data = await response.json();
      setCreatedSessions(data);
    } catch (error) {
      console.error("Error loading created sessions:", error);
    }
  };

  const showNotificationMessage = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleUnregister = (session) => {
    setShowUnregisterConfirm(session);
  };

  const confirmUnregister = async () => {
    if (!showUnregisterConfirm) return;

    try {
      const email = getStudentEmail();
      const sessionId = showUnregisterConfirm.id;

      const response = await fetch(`${API_BASE_URL}/student/unregister`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId, email }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to unregister";

        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch {
          // ignore json parse errors
        }

        throw new Error(errorMessage);
      }

      setRegisteredSessions((prev) => prev.filter((s) => s.id !== sessionId));
      await loadAvailableSessions();

      showNotificationMessage(
        `Successfully unregistered from "${showUnregisterConfirm.subject}"`,
        "success"
      );
      setShowUnregisterConfirm(null);
    } catch (error) {
      console.error("Error unregistering:", error);
      showNotificationMessage(error.message || "Failed to unregister", "error");
    }
  };

  const handleViewSession = (session) => {
    setSelectedSession(session);
    setShowSessionModal(true);
  };

  const handleRegister = (session) => {
    const studentEmail = getStudentEmail();
    const studentFullName = getStudentName();
    const studentIdNumber = getStudentId();

    if (!studentEmail || !studentFullName || !studentIdNumber) {
      showNotificationMessage("Please login first to register for sessions", "error");
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
    if (!selectedSession) return;

    try {
      const response = await fetch(`${API_BASE_URL}/student/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          studentName,
          studentId,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Registration failed");
      }

      setShowRegisterModal(false);
      showNotificationMessage(`Successfully registered for "${selectedSession.subject}"`, "success");

      await Promise.all([
        loadRegisteredSessions(),
        loadAvailableSessions(),
      ]);
    } catch (error) {
      console.error("Error registering:", error);
      showNotificationMessage(error.message || "Failed to register", "error");
    }
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setEditForm({
      subject: session.subject,
      date: session.date,
      time: session.time,
      duration: session.duration,
      location: session.location,
      locationType: session.locationType,
      meetingUrl: session.meetingUrl || "",
      description: session.description,
      maxParticipants: session.maxParticipants,
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleUpdateSession = async () => {
    try {
      const studentId = getStudentId();
      const response = await fetch(
        `${API_BASE_URL}/student/update-session/${editingSession.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editForm, studentId }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update session");
      }

      await loadCreatedSessions();
      await loadAvailableSessions();
      showNotificationMessage("Session updated successfully!", "success");
      setShowEditModal(false);
      setEditingSession(null);
    } catch (error) {
      console.error("Error updating session:", error);
      showNotificationMessage(error.message || "Failed to update session", "error");
    }
  };

  const handleDeleteCreatedSession = async (sessionId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this session? All registered students will be notified."
      )
    ) {
      try {
        const studentId = getStudentId();
        const response = await fetch(
          `${API_BASE_URL}/student/delete-session/${sessionId}?studentId=${studentId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Failed to delete session");
        }

        await loadCreatedSessions();
        await loadAvailableSessions();
        showNotificationMessage("Session deleted successfully!", "success");
      } catch (error) {
        console.error("Error deleting session:", error);
        showNotificationMessage(error.message || "Failed to delete session", "error");
      }
    }
  };

  const getStatusColor = (date, time) => {
    const sessionDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (sessionDateTime < now) {
      return "bg-gray-100 text-gray-600";
    }

    return "bg-green-100 text-green-700";
  };

  const getStatusText = (date, time) => {
    const sessionDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (sessionDateTime < now) {
      return "Completed";
    }

    return "Upcoming";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating, size = "w-4 h-4", filledClass = "fill-yellow-400 text-yellow-400") => {
    const rounded = Math.round(rating || 0);
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${size} ${index < rounded ? filledClass : "text-slate-300"}`}
      />
    ));
  };

  const getSessionRatingInfo = (session) => {
    const studentId = getStudentId();
    const ratings = session.ratings || [];
    const isOwnSession = session.requestedById === studentId;
    const myRating = ratings.find((rating) => rating.studentId === studentId);

    return {
      canRate: session.studentRequest && !isOwnSession && !myRating,
      isOwnSession,
      myRating,
    };
  };

  const submitSessionRating = async (session, rating) => {
    try {
      const studentName = getStudentName();
      const studentId = getStudentId();
      const email = getStudentEmail();

      if (!studentName || !studentId || !email) {
        showNotificationMessage("Please login first to rate a session", "error");
        return;
      }

      setSubmittingRatingId(session.id);

      const response = await fetch(`${API_BASE_URL}/student/rate-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: session.id,
          studentName,
          studentId,
          email,
          rating,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit rating");
      }

      await Promise.all([
        loadRegisteredSessions(),
        loadAvailableSessions(),
        loadCreatedSessions(),
      ]);

      showNotificationMessage("Thanks for rating this session!", "success");
    } catch (error) {
      console.error("Error rating session:", error);
      showNotificationMessage(error.message || "Failed to submit rating", "error");
    } finally {
      setSubmittingRatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex p-4 bg-white rounded-full mb-4 shadow-lg">
            <Loader className="w-8 h-8 text-[#22C55E] animate-spin" />
          </div>
          <p className="text-slate-500">Loading your sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0]">
      {showNotification && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
          <div
            className={`${
              notificationType === "success"
                ? "bg-gradient-to-r from-[#22C55E] to-[#16a34a]"
                : "bg-gradient-to-r from-red-500 to-red-600"
            } text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-sm max-w-md`}
          >
            {notificationType === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{notificationMessage}</span>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-[#0F172A] via-[#1e293b] to-[#0F172A] text-white sticky top-0 z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#22C55E]/20 rounded-2xl backdrop-blur-sm">
                <BookOpen className="w-8 h-8 text-[#22C55E]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  My <span className="text-[#22C55E]">Study Sessions</span>
                </h1>
                <p className="text-slate-300 mt-1">
                  Track and manage your registered sessions
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                loadData();
                loadCreatedSessions();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Registered Sessions</p>
                <p className="text-2xl font-bold text-[#22C55E]">
                  {registeredSessions.length}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-[#22C55E] opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Upcoming Sessions</p>
                <p className="text-2xl font-bold text-blue-500">
                  {
                    registeredSessions.filter(
                      (s) => new Date(`${s.date}T${s.time}`) > new Date()
                    ).length
                  }
                </p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Completed Sessions</p>
                <p className="text-2xl font-bold text-gray-500">
                  {
                    registeredSessions.filter(
                      (s) => new Date(`${s.date}T${s.time}`) < new Date()
                    ).length
                  }
                </p>
              </div>
              <Award className="w-8 h-8 text-gray-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Created Sessions</p>
                <p className="text-2xl font-bold text-purple-500">
                  {createdSessions.length}
                </p>
              </div>
              <Sparkles className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("registered")}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "registered"
                ? "bg-[#22C55E] text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            My Registered Sessions ({registeredSessions.length})
          </button>

          <button
            onClick={() => setActiveTab("available")}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "available"
                ? "bg-[#22C55E] text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Available Sessions ({availableSessions.length})
          </button>

          <button
            onClick={() => setActiveTab("created")}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "created"
                ? "bg-[#22C55E] text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            My Created Sessions ({createdSessions.length})
          </button>
        </div>

        {/* Registered Sessions Tab */}
        {activeTab === "registered" && (
          <>
            {registeredSessions.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                <BookOpen className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">
                  No registered sessions yet
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  Browse available sessions and register to get started!
                </p>
                <button
                  onClick={() => setActiveTab("available")}
                  className="mt-4 px-6 py-2 bg-[#22C55E] text-white rounded-xl hover:bg-[#16a34a] transition-colors inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Browse Available Sessions
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {registeredSessions.map((session) => {
                  const isUpcoming =
                    new Date(`${session.date}T${session.time}`) > new Date();
                  const ratingInfo = getSessionRatingInfo(session);

                  return (
                    <div
                      key={session.id}
                      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div
                        className={`p-4 ${
                          isUpcoming
                            ? "bg-gradient-to-r from-green-50 to-emerald-50"
                            : "bg-gradient-to-r from-gray-50 to-slate-50"
                        } border-b border-slate-100`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-[#0F172A] text-lg">
                              {session.subject}
                            </h3>
                            <p className="text-sm text-slate-500">
                              by {session.instructor}
                            </p>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                              session.date,
                              session.time
                            )}`}
                          >
                            {isUpcoming ? (
                              <ClockIcon className="w-3 h-3" />
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                            {getStatusText(session.date, session.time)}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4 text-[#22C55E]" />
                          <span>{formatDate(session.date)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="w-4 h-4 text-[#22C55E]" />
                          <span>
                            {session.time} ({session.duration} hours)
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          {session.locationType === "online" ? (
                            <Video className="w-4 h-4 text-[#06B6D4]" />
                          ) : (
                            <Building className="w-4 h-4 text-[#22C55E]" />
                          )}
                          <span>{session.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span>
                            {session.currentParticipants}/
                            {session.maxParticipants} participants
                          </span>
                        </div>

                        {session.studentRequest && (
                          <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-xs font-semibold text-amber-800">
                                  Creator Overall Rating
                                </p>
                                <p className="text-xs text-amber-700">
                                  {session.creatorTotalRatings || 0} ratings received
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 justify-end">
                                  {renderStars(session.creatorOverallRating)}
                                </div>
                                <p className="text-sm font-semibold text-amber-900 mt-1">
                                  {(session.creatorOverallRating || 0).toFixed(1)}/5
                                </p>
                              </div>
                            </div>

                            {ratingInfo.myRating && (
                              <p className="text-xs text-amber-800 mt-2">
                                Your rating: {ratingInfo.myRating.rating}/5
                              </p>
                            )}

                            {ratingInfo.canRate && (
                              <div className="mt-3 pt-3 border-t border-amber-200">
                                <p className="text-xs font-medium text-amber-900 mb-2">
                                  Rate this student-created session
                                </p>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }, (_, index) => {
                                    const starValue = index + 1;
                                    const isSubmitting = submittingRatingId === session.id;

                                    return (
                                      <button
                                        key={starValue}
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={() => submitSessionRating(session, starValue)}
                                        className="p-1 rounded-md hover:bg-amber-100 transition-colors disabled:opacity-50"
                                        title={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
                                      >
                                        <Star className="w-5 h-5 text-amber-400 hover:fill-amber-400" />
                                      </button>
                                    );
                                  })}
                                  <span className="text-xs text-amber-700 ml-2">
                                    Click to rate 1 to 5 stars
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {session.locationType === "online" &&
                          session.meetingUrl &&
                          isUpcoming && (
                            <a
                              href={session.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-1"
                            >
                              <Link className="w-3 h-3" />
                              Join Meeting Link
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}

                        <div className="flex gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleViewSession(session)}
                            className="flex-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>

                          {isUpcoming && (
                            <button
                              onClick={() => handleUnregister(session)}
                              className="flex-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Unregister
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Available Sessions Tab */}
        {activeTab === "available" && (
          <>
            {availableSessions.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                <Sparkles className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">
                  No available sessions at the moment
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  Check back later for new study sessions!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableSessions.map((session) => {
                  const isRegistered = registeredSessions.some(
                    (s) => s.id === session.id
                  );
                  const availableSeats =
                    session.maxParticipants - session.currentParticipants;

                  return (
                    <div
                      key={session.id}
                      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="p-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                        <h3 className="font-bold text-[#0F172A] text-lg">
                          {session.subject}
                        </h3>
                        <p className="text-sm text-slate-500">
                          by {session.instructor}
                        </p>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4 text-[#22C55E]" />
                          <span>{formatDate(session.date)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="w-4 h-4 text-[#22C55E]" />
                          <span>
                            {session.time} ({session.duration} hours)
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          {session.locationType === "online" ? (
                            <Video className="w-4 h-4 text-[#06B6D4]" />
                          ) : (
                            <Building className="w-4 h-4 text-[#22C55E]" />
                          )}
                          <span>{session.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span>{availableSeats} seats available</span>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleViewSession(session)}
                            className="flex-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>

                          {isRegistered ? (
                            <button
                              disabled
                              className="flex-1 px-3 py-1.5 bg-green-100 text-green-600 rounded-lg text-sm font-medium cursor-default flex items-center justify-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Already Registered
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRegister(session)}
                              className="flex-1 px-3 py-1.5 bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white rounded-lg text-sm font-medium hover:shadow-md transition-all flex items-center justify-center gap-1"
                            >
                              <BookOpen className="w-4 h-4" />
                              Register
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Created Sessions Tab */}
        {activeTab === "created" && (
          <>
            {createdSessions.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                <Plus className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">
                  No sessions created yet
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  Create your own study session!
                </p>
                <button
                  onClick={() => (window.location.href = "/create-session")}
                  className="mt-4 px-6 py-2 bg-[#22C55E] text-white rounded-xl hover:bg-[#16a34a] transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Session
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {createdSessions.map((session) => {
                  const isUpcoming =
                    new Date(`${session.date}T${session.time}`) > new Date();

                  return (
                    <div
                      key={session.id}
                      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all"
                    >
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-[#0F172A] text-lg">
                              {session.subject}
                            </h3>
                            <p className="text-sm text-slate-500">
                              Created by you
                            </p>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                              session.date,
                              session.time
                            )}`}
                          >
                            {isUpcoming ? (
                              <ClockIcon className="w-3 h-3" />
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                            {getStatusText(session.date, session.time)}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold text-amber-800">
                                Your Overall Rating
                              </p>
                              <p className="text-xs text-amber-700">
                                Based on all ratings across your sessions
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 justify-end">
                                {renderStars(session.creatorOverallRating)}
                              </div>
                              <p className="text-sm font-semibold text-amber-900 mt-1">
                                {(session.creatorOverallRating || 0).toFixed(1)}/5
                              </p>
                              <p className="text-xs text-amber-700">
                                {session.creatorTotalRatings || 0} ratings
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4 text-[#22C55E]" />
                          <span>{formatDate(session.date)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="w-4 h-4 text-[#22C55E]" />
                          <span>
                            {session.time} ({session.duration} hours)
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          {session.locationType === "online" ? (
                            <Video className="w-4 h-4 text-[#06B6D4]" />
                          ) : (
                            <Building className="w-4 h-4 text-[#22C55E]" />
                          )}
                          <span>{session.location}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Users className="w-4 h-4 text-slate-400" />
                          <span>
                            {session.currentParticipants}/
                            {session.maxParticipants} participants
                          </span>
                        </div>

                        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                          <div>
                            <p className="text-xs font-medium text-slate-700">
                              This Session Rating
                            </p>
                            <p className="text-xs text-slate-500">
                              {session.totalRatings || 0} ratings received
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 justify-end">
                              {renderStars(session.averageRating)}
                            </div>
                            <p className="text-sm font-semibold text-slate-800 mt-1">
                              {(session.averageRating || 0).toFixed(1)}/5
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => handleViewSession(session)}
                            className="flex-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>

                          {isUpcoming && (
                            <>
                              <button
                                onClick={() => handleEditSession(session)}
                                className="flex-1 px-3 py-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteCreatedSession(session.id)
                                }
                                className="flex-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Session Details Modal */}
      {showRegisterModal && selectedSession && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#0F172A]">Register for Session</h3>
                <p className="text-sm text-slate-500">{selectedSession.subject}</p>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-[#22C55E]/10 to-[#06B6D4]/10 p-4 rounded-xl">
                <p className="text-sm"><strong>Date:</strong> {formatDate(selectedSession.date)}</p>
                <p className="text-sm"><strong>Time:</strong> {selectedSession.time} ({selectedSession.duration} hours)</p>
                <p className="text-sm"><strong>Location:</strong> {selectedSession.location}</p>
                <p className="text-sm"><strong>Available:</strong> {selectedSession.maxParticipants - selectedSession.currentParticipants} seats</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Student Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  disabled
                  className="w-full px-4 py-2 border rounded-xl bg-slate-50 text-slate-500 border-slate-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Student ID</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  disabled
                  className="w-full px-4 py-2 border rounded-xl bg-slate-50 text-slate-500 border-slate-200"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                  className="w-full px-4 py-2 border rounded-xl bg-slate-50 text-slate-500 border-slate-200"
                />
              </div>
            </div>

            <div className="border-t border-slate-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => setShowRegisterModal(false)}
                className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRegistration}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                Confirm Registration
              </button>
            </div>
          </div>
        </div>
      )}

      {showSessionModal && selectedSession && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#0F172A]">
                Session Details
              </h3>
              <button
                onClick={() => setShowSessionModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0F172A]">
                  {selectedSession.subject}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  by {selectedSession.instructor}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Date
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(selectedSession.date)}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Time
                  </p>
                  <p className="text-sm font-medium">
                    {selectedSession.time} ({selectedSession.duration} hours)
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Location
                  </p>
                  <p className="text-sm font-medium">
                    {selectedSession.location}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Participants
                  </p>
                  <p className="text-sm font-medium">
                    {selectedSession.currentParticipants}/
                    {selectedSession.maxParticipants}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Description
                </p>
                <p className="text-sm text-slate-600">
                  {selectedSession.description}
                </p>
              </div>

              {selectedSession.locationType === "online" &&
                selectedSession.meetingUrl && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      Meeting Link
                    </p>
                    <a
                      href={selectedSession.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all flex items-center gap-1"
                    >
                      {selectedSession.meetingUrl}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

              {selectedSession.studentRequest && (
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-xs text-purple-700 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    This session was requested by {selectedSession.requestedBy}
                  </p>
                </div>
              )}

              {selectedSession.studentRequest && (
                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-amber-900">
                        Creator Overall Rating
                      </p>
                      <p className="text-xs text-amber-700">
                        {selectedSession.creatorTotalRatings || 0} total ratings
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end">
                        {renderStars(selectedSession.creatorOverallRating)}
                      </div>
                      <p className="text-sm font-semibold text-amber-900 mt-1">
                        {(selectedSession.creatorOverallRating || 0).toFixed(1)}/5
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setShowSessionModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Close
              </button>

              {activeTab === "registered" &&
                new Date(
                  `${selectedSession.date}T${selectedSession.time}`
                ) > new Date() && (
                  <button
                    onClick={() => {
                      setShowSessionModal(false);
                      handleUnregister(selectedSession);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Unregister
                  </button>
                )}

              {activeTab === "created" && (
                <>
                  <button
                    onClick={() => {
                      setShowSessionModal(false);
                      handleEditSession(selectedSession);
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Session
                  </button>
                  <button
                    onClick={() => {
                      setShowSessionModal(false);
                      handleDeleteCreatedSession(selectedSession.id);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Session
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Unregister Confirmation Modal */}
      {showUnregisterConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-4">
              <h3 className="text-xl font-bold text-[#0F172A]">
                Confirm Unregister
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-red-50 rounded-xl p-4">
                <p className="text-sm text-red-700">
                  Are you sure you want to unregister from{" "}
                  <strong>{showUnregisterConfirm.subject}</strong>?
                </p>
                <p className="text-xs text-red-600 mt-2">
                  This action cannot be undone. Your seat will become available
                  for other students.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-sm">
                  <strong>Date:</strong> {formatDate(showUnregisterConfirm.date)}
                </p>
                <p className="text-sm">
                  <strong>Time:</strong> {showUnregisterConfirm.time}
                </p>
                <p className="text-sm">
                  <strong>Location:</strong> {showUnregisterConfirm.location}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => setShowUnregisterConfirm(null)}
                className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={confirmUnregister}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Yes, Unregister
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {showEditModal && editingSession && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                <Edit className="w-5 h-5 text-yellow-500" />
                Edit Session
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={editForm.subject}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subject: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] border-slate-200"
                    placeholder="e.g., Advanced JavaScript"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Instructor *
                  </label>
                  <input
                    type="text"
                    value={getStudentName()}
                    disabled
                    className="w-full px-4 py-2 border rounded-xl bg-gray-100 text-gray-500 border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, date: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={editForm.time}
                    onChange={(e) =>
                      setEditForm({ ...editForm, time: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Duration (hours)
                  </label>
                  <select
                    value={editForm.duration}
                    onChange={(e) =>
                      setEditForm({ ...editForm, duration: parseInt(e.target.value) })
                    }
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
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Location Type *
                  </label>
                  <select
                    value={editForm.locationType}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        locationType: e.target.value,
                        meetingUrl: "",
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                  >
                    <option value="physical">Physical (In-person)</option>
                    <option value="online">Online (Virtual)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Location/Venue *
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, location: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] border-slate-200"
                    placeholder={
                      editForm.locationType === "online"
                        ? "e.g., Google Meet, Zoom"
                        : "e.g., Room 301, Main Building"
                    }
                  />
                </div>
              </div>

              {editForm.locationType === "online" && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Meeting URL *
                  </label>
                  <input
                    type="url"
                    value={editForm.meetingUrl}
                    onChange={(e) =>
                      setEditForm({ ...editForm, meetingUrl: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] border-slate-200"
                    placeholder="https://meet.google.com/..."
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  Max Participants *
                </label>
                <input
                  type="number"
                  value={editForm.maxParticipants}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      maxParticipants: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] border-slate-200"
                  min="1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  Description *
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] resize-none border-slate-200"
                  placeholder="Describe what students will learn in this session..."
                />
              </div>
            </div>

            <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSession}
                className="px-4 py-2 bg-gradient-to-r from-[#22C55E] to-[#16a34a] text-white rounded-xl font-medium flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <Save className="w-4 h-4" />
                Update Session
              </button>
            </div>
          </div>
        </div>
      )}

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

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-in {
          animation-duration: 0.3s;
          animation-fill-mode: both;
        }

        .slide-in-from-right-5 {
          animation-name: slide-in-from-right-5;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default StudentRegisteredSessions;
