"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";
import AppModuleLayout from "../../components/AppModuleLayout";
import DepartmentTree from "../../components/DepartmentTree";

type TransferType = "To Department" | "From Department" | "";

function HrPromotionApprove() {
  const [employeeName, setEmployeeName] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [hiredDate, setHiredDate] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [icf, seticf] = useState("");
  const [transferType, setTransferType] = useState<TransferType>("");
  const [toDepartment, setToDepartment] = useState("");
  const [fromDepartment, setFromDepartment] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const [requestDate, setRequestDate] = useState("2017-09-15");
  const [selectedRequest, setSelectedRequest] = useState("");
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
  const [transferRequests, setTransferRequests] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [approverDecision, setApproverDecision] = useState("");
  const [incrementStep, setIncrementStep] = useState("");
  const [branch, setBranch] = useState("");
  const [remark, setRemark] = useState("");
  const [progressBy, setProgressBy] = useState("Abdi Tolesa");
  const [loading, setLoading] = useState(true);
  const [currentSalary, setCurrentSalary] = useState("");
  const [jobClass, setJobClass] = useState("");
  const [startDate, setStartDate] = useState("");
  const [requestFrom, setRequestFrom] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const clearForm = () => {
    setEmployeeName("");
    setJobPosition("");
    setHiredDate("");
    setEmployeeId("");
    seticf("");
    setTransferType("");
    setToDepartment("");
    setFromDepartment("");
    setTransferReason("");
    setRequestDate("2017-09-15");
    setSelectedRequest("");
    setJobPositionId("");
    setFromDepartmentId("");
    setToDepartmentId("");
    setPayGradeId("");
    setJobResponsibilityId("");
    setBranchId("");
    setJobCodeId("");
    setSearchValue("");
    setApproverDecision("");
    setRemark("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      hiredDate,
      empId: employeeId,
      description: transferReason,
      dateRequest: requestDate,
      transferType,
      approverDecision,
      remark,
      progressBy,
    };
    if (jobPositionId) payload.jobPositionId = jobPositionId;
    if (fromDepartmentId) payload.transferFromId = fromDepartmentId;
    if (toDepartmentId) payload.transferToId = toDepartmentId;
    if (payGradeId) payload.payGradeId = payGradeId;
    if (jobResponsibilityId) payload.jobResponsibilityId = jobResponsibilityId;
    if (branchId) payload.branchId = branchId;
    if (jobCodeId) payload.jobCodeId = jobCodeId;

    // If updating an existing request
    if (selectedRequest) {
      fetch(
        `http://localhost:8080/api/hr-transfer-requests/${selectedRequest}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            transferRequesterId: selectedRequest,
            transferType,
            dateRequest: requestDate,
            description: transferReason,
            transferTo: { deptId: toDepartmentId },
            approvedBy: "Abdi Tolesa",
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
          setHiredDate(data.hiredDate || "");
          setFromDepartment(data.departmentName || "");
          setJobPosition(data.jobPosition || "");
          setJobPositionId(data.jobPositionId || "");
          setFromDepartmentId(data.fromDepartmentId || "");
          setPayGradeId(data.payGradeId || "");
          setJobResponsibilityId(data.jobResponsibilityId || "");
          setBranchId(data.branchId || "");
          setJobCodeId(data.jobCode || "");
          setCurrentSalary(data.currentSalary || "");

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
          setHiredDate("");
          seticf("");
          setFromDepartment("");
          setJobPosition("");
          setJobPositionId("");
          setFromDepartmentId("");
          setPayGradeId("");
          setJobResponsibilityId("");
          setBranchId("");
          setJobCodeId("");
        });
    } else {
      setEmployeeName("");
      setHiredDate("");
      seticf("");
      setFromDepartment("");
      setJobPosition("");
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
        const filtered = data.filter((req: any) => {
          if (req.status === undefined || req.status === null) return false;
          return req.status === "1" || req.status === 1;
        });
        setTransferRequests(filtered);
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
        (r) => r.transferRequesterId.toString() === selectedRequest
      );
      if (req && req.employee) {
        setEmployeeId(req.employee.empId || "");
        setEmployeeName(
          [
            req.employee.firstName,
            req.employee.middleName,
            req.employee.lastName,
          ]
            .filter(Boolean)
            .join(" ")
        );
        setHiredDate(req.employee.hiredDate || "");
        seticf(req.employee.icf?.icfName || "");
        setFromDepartment(req.employee.department?.depName || "");
        setJobPosition(
          req.employee.jobTypeDetail?.jobType?.jobTitle?.jobTitle || ""
        );
        setJobPositionId(req.employee.jobTypeDetail?.id?.toString() || "");
        setFromDepartmentId(req.employee.department?.deptId?.toString() || "");
        setPayGradeId(req.employee.payGrade?.payGradeId?.toString() || "");
        setJobResponsibilityId(
          req.employee.jobResponsibility?.id?.toString() || ""
        );
        setBranchId(req.employee.branch?.id?.toString() || "");
        setJobCodeId(req.employee.jobTypeDetail?.jobType?.id?.toString() || "");
        setTransferType(req.transferType || "");
        setToDepartment(req.transferTo?.depName || "");
        setToDepartmentId(req.transferTo?.deptId?.toString() || "");
        setTransferReason(req.description || "");
        setRequestDate(req.dateRequest || "");
        setRemark(req.remark || "");
        setApproverDecision(req.status || "");
      } else if (req) {
        setTransferType(req.transferType || "");
        setRemark(req.remark || "");
        setApproverDecision(req.status || "");
        setCurrentSalary(req.currentSalary || "");
      }
    }
  }, [selectedRequest, transferRequests]);

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
        {/* <title>Approve Dept From</title> */}
        <meta name="description" content="Approve dept from form" />
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
                            .filter((req) => {
                              const empId =
                                req.employee?.empId?.toString() || "";
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
                                empName.includes(
                                  searchValue.trim().toLowerCase()
                                )
                              );
                            })
                            .map((req) => {
                              const empId = req.employee?.empId || "N/A";
                              const fullName =
                                [
                                  req.employee?.firstName,
                                  req.employee?.middleName,
                                  req.employee?.lastName,
                                ]
                                  .filter(Boolean)
                                  .join(" ") || "";

                              return (
                                <li
                                  key={req.transferRequesterId}
                                  className={`p-2 hover:bg-gray-200 cursor-pointer ${
                                    selectedRequest ===
                                    req.transferRequesterId.toString()
                                      ? "bg-blue-100"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedRequest(
                                      req.transferRequesterId.toString()
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
                            const empId = req.employee?.empId?.toString() || "";
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
            Transfer Request Information:
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
                  Job Title:
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
              <div className="flex flex-row items-center gap-2 justify-end">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Department From:
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                    value={fromDepartment}
                    onChange={(e) => setFromDepartment(e.target.value)}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex flex-row items-center gap-2 justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Transfer Reason
                </label>
                <textarea
                  className="flex-1 border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 resize-y min-h-[40px] max-h-[200px]"
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
              <div className="flex flex-row items-center gap-2 justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Start Date
                </label>
                <input
                  type="date"
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex flex-row items-center gap-2 justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Department To:
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

              <div className="flex flex-row items-center gap-2 justify-end">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Increment Step
                </label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md focus:outline-none p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={incrementStep}
                  onChange={(e) => setIncrementStep(e.target.value)}
                  readOnly
                />
              </div>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Assigned Employee To:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex flex-row items-center gap-2 justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Job Title:
                </label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                  readOnly
                />
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
              <div className="flex flex-row items-center gap-2 justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Salary
                </label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(e.target.value)}
                  required
                  readOnly
                />
              </div>
              <div className="flex flex-row items-center gap-2 justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Request From:
                </label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={requestFrom}
                  onChange={(e) => setRequestFrom(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-4"></div>
            </div>
            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex flex-row items-center gap-2 justify-start mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Job Class
                </label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={jobClass}
                  onChange={(e) => setJobClass(e.target.value)}
                  readOnly
                />
              </div>
              <div className="flex flex-row items-center gap-2 justify-end">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Increment Step
                </label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md focus:outline-none p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={incrementStep}
                  onChange={(e) => setIncrementStep(e.target.value)}
                  readOnly
                />
              </div>
              <div className="flex flex-row items-center gap-2 justify-end">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Branch
                </label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md focus:outline-none p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  readOnly
                />
              </div>
              <div className="flex flex-row items-center gap-2 justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Request From:
                </label>
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300"
                  value={requestFrom}
                  onChange={(e) => setRequestFrom(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-start">
            {selectedRequest ? (
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Change Profile
              </button>
            ) : (
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Save
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
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HrPromotionApprovePage() {
  return (
    <AppModuleLayout>
      <HrPromotionApprove />
    </AppModuleLayout>
  );
}
