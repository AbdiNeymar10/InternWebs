"use client";

import React, { useEffect, useState } from "react";
import { fetchJobTypes } from "../pages/api/jobTypeService";
import toast, { Toaster } from "react-hot-toast";
interface JobFamily {
  id: number;
  code: string;
  familyName: string;
  familyCode: string;
}

interface JobTitle {
  id: number;
  jobTitle: string;
  code: string;
}

interface AssignedJob {
  no: number;
  id?: number;
  jobTitle: string;
  jobCode: string;
}

const JobFamily: React.FC = () => {
  const [jobFamilies, setJobFamilies] = useState<JobFamily[]>([]);
  const [selectedJobFamilyId, setSelectedJobFamilyId] = useState<number | null>(
    null
  );

  const [jobFamilyNameInput, setJobFamilyNameInput] = useState("");
  const [jobFamilyCodeInput, setJobFamilyCodeInput] = useState("");

  const [showJobFamilyModal, setShowJobFamilyModal] = useState(false);

  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [selectedJobTitleId, setSelectedJobTitleId] = useState<number | null>(
    null
  );

  const [assignedJobs, setAssignedJobs] = useState<AssignedJob[]>([]);
  const [showAddJobPopup, setShowAddJobPopup] = useState(false);

  useEffect(() => {
    const fetchJobFamilies = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/job-family");
        if (!res.ok) {
          throw new Error("Failed to fetch job families");
        }
        const data = await res.json();
        setJobFamilies(data);
      } catch (error) {
        console.error("Error fetching job families:", error);
      }
    };

    fetchJobFamilies();
  }, [showJobFamilyModal]);

  useEffect(() => {
    if (showAddJobPopup) {
      fetchJobTypes()
        .then((data) => {
          setJobTitles(data);
        })
        .catch((error) => console.error("Error fetching job titles:", error));
    }
  }, [showAddJobPopup]);

  const addJobFamily = async () => {
    if (!jobFamilyNameInput.trim() || !jobFamilyCodeInput.trim()) {
      toast.error("this fields are required.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/api/job-family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyName: jobFamilyNameInput,
          familyCode: jobFamilyCodeInput,
          status: "1", // Default value for status
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      const newFamily = await res.json();
      setJobFamilies((prev) => [...prev, newFamily]);
      setSelectedJobFamilyId(newFamily.id);
      setJobFamilyNameInput("");
      setJobFamilyCodeInput("");
      setShowJobFamilyModal(false);
      toast.success("Job Family saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save Job Family");
    }
  };

  const addJob = async () => {
    if (selectedJobTitleId === null) return;

    const jobTitleObj = jobTitles.find((jt) => jt.id === selectedJobTitleId);
    if (
      !jobTitleObj ||
      assignedJobs.some((j) => j.jobTitle === jobTitleObj.jobTitle)
    )
      return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/hr-job-types/by-job-family-and-title?jobFamilyId=${selectedJobFamilyId}&jobTitleId=${selectedJobTitleId}`
      );
      if (!res.ok) {
        toast.error("This job is not registered for the selected job family.");
        return;
      }
      const jobType = await res.json();

      setAssignedJobs((prev) => [
        ...prev,
        {
          no: prev.length + 1,
          id: jobType.id,
          jobTitle: jobType.jobTitle,
          jobCode: jobType.jobCode,
        },
      ]);
      setShowAddJobPopup(false);
    } catch (err) {
      toast.error("Failed to fetch job code for this job title.");
    }
  };

  const removeJob = async (no: number) => {
    setAssignedJobs((prev) =>
      prev.filter((j) => j.no !== no).map((j, i) => ({ ...j, no: i + 1 }))
    );
    toast("Job removed");
  };
  // Fetch assigned jobs when a job family is selected
  useEffect(() => {
    if (selectedJobFamilyId) {
      fetch(
        `http://localhost:8080/api/hr-job-types/by-job-family/${selectedJobFamilyId}`
      )
        .then((res) => res.json())
        .then((data) => {
          const jobs = data.map((jt: any, idx: number) => ({
            id: jt.id,
            no: idx + 1,
            jobTitle: jt.jobTitle,
            jobCode: jt.jobCode,
          }));
          setAssignedJobs(jobs);
        })
        .catch((err) => {
          setAssignedJobs([]);
          console.error("Error fetching assigned jobs:", err);
        });
    } else {
      setAssignedJobs([]);
    }
  }, [selectedJobFamilyId]);

  const saveJobFamily = async () => {
    if (!selectedJobFamilyId || assignedJobs.length === 0) {
      toast.error("Please select a Job Family and assign.");
      return;
    }

    try {
      console.log("Assigned Jobs:", assignedJobs);
      // Prepare the payload
      const jobTypeUpdates = assignedJobs.map((job) => ({
        jobTitleId: jobTitles.find((jt) => jt.jobTitle === job.jobTitle)?.id,
        jobFamilyId: selectedJobFamilyId,
      }));

      // Send the update request
      const res = await fetch(
        "http://localhost:8080/api/hr-job-types/update-job-family",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobTypeUpdates),
        }
      );

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      toast.success("Job Family updated successfully!");
      setAssignedJobs([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update Job Family");
    }
  };

  return (
    <div className="p-4 bg-white">
      {/* Top Label */}
      <Toaster />
      <h2 className="text-xl font-bold mb-4">Job Family</h2>
      {/* Job Family Name and Code */}
      <div className="mb-4 ml-0 md:ml-12">
        {/* Job Family Name */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
          <label className="whitespace-nowrap w-full md:w-32 text-left md:text-right">
            Job Family Name
          </label>
          <div className="flex-1 flex items-center gap-2 w-full">
            <select
              className="flex-1 p-2 border rounded-md w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              value={selectedJobFamilyId ?? ""}
              onChange={(e) => {
                const selectedId = Number(e.target.value);
                setSelectedJobFamilyId(selectedId);

                // Fetch the corresponding Job Family Code
                const selectedJobFamily = jobFamilies.find(
                  (jf) => jf.id === selectedId
                );
                setJobFamilyCodeInput(selectedJobFamily?.familyCode || "");
              }}
            >
              <option value="">--Select One--</option>
              {jobFamilies.map((jf) => (
                <option key={jf.id} value={jf.id}>
                  {jf.familyName}
                </option>
              ))}
            </select>
            {/* Plus Icon */}
            <button
              className="bg-gray-400 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-500 transition duration-300"
              onClick={() => setShowJobFamilyModal(true)}
            >
              <span className="text-xl">+</span>
            </button>
          </div>
        </div>

        {/* Job Family Code */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mt-4">
          <label className="whitespace-nowrap w-full md:w-32 text-left md:text-right">
            Job Family Code
          </label>
          <input
            type="text"
            className="flex-1 p-2 border rounded-md w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            value={jobFamilyCodeInput}
            readOnly
          />
        </div>
      </div>

      {/* Assign job under job family */}
      <div className="text-xl font-bold mb-10 mt-10">
        Assign job under job family
      </div>
      {/* Job Table */}
      <div className="border rounded">
        <div className="flex justify-center border-b p-2">
          <button
            className="bg-gray-500 text-white px-5 py-2 hover:bg-gray-500 rounded"
            onClick={() => setShowAddJobPopup(true)}
          >
            Add Job
          </button>
        </div>
        {/* Make table horizontally scrollable on small screens */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-gray-200 mt-8">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border-r">No</th>
                <th className="p-2 border-r">Job Title</th>
                <th className="p-2 border-r">Job Code</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {assignedJobs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 py-6">
                    No jobs assigned.
                  </td>
                </tr>
              ) : (
                assignedJobs.map((job) => (
                  <tr key={job.no} className="border-b">
                    <td className="p-2 border-r text-center">{job.no}</td>
                    <td className="p-2 border-r text-center ">
                      {job.jobTitle}
                    </td>
                    <td className="p-2 border-r text-center">{job.jobCode}</td>
                    <td className="p-2 text-center">
                      <button
                        className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500 transition"
                        onClick={() => removeJob(job.no)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-start p-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={saveJobFamily}
        >
          Save
        </button>
      </div>

      {/* Add Job Modal */}
      {showAddJobPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-10 w-[450px] shadow-lg relative">
            <div className="flex justify-between items-center mb-4">
              <div className="font-semibold">Add Position</div>
              <button
                className="text-gray-600 font-bold absolute top-2 right-2 text-xl"
                onClick={() => setShowAddJobPopup(false)}
              >
                &times;
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4 mr-4">
              <label className="block mb-2 font-semibold">Job Title:</label>
              <select
                className="border rounded px-4 py-2 flex-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                value={selectedJobTitleId ?? ""}
                onChange={(e) => setSelectedJobTitleId(Number(e.target.value))}
              >
                <option value="">--Select One--</option>
                {jobTitles.map((jt) => (
                  <option key={jt.id} value={jt.id}>
                    {jt.jobTitle}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={addJob}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Family Modal */}
      {showJobFamilyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 relative">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Job Family</h2>
              <button
                className="absolute top-2 right-2 text-gray-600 font-bold text-xl"
                onClick={() => setShowJobFamilyModal(false)}
              >
                &times;
              </button>
            </div>
            {/* Job Family Name Input */}
            <input
              type="text"
              className="border rounded w-full px-2 py-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="job family name"
              value={jobFamilyNameInput}
              onChange={(e) => setJobFamilyNameInput(e.target.value)}
            />
            {/* Job Family Code Input */}
            <input
              type="text"
              className="border rounded w-full px-2 py-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="job family code"
              value={jobFamilyCodeInput}
              onChange={(e) => setJobFamilyCodeInput(e.target.value)}
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                onClick={addJobFamily}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFamily;
