"use client";

import { useState, useEffect } from "react";
import { fetchJobGrades } from "../pages/api/jobGradeService";
import { fetchICFs } from "../pages/api/icfService";
import toast, { Toaster } from "react-hot-toast";
import {
  fetchPayGrades,
  savePayGrades,
  deletePayGrade,
} from "../pages/api/hrPayGradService";

interface Record {
  id: number;
  incrementStep: string;
  salary: string;
}
interface ClassOption {
  id: number;
  grade: string;
}
interface IcfOption {
  id: number;
  ICF: string;
}

const SalarySettings = () => {
  const [classDropdown, setClassDropdown] = useState<string>("");
  const [icfDropdown, setIcfDropdown] = useState<string>("");
  const [beginningSalary, setBeginningSalary] = useState<string>("");
  const [maxSalary, setMaxSalary] = useState<string>("");
  const [incrementStep, setIncrementStep] = useState<string>("");
  const [salary, setSalary] = useState<string>("");
  const [records, setRecords] = useState<Record[]>([]);
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
  const [icfOptions, setIcfOptions] = useState<IcfOption[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [editRecordId, setEditRecordId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Fetch job grades and ICFs for dropdowns
  useEffect(() => {
    const fetchClassAndICFData = async () => {
      try {
        const classData = await fetchJobGrades();
        setClassOptions(
          classData.map((item: any) => ({ id: item.id, grade: item.grade }))
        );
        const icfData = await fetchICFs();
        setIcfOptions(
          icfData.map((item: any) => ({ id: item.id, ICF: item.ICF }))
        );
      } catch (error) {
        toast.error("Error fetching class and ICF data.");
      }
    };
    fetchClassAndICFData();
  }, []);

  // Fetch pay grades from the backend
  useEffect(() => {
    const loadPayGrades = async () => {
      if (!classDropdown || !icfDropdown) {
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/hr-pay-grad/filter?classId=${classDropdown}&icfId=${icfDropdown}`
        );

        if (!response.ok) {
          toast.error("Failed to fetch pay grades.");
          return;
        }

        const data = await response.json();

        if (data.length === 0) {
          return;
        }

        // Append new data to the existing records
        setRecords((prev) => [
          ...prev,
          ...data.map((item: any) => ({
            id: item.payGradeId,
            incrementStep: item.stepNo,
            salary: item.salary,
          })),
        ]);
      } catch (error) {
        toast.error("Failed to fetch pay grades.");
        console.error("Error fetching pay grades:", error);
      }
    };

    loadPayGrades();
  }, [classDropdown, icfDropdown]); // Trigger fetch when classDropdown or icfDropdown changes
  const addDetail = () => {
    if (!classDropdown || !icfDropdown || !beginningSalary || !maxSalary) {
      toast.error("Please fill all fields before adding details.");
      return;
    }
    setIsPopupOpen(true); // Open the pop-up form
  };

  const addIncrementStepAndSalary = () => {
    if (!incrementStep || !salary) {
      toast.error("Please fill all fields in the pop-up form.");
      return;
    }

    const newRecord = {
      id: editRecordId || Date.now(),
      incrementStep,
      salary,
    };

    if (editRecordId) {
      // Update the existing record in the table
      setRecords((prev) =>
        prev.map((record) =>
          record.id === editRecordId
            ? { ...record, incrementStep, salary }
            : record
        )
      );
      toast.success("Record updated successfully.");
    } else {
      // Add a new record to the table
      setRecords((prev) => [...prev, newRecord]);
      toast.success("Record added successfully.");
    }

    // Reset the pop-up form
    setIncrementStep("");
    setSalary("");
    setEditRecordId(null);
    setIsPopupOpen(false);
  };
  const editDetail = (record: Record) => {
    setEditRecordId(record.id);
    setIncrementStep(record.incrementStep);
    setSalary(record.salary);
    setIsPopupOpen(true);
    setIsEditing(true);
  };

  const deleteDetail = async (id: number) => {
    try {
      setRecords(records.filter((record) => record.id !== id));
      toast.success("Record deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  const saveDetails = async () => {
    if (!classDropdown || !icfDropdown || !beginningSalary || !maxSalary) {
      toast.error("Please fill all fields before saving.");
      return;
    }

    if (records.length === 0) {
      toast.error("No records to save.");
      return;
    }

    try {
      // Construct rankPayload dynamically based on records
      const rankPayload = records.map(() => ({
        beginningSalary: beginningSalary.trim(),
        maxSalary: maxSalary.trim(),
        jobGrade: {
          id: parseInt(classDropdown),
        },
        icf: {
          id: parseInt(icfDropdown),
        },
      }));

      console.log("Rank Payload (Array):", rankPayload);
      console.log("Rank Payload Sent:", JSON.stringify(rankPayload, null, 2));

      const rankResponse = await fetch(
        "http://localhost:8080/api/hr-rank/bulk-save",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rankPayload),
        }
      );

      if (!rankResponse.ok) {
        const error = await rankResponse.text();
        toast.error("Error saving rank. Check console for more details.");
        console.error("Error saving rank: " + error);
        return;
      }

      const savedRank = await rankResponse.json();
      const rankId = savedRank[0]?.rankId; // Assuming the response is an array

      if (!rankId) {
        toast.error("Failed to retrieve rankId from saved rank.");
        return;
      }

      // Save HR_PAY_GRAD data
      const payGradPayload = records.map((record) => ({
        rank: { rankId }, // Send rankId as part of the rank object
        stepNo: record.incrementStep,
        salary: record.salary,
      }));

      console.log("Pay Grade Payload:", payGradPayload);

      try {
        const response = await fetch(
          "http://localhost:8080/api/hr-pay-grad/bulk-save",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payGradPayload),
          }
        );

        if (!response.ok) {
          const error = await response.text();
          toast.error(
            "Error saving pay grades. Check console for more details."
          );
          console.error("Error saving pay grades: " + error);
          return;
        }
      } catch (error) {
        console.error("Error saving pay grades:", error);
        toast.error("Error saving pay grades. Check console for more details.");
      }

      // Reset form
      setRecords([]);
      setClassDropdown("");
      setIcfDropdown("");
      setBeginningSalary("");
      setMaxSalary("");
      toast.success("Records saved successfully.");
    } catch (error) {
      toast.error("An error occurred while saving.");
      console.error(error);
    }
  };
  return (
    <div className="p-6">
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Pay Grade</h2>
      <div className="space-y-4">
        {/* Class Dropdown */}
        <div className="flex items-center gap-4">
          <label className="w-40 text-right">Class:</label>
          <select
            value={classDropdown}
            onChange={(e) => setClassDropdown(e.target.value)}
            className="flex-1 p-2 border rounded-md w-full"
          >
            <option value="">--Select One--</option>
            {classOptions.map((classOption) => (
              <option key={classOption.id} value={classOption.id}>
                {classOption.grade}
              </option>
            ))}
          </select>
        </div>

        {/* ICF Dropdown */}
        <div className="flex items-center gap-4">
          <label className="w-40 text-right">ICF:</label>
          <select
            value={icfDropdown}
            onChange={(e) => setIcfDropdown(e.target.value)}
            className="flex-1 p-2 border rounded-md w-full"
          >
            <option value="">--Select One--</option>
            {icfOptions.map((icfOption) => (
              <option key={icfOption.id} value={icfOption.id}>
                {icfOption.ICF}
              </option>
            ))}
          </select>
        </div>

        {/* Beginning Salary */}
        <div className="flex items-center gap-4">
          <label className="w-40 text-right">Beginning Salary:</label>
          <input
            type="number"
            value={beginningSalary}
            onChange={(e) => setBeginningSalary(e.target.value)}
            className="flex-1 p-2 border rounded-md w-full"
            placeholder="Beginning Salary"
          />
        </div>

        {/* Max Salary */}
        <div className="flex items-center gap-4 mb-6">
          <label className="w-40 text-right">Max Salary:</label>
          <input
            type="number"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
            className="flex-1 p-2 border rounded-md w-full"
            placeholder="Max Salary"
          />
        </div>

        {/* Add Detail Button */}
        <div className="flex justify-center">
          <button
            onClick={addDetail}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add Detail
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white border border-gray-200 mt-8">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 border-b text-left">S/N</th>
            <th className="px-6 py-3 border-b text-left">Increment Step</th>
            <th className="px-6 py-3 border-b text-left">Salary</th>
            <th className="px-6 py-3 border-b text-left">Option</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 border-b">{index + 1}</td>
              <td className="px-6 py-4 border-b">{record.incrementStep}</td>
              <td className="px-6 py-4 border-b">{record.salary}</td>
              <td className="px-6 py-4 border-b">
                <button
                  onClick={() => editDetail(record)}
                  className="text-blue-600 hover:underline mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteDetail(record.id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center text-gray-400 py-6">
                No records added yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Save Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={saveDetails}
          className={`${
            isEditing ? "bg-blue-500" : "bg-blue-500"
          } text-white px-4 py-2 rounded-md`}
        >
          {isEditing ? "Update" : "Save"}
        </button>
      </div>

      {/* Pop-up Form */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-w-[90%] relative border border-gray-800">
            {/* Close Button */}
            <button
              onClick={() => setIsPopupOpen(false)}
              className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-600">
              {editRecordId ? "Edit Pay Grade" : "Add Pay Grade"}
            </h2>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Increment Step */}
              <div className="flex items-center gap-4">
                <label className="w-40 text-right text-gray-600">
                  Increment Step:
                </label>
                <input
                  type="text"
                  value={incrementStep}
                  onChange={(e) => setIncrementStep(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder=" "
                />
              </div>

              {/* Salary */}
              <div className="flex items-center gap-4">
                <label className="w-40 text-right text-gray-600">Salary:</label>
                <input
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder=" "
                />
              </div>

              {/* Add/Update Button */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={addIncrementStepAndSalary}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
                >
                  {editRecordId ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalarySettings;
