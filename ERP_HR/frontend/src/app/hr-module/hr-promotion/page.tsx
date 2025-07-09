"use client";

import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import toast, { Toaster } from "react-hot-toast";
import AppModuleLayout from "../../components/AppModuleLayout";
import DepartmentTree from "../../components/DepartmentTree";
import { fetchICFs } from "../../pages/api/icfService";

type TransferType = "To Department" | "From Department" | "";

function HrPromotion() {
  const [employeeName, setEmployeeName] = useState("");
  const [gender, setGender] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [hiredDate, setHiredDate] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [icf, seticf] = useState("");
  const [icfDropdown, setIcfDropdown] = useState("");
  const [directorate, setDirectorate] = useState("");
  const [transferType, setTransferType] = useState<TransferType>("");
  const [toDepartment, setToDepartment] = useState("");
  const [fromDepartment, setFromDepartment] = useState("");
  const [transferReason, setTransferReason] = useState("");
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
  const [branchFromId, setBranchFromId] = useState("");
  const [jobCodeId, setJobCodeId] = useState("");
  const [transferRequests, setTransferRequests] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [incrementStep, setIncrementStep] = useState("");
  const [selectedIncrementStep, setSelectedIncrementStep] = useState("");
  const [division, setDivision] = useState("");
  const [branch, setBranch] = useState("");
  const [jobResponsibility, setJobResponsibility] = useState("");
  const [refNo, setRefNo] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [progressBy, setProgressBy] = useState("Abdi Tolesa");
  const [loading, setLoading] = useState(true);
  const [branchNameTo, setBranchNameTo] = useState("");
  const [currentSalary, setCurrentSalary] = useState("");
  const [jobClass, setJobClass] = useState("");
  const [changeTo, setChangeTo] = useState("");
  const [prevSalary, setPrevSalary] = useState("");
  const [originalSalary, setOriginalSalary] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [jobResponsibilities, setJobResponsibilities] = useState<
    {
      id: string;
      responsibility: string;
    }[]
  >([]);
  const [branches, setBranches] = useState<
    { id: number; branchName: string }[]
  >([]);
  const [jobTitles, setJobTitles] = useState<
    { id: number; jobTitle: string }[]
  >([]);
  const [incrementSteps, setIncrementSteps] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [empId, setEmpId] = useState("");
  const [icfList, setIcfList] = useState<string[]>([]);
  const employeeInfoRef = useRef<any>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [employmentTypes, setEmploymentTypes] = useState<
    { id: number; type: string }[]
  >([]);
  const [stepNoToPayGradeId, setStepNoToPayGradeId] = useState<{
    [step: string]: number;
  }>({});

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
    setDateFrom("");
    setSelectedRequest("");
    setJobPositionId("");
    setFromDepartmentId("");
    setToDepartmentId("");
    setPayGradeId("");
    setJobResponsibilityId("");
    setBranchId("");
    setJobCodeId("");
    setSearchValue("");
    setIncrementStep("");
    setSelectedIncrementStep("");
    setSelectedJobTitle("");
    setDivision("");
    setBranch("");
    setJobResponsibility("");
    setIcfDropdown("");
    setBranchNameTo("");
    setCurrentSalary("");
    setJobClass("");
    setRefNo("");
    setChangeTo("");
    employeeInfoRef.current = null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const usedBranchId =
      branchId ||
      (branches.find((b) => b.branchName === branch)
        ? branches.find((b) => b.branchName === branch)?.id !== undefined &&
          branches.find((b) => b.branchName === branch)?.id !== null
          ? branches.find((b) => b.branchName === branch)?.id.toString()
          : ""
        : "");
    const usedJobResponsibilityId = jobResponsibilityId;
    let usedIcfId = null;
    if (icfDropdown) {
      try {
        const data = await fetchICFs();
        const found = Array.isArray(data)
          ? data.find((item) => item.ICF === icfDropdown)
          : null;
        if (found) usedIcfId = found.id;
      } catch (err) {
        console.log("Error fetching ICFs for ID lookup", err);
      }
    }
    const usedBranchNameToId =
      branches.find((b) => b.branchName === branchNameTo)?.id || null;
    const selectedEmploymentType = employmentTypes.find(
      (et) => et.type === changeTo
    );
    const employmentTypeId = selectedEmploymentType
      ? selectedEmploymentType.id
      : undefined;

    const foundPayGradeId = selectedIncrementStep
      ? stepNoToPayGradeId[selectedIncrementStep]
      : null;

    let usedStatus = employeeInfoRef.current?.status;
    if (!usedStatus) usedStatus = status;
    if (!usedStatus && selectedRequest) {
      const req = transferRequests.find(
        (r) =>
          r.transferRequesterId !== undefined &&
          r.transferRequesterId !== null &&
          r.transferRequesterId.toString() === selectedRequest
      );
      if (req && req.status) usedStatus = req.status;
    }

    const transferRequestPayload = {
      id: selectedRequest ? Number(selectedRequest) : undefined,
      jobPositionId: jobPositionId ? Number(jobPositionId) : undefined,
      payGradeId: foundPayGradeId ? foundPayGradeId : undefined,
      jobResponsibilityId: jobResponsibilityId
        ? Number(jobResponsibilityId)
        : undefined,
      icfId: usedIcfId ? Number(usedIcfId) : undefined,
      transferToId: toDepartmentId ? Number(toDepartmentId) : undefined,
      branchId: usedBranchNameToId ? Number(usedBranchNameToId) : undefined,
      branchFromId: branchFromId ? Number(branchFromId) : undefined,
      salary: currentSalary ? currentSalary : undefined,
      employmentType: employmentTypeId,
    };
    console.log("Submitting transfer request payload:", transferRequestPayload);
    if (transferRequestPayload.id) {
      await fetch(
        `http://localhost:8080/api/hr-transfer-requests/${transferRequestPayload.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transferRequestPayload),
        }
      );
    }

    const usedJobResponsibility = jobResponsibilityId
      ? jobResponsibilities.find((j) => j.id === jobResponsibilityId)
          ?.responsibility || jobResponsibility
      : jobResponsibility;
    const usedToDepartmentId =
      toDepartmentId ||
      (departments.find((d) => d.deptName === toDepartment)?.deptId !==
        undefined &&
        departments.find((d) => d.deptName === toDepartment)?.deptId !== null)
        ? departments
            .find((d) => d.deptName === toDepartment)
            ?.deptId.toString()
        : "";
    const usedFromDepartmentId =
      fromDepartmentId ||
      (departments.find((d) => d.deptName === fromDepartment)?.deptId !==
        undefined &&
        departments.find((d) => d.deptName === fromDepartment)?.deptId !== null)
        ? departments
            .find((d) => d.deptName === fromDepartment)
            ?.deptId.toString()
        : "";

    const jobTitleChangedObj = jobTitles.find(
      (jt) => jt.jobTitle === selectedJobTitle
    );
    const jobTitleChanged = jobTitleChangedObj
      ? jobTitleChangedObj.id
      : undefined;
    const branchFromIdValue =
      branches.find((b) => b.branchName === branch)?.id !== undefined
        ? Number(branches.find((b) => b.branchName === branch)?.id)
        : undefined;
    const branchIdFromDropdown = branches.find(
      (b) => b.branchName === branchNameTo
    )?.id;

    const branchIdValue =
      branchIdFromDropdown !== undefined && branchIdFromDropdown !== null
        ? Number(branchIdFromDropdown)
        : branchFromIdValue;

    const payload: any = {
      branchFrom: branchFromIdValue,
      branchId:
        branchIdFromDropdown !== undefined && branchIdFromDropdown !== null
          ? Number(branchIdFromDropdown)
          : undefined,
      jobResponsibility: usedJobResponsibility,
      jobResponsibilityId: jobResponsibilityId
        ? Number(jobResponsibilityId)
        : undefined,
      promotionDate: dateFrom,
      deptTransferTo: usedToDepartmentId
        ? Number(usedToDepartmentId)
        : undefined,
      prevDepartmentId: usedFromDepartmentId
        ? Number(usedFromDepartmentId)
        : undefined,
      prevJobPosition: jobPosition,
      employeeId,
      jobTitleChanged:
        jobTitleChanged !== undefined ? Number(jobTitleChanged) : undefined,
      promLetterNumber: refNo,
      prevSalary: originalSalary ? Number(originalSalary) : undefined,
    };
    if (usedStatus && usedStatus !== "") {
      payload.status = usedStatus;
    }

    console.log("Submitting promotion history payload:", payload);

    fetch("http://localhost:8080/api/promotion-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save promotion history");
        return res.json();
      })
      .then(() => {
        toast.success("Promotion history saved successfully!");
        clearForm();
      })
      .catch(() => toast.error("Failed to save promotion history"));
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
          employeeInfoRef.current = data;
          setEmployeeName(data.employeeName || "");
          setGender(data.gender || "");
          setHiredDate(data.hiredDate || "");
          setDepartment(data.departmentName || "");
          setDivision(data.departmentName || "");
          setFromDepartment(data.departmentName || "");
          setJobPosition(data.jobPosition || "");
          setDirectorate(data.directorateName || "");
          setJobPositionId(data.jobPositionId || "");
          setFromDepartmentId(data.fromDepartmentId || "");
          setToDepartmentId(data.toDepartmentId ?? "");
          setPayGradeId(data.payGradeId || "");
          setJobResponsibilityId(data.jobResponsibilityId || "");
          setJobResponsibility(data.jobResponsibility || "");
          setBranchId(data.branchId || "");
          setJobCodeId(data.jobCode || "");
          setCurrentSalary(data.currentSalary || "");
          setCurrentSalary(data.currentSalary || "");
          if (!originalSalary) setOriginalSalary(data.currentSalary || "");
          setStatus(data.status || "");
          setEmpId(data.empId || "");
          setBranchFromId(
            data.branchId !== undefined && data.branchId !== null
              ? data.branchId.toString()
              : ""
          );
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
                setIcfDropdown(icfList.includes(icfValue) ? icfValue : "");
                let jobClassValue = "";
                let jobGradeId = "";
                if (
                  jobTypeDetail &&
                  jobTypeDetail.jobType &&
                  jobTypeDetail.jobType.jobGrade
                ) {
                  jobClassValue = jobTypeDetail.jobType.jobGrade.grade;
                  jobGradeId = jobTypeDetail.jobType.jobGrade.id || "";
                }
                setJobClass(jobClassValue);

                if (data.payGradeId) {
                  fetch(
                    `http://localhost:8080/api/hr-pay-grad/${data.payGradeId}`
                  )
                    .then((res) => (res.ok ? res.json() : null))
                    .then((payGradeData) => {
                      const stepNo =
                        payGradeData && payGradeData.stepNo
                          ? payGradeData.stepNo
                          : "";
                      setIncrementStep(stepNo);
                      setChangeTo(data.employmentType || "");
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
                        toDepartmentId: data.toDepartmentId ?? "",
                        payGradeId: data.payGradeId,
                        jobResponsibilityId: data.jobResponsibilityId,
                        jobResponsibility: data.jobResponsibility,
                        branchId: data.branchId,
                        branchFrom: data.branchId,
                        jobCode: data.jobCode,
                        icf: icfValue,
                        incrementStep: stepNo,
                        jobClass: jobClassValue,
                        jobGradeId: jobGradeId,
                        status,
                        empId,
                      });
                    });
                } else {
                  setIncrementStep("");
                }
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
        const contentType = response.headers.get("content-type");
        if (!response.ok) {
          const text = await response.text();
          console.error("Fetch failed with status:", response.status, text);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Expected JSON but got:", text);
          throw new Error("Response is not JSON");
        }
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
          (r.transferRequesterId?.toString() || r.empId?.toString()) ===
          selectedRequest
      );
      if (req) {
        setEmployeeId(req.empId || "");
        setEmployeeName(
          [req.firstName, req.middleName, req.lastName]
            .filter(Boolean)
            .join(" ")
        );
        setGender(req.gender || "");
        setHiredDate(req.hiredDate || "");
        seticf(req.icf || "");
        setIcfDropdown(req.icf || "");
        setDepartment(req.departmentName || "");
        setFromDepartment(req.transferFromName || "");
        setJobPosition(req.jobPosition || "");
        setSelectedJobTitle(req.jobPosition || "");
        setDirectorate(req.directorateName || "");
        setJobPositionId(req.jobPositionId ? req.jobPositionId.toString() : "");
        setFromDepartmentId(
          req.transferFromId ? req.transferFromId.toString() : ""
        );
        setToDepartmentId(req.transferToId ? req.transferToId.toString() : "");
        setPayGradeId(req.payGradeId ? req.payGradeId.toString() : "");
        setJobResponsibilityId(
          req.jobResponsibilityId ? req.jobResponsibilityId.toString() : ""
        );
        setJobResponsibility(req.jobResponsibility || "");
        setBranchId(req.branchId ? req.branchId.toString() : "");
        const foundBranch = branches.find(
          (b) =>
            b.id.toString() === (req.branchId ? req.branchId.toString() : "")
        );
        setBranch(foundBranch ? foundBranch.branchName : "");
        setBranchNameTo(foundBranch ? foundBranch.branchName : "");
        setJobCodeId(req.jobCodeId ? req.jobCodeId.toString() : "");
        //setPrevSalary("");
        setStatus(req.status || "");
        setEmpId(req.empId || "");
        setTransferType(req.transferType || "");
        setToDepartmentId(req.transferToId ? req.transferToId.toString() : "");
        const foundToDepartment = departments.find(
          (d) =>
            d.deptId.toString() ===
            (req.transferToId ? req.transferToId.toString() : "")
        );
        setToDepartment(foundToDepartment ? foundToDepartment.deptName : "");
        setTransferReason(req.description || "");
        if (req.empId) {
          fetch(`http://localhost:8080/api/employees/${req.empId}/info`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
              if (data && data.currentSalary) {
                setCurrentSalary(data.currentSalary);
                setOriginalSalary(data.currentSalary);
              } else {
                setCurrentSalary("");
                setOriginalSalary("");
              }
            })
            .catch(() => {
              setCurrentSalary("");
              setOriginalSalary("");
            });
        } else {
          setCurrentSalary("");
          setOriginalSalary("");
        }
        if (req && req.payGrade?.payGradeId) {
          fetch(
            `http://localhost:8080/api/hr-pay-grad/${req.payGrade.payGradeId}`
          )
            .then((res) => (res.ok ? res.json() : null))
            .then((payGradeData) => {
              const stepNo =
                payGradeData && payGradeData.stepNo
                  ? payGradeData.stepNo.toString()
                  : "";
              setIncrementStep(stepNo);
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
  }, [selectedRequest, transferRequests, branches, departments]);

  useEffect(() => {
    if (jobTitle) {
      setJobTitles((prev) => {
        if (!prev.some((jt) => jt.jobTitle === jobTitle)) {
          return [...prev, { id: -1, jobTitle }];
        }
        return prev;
      });
    }
  }, [jobTitle, jobTitles]);

  const handleSelectDepartment = (deptId: number) => {
    if (departmentFieldBeingEdited === "to") {
      const dept = departments.find((d) => d.deptId === deptId);
      setToDepartment(dept ? dept.deptName : "");
      setToDepartmentId(
        dept && dept.deptId !== undefined && dept.deptId !== null
          ? dept.deptId.toString()
          : ""
      );
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

  useEffect(() => {
    fetch("http://localhost:8080/api/responsibilities")
      .then((res) => res.json())
      .then((data) => {
        setJobResponsibilities(data);
      })
      .catch((err) =>
        console.error("Failed to fetch job responsibilities", err)
      );
  }, []);
  useEffect(() => {
    fetch("http://localhost:8080/api/hr-lu-branch")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch branches");
        return res.json();
      })
      .then((data) => {
        setBranches(data);
      });
  }, []);
  useEffect(() => {
    fetch("http://localhost:8080/api/employment-types")
      .then((res) => res.json())
      .then((data) => setEmploymentTypes(data))
      .catch((err) => console.error("Failed to fetch employment types", err));
  }, []);
  useEffect(() => {
    fetch("http://localhost:8080/api/job_types/job-titles")
      .then((res) => res.json())
      .then((data) => setJobTitles(data))
      .catch((err) => console.error("Failed to fetch job titles", err));
  }, []);
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
    const fetchIcfData = async () => {
      try {
        const data = await fetchICFs();
        setIcfList(
          Array.isArray(data) ? data.map((item: any) => item.ICF) : []
        );
      } catch (error) {
        console.error("Error fetching ICFs:", error);
      }
    };
    fetchIcfData();
  }, []);
  useEffect(() => {
    if (incrementStep) {
      setIncrementSteps((prev) => {
        if (!prev.includes(incrementStep)) {
          return [...prev, incrementStep];
        }
        return prev;
      });
      setSelectedIncrementStep(incrementStep);
    }
  }, [incrementStep]);

  useEffect(() => {
    if (jobTitle && !jobTitles.some((jt) => jt.jobTitle === jobTitle)) {
      setJobTitles((prev) => [...prev, { id: -1, jobTitle }]);
    }
  }, [jobTitle]);

  useEffect(() => {
    const updatePayGradeId = async () => {
      if (employeeId && selectedIncrementStep) {
        try {
          const res = await fetch(
            `http://localhost:8080/api/hr-pay-grad/step/${selectedIncrementStep}`
          );
          if (res.ok) {
            const payGrade = await res.json();
            if (payGrade && payGrade.payGradeId) {
              await fetch(
                `http://localhost:8080/api/employees/${employeeId}/job-update`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ payGradeId: payGrade.payGradeId }),
                }
              );
              setPayGradeId(payGrade.payGradeId.toString());
            }
          }
        } catch (err) {}
      }
    };
    updatePayGradeId();
  }, [selectedIncrementStep, employeeId]);

  useEffect(() => {
    if (incrementSteps.length > 0) {
      fetch("http://localhost:8080/api/hr-pay-grad")
        .then((res) => res.json())
        .then((data) => {
          const mapping: { [step: string]: number } = {};
          data.forEach((pg: any) => {
            if (pg.stepNo && pg.payGradeId) {
              mapping[pg.stepNo] = pg.payGradeId;
            }
          });
          setStepNoToPayGradeId(mapping);
        })
        .catch(() => setStepNoToPayGradeId({}));
    }
  }, [incrementSteps]);

  const updateRequestsCount = transferRequests.filter(
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
          {/* <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Search Requester Info:
          </h2> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-sm font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Update Request:
                  <span className="ml-2 text-xs text-red-500 font-bold">
                    ({updateRequestsCount})
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
                              const status =
                                typeof req.status === "string"
                                  ? req.status.trim()
                                  : req.status;
                              return (
                                (status === "2" || status === 2) && req.empId
                              );
                            })
                            .filter((req) => {
                              const empId = req.empId
                                ? req.empId.toString()
                                : "";
                              const fullName = [
                                req.firstName,
                                req.middleName,
                                req.lastName,
                              ]
                                .filter(Boolean)
                                .join(" ")
                                .toLowerCase();
                              return (
                                searchValue.trim() === "" ||
                                empId.includes(searchValue.trim()) ||
                                fullName.includes(
                                  searchValue.trim().toLowerCase()
                                )
                              );
                            })
                            .map((req, idx) => {
                              const empId = req.empId || "N/A";
                              let fullName = [
                                req.firstName,
                                req.middleName,
                                req.lastName,
                              ]
                                .filter(Boolean)
                                .join(" ");
                              if (!fullName && req.employeeName) {
                                fullName = req.employeeName;
                              }
                              const keyStr =
                                req.transferRequesterId?.toString() || empId;
                              return (
                                <li
                                  key={keyStr + "-" + idx}
                                  className={`p-2 hover:bg-gray-200 cursor-pointer ${
                                    selectedRequest === keyStr
                                      ? "bg-blue-100"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedRequest(keyStr);
                                    setShowDropdown(false);
                                    setSearchValue(`${empId} - ${fullName}`);
                                  }}
                                >
                                  {empId} - {fullName}
                                </li>
                              );
                            })}
                          {transferRequests.filter((req) => {
                            const empId = req.empId ? req.empId.toString() : "";
                            const fullName = [
                              req.firstName,
                              req.middleName,
                              req.lastName,
                            ]
                              .filter(Boolean)
                              .join(" ")
                              .toLowerCase();
                            return (
                              searchValue.trim() === "" ||
                              empId.includes(searchValue.trim()) ||
                              fullName.includes(
                                searchValue.trim().toLowerCase()
                              )
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
                  Gender
                </label>
                <input
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  readOnly
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Job Title
                </label>
                <input
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
                  Directorate
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={directorate}
                  onChange={(e) => setDirectorate(e.target.value)}
                  readOnly
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Job Responsibility
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={jobResponsibility}
                  onChange={(e) => setJobResponsibility(e.target.value)}
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
                  Department
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  ICF
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={icf}
                  readOnly
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Increment Step
                </label>
                <input
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={incrementStep}
                  readOnly
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Division
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
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
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Assigned Detail:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Transfer Type
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={transferType}
                  onChange={(e) =>
                    setTransferType(e.target.value as TransferType)
                  }
                >
                  <option value="">--Select one--</option>
                  <option value="direct transfer">direct transfer</option>
                  <option value="transfer">transfer</option>
                </select>
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
                    readOnly
                    placeholder="--select department--"
                    onClick={() => {
                      setDepartmentFieldBeingEdited("to");
                      setShowDepartmentTreeModal(true);
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Job Title
                </label>
                <div className="flex-1">
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                    style={{
                      minWidth: "120px",
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                    }}
                    value={selectedJobTitle}
                    onChange={async (e) => {
                      setSelectedJobTitle(e.target.value);
                      const selected = jobTitles.find(
                        (jt) => jt.jobTitle === e.target.value
                      );
                      if (selected) {
                        try {
                          const jobTypeRes = await fetch(
                            `http://localhost:8080/api/hr-job-types/details-by-job-title-id?jobTitleId=${selected.id}`
                          );
                          if (jobTypeRes.ok) {
                            const jobTypeData = await jobTypeRes.json();
                            const jobTypeId = jobTypeData.jobTypeId;
                            if (jobTypeId) {
                              const detailRes = await fetch(
                                `http://localhost:8080/api/job-type-details/by-job-type/${jobTypeId}`
                              );
                              if (detailRes.ok) {
                                const details = await detailRes.json();
                                if (
                                  Array.isArray(details) &&
                                  details.length > 0
                                ) {
                                  setJobPositionId(details[0].id.toString());
                                } else {
                                  setJobPositionId("");
                                }
                              } else {
                                setJobPositionId("");
                              }
                            } else {
                              setJobPositionId("");
                            }
                          } else {
                            setJobPositionId("");
                          }
                        } catch {
                          setJobPositionId("");
                        }
                      } else {
                        setJobPositionId("");
                      }
                    }}
                  >
                    {selectedJobTitle &&
                      !jobTitles.some(
                        (jt) => jt.jobTitle === selectedJobTitle
                      ) && (
                        <option value={selectedJobTitle}>
                          {selectedJobTitle} (from request)
                        </option>
                      )}
                    <option value="">--Select One--</option>
                    {jobTitles.map((jt, idx) => (
                      <option key={jt.id + "-" + idx} value={jt.jobTitle}>
                        {jt.jobTitle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  ICF
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={icfDropdown}
                  onChange={(e) => {
                    setIcfDropdown(e.target.value);
                    const fetchAndLogIcfId = async () => {
                      try {
                        const data = await fetchICFs();
                        const found = Array.isArray(data)
                          ? data.find((item) => item.ICF === e.target.value)
                          : null;
                      } catch (err) {
                        console.log("Error fetching ICFs for ID lookup", err);
                      }
                    };
                    if (e.target.value) fetchAndLogIcfId();
                  }}
                >
                  <option value="">--Select One--</option>
                  {icfList.map((icfValue, idx) => (
                    <option key={icfValue + "-" + idx} value={icfValue}>
                      {icfValue}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                  <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                    Ref_No:
                  </label>
                  <textarea
                    className="flex-1 border border-gray-300 rounded-md p-1 text-xs  resize-y min-h-[40px] max-h-[200px]"
                    value={refNo}
                    onChange={(e) => setRefNo(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Branch Name To:
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={branchNameTo}
                  onChange={(e) => {
                    setBranchNameTo(e.target.value);
                    const selectedBranch = branches.find(
                      (branch) => branch.branchName === e.target.value
                    );
                  }}
                >
                  <option value="">--Select One--</option>
                  {branches.map((branch, idx) => (
                    <option
                      key={branch.id + "-" + idx}
                      value={branch.branchName}
                    >
                      {branch.branchName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-start mt-2">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Processed by:
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={progressBy}
                  onChange={(e) => setProgressBy(e.target.value)}
                  readOnly
                />
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Date From:
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
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
                    readOnly
                  />
                </div>
              </div>
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
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={selectedIncrementStep}
                  onChange={(e) => setSelectedIncrementStep(e.target.value)}
                >
                  <option value="">--Select One--</option>
                  {incrementSteps.map((step, idx) => (
                    <option key={step + "-" + idx} value={step.toString()}>
                      {step}
                    </option>
                  ))}
                </select>
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
                />
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Job Responsibility
                </label>
                <div className="flex-1">
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                    style={{
                      minWidth: "120px",
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                    }}
                    value={jobResponsibilityId}
                    onChange={(e) => {
                      setJobResponsibilityId(e.target.value);
                      const selected = jobResponsibilities.find(
                        (j) => j.id.toString() === e.target.value
                      );
                      setJobResponsibility(
                        selected ? selected.responsibility : ""
                      );
                    }}
                  >
                    <option value="">--Select One--</option>
                    {jobResponsibilities.map((resp, idx) => (
                      <option
                        key={resp.id + "-" + idx}
                        value={resp.id}
                        style={{
                          maxWidth: "80px",
                          overflowX: "auto",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          display: "block",
                        }}
                      >
                        {resp.responsibility}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-end">
                <label className="block text-xs font-medium text-gray-700 mb-0 whitespace-nowrap min-w-[120px]">
                  Change To:
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                  value={changeTo}
                  onChange={(e) => setChangeTo(e.target.value)}
                >
                  <option value="">--Select One--</option>
                  {employmentTypes.map((et) => (
                    <option key={et.id} value={et.type}>
                      {et.type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-start">
            <button
              type="submit"
              className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              Create
            </button>
          </div>
        </form>
      </div>
      {/* To Department modal*/}
      {showDepartmentTreeModal && departmentFieldBeingEdited === "to" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white pt-1 pb-6 px-6 shadow-lg w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700"></h2>
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
                    "Departments",
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

export default function HrPromotionPage() {
  return (
    <AppModuleLayout>
      <HrPromotion />
    </AppModuleLayout>
  );
}
