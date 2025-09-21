"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiEdit2,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";
import { authFetch } from "@/utils/authFetch";

type PromotionRecord = {
  promotionHistoryId: string;
  prevDepartmentId: string;
  deptTransferTo: string;
  prevJobPosition: string;
  promLetterNumber: string;
  stepNo: string;
  prevSalary: string;
  datePromoted: string;
  jobResponsibility: string;
  status: string;
  prevRank: string;
  branchFrom: string;
  branchId: string;
  employeeId: string;
  employeeName?: string;
};

interface PromotionTabProps {
  empId: string;
  allEmployees?: any[];
}

const statusOptions = ["Approved", "Pending", "Rejected"];

export default function PromotionTab({
  empId,
  allEmployees,
}: PromotionTabProps) {
  const [promotions, setPromotions] = useState<PromotionRecord[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<
    PromotionRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PromotionRecord | null>(
    null
  );
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    prevDepartmentId: "",
    deptTransferTo: "",
    prevJobPosition: "",
    promLetterNumber: "",
    stepNo: "",
    prevSalary: "",
    datePromoted: "",
    jobResponsibility: "",
    status: "",
    prevRank: "",
    branchFrom: "",
    branchId: "",
  });

  // Fetch data from backend - HR_PROMOTION_HISTORY using authFetch
  useEffect(() => {
    const fetchPromotions = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await authFetch(
          "http://localhost:8080/api/promotion-history"
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch promotions: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        const formattedData = data.map((item: any) => ({
          promotionHistoryId: item.promotionHistoryId?.toString() || "",
          prevDepartmentId: item.prevDepartmentId
            ? item.prevDepartmentId.toString()
            : "",
          deptTransferTo: item.deptTransferTo
            ? item.deptTransferTo.toString()
            : "",
          prevJobPosition: item.prevJobPosition || "",
          promLetterNumber: item.promLetterNumber || "",
          stepNo: item.stepNo || "",
          prevSalary: item.prevSalary ? item.prevSalary.toString() : "0",
          datePromoted: item.datePromoted || "",
          jobResponsibility: item.jobResponsibility || "",
          status: item.status || "",
          prevRank: item.prevRank || "",
          branchFrom: item.branchFrom ? item.branchFrom.toString() : "",
          branchId: item.branchId ? item.branchId.toString() : "",
          employeeId: item.employeeId || "",
          employeeName: item.employeeName || `Employee ${item.employeeId}`,
        }));

        // Role-based filtering
        let filtered = formattedData;
        let role = "";
        try {
          if (typeof window !== "undefined") {
            const stored = localStorage.getItem("user");
            if (stored) role = JSON.parse(stored).role;
          }
        } catch {}
        if (!["HR", "ADMIN"].includes(role)) {
          filtered = formattedData.filter(
            (promo: PromotionRecord) => promo.employeeId === empId
          );
        }

        setPromotions(filtered);
        setFilteredPromotions(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        toast.success("Promotion records loaded successfully");
      } catch (error) {
        console.error("Error fetching promotions:", error);
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Failed to fetch promotion records";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromotions();
  }, [itemsPerPage, empId]);

  // Apply filters and search
  useEffect(() => {
    if (!promotions.length) return;

    let results = promotions;

    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter((promo) => promo.status === statusFilter);
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (promo) =>
          promo.employeeId.toLowerCase().includes(term) ||
          promo.employeeName?.toLowerCase().includes(term) ||
          promo.prevJobPosition.toLowerCase().includes(term) ||
          promo.prevDepartmentId.toLowerCase().includes(term) ||
          promo.deptTransferTo.toLowerCase().includes(term) ||
          promo.promLetterNumber.toLowerCase().includes(term)
      );
    }

    setFilteredPromotions(results);
    setTotalPages(Math.ceil(results.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, promotions, itemsPerPage]);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPromotions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatSalary = (salary: string) => {
    if (!salary || salary === "0") return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(salary));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-amber-100 text-amber-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEdit = (promotion: PromotionRecord) => {
    setEditingRecord(promotion);
    setFormData({
      prevDepartmentId: promotion.prevDepartmentId,
      deptTransferTo: promotion.deptTransferTo,
      prevJobPosition: promotion.prevJobPosition,
      promLetterNumber: promotion.promLetterNumber,
      stepNo: promotion.stepNo,
      prevSalary: promotion.prevSalary,
      datePromoted: promotion.datePromoted,
      jobResponsibility: promotion.jobResponsibility,
      status: promotion.status,
      prevRank: promotion.prevRank,
      branchFrom: promotion.branchFrom,
      branchId: promotion.branchId,
    });
    setShowEditForm(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    try {
      const promotionRecord = {
        ...formData,
        prevSalary: parseFloat(formData.prevSalary),
        promotionHistoryId: parseInt(editingRecord.promotionHistoryId, 10),
        prevDepartmentId: formData.prevDepartmentId
          ? parseInt(formData.prevDepartmentId, 10)
          : null,
        deptTransferTo: formData.deptTransferTo
          ? parseInt(formData.deptTransferTo, 10)
          : null,
        branchFrom: formData.branchFrom
          ? parseInt(formData.branchFrom, 10)
          : null,
        branchId: formData.branchId ? parseInt(formData.branchId, 10) : null,
        employeeId: editingRecord.employeeId,
      };

      const response = await authFetch(
        `http://localhost:8080/api/promotion-history/${editingRecord.promotionHistoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(promotionRecord),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update record");
      }

      const savedRecord = await response.json();

      // Update the local state with the updated record
      setPromotions(
        promotions.map((promo) =>
          promo.promotionHistoryId === editingRecord.promotionHistoryId
            ? {
                ...savedRecord,
                promotionHistoryId: savedRecord.promotionHistoryId.toString(),
                prevSalary: savedRecord.prevSalary?.toString() || "0",
                prevDepartmentId: savedRecord.prevDepartmentId
                  ? savedRecord.prevDepartmentId.toString()
                  : "",
                deptTransferTo: savedRecord.deptTransferTo
                  ? savedRecord.deptTransferTo.toString()
                  : "",
                branchFrom: savedRecord.branchFrom
                  ? savedRecord.branchFrom.toString()
                  : "",
                branchId: savedRecord.branchId
                  ? savedRecord.branchId.toString()
                  : "",
                employeeName: editingRecord.employeeName,
              }
            : promo
        )
      );

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowEditForm(false);
        setEditingRecord(null);
      }, 1500);

      toast.success("Promotion record updated successfully");
    } catch (error) {
      console.error("Error updating promotion:", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Failed to update promotion record";
      toast.error(errorMsg);
    }
  };

  const resetForm = () => {
    setFormData({
      prevDepartmentId: "",
      deptTransferTo: "",
      prevJobPosition: "",
      promLetterNumber: "",
      stepNo: "",
      prevSalary: "",
      datePromoted: "",
      jobResponsibility: "",
      status: "",
      prevRank: "",
      branchFrom: "",
      branchId: "",
    });
    setEditingRecord(null);
    setShowEditForm(false);
  };

  return (
    <div className="space-y-6 relative">
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

      {/* Edit Form Modal */}
      <AnimatePresence>
        {showEditForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-20"
              onClick={resetForm}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-30 p-4"
            >
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-lg border border-gray-200 backdrop-blur-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl font-bold text-[#3c8dbc]"
                  >
                    Edit Promotion Record
                  </motion.h3>
                  <button
                    onClick={resetForm}
                    className="p-1 rounded-full hover:bg-gray-100 transition-all"
                  >
                    <FiX
                      size={18}
                      className="text-gray-500 hover:text-gray-700"
                    />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous Department ID*
                      </label>
                      <input
                        type="text"
                        name="prevDepartmentId"
                        value={formData.prevDepartmentId}
                        onChange={handleFormChange}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transfer To Department ID*
                      </label>
                      <input
                        type="text"
                        name="deptTransferTo"
                        value={formData.deptTransferTo}
                        onChange={handleFormChange}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Branch ID
                      </label>
                      <input
                        type="text"
                        name="branchFrom"
                        value={formData.branchFrom}
                        onChange={handleFormChange}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Branch ID
                      </label>
                      <input
                        type="text"
                        name="branchId"
                        value={formData.branchId}
                        onChange={handleFormChange}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous Job Position*
                      </label>
                      <input
                        type="text"
                        name="prevJobPosition"
                        value={formData.prevJobPosition}
                        onChange={handleFormChange}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Promotion Letter Number
                      </label>
                      <input
                        type="text"
                        name="promLetterNumber"
                        value={formData.promLetterNumber}
                        onChange={handleFormChange}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status*
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleFormChange}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="">Select Status</option>
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous Rank
                      </label>
                      <input
                        type="text"
                        name="prevRank"
                        value={formData.prevRank}
                        onChange={handleFormChange}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous Salary*
                      </label>
                      <div className="relative">
                        <span className="absolute left-2 top-2 text-gray-400 text-sm">
                          $
                        </span>
                        <input
                          type="number"
                          name="prevSalary"
                          value={formData.prevSalary}
                          onChange={handleFormChange}
                          className="w-full p-2 pl-8 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.65 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Promoted*
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-2 top-2.5 text-gray-400 text-sm" />
                        <input
                          type="date"
                          name="datePromoted"
                          value={formData.datePromoted}
                          onChange={handleFormChange}
                          className="w-full p-2 pl-8 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="md:col-span-2"
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Responsibilities*
                      </label>
                      <textarea
                        name="jobResponsibility"
                        value={formData.jobResponsibility}
                        onChange={handleFormChange}
                        className="w-full p-2 min-h-[80px] text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.75 }}
                    className="flex gap-3 justify-end"
                  >
                    <button
                      type="submit"
                      className={`px-4 py-2 ${
                        submitSuccess
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-[#3c8dbc] hover:bg-[#367fa9]"
                      } text-white rounded-md transition-all shadow hover:shadow-md text-sm font-medium flex items-center gap-1`}
                    >
                      {submitSuccess ? (
                        <>
                          <FiCheck size={16} />
                          Success!
                        </>
                      ) : (
                        "Update"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`bg-white rounded-xl shadow-lg overflow-hidden ${
          showEditForm ? "blur-sm" : ""
        }`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-[#3c8dbc] rounded-t-lg text-white">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <div>
              <h1 className="text-[16px] font-bold">Promotion Records</h1>
              <p className="text-blue-100 text-xs">
                View all promotion history
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-3 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search promotions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-md text-gray-700 w-full md:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 rounded-md text-gray-700 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-[#3c8dbc]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3c8dbc] mx-auto"></div>
            <p className="mt-3">Loading promotion records...</p>
          </div>
        ) : error ? (
          <div className="py-10 text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "NO",
                      "Employee",
                      "Previous Department",
                      "New Department",
                      "Job Position",
                      "Date Promoted",
                      "Status",
                      "Salary",
                      "Actions",
                    ].map((header, idx) => (
                      <th
                        key={idx}
                        className="px-4 py-3 text-left font-bold text-gray-700 tracking-wider uppercase text-xs"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((promo, idx) => (
                    <motion.tr
                      key={promo.promotionHistoryId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ backgroundColor: "#f8fafc" }}
                      className="transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                        {indexOfFirstItem + idx + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {promo.employeeName}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {promo.employeeId}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            Dept: {promo.prevDepartmentId}
                          </div>
                          <div className="text-xs text-gray-500">
                            Branch: {promo.branchFrom}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            Dept: {promo.deptTransferTo}
                          </div>
                          <div className="text-xs text-gray-500">
                            Branch: {promo.branchId}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {promo.prevJobPosition}
                          </div>
                          <div className="text-xs text-gray-500">
                            Rank: {promo.prevRank}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <FiCalendar className="text-gray-400" size={14} />
                          {formatDate(promo.datePromoted)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            promo.status
                          )}`}
                        >
                          {promo.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatSalary(promo.prevSalary)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(promo)}
                            className="text-[#3c8dbc] hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                            title="Edit promotion"
                          >
                            <FiEdit2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {currentItems.length === 0 && (
                <div className="py-10 text-center text-gray-500">
                  No promotion records found
                  {searchTerm || statusFilter !== "all"
                    ? " matching your criteria"
                    : ""}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                    Showing{" "}
                    <span className="font-semibold">
                      {indexOfFirstItem + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold">
                      {Math.min(indexOfLastItem, filteredPromotions.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold">
                      {filteredPromotions.length}
                    </span>{" "}
                    results
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="5">5 per page</option>
                      <option value="10">10 per page</option>
                      <option value="20">20 per page</option>
                      <option value="50">50 per page</option>
                    </select>

                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiChevronLeft size={16} />
                      </button>

                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          // Show pages around current page
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => paginate(pageNum)}
                              className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium ${
                                currentPage === pageNum
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}

                      <button
                        onClick={() =>
                          paginate(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiChevronRight size={16} />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}
