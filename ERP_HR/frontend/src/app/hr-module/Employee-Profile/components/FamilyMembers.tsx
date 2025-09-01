"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/utils/authFetch";
import { motion } from "framer-motion";
import {
  FiUser,
  FiUsers,
  FiPlus,
  FiSettings,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
} from "react-icons/fi";

type Dependent = {
  dependentsId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  relationship: string;
  emergencyContact: string;
  dateOfBirth: string;
  sex: string;
};

const DependentsForm = ({
  empId,
  onClose,
  onSave,
  initialData = null,
}: {
  empId: string;
  onClose: () => void;
  onSave: () => void;
  initialData?: Dependent | null;
}) => {
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    relationship: "",
    emergencyContact: "",
    dateOfBirth: "",
    sex: "",
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);

  const relationships = [
    "Select Relationship",
    "Wife",
    "Husband",
    "Daughter",
    "Son",
    "Father",
    "Mother",
    "Sister",
    "Brother",
  ];

  useEffect(() => {
    setIsClient(true);
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || "",
        middleName: initialData.middleName || "",
        lastName: initialData.lastName || "",
        relationship: initialData.relationship || "",
        emergencyContact: initialData.emergencyContact || "",
        dateOfBirth: initialData.dateOfBirth || "",
        sex: initialData.sex || "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.firstName && formData.lastName && formData.relationship) {
      try {
        const url = initialData
          ? `http://localhost:8080/api/employees/${empId}/dependents/${initialData.dependentsId}`
          : `http://localhost:8080/api/employees/${empId}/dependents`;

        const method = initialData ? "PUT" : "POST";

        const response = await authFetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(
            initialData
              ? "Failed to update dependent"
              : "Failed to add dependent"
          );
        }

        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          onSave(); // Trigger parent to refresh data
          onClose();
        }, 1000);
      } catch (error) {
        console.error("Error saving dependent:", error);
        alert("Error saving dependent. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-lg border border-gray-200 backdrop-blur-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-[#3c8dbc]"
          >
            {initialData ? "Edit Dependent" : "Add New Dependent"}
          </motion.h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-all"
          >
            <FiX size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="block text-xs font-medium text-gray-700 mb-1">
                First Name*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                  <FiUser className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-8 p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
                  required
                />
              </div>
            </motion.div>

            {/* Middle Name */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Middle Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                  <FiUser className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="w-full pl-8 p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
                />
              </div>
            </motion.div>

            {/* Last Name */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Last Name*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                  <FiUser className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pl-8 p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
                  required
                />
              </div>
            </motion.div>

            {/* Relationship */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Relationship*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                  <FiUsers className="h-4 w-4" />
                </div>
                <select
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  className="w-full pl-8 p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-transparent appearance-none bg-white"
                  required
                >
                  {relationships.map((rel) => (
                    <option
                      key={rel}
                      value={rel === "Select Relationship" ? "" : rel}
                    >
                      {rel}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Emergency Contact */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Emergency Contact
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full pl-8 p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
                />
              </div>
            </motion.div>

            {/* Date of Birth */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {isClient && (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full pl-8 p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
                  />
                )}
              </div>
            </motion.div>

            {/* Sex */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Sex
              </label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-transparent transition-all"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </motion.div>
          </div>

          {/* Form Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex gap-3 justify-end mt-6"
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm rounded-lg text-white transition-all ${
                submitSuccess
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-[#3c8dbc] hover:bg-[#3678a8]"
              }`}
            >
              {submitSuccess ? (
                <span className="flex items-center gap-1">
                  <FiCheck className="inline" /> Saved!
                </span>
              ) : initialData ? (
                "Update"
              ) : (
                "Add"
              )}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default function FamilyPage({ empId }: { empId: string }) {
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentDependent, setCurrentDependent] = useState<Dependent | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDependents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authFetch(
        `http://localhost:8080/api/employees/${empId}/dependents`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch dependents");
      }
      const data = await response.json();
      setDependents(data);
    } catch (err) {
      console.error("Error fetching dependents:", err);
      setError("Failed to load dependents");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (dependentsId: string) => {
    if (window.confirm("Are you sure you want to delete this dependent?")) {
      try {
        const response = await authFetch(
          `http://localhost:8080/api/employees/${empId}/dependents/${dependentsId}`,
          { method: "DELETE" }
        );

        if (!response.ok) {
          throw new Error("Failed to delete dependent");
        }

        fetchDependents(); // Refresh the list
      } catch (error) {
        console.error("Error deleting dependent:", error);
        alert("Failed to delete dependent");
      }
    }
  };

  useEffect(() => {
    if (empId) {
      fetchDependents();
    }
  }, [empId]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-red-500 mb-4">{error}</div>
            <button
              onClick={fetchDependents}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 bg-[#3c8dbc] rounded-lg shadow-md p-2 md:p-3 text-white h-[50px]">
          <div className="flex items-center">
            <FiUser className="mr-2 text-blue-100" />
            <div>
              <h1 className="text-[14px] font-bold">Family Members</h1>
              <p className="text-blue-100 text-xs">
                Manage your family information
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setCurrentDependent(null);
              setIsFormOpen(true);
            }}
            className="flex items-center bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1 rounded-md shadow-sm hover:shadow transition-all duration-300 border border-white border-opacity-20 text-xs md:text-sm mt-2 md:mt-0"
          >
            <FiPlus className="mr-1" />
            Add Dependent
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div
            className="overflow-x-auto"
            style={{ maxHeight: "calc(100vh - 250px)", overflowY: "auto" }}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-black-500 uppercase tracking-wider">
                    NO
                  </th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-black-500 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-black-500 uppercase tracking-wider">
                    Middle Name
                  </th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-black-500 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-black-500 uppercase tracking-wider">
                    Relationship
                  </th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-black-500 uppercase tracking-wider">
                    Emergency Contact
                  </th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-black-500 uppercase tracking-wider">
                    Date of Birth
                  </th>
                  <th className="px-4 py-3 text-left text-[12px] font-semibold text-black-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dependents.length > 0 ? (
                  dependents.map((dependent, index) => (
                    <tr
                      key={dependent.dependentsId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-[12px] font-semibold text-gray-500">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[12px] font-semibold text-gray-500">
                        {dependent.firstName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[12px] font-semibold text-gray-500">
                        {dependent.middleName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[12px] font-semibold text-gray-500">
                        {dependent.lastName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-[12px] font-semibold rounded-full ${
                            dependent.relationship === "Wife" ||
                            dependent.relationship === "Husband"
                              ? "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border border-purple-200"
                              : "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {dependent.relationship}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[12px] font-semibold text-gray-500">
                        {dependent.emergencyContact}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[12px] font-semibold text-gray-500">
                        {dependent.dateOfBirth}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-[12px] font-semibold flex gap-2">
                        <button
                          onClick={() => {
                            setCurrentDependent(dependent);
                            setIsFormOpen(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(dependent.dependentsId)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FiUsers className="text-gray-300 text-4xl mb-3" />
                        <h3 className="text-base font-medium text-gray-500">
                          No dependents found
                        </h3>
                        <p className="text-gray-400 mt-1 text-sm">
                          Click "Add Dependent" to add your first dependent
                        </p>
                        <button
                          onClick={() => setIsFormOpen(true)}
                          className="mt-3 flex items-center bg-[#3c8dbc] hover:bg-[#367fa9] text-white px-4 py-1.5 rounded-md shadow-sm hover:shadow transition-all duration-300 text-sm"
                        >
                          <FiPlus className="mr-1.5" />
                          Add Dependent
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {dependents.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div>
                  Showing{" "}
                  <span className="font-semibold">{dependents.length}</span>{" "}
                  dependents
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-purple-500 mr-1.5"></span>
                    <span>Spouse</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5"></span>
                    <span>Family Member</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {isFormOpen && (
          <DependentsForm
            empId={empId}
            onClose={() => {
              setIsFormOpen(false);
              setCurrentDependent(null);
            }}
            onSave={fetchDependents}
            initialData={currentDependent}
          />
        )}
      </div>
    </div>
  );
}
