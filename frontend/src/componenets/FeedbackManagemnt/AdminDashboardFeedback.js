import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Filter, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Mail,
  Send,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  PieChart,
  TrendingUp,
  Users,
  Download,
  BarChart,
  Award,
  Image as ImageIcon,
  FileText,
  Printer,
  Share2
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/feedbacks';

const AdminFeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedFeedbackForStatus, setSelectedFeedbackForStatus] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [activeTab, setActiveTab] = useState('feedbacks');
  const [showImageViewer, setShowImageViewer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportDateRange, setReportDateRange] = useState('all');
  const [statistics, setStatistics] = useState({
    totalFeedbacks: 0,
    pendingIssues: 0,
    resolvedIssues: 0,
    inProgressIssues: 0,
    rejectedIssues: 0,
    totalLikes: 0,
    totalDislikes: 0
  });

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'academic', name: 'Academic' },
    { id: 'infrastructure', name: 'Infrastructure' },
    { id: 'technology', name: 'Technology' },
    { id: 'facilities', name: 'Campus Facilities' },
    { id: 'administration', name: 'Administration' },
    { id: 'studentLife', name: 'Student Life' }
  ];

  const statuses = [
    { id: 'all', name: 'All Status' },
    { id: 'pending', name: 'Pending', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
    { id: 'in-progress', name: 'In Progress', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    { id: 'resolved', name: 'Resolved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    { id: 'rejected', name: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle }
  ];

  useEffect(() => {
    loadFeedbacks();
    loadStatistics();
  }, []);

  //gets feedback data from backend
  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch feedbacks');
      const data = await response.json();
      setFeedbacks(data);
      
      //get all feedbacks for report
      const allResponse = await fetch(`${API_BASE_URL}/all`);
      if (allResponse.ok) {
        const allData = await allResponse.json();
        setAllFeedbacks(allData);
      }
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

  const getStatusColor = (status) => {
    const statusObj = statuses.find(s => s.id === status);
    return statusObj ? statusObj.color : 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    const statusObj = statuses.find(s => s.id === status);
    const Icon = statusObj ? statusObj.icon : AlertCircle;
    return <Icon className="w-3 h-3" />;
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

  const handleStatusChange = (feedback, status) => {
    setSelectedFeedbackForStatus(feedback);
    setNewStatus(status);
    setAdminNote('');
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedFeedbackForStatus || !adminNote.trim()) {
      setNotificationMessage('Please provide a description before changing status');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${selectedFeedbackForStatus.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus, 
          adminNote: adminNote 
        })
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      await loadFeedbacks();
      await loadStatistics();
      
      setShowStatusModal(false);
      setSelectedFeedbackForStatus(null);
      setNewStatus('');
      setAdminNote('');
      
      setNotificationMessage(`Feedback status updated to ${newStatus.toUpperCase()}. Email notification sent to ${selectedFeedbackForStatus.email}`);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } catch (error) {
      console.error('Error updating status:', error);
      setNotificationMessage('Failed to update status');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  // Filter feedbacks by date range
  const filterByDateRange = (feedbacksList) => {
    const now = new Date();
    let startDate = new Date();
    
    switch(reportDateRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return feedbacksList;
    }
    
    return feedbacksList.filter(f => new Date(f.createdAt) >= startDate);
  };

  // Generate Category Report
  const generateCategoryReport = () => {
    const filteredFeedbacks = filterByDateRange(allFeedbacks);
    const report = {};
    categories.filter(c => c.id !== 'all').forEach(cat => {
      const categoryFeedbacks = filteredFeedbacks.filter(f => f.category === cat.id);
      report[cat.name] = {
        total: categoryFeedbacks.length,
        pending: categoryFeedbacks.filter(f => f.status === 'pending').length,
        inProgress: categoryFeedbacks.filter(f => f.status === 'in-progress').length,
        resolved: categoryFeedbacks.filter(f => f.status === 'resolved').length,
        rejected: categoryFeedbacks.filter(f => f.status === 'rejected').length,
        totalLikes: categoryFeedbacks.reduce((sum, f) => sum + (f.likes || 0), 0),
        totalDislikes: categoryFeedbacks.reduce((sum, f) => sum + (f.dislikes || 0), 0),
        satisfactionRate: categoryFeedbacks.length > 0 
          ? ((categoryFeedbacks.filter(f => f.status === 'resolved').length / categoryFeedbacks.length) * 100).toFixed(1)
          : 0,
        avgLikes: categoryFeedbacks.length > 0 
          ? (categoryFeedbacks.reduce((sum, f) => sum + (f.likes || 0), 0) / categoryFeedbacks.length).toFixed(1)
          : 0
      };
    });
    return report;
  };

  // Generate Overall Report
  const generateOverallReport = () => {
    const filteredFeedbacks = filterByDateRange(allFeedbacks);
    const totalFeedbacks = filteredFeedbacks.length;
    const resolved = filteredFeedbacks.filter(f => f.status === 'resolved').length;
    const pending = filteredFeedbacks.filter(f => f.status === 'pending').length;
    const inProgress = filteredFeedbacks.filter(f => f.status === 'in-progress').length;
    const rejected = filteredFeedbacks.filter(f => f.status === 'rejected').length;
    const totalLikes = filteredFeedbacks.reduce((sum, f) => sum + (f.likes || 0), 0);
    const totalDislikes = filteredFeedbacks.reduce((sum, f) => sum + (f.dislikes || 0), 0);
    const withImages = filteredFeedbacks.filter(f => f.imageUrl).length;
    
    return {
      total: totalFeedbacks,
      pending: pending,
      inProgress: inProgress,
      resolved: resolved,
      rejected: rejected,
      totalLikes: totalLikes,
      totalDislikes: totalDislikes,
      withImages: withImages,
      resolutionRate: totalFeedbacks > 0 ? ((resolved / totalFeedbacks) * 100).toFixed(1) : 0,
      avgLikesPerFeedback: totalFeedbacks > 0 ? (totalLikes / totalFeedbacks).toFixed(1) : 0,
      satisfactionScore: totalFeedbacks > 0 
        ? ((totalLikes / (totalLikes + totalDislikes || 1)) * 100).toFixed(1)
        : 0
    };
  };

  // Generate Trend Analysis
  const generateTrendAnalysis = () => {
    const filteredFeedbacks = filterByDateRange(allFeedbacks);
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayFeedbacks = filteredFeedbacks.filter(f => f.createdAt === dateStr);
      last7Days.push({
        date: dateStr,
        count: dayFeedbacks.length,
        resolved: dayFeedbacks.filter(f => f.status === 'resolved').length,
        pending: dayFeedbacks.filter(f => f.status === 'pending').length,
        likes: dayFeedbacks.reduce((sum, f) => sum + (f.likes || 0), 0)
      });
    }
    return last7Days;
  };

  // Generate Monthly Summary
  const generateMonthlySummary = () => {
    const filteredFeedbacks = filterByDateRange(allFeedbacks);
    const monthlyData = {};
    
    filteredFeedbacks.forEach(f => {
      const month = f.createdAt.substring(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { total: 0, resolved: 0, likes: 0 };
      }
      monthlyData[month].total++;
      if (f.status === 'resolved') monthlyData[month].resolved++;
      monthlyData[month].likes += (f.likes || 0);
    });
    
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      total: data.total,
      resolved: data.resolved,
      likes: data.likes,
      resolutionRate: ((data.resolved / data.total) * 100).toFixed(1)
    }));
  };

  // Generate Top Issues Report
  const generateTopIssuesReport = () => {
    const filteredFeedbacks = filterByDateRange(allFeedbacks);
    const issuesMap = {};
    
    filteredFeedbacks.forEach(f => {
      const category = f.categoryName || f.category;
      if (!issuesMap[category]) {
        issuesMap[category] = { count: 0, likes: 0, pending: 0 };
      }
      issuesMap[category].count++;
      issuesMap[category].likes += (f.likes || 0);
      if (f.status === 'pending') issuesMap[category].pending++;
    });
    
    return Object.entries(issuesMap)
      .map(([category, data]) => ({
        category,
        count: data.count,
        likes: data.likes,
        pending: data.pending,
        priority: data.pending > 5 ? 'High' : data.pending > 2 ? 'Medium' : 'Low'
      }))
      .sort((a, b) => b.count - a.count);
  };

  // Generate Student Engagement Report
  const generateStudentEngagementReport = () => {
    const filteredFeedbacks = filterByDateRange(allFeedbacks);
    const studentMap = {};
    
    filteredFeedbacks.forEach(f => {
      if (!studentMap[f.email]) {
        studentMap[f.email] = {
          name: f.studentName,
          email: f.email,
          sdNumber: f.sdNumber,
          feedbackCount: 0,
          totalLikes: 0,
          resolvedCount: 0
        };
      }
      studentMap[f.email].feedbackCount++;
      studentMap[f.email].totalLikes += (f.likes || 0);
      if (f.status === 'resolved') studentMap[f.email].resolvedCount++;
    });
    
    return Object.values(studentMap)
      .sort((a, b) => b.feedbackCount - a.feedbackCount)
      .slice(0, 10);
  };

  const categoryReport = generateCategoryReport();
  const overallReport = generateOverallReport();
  const trendAnalysis = generateTrendAnalysis();
  const monthlySummary = generateMonthlySummary();
  const topIssues = generateTopIssuesReport();
  const topStudents = generateStudentEngagementReport();

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesCategory = filterCategory === 'all' || feedback.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || feedback.status === filterStatus;
    const matchesSearch = (feedback.text && feedback.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (feedback.studentName && feedback.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (feedback.sdNumber && feedback.sdNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const stats = {
    total: feedbacks.length,
    pending: feedbacks.filter(f => f.status === 'pending').length,
    inProgress: feedbacks.filter(f => f.status === 'in-progress').length,
    resolved: statistics.resolvedIssues,
    rejected: statistics.rejectedIssues,
    totalLikes: statistics.totalLikes
  };

  // Download Full Report as JSON
  const downloadJSONReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      dateRange: reportDateRange,
      overallReport,
      categoryReport,
      trendAnalysis,
      monthlySummary,
      topIssues,
      topStudents,
      allFeedbacks: filterByDateRange(allFeedbacks)
    };
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `feedback-report-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    setNotificationMessage('JSON Report downloaded successfully!');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Download Report as CSV
  const downloadCSVReport = () => {
    const filteredFeedbacks = filterByDateRange(allFeedbacks);
    const headers = ['ID', 'Student Name', 'SD Number', 'Email', 'Category', 'Feedback', 'Status', 'Likes', 'Dislikes', 'Date'];
    const csvRows = [headers];
    
    filteredFeedbacks.forEach(f => {
      csvRows.push([
        f.id,
        f.studentName,
        f.sdNumber,
        f.email,
        f.categoryName || f.category,
        `"${f.text.replace(/"/g, '""')}"`,
        f.status,
        f.likes || 0,
        f.dislikes || 0,
        f.createdAt
      ]);
    });
    
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setNotificationMessage('CSV Report downloaded successfully!');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Print Report
  const printReport = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Feedback Report - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #0F172A; }
            h2 { color: #22C55E; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0; }
            .stat-card { border: 1px solid #ddd; padding: 15px; text-align: center; border-radius: 8px; }
            .stat-number { font-size: 24px; font-weight: bold; color: #22C55E; }
          </style>
        </head>
        <body>
          <h1>Feedback Management Report</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p>Date Range: ${reportDateRange === 'all' ? 'All Time' : reportDateRange}</p>
          
          <h2>Overall Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card"><div class="stat-number">${overallReport.total}</div><div>Total Feedbacks</div></div>
            <div class="stat-card"><div class="stat-number">${overallReport.resolutionRate}%</div><div>Resolution Rate</div></div>
            <div class="stat-card"><div class="stat-number">${overallReport.avgLikesPerFeedback}</div><div>Avg Likes/Feedback</div></div>
            <div class="stat-card"><div class="stat-number">${overallReport.satisfactionScore}%</div><div>Satisfaction Score</div></div>
          </div>
          
          <h2>Category-wise Breakdown</h2>
          <table>
            <tr><th>Category</th><th>Total</th><th>Pending</th><th>Resolved</th><th>Satisfaction</th></tr>
            ${Object.entries(categoryReport).map(([cat, data]) => `
              <tr>
                <td>${cat}</td>
                <td>${data.total}</td>
                <td>${data.pending}</td>
                <td>${data.resolved}</td>
                <td>${data.satisfactionRate}%</td>
              </tr>
            `).join('')}
          </table>
          
          <h2>Top Issues by Category</h2>
          <table>
            <tr><th>Category</th><th>Total Reports</th><th>Pending</th><th>Priority</th></tr>
            ${topIssues.map(issue => `
              <tr>
                <td>${issue.category}</td>
                <td>${issue.count}</td>
                <td>${issue.pending}</td>
                <td>${issue.priority}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9]">
      {/* Header */}
      <div className="bg-[#0F172A] text-white sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#22C55E]/20 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-[#22C55E]" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Admin <span className="text-[#22C55E]">Feedback</span> Dashboard
                </h1>
              </div>
              <p className="text-slate-300">Manage, analyze, and respond to student feedbacks</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => { loadFeedbacks(); loadStatistics(); }}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('feedbacks')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'feedbacks'
                ? 'text-[#22C55E] border-b-2 border-[#22C55E]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Active Feedbacks ({feedbacks.length})
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'analysis'
                ? 'text-[#22C55E] border-b-2 border-[#22C55E]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PieChart className="w-4 h-4 inline mr-2" />
            Report & Analysis
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notification */}
        {showNotification && (
          <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
            <div className="bg-[#22C55E] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{notificationMessage}</span>
            </div>
          </div>
        )}

        {activeTab === 'feedbacks' ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-[#22C55E]" />
                  <span className="text-2xl font-bold text-[#0F172A]">{stats.total}</span>
                </div>
                <p className="text-sm text-slate-600">Active Feedbacks</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <span className="text-2xl font-bold text-[#0F172A]">{stats.pending}</span>
                </div>
                <p className="text-sm text-slate-600">Pending</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-[#0F172A]">{stats.inProgress}</span>
                </div>
                <p className="text-sm text-slate-600">In Progress</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-2xl font-bold text-[#0F172A]">{stats.resolved}</span>
                </div>
                <p className="text-sm text-slate-600">Resolved</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="text-2xl font-bold text-[#0F172A]">{stats.rejected}</span>
                </div>
                <p className="text-sm text-slate-600">Rejected</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <ThumbsUp className="w-5 h-5 text-[#22C55E]" />
                  <span className="text-2xl font-bold text-[#0F172A]">{stats.totalLikes}</span>
                </div>
                <p className="text-sm text-slate-600">Total Likes</p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center flex-1">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Filters:</span>
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
                    placeholder="Search by name, SD number, or feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                  />
                </div>
              </div>
            </div>

            {/* Feedbacks Grid */}
            {loading ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
                  <div className="w-8 h-8 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-slate-500">Loading feedbacks...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredFeedbacks.map((feedback) => (
                  <div key={feedback.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    {feedback.imageUrl && (
                      <div className="relative h-48 bg-slate-100 cursor-pointer" onClick={() => setShowImageViewer(feedback)}>
                        <img src={feedback.imageUrl} alt="Feedback attachment" className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">Click to view</div>
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-[#0F172A]">{feedback.studentName}</h3>
                          <p className="text-xs text-slate-500">{feedback.sdNumber} • {feedback.email}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(feedback.status)}`}>
                          {getStatusIcon(feedback.status)}
                          {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                        </span>
                      </div>
                      <div className="mb-3">
                        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: `${getCategoryColor(feedback.category)}15`, color: getCategoryColor(feedback.category) }}>
                          {feedback.categoryName}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 mb-3 line-clamp-3">{feedback.text}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {feedback.likes || 0}</span>
                          <span className="flex items-center gap-1"><ThumbsDown className="w-3 h-3" /> {feedback.dislikes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{feedback.createdAt}</div>
                      </div>
                      <div className="flex gap-2 pt-3 border-t border-slate-100">
                        <button onClick={() => setSelectedFeedback(feedback)} className="flex-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1">
                          <Eye className="w-4 h-4" /> View
                        </button>
                        {feedback.status !== 'resolved' && feedback.status !== 'rejected' && (
                          <select onChange={(e) => handleStatusChange(feedback, e.target.value)} value="" className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]">
                            <option value="">Update Status</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && filteredFeedbacks.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No active feedbacks found</p>
              </div>
            )}
          </>
        ) : (
          // Report & Analysis Section
          <div className="space-y-6">
            {/* Date Range Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-slate-700">Report Period:</label>
                  <select
                    value={reportDateRange}
                    onChange={(e) => setReportDateRange(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                  >
                    <option value="all">All Time</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="quarter">Last 3 Months</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={downloadJSONReport} className="flex items-center gap-2 px-3 py-1.5 bg-[#22C55E] text-white rounded-lg text-sm hover:bg-[#1ea34e] transition-colors">
                    <Download className="w-4 h-4" /> JSON
                  </button>
                  <button onClick={downloadCSVReport} className="flex items-center gap-2 px-3 py-1.5 bg-[#06B6D4] text-white rounded-lg text-sm hover:bg-[#05a0ba] transition-colors">
                    <FileText className="w-4 h-4" /> CSV
                  </button>
                  <button onClick={printReport} className="flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] text-white rounded-lg text-sm hover:bg-[#1e293b] transition-colors">
                    <Printer className="w-4 h-4" /> Print
                  </button>
                </div>
              </div>
            </div>

            {/* Overall Statistics */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-[#22C55E]" />
                  Overall Performance Metrics
                </h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#22C55E]">{overallReport.total}</div>
                  <div className="text-sm text-slate-600">Total Feedbacks</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{overallReport.resolutionRate}%</div>
                  <div className="text-sm text-slate-600">Resolution Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{overallReport.avgLikesPerFeedback}</div>
                  <div className="text-sm text-slate-600">Avg Likes/Feedback</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{overallReport.satisfactionScore}%</div>
                  <div className="text-sm text-slate-600">Satisfaction Score</div>
                </div>
              </div>
            </div>

            {/* Category-wise Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#22C55E]" />
                Category-wise Analysis
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Category</th>
                      <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Total</th>
                      <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Pending</th>
                      <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Resolved</th>
                      <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Satisfaction</th>
                      <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Likes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Object.entries(categoryReport).map(([category, data]) => (
                      <tr key={category} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-[#0F172A]">{category}</td>
                        <td className="px-4 py-3 text-center">{data.total}</td>
                        <td className="px-4 py-3 text-center text-orange-600">{data.pending}</td>
                        <td className="px-4 py-3 text-center text-green-600">{data.resolved}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            data.satisfactionRate >= 70 ? 'bg-green-100 text-green-700' :
                            data.satisfactionRate >= 40 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {data.satisfactionRate}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="flex items-center justify-center gap-1">
                            <ThumbsUp className="w-3 h-3 text-[#22C55E]" /> {data.totalLikes}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Issues */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#22C55E]" />
                Top Priority Issues
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topIssues.map((issue, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-[#0F172A]">{issue.category}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        issue.priority === 'High' ? 'bg-red-100 text-red-700' :
                        issue.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {issue.priority} Priority
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Total Reports: {issue.count}</span>
                      <span className="text-slate-600">Pending: {issue.pending}</span>
                      <span className="text-slate-600">Likes: {issue.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trend Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#22C55E]" />
                7-Day Trend Analysis
              </h2>
              <div className="space-y-3">
                {trendAnalysis.map(day => (
                  <div key={day.date} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 w-24">{day.date}</span>
                    <div className="flex-1 mx-4">
                      <div className="h-8 bg-slate-100 rounded-lg overflow-hidden flex">
                        <div className="h-full bg-[#22C55E] flex items-center justify-center text-xs text-white" style={{ width: `${(day.count / Math.max(...trendAnalysis.map(d => d.count), 1)) * 100}%` }}>
                          {day.count > 0 && day.count}
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-600 w-12">Total: {day.count}</span>
                    <span className="text-green-600 w-16">Resolved: {day.resolved}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#22C55E]" />
                Monthly Summary
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Month</th>
                      <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Total</th>
                      <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Resolved</th>
                      <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Resolution Rate</th>
                      <th className="text-center px-4 py-3 text-sm font-semibold text-slate-700">Likes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {monthlySummary.map(month => (
                      <tr key={month.month} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-[#0F172A]">{month.month}</td>
                        <td className="px-4 py-3 text-center">{month.total}</td>
                        <td className="px-4 py-3 text-center text-green-600">{month.resolved}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            month.resolutionRate >= 70 ? 'bg-green-100 text-green-700' :
                            month.resolutionRate >= 40 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {month.resolutionRate}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="flex items-center justify-center gap-1">
                            <ThumbsUp className="w-3 h-3 text-[#22C55E]" /> {month.likes}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-r from-[#22C55E]/10 to-[#06B6D4]/10 rounded-xl p-6 border border-[#22C55E]/20">
              <h3 className="font-bold text-[#0F172A] mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#22C55E]" />
                AI-Powered Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(categoryReport).map(([category, data]) => {
                  if (data.satisfactionRate < 50 && data.total > 0) {
                    return (
                      <div key={category} className="bg-white/50 rounded-lg p-3">
                        <p className="text-sm">
                          <strong className="text-[#22C55E]">{category}</strong> has a low satisfaction rate ({data.satisfactionRate}%). 
                          Priority attention needed. {data.pending + data.inProgress} issues require immediate action.
                        </p>
                      </div>
                    );
                  }
                  return null;
                })}
                {overallReport.resolutionRate < 70 && (
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-sm">
                      Overall resolution rate is {overallReport.resolutionRate}%. Consider allocating more resources to speed up feedback processing.
                    </p>
                  </div>
                )}
                {topIssues.length > 0 && topIssues[0].pending > 3 && (
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-sm">
                      <strong className="text-[#22C55E]">{topIssues[0].category}</strong> has the highest number of pending issues ({topIssues[0].pending}). 
                      Review and address these concerns as top priority.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#0F172A]">Feedback Details</h3>
              <button onClick={() => setSelectedFeedback(null)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <XCircle className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {selectedFeedback.imageUrl && (
                <div><img src={selectedFeedback.imageUrl} alt="Feedback" className="w-full rounded-lg" /></div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-slate-500">Student Name</label><p className="text-sm font-medium text-[#0F172A]">{selectedFeedback.studentName}</p></div>
                <div><label className="text-xs font-medium text-slate-500">SD Number</label><p className="text-sm font-medium text-[#0F172A]">{selectedFeedback.sdNumber}</p></div>
                <div><label className="text-xs font-medium text-slate-500">Email</label><p className="text-sm text-[#0F172A]">{selectedFeedback.email}</p></div>
                <div><label className="text-xs font-medium text-slate-500">Date Submitted</label><p className="text-sm text-[#0F172A]">{selectedFeedback.createdAt}</p></div>
              </div>
              <div><label className="text-xs font-medium text-slate-500">Feedback</label><p className="text-sm text-slate-700 mt-1 bg-slate-50 p-3 rounded-lg">{selectedFeedback.text}</p></div>
              {selectedFeedback.adminNote && (
                <div><label className="text-xs font-medium text-slate-500">Admin Response</label><p className="text-sm text-blue-700 mt-1 bg-blue-50 p-3 rounded-lg">{selectedFeedback.adminNote}</p></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {showImageViewer && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button onClick={() => setShowImageViewer(null)} className="absolute -top-10 right-0 text-white hover:text-slate-300 transition-colors">
              <XCircle className="w-8 h-8" />
            </button>
            <img src={showImageViewer.imageUrl} alt="Full view" className="max-w-full max-h-[85vh] object-contain" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 rounded-b-lg">
              <p className="text-sm">Submitted by: {showImageViewer.studentName}</p>
              <p className="text-xs">{showImageViewer.text?.substring(0, 100)}...</p>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && selectedFeedbackForStatus && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="border-b border-slate-200 px-6 py-4"><h3 className="text-lg font-bold text-[#0F172A]">Update Feedback Status</h3></div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Student Information</label>
                <div className="bg-slate-50 p-3 rounded-lg space-y-1">
                  <p className="text-sm"><strong>Name:</strong> {selectedFeedbackForStatus.studentName}</p>
                  <p className="text-sm"><strong>SD Number:</strong> {selectedFeedbackForStatus.sdNumber}</p>
                  <p className="text-sm"><strong>Email:</strong> {selectedFeedbackForStatus.email}</p>
                </div>
              </div>
              <div><label className="text-sm font-medium text-slate-700 mb-1 block flex items-center gap-2"><Mail className="w-4 h-4" />New Status: <span className="font-bold uppercase">{newStatus}</span></label></div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Message to Student (Will be sent via email)</label>
                <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} rows="4" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E] resize-none" placeholder="Enter your response or note for the student..." required />
              </div>
            </div>
            <div className="border-t border-slate-200 px-6 py-4 flex gap-3 justify-end">
              <button onClick={() => setShowStatusModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
              <button onClick={confirmStatusChange} className="px-4 py-2 bg-[#22C55E] hover:bg-[#1ea34e] text-white rounded-lg font-medium flex items-center gap-2 transition-colors"><Send className="w-4 h-4" />Update & Send Email</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        @keyframes slide-in-from-right-5 { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-in { animation-duration: 0.3s; animation-fill-mode: both; }
        .slide-in-from-right-5 { animation-name: slide-in-from-right-5; }
        .fade-in { animation-name: fade-in; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default AdminFeedbackManagement;