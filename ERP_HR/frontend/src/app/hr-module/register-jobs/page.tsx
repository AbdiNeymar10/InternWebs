"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { fetchICFs, createICF } from "../../pages/api/icfService";
import AppModuleLayout from "../../components/AppModuleLayout";
import { FiPlus } from "react-icons/fi";
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

const JobRegisterModal = ({ type, onClose, onSave }: JobRegisterModalProps) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    const newRecord = {
      id: Date.now(),
      ...data,
    };
    onSave(newRecord);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-xl w-[400px] max-w-[90%] relative border border-gray-200 backdrop-blur-sm">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-[#3c8dbc]">
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
                {...register("jobTitleInAmharic")}
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
              className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] shadow-lg hover:shadow-xl"
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
        const icfs = await fetchICFs();
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
        setRecords(data);
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
          code: editingJobType.code,
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
        });
        setJobTypes((prev) => [...prev, newJobType]);
      }
      setModalType(null);
    } catch (error) {
      console.error("Error saving job type:", error);
    }
  };
  const handleModalSave = async (data: any) => {
    if (modalType === "job") {
      try {
        await handleSaveJobType(data);
      } catch (error) {
        console.error("Error saving job title:", error);
      }
    } else if (modalType === "class") {
      try {
        const { id, ...jobGradeData } = data;
        const newJobGrade = await createJobGrade(jobGradeData);
        setRecords((prev) => [...prev, newJobGrade]);
      } catch (error) {
        console.error("Error saving job grade:", error);
      }
    } else {
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
      ICF: selectedICF,
      jobTitle: selectedJobTitle,
      jobClass: selectedClass,
      description: "",
    };

    setPositions((prev) => [...prev, newPosition]);
    setNewPositions((prev) => [...prev, newPosition]);
    toast.success("Position added successfully.");

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
        return;
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
    <div className="p-2 sm:p-4 md:p-6 font-sans bg-white min-h-screen">
      <div className="space-y-6">
        {/* Job Title  */}
        <h3 className="text-xl font-bold text-gray-800 mb-4">Job Type</h3>
        {/* Job Title */}
        <div className="flex flex-col gap-2 w-full mb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
            <label className="w-full sm:w-32 text-left sm:text-right font-semibold mb-1 sm:mb-0">
              Job Title:
            </label>
            <div className="flex-grow relative w-full">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 text-xs rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
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
              className="flex items-center bg-[#3c8dbc] bg-opacity-60 hover:bg-[#3c8dbc] hover:bg-opacity-70 text-white px-3 py-1 rounded-md shadow-md hover:shadow-lg transition-all duration-300 border border-[#3c8dbc] border-opacity-60 text-xs md:text-sm ring-2 ring-[#3c8dbc]/20 hover:ring-[#3c8dbc]/40 focus:outline-none focus:ring-4 focus:ring-[#3c8dbc]/50 mt-2 sm:mt-0"
              onClick={() => setModalType("job")}
            >
              <FiPlus size={16} />
            </button>
          </div>
        </div>
        {/* Class */}
        <div className="flex flex-col gap-2 w-full mb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
            <label className="w-full sm:w-32 text-left sm:text-right font-semibold mb-1 sm:mb-0">
              Class:
            </label>
            <div
              className="flex-grow relative w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                placeholder="--Select One--"
                className="w-full p-2 border border-gray-300 rounded-md text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
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
              className="flex items-center bg-[#3c8dbc] bg-opacity-60 hover:bg-[#3c8dbc] hover:bg-opacity-70 text-white px-3 py-1 rounded-md shadow-md hover:shadow-lg transition-all duration-300 border border-[#3c8dbc] border-opacity-60 text-xs md:text-sm ring-2 ring-[#3c8dbc]/20 hover:ring-[#3c8dbc]/40 focus:outline-none focus:ring-4 focus:ring-[#3c8dbc]/50 mt-2 sm:mt-0"
              onClick={() => setModalType("class")}
            >
              <FiPlus size={16} />
            </button>
          </div>
        </div>
        {/* Position */}
        <div className="mt-10">
          {/* Position Modal */}
          {modalType === "position" && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 border border-gray-300 rounded-2xl shadow-lg w-[450px] relative flex flex-col space-y-6 backdrop-blur-sm">
                {/* Close button */}
                <button
                  onClick={() => setModalType(null)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
                >
                  ✕
                </button>

                {/* ICF */}
                <div className="flex flex-col space-y-4">
                  {/* Add Position Row */}
                  <h2 className="text-2xl font-bold text-[#3c8dbc]">
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
                          {icf.ICF}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowAddICFModal(true)}
                      className="flex items-center bg-[#3c8dbc] bg-opacity-60 hover:bg-[#3c8dbc] hover:bg-opacity-70 text-white px-3 py-1 rounded-md shadow-md hover:shadow-lg transition-all duration-300 border border-[#3c8dbc] border-opacity-60 text-xs md:text-sm ring-2 ring-[#3c8dbc]/20 hover:ring-[#3c8dbc]/40 focus:outline-none focus:ring-4 focus:ring-[#3c8dbc]/50"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>

                  {/* Add Button */}
                  <div className="flex justify-center">
                    <button
                      disabled={
                        !selectedICF || !selectedJobTitle || !selectedClass
                      }
                      onClick={handleAddPosition}
                      className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] shadow-lg hover:shadow-xl"
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
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 border border-gray-300 rounded-2xl shadow-lg w-[450px] relative flex flex-col space-y-6 backdrop-blur-sm">
                {/* Close button */}
                <button
                  onClick={() => setShowAddICFModal(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
                >
                  ✕
                </button>

                <h2 className="text-xl font-bold text-[#3c8dbc]">Add ICF</h2>

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
                    className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] shadow-lg hover:shadow-xl"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <h3 className="text-xl font-bold text-gray-800 mt-6">
            Job Position Under Job Type
          </h3>
          <div className="overflow-x-auto rounded-xl shadow mt-6">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th colSpan={3} className="text-center px-6 py-4 border-b">
                    <button
                      onClick={() => setModalType("position")}
                      className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] shadow-lg hover:shadow-xl"
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
                    <td className="px-6 py-4 border-b">{position.ICF}</td>
                    <td className="px-6 py-4 border-b space-x-2">
                      <button
                        onClick={() => handleDelete(position.id)}
                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500 transition"
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
        <div className="flex flex-col sm:flex-row justify-start pt-8">
          <button
            className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] shadow-lg hover:shadow-xl w-full sm:w-auto"
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

                const jobTypeIds = await jobTypeResponse.json();
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

                setPositions((prev) =>
                  prev.filter(
                    (position) =>
                      !newPositions.some(
                        (newPosition) => newPosition.id === position.id
                      )
                  )
                );

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

export default function RegisterJobsPage() {
  return (
    <AppModuleLayout>
      <RegisterJob />
    </AppModuleLayout>
  );
}
