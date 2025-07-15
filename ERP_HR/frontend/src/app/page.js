"use client";

import { useState } from "react";
import Header from "../app/components/Header";

import Charts from "../app/components/Charts";
import DashboardCards from "../app/components/DashboardCards";
import Sidebar from "../app/components/Sidebar";
import EmployeeTable from "../app/components/EmployeeTable";
import RegisterJobsPage from "../app/hr-module/register-jobs/page";

// Main page component
export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
  const [currentView, setCurrentView] = useState("dashboard"); 

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to render the selected view
  const renderContent = () => {
    if (currentView === "register-jobs") {
      return <RegisterJobsPage />;
    }

    return (
      <>
        <DashboardCards />
        <Charts />
        <EmployeeTable />
      </>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} /> {/* to render the main side bar*/}
        {/* Main Content */}
        <div className="flex-1 p-4 transition-all duration-300">
          {renderContent()}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        © {new Date().getFullYear()} INSA ERP. All rights reserved.
      </footer>
    </div>
  );
}