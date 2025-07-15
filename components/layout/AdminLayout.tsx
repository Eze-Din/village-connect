
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, Briefcase, FileText, Megaphone, User, LogOut, Menu, X, Building2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/admin/dashboard' },
  { name: 'Staff', icon: Users, path: '/admin/staff' },
  { name: 'Bids', icon: Briefcase, path: '/admin/bids' },
  { name: 'Service Requests', icon: FileText, path: '/admin/requests' },
  { name: 'Announcements', icon: Megaphone, path: '/admin/announcements' },
  { name: 'Residents', icon: User, path: '/admin/residents' },
];

const Sidebar: React.FC<{ isOpen: boolean; setIsOpen: (isOpen: boolean) => void }> = ({ isOpen, setIsOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeLinkClass = 'bg-blue-600 text-white';
  const inactiveLinkClass = 'text-gray-300 hover:bg-blue-800 hover:text-white';

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
            <Building2 className="h-8 w-8 text-blue-400 mr-2" />
            <h1 className="text-2xl font-bold">Village Connect</h1>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 ${
                  isActive ? activeLinkClass : inactiveLinkClass
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <NavLink
              to="/admin/profile"
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 rounded-lg w-full text-left ${
                  isActive ? activeLinkClass : inactiveLinkClass
                }`
              }
            >
              <User className="h-5 w-5 mr-3" />
              <span>{user?.fullName}</span>
            </NavLink>
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-2.5 mt-2 rounded-lg transition-colors duration-200 ${inactiveLinkClass}`}
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  return (
    <header className="lg:hidden bg-white dark:bg-gray-800 shadow-md h-16 flex items-center justify-between px-4 sticky top-0 z-20">
      <button onClick={onMenuClick} className="text-gray-600 dark:text-gray-300">
        <Menu size={28} />
      </button>
      <div className="flex items-center">
        <Building2 className="h-6 w-6 text-blue-500 mr-2" />
        <span className="text-lg font-semibold text-gray-800 dark:text-white">Village Connect</span>
      </div>
    </header>
  );
};


const AdminLayout: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="lg:pl-64 flex flex-col flex-1">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
