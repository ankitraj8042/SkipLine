import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import QueueList from './pages/QueueList';
import QueueDetails from './pages/QueueDetails';
import JoinQueue from './pages/JoinQueue';
import MyQueue from './pages/MyQueue';
import QRScanner from './pages/QRScanner';
import AdminDashboard from './pages/AdminDashboard';
import CreateQueue from './pages/CreateQueue';
import ManageQueue from './pages/ManageQueue';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/queues" element={<QueueList />} />
          <Route path="/queue/:id" element={<QueueDetails />} />
          <Route path="/queue/:id/join" element={<JoinQueue />} />
          <Route path="/my-queue" element={<MyQueue />} />
          <Route path="/scan-qr" element={<QRScanner />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/create-queue" element={<CreateQueue />} />
          <Route path="/admin/manage/:id" element={<ManageQueue />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
