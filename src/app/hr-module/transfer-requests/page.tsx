"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";
import AppModuleLayout from "../../components/AppModuleLayout";
import DepartmentTree from "../../components/DepartmentTree";

type TransferType = "To Department" | "From Department" | "";

function TransferRequest() {
  const [employeeName, setEmployeeName] = useState("");
  const [gender, setGender] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [hiredDate, setHiredDate] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [icf, seticf] = useState("");
  const [directorate, setDirectorate] = useState("");
  const [transferType, setTransferType] = useState<TransferType>("");
  const [toDepartment, setToDepartment] = useState("");
  const [fromDepartment, setFromDepartment] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const [requestDate, setRequestDate] = useState("2017-09-15");
  const [selectedRequest, setSelectedRequest] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showDepartmentTreeModal, setShowDepartmentTreeModal] = useState(false);
  const [departments, setDepartments] = useState<
    { deptId: number; deptName: string }[]
  >([]);
  const [branch, setBranch] = useState<{ id: number; branchName: string }[]>(
    []
  );
  const [departmentFieldBeingEdited, setDepartmentFieldBeingEdited] = useState<
    "to" | "from" | "main" | null
  >(null);
  const [jobPositionId, setJobPositionId] = useState("");
  const [fromDepartmentId, setFromDepartmentId] = useState("");
  const [toDepartmentId, setToDepartmentId] = useState("");
  const [payGradeId, setPayGradeId] = useState("");
  const [jobResponsibilityId, setJobResponsibilityId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [jobCodeId, setJobCodeId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      employeeName,
      gender,
      hiredDate,
      empId: employeeId,
      icf,
      description: transferReason,
      dateRequest: requestDate,
      transferType,
    };
    if (jobPositionId) payload.jobPositionId = jobPositionId;
    if (fromDepartmentId) payload.transferFromId = fromDepartmentId;
    if (toDepartmentId) payload.transferToId = toDepartmentId;
    if (payGradeId) payload.payGradeId = payGradeId;
    if (jobResponsibilityId) payload.jobResponsibilityId = jobResponsibilityId;
    if (branchId) payload.branchId = branchId;
    if (jobCodeId) payload.jobCodeId = jobCodeId;

    console.log("Submitting payload:", payload); 

    fetch("http://localhost:8080/api/hr-transfer-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save transfer request");
        return res.json();
      })
      .then(() => toast.success("Transfer request submitted successfully!"))
      .catch(() => toast.error("Failed to submit transfer request"));
  };
  useEffect(() => {
    fetch("http://localhost:8080/api/departments")
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data);
      })
      .catch((err) => console.error("Failed to fetch departments", err));
  }, []);

  // Fetch employee info when employeeId changes
  useEffect(() => {
    if (employeeId.trim() !== "") {
      fetch(`http://localhost:8080/api/employees/${employeeId}/info`)
        .then((res) => {
          if (!res.ok) throw new Error("Employee not found");
          return res.json();
        })
        .then((data) => {
          setEmployeeName(data.employeeName || "");
          setGender(data.gender || "");
          setHiredDate(data.hiredDate || "");
          seticf(data.icf || "");
          setDepartment(data.departmentName || "");
          setFromDepartment(data.departmentName || "");
          setJobPosition(data.jobPosition || "");
          setDirectorate(data.directorateName || "");
          setJobPositionId(data.jobPositionId || ""); 
          setFromDepartmentId(data.fromDepartmentId || ""); 
          setPayGradeId(data.payGradeId || "");
          setJobResponsibilityId(data.jobResponsibilityId || "");
          setBranchId(data.branchId || "");
          setJobCodeId(data.jobCode || ""); 

          console.log("Fetched employee info:", {
            employeeName: data.employeeName,
            jobCode: data.jobCode,
            branch: data.branch,
            jobResponsibility: data.jobResponsibility,
            payGradeId: data.payGradeId,
            departmentName: data.departmentName,
            jobPosition: data.jobPosition,
            directorateName: data.directorateName,
            fromDepartmentId: data.fromDepartmentId, 
          });
        })
        .catch(() => {
          setEmployeeName("");
          setGender("");
          setHiredDate("");
          seticf("");
          setDepartment("");
          setFromDepartment("");
          setJobPosition("");
          setDirectorate("");
          setJobPositionId("");
          setFromDepartmentId("");
          setPayGradeId("");
          setJobResponsibilityId("");
          setBranchId("");
          setJobCodeId("");
        });
    } else {
      setEmployeeName("");
      setGender("");
      setHiredDate("");
      seticf("");
      setDepartment("");
      setFromDepartment("");
      setJobPosition("");
      setDirectorate("");
      setJobPositionId("");
      setFromDepartmentId("");
      setPayGradeId("");
      setJobResponsibilityId("");
      setBranchId("");
      setJobCodeId("");
    }
  }, [employeeId]);

  const handleSelectDepartment = (deptId: number) => {
    if (departmentFieldBeingEdited === "to") {
      const dept = departments.find((d) => d.deptId === deptId);
      setToDepartment(dept ? dept.deptName : "");
      setToDepartmentId(dept ? dept.deptId.toString() : "");
      setShowDepartmentTreeModal(false);
      setDepartmentFieldBeingEdited(null);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Employee Transfer Request</title>
        <meta name="description" content="Employee transfer request form" />
      </Head>
      <Toaster />
      <div className="w-full p-0 ">
        <div className="bg-white shadow rounded-lg p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Search Requester Info:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="flex flex-row items-center gap-2">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap">
                  Update Request
                </label>
                <select
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={selectedRequest}
                  onChange={(e) => setSelectedRequest(e.target.value)}
                >
                  <option value="">--Select One--</option>
                  <option value="request1">Request 1</option>
                  <option value="request2">Request 2</option>
                  <option value="request3">Request 3</option>
                </select>
              </div>
            </div>
            <div>
              <div className="flex flex-row items-center gap-2">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap">
                  View Request Status
                </label>
                <select
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="">--Select One--</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-6 w-full"
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Transfer Request:
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex flex-row items-center gap-2 justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Employee Name
                </label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-row items-center gap-2 justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Gender
                </label>
                <input
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  readOnly
                />
              </div>
              <div className="flex flex-row items-center gap-2 justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Job Position
                </label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                  readOnly
                />
              </div>
              <div className="flex flex-row items-center gap-2 justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Hired Date
                </label>
                <input
                  type="date"
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={hiredDate}
                  onChange={(e) => setHiredDate(e.target.value)}
                />
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex flex-row items-center gap-2 justify-end">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Employee ID
                </label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-row items-center gap-2 justify-end">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Department
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder=""
                    readOnly
                  />
                </div>
              </div>
              <div className="flex flex-row items-center gap-2 justify-end">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  ICF
                </label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md focus:outline-none p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={icf}
                  onChange={(e) => seticf(e.target.value)}
                />
              </div>
              <div className="flex flex-row items-center gap-2 justify-end">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Directorate
                </label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={directorate}
                  onChange={(e) => setDirectorate(e.target.value)}
                  readOnly
                />
              </div>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Request Detail:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex flex-row items-center gap-2 justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Transfer Type
                </label>
                <select
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={transferType}
                  onChange={(e) =>
                    setTransferType(e.target.value as TransferType)
                  }
                  required
                >
                  <option value="">--Select one--</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Direct Transfer">Direct Transfer</option>
                </select>
              </div>

              <div className="flex flex-row items-center gap-2 justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  To Department
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                    value={toDepartment}
                    readOnly
                    placeholder=""
                    onClick={() => {
                      setDepartmentFieldBeingEdited("to");
                      setShowDepartmentTreeModal(true);
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-row items-center gap-2 justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Transfer Reason
                </label>
                <textarea
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 resize-y min-h-[40px] max-h-[200px]"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex flex-row items-center gap-2 justify-end">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  From Department
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                    value={fromDepartment}
                    onChange={(e) => setFromDepartment(e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>
              <div className="flex flex-row items-center gap-2 justify-end">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Request Date
                </label>
                <input
                  type="date"
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-start">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
      {/* To Department modal*/}
      {showDepartmentTreeModal && departmentFieldBeingEdited === "to" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                {departments.find((d) => d.deptId === 61)?.deptName ||
                  "All Departments"}
              </h2>
              <button
                className="text-gray-700 hover:text-gray-800 text-2xl"
                onClick={() => {
                  setShowDepartmentTreeModal(false);
                  setDepartmentFieldBeingEdited(null);
                }}
              >
                ✕
              </button>
            </div>
            <div className="flex-grow overflow-y-auto">
              <DepartmentTree
                dept={{
                  deptId: 61,
                  deptName:
                    departments.find((d) => d.deptId === 61)?.deptName ||
                    "All Departments",
                  deptLevel: 0,
                  parentDeptId: null,
                }}
                onSelect={handleSelectDepartment}
              />`
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TransferRequestPage() {
  return (
    <AppModuleLayout>
      <TransferRequest />
    </AppModuleLayout>
  );
}
