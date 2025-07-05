"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";
import AppModuleLayout from "../../components/AppModuleLayout";

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
  const [incrementStep, setIncrementStep] = useState("");
  const [branch, setBranch] = useState("");
  const [remark, setRemark] = useState("");
  const [progressBy, setProgressBy] = useState("Abdi Tolesa");
  const [loading, setLoading] = useState(true);
  const [currentSalary, setCurrentSalary] = useState("");
  const [jobClass, setJobClass] = useState("");
  const [startDate, setStartDate] = useState("");
  const [requestFrom, setRequestFrom] = useState("");
  const [incrementSteps, setIncrementSteps] = useState<string[]>([]);
  const [selectedIncrementStep, setSelectedIncrementStep] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [branches, setBranches] = useState<
    { id: number; branchName: string }[]
  >([]);

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
    setIncrementStep("");
    setSelectedIncrementStep("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const jobUpdatePayload: any = {};
    if (jobResponsibilityId)
      jobUpdatePayload.jobResponsibilityId = Number(jobResponsibilityId);
    if (icf) jobUpdatePayload.icfId = icf;
    if (branchId) jobUpdatePayload.branchId = Number(branchId);
    if (payGradeId) jobUpdatePayload.payGradeId = Number(payGradeId);
    if (currentSalary) jobUpdatePayload.salary = currentSalary;
    const req = transferRequests.find(
      (r) =>
        (r.transferRequesterId &&
          r.transferRequesterId.toString() === selectedRequest) ||
        (r.empId && r.empId.toString() === selectedRequest)
    );
    if (req && req.employmentType) {
      jobUpdatePayload.employmentType = req.employmentType;
    }

    if (
      employeeId &&
      (jobUpdatePayload.jobResponsibilityId ||
        jobUpdatePayload.icfId ||
        jobUpdatePayload.branchId ||
        jobUpdatePayload.payGradeId ||
        jobUpdatePayload.salary ||
        jobUpdatePayload.employmentType)
    ) {
      console.log("Submitting job update fields:", {
        jobResponsibilityId: jobUpdatePayload.jobResponsibilityId,
        icfId: jobUpdatePayload.icfId,
        branchId: jobUpdatePayload.branchId,
        payGradeId: jobUpdatePayload.payGradeId,
        salary: jobUpdatePayload.salary,
        employmentType: jobUpdatePayload.employmentType,
      });
      try {
        await fetch(
          `http://localhost:8080/api/employees/${employeeId}/job-update`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jobUpdatePayload),
          }
        );
      } catch (err) {
        toast.error("Failed to update employee job info");
      }
    }

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
    if (icf) payload.icf = icf;

    //  updating an existing request
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
            status: "DirectChanged",
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
    if (employeeId.trim() !== "" && !selectedRequest) {
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
          setFromDepartment(data.departmentName || "");
          setPayGradeId(data.payGradeId || "");
          setJobResponsibilityId(data.jobResponsibilityId || "");
          setBranchId(data.branchId || "");
          setJobCodeId(data.jobCode || "");
          setCurrentSalary(data.currentSalary || "");
          setJobClass(data.jobClass || "");
          setIncrementStep(data.incrementStep || "");
          setBranch(data.branch || "");
          setStartDate(data.startDate || "");
          setRequestFrom(data.requestFrom || "");
          if (data.jobPositionId) {
            fetch(
              `http://localhost:8080/api/job-type-details/${data.jobPositionId}`
            )
              .then((res) => (res.ok ? res.json() : null))
              .then((jobTypeDetail) => {
                let jobClassValue = "";
                let jobGradeId = "";
                let jobTitle = "";
                if (
                  jobTypeDetail &&
                  jobTypeDetail.jobType &&
                  jobTypeDetail.jobType.jobGrade
                ) {
                  jobClassValue = jobTypeDetail.jobType.jobGrade.grade;
                  jobGradeId = jobTypeDetail.jobType.jobGrade.id || "";
                }
                if (Array.isArray(jobTypeDetail) && jobTypeDetail.length > 0) {
                  jobTitle =
                    jobTypeDetail[0]?.jobType?.jobTitle?.jobTitle || "";
                } else if (jobTypeDetail) {
                  jobTitle = jobTypeDetail.jobType?.jobTitle?.jobTitle || "";
                }
                setJobClass(jobClassValue);
                setJobPosition(jobTitle);
              })
              .catch((err) => {});
          } else {
            setJobPosition(data.jobPosition || "");
            setJobClass(data.jobClass || "");
          }
        })
        .catch(() => {
          setEmployeeName("");
          setHiredDate("");
          setFromDepartment("");
          setJobPosition("");
          setJobPositionId("");
          setFromDepartmentId("");
          setPayGradeId("");
          setJobResponsibilityId("");
          setBranchId("");
          setJobCodeId("");
          setCurrentSalary("");
          setJobClass("");
          setIncrementStep("");
          setBranch("");
          setStartDate("");
          setRequestFrom("");
        });
    } else if (!employeeId.trim()) {
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
      setCurrentSalary("");
      setJobClass("");
      setIncrementStep("");
      setBranch("");
      setStartDate("");
      setRequestFrom("");
    }
  }, [employeeId, selectedRequest]);

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
      console.log("Selected Transfer Request:", {
        ...req,
        employmentType: req.employmentType,
      });
      if (req) {
        setEmployeeId(req.empId || "");
        let fullName = "";
        if (req.firstName || req.middleName || req.lastName) {
          fullName = [req.firstName, req.middleName, req.lastName]
            .filter(Boolean)
            .join(" ");
        } else if (req.employeeName) {
          fullName = req.employeeName;
        } else if (req.fullName) {
          fullName = req.fullName;
        } else {
          fullName = [req.first_name, req.middle_name, req.last_name]
            .filter(Boolean)
            .join(" ");
        }
        setEmployeeName(fullName);
        setHiredDate(req.hiredDate || req.hireDate || "");
        seticf(req.icf || req.ICF || "");
        setFromDepartment(
          req.transferFromName ||
            req.fromDepartment ||
            req.transferFrom?.deptName ||
            req.fromDepartmentName
        );
        setFromDepartmentId(
          (
            req.transferFromId ||
            req.fromDepartmentId ||
            req.transferFrom?.deptId
          )?.toString() || ""
        );
        const fromDeptObj = departments.find(
          (d) =>
            d.deptId.toString() ===
            (req.transferFromId ? req.transferFromId.toString() : "")
        );
        setFromDepartment(fromDeptObj ? fromDeptObj.deptName : "");
        setJobPositionId(req.jobPositionId?.toString() || "");
        if (req.jobPositionId) {
          fetch(
            `http://localhost:8080/api/job-type-details/${req.jobPositionId}`
          )
            .then((res) => (res.ok ? res.json() : null))
            .then((jobTypeDetail) => {
              let jobTitle = "";
              if (Array.isArray(jobTypeDetail) && jobTypeDetail.length > 0) {
                jobTitle = jobTypeDetail[0]?.jobType?.jobTitle?.jobTitle || "";
              } else if (jobTypeDetail) {
                jobTitle = jobTypeDetail.jobType?.jobTitle?.jobTitle || "";
              }
              setJobPosition(jobTitle);
              let jobClassValue = "";
              if (
                jobTypeDetail &&
                jobTypeDetail.jobType &&
                jobTypeDetail.jobType.jobGrade
              ) {
                jobClassValue = jobTypeDetail.jobType.jobGrade.grade;
              }
              setJobClass(
                jobClassValue || req.jobClass || req.jobClassName || ""
              );
            })
            .catch(() => setJobPosition(""));
        } else {
          setJobPosition(req.jobPosition || req.jobTitle || "");
          setJobClass(req.jobClass || req.jobClassName || "");
        }
        setFromDepartmentId(req.fromDepartmentId?.toString() || "");
        setPayGradeId(
          req.payGradeId?.toString() ||
            (req.payGrade && req.payGrade.payGradeId
              ? req.payGrade.payGradeId.toString()
              : "")
        );
        setJobResponsibilityId(req.jobResponsibilityId?.toString() || "");
        setBranchId(req.branchId?.toString() || "");
        setJobCodeId(req.jobCodeId?.toString() || "");
        setTransferType(req.transferType || "");
        const toDeptId =
          req.toDepartmentId || req.transferToId || req.transferTo?.deptId;
        const toDeptObj = departments.find(
          (d) => d.deptId.toString() === (toDeptId ? toDeptId.toString() : "")
        );
        setToDepartment(
          toDeptObj?.deptName ||
            req.toDepartment ||
            req.transferTo?.depName ||
            req.toDepartmentName ||
            req.toDeptName ||
            req.toDept ||
            ""
        );
        setToDepartmentId((toDeptId || "").toString());
        setTransferReason(req.description || "");
        setRequestDate(req.dateRequest || req.requestDate || "");
        setRemark(req.remark || "");
        setApproverDecision(req.status || "");
        if (req.currentSalary || req.salary) {
          setCurrentSalary(req.currentSalary || req.salary || "");
        } else if (req.empId) {
          fetch(`http://localhost:8080/api/employees/${req.empId}/info`)
            .then((res) => (res.ok ? res.json() : null))
            .then((empData) => {
              if (empData && empData.currentSalary) {
                setCurrentSalary(empData.currentSalary);
              } else {
                setCurrentSalary("");
              }
            })
            .catch(() => setCurrentSalary(""));
        } else {
          setCurrentSalary("");
        }
        setBranch(req.branch || req.branchName || "");
        setStartDate(req.startDate || "");
        setRequestFrom(req.requestFrom || "");

        if (req.incrementStep) {
          setIncrementStep(req.incrementStep);
          setSelectedIncrementStep(req.incrementStep);
          setIncrementSteps((prev) => {
            if (req.incrementStep && !prev.includes(req.incrementStep)) {
              return [...prev, req.incrementStep];
            }
            return prev;
          });
        } else if (req.payGradeId) {
          fetch(`http://localhost:8080/api/hr-pay-grad/${req.payGradeId}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((payGradeData) => {
              const stepNo =
                payGradeData && payGradeData.stepNo
                  ? payGradeData.stepNo.toString()
                  : "";
              setIncrementStep(stepNo);
              setSelectedIncrementStep(stepNo);
              setIncrementSteps((prev) => {
                if (stepNo && !prev.includes(stepNo)) {
                  return [...prev, stepNo];
                }
                return prev;
              });
            })
            .catch(() => {
              setIncrementStep("");
              setSelectedIncrementStep("");
            });
        } else {
          setIncrementStep("");
          setSelectedIncrementStep("");
        }
      }
    }
  }, [selectedRequest, transferRequests, departments, branches]);

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

  useEffect(() => {
    fetch("http://localhost:8080/api/hr-pay-grad/steps")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch increment steps");
        }
        return res.json();
      })
      .then((data) => {
        const steps = Array.isArray(data) ? data.map((s) => s.toString()) : [];
        setIncrementSteps(steps);
      })
      .catch((err) => {
        setIncrementSteps([]);
        console.error("Failed to fetch increment steps", err);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/hr-lu-branch")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch branches");
        return res.json();
      })
      .then((data) => {
        setBranches(data);
      })
      .catch((err) => console.error("Failed to fetch branches", err));
  }, []);

  useEffect(() => {
    if (branchId && branches.length > 0) {
      const branchIdStr = branchId.toString();
      const foundBranch = branches.find(
        (b) => b.id?.toString() === branchIdStr
      );
      setBranch(foundBranch ? foundBranch.branchName : "");
    } else if (!branchId) {
      setBranch("");
    }
  }, [branchId, branches]);

  const approveAvailableRequestsCount = transferRequests.filter(
    (req) => req.status === "2" || req.status === 2
  ).length;

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
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Approve Available Requests:
                  <span className="ml-2 text-xs text-red-500 font-bold">
                    ({approveAvailableRequestsCount})
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
                  Job Title:
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
                  Department From:
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                    value={fromDepartment}
                    onChange={(e) => setFromDepartment(e.target.value)}
                    readOnly
                  />
                </div>
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Start Date
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Department To:
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
                  Increment Step
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={selectedIncrementStep}
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Job Title:
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Salary
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
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Request From:
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  readOnly
                />
              </div>
              <div className="space-y-4"></div>
            </div>
            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start mt-2">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Job Class
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={jobClass}
                  onChange={(e) => setJobClass(e.target.value)}
                  readOnly
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Increment Step
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={selectedIncrementStep}
                  onChange={(e) => setSelectedIncrementStep(e.target.value)}
                  readOnly
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Branch
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  readOnly
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Request From:
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
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

export default function HrPromotionApprovePage() {
  return (
    <AppModuleLayout>
      <HrPromotionApprove />
    </AppModuleLayout>
  );
}
