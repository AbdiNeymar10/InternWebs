"use client";

import { useState, useEffect, useRef } from "react";
import Header from "../../components/Header";
import Sidebar from "../sidbar";

export default function EmployeeProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 640;
    }
    return true;
  });
  const sidebarRef = useRef<HTMLDivElement>(null);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

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

  useEffect(() => {
    if (!isSidebarOpen || !isMobile) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, isMobile]);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 flex-col sm:flex-row min-h-0 overflow-x-hidden">
        <div ref={sidebarRef} className="min-h-full h-auto flex flex-col">
          <Sidebar
            hidden={!isSidebarOpen}
            className="flex-1 h-full min-h-full"
          />
        </div>
        <div className="flex-1 p-4 transition-all duration-300 max-w-full overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
