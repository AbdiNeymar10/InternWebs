"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { authFetch } from "@/utils/authFetch";
import {
  FiSearch,
  FiCheckCircle,
  FiRefreshCw,
  FiUserCheck,
  FiFileText,
  FiClipboard,
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const API_BASE_URL = "http://localhost:8080/api";

interface Employee {
  empId: string;
  fullName: string;
  position: string;
  department: string;
}

interface LeaveTransferDetailDTO {
  detailId?: number;
  empId: string;
  fullName?: string;
  status: string;
}

interface LeaveTransferRequestDTO {
  transferId: number;
  budgetYear: number;
  status: string;
  requesterId: string;
  createdDate: string;
  deptName: string;
  details: LeaveTransferDetailDTO[];
}

interface Requester {
  id: string;
  name: string;
  position: string;
  department: string;
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

const LeaveTransferApproval = () => {
  const [requesterId, setRequesterId] = useState("");
  const [requester, setRequester] = useState<Requester>({
    id: "",
    name: "",
    position: "",
    department: "",
  });
  const [pendingRequests, setPendingRequests] = useState<
    LeaveTransferRequestDTO[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const debouncedRequesterId = useDebounce(requesterId, 500);

  useEffect(() => {
    const fetchRequesterDetails = async () => {
      if (!debouncedRequesterId.trim()) {
        setRequester({ id: "", name: "", position: "", department: "" });
        setPendingRequests([]);
        return;
      }
      setIsDataLoading(true);
      const toastId = toast.loading("Fetching approver details...");
      try {
        const response = await authFetch(
          `${API_BASE_URL}/leave-transfer/employee/${debouncedRequesterId.trim()}`
        );
        const data = await response.json();
        setRequester({
          id: data.empId,
          name: data.fullName,
          position: data.position,
          department: data.department || "N/A",
        });
        toast.success("Approver details loaded!", { id: toastId });
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Approver not found", {
          id: toastId,
        });
        setRequester({ id: "", name: "", position: "", department: "" });
        setPendingRequests([]);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchRequesterDetails();
  }, [debouncedRequesterId]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (!requester.id) return;
      setIsDataLoading(true);
      const toastId = toast.loading("Fetching pending requests...");
      try {
        const response = await authFetch(
          `${API_BASE_URL}/leave-transfer/pending-requests?approverId=${requester.id}`
        );
        const responseData = await response.json();
        const requestsWithNames = await Promise.all(
          responseData.map(async (request: LeaveTransferRequestDTO) => {
            const detailsWithNames = await Promise.all(
              request.details.map(async (detail: LeaveTransferDetailDTO) => {
                try {
                  const empResponse = await authFetch(
                    `${API_BASE_URL}/leave-transfer/employee/${detail.empId}`
                  );
                  const empData = await empResponse.json();
                  return {
                    ...detail,
                    fullName: empData.fullName || "Unknown",
                  };
                } catch (error) {
                  console.error(
                    `Failed to fetch name for employee ${detail.empId}:`,
                    error
                  );
                  return {
                    ...detail,
                    fullName: "Unknown",
                  };
                }
              })
            );
            return {
              ...request,
              deptName: request.deptName || "Unknown",
              details: detailsWithNames,
            };
          })
        );
        setPendingRequests(requestsWithNames);
        toast.success("Pending requests loaded!", { id: toastId });
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to load pending requests",
          { id: toastId }
        );
        setPendingRequests([]);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchPendingRequests();
  }, [requester.id]);

  const filteredRequests = pendingRequests.filter((request) =>
    request.details.some(
      (detail) =>
        detail.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (detail.fullName &&
          detail.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        request.requesterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.deptName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleApprove = async (detailId: number) => {
    const toastId = toast.loading("Processing approval...");
    setIsSubmitting(true);
    try {
      await authFetch(`${API_BASE_URL}/leave-transfer/approve/${detailId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const response = await authFetch(
        `${API_BASE_URL}/leave-transfer/pending-requests?approverId=${requester.id}`
      );
      const responseData = await response.json();
      const requestsWithNames = await Promise.all(
        responseData.map(async (request: LeaveTransferRequestDTO) => {
          const detailsWithNames = await Promise.all(
            request.details.map(async (detail: LeaveTransferDetailDTO) => {
              try {
                const empResponse = await authFetch(
                  `${API_BASE_URL}/leave-transfer/employee/${detail.empId}`
                );
                const empData = await empResponse.json();
                return {
                  ...detail,
                  fullName: empData.fullName || "Unknown",
                };
              } catch (error) {
                console.error(
                  `Failed to fetch name for employee ${detail.empId}:`,
                  error
                );
                return {
                  ...detail,
                  fullName: "Unknown",
                };
              }
            })
          );
          return {
            ...request,
            deptName: request.deptName || "Unknown",
            details: detailsWithNames,
          };
        })
      );
      setPendingRequests(requestsWithNames);
      toast.success("Approval processed successfully!", { id: toastId });
    } catch (error: any) {
      let errorMsg = "Failed to process approval";
      if (error && typeof error.json === "function") {
        const errorData = await error.json();
        errorMsg = errorData?.message || errorMsg;
      }
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 font-sans relative bg-slate-100">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc]/5 via-[#3c8dbc]/5 to-purple-500/5 opacity-30"></div>
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
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-[#3c8dbc]">
            Leave Transfer Approval
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Approve pending leave transfer requests
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white backdrop-blur-md rounded-xl border border-slate-200 shadow-xl overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold text-[#3c8dbc] mb-4 flex items-center">
              <FiUserCheck className="mr-2 text-xl" />
              Approver Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
              <div>
                <label
                  htmlFor="approverId"
                  className="flex items-center text-xs font-medium text-slate-500 mb-1"
                >
                  <FiUserCheck className="mr-1.5 opacity-70" size={12} />
                  Approver ID
                </label>
                <input
                  id="approverId"
                  type="text"
                  value={requesterId}
                  onChange={(e) => setRequesterId(e.target.value)}
                  placeholder="Enter your employee ID"
                  disabled={isSubmitting || isDataLoading}
                  className="w-full p-2.5 text-sm bg-slate-50 text-slate-700 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                />
              </div>
              <InfoBlockStyled
                label="Full Name"
                value={requester.name}
                icon={<FiUserCheck size={12} />}
              />
              <InfoBlockStyled
                label="Position"
                value={requester.position}
                icon={<FiClipboard size={12} />}
              />
              <InfoBlockStyled
                label="Department"
                value={requester.department}
                icon={<FiFileText size={12} />}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white backdrop-blur-md rounded-xl border border-slate-200 shadow-xl overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold text-[#3c8dbc] mb-4 flex items-center">
              <FiFileText className="mr-2 text-xl" />
              Pending Leave Transfer Requests
            </h2>

            <div className="mb-4">
              <label
                htmlFor="searchRequests"
                className="flex items-center text-xs font-medium text-slate-500 mb-1"
              >
                <FiSearch className="mr-1.5 opacity-70" size={12} />
                Search Requests
              </label>
              <div className="relative">
                <input
                  id="searchRequests"
                  type="text"
                  className="w-full p-2.5 pl-10 text-sm bg-slate-50 text-slate-700 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                  placeholder="Search by employee ID, name, or department"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isDataLoading}
                />
                <FiSearch
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/80">
                    {[
                      "Employee ID",
                      "Employee Name",
                      "Department",
                      "Status",
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
                  {isDataLoading && filteredRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-10 text-center text-[#3c8dbc]"
                      >
                        <FiRefreshCw className="animate-spin inline-block mr-2 w-5 h-5" />
                        Loading Requests...
                      </td>
                    </tr>
                  ) : !isDataLoading && filteredRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-10 text-center text-gray-500"
                      >
                        {searchTerm
                          ? "No matching requests found"
                          : requester.id
                          ? "No pending requests available"
                          : "Please enter a valid Approver ID"}
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.flatMap((request) =>
                      request.details.map((detail) => (
                        <tr
                          key={
                            detail.detailId
                              ? detail.detailId
                              : `${request.transferId}-${detail.empId}`
                          }
                          className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors duration-150"
                        >
                          <td className="py-3 px-4 text-sm text-gray-700">
                            {detail.empId}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-800">
                            {detail.fullName || "Unknown"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {request.deptName}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                detail.status === "APPROVED"
                                  ? "bg-green-100 text-green-800"
                                  : detail.status === "REJECTED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {detail.status || "Pending"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {detail.status === "PENDING" && (
                              <motion.button
                                onClick={() =>
                                  detail.detailId &&
                                  handleApprove(detail.detailId)
                                }
                                disabled={isSubmitting || !detail.detailId}
                                className={`px-5 py-2.5 text-sm text-white rounded-lg font-semibold shadow-md hover:shadow-lg flex items-center transition-all duration-200 ${
                                  isSubmitting || !detail.detailId
                                    ? "bg-slate-400 cursor-not-allowed opacity-70"
                                    : "bg-green-500 hover:bg-green-600 focus:ring-green-400"
                                }`}
                                whileHover={
                                  !isSubmitting && detail.detailId
                                    ? {
                                        scale: 1.03,
                                        y: -1,
                                        boxShadow:
                                          "0 4px 15px rgba(34,197,94,0.3)",
                                      }
                                    : {}
                                }
                                whileTap={
                                  !isSubmitting && detail.detailId
                                    ? { scale: 0.97 }
                                    : {}
                                }
                              >
                                {isSubmitting ? (
                                  <FiRefreshCw className="animate-spin mr-2 h-4 w-4" />
                                ) : (
                                  <FiCheckCircle className="mr-2 h-4 w-4" />
                                )}
                                {isSubmitting ? "Approving..." : "Approve"}
                              </motion.button>
                            )}
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaveTransferApproval;
