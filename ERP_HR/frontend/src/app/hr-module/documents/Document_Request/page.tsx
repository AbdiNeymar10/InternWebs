"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { authFetch } from "@/utils/authFetch";
import {
  FiFileText,
  FiCheck,
  FiRefreshCw,
  FiAlertTriangle,
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

// Interface for DocumentType
interface DocumentType {
  id: number;
  type: string;
  description?: string;
}

// API Configuration
const API_BASE_URL = "http://localhost:8080/api/hrdocument";

const DocumentRequest = () => {
  const [workId, setWorkId] = useState("");
  const [documentTypeId, setDocumentTypeId] = useState<number | null>(null);
  const [remark, setRemark] = useState("");
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocumentTypes = useCallback(async () => {
    setIsLoadingTypes(true);
    setError(null);
    try {
      const response = await authFetch(`${API_BASE_URL}/document-types`);
      const data = await response.json();
      console.log("API Response for Document Types:", data);
      if (!Array.isArray(data)) {
        console.error("Error: Document types response is not an array!", data);
        setDocumentTypes([]);
        throw new Error("Received invalid data format for document types.");
      }
      const validatedTypes = data.map((dt: any) => ({
        id: dt.id || 0,
        type: dt.name || dt.type || "Unknown Type",
        description: dt.description,
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

  useEffect(() => {
    fetchDocumentTypes();
  }, [fetchDocumentTypes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting request with data:", {
      workId,
      documentTypeId,
      remark,
    });

    if (!workId || documentTypeId === null || !remark) {
      toast.error("Please fill out all fields");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const currentDateTime = new Date().toISOString();
      const response = await authFetch(`${API_BASE_URL}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentType: { id: documentTypeId },
          workId,
          remark,
          requester: `Employee ${workId}`,
          requestedDate: currentDateTime,
          referenceNo: `REF-${workId}-${Date.now()}`,
        }),
      });
      const data = await response.json();
      console.log("Submit request response:", data);

      toast.success("Request submitted successfully!");
      setRemark("");
      setDocumentTypeId(null);
    } catch (err: any) {
      console.error("Error submitting request:", err);
      const message = err.message || "Failed to submit request";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
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
                  value={documentTypeId === null ? "" : documentTypeId}
                  onChange={(e) =>
                    setDocumentTypeId(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  disabled={isLoadingTypes}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                  required
                >
                  <option value="">
                    {isLoadingTypes ? "Loading..." : "Select document type"}
                  </option>
                  {documentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.type} {type.description && `- ${type.description}`}
                    </option>
                  ))}
                </select>
                {isLoadingTypes && documentTypes.length === 0 && (
                  <p className="mt-1 text-xs text-gray-500">
                    Loading document types...
                  </p>
                )}
                {!isLoadingTypes && documentTypes.length === 0 && (
                  <p className="mt-1 text-xs text-red-500">
                    No document types found or failed to load.
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="remark"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Remarks *
                </label>
                <textarea
                  id="remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                  placeholder="Please describe why you need this document..."
                  required
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting || isLoadingTypes}
                  className={`w-full px-4 py-2 rounded-md text-white font-medium flex items-center justify-center transition-colors ${
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
                      <FiCheck className="mr-2" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentRequest;
