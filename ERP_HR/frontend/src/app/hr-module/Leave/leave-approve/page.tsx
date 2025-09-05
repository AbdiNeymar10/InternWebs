"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  FiX,
  FiBell,
  FiRefreshCw,
  FiUsers,
  FiCalendar,
  FiEdit3,
  FiCheckCircle,
  FiXCircle,
  FiMessageSquare,
  FiInfo as FiInfoIcon,
  FiChevronDown,
  FiChevronUp,
  FiFileText,
  FiUserCheck,
  FiClipboard,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";
import { authFetch } from "@/utils/authFetch";

const API_BASE_URL = "http://localhost:8080/api";

interface EmployeeDetails {
  empId: string;
  firstName: string;
  lastName: string;
  department?: string;
}

interface LeaveTypeDetails {
  id: number;
  leaveName: string;
}

interface LeaveRequestData {
  id: number;
  employee?: EmployeeDetails;
  leaveType?: LeaveTypeDetails;
  leaveStart: string;
  leaveEnd: string;
  requestedDays?: number;
  approvedDays?: number;
  deptStatus?: string;
  hrStatus?: string;
  dayType?: string;
  description?: string;
  remark?: string;
  incidentType?: string;
}

interface DepartmentApprovalUpdatePayload {
  status: string;
  remark: string;
  approvedDays: number;
  leaveStart: string;
  leaveEnd: string;
  requestedDays: number; // Ensure this is float or number
}

async function fetchWrapper(url: string, options?: RequestInit) {
  try {
    const response = await authFetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options?.headers,
      },
    });
    if (!response.ok) {
      let errorData = { message: `HTTP error! status: ${response.status}` };
      try {
        const jsonError = await response.json();
        errorData.message =
          jsonError.message ||
          jsonError.error ||
          (typeof jsonError === "string" ? jsonError : errorData.message);
      } catch (e) {
        if (response.statusText) {
          errorData.message = `HTTP error! status: ${response.status} - ${response.statusText}`;
        }
      }
      throw new Error(errorData.message);
    }
    if (
      response.status === 204 ||
      !response.headers.get("content-type")?.includes("application/json")
    ) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`API call failed to ${url}:`, error);
    throw error;
  }
}

async function fetchPendingDepartmentApprovals(): Promise<LeaveRequestData[]> {
  const response = await fetchWrapper(
    `${API_BASE_URL}/leave/request/pending/dept`
  );
  return Array.isArray(response) ? response : [];
}

async function updateDepartmentApproval(
  requestId: number,
  payload: DepartmentApprovalUpdatePayload
): Promise<LeaveRequestData | null> {
  return fetchWrapper(
    `${API_BASE_URL}/leave/request/approve/dept/${requestId}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
}

async function fetchDepartmentHistory(): Promise<LeaveRequestData[]> {
  const response = await fetchWrapper(
    `${API_BASE_URL}/leave/request/history/dept`
  );
  return Array.isArray(response) ? response : [];
}

// Function to fetch employees currently on HR-approved leave
async function fetchEmployeesOnLeave(): Promise<LeaveRequestData[]> {
  try {
    const response = await fetchWrapper(
      `${API_BASE_URL}/leave/request/approved-current`
    );
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Failed to fetch employees on leave:", error);
    toast.error("Could not load employees on leave.");
    return [];
  }
}

let globalNotifications: any[] = [];
export function getNotifications() {
  return [...globalNotifications];
}
export function addNotification(notification: any) {
  const exists = globalNotifications.some(
    (n) =>
      n.id === notification.id ||
      (n.requestId === notification.requestId && n.type === notification.type)
  );
  if (!exists) {
    globalNotifications = [notification, ...globalNotifications.slice(0, 19)];
  }
}
export function markNotificationsAsRead() {
  globalNotifications = globalNotifications.map((n) => ({ ...n, read: true }));
}

const InfoBlockStyled: React.FC<{
  label: string;
  value?: string | number;
  icon?: React.ReactNode;
  className?: string;
  valueClassName?: string;
}> = ({ label, value, icon, className = "", valueClassName = "" }) => (
  <div className={` ${className}`}>
    <label className="flex items-center text-xs font-medium text-slate-500 mb-1">
      {icon && <span className="mr-1.5 opacity-70">{icon}</span>}
      {label}
    </label>
    <div
      className={`w-full p-2.5 text-sm bg-slate-100 text-slate-700 border border-slate-200 rounded-md min-h-[40px] flex items-center ${valueClassName}`}
    >
      {value || <span className="text-slate-400 italic">N/A</span>}
    </div>
  </div>
);

const calculateRequestedDays = (
  startDateStr: string,
  endDateStr: string,
  dayType: string = "Full Day"
): number => {
  if (!startDateStr || !endDateStr) return 0;
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (
    isNaN(startDate.getTime()) ||
    isNaN(endDate.getTime()) ||
    endDate < startDate
  ) {
    return 0;
  }

  let diffInMilliseconds = endDate.getTime() - startDate.getTime();
  let calendarDays = diffInMilliseconds / (1000 * 60 * 60 * 24) + 1;

  if (dayType === "Half Day") {
    return calendarDays * 0.5;
  }
  return calendarDays;
};

export default function LeaveApprovalPage() {
  const [activeTab, setActiveTab] = useState("Current");
  const [editingRequest, setEditingRequest] = useState<LeaveRequestData | null>(
    null
  );
  const [showEditForm, setShowEditForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(getNotifications());
  const [pendingDeptApprovals, setPendingDeptApprovals] = useState<
    LeaveRequestData[]
  >([]);
  const [departmentHistory, setDepartmentHistory] = useState<
    LeaveRequestData[]
  >([]);
  const [employeesOnLeave, setEmployeesOnLeave] = useState<LeaveRequestData[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [showOnLeaveList, setShowOnLeaveList] = useState(true);

  const [formData, setFormData] = useState({
    id: null as number | null,
    employeeId: "",
    name: "",
    requestDays: 0,
    leaveType: "",
    leaveStart: "",
    leaveEnd: "",
    approvedDays: 0,
    remark: "",
    decision: "",
    description: "",
    dayType: "Full Day",
    incidentType: "",
  });

  const loadData = useCallback(async () => {
    setIsDataLoading(true);
    const loadToastId = toast.loading("Fetching data...");
    try {
      const [pendingResult, historyResult, onLeaveResult] =
        await Promise.allSettled([
          fetchPendingDepartmentApprovals(),
          fetchDepartmentHistory(),
          fetchEmployeesOnLeave(),
        ]);

      if (pendingResult.status === "fulfilled") {
        setPendingDeptApprovals(pendingResult.value || []);
      } else {
        console.error("Pending Dept Error:", pendingResult.reason);
        toast.error("Failed to load pending approvals.");
        setPendingDeptApprovals([]);
      }

      if (historyResult.status === "fulfilled") {
        setDepartmentHistory(historyResult.value || []);
      } else {
        console.error("Dept History Error:", historyResult.reason);
        toast.error("Failed to load department history.");
        setDepartmentHistory([]);
      }

      if (onLeaveResult.status === "fulfilled") {
        setEmployeesOnLeave(onLeaveResult.value || []);
      } else {
        console.error("On Leave Error:", onLeaveResult.reason);
        toast.error("Failed to load employees on leave.");
        setEmployeesOnLeave([]);
      }

      toast.success("Data loaded!", { id: loadToastId });
    } catch (error: any) {
      toast.error(error.message || "Failed to load data", {
        id: loadToastId,
      });
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const intervalId = setInterval(() => {
      const currentGlobalNotifications = getNotifications();
      if (
        currentGlobalNotifications.length !== notifications.length ||
        currentGlobalNotifications.some(
          (gn, i) =>
            gn.id !== notifications[i]?.id || gn.read !== notifications[i]?.read
        )
      ) {
        setNotifications(currentGlobalNotifications);
      }
    }, 3000);
    return () => clearInterval(intervalId);
  }, [loadData, notifications]);

  useEffect(() => {
    const newPendingForNotification = pendingDeptApprovals.filter(
      (req) => req.deptStatus === "Pending" || req.deptStatus === null
    );
    let newNotifsAdded = false;
    newPendingForNotification.forEach((request) => {
      if (!request.id) return;
      const exists = globalNotifications.some(
        (n) =>
          n.requestId === request.id &&
          (n.type === "new_request" || n.type === "new_leave_submission")
      );
      if (!exists && request.employee?.firstName) {
        addNotification({
          id: `new_req_dept_${request.id}_${Date.now()}`,
          title: "New Leave Request (Dept)",
          message: `${request.employee.firstName} ${
            request.employee.lastName || ""
          } (ID: ${request.employee.empId}) requires dept. approval for ${
            request.leaveType?.leaveName || "N/A"
          } leave.`,
          type: "new_request",
          requestId: request.id,
          read: false,
          timestamp: new Date(),
        });
        newNotifsAdded = true;
      }
    });
    if (newNotifsAdded) {
      setNotifications(getNotifications());
    }
  }, [pendingDeptApprovals]);

  const handleApproval = async (
    requestId: number,
    payload: DepartmentApprovalUpdatePayload
  ) => {
    setIsLoading(true);
    const actionVerb = payload.status.toLowerCase();
    const toastId = toast.loading(`Processing ${actionVerb}...`);
    try {
      const updatedRequest = await updateDepartmentApproval(requestId, payload);

      if (updatedRequest) {
        toast.success(`Leave ${actionVerb} successfully!`, { id: toastId });
        await loadData();
        setShowEditForm(false);
      } else {
        toast.error(
          `Failed to ${actionVerb} leave: Unexpected response from server.`,
          { id: toastId }
        );
      }
    } catch (error: any) {
      toast.error(`Failed to ${actionVerb} leave: ${error.message}`, {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (request: LeaveRequestData) => {
    if (!request?.employee || !request.id) {
      toast.error("Cannot edit: Essential request data missing.");
      return;
    }
    setEditingRequest(request);
    const initialRequestedDays = request.requestedDays ?? 0;
    setFormData({
      id: request.id,
      employeeId: request.employee.empId || "",
      name: `${request.employee.firstName || ""} ${
        request.employee.lastName || ""
      }`,
      requestDays: initialRequestedDays,
      dayType: request.dayType || "Full Day",
      description: request.description || "",
      leaveType: request.leaveType?.leaveName || "",
      leaveStart: request.leaveStart || "",
      leaveEnd: request.leaveEnd || "",
      approvedDays: request.approvedDays ?? initialRequestedDays,
      remark: request.remark || "",
      decision: request.deptStatus || "",
      incidentType: request.incidentType || "",
    });
    setShowEditForm(true);
  };

  useEffect(() => {
    if (showEditForm) {
      const newRequestedDays = calculateRequestedDays(
        formData.leaveStart,
        formData.leaveEnd,
        formData.dayType
      );
      if (newRequestedDays !== formData.requestDays) {
        setFormData((prev) => ({
          ...prev,
          requestDays: newRequestedDays,
          approvedDays: Math.min(prev.approvedDays, newRequestedDays), // Ensure approved days don't exceed new requested days
        }));
      }
    }
  }, [
    formData.leaveStart,
    formData.leaveEnd,
    formData.dayType,
    showEditForm,
    formData.requestDays, // Keep this to re-evaluate if it changes externally (though unlikely in this form)
    formData.approvedDays, // Keep this to re-evaluate if it changes externally
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "approvedDays" || name === "requestDays") {
      const numValue = parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.decision) {
      toast.error("Decision (Approve/Reject) is required.");
      return;
    }
    if (
      formData.decision === "Approved" &&
      formData.approvedDays > formData.requestDays
    ) {
      toast.error("Approved days cannot be greater than requested days.");
      return;
    }
    if (formData.decision === "Approved" && formData.approvedDays <= 0) {
      toast.error(
        "Approved days must be greater than 0 for an approved request."
      );
      return;
    }
    if (editingRequest?.id !== undefined) {
      const payload: DepartmentApprovalUpdatePayload = {
        status: formData.decision,
        remark: formData.remark,
        approvedDays: formData.approvedDays,
        leaveStart: formData.leaveStart,
        leaveEnd: formData.leaveEnd,
        requestedDays: formData.requestDays,
      };
      handleApproval(editingRequest.id, payload);
    } else {
      toast.error("Error: Cannot save changes without a request ID.");
    }
  };

  const handleMarkNotificationsAsRead = () => {
    markNotificationsAsRead();
    setNotifications(getNotifications());
  };

  const requestsToDisplay =
    activeTab === "Current" ? pendingDeptApprovals : departmentHistory;

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen p-6 font-sans relative bg-slate-100">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc]/5 via-[#3c8dbc]/5 to-purple-500/5 opacity-30"></div>
      </div>
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-[#3c8dbc]">
              Dept Leave Approval
            </h1>
            <div className="flex gap-2">
              {["Current", "History"].map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold relative overflow-hidden transition-all duration-300 ease-out ${
                    activeTab === tab
                      ? "bg-[#3c8dbc] text-white shadow-lg"
                      : "bg-white text-[#3c8dbc] hover:bg-[#3c8dbc]/10 border border-[#3c8dbc]/30"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="tabIndicatorDept"
                      className="absolute inset-0 bg-[#3c8dbc] rounded-lg -z-10"
                      style={{ originY: "0px" }}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications && unreadNotificationCount > 0) {
                  handleMarkNotificationsAsRead();
                }
              }}
              className="p-2.5 rounded-full bg-white text-[#3c8dbc] hover:bg-[#3c8dbc]/10 relative shadow-md border border-[#3c8dbc]/30 transition-colors"
              aria-label="Show notifications"
            >
              <FiBell size={20} />
              {unreadNotificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold border-2 border-white"
                >
                  {unreadNotificationCount}
                </motion.span>
              )}
            </motion.button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", damping: 20, stiffness: 250 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 overflow-hidden"
                >
                  <div className="p-3 bg-[#3c8dbc] text-white flex justify-between items-center">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n, index) => (
                        <motion.div
                          key={n.id || `notif-idx-${index}`}
                          className={`p-3 hover:bg-[#3c8dbc]/10 transition-colors ${
                            !n.read ? "bg-[#3c8dbc]/5 font-medium" : "bg-white"
                          }`}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div
                            className={`text-sm ${
                              !n.read ? "text-[#3c8dbc]" : "text-gray-800"
                            }`}
                          >
                            {n.title}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            {n.message}
                          </div>
                          <div className="text-[10px] text-gray-400 mt-1 text-right">
                            {new Date(n.timestamp).toLocaleString()}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white backdrop-blur-md rounded-xl border border-slate-200 shadow-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/80">
                  {[
                    "Emp ID",
                    "Name",
                    "Leave Type",
                    "Start",
                    "End",
                    "Days Req.",
                    "Days Appr.",
                    "Dept Status",
                    "HR Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3.5 px-4 text-slate-600 uppercase text-xs font-semibold tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isDataLoading && requestsToDisplay.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="py-10 text-center text-[#3c8dbc]"
                    >
                      <FiRefreshCw className="animate-spin inline-block mr-2 w-5 h-5" />
                      Loading {activeTab} Requests...
                    </td>
                  </tr>
                ) : !isDataLoading && requestsToDisplay.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="py-10 text-center text-gray-500"
                    >
                      No {activeTab.toLowerCase()} requests found.
                    </td>
                  </tr>
                ) : (
                  requestsToDisplay.map((req, index) => (
                    <tr
                      key={req.id || `req-idx-${index}`}
                      className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors duration-150"
                    >
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {req.employee?.empId || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">
                        {req.employee?.firstName} {req.employee?.lastName}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            req.leaveType?.leaveName === "Annual"
                              ? "bg-green-100 text-green-700"
                              : req.leaveType?.leaveName === "Sick"
                              ? "bg-sky-100 text-sky-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {req.leaveType?.leaveName || "N/A"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {req.leaveStart
                          ? new Date(req.leaveStart).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {req.leaveEnd
                          ? new Date(req.leaveEnd).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 text-center">
                        {req.requestedDays != null
                          ? req.requestedDays.toFixed(1)
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 text-center">
                        {req.approvedDays != null
                          ? req.approvedDays.toFixed(1)
                          : req.deptStatus === "Approved" ||
                            req.hrStatus === "Approved"
                          ? req.requestedDays != null
                            ? req.requestedDays.toFixed(1) // Fallback to requested if approved but approvedDays is null
                            : "N/A"
                          : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            req.deptStatus === "Approved"
                              ? "bg-green-100 text-green-800"
                              : req.deptStatus === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {req.deptStatus || "Pending"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            req.hrStatus === "Approved"
                              ? "bg-green-100 text-green-800"
                              : req.hrStatus === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {req.hrStatus || "N/A"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {activeTab === "Current" &&
                          (req.deptStatus === "Pending" ||
                            req.deptStatus === null) && (
                            <button
                              onClick={() => handleEdit(req)}
                              className="text-[#3c8dbc] text-xs font-semibold hover:text-[#3c8dbc]/80 hover:underline transition-colors"
                            >
                              Review
                            </button>
                          )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Section for Employees Currently On Leave */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10"
        >
          <button
            onClick={() => setShowOnLeaveList(!showOnLeaveList)}
            className="w-full flex justify-between items-center text-left text-2xl font-semibold text-[#3c8dbc] mb-4 p-3 bg-white rounded-lg shadow-sm hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3c8dbc]"
            aria-expanded={showOnLeaveList}
            aria-controls="employees-on-leave-list-dept"
          >
            <span className="flex items-center">
              <FiUsers className="mr-3 text-2xl" />
              Employees Currently On Leave (HR Approved)
            </span>
            <motion.div
              animate={{ rotate: showOnLeaveList ? 0 : -90 }}
              transition={{ duration: 0.2 }}
            >
              {showOnLeaveList ? (
                <FiChevronUp size={24} />
              ) : (
                <FiChevronDown size={24} />
              )}
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {showOnLeaveList && (
              <motion.div
                id="employees-on-leave-list-dept"
                key="content-dept-on-leave"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto", marginTop: "0rem" },
                  collapsed: { opacity: 0, height: 0, marginTop: "0rem" },
                }}
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden"
              >
                {isDataLoading && employeesOnLeave.length === 0 ? (
                  <div className="py-10 text-center text-[#3c8dbc] bg-white backdrop-blur-md rounded-xl border border-slate-200 shadow-xl p-4">
                    <FiRefreshCw className="animate-spin inline-block mr-2 w-5 h-5" />
                    Loading On Leave Data...
                  </div>
                ) : !isDataLoading && employeesOnLeave.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 bg-white backdrop-blur-md rounded-xl border border-slate-200 shadow-xl p-4">
                    <FiCalendar
                      className="mx-auto text-gray-400 mb-2"
                      size={32}
                    />
                    No employees currently on HR-approved leave.
                  </div>
                ) : (
                  <div className="bg-white backdrop-blur-md rounded-xl border border-slate-200 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-100/80">
                            {[
                              "Emp ID",
                              "Name",
                              "Leave Type",
                              "Start Date",
                              "End Date",
                              "Approved Days",
                            ].map((h) => (
                              <th
                                key={h + "-dept-onleave-header"}
                                className="text-left py-3.5 px-4 text-slate-600 uppercase text-xs font-semibold tracking-wider"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {employeesOnLeave.map((req, index) => (
                            <tr
                              key={req.id || `dept-onleave-idx-${index}`}
                              className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors duration-150"
                            >
                              <td className="py-3 px-4 text-sm text-gray-700">
                                {req.employee?.empId || "N/A"}
                              </td>
                              <td className="py-3 px-4 text-sm font-medium text-gray-800">
                                {req.employee?.firstName}{" "}
                                {req.employee?.lastName}
                              </td>
                              <td className="py-3 px-4 text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    req.leaveType?.leaveName === "Annual"
                                      ? "bg-green-100 text-green-700"
                                      : req.leaveType?.leaveName === "Sick"
                                      ? "bg-sky-100 text-sky-700"
                                      : "bg-purple-100 text-purple-700"
                                  }`}
                                >
                                  {req.leaveType?.leaveName || "N/A"}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {req.leaveStart
                                  ? new Date(
                                      req.leaveStart
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {req.leaveEnd
                                  ? new Date(req.leaveEnd).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-700">
                                {req.approvedDays != null
                                  ? req.approvedDays.toFixed(1)
                                  : "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Edit Modal */}
        <AnimatePresence>
          {showEditForm && editingRequest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
              onClick={() => setShowEditForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{
                  type: "spring",
                  damping: 20,
                  stiffness: 250,
                  duration: 0.3,
                }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-5 flex justify-between items-center border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
                  <h2 className="text-lg font-semibold text-[#3c8dbc] flex items-center">
                    Review Leave Request
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90, color: "#ef4444" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEditForm(false)}
                    className="text-slate-400 p-1.5 rounded-full hover:bg-slate-200 transition-all duration-200"
                    aria-label="Close edit form"
                  >
                    <FiX size={20} />
                  </motion.button>
                </div>

                <div className="overflow-y-auto px-6 py-6 max-h-[calc(80vh-130px)] space-y-6">
                  <form onSubmit={handleSubmitEdit} className="space-y-6">
                    <section className="p-5 border border-slate-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-md font-semibold text-slate-700 mb-4 border-b border-slate-200 pb-2.5 flex items-center">
                        <FiFileText className="mr-2 text-slate-500" />
                        Request Details & Decision
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <InfoBlockStyled
                          label="Employee Name"
                          value={formData.name}
                          icon={<FiUserCheck size={12} />}
                        />
                        <InfoBlockStyled
                          label="Employee ID"
                          value={formData.employeeId}
                          icon={<FiUserCheck size={12} />}
                        />
                        <InfoBlockStyled
                          label="Leave Type"
                          value={formData.leaveType}
                          icon={<FiClipboard size={12} />}
                        />
                        <InfoBlockStyled
                          label="Incident Type"
                          value={formData.incidentType}
                          icon={<FiInfoIcon size={12} />}
                        />
                        <div>
                          <label
                            htmlFor="leaveStartEdit"
                            className="flex items-center text-xs font-medium text-slate-500 mb-1"
                          >
                            <FiCalendar
                              className="mr-1.5 opacity-70"
                              size={12}
                            />
                            Start Date
                          </label>
                          <input
                            type="date"
                            id="leaveStartEdit"
                            name="leaveStart"
                            value={formData.leaveStart}
                            onChange={handleInputChange}
                            className="w-full p-2.5 text-sm bg-slate-50 text-slate-700 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="leaveEndEdit"
                            className="flex items-center text-xs font-medium text-slate-500 mb-1"
                          >
                            <FiCalendar
                              className="mr-1.5 opacity-70"
                              size={12}
                            />
                            End Date
                          </label>
                          <input
                            type="date"
                            id="leaveEndEdit"
                            name="leaveEnd"
                            value={formData.leaveEnd}
                            onChange={handleInputChange}
                            min={formData.leaveStart}
                            className="w-full p-2.5 text-sm bg-slate-50 text-slate-700 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                          />
                        </div>
                        <InfoBlockStyled
                          label="Day Type"
                          value={formData.dayType}
                        />
                        <InfoBlockStyled
                          label="Requested Days"
                          value={formData.requestDays.toFixed(1)}
                        />
                        {formData.description && (
                          <div className="md:col-span-2 mt-2 pt-2 border-t border-slate-200/60">
                            <InfoBlockStyled
                              label="Description/Reason"
                              value={formData.description}
                              icon={<FiMessageSquare size={12} />}
                              valueClassName="min-h-[60px] leading-relaxed whitespace-pre-wrap"
                            />
                          </div>
                        )}
                        <div className="md:col-span-2 mt-4 pt-4 border-t border-dashed border-slate-300">
                          <h4 className="text-sm font-semibold text-slate-600 mb-3">
                            Department Action
                          </h4>
                        </div>
                        <div className="md:col-span-1">
                          <label
                            htmlFor="decisionEditDept"
                            className="block text-sm font-medium text-slate-700 mb-1.5"
                          >
                            Action <span className="text-red-500">*</span>
                          </label>
                          <div className="relative group">
                            <select
                              id="decisionEditDept"
                              name="decision"
                              value={formData.decision}
                              onChange={handleInputChange}
                              className="w-full pl-4 pr-10 py-2.5 text-sm border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] transition-all duration-150 appearance-none cursor-pointer hover:border-[#3c8dbc]/70"
                              required
                            >
                              <option value="" className="text-slate-400">
                                -- Select Action --
                              </option>
                              <option
                                value="Approved"
                                className="text-green-600 font-medium"
                              >
                                Approve
                              </option>
                              <option
                                value="Rejected"
                                className="text-red-600 font-medium"
                              >
                                Reject
                              </option>
                            </select>
                            <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-hover:text-[#3c8dbc] transition-colors" />
                          </div>
                        </div>
                        <div className="md:col-span-1">
                          <label
                            htmlFor="approvedDaysEditDept"
                            className="block text-sm font-medium text-slate-700 mb-1.5"
                          >
                            Approved Days{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="flex items-center gap-2">
                            <motion.button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  approvedDays: Math.max(
                                    0,
                                    prev.approvedDays - 0.5
                                  ),
                                }))
                              }
                              className="p-2 bg-slate-200 border border-slate-300 rounded-lg hover:bg-slate-300 transition-colors text-slate-700 shadow-sm"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              aria-label="Decrease approved days"
                            >
                              <FiMinus size={16} />
                            </motion.button>
                            <input
                              id="approvedDaysEditDept"
                              type="number"
                              name="approvedDays"
                              value={formData.approvedDays}
                              onChange={handleInputChange}
                              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] transition-all duration-150 text-center"
                              step="0.5"
                              min="0"
                              max={formData.requestDays}
                              required
                            />
                            <motion.button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  approvedDays: Math.min(
                                    prev.requestDays, // Ensure not exceeding requested days
                                    prev.approvedDays + 0.5
                                  ),
                                }))
                              }
                              className="p-2 bg-slate-200 border border-slate-300 rounded-lg hover:bg-slate-300 transition-colors text-slate-700 shadow-sm"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              aria-label="Increase approved days"
                            >
                              <FiPlus size={16} />
                            </motion.button>
                          </div>
                          {formData.requestDays < formData.approvedDays && (
                            <p className="text-xs text-red-500 mt-1">
                              Approved days cannot exceed requested days (
                              {formData.requestDays.toFixed(1)}).
                            </p>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label
                            htmlFor="remarkEditDept"
                            className="block text-sm font-medium text-slate-700 mb-1.5"
                          >
                            Remarks{" "}
                            <span className="text-xs text-slate-500">
                              (Optional for approval, Required for rejection)
                            </span>
                          </label>
                          <textarea
                            id="remarkEditDept"
                            rows={3}
                            name="remark"
                            value={formData.remark}
                            onChange={handleInputChange}
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] transition-all duration-150 placeholder-slate-400"
                            placeholder="Provide comments or reasons for the decision..."
                            required={formData.decision === "Rejected"}
                          />
                        </div>
                      </div>
                    </section>

                    <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-3 items-center">
                      <motion.button
                        type="submit"
                        disabled={
                          isLoading ||
                          !formData.decision ||
                          (formData.decision === "Rejected" &&
                            !formData.remark.trim()) ||
                          formData.requestDays < formData.approvedDays || // This check is important
                          (formData.decision === "Approved" &&
                            formData.approvedDays <= 0)
                        }
                        className={`px-5 py-2.5 text-sm text-white rounded-lg transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-1
                                      ${
                                        !formData.decision ||
                                        isLoading ||
                                        (formData.decision === "Rejected" &&
                                          !formData.remark.trim()) ||
                                        formData.requestDays <
                                          formData.approvedDays ||
                                        (formData.decision === "Approved" &&
                                          formData.approvedDays <= 0)
                                          ? "bg-slate-400 cursor-not-allowed opacity-70"
                                          : formData.decision === "Approved"
                                          ? "bg-green-500 hover:bg-green-600 focus:ring-green-400"
                                          : "bg-red-500 hover:bg-red-600 focus:ring-red-400"
                                      }`}
                        whileHover={
                          !isLoading &&
                          formData.decision &&
                          !(
                            formData.decision === "Rejected" &&
                            !formData.remark.trim()
                          ) &&
                          !(formData.requestDays < formData.approvedDays) &&
                          !(
                            formData.decision === "Approved" &&
                            formData.approvedDays <= 0
                          )
                            ? {
                                scale: 1.03,
                                y: -1,
                                boxShadow: `0 4px 15px ${
                                  formData.decision === "Approved"
                                    ? "rgba(34,197,94,0.3)"
                                    : "rgba(239,68,68,0.3)"
                                }`,
                              }
                            : {}
                        }
                        whileTap={
                          !isLoading &&
                          formData.decision &&
                          !(
                            formData.decision === "Rejected" &&
                            !formData.remark.trim()
                          ) &&
                          !(formData.requestDays < formData.approvedDays) &&
                          !(
                            formData.decision === "Approved" &&
                            formData.approvedDays <= 0
                          )
                            ? { scale: 0.97 }
                            : {}
                        }
                      >
                        {isLoading ? (
                          <FiRefreshCw className="animate-spin mr-2 h-4 w-4" />
                        ) : formData.decision === "Approved" ? (
                          <FiCheckCircle className="mr-2 h-4 w-4" />
                        ) : formData.decision === "Rejected" ? (
                          <FiXCircle className="mr-2 h-4 w-4" />
                        ) : null}
                        {isLoading ? "Processing..." : "Submit Decision"}
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setShowEditForm(false)}
                        className="px-5 py-2.5 text-sm bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300/80 transition-all duration-200 font-semibold shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-1"
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                        }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
