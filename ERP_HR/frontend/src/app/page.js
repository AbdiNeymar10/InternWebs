"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, [router]);
  return null;
}