import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkBase =
    "block px-4 py-2 rounded-lg text-sm transition";

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 p-6">
      <h1 className="text-xl font-semibold text-blue-500 mb-10">
        LeadForge
      </h1>

      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/leads"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`
          }
        >
          Leads
        </NavLink>
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <button className="text-sm text-red-400 hover:underline">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
