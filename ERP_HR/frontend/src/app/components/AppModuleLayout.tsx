"use client";

import { useState, useEffect, ReactNode, useRef } from "react";
import Header from "./Header";
import Sidebar from "../hr-module/sidbar";
import toast, { Toaster } from "react-hot-toast";

type Props = {
  children: ReactNode;
};

export default function AppModuleLayout({ children }: Props) {
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
    <div className="flex flex-col min-h-screen">
      <Toaster />
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 flex-col sm:flex-row min-h-0">
        <div ref={sidebarRef} className="min-h-full h-auto flex flex-col">
          <Sidebar
            hidden={!isSidebarOpen}
            className="flex-1 h-full min-h-full"
          />
        </div>
        <div className="flex-1 p-4 transition-all duration-300 w-full">
          {children}
        </div>
      </div>
      {/* <footer className="bg-gray-800 text-white p-4 text-center">
        © {new Date().getFullYear()} INSA ERP. All rights reserved.
      </footer> */}
    </div>
  );
}
