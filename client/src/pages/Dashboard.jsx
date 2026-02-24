import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Layout from "../components/Layout";
import LeadDrawer from "../components/LeadDrawer";
import AddLeadModal from "../components/AddLeadModal";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, RadialBarChart, RadialBar } from "recharts";

const FIRST_NAMES = ["John", "Sarah", "Michael", "Emma", "David", "Lisa", "James", "Maria", "Robert", "Jennifer", "William", "Linda", "Richard", "Patricia", "Joseph", "Nancy", "Thomas", "Karen", "Charles", "Betty", "Daniel", "Helen", "Matthew", "Sandra", "Anthony", "Ashley", "Mark", "Donna", "Donald", "Carol", "Steven", "Michelle", "Paul", "Emily", "Andrew", "Amanda", "Joshua", "Melissa", "Kenneth", "Deborah", "Kevin", "Stephanie", "Brian", "Rebecca", "George", "Laura", "Edward", "Sharon", "Ronald", "Cynthia"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris", "Clark", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"];
const SOURCES = ["Website", "Referral", "LinkedIn", "Cold Call", "Email Campaign", "Facebook", "Instagram", "Twitter", "Google Ads", "Trade Show"];

const generateLeads = (count) => {
  return Array.from({ length: count }, (_, i) => {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    const phone = `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
    
    const rand = Math.random();
    let status;
    if (rand < 0.92) status = "converted";
    else if (rand < 0.97) status = "contacted";
    else if (rand < 0.99) status = "new";
    else status = "lost";
    
    return {
      _id: `lead-${i + 1}`,
      name,
      email,
      phone,
      source: SOURCES[Math.floor(Math.random() * SOURCES.length)],
      status,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
    };
  });
};

const SAMPLE_LEADS = generateLeads(200);

const STATUS_COLORS = {
  new: "#10b981",
  contacted: "#3b82f6",
  converted: "#a855f7",
  lost: "#ef4444"
};

const Dashboard = () => {
  const { token } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [leads, setLeads] = useState(SAMPLE_LEADS);
  const [filtered, setFiltered] = useState(SAMPLE_LEADS);
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchLeads = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.length > 0) {
        console.log("Fetched leads from database:", res.data.length);
        setLeads(res.data);
        setFiltered(res.data);
      } else {
        console.log("No leads in database, using sample data");
        setLeads(SAMPLE_LEADS);
        setFiltered(SAMPLE_LEADS);
      }
    } catch (err) {
      console.log("Error fetching leads, using sample data:", err.message);
      setLeads(SAMPLE_LEADS);
      setFiltered(SAMPLE_LEADS);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [token]);

  useEffect(() => {
    const q = search.toLowerCase();
    let result = leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone?.toLowerCase().includes(q)
    );
    if (statusFilter !== "all") {
      result = result.filter(l => l.status === statusFilter);
    }
    setFiltered(result);
  }, [search, leads, statusFilter]);

  const statusCounts = {
    new: leads.filter(l => l.status === "new").length,
    contacted: leads.filter(l => l.status === "contacted").length,
    converted: leads.filter(l => l.status === "converted").length,
    lost: leads.filter(l => l.status === "lost").length
  };

  const pieData = [
    { name: "Converted", value: statusCounts.converted, color: STATUS_COLORS.converted },
    { name: "Contacted", value: statusCounts.contacted, color: STATUS_COLORS.contacted },
    { name: "New", value: statusCounts.new, color: STATUS_COLORS.new },
    { name: "Lost", value: statusCounts.lost, color: STATUS_COLORS.lost }
  ];

  const sourceData = SOURCES.map(source => ({
    name: source,
    count: leads.filter(l => l.source === source).length
  })).sort((a, b) => b.count - a.count);

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const last7Days = getLast7Days();
  const timelineData = last7Days.map(day => {
    const dayLeads = leads.filter(l => l.createdAt.split('T')[0] === day);
    return {
      date: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      new: dayLeads.filter(l => l.status === 'new').length,
      contacted: dayLeads.filter(l => l.status === 'contacted').length,
      converted: dayLeads.filter(l => l.status === 'converted').length,
      total: dayLeads.length
    };
  });

  const conversionRate = leads.length === 0 ? 0 : Math.round((statusCounts.converted / leads.length) * 100);

  const handleLeadAdded = (newLead) => {
    setLeads([newLead, ...leads]);
    setFiltered([newLead, ...filtered]);
  };

  const radialData = [{ name: 'Conversion', value: conversionRate, fill: '#a855f7' }];

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'} mb-2`}>
            Dashboard Overview
          </h1>
          <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Complete analytics and lead management</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition shadow-lg"
        >
          <span className="text-xl">+</span>
          <span>Add Lead</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Leads" 
          value={leads.length} 
          icon="📊"
          gradient="from-blue-500 to-cyan-500"
          subtitle={`+${Math.floor(leads.length * 0.12)} this week`}
        />
        <StatCard 
          title="Converted" 
          value={statusCounts.converted} 
          icon="🎯"
          gradient="from-purple-500 to-pink-500"
          subtitle="Successfully closed"
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${conversionRate}%`} 
          icon="📈"
          gradient="from-green-500 to-emerald-500"
          subtitle="Outstanding performance"
        />
        <StatCard 
          title="Active Leads" 
          value={statusCounts.new + statusCounts.contacted} 
          icon="⚡"
          gradient="from-orange-500 to-red-500"
          subtitle="In progress"
        />
      </div>

      {/* Enhanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Conversion Rate Radial */}
        <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white/80 backdrop-blur-xl border-indigo-200'} border rounded-2xl p-6 shadow-xl`}>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-4`}>Conversion Performance</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="60%" 
                outerRadius="100%" 
                barSize={30} 
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={30}
                  fill="#a855f7"
                />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-5xl font-bold" fill="#6366f1">
                  {conversionRate}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className={`${isDark ? 'bg-purple-900/30 border-purple-700' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'} border rounded-xl p-3 text-center`}>
              <p className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{statusCounts.converted}</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>Converted</p>
            </div>
            <div className={`${isDark ? 'bg-blue-900/30 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'} border rounded-xl p-3 text-center`}>
              <p className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{leads.length}</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>Total Leads</p>
            </div>
          </div>
        </div>

        {/* Enhanced Pie Chart */}
        <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white/80 backdrop-blur-xl border-indigo-200'} border rounded-2xl p-6 shadow-xl`}>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-4`}>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "#fff", 
                  border: "1px solid #e0e7ff",
                  borderRadius: "12px"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Area Chart & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Area Chart */}
        <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white/80 backdrop-blur-xl border-indigo-200'} border rounded-2xl p-6 shadow-xl`}>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-4`}>7-Day Lead Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorContacted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e0e7ff'} />
              <XAxis dataKey="date" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "#fff", 
                  border: "1px solid #e0e7ff",
                  borderRadius: "12px"
                }}
              />
              <Area type="monotone" dataKey="converted" stroke="#a855f7" fillOpacity={1} fill="url(#colorConverted)" />
              <Area type="monotone" dataKey="contacted" stroke="#3b82f6" fillOpacity={1} fill="url(#colorContacted)" />
              <Area type="monotone" dataKey="new" stroke="#10b981" fillOpacity={1} fill="url(#colorNew)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white/80 backdrop-blur-xl border-indigo-200'} border rounded-2xl p-6 shadow-xl`}>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'} mb-4`}>Lead Sources Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sourceData}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e0e7ff'} />
              <XAxis dataKey="name" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10 }} angle={-45} textAnchor="end" height={100} />
              <YAxis tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "#fff", 
                  border: "1px solid #e0e7ff",
                  borderRadius: "12px"
                }}
              />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            placeholder="🔍 Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full px-4 py-3 ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white/80 backdrop-blur-xl border-indigo-200 text-slate-800'} border rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`px-4 py-3 ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white/80 backdrop-blur-xl border-indigo-200 text-slate-800'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm`}
        >
          <option value="all">All Status ({leads.length})</option>
          <option value="new">New ({statusCounts.new})</option>
          <option value="contacted">Contacted ({statusCounts.contacted})</option>
          <option value="converted">Converted ({statusCounts.converted})</option>
          <option value="lost">Lost ({statusCounts.lost})</option>
        </select>
      </div>

      {/* Leads Table */}
      <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white/80 backdrop-blur-xl border-indigo-200'} border rounded-2xl overflow-hidden shadow-xl`}>
        <div className={`px-6 py-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'} border-b`}>
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>All Leads ({filtered.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${isDark ? 'bg-slate-800' : 'bg-slate-50'} border-b ${isDark ? 'border-slate-700' : 'border-indigo-100'}`}>
                <th className={`px-6 py-4 text-left text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'} uppercase tracking-wider`}>
                  Name
                </th>
                <th className={`px-6 py-4 text-left text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'} uppercase tracking-wider`}>
                  Contact
                </th>
                <th className={`px-6 py-4 text-left text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'} uppercase tracking-wider`}>
                  Source
                </th>
                <th className={`px-6 py-4 text-left text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'} uppercase tracking-wider`}>
                  Status
                </th>
                <th className={`px-6 py-4 text-left text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'} uppercase tracking-wider`}>
                  Date
                </th>
              </tr>
            </thead>

            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-indigo-100'}`}>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className={isDark ? 'text-slate-500' : 'text-slate-500'}>
                      <p className="text-lg mb-2">No leads found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}

              {filtered.map((lead) => (
                <tr
                  key={lead._id}
                  onClick={() => setSelectedLead(lead)}
                  className={`${isDark ? 'hover:bg-slate-800' : 'hover:bg-indigo-50'} cursor-pointer transition`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{lead.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className={isDark ? 'text-slate-300' : 'text-slate-700'}>{lead.email}</div>
                      <div className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{lead.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'} rounded-full text-xs font-medium`}>
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: `${STATUS_COLORS[lead.status]}20`,
                        color: STATUS_COLORS[lead.status]
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[lead.status] }}></span>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {new Date(lead.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <LeadDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onLeadUpdated={fetchLeads}
      />

      <AddLeadModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onLeadAdded={handleLeadAdded}
        token={token}
      />
    </Layout>
  );
};

const StatCard = ({ title, value, icon, gradient, subtitle }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-xl text-white`}>
    <div className="flex items-center justify-between mb-4">
      <span className="text-4xl">{icon}</span>
    </div>
    <p className="text-white/90 text-sm mb-1 font-medium">{title}</p>
    <h3 className="text-4xl font-bold mb-2">{value}</h3>
    <p className="text-white/70 text-xs">{subtitle}</p>
  </div>
);

export default Dashboard;
