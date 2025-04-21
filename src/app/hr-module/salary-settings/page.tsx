"use client";

import { useState } from "react";
import Header from "../../components/Header"; // Assuming Header is in /components
import Sidebar from "../sidbar"; // Sidebar is in hr-module (sidbar.tsx)
import SalarySettings from "../../components/SalarySettings"; // Your content component

export default function SalarySettingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar hidden={!isSidebarOpen} />{" "}
        {/* Pass hidden instead of isOpen */}
        {/* Main Content - Salary Settings */}
        <div className="flex-1 p-4 transition-all duration-300">
          <SalarySettings />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        © {new Date().getFullYear()} INSA ERP. All rights reserved.
      </footer>
    </div>
  );
}
