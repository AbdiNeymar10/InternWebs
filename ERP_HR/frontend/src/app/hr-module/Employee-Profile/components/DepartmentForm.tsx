"use client";
import { useState, useEffect } from "react";
import { DepartmentDto } from "../types/department";
import {
  createDepartment,
  updateDepartment,
  getDepartments,
} from "../services/departmentService";

const DepartmentForm = ({
  dept,
  onClose,
  onSave,
}: {
  dept: DepartmentDto | null;
  onClose: () => void;
  onSave: () => void;
}) => {
  const [deptName, setDeptName] = useState("");
  const [parentDeptId, setParentDeptId] = useState<number | null>(null);
  const [allDepartments, setAllDepartments] = useState<DepartmentDto[]>([]);
  const [estDate, setEstDate] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [fax, setFax] = useState("");
  const [tele1, setTele1] = useState("");
  const [tele2, setTele2] = useState("");
  const [pobox, setPobox] = useState("");
  const [deptLevel, setDeptLevel] = useState(0);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "";
  }>({
    text: "",
    type: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await getDepartments();
        setAllDepartments(data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (dept) {
      setDeptName(dept.deptName);
      setParentDeptId(dept.parentDeptId || null);
      setEstDate(dept.estDate || "");
      setMission(dept.mission || "");
      setVision(dept.vision || "");
      setStatus(dept.status === "1" ? "Active" : "Inactive");
      setEmail(dept.email || "");
      setTele1(dept.tele1 || "");
      setTele2(dept.tele2 || "");
      setDeptLevel(dept.deptLevel || 0);
      setPobox(dept.poBox || "");
      if ("fax" in dept) setFax((dept as any).fax || "");
    }
  }, [dept]);

  // When the parent department changes, update the deptLevel
  useEffect(() => {
    if (parentDeptId) {
      const parentDepartment = allDepartments.find(
        (department) => department.deptId === parentDeptId
      );
      if (parentDepartment && typeof parentDepartment.deptLevel === "number") {
        setDeptLevel(parentDepartment.deptLevel + 1);
      } else {
        setDeptLevel(0);
      }
    } else {
      setDeptLevel(0);
    }
  }, [parentDeptId, allDepartments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const statusValue = status === "Active" ? "1" : "0";

    const updatedDept: DepartmentDto = {
      deptId: dept?.deptId || 0,
      deptName,
      parentDeptId,
      estDate,
      mission,
      vision,
      status: statusValue,
      email,
      tele1,
      tele2,
      poBox: pobox,
      deptLevel,
      // Only include fax if it exists in DepartmentDto
      ...(typeof fax !== "undefined" ? { fax } : {}),
    };

    try {
      if (dept) {
        await updateDepartment(updatedDept);
        setMessage({
          text: "Department updated successfully!",
          type: "success",
        });
      } else {
        await createDepartment(updatedDept);
        setMessage({
          text: "Department created successfully!",
          type: "success",
        });
      }

      setTimeout(() => {
        onSave();
        setMessage({ text: "", type: "" });
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error saving department:", err);
      setMessage({
        text: "Failed to save department. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-content bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {dept ? "Edit Department" : "Add New Department"}
        </h2>

        {message.text && (
          <div
            className={`mb-4 p-2 text-center ${
              message.type === "success"
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            } rounded`}
          >
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[80vh] overflow-y-auto"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department Name
            </label>
            <input
              type="text"
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Establishment Date
            </label>
            <input
              type="date"
              value={estDate}
              onChange={(e) => setEstDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mission
            </label>
            <input
              type="text"
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vision
            </label>
            <input
              type="text"
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fax
            </label>
            <input
              type="text"
              value={fax}
              onChange={(e) => setFax(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Telephone 1
            </label>
            <input
              type="text"
              value={tele1}
              onChange={(e) => setTele1(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Telephone 2
            </label>
            <input
              type="text"
              value={tele2}
              onChange={(e) => setTele2(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              P.O. Box
            </label>
            <input
              type="text"
              value={pobox}
              onChange={(e) => setPobox(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Parent Department
            </label>
            <select
              value={parentDeptId || ""}
              onChange={(e) => setParentDeptId(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Parent Department</option>
              {allDepartments.map((department) => (
                <option key={department.deptId} value={department.deptId}>
                  {department.deptName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department Level
            </label>
            <input
              type="number"
              value={deptLevel}
              onChange={(e) => setDeptLevel(Number(e.target.value))}
              className="w-full p-2 border rounded"
              min="0"
              readOnly // Optional, remove if you want users to manually set deptLevel
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;
