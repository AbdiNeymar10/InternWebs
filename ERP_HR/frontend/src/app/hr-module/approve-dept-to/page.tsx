"use client";

import { useState, useEffect, useRef } from "react";
import { authFetch } from "@/utils/authFetch";
// import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";
import AppModuleLayout from "../../components/AppModuleLayout";

type TransferType = "To Department" | "From Department" | "";

function ApproveDeptTo() {
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
  const [requestDate, setRequestDate] = useState("");
  const [selectedRequest, setSelectedRequest] = useState("");
  const [approvedLists, setApprovedLists] = useState("");
  const [approvedDate, setApprovedDate] = useState("");
  const [departments, setDepartments] = useState<
    { deptId: number; deptName: string }[]
  >([]);

  const [jobPositionId, setJobPositionId] = useState("");
  const [fromDepartmentId, setFromDepartmentId] = useState("");
  const [toDepartmentId, setToDepartmentId] = useState("");
  const [payGradeId, setPayGradeId] = useState("");
  const [jobResponsibilityId, setJobResponsibilityId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [jobCodeId, setJobCodeId] = useState("");
  const [transferRequests, setTransferRequests] = useState<any[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<any[]>([]);
  const [approvedLoading, setApprovedLoading] = useState(false);
  const [approvedDropdownFocused, setApprovedDropdownFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [approverDecision, setApproverDecision] = useState("");
  const [decision, setDecision] = useState("");
  const [checkedDate, setCheckedDate] = useState("");
  const [remark, setRemark] = useState("");
  // Remove progressBy state, will use from user object
  const [loading, setLoading] = useState(true);

  // Get logged-in user's full name from localStorage
  let loggedInFullName = "";
  if (typeof window !== "undefined") {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        loggedInFullName =
          userObj.fullName || userObj.name || userObj.email || "";
      }
    } catch {}
  }

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
    setRequestDate("");
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
    setDecision("");
    setCheckedDate("");
    setRemark("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      hiredDate,
      empId: Number(employeeId) || employeeId,
      description: transferReason,
      dateRequest: requestDate,
      approveDate: approvedDate,
      checkedDate,
      transferType,
      decision,
      remark,
      // progressBy,
    };
    if (jobPositionId) payload.jobPositionId = Number(jobPositionId);
    if (fromDepartmentId) payload.transferFromId = Number(fromDepartmentId);
    if (toDepartmentId) payload.transferToId = Number(toDepartmentId);
    if (payGradeId) payload.payGradeId = Number(payGradeId);
    if (jobResponsibilityId)
      payload.jobResponsibilityId = Number(jobResponsibilityId);
    if (branchId) payload.branchId = Number(branchId);
    if (jobCodeId) payload.jobCodeId = Number(jobCodeId);

    console.log("Submitting payload:", payload);
    // If updating an existing request
    if (selectedRequest) {
      const updateUrl = `http://localhost:8080/api/hr-transfer-requests/${selectedRequest}`;
      const updatePayload: any = {
        hiredDate,
        empId: Number(employeeId),
        description: transferReason,
        dateRequest: requestDate,
        approveDate: approvedDate,
        checkedDate,
        transferType,
        decision,
        remark,
        jobPositionId: jobPositionId ? Number(jobPositionId) : undefined,
        transferFromId: fromDepartmentId ? Number(fromDepartmentId) : undefined,
        payGradeId: payGradeId ? Number(payGradeId) : undefined,
        jobResponsibilityId: jobResponsibilityId
          ? Number(jobResponsibilityId)
          : undefined,
        branchId: branchId ? Number(branchId) : undefined,
        jobCodeId: jobCodeId ? Number(jobCodeId) : undefined,
        transferToId: toDepartmentId ? Number(toDepartmentId) : undefined,
        status: decision,
        approvedBy: loggedInFullName,
      };
      Object.keys(updatePayload).forEach((key: string) => {
        if (updatePayload[key] === undefined) {
          delete updatePayload[key];
        }
      });
      authFetch(updateUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      })
        .then((res: Response) => {
          if (!res.ok) throw new Error("Failed to update transfer request");
          return res.json();
        })
        .then(() => {
          toast.success("Transfer request saved successfully!");
          clearForm();
        })
        .catch(() => toast.error("Failed to update transfer request"));
    } else {
      // Create new request
      authFetch("http://localhost:8080/api/hr-transfer-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res: Response) => {
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
    authFetch("http://localhost:8080/api/departments")
      .then((res: Response) => res.json())
      .then((data: any) => {
        setDepartments(data);
      })
      .catch((err: any) => console.error("Failed to fetch departments", err));
  }, []);

  // Fetch employee info when employeeId changes
  useEffect(() => {
    if (employeeId.trim() !== "") {
      authFetch(`http://localhost:8080/api/employees/${employeeId}/info`)
        .then((res: Response) => {
          if (!res.ok) throw new Error("Employee not found");
          return res.json();
        })
        .then((data: any) => {
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
          setBranchId(data.branchId || "");
          setJobCodeId(data.jobCode || "");

          if (data.jobPositionId) {
            authFetch(
              `http://localhost:8080/api/job-type-details/${data.jobPositionId}`
            )
              .then((res: Response) => (res.ok ? res.json() : null))
              .then((jobTypeDetail: any) => {
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
              .catch((err: any) => {
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
        const response = await authFetch(
          "http://localhost:8080/api/hr-transfer-requests"
        );
        const data: any = await response.json();
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
        (r) =>
          (r.transferRequesterId &&
            r.transferRequesterId.toString() === selectedRequest) ||
          (r.empId && r.empId.toString() === selectedRequest)
      );
      if (req) {
        setEmployeeId(req.empId || "");
        setEmployeeName(req.employeeName || "");
        setGender(req.gender || req.employee?.sex || "");
        setHiredDate(req.hiredDate || req.employee?.hiredDate || "");
        seticf(req.icf || req.employee?.icf?.icfName || "");
        setDepartment(
          req.departmentName || req.employee?.department?.depName || ""
        );
        setFromDepartment(
          req.departmentName || req.employee?.department?.depName || ""
        );
        setJobPosition(
          req.jobPosition ||
            req.employee?.jobTypeDetail?.jobType?.jobTitle?.jobTitle ||
            ""
        );
        setDirectorate(
          req.directorateName || req.employee?.department?.directorateName || ""
        );
        setJobPositionId(
          (req.jobPositionId || req.employee?.jobTypeDetail?.id)?.toString() ||
            ""
        );
        setFromDepartmentId(
          (
            req.transferFromId || req.employee?.department?.deptId
          )?.toString() || ""
        );
        setPayGradeId(
          (req.payGradeId || req.employee?.payGrade?.payGradeId)?.toString() ||
            ""
        );
        setJobResponsibilityId(
          (
            req.jobResponsibilityId || req.employee?.jobResponsibility?.id
          )?.toString() || ""
        );
        setBranchId(
          (req.branchId || req.employee?.branch?.id)?.toString() || ""
        );
        setJobCodeId(
          (
            req.jobCodeId || req.employee?.jobTypeDetail?.jobType?.id
          )?.toString() || ""
        );
        setTransferType(req.transferType || "");
        const toDeptId = req.transferToId || req.transferTo?.deptId;
        const toDeptObj = departments.find(
          (d) => d.deptId.toString() === (toDeptId ? toDeptId.toString() : "")
        );
        setToDepartment(
          toDeptObj?.deptName ||
            req.toDepartment ||
            req.transferTo?.depName ||
            ""
        );
        setToDepartmentId((toDeptId || "").toString());
        setTransferReason(req.description || "");
        setRequestDate(req.dateRequest || "");
        setRemark(req.remark || "");
        setApproverDecision(req.status || "");
        setApprovedDate(req.approveDate || "");
      }
    }
  }, [selectedRequest, transferRequests, departments]);

  useEffect(() => {
    if (approvedLists) {
      const req = approvedRequests.find(
        (r) =>
          (r.transferRequesterId?.toString?.() || r.empId?.toString?.()) ===
          approvedLists
      );
      if (req) {
        setEmployeeId(req.empId || req.employee?.empId || "");
        setEmployeeName(
          req.employeeName ||
            (req.employee
              ? [
                  req.employee.firstName,
                  req.employee.middleName,
                  req.employee.lastName,
                ]
                  .filter(Boolean)
                  .join(" ")
              : "")
        );
        setGender(req.gender || req.employee?.sex || "");
        setHiredDate(req.hiredDate || req.employee?.hiredDate || "");
        seticf(req.icf || req.employee?.icf?.icfName || "");
        setDepartment(
          req.departmentName || req.employee?.department?.depName || ""
        );
        setFromDepartment(
          req.departmentName || req.employee?.department?.depName || ""
        );
        setJobPosition(
          req.jobPosition ||
            req.employee?.jobTypeDetail?.jobType?.jobTitle?.jobTitle ||
            ""
        );
        setDirectorate(
          req.directorateName || req.employee?.department?.directorateName || ""
        );
        setJobPositionId(
          (req.jobPositionId || req.employee?.jobTypeDetail?.id)?.toString() ||
            ""
        );
        setFromDepartmentId(
          (
            req.transferFromId || req.employee?.department?.deptId
          )?.toString() || ""
        );
        setPayGradeId(
          (req.payGradeId || req.employee?.payGrade?.payGradeId)?.toString() ||
            ""
        );
        setJobResponsibilityId(
          (
            req.jobResponsibilityId || req.employee?.jobResponsibility?.id
          )?.toString() || ""
        );
        setBranchId(
          (req.branchId || req.employee?.branch?.id)?.toString() || ""
        );
        setJobCodeId(
          (
            req.jobCodeId || req.employee?.jobTypeDetail?.jobType?.id
          )?.toString() || ""
        );
        setTransferType(req.transferType || "");
        setToDepartment(req.transferTo?.depName || "");
        setToDepartmentId(req.transferTo?.deptId?.toString() || "");
        setTransferReason(req.description || "");
        setRequestDate(req.dateRequest || "");
        setRemark(req.remark || "");
        setApproverDecision(req.status || "");
        setApprovedDate(req.approveDate || "");
        setSelectedRequest("");
      }
    }
  }, [approvedLists, approvedRequests]);

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

  const availableRequestsCount = transferRequests.filter(
    (req) => req.status === "1" || req.status === 1
  ).length;

  useEffect(() => {
    if (approvedDropdownFocused) {
      setApprovedLoading(true);
      authFetch("http://localhost:8080/api/hr-transfer-requests")
        .then((res: Response) => res.json())
        .then((data: any) => {
          const filtered = data.filter(
            (req: any) => req.status === "2" || req.status === 2
          );
          setApprovedRequests(filtered);
        })
        .catch((err: any) => {
          setApprovedRequests([]);
          console.error("Failed to fetch approved requests", err);
        })
        .finally(() => setApprovedLoading(false));
    }
  }, [approvedDropdownFocused]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Head>
        <title>Approve Dept From</title>
        <meta name="description" content="Approve dept from form" />
      </Head> */}
      <Toaster />
      <div className="w-full p-0 ">
        <div className="bg-white shadow rounded-lg p-6 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Search Requester Info:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Available Requests:
                  <span className="ml-2 text-xs text-red-500 font-bold">
                    ({availableRequestsCount})
                  </span>
                </label>
                <div className="flex-1 relative" ref={dropdownRef}>
                  <input
                    ref={inputRef}
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
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
                              const empId = req.empId?.toString?.() || "";
                              const empName = req.employeeName || "";
                              if (!empId || !empName) return false;
                              return (
                                searchValue.trim() === "" ||
                                empId.includes(searchValue.trim()) ||
                                empName
                                  .toLowerCase()
                                  .includes(searchValue.trim().toLowerCase())
                              );
                            })
                            .map((req, idx) => {
                              const empId = req.empId?.toString?.() || "";
                              const fullName = req.employeeName || "";
                              return (
                                <li
                                  key={
                                    req.transferRequesterId ?? empId + "-" + idx
                                  }
                                  className={`p-2 hover:bg-gray-200 cursor-pointer ${
                                    selectedRequest ===
                                    (req.transferRequesterId?.toString?.() ||
                                      empId)
                                      ? "bg-blue-100"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedRequest(
                                      req.transferRequesterId?.toString?.() ||
                                        empId
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
                            const empId = req.empId?.toString?.() || "";
                            const empName = req.employeeName || "";
                            if (!empId || !empName) return false;
                            return (
                              searchValue.trim() === "" ||
                              empId.includes(searchValue.trim()) ||
                              empName
                                .toLowerCase()
                                .includes(searchValue.trim().toLowerCase())
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
              <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                Approved Lists
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                value={approvedLists}
                onChange={(e) => setApprovedLists(e.target.value)}
                onFocus={() => setApprovedDropdownFocused(true)}
                onBlur={() => setApprovedDropdownFocused(false)}
                style={{ minWidth: 0 }}
              >
                <option value="">--Select One--</option>
                {approvedLoading && (
                  <option disabled value="loading">
                    Loading...
                  </option>
                )}
                {!approvedLoading &&
                  approvedRequests.map((req) => {
                    const empId = req.empId || req.employee?.empId || "N/A";
                    const fullName =
                      req.employeeName ||
                      (req.employee
                        ? [
                            req.employee.firstName,
                            req.employee.middleName,
                            req.employee.lastName,
                          ]
                            .filter(Boolean)
                            .join(" ")
                        : "");
                    if (!empId || !fullName) return null;
                    return (
                      <option
                        key={req.transferRequesterId}
                        value={req.transferRequesterId}
                      >
                        {empId} - {fullName}
                      </option>
                    );
                  })}
              </select>
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Employee Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  required
                  readOnly
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Job Position
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                  readOnly
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Hired Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={hiredDate}
                  onChange={(e) => setHiredDate(e.target.value)}
                  readOnly
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  From Department
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                    value={fromDepartment}
                    onChange={(e) => setFromDepartment(e.target.value)}
                    placeholder=""
                    readOnly
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Transfer Reason
                </label>
                <textarea
                  className="flex-1 border border-gray-300 rounded-md text-xs p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 resize-y min-h-[40px] max-h-[200px]"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  rows={2}
                  readOnly
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Approver Remark
                </label>
                <textarea
                  className="flex-1 border border-gray-300 rounded-md p-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 resize-y min-h-[40px] max-h-[200px]"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={2}
                  readOnly
                />
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Employee ID
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                  readOnly
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  ICF
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={icf}
                  onChange={(e) => seticf(e.target.value)}
                  readOnly
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Request Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                  readOnly
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  To Department
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                    value={toDepartment}
                    onChange={(e) => setToDepartment(e.target.value)}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Approved Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={approvedDate}
                  onChange={(e) => setApprovedDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Approver Decision
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={approverDecision}
                  onChange={(e) => setApproverDecision(e.target.value)}
                  required
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-4"></div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Decision
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  required
                >
                  <option value="">--Select One--</option>
                  <option value="2">Approve</option>
                  <option value="-1">Reject</option>
                </select>
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-4">
              {/* <div className="h-2" /> */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Checked Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={checkedDate}
                  onChange={(e) => setCheckedDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-4">
              <div className="h-4" />
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start mt-2">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Processed by:
                </label>
                <span className="text-gray-800 font-semibold">
                  {loggedInFullName || "-"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-start">
            <button
              type="submit"
              className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ApproveDeptToPage() {
  return (
    <AppModuleLayout>
      <ApproveDeptTo />
    </AppModuleLayout>
  );
}
