import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import FeedbackManagement from "./componenets/FeedBackManagemnt/FeedbackManagement";
import AdminFeedbackManagement from "./componenets/FeedBackManagemnt/AdminDashboardFeedback";
import SlotReservationSystem from "./componenets/Seatbooking/SlotReservationSystem";
import AdminAreaManagement from "./componenets/Seatbooking/AdminAreaManagement";
import StudentStudySessions from "./componenets/sessionManagemnt/StudentStudySessions";
import AdminSessionManagement from "./componenets/sessionManagemnt/Adminstudysession";
import StudentCanteen from "./componenets/Canteen/StudentCanteen";
import CanteenOwner from "./componenets/Canteen/CanteenOwner";
import StudentRegister from "./componenets/UserControlling/StudentRegister";
import UnifiedLogin from "./componenets/UserControlling/Login";
import StudentDashboard from "./componenets/UserControlling/StudentDashboard";
import StudentOrders from "./componenets/Canteen/StudentOrders";
import StudentBookings from "./componenets/Seatbooking/StudentBookings";
import StudentFeedbacks from "./componenets/Seatbooking/StudentFeedbacks";
import StudentRegisteredSessions from "./componenets/sessionManagemnt/StudentRegisterdSessions";
import Navbar from "./componenets/Other/Header";
import Footer from "./componenets/Other/Footer";
import About from "./componenets/Other/About";
import Home from "./componenets/Other/Home";

import AdminDashboard from "./componenets/Other/AdminDashboard";
import CanteenOwnerDashboard from "./componenets/Other/CanteenOwnerDashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        
        <Routes>
          <Route path="/feedbacks" element={<FeedbackManagement />} />
          <Route path="/slot-reservation" element={<SlotReservationSystem />} />
          <Route path="/admin-feedback" element={<AdminFeedbackManagement />} />
          <Route path="/student-sessions" element={<StudentStudySessions />} />
          <Route path="/admin-areas" element={<AdminAreaManagement />} />
          <Route path="/admin-sessions" element={<AdminSessionManagement />} />
          <Route path="/student-canteen" element={<StudentCanteen />} />
          <Route path="/canteen-owner" element={<CanteenOwner />} />
          <Route path="/student-register" element={<StudentRegister />} />
          <Route path="/student-login" element={<UnifiedLogin />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-orders" element={<StudentOrders />} />
          <Route path="/student-bookings" element={<StudentBookings />} />
          <Route path="/student-feedbacks" element={<StudentFeedbacks />} />
          <Route path="/student-registered-sessions" element={<StudentRegisteredSessions />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Home />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/canteen-owner-dashboard" element={<CanteenOwnerDashboard />} />

        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
