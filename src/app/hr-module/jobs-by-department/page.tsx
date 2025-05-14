"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";
import Sidebar from "../sidbar";
import DepartmentTree from "../../components/DepartmentTree";
import toast, { Toaster } from "react-hot-toast";

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

  const [availableJobs, setAvailableJobs] = useState<
    { id: number; title: string }[]
  >([]);
  const [assignedJobs, setAssignedJobs] = useState<
    { id: number; title: string }[]
  >([]);
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
        const response = await axios.get("http://localhost:8080/api/jobtypes");
        const jobs = response.data.map(
          (job: { id: number; jobTitle: string }) => ({
            id: job.id,
            title: job.jobTitle,
          })
        );
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
        const response = await axios.get(
          "http://localhost:8080/api/departments"
        );
        const departmentData = response.data.map(
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

  // Handle checkbox selection for available jobs
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
      // Fetch job details for each selected job title ID
      const jobDetailsPromises = selectedAvailableJobs.map(
        async (jobTitleId) => {
          const response = await axios.get(
            "http://localhost:8080/api/hr-job-types/details-by-job-title-id",
            {
              params: { jobTitleId },
            }
          );
          return response.data;
        }
      );

      const jobDetailsList = await Promise.all(jobDetailsPromises);

      // Map the response data to the required format
      const newJobs = jobDetailsList.map((jobDetails) => ({
        id: jobDetails.jobTypeId, // Correctly use the fetched jobTypeId
        title: jobDetails.jobTitle,
        code: jobDetails.jobCode,
        family: jobDetails.jobFamily,
        employees: 0,
      }));

      // Update the departmentJobs state with the new jobs
      setDepartmentJobs([...departmentJobs, ...newJobs]);

      // Update the assignedJobs state with the correct jobTypeId
      setAssignedJobs([...assignedJobs, ...newJobs]);

      // Remove the assigned jobs from availableJobs
      setAvailableJobs(
        availableJobs.filter((job) => !selectedAvailableJobs.includes(job.id))
      );

      // Clear the selectedAvailableJobs state
      setSelectedAvailableJobs([]);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };
  // Handle assigning ALL jobs to department
  const assignAllJobs = () => {
    setAssignedJobs([...assignedJobs, ...availableJobs]);
    setAvailableJobs([]);
    setSelectedAvailableJobs([]);
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

  // Handle removing ALL jobs from department
  const removeAllJobs = () => {
    setAvailableJobs([...availableJobs, ...assignedJobs]);
    setAssignedJobs([]);
    setSelectedAssignedJobs([]);
  };

  const handleDeleteJob = (jobId: number) => {
    setDepartmentJobs(departmentJobs.filter((job) => job.id !== jobId));
    toast.success("Job successfully removed.");
  };

  const handleSelectDepartment = (departmentId: number) => {
    const selectedDept = departments.find((dept) => dept.id === departmentId);
    setSelectedDepartment(selectedDept ? selectedDept.name : "");
    setSelectedDepartmentId(departmentId); // Store the department ID
    setShowDepartmentTreeModal(false);
  };

  const handleSave = async () => {
    if (!selectedDepartmentId || assignedJobs.length === 0) {
      toast.error(
        "Please select a valid department and assign at least one job."
      );
      return;
    }

    try {
      // Prepare the payload
      const payload = assignedJobs.map((job) => ({
        departmentId: selectedDepartmentId, // Use the department ID
        jobTypeId: job.id,
        noOfEmployees: 0,
      }));
      console.log("Payload being sent:", payload);

      // Send the payload to the backend
      await axios.post("http://localhost:8080/api/hr-dept-jobs/bulk", payload);

      // Show success notification
      toast.success("Jobs successfully saved to the department.");

      // Clear the assigned jobs and selected department
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
    <div className="p-6 font-sans bg-gray-100 min-h-screen">
      <Toaster />
      {/* Department Search Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Department Search
      </h1>

      {/* Department Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Select Department
        </h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Select Department"
            value={selectedDepartment}
            readOnly
            onChange={(e) => setSelectedDepartment(e.target.value)}
          />
          <button
            className="bg-gray-400 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-500 transition duration-300"
            onClick={() => setShowDepartmentTreeModal(true)}
          >
            <span className="text-xl">+</span>
          </button>
        </div>
      </div>

      {/* Add New Jobs Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Add New Jobs To Department
        </h2>

        <div className="flex items-stretch gap-4">
          {/* Available Jobs */}
          <div className="border border-gray-300 rounded-md p-4 flex-1">
            <h3 className="font-medium text-gray-700 mb-3">Available Jobs</h3>
            {/* Scrollable container for available jobs */}
            <div className="max-h-36 overflow-y-auto">
              <ul>
                {availableJobs.length > 0 ? (
                  availableJobs.map((job, index) => (
                    <li
                      key={job.id}
                      className="flex items-center gap-3 mb-2 last:mb-0"
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
          <div className="flex flex-col justify-center gap-4">
            {/* Single right arrow for assigning selected */}
            <button
              onClick={assignSelectedJobs}
              disabled={selectedAvailableJobs.length === 0}
              className="p-2 text-gray-700 hover:text-blue-600 disabled:text-gray-300"
              title="Assign selected"
            >
              <ArrowForwardIcon className="h-5 w-6" />
            </button>

            {/* Double right arrow for assigning all */}
            <button
              onClick={assignAllJobs}
              disabled={availableJobs.length === 0}
              className="p-2 text-gray-700 hover:text-blue-600 disabled:text-gray-300"
              title="Assign all"
            >
              <KeyboardTabIcon className="h-5 w-6" />
            </button>

            {/* Single left arrow for removing selected */}
            <button
              onClick={removeSelectedJobs}
              disabled={selectedAssignedJobs.length === 0}
              className="p-2 text-gray-700 hover:text-red-600 disabled:text-gray-300"
              title="Remove selected"
            >
              <ArrowBackIcon className="h-5 w-6" />
            </button>

            {/* Double left arrow for removing all */}
            <button
              onClick={removeAllJobs}
              disabled={assignedJobs.length === 0}
              className="p-2 text-gray-700 hover:text-red-600 disabled:text-gray-300"
              title="Remove all"
            >
              <KeyboardTabIcon className="h-5 w-6 transform rotate-180" />
            </button>
          </div>
          {/* Assigned Jobs */}
          <div className="border border-gray-300 rounded-md p-4 flex-1">
            <h3 className="font-medium text-gray-700 mb-3">
              New Assigned Jobs
            </h3>
            <div className="max-h-36 overflow-y-auto">
              <ul>
                {assignedJobs.length > 0 ? (
                  assignedJobs.map((job) => (
                    <li
                      key={job.id}
                      className="flex items-center gap-3 mb-2 last:mb-0"
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

      {/* Department Tree Modal */}
      {showDepartmentTreeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                {departments.find((d) => d.id === 61)?.name ||
                  "All Departments"}
              </h2>
              <button
                className="text-gray-700 hover:text-gray-800 text-2x"
                onClick={() => setShowDepartmentTreeModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="flex-grow overflow-y-auto">
              <DepartmentTree
                dept={{
                  deptId: 61,
                  deptName:
                    departments.find((d) => d.id === 61)?.name ||
                    "All Departments",
                  deptLevel: 0,
                  parentDeptId: null,
                }}
                onSelect={handleSelectDepartment} // Pass the function here
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Family
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No of Emp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentJobs.length > 0 ? (
                departmentJobs.map((job: Job, index: number) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap text text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text text-gray-900">
                      {job.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text text-gray-900">
                      {job.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text text-gray-900">
                      {job.family}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text text-gray-900">
                      {job.employees}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text text-gray-900">
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-gray-500"
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
            disabled={!selectedDepartment || assignedJobs.length === 0}
            className={`px-4 py-2 text-white font-semibold rounded-md ${
              !selectedDepartment || assignedJobs.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DepartmentJobsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar hidden={!isSidebarOpen} />
        <div className="flex-1 p-4 transition-all duration-300">
          <DepartmentSearch />
        </div>
      </div>
      <footer className="bg-gray-800 text-white p-4 text-center">
        © {new Date().getFullYear()} INSA ERP. All rights reserved.
      </footer>
    </div>
  );
}
