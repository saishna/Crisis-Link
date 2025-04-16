









import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardOverview from './sections/DashboardOverview';
import FloodZoneManagement from './sections/FloodZoneManagement';
import RescueRequestManagement from './sections/RescueRequestManagement';
import AnalyticsReports from './sections/AnalyticsReports';
import Helpline from './sections/Helpline';
import SystemSettings from './sections/SystemSettings';
import AdminLogin from './components/AdminLogin';

// Dashboard Layout Component
const DashboardLayout = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  // Check authentication
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'flood-zones':
        return <FloodZoneManagement />;
      case 'rescue-requests':
        return <RescueRequestManagement />;
      case 'analytics':
        return <AnalyticsReports />;
      case 'helpline':
        return <Helpline />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-sky-50">
      <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 bg-sky-50 flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<DashboardLayout />} />
        <Route path="/" element={<Navigate to="/admin/login" />} />
      </Routes>
    </Router>
  );
};

export default App;