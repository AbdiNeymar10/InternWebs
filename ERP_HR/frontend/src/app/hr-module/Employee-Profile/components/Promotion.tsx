"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiX, FiCalendar, FiEdit2, FiCheck } from "react-icons/fi";

type PromotionRecord = {
  id: string;
  fromDepartment: string;
  toDepartment: string;
  jobTitle: string;
  icfLabel: string;
  stepNo: string;
  salary: string;
  promotedDate: string;
  jobResponse: string;
  status: string;
  refNo: string;
  branchFrom: string;
  branchTo: string;
};

const statusOptions = ["Approved", "Pending", "Rejected"];

interface PromotionTabProps {
  empId: string;
}

export default function PromotionTab({ empId }: PromotionTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [promotions, setPromotions] = useState<PromotionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from backend
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/promotions");
        if (!response.ok) {
          throw new Error("Failed to fetch promotions");
        }
        const data = await response.json();
        setPromotions(
          data.map((item: any) => ({
            ...item,
            id: item.id.toString(), // Convert ID to string
            salary: item.salary.toString(), // Ensure salary is a string
          }))
        );
      } catch (error) {
        console.error("Error fetching promotions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPromotions();
  }, []);

  const [formData, setFormData] = useState<Omit<PromotionRecord, "id">>({
    fromDepartment: "",
    toDepartment: "",
    jobTitle: "",
    icfLabel: "",
    stepNo: "",
    salary: "",
    promotedDate: "",
    jobResponse: "",
    status: "",
    refNo: "",
    branchFrom: "",
    branchTo: "",
  });

  const handleChange = (
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
    const promotionRecord = {
      ...formData,
      salary: parseFloat(formData.salary), // Convert salary back to number for backend
      id: editingId ? parseInt(editingId, 10) : undefined, // Convert ID back to number for backend
    };

    try {
      let response;
      let method = editingId ? "PUT" : "POST";
      let url = editingId
        ? `http://localhost:8080/api/hr-emp-promotion/${editingId}`
        : "http://localhost:8080/api/hr-emp-promotion";

      response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(promotionRecord),
      });

      if (!response.ok) {
        throw new Error("Failed to save record");
      }

      const savedRecord = await response.json();

      if (editingId) {
        setPromotions(
          promotions.map((promo) =>
            promo.id === editingId ? { ...savedRecord, id: editingId } : promo
          )
        );
      } else {
        setPromotions([
          ...promotions,
          { ...savedRecord, id: savedRecord.id.toString() },
        ]);
      }

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 2000);
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error saving promotion:", error);
      alert("Failed to save promotion. Please try again.");
    }
  };

  const handleEdit = (promotion: PromotionRecord) => {
    setFormData({
      fromDepartment: promotion.fromDepartment,
      toDepartment: promotion.toDepartment,
      jobTitle: promotion.jobTitle,
      icfLabel: promotion.icfLabel,
      stepNo: promotion.stepNo,
      salary: promotion.salary,
      promotedDate: promotion.promotedDate,
      jobResponse: promotion.jobResponse,
      status: promotion.status,
      refNo: promotion.refNo,
      branchFrom: promotion.branchFrom,
      branchTo: promotion.branchTo,
    });
    setEditingId(promotion.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      fromDepartment: "",
      toDepartment: "",
      jobTitle: "",
      icfLabel: "",
      stepNo: "",
      salary: "",
      promotedDate: "",
      jobResponse: "",
      status: "",
      refNo: "",
      branchFrom: "",
      branchTo: "",
    });
    setEditingId(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatSalary = (salary: string) => {
    if (!salary) return "-";
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

  const formTitle = editingId
    ? "Edit Promotion Record"
    : "Add New Promotion Record";

  return (
    <div className="space-y-6 relative">
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black z-10"
        />
      )}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-20 p-4"
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl shadow-lg border border-gray-200 backdrop-blur-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl font-bold text-[#3c8dbc]"
                >
                  {formTitle}
                </motion.h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      From Department*
                    </label>
                    <input
                      type="text"
                      name="fromDepartment"
                      value={formData.fromDepartment}
                      onChange={handleChange}
                      className="w-full p-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Previous department"
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      To Department*
                    </label>
                    <input
                      type="text"
                      name="toDepartment"
                      value={formData.toDepartment}
                      onChange={handleChange}
                      className="w-full p-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="New department"
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      From Branch
                    </label>
                    <input
                      type="text"
                      name="branchFrom"
                      value={formData.branchFrom}
                      onChange={handleChange}
                      className="w-full p-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Previous branch"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      To Branch
                    </label>
                    <input
                      type="text"
                      name="branchTo"
                      value={formData.branchTo}
                      onChange={handleChange}
                      className="w-full p-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="New branch"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Job Title*
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      className="w-full p-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="New job title"
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Reference No
                    </label>
                    <input
                      type="text"
                      name="refNo"
                      value={formData.refNo}
                      onChange={handleChange}
                      className="w-full p-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="REF-YYYY-NNN"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Status*
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full p-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Step No
                    </label>
                    <input
                      type="text"
                      name="stepNo"
                      value={formData.stepNo}
                      onChange={handleChange}
                      className="w-full p-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Step number"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Salary*
                    </label>
                    <div className="relative">
                      <span className="absolute left-2 top-2 text-gray-400 text-xs">
                        $
                      </span>
                      <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        className="w-full p-2 pl-8 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="0.00"
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Promoted Date*
                    </label>
                    <div className="relative">
                      <FiCalendar className="absolute left-2 top-2.5 text-gray-400 text-xs" />
                      <input
                        type="date"
                        name="promotedDate"
                        value={formData.promotedDate}
                        onChange={handleChange}
                        className="w-full p-2 pl-8 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Job Responsibilities*
                    </label>
                    <textarea
                      name="jobResponse"
                      value={formData.jobResponse}
                      onChange={handleChange}
                      className="w-full p-2 min-h-[80px] text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Describe new responsibilities..."
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
                    className={`px-3 py-1.5 ${
                      submitSuccess
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-[#3c8dbc] hover:bg-[#367fa9]"
                    } text-white rounded-md transition-all shadow hover:shadow-md text-xs font-medium flex items-center gap-1`}
                  >
                    {submitSuccess ? (
                      <>
                        <FiCheck size={14} />
                        Success!
                      </>
                    ) : editingId ? (
                      "Update"
                    ) : (
                      "Save"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all text-xs font-medium"
                  >
                    Cancel
                  </button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`bg-white rounded-xl shadow-lg overflow-hidden ${
          showForm ? "blur-sm" : ""
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <div>
              <h1 className="text-[14px] font-bold">Promotion Records</h1>
              <p className="text-blue-100 text-xs">
                Manage your promotion history
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              resetForm();
            }}
            className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded-md shadow-sm hover:shadow transition-all duration-300 border border-white border-opacity-20 text-xs md:text-sm mt-2 md:mt-0"
          >
            <FiPlus size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "NO",
                  "From Department",
                  "To Department",
                  "Job Title",
                  "Promoted Date",
                  "Status",
                  "Salary",
                  <FiEdit2 key="edit-icon" size={16} className="inline" />,
                ].map((header, idx) => (
                  <motion.th
                    key={typeof header === "string" ? header : "edit-header"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="px-6 py-3 text-left font-bold text-gray-700 tracking-wider"
                    style={{ fontSize: "12px" }}
                  >
                    {header}
                  </motion.th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promotions.map((promo, idx) => (
                <motion.tr
                  key={promo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  whileHover={{ backgroundColor: "#f8fafc" }}
                  className="transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {idx + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-xs">
                          {promo.fromDepartment.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-xs font-semibold text-gray-500">
                          {promo.fromDepartment}
                        </div>
                        <div className="text-xs text-gray-400">
                          {promo.branchFrom}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs font-semibold text-gray-500">
                      {promo.toDepartment}
                    </div>
                    <div className="text-xs text-gray-400">
                      {promo.branchTo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs font-semibold text-gray-500">
                      {promo.jobTitle}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <FiCalendar className="text-gray-400" size={12} />
                      {formatDate(promo.promotedDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        promo.status
                      )}`}
                    >
                      {promo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-xs font-semibold text-gray-500">
                      {formatSalary(promo.salary)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(promo)}
                        className="text-[#3c8dbc] hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                      >
                        <FiEdit2 size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div>
              Showing <span className="font-semibold">{promotions.length}</span>{" "}
              promotion records
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                <span>Approved</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
                <span>Pending</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
                <span>Rejected</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
