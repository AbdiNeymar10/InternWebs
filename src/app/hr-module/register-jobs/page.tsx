"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Header from "../../components/Header";
import Sidebar from "../sidbar";
import toast, { Toaster } from "react-hot-toast";
import { fetchICFs, createICF } from "../../pages/api/icfService";
import {
  fetchJobTypes,
  createJobType,
  updateJobType,
  deleteJobType,
} from "../../pages/api/jobTypeService";
import {
  fetchJobGrades,
  createJobGrade,
  updateJobGrade,
  deleteJobGrade,
} from "../../pages/api/jobGradeService";
interface Record {
  id: number;
  jobTitle?: string;
  jobTitleAmharic?: string;
  grade?: string;
  ICF?: string;
  description: string;
  status?: string;
  code?: string;
  jobClass?: string;
}
interface ICFRecord {
  id: number;
  description: string;
  ICF: string;
}
interface JobRegisterModalProps {
  type: "job" | "class" | "position";
  onClose: () => void;
  onSave: (data: any) => void;
}
const generateRandomCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
const fetchJobTypeId = async (jobTitle: string): Promise<number | null> => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/hr-job-types/job-type-id?jobTitle=${encodeURIComponent(
        jobTitle
      )}`
    );
    if (!response.ok) {
      if (response.status === 404) {
        console.error(`Job Type not found for jobTitle: ${jobTitle}`);
        return null;
      }
      throw new Error(`Failed to fetch jobTypeId for jobTitle: ${jobTitle}`);
    }
    const jobTypeId = await response.json();
    return jobTypeId;
  } catch (error) {
    console.error("Error fetching jobTypeId:", error);
    return null;
  }
};
const JobRegisterModal = ({ type, onClose, onSave }: JobRegisterModalProps) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    const newRecord = {
      id: Date.now(),
      code: generateRandomCode(),
      ...data,
    };
    onSave(newRecord);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px] max-w-[90%] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {type === "job"
            ? "Add Job Title"
            : type === "class"
            ? "Add Class"
            : "Add Position"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {type === "job" && (
            <>
              <input
                {...register("jobTitle")}
                placeholder="Job Title"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                {...register("jobTitleAmharic")}
                placeholder="Job Title (Amharic)"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <textarea
                {...register("description")}
                placeholder="Description"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </>
          )}
          {type === "class" && (
            <>
              <input
                {...register("grade")}
                placeholder="Grade"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <textarea
                {...register("description")}
                placeholder="Description"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </>
          )}
          {type === "position" && (
            <>
              <input
                {...register("ICF")}
                placeholder="ICF"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <textarea
                {...register("description")}
                placeholder="Description"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </>
          )}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={() => toast.success("Added successfully!")}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const RegisterJob = () => {
  const [modalType, setModalType] = useState<
    "job" | "class" | "position" | null
  >(null);
  const [records, setRecords] = useState<Record[]>([]);
  const [icfList, setIcfList] = useState<ICFRecord[]>([]);
  const [selectedICF, setSelectedICF] = useState("");
  const [showAddICFModal, setShowAddICFModal] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newICF, setNewICF] = useState("");
  const [jobTypes, setJobTypes] = useState<Record[]>([]);
  const [editingJobType, setEditingJobType] = useState<Record | null>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [positions, setPositions] = useState<Record[]>([]);
  const [newPositions, setNewPositions] = useState<Record[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const icfs = await fetchICFs(); // Fetch data from the backend
        setIcfList(icfs);
      } catch (error) {
        console.error("Error fetching ICFs:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".relative")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const closeDropdown = () => setShowClassDropdown(false);
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  useEffect(() => {
    const fetchJobTypeData = async () => {
      try {
        const data = await fetchJobTypes();
        setJobTypes(data);
      } catch (error) {
        console.error("Error fetching job types:", error);
      }
    };

    fetchJobTypeData();
  }, []);

  useEffect(() => {
    const fetchJobGradesData = async () => {
      try {
        const data = await fetchJobGrades();
        setRecords(data); // Update the records state with the fetched data
      } catch (error) {
        console.error("Error fetching job grades:", error);
      }
    };

    fetchJobGradesData();
  }, []);
  useEffect(() => {
    if (selectedJobTitle && selectedClass) {
      fetchJobTypeDetails(selectedJobTitle, selectedClass);
    }
  }, [selectedJobTitle, selectedClass]);

  const handleAddICF = async (icf: string, description: string) => {
    if (!icf || !description) {
      toast.error("ICF and description are required.");
      return;
    }

    try {
      const newICFData = { ICF: icf, description: description };
      const createdICF = await createICF(newICFData);

      // Dynamically update the dropdown
      setIcfList((prev) => [...prev, createdICF]);
      setSelectedICF(createdICF.ICF);
    } catch (error) {
      console.error("Error adding ICF:", error);
    }
  };

  const handleDelete = (id: number) => {
    setPositions((prev) => prev.filter((position) => position.id !== id));
    toast("Record removed.");
  };

  const addRecord = (data: Record) => {
    setRecords((prev) => [...prev, data]);
  };

  // integrating job title with the backend
  const handleSaveJobType = async (data: {
    jobTitle: string;
    jobTitleInAmharic: string;
    description: string;
    status: string;
  }) => {
    try {
      if (editingJobType) {
        // Update existing job type
        const updatedJobType = await updateJobType(editingJobType.id, {
          ...data,
          code: editingJobType.code, // Preserve the existing code during updates
        });
        setJobTypes((prev) =>
          prev.map((jobType) =>
            jobType.id === editingJobType.id ? updatedJobType : jobType
          )
        );
        setEditingJobType(null);
      } else {
        // Create new job type
        const newJobType = await createJobType({
          ...data,
          code: generateRandomCode(), // Add the generated code
        });
        setJobTypes((prev) => [...prev, newJobType]); // Update state
      }
      setModalType(null); // Close modal
    } catch (error) {
      console.error("Error saving job type:", error);
    }
  };
  const handleModalSave = async (data: any) => {
    if (modalType === "job") {
      // Save job title to the backend
      try {
        await handleSaveJobType(data);
      } catch (error) {
        console.error("Error saving job title:", error);
      }
    } else if (modalType === "class") {
      // Save job grade (class) to the backend
      try {
        const { id, ...jobGradeData } = data;
        const newJobGrade = await createJobGrade(jobGradeData);
        setRecords((prev) => [...prev, newJobGrade]);
      } catch (error) {
        console.error("Error saving job grade:", error);
      }
    } else {
      // Handle other types (e.g., position)
      addRecord(data);
    }
  };
  const handleAddPosition = () => {
    if (!selectedICF || !selectedJobTitle || !selectedClass) {
      toast.error("Please select all fields.");
      return;
    }

    const newPosition = {
      id: Date.now(),
      ICF: selectedICF, // Only set the ICF value for display
      jobTitle: selectedJobTitle, // Keep jobTitle for saving
      jobClass: selectedClass, // Keep jobClass for saving
      description: "",
    };

    setPositions((prev) => [...prev, newPosition]); // Add to the main table
    setNewPositions((prev) => [...prev, newPosition]); // Track only new records
    toast.success("Position added successfully.");

    // Reset the form fields
    setSelectedICF("");
    setSelectedJobTitle("");
    setSelectedClass("");
    setModalType(null);
  };
  const fetchJobTypeDetails = async (jobTitle: string, jobClass: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/job-type-details/filter?jobTitle=${encodeURIComponent(
          jobTitle
        )}&jobClass=${encodeURIComponent(jobClass)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch job type details");
      }
      const data = await response.json();

      if (data.length === 0) {
        return; // Do not clear the existing table data
      }

      setPositions((prev) => [
        ...prev,
        ...data.map((detail: any) => ({
          id: detail.id,
          ICF: detail.icf?.ICF || "",
          description: detail.remark || "",
        })),
      ]);
    } catch (error) {
      console.error("Error fetching job type details:", error);
      toast.error("Failed to fetch job type details.");
    }
  };
  return (
    <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg min-h-[80vh]">
      <div className="space-y-6">
        {/* Job Title  */}
        <div className="flex items-center gap-4 relative">
          <label className="w-32 text-right font-semibold">Job Title:</label>

          <div className="flex-grow relative">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="--Select One--"
              value={selectedJobTitle}
              onChange={(e) => {
                setSelectedJobTitle(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />

            {selectedJobTitle && (
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
                onClick={() => {
                  setSelectedJobTitle("");
                  setShowDropdown(false);
                }}
              >
                ×
              </button>
            )}

            {showDropdown && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md max-h-48 overflow-y-auto">
                {jobTypes
                  .filter(
                    (jobType) =>
                      jobType.jobTitle &&
                      jobType.jobTitle
                        .toLowerCase()
                        .includes(selectedJobTitle.toLowerCase())
                  )
                  .map((jobType) => (
                    <li
                      key={jobType.id}
                      className="p-2 hover:bg-gray-400"
                      onClick={() => {
                        setSelectedJobTitle(jobType.jobTitle || "");
                        setShowDropdown(false);
                      }}
                    >
                      {jobType.jobTitle}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition duration-300"
            onClick={() => setModalType("job")}
          >
            <span className="text-xl">+</span>
          </button>
        </div>

        {/* Class */}
        <div className="flex items-center gap-4">
          <label className="w-32 text-right font-semibold">Class:</label>
          <div
            className="flex-grow relative"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              placeholder="--Select One--"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setShowClassDropdown(true);
              }}
              onFocus={() => setShowClassDropdown(true)}
            />
            {selectedClass && (
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
                onClick={() => {
                  setSelectedClass("");
                  setShowClassDropdown(false);
                }}
              >
                ×
              </button>
            )}
            {showClassDropdown && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md max-h-48 overflow-y-auto mt-1">
                {records
                  .filter(
                    (record) =>
                      record.grade &&
                      record.grade
                        .toLowerCase()
                        .includes(selectedClass.toLowerCase())
                  )
                  .map((record) => (
                    <li
                      key={record.id}
                      className="p-2 text-sm hover:bg-gray-400"
                      onClick={() => {
                        setSelectedClass(record.grade || "");
                        setShowClassDropdown(false);
                      }}
                    >
                      {record.grade}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <button
            className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition duration-300"
            onClick={() => setModalType("class")}
          >
            <span className="text-xl">+</span>
          </button>
        </div>

        {/* Position */}
        <div className="mt-10">
          {/* Position Modal */}
          {modalType === "position" && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 border border-gray-300 rounded-2xl shadow-lg w-[450px] relative flex flex-col space-y-6">
                {/* Close button */}
                <button
                  onClick={() => setModalType(null)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
                >
                  ✕
                </button>

                {/* ICF Dropdown */}
                <div className="flex flex-col space-y-4">
                  {/* Add Position Row */}
                  <h2 className="text-2xl font-bold mb-6 text-center">
                    Add Position
                  </h2>
                  <div className="flex items-center gap-4">
                    <label className="w-10 text-right font-semibold">
                      ICF:
                    </label>
                    <select
                      className="flex-grow p-2 border border-gray-300 rounded-md"
                      value={selectedICF}
                      onChange={(e) => setSelectedICF(e.target.value)}
                    >
                      <option value="">--Select One--</option>
                      {icfList.map((icf) => (
                        <option key={icf.id} value={icf.ICF}>
                          {icf.ICF} {/* Render the ICF property */}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowAddICFModal(true)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md transition transform hover:scale-110"
                    >
                      <span className="text-xl">+</span>
                    </button>
                  </div>

                  {/* Add Button */}
                  <div className="flex justify-center">
                    <button
                      disabled={
                        !selectedICF || !selectedJobTitle || !selectedClass
                      }
                      onClick={handleAddPosition}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add New ICF Modal */}
          {showAddICFModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 border border-gray-300 rounded-2xl shadow-lg w-[450px] relative flex flex-col space-y-6">
                {/* Close button */}
                <button
                  onClick={() => setShowAddICFModal(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
                >
                  ✕
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center">
                  Add New ICF
                </h2>

                {/* Inputs */}
                <div className="flex flex-col space-y-4">
                  <input
                    type="text"
                    placeholder="ICF"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={newICF}
                    onChange={(e) => setNewICF(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Description"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (newICF.trim()) {
                        handleAddICF(newICF, newDescription);
                        setNewICF("");
                        setNewDescription("");
                        setShowAddICFModal(false);
                        toast.success("icf added.");
                      }
                    }}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto rounded-lg shadow mt-6">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th colSpan={3} className="text-center px-6 py-4 border-b">
                    <button
                      onClick={() => setModalType("position")}
                      className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                      Add Job Position
                    </button>
                  </th>
                </tr>
                <tr>
                  <th className="px-6 py-3 border-b text-left">No</th>
                  <th className="px-6 py-3 border-b text-left">ICF</th>
                  <th className="px-6 py-3 border-b text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position, index) => (
                  <tr key={position.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 border-b">{index + 1}</td>
                    <td className="px-6 py-4 border-b">{position.ICF}</td>{" "}
                    {/* Ensure this is a string */}
                    <td className="px-6 py-4 border-b space-x-2">
                      <button
                        onClick={() => handleDelete(position.id)}
                        className="text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {positions.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-400 py-6">
                      No records added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-start pt-8">
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            onClick={async () => {
              if (newPositions.length === 0) {
                toast.error("No new positions to save.");
                return;
              }

              try {
                // Prepare payload for HR_JOB_TYPE
                const payloadForJobTypes = newPositions.map((position) => ({
                  jobTitle: {
                    id: jobTypes.find(
                      (job) => job.jobTitle === position.jobTitle
                    )?.id,
                  },
                  jobGrade: {
                    id: records.find(
                      (record) => record.grade === position.jobClass
                    )?.id,
                  },
                  icf: {
                    id: icfList.find((icf) => icf.ICF === position.ICF)?.id,
                  },
                  jobCode: null,
                  remark: null,
                }));

                // Save HR_JOB_TYPE and get the jobTypeIds
                const jobTypeResponse = await fetch(
                  "http://localhost:8080/api/hr-job-types/save-job-types",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payloadForJobTypes),
                  }
                );

                if (!jobTypeResponse.ok) {
                  throw new Error("Failed to save job types");
                }

                const jobTypeIds = await jobTypeResponse.json(); // Get the saved jobTypeIds
                console.log("Saved Job Type IDs:", jobTypeIds);

                // Prepare payload for HR_JOB_TYPE_DETAIL
                const payloadForDetails = newPositions.map(
                  (position, index) => {
                    const icfId = icfList.find(
                      (icf) => icf.ICF === position.ICF
                    )?.id;

                    return {
                      jobType: { id: jobTypeIds[index] || null },
                      icf: { id: icfId || null },
                      positionCode: null,
                      remark: null,
                      status: null,
                    };
                  }
                );

                // Save HR_JOB_TYPE_DETAIL
                const detailResponse = await fetch(
                  "http://localhost:8080/api/job-type-details/save",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payloadForDetails),
                  }
                );

                if (!detailResponse.ok) {
                  throw new Error("Failed to save job type details");
                }

                const detailResponseData = await detailResponse.json();
                console.log(
                  "Response from HR_JOB_TYPE_DETAIL save:",
                  detailResponseData
                );

                // Clear newPositions from the table
                setPositions((prev) =>
                  prev.filter(
                    (position) =>
                      !newPositions.some(
                        (newPosition) => newPosition.id === position.id
                      )
                  )
                );

                // Clear the newPositions state
                setPositions([]);
                setNewPositions([]);

                toast.success("New Job Types and Details saved successfully.");
              } catch (error) {
                console.error("Error saving data:", error);
                toast.error("Failed to save job types and job details.");
              }
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalType && modalType !== "position" && (
        <JobRegisterModal
          type={modalType}
          onClose={() => setModalType(null)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

// === Full Page Component ===
export default function RegisterJobsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar hidden={!isSidebarOpen} />{" "}
        {/* Pass hidden instead of isOpen */}
        {/* Main Content - Salary Settings */}
        <div className="flex-1 p-4 transition-all duration-300">
          <RegisterJob />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        © {new Date().getFullYear()} INSA ERP. All rights reserved.
      </footer>
    </div>
  );
}
