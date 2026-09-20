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
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

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

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close sidebar on route change for mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[#F4F9F6] font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark h-full flex flex-col flex-shrink-0 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 pb-8 flex items-center justify-between lg:justify-center">
          <img src="/white-logo.png" alt="AgriLedger" className="w-48 md:w-52 max-w-full h-auto object-contain" />
          <button 
            className="lg:hidden text-white/70 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
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
              {user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-white text-sm font-medium truncate">
                {user?.full_name || 'User'}
              </span>
              <span className="text-white/50 text-[10px] uppercase tracking-wider truncate">
                {user?.role || 'Role'}
              </span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="text-white/50 hover:text-white p-2 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        {/* Top Header */}
        <header className="h-16 md:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="relative w-full max-w-md hidden sm:block">
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
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:block bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-xs font-semibold">
              Today: Oct 24, 2024
            </div>
            
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button 
                className="relative text-gray-400 hover:text-gray-600 transition-colors p-2"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0F3D21] rounded-full border border-white"></span>
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-50">
                    <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50">
                      <p className="text-xs text-gray-900 font-medium">Payment received from <span className="font-bold">Jose Mendoza</span></p>
                      <p className="text-[10px] text-gray-500 mt-1">10 minutes ago</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                      <p className="text-xs text-gray-900 font-medium">Low stock alert: <span className="font-bold">Urea (46-0-0)</span></p>
                      <p className="text-[10px] text-gray-500 mt-1">2 hours ago</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-50 text-center">
                    <button className="text-xs font-bold text-[#0F3D21] hover:underline">Mark all as read</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button 
                className="flex items-center gap-2 md:gap-3 p-1 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-[#EAF7EF] flex items-center justify-center text-[#0F3D21] text-xs font-bold border border-[#0F3D21]/10 flex-shrink-0">
                  {user?.full_name ? user.full_name.substring(0, 2).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <span className="text-sm font-bold text-brand-text">
                    {user?.full_name || 'User'}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
              </button>
              
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-50 sm:hidden">
                    <p className="text-sm font-bold text-gray-900">{user?.full_name || 'User'}</p>
                    <p className="text-[10px] text-gray-500">{user?.role || 'Role'}</p>
                  </div>
                  <Link to="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <Settings size={16} className="text-gray-400" /> Settings
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#F4F9F6]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
