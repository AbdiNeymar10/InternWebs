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

interface LeaveRequestDataHR {
  id: number;
  employee?: EmployeeDetails;
  leaveType?: LeaveTypeDetails;
  leaveStart: string;
  leaveEnd: string;
  requestedDays?: number;
  deptStatus?: string;
  hrStatus?: string;
  dayType?: string;
  description?: string;
  remark?: string;
  approvedDays?: number; // This will hold dept approved days when HR modal opens
}

interface HRApprovalUpdatePayload {
  status: string;
  approvedDays: number;
  remark: string | null;
  leaveStart: string;
  leaveEnd: string;
  requestedDays: number;
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
  if (!exists)
    globalNotifications = [notification, ...globalNotifications.slice(0, 19)];
}
export function markNotificationsAsRead() {
  globalNotifications = globalNotifications.map((n) => ({ ...n, read: true }));
}

async function fetchWrapper(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, {
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
      } catch (e) {}
      throw new Error(errorData.message);
    }
    if (
      response.status === 204 ||
      !response.headers.get("content-type")?.includes("application/json")
    )
      return null;
    return await response.json();
  } catch (error) {
    console.error(`API call failed to ${url}:`, error);
    throw error;
  }
}

async function fetchPendingHRApprovals(): Promise<LeaveRequestDataHR[]> {
  const response = await fetchWrapper(
    `${API_BASE_URL}/leave/request/pending/hr`
  );
  return Array.isArray(response) ? response : [];
}

async function fetchHRHistory(): Promise<LeaveRequestDataHR[]> {
  const response = await fetchWrapper(
    `${API_BASE_URL}/leave/request/history/hr`
  );
  return Array.isArray(response) ? response : [];
}

async function fetchEmployeesOnLeaveHR(): Promise<LeaveRequestDataHR[]> {
  try {
    const response = await fetchWrapper(
      `${API_BASE_URL}/leave/request/approved-current`
    );
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Failed to fetch employees on leave (HR):", error);
    toast.error("Could not load employees on leave (HR).");
    return [];
  }
}

async function updateHRApproval(
  requestId: number,
  payload: HRApprovalUpdatePayload
): Promise<LeaveRequestDataHR | null> {
  return fetchWrapper(`${API_BASE_URL}/leave/request/approve/hr/${requestId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

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

export default function LeaveApprovalHRPage() {
  const [activeTab, setActiveTab] = useState("Current");
  const [editingRequest, setEditingRequest] =
    useState<LeaveRequestDataHR | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(getNotifications());
  const [pendingHRApprovals, setPendingHRApprovals] = useState<
    LeaveRequestDataHR[]
  >([]);
  const [hrHistory, setHrHistory] = useState<LeaveRequestDataHR[]>([]);
  const [employeesOnLeave, setEmployeesOnLeave] = useState<
    LeaveRequestDataHR[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [formData, setFormData] = useState({
    decision: "",
    remark: "",
    leaveStart: "",
    leaveEnd: "",
    requestedDays: 0,
    dayType: "Full Day",
    // This will store the days HR intends to approve, initialized from original requested days
    hrApprovedDays: 0,
  });

  const loadHRData = useCallback(async () => {
    setIsDataLoading(true);
    toast.loading("Fetching HR data...", { id: "loadHRDataToast" });
    try {
      const [pending, history, onLeave] = await Promise.allSettled([
        fetchPendingHRApprovals(),
        fetchHRHistory(),
        fetchEmployeesOnLeaveHR(),
      ]);

      if (pending.status === "fulfilled") {
        setPendingHRApprovals(pending.value || []);
      } else {
        console.error(
          "Pending HR Error:",
          (pending as PromiseRejectedResult).reason
        );
        toast.error("Failed to load pending HR approvals.");
        setPendingHRApprovals([]);
      }

      if (history.status === "fulfilled") {
        setHrHistory(history.value || []);
      } else {
        console.error(
          "HR History Error:",
          (history as PromiseRejectedResult).reason
        );
        toast.error("Failed to load HR history.");
        setHrHistory([]);
      }

      if (onLeave.status === "fulfilled") {
        setEmployeesOnLeave(onLeave.value || []);
      } else {
        console.error(
          "HR On Leave Error:",
          (onLeave as PromiseRejectedResult).reason
        );
        toast.error("Failed to load employees on leave (HR).");
        setEmployeesOnLeave([]);
      }

      toast.success("HR Data loaded!", { id: "loadHRDataToast" });
    } catch (error: any) {
      toast.error(error.message || "Failed to load HR data", {
        id: "loadHRDataToast",
      });
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHRData();
    const intervalId = setInterval(() => {
      const currentGlobal = getNotifications();
      if (
        currentGlobal.length !== notifications.length ||
        currentGlobal.some(
          (gn, i) =>
            gn.id !== notifications[i]?.id || gn.read !== notifications[i]?.read
        )
      ) {
        setNotifications(currentGlobal);
      }
    }, 3000);
    return () => clearInterval(intervalId);
  }, [loadHRData, notifications]);

  useEffect(() => {
    const newPendingForNotification = pendingHRApprovals.filter(
      (req) => req.hrStatus === "Pending" || req.hrStatus === null
    );
    let newNotifsAdded = false;
    newPendingForNotification.forEach((request) => {
      if (!request.id) return;
      const exists = globalNotifications.some(
        (n) => n.requestId === request.id && n.type === "hr_pending_review"
      );
      if (!exists && request.employee?.firstName) {
        addNotification({
          id: `hr_review_needed_${request.id}_${Date.now()}`,
          title: "HR Review Required",
          message: `Leave for ${request.employee.firstName} ${
            request.employee.lastName || ""
          } (ID: ${
            request.employee.empId
          }) is department approved and needs HR review.`,
          type: "hr_pending_review",
          requestId: request.id,
          read: false,
          timestamp: new Date(),
        });
        newNotifsAdded = true;
      }
    });
    if (newNotifsAdded) setNotifications(getNotifications());
  }, [pendingHRApprovals]);

  const sendEmailNotificationToBackendHR = async (emailDetails: any) => {
    try {
      console.log(
        "Requesting backend to send HR decision email:",
        emailDetails
      );
      // Example: await fetchWrapper(`${API_BASE_URL}/notify/hr-decision`, { method: 'POST', body: JSON.stringify(emailDetails) });
    } catch (error) {
      console.error("Error requesting backend to send HR email:", error);
    }
  };

  const handleHRApproval = async (requestId: number, status: string) => {
    setIsLoading(true);
    try {
      const finalApprovedDaysForPayload =
        status === "Approved" ? formData.hrApprovedDays : 0;

      if (status === "Approved" && finalApprovedDaysForPayload <= 0) {
        toast.error(
          "Approved days must be a positive number for approved requests."
        );
        setIsLoading(false);
        return;
      }
      if (status === "Rejected" && formData.remark.trim() === "") {
        toast.error("Remark is required for rejected requests.");
        setIsLoading(false);
        return;
      }
      // Ensure HR approved days do not exceed original requested days
      if (
        status === "Approved" &&
        formData.hrApprovedDays > formData.requestedDays
      ) {
        toast.error(
          "HR approved days cannot exceed the original requested days."
        );
        setIsLoading(false);
        return;
      }

      const payload: HRApprovalUpdatePayload = {
        status,
        approvedDays: finalApprovedDaysForPayload,
        remark: formData.remark || null,
        leaveStart: formData.leaveStart,
        leaveEnd: formData.leaveEnd,
        requestedDays: formData.requestedDays,
      };

      const updatedRequest = await updateHRApproval(requestId, payload);

      if (updatedRequest) {
        if (updatedRequest.employee) {
          sendEmailNotificationToBackendHR({
            requestId: updatedRequest.id,
            decision: status,
            hrRemark: formData.remark,
            approvedDays: finalApprovedDaysForPayload,
            employeeEmail: "employee@example.com", // Placeholder
            employeeName: `${updatedRequest.employee.firstName} ${updatedRequest.employee.lastName}`,
            leaveTypeName: updatedRequest.leaveType?.leaveName,
            leaveStart: formData.leaveStart,
            leaveEnd: formData.leaveEnd,
          });

          addNotification({
            id: `hr_decision_${requestId}_${Date.now()}`,
            title: `HR Decision: ${status}`,
            message: `Leave for ${updatedRequest.employee.firstName} (ID: ${
              updatedRequest.employee.empId
            }) has been ${status.toLowerCase()} by HR.`,
            type: "hr_decision",
            requestId,
            read: false,
            timestamp: new Date(),
          });
          setNotifications(getNotifications());
        }

        toast.success(
          `Leave request ${status.toLowerCase()} by HR successfully!`
        );
        await loadHRData(); // Refresh all HR data, including "On Leave" list
        setShowEditForm(false);
      } else {
        toast.error(
          `Failed to ${status.toLowerCase()} leave request by HR: No response from server.`
        );
      }
    } catch (error: any) {
      toast.error(
        error.message || `Failed to ${status.toLowerCase()} leave request by HR`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (request: LeaveRequestDataHR) => {
    if (!request?.employee) {
      toast.error("Cannot edit: Employee data missing.");
      return;
    }
    setEditingRequest(request);
    const originalRequestedDays = request.requestedDays ?? 0;

    setFormData({
      decision: request.hrStatus || "",
      remark: request.remark || "", // This will be HR's remark if they acted before
      leaveStart: request.leaveStart || "",
      leaveEnd: request.leaveEnd || "",
      requestedDays: originalRequestedDays, // Store the original requested days
      dayType: request.dayType || "Full Day",
      // Initialize hrApprovedDays with the original requested days,
      // or what department approved if that's less and makes sense for your workflow.
      // For simplicity and to align with the backend fix, let's default to original requested.
      // HR can then adjust this down if needed.
      hrApprovedDays: originalRequestedDays,
    });
    setShowEditForm(true);
  };

  useEffect(() => {
    if (showEditForm) {
      // This effect recalculates the "original" requested days if start/end/dayType change in modal
      // This is useful if HR can modify these dates.
      const currentOriginalRequested = calculateRequestedDays(
        formData.leaveStart,
        formData.leaveEnd,
        formData.dayType
      );
      if (currentOriginalRequested !== formData.requestedDays) {
        setFormData((prev) => ({
          ...prev,
          requestedDays: currentOriginalRequested,
          // If original requested days change, HR might want to reset their approval to this new value
          hrApprovedDays: currentOriginalRequested,
        }));
      }
    }
  }, [
    formData.leaveStart,
    formData.leaveEnd,
    formData.dayType,
    showEditForm,
    formData.requestedDays,
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "hrApprovedDays") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.decision) {
      toast.error("Please select a decision");
      return;
    }
    if (editingRequest?.id !== undefined) {
      handleHRApproval(editingRequest.id, formData.decision);
    } else {
      toast.error("Error: Cannot save HR decision without a request ID.");
    }
  };

  const handleMarkNotificationsAsRead = () => {
    markNotificationsAsRead();
    setNotifications(getNotifications());
  };

  let requestsToDisplayInTable: LeaveRequestDataHR[] = [];
  if (activeTab === "Current") requestsToDisplayInTable = pendingHRApprovals;
  else if (activeTab === "History") requestsToDisplayInTable = hrHistory;

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen p-6 font-sans relative bg-slate-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc]/5 to-purple-50/5 opacity-30"></div>
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
            padding: "16px",
            color: "#333",
          },
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2c6da4] to-[#3c8dbc]">
              HR Leave Approval
            </h1>
            <div className="flex gap-2">
              {["Current", "History", "On Leave"].map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium relative overflow-hidden transition-colors duration-200 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-[#3c8dbc] to-[#5c9dce] text-white shadow-lg"
                      : "bg-white text-[#3c8dbc] hover:bg-[#3c8dbc]/10 border border-[#3c8dbc]/30"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="tabIndicatorHR"
                      className="absolute inset-0 bg-[#3c8dbc] rounded-md -z-10"
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
              className="p-2 rounded-full bg-white text-[#3c8dbc] hover:bg-gray-100 relative shadow-md border border-[#3c8dbc]/30"
              aria-label="Show notifications"
            >
              <FiBell size={20} />
              {unreadNotificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]"
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
                  <div className="p-3 bg-gradient-to-r from-[#3c8dbc] to-[#5c9dce] text-white flex justify-between items-center">
                    <h3 className="text-sm font-semibold">Notifications</h3>
                    {notifications.some((n) => !n.read) && (
                      <button
                        onClick={handleMarkNotificationsAsRead}
                        className="text-xs hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n, index) => (
                        <motion.div
                          key={n.id || `notif-hr-idx-${index}`}
                          className={`p-3 hover:bg-gray-50 transition-colors ${
                            !n.read ? "bg-blue-50 font-medium" : "bg-white"
                          }`}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div
                            className={`text-sm ${
                              !n.read ? "text-blue-700" : "text-gray-800"
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

        {(activeTab === "Current" || activeTab === "History") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-md rounded-xl border border-[#3c8dbc]/20 shadow-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#3c8dbc]/20 bg-slate-50">
                    {[
                      "Emp ID",
                      "Name",
                      "Leave Type",
                      "Start",
                      "End",
                      "Days Req.",
                      "Dept Status",
                      "HR Status",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-4 text-[#3278a0] uppercase text-xs font-semibold tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {isDataLoading && requestsToDisplayInTable.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-10 text-center text-[#3c8dbc]"
                      >
                        <FiRefreshCw className="animate-spin inline-block mr-2 w-5 h-5" />
                        Loading {activeTab} Requests...
                      </td>
                    </tr>
                  ) : !isDataLoading &&
                    requestsToDisplayInTable.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-10 text-center text-gray-500"
                      >
                        No {activeTab.toLowerCase()} requests found.
                      </td>
                    </tr>
                  ) : (
                    requestsToDisplayInTable.map((req, index) => (
                      <tr
                        key={req.id || `hr-req-idx-${index}`}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {req.employee?.empId || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-800">
                          {req.employee?.firstName} {req.employee?.lastName}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`px-2 py-0.5 rounded-md text-xs ${
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
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {req.requestedDays != null
                            ? req.requestedDays.toFixed(1)
                            : "N/A"}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                              req.deptStatus === "Approved"
                                ? "bg-green-100 text-green-700"
                                : req.deptStatus === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {req.deptStatus || "Pending"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                              req.hrStatus === "Approved"
                                ? "bg-green-100 text-green-700"
                                : req.hrStatus === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {req.hrStatus || "Pending"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-right">
                          {activeTab === "Current" &&
                            (req.hrStatus === "Pending" ||
                              req.hrStatus === null) &&
                            req.deptStatus === "Approved" && (
                              <button
                                onClick={() => handleEdit(req)}
                                className="text-[#3c8dbc] text-xs font-medium hover:underline"
                              >
                                Process
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
        )}

        {activeTab === "On Leave" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10"
          >
            <h2 className="text-2xl font-semibold text-[#3c8dbc] mb-4 flex items-center">
              <FiCalendar className="mr-3 text-2xl" />
              Employees Currently On Leave (HR Approved)
            </h2>
            {isDataLoading && employeesOnLeave.length === 0 ? (
              <div className="py-10 text-center text-[#3c8dbc] bg-white/90 backdrop-blur-md rounded-xl border border-[#3c8dbc]/20 shadow-xl p-4">
                <FiRefreshCw className="animate-spin inline-block mr-2 w-5 h-5" />
                Loading On Leave Data...
              </div>
            ) : !isDataLoading && employeesOnLeave.length === 0 ? (
              <div className="text-center py-10 text-gray-500 bg-white/90 backdrop-blur-md rounded-xl border border-[#3c8dbc]/20 shadow-xl p-4">
                <FiUsers className="mx-auto text-gray-400 mb-2" size={32} />
                No employees currently on HR-approved leave.
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-md rounded-xl border border-[#3c8dbc]/20 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#3c8dbc]/20 bg-slate-50">
                        {[
                          "Emp ID",
                          "Name",
                          "Leave Type",
                          "Start Date",
                          "End Date",
                          "Approved Days",
                        ].map((h) => (
                          <th
                            key={h + "-hr-onleave-header"}
                            className="text-left py-3 px-4 text-[#3278a0] uppercase text-xs font-semibold tracking-wider"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {employeesOnLeave.map((req, index) => (
                        <tr
                          key={req.id || `onleave-hr-idx-${index}`}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {req.employee?.empId || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-800">
                            {req.employee?.firstName} {req.employee?.lastName}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span
                              className={`px-2 py-0.5 rounded-md text-xs ${
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

        <AnimatePresence>
          {showEditForm && editingRequest && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
              onClick={() => setShowEditForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 220 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-5 flex justify-between items-center border-b border-gray-200 bg-slate-50">
                  <h2 className="text-xl font-semibold text-[#3c8dbc]">
                    HR Process Leave Request
                  </h2>
                  <button
                    onClick={() => setShowEditForm(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Close edit form"
                  >
                    <FiX size={22} />
                  </button>
                </div>
                <div className="overflow-y-auto px-6 py-5 max-h-[calc(80vh-100px)]">
                  <form onSubmit={handleSubmitEdit}>
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                        <div>
                          <label className="block text-xs text-gray-600 mb-0.5">
                            Name
                          </label>
                          <input
                            type="text"
                            value={`${
                              editingRequest.employee?.firstName || ""
                            } ${editingRequest.employee?.lastName || ""}`}
                            readOnly
                            className="w-full p-2 text-sm bg-gray-100 border-gray-200 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-0.5">
                            Emp ID
                          </label>
                          <input
                            type="text"
                            value={editingRequest.employee?.empId || "N/A"}
                            readOnly
                            className="w-full p-2 text-sm bg-gray-100 border-gray-200 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-0.5">
                            Leave Type
                          </label>
                          <input
                            type="text"
                            value={editingRequest.leaveType?.leaveName || "N/A"}
                            readOnly
                            className="w-full p-2 text-sm bg-gray-100 border-gray-200 border rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="leaveStartEditHR"
                            className="block text-xs text-gray-600 mb-0.5"
                          >
                            Start Date
                          </label>
                          <input
                            type="date"
                            id="leaveStartEditHR"
                            name="leaveStart"
                            value={formData.leaveStart}
                            onChange={handleInputChange}
                            className="w-full p-2 text-sm bg-slate-50 border-gray-300 border rounded-md focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="leaveEndEditHR"
                            className="block text-xs text-gray-600 mb-0.5"
                          >
                            End Date
                          </label>
                          <input
                            type="date"
                            id="leaveEndEditHR"
                            name="leaveEnd"
                            value={formData.leaveEnd}
                            onChange={handleInputChange}
                            min={formData.leaveStart}
                            className="w-full p-2 text-sm bg-slate-50 border-gray-300 border rounded-md focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="dayTypeEditHR"
                            className="block text-xs text-gray-600 mb-0.5"
                          >
                            Day Type
                          </label>
                          <select
                            id="dayTypeEditHR"
                            name="dayType"
                            value={formData.dayType}
                            onChange={handleInputChange}
                            className="w-full p-2 text-sm bg-slate-50 border-gray-300 border rounded-md focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                          >
                            <option value="Full Day">Full Day</option>
                            <option value="Half Day">Half Day</option>
                            {/* Add other day types if applicable */}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-0.5">
                            Original Requested Days
                          </label>
                          <input
                            type="text"
                            value={formData.requestedDays.toFixed(1)}
                            readOnly
                            className="w-full p-2 text-sm bg-gray-100 border-gray-200 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-0.5">
                            Dept. Status
                          </label>
                          <input
                            type="text"
                            value={editingRequest.deptStatus || "N/A"}
                            readOnly
                            className="w-full p-2 text-sm bg-gray-100 border-gray-200 border rounded-md"
                          />
                        </div>
                        {/* Display Department Approved Days */}
                        <div>
                          <label className="block text-xs text-gray-600 mb-0.5">
                            Dept. Approved Days
                          </label>
                          <input
                            type="text"
                            value={
                              editingRequest.approvedDays != null
                                ? editingRequest.approvedDays.toFixed(1)
                                : "N/A"
                            }
                            readOnly
                            className="w-full p-2 text-sm bg-gray-100 border-gray-200 border rounded-md"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-600 mb-0.5">
                            Dept. Remark
                          </label>
                          <textarea
                            value={editingRequest.remark || ""}
                            readOnly
                            rows={1}
                            className="w-full p-2 text-sm bg-gray-100 border-gray-200 border rounded-md min-h-[40px]"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs text-gray-600 mb-0.5">
                          Description
                        </label>
                        <textarea
                          value={editingRequest.description || ""}
                          readOnly
                          rows={2}
                          className="w-full p-2 text-sm bg-gray-100 border-gray-200 border rounded-md min-h-[50px]"
                        />
                      </div>
                      {/* HR Approved Days Input */}
                      <div>
                        <label
                          htmlFor="hrApprovedDaysEdit"
                          className="block text-sm font-medium text-gray-800 mb-1"
                        >
                          HR Approved Days{" "}
                          <span className="text-red-500">* (if approving)</span>
                        </label>
                        <input
                          type="number"
                          id="hrApprovedDaysEdit"
                          name="hrApprovedDays"
                          value={formData.hrApprovedDays}
                          onChange={handleInputChange}
                          step="0.5"
                          min="0"
                          max={formData.requestedDays} // HR cannot approve more than originally requested
                          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent"
                          required={formData.decision === "Approved"}
                        />
                        {formData.decision === "Approved" &&
                          formData.hrApprovedDays > formData.requestedDays && (
                            <p className="text-xs text-red-500 mt-1">
                              Cannot exceed original requested days (
                              {formData.requestedDays.toFixed(1)}).
                            </p>
                          )}
                      </div>
                      <div>
                        <label
                          htmlFor="decisionEditHR"
                          className="block text-sm font-medium text-gray-800 mb-1"
                        >
                          HR Decision <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="decisionEditHR"
                          name="decision"
                          value={formData.decision}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent"
                          required
                        >
                          <option value="">- Select Decision -</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="remarkEditHR"
                          className="block text-sm font-medium text-gray-800 mb-1"
                        >
                          HR Remark{" "}
                          <span className="text-xs text-slate-500">
                            (Required for rejection)
                          </span>
                        </label>
                        <textarea
                          id="remarkEditHR"
                          rows={3}
                          name="remark"
                          value={formData.remark}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent"
                          placeholder="Enter HR remarks..."
                          required={formData.decision === "Rejected"}
                        />
                      </div>
                    </div>
                    <div className="mt-6 pt-5 border-t border-gray-200 flex justify-end gap-3">
                      <motion.button
                        type="submit"
                        disabled={
                          isLoading ||
                          !formData.decision ||
                          (formData.decision === "Rejected" &&
                            !formData.remark.trim()) ||
                          (formData.decision === "Approved" &&
                            (formData.hrApprovedDays <= 0 ||
                              formData.hrApprovedDays > formData.requestedDays))
                        }
                        className={`px-5 py-2.5 text-sm rounded-lg hover:shadow-md transition-all font-medium flex items-center
                                      ${
                                        isLoading ||
                                        !formData.decision ||
                                        (formData.decision === "Rejected" &&
                                          !formData.remark.trim()) ||
                                        (formData.decision === "Approved" &&
                                          (formData.hrApprovedDays <= 0 ||
                                            formData.hrApprovedDays >
                                              formData.requestedDays))
                                          ? "bg-slate-400 text-slate-100 cursor-not-allowed"
                                          : formData.decision === "Approved"
                                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                                          : "bg-gradient-to-r from-red-500 to-red-600 text-white"
                                      }`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isLoading && (
                          <FiRefreshCw className="animate-spin mr-2" />
                        )}
                        {formData.decision === "Approved" ? (
                          <FiCheckCircle className="mr-2" />
                        ) : formData.decision === "Rejected" ? (
                          <FiXCircle className="mr-2" />
                        ) : null}
                        {isLoading ? "Processing..." : "Save Decision"}
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setShowEditForm(false)}
                        className="px-5 py-2.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
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
