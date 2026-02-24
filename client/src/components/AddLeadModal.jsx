import { useState } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const AddLeadModal = ({ isOpen, onClose, onLeadAdded, token }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "Website",
    message: "",
    status: "new"
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/leads",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onLeadAdded(res.data);
      setFormData({ name: "", email: "", phone: "", source: "Website", message: "", status: "new" });
      onClose();
    } catch (error) {
      alert("Error adding lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-indigo-200'} rounded-2xl max-w-md w-full p-6 shadow-2xl border`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'}`}>
            Add New Lead
          </h2>
          <button
            onClick={onClose}
            className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'} transition text-2xl`}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-4 py-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="+1 555-123-4567"
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
              Source
            </label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className={`w-full px-4 py-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option>Website</option>
              <option>Referral</option>
              <option>LinkedIn</option>
              <option>Cold Call</option>
              <option>Email Campaign</option>
              <option>Facebook</option>
              <option>Instagram</option>
              <option>Twitter</option>
              <option>Google Ads</option>
              <option>Trade Show</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`w-full px-4 py-2 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              rows="3"
              placeholder="Lead message or notes..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'} rounded-xl transition font-medium`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition disabled:opacity-50 font-medium shadow-lg"
            >
              {loading ? "Adding..." : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
