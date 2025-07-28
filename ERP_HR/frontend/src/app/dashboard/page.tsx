"use client";
import MainContent from "../components/MainContent";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

export default function DashboardPage() {
  const isMobile = useMediaQuery({ maxWidth: 1023 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    // Set initial state
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        {isMobile ? (
          isSidebarOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black bg-opacity-30"
                style={{ top: "48px" }}
                onClick={toggleSidebar}
              ></div>
              <div
                className="fixed left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300"
                style={{ top: "48px", height: "calc(100vh - 48px)" }}
              >
                <Sidebar isOpen={isSidebarOpen} />
              </div>
            </>
          )
        ) : (
          <div
            className={`transition-all duration-300 ${
              isSidebarOpen ? "w-64" : "w-0"
            } ${isSidebarOpen ? "" : "overflow-hidden"} ""`}
          >
            <Sidebar isOpen={isSidebarOpen} />
          </div>
        )}
        {/* Main Content */}
        <div className="flex-1 p-6 sm:p-4 overflow-auto">
          <MainContent />
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        © {new Date().getFullYear()} INSA ERP. All rights reserved.
      </footer>
    </div>
  );
}
