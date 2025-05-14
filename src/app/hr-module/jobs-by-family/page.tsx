"use client";

import React, { useState } from "react";
import Header from "../../components/Header";
import Sidebar from "../sidbar";
import JobFamily from "../../components/JobFamily";

export default function JobFamilyPage() {
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
        <Sidebar hidden={!isSidebarOpen} />
        {/* Main Content - Job Family */}
        <div className="flex-1 p-4 transition-all duration-300">
          <JobFamily />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        © {new Date().getFullYear()} INSA ERP. All rights reserved.
      </footer>
    </div>
  );
}
