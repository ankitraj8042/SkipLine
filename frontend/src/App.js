import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, UserRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// User pages
import UserDashboard from './pages/UserDashboard';
import JoinQueue from './pages/JoinQueue';
import MyQueue from './pages/MyQueue';
import QRScanner from './pages/QRScanner';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import CreateQueue from './pages/CreateQueue';
import ManageQueue from './pages/ManageQueue';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login/:role" element={<Login />} />
            <Route path="/register/:role" element={<Register />} />

            {/* User Routes */}
            <Route 
              path="/user/dashboard" 
              element={
                <UserRoute>
                  <UserDashboard />
                </UserRoute>
              } 
            />
            <Route 
              path="/user/scan-qr" 
              element={
                <UserRoute>
                  <QRScanner />
                </UserRoute>
              } 
            />
            <Route 
              path="/user/my-queue" 
              element={
                <UserRoute>
                  <MyQueue />
                </UserRoute>
              } 
            />
            <Route 
              path="/queue/:id/join" 
              element={
                <UserRoute>
                  <JoinQueue />
                </UserRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/create-queue" 
              element={
                <AdminRoute>
                  <CreateQueue />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/manage/:id" 
              element={
                <AdminRoute>
                  <ManageQueue />
                </AdminRoute>
              } 
            />

            {/* Legacy redirects */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/my-queue" element={<Navigate to="/user/my-queue" replace />} />
            <Route path="/scan-qr" element={<Navigate to="/user/scan-qr" replace />} />
            <Route path="/queues" element={<Navigate to="/user/dashboard" replace />} />
            <Route path="/queue/:id" element={<Navigate to="/user/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;