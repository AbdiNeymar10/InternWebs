"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";
import AppModuleLayout from "../../components/AppModuleLayout";

type TransferType = "To Department" | "From Department" | "";

function HrApprove() {
  const [employeeName, setEmployeeName] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [hiredDate, setHiredDate] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [icf, seticf] = useState("");
  const [transferType, setTransferType] = useState<TransferType>("");
  const [toDepartment, setToDepartment] = useState("");
  const [fromDepartment, setFromDepartment] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [selectedRequest, setSelectedRequest] = useState("");
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
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [approverDecision, setApproverDecision] = useState("");
  const [remark, setRemark] = useState("");
  const [progressBy, setProgressBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [approvedBy, setApprovedBy] = useState("");
  const [authorizedDate, setAuthorizedDate] = useState("");
  const [currentSalary, setCurrentSalary] = useState("");
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
    setRemark("");
    setApprovedBy("");
    setCurrentSalary("");
    setAuthorizedDate("");
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
      authorizedDate,
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

    console.log("Submitting payload:", payload);
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
            // approvedBy: "Abdi Tolesa",
          }),
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error("Failed to update transfer request");
          return res.json();
        })
        .then(() => {
          if (employeeId && toDepartmentId) {
            fetch(
              `http://localhost:8080/api/employees/${employeeId}/department`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ toDepartmentId }),
              }
            )
              .then((res) => {
                if (!res.ok)
                  throw new Error("Failed to update employee department");
                toast.success("Hr request approved successfully!");
                clearForm();
              })
              .catch(() => toast.error("Failed to update employee request"));
          } else {
            clearForm();
          }
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
          setApprovedBy(data.approvedBy || "");
          setToDepartmentId(data.toDepartmentId ?? "");
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
                  approvedBy: data.approvedBy,
                  currentSalary: data.currentSalary,
                  toDepartmentId: data.toDepartmentId ?? "",
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
          setToDepartmentId("");
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
      setToDepartmentId("");
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
          return req.status === "2" || req.status === 2;
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
      console.log("Fetched transfer requests reqqqq:", req);
      if (req) {
        setEmployeeId(req.empId || "");
        setEmployeeName(req.employeeName || "");
        setHiredDate(req.hiredDate || "");
        seticf(req.icf || "");
        setFromDepartment(req.departmentName || "");
        setJobPosition(req.jobPosition || "");
        setJobPositionId(req.jobPositionId?.toString() || "");
        const toDeptId =
          req.toDepartmentId || req.transferToId || req.transferTo?.deptId;
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
        setApprovedBy(req.approvedBy || "");
        setCurrentSalary(req.currentSalary || "");
        setAuthorizedDate(req.authorizedDate || "");
      }
    }
  }, [selectedRequest, transferRequests, departments]);

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
        <title>Transfer Request Information:</title>
        <meta name="description" content="Approve dept from form" />
      </Head>
      <Toaster />
      <div className="w-full p-0 ">
        <div className="bg-white shadow rounded-lg p-6 mb-4">
          {/* <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Available Requests:
          </h2> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Available Requests:
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
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-6 w-full"
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Transfer Request Info:
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
                  Approved By
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={approvedBy}
                  onChange={(e) => setApprovedBy(e.target.value)}
                  readOnly
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Transfer Reason
                </label>
                <textarea
                  className="flex-1 border border-gray-300 text-xs rounded-md p-1 resize-y min-h-[40px] max-h-[200px]"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
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
                  Authorized Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={authorizedDate}
                  onChange={(e) => setAuthorizedDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Current Salary
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(e.target.value)}
                  required
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-start">
            <button
              type="submit"
              className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              Change Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function HrApprovePage() {
  return (
    <AppModuleLayout>
      <HrApprove />
    </AppModuleLayout>
  );
}
