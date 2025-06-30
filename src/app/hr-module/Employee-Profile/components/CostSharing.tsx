"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiX, FiDollarSign, FiEdit2, FiTrash2 } from "react-icons/fi";

interface CostSharing {
  id?: number;
  employeeId: string;
  totalAmount: number;
  amountPaid: number;
  remark: string;
  status?: number;
}

export default function CostSharingTab({ empId }: { empId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [costSharings, setCostSharings] = useState<CostSharing[]>([]);
  const [formData, setFormData] = useState<Omit<CostSharing, "id">>({
    employeeId: empId,
    totalAmount: 0,
    amountPaid: 0,
    remark: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch cost sharings from API
  const fetchCostSharings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/employees/${empId}/cost-sharings`,
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );
      setCostSharings(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch cost sharings. Please try again.");
      console.error("Error fetching cost sharings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCostSharings();
  }, [empId]);

  // Validate form data
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.totalAmount || formData.totalAmount <= 0) {
      errors.totalAmount = "Total amount must be positive";
    }
    if (formData.amountPaid < 0) {
      errors.amountPaid = "Amount paid cannot be negative";
    }
    if (formData.amountPaid > formData.totalAmount) {
      errors.amountPaid = "Amount paid cannot exceed total amount";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create or update cost sharing
  const saveCostSharing = async (costSharingData: CostSharing) => {
    try {
      const isUpdate = costSharingData.id !== undefined;
      const url = isUpdate
        ? `http://localhost:8080/api/employees/${empId}/cost-sharings/${costSharingData.id}`
        : `http://localhost:8080/api/employees/${empId}/cost-sharings`;

      const method = isUpdate ? 'put' : 'post';
      
      const response = await axios[method](url, {
        ...costSharingData,
        totalAmount: Number(costSharingData.totalAmount),
        amountPaid: Number(costSharingData.amountPaid),
        employeeId: empId
      }, {
        headers: {
          'Content-Type': 'application/json',
          ...(isUpdate && { 'If-Match': '*' }) // For optimistic locking
        }
      });

      await fetchCostSharings();
      return true;
    } catch (err: any) {
      let errorMessage = "Failed to save cost sharing";
      if (err.response) {
        if (err.response.status === 409) {
          errorMessage = "This record was modified by another user. Please refresh and try again.";
        } else {
          errorMessage = err.response.data?.message || errorMessage;
        }
      }

      setError(errorMessage);
      console.error("Detailed error:", err.response?.data);
      return false;
    }
  };

  // Delete cost sharing
  const deleteCostSharing = async (id: number) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/employees/${empId}/cost-sharings/${id}`,
        {
          headers: {
            "If-Match": "*",
          },
        }
      );

      await fetchCostSharings();
      return true;
    } catch (err: any) {
      const errorMessage =
        err.response?.status === 409
          ? "This record was modified by another user. Please refresh and try again."
          : "Failed to delete cost sharing";
      setError(errorMessage);
      console.error("Error deleting cost sharing:", err);
      return false;
    }
  };

  // Calculate payment percentage and remaining amount
  useEffect(() => {
    const total = formData.totalAmount || 0;
    const paid = formData.amountPaid || 0;
    const remaining = total - paid;
    const percentage = total > 0 ? Math.round((paid / total) * 100) : 0;
    setFormData((prev) => ({
      ...prev,
      remark: `${percentage}% paid (${remaining.toFixed(2)} ETB remaining)`,
    }));
  }, [formData.totalAmount, formData.amountPaid]);

  const handleEditCostSharing = (cs: CostSharing) => {
    setEditingId(cs.id || null);
    setFormData({
      employeeId: empId,
      totalAmount: cs.totalAmount,
      amountPaid: cs.amountPaid,
      remark: cs.remark,
    });
    setShowForm(true);
    setFormErrors({});
  };

  const handleAddCostSharing = async () => {
    if (!validateForm()) return;

    const costSharingData = {
      ...formData,
      id: editingId || undefined,
    };

    const success = await saveCostSharing(costSharingData);
    if (success) {
      setFormData({
        employeeId: empId,
        totalAmount: 0,
        amountPaid: 0,
        remark: "",
      });
      setShowForm(false);
      setEditingId(null);
      setError(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "remark" ? value : parseFloat(value) || 0,
    });

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this cost sharing record?")) {
      await deleteCostSharing(id);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
          <button
            className="absolute top-0 right-0 px-2 py-1"
            onClick={() => setError(null)}
          >
            <FiX />
          </button>
        </div>
      )}

      {/* Blur overlay */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black z-10"
        />
      )}

      {/* Popup Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-20"
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-lg border border-gray-200 backdrop-blur-sm w-full max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold text-[#3c8dbc]"
                >
                  {editingId ? "Edit Cost Sharing" : "Add New Cost Sharing"}
                </motion.h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      employeeId: empId,
                      totalAmount: 0,
                      amountPaid: 0,
                      remark: "",
                    });
                    setFormErrors({});
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-all"
                >
                  <FiX
                    size={20}
                    className="text-gray-500 hover:text-gray-700"
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {["totalAmount", "amountPaid"].map((field, i) => (
                  <motion.div
                    key={field}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      {field.charAt(0).toUpperCase() + field.slice(1)} (ETB)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name={field}
                      value={(formData as any)[field]}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors[field] ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-300`}
                      placeholder={`Enter ${field}`}
                    />
                    {formErrors[field] && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors[field]}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="md:col-span-2"
              >
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Payment Summary
                </label>
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-300"
                  rows={4}
                  readOnly
                  placeholder="Payment summary will appear here..."
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4 justify-end"
              >
                <button
                  onClick={handleAddCostSharing}
                  className="px-6 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] transition-all shadow-lg hover:shadow-xl"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      employeeId: empId,
                      totalAmount: 0,
                      amountPaid: 0,
                      remark: "",
                    });
                    setFormErrors({});
                  }}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  Cancel
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Table Section */}
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
            <FiDollarSign size={20} className="h-5 w-5 mr-2 text-blue-100" />
            <div>
              <h1 className="text-[14px] font-bold">Cost Sharing</h1>
              <p className="text-blue-100 text-xs">
                Manage your cost sharing information
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                employeeId: empId,
                totalAmount: 0,
                amountPaid: 0,
                remark: "",
              });
              setFormErrors({});
            }}
            className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded-md shadow-sm hover:shadow transition-all duration-300 border border-white border-opacity-20 text-xs md:text-sm mt-2 md:mt-0"
            disabled={loading}
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
                  "Total Amount",
                  "Amount Paid",
                  "Remarks",
                  "Actions",
                ].map((header, idx) => (
                  <motion.th
                    key={header}
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : costSharings.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No cost sharing records found
                  </td>
                </tr>
              ) : (
                costSharings.map((cs, idx) => (
                  <motion.tr
                    key={cs.id || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * idx }}
                    whileHover={{ backgroundColor: "#f8fafc" }}
                    className="transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {cs.totalAmount.toFixed(2)} ETB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {cs.amountPaid.toFixed(2)} ETB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {cs.remark || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditCostSharing(cs)}
                          className="text-[#3c8dbc] hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                          disabled={loading}
                        >
                          <FiEdit2 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => cs.id && handleDelete(cs.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                          disabled={loading}
                        >
                          <FiTrash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}