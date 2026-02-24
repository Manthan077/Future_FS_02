import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const STATUS_COLORS = {
  new: "#10b981",
  contacted: "#3b82f6",
  converted: "#a855f7",
  lost: "#ef4444"
};

const LeadDrawer = ({ lead, onClose, onLeadUpdated }) => {
  const { token } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(lead?.status || "new");
  const [statusLoading, setStatusLoading] = useState(false);
  const [currentLead, setCurrentLead] = useState(lead);

  useEffect(() => {
    if (lead) {
      setCurrentLead(lead);
      setStatus(lead.status);
    }
  }, [lead]);

  if (!lead || !currentLead) return null;

  const refreshLead = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedLead = res.data.find(l => l._id === lead._id);
      if (updatedLead) {
        setCurrentLead(updatedLead);
      }
      if (onLeadUpdated) onLeadUpdated();
    } catch (error) {
      console.error("Error refreshing lead");
    }
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    setLoading(true);

    try {
      await axios.post(
        `${API_BASE_URL}/api/leads/${lead._id}/notes`,
        { text: noteText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNoteText("");
      await refreshLead();
    } catch (error) {
      console.error("Error adding note");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setStatusLoading(true);
    try {
      await axios.patch(
        `${API_BASE_URL}/api/leads/${lead._id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(newStatus);
      await refreshLead();
    } catch (error) {
      console.error("Error updating status");
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-50" onClick={onClose}>
      <div 
        className={`w-[480px] ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-indigo-50 to-purple-50'} h-full shadow-2xl overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${isDark ? 'bg-slate-800' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} p-6 text-white`}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl font-bold">
                {currentLead.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{currentLead.name}</h3>
                <p className="text-indigo-100 text-sm">{currentLead.email}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-white/80 hover:text-white text-2xl transition"
            >
              ✕
            </button>
          </div>
          
          {currentLead.phone && (
            <p className="text-indigo-100 text-sm">📞 {currentLead.phone}</p>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-indigo-100'} rounded-xl p-4 shadow-sm border`}>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'} uppercase tracking-wider mb-1`}>Source</p>
              <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{currentLead.source}</p>
            </div>
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-indigo-100'} rounded-xl p-4 shadow-sm border`}>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'} uppercase tracking-wider mb-1`}>Date Added</p>
              <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {new Date(currentLead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Status Update */}
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-indigo-100'} rounded-xl p-5 shadow-sm border`}>
            <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-3`}>Update Status</p>
            <div className="grid grid-cols-2 gap-2">
              {["new", "contacted", "converted", "lost"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={statusLoading}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 ${
                    status === s
                      ? "text-white shadow-md"
                      : isDark ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  style={status === s ? { backgroundColor: STATUS_COLORS[s] } : {}}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            {statusLoading && (
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'} mt-2 text-center`}>Updating...</p>
            )}
          </div>

          {/* Notes Section */}
          <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-indigo-100'} rounded-xl p-5 shadow-sm border`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Follow-up Notes</h4>
              <span className={`text-xs ${isDark ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700'} px-3 py-1 rounded-full font-medium`}>
                {currentLead.notes?.length || 0} notes
              </span>
            </div>

            {/* Notes List */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto mb-4">
              {(!currentLead.notes || currentLead.notes.length === 0) && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">📝</div>
                  <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>No notes yet</p>
                  <p className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'} mt-1`}>Add your first follow-up note below</p>
                </div>
              )}
              {currentLead.notes && currentLead.notes.length > 0 && currentLead.notes.map((n, idx) => (
                <div key={n._id || idx} className={`${isDark ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100'} border p-4 rounded-lg`}>
                  <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'} leading-relaxed mb-2`}>{n.text}</p>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {new Date(n.createdAt).toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              ))}
            </div>

            {/* Add Note */}
            <div className="space-y-3">
              <textarea
                rows="4"
                placeholder="Add a follow-up note, meeting summary, or next action..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className={`w-full p-4 rounded-lg ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'} border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400`}
              />
              <button
                onClick={addNote}
                disabled={loading || !noteText.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? "Saving..." : "💾 Add Note"}
              </button>
            </div>
          </div>

          {/* Message Section */}
          {currentLead.message && (
            <div className={`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-indigo-100'} rounded-xl p-5 shadow-sm border`}>
              <p className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'} mb-2`}>Original Message</p>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>{currentLead.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDrawer;
