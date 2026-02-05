// import React from "react";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import { useAuth } from "../../state/AuthContext";

// const navLinkClass = ({ isActive }) =>
//   "flex items-center gap-2 px-4 py-2 rounded-md text-sm " +
//   (isActive ? "bg-white/10 text-white" : "text-white/80 hover:text-white");

// export default function DashboardLayout() {
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   const doLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-[#f3f4f6] flex">
//       {/* Sidebar */}
//       <aside className="w-[250px] bg-[#0f172a] text-white p-4">
//         <div className="font-bold text-lg mb-4">Productr</div>

//         <div className="bg-white/10 rounded-md px-3 py-2 text-xs mb-6 opacity-90">
//           Search
//         </div>

//         <nav className="space-y-1">
//           <NavLink to="/dashboard/home" className={navLinkClass}>
//             <span>🏠</span> Home
//           </NavLink>
//           <NavLink to="/dashboard/products" className={navLinkClass}>
//             <span>🧾</span> Products
//           </NavLink>
//         </nav>
//       </aside>

//       {/* Main */}
//       <main className="flex-1">
//         {/* Top bar */}
//         <div className="h-14 bg-gradient-to-r from-pink-50 to-blue-50 flex items-center justify-between px-6 border-b">
//           <div className="text-sm text-gray-600"> </div>

//           <div className="flex items-center gap-4">
//             <div className="hidden md:block">
//               <input
//                 placeholder="Search Services, Products"
//                 className="w-[280px] px-3 py-2 border rounded-md text-sm outline-none"
//               />
//             </div>

//             <div className="w-9 h-9 rounded-full bg-gray-300" title="user" />
//             <button
//               onClick={doLogout}
//               className="text-xs px-3 py-2 rounded-md border bg-white hover:bg-gray-50"
//             >
//               Logout
//             </button>
//           </div>
//         </div>

//         <div className="p-6">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// }


// ✅ DashboardLayout.jsx (Figma same-to-same styling like screenshot)
// Sidebar dark + small search bar
// Top gradient bar (pink->yellow->blue feel) + user avatar + dropdown icon
// Clean spacing like your design

import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../state/AuthContext";

const navLinkClass = ({ isActive }) =>
  "flex items-center gap-3 px-4 py-2 rounded-lg text-[13px] transition " +
  (isActive
    ? "bg-white/10 text-white"
    : "text-white/60 hover:bg-white/10 hover:text-white");

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      {/* ✅ Sidebar */}
      <aside className="w-[260px] bg-[#101827] text-white pt-5 pb-6 px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 px-2">
          <div className="font-extrabold text-[18px] tracking-tight">Productr</div>
          <span className="w-5 h-5 rounded-full bg-[#ff7a59]" />
        </div>

        {/* Search */}
        <div className="mt-5 px-2">
          <div className="h-9 bg-white/10 rounded-md px-3 flex items-center gap-2 text-white/50 text-xs">
            <span className="text-white/40">🔍</span>
            <span>Search</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="mt-6 space-y-1 px-1">
          <NavLink to="/dashboard/home" className={navLinkClass}>
            <span className="text-base">⌂</span>
            <span>Home</span>
          </NavLink>

          <NavLink to="/dashboard/products" className={navLinkClass}>
            <span className="text-base">🧾</span>
            <span>Products</span>
          </NavLink>
        </nav>
      </aside>

      {/* ✅ Main */}
      <main className="flex-1 min-w-0">
        {/* ✅ Top bar (exact gradient vibe like screenshot) */}
        <div className="h-14 border-b flex items-center justify-end px-6"
             style={{
               background:
                 "linear-gradient(90deg, rgba(253,242,248,1) 0%, rgba(255,251,235,1) 45%, rgba(239,246,255,1) 100%)",
             }}
        >
          <div className="flex items-center gap-3">
            {/* avatar */}
            <div className="w-7 h-7 rounded-full bg-gray-300" />
            {/* dropdown icon */}
            <span className="text-gray-600 text-xs">▾</span>

            {/* optional logout (keep if you want) */}
            <button
              onClick={doLogout}
              className="ml-2 text-xs px-3 py-1.5 rounded-md border bg-white/70 hover:bg-white"
            >
              Logout
            </button>
          </div>
        </div>

        {/* ✅ Page content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
