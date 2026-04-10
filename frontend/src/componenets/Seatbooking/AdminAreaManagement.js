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
  Square,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Settings,
  Layout,
  Maximize2,
  Minimize2,
  Move,
  Copy
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/areas';

const AdminAreaManagement = () => {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    totalAreas: 0,
    totalSeats: 0,
    availableSeats: 0,
    occupiedSeats: 0,
    areaStatistics: []
  });
  
  // Area form state
  const [areaForm, setAreaForm] = useState({
    name: '',
    icon: 'Building',
    color: '#22C55E',
    description: '',
    capacity: 0,
    rows: 4,
    cols: 4,
    amenities: [],
    seatType: 'standard'
  });
  
  // Seat form state
  const [seatForm, setSeatForm] = useState({
    number: '',
    type: 'standard',
    hasPower: false,
    status: 'available',
    id: null
  });

  // Available icons for selection
  const availableIcons = [
    { name: 'BookOpen', icon: BookOpen },
    { name: 'Home', icon: Home },
    { name: 'Building', icon: Building },
    { name: 'Coffee', icon: Coffee },
    { name: 'Users', icon: Users },
    { name: 'MapPin', icon: MapPin }
  ];

  // Available UI colors for seat
  const availableColors = [
    '#246b3e', '#06B6D4', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'
  ];

  // Load data from backend
  useEffect(() => {
    loadAreas();
    loadStatistics();
  }, []);

  const loadAreas = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
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

  const showNotificationMessage = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Validation functions
  const validateAreaForm = () => {
    const errors = {};
    if (!areaForm.name) errors.name = 'Area name is required';
    if (areaForm.name.length < 3) errors.name = 'Name must be at least 3 characters';
    if (!areaForm.description) errors.description = 'Description is required';
    if (areaForm.rows <= 0) errors.rows = 'Rows must be greater than 0';
    if (areaForm.cols <= 0) errors.cols = 'Columns must be greater than 0';
    return errors;
  };

  const validateSeatForm = () => {
    const errors = {};
    if (!seatForm.number) errors.number = 'Seat number is required';
    if (selectedArea && selectedArea.seats && selectedArea.seats.some(s => s.number === seatForm.number && s.id !== seatForm.id)) {
      errors.number = 'Seat number already exists in this area';
    }
    return errors;
  };

  const handleAddArea = () => {
    setAreaForm({
      name: '',
      icon: 'Building',
      color: '#22C55E',
      description: '',
      capacity: 0,
      rows: 4,
      cols: 4,
      amenities: [],
      seatType: 'standard'
    });
    setIsEditing(false);
    setFormErrors({});
    setShowAreaModal(true);
  };

  const handleEditArea = (area) => {
    setAreaForm({
      name: area.name,
      icon: area.icon,
      color: area.color,
      description: area.description,
      capacity: area.capacity,
      rows: area.rows,
      cols: area.cols,
      amenities: area.amenities || [],
      seatType: area.seatType
    });
    setSelectedArea(area);
    setIsEditing(true);
    setFormErrors({});
    setShowAreaModal(true);
  };

  const handleSaveArea = async () => {
    const errors = validateAreaForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotificationMessage('Please fix the errors in the form', 'error');
      return;
    }

    try {
      let response;
      if (isEditing && selectedArea) {
        // For editing, send the complete area object with new rows/cols
        const updateData = {
          name: areaForm.name,
          icon: areaForm.icon,
          color: areaForm.color,
          description: areaForm.description,
          rows: parseInt(areaForm.rows),
          cols: parseInt(areaForm.cols),
          seatType: areaForm.seatType,
          amenities: areaForm.amenities,
          capacity: areaForm.rows * areaForm.cols
        };
        
        response = await fetch(`${API_BASE_URL}/${selectedArea.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
      } else {
        // For new area
        response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(areaForm)
        });
      }

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to save area');
      }
      
      await loadAreas();
      await loadStatistics();
      showNotificationMessage(isEditing ? 'Area updated successfully!' : 'New area added successfully!');
      setShowAreaModal(false);
    } catch (error) {
      console.error('Error saving area:', error);
      showNotificationMessage(error.message || 'Failed to save area', 'error');
    }
  };

  const handleDeleteArea = async (areaId) => {
    if (window.confirm('Are you sure you want to delete this area? All seats will be removed.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${areaId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete area');
        
        await loadAreas();
        await loadStatistics();
        showNotificationMessage('Area deleted successfully!');
      } catch (error) {
        console.error('Error deleting area:', error);
        showNotificationMessage('Failed to delete area', 'error');
      }
    }
  };

  const handleRegenerateSeats = async (area) => {
    if (window.confirm(`This will reset all seats in ${area.name}. This action cannot be undone. Continue?`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/${area.id}/regenerate-seats`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rows: area.rows, cols: area.cols })
        });
        
        if (!response.ok) throw new Error('Failed to regenerate seats');
        
        await loadAreas();
        await loadStatistics();
        showNotificationMessage('Seats regenerated successfully!');
      } catch (error) {
        console.error('Error regenerating seats:', error);
        showNotificationMessage('Failed to regenerate seats', 'error');
      }
    }
  };

  const handleAddSeat = (area) => {
    setSelectedArea(area);
    setSeatForm({
      number: '',
      type: 'standard',
      hasPower: false,
      status: 'available',
      id: null
    });
    setFormErrors({});
    setShowSeatModal(true);
  };

  const handleEditSeat = (area, seat) => {
    setSelectedArea(area);
    setSeatForm({
      number: seat.number,
      type: seat.type,
      hasPower: seat.hasPower,
      status: seat.status,
      id: seat.id
    });
    setFormErrors({});
    setShowSeatModal(true);
  };

  const handleSaveSeat = async () => {
    const errors = validateSeatForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showNotificationMessage('Please fix the errors in the form', 'error');
      return;
    }

    try {
      let response;
      if (seatForm.id) {
        response = await fetch(`${API_BASE_URL}/seats/${seatForm.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(seatForm)
        });
      } else {
        response = await fetch(`${API_BASE_URL}/${selectedArea.id}/seats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(seatForm)
        });
      }

      if (!response.ok) throw new Error('Failed to save seat');
      
      await loadAreas();
      await loadStatistics();
      showNotificationMessage(seatForm.id ? 'Seat updated successfully!' : 'New seat added successfully!');
      setShowSeatModal(false);
    } catch (error) {
      console.error('Error saving seat:', error);
      showNotificationMessage('Failed to save seat', 'error');
    }
  };

  const handleDeleteSeat = async (areaId, seatId) => {
    if (window.confirm('Are you sure you want to delete this seat?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/seats/${seatId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete seat');
        
        await loadAreas();
        await loadStatistics();
        showNotificationMessage('Seat deleted successfully!');
      } catch (error) {
        console.error('Error deleting seat:', error);
        showNotificationMessage('Failed to delete seat', 'error');
      }
    }
  };

  const handleAmenityChange = (e) => {
    const amenities = e.target.value.split(',').map(a => a.trim()).filter(a => a);
    setAreaForm({ ...areaForm, amenities });
  };

  const getIconComponent = (iconName) => {
    const icon = availableIcons.find(i => i.name === iconName);
    return icon ? icon.icon : Building;
  };

  const filteredAreas = areas.filter(area => 
    area.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] text-white sticky top-0 z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#22C55E]/20 rounded-xl">
                  <Settings className="w-6 h-6 text-[#22C55E]" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Admin <span className="text-[#22C55E]">Area Management</span>
                </h1>
              </div>
              <p className="text-slate-300">Manage study areas, seats, and configurations</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { loadAreas(); loadStatistics(); }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleAddArea}
                className="flex items-center gap-2 px-4 py-2 bg-[#22C55E] hover:bg-[#1ea34e] rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New Area
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#22C55E]">{statistics.totalAreas}</div>
              <div className="text-xs text-slate-500">Total Areas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{statistics.totalSeats}</div>
              <div className="text-xs text-slate-500">Total Seats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{statistics.availableSeats}</div>
              <div className="text-xs text-slate-500">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{statistics.occupiedSeats}</div>
              <div className="text-xs text-slate-500">Occupied</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {statistics.totalSeats > 0 ? Math.round((statistics.occupiedSeats / statistics.totalSeats) * 100) : 0}%
              </div>
              <div className="text-xs text-slate-500">Occupancy Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {showNotification && (
          <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
            <div className={`${notificationType === 'success' ? 'bg-[#22C55E]' : 'bg-red-500'} text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2`}>
              {notificationType === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span className="font-medium">{notificationMessage}</span>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search areas by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
            />
          </div>
        </div>

        {/* Areas Grid */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
              <div className="w-8 h-8 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-500">Loading areas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAreas.map((area) => {
              const IconComponent = getIconComponent(area.icon);
              const totalSeats = area.seats?.length || 0;
              const availableSeats = area.seats?.filter(s => s.status === 'available').length || 0;
              const occupancyRate = totalSeats > 0 ? ((totalSeats - availableSeats) / totalSeats) * 100 : 0;

              return (
                <div key={area.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="p-5 border-b border-slate-100" style={{ backgroundColor: `${area.color}10` }}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${area.color}20` }}>
                          <IconComponent className="w-5 h-5" style={{ color: area.color }} />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#0F172A] text-lg">{area.name}</h3>
                          <p className="text-xs text-slate-500 mt-1">{area.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRegenerateSeats(area)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Regenerate Seats"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditArea(area)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Area"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArea(area.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Area"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-[#22C55E]">{totalSeats}</div>
                        <div className="text-xs text-slate-500">Total Seats</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{availableSeats}</div>
                        <div className="text-xs text-slate-500">Available</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-red-600">{totalSeats - availableSeats}</div>
                        <div className="text-xs text-slate-500">Occupied</div>
                      </div>
                    </div>
                    
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                      <div 
                        className="h-2 rounded-full transition-all" 
                        style={{ width: `${occupancyRate}%`, backgroundColor: area.color }}
                      ></div>
                    </div>
                    
                    {/* Layout Info */}
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-slate-500">
                        Layout: {area.rows} × {area.cols} = {area.rows * area.cols} seats
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-600">
                        {area.seatType}
                      </span>
                    </div>
                    
                    {/* Amenities */}
                    {area.amenities && area.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {area.amenities.slice(0, 3).map((amenity, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 bg-white/50 rounded-full text-slate-600">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Seat Layout */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs font-medium text-slate-500">Seat Layout</div>
                      <button
                        onClick={() => handleAddSeat(area)}
                        className="text-xs text-[#22C55E] hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add Seat
                      </button>
                    </div>
                    {area.seats && area.seats.length > 0 ? (
                      <div 
                        className="grid gap-2 mb-4"
                        style={{ 
                          gridTemplateColumns: `repeat(${area.cols || 4}, minmax(0, 1fr))`,
                        }}
                      >
                        {area.seats.map((seat) => (
                          <div key={seat.id} className="relative group">
                            <div className={`
                              p-2 rounded-lg text-center transition-all border-2
                              ${seat.status === 'available' 
                                ? 'bg-green-50 border-green-200 cursor-pointer' 
                                : seat.status === 'occupied'
                                ? 'bg-red-50 border-red-200 opacity-70'
                                : 'bg-yellow-50 border-yellow-200'
                              }
                            `}>
                              <div className="flex flex-col items-center gap-1">
                                <Armchair className={`w-4 h-4 ${
                                  seat.status === 'available' ? 'text-green-500' : 
                                  seat.status === 'occupied' ? 'text-red-500' : 'text-yellow-500'
                                }`} />
                                <div className="text-xs font-medium">{seat.number}</div>
                                {seat.hasPower && (
                                  <Zap className="w-3 h-3 text-yellow-500 absolute top-0 right-0" />
                                )}
                              </div>
                            </div>
                            <div className="absolute top-0 right-0 -mt-1 -mr-1 hidden group-hover:flex gap-1">
                              <button
                                onClick={() => handleEditSeat(area, seat)}
                                className="p-0.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteSeat(area.id, seat.id)}
                                className="p-0.5 bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-400">
                        <p className="text-sm">No seats configured</p>
                        <button
                          onClick={() => handleAddSeat(area)}
                          className="text-xs text-[#22C55E] hover:underline mt-2"
                        >
                          Add first seat
                        </button>
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
            <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No areas found. Click "Add New Area" to get started.</p>
          </div>
        )}
      </div>

      {/* Area Modal */}
      {showAreaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#0F172A]">
                {isEditing ? 'Edit Area' : 'Add New Area'}
              </h3>
              <button
                onClick={() => setShowAreaModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Area Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={areaForm.name}
                    onChange={(e) => setAreaForm({ ...areaForm, name: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                      formErrors.name ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="e.g., Library Floor 3"
                  />
                  {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Icon</label>
                  <select
                    value={areaForm.icon}
                    onChange={(e) => setAreaForm({ ...areaForm, icon: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                  >
                    {availableIcons.map(icon => (
                      <option key={icon.name} value={icon.name}>{icon.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {availableColors.map(color => (
                      <button
                        key={color}
                        onClick={() => setAreaForm({ ...areaForm, color })}
                        className={`w-8 h-8 rounded-full border-2 ${areaForm.color === color ? 'border-slate-800' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Seat Type</label>
                  <select
                    value={areaForm.seatType}
                    onChange={(e) => setAreaForm({ ...areaForm, seatType: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                  >
                    <option value="carrel">Carrel (Individual Study)</option>
                    <option value="open">Open (Flexible Seating)</option>
                    <option value="group">Group (Collaborative)</option>
                    <option value="pod">Pod (Private Study)</option>
                    <option value="cafe">Cafe (Casual)</option>
                    <option value="premium">Premium (Deluxe)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={areaForm.description}
                  onChange={(e) => setAreaForm({ ...areaForm, description: e.target.value })}
                  rows="2"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                    formErrors.description ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="Describe the area..."
                />
                {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Rows <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={areaForm.rows}
                    onChange={(e) => setAreaForm({ ...areaForm, rows: parseInt(e.target.value) || 0 })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                      formErrors.rows ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    min="1"
                  />
                  {formErrors.rows && <p className="text-xs text-red-500 mt-1">{formErrors.rows}</p>}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Columns <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={areaForm.cols}
                    onChange={(e) => setAreaForm({ ...areaForm, cols: parseInt(e.target.value) || 0 })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                      formErrors.cols ? 'border-red-500 bg-red-50' : 'border-slate-200'
                    }`}
                    min="1"
                  />
                  {formErrors.cols && <p className="text-xs text-red-500 mt-1">{formErrors.cols}</p>}
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm text-slate-600">
                  <strong>Layout Preview:</strong> {areaForm.rows} rows × {areaForm.cols} columns = <strong className="text-[#22C55E]">{areaForm.rows * areaForm.cols} seats</strong>
                </p>
                {isEditing && (
                  <p className="text-xs text-orange-600 mt-1">
                    ⚠️ Changing rows/columns will regenerate all seats in this area.
                  </p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  value={areaForm.amenities.join(', ')}
                  onChange={handleAmenityChange}
                  placeholder="WiFi, Power Outlets, Air Conditioning, etc."
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                />
              </div>
            </div>
            
            <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setShowAreaModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveArea}
                className="px-4 py-2 bg-[#22C55E] hover:bg-[#1ea34e] text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                {isEditing ? 'Update Area' : 'Create Area'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seat Modal */}
      {showSeatModal && selectedArea && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#0F172A]">
                {seatForm.id ? 'Edit Seat' : 'Add New Seat'}
              </h3>
              <button
                onClick={() => setShowSeatModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">
                  Seat Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={seatForm.number}
                  onChange={(e) => setSeatForm({ ...seatForm, number: e.target.value.toUpperCase() })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] ${
                    formErrors.number ? 'border-red-500 bg-red-50' : 'border-slate-200'
                  }`}
                  placeholder="e.g., A01, B12"
                />
                {formErrors.number && <p className="text-xs text-red-500 mt-1">{formErrors.number}</p>}
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Seat Type</label>
                <select
                  value={seatForm.type}
                  onChange={(e) => setSeatForm({ ...seatForm, type: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                >
                  <option value="standard">Standard</option>
                  <option value="window">Window Seat</option>
                  <option value="corner">Corner Seat</option>
                  <option value="premium">Premium</option>
                  <option value="table">Table Seat</option>
                  <option value="booth">Booth</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Status</label>
                <select
                  value={seatForm.status}
                  onChange={(e) => setSeatForm({ ...seatForm, status: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seatForm.hasPower}
                  onChange={(e) => setSeatForm({ ...seatForm, hasPower: e.target.checked })}
                  className="w-4 h-4 text-[#22C55E] rounded border-slate-300 focus:ring-[#22C55E]"
                />
                <span className="text-sm text-slate-700">Has Power Outlet</span>
              </label>
            </div>
            
            <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => setShowSeatModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSeat}
                className="px-4 py-2 bg-[#22C55E] hover:bg-[#1ea34e] text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                {seatForm.id ? 'Update Seat' : 'Add Seat'}
              </button>
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
        .fade-in { animation-name: fade-in; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AdminAreaManagement;