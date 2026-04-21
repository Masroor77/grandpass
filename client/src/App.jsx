import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Settings as SettingsIcon, Smartphone, Menu, X, Grid, Users, LayoutDashboard, LogOut, Shield } from 'lucide-react';
import ServiceList from './components/ServiceList';
import SettingsPage from './components/Settings';
import CustomersPage from './components/Customers';
import AdminPage from './components/Admin';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Router>
      <div className="flex h-screen bg-dark-900 text-slate-200 font-sans overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-dark-800 border-r border-dark-700 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-dark-700">
              <div className="flex items-center gap-3 text-indigo-500">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Smartphone size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">GRAND PASS</span>
              </div>
              <button className="md:hidden ml-auto text-slate-400" onClick={toggleSidebar}>
                <X size={24} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
              <NavItem to="/services" icon={Grid} label="All Services" />
              <NavItem to="/customers" icon={Users} label="Customers" />
              <NavItem to="/admin" icon={Shield} label="Admin" />
              <NavItem to="/settings" icon={SettingsIcon} label="Settings" />
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-dark-700">
              <Link
                to="/admin"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-dark-900/50 hover:bg-dark-900 transition-colors cursor-pointer group"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
                  AD
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white group-hover:text-indigo-400 transition-colors">Admin User</div>
                  <div className="text-xs text-slate-500">Shop Owner</div>
                </div>
                <LogOut size={16} className="text-slate-500 group-hover:text-rose-400 transition-colors" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar (Mobile) */}
          <header className="md:hidden h-16 bg-dark-800 border-b border-dark-700 flex items-center justify-between px-4">
            <button onClick={toggleSidebar} className="text-slate-400 hover:text-white">
              <Menu size={24} />
            </button>
            <span className="font-bold text-white">Dashboard</span>
            <div className="w-6"></div> {/* Spacer */}
          </header>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto bg-dark-900 scroll-smooth relative">
            <Routes>
              <Route path="/" element={<ServiceList />} />
              <Route path="/services" element={<ServiceList />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

const NavItem = ({ icon: Icon, label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to === '/' && location.pathname === '/dashboard'); // Handle default route check

  return (
    <Link
      to={to}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
        : 'text-slate-400 hover:bg-dark-700 hover:text-white'
        }`}
    >
      <Icon size={20} className={isActive ? '' : 'opacity-70'} />
      {label}
    </Link>
  );
};

export default App;
