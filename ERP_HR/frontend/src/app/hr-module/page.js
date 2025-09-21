"use client";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Chart from "chart.js/auto";
import Header from "../components/Header";
import Sidebar from "./sidbar";
import RegisterJobs from "./register-jobs/page";

export default function HRModule() {
  const isMobile = useMediaQuery({ maxWidth: 1024 });
  const [sidebarHidden, setSidebarHidden] = useState(isMobile);
  const pieChartRef = useRef(null);
  // ...existing code...
  const [currentRoute, setCurrentRoute] = useState("dashboard");

  useEffect(() => {
    let pieChartInstance = null;

    if (pieChartRef.current) {
      const pieCtx = pieChartRef.current.getContext("2d");

      if (pieChartInstance) {
        pieChartInstance.destroy();
      }

      // Create new chart instance
      pieChartInstance = new Chart(pieCtx, {
        type: "pie",
        data: {
          labels: [
            "Engineering",
            "Management",
            "Economics",
            "Marketing",
            "Others",
          ],
          datasets: [
            {
              data: [14.8, 4.9, 2.6, 1.5, 5.5],
              backgroundColor: [
                "#4CAF50",
                "#FF9800",
                "#F44336",
                "#2196F3",
                "#9C27B0",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
            tooltip: {
              callbacks: {
                label: (tooltipItem) =>
                  `${tooltipItem.label}: ${tooltipItem.raw} %`,
              },
            },
          },
        },
      });
    }

    return () => {
      if (pieChartInstance) {
        pieChartInstance.destroy();
      }
    };
  }, []);

  // Employee data and pagination
  // ...existing code...

  // Render content based on the current route
  const renderContent = () => {
    if (currentRoute === "register-jobs") {
      return <RegisterJobs />;
    }

    // Default dashboard content
    return (
      <>
        {/* Pie Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">
              HR Employees by Department
            </h2>
            <canvas ref={pieChartRef}></canvas>
          </div>
        </div>

        {/* Employee Table section removed */}
      </>
    );
  };

  useEffect(() => {
    setSidebarHidden(isMobile);
  }, [isMobile]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header toggleSidebar={() => setSidebarHidden((prev) => !prev)} />
      <div className="flex flex-1 min-h-full">
        {/* Sidebar: toggled on all screen sizes by menu icon */}
        <Sidebar
          className={`h-auto min-h-full ${sidebarHidden ? "hidden" : ""}`}
        />
        <div className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-6">HR Module Dashboard</h1>
          <div className="mb-4">
            {/* <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => setCurrentRoute("dashboard")}
            >
              Dashboard
            </button> */}
            {/* <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setCurrentRoute("register-jobs")}
            >
              Register Jobs
            </button> */}
          </div>
          {renderContent()}
        </div>
      </div>
      <footer className="bg-gray-800 text-white p-4 text-center">
        © {new Date().getFullYear()} INSA ERP. All rights reserved.
      </footer>
    </div>
  );
}
