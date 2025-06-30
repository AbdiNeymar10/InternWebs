"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiX,
  FiEdit2,
  FiBriefcase,
  FiRefreshCw,
  FiTrash2,
} from "react-icons/fi";

interface JobTypeOption {
  id: number;
  jobTitle: string;
  jobTitleInAmharic: string;
  code?: string;
}

interface Experience {
  id: number;
  employeeId: string;
  jobTitle: string;
  jobTitleInAmharic: string;
  refNo: string;
  startDateEC: string;
  startDateGC: string;
  endDateEC: string;
}

const initialFormData: Omit<Experience, "id"> = {
  employeeId: "",
  jobTitle: "",
  jobTitleInAmharic: "",
  refNo: "",
  startDateEC: "",
  startDateGC: "",
  endDateEC: "",
};

interface ExperienceFormProps {
  onSubmit: (data: Omit<Experience, "id">) => void;
  onCancel: () => void;
  jobTypeOptions: JobTypeOption[];
  initialData?: Omit<Experience, "id"> | null;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  onSubmit,
  onCancel,
  jobTypeOptions,
  initialData,
}) => {
  const [formData, setFormData] = useState<Omit<Experience, "id">>(
    initialData || initialFormData
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(initialFormData);
    }
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedJobTypeId = e.target.value;
    const selectedOption = jobTypeOptions.find(
      (opt) => opt.id.toString() === selectedJobTypeId
    );
    setFormData((prev) => ({
      ...prev,
      jobTitle: selectedOption?.jobTitle || "",
      jobTitleInAmharic: selectedOption?.jobTitleInAmharic || "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.jobTitle && formData.startDateGC) {
      onSubmit(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/30"
    >
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {initialData ? "Edit Experience" : "Add Experience"}
          </h3>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full">
            <FiX size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Job Title*
            </label>
            <select
              value={
                jobTypeOptions.find((opt) => opt.jobTitle === formData.jobTitle)?.id || ""
              }
              onChange={handleJobTitleChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select Job Title</option>
              {jobTypeOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.jobTitle}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Reference Number
            </label>
            <input
              type="text"
              name="refNo"
              value={formData.refNo}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Start Date (GC)*
            </label>
            <input
              type="date"
              name="startDateGC"
              value={formData.startDateGC}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              {initialData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default function EditExperience({ empId }: { empId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [jobTypeOptions, setJobTypeOptions] = useState<JobTypeOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "http://localhost:8080/api";

  const fetchExperiences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<Experience[]>(
        `${API_URL}/employees/${empId}/experiences`
      );
      setExperiences(response.data || []);
    } catch (err) {
      setError("Failed to fetch experiences");
      console.error("Error fetching experiences:", err);
      setExperiences([]);
    } finally {
      setIsLoading(false);
    }
  }, [empId]);

  const fetchJobTypes = useCallback(async () => {
    try {
      const response = await axios.get<JobTypeOption[]>(
        `${API_URL}/jobtypes/titles-for-dropdown`
      );
      setJobTypeOptions(response.data);
    } catch (err) {
      setError("Failed to load job types");
      console.error("Error fetching job types:", err);
      setJobTypeOptions([]);
    }
  }, []);

  useEffect(() => {
    if (empId) {
      fetchExperiences();
      fetchJobTypes();
    }
  }, [empId, fetchExperiences, fetchJobTypes]);

  const handleAddExperience = async (formData: Omit<Experience, "id">) => {
    try {
      const url = currentExperience
        ? `${API_URL}/employees/${empId}/experiences/${currentExperience.id}`
        : `${API_URL}/employees/${empId}/experiences`;
      const method = currentExperience ? "PUT" : "POST";
      await axios({
        method,
        url,
        data: { ...formData, employeeId: empId },
        headers: { "Content-Type": "application/json" },
      });
      fetchExperiences();
      setShowForm(false);
      setCurrentExperience(null);
    } catch (err) {
      setError("Failed to save experience");
      console.error("Error saving experience:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        await axios.delete(`${API_URL}/employees/${empId}/experiences/${id}`);
        fetchExperiences();
      } catch (err) {
        setError("Failed to delete experience");
        console.error("Error deleting experience:", err);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        {error}
        <button
          onClick={fetchExperiences}
          className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 bg-[#3c8dbc] text-white p-3 rounded-lg">
        <div className="flex items-center">
          <FiBriefcase className="mr-2" />
          <div>
            <h1 className="text-sm font-bold">Experience</h1>
            <p className="text-xs">Manage your work experience</p>
          </div>
        </div>
        <button
          onClick={() => {
            setCurrentExperience(null);
            setShowForm(true);
          }}
          className="flex items-center bg-white/20 px-3 py-1 rounded-md text-xs"
        >
          <FiPlus className="mr-1" />
          Add Experience
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {showForm && (
          <ExperienceForm
            onSubmit={handleAddExperience}
            onCancel={() => {
              setShowForm(false);
              setCurrentExperience(null);
            }}
            jobTypeOptions={jobTypeOptions}
            initialData={currentExperience}
          />
        )}

        <div className="overflow-x-auto">
          {experiences.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No experiences found. Add your first experience.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "NO",
                    "Job Title",
                    "Job Title (Amharic)",
                    "Start Date (GC)",
                    "Reference No.",
                    "Start Date (EC)",
                    "End Date (EC)",
                    "Actions",
                  ].map((header, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-3 text-left font-semibold text-gray-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {experiences.map((exp, idx) => (
                  <tr key={exp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{exp.jobTitle}</td>
                    <td className="px-4 py-3">{exp.jobTitleInAmharic || "-"}</td>
                    <td className="px-4 py-3">{exp.startDateGC || "-"}</td>
                    <td className="px-4 py-3">{exp.refNo || "-"}</td>
                    <td className="px-4 py-3">{exp.startDateEC || "-"}</td>
                    <td className="px-4 py-3">{exp.endDateEC || "-"}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => {
                          setCurrentExperience(exp);
                          setShowForm(true);
                        }}
                        className="p-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600"
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="p-1 rounded-md bg-red-50 hover:bg-red-100 text-red-600"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}