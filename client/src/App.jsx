import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Otp from "./pages/auth/Otp.jsx";
import DashboardLayout from "./pages/dashboard/DashboardLayout.jsx";
import Home from "./pages/dashboard/Home.jsx";
import Products from "./pages/dashboard/Products.jsx";
import { useAuth } from "./state/AuthContext.jsx";

const Protected = ({ children }) => {
  const { isAuth } = useAuth();
  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}/
      <Route path="/" element={<Login />} />

      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<Otp />} />

      <Route
        path="/dashboard"
        element={
          <Protected>
            <DashboardLayout />
          </Protected>
        }
      >
        <Route index element={<Navigate to="/dashboard/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="products" element={<Products />} />
      </Route>

      <Route path="*" element={<div className="p-10">404</div>} />
    </Routes>
  );
}
