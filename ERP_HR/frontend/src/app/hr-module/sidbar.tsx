"use client";
import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
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
  FiUser,
  FiCheck,
  FiSend,
  FiCalendar,
  FiRepeat,
  FiCheckCircle,
  FiArrowLeftCircle,
  FiArrowRightCircle,
  FiThumbsUp,
  FiTrendingUp,
  FiEdit,
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
import ApprovalIcon from "@mui/icons-material/Approval";

interface SidebarProps {
  className?: string;
  hidden?: boolean;
}

type UserRole = "SUPER_ADMIN" | "ADMIN" | "HR" | "DEPARTMENT" | "EMPLOYEE";

export default function Sidebar({ className, hidden = false }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState({
    dashboard: false,
    organization: false,
    employee: false,
    leave: false,
    documents: false,
    separation: false,
    AuthorityDelegation: false,
    transferRequest: false,
    UserManagement: false,
  });

  // Get current user role from localStorage
  let userRole: UserRole | null = null;
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        userRole = JSON.parse(storedUser).role;
      } catch {
        userRole = null;
      }
    }
  }

  const toggleMenu = (menu: keyof typeof openMenus) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  if (hidden) return null;

  return (
    <aside
      className={`bg-gray-800 text-white w-64 shadow-lg ${
        className || ""
      } fixed left-0 z-50 md:static md:top-auto md:left-auto md:z-auto`}
      style={{
        top:
          typeof window !== "undefined" && window.innerWidth < 768
            ? "48px"
            : undefined,
        height:
          typeof window !== "undefined" && window.innerWidth < 768
            ? "calc(100vh - 48px)"
            : undefined,
        transition: "transform 0.3s ease",
      }}
    >
      <nav className="h-full flex flex-col md:h-auto">
        <div className="overflow-y-auto flex-grow p-4 md:overflow-visible md:p-4">
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
              {openMenus.dashboard ? <FiChevronUp /> : <FiChevronDown />}
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
                  href="/dashboard"
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
              {openMenus.organization ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openMenus.organization && (
              <div className="ml-6 mt-1 space-y-2">
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole === "SUPER_ADMIN" ||
                      userRole === "DEPARTMENT"
                    ) {
                      window.location.href =
                        "/hr-module/organizational-structure";
                    } else {
                      e.preventDefault();
                      Swal.fire({
                        icon: "warning",
                        title: "Access Denied",
                        text: "You do not have permission to access this module.",
                        confirmButtonColor: "#3c8dbc",
                      });
                    }
                  }}
                >
                  <FiLayers className="w-4 h-4" />
                  Organizational Structure
                </a>
                <Link
                  href="/hr-module/salary-settings"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                >
                  <FiDollarSign className="w-4 h-4" />
                  Salary Settings
                </Link>
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["ADMIN", "HR", "DEPARTMENT"].includes(userRole)
                    ) {
                      window.location.href = "/hr-module/register-jobs";
                    } else {
                      e.preventDefault();
                      Swal.fire({
                        icon: "warning",
                        title: "Access Denied",
                        text: "You do not have permission to access this module.",
                        confirmButtonColor: "#3c8dbc",
                      });
                    }
                  }}
                >
                  <FiFileText className="w-4 h-4" />
                  Register Jobs
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["ADMIN", "HR", "DEPARTMENT"].includes(userRole)
                    ) {
                      window.location.href = "/hr-module/job-qualifications";
                    } else {
                      e.preventDefault();
                      Swal.fire({
                        icon: "warning",
                        title: "Access Denied",
                        text: "You do not have permission to access this module.",
                        confirmButtonColor: "#3c8dbc",
                      });
                    }
                  }}
                >
                  <FiAward className="w-4 h-4" />
                  Job Qualifications
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["ADMIN", "HR", "DEPARTMENT"].includes(userRole)
                    ) {
                      window.location.href = "/hr-module/jobs-by-family";
                    } else {
                      e.preventDefault();
                      Swal.fire({
                        icon: "warning",
                        title: "Access Denied",
                        text: "You do not have permission to access this module.",
                        confirmButtonColor: "#3c8dbc",
                      });
                    }
                  }}
                >
                  <FiUsers className="w-4 h-4" />
                  Jobs Under Family
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["ADMIN", "HR", "DEPARTMENT"].includes(userRole)
                    ) {
                      window.location.href = "/hr-module/jobs-by-department";
                    } else {
                      e.preventDefault();
                      Swal.fire({
                        icon: "warning",
                        title: "Access Denied",
                        text: "You do not have permission to access this module.",
                        confirmButtonColor: "#3c8dbc",
                      });
                    }
                  }}
                >
                  <FiArchive className="w-4 h-4" />
                  Jobs Under Department
                </a>
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
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["EMPLOYEE", "HR", "ADMIN", "DEPARTMENT"].includes(
                        userRole
                      )
                    ) {
                      window.location.href = "/hr-module/transfer-requests";
                    } else {
                      e.preventDefault();
                      Swal.fire({
                        icon: "warning",
                        title: "Access Denied",
                        text: "You do not have permission to access this module.",
                        confirmButtonColor: "#3c8dbc",
                      });
                    }
                  }}
                >
                  <FiSend className="w-4 h-4" />
                  Transfer Request
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (userRole === "DEPARTMENT") {
                      window.location.href = "/hr-module/approve-dept-from";
                    } else {
                      e.preventDefault();
                      Swal.fire({
                        icon: "warning",
                        title: "Access Denied",
                        text: "You do not have permission to access this module.",
                        confirmButtonColor: "#3c8dbc",
                      });
                    }
                  }}
                >
                  <FiArrowLeftCircle className="w-4 h-4" />
                  Approve Dept From
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (userRole === "DEPARTMENT") {
                      window.location.href = "/hr-module/approve-dept-to";
                    } else {
                      e.preventDefault();
                      Swal.fire({
                        icon: "warning",
                        title: "Access Denied",
                        text: "You do not have permission to access this module.",
                        confirmButtonColor: "#3c8dbc",
                      });
                    }
                  }}
                >
                  <FiArrowRightCircle className="w-4 h-4" />
                  Approve Dept To
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (userRole && ["ADMIN", "HR"].includes(userRole)) {
                      window.location.href = "/hr-module/hr-approve";
                    } else {
                      e.preventDefault();
                      Swal.fire({
                        icon: "warning",
                        title: "Access Denied",
                        text: "You do not have permission to access this module.",
                        confirmButtonColor: "#3c8dbc",
                      });
                    }
                  }}
                >
                  <FiThumbsUp className="w-4 h-4" />
                  Hr Approve
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (userRole && ["ADMIN", "HR"].includes(userRole)) {
                      window.location.href = "/hr-module/hr-promotion";
                    } else {
                      e.preventDefault();
                      Swal.fire({
                        icon: "warning",
                        title: "Access Denied",
                        text: "You do not have permission to access this module.",
                        confirmButtonColor: "#3c8dbc",
                      });
                    }
                  }}
                >
                  <FiTrendingUp className="w-4 h-4" />
                  Hr Promotion
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (userRole && ["ADMIN", "HR"].includes(userRole)) {
                      window.location.href = "/hr-module/hr-promotion-approve";
                    } else {
                      e.preventDefault();
                      Swal.fire({
                        icon: "warning",
                        title: "Access Denied",
                        text: "You do not have permission to access this module.",
                        confirmButtonColor: "#3c8dbc",
                      });
                    }
                  }}
                >
                  <ApprovalIcon className="w-4 h-4" />
                  Hr Promotion Approve
                </a>
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
                <FaUserShield className="w-4 h-4" />
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
                  <FontAwesomeIcon icon={faUserPlus} className="w-4 h-4" />
                  Assign Delegation
                </Link>
                <Link
                  href="/hr-module/Authority-Delegation/Assign-Delegation"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                >
                  <FontAwesomeIcon
                    icon={faUserFriendsSolid}
                    className="w-4 h-4"
                  />
                  Delegation Benefit
                </Link>
                <Link
                  href="/hr-module/Authority-Delegation/Terminate-Delegation"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                >
                  <XCircleIcon className="w-4 h-4 " />
                  Terminate Delegation
                </Link>
                <Link
                  href="/hr-module/Authority-Delegation/Delegation-History"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                >
                  <FaHistory className="w-4 h-4" />
                  Delegation History
                </Link>
              </div>
            )}
          </div>
          {/* User Management - Only for SUPER_ADMIN */}
          {userRole === "SUPER_ADMIN" && (
            <div>
              <button
                onClick={() => toggleMenu("UserManagement")}
                className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
              >
                <div className="flex items-center gap-2">
                  <FiUser className="exit-icon" />
                  <span>User Management</span>
                </div>
                {openMenus.UserManagement ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {openMenus.UserManagement && (
                <div className="ml-6 mt-1 space-y-2">
                  <Link
                    href="/hr-module/user-management"
                    className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  >
                    <FiEdit className="separation-request-icon" />
                    Manage Users
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
