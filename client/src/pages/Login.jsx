import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password }
      );
      login(res.data.token);
      navigate("/dashboard");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("manthan@gmail.com");
    setPassword("Manthan123");
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100'} flex items-center justify-center p-4`}>
      <div className="w-full max-w-md relative">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`absolute -top-16 right-0 px-4 py-2 ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-white hover:bg-slate-50 text-slate-700'} rounded-xl transition shadow-lg font-medium`}
        >
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-4 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="/LeadForge.jpg" 
              alt="LeadForge Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className={`text-5xl font-bold ${isDark ? 'text-white' : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'} mb-2`}>
            LeadForge
          </h1>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Client Lead Management System</p>
        </div>

        {/* Login Card */}
        <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white/80 backdrop-blur-xl border-indigo-200'} border rounded-3xl p-8 shadow-2xl`}>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-2`}>Welcome Back</h2>
          <p className={`text-sm mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Sign in to manage your leads</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} border rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full px-4 py-3 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} border rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className={`${isDark ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'} border rounded-xl p-3`}>
                <p className={`text-sm ${isDark ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo Credentials Button */}
          <div className={`mt-6 pt-6 ${isDark ? 'border-slate-800' : 'border-slate-200'} border-t`}>
            <button
              onClick={fillDemoCredentials}
              className={`w-full py-3 ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'} font-medium rounded-xl transition flex items-center justify-center gap-2`}
            >
              <span>🎯</span>
              <span>Use Demo Credentials</span>
            </button>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'} text-center mt-3`}>
              Click to auto-fill demo admin credentials
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className={`text-center text-sm mt-6 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
          Secure Admin Access Only
        </p>
      </div>
    </div>
  );
};

export default Login;
