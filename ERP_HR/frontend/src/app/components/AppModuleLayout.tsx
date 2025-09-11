"use client";

import { useState, useEffect, ReactNode, useRef } from "react";
import Header from "./Header";
import Sidebar from "../hr-module/sidbar"; // Corrected potential typo in path
import { Toaster } from "react-hot-toast";

type Props = {
  children: ReactNode;
};

// Define a breakpoint constant for better maintainability
const MOBILE_BREAKPOINT = 640; // Corresponds to sm: in Tailwind

export default function AppModuleLayout({ children }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Effect to handle window resizing for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      // On mobile, the sidebar should be closed by default. On desktop, it should be open.
      setIsSidebarOpen(!mobile);
    };

    // Run on initial mount to set the correct state
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount to prevent memory leaks
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect to handle clicking outside the sidebar to close it on mobile
  useEffect(() => {
    // Only run this effect if the sidebar is open on a mobile device
    if (!isSidebarOpen || !isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the sidebar
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
      <Toaster position="top-center" />
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 flex-col sm:flex-row min-h-0">
        {/* Use an <aside> tag for the sidebar for better semantics */}
        <aside ref={sidebarRef} className="flex flex-col">
          <Sidebar
            isMobile={isMobile} // <-- THE FIX: Pass the required 'isMobile' prop
            hidden={!isSidebarOpen}
            className="flex-1 h-full" // Kept flex-1 to ensure it grows vertically
          />
        </aside>
        {/* Main content area */}
        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
