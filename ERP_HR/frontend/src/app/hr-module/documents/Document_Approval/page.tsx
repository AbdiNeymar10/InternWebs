"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { authFetch } from "@/utils/authFetch";
import {
  FiFileText,
  FiSearch,
  FiCheck,
  FiRefreshCw,
  FiAlertTriangle,
  FiUser,
  FiClock,
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

interface DocumentRequest {
  id: number;
  requester: string;
  documentType: { name: string } | null;
  requestedDate: string;
  remark: string;
  status: string;
}

// API Configuration
const API_BASE_URL = "http://localhost:8080/api/hrdocument";

const retry = async <T,>(
  fn: () => Promise<T>,
  retries: number = 2,
  delay: number = 1000
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries reached");
};

function validateRequests(data: any): DocumentRequest[] {
  if (!Array.isArray(data)) {
    console.error(
      "Validation Error: Expected array of requests, received:",
      data
    );
    throw new Error("Expected array of requests");
  }

  return data.map((item) => ({
    id: item.id || 0,
    requester: item.requester || "Unknown",
    documentType:
      item.documentType && typeof item.documentType.name === "string"
        ? { name: item.documentType.name }
        : item.documentType && typeof item.documentType.type === "string"
        ? { name: item.documentType.type }
        : null,
    requestedDate: item.requestedDate || new Date().toISOString(),
    remark: item.remark || "",
    status: item.status || "N/A",
  }));
}

const DocumentApproval = () => {
  const [pendingRequests, setPendingRequests] = useState<DocumentRequest[]>([]);
  const [historicalRequests, setHistoricalRequests] = useState<
    DocumentRequest[]
  >([]);
  const [searchTermPending, setSearchTermPending] = useState("");
  const [searchTermHistory, setSearchTermHistory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setIsLoadingRequests(true);
    setError(null);
    try {
      const fetchAll = async () => {
        const response = await authFetch(`${API_BASE_URL}/approval`);
        const data = await response.json();
        return validateRequests(data);
      };
      const reqs = await retry(fetchAll);
      setPendingRequests(reqs.filter((req) => req.status === "PENDING"));
      setHistoricalRequests(reqs.filter((req) => req.status !== "PENDING"));
    } catch (error: any) {
      const errorMessage =
        error.message ||
        "Network error: Unable to connect to server for requests.";
      console.error("Error fetching requests:", error);
      setError(errorMessage);
      toast.error(errorMessage, { id: "requestsErrorToast" });
      setPendingRequests([]);
      setHistoricalRequests([]);
    } finally {
      setIsLoadingRequests(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleApprove = async (id: number) => {
    setIsSubmitting(true);
    try {
      const currentDateTime = new Date().toISOString();
      await retry(async () => {
        const response = await authFetch(`${API_BASE_URL}/approve/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            approveDate: currentDateTime,
            approvedRefNo: `APPROVED_REF-${id}-${Date.now()}`,
          }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to approve: ${response.status} ${response.statusText} - ${errorText}`
          );
        }
      });
      toast.success(`Request ${id} approved successfully!`);
      fetchRequests();
    } catch (error: any) {
      const errorMessage =
        error.message || "Network error: Unable to connect to server.";
      console.error(`Error approving request ${id}:`, error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPendingRequests = pendingRequests.filter(
    (request) =>
      request.requester
        .toLowerCase()
        .includes(searchTermPending.toLowerCase()) ||
      (request.documentType?.name
        .toLowerCase()
        .includes(searchTermPending.toLowerCase()) ??
        false) ||
      (request.remark
        ?.toLowerCase()
        .includes(searchTermPending.toLowerCase()) ??
        false)
  );

  const filteredHistoricalRequests = historicalRequests.filter(
    (request) =>
      request.requester
        .toLowerCase()
        .includes(searchTermHistory.toLowerCase()) ||
      (request.documentType?.name
        .toLowerCase()
        .includes(searchTermHistory.toLowerCase()) ??
        false) ||
      (request.remark
        ?.toLowerCase()
        .includes(searchTermHistory.toLowerCase()) ??
        false) ||
      (request.status
        ?.toLowerCase()
        .includes(searchTermHistory.toLowerCase()) ??
        false)
  );

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
          success: { iconTheme: { primary: "#3c8dbc", secondary: "white" } },
          error: { iconTheme: { primary: "#EF4444", secondary: "white" } },
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2c6da4] to-[#3c8dbc]">
            Document Approval
          </h1>
          <p className="text-gray-600 mt-2">
            Approve pending document requests and view history
          </p>
        </motion.div>

        {/* Pending Requests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-md rounded-xl border border-[#3c8dbc]/20 shadow-xl overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#3c8dbc] mb-4 flex items-center">
              <FiFileText className="mr-2" />
              Pending Document Requests
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-start">
                <FiAlertTriangle className="mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error Loading Requests</p>
                  <p className="text-sm">{error}</p>
                  <button
                    onClick={fetchRequests}
                    className="mt-2 text-sm underline hover:text-red-900 font-medium"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="search-pending"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Pending Requests
              </label>
              <div className="relative">
                <input
                  id="search-pending"
                  type="text"
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                  placeholder="Search by Employee ID, Document Type, or Remark"
                  value={searchTermPending}
                  onChange={(e) => setSearchTermPending(e.target.value)}
                  disabled={isLoadingRequests && pendingRequests.length === 0}
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#3c8dbc]">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      No.
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Employee ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Document Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Request Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoadingRequests && pendingRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-10 text-center text-sm text-gray-500"
                      >
                        <div className="flex justify-center items-center">
                          <FiRefreshCw className="animate-spin text-2xl text-[#3c8dbc] mr-3" />
                          Loading pending requests...
                        </div>
                      </td>
                    </tr>
                  ) : !isLoadingRequests &&
                    !error &&
                    filteredPendingRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-10 text-center text-sm text-gray-500"
                      >
                        {searchTermPending
                          ? "No matching pending requests found."
                          : "No pending requests available at the moment."}
                      </td>
                    </tr>
                  ) : (
                    filteredPendingRequests.map((request) => (
                      <tr
                        key={`pending-${request.id}`}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <FiUser className="mr-2 text-[#3c8dbc]" />
                            {request.requester}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {request.documentType?.name ?? "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(request.requestedDate).toLocaleDateString()}
                        </td>
                        <td
                          className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"
                          title={request.remark}
                        >
                          {request.remark || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              request.status === "APPROVED"
                                ? "bg-green-100 text-green-700"
                                : request.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {request.status === "PENDING" ? (
                            <button
                              onClick={() => handleApprove(request.id)}
                              disabled={isSubmitting}
                              className={`flex items-center justify-center px-3 py-1.5 rounded-md text-white font-medium transition-colors ${
                                isSubmitting
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-[#3c8dbc] hover:bg-[#367fa9] focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:ring-opacity-50"
                              }`}
                              title={`Approve request ${request.id}`}
                            >
                              {isSubmitting ? (
                                <>
                                  <FiRefreshCw className="animate-spin inline-block mr-1.5" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <FiCheck className="mr-1.5" />
                                  Approve
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="text-gray-400 italic">
                              No actions
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                  {!isLoadingRequests &&
                    error &&
                    pendingRequests.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-10 text-center text-sm text-red-600"
                        >
                          Failed to load pending requests. Please try again.
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Historical Requests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FiClock className="mr-2 text-gray-500" />
              Processed Request History
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-start">
                <FiAlertTriangle className="mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error Loading History</p>
                  <p className="text-sm">{error}</p>
                  <button
                    onClick={fetchRequests}
                    className="mt-2 text-sm underline hover:text-red-900 font-medium"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="search-history"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search History
              </label>
              <div className="relative">
                <input
                  id="search-history"
                  type="text"
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                  placeholder="Search by Employee ID, Document Type, Status, or Remark"
                  value={searchTermHistory}
                  onChange={(e) => setSearchTermHistory(e.target.value)}
                  disabled={
                    isLoadingRequests && historicalRequests.length === 0
                  }
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      No.
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Employee ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Document Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Request Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoadingRequests && historicalRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-10 text-center text-sm text-gray-500"
                      >
                        <div className="flex justify-center items-center">
                          <FiRefreshCw className="animate-spin text-2xl text-gray-400 mr-3" />
                          Loading historical requests...
                        </div>
                      </td>
                    </tr>
                  ) : !isLoadingRequests &&
                    !error &&
                    filteredHistoricalRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-10 text-center text-sm text-gray-500"
                      >
                        {searchTermHistory
                          ? "No matching historical requests found."
                          : "No historical requests available."}
                      </td>
                    </tr>
                  ) : (
                    filteredHistoricalRequests.map((request) => (
                      <tr
                        key={`history-${request.id}`}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <FiUser className="mr-2 text-gray-400" />
                            {request.requester}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {request.documentType?.name ?? "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(request.requestedDate).toLocaleDateString()}
                        </td>
                        <td
                          className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"
                          title={request.remark}
                        >
                          {request.remark || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              request.status === "APPROVED"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                  {!isLoadingRequests &&
                    error &&
                    historicalRequests.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-10 text-center text-sm text-red-600"
                        >
                          Failed to load historical requests. Please try again.
                        </td>
                      </tr>
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

export default DocumentApproval;
