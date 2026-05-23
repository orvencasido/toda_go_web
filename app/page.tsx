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
  email: string;
  plateNumber: string;
  licenseImageName?: string;
}

interface Passenger {
  id: number;
  name: string;
  contact: string;
  canceledTrips: number;
  status: "Active" | "Inactive";
  joinedDate: string;
  ridesTaken: number;
}

interface RideRequest {
  id: number;
  passenger: string;
  driver: string;
  location: string; // Pickup location
  destination: string; // Destination location
  status: "Pending" | "In Transit" | "Scheduled" | "Completed" | "Cancelled";
  fare: number;
  time: string;
  toda: string;
}

interface EarningsRecord {
  id: number;
  date: string;
  toda: string;
  completedRides: number;
  totalEarnings: number;
  commissionEarned: number;
  driverName?: string;
}

export default function Home() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<"dashboard" | "ride-requests" | "earnings" | "users" | "profile">("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [usersSidebarExpanded, setUsersSidebarExpanded] = useState(true);

  // Admin Profile State
  const [adminProfile, setAdminProfile] = useState({
    name: "Alexa Cuarto",
    email: "admin@alexa.com",
    status: "Active",
    password: "•••••••••",
    avatarSeed: "alexa"
  });

  // Drivers List (Mock data to support 5 pages of pagination)
  const [drivers, setDrivers] = useState<Driver[]>([
    { id: 1, name: "Joross Pogi", toda: "BYPASS ILAYANG BAGUIO-TODA", status: "Active", phone: "09123456789", license: "ABC123456", bodyNumber: "T-1042", trips: 45, joinedDate: "2026-01-12", email: "joross@gmail.com", plateNumber: "ABC-1234" },
    { id: 2, name: "Mark Reyes", toda: "CHOT-TODA", status: "Active", phone: "09187654321", license: "XYZ678910", bodyNumber: "T-2091", trips: 32, joinedDate: "2026-02-20", email: "mark@gmail.com", plateNumber: "XYZ-5678" },
    { id: 3, name: "Leo Mendoza", toda: "LHITC-TODA", status: "Inactive", phone: "09223334444", license: "GHL345678", bodyNumber: "T-0582", trips: 28, joinedDate: "2026-03-05", email: "leo@gmail.com", plateNumber: "GHL-9012" },
    { id: 4, name: "Ricky Cruz", toda: "LHITC-TODA", status: "Active", phone: "09456789012", license: "NMO567890", bodyNumber: "T-0912", trips: 14, joinedDate: "2026-03-18", email: "ricky@gmail.com", plateNumber: "NMO-3456" },
    { id: 5, name: "Ernie Dela Cruz", toda: "CHOT-TODA", status: "Active", phone: "09998887777", license: "JKL255689", bodyNumber: "T-1152", trips: 60, joinedDate: "2026-01-05", email: "ernie@gmail.com", plateNumber: "JKL-7890" },
    { id: 6, name: "Pedro Santos", toda: "CHOT-TODA", status: "Active", phone: "09172223333", license: "PD-998877", bodyNumber: "T-3021", trips: 22, joinedDate: "2026-03-10", email: "pedro@gmail.com", plateNumber: "PDR-1212" },
    { id: 7, name: "Mario Reyes", toda: "LHITC-TODA", status: "Active", phone: "09154445555", license: "MR-887766", bodyNumber: "T-4011", trips: 52, joinedDate: "2026-01-20", email: "mario@gmail.com", plateNumber: "MRO-2323" },
    { id: 8, name: "Juan Cruz", toda: "BYPASS ILAYANG BAGUIO-TODA", status: "Active", phone: "09165556666", license: "JC-776655", bodyNumber: "T-5011", trips: 18, joinedDate: "2026-04-01", email: "juan.cruz@gmail.com", plateNumber: "JUA-3434" },
    { id: 9, name: "Thomas Dizon", toda: "BYPASS ILAYANG BAGUIO-TODA", status: "Active", phone: "09181112222", license: "TD-665544", bodyNumber: "T-6011", trips: 35, joinedDate: "2026-02-15", email: "thomas@gmail.com", plateNumber: "THM-4545" },
    { id: 10, name: "Roberto Bautista", toda: "BYPASS ILAYANG BAGUIO-TODA", status: "Active", phone: "09192223333", license: "RB-554433", bodyNumber: "T-7011", trips: 41, joinedDate: "2026-02-28", email: "roberto@gmail.com", plateNumber: "RBT-5656" },
    { id: 11, name: "Joross Buera", toda: "BYPASS ILAYANG BAGUIO-TODA", status: "Active", phone: "09203334444", license: "JB-443322", bodyNumber: "T-8011", trips: 29, joinedDate: "2026-03-01", email: "buera@gmail.com", plateNumber: "JRS-6767" },
    { id: 12, name: "Alliah Adamos", toda: "CHOT-TODA", status: "Active", phone: "09214445555", license: "AA-332211", bodyNumber: "T-9011", trips: 12, joinedDate: "2026-04-10", email: "alliah@gmail.com", plateNumber: "ALH-7878" },
    { id: 13, name: "Manuel Roxas", toda: "BYPASS ILAYANG BAGUIO-TODA", status: "Inactive", phone: "09456789011", license: "N04-56-789012", bodyNumber: "T-0912", trips: 14, joinedDate: "2026-03-18", email: "manuel@gmail.com", plateNumber: "MNL-1010" },
    { id: 14, name: "Jose Rizal", toda: "LHITC-TODA", status: "Active", phone: "09998887771", license: "N05-88-990011", bodyNumber: "T-1152", trips: 60, joinedDate: "2026-01-05", email: "rizal@gmail.com", plateNumber: "JSE-1111" },
    { id: 15, name: "Benigno Aquino", toda: "LHITC-TODA", status: "Active", phone: "09228889999", license: "BA-221100", bodyNumber: "T-1250", trips: 7, joinedDate: "2026-04-20", email: "benigno@gmail.com", plateNumber: "BEN-2222" },
    { id: 16, name: "Ramon Magsaysay", toda: "CHOT-TODA", status: "Active", phone: "09239990000", license: "RM-110099", bodyNumber: "T-1350", trips: 92, joinedDate: "2025-12-01", email: "ramon@gmail.com", plateNumber: "RMN-3333" },
    { id: 17, name: "Carlos Garcia", toda: "BYPASS ILAYANG BAGUIO-TODA", status: "Active", phone: "09240001111", license: "CG-009988", bodyNumber: "T-1450", trips: 44, joinedDate: "2026-01-15", email: "carlos@gmail.com", plateNumber: "CRL-4444" },
    { id: 18, name: "Diosdado Macapagal", toda: "LHITC-TODA", status: "Inactive", phone: "09251112222", license: "DM-998877", bodyNumber: "T-1550", trips: 3, joinedDate: "2026-05-01", email: "diosdado@gmail.com", plateNumber: "DSD-5555" },
    { id: 19, name: "Fidel Ramos", toda: "CHOT-TODA", status: "Active", phone: "09262223333", license: "FR-887766", bodyNumber: "T-1650", trips: 110, joinedDate: "2025-10-10", email: "fidel@gmail.com", plateNumber: "FDL-6666" },
    { id: 20, name: "Joseph Estrada", toda: "BYPASS ILAYANG BAGUIO-TODA", status: "Active", phone: "09273334444", license: "JE-776655", bodyNumber: "T-1750", trips: 85, joinedDate: "2025-11-20", email: "joseph@gmail.com", plateNumber: "JSP-7777" }
  ]);

  // Passengers List
  const [passengers, setPassengers] = useState<Passenger[]>([
    { id: 1, name: "Ana Garcia", contact: "09123456789", canceledTrips: 0, status: "Active", joinedDate: "2026-01-15", ridesTaken: 24 },
    { id: 2, name: "Alexa Cuarto", contact: "09987654321", canceledTrips: 1, status: "Active", joinedDate: "2026-02-10", ridesTaken: 15 },
    { id: 3, name: "Alliah Adanos", contact: "09134679852", canceledTrips: 3, status: "Inactive", joinedDate: "2026-03-01", ridesTaken: 42 },
    { id: 4, name: "Elmer Ramos", contact: "09784510235", canceledTrips: 2, status: "Active", joinedDate: "2026-03-12", ridesTaken: 9 },
    { id: 5, name: "Michelle Cruz", contact: "09090319579", canceledTrips: 0, status: "Active", joinedDate: "2026-01-05", ridesTaken: 55 },
    { id: 6, name: "Carlo Diaz", contact: "09281112222", canceledTrips: 0, status: "Active", joinedDate: "2026-02-18", ridesTaken: 18 },
    { id: 7, name: "Maria Cruz", contact: "09292223333", canceledTrips: 3, status: "Inactive", joinedDate: "2026-01-20", ridesTaken: 30 },
    { id: 8, name: "Ana Reyes", contact: "09303334444", canceledTrips: 0, status: "Active", joinedDate: "2026-02-22", ridesTaken: 12 },
    { id: 9, name: "James Ignaco", contact: "09314445555", canceledTrips: 1, status: "Active", joinedDate: "2026-03-05", ridesTaken: 8 },
    { id: 10, name: "John Santos", contact: "09325556666", canceledTrips: 3, status: "Inactive", joinedDate: "2026-02-05", ridesTaken: 21 },
    { id: 11, name: "Patrick Sision", contact: "09336667777", canceledTrips: 0, status: "Active", joinedDate: "2026-03-20", ridesTaken: 16 },
    { id: 12, name: "Andy Lim", contact: "09347778888", canceledTrips: 2, status: "Active", joinedDate: "2026-04-02", ridesTaken: 5 },
    { id: 13, name: "Joseph Villadiego", contact: "09358889999", canceledTrips: 0, status: "Active", joinedDate: "2026-04-12", ridesTaken: 11 },
    { id: 14, name: "Ramon Fileca", contact: "09369990000", canceledTrips: 1, status: "Active", joinedDate: "2026-04-18", ridesTaken: 14 },
    { id: 15, name: "Clara Cruz", contact: "09370001111", canceledTrips: 0, status: "Active", joinedDate: "2026-05-01", ridesTaken: 2 }
  ]);

  // Expanded Ride Requests (15 ongoing requests to show pagination Page 1 and Page 2)
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([
    { id: 1, passenger: "Maria Cruz", driver: "-", location: "Tayabas Market", destination: "Brgy. Baguio", status: "Pending", fare: 80, time: "8:45 AM", toda: "-" },
    { id: 2, passenger: "Carlo Diaz", driver: "Pedro Santos", location: "Minor Basilica", destination: "Tayabas Market", status: "In Transit", fare: 120, time: "11:15 AM", toda: "CHOT-TODA" },
    { id: 3, passenger: "Ana Reyes", driver: "Mario Reyes", location: "Primark", destination: "Mateuna Sub.", status: "In Transit", fare: 65, time: "1:30 PM", toda: "LHITC-TODA" },
    { id: 4, passenger: "James Ignaco", driver: "Thomas Dizon", location: "SLSU", destination: "Luis Palad", status: "Pending", fare: 90, time: "1:45 PM", toda: "BYPASS ILAYANG BAGUIO-TODA" },
    { id: 5, passenger: "John Santos", driver: "Pedro Santos", location: "Minor Basilica", destination: "Tayabas Market", status: "Pending", fare: 75, time: "2:00 PM", toda: "CHOT-TODA" },
    { id: 6, passenger: "Patrick Sision", driver: "Roberto Bautista", location: "Brgy. Lalo", destination: "Ibaba Palale", status: "In Transit", fare: 110, time: "2:15 PM", toda: "BYPASS ILAYANG BAGUIO-TODA" },
    { id: 7, passenger: "Andy Lim", driver: "-", location: "Sitio Babaysin", destination: "Lakawan", status: "Pending", fare: 85, time: "2:30 PM", toda: "-" },
    { id: 8, passenger: "Joseph Villadiego", driver: "Alliah Adamos", location: "Mt. Carmel", destination: "Alsam", status: "In Transit", fare: 95, time: "2:45 PM", toda: "CHOT-TODA" },
    { id: 9, passenger: "Ramon Fileca", driver: "Joross Buera", location: "Brgy. Silangan", destination: "Tayabas Market", status: "In Transit", fare: 130, time: "3:00 PM", toda: "BYPASS ILAYANG BAGUIO-TODA" },
    { id: 10, passenger: "Ben Santos", driver: "Mario Reyes", location: "SLSU", destination: "Brgy. Baguio", status: "In Transit", fare: 70, time: "3:15 PM", toda: "LHITC-TODA" },
    { id: 11, passenger: "Clara Cruz", driver: "Joross Buera", location: "Tayabas Market", destination: "Minor Basilica", status: "Pending", fare: 60, time: "3:30 PM", toda: "BYPASS ILAYANG BAGUIO-TODA" },
    { id: 12, passenger: "Danilo Lopez", driver: "Pedro Santos", location: "Plaza Mayor", destination: "Sitio Babaysin", status: "In Transit", fare: 115, time: "3:45 PM", toda: "CHOT-TODA" },
    { id: 13, passenger: "Elena Torres", driver: "Thomas Dizon", location: "Mateuna Sub.", destination: "Primark", status: "Pending", fare: 80, time: "4:00 PM", toda: "BYPASS ILAYANG BAGUIO-TODA" },
    { id: 14, passenger: "Felix Garcia", driver: "Alliah Adamos", location: "Alsam", destination: "Mt. Carmel", status: "In Transit", fare: 90, time: "4:15 PM", toda: "CHOT-TODA" },
    { id: 15, passenger: "Gardo Dimaano", driver: "-", location: "Lakawan", destination: "Brgy. Silangan", status: "Pending", fare: 100, time: "4:30 PM", toda: "-" },

    // Scheduled Requests
    { id: 16, passenger: "Hannah Perez", driver: "Ricky Cruz", location: "Grand Terminal", destination: "SLSU", status: "Scheduled", fare: 150, time: "Tomorrow 7:00 AM", toda: "LHITC-TODA" },
    { id: 17, passenger: "Ian Romero", driver: "Ernie Dela Cruz", location: "City Hall", destination: "Tayabas Market", status: "Scheduled", fare: 80, time: "Tomorrow 9:00 AM", toda: "CHOT-TODA" },

    // Completed Requests
    { id: 18, passenger: "Michelle Cruz", driver: "Jose Rizal", location: "Tayabas Market", destination: "Lucena", status: "Completed", fare: 250, time: "May 23, 10:15 AM", toda: "LHITC-TODA" },
    { id: 19, passenger: "Elmer Ramos", driver: "Juan Cruz", location: "SLSU", destination: "Brgy. Baguio", status: "Completed", fare: 75, time: "May 23, 11:30 AM", toda: "BYPASS ILAYANG BAGUIO-TODA" },
    { id: 20, passenger: "Katelyn Co", driver: "Mark Reyes", location: "Minor Basilica", destination: "Grand Terminal", status: "Completed", fare: 140, time: "May 23, 1:00 PM", toda: "CHOT-TODA" },

    // Cancelled Requests
    { id: 21, passenger: "Alliah Adanos", driver: "-", location: "Mateuna Sub.", destination: "SLSU", status: "Cancelled", fare: 80, time: "May 22, 2:15 PM", toda: "CHOT-TODA" },
    { id: 22, passenger: "John Santos", driver: "-", location: "City Hall", destination: "Alsam", status: "Cancelled", fare: 95, time: "May 22, 4:00 PM", toda: "CHOT-TODA" }
  ]);

  // Financial Earnings Data
  const [earningsRecords, setEarningsRecords] = useState<EarningsRecord[]>([
    { id: 1, date: "April 8, 2026", toda: "LHITC-TODA", completedRides: 22, totalEarnings: 1340, commissionEarned: 280, driverName: "Mario Reyes" },
    { id: 2, date: "April 7, 2026", toda: "CHOT-TODA", completedRides: 26, totalEarnings: 1120, commissionEarned: 224, driverName: "Pedro Santos" },
    { id: 3, date: "April 7, 2026", toda: "BYPASS ILAYANG BAGUIO-TODA", completedRides: 22, totalEarnings: 880, commissionEarned: 176, driverName: "Juan Cruz" },
    { id: 4, date: "April 7, 2026", toda: "LHITC-TODA", completedRides: 35, totalEarnings: 1400, commissionEarned: 280, driverName: "Jose Rizal" },
    { id: 5, date: "April 6, 2026", toda: "CHOT-TODA", completedRides: 27, totalEarnings: 1080, commissionEarned: 216, driverName: "Ernie Dela Cruz" },
    { id: 6, date: "April 6, 2026", toda: "LHITC-TODA", completedRides: 25, totalEarnings: 1000, commissionEarned: 200, driverName: "Ricky Cruz" },
    { id: 7, date: "April 3, 2026", toda: "LHITC-TODA", completedRides: 30, totalEarnings: 1200, commissionEarned: 240, driverName: "Mario Reyes" },
    { id: 8, date: "April 2, 2026", toda: "BYPASS ILAYANG BAGUIO-TODA", completedRides: 25, totalEarnings: 1240, commissionEarned: 248, driverName: "Thomas Dizon" },
    { id: 9, date: "April 1, 2026", toda: "BYPASS ILAYANG BAGUIO-TODA", completedRides: 31, totalEarnings: 957, commissionEarned: 158, driverName: "Roberto Bautista" },
    { id: 10, date: "March 31, 2026", toda: "CHOT-TODA", completedRides: 20, totalEarnings: 980, commissionEarned: 196, driverName: "Mark Reyes" },
    { id: 11, date: "March 30, 2026", toda: "LHITC-TODA", completedRides: 18, totalEarnings: 850, commissionEarned: 170, driverName: "Jose Rizal" },
    { id: 12, date: "March 29, 2026", toda: "BYPASS ILAYANG BAGUIO-TODA", completedRides: 15, totalEarnings: 720, commissionEarned: 144, driverName: "Joross Buera" }
  ]);

  // Statistics State (Derived and Dynamic)
  const totalDriversCount = drivers.length;
  const activeDriversCount = drivers.filter(d => d.status === "Active").length;
  const usersCount = passengers.length + drivers.length;
  const tripsCount = rideRequests.length + 206; // actual + default baseline

  // Form & Modals States
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showEditDriverModal, setShowEditDriverModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  // New Driver Form (Image 1 fields)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    plateNumber: "",
    toda: "LHITC-TODA",
    status: "Active" as "Active" | "Inactive",
    licenseImage: null as File | null,
    licenseImageName: ""
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    license: "",
    bodyNumber: "",
    toda: "",
    status: "Active" as "Active" | "Inactive",
    email: "",
    plateNumber: ""
  });

  // Ride Request Creator state
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);
  const [newRequestData, setNewRequestData] = useState({
    passenger: "",
    driverId: "",
    location: "",
    destination: "",
    status: "Pending" as "Pending" | "In Transit" | "Scheduled" | "Completed" | "Cancelled",
    fare: ""
  });

  // Ride Request details modal state
  const [showViewRequestModal, setShowViewRequestModal] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<RideRequest | null>(null);

  // Earnings details modal state
  const [showViewEarningsModal, setShowViewEarningsModal] = useState(false);
  const [viewingEarningsRecord, setViewingEarningsRecord] = useState<EarningsRecord | null>(null);

  // User detail modal state (Drivers & Passengers)
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [viewingUserType, setViewingUserType] = useState<"driver" | "passenger" | null>(null);
  const [viewingUser, setViewingUser] = useState<Driver | Passenger | null>(null);

  // Search & Filters state
  const [driverSearch, setDriverSearch] = useState("");
  const [requestSearch, setRequestSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Ongoing"); // Defaults to Ongoing as per screenshot!

  // Filters for Ride Requests
  const [requestTodaFilter, setRequestTodaFilter] = useState("All");

  // Filters for Earnings
  const [earningsTodaFilter, setEarningsTodaFilter] = useState("All");
  const [earningsDriverFilter, setEarningsDriverFilter] = useState("All");
  const [earningsDateRange, setEarningsDateRange] = useState("April 1, 2024- April 30, 2026");

  // Filters for Users Management
  const [userSearch, setUserSearch] = useState("");
  const [userTodaFilter, setUserTodaFilter] = useState("All");
  const [userStatusFilter, setUserStatusFilter] = useState("All");
  const [usersSubTab, setUsersSubTab] = useState<"all" | "drivers" | "passengers">("all");

  // Pagination states
  const [requestsPage, setRequestsPage] = useState(1);
  const [driversPage, setDriversPage] = useState(1);
  const [passengersPage, setPassengersPage] = useState(1);
  const [earningsPage, setEarningsPage] = useState(1);

  const itemsPerPage = 5; // To fit table sizes perfectly and match "Page 1 of X" pagination!

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
      .reduce((sum, r) => sum + r.fare, 50000); // Base baseline
  }, [rideRequests]);

  const earningsWeekly = useMemo(() => {
    return 18200 + (earningsToday - 50000);
  }, [earningsToday]);

  const earningsMonthly = useMemo(() => {
    return 72500 + (earningsToday - 50000);
  }, [earningsToday]);

  // Form Handlers
  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.password || !formData.plateNumber) {
      alert("Please fill in all fields.");
      return;
    }
    const newDriver: Driver = {
      id: Date.now(),
      name: formData.name,
      toda: formData.toda,
      status: formData.status,
      phone: formData.phone,
      license: "LIC-" + Math.floor(100000 + Math.random() * 900000),
      bodyNumber: "T-" + Math.floor(1000 + Math.random() * 9000),
      trips: 0,
      joinedDate: new Date().toISOString().split("T")[0],
      email: formData.email,
      plateNumber: formData.plateNumber,
      licenseImageName: formData.licenseImageName || "driver_license.pdf"
    };
    setDrivers(prev => [newDriver, ...prev]);

    // Reset Form
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      plateNumber: "",
      toda: "LHITC-TODA",
      status: "Active",
      licenseImage: null,
      licenseImageName: ""
    });
    setShowAddDriverModal(false);

    // Notify Success
    alert(`Driver account created for ${newDriver.name}!`);
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
            status: editFormData.status,
            email: editFormData.email,
            plateNumber: editFormData.plateNumber
          }
          : d
      )
    );
    setShowEditDriverModal(false);
    setEditingDriver(null);
  };

  const handleDeactivateToggle = (id: number) => {
    setDrivers(prev =>
      prev.map(d => {
        if (d.id === id) {
          const nextStatus = d.status === "Active" ? "Inactive" : "Active";
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );
    // Sync view modal if active
    if (viewingUser && viewingUser.id === id && viewingUserType === "driver") {
      setViewingUser(prev => prev ? { ...prev, status: prev.status === "Active" ? "Inactive" : "Active" } : null);
    }
  };

  const handleDeactivatePassengerToggle = (id: number) => {
    setPassengers(prev =>
      prev.map(p => {
        if (p.id === id) {
          // If passenger has 3 canceled trips, prevent reactivating
          if (p.canceledTrips >= 3 && p.status === "Inactive") {
            alert("Cannot reactivate passenger! Canceled trips limit (3) exceeded.");
            return p;
          }
          const nextStatus = p.status === "Active" ? "Inactive" : "Active";
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
    // Sync view modal if active
    if (viewingUser && viewingUser.id === id && viewingUserType === "passenger") {
      setViewingUser(prev => {
        if (!prev) return null;
        if ((prev as Passenger).canceledTrips >= 3 && prev.status === "Inactive") return prev;
        return { ...prev, status: prev.status === "Active" ? "Inactive" : "Active" };
      });
    }
  };

  const handleIncrementCanceledTrips = (id: number) => {
    setPassengers(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextCanceled = p.canceledTrips + 1;
          const nextStatus = nextCanceled >= 3 ? "Inactive" : p.status;
          if (nextCanceled >= 3) {
            alert(`Passenger ${p.name} has reached 3 canceled trips and is now automatically deactivated!`);
          }
          return { ...p, canceledTrips: nextCanceled, status: nextStatus };
        }
        return p;
      })
    );
    // Sync view modal if active
    if (viewingUser && viewingUser.id === id && viewingUserType === "passenger") {
      setViewingUser(prev => {
        if (!prev) return null;
        const p = prev as Passenger;
        const nextCanceled = p.canceledTrips + 1;
        const nextStatus = nextCanceled >= 3 ? "Inactive" : p.status;
        return { ...p, canceledTrips: nextCanceled, status: nextStatus };
      });
    }
  };

  const handleResetCanceledTrips = (id: number) => {
    setPassengers(prev =>
      prev.map(p => {
        if (p.id === id) {
          return { ...p, canceledTrips: 0, status: "Active" };
        }
        return p;
      })
    );
    if (viewingUser && viewingUser.id === id && viewingUserType === "passenger") {
      setViewingUser(prev => {
        if (!prev) return null;
        const p = prev as Passenger;
        return { ...p, canceledTrips: 0, status: "Active" };
      });
    }
  };

  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestData.passenger || !newRequestData.location || !newRequestData.destination || !newRequestData.fare) {
      alert("Please fill in all fields.");
      return;
    }
    const assignedDriver = drivers.find(d => d.id === Number(newRequestData.driverId));
    const assignedDriverName = assignedDriver?.name || "-";
    const assignedDriverToda = assignedDriver?.toda || "-";

    const newReq: RideRequest = {
      id: Date.now(),
      passenger: newRequestData.passenger,
      driver: assignedDriverName,
      location: newRequestData.location,
      destination: newRequestData.destination,
      status: newRequestData.status,
      fare: Number(newRequestData.fare),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      toda: assignedDriverToda
    };
    setRideRequests(prev => [newReq, ...prev]);
    setShowAddRequestModal(false);
    setNewRequestData({
      passenger: "",
      driverId: "",
      location: "",
      destination: "",
      status: "Pending",
      fare: ""
    });
    alert("Ride request dispatched successfully!");
  };

  // Download earnings report
  const handleDownloadReport = () => {
    const headers = "Date,TODA Association,Completed Rides,Total Earnings,Commission Earned,Driver Assigned\n";
    const rows = earningsRecords.map(r =>
      `"${r.date}","${r.toda}",${r.completedRides},${r.totalEarnings},${r.commissionEarned},"${r.driverName || 'N/A'}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `TodaGo_Earnings_Report_${new Date().toISOString().split("T")[0]}.csv`);
    a.click();
    alert("Report download initiated!");
  };

  // Filter lists
  const filteredDrivers = useMemo(() => {
    return drivers.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(driverSearch.toLowerCase()) ||
        d.toda.toLowerCase().includes(driverSearch.toLowerCase()) ||
        d.bodyNumber.toLowerCase().includes(driverSearch.toLowerCase()) ||
        d.license.toLowerCase().includes(driverSearch.toLowerCase());

      const matchToda = userTodaFilter === "All" || d.toda === userTodaFilter;
      const matchStatus = userStatusFilter === "All" || d.status === userStatusFilter;

      return matchSearch && matchToda && matchStatus;
    });
  }, [drivers, driverSearch, userTodaFilter, userStatusFilter]);

  const filteredPassengers = useMemo(() => {
    return passengers.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(driverSearch.toLowerCase()) ||
        p.contact.includes(driverSearch);
      const matchStatus = userStatusFilter === "All" || p.status === userStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [passengers, driverSearch, userStatusFilter]);

  const filteredRequests = useMemo(() => {
    return rideRequests.filter(r => {
      const matchSearch = r.passenger.toLowerCase().includes(requestSearch.toLowerCase()) ||
        r.driver.toLowerCase().includes(requestSearch.toLowerCase()) ||
        r.location.toLowerCase().includes(requestSearch.toLowerCase()) ||
        r.destination.toLowerCase().includes(requestSearch.toLowerCase());

      const matchToda = requestTodaFilter === "All" || r.toda === requestTodaFilter;

      let matchStatus = false;
      if (statusFilter === "Ongoing") {
        matchStatus = r.status === "Pending" || r.status === "In Transit";
      } else {
        matchStatus = r.status === statusFilter;
      }

      return matchSearch && matchStatus && matchToda;
    });
  }, [rideRequests, requestSearch, statusFilter, requestTodaFilter]);

  const filteredEarnings = useMemo(() => {
    return earningsRecords.filter(r => {
      const matchToda = earningsTodaFilter === "All" || r.toda === earningsTodaFilter;
      const matchDriver = earningsDriverFilter === "All" || r.driverName === earningsDriverFilter;
      return matchToda && matchDriver;
    });
  }, [earningsRecords, earningsTodaFilter, earningsDriverFilter]);


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

        <div
          onClick={() => setActiveTab("profile")}
          className="flex items-center gap-3 cursor-pointer group relative"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold tracking-wide">{adminProfile.name}</p>
            <p className="text-[10px] text-sky-200">System Operator</p>
          </div>

          {/* Beautiful Custom Avatar */}
          <div className="relative">
            <svg width="38" height="38" viewBox="0 0 40 40" className="rounded-full shadow-inner border-2 border-sky-300">
              <circle cx="20" cy="20" r="18" fill="#38bdf8" />
              <mask id="mask-avatar" maskUnits="userSpaceOnUse" x="2" y="2" width="36" height="36">
                <circle cx="20" cy="20" r="18" fill="#FFFFFF" />
              </mask>
              <g mask="url(#mask-avatar)">
                <path d="M9 16C9 10 14 8 20 8C26 8 31 10 31 16C31 22 28 24 28 27C28 30 20 31 20 31C20 31 12 30 12 27C12 24 9 22 9 16Z" fill="#1e1b4b" />
                <circle cx="20" cy="19" r="7" fill="#fed7aa" />
                <path d="M14 15C16 13 18 13 20 14C22 13 24 13 26 15C26 15 24 11 20 11C16 11 14 15 14 15Z" fill="#1e1b4b" />
                <path d="M10 36C10 31 14 29 20 29C26 29 30 31 30 36H10Z" fill="#4f46e5" />
                <path d="M20 29V32" stroke="#fed7aa" strokeWidth="2" strokeLinecap="round" />
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
              className={`flex items-center gap-4 px-6 py-3.5 font-bold transition-all text-left border-l-4 ${activeTab === "dashboard"
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
              onClick={() => { setShowAddDriverModal(true); setMobileMenuOpen(false); }}
              className={`flex items-center gap-4 px-6 py-3.5 font-bold transition-all text-left border-l-4 cursor-pointer w-full ${showAddDriverModal
                ? "bg-white text-[#091b6f] border-[#091b6f] shadow-xs"
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
              className={`flex items-center gap-4 px-6 py-3.5 font-bold transition-all text-left border-l-4 cursor-pointer w-full ${activeTab === "ride-requests"
                ? "bg-white text-[#091b6f] border-[#091b6f] shadow-xs"
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
              className={`flex items-center gap-4 px-6 py-3.5 font-bold transition-all text-left border-l-4 cursor-pointer w-full ${activeTab === "earnings"
                ? "bg-white text-[#091b6f] border-[#091b6f] shadow-xs"
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
            <div className="flex flex-col w-full">
              <button
                onClick={() => {
                  setActiveTab("users");
                  setUsersSubTab("all");
                  setUsersSidebarExpanded(!usersSidebarExpanded);
                }}
                className={`flex items-center justify-between px-6 py-3.5 font-bold transition-all text-left border-l-4 cursor-pointer w-full ${activeTab === "users"
                  ? "bg-white text-[#091b6f] border-[#091b6f] shadow-xs"
                  : "text-[#091b6f] border-transparent hover:bg-white/40"
                  }`}
              >
                <div className="flex items-center gap-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>Users Management</span>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`transition-transform duration-200 ${usersSidebarExpanded ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Sub-menu nested items (Image 4 sub-sidebar layout) */}
              {usersSidebarExpanded && (
                <div className="bg-[#b3e2ff]/20 flex flex-col pl-4 border-l border-[#091b6f]/10">
                  {/* Drivers Sub-tab */}
                  <button
                    onClick={() => { setActiveTab("users"); setUsersSubTab("drivers"); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 px-6 py-2.5 text-sm font-semibold transition-all text-left border-l-2 cursor-pointer w-full ${activeTab === "users" && usersSubTab === "drivers"
                      ? "text-[#091b6f] border-[#091b6f] font-bold"
                      : "text-[#091b6f]/70 border-transparent hover:text-[#091b6f] hover:bg-white/20"
                      }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span>Drivers</span>
                  </button>

                  {/* Passengers Sub-tab */}
                  <button
                    onClick={() => { setActiveTab("users"); setUsersSubTab("passengers"); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 px-6 py-2.5 text-sm font-semibold transition-all text-left border-l-2 cursor-pointer w-full ${activeTab === "users" && usersSubTab === "passengers"
                      ? "text-[#091b6f] border-[#091b6f] font-bold"
                      : "text-[#091b6f]/70 border-transparent hover:text-[#091b6f] hover:bg-white/20"
                      }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span>Passengers</span>
                  </button>
                </div>
              )}
            </div>
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
                                className={`transition-all duration-300 ${hoveredBarIndex === i ? "fill-[#2563eb]" : "fill-[#091b6f]"
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
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${r.status === "Completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
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
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${d.status === "Active"
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
            <div className="flex flex-col gap-6 max-w-7xl mx-auto">

              {/* Category Filter Buttons Row (Matches Image 2) */}
              <div className="bg-[#b3e2ff]/30 p-2 rounded-xl flex flex-wrap items-center gap-2 border border-[#b3e2ff]/50">
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  {[
                    { key: "Ongoing", label: "Ongoing (15)" },
                    { key: "Scheduled", label: "Scheduled" },
                    { key: "Completed", label: "Completed" },
                    { key: "Cancelled", label: "Cancelled" }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setStatusFilter(tab.key);
                        setRequestsPage(1);
                      }}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${statusFilter === tab.key
                        ? "bg-[#091b6f] text-white shadow-sm"
                        : "text-slate-600 hover:text-[#091b6f]"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TODA Dropdown Filter */}
                <div className="relative">
                  <select
                    value={requestTodaFilter}
                    onChange={(e) => {
                      setRequestTodaFilter(e.target.value);
                      setRequestsPage(1);
                    }}
                    className="pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#091b6f] cursor-pointer appearance-none outline-hidden focus:border-blue-500"
                  >
                    <option value="All">All TODAs</option>
                    <option value="LHITC-TODA">LHITC-TODA</option>
                    <option value="BYPASS ILAYANG BAGUIO-TODA">BYPASS ILAYANG BAGUIO-TODA</option>
                    <option value="CHOT-TODA">CHOT-TODA</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>
                </div>

                {/* Status / Date Filter */}
                <div className="relative">
                  <select
                    className="pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#091b6f] cursor-pointer appearance-none outline-hidden focus:border-blue-500"
                    defaultValue="all-status"
                  >
                    <option value="all-status">All Status → Apr 2,2026</option>
                    <option value="pending">Pending Only</option>
                    <option value="intransit">In Transit Only</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>
                </div>

                {/* Apply Filter Button */}
                <button
                  onClick={() => setRequestsPage(1)}
                  className="px-4 py-1.5 bg-[#4c75f2] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Apply Filter
                </button>
              </div>

              {/* Main List Container */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-4">

                {/* Section Header with Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔔</span>
                    <h2 className="text-[#091b6f] font-bold text-lg">
                      {statusFilter} Ride Requests ({filteredRequests.length})
                    </h2>
                  </div>

                  {/* Search Input */}
                  <div className="w-full sm:w-64 relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={requestSearch}
                      onChange={(e) => {
                        setRequestSearch(e.target.value);
                        setRequestsPage(1);
                      }}
                      className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold outline-hidden focus:border-[#091b6f] transition-all text-[#091b6f]"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="pb-3 pl-3">Passenger</th>
                        <th className="pb-3">Pickup</th>
                        <th className="pb-3">Destination</th>
                        <th className="pb-3">Driver</th>
                        <th className="pb-3">TODA</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-center pr-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-semibold divide-y divide-slate-50">
                      {filteredRequests
                        .slice((requestsPage - 1) * 9, requestsPage * 9)
                        .map((r) => (
                          <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4.5 pl-3 text-[#091b6f] font-bold">{r.passenger}</td>
                            <td className="py-4.5 text-slate-600">{r.location}</td>
                            <td className="py-4.5 text-slate-500">{r.destination}</td>
                            <td className="py-4.5 text-slate-700">{r.driver}</td>
                            <td className="py-4.5 text-slate-600">{r.toda}</td>
                            <td className="py-4.5">
                              <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold ${r.status === "Completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                r.status === "In Transit" || r.status === "Ongoing" ? "bg-emerald-500 text-white border border-emerald-600" :
                                  r.status === "Pending" ? "bg-amber-100 text-amber-600 border border-amber-200" :
                                    r.status === "Scheduled" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                                      "bg-rose-50 text-rose-600 border border-rose-100"
                                }`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="py-4.5 text-center pr-3">
                              <button
                                onClick={() => {
                                  setViewingRequest(r);
                                  setShowViewRequestModal(true);
                                }}
                                className="px-3.5 py-1 bg-[#4c75f2] hover:bg-blue-600 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
                              >
                                View
                              </button>
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

                {/* Pagination (Matches Image 2 layout) */}
                {filteredRequests.length > 0 && (
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                    <button
                      onClick={() => setRequestsPage(prev => Math.max(prev - 1, 1))}
                      disabled={requestsPage === 1}
                      className="text-xs font-bold text-blue-500 hover:underline disabled:opacity-30 disabled:no-underline cursor-pointer flex items-center gap-1"
                    >
                      &lt;&lt; Previos
                    </button>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-bold">
                        Page {requestsPage} of {Math.ceil(filteredRequests.length / 9)}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setRequestsPage(1)}
                          className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg border ${requestsPage === 1
                            ? "bg-slate-100 border-slate-200 text-[#091b6f]"
                            : "border-slate-200 hover:bg-slate-50 text-[#091b6f] cursor-pointer"
                            }`}
                        >
                          &lt;&lt;
                        </button>

                        {Array.from({ length: Math.ceil(filteredRequests.length / 9) }, (_, i) => i + 1).map((p) => (
                          <button
                            key={p}
                            onClick={() => setRequestsPage(p)}
                            className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg border ${requestsPage === p
                              ? "bg-blue-100 border-blue-200 text-blue-600 font-extrabold"
                              : "border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                              }`}
                          >
                            {p}
                          </button>
                        ))}

                        <button
                          onClick={() => setRequestsPage(prev => Math.min(prev + 1, Math.ceil(filteredRequests.length / 9)))}
                          disabled={requestsPage === Math.ceil(filteredRequests.length / 9)}
                          className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg border ${requestsPage === Math.ceil(filteredRequests.length / 9)
                            ? "opacity-30 border-slate-200 text-slate-400"
                            : "border-slate-200 hover:bg-slate-50 text-[#091b6f] cursor-pointer"
                            }`}
                        >
                          Next &gt;&gt;
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* Active Tab: Earnings */}
          {activeTab === "earnings" && (
            <div className="flex flex-col gap-6 max-w-7xl mx-auto">

              {/* Stat Cards Row (Matches Image 3) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Total Earnings */}
                <div className="bg-[#091b6f] text-white p-6 rounded-2xl shadow-sm border border-blue-900/10 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <p className="text-sky-200 font-bold text-xs uppercase tracking-wider">Total Earnings</p>
                  <p className="text-4xl font-extrabold mt-2 font-sans">₱ 50,000</p>
                  <span className="text-[10px] text-sky-200/60 font-semibold mt-4">Active Volume baseline</span>
                </div>

                {/* Total Completed Rides */}
                <div className="bg-[#091b6f] text-white p-6 rounded-2xl shadow-sm border border-blue-900/10 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <p className="text-sky-200 font-bold text-xs uppercase tracking-wider">Total Completed Rides</p>
                  <p className="text-4xl font-extrabold mt-2 font-sans">1,250</p>
                  <span className="text-[10px] text-sky-200/60 font-semibold mt-4">Total platform transactions</span>
                </div>

                {/* Total Commission Earned */}
                <div className="bg-[#091b6f] text-white p-6 rounded-2xl shadow-sm border border-blue-900/10 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <p className="text-sky-200 font-bold text-xs uppercase tracking-wider">Total Commission Earned</p>
                  <p className="text-4xl font-extrabold mt-2 font-sans">₱ 10,000</p>
                  <span className="text-[10px] text-sky-200/60 font-semibold mt-4">15% TODA commission margin</span>
                </div>
              </div>

              {/* Filters Bar (Matches Image 3) */}
              <div className="bg-[#b3e2ff]/30 p-3 rounded-xl flex flex-wrap items-center gap-3 border border-[#b3e2ff]/50">

                {/* TODA Dropdown Filter */}
                <div className="relative">
                  <select
                    value={earningsTodaFilter}
                    onChange={(e) => {
                      setEarningsTodaFilter(e.target.value);
                      setEarningsPage(1);
                    }}
                    className="pl-3.5 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#091b6f] cursor-pointer appearance-none outline-hidden focus:border-blue-500"
                  >
                    <option value="All">All TODAs</option>
                    <option value="LHITC-TODA">LHITC-TODA</option>
                    <option value="BYPASS ILAYANG BAGUIO-TODA">BYPASS ILAYANG BAGUIO-TODA</option>
                    <option value="CHOT-TODA">CHOT-TODA</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>
                </div>

                {/* Driver Dropdown Filter */}
                <div className="relative">
                  <select
                    value={earningsDriverFilter}
                    onChange={(e) => {
                      setEarningsDriverFilter(e.target.value);
                      setEarningsPage(1);
                    }}
                    className="pl-3.5 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#091b6f] cursor-pointer appearance-none outline-hidden focus:border-blue-500"
                  >
                    <option value="All">All Drivers</option>
                    {drivers.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>
                </div>

                {/* Date range selection */}
                <div className="relative">
                  <select
                    value={earningsDateRange}
                    onChange={(e) => setEarningsDateRange(e.target.value)}
                    className="pl-3.5 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#091b6f] cursor-pointer appearance-none outline-hidden focus:border-blue-500"
                  >
                    <option value="April 1, 2024- April 30, 2026">April 1, 2024- April 30, 2026</option>
                    <option value="today">Today Only</option>
                    <option value="weekly">This Week</option>
                    <option value="monthly">This Month</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>
                </div>

                {/* Apply Filter Button */}
                <button
                  onClick={() => setEarningsPage(1)}
                  className="px-4 py-1.5 bg-[#4c75f2] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Apply Filter
                </button>
              </div>

              {/* Earnings Breakdown Table Card (Matches Image 3) */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-4">

                {/* Card Header with Download Report */}
                <div className="flex items-center justify-between">
                  <h3 className="text-[#091b6f] font-bold text-lg">Earnings Breakdown</h3>

                  {/* Download Report Button */}
                  <button
                    onClick={handleDownloadReport}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4c75f2] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Download Report</span>
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="pb-3 pl-3">Date</th>
                        <th className="pb-3">TODA</th>
                        <th className="pb-3">Completed Rides</th>
                        <th className="pb-3">Total Earnings</th>
                        <th className="pb-3">Commission Earned</th>
                        <th className="pb-3 text-center pr-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-semibold divide-y divide-slate-50">
                      {filteredEarnings
                        .slice((earningsPage - 1) * 9, earningsPage * 9)
                        .map((r) => (
                          <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 pl-3 text-[#091b6f] font-semibold">{r.date}</td>
                            <td className="py-4 text-slate-600">{r.toda}</td>
                            <td className="py-4 text-slate-700">{r.completedRides}</td>
                            <td className="py-4 text-slate-800 font-bold">₱{r.totalEarnings.toLocaleString()}</td>
                            <td className="py-4 text-[#091b6f] font-extrabold">₱{r.commissionEarned.toLocaleString()}</td>
                            <td className="py-4 text-center pr-3">
                              <button
                                onClick={() => {
                                  setViewingEarningsRecord(r);
                                  setShowViewEarningsModal(true);
                                }}
                                className="px-3.5 py-1 bg-[#4c75f2] hover:bg-blue-600 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      {filteredEarnings.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                            No financial records found matching your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination (Matches Image 3 layout) */}
                {filteredEarnings.length > 0 && (
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                    <button
                      onClick={() => setEarningsPage(prev => Math.max(prev - 1, 1))}
                      disabled={earningsPage === 1}
                      className="text-xs font-bold text-blue-500 hover:underline disabled:opacity-30 disabled:no-underline cursor-pointer flex items-center gap-1"
                    >
                      &lt;&lt; Previos
                    </button>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-bold">
                        Page {earningsPage} of {Math.ceil(filteredEarnings.length / 9)}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEarningsPage(1)}
                          className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg border ${earningsPage === 1
                            ? "bg-slate-100 border-slate-200 text-[#091b6f]"
                            : "border-slate-200 hover:bg-slate-50 text-[#091b6f] cursor-pointer"
                            }`}
                        >
                          &lt;&lt;
                        </button>

                        {Array.from({ length: Math.ceil(filteredEarnings.length / 9) }, (_, i) => i + 1).map((p) => (
                          <button
                            key={p}
                            onClick={() => setEarningsPage(p)}
                            className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg border ${earningsPage === p
                              ? "bg-blue-100 border-blue-200 text-blue-600 font-extrabold"
                              : "border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                              }`}
                          >
                            {p}
                          </button>
                        ))}

                        <button
                          onClick={() => setEarningsPage(prev => Math.min(prev + 1, Math.ceil(filteredEarnings.length / 9)))}
                          disabled={earningsPage === Math.ceil(filteredEarnings.length / 9)}
                          className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg border ${earningsPage === Math.ceil(filteredEarnings.length / 9)
                            ? "opacity-30 border-slate-200 text-slate-400"
                            : "border-slate-200 hover:bg-slate-50 text-[#091b6f] cursor-pointer"
                            }`}
                        >
                          Next &gt;&gt;
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* Active Tab: Users Management */}
          {activeTab === "users" && (
            <div className="flex flex-col gap-6 max-w-7xl mx-auto">

              {/* Users Stats Cards Row (Matches Image 4) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Active Passengers Card */}
                <div className="bg-[#091b6f] text-white p-5 rounded-2xl shadow-sm border border-blue-900/10 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-sky-200">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                    </div>
                    <div>
                      <p className="text-sky-200/80 font-bold text-xs uppercase tracking-wider">Active Passengers</p>
                      <p className="text-3xl font-extrabold mt-0.5">2,308</p>
                    </div>
                  </div>
                </div>

                {/* Active Drivers Card */}
                <div className="bg-[#091b6f] text-white p-5 rounded-2xl shadow-sm border border-blue-900/10 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-sky-200">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                    </div>
                    <div>
                      <p className="text-sky-200/80 font-bold text-xs uppercase tracking-wider">Active Drivers</p>
                      <p className="text-3xl font-extrabold mt-0.5">1,856</p>
                    </div>
                  </div>
                </div>

                {/* Registered Passengers Card */}
                <div className="bg-[#091b6f] text-white p-5 rounded-2xl shadow-sm border border-blue-900/10 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-sky-200">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M20 8v6M23 11h-6" /></svg>
                    </div>
                    <div>
                      <p className="text-sky-200/80 font-bold text-xs uppercase tracking-wider">Registered Passengers</p>
                      <p className="text-3xl font-extrabold mt-0.5">452</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters registry bar (Matches Image 4) */}
              <div className="bg-[#b3e2ff]/30 p-3 rounded-xl flex flex-wrap items-center gap-3 border border-[#b3e2ff]/50">

                {/* Category tabs */}
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  {[
                    { key: "all", label: "All" },
                    { key: "drivers", label: "Drivers" },
                    { key: "passengers", label: "Passengers" }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setUsersSubTab(tab.key as any)}
                      className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${usersSubTab === tab.key
                        ? "bg-[#091b6f] text-white shadow-xs"
                        : "text-slate-600 hover:text-[#091b6f]"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TODA Dropdown */}
                <div className="relative">
                  <select
                    value={userTodaFilter}
                    onChange={(e) => {
                      setUserTodaFilter(e.target.value);
                      setDriversPage(1);
                    }}
                    className="pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#091b6f] cursor-pointer appearance-none outline-hidden focus:border-blue-500"
                  >
                    <option value="All">All TODAs</option>
                    <option value="LHITC-TODA">LHITC-TODA</option>
                    <option value="BYPASS ILAYANG BAGUIO-TODA">BYPASS ILAYANG BAGUIO-TODA</option>
                    <option value="CHOT-TODA">CHOT-TODA</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                  <select
                    value={userStatusFilter}
                    onChange={(e) => {
                      setUserStatusFilter(e.target.value);
                      setDriversPage(1);
                      setPassengersPage(1);
                    }}
                    className="pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#091b6f] cursor-pointer appearance-none outline-hidden focus:border-blue-500"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active Only</option>
                    <option value="Inactive">Inactive Only</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                  </span>
                </div>

                {/* Search input */}
                <div className="w-full sm:w-56 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search name, phone, license..."
                    value={driverSearch}
                    onChange={(e) => {
                      setDriverSearch(e.target.value);
                      setDriversPage(1);
                      setPassengersPage(1);
                    }}
                    className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold outline-hidden focus:border-[#091b6f] transition-all text-[#091b6f]"
                  />
                </div>

                {/* Apply Filter Button */}
                <button
                  onClick={() => { setDriversPage(1); setPassengersPage(1); }}
                  className="px-4 py-1.5 bg-[#4c75f2] hover:bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Apply Filter
                </button>

                {/* Download List Button */}
                <button
                  onClick={() => {
                    alert("Simulated registry list downloaded!");
                  }}
                  className="ml-auto flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-[#091b6f] font-bold text-xs rounded-lg shadow-xs hover:shadow-sm transition-all cursor-pointer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download List</span>
                </button>
              </div>

              {/* Drivers List Card (Visible if sub-tab is "all" or "drivers") */}
              {(usersSubTab === "all" || usersSubTab === "drivers") && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-4">
                  <h3 className="text-[#091b6f] font-bold text-lg">Drivers List</h3>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                          <th className="pb-3 pl-3">Name</th>
                          <th className="pb-3">TODA</th>
                          <th className="pb-3">License</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-center pr-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-semibold divide-y divide-slate-50">
                        {filteredDrivers
                          .slice((driversPage - 1) * itemsPerPage, driversPage * itemsPerPage)
                          .map((d) => (
                            <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4.5 pl-3">
                                <p className="text-[#091b6f] font-bold">{d.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold">Body: {d.bodyNumber}</p>
                              </td>
                              <td className="py-4.5 text-slate-600">{d.toda}</td>
                              <td className="py-4.5 text-slate-500 font-mono text-xs">{d.license}</td>
                              <td className="py-4.5">
                                <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold ${d.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                                  }`}>
                                  {d.status}
                                </span>
                              </td>
                              <td className="py-4.5 text-center pr-3">
                                <button
                                  onClick={() => {
                                    setViewingUser(d);
                                    setViewingUserType("driver");
                                    setShowViewUserModal(true);
                                  }}
                                  className="px-3.5 py-1 bg-[#4c75f2] hover:bg-blue-600 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        {filteredDrivers.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                              No drivers registered matching your search query.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {filteredDrivers.length > 0 && (
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                      <span className="text-xs text-slate-500 font-bold">
                        Page {driversPage} of {Math.ceil(filteredDrivers.length / itemsPerPage)}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setDriversPage(prev => Math.max(prev - 1, 1))}
                          disabled={driversPage === 1}
                          className="w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent text-[#091b6f] cursor-pointer"
                        >
                          &lt;
                        </button>

                        {Array.from({ length: Math.ceil(filteredDrivers.length / itemsPerPage) }, (_, i) => i + 1).map((p) => (
                          <button
                            key={p}
                            onClick={() => setDriversPage(p)}
                            className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg border ${driversPage === p
                              ? "bg-blue-100 border-blue-200 text-blue-600 font-extrabold"
                              : "border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                              }`}
                          >
                            {p}
                          </button>
                        ))}

                        <button
                          onClick={() => setDriversPage(prev => Math.min(prev + 1, Math.ceil(filteredDrivers.length / itemsPerPage)))}
                          disabled={driversPage === Math.ceil(filteredDrivers.length / itemsPerPage)}
                          className="w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent text-[#091b6f] cursor-pointer"
                        >
                          Next &gt;&gt;
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Passengers List Card (Visible if sub-tab is "all" or "passengers") */}
              {(usersSubTab === "all" || usersSubTab === "passengers") && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-4">
                  <h3 className="text-[#091b6f] font-bold text-lg">Passengers List</h3>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                          <th className="pb-3 pl-3">Name</th>
                          <th className="pb-3">Contact</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-center pr-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-semibold divide-y divide-slate-50">
                        {filteredPassengers
                          .slice((passengersPage - 1) * itemsPerPage, passengersPage * itemsPerPage)
                          .map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-4.5 pl-3">
                                <p className="text-[#091b6f] font-bold">{p.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold">Canceled: {p.canceledTrips} trips</p>
                              </td>
                              <td className="py-4.5 text-slate-600">{p.contact}</td>
                              <td className="py-4.5">
                                <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold ${p.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                                  }`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="py-4.5 text-center pr-3">
                                <button
                                  onClick={() => {
                                    setViewingUser(p);
                                    setViewingUserType("passenger");
                                    setShowViewUserModal(true);
                                  }}
                                  className="px-3.5 py-1 bg-[#4c75f2] hover:bg-blue-600 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        {filteredPassengers.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-12 text-center text-slate-400 font-medium">
                              No passengers registered matching your search query.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {filteredPassengers.length > 0 && (
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                      <span className="text-xs text-slate-500 font-bold">
                        Page {passengersPage} of {Math.ceil(filteredPassengers.length / itemsPerPage)}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setPassengersPage(prev => Math.max(prev - 1, 1))}
                          disabled={passengersPage === 1}
                          className="w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent text-[#091b6f] cursor-pointer"
                        >
                          &lt;
                        </button>

                        {Array.from({ length: Math.ceil(filteredPassengers.length / itemsPerPage) }, (_, i) => i + 1).map((p) => (
                          <button
                            key={p}
                            onClick={() => setPassengersPage(p)}
                            className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg border ${passengersPage === p
                              ? "bg-blue-100 border-blue-200 text-blue-600 font-extrabold"
                              : "border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                              }`}
                          >
                            {p}
                          </button>
                        ))}

                        <button
                          onClick={() => setPassengersPage(prev => Math.min(prev + 1, Math.ceil(filteredPassengers.length / itemsPerPage)))}
                          disabled={passengersPage === Math.ceil(filteredPassengers.length / itemsPerPage)}
                          className="w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent text-[#091b6f] cursor-pointer"
                        >
                          Next &gt;&gt;
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </main>
      </div>

      {/* MODAL 1: CREATE DRIVER ACCOUNT (MATCHES IMAGE 1) */}
      {showAddDriverModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col">

            {/* Modal Content */}
            <form onSubmit={handleAddDriver} className="p-8 flex flex-col gap-6">

              {/* Header Row */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#091b6f] tracking-tight">Create Driver Account</h3>
                  <div className="h-0.5 w-full bg-slate-100 mt-3 mb-4"></div>
                  <h4 className="text-md font-bold text-[#091b6f] tracking-wide uppercase">Driver Information</h4>
                </div>

                {/* Large Profile Circle with Plus */}
                <div className="relative shrink-0 ml-4">
                  <div className="w-20 h-20 bg-[#091b6f] rounded-full flex items-center justify-center text-white shadow-md">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <button type="button" className="absolute bottom-0 right-0 w-7 h-7 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white shadow-sm hover:bg-blue-600 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-[#091b6f]">Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Enter Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-[#091b6f] placeholder-slate-300"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-[#091b6f]">Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="Enter Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-[#091b6f] placeholder-slate-300"
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-[#091b6f]">Contact Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="Enter Contact Number"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-[#091b6f] placeholder-slate-300"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-[#091b6f]">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    </span>
                    <input
                      type="password"
                      required
                      placeholder="Enter Password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-[#091b6f] placeholder-slate-300"
                    />
                  </div>
                </div>

                {/* Plate Number */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-[#091b6f]">Plate Number</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                        <path d="M5.5 16h13M8.5 10l2-4h5v4M4 11.5a2.5 2.5 0 0 1 2.5-2.5h2" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Enter Plate Number"
                      value={formData.plateNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, plateNumber: e.target.value }))}
                      className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-[#091b6f] placeholder-slate-300"
                    />
                  </div>
                </div>

                {/* TODA */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-[#091b6f]">TODA</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                    </span>
                    <select
                      value={formData.toda}
                      onChange={(e) => setFormData(prev => ({ ...prev, toda: e.target.value }))}
                      className="w-full pl-11 pr-10 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold bg-white outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-[#091b6f] cursor-pointer appearance-none"
                    >
                      <option value="LHITC-TODA">LHITC-TODA</option>
                      <option value="BYPASS ILAYANG BAGUIO-TODA">BYPASS ILAYANG BAGUIO-TODA</option>
                      <option value="CHOT-TODA">CHOT-TODA</option>
                    </select>
                    <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                    </span>
                  </div>
                </div>

              </div>

              {/* Upload Documents Subtitle */}
              <div>
                <h4 className="text-md font-bold text-[#091b6f] tracking-wide uppercase mt-2 mb-3">Upload Documents</h4>

                {/* Documents Flex Layout - GCash QR Code Removed */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Driver's License Box */}
                  <div className="border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 hover:border-blue-300 transition-all bg-slate-50/50">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <line x1="7" y1="8" x2="17" y2="8" />
                        <line x1="7" y1="12" x2="17" y2="12" />
                        <line x1="7" y1="16" x2="13" y2="16" />
                      </svg>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <p className="text-sm font-bold text-[#091b6f]">Driver's License</p>
                      <p className="text-xs text-slate-400 font-semibold">Upload a clear copy of the driver's license</p>
                    </div>

                    {/* Drag and Drop Box */}
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-colors w-full md:w-64 relative cursor-pointer group">
                      <input
                        type="file"
                        accept=".jpg,.png,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData(prev => ({
                              ...prev,
                              licenseImage: file,
                              licenseImageName: file.name
                            }));
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      />
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mb-1 group-hover:scale-110 transition-transform">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <p className="text-xs font-bold text-[#091b6f]">
                        {formData.licenseImageName ? formData.licenseImageName : "Drag and Drop or"}
                      </p>
                      {!formData.licenseImageName && (
                        <>
                          <span className="mt-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white font-bold text-[10px] rounded-lg shadow-sm">
                            Choose File
                          </span>
                          <span className="text-[9px] text-slate-400 font-semibold mt-1">JPG, PNG or PDF</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddDriverModal(false)}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-colors border border-transparent hover:border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.01]"
                >
                  Create Account
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

      {/* MODAL 3: DISPATCH NEW RIDE REQUEST */}
      {showAddRequestModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            <div className="bg-[#0b1b6e] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-lg">Dispatch New Ride Request</h3>
              <button
                onClick={() => setShowAddRequestModal(false)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <form onSubmit={handleAddRequest} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Passenger Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maria Cruz"
                  value={newRequestData.passenger}
                  onChange={(e) => setNewRequestData(prev => ({ ...prev, passenger: e.target.value }))}
                  className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-[#091b6f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pickup Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tayabas Market"
                    value={newRequestData.location}
                    onChange={(e) => setNewRequestData(prev => ({ ...prev, location: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-[#091b6f]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Destination</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brgy. Baguio"
                    value={newRequestData.destination}
                    onChange={(e) => setNewRequestData(prev => ({ ...prev, destination: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-[#091b6f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Fare (₱)</label>
                  <input
                    type="number"
                    required
                    placeholder="80"
                    value={newRequestData.fare}
                    onChange={(e) => setNewRequestData(prev => ({ ...prev, fare: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-semibold outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-[#091b6f]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Assign Driver</label>
                  <select
                    value={newRequestData.driverId}
                    onChange={(e) => setNewRequestData(prev => ({ ...prev, driverId: e.target.value }))}
                    className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-semibold bg-white outline-hidden focus:border-blue-500 transition-all text-[#091b6f] cursor-pointer"
                  >
                    <option value="">Select Active Driver</option>
                    {drivers.filter(d => d.status === "Active").map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.toda})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-500 font-bold uppercase tracking-wider">Initial Booking Status</label>
                <select
                  value={newRequestData.status}
                  onChange={(e) => setNewRequestData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-semibold bg-white outline-hidden focus:border-blue-500 transition-all text-[#091b6f] cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRequestModal(false)}
                  className="px-5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: RIDE REQUEST DETAIL VIEW ("view everything" when View clicked) */}
      {showViewRequestModal && viewingRequest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col">
            <div className="bg-[#0b1b6e] text-white px-6 py-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-200">Ride Booking Audit</span>
                <h3 className="font-bold text-lg">Request #{viewingRequest.id.toString().slice(-6)}</h3>
              </div>
              <button
                onClick={() => { setShowViewRequestModal(false); setViewingRequest(null); }}
                className="text-white/85 hover:text-white transition-colors cursor-pointer"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Passenger</p>
                  <p className="font-bold text-[#091b6f] text-base mt-0.5">{viewingRequest.passenger}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Assigned Driver</p>
                  <p className="font-bold text-slate-700 text-base mt-0.5">{viewingRequest.driver}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pickup Location</p>
                  <p className="font-bold text-slate-700 mt-0.5">{viewingRequest.location}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Destination</p>
                  <p className="font-bold text-slate-700 mt-0.5">{viewingRequest.destination || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fare Value</p>
                  <p className="font-extrabold text-[#091b6f] text-lg mt-0.5">₱{viewingRequest.fare}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Booking Time</p>
                  <p className="font-bold text-slate-500 mt-0.5">{viewingRequest.time}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">TODA Association</p>
                  <p className="font-bold text-slate-600 mt-0.5">{viewingRequest.toda}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ride Status</p>
                  <div className="mt-1">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold ${viewingRequest.status === "Completed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                      viewingRequest.status === "In Transit" ? "bg-emerald-500 text-white border border-emerald-600" :
                        viewingRequest.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                          viewingRequest.status === "Scheduled" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                            "bg-rose-50 text-rose-600 border border-rose-100"
                      }`}>
                      {viewingRequest.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-end">
                <button
                  onClick={() => { setShowViewRequestModal(false); setViewingRequest(null); }}
                  className="px-6 py-2 bg-[#091b6f] hover:bg-blue-800 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-sm hover:shadow"
                >
                  Close Audit Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: USER MANAGEMENT DETAIL VIEW & AUDIT (View everything & deactivate passenger / driver) */}
      {showViewUserModal && viewingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col animate-in zoom-in-95">
            <div className="bg-[#0b1b6e] text-white px-6 py-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-200">
                  {viewingUserType === "driver" ? "Driver Profile Audit" : "Passenger Account Audit"}
                </span>
                <h3 className="font-bold text-lg">{viewingUser.name}</h3>
              </div>
              <button
                onClick={() => { setShowViewUserModal(false); setViewingUser(null); setViewingUserType(null); }}
                className="text-white/85 hover:text-white transition-colors cursor-pointer"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6">

              {/* Account Overview Cards */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0 font-extrabold text-xl">
                  {viewingUser.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#091b6f] text-md">{viewingUser.name}</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-0.5">
                    {viewingUserType === "driver" ? "Tricycle Operator / Driver" : "Passenger Client"}
                  </p>
                </div>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border ${viewingUser.status === "Active"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-rose-50 text-rose-600 border-rose-100"
                    }`}>
                    {viewingUser.status}
                  </span>
                </div>
              </div>

              {/* Data Grid based on Type */}
              {viewingUserType === "driver" ? (
                // Driver Specific Data
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm border-b border-slate-100 pb-5">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">TODA Association</p>
                    <p className="font-bold text-slate-700 mt-0.5">{(viewingUser as Driver).toda}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">License Number</p>
                    <p className="font-bold text-slate-700 mt-0.5 font-mono">{(viewingUser as Driver).license}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tricycle Body Number</p>
                    <p className="font-bold text-slate-700 mt-0.5">{(viewingUser as Driver).bodyNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Plate Number</p>
                    <p className="font-bold text-[#091b6f] font-mono mt-0.5">{(viewingUser as Driver).plateNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Contact Phone</p>
                    <p className="font-bold text-slate-700 mt-0.5">{viewingUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Joined Date</p>
                    <p className="font-bold text-slate-500 mt-0.5">{(viewingUser as Driver).joinedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
                    <p className="font-bold text-slate-600 mt-0.5">{(viewingUser as Driver).email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Completed Trips</p>
                    <p className="font-extrabold text-[#091b6f] text-md mt-0.5">{(viewingUser as Driver).trips} Rides</p>
                  </div>
                </div>
              ) : (
                // Passenger Specific Data
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm border-b border-slate-100 pb-5">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Contact Number</p>
                    <p className="font-bold text-slate-700 mt-0.5">{(viewingUser as Passenger).contact}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Joined Date</p>
                    <p className="font-bold text-slate-500 mt-0.5">{(viewingUser as Passenger).joinedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Rides Taken</p>
                    <p className="font-extrabold text-[#091b6f] mt-0.5">{(viewingUser as Passenger).ridesTaken} Rides</p>
                  </div>

                  {/* Canceled Trips with limit deactivation */}
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Canceled Trips</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`font-extrabold text-sm px-2 py-0.5 rounded-md ${(viewingUser as Passenger).canceledTrips >= 3
                        ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                        }`}>
                        {(viewingUser as Passenger).canceledTrips} / 3 Cancelled
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Controls */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Administrative Actions</h4>
                <div className="flex flex-wrap gap-2">
                  {/* Status Toggle (Deactivate / Activate) */}
                  {viewingUserType === "driver" ? (
                    <button
                      onClick={() => handleDeactivateToggle(viewingUser.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${viewingUser.status === "Active"
                        ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                    >
                      {viewingUser.status === "Active" ? "Deactivate Driver" : "Activate Driver"}
                    </button>
                  ) : (
                    <div className="flex gap-2 items-center flex-wrap">
                      <button
                        onClick={() => handleDeactivatePassengerToggle(viewingUser.id)}
                        disabled={(viewingUser as Passenger).canceledTrips >= 3 && viewingUser.status === "Inactive"}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-30 disabled:cursor-not-allowed ${viewingUser.status === "Active"
                          ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                          }`}
                      >
                        {viewingUser.status === "Active" ? "Deactivate Passenger" : "Activate Passenger"}
                      </button>

                      {/* Passenger Cancel Trips Simulation */}
                      <button
                        onClick={() => handleIncrementCanceledTrips(viewingUser.id)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        Simulate Canceled Trip
                      </button>

                      {/* Reset Cancel Trips */}
                      {(viewingUser as Passenger).canceledTrips > 0 && (
                        <button
                          onClick={() => handleResetCanceledTrips(viewingUser.id)}
                          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Reset & Reactivate
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Auto deactivation note */}
                {viewingUserType === "passenger" && (viewingUser as Passenger).canceledTrips >= 3 && (
                  <div className="bg-rose-50 text-rose-700 p-3.5 rounded-xl border border-rose-100 text-xs font-semibold flex items-center gap-2 mt-1">
                    <span className="text-lg">⚠️</span>
                    <span>
                      Passenger is deactivated. Canceled trip threshold (3) has been reached! Reset canceled trips to reactivate.
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-end mt-2">
                <button
                  onClick={() => { setShowViewUserModal(false); setViewingUser(null); setViewingUserType(null); }}
                  className="px-5 py-2.5 bg-[#091b6f] hover:bg-blue-800 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-xs hover:shadow"
                >
                  Close Account Audit
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: ADMIN PROFILE VIEW (MATCHES IMAGE 5 STYLE) */}
      {activeTab === "profile" && (
        <div className="absolute inset-0 bg-[#bde5ff] flex items-center justify-center p-4 overflow-y-auto z-40 transition-all">
          <div className="w-full max-w-lg flex flex-col items-center gap-4">

            {/* Header Title */}
            <h2 className="text-[#091b6f] font-serif text-3xl font-bold italic tracking-wide text-center">
              Profile (Admin)
            </h2>

            {/* Main Rounded Card */}
            <div className="bg-white rounded-3xl shadow-xl w-full p-8 flex flex-col items-center gap-6 relative border border-blue-100">

              {/* Back Button / Close Icon */}
              <button
                onClick={() => setActiveTab("dashboard")}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Back to Dashboard"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>

              {/* Avatar Photo Frame */}
              <div className="relative flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-full border-4 border-sky-300 shadow-inner overflow-hidden bg-sky-200">
                  <svg viewBox="0 0 40 40" className="w-full h-full">
                    <circle cx="20" cy="20" r="18" fill="#38bdf8" />
                    <g>
                      <path d="M9 16C9 10 14 8 20 8C26 8 31 10 31 16C31 22 28 24 28 27C28 30 20 31 20 31C20 31 12 30 12 27C12 24 9 22 9 16Z" fill="#1e1b4b" />
                      <circle cx="20" cy="19" r="7" fill="#fed7aa" />
                      <path d="M14 15C16 13 18 13 20 14C22 13 24 13 26 15C26 15 24 11 20 11C16 11 14 15 14 15Z" fill="#1e1b4b" />
                      <path d="M10 36C10 31 14 29 20 29C26 29 30 31 30 36H10Z" fill="#4f46e5" />
                      <path d="M20 29V32" stroke="#fed7aa" strokeWidth="2" strokeLinecap="round" />
                    </g>
                  </svg>
                </div>

                {/* Admin Name & Badge */}
                <h3 className="text-xl font-bold text-[#091b6f] font-serif">{adminProfile.name}</h3>
                <span className="px-4 py-0.5 bg-blue-100 text-blue-700 font-extrabold text-[10px] rounded-full uppercase tracking-wider border border-blue-200/50">
                  Administrator
                </span>
              </div>

              {/* Information Row Rows */}
              <div className="w-full flex flex-col divide-y divide-slate-100">

                {/* Email Section */}
                <div className="py-4 flex flex-col gap-1">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Email</span>
                  <span className="text-sm font-semibold text-slate-700">{adminProfile.email}</span>
                </div>

                {/* Account Status Section */}
                <div className="py-4 flex flex-col gap-1">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Account Status</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 font-extrabold text-[10px] rounded-md">
                      {adminProfile.status}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">Your account is active and in good standing.</span>
                  </div>
                </div>

                {/* Password Section */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Password</span>
                    <span className="text-sm font-bold text-slate-600">{adminProfile.password}</span>
                  </div>
                  <button
                    onClick={() => {
                      const newPw = prompt("Enter new password:", "•••••••••");
                      if (newPw) setAdminProfile(prev => ({ ...prev, password: newPw }));
                    }}
                    className="px-5 py-1.5 border border-[#091b6f] hover:bg-sky-50 text-[#091b6f] text-xs font-bold rounded-full transition-colors cursor-pointer"
                  >
                    Change Password
                  </button>
                </div>

                {/* Name Section */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Name</span>
                    <span className="text-sm font-bold text-slate-700">{adminProfile.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      const newName = prompt("Edit Administrator Name:", adminProfile.name);
                      if (newName) setAdminProfile(prev => ({ ...prev, name: newName }));
                    }}
                    className="px-5 py-1.5 border border-[#091b6f] hover:bg-sky-50 text-[#091b6f] text-xs font-bold rounded-full transition-colors cursor-pointer"
                  >
                    Edit Name
                  </button>
                </div>

                {/* Profile Picture Section */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Profile Picture</span>
                    <span className="text-xs text-slate-400 font-semibold">Update your profile picture</span>
                  </div>
                  <button
                    onClick={() => alert("Change profile photo simulation triggered.")}
                    className="px-5 py-1.5 border border-[#091b6f] hover:bg-sky-50 text-[#091b6f] text-xs font-bold rounded-full transition-colors cursor-pointer"
                  >
                    Change Picture
                  </button>
                </div>

              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to log out?")) {
                    setActiveTab("dashboard");
                    alert("Simulated logout successful! Resetting dashboard view.");
                  }
                }}
                className="w-full bg-[#ef2b2b] hover:bg-red-600 text-white font-bold py-3 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer text-center text-sm uppercase tracking-wider"
              >
                Logout
              </button>

            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: EARNINGS BREAKDOWN DETAIL VIEW */}
      {showViewEarningsModal && viewingEarningsRecord && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col">
            <div className="bg-[#0b1b6e] text-white px-6 py-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-200">Financial Audit Log</span>
                <h3 className="font-bold text-lg">{viewingEarningsRecord.toda} Breakdown</h3>
              </div>
              <button
                onClick={() => { setShowViewEarningsModal(false); setViewingEarningsRecord(null); }}
                className="text-white/85 hover:text-white transition-colors cursor-pointer"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm border-b border-slate-100 pb-5">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Report Date</p>
                  <p className="font-bold text-[#091b6f] text-base mt-0.5">{viewingEarningsRecord.date}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">TODA Association</p>
                  <p className="font-bold text-slate-700 text-base mt-0.5">{viewingEarningsRecord.toda}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Completed Rides</p>
                  <p className="font-bold text-slate-700 mt-0.5">{viewingEarningsRecord.completedRides} Trips</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Representative Driver</p>
                  <p className="font-bold text-slate-700 mt-0.5">{viewingEarningsRecord.driverName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Booking Volume</p>
                  <p className="font-extrabold text-slate-800 text-lg mt-0.5">₱{viewingEarningsRecord.totalEarnings.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Platform Commission Fee (15%)</p>
                  <p className="font-extrabold text-[#091b6f] text-lg mt-0.5">₱{viewingEarningsRecord.commissionEarned.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Breakdown of Services</h4>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2.5 text-xs font-semibold text-slate-600">
                  <div className="flex justify-between">
                    <span>Base Fare Volume (85% Driver share)</span>
                    <span>₱{(viewingEarningsRecord.totalEarnings * 0.85).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200/50 pt-2">
                    <span>Platform Commission (15% TODA share)</span>
                    <span>₱{viewingEarningsRecord.commissionEarned.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200/50 pt-2 font-bold text-slate-800">
                    <span>Total Transacted Amount</span>
                    <span>₱{viewingEarningsRecord.totalEarnings.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex items-center justify-end">
                <button
                  onClick={() => { setShowViewEarningsModal(false); setViewingEarningsRecord(null); }}
                  className="px-6 py-2 bg-[#091b6f] hover:bg-blue-800 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-sm hover:shadow"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
