import React, { useState, useEffect } from 'react';
import {
  Armchair,
  Trash2,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Zap,
  RefreshCw,
  Building,
  Library,
  Home,
  Coffee,
  Wifi,
  Thermometer,
  Volume2,
  Power,
  ChevronRight
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/reservations';

const StudentBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [statistics, setStatistics] = useState({
    totalActiveReservations: 0,
    todayReservations: 0,
    uniqueStudentsToday: 0,
    maxBookingsPerDay: 3
  });
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  const getStudentEmail = () => {
    const session = localStorage.getItem('userSession');
    if (session) {
      const userSession = JSON.parse(session);
      return userSession.email;
    }
    return null;
  };

  useEffect(() => {
    loadBookings();
    loadStatistics();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const email = getStudentEmail();
      
      if (!email) {
        window.location.href = '/login';
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/student/${email}`);
      
      if (!response.ok) throw new Error('Failed to load reservations');
      
      const data = await response.json();
      
      // Enhance bookings with display status
      const enhancedBookings = data.map(booking => {
        const now = new Date();
        const bookedUntil = new Date(booking.bookedUntil);
        const bookedAt = new Date(booking.bookedAt);
        
        let displayStatus;
        if (booking.status === 'cancelled') {
          displayStatus = 'cancelled';
        } else if (bookedUntil < now) {
          displayStatus = 'completed';
        } else if (bookedAt <= now && bookedUntil >= now) {
          displayStatus = 'active';
        } else {
          displayStatus = 'upcoming';
        }
        
        // Format date and time
        const date = new Date(booking.bookedAt).toLocaleDateString();
        const startTime = new Date(booking.bookedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const endTime = new Date(booking.bookedUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        return {
          ...booking,
          displayStatus,
          date,
          startTime,
          endTime,
          timeSlot: `${startTime} - ${endTime}`
        };
      });
      
      setBookings(enhancedBookings);
      
    } catch (error) {
      console.error('Error loading bookings:', error);
      showNotificationMessage('Failed to load reservations', 'error');
    } finally {
      setLoading(false);
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

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this seat reservation? The seat will become available for others.')) {
      try {
        const email = getStudentEmail();
        if (!email) return;
        
        const response = await fetch(`${API_BASE_URL}/${bookingId}?email=${email}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || data.error || 'Failed to cancel reservation');
        }
        
        // Remove booking from list
        setBookings(bookings.filter(booking => booking.id !== bookingId));
        await loadStatistics();
        showNotificationMessage(data.message || 'Reservation cancelled successfully!', 'success');
        
      } catch (error) {
        console.error('Error cancelling booking:', error);
        showNotificationMessage(error.message || 'Failed to cancel reservation', 'error');
      }
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowBookingModal(true);
  };

  const handleNewReservation = () => {
    window.location.href = '/slot-reservation';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'upcoming': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'upcoming': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'Active Now';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getAreaIcon = (areaName) => {
    if (areaName?.toLowerCase().includes('library')) return <Library className="w-5 h-5" />;
    if (areaName?.toLowerCase().includes('birdnest')) return <Home className="w-5 h-5" />;
    if (areaName?.toLowerCase().includes('canteen')) return <Coffee className="w-5 h-5" />;
    return <Building className="w-5 h-5" />;
  };

  // Calculate local statistics from bookings
  const localStats = {
    total: bookings.length,
    active: bookings.filter(b => b.displayStatus === 'active').length,
    upcoming: bookings.filter(b => b.displayStatus === 'upcoming').length,
    completed: bookings.filter(b => b.displayStatus === 'completed').length,
    cancelled: bookings.filter(b => b.displayStatus === 'cancelled').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex p-4 bg-white rounded-full mb-4 shadow-lg">
            <div className="w-8 h-8 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-500">Loading your reservations...</p>
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
                <Armchair className="w-8 h-8 text-[#22C55E]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  My <span className="text-[#22C55E]">Seat Reservations</span>
                </h1>
                <p className="text-slate-300 mt-1">Manage your study spot bookings</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { loadBookings(); loadStatistics(); }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleNewReservation}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#22C55E] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] rounded-xl transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                New Reservation
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Reservations</p>
                <p className="text-2xl font-bold text-[#22C55E]">{localStats.total}</p>
              </div>
              <Armchair className="w-8 h-8 text-[#22C55E] opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Now</p>
                <p className="text-2xl font-bold text-green-500">{localStats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Upcoming</p>
                <p className="text-2xl font-bold text-blue-500">{localStats.upcoming}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Today's Bookings</p>
                <p className="text-2xl font-bold text-purple-500">{statistics.todayReservations}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-md">
            <Armchair className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No seat reservations yet</p>
            <p className="text-sm text-slate-400 mt-2">Book a study spot on campus!</p>
            <button
              onClick={handleNewReservation}
              className="mt-4 px-6 py-2 bg-[#22C55E] text-white rounded-xl hover:bg-[#16a34a] transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Make a Reservation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header with Area Name */}
                <div className="p-4 border-b border-slate-100" style={{ backgroundColor: '#06B6D410' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getAreaIcon(booking.areaName)}
                      <div>
                        <h3 className="font-bold text-[#0F172A]">{booking.areaName}</h3>
                        <p className="text-xs text-slate-500">Seat {booking.seatNumber}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(booking.displayStatus)}`}>
                      {getStatusIcon(booking.displayStatus)}
                      {getStatusText(booking.displayStatus)}
                    </span>
                  </div>
                </div>
                
                {/* Body */}
                <div className="p-4 space-y-3">
                  {/* Date and Time */}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">{booking.timeSlot}</span>
                  </div>
                  
                  {/* Duration */}
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-600">Duration: {booking.durationHours} hour(s)</span>
                  </div>
                  
                  {/* Seat Features */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {booking.seatType && (
                      <div className="flex items-center gap-1 text-xs px-2 py-1 bg-slate-100 rounded-full">
                        <Armchair className="w-3 h-3" />
                        <span className="capitalize">{booking.seatType} seat</span>
                      </div>
                    )}
                    {booking.hasPower && (
                      <div className="flex items-center gap-1 text-xs px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full">
                        <Zap className="w-3 h-3" />
                        <span>Power outlet</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleViewBooking(booking)}
                      className="flex-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    {(booking.displayStatus === 'active' || booking.displayStatus === 'upcoming') && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="flex-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showBookingModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                <Armchair className="w-5 h-5 text-[#22C55E]" />
                Reservation Details
              </h3>
              <button onClick={() => setShowBookingModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Area Info */}
              <div className="bg-gradient-to-r from-[#06B6D4]/10 to-[#22C55E]/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  {getAreaIcon(selectedBooking.areaName)}
                  <div>
                    <h4 className="font-bold text-[#0F172A] text-lg">{selectedBooking.areaName}</h4>
                    <p className="text-sm text-slate-500">Seat {selectedBooking.seatNumber}</p>
                  </div>
                </div>
              </div>
              
              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Date
                  </p>
                  <p className="text-sm font-medium">{selectedBooking.date}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Time Slot
                  </p>
                  <p className="text-sm font-medium">{selectedBooking.timeSlot}</p>
                </div>
              </div>
              
              {/* Duration */}
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">Duration</p>
                <p className="text-sm font-medium">{selectedBooking.durationHours} hour(s)</p>
              </div>
              
              {/* Seat Features */}
              <div>
                <h4 className="font-semibold text-[#0F172A] mb-2">Seat Features</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBooking.seatType && (
                    <div className="flex items-center gap-2 text-sm px-3 py-1.5 bg-slate-100 rounded-lg">
                      <Armchair className="w-4 h-4" />
                      <span className="capitalize">{selectedBooking.seatType} seat</span>
                    </div>
                  )}
                  {selectedBooking.hasPower && (
                    <div className="flex items-center gap-2 text-sm px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-lg">
                      <Zap className="w-4 h-4" />
                      <span>Power outlet available</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Status */}
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">Reservation Status</p>
                <span className={`inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(selectedBooking.displayStatus)}`}>
                  {getStatusIcon(selectedBooking.displayStatus)}
                  {getStatusText(selectedBooking.displayStatus)}
                </span>
              </div>
              
              {/* Booking Info */}
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-500 mb-1">Booking Reference</p>
                <p className="text-sm font-mono">#{selectedBooking.id}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Booked on: {new Date(selectedBooking.bookedAt).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
              <button onClick={() => setShowBookingModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Close
              </button>
              {(selectedBooking.displayStatus === 'active' || selectedBooking.displayStatus === 'upcoming') && (
                <button
                  onClick={() => {
                    handleCancelBooking(selectedBooking.id);
                    setShowBookingModal(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Cancel Reservation
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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

export default StudentBookings;