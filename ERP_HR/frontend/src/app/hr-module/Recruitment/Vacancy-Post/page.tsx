"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from "react-icons/fi";
import { authFetch } from "@/utils/authFetch";

// --- TYPE DEFINITIONS ---

type PromotionPost = {
  id: string;
  jobTitle: string;
  vacancyCode: string;
  department: string;
  icf: string;
  numberOfEmployees: number;
  termsOfEmployment: string;
};

type FullJobDetailsResponseDto = {
  icf: string;
  departmentName: string;
  vacancyCode: string;
  numberOfEmployees: number;
};

type JobCodeBatchOption = {
  id: number;
  displayValue: string;
};

type VacancyType = {
  id: number;
  name: string;
};

// --- COMPONENTS ---

const PromotionPostDetail = ({
  records,
  onAddNew,
  onDelete,
  specialSkills,
  setSpecialSkills,
}: {
  records: PromotionPost[];
  onAddNew: () => void;
  onDelete: (id: string) => void;
  specialSkills: string;
  setSpecialSkills: (value: string) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden mb-8"
    >
      <div className="px-6 py-4 border-b border-[#3c8dbc]/20 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3c8dbc] to-[#2c6da4]">
          Promotion Post Detail Information
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddNew}
          className="flex items-center bg-[#3c8dbc] hover:bg-[#2c6da4] text-white px-4 py-2 rounded-md shadow-sm transition-all duration-300 text-sm"
        >
          <FiPlus className="mr-1.5" />
          Add New
        </motion.button>
      </div>
      <div className="px-6 py-4">
        <div className="border border-[#3c8dbc]/30 rounded-lg overflow-x-auto mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#3c8dbc]/10">
                <th className="text-left py-3 px-4 text-xs font-medium text-[#3c8dbc] uppercase tracking-wider">
                  No
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#3c8dbc] uppercase tracking-wider">
                  Job Title
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#3c8dbc] uppercase tracking-wider">
                  Vacancy Code
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#3c8dbc] uppercase tracking-wider">
                  Department
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#3c8dbc] uppercase tracking-wider">
                  ICF
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#3c8dbc] uppercase tracking-wider">
                  Number Of Employee
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#3c8dbc] uppercase tracking-wider">
                  Terms Of Employment
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#3c8dbc] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-4 px-4 text-sm text-gray-500 text-center"
                  >
                    No promotion posts found. Click "Add New" to create one.
                  </td>
                </tr>
              ) : (
                records.map((record, index) => (
                  <tr
                    key={record.id}
                    className="border-t border-[#3c8dbc]/20 hover:bg-[#3c8dbc]/5"
                  >
                    <td className="py-3 px-4 text-xs text-gray-700">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-700">
                      {record.jobTitle}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-700">
                      {record.vacancyCode}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-700">
                      {record.department}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-700">
                      {record.icf}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-700">
                      {record.numberOfEmployees}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-700">
                      {record.termsOfEmployment}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-700 flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors">
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(record.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Additional/Special Skill Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="text-lg font-semibold text-[#3c8dbc] mb-2">
            Additional/Special Skill
          </h2>
          <textarea
            name="specialSkills"
            value={specialSkills}
            onChange={(e) => setSpecialSkills(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all min-h-[100px] text-sm"
            placeholder="Enter special skills information here..."
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

interface PromotionPostFormProps {
  preparedBy: string;
  commentGiven: string;
  processedDate: string;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

const PromotionPostForm: React.FC<PromotionPostFormProps> = ({
  preparedBy,
  commentGiven,
  processedDate,
  onInputChange,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { when: "beforeChildren", staggerChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden mb-8"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#3c8dbc]/20 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3c8dbc] to-[#2c6da4]">
          Promotion Post
        </h1>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6 ml-14">
            {/* Name */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PreparedBy
              </label>
              <input
                type="text"
                name="preparedBy"
                value={preparedBy}
                onChange={onInputChange}
                className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                placeholder="Enter name"
              />
            </motion.div>
            {/* Comment */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment Given
              </label>
              <textarea
                name="commentGiven"
                value={commentGiven}
                onChange={onInputChange}
                rows={4}
                className="w-3/4 px-3 py-2 min-h-[42px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                style={{ height: "42px" }}
              />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 ml-14">
            {/* Processed Date */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Processed Date
              </label>
              <input
                type="text"
                name="processedDate"
                value={processedDate}
                onChange={onInputChange}
                className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-100 cursor-not-allowed"
                readOnly
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Edit Link */}
      <div className="px-6 py-4 border-t border-[#3c8dbc]/20 text-center bg-blue-50/50">
        <motion.a
          href="#"
          className="text-[#3c8dbc] hover:text-[#2c6da4] underline transition-colors inline-flex items-center"
          whileHover={{ scale: 1.02 }}
        >
          If You Want to Edit Your Promotion Post
          <span className="text-red-500 ml-2">Click Here</span>
        </motion.a>
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE COMPONENT ---

const InternalVacancyPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<PromotionPost, "id">>({
    jobTitle: "",
    vacancyCode: "",
    department: "",
    icf: "",
    numberOfEmployees: 0,
    termsOfEmployment: "",
  });
  const [records, setRecords] = useState<PromotionPost[]>([]);
  const [vacancyData, setVacancyData] = useState({
    vacancyType: "",
    postDate: "",
    applicationDeadline: "",
    description: "",
  });
  const [promotionData, setPromotionData] = useState({
    preparedBy: "",
    commentGiven: "",
    processedDate: "09-10-2017",
  });
  const [specialSkills, setSpecialSkills] = useState("");
  const [jobCodeBatchOptions, setJobCodeBatchOptions] = useState<
    JobCodeBatchOption[]
  >([]);

  // Fetch job codes and batch codes on component mount
  useEffect(() => {
    const fetchJobCodeBatchOptions = async () => {
      try {
        const response = await authFetch(
          "http://localhost:8080/api/recruitment/jobcodes-batchcodes?advertisementType=Inside"
        );
        const data = await response.json();

        // UPDATED MAPPING LOGIC: Extract both displayValue and id
        const options = data.map(
          (item: { jobCodeAndBatchCode: string; jobTitleId: number }) => ({
            id: item.jobTitleId,
            displayValue: item.jobCodeAndBatchCode,
          })
        );
        setJobCodeBatchOptions(options);
      } catch (error) {
        console.error("Error fetching job codes and batch codes:", error);
      }
    };

    fetchJobCodeBatchOptions();
  }, []);

  const handleAddNew = () => {
    setIsFormOpen(true);
  };

  // New handler to fetch details when a job title is selected
  const handleJobTitleSelection = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedDisplayValue = e.target.value;
    const selectedOption = jobCodeBatchOptions.find(
      (option) => option.displayValue === selectedDisplayValue
    );

    // Update formData with the selected jobTitle display value immediately
    setFormData((prev) => ({ ...prev, jobTitle: selectedDisplayValue }));

    if (selectedOption) {
      const jobTitleId = selectedOption.id;
      try {
        const response = await authFetch(
          `http://localhost:8080/api/recruitment/job-details?jobTitleId=${jobTitleId}`
        );
        const data = (await response.json()) as FullJobDetailsResponseDto[];

        if (data && data.length > 0) {
          const details = data[0];
          setFormData((prev) => ({
            ...prev,
            jobTitle: selectedDisplayValue, // Ensure jobTitle is set
            department: details.departmentName,
            icf: details.icf,
            vacancyCode: details.vacancyCode,
            numberOfEmployees: details.numberOfEmployees,
          }));
        } else {
          console.warn(
            `No job details found for jobTitleId: ${jobTitleId}. Clearing related fields.`
          );
          setFormData((prev) => ({
            ...prev,
            jobTitle: selectedDisplayValue,
            department: "",
            icf: "",
            vacancyCode: "",
            numberOfEmployees: 0,
          }));
        }
      } catch (error) {
        console.error("Error fetching full job details:", error);
        setFormData((prev) => ({
          ...prev,
          jobTitle: selectedDisplayValue,
          department: "",
          icf: "",
          vacancyCode: "",
          numberOfEmployees: 0,
        }));
      }
    } else {
      // If "Select an option" or an invalid option is chosen, clear related fields
      setFormData((prev) => ({
        ...prev,
        jobTitle: "",
        department: "",
        icf: "",
        vacancyCode: "",
        numberOfEmployees: 0,
      }));
    }
  };

  // Updated input handler to delegate jobTitle changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "jobTitle") {
      handleJobTitleSelection(e as React.ChangeEvent<HTMLSelectElement>);
      return;
    }

    if (name in vacancyData) {
      setVacancyData((prev) => ({ ...prev, [name]: value }));
    } else if (name in promotionData) {
      setPromotionData((prev) => ({ ...prev, [name]: value }));
    } else if (name in formData) {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "numberOfEmployees" ? parseInt(value) || 0 : value,
      }));
    } else if (name === "specialSkills") {
      setSpecialSkills(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord = {
      ...formData,
      id: Date.now().toString(),
    };
    setRecords([...records, newRecord]);
    setFormData({
      jobTitle: "",
      vacancyCode: "",
      department: "",
      icf: "",
      numberOfEmployees: 0,
      termsOfEmployment: "",
    });
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter((record) => record.id !== id));
  };

  const handleSaveAll = () => {
    console.log("Saving all data:", {
      vacancyData,
      promotionData,
      promotionPosts: records,
      specialSkills,
    });
    alert("All data saved successfully!");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { when: "beforeChildren", staggerChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen p-6 font-sans relative overflow-y-auto">
      {/* Background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc]/10 to-purple-50 opacity-30"></div>
      </div>

      {/* Add New Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#3c8dbc]">
                  Add New Promotion Post
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Placement Request
                    </label>
                    <select
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc]"
                      required
                    >
                      <option value="" disabled>
                        --Select Job Code and Batch Code--
                      </option>
                      {jobCodeBatchOptions.map((option) => (
                        // --- FIX APPLIED HERE ---
                        <option
                          key={option.displayValue}
                          value={option.displayValue}
                        >
                          {option.displayValue}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Vacancy Code
                    </label>
                    <input
                      type="text"
                      name="vacancyCode"
                      value={formData.vacancyCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] bg-gray-100 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] bg-gray-100 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      ICF
                    </label>
                    <input
                      type="text"
                      name="icf"
                      value={formData.icf}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] bg-gray-100 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Terms of Employment
                    </label>
                    <select
                      name="termsOfEmployment"
                      value={formData.termsOfEmployment}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc]"
                    >
                      <option value="">Select an option</option>
                      <option value="Permanent">Permanent</option>
                      <option value="Temporary">Temporary</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Number of Employees
                    </label>
                    <input
                      type="number"
                      name="numberOfEmployees"
                      value={formData.numberOfEmployees}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] bg-gray-100 cursor-not-allowed"
                      min="0"
                      readOnly
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-3 py-1.5 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs rounded text-white bg-[#3c8dbc] hover:bg-[#3678a8] transition-all flex items-center gap-1"
                  >
                    <FiCheck size={14} /> Add Post
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3c8dbc] to-[#2c6da4]">
            Internal Vacancy
          </h1>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden mb-8"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#3c8dbc]/20 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3c8dbc] to-[#2c6da4]">
              Vacancy Post
            </h1>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6 ml-14">
                {/* Vacancy Type */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vacancy Type
                  </label>
                  <select
                    name="vacancyType"
                    value={vacancyData.vacancyType}
                    onChange={handleInputChange}
                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                  >
                    <option value="" disabled>
                      --Select One--
                    </option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="temporary">Temporary</option>
                  </select>
                </motion.div>

                {/* Post Date */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Post Date
                  </label>
                  <input
                    type="date"
                    name="postDate"
                    value={vacancyData.postDate}
                    onChange={handleInputChange}
                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                  />
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-6 ml-14">
                {/* Application Deadline */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={vacancyData.applicationDeadline}
                    onChange={handleInputChange}
                    className="w-3/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                  />
                </motion.div>

                {/* Description */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={vacancyData.description}
                    onChange={handleInputChange}
                    className="w-3/4 px-3 py-2 min-h-[42px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                    style={{ height: "42px" }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        <PromotionPostDetail
          records={records}
          onAddNew={handleAddNew}
          onDelete={handleDelete}
          specialSkills={specialSkills}
          setSpecialSkills={setSpecialSkills}
        />

        <PromotionPostForm
          preparedBy={promotionData.preparedBy}
          commentGiven={promotionData.commentGiven}
          processedDate={promotionData.processedDate}
          onInputChange={handleInputChange}
        />

        {/* Single Save Button Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden p-6 mb-6"
        >
          <div className="flex justify-center">
            <button
              className="bg-gradient-to-r from-[#3c8dbc] to-[#2c6da4] text-white font-semibold py-2 px-6 rounded-lg flex items-center space-x-2 hover:opacity-90 transition-colors duration-200"
              onClick={handleSaveAll}
            >
              <span>Save Vacancy</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InternalVacancyPage;
