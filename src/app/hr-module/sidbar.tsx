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
  FiArrowLeftCircle,
  FiArrowRightCircle,
  FiThumbsUp,
  FiTrendingUp,
  FiUser,
  FiCheck,
  FiCalendar,
} from "react-icons/fi";
import {
  FaTachometerAlt,
  FaUserShield,
  FaUserTie,
  FaHandshake,
  FaHistory,
  FaUserFriends,
} from "react-icons/fa";
import { CalendarDaysIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {
  faUserPlus,
  faHandshake as faHandshakeSolid,
  faUserFriends as faUserFriendsSolid,
  faPeopleArrows,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MdOutlineCancel } from "react-icons/md";

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
    employee: false,
    leave: false,
    documents: false,
    separation: false,
    AuthorityDelegation: false,
  });

  const toggleMenu = (
    menu:
      | "dashboard"
      | "organization"
      | "transferRequest"
      | "employee"
      | "leave"
      | "documents"
      | "separation"
      | "AuthorityDelegation"
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
              <Link
                href="/hr-module/approve-dept-from"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiArrowLeftCircle className="w-4 h-4" />
                Approve Dept From
              </Link>
              <Link
                href="/hr-module/approve-dept-to"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiArrowRightCircle className="w-4 h-4" />
                Approve Dept To
              </Link>
              <Link
                href="/hr-module/hr-approve"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiThumbsUp className="w-4 h-4" />
                Hr Approve
              </Link>
              <Link
                href="/hr-module/hr-promotion"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiTrendingUp className="w-4 h-4" />
                Hr Promotion
              </Link>
              <Link
                href="/hr-module/hr-promotion-approve"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiTrendingUp className="w-4 h-4" />
                Promotion Approve
              </Link>
            </div>
          )}
        </div>

        {/* Employee Profile Dropdown */}
        <div>
          <button
            onClick={() => toggleMenu("employee")}
            className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
          >
            <div className="flex items-center gap-2">
              <FiUser className="w-4 h-4" />
              <span>Employee Profile</span>
            </div>
            {openMenus.employee ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {openMenus.employee && (
            <div className="ml-6 mt-1 space-y-2">
              <Link
                href="/hr-module/Employee-Profile"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiUser className="w-4 h-4" />
                Employee Info
              </Link>
            </div>
          )}
        </div>

        {/* Leave Dropdown */}
        <div>
          <button
            onClick={() => toggleMenu("leave")}
            className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
          >
            <div className="flex items-center gap-2">
              <FiCalendar className="w-4 h-4" />
              <span>Leave</span>
            </div>
            {openMenus.leave ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {openMenus.leave && (
            <div className="ml-6 mt-1 space-y-2">
              <Link
                href="/hr-module/Leave/leave-setting"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiSettings className="w-4 h-4" />
                Leave Setting
              </Link>
              <Link
                href="/hr-module/Leave/leave-schedule"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <CalendarDaysIcon className="w-4 h-4" />
                Leave Schedule
              </Link>
              <Link
                href="/hr-module/Leave/leave-schedule-approve"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiCalendar className="w-4 h-4" />
                Leave Schedule Approve
              </Link>
              <Link
                href="/hr-module/Leave/leave-types"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiCalendar className="w-4 h-4" />
                Leave Types
              </Link>
              <Link
                href="/hr-module/Leave/leave-request"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiSend className="w-4 h-4" />
                Leave Request
              </Link>
              <Link
                href="/hr-module/Leave/leave-approve"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiCheck className="w-4 h-4" />
                Leave Approve(Dept)
              </Link>
              <Link
                href="/hr-module/Leave/leave-approve-hr"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiCheck className="w-4 h-4" />
                Leave Approve(HR)
              </Link>
              <Link
                href="/hr-module/Leave/leave-transfer-request"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiCalendar className="w-4 h-4" />
                Leave Transfer Request
              </Link>
              <Link
                href="/hr-module/Leave/leave-transfer-approval"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiCalendar className="w-4 h-4" />
                Leave Transfer Approval
              </Link>
              <Link
                href="/hr-module/Leave/leave-balance"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiCalendar className="w-4 h-4" />
                Leave Balance
              </Link>
            </div>
          )}
        </div>

        {/* Document Dropdown */}
        <div>
          <button
            onClick={() => toggleMenu("documents")}
            className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
          >
            <div className="flex items-center gap-2">
              <FiFileText className="w-4 h-4" />
              <span>Documents</span>
            </div>
            {openMenus.documents ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {openMenus.documents && (
            <div className="ml-6 mt-1 space-y-2">
              <Link
                href="/hr-module/documents/Document_Request"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiSend className="w-4 h-4" />
                Document Request
              </Link>
              <Link
                href="/hr-module/documents/Document_Approval"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiCheck className="w-4 h-4" />
                Document Approval
              </Link>
            </div>
          )}
        </div>

        {/* Separation Dropdown */}
        <div>
          <button
            onClick={() => toggleMenu("separation")}
            className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
          >
            <div className="flex items-center gap-2">
              <FiCalendar className="w-4 h-4" />
              <span>Separation</span>
            </div>
            {openMenus.separation ? <FiChevronUp /> : <FiChevronDown />}
          </button>
          {openMenus.separation && (
            <div className="ml-6 mt-1 space-y-2">
              <Link
                href="/hr-module/separation/separation-request"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiSend className="w-4 h-4" />
                Separation Request
              </Link>
              <Link
                href="/hr-module/separation/separation-approve"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiCheck className="w-4 h-4" />
                Separation Approve (Dept)
              </Link>
              <Link
                href="/hr-module/separation/separation-approve-hr"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FiCheck className="w-4 h-4" />
                Separation Approve (HR)
              </Link>
            </div>
          )}
        </div>

        {/* Authority Delegation Dropdown */}
        <div>
          <button
            onClick={() => toggleMenu("AuthorityDelegation")}
            className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
          >
            <div className="flex items-center gap-2">
              <FaUserShield className="text-[#3c8dbc] mr-2" />
              <span>Authority Delegation</span>
            </div>
            {openMenus.AuthorityDelegation ? (
              <FiChevronUp />
            ) : (
              <FiChevronDown />
            )}
          </button>
          {openMenus.AuthorityDelegation && (
            <div className="ml-6 mt-1 space-y-2">
              <Link
                href="/hr-module/Authority-Delegation/Assign-Delegation"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                Assign Delegation
              </Link>
              <Link
                href="/hr-module/Authority-Delegation/Assign-Delegation"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FontAwesomeIcon
                  icon={faUserFriendsSolid}
                  className="text-[#3c8dbc] w-5 h-5"
                />
                Delegation Benefit
              </Link>
              <Link
                href="/hr-module/Authority-Delegation/Terminate-Delegation"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <XCircleIcon className="h-5 w-5 mr-2" />
                Terminate Delegation
              </Link>
              <Link
                href="/hr-module/Authority-Delegation/Delegation-History"
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
              >
                <FaHistory />
                Delegation History
              </Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
