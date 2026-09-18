import {
  ArrowRightLeft,
  Bell,
  Box,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Farmer Directory", path: "/dashboard/farmers", icon: Users },
    {
      name: "Transactions",
      path: "/dashboard/transactions",
      icon: ArrowRightLeft,
    },
    { name: "Payments", path: "/dashboard/payments", icon: CreditCard },
    { name: "Inventory", path: "/dashboard/inventory", icon: Box },
    { name: "Reports", path: "/dashboard/reports", icon: FileText },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F4F9F6] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark h-full flex flex-col flex-shrink-0">
        <div className="p-6 pb-8 flex items-center justify-center">
          <img src="/white-logo.png" alt="AgriLedger" className="w-48 md:w-52 max-w-full h-auto object-contain" />
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#154226] text-white"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} className={isActive ? "text-[#a0d2b4]" : ""} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 mt-auto">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-[#154226] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              JD
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-white text-sm font-medium truncate">
                Josie Cabrera
              </span>
              <span className="text-white/50 text-[10px] uppercase tracking-wider truncate">
                Owner / Manager
              </span>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="text-white/50 hover:text-white p-2"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0 z-10">
          <div className="relative w-96">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search farmer name, barangay, or transaction ID..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dark focus:border-brand-dark transition-colors"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-xs font-semibold">
              Today: Oct 24, 2024
            </div>
            <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#0F3D21] rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EAF7EF] flex items-center justify-center text-[#0F3D21] text-xs font-bold border border-[#0F3D21]/10">
                JD
              </div>
              <span className="text-sm font-bold text-brand-text">
                John Doe
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
