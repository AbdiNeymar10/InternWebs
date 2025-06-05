"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiHome,
  FiPieChart,
  FiSettings,
  FiBriefcase,
  FiFileText,
  FiAward,
  FiUsers,
  FiDollarSign,
  FiChevronDown,
  FiChevronUp,
  FiLayers,
  FiArchive,
  FiRepeat,
  FiSend,
  FiCheckCircle,
} from "react-icons/fi";
import { FaTachometerAlt } from "react-icons/fa";

interface SidebarProps {
  className?: string;
  hidden?: boolean;
  isMobile?: boolean;
}

export default function Sidebar({ className, hidden, isMobile }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState({
    dashboard: false,
    organization: false,
    transferRequest: false,
  });

  const toggleMenu = (
    menu: "dashboard" | "organization" | "transferRequest"
  ) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <aside
      className={`bg-gray-800 text-white w-64 h-screen p-4 pt-8 ${
        className || ""
      } ${hidden ? "hidden" : "block"} ${
        !hidden && isMobile ? "fixed left-0 top-16 z-50" : ""
      }`}
      style={{
        overflowY: "auto",
      }}
    >
      <nav className="space-y-4">
        {/* Dashboard Dropdown */}
        <div>
          <button
            onClick={() => toggleMenu("dashboard")}
            className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
          >
            <div className="flex items-center gap-2">
              <FaTachometerAlt className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
            {openMenus.dashboard ? (
              <FiChevronUp className="w-4 h-4" />
            ) : (
              <FiChevronDown className="w-4 h-4" />
            )}
          </button>
          {openMenus.dashboard && (
            <div className="ml-6 mt-1 space-y-2">
              <Link
                href="/hr-module"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiHome className="w-4 h-4" />
                Home
              </Link>
              <Link
                href="/hr-module/dashboard"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FaTachometerAlt className="w-4 h-4" />
                Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* Organization Profile Dropdown */}
        <div>
          <button
            onClick={() => toggleMenu("organization")}
            className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
          >
            <div className="flex items-center gap-2">
              <FiBriefcase className="w-4 h-4" />
              <span>Organization Profile</span>
            </div>
            {openMenus.organization ? (
              <FiChevronUp className="w-4 h-4" />
            ) : (
              <FiChevronDown className="w-4 h-4" />
            )}
          </button>
          {openMenus.organization && (
            <div
              className="ml-6 mt-1 space-y-2"
              style={{
                maxHeight: "calc(100vh - 64px)", // Ensure dropdown fits within the viewport
                overflowY: "auto", // Enable scrolling if dropdown content overflows
              }}
            >
              <Link
                href="/hr-module/organizational-structure"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiLayers className="w-4 h-4" />
                Organizational Structure
              </Link>
              <Link
                href="/hr-module/salary-settings"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiDollarSign className="w-4 h-4" />
                Salary Settings
              </Link>
              <Link
                href="/hr-module/register-jobs"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiFileText className="w-4 h-4" />
                Register Jobs
              </Link>
              <Link
                href="/hr-module/job-qualifications"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiAward className="w-4 h-4" />
                Job Qualifications
              </Link>
              <Link
                href="/hr-module/jobs-by-family"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiUsers className="w-4 h-4" />
                Jobs Under Family
              </Link>
              <Link
                href="/hr-module/jobs-by-department"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiArchive className="w-4 h-4" />
                Jobs Under Department
              </Link>
            </div>
          )}
        </div>

        {/* Transfer Request Dropdown */}
        <div>
          <button
            onClick={() => toggleMenu("transferRequest")}
            className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
          >
            <div className="flex items-center gap-2">
              <FiRepeat className="w-4 h-4" />
              <span>Transfer</span>
            </div>
            {openMenus.transferRequest ? (
              <FiChevronUp className="w-4 h-4" />
            ) : (
              <FiChevronDown className="w-4 h-4" />
            )}
          </button>
          {openMenus.transferRequest && (
            <div
              className="ml-6 mt-1 space-y-2"
              style={{
                maxHeight: "calc(100vh - 64px)",
                overflowY: "auto",
              }}
            >
              <Link
                href="/hr-module/transfer-requests"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text"
              >
                <FiSend className="w-4 h-4" />
                Transfer Request
              </Link>
            </div>
          )}
          {openMenus.transferRequest && (
            <div
              className="ml-6 mt-1 space-y-2"
              style={{
                maxHeight: "calc(100vh - 64px)",
                overflowY: "auto",
              }}
            >
              <Link
                href="/hr-module/approve-dept-from"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiCheckCircle className="w-4 h-4" />
                Approve Dept From
              </Link>
            </div>
          )}
          {openMenus.transferRequest && (
            <div
              className="ml-6 mt-1 space-y-2"
              style={{
                maxHeight: "calc(100vh - 64px)",
                overflowY: "auto",
              }}
            >
              <Link
                href="/hr-module/approve-dept-to"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiCheckCircle className="w-4 h-4" />
                Approve Dept To
              </Link>
            </div>
          )}
          {openMenus.transferRequest && (
            <div
              className="ml-6 mt-1 space-y-2"
              style={{
                maxHeight: "calc(100vh - 64px)",
                overflowY: "auto",
              }}
            >
              <Link
                href="/hr-module/hr-approve"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiCheckCircle className="w-4 h-4" />
                Hr Approve
              </Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
