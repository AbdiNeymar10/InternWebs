"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useRouter } from "next/navigation";

export default function MainContent() {
  const router = useRouter();
  const areaChartRef = useRef<HTMLCanvasElement>(null);
  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const areaChartInstance = useRef<Chart | null>(null);
  const pieChartInstance = useRef<Chart | null>(null);
  // ...existing code...

  useEffect(() => {
    // Cleanup function
    return () => {
      if (areaChartInstance.current) {
        areaChartInstance.current.destroy();
        areaChartInstance.current = null;
      }
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
        pieChartInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (areaChartRef.current && pieChartRef.current) {
      if (areaChartInstance.current) areaChartInstance.current.destroy();
      if (pieChartInstance.current) pieChartInstance.current.destroy();

      // Area Chart
      const areaCtx = areaChartRef.current.getContext("2d");
      if (areaCtx) {
        areaChartInstance.current = new Chart(areaCtx, {
          type: "line",
          data: {
            labels: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            datasets: [
              {
                label: "Series 1",
                data: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            scales: { y: { beginAtZero: true } },
          },
        });
      }

      // Pie Chart
      const pieCtx = pieChartRef.current.getContext("2d");
      if (pieCtx) {
        pieChartInstance.current = new Chart(pieCtx, {
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
    }
  }, []);

  // ...existing code...

  const navigateToHRModule = () => {
    router.push("/hr-module");
  };

  return (
    <div>
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-2 rounded-xl flex flex-col items-center justify-center text-center">
          <h2 className="text-lg w-full">HR manager</h2>
          <button
            className="mt-2 bg-blue-700 px-2 py-1 rounded text-sm w-full sm:w-auto"
            onClick={navigateToHRModule}
          >
            View Details
          </button>
        </div>
        <div className="bg-yellow-500 text-white p-2 rounded-xl flex flex-col items-center justify-center text-center">
          <h2 className="text-lg w-full">Payroll</h2>
          <button className="mt-2 bg-yellow-700 px-2 py-1 rounded text-sm w-full sm:w-auto">
            View Details
          </button>
        </div>
        <div className="bg-green-500 text-white p-2 rounded-xl flex flex-col items-center justify-center text-center">
          <h2 className="text-lg w-full">Procurement</h2>
          <button className="mt-2 bg-green-700 px-2 py-1 rounded text-sm w-full sm:w-auto">
            View Details
          </button>
        </div>
        <div className="bg-red-500 text-white p-2 rounded-xl flex flex-col items-center justify-center text-center">
          <h2 className="text-lg w-full">Lookup</h2>
          <button className="mt-2 bg-red-700 px-2 py-1 rounded text-sm w-full sm:w-auto">
            View Details
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Area Chart</h2>
          <canvas ref={areaChartRef}></canvas>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">
            HR employees based on department
          </h2>
          <canvas ref={pieChartRef}></canvas>
        </div>
      </div>

      {/* Employee Table section removed */}
    </div>
  );
}
