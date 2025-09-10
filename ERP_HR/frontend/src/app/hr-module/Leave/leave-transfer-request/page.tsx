"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { authFetch } from "@/utils/authFetch";
import {
  FiSearch,
  FiCheckCircle,
  FiUsers,
  FiRefreshCw,
  FiUserCheck,
  FiFileText,
  FiClipboard,
  FiEye,
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
  selected?: boolean;
  status?: string; // Add status to track if already requested
}

interface LeaveTransferDetailDTO {
  empId: string;
  status: string;
  approverNotes?: string;
}

interface LeaveTransferRequestDTO {
  transferId: number;
  budgetYear: number;
  status: string;
  requesterId: string;
  createdDate: string;
  details: LeaveTransferDetailDTO[];
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

const LeaveTransferRequest = () => {
  const [empId, setEmpId] = useState<string>("");
  const [employee, setEmployee] = useState<Employee>({
    empId: "",
    fullName: "",
    position: "",
    department: "",
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedRequests, setSubmittedRequests] = useState<LeaveTransferRequestDTO[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<LeaveTransferDetailDTO | null>(null);

  // Fix input delay - increased from 500ms to 1000ms
  const debouncedEmpId = useDebounce(empId, 1000);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!debouncedEmpId) return;
      setIsDataLoading(true);
      const toastId = toast.loading("Fetching employee details...");
      try {
        const response = await authFetch(
          `${API_BASE_URL}/leave-transfer/employee/${debouncedEmpId}`
        );
        const data = await response.json();
        setEmployee({
          empId: data.empId,
          fullName: data.fullName,
          position: data.position,
          department: data.department || "N/A",
        });
        toast.success("Employee details loaded!", { id: toastId });
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Employee not found", {
          id: toastId,
        });
        setEmployee({ empId: "", fullName: "", position: "", department: "" });
        setEmployees([]);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchEmployeeDetails();
  }, [debouncedEmpId]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!debouncedEmpId) return;
      setIsDataLoading(true);
      const toastId = toast.loading("Fetching department employees...");
      try {
        const response = await authFetch(
          `${API_BASE_URL}/leave-transfer/employees/${debouncedEmpId}`
        );
        const data = await response.json();
        
        // Get submitted requests to check which employees are already requested
        const requestsResponse = await authFetch(
          `${API_BASE_URL}/leave-transfer/requests/${debouncedEmpId}`
        );
        const requestsData = await requestsResponse.json();
        
        // Create a map of employee IDs to their latest status
        const employeeStatusMap = new Map<string, string>();
        requestsData.forEach((request: LeaveTransferRequestDTO) => {
          request.details.forEach((detail: LeaveTransferDetailDTO) => {
            employeeStatusMap.set(detail.empId, detail.status);
          });
        });

        // Set employees with their status
        setEmployees(
          data.map((emp: Employee) => ({ 
            ...emp, 
            selected: false,
            status: employeeStatusMap.get(emp.empId) || "NOT_REQUESTED"
          }))
        );
        toast.success("Department employees loaded!", { id: toastId });
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load department employees",
          { id: toastId }
        );
        setEmployees([]);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchEmployees();
  }, [debouncedEmpId]);

  useEffect(() => {
    const fetchSubmittedRequests = async () => {
      if (!debouncedEmpId) return;
      setIsDataLoading(true);
      const toastId = toast.loading("Fetching submitted requests...");
      try {
        const response = await authFetch(
          `${API_BASE_URL}/leave-transfer/requests/${debouncedEmpId}`
        );
        const data = await response.json();
        setSubmittedRequests(data);
        toast.success("Submitted requests loaded!", { id: toastId });
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to load submitted requests",
          { id: toastId }
        );
        setSubmittedRequests([]);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchSubmittedRequests();
  }, [debouncedEmpId]);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setEmployees(employees.map((emp) => ({ 
      ...emp, 
      selected: emp.status === "NOT_REQUESTED" ? newSelectAll : false 
    })));
  };

  const handleSelectEmployee = (id: string) => {
    setEmployees(
      employees.map((emp) =>
        emp.empId === id && emp.status === "NOT_REQUESTED" 
          ? { ...emp, selected: !emp.selected } 
          : emp
      )
    );
  };

  const handleSubmit = async () => {
    if (!empId) {
      toast.error("Please enter an employee ID");
      return;
    }

    const selectedEmployees = employees.filter((emp) => emp.selected && emp.status === "NOT_REQUESTED");
    if (selectedEmployees.length === 0) {
      toast.error("Please select at least one employee who hasn't been requested yet");
      return;
    }

    const requestDTO = {
      requesterId: empId,
      budgetYear: 2025,
      details: selectedEmployees.map((emp) => ({
        empId: emp.empId,
        status: "PENDING",
      })),
    };

    setIsSubmitting(true);
    const toastId = toast.loading("Submitting request...");
    try {
      await authFetch(`${API_BASE_URL}/leave-transfer/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestDTO),
      });
      
      // Refresh both employees and requests
      const [employeesResponse, requestsResponse] = await Promise.all([
        authFetch(`${API_BASE_URL}/leave-transfer/employees/${empId}`),
        authFetch(`${API_BASE_URL}/leave-transfer/requests/${empId}`)
      ]);
      
      const employeesData = await employeesResponse.json();
      const requestsData = await requestsResponse.json();
      
      // Update employee statuses
      const employeeStatusMap = new Map<string, string>();
      requestsData.forEach((request: LeaveTransferRequestDTO) => {
        request.details.forEach((detail: LeaveTransferDetailDTO) => {
          employeeStatusMap.set(detail.empId, detail.status);
        });
      });

      setEmployees(
        employeesData.map((emp: Employee) => ({ 
          ...emp, 
          selected: false,
          status: employeeStatusMap.get(emp.empId) || "NOT_REQUESTED"
        }))
      );
      
      setSubmittedRequests(requestsData);
      setSelectAll(false);
      toast.success("Leave transfer request submitted successfully!", {
        id: toastId,
      });
    } catch (error: any) {
      let errorMsg = "Failed to submit request";
      if (error && typeof error.json === "function") {
        const errorData = await error.json();
        errorMsg = errorData?.message || errorMsg;
      }
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const viewDetails = (detail: LeaveTransferDetailDTO) => {
    setSelectedDetail(detail);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.empId.toString().includes(searchTerm)
  );

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
            Leave Transfer Request
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Submit leave transfer requests for employees
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
              Employee Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-5">
              <div>
                <label
                  htmlFor="employeeId"
                  className="flex items-center text-xs font-medium text-slate-500 mb-1"
                >
                  <FiUserCheck className="mr-1.5 opacity-70" size={12} />
                  Employee ID
                </label>
                <input
                  id="employeeId"
                  type="text"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  placeholder="Enter your employee ID"
                  disabled={isSubmitting || isDataLoading}
                  className="w-full p-2.5 text-sm bg-slate-50 text-slate-700 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                />
              </div>
              <InfoBlockStyled
                label="Full Name"
                value={employee.fullName}
                icon={<FiUserCheck size={12} />}
              />
              <InfoBlockStyled
                label="Position"
                value={employee.position}
                icon={<FiClipboard size={12} />}
              />
              <InfoBlockStyled
                label="Department"
                value={employee.department}
                icon={<FiFileText size={12} />}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white backdrop-blur-md rounded-xl border border-slate-200 shadow-xl overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold text-[#3c8dbc] mb-4 flex items-center">
              <FiUsers className="mr-2 text-xl" />
              Select Employees for Leave Transfer
            </h2>

            <div className="mb-4">
              <label
                htmlFor="searchEmployees"
                className="flex items-center text-xs font-medium text-slate-500 mb-1"
              >
                <FiSearch className="mr-1.5 opacity-70" size={12} />
                Search Employees
              </label>
              <div className="relative">
                <input
                  id="searchEmployees"
                  type="text"
                  className="w-full p-2.5 pl-10 text-sm bg-slate-50 text-slate-700 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                  placeholder="Search by name or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={!empId || isDataLoading}
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
                    <th className="text-left py-3.5 px-4 text-slate-600 uppercase text-xs font-semibold tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        disabled={!empId || isDataLoading}
                        className="h-4 w-4 text-[#3c8dbc] focus:ring-[#3c8dbc] border-slate-300 rounded"
                      />
                    </th>
                    {["Employee ID", "Full Name", "Position", "Department", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left py-3.5 px-4 text-slate-600 uppercase text-xs font-semibold tracking-wider"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {isDataLoading && filteredEmployees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-[#3c8dbc]"
                      >
                        <FiRefreshCw className="animate-spin inline-block mr-2 w-5 h-5" />
                        Loading Employees...
                      </td>
                    </tr>
                  ) : !isDataLoading && filteredEmployees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-gray-500"
                      >
                        {searchTerm
                          ? "No matching employees found"
                          : empId
                          ? "No employees in your department"
                          : "Enter your Employee ID to see colleagues"}
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <tr
                        key={emp.empId}
                        className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors duration-150"
                      >
                        <td className="py-3 px-4 text-sm text-gray-500">
                          <input
                            type="checkbox"
                            checked={!!emp.selected}
                            onChange={() => handleSelectEmployee(emp.empId)}
                            disabled={!empId || isDataLoading || emp.status !== "NOT_REQUESTED"}
                            className="h-4 w-4 text-[#3c8dbc] focus:ring-[#3c8dbc] border-slate-300 rounded"
                          />
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {emp.empId}
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-800">
                          {emp.fullName}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {emp.position}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {emp.department}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              emp.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : emp.status === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : emp.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {emp.status === "NOT_REQUESTED" ? "Not Requested" : emp.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <motion.button
                onClick={handleSubmit}
                disabled={isSubmitting || !empId || employees.length === 0}
                className={`px-5 py-2.5 text-sm text-white rounded-lg font-semibold shadow-md hover:shadow-lg flex items-center transition-all duration-200 ${
                  isSubmitting || !empId || employees.length === 0
                    ? "bg-slate-400 cursor-not-allowed opacity-70"
                    : "bg-[#3c8dbc] hover:bg-[#3c8dbc]/80 focus:ring-[#3c8dbc]"
                }`}
                whileHover={
                  !isSubmitting && empId && employees.length > 0
                    ? {
                        scale: 1.03,
                        y: -1,
                        boxShadow: "0 4px 15px rgba(60,141,188,0.3)",
                      }
                    : {}
                }
                whileTap={
                  !isSubmitting && empId && employees.length > 0
                    ? { scale: 0.97 }
                    : {}
                }
              >
                {isSubmitting ? (
                  <FiRefreshCw className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  <FiCheckCircle className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white backdrop-blur-md rounded-xl border border-slate-200 shadow-xl overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold text-[#3c8dbc] mb-4 flex items-center">
              <FiFileText className="mr-2 text-xl" />
              Submitted Leave Transfer Requests
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/80">
                    {[
                      "Request ID",
                      "Budget Year",
                      "Status",
                      "Created Date",
                      "Employees Involved",
                      "Actions"
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
                  {isDataLoading && submittedRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-[#3c8dbc]"
                      >
                        <FiRefreshCw className="animate-spin inline-block mr-2 w-5 h-5" />
                        Loading Requests...
                      </td>
                    </tr>
                  ) : !isDataLoading && submittedRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-gray-500"
                      >
                        {empId
                          ? "No submitted requests found"
                          : "Enter your Employee ID to see requests"}
                      </td>
                    </tr>
                  ) : (
                    submittedRequests.map((request) => (
                      <tr
                        key={request.transferId}
                        className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors duration-150"
                      >
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {request.transferId}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {request.budgetYear}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              request.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : request.status === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {request.status || "Pending"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {request.createdDate
                            ? new Date(request.createdDate).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {request.details && request.details.length > 0
                            ? request.details
                                .map((detail) => detail.empId)
                                .join(", ")
                            : "N/A"}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <button
                            onClick={() => {
                              // Show first detail for simplicity, you might want to show all details
                              if (request.details && request.details.length > 0) {
                                viewDetails(request.details[0]);
                              }
                            }}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                            <FiEye className="inline mr-1" size={12} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detail View Modal */}
      <AnimatePresence>
        {selectedDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-[#3c8dbc] mb-4">
                Request Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-500">Employee ID</label>
                  <p className="text-sm text-slate-700">{selectedDetail.empId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-500">Status</label>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      selectedDetail.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : selectedDetail.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedDetail.status || "Pending"}
                  </span>
                </div>
                {selectedDetail.approverNotes && (
                  <div>
                    <label className="text-sm font-medium text-slate-500">Approver Notes</label>
                    <p className="text-sm text-slate-700 bg-slate-100 p-2 rounded">
                      {selectedDetail.approverNotes}
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="mt-4 px-4 py-2 bg-[#3c8dbc] text-white rounded-md hover:bg-[#3c8dbc]/80"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeaveTransferRequest;