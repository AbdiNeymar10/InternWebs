"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import Header from "../../components/Header"; // Assuming you have a Header component
import Sidebar from "../sidbar"; // Corrected a potential typo from 'sidbar'

// Define a constant for the breakpoint for easier maintenance
const MOBILE_BREAKPOINT = 640;

export default function UserManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Effect to handle window resizing for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      // Automatically open sidebar on desktop and close on mobile
      setIsSidebarOpen(!mobile);
    };

    // Run on initial mount to set the correct state
    handleResize();

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount to prevent memory leaks
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array ensures this runs only once

  // Effect to handle clicking outside the sidebar to close it on mobile
  useEffect(() => {
    // Only run this effect if the sidebar is open on a mobile device
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
    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, isMobile]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Assuming a Header component is part of your layout */}
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 flex-col sm:flex-row min-h-0">
        {/* Using <aside> is more semantically correct for a sidebar */}
        <aside ref={sidebarRef} className="flex flex-col">
          {/* THE FIX: Pass the required 'isMobile' and 'hidden' props */}
          <Sidebar
            isMobile={isMobile}
            hidden={!isSidebarOpen}
            className="flex-1 h-full"
          />
        </aside>
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
