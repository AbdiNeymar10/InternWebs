"use client";

import { useState, useRef, useEffect } from "react";
import {
  FiUpload,
  FiFile,
  FiX,
  FiDownload,
  FiCheck,
  FiExternalLink,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { authFetch } from "@/utils/authFetch";

const documentCategories = [
  "Personal Identification",
  "Educational Certificate",
  "Employment Record",
  "Financial Document",
  "Medical Record",
  "Other",
];

type DocumentFile = {
  id: string;
  name: string;
  fileSize: number;
  type: string;
  category: string;
  description: string;
  uploadDate: string;
  file?: File | null;
  filePath?: string;
};

interface UploadProps {
  empId: string;
}

const Upload = ({ empId }: UploadProps) => {
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showCustomCategoryInput, setShowCustomCategoryInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDocuments();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowDocumentsModal(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        triggerFileInput();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await authFetch("http://localhost:8080/api/documents");
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (fileList: FileList) => {
    const newFiles = Array.from(fileList)
      .filter((file) => {
        const isValidType = file.type === "application/pdf";
        const isValidSize = file.size <= 10 * 1024 * 1024;
        if (!isValidType) {
          alert(`File ${file.name} is not a PDF. Only PDF files are accepted.`);
        } else if (!isValidSize) {
          alert(`File ${file.name} exceeds 10MB limit.`);
        }
        return isValidType && isValidSize;
      })
      .map((file) => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        fileSize: file.size,
        type: file.type,
        category: "",
        description: "",
        uploadDate: new Date().toISOString(),
        file,
      }));

    if (newFiles.length > 0) {
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = async (id: string) => {
    try {
      const response = await authFetch(
        `http://localhost:8080/api/documents/${id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error(await response.text());
      setFiles(files.filter((file) => file.id !== id));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const updateFileDetails = async (
    id: string,
    field: string,
    value: string
  ) => {
    try {
      const updatedFiles = files.map((file) =>
        file.id === id ? { ...file, [field]: value } : file
      );
      setFiles(updatedFiles);
      const response = await authFetch(
        `http://localhost:8080/api/documents/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category:
              field === "category"
                ? value
                : updatedFiles.find((f) => f.id === id)?.category ?? "",
            description:
              field === "description"
                ? value
                : updatedFiles.find((f) => f.id === id)?.description ?? "",
          }),
        }
      );
      if (!response.ok) throw new Error(await response.text());
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const addCustomCategory = () => {
    if (newCategory.trim() && !documentCategories.includes(newCategory)) {
      documentCategories.push(newCategory);
      setNewCategory("");
      setShowCustomCategoryInput(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    for (const file of files) {
      if (!file.file) continue;
      const formData = new FormData();
      formData.append("file", file.file);
      formData.append("category", file.category);
      formData.append("description", file.description);

      try {
        const response = await authFetch(
          "http://localhost:8080/api/documents/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        file.id = data.id;
        file.fileSize = data.fileSize;
        file.uploadDate = data.uploadDate;
        file.filePath = data.filePath;
        file.file = null;
      } catch (error) {
        console.error("Error uploading file:", error);
        alert(`Failed to upload ${file.name}`);
      }
    }

    setIsUploading(false);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setUploadProgress(0);
    }, 3000);
  };

  const handleDownload = async (id: string, fileName: string) => {
    try {
      const response = await authFetch(
        `http://localhost:8080/api/documents/${id}/download`
      );
      if (!response.ok) throw new Error(await response.text());
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handlePreview = async (id: string) => {
    try {
      const response = await authFetch(
        `http://localhost:8080/api/documents/${id}/preview`
      );
      if (!response.ok) throw new Error(await response.text());
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error previewing file:", error);
    }
  };

  const getCategoryColor = (category: string) => {
    if (!category) return "bg-gray-100 text-gray-800";
    const colors = {
      "Personal Identification": "bg-blue-100 text-blue-800",
      "Educational Certificate": "bg-emerald-100 text-emerald-800",
      "Employment Record": "bg-purple-100 text-purple-800",
      "Financial Document": "bg-amber-100 text-amber-800",
      "Medical Record": "bg-red-100 text-red-800",
      Other: "bg-gray-100 text-gray-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <div className="space-y-6 relative">
      {showDocumentsModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black z-10"
        />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`bg-white rounded-xl shadow-lg overflow-hidden ${
          showDocumentsModal ? "blur-sm" : ""
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 bg-[#3c8dbc] rounded-lg shadow-md p-2 md:p-3 text-white h-[50px]">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div>
              <h1 className="text-[14px] font-bold">Document Management</h1>
              <p className="text-blue-100 text-xs">
                Upload and manage your documents
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDocumentsModal(true)}
            className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded-md shadow-sm hover:shadow transition-all duration-300 border border-white border-opacity-20 text-xs md:text-sm mt-2 md:mt-0"
          >
            View Documents ({files.length})
          </button>
        </div>

        <div className="p-6 space-y-6">
          <motion.div
            className={`border-2 border-dashed rounded-xl p-8 text-center bg-gray-50 cursor-pointer transition-colors ${
              isDragging
                ? "border-[#3c8dbc] bg-blue-50"
                : "border-gray-300 hover:border-[#3c8dbc]"
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <FiUpload className="w-5 h-5 text-[#3c8dbc]" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                {isDragging
                  ? "Drop PDF files here"
                  : "Drag & drop PDF files here"}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                or click to browse files on your computer
              </p>
              <button
                type="button"
                className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-md transition-colors flex items-center gap-2 text-xs"
              >
                <FiUpload size={14} /> Select PDF Files
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
                multiple
                accept=".pdf,application/pdf"
              />
              <p className="mt-3 text-xs text-gray-500">
                Only PDF files are accepted (Max 10MB each)
              </p>
            </div>
          </motion.div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-700">
                DOCUMENTS TO UPLOAD
              </h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {files.length} {files.length === 1 ? "file" : "files"} selected
              </span>
            </div>

            {files.length === 0 ? (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-gray-500 text-sm">
                  No documents selected for upload
                </p>
              </motion.div>
            ) : (
              <motion.ul className="divide-y divide-gray-200">
                <AnimatePresence>
                  {files.map((file) => (
                    <motion.li
                      key={file.id}
                      className="p-4 hover:bg-gray-50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <FiFile className="text-gray-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-700 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.fileSize)} •{" "}
                              {formatDate(file.uploadDate)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              CATEGORY*
                            </label>
                            <div className="relative w-full">
                              <select
                                value={file.category}
                                onChange={(e) => {
                                  if (e.target.value === "custom") {
                                    setShowCustomCategoryInput(true);
                                  } else {
                                    updateFileDetails(
                                      file.id,
                                      "category",
                                      e.target.value
                                    );
                                  }
                                }}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent text-xs"
                                required
                              >
                                <option value="">Select category</option>
                                {documentCategories.map((category) => (
                                  <option key={category} value={category}>
                                    {category}
                                  </option>
                                ))}
                                <option value="custom">
                                  + Add custom category
                                </option>
                              </select>

                              {showCustomCategoryInput && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white p-2 border border-gray-300 rounded-lg shadow-lg z-10">
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={newCategory}
                                      onChange={(e) =>
                                        setNewCategory(e.target.value)
                                      }
                                      placeholder="Enter new category name"
                                      className="flex-1 p-2 border border-gray-300 rounded-lg text-xs"
                                      autoFocus
                                    />
                                    <button
                                      onClick={() => {
                                        addCustomCategory();
                                        setShowCustomCategoryInput(false);
                                      }}
                                      className="px-3 py-1 bg-[#3c8dbc] text-white rounded-lg text-xs"
                                    >
                                      Add
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              DESCRIPTION
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={file.description}
                                onChange={(e) =>
                                  updateFileDetails(
                                    file.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7abce3] focus:border-transparent text-xs"
                                placeholder="Enter brief description..."
                                maxLength={100}
                              />
                              <button
                                onClick={() => removeFile(file.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                                title="Remove file"
                              >
                                <FiX size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}
          </div>

          {files.length > 0 && (
            <motion.div
              className="flex justify-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-full space-y-2">
                {isUploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#3c8dbc] h-2 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                <motion.button
                  className={`px-6 py-2 rounded-md text-white flex items-center gap-2 ${
                    uploadSuccess
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-[#3c8dbc] hover:bg-[#367fa9]"
                  } shadow hover:shadow-md text-sm`}
                  onClick={handleSubmit}
                  disabled={isUploading || files.some((f) => !f.category)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isUploading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                      >
                        <FiUpload size={16} />
                      </motion.span>
                      Uploading...
                    </>
                  ) : uploadSuccess ? (
                    <>
                      <FiCheck size={16} /> Documents Submitted
                    </>
                  ) : (
                    "Submit All Documents"
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showDocumentsModal && (
          <div className="fixed inset-0 flex items-center justify-center z-20 p-4">
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-2xl border border-gray-200 backdrop-blur-sm w-full max-w-4xl max-h-[90vh] flex flex-col"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white bg-opacity-90 z-10">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl font-bold text-[#3c8dbc]"
                >
                  Document Archive ({files.length})
                </motion.h3>
                <motion.button
                  onClick={() => setShowDocumentsModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-all"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiX
                    size={20}
                    className="text-gray-500 hover:text-gray-700"
                  />
                </motion.button>
              </div>

              <div className="overflow-y-auto p-4 flex-1">
                {files.length === 0 ? (
                  <motion.div
                    className="text-center py-12 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-gray-500">No documents in archive</p>
                  </motion.div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          {[
                            "#",
                            "Document",
                            "Category",
                            "Description",
                            "Size",
                            "Uploaded",
                            "Actions",
                          ].map((header, idx) => (
                            <motion.th
                              key={
                                typeof header === "string"
                                  ? header
                                  : "actions-header"
                              }
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * idx }}
                              className="px-6 py-3 text-left font-bold text-gray-700 tracking-wider"
                            >
                              {header}
                            </motion.th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <AnimatePresence>
                          {files.map((file, index) => (
                            <motion.tr
                              key={file.id}
                              className="hover:bg-gray-50"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-3">
                                    <FiFile className="text-gray-400" />
                                  </div>
                                  <div className="text-xs font-medium text-gray-900">
                                    {file.name}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(
                                    file.category
                                  )}`}
                                >
                                  {file.category || "-"}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div
                                  className="text-xs text-gray-600 max-w-xs truncate"
                                  title={file.description}
                                >
                                  {file.description || "-"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-xs text-gray-900">
                                  {formatFileSize(file.fileSize)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-xs text-gray-900">
                                  {formatDate(file.uploadDate)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex justify-center">
                                  <motion.button
                                    onClick={() =>
                                      handleDownload(file.id, file.name)
                                    }
                                    className="text-[#3c8dbc] hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                                    title="Download"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <FiDownload size={16} />
                                  </motion.button>
                                  <motion.button
                                    onClick={() => handlePreview(file.id)}
                                    className="text-[#3c8dbc] hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 ml-2"
                                    title="Preview"
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <FiExternalLink size={16} />
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Upload;
