"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  FiCalendar,
  FiChevronDown,
  FiRefreshCw,
  FiUser,
  FiUpload,
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

const API_BASE_URL = "http://localhost:8080/api";

interface SeparationTypeOption {
  id: string;
  name: string;
}

interface CreatedSeparationRequest {
  id: string;
  employeeId?: string;
  supportiveFileName?: string;
}

interface UploadedFileResponse {
  uploadId: string;
  fileName: string;
  fileType: string;
}

async function fetchWrapper(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, {
      ...options,
      headers:
        options?.body instanceof FormData
          ? { Accept: "application/json", ...options?.headers }
          : {
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
        errorData.message = response.statusText || errorData.message;
      }
      console.error(`API call failed to ${url}:`, errorData.message, {
        url,
        options,
        responseStatus: response.status,
        errorDataBackend: errorData,
      });
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
    console.error(`API call failed to ${url} (outer catch):`, error);
    throw error;
  }
}

async function fetchSeparationTypesAPI(): Promise<SeparationTypeOption[]> {
  try {
    const response = await fetchWrapper(`${API_BASE_URL}/separation-types`);
    if (Array.isArray(response)) {
      return response.map((item: any) => ({
        id: item.separationTypeId,
        name: item.description,
      }));
    }
    return [];
  } catch (error) {
    toast.error(
      "Could not load separation types. Please check console for details."
    );
    return [];
  }
}

async function uploadSupportiveFileAPI(
  file: File,
  separationId?: string
): Promise<UploadedFileResponse | null> {
  const formData = new FormData();
  formData.append("file", file);
  if (separationId) {
    formData.append("separationId", separationId);
  }
  return fetchWrapper(
    `${API_BASE_URL}/files/upload-separation-supportive-doc`,
    {
      method: "POST",
      body: formData,
    }
  ) as Promise<UploadedFileResponse | null>;
}

async function submitSeparationRequestAPI(
  requestData: any
): Promise<CreatedSeparationRequest | null> {
  return fetchWrapper(`${API_BASE_URL}/employee-separations`, {
    method: "POST",
    body: JSON.stringify(requestData),
  }) as Promise<CreatedSeparationRequest | null>;
}

export default function SeparationRequest() {
  const [formData, setFormData] = useState({
    employeeId: "",
    requestDate: "", // User will pick
    separationTypeId: "",
    description: "",
    remark: "",
    resignationDate: "",
    preparedBy: "",
    preparedDate: "", // User will pick this separately
    comment: "",
  });

  const [separationTypes, setSeparationTypes] = useState<
    SeparationTypeOption[]
  >([]);
  const [isLoadingSeparationTypes, setIsLoadingSeparationTypes] =
    useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileSuccessName, setUploadedFileSuccessName] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadSeparationTypes = async () => {
      setIsLoadingSeparationTypes(true);
      const types = await fetchSeparationTypesAPI();
      setSeparationTypes(types);
      setIsLoadingSeparationTypes(false);
    };
    loadSeparationTypes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit example
        toast.error("File is too large. Maximum 10MB allowed.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setUploadedFile(null);
        return;
      }
      setUploadedFile(file);
      setUploadedFileSuccessName(null);
    } else {
      setUploadedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.employeeId.trim()) {
      toast.error("Employee ID is required.");
      return;
    }
    if (!formData.requestDate) {
      toast.error("Request Date is required.");
      return;
    }
    if (!formData.separationTypeId) {
      toast.error("Separation Type is required.");
      return;
    }
    const selectedSeparationType = separationTypes.find(
      (st) => st.id === formData.separationTypeId
    );
    if (
      selectedSeparationType?.name?.toLowerCase().includes("resignation") &&
      !formData.resignationDate
    ) {
      toast.error("Resignation Date is required for resignation types.");
      return;
    }
    if (!formData.remark.trim()) {
      toast.error("Reason for Request is required.");
      return;
    }
    if (!formData.preparedBy.trim()) {
      toast.error("Prepared By is required.");
      return;
    }
    if (!formData.preparedDate) {
      // Validation for the separate preparedDate
      toast.error("Prepared Date is required.");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Submitting request...", { id: "submit-request-toast" });

    let uploadedFileInfo: UploadedFileResponse | null = null;
    let supportiveFileNameForRequest: string | null = null;

    if (uploadedFile) {
      try {
        toast.loading("Uploading file...", { id: "upload-file-toast" });
        uploadedFileInfo = await uploadSupportiveFileAPI(uploadedFile);
        if (uploadedFileInfo && uploadedFileInfo.fileName) {
          supportiveFileNameForRequest = uploadedFileInfo.fileName;
          toast.success(
            `File "${uploadedFileInfo.fileName}" uploaded successfully.`,
            { id: "upload-file-toast" }
          );
          setUploadedFileSuccessName(uploadedFileInfo.fileName);
        } else {
          toast.error("File upload failed or did not return expected data.", {
            id: "upload-file-toast",
          });
          setIsSubmitting(false);
          toast.dismiss("submit-request-toast");
          return;
        }
      } catch (uploadError: any) {
        toast.error(`File upload failed: ${uploadError.message}`, {
          id: "upload-file-toast",
        });
        setIsSubmitting(false);
        toast.dismiss("submit-request-toast");
        return;
      }
    }

    const submissionData: any = {
      employeeId: formData.employeeId,
      separationTypeId: formData.separationTypeId,
      requestDate: formData.requestDate,
      resignationDate: formData.resignationDate || null,
      description: formData.description,
      remark: formData.remark,
      comment: formData.comment,
      preparedBy: formData.preparedBy,
      preparedDate: formData.preparedDate, // Sending the distinct preparedDate
      supportiveFileName: supportiveFileNameForRequest,
      status: 0,
    };

    try {
      const result = await submitSeparationRequestAPI(submissionData);

      if (result && result.id) {
        toast.success(
          `Separation request (ID: ${result.id}) submitted successfully! It will be available for department approval.`,
          { duration: 7000 }
        );
        setFormData({
          employeeId: "",
          requestDate: "", // Reset to empty
          separationTypeId: "",
          description: "",
          remark: "",
          resignationDate: "",
          preparedBy: "",
          preparedDate: "", // Reset preparedDate to empty
          comment: "",
        });
        setUploadedFile(null);
        setUploadedFileSuccessName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error(
          "Request submitted, but failed to get confirmation ID. Please check or try again."
        );
      }
    } catch (error: any) {
      toast.error(
        error.message ||
          "Failed to submit separation request. Please try again."
      );
      if (supportiveFileNameForRequest) {
        toast.error(
          "Separation request submission failed, but file was uploaded. Please contact support.",
          { duration: 6000 }
        );
      }
    } finally {
      setIsSubmitting(false);
      toast.dismiss("submit-request-toast");
    }
  };

  return (
    <div className="min-h-screen p-6 font-sans relative overflow-hidden bg-slate-50">
      <Toaster
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
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc]/10 to-purple-50 opacity-30"></div>
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, type: "spring" }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#3c8dbc] bg-clip-text bg-gradient-to-r from-[#3c8dbc] to-[#5c9dce] inline-block">
                Separation Request
              </h1>
            </div>
            {(isSubmitting || isLoadingSeparationTypes) && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-[#3c8dbc]"
              >
                <FiRefreshCw className="w-6 h-6" />
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#3c8dbc]/20 shadow-xl overflow-hidden p-6 lg:p-8"
        >
          {/* Row 1: Employee ID and Request Date */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label
                htmlFor="employeeId"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Employee ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent shadow-sm"
                  required
                  placeholder="Enter employee ID"
                />
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }} // Changed x for variety
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label
                htmlFor="requestDate"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Request Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="requestDate"
                  name="requestDate"
                  value={formData.requestDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent pr-10 shadow-sm"
                  required
                />
                <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </motion.div>
          </div>

          {/* Row 2: Separation Type and Resignation Date */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label
                htmlFor="separationTypeId"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Separation Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="separationTypeId"
                  name="separationTypeId"
                  value={formData.separationTypeId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 appearance-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent shadow-sm bg-white"
                  required
                  disabled={isLoadingSeparationTypes}
                >
                  <option value="">
                    {isLoadingSeparationTypes
                      ? "Loading types..."
                      : "--Select Separation Type--"}
                  </option>
                  {separationTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }} // Changed x for variety
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.38 }}
            >
              <label
                htmlFor="resignationDate"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Resignation Date
                {separationTypes
                  .find((st) => st.id === formData.separationTypeId)
                  ?.name?.toLowerCase()
                  .includes("resignation") && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="resignationDate"
                  name="resignationDate"
                  value={formData.resignationDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent pr-10 shadow-sm"
                />
                <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </motion.div>
          </div>

          {/* Row 3: Reason for Request and Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }} // Adjusted delay
            >
              <label
                htmlFor="remark"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Reason for Request <span className="text-red-500">*</span>
              </label>
              <textarea
                id="remark"
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent shadow-sm"
                rows={3}
                placeholder="State the reason..."
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }} // Adjusted delay
            >
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Additional Information (Description):
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent shadow-sm"
                rows={3}
                placeholder="Enter any additional details..."
              />
            </motion.div>
          </div>

          {/* File Upload Section */}
          <div className="mb-6">
            <motion.div
              initial={{ opacity: 0, x: 10 }} // Reverted to x: 10 for consistency if desired, or keep y
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
              className="border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <h3 className="text-md font-semibold text-gray-700 mb-3">
                Attach Supporting Document (Optional)
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <motion.button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#5c9dce] text-white px-4 py-2 rounded-md hover:bg-[#4a8db8] transition-colors shadow-sm flex items-center gap-2 text-sm"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <FiUpload /> Browse File
                  </motion.button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {uploadedFile && (
                    <span className="text-sm text-gray-600 truncate max-w-xs">
                      {uploadedFile.name}
                    </span>
                  )}
                  {uploadedFileSuccessName && !uploadedFile && (
                    <span className="text-sm text-green-600 truncate max-w-xs">
                      Previously uploaded: {uploadedFileSuccessName}
                    </span>
                  )}
                </div>
                {!uploadedFile && !uploadedFileSuccessName && (
                  <div className="text-xs text-gray-500 italic">
                    No file selected.
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Prepared Info Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Preparation Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label
                  htmlFor="preparedBy"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Prepared By <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="preparedBy"
                  name="preparedBy"
                  value={formData.preparedBy}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent shadow-sm"
                  placeholder="Enter preparer's name or ID"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <label
                  htmlFor="preparedDate"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Prepared Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="preparedDate"
                    name="preparedDate"
                    value={formData.preparedDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent pr-10 shadow-sm"
                    required
                  />
                  <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-5"
            >
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Opinion / Further Comments:
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent shadow-sm"
                rows={3}
                placeholder="Enter any opinions or further comments..."
              />
            </motion.div>
          </div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, type: "spring" }}
            className="pt-8 flex justify-end"
          >
            <motion.button
              type="submit"
              whileHover={{
                scale: 1.03,
                boxShadow: "0px 7px 15px rgba(0,0,0,0.1)",
              }}
              whileTap={{ scale: 0.97 }}
              className="bg-gradient-to-r from-[#3c8dbc] to-[#5c9dce] text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              disabled={isSubmitting || isLoadingSeparationTypes}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <FiRefreshCw className="animate-spin mr-2 w-5 h-5" />
                  Submitting...
                </span>
              ) : (
                "Submit Request"
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}
