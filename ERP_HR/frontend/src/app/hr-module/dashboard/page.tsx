"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import Header from "@/app/components/HrHeader";
import Sidebar from "@/app/hr-module/sidbar";

export default function HRModule() {
    const [sidebarHidden, setSidebarHidden] = useState(false);
    const pieChartRef = useRef<HTMLCanvasElement | null>(null);
    const pieChartInstanceRef = useRef<Chart | null>(null); // ✅ CHART INSTANCE REF

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 3;

    const employees = [
        { name: "John Doe", department: "Engineering", position: "Software Engineer", salary: "$100,000" },
        { name: "Jane Smith", department: "Management", position: "Project Manager", salary: "$120,000" },
        { name: "Bob Johnson", department: "Economics", position: "Economist", salary: "$90,000" },
        { name: "Alice Brown", department: "Marketing", position: "Marketing Specialist", salary: "$80,000" },
        { name: "Charlie Davis", department: "Others", position: "Administrative Assistant", salary: "$50,000" },
    ];

    const totalPages = Math.ceil(employees.length / rowsPerPage);
    const currentRows = employees.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    useEffect(() => {
        if (pieChartRef.current) {
            const ctx = pieChartRef.current.getContext("2d");

            if (ctx) {
                // Destroy existing chart before creating a new one
                if (pieChartInstanceRef.current) {
                    pieChartInstanceRef.current.destroy();
                }

                pieChartInstanceRef.current = new Chart(ctx, {
                    type: "pie",
                    data: {
                        labels: ["Engineering", "Management", "Economics", "Marketing", "Others"],
                        datasets: [
                            {
                                data: [14.8, 4.9, 2.6, 1.5, 5.5],
                                backgroundColor: ["#4CAF50", "#FF9800", "#F44336", "#2196F3", "#9C27B0"],
                            },
                        ],
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

        return () => {
            if (pieChartInstanceRef.current) {
                pieChartInstanceRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Header toggleSidebar={() => setSidebarHidden(!sidebarHidden)} />
            <div className="flex flex-1">
                <Sidebar className={sidebarHidden ? "hidden" : ""} />
                <div className="flex-1 p-6 overflow-auto">
                    <h1 className="text-2xl font-bold mb-6">HR Module Dashboard</h1>

                    {/* Pie Chart */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-xl font-bold mb-4">HR Employees by Department</h2>
                            <canvas ref={pieChartRef}></canvas>
                        </div>
                    </div>

                    {/* Employee Table */}
                    <div className="bg-white p-4 rounded shadow mb-6">
                        <h2 className="text-xl font-bold mb-4">Employee Table</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b-2 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                        <th className="py-2 px-4 border-b-2 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                                        <th className="py-2 px-4 border-b-2 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Position</th>
                                        <th className="py-2 px-4 border-b-2 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Salary</th>
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
            </div>
            <footer className="bg-gray-800 text-white p-4 text-center">
                © {new Date().getFullYear()} INSA ERP. All rights reserved.
            </footer>
        </div>
    );
}
