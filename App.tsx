
import React, { ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Role } from './types';

// Layouts
import AdminLayout from './components/layout/AdminLayout';
import ResidentLayout from './components/layout/ResidentLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import StaffManagement from './pages/admin/StaffManagement';
import BidManagement from './pages/admin/BidManagement';
import ServiceRequests from './pages/admin/ServiceRequests';
import Announcements from './pages/admin/Announcements';
import ResidentsList from './pages/admin/ResidentsList';
import AdminProfile from './pages/admin/AdminProfile';

// Resident Pages
import ResidentDashboard from './pages/resident/Dashboard';
import MyServiceRequests from './pages/resident/MyServiceRequests';
import Bids from './pages/resident/Bids';
import ResidentAnnouncements from './pages/resident/Announcements';
import Profile from './pages/resident/Profile';

interface ProtectedRouteProps {
  allowedRoles: Role[];
  children?: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/404" replace />;
};


const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={!user ? <Navigate to="/login" /> : user.role === Role.Admin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/resident/dashboard" />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={[Role.Admin]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="bids" element={<BidManagement />} />
            <Route path="requests" element={<ServiceRequests />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="residents" element={<ResidentsList />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Route>

        {/* Resident Routes */}
        <Route element={<ProtectedRoute allowedRoles={[Role.Resident]} />}>
          <Route path="/resident" element={<ResidentLayout />}>
            <Route path="dashboard" element={<ResidentDashboard />} />
            <Route path="requests" element={<MyServiceRequests />} />
            <Route path="bids" element={<Bids />} />
            <Route path="announcements" element={<ResidentAnnouncements />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
