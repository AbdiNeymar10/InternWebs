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
import {
  ArrowUpTrayIcon,
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  ListBulletIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  className?: string;
  hidden?: boolean;
  isMobile?: boolean;
}

type UserRole = "SUPER_ADMIN" | "ADMIN" | "HR" | "DEPARTMENT" | "EMPLOYEE";

export default function Sidebar({
  className,
  hidden = false,
  isMobile = false,
}: SidebarProps) {
  const [openMenus, setOpenMenus] = useState({
    dashboard: false,
    organization: false,
    employee: false,
    leave: false,
    documents: false,
    separation: false,
    AuthorityDelegation: false,
    transferRequest: false,
    Requirement: false,
    Recruitment: false,
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
      } fixed left-0 z-50 md:static md:top-auto md:left-auto md:z-auto overflow-y-auto h-screen [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
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
        <div className="flex-grow p-4 md:overflow-visible md:p-4">
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
                    if (userRole === "ADMIN" || userRole === "DEPARTMENT") {
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
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["ADMIN", "HR", "DEPARTMENT"].includes(userRole)
                    ) {
                      window.location.href = "/hr-module/salary-settings";
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
                  <FiDollarSign className="w-4 h-4" />
                  Salary Settings
                </a>
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
                    if (
                      userRole &&
                      ["ADMIN", "DEPARTMENT"].includes(userRole)
                    ) {
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
                    if (
                      userRole &&
                      ["ADMIN", "DEPARTMENT"].includes(userRole)
                    ) {
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
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (userRole && ["ADMIN", "HR"].includes(userRole)) {
                      window.location.href = "/hr-module/Leave/leave-setting";
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
                  <FiSettings className="w-4 h-4" />
                  Leave Setting
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["EMPLOYEE", "ADMIN", "HR", "DEPARTMENT"].includes(
                        userRole
                      )
                    ) {
                      window.location.href = "/hr-module/Leave/leave-schedule";
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
                  <CalendarDaysIcon className="w-4 h-4" />
                  Leave Schedule
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (userRole && ["ADMIN", "HR"].includes(userRole)) {
                      window.location.href =
                        "/hr-module/Leave/leave-schedule-approve";
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
                  <FiCalendar className="w-4 h-4" />
                  Leave Schedule Approve
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (userRole && ["ADMIN", "HR"].includes(userRole)) {
                      window.location.href = "/hr-module/Leave/leave-types";
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
                  <FiCalendar className="w-4 h-4" />
                  Leave Types
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["EMPLOYEE", "ADMIN", "HR", "DEPARTMENT"].includes(
                        userRole
                      )
                    ) {
                      window.location.href = "/hr-module/Leave/leave-request";
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
                  Leave Request
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["ADMIN", "DEPARTMENT"].includes(userRole)
                    ) {
                      window.location.href = "/hr-module/Leave/leave-approve";
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
                  <FiCheck className="w-4 h-4" />
                  Leave Approve(Dept)
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (userRole && ["ADMIN", "HR"].includes(userRole)) {
                      window.location.href =
                        "/hr-module/Leave/leave-approve-hr";
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
                  <FiCheck className="w-4 h-4" />
                  Leave Approve(HR)
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["EMPLOYEE", "ADMIN", "HR", "DEPARTMENT"].includes(
                        userRole
                      )
                    ) {
                      window.location.href =
                        "/hr-module/Leave/leave-transfer-request";
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
                  <FiCalendar className="w-4 h-4" />
                  Leave Transfer Request
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (userRole && ["ADMIN", "HR"].includes(userRole)) {
                      window.location.href =
                        "/hr-module/Leave/leave-transfer-approval";
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
                  <FiCalendar className="w-4 h-4" />
                  Leave Transfer Approval
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["EMPLOYEE", "ADMIN", "HR", "DEPARTMENT"].includes(
                        userRole
                      )
                    ) {
                      window.location.href = "/hr-module/Leave/leave-balance";
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
                  <FiCalendar className="w-4 h-4" />
                  Leave Balance
                </a>
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
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["HR", "ADMIN", "EMPLOYEE", "DEPARTMENT"].includes(
                        userRole
                      )
                    ) {
                      window.location.href =
                        "/hr-module/documents/Document_Request";
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
                  Document Request
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (userRole && ["HR", "ADMIN"].includes(userRole)) {
                      window.location.href =
                        "/hr-module/documents/Document_Approval";
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
                  <FiCheck className="w-4 h-4" />
                  Document Approval
                </a>
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
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["HR", "ADMIN", "EMPLOYEE", "DEPARTMENT"].includes(
                        userRole
                      )
                    ) {
                      window.location.href =
                        "/hr-module/separation/separation-request";
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
                  Separation Request
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["ADMIN", "DEPARTMENT"].includes(userRole)
                    ) {
                      window.location.href =
                        "/hr-module/separation/separation-approve";
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
                  <FiCheck className="w-4 h-4" />
                  Separation Approve (Dept)
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (userRole && ["HR", "ADMIN"].includes(userRole)) {
                      window.location.href =
                        "/hr-module/separation/separation-approve-hr";
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
                  <FiCheck className="w-4 h-4" />
                  Separation Approve (HR)
                </a>
              </div>
            )}
          </div>
            
          <div>
            <button
              onClick={() => toggleMenu("Recruitment")}
              className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
            >
              <div className="flex items-center gap-2">
                <FiUsers className="w-4 h-4" />
                <span>Recruitment</span>
              </div>
              {openMenus.Recruitment ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openMenus.Recruitment && (
              <div className="ml-6 mt-1 space-y-2">
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["HR", "ADMIN", "EMPLOYEE", "DEPARTMENT"].includes(
                        userRole
                      )
                    ) {
                      window.location.href =
                        "/hr-module/Recruitment/Recruitment-Request";
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
                  Recruitment Request
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (userRole && ["HR", "ADMIN"].includes(userRole)) {
                      window.location.href =
                        "/hr-module/Recruitment/Recruitment-Approve";
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
                  Recruitment Approve
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["HR", "ADMIN", "EMPLOYEE", "DEPARTMENT"].includes(
                        userRole
                      )
                    ) {
                      window.location.href =
                        "/hr-module/Recruitment/Apply-Vacancy";
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
                  <ArrowUpTrayIcon className="h-4 w-4" />
                  Apply Vacancy
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["HR", "ADMIN", "DEPARTMENT"].includes(userRole)
                    ) {
                      window.location.href =
                        "/hr-module/Recruitment/Vacancy-Post";
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
                  <BriefcaseIcon className="h-4 w-4" />
                  Vacancy Post
                </a>
                {/* <Link
                  href="/hr-module/recruitment"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                >
                  <FiUsers className="w-4 h-4" />
                  Recruitment Dashboard
                </Link>
                <Link
                  href="/hr-module/recruitment/define-shortlisting-criteria"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                >
                  <FiArchive className="w-4 h-4" />
                  Shortlisting Criteria
                </Link>
                <Link
                  href="/hr-module/recruitment/filter-shortlisted-candidates"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                >
                  <FiArchive className="w-4 h-4" />
                  Shortlisted Candidates
                </Link>
                <Link
                  href="/hr-module/recruitment/post-vacancy"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                >
                  <FiArchive className="w-4 h-4" />
                  Post Vacancy
                </Link>
                <Link
                  href="/hr-module/recruitment/manage-job-application"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                >
                  <FiArchive className="w-4 h-4" />
                  Manage Job Applications
                </Link>
                <Link
                  href="/hr-module/recruitment/manage-recruitment-request"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                >
                  <FiArchive className="w-4 h-4" />
                  Manage Recruitment Request
                </Link>
                <Link
                  href="/hr-module/recruitment/maintain-exam-result"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                >
                  <FiArchive className="w-4 h-4" />
                  Maintain Exam Result
                </Link>
                <Link
                  href="/hr-module/recruitment/Apply-Vacancy"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                >
                  <FiArchive className="w-4 h-4" />
                  Apply Vaccancy
                </Link>
                <Link
                  href="/hr-module/recruitment/register-candidate-information"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                >
                  <FiArchive className="w-4 h-4" />
                  Candidate Information
                </Link>
                <Link
                  href="/hr-module/recruitment/view-vacancy"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                >
                  <FiArchive className="w-4 h-4" />
                  View Vacancy
                </Link> */}
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
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["HR", "ADMIN", "EMPLOYEE", "DEPARTMENT"].includes(
                        userRole
                      )
                    ) {
                      window.location.href =
                        "/hr-module/Authority-Delegation/Assign-Delegation";
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
                  <FontAwesomeIcon icon={faUserPlus} className="w-4 h-4" />
                  Assign Delegation
                </a>
                {/* <Link
                  href="/hr-module/Authority-Delegation/Assign-Delegation"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                >
                  <FontAwesomeIcon
                    icon={faUserFriendsSolid}
                    className="w-4 h-4"
                  />
                  Delegation Benefit
                </Link> */}
                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["HR", "ADMIN", "EMPLOYEE", "DEPARTMENT"].includes(
                        userRole
                      )
                    ) {
                      window.location.href =
                        "/hr-module/Authority-Delegation/Terminate-Delegation";
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
                  <XCircleIcon className="w-4 h-4 " />
                  Terminate Delegation
                </a>

                <a
                  href="#"
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-sm"
                  onClick={(e) => {
                    if (
                      userRole &&
                      ["HR", "ADMIN", "DEPARTMENT"].includes(userRole)
                    ) {
                      window.location.href =
                        "/hr-module/Authority-Delegation/Delegation-History";
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
                  <FaHistory className="w-4 h-4" />
                  Delegation History
                </a>
              </div>
            )}
          </div>
          {/* requirement section */}
          {/* <div>
            <button
              onClick={() => toggleMenu("Requirement")}
              className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
            >
              <div className="flex items-center gap-2">
                <ListBulletIcon className="h-4 w-4" />
                <span>Requirement</span>
              </div>
              {openMenus.Requirement ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            {openMenus.Requirement && (
              <div className="ml-6 mt-1 space-y-2">
             
              </div>
            )}
          </div> */}
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
