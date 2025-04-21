"use client";

import { useState, useEffect } from "react";
import { fetchJobGrades } from "../pages/api/jobGradeService";
import { fetchICFs } from "../pages/api/icfService";

interface Record {
  id: number;
  class: string;
  icf: string;
  beginningSalary: string;
  maxSalary: string;
}
interface ClassOption {
  id: number;
  grade: string; // For Class
}

interface IcfOption {
  id: number;
  ICF: string; // For ICF
}

const SalarySettings = () => {
  const [classDropdown, setClassDropdown] = useState<string>("");
  const [icfDropdown, setIcfDropdown] = useState<string>("");
  const [beginningSalary, setBeginningSalary] = useState<string>("");
  const [maxSalary, setMaxSalary] = useState<string>("");
  const [records, setRecords] = useState<Record[]>([]);
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
  const [icfOptions, setIcfOptions] = useState<IcfOption[]>([]);

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
        console.error("Error fetching Class and ICF data:", error);
      }
    };

    fetchClassAndICFData();
  }, []);

  const addDetail = () => {
    if (classDropdown && icfDropdown && beginningSalary && maxSalary) {
      const newRecord: Record = {
        id: Date.now(),
        class: classDropdown,
        icf: icfDropdown,
        beginningSalary: beginningSalary,
        maxSalary: maxSalary,
      };
      setRecords([...records, newRecord]);
      setClassDropdown("");
      setIcfDropdown("");
      setBeginningSalary("");
      setMaxSalary("");
    } else {
      alert("Please fill all fields before adding a detail.");
    }
  };

  const removeRecord = (id: number) => {
    setRecords(records.filter((record) => record.id !== id));
  };

  const saveDetails = async () => {
    if (records.length === 0) {
      alert("No records to save.");
      return;
    }

    try {
      const payload = records.map((record) => ({
        beginning: record.beginningSalary,
        maxSalary: record.maxSalary,
        jobGrade: { id: parseInt(record.class) },
        icf: { id: parseInt(record.icf) },
      }));

      console.log("Payload being sent to the backend:", payload);

      const response = await fetch(
        "http://localhost:8080/api/hr-rank/bulk-save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Saved successfully:", data);
        alert("Records saved successfully!");
        setRecords([]);
      } else {
        const error = await response.text();
        console.error("Error saving records:", error);
        alert("Error saving records: " + error);
      }
    } catch (error) {
      console.error("Error saving records:", error);
      alert("An error occurred while saving records.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pay Grade</h2>
      <div className="space-y-4">
        {/* Class Field */}
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

        {/* ICF Field */}
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

        {/* Beginning Salary Field */}
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

        {/* Max Salary Field */}
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

      <table className="min-w-full bg-white border border-gray-200 mt-8">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 border-b text-left">S/N</th>
            <th className="px-6 py-3 border-b text-left">Class</th>
            <th className="px-6 py-3 border-b text-left">ICF</th>
            <th className="px-6 py-3 border-b text-left">Salary</th>
            <th className="px-6 py-3 border-b text-left">Option</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 border-b">{index + 1}</td>
              <td className="px-6 py-4 border-b">
                {
                  classOptions.find(
                    (option) => option.id === parseInt(record.class)
                  )?.grade
                }
              </td>
              <td className="px-6 py-4 border-b">
                {
                  icfOptions.find(
                    (option) => option.id === parseInt(record.icf)
                  )?.ICF
                }
              </td>
              <td className="px-6 py-4 border-b">
                {record.beginningSalary} - {record.maxSalary}
              </td>
              <td className="px-6 py-4 border-b">
                <button
                  onClick={() => removeRecord(record.id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center text-gray-400 py-6">
                No records added yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button
          onClick={saveDetails}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default SalarySettings;
