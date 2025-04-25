// app/hr-module/organizational-structure/page.tsx
"use client";

import { useState } from "react";
import Sidebar from "../sidbar";
import Header from "../../components/Header";
import { motion } from "framer-motion";

export default function OrganizationStructure() {
  const [activeTab, setActiveTab] = useState<"structure" | "unitDetails">(
    "structure"
  );
  const [sidebarHidden, setSidebarHidden] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header toggleSidebar={() => setSidebarHidden(!sidebarHidden)} />
      <div className="flex h-screen">
        <Sidebar className="flex-shrink-0" hidden={sidebarHidden} />

        <main className="flex-1 p-6 overflow-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold mb-8 text-gray-800"
          >
            Organization Structure
          </motion.h1>

          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("structure")}
              className={`py-3 px-6 font-medium text-sm transition-all ${
                activeTab === "structure"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Organization Structure
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab("unitDetails")}
              className={`py-3 px-6 font-medium text-sm transition-all ${
                activeTab === "unitDetails"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Unit Details
            </motion.button>
          </div>

          {/* Tab Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-8 border border-gray-100"
          >
            {activeTab === "structure" ? <UnitNameTab /> : <UnitForm />}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function UnitForm() {
  const [formData, setFormData] = useState({
    unitName: "",
    title: "",
    telephone1: "",
    fax: "",
    poBox: "",
    branchName: "",
    location: "",
    telephone2: "",
    email: "",
    establishedDate: "",
    disableDepartment: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      unitName: "",
      title: "",
      telephone1: "",
      fax: "",
      poBox: "",
      branchName: "",
      location: "",
      telephone2: "",
      email: "",
      establishedDate: "",
      disableDepartment: false,
    });
  };

  const branchOptions = [
    "Head Office",
    "North Region Branch",
    "South Region Branch",
    "East Region Branch",
    "West Region Branch",
  ];

  const locationOptions = [
    "Addis Ababa",
    "Dire Dawa",
    "Mekelle",
    "Bahir Dar",
    "Hawassa",
    "Jimma",
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {submitSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-100"
        >
          Unit details saved successfully!
        </motion.div>
      )}

      <div className="flex flex-wrap gap-8">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-4 flex-1 min-w-[300px]"
        >
          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 w-1/3">
              Unit Name
            </label>
            <input
              type="text"
              name="unitName"
              value={formData.unitName}
              onChange={handleChange}
              className="w-2/3 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter unit name"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 w-1/3">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-2/3 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter title"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 w-1/3">
              Telephone 1
            </label>
            <input
              type="text"
              name="telephone1"
              value={formData.telephone1}
              onChange={handleChange}
              className="w-2/3 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter telephone number"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 w-1/3">
              Fax
            </label>
            <input
              type="text"
              name="fax"
              value={formData.fax}
              onChange={handleChange}
              className="w-2/3 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter fax number"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 w-1/3">
              P.O.BOX
            </label>
            <input
              type="text"
              name="poBox"
              value={formData.poBox}
              onChange={handleChange}
              className="w-2/3 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter P.O.BOX"
            />
          </div>

          <div className="flex items-center gap-3 mt-3">
            <input
              type="checkbox"
              name="disableDepartment"
              checked={formData.disableDepartment}
              onChange={handleChange}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label className="text-gray-700">Disable Department</label>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col gap-4 flex-1 min-w-[300px]"
        >
          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 w-1/3">
              Branch Name
            </label>
            <select
              name="branchName"
              value={formData.branchName}
              onChange={handleChange}
              className="w-2/3 p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-500 font-normal"
            >
              <option value="" className="text-gray-400">
                select
              </option>
              {branchOptions.map((branch) => (
                <option key={branch} value={branch} className="text-gray-700">
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 w-1/3">
              Location
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-2/3 p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-500 font-normal"
            >
              <option value="" className="text-gray-400">
                select
              </option>
              {locationOptions.map((location) => (
                <option
                  key={location}
                  value={location}
                  className="text-gray-700"
                >
                  {location}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 w-1/3">
              Telephone 2
            </label>
            <input
              type="text"
              name="telephone2"
              value={formData.telephone2}
              onChange={handleChange}
              className="w-2/3 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter secondary telephone"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 w-1/3">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-2/3 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter email address"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 w-1/3">
              Established Date
            </label>
            <input
              type="date"
              name="establishedDate"
              value={formData.establishedDate}
              onChange={handleChange}
              className="w-2/3 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end gap-4 mt-8"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={resetForm}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg shadow-sm hover:bg-gray-200 transition-all"
        >
          Reset
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-3 text-white rounded-lg shadow-sm transition-all ${
            isSubmitting ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </motion.button>
      </motion.div>
    </form>
  );
}

function UnitNameTab() {
  const [units, setUnits] = useState<string[]>(["61--ኢመደአ", "1674--ኢመደአ አዲሰ"]);
  const [newUnit, setNewUnit] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const addUnit = () => {
    if (newUnit.trim()) {
      setIsAdding(true);
      setTimeout(() => {
        setUnits([...units, newUnit]);
        setNewUnit("");
        setIsAdding(false);
      }, 500);
    }
  };

  const removeUnit = (index: number) => {
    setUnits(units.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Manage Units
      </h2>

      <div className="flex mb-6">
        <input
          type="text"
          value={newUnit}
          onChange={(e) => setNewUnit(e.target.value)}
          placeholder="Enter unit name"
          className="flex-1 p-3 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addUnit}
          disabled={isAdding}
          className={`px-5 py-3 text-white rounded-r-lg transition-all ${
            isAdding ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isAdding ? "Adding..." : "Add Unit"}
        </motion.button>
      </div>

      <div className="space-y-3">
        {units.map((unit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-lg hover:bg-gray-100 transition-all"
          >
            <span className="text-gray-700">{unit}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => removeUnit(index)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
