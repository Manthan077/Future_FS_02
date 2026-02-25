import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Layout = ({ children }) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'}`}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-700'} rounded-lg shadow-lg`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isSidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`w-72 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white/80 backdrop-blur-xl border-indigo-200'} border-r fixed h-screen overflow-y-auto shadow-xl z-40 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg">
              <img 
                src="/LeadForge.jpg" 
                alt="LeadForge Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'}`}>
                LeadForge
              </h1>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>CRM System</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-indigo-50"
                }`
              }
            >
              <span className="text-lg">📈</span>
              <span>Dashboard</span>
            </NavLink>
          </nav>

          {/* Dark Mode Toggle */}
          <div className={`mt-6 p-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'} border rounded-2xl`}>
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center justify-between px-4 py-2 ${isDark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-white hover:bg-slate-50'} rounded-xl transition`}
            >
              <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </span>
            </button>
          </div>

          {/* Status Legend */}
          <div className={`mt-6 p-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'} border rounded-2xl`}>
            <p className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'} uppercase tracking-wider mb-3`}>
              Lead Status
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>New</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Contacted</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Converted</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Lost</span>
              </div>
            </div>
          </div>

          {/* Quick Tip */}
          <div className={`mt-6 p-4 ${isDark ? 'bg-purple-900/30 border-purple-700' : 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-200'} border rounded-2xl`}>
            <p className={`text-xs font-bold ${isDark ? 'text-purple-400' : 'text-purple-700'} uppercase tracking-wider mb-2`}>
              💡 Quick Tip
            </p>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-700'} leading-relaxed`}>
              Click on any lead to view details and add follow-up notes
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className={`absolute bottom-0 left-0 right-0 p-6 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white/80 backdrop-blur-xl border-indigo-200'} border-t`}>
          <button
            onClick={logout}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${isDark ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'} rounded-xl transition font-medium`}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 flex-1 p-4 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
