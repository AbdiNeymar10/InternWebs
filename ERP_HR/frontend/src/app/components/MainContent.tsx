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
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;

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
      // Destroy existing charts before creating new ones
      if (areaChartInstance.current) areaChartInstance.current.destroy();
      if (pieChartInstance.current) pieChartInstance.current.destroy();

      // Area Chart
      const areaCtx = areaChartRef.current.getContext("2d");
      if (areaCtx) {
        areaChartInstance.current = new Chart(areaCtx, {
          type: "line",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
              label: "Series 1",
              data: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
              fill: true,
            }],
          },
          options: {
            responsive: true,
            scales: { y: { beginAtZero: true } }
          },
        });
      }

      // Pie Chart
      const pieCtx = pieChartRef.current.getContext("2d");
      if (pieCtx) {
        pieChartInstance.current = new Chart(pieCtx, {
          type: "pie",
          data: {
            labels: ["Engineering", "Management", "Economics", "Marketing", "Others"],
            datasets: [{
              data: [14.8, 4.9, 2.6, 1.5, 5.5],
              backgroundColor: ["#4CAF50", "#FF9800", "#F44336", "#2196F3", "#9C27B0"],
            }],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: "top" },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw} %`,
                },
              },
            },
          },
        });
      }
    }
  }, []);

  const employees = [
    { name: "John Doe", department: "Engineering", position: "Software Engineer", salary: "$100,000" },
    { name: "Jane Smith", department: "Management", position: "Project Manager", salary: "$120,000" },
    { name: "Bob Johnson", department: "Economics", position: "Economist", salary: "$90,000" },
    { name: "Alice Brown", department: "Marketing", position: "Marketing Specialist", salary: "$80,000" },
    { name: "Charlie Davis", department: "Others", position: "Administrative Assistant", salary: "$50,000" },
  ];

  const totalPages = Math.ceil(employees.length / rowsPerPage);
  const currentRows = employees.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const navigateToHRModule = () => {
    router.push("/hr-dashboard");
  };

  return (
    <div>
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-2 rounded">
          <h2 className="text-lg">HR manager</h2>
          <button
            className="mt-2 bg-blue-700 px-2 py-1 rounded text-sm"
            onClick={navigateToHRModule}
          >
            View Details
          </button>
        </div>
        <div className="bg-yellow-500 text-white p-2 rounded">
          <h2 className="text-lg">Payroll</h2>
          <button className="mt-2 bg-yellow-700 px-2 py-1 rounded text-sm">
            View Details
          </button>
        </div>
        <div className="bg-green-500 text-white p-2 rounded">
          <h2 className="text-lg">Procurement</h2>
          <button className="mt-2 bg-green-700 px-2 py-1 rounded text-sm">
            View Details
          </button>
        </div>
        <div className="bg-red-500 text-white p-2 rounded">
          <h2 className="text-lg">Lookup</h2>
          <button className="mt-2 bg-red-700 px-2 py-1 rounded text-sm">
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
          <h2 className="text-xl font-bold mb-4">HR employees based on department</h2>
          <canvas ref={pieChartRef}></canvas>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Employee Table</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Department
                </th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Position
                </th>
                <th className="py-2 px-4 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Salary
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((employee, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-200">{employee.name}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{employee.department}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{employee.position}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{employee.salary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}