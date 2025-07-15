
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Home, FileText, Briefcase, Megaphone, User, LogOut, Menu, X, Building2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/resident/dashboard' },
  { name: 'My Requests', icon: FileText, path: '/resident/requests' },
  { name: 'Public Bids', icon: Briefcase, path: '/resident/bids' },
  { name: 'Announcements', icon: Megaphone, path: '/resident/announcements' },
];

const ResidentLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const activeLinkClass = "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400";
  const inactiveLinkClass = "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white border-b-2 border-transparent";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-500 mr-2" />
              <span className="font-bold text-xl text-gray-800 dark:text-white">Village Connect</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? activeLinkClass.replace('border-b-2', '') : inactiveLinkClass.replace('border-b-2', '')}`}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
                <NavLink to="/resident/profile" className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white flex items-center">
                    <User className="h-5 w-5 mr-1"/>
                    {user?.fullName.split(' ')[0]}
                </NavLink>
                <Button onClick={handleLogout} variant="secondary" size="sm">
                    <LogOut className="h-4 w-4 inline mr-1" /> Logout
                </Button>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button onClick={() => setMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({isActive}) => `flex items-center px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                  <item.icon className="h-5 w-5 mr-3"/>
                  {item.name}
                </NavLink>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="flex items-center px-5">
                    <div className="ml-3">
                        <NavLink to="/resident/profile" onClick={() => setMenuOpen(false)} className="text-base font-medium leading-none text-white">{user?.fullName}</NavLink>
                        <p className="text-sm font-medium leading-none text-gray-400">{user?.email}</p>
                    </div>
                </div>
                 <div className="mt-3 px-2 space-y-1">
                     <button onClick={handleLogout} className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                        <LogOut className="h-5 w-5 mr-3"/> Logout
                     </button>
                 </div>
            </div>
          </div>
        )}
      </nav>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ResidentLayout;
