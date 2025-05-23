"use client";

import React, { useState } from "react";
import Header from "../../components/Header";
import Sidebar from "../sidbar";
import JobFamily from "../../components/JobFamily";
import { useEffect } from "react";

export default function JobFamilyPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 640;
    }
    return true;
  });
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = typeof window !== "undefined" && window.innerWidth < 640;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
    };
    handleResize();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 flex-col sm:flex-row">
        <Sidebar hidden={!isSidebarOpen} isMobile={isMobile} />
        <div className="flex-1 p-4 transition-all duration-300 w-full">
          <JobFamily />
        </div>
      </div>
      <footer className="bg-gray-800 text-white p-4 text-center">
        © {new Date().getFullYear()} INSA ERP. All rights reserved.
      </footer>
    </div>
  );
}
