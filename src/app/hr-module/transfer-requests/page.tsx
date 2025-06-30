"use client";

import { useState, useEffect, useRef } from "react";
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
  const [branchFromId, setBranchFromId] = useState("");
  const [transferRequests, setTransferRequests] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const clearForm = () => {
    setEmployeeName("");
    setGender("");
    setJobPosition("");
    setHiredDate("");
    setEmployeeId("");
    setDepartment("");
    seticf("");
    setDirectorate("");
    setTransferType("");
    setToDepartment("");
    setFromDepartment("");
    setTransferReason("");
    setRequestDate("2017-09-15");
    setSelectedRequest("");
    setSelectedStatus("");
    setJobPositionId("");
    setFromDepartmentId("");
    setToDepartmentId("");
    setPayGradeId("");
    setJobResponsibilityId("");
    setBranchId("");
    setJobCodeId("");
    setSearchValue("");
    setBranchFromId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      hiredDate,
      empId: employeeId,
      description: transferReason,
      dateRequest: requestDate,
      transferType,
      status: selectedStatus,
    };
    if (jobPositionId) payload.jobPositionId = Number(jobPositionId);
    if (fromDepartmentId) payload.transferFromId = Number(fromDepartmentId);
    if (toDepartmentId) payload.transferToId = Number(toDepartmentId);
    if (payGradeId) payload.payGradeId = Number(payGradeId);
    if (jobResponsibilityId)
      payload.jobResponsibilityId = Number(jobResponsibilityId);
    if (branchId) payload.branchId = Number(branchId);
    if (jobCodeId) payload.jobCodeId = Number(jobCodeId);
    if (branchFromId) payload.branchFromId = Number(branchFromId);

    const updateId = transferRequests.find(
      (r) =>
        (r.transferRequesterId &&
          String(r.transferRequesterId) === selectedRequest) ||
        (r.empId && String(r.empId) === selectedRequest)
    )?.transferRequesterId;

    console.log("Submitting payload:", payload);

    if (selectedRequest && updateId) {
      fetch(
        `http://localhost:8080/api/hr-transfer-requests/${Number(updateId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            transferRequesterId: Number(updateId),
            transferType,
            dateRequest: requestDate,
            description: transferReason,
            transferTo: { deptId: toDepartmentId },
          }),
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error("Failed to update transfer request");
          return res.json();
        })
        .then(() => {
          toast.success("Transfer request updated successfully!");
          clearForm();
        })
        .catch(() => toast.error("Failed to update transfer request"));
    } else {
      // Create new request
      fetch("http://localhost:8080/api/hr-transfer-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to save transfer request");
          return res.json();
        })
        .then(() => {
          toast.success("Transfer request submitted successfully!");
          clearForm();
        })
        .catch(() => toast.error("Failed to submit transfer request"));
    }
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
          setDepartment(data.departmentName || "");
          setFromDepartment(data.departmentName || "");
          setJobPosition(data.jobPosition || "");
          setDirectorate(data.directorateName || "");
          setJobPositionId(data.jobPositionId || "");
          setFromDepartmentId(data.fromDepartmentId || "");
          setPayGradeId(data.payGradeId || "");
          setJobResponsibilityId(data.jobResponsibilityId || "");
          setBranchId(data.branchId ? data.branchId.toString() : "");
          setJobCodeId(data.jobCode || "");
          setBranchFromId(data.branchId ? data.branchId.toString() : "");

          if (data.jobPositionId) {
            fetch(
              `http://localhost:8080/api/job-type-details/${data.jobPositionId}`
            )
              .then((res) => (res.ok ? res.json() : null))
              .then((jobTypeDetail) => {
                const icfValue =
                  jobTypeDetail && jobTypeDetail.icf && jobTypeDetail.icf.ICF
                    ? jobTypeDetail.icf.ICF
                    : "";
                seticf(icfValue);
                // Log all fetched employee info
                console.log("Fetched employee info:", {
                  employeeName: data.employeeName,
                  gender: data.gender,
                  hiredDate: data.hiredDate,
                  departmentName: data.departmentName,
                  jobPosition: data.jobPosition,
                  directorateName: data.directorateName,
                  jobPositionId: data.jobPositionId,
                  fromDepartmentId: data.fromDepartmentId,
                  payGradeId: data.payGradeId,
                  jobResponsibilityId: data.jobResponsibilityId,
                  branchId: data.branchId,
                  branchFromId: data.branchId,
                  jobCode: data.jobCode,
                  icf: icfValue,
                });
              })
              .catch((err) => {
                seticf("");
                console.log("Error fetching ICF ", data.jobPositionId, err);
              });
          }
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

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/hr-transfer-requests"
        );
        const data = await response.json();
        setTransferRequests(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    if (selectedRequest) {
      const req = transferRequests.find(
        (r) =>
          (r.transferRequesterId &&
            String(r.transferRequesterId) === selectedRequest) ||
          (r.empId && String(r.empId) === selectedRequest)
      );
      if (req) {
        setEmployeeId(req.empId || "");
        setEmployeeName(req.employeeName || "");
        setGender(req.gender || "");
        setHiredDate(req.hiredDate || "");
        seticf(req.icf || "");
        setDepartment(req.departmentName || "");
        setFromDepartment(req.departmentName || "");
        setJobPosition(req.jobPosition || "");
        setDirectorate(req.directorateName || "");
        setJobPositionId(req.jobPositionId ? req.jobPositionId.toString() : "");
        setFromDepartmentId(
          req.transferFromId ? req.transferFromId.toString() : ""
        );
        setPayGradeId(req.payGradeId ? req.payGradeId.toString() : "");
        setJobResponsibilityId(
          req.jobResponsibilityId ? req.jobResponsibilityId.toString() : ""
        );
        setBranchId(req.branchId ? req.branchId.toString() : "");
        setJobCodeId(req.jobCodeId ? req.jobCodeId.toString() : "");
        setTransferType(req.transferType || "");
        setToDepartmentId(req.transferToId ? req.transferToId.toString() : "");
        const toDeptObj = departments.find(
          (d) =>
            d.deptId.toString() ===
            (req.transferToId ? req.transferToId.toString() : "")
        );
        setToDepartment(toDeptObj ? toDeptObj.deptName : "");
        setTransferReason(req.description || "");
        setRequestDate(req.dateRequest || "");
        setBranchFromId(req.branchId ? req.branchId.toString() : "");
        setSelectedStatus(req.status || ""); // <-- ensure status is set
      }
    }
  }, [selectedRequest, transferRequests, departments]);

  const handleSelectDepartment = (deptId: number) => {
    if (departmentFieldBeingEdited === "to") {
      const dept = departments.find((d) => d.deptId === deptId);
      setToDepartment(dept ? dept.deptName : "");
      setToDepartmentId(dept ? dept.deptId.toString() : "");
      setShowDepartmentTreeModal(false);
      setDepartmentFieldBeingEdited(null);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

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
              <div className="flex flex-row items-center gap-2 justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Update Request
                </label>
                <div className="flex-1 relative" ref={dropdownRef}>
                  <input
                    ref={inputRef}
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                    placeholder="--Select One--"
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                  />
                  {searchValue && (
                    <button
                      type="button"
                      className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
                      onClick={() => {
                        setSearchValue("");
                        setShowDropdown(false);
                      }}
                    >
                      ×
                    </button>
                  )}
                  {showDropdown && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md max-h-48 overflow-y-auto">
                      {loading ? (
                        <li className="p-2 text-gray-400">Loading...</li>
                      ) : (
                        <>
                          {transferRequests
                            .filter(
                              (req) =>
                                req.transferRequesterId != null ||
                                (req.empId && req.employeeName)
                            )
                            .filter((req) => {
                              const empId = req.empId || "";
                              const empName = req.employeeName
                                ? req.employeeName.toLowerCase()
                                : "";
                              return (
                                searchValue.trim() === "" ||
                                empId.includes(searchValue.trim()) ||
                                empName.includes(
                                  searchValue.trim().toLowerCase()
                                )
                              );
                            })
                            .map((req, idx) => {
                              const empId = req.empId || "";
                              const fullName = req.employeeName || "";
                              return (
                                <li
                                  key={
                                    req.transferRequesterId ?? empId + "-" + idx
                                  }
                                  className={`p-2 hover:bg-gray-200 cursor-pointer ${
                                    selectedRequest ===
                                    String(req.transferRequesterId ?? empId)
                                      ? "bg-blue-100"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedRequest(
                                      String(req.transferRequesterId ?? empId)
                                    );
                                    setShowDropdown(false);
                                    setSearchValue(`${empId} - ${fullName}`);
                                  }}
                                >
                                  {empId} - {fullName}
                                </li>
                              );
                            })}
                          {transferRequests.filter((req) => {
                            const empId =
                              req.employee?.empId?.toString?.() || "";
                            const empName = [
                              req.employee?.firstName,
                              req.employee?.middleName,
                              req.employee?.lastName,
                            ]
                              .filter(Boolean)
                              .join(" ")
                              .toLowerCase();
                            return (
                              searchValue.trim() === "" ||
                              empId.includes(searchValue.trim()) ||
                              empName.includes(searchValue.trim().toLowerCase())
                            );
                          }).length === 0 && (
                            <li className="p-2 text-gray-400">
                              No results found
                            </li>
                          )}
                        </>
                      )}
                    </ul>
                  )}
                </div>
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
                  readOnly
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
                  readOnly
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
                  <option value="direct transfer">direct transfer</option>
                  <option value="transfer">transfer</option>
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
                    readOnly
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
            {selectedRequest ? (
              <button
                type="submit"
                className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] shadow-lg hover:shadow-xl"
              >
                Update
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] shadow-lg hover:shadow-xl"
              >
                Create
              </button>
            )}
          </div>
        </form>
      </div>
      {/* To Department modal*/}
      {showDepartmentTreeModal && departmentFieldBeingEdited === "to" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                {departments.find((d) => d.deptId === 2)?.deptName ||
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
                  deptId: 2,
                  deptName:
                    departments.find((d) => d.deptId === 2)?.deptName ||
                    "All Departments",
                  deptLevel: 0,
                  parentDeptId: null,
                }}
                onSelect={handleSelectDepartment}
              />
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
