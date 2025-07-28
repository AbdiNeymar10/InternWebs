"use client";
import { useState, useEffect } from "react";
import { authFetch } from "@/utils/authFetch";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiX,
  FiCalendar,
  FiEdit2,
  FiBook,
  FiTrash2,
  FiRefreshCw,
} from "react-icons/fi";

interface Training {
  id: number;
  employeeId: string;
  employee?: {
    empId: string;
    firstName: string;
    lastName: string;
    department?: {
      depName: string;
    };
  };
  institution: string;
  courseName: string;
  startDateEC: string;
  endDateEC: string;
  startDateGC: string;
  endDateGC: string;
  location: string;
  payment: number;
}

const initialFormData: Omit<Training, "id"> = {
  employeeId: "",
  institution: "",
  courseName: "",
  startDateEC: "",
  endDateEC: "",
  startDateGC: "",
  endDateGC: "",
  location: "",
  payment: 0,
};

export default function TrainingTab({ empId }: { empId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [formData, setFormData] =
    useState<Omit<Training, "id">>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const fetchTrainings = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await authFetch(
        `http://localhost:8080/api/employees/${empId}/trainings`,
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );
      if (!res.ok) {
        let errorMessage = `Server error (${res.status}): `;
        try {
          const data = await res.json();
          errorMessage += data?.message || "Could not fetch data";
        } catch {
          errorMessage += "Could not fetch data";
        }
        throw new Error(errorMessage);
      }
      const data = await res.json();
      const formattedTrainings = data.map((training: any) => ({
        ...training,
        startDateGC: training.startDateGC
          ? new Date(training.startDateGC).toISOString().split("T")[0]
          : "",
        endDateGC: training.endDateGC
          ? new Date(training.endDateGC).toISOString().split("T")[0]
          : "",
        payment: Number(training.payment) || 0,
        employee: training.employee || undefined,
      }));
      setTrainings(formattedTrainings);
    } catch (err: any) {
      let errorMessage =
        err.message || "Failed to fetch trainings. Please try again.";
      setError(errorMessage);
      console.error("Error fetching trainings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (empId) {
      fetchTrainings();
    }
  }, [empId]);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.institution.trim()) {
      errors.institution = "Institution is required";
    }
    if (!formData.courseName.trim()) {
      errors.courseName = "Course/Training Name is required";
    }
    if (
      formData.payment === null ||
      formData.payment === undefined ||
      formData.payment <= 0
    ) {
      errors.payment = "Payment must be a positive number";
    }
    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }
    if (!formData.startDateEC.trim()) {
      errors.startDateEC = "Ethiopian start date is required";
    }
    if (!formData.endDateEC.trim()) {
      errors.endDateEC = "Ethiopian end date is required";
    }
    if (!formData.startDateGC) {
      errors.startDateGC = "Gregorian start date is required";
    }
    if (!formData.endDateGC) {
      errors.endDateGC = "Gregorian end date is required";
    }

    if (formData.startDateGC && formData.endDateGC) {
      if (new Date(formData.endDateGC) < new Date(formData.startDateGC)) {
        errors.endDateGC = "End date cannot be before start date";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveTraining = async (trainingDataWithId: Training) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const isUpdate = !!trainingDataWithId.id && trainingDataWithId.id !== 0;

      const formatDateToISO = (
        dateStr: string | null | undefined
      ): string | null => {
        if (!dateStr || dateStr.trim() === "") return null;
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          console.warn(
            `Invalid date string encountered for ISO conversion: ${dateStr}`
          );
          return null;
        }
        return date.toISOString();
      };

      const payload = {
        institution: trainingDataWithId.institution.trim(),
        courseName: trainingDataWithId.courseName.trim(),
        startDateEC: trainingDataWithId.startDateEC.trim(),
        endDateEC: trainingDataWithId.endDateEC.trim(),
        startDateGC: formatDateToISO(trainingDataWithId.startDateGC),
        endDateGC: formatDateToISO(trainingDataWithId.endDateGC),
        location: trainingDataWithId.location.trim(),
        payment: Number(trainingDataWithId.payment),
      };

      let res;
      if (isUpdate) {
        res = await authFetch(
          `http://localhost:8080/api/employees/${empId}/trainings/${trainingDataWithId.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) {
          let errorMessage = `Server error (${res.status}): `;
          try {
            const data = await res.json();
            errorMessage += data?.message || "Could not update training";
          } catch {
            errorMessage += "Could not update training";
          }
          throw new Error(errorMessage);
        }
        setSuccessMessage("Training updated successfully!");
      } else {
        res = await authFetch(
          `http://localhost:8080/api/employees/${empId}/trainings`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) {
          let errorMessage = `Server error (${res.status}): `;
          try {
            const data = await res.json();
            errorMessage += data?.message || "Could not add training";
          } catch {
            errorMessage += "Could not add training";
          }
          throw new Error(errorMessage);
        }
        setSuccessMessage("Training added successfully!");
      }

      await fetchTrainings();
      return true;
    } catch (err: any) {
      let errorMessage =
        err.message ||
        "Failed to save training. Please check input and try again.";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const handleEditTraining = (training: Training) => {
    setEditingId(training.id);
    setFormData({
      employeeId: training.employeeId,
      institution: training.institution,
      courseName: training.courseName,
      startDateEC: training.startDateEC || "",
      endDateEC: training.endDateEC || "",
      startDateGC: training.startDateGC || "",
      endDateGC: training.endDateGC || "",
      location: training.location || "",
      payment: training.payment || 0,
    });
    setShowForm(true);
    setFormErrors({});
    setError(null);
    setSuccessMessage(null);
  };

  const handleAddNewClick = () => {
    setShowForm(true);
    setEditingId(null);
    setFormData(initialFormData);
    setFormErrors({});
    setError(null);
    setSuccessMessage(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(initialFormData);
    setFormErrors({});
    setError(null);
  };

  const handleSaveOrUpdate = async () => {
    if (!validateForm()) {
      setError("Please fix the errors in the form.");
      return;
    }
    const trainingDataToSave = {
      ...formData,
      id: editingId || 0,
    };
    const success = await saveTraining(trainingDataToSave as Training);
    if (success) {
      handleCloseForm();
    }
  };

  const deleteTraining = async (id: number) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await authFetch(
        `http://localhost:8080/api/employees/${empId}/trainings/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) {
        let errorMessage = `Server error (${res.status}): `;
        try {
          const data = await res.json();
          errorMessage += data?.message || "Could not delete training";
        } catch {
          errorMessage += "Could not delete training";
        }
        throw new Error(errorMessage);
      }
      setSuccessMessage("Training deleted successfully!");
      await fetchTrainings();
      return true;
    } catch (err: any) {
      let errorMessage =
        err.message || "Failed to delete training. Please try again.";
      setError(errorMessage);
      console.error("Error deleting training:", err);
      return false;
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const handleDeleteClick = async (idToDelete: number) => {
    if (confirm("Are you sure you want to delete this training?")) {
      const success = await deleteTraining(idToDelete);
      if (success && editingId === idToDelete) {
        handleCloseForm();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    });
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setError(null);
  };

  const formTitle = editingId ? "Edit Training" : "Add New Training";
  const submitButtonText = editingId ? "Update" : "Save";

  return (
    <div className="space-y-6 relative">
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline whitespace-pre-wrap">{error}</span>
            <button
              onClick={() => setError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              aria-label="Close error message"
            >
              <FiX />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{successMessage}</span>
            <button
              onClick={() => setSuccessMessage(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              aria-label="Close success message"
            >
              <FiX />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blur overlay */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black z-10"
          onClick={handleCloseForm}
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
            className="fixed inset-0 flex items-center justify-center z-20 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-lg border border-gray-200 backdrop-blur-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold text-[#3c8dbc]"
                >
                  {formTitle}
                </motion.h3>
                <button
                  onClick={handleCloseForm}
                  className="p-2 rounded-full hover:bg-gray-100 transition-all"
                  aria-label="Close form"
                >
                  <FiX
                    size={20}
                    className="text-gray-500 hover:text-gray-700"
                  />
                </button>
              </div>
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Institution */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Institution <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.institution
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-300`}
                    placeholder="Enter institution name"
                    required
                    aria-invalid={!!formErrors.institution}
                    aria-describedby={
                      formErrors.institution ? "institution-error" : undefined
                    }
                  />
                  {formErrors.institution && (
                    <p
                      id="institution-error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {formErrors.institution}
                    </p>
                  )}
                </motion.div>

                {/* Course Name */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Course/Training Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.courseName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-300`}
                    placeholder="Enter course name"
                    required
                    aria-invalid={!!formErrors.courseName}
                    aria-describedby={
                      formErrors.courseName ? "courseName-error" : undefined
                    }
                  />
                  {formErrors.courseName && (
                    <p
                      id="courseName-error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {formErrors.courseName}
                    </p>
                  )}
                </motion.div>

                {/* Location */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.location ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-300`}
                    placeholder="Enter location"
                    aria-invalid={!!formErrors.location}
                    aria-describedby={
                      formErrors.location ? "location-error" : undefined
                    }
                  />
                  {formErrors.location && (
                    <p
                      id="location-error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {formErrors.location}
                    </p>
                  )}
                </motion.div>

                {/* Payment */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Payment (ETB) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="payment"
                    value={formData.payment}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${
                      formErrors.payment ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-300`}
                    placeholder="Enter amount in ETB"
                    min="0"
                    aria-invalid={!!formErrors.payment}
                    aria-describedby={
                      formErrors.payment ? "payment-error" : undefined
                    }
                  />
                  {formErrors.payment && (
                    <p id="payment-error" className="text-red-500 text-xs mt-1">
                      {formErrors.payment}
                    </p>
                  )}
                </motion.div>

                {/* Start Date (EC) */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Start Date (Ethiopian){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      <FiCalendar size={18} />
                    </span>
                    <input
                      type="text"
                      name="startDateEC"
                      value={formData.startDateEC}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.startDateEC
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pl-12 placeholder-gray-300`}
                      placeholder="YYYY-MM-DD (EC)"
                      aria-invalid={!!formErrors.startDateEC}
                      aria-describedby={
                        formErrors.startDateEC ? "startDateEC-error" : undefined
                      }
                    />
                  </div>
                  {formErrors.startDateEC && (
                    <p
                      id="startDateEC-error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {formErrors.startDateEC}
                    </p>
                  )}
                </motion.div>

                {/* End Date (EC) */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    End Date (Ethiopian) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      <FiCalendar size={18} />
                    </span>
                    <input
                      type="text"
                      name="endDateEC"
                      value={formData.endDateEC}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.endDateEC
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pl-12 placeholder-gray-300`}
                      placeholder="YYYY-MM-DD (EC)"
                      aria-invalid={!!formErrors.endDateEC}
                      aria-describedby={
                        formErrors.endDateEC ? "endDateEC-error" : undefined
                      }
                    />
                  </div>
                  {formErrors.endDateEC && (
                    <p
                      id="endDateEC-error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {formErrors.endDateEC}
                    </p>
                  )}
                </motion.div>

                {/* Start Date (GC) */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Start Date (Gregorian){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      <FiCalendar size={18} />
                    </span>
                    <input
                      type="date"
                      name="startDateGC"
                      value={formData.startDateGC}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.startDateGC
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pl-12 placeholder-gray-300`}
                      aria-invalid={!!formErrors.startDateGC}
                      aria-describedby={
                        formErrors.startDateGC ? "startDateGC-error" : undefined
                      }
                    />
                  </div>
                  {formErrors.startDateGC && (
                    <p
                      id="startDateGC-error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {formErrors.startDateGC}
                    </p>
                  )}
                </motion.div>

                {/* End Date (GC) */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    End Date (Gregorian) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      <FiCalendar size={18} />
                    </span>
                    <input
                      type="date"
                      name="endDateGC"
                      value={formData.endDateGC}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border ${
                        formErrors.endDateGC
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pl-12 placeholder-gray-300`}
                      aria-invalid={!!formErrors.endDateGC}
                      aria-describedby={
                        formErrors.endDateGC ? "endDateGC-error" : undefined
                      }
                    />
                  </div>
                  {formErrors.endDateGC && (
                    <p
                      id="endDateGC-error"
                      className="text-red-500 text-xs mt-1"
                    >
                      {formErrors.endDateGC}
                    </p>
                  )}
                </motion.div>
              </div>
              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 justify-end pt-4"
              >
                <button
                  onClick={handleSaveOrUpdate}
                  className="px-6 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] transition-all shadow-md disabled:opacity-50"
                  disabled={loading}
                  type="button"
                >
                  {loading ? "Saving..." : submitButtonText}
                </button>
                <button
                  onClick={handleCloseForm}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all shadow-md disabled:opacity-50"
                  disabled={loading}
                  type="button"
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
        className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
          showForm ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 bg-[#3c8dbc] rounded-lg shadow-md p-2 md:p-3 text-white h-auto md:h-[50px]">
          <div className="flex items-center mb-2 md:mb-0">
            <FiBook size={20} className="h-5 w-5 mr-2 text-blue-100" />
            <div>
              <h1 className="text-[14px] font-bold">Training</h1>
              <p className="text-blue-100 text-xs">
                Manage training information
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchTrainings}
              className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded-md shadow-sm hover:shadow transition-all duration-300 border border-white border-opacity-20 text-xs md:text-sm"
              title="Refresh Data"
              disabled={loading}
            >
              <FiRefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
            </button>
            <button
              onClick={handleAddNewClick}
              className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded-md shadow-sm hover:shadow transition-all duration-300 border border-white border-opacity-20 text-xs md:text-sm"
              disabled={loading}
              title="Add New Training"
            >
              <FiPlus size={16} />
            </button>
          </div>
        </div>
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "NO",
                  "Employee",
                  "Institution",
                  "Training/Course Name",
                  "Start Date (EC)",
                  "End Date (EC)",
                  "Location",
                  "Payment",
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
              {loading && trainings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    Loading trainings...
                  </td>
                </tr>
              ) : !loading && trainings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500">
                    No training records found.
                  </td>
                </tr>
              ) : (
                trainings.map((training, idx) => (
                  <motion.tr
                    key={training.id}
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
                      {training.employee
                        ? `${training.employee.firstName} ${training.employee.lastName}`
                        : training.employeeId}
                      {training.employee?.department && (
                        <div className="text-xs text-gray-400">
                          {training.employee.department.depName}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {training.institution}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {training.courseName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {training.startDateEC || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {training.endDateEC || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {training.location || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {training.payment
                        ? `${Number(training.payment).toFixed(2)} ETB`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditTraining(training)}
                          className="text-[#3c8dbc] hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 disabled:opacity-50"
                          title="Edit Training"
                          disabled={loading}
                        >
                          <FiEdit2 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteClick(training.id)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 disabled:opacity-50"
                          title="Delete Training"
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
