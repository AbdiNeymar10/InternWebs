"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { authFetch } from "@/utils/authFetch";
import {
  FiFileText,
  FiCheck,
  FiRefreshCw,
  FiAlertTriangle,
  FiClock,
  FiUser,
  FiSearch,
  FiUpload,
  FiDownload,
  FiEye,
  FiX,
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

interface DocumentType {
  id: number;
  name: string;
  description?: string;
  isActive?: string;
}

interface DocumentRequest {
  id: number;
  requester: string;
  documentType: { name: string } | null;
  requestedDate: string;
  remark: string;
  status: string;
  approvedRefNo?: string;
  droperRemark?: string;
  attachmentName?: string;
  attachmentPath?: string;
  workId?: string;
}

interface FileInfo {
  originalName: string;
  storedName: string;
  downloadUrl: string;
  viewUrl: string;
}

const API_BASE_URL = "http://localhost:8080/api/hrdocument";

const DocumentRequest = () => {
  const [workId, setWorkId] = useState("");
  const [documentTypeId, setDocumentTypeId] = useState<number | null>(null);
  const [remark, setRemark] = useState("");
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [myRequests, setMyRequests] = useState<DocumentRequest[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchDocumentTypes = useCallback(async () => {
    setIsLoadingTypes(true);
    setError(null);
    try {
      const response = await authFetch(`${API_BASE_URL}/document-types`);
      if (!response.ok) {
        throw new Error(`Failed to fetch document types: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format for document types");
      }
      const validatedTypes = data.map((dt: any) => ({
        id: dt.id || 0,
        name: dt.name || "Unknown Type",
        description: dt.description,
        isActive: dt.isActive,
      }));
      setDocumentTypes(validatedTypes);
    } catch (err: any) {
      console.error("Error fetching document types:", err);
      const message = err.message || "Failed to load document types";
      setError(message);
      toast.error(message);
      setDocumentTypes([]);
    } finally {
      setIsLoadingTypes(false);
    }
  }, []);

  const fetchMyRequests = useCallback(async () => {
    if (!workId.trim()) {
      setMyRequests([]);
      return;
    }
    
    setIsLoadingRequests(true);
    setError(null);
    try {
      const response = await authFetch(`${API_BASE_URL}/employee/${workId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setMyRequests([]);
          return;
        }
        throw new Error(`Failed to fetch requests: ${response.status}`);
      }
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format for requests");
      }
      
      const validatedRequests = data.map((item: any) => ({
        id: item.id || 0,
        requester: item.requester || "Unknown",
        documentType: item.documentType || null,
        requestedDate: item.requestedDate || new Date().toISOString(),
        remark: item.remark || "",
        status: item.status || "N/A",
        approvedRefNo: item.approvedRefNo || "",
        droperRemark: item.droperRemark || "",
        attachmentName: item.attachmentName || "",
        attachmentPath: item.attachmentPath || "",
        workId: item.workId || "",
      }));
      
      setMyRequests(validatedRequests);
    } catch (err: any) {
      console.error("Error fetching my requests:", err);
      const message = err.message || "Failed to load your requests";
      setError(message);
      setMyRequests([]);
    } finally {
      setIsLoadingRequests(false);
    }
  }, [workId]);

  useEffect(() => {
    fetchDocumentTypes();
  }, [fetchDocumentTypes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMyRequests();
    }, 500);

    return () => clearTimeout(timer);
  }, [workId, fetchMyRequests]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workId.trim() || documentTypeId === null || !remark.trim()) {
      toast.error("Please fill out all required fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("workId", workId.trim());
      formData.append("documentTypeId", documentTypeId.toString());
      formData.append("remark", remark.trim());
      
      if (selectedFile) {
        if (selectedFile.size > 10 * 1024 * 1024) {
          throw new Error("File size must be less than 10MB");
        }
        formData.append("file", selectedFile);
      }

      const response = await authFetch(`${API_BASE_URL}/request`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to submit request: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Submit request response:", data);

      toast.success("Request submitted successfully!");
      setRemark("");
      setDocumentTypeId(null);
      setSelectedFile(null);
      fetchMyRequests();
    } catch (err: any) {
      console.error("Error submitting request:", err);
      const message = err.message || "Failed to submit request";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }
    setSelectedFile(file);
  };

  const viewDocument = async (requestId: number) => {
    try {
      const response = await authFetch(`${API_BASE_URL}/${requestId}/file-info`);
      if (response.ok) {
        const fileInfo: FileInfo = await response.json();
        window.open(fileInfo.viewUrl, '_blank');
      } else {
        toast.error("No document attached to this request");
      }
    } catch (error) {
      console.error("Error viewing document:", error);
      toast.error("Failed to view document");
    }
  };

  const downloadDocument = async (requestId: number) => {
    try {
      const response = await authFetch(`${API_BASE_URL}/${requestId}/file-info`);
      if (response.ok) {
        const fileInfo: FileInfo = await response.json();
        const link = document.createElement('a');
        link.href = fileInfo.downloadUrl;
        link.download = fileInfo.originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error("No document attached to this request");
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document");
    }
  };

  const filteredRequests = myRequests.filter((request) =>
    (request.documentType?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (request.remark?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (request.status?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (request.approvedRefNo?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (request.droperRemark?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2c6da4] to-[#3c8dbc]">
            Document Request
          </h1>
          <p className="text-gray-600 mt-2">Submit your document requests</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-md rounded-xl border border-[#3c8dbc]/20 shadow-xl overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#3c8dbc] mb-4 flex items-center">
              <FiFileText className="mr-2" />
              New Request
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-start">
                <FiAlertTriangle className="mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label
                  htmlFor="workId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Work ID *
                </label>
                <input
                  id="workId"
                  type="text"
                  value={workId}
                  onChange={(e) => setWorkId(e.target.value)}
                  placeholder="Enter your employee ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="documentType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Document Type *
                </label>
                <select
                  id="documentType"
                  value={documentTypeId || ""}
                  onChange={(e) =>
                    setDocumentTypeId(
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                  required
                  disabled={isLoadingTypes || isSubmitting}
                >
                  <option value="">Select a document type</option>
                  {documentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {isLoadingTypes && (
                  <p className="mt-1 text-xs text-gray-500">
                    Loading document types...
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="remark"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description / Remark *
                </label>
                <textarea
                  id="remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Please describe the purpose of this document request"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attach Document (Optional)
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                      disabled={isSubmitting}
                    />
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-between">
                      <span className="text-gray-600 truncate max-w-xs">
                        {selectedFile ? selectedFile.name : "Choose file..."}
                      </span>
                      <FiUpload className="text-gray-400 flex-shrink-0" />
                    </div>
                  </label>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="px-3 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors flex items-center whitespace-nowrap"
                      disabled={isSubmitting}
                    >
                      <FiX className="mr-1" />
                      Remove
                    </button>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG, TXT (Max 10MB)
                </p>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting || isLoadingTypes}
                  className={`w-full px-6 py-3 rounded-md text-white font-medium flex items-center justify-center transition-colors ${
                    isSubmitting || isLoadingTypes
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#3c8dbc] hover:bg-[#367fa9]"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <FiRefreshCw className="animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiFileText className="mr-2" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FiClock className="mr-2 text-gray-500" />
              My Document Requests
            </h2>

            <div className="mb-4">
              <label
                htmlFor="search-requests"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search My Requests
              </label>
              <div className="relative">
                <input
                  id="search-requests"
                  type="text"
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                  placeholder="Search by Document Type, Status, Remark, or Reference No"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoadingRequests && myRequests.length === 0}
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No.
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference/Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoadingRequests && myRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                        <div className="flex justify-center items-center">
                          <FiRefreshCw className="animate-spin text-2xl text-gray-400 mr-3" />
                          Loading your requests...
                        </div>
                      </td>
                    </tr>
                  ) : !isLoadingRequests && !error && filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                        {searchTerm
                          ? "No matching requests found."
                          : workId
                          ? "You haven't made any document requests yet."
                          : "Enter your Work ID to see your requests."}
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((request) => (
                      <tr key={`my-request-${request.id}`} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {request.documentType?.name ?? "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(request.requestedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                          <div className="truncate" title={request.remark}>
                            {request.remark || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {request.attachmentPath ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => viewDocument(request.id)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors"
                                title="View document"
                              >
                                <FiEye size={16} />
                              </button>
                              <button
                                onClick={() => downloadDocument(request.id)}
                                className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition-colors"
                                title="Download document"
                              >
                                <FiDownload size={16} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">No document</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                          <div className="truncate" title={request.status === "APPROVED" ? request.approvedRefNo : request.droperRemark}>
                            {request.status === "APPROVED" ? (
                              <span className="text-green-600">Ref: {request.approvedRefNo || "N/A"}</span>
                            ) : request.status === "REJECTED" ? (
                              <span className="text-red-600">Reason: {request.droperRemark || "N/A"}</span>
                            ) : (
                              "N/A"
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                  {!isLoadingRequests && error && myRequests.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-red-600">
                        Failed to load your requests. Please try again.
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

export default DocumentRequest;