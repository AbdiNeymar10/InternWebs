"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/utils/authFetch";
import DepartmentTree from "../../components/DepartmentTree";
import toast, { Toaster } from "react-hot-toast";
import AppModuleLayout from "../../components/AppModuleLayout";
import { FiPlus } from "react-icons/fi";

import {
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  KeyboardTab as KeyboardTabIcon,
} from "@mui/icons-material";
interface Job {
  id: number;
  title: string;
  code: string;
  family: string;
  employees: number;
}

function DepartmentSearch() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");

  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [assignedJobs, setAssignedJobs] = useState<Job[]>([]);
  const [selectedAvailableJobs, setSelectedAvailableJobs] = useState<number[]>(
    []
  );
  const [selectedAssignedJobs, setSelectedAssignedJobs] = useState<number[]>(
    []
  );
  const [showDepartmentTreeModal, setShowDepartmentTreeModal] = useState(false);
  const [departmentJobs, setDepartmentJobs] = useState<Job[]>([]);
  const [isTreeExpanded, setIsTreeExpanded] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    number | null
  >(null);
  const [departments, setDepartments] = useState<
    { id: number; name: string }[]
  >([]);

  // Fetch available jobs from the backend
  useEffect(() => {
    const fetchAvailableJobs = async () => {
      try {
        const response = await authFetch("http://localhost:8080/api/jobtypes");
        const data = await response.json();
        const jobs = data.map((job: { id: number; jobTitle: string }) => ({
          id: job.id,
          title: job.jobTitle,
        }));
        setAvailableJobs(jobs);
      } catch (error) {
        console.error("Error fetching available jobs:", error);
      }
    };
    fetchAvailableJobs();
  }, []);

  // Fetch departments from the backend
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await authFetch(
          "http://localhost:8080/api/departments"
        );
        const data = await response.json();
        const departmentData = data.map(
          (dept: { deptId: number; deptName: string }) => ({
            id: dept.deptId,
            name: dept.deptName,
          })
        );
        setDepartments(departmentData);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const handleAvailableJobSelect = (jobId: number) => {
    if (selectedAvailableJobs.includes(jobId)) {
      setSelectedAvailableJobs(
        selectedAvailableJobs.filter((id) => id !== jobId)
      );
    } else {
      setSelectedAvailableJobs([...selectedAvailableJobs, jobId]);
    }
  };

  const handleAssignedJobSelect = (jobId: number) => {
    if (selectedAssignedJobs.includes(jobId)) {
      setSelectedAssignedJobs(
        selectedAssignedJobs.filter((id) => id !== jobId)
      );
    } else {
      setSelectedAssignedJobs([...selectedAssignedJobs, jobId]);
    }
  };

  const assignSelectedJobs = async () => {
    if (selectedAvailableJobs.length === 0) return;

    try {
      const jobDetailsPromises = selectedAvailableJobs.map(
        async (jobTitleId) => {
          const response = await authFetch(
            `http://localhost:8080/api/hr-job-types/details-by-job-title-id?jobTitleId=${jobTitleId}`
          );
          return await response.json();
        }
      );

      const jobDetailsList = await Promise.all(jobDetailsPromises);

      const newJobs = jobDetailsList.map((jobDetails) => ({
        id: jobDetails.jobTypeId,
        title: jobDetails.jobTitle,
        code: jobDetails.jobCode,
        family: jobDetails.jobFamily,
        employees: 0,
      }));

      setAssignedJobs([...assignedJobs, ...newJobs]);
      setAvailableJobs(
        availableJobs.filter((job) => !selectedAvailableJobs.includes(job.id))
      );
      setSelectedAvailableJobs([]);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };
  const assignAllJobs = async () => {
    if (availableJobs.length === 0) return;

    try {
      const jobDetailsPromises = availableJobs.map(async (job) => {
        try {
          const response = await authFetch(
            `http://localhost:8080/api/hr-job-types/details-by-job-title-id?jobTitleId=${job.id}`
          );
          return await response.json();
        } catch (error) {
          return null;
        }
      });

      const jobDetailsList = await Promise.all(jobDetailsPromises);

      const newJobs = jobDetailsList
        .filter((jobDetails) => jobDetails !== null)
        .map((jobDetails) => ({
          id: jobDetails.jobTypeId,
          title: jobDetails.jobTitle,
          code: jobDetails.jobCode,
          family: jobDetails.jobFamily,
          employees: 0,
        }));

      setAssignedJobs([...assignedJobs, ...newJobs]);
      setAvailableJobs([]);
      setSelectedAvailableJobs([]);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };
  const removeSelectedJobs = () => {
    const jobsToRemove = assignedJobs.filter((job) =>
      selectedAssignedJobs.includes(job.id)
    );
    setAvailableJobs([...availableJobs, ...jobsToRemove]);
    setAssignedJobs(
      assignedJobs.filter((job) => !selectedAssignedJobs.includes(job.id))
    );
    setSelectedAssignedJobs([]);
  };

  const removeAllJobs = () => {
    setAvailableJobs([...availableJobs, ...assignedJobs]);
    setAssignedJobs([]);
    setSelectedAssignedJobs([]);
  };

  const handleDeleteJob = async (jobId: number) => {
    const isInDepartmentJobs = departmentJobs.some((job) => job.id === jobId);

    if (isInDepartmentJobs) {
      if (!selectedDepartmentId) {
        toast.error("No department selected.");
        return;
      }
      try {
        await authFetch(`http://localhost:8080/api/hr-dept-jobs/${jobId}`, {
          method: "DELETE",
        });
        setDepartmentJobs(departmentJobs.filter((job) => job.id !== jobId));
        toast.success("Job removed.");
      } catch (error) {
        console.error("Failed to remove job:", error);
        toast.error("Failed to remove job department.");
      }
    } else {
      setAssignedJobs(assignedJobs.filter((job) => job.id !== jobId));
      toast.success("Job removed.");
    }
  };
  const handleSelectDepartment = async (departmentId: number) => {
    const selectedDept = departments.find((dept) => dept.id === departmentId);
    setSelectedDepartment(selectedDept ? selectedDept.name : "");
    setSelectedDepartmentId(departmentId);
    setShowDepartmentTreeModal(false);

    try {
      const response = await authFetch(
        `http://localhost:8080/api/hr-dept-jobs/by-department/${departmentId}`
      );
      const data = await response.json();
      const jobs = data.map((job: any) => ({
        id: job.id,
        jobTypeId: job.jobType?.id ?? null,
        title: job.jobType?.jobTitle?.jobTitle ?? job.title ?? "",
        code: job.jobType?.jobCode ?? job.code ?? "",
        family: job.jobType?.jobFamily ?? job.family ?? "",
        employees: job.noOfEmployees ?? 0,
      }));
      setDepartmentJobs(jobs);
      setAssignedJobs([]);
    } catch (error) {
      console.error("Error fetching department jobs:", error);
      setDepartmentJobs([]);
      setAssignedJobs([]);
    }
  };

  const handleSave = async () => {
    if (!selectedDepartmentId || assignedJobs.length === 0) {
      toast.error("Please select a department and assign job.");
      return;
    }

    const existingJobIds = new Set(departmentJobs.map((job) => job.id));
    const newJobs = assignedJobs.filter((job) => !existingJobIds.has(job.id));

    if (newJobs.length === 0) {
      toast("No new jobs to save.");
      return;
    }

    try {
      const payload = newJobs.map((job) => ({
        departmentId: selectedDepartmentId,
        jobTypeId: job.id,
        noOfEmployees: 0,
      }));

      // Send the payload to the backend
      await authFetch("http://localhost:8080/api/hr-dept-jobs/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.success("Jobs successfully saved to the department.");

      setAssignedJobs([]);
      setDepartmentJobs([]);
      setSelectedDepartment("");
      setSelectedDepartmentId(null);
    } catch (error) {
      console.error("Error saving jobs:", error);
      toast.error("Failed to save jobs. Please try again.");
    }
  };
  return (
    <div className="p-2 sm:p-4 font-sans bg-white min-h-screen">
      <Toaster />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Department Search
      </h1>
      {/* Department Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Select Department
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-8 w-full">
          <div className="flex-1 flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="text"
              className="w-full p-2 border border-gray-300 text-sm rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder="Select Department"
              value={selectedDepartment}
              readOnly
            />
            <button
              className="flex items-center bg-[#3c8dbc] bg-opacity-60 hover:bg-[#3c8dbc] hover:bg-opacity-70 text-white px-2 py-1 rounded-md shadow-md hover:shadow-lg transition-all duration-300 border border-[#3c8dbc] border-opacity-60 text-xs md:text-sm ring-2 ring-[#3c8dbc]/20 hover:ring-[#3c8dbc]/40 focus:outline-none focus:ring-4 focus:ring-[#3c8dbc]/50"
              onClick={() => setShowDepartmentTreeModal(true)}
              type="button"
              aria-label="Open department tree"
            >
              <FiPlus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Add New Jobs Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Add New Jobs To Department
        </h2>

        <div className="flex flex-col lg:flex-row items-stretch gap-4 w-full">
          {/* Available Jobs */}
          <div className="border border-gray-300 rounded-md p-4 flex-1 min-w-0">
            <h3 className="font-medium text-gray-700 mb-3">Available Jobs</h3>
            <div className="max-h-36 overflow-y-auto">
              <ul>
                {availableJobs.length > 0 ? (
                  availableJobs.map((job, index) => (
                    <li
                      key={job.id}
                      className="flex items-center text-sm gap-3 mb-2 last:mb-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAvailableJobs.includes(job.id)}
                        onChange={() => handleAvailableJobSelect(job.id)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <span>{job.title}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No available jobs found.</li>
                )}
              </ul>
            </div>
          </div>
          {/* Arrow Controls */}
          <div className="flex flex-row lg:flex-col justify-center gap-2 lg:gap-4 py-2 lg:py-0 w-full lg:w-auto">
            <button
              onClick={assignSelectedJobs}
              disabled={selectedAvailableJobs.length === 0}
              className="p-1 bg-[#3c8dbc]/20 rounded-md text-gray-700 hover:text-blue-600 disabled:text-gray-300 transition-colors"
              title="Assign selected"
            >
              <ArrowForwardIcon className="h-5 w-6" />
            </button>

            <button
              onClick={assignAllJobs}
              disabled={availableJobs.length === 0}
              className="p-1 bg-[#3c8dbc]/20 rounded-md text-gray-700 hover:text-blue-600 disabled:text-gray-300 transition-colors"
              title="Assign all"
            >
              <KeyboardTabIcon className="h-5 w-6" />
            </button>

            <button
              onClick={removeSelectedJobs}
              disabled={selectedAssignedJobs.length === 0}
              className="p-1 bg-[#3c8dbc]/20 rounded-md text-gray-700 hover:text-blue-600 disabled:text-gray-300 transition-colors"
              title="Remove selected"
            >
              <ArrowBackIcon className="h-5 w-6" />
            </button>

            <button
              onClick={removeAllJobs}
              disabled={assignedJobs.length === 0}
              className="p-1 bg-[#3c8dbc]/20 rounded-md text-gray-700 hover:text-blue-600 disabled:text-gray-300 transition-colors"
              title="Remove all"
            >
              <KeyboardTabIcon className="h-5 w-6 transform rotate-180" />
            </button>
          </div>
          {/* Assigned Jobs */}
          <div className="border border-gray-300 rounded-md p-4 flex-1 min-w-0">
            <h3 className="font-medium text-gray-700 mb-3">
              New Assigned Jobs
            </h3>
            <div className="max-h-36 overflow-y-auto">
              <ul>
                {assignedJobs.length > 0 ? (
                  assignedJobs.map((job) => (
                    <li
                      key={job.id}
                      className="flex items-center text-sm gap-3 mb-2 last:mb-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAssignedJobs.includes(job.id)}
                        onChange={() => handleAssignedJobSelect(job.id)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <span>{job.title}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No assigned jobs found.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Department Tree Modal */}
      {showDepartmentTreeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 border border-white/30 rounded-2xl shadow-2xl backdrop-blur-sm p-6 w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-lg font-semibold text-gray-700">
                {/* {departments.find((d) => d.id === 1)?.name ||
                  ""} */}
              </h2>
              .
              <button
                className="text-gray-700 hover:text-gray-800 text-2xl"
                onClick={() => setShowDepartmentTreeModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="flex-grow overflow-y-auto">
              <DepartmentTree
                dept={{
                  deptId: 1,
                  deptName:
                    departments.find((d) => d.id === 1)?.name ||
                    "No Departments",
                  deptLevel: 0,
                  parentDeptId: null,
                }}
                onSelect={handleSelectDepartment}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Jobs Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Edit Jobs Under Department
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Code
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Family
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No of Emp
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentJobs.length > 0 || assignedJobs.length > 0 ? (
                [...departmentJobs, ...assignedJobs].map(
                  (job: Job, index: number) => (
                    <tr key={job.id}>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.title}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.code}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.family}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.employees}
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Save Button */}
        <div className="mt-6 flex justify-start">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] shadow-lg hover:shadow-xl"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
export default function DepartmentJobsPage() {
  return (
    <AppModuleLayout>
      <DepartmentSearch />
    </AppModuleLayout>
  );
}
