import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  User, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Coffee,
  Building,
  Home,
  Users,
  Eye,
  RefreshCw,
  AlertCircle,
  Download,
  Printer,
  Armchair,
  Sofa,
  Table,
  Zap,
  Wifi,
  Power,
  Thermometer,
  Volume2,
  Circle,
  Square
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api';
const AREAS_API_URL = 'http://localhost:8081/api/areas';

const SlotReservationSystem = () => {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [duration, setDuration] = useState(2);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formErrors, setFormErrors] = useState({});
  const [showAreaDetails, setShowAreaDetails] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLimit, setBookingLimit] = useState({
    todayBookings: 0,
    remainingBookings: 3,
    canBook: true
  });
  const [statistics, setStatistics] = useState({
    totalActiveReservations: 0,
    todayReservations: 0,
    uniqueStudentsToday: 0
  });

  // Load data from backend
  useEffect(() => {
    loadAreas();
    loadReservations();
    loadStatistics();
  }, []);

  const loadAreas = async () => {
    try {
      const response = await fetch(AREAS_API_URL);
      if (!response.ok) throw new Error('Failed to fetch areas');
      const data = await response.json();
      setAreas(data);
    } catch (error) {
      console.error('Error loading areas:', error);
      showNotificationMessage('Failed to load areas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadReservations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations`);
      if (!response.ok) throw new Error('Failed to fetch reservations');
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Error loading reservations:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/statistics`);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const checkBookingAvailability = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/check-availability?email=${encodeURIComponent(email)}`);
      if (!response.ok) throw new Error('Failed to check availability');
      const data = await response.json();
      setBookingLimit({
        todayBookings: data.todayBookings,
        remainingBookings: data.remainingBookings,
        canBook: data.canBook
      });
      return data;
    } catch (error) {
      console.error('Error checking availability:', error);
      return null;
    }
  };

  const showNotificationMessage = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  };

  // Validation functions adding
  const validateName = (name) => {
    if (!name) return 'Student name is required';
    if (name.length < 3) return 'Name must be at least 3 characters';
    if (name.length > 50) return 'Name cannot exceed 50 characters';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
    return '';
  };

  const validateStudentId = (id) => {
    if (!id) return 'Student ID is required';
    const sdRegex = /^SD\d{7}$/;
    if (!sdRegex.test(id)) return 'Student ID must be in format SD followed by 7 digits (e.g., SD2024001)';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    if (!email.toLowerCase().endsWith('@gmail.com')) return 'Please use your Gmail email address (@gmail.com)';
    return '';
  };

  const handleSeatClick = async (area, seat) => {
    if (seat.status === 'occupied') {
      showNotificationMessage(`Seat ${seat.number} is already occupied!`, 'error');
      return;
    }
    
    // Check if email is already entered
    if (email) {
      const availability = await checkBookingAvailability(email);
      if (availability && !availability.canBook) {
        showNotificationMessage(`You have reached your daily booking limit (${availability.todayBookings}/3). You cannot book more seats today.`, 'error');
        return;
      }
    }
    
    setSelectedArea(area);
    setSelectedSeat(seat);
    setFormErrors({});
    setShowBookingModal(true);
  };

  const handleBooking = async () => {
    // Validate all fields
    const errors = {};
    const nameError = validateName(studentName);
    if (nameError) errors.name = nameError;
    
    const idError = validateStudentId(studentId);
    if (idError) errors.studentId = idError;
    
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotificationMessage('Please fix the errors in the form', 'error');
      return;
    }

    // Check booking limit before booking
    const availability = await checkBookingAvailability(email);
    if (!availability || !availability.canBook) {
      showNotificationMessage(`You have reached your daily booking limit (${availability?.todayBookings || 0}/3). You cannot book more seats today.`, 'error');
      setShowBookingModal(false);
      return;
    }

    const bookingData = {
      areaId: selectedArea.id,
      areaName: selectedArea.name,
      seatId: selectedSeat.id,
      seatNumber: selectedSeat.number,
      studentName: studentName,
      studentId: studentId,
      email: email,
      durationHours: duration
    };

    try {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to book seat');
      }

      const newReservation = await response.json();
      
      // Update local state
      await loadAreas();
      await loadReservations();
      await loadStatistics();
      
      setShowBookingModal(false);
      setStudentName('');
      setStudentId('');
      setDuration(2);
      setFormErrors({});
      
      showNotificationMessage(`Seat ${selectedSeat.number} booked successfully for ${duration} hour(s)! A confirmation email has been sent to ${email}`, 'success');
    } catch (error) {
      console.error('Error booking seat:', error);
      showNotificationMessage(error.message || 'Failed to book seat', 'error');
    }
  };

  const getAvailableSeats = (area) => {
    if (!area.seats) return 0;
    return area.seats.filter(seat => seat.status === 'available').length;
  };

  const getOccupiedSeats = (area) => {
    if (!area.seats) return 0;
    return area.seats.filter(seat => seat.status === 'occupied').length;
  };

  const getSeatIcon = (type, status) => {
    const iconProps = { className: `w-4 h-4 ${status === 'available' ? 'text-green-500' : 'text-red-500'}` };
    
    switch(type) {
      case 'carrel':
        return <Armchair {...iconProps} />;
      case 'window':
        return <Sofa {...iconProps} />;
      case 'corner':
        return <Armchair {...iconProps} />;
      case 'premium':
      case 'cabin':
        return <Armchair {...iconProps} />;
      case 'group':
      case 'table':
        return <Table {...iconProps} />;
      default:
        return <Square {...iconProps} />;
    }
  };

  const filteredAreas = areas.filter(area => 
    area.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-check availability when email changes
  const handleEmailChange = async (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (validateEmail(newEmail) === '') {
      await checkBookingAvailability(newEmail);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] text-white sticky top-0 z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#22C55E]/20 rounded-xl">
                  <Armchair className="w-6 h-6 text-[#22C55E]" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Campus <span className="text-[#22C55E]">Seat Reservation</span> System
                </h1>
              </div>
              <p className="text-slate-300">Book your perfect study spot across campus</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs">Available</span>
                <div className="w-3 h-3 bg-red-500 rounded-full ml-2"></div>
                <span className="text-xs">Occupied</span>
                <div className="w-3 h-3 bg-yellow-500 rounded-full ml-2"></div>
                <span className="text-xs">Power Outlet</span>
              </div>
              <button 
                onClick={() => { loadAreas(); loadReservations(); loadStatistics(); }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-[#22C55E]">{statistics.totalActiveReservations}</div>
              <div className="text-xs text-slate-500">Active Reservations</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{statistics.todayReservations}</div>
              <div className="text-xs text-slate-500">Bookings Today</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">{statistics.uniqueStudentsToday}</div>
              <div className="text-xs text-slate-500">Students Today</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {showNotification && (
          <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
            <div className={`${notificationType === 'success' ? 'bg-[#22C55E]' : 'bg-red-500'} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 max-w-md`}>
              {notificationType === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-medium text-sm">{notificationMessage}</span>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search areas by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#22C55E] text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#22C55E] text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Areas Display */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
              <div className="w-8 h-8 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-500">Loading areas...</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAreas.map((area) => {
              const IconComponent = ({ className }) => {
                const iconMap = {
                  'BookOpen': <BookOpen className={className} />,
                  'Home': <Home className={className} />,
                  'Building': <Building className={className} />,
                  'Coffee': <Coffee className={className} />,
                  'Users': <Users className={className} />,
                  'MapPin': <MapPin className={className} />
                };
                return iconMap[area.icon] || <Building className={className} />;
              };
              
              const available = getAvailableSeats(area);
              const occupied = getOccupiedSeats(area);
              const occupancyRate = area.capacity > 0 ? (occupied / area.capacity) * 100 : 0;

              return (
                <div key={area.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="p-5 border-b border-slate-100" style={{ backgroundColor: `${area.color}10` }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${area.color}20` }}>
                          <IconComponent className="w-5 h-5" style={{ color: area.color }} />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#0F172A]">{area.name}</h3>
                          <p className="text-xs text-slate-500 mt-1">{area.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#22C55E]">{available}</div>
                        <div className="text-xs text-slate-500">of {area.capacity} seats</div>
                      </div>
                    </div>
                    
                    {/* Amenities */}
                    {area.amenities && area.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {area.amenities.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-white/50 rounded-full text-slate-600">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                      <div 
                        className="h-2 rounded-full transition-all" 
                        style={{ width: `${occupancyRate}%`, backgroundColor: area.color }}
                      ></div>
                    </div>
                  </div>

                  {/* 2D Realistic Seat Layout */}
                  <div className="p-4">
                    <div className="text-xs font-medium text-slate-500 mb-3 flex items-center justify-between">
                      <span>Seat Layout (Click to book)</span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs">Power outlet available</span>
                      </span>
                    </div>
                    {area.seats && area.seats.length > 0 ? (
                      <div 
                        className="grid gap-2"
                        style={{ 
                          gridTemplateColumns: `repeat(${area.cols || 4}, minmax(0, 1fr))`,
                        }}
                      >
                        {area.seats.map((seat) => (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatClick(area, seat)}
                            disabled={seat.status === 'occupied'}
                            className={`
                              relative group p-2 rounded-lg text-center transition-all duration-200
                              ${seat.status === 'available' 
                                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-400 hover:shadow-md cursor-pointer' 
                                : 'bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 cursor-not-allowed opacity-70'
                              }
                            `}
                          >
                            <div className="flex flex-col items-center gap-1">
                              {getSeatIcon(seat.type, seat.status)}
                              <div className="text-xs font-medium">{seat.number}</div>
                              {seat.hasPower && seat.status === 'available' && (
                                <div className="absolute top-0 right-0">
                                  <Zap className="w-3 h-3 text-yellow-500" />
                                </div>
                              )}
                            </div>
                            {seat.status === 'occupied' && (
                              <div className="absolute -top-1 -right-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-400">
                        <p className="text-sm">No seats configured</p>
                      </div>
                    )}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs">
                      <div className="flex gap-3">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Available: {available}
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Occupied: {occupied}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowAreaDetails(area)}
                        className="text-[#22C55E] hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {filteredAreas.map((area) => {
              const IconComponent = ({ className }) => {
                const iconMap = {
                  'BookOpen': <BookOpen className={className} />,
                  'Home': <Home className={className} />,
                  'Building': <Building className={className} />,
                  'Coffee': <Coffee className={className} />,
                  'Users': <Users className={className} />,
                  'MapPin': <MapPin className={className} />
                };
                return iconMap[area.icon] || <Building className={className} />;
              };
              
              const available = getAvailableSeats(area);
              const occupied = getOccupiedSeats(area);
              const occupancyRate = area.capacity > 0 ? (occupied / area.capacity) * 100 : 0;

              return (
                <div key={area.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${area.color}20` }}>
                          <IconComponent className="w-6 h-6" style={{ color: area.color }} />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#0F172A]">{area.name}</h3>
                          <p className="text-sm text-slate-500">{area.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {area.amenities && area.amenities.slice(0, 3).map((amenity, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-lg font-bold text-[#22C55E]">{available} available</div>
                        <div className="text-xs text-slate-500">of {area.capacity} seats</div>
                        <div className="w-32 mt-2">
                          <div className="w-full bg-slate-200 rounded-full h-1.5">
                            <div 
                              className="h-1.5 rounded-full transition-all" 
                              style={{ width: `${occupancyRate}%`, backgroundColor: area.color }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Compact Seat Layout */}
                    {area.seats && area.seats.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div 
                          className="grid gap-1.5"
                          style={{ 
                            gridTemplateColumns: `repeat(${Math.min(area.cols, 8)}, minmax(0, 1fr))`,
                          }}
                        >
                          {area.seats.slice(0, 24).map((seat) => (
                            <button
                              key={seat.id}
                              onClick={() => handleSeatClick(area, seat)}
                              disabled={seat.status === 'occupied'}
                              className={`
                                p-1 rounded text-center transition-all border
                                ${seat.status === 'available' 
                                  ? 'bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer' 
                                  : 'bg-red-50 border-red-200 cursor-not-allowed opacity-70'
                                }
                              `}
                            >
                              <div className="text-xs">{seat.number}</div>
                            </button>
                          ))}
                          {area.seats.length > 24 && (
                            <div className="col-span-full text-center text-xs text-slate-400 mt-2">
                              +{area.seats.length - 24} more seats
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredAreas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No areas found matching your search</p>
          </div>
        )}
      </div>

      {/* Area Details Modal */}
      {showAreaDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#0F172A]">{showAreaDetails.name}</h3>
              <button
                onClick={() => setShowAreaDetails(null)}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-slate-600">{showAreaDetails.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-[#22C55E]" />
                  <span>Capacity: {showAreaDetails.capacity} seats</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-[#22C55E]" />
                  <span>Seat Type: {showAreaDetails.seatType}</span>
                </div>
              </div>
              {showAreaDetails.amenities && showAreaDetails.amenities.length > 0 && (
                <div>
                  <h4 className="font-semibold text-[#0F172A] mb-2">Amenities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {showAreaDetails.amenities.map((amenity, idx) => (
                      <span key={idx} className="text-sm px-3 py-1 bg-slate-100 rounded-full text-slate-700">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal with Form Validation */}
      {showBookingModal && selectedArea && selectedSeat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#0F172A]">Book Your Seat</h3>
                <p className="text-sm text-slate-500">{selectedArea.name} - Seat {selectedSeat.number}</p>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Booking Limit Warning */}
              {bookingLimit.todayBookings > 0 && (
                <div className={`p-3 rounded-lg ${bookingLimit.remainingBookings <= 1 ? 'bg-orange-50 border border-orange-200' : 'bg-blue-50 border border-blue-200'}`}>
                  <div className="flex items-center gap-2">
                    <AlertCircle className={`w-4 h-4 ${bookingLimit.remainingBookings <= 1 ? 'text-orange-500' : 'text-blue-500'}`} />
                    <span className="text-sm">
                      You have {bookingLimit.todayBookings} booking(s) today. 
                      {bookingLimit.remainingBookings > 0 ? ` You can book ${bookingLimit.remainingBookings} more.` : ' Daily limit reached!'}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="bg-gradient-to-r from-[#22C55E]/10 to-[#06B6D4]/10 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Armchair className="w-4 h-4 text-[#22C55E]" />
                  <span className="text-sm font-medium">Seat Details</span>
                </div>
                <p className="text-sm text-slate-600">{selectedArea.name}</p>
                <p className="text-xs text-slate-500 mt-1">Seat {selectedSeat.number} • {selectedArea.seatType} seating</p>
                {selectedSeat.hasPower && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-yellow-600">
                    <Zap className="w-3 h-3" />
                    <span>Power outlet available</span>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                    formErrors.name ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="Enter your full name"
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Student ID / SD Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                    formErrors.studentId ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="SD2024001"
                />
                {formErrors.studentId && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.studentId}</p>
                )}
                <p className="text-xs text-slate-400 mt-1">Format: SD followed by 7 digits</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                    formErrors.email ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="student@gmail.com"
                />
                {formErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Duration <span className="text-red-500">*</span>
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                >
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={3}>3 hours</option>
                  <option value={4}>4 hours</option>
                  <option value={5}>5 hours</option>
                  <option value={6}>6 hours</option>
                </select>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>Booking confirmation will be sent to your email</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-slate-200 px-6 py-4 flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                disabled={!bookingLimit.canBook && email && validateEmail(email) === ''}
                className={`flex-1 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                  bookingLimit.canBook || !email || validateEmail(email) !== ''
                    ? 'bg-[#22C55E] hover:bg-[#1ea34e] text-white'
                    : 'bg-slate-300 cursor-not-allowed text-slate-500'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Confirm Booking
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
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-in {
          animation-duration: 0.3s;
          animation-fill-mode: both;
        }
        .slide-in-from-right-5 {
          animation-name: slide-in-from-right-5;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SlotReservationSystem;