"use client";

import { useState, useMemo, useEffect } from "react";

// Types
interface Driver {
  id: number;
  name: string;
  toda: string;
  status: "Active" | "Inactive";
  phone: string;
  license: string;
  bodyNumber: string;
  trips: number;
  joinedDate: string;
}

interface RideRequest {
  id: number;
  passenger: string;
  driver: string;
  location: string;
  status: "Completed" | "Ongoing" | "Waiting";
  fare: number;
  time: string;
}

export default function Home() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<"dashboard" | "create-driver" | "ride-requests" | "earnings" | "users">("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Data States
  const [drivers, setDrivers] = useState<Driver[]>([
    { id: 1, name: "Mario Reyes", toda: "Baguio TODA", status: "Active", phone: "09123456789", license: "N01-23-456789", bodyNumber: "T-1042", trips: 45, joinedDate: "2026-01-12" },
    { id: 2, name: "Pedro Santos", toda: "CHOT-TODA", status: "Active", phone: "09187654321", license: "N02-98-765432", bodyNumber: "T-2091", trips: 32, joinedDate: "2026-02-20" },
    { id: 3, name: "Juan Cruz", toda: "LHITC-TODA", status: "Active", phone: "09223334444", license: "N03-45-678901", bodyNumber: "T-0582", trips: 28, joinedDate: "2026-03-05" },
    { id: 4, name: "Manuel Roxas", toda: "Baguio TODA", status: "Inactive", phone: "09456789012", license: "N04-56-789012", bodyNumber: "T-0912", trips: 14, joinedDate: "2026-03-18" },
    { id: 5, name: "Jose Rizal", toda: "LHITC-TODA", status: "Active", phone: "09998887777", license: "N05-88-990011", bodyNumber: "T-1152", trips: 60, joinedDate: "2026-01-05" }
  ]);

  const [rideRequests, setRideRequests] = useState<RideRequest[]>([
    { id: 1, passenger: "Maria Cruz", driver: "Mario Reyes", location: "Tayabas Market", status: "Completed", fare: 80, time: "8:45 AM" },
    { id: 2, passenger: "Carlo Diaz", driver: "Pedro Santos", location: "Minor Basilica", status: "Ongoing", fare: 120, time: "11:15 AM" },
    { id: 3, passenger: "Ana Reyes", driver: "Juan Cruz", location: "City Hall", status: "Waiting", fare: 65, time: "1:30 PM" },
    { id: 4, passenger: "Ben Santos", driver: "Jose Rizal", location: "Plaza Mayor", status: "Completed", fare: 90, time: "1:45 PM" }
  ]);

  // Statistics State (Derived and Dynamic)
  const totalDriversCount = drivers.length;
  const activeDriversCount = drivers.filter(d => d.status === "Active").length;
  const usersCount = 530 + drivers.length; // passenger base + drivers
  const tripsCount = rideRequests.length + 206; // static default baseline + actual entries

  // Form & Modals States
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showEditDriverModal, setShowEditDriverModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  // Form inputs state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    license: "",
    bodyNumber: "",
    toda: "Baguio TODA",
    status: "Active" as "Active" | "Inactive"
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    license: "",
    bodyNumber: "",
    toda: "",
    status: "Active" as "Active" | "Inactive"
  });

  // Ride Request Creator state (Dashboard Quick Tool)
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);
  const [newRequestData, setNewRequestData] = useState({
    passenger: "",
    driverId: "",
    location: "",
    status: "Waiting" as "Completed" | "Ongoing" | "Waiting",
    fare: ""
  });

  // Search & Filters state
  const [driverSearch, setDriverSearch] = useState("");
  const [requestSearch, setRequestSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Chart state (Hover tooltip index)
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [chartTooltip, setChartTooltip] = useState({ x: 0, y: 0, val: 0, label: "" });

  // Hourly ride requests data
  const chartData = [
    { label: "8 AM", val: 38 },
    { label: "9 AM", val: 36 },
    { label: "10 AM", val: 21 },
    { label: "11 AM", val: 28 },
    { label: "12 PM", val: 16 },
    { label: "1 PM", val: 30 }
  ];

  // Calculate dynamic earnings
  const earningsToday = useMemo(() => {
    return rideRequests
      .filter(r => r.status === "Completed")
      .reduce((sum, r) => sum + r.fare, 3200); // 3200 base + dynamic
  }, [rideRequests]);

  const earningsWeekly = useMemo(() => {
    return 18200 + (earningsToday - 3350); // adjusting with base
  }, [earningsToday]);

  const earningsMonthly = useMemo(() => {
    return 72500 + (earningsToday - 3350);
  }, [earningsToday]);

  // Form Handlers
  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.license || !formData.bodyNumber) {
      alert("Please fill in all fields.");
      return;
    }
    const newDriver: Driver = {
      id: Date.now(),
      name: `${formData.firstName} ${formData.lastName}`,
      toda: formData.toda,
      status: formData.status,
      phone: formData.phone,
      license: formData.license,
      bodyNumber: formData.bodyNumber,
      trips: 0,
      joinedDate: new Date().toISOString().split("T")[0]
    };
    setDrivers(prev => [newDriver, ...prev]);
    // Reset Form
    setFormData({
      firstName: "",
      lastName: "",
      phone: "",
      license: "",
      bodyNumber: "",
      toda: "Baguio TODA",
      status: "Active"
    });
    setShowAddDriverModal(false);
    setActiveTab("dashboard"); // redirect to main view or keep there
  };

  const handleEditDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDriver) return;
    setDrivers(prev =>
      prev.map(d =>
        d.id === editingDriver.id
          ? {
              ...d,
              name: editFormData.name,
              phone: editFormData.phone,
              license: editFormData.license,
              bodyNumber: editFormData.bodyNumber,
              toda: editFormData.toda,
              status: editFormData.status
            }
          : d
      )
    );
    setShowEditDriverModal(false);
    setEditingDriver(null);
  };

  const handleDeactivateToggle = (id: number) => {
    setDrivers(prev =>
      prev.map(d => (d.id === id ? { ...d, status: d.status === "Active" ? "Inactive" : "Active" } : d))
    );
  };

  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestData.passenger || !newRequestData.location || !newRequestData.fare) {
      alert("Please fill in all fields.");
      return;
    }
    const assignedDriverName = drivers.find(d => d.id === Number(newRequestData.driverId))?.name || "Unassigned";
    const newReq: RideRequest = {
      id: Date.now(),
      passenger: newRequestData.passenger,
      driver: assignedDriverName,
      location: newRequestData.location,
      status: newRequestData.status,
      fare: Number(newRequestData.fare),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRideRequests(prev => [newReq, ...prev]);
    setShowAddRequestModal(false);
    setNewRequestData({
      passenger: "",
      driverId: "",
      location: "",
      status: "Waiting",
      fare: ""
    });
  };

  // Filter lists
  const filteredDrivers = useMemo(() => {
    return drivers.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(driverSearch.toLowerCase()) || 
                          d.toda.toLowerCase().includes(driverSearch.toLowerCase()) ||
                          d.bodyNumber.toLowerCase().includes(driverSearch.toLowerCase());
      return matchSearch;
    });
  }, [drivers, driverSearch]);

  const filteredRequests = useMemo(() => {
    return rideRequests.filter(r => {
      const matchSearch = r.passenger.toLowerCase().includes(requestSearch.toLowerCase()) || 
                          r.driver.toLowerCase().includes(requestSearch.toLowerCase()) ||
                          r.location.toLowerCase().includes(requestSearch.toLowerCase());
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [rideRequests, requestSearch, statusFilter]);

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden font-sans">
      {/* Top Header */}
      <header className="bg-[#0b1b6e] text-white flex items-center justify-between px-6 py-3 shadow-md z-20 shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile menu hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-1.5 rounded hover:bg-white/10 transition-colors"
            aria-label="Toggle Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-wider bg-white text-[#0b1b6e] px-2.5 py-0.5 rounded-md shadow-sm">
              TodaGo
            </span>
            <span className="text-sky-200 text-xs font-semibold uppercase tracking-widest hidden sm:inline-block border-l border-white/20 pl-2">
              Management Portal
            </span>
          </div>
        </div>

        {/* User profile details */}
        <div className="flex items-center gap-3 cursor-pointer group relative">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold tracking-wide">Admin</p>
            <p className="text-[10px] text-sky-200">System Operator</p>
          </div>
          
          {/* Beautiful Custom Avatar */}
          <div className="relative">
            <svg width="38" height="38" viewBox="0 0 40 40" className="rounded-full shadow-inner border-2 border-sky-300">
              <circle cx="20" cy="20" r="18" fill="#38bdf8"/>
              <mask id="mask-avatar" maskUnits="userSpaceOnUse" x="2" y="2" width="36" height="36">
                <circle cx="20" cy="20" r="18" fill="#FFFFFF"/>
              </mask>
              <g mask="url(#mask-avatar)">
                <path d="M9 16C9 10 14 8 20 8C26 8 31 10 31 16C31 22 28 24 28 27C28 30 20 31 20 31C20 31 12 30 12 27C12 24 9 22 9 16Z" fill="#1e1b4b"/>
                <circle cx="20" cy="19" r="7" fill="#fed7aa"/>
                <path d="M14 15C16 13 18 13 20 14C22 13 24 13 26 15C26 15 24 11 20 11C16 11 14 15 14 15Z" fill="#1e1b4b"/>
                <path d="M10 36C10 31 14 29 20 29C26 29 30 31 30 36H10Z" fill="#4f46e5"/>
                <path d="M20 29V32" stroke="#fed7aa" strokeWidth="2" strokeLinecap="round"/>
              </g>
            </svg>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0b1b6e] rounded-full"></span>
          </div>

          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sky-200 group-hover:text-white transition-colors">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Sidebar */}
        <aside className={`
          bg-[#c7ebff] w-64 flex flex-col shrink-0 transition-transform duration-300 z-10
          absolute inset-y-0 left-0 md:relative md:translate-x-0
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          shadow-lg md:shadow-none
        `}>
          <nav className="flex-1 py-4 flex flex-col gap-0.5">
            {/* Dashboard Tab */}
            <button
              onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
              className={`flex items-center gap-4 px-6 py-3.5 font-bold transition-all text-left border-l-4 ${
                activeTab === "dashboard"
                  ? "bg-white text-[#091b6f] border-[#091b6f] shadow-sm"
                  : "text-[#091b6f] border-transparent hover:bg-white/40"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Dashboard</span>
            </button>

            {/* Create Driver Account Tab */}
            <button
              onClick={() => { setActiveTab("create-driver"); setMobileMenuOpen(false); }}
              className={`flex items-center gap-4 px-6 py-3.5 font-bold transition-all text-left border-l-4 ${
                activeTab === "create-driver"
                  ? "bg-white text-[#091b6f] border-[#091b6f] shadow-sm"
                  : "text-[#091b6f] border-transparent hover:bg-white/40"
              }`}
            >
              {/* Philippine Tricycle Icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
                <path d="M5.5 16h13M8.5 10l2-4h5v4M4 11.5a2.5 2.5 0 0 1 2.5-2.5h2" />
                <path d="M12 10v6M18.5 16v-6h-7M3.5 13.5h2" />
              </svg>
              <span>Create Driver Account</span>
            </button>

            {/* Ride Requests Tab */}
            <button
              onClick={() => { setActiveTab("ride-requests"); setMobileMenuOpen(false); }}
              className={`flex items-center gap-4 px-6 py-3.5 font-bold transition-all text-left border-l-4 ${
                activeTab === "ride-requests"
                  ? "bg-white text-[#091b6f] border-[#091b6f] shadow-sm"
                  : "text-[#091b6f] border-transparent hover:bg-white/40"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Ride Requests</span>
            </button>

            {/* Earnings Tab */}
            <button
              onClick={() => { setActiveTab("earnings"); setMobileMenuOpen(false); }}
              className={`flex items-center gap-4 px-6 py-3.5 font-bold transition-all text-left border-l-4 ${
                activeTab === "earnings"
                  ? "bg-white text-[#091b6f] border-[#091b6f] shadow-sm"
                  : "text-[#091b6f] border-transparent hover:bg-white/40"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 8h6.5a2.5 2.5 0 0 1 0 5H8" />
                <path d="M8 10h6M8 12h6M8 8v10" />
              </svg>
              <span>Earnings</span>
            </button>

            {/* Users Management Tab */}
            <button
              onClick={() => { setActiveTab("users"); setMobileMenuOpen(false); }}
              className={`flex items-center gap-4 px-6 py-3.5 font-bold transition-all text-left border-l-4 ${
                activeTab === "users"
                  ? "bg-white text-[#091b6f] border-[#091b6f] shadow-sm"
                  : "text-[#091b6f] border-transparent hover:bg-white/40"
              }`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Users Management</span>
            </button>
          </nav>
          
          {/* Footer of Sidebar */}
          <div className="p-4 border-t border-[#b2e1fc]/50 text-center">
            <p className="text-[10px] text-[#091b6f]/60 font-semibold">TodaGo Dashboard v1.2</p>
            <p className="text-[9px] text-[#091b6f]/40 font-medium">Baguio City, Philippines</p>
          </div>
        </aside>

        {/* Sidebar Overlay for Mobile */}
        {mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)} 
            className="md:hidden absolute inset-0 bg-black/40 backdrop-blur-xs z-0"
          ></div>
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 p-6 overflow-y-auto bg-[#f0f6ff] transition-all relative">
          
          {/* Active Tab: Dashboard */}
          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-6 max-w-7xl mx-auto">
              
              {/* Stat Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Drivers */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                      <path d="M8 2h8" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium text-sm">Total drivers</p>
                    <p className="text-3xl font-extrabold text-[#091b6f]">{totalDriversCount}</p>
                  </div>
                </div>

                {/* Active Drivers */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                      <line x1="12" y1="2" x2="12" y2="12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium text-sm">Active Drivers</p>
                    <p className="text-3xl font-extrabold text-[#091b6f]">{activeDriversCount}</p>
                  </div>
                </div>

                {/* Users */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                  <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium text-sm">Users</p>
                    <p className="text-3xl font-extrabold text-[#091b6f]">{usersCount}</p>
                  </div>
                </div>

                {/* Trips Today */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                  <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="5.5" cy="18.5" r="2.5" />
                      <circle cx="18.5" cy="18.5" r="2.5" />
                      <path d="M5.5 16h13M8.5 10l2-4h5v4" />
                      <path d="M12 10v6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium text-sm">Trips Today</p>
                    <p className="text-3xl font-extrabold text-[#091b6f]">{tripsCount}</p>
                  </div>
                </div>
              </div>

              {/* Main Split Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Columns (8 grid units) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  
                  {/* Ride Activity Chart Card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 relative overflow-visible">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-[#091b6f] font-bold text-lg">Ride Activity</h2>
                        <p className="text-xs text-slate-400 font-medium">Ride Requests Today</p>
                      </div>
                      <div className="text-slate-300 hover:text-slate-500 cursor-pointer">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
                        </svg>
                      </div>
                    </div>

                    {/* Interactive SVG Bar Chart */}
                    <div className="relative h-56 w-full mt-2">
                      <svg viewBox="0 0 450 180" className="w-full h-full">
                        {/* Grid Lines */}
                        <line x1="30" y1="20" x2="420" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="30" y1="60" x2="420" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="30" y1="100" x2="420" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="30" y1="140" x2="420" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                        <line x1="30" y1="150" x2="420" y2="150" stroke="#94a3b8" strokeWidth="1" />

                        {/* Y-Axis Labels */}
                        <text x="15" y="24" className="text-[10px] fill-slate-400 font-bold text-right" textAnchor="end">40</text>
                        <text x="15" y="64" className="text-[10px] fill-slate-400 font-bold text-right" textAnchor="end">30</text>
                        <text x="15" y="104" className="text-[10px] fill-slate-400 font-bold text-right" textAnchor="end">20</text>
                        <text x="15" y="144" className="text-[10px] fill-slate-400 font-bold text-right" textAnchor="end">10</text>

                        {/* Bars & Interactive Triggers */}
                        {chartData.map((d, i) => {
                          const maxVal = 40;
                          const chartHeight = 130; // height from 20 to 150
                          const barHeight = (d.val / maxVal) * chartHeight;
                          const barWidth = 28;
                          const xSpacing = 65;
                          const startX = 50 + i * xSpacing;
                          const startY = 150 - barHeight;

                          return (
                            <g key={i}>
                              {/* Background highlight pill on hover */}
                              <rect
                                x={startX - 10}
                                y="10"
                                width={barWidth + 20}
                                height="145"
                                rx="8"
                                fill="transparent"
                                className="hover:fill-slate-50/50 cursor-pointer transition-colors"
                                onMouseEnter={(e) => {
                                  setHoveredBarIndex(i);
                                  setChartTooltip({
                                    x: startX + barWidth / 2,
                                    y: startY - 8,
                                    val: d.val,
                                    label: d.label
                                  });
                                }}
                                onMouseLeave={() => setHoveredBarIndex(null)}
                              />
                              {/* Actual Bar */}
                              <rect
                                x={startX}
                                y={startY}
                                width={barWidth}
                                height={barHeight}
                                fill="#091b6f"
                                rx="2"
                                className={`transition-all duration-300 ${
                                  hoveredBarIndex === i ? "fill-[#2563eb]" : "fill-[#091b6f]"
                                }`}
                              />
                              {/* X-Axis Label */}
                              <text
                                x={startX + barWidth / 2}
                                y="168"
                                className="text-[9px] fill-slate-500 font-bold"
                                textAnchor="middle"
                              >
                                {d.label}
                              </text>
                            </g>
                          );
                        })}
                      </svg>

                      {/* Tooltip Popup */}
                      {hoveredBarIndex !== null && (
                        <div 
                          className="absolute bg-[#091b6f] text-white text-[10px] font-bold px-2 py-1 rounded shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all z-10"
                          style={{
                            left: `${(chartTooltip.x / 450) * 100}%`,
                            top: `${(chartTooltip.y / 180) * 100}%`
                          }}
                        >
                          {chartTooltip.val} Requests
                        </div>
                      )}
                    </div>

                    {/* Chart Legend */}
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="w-4 h-4 bg-[#091b6f] rounded-xs inline-block"></span>
                      <span className="text-xs text-slate-500 font-bold">Ride Requests</span>
                    </div>
                  </div>

                  {/* Recent Ride Requests Card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-[#091b6f] font-bold text-lg">Recent Ride Request</h2>
                      <div className="flex items-center gap-3">
                        {/* Simulation trigger */}
                        <button
                          onClick={() => setShowAddRequestModal(true)}
                          className="text-xs text-[#091b6f] font-bold hover:underline"
                        >
                          + New Request
                        </button>
                        <button
                          onClick={() => setActiveTab("ride-requests")}
                          className="text-xs text-blue-500 font-bold hover:underline flex items-center gap-1"
                        >
                          View All
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                        </button>
                      </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <th className="pb-3 pl-2">Passenger</th>
                            <th className="pb-3">Driver</th>
                            <th className="pb-3">Location</th>
                            <th className="pb-3 text-right pr-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm font-semibold divide-y divide-slate-50">
                          {rideRequests.slice(0, 3).map((r) => (
                            <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3 pl-2 text-slate-700">{r.passenger}</td>
                              <td className="py-3 text-slate-600">{r.driver}</td>
                              <td className="py-3 text-slate-500">{r.location}</td>
                              <td className="py-3 text-right pr-2">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  r.status === "Completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                  r.status === "Ongoing" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                                  "bg-amber-50 text-amber-600 border border-amber-100"
                                }`}>
                                  {r.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                {/* Right Columns (5 grid units) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  
                  {/* Quick Actions Card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-[#091b6f] font-bold text-lg">Quick Actions</h2>
                      <div className="text-slate-300 hover:text-slate-500 cursor-pointer">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
                        </svg>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowAddDriverModal(true)}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer hover:scale-[1.01]"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:rotate-90 transition-transform duration-200">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      <span>Add Driver</span>
                    </button>
                  </div>

                  {/* Recent Management Card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-[#091b6f] font-bold text-lg">Recent Management</h2>
                      <button
                        onClick={() => setActiveTab("users")}
                        className="text-xs text-blue-500 font-bold hover:underline flex items-center gap-1"
                      >
                        View All
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                      </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <th className="pb-3 pl-2">Driver</th>
                            <th className="pb-3">TODA</th>
                            <th className="pb-3 text-right pr-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm font-semibold divide-y divide-slate-50">
                          {drivers.slice(0, 3).map((d) => (
                            <tr key={d.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="py-3 pl-2">
                                <p className="text-slate-700">{d.name}</p>
                                <p className="text-[10px] text-slate-400">{d.bodyNumber}</p>
                              </td>
                              <td className="py-3 text-slate-600">{d.toda}</td>
                              <td className="py-3 text-right pr-2">
                                <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => {
                                      setEditingDriver(d);
                                      setEditFormData({
                                        name: d.name,
                                        phone: d.phone,
                                        license: d.license,
                                        bodyNumber: d.bodyNumber,
                                        toda: d.toda,
                                        status: d.status
                                      });
                                      setShowEditDriverModal(true);
                                    }}
                                    className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold hover:bg-blue-100 transition-colors"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeactivateToggle(d.id)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                                      d.status === "Active"
                                        ? "text-rose-500 bg-rose-50 hover:bg-rose-100"
                                        : "text-emerald-500 bg-emerald-50 hover:bg-emerald-100"
                                    }`}
                                  >
                                    {d.status === "Active" ? "Deactivate" : "Activate"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Earnings Summary Card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-[#091b6f] font-bold text-lg">Earnings Summary</h2>
                      <div className="text-slate-300 hover:text-slate-500 cursor-pointer">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      {/* Today's Earnings */}
                      <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
                        <div>
                          <p className="text-slate-600 text-sm font-semibold">Today's Earnings</p>
                          <p className="text-[10px] text-slate-400 font-bold">Target: ₱3,500</p>
                        </div>
                        <p className="text-[#091b6f] font-extrabold text-lg">₱ {earningsToday.toLocaleString()}</p>
                      </div>

                      {/* Weekly Earnings */}
                      <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
                        <div>
                          <p className="text-slate-600 text-sm font-semibold">Weekly Earnings</p>
                          <p className="text-[10px] text-slate-400 font-bold">Target: ₱18,200</p>
                        </div>
                        <p className="text-[#091b6f] font-extrabold text-lg">₱ {earningsWeekly.toLocaleString()}</p>
                      </div>

                      {/* Monthly Earnings */}
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <p className="text-slate-600 text-sm font-semibold">Monthly Earnings</p>
                          <p className="text-[10px] text-slate-400 font-bold">Target: ₱72,500</p>
                        </div>
                        <button
                          onClick={() => setActiveTab("earnings")}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm hover:shadow transition-all"
                        >
                          View Earnings
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* Active Tab: Create Driver Account */}
          {activeTab === "create-driver" && (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-[#091b6f] font-bold text-xl mb-1">Create Driver Account</h2>
              <p className="text-slate-400 text-xs font-semibold mb-6">Register a new tricycle driver in the TodaGo ride-hailing database.</p>
              
              <form onSubmit={handleAddDriver} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">First Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Juan"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="border border-slate-200 rounded-lg px-3.5 py-2 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Last Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dela Cruz"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="border border-slate-200 rounded-lg px-3.5 py-2 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 09123456789"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="border border-slate-200 rounded-lg px-3.5 py-2 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Driver License Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. N01-23-456789"
                      value={formData.license}
                      onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))}
                      className="border border-slate-200 rounded-lg px-3.5 py-2 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tricycle Body Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. T-1042"
                      value={formData.bodyNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, bodyNumber: e.target.value }))}
                      className="border border-slate-200 rounded-lg px-3.5 py-2 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">TODA Association</label>
                    <select
                      value={formData.toda}
                      onChange={(e) => setFormData(prev => ({ ...prev, toda: e.target.value }))}
                      className="border border-slate-200 rounded-lg px-3.5 py-2 text-sm font-semibold bg-white outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                    >
                      <option value="Baguio TODA">Baguio TODA</option>
                      <option value="CHOT-TODA">CHOT-TODA</option>
                      <option value="LHITC-TODA">LHITC-TODA</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Initial Status</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === "Active"}
                        onChange={() => setFormData(prev => ({ ...prev, status: "Active" }))}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      Active
                    </label>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === "Inactive"}
                        onChange={() => setFormData(prev => ({ ...prev, status: "Inactive" }))}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      Inactive
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab("dashboard")}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg font-bold text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-bold text-sm shadow-md transition-all hover:scale-[1.01]"
                  >
                    Register Driver
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Active Tab: Ride Requests */}
          {activeTab === "ride-requests" && (
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-[#091b6f] font-bold text-xl mb-1">Ride Requests</h2>
                  <p className="text-slate-400 text-xs font-semibold">Monitor and dispatch active TodaGo ride bookings.</p>
                </div>
                <button
                  onClick={() => setShowAddRequestModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm px-4 py-2 rounded-xl shadow-sm transition-all"
                >
                  + Create Request
                </button>
              </div>

              {/* Search & Status Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div className="w-full sm:w-80 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search passenger, driver, market..."
                    value={requestSearch}
                    onChange={(e) => setRequestSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold outline-hidden focus:border-blue-500 transition-all"
                  />
                </div>
                
                <div className="flex items-center gap-2 self-start sm:self-auto ml-auto">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status:</span>
                  <div className="flex bg-slate-100 p-0.5 rounded-lg">
                    {["All", "Completed", "Ongoing", "Waiting"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                          statusFilter === st
                            ? "bg-white text-[#091b6f] shadow-xs"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="pb-3 pl-3">ID</th>
                      <th className="pb-3">Passenger</th>
                      <th className="pb-3">Assigned Driver</th>
                      <th className="pb-3">Destination</th>
                      <th className="pb-3">Fare</th>
                      <th className="pb-3">Booking Time</th>
                      <th className="pb-3 text-right pr-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-semibold divide-y divide-slate-50">
                    {filteredRequests.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 pl-3 text-slate-400">#{r.id.toString().slice(-4)}</td>
                        <td className="py-4 text-slate-700">{r.passenger}</td>
                        <td className="py-4 text-slate-600">{r.driver}</td>
                        <td className="py-4 text-slate-500">{r.location}</td>
                        <td className="py-4 text-slate-700 font-bold">₱{r.fare}</td>
                        <td className="py-4 text-slate-400">{r.time}</td>
                        <td className="py-4 text-right pr-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === "Completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                            r.status === "Ongoing" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                            "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredRequests.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                          No requests found matching your query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Active Tab: Earnings */}
          {activeTab === "earnings" && (
            <div className="max-w-5xl mx-auto flex flex-col gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-[#091b6f] font-bold text-xl mb-1">Financial Report</h2>
                <p className="text-slate-400 text-xs font-semibold mb-6">Detailed analysis of ride fares and driver commission margins.</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Current Period Earnings</p>
                    <p className="text-3xl font-extrabold text-[#091b6f] mt-1">₱ {earningsToday.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="18 15 12 9 6 15" /></svg>
                      <span>12.4% vs Yesterday</span>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Weekly Projected commission</p>
                    <p className="text-3xl font-extrabold text-emerald-950 mt-1">₱ {(earningsWeekly * 0.15).toFixed(0)}</p>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-2">
                      <span>15% TODA Platform Fee</span>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100/50">
                    <p className="text-xs text-purple-600 font-bold uppercase tracking-wider">Total Monthly Volume</p>
                    <p className="text-3xl font-extrabold text-purple-950 mt-1">₱ {earningsMonthly.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-[11px] text-indigo-600 font-bold mt-2">
                      <span>Target: ₱72,500</span>
                    </div>
                  </div>
                </div>

                {/* TODA earnings split */}
                <h3 className="text-[#091b6f] font-bold text-sm uppercase tracking-wider mb-4">Earnings Contribution by TODA</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Baguio TODA */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-700 text-sm">Baguio TODA</p>
                      <p className="text-xs text-slate-400 font-bold mt-0.5">38% contribution</p>
                    </div>
                    <span className="text-[#091b6f] font-extrabold">₱ {(earningsToday * 0.38).toFixed(0)}</span>
                  </div>

                  {/* CHOT-TODA */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-700 text-sm">CHOT-TODA</p>
                      <p className="text-xs text-slate-400 font-bold mt-0.5">32% contribution</p>
                    </div>
                    <span className="text-[#091b6f] font-extrabold">₱ {(earningsToday * 0.32).toFixed(0)}</span>
                  </div>

                  {/* LHITC-TODA */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-700 text-sm">LHITC-TODA</p>
                      <p className="text-xs text-slate-400 font-bold mt-0.5">30% contribution</p>
                    </div>
                    <span className="text-[#091b6f] font-extrabold">₱ {(earningsToday * 0.30).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Tab: Users Management */}
          {activeTab === "users" && (
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-[#091b6f] font-bold text-xl mb-1">Drivers & Users Registry</h2>
                  <p className="text-slate-400 text-xs font-semibold">Perform operator audits and modify account permissions.</p>
                </div>
                <button
                  onClick={() => setShowAddDriverModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm px-4 py-2 rounded-xl shadow-sm transition-all"
                >
                  + Add Driver Account
                </button>
              </div>

              {/* Search Registry */}
              <div className="w-full sm:w-80 relative mb-6">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                </span>
                <input
                  type="text"
                  placeholder="Search driver by name, TODA, body..."
                  value={driverSearch}
                  onChange={(e) => setDriverSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold outline-hidden focus:border-blue-500 transition-all"
                />
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <th className="pb-3 pl-3">Driver Profile</th>
                      <th className="pb-3">TODA Association</th>
                      <th className="pb-3">License Number</th>
                      <th className="pb-3">Phone</th>
                      <th className="pb-3">Registration Date</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right pr-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-semibold divide-y divide-slate-50">
                    {filteredDrivers.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 pl-3">
                          <p className="text-slate-700">{d.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">Body: {d.bodyNumber}</p>
                        </td>
                        <td className="py-4 text-slate-600">{d.toda}</td>
                        <td className="py-4 text-slate-500 font-mono text-xs">{d.license}</td>
                        <td className="py-4 text-slate-500">{d.phone}</td>
                        <td className="py-4 text-slate-400">{d.joinedDate}</td>
                        <td className="py-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            d.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="py-4 text-right pr-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingDriver(d);
                                setEditFormData({
                                  name: d.name,
                                  phone: d.phone,
                                  license: d.license,
                                  bodyNumber: d.bodyNumber,
                                  toda: d.toda,
                                  status: d.status
                                });
                                setShowEditDriverModal(true);
                              }}
                              className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold hover:bg-blue-100 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeactivateToggle(d.id)}
                              className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                                d.status === "Active"
                                  ? "text-rose-500 bg-rose-50 hover:bg-rose-100"
                                  : "text-emerald-500 bg-emerald-50 hover:bg-emerald-100"
                              }`}
                            >
                              {d.status === "Active" ? "Deactivate" : "Activate"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredDrivers.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                          No drivers registered matching your search query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL 1: ADD DRIVER (DRAWER STYLE) */}
      {showAddDriverModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#0b1b6e] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-lg">Add Driver Account</h3>
              <button
                onClick={() => setShowAddDriverModal(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleAddDriver} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mario"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Reyes"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="09123456789"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">License Number</label>
                  <input
                    type="text"
                    required
                    placeholder="N01-XX-XXXXXX"
                    value={formData.license}
                    onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Body Number</label>
                  <input
                    type="text"
                    required
                    placeholder="T-XXXX"
                    value={formData.bodyNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, bodyNumber: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">TODA</label>
                  <select
                    value={formData.toda}
                    onChange={(e) => setFormData(prev => ({ ...prev, toda: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold bg-white outline-hidden focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="Baguio TODA">Baguio TODA</option>
                    <option value="CHOT-TODA">CHOT-TODA</option>
                    <option value="LHITC-TODA">LHITC-TODA</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDriverModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-bold text-sm shadow-md transition-all hover:scale-[1.01]"
                >
                  Add Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT DRIVER */}
      {showEditDriverModal && editingDriver && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#0b1b6e] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-lg">Edit Driver Account</h3>
              <button
                onClick={() => { setShowEditDriverModal(false); setEditingDriver(null); }}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleEditDriver} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Driver Full Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Phone</label>
                  <input
                    type="tel"
                    required
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">License Number</label>
                  <input
                    type="text"
                    required
                    value={editFormData.license}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, license: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Body Number</label>
                  <input
                    type="text"
                    required
                    value={editFormData.bodyNumber}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, bodyNumber: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">TODA</label>
                  <select
                    value={editFormData.toda}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, toda: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold bg-white outline-hidden focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="Baguio TODA">Baguio TODA</option>
                    <option value="CHOT-TODA">CHOT-TODA</option>
                    <option value="LHITC-TODA">LHITC-TODA</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Account Status</label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value as "Active" | "Inactive" }))}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold bg-white outline-hidden focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setShowEditDriverModal(false); setEditingDriver(null); }}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-bold text-sm shadow-md transition-all hover:scale-[1.01]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SIMULATE/CREATE RIDE REQUEST */}
      {showAddRequestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#0b1b6e] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-lg">New Ride Request</h3>
              <button
                onClick={() => setShowAddRequestModal(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleAddRequest} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Passenger Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Cruz"
                  value={newRequestData.passenger}
                  onChange={(e) => setNewRequestData(prev => ({ ...prev, passenger: e.target.value }))}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Destination / Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Session Road"
                  value={newRequestData.location}
                  onChange={(e) => setNewRequestData(prev => ({ ...prev, location: e.target.value }))}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fare (₱)</label>
                  <input
                    type="number"
                    required
                    placeholder="80"
                    value={newRequestData.fare}
                    onChange={(e) => setNewRequestData(prev => ({ ...prev, fare: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Assign Driver</label>
                  <select
                    value={newRequestData.driverId}
                    onChange={(e) => setNewRequestData(prev => ({ ...prev, driverId: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold bg-white outline-hidden focus:border-blue-500 transition-all cursor-pointer"
                  >
                    <option value="">Select Active Driver</option>
                    {drivers.filter(d => d.status === "Active").map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.toda})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Initial Booking Status</label>
                <select
                  value={newRequestData.status}
                  onChange={(e) => setNewRequestData(prev => ({ ...prev, status: e.target.value as "Completed" | "Ongoing" | "Waiting" }))}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold bg-white outline-hidden focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="Waiting">Waiting</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRequestModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-bold text-sm shadow-md transition-all hover:scale-[1.01]"
                >
                  Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
