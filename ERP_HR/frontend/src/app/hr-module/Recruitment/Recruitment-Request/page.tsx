"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiPlus,
  FiMinus,
  FiBriefcase,
  FiBookOpen,
  FiRefreshCw,
  FiCheckCircle,
  FiEdit,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";
import { authFetch } from "@/utils/authFetch";
import DepartmentTreeSelectModal from "../../Employee-Profile/components/DepartmentTreeSelectModal";

// --- INTERFACES (No changes here) ---
interface EducationRequirement {
  number: number;
  educationLevel: string;
  fieldOfStudy: string;
  minExperience: string;
}
interface DepartmentDto {
  deptId: number;
  deptName: string;
  deptLevel?: number;
  children?: DepartmentDto[];
}
interface IcfOption {
  id: number;
  icf: string;
  description: string;
}
interface JobTitleOption {
  id: number;
  jobTitle: string;
}
interface PositionNameOption {
  id: number;
  name: string;
  salary?: number;
}
interface SalaryStepDto {
  stepNo: number;
  salary: number;
}
interface RecruitmentTypeOption {
  recruitmentType: string;
  description: string;
  recruitmentId: number;
}
interface EmploymentTypeOption {
  id: number;
  type: string;
}
interface RecruitmentRequestSuggestion {
  recruitRequestId: number;
  recruitBatchCode: string;
}
interface RecruitmentRequestDisplayData {
  recruitRequestId: number;
  gmRemark: string;
  recruitBatchCode: string;
  remark: string;
  requestStatus: string;
  requesterId: string;
  budgetYear: string;
  advertisementType: string;
  salary: string;
  numOfEmps: number;
  department: {
    deptId: number;
    depName: string;
  };
  jobCodeDetail: {
    id: number;
    hrJobType: {
      id: number;
      jobTitle: {
        id: number;
        jobTitle: string;
      };
      jobGrade: {
        id: number;
        jobGrade: string;
      };
    };
    icf: {
      id: number;
      icf: string;
    };
  };
  icf: {
    id: number;
    icf: string;
  };
  recruitmentType: {
    recruitmentType: string;
    description: string;
  };
  incrementStep?: string;
  employmentType?: {
    id: number;
    type: string;
  };
}

// --- EmployeeFormData (No changes here) ---
interface EmployeeFormData {
  searchQuery: string;
  recruitRequestId: number | null;
  gmRemark: string;
  numOfEmps: string;
  recruitBatchCode: string;
  gmApprovedDate: string;
  recruitRequestType: string;
  remark: string;
  requestStatus: string;
  requesterId: string;
  approvedBy: string;
  updatedDate: string;
  endDate: string;
  budgetYear: string;
  selectionRemark: string;
  advertized: string;
  checked: string;
  description: string;
  advertisementType: string;
  department: number | "";
  departmentName: string;
  jobType: number | "";
  icf: number | "";
  positionName: number | "";
  recruitmentType: string;
  incrementStep: string;
  salary: string;
  employmentType: number | "";
  employmentTypeName: string;
  educationRequirements: EducationRequirement[];
}

const initialFormData: EmployeeFormData = {
  searchQuery: "",
  recruitRequestId: null,
  gmRemark: "",
  numOfEmps: "",
  recruitBatchCode: "",
  gmApprovedDate: "",
  recruitRequestType: "",
  remark: "",
  requestStatus: "",
  requesterId: "",
  approvedBy: "",
  updatedDate: "",
  endDate: "",
  budgetYear: "",
  selectionRemark: "",
  advertized: "",
  checked: "",
  description: "",
  advertisementType: "",
  department: "",
  departmentName: "",
  jobType: "",
  icf: "",
  positionName: "",
  recruitmentType: "",
  incrementStep: "",
  salary: "",
  employmentType: "",
  employmentTypeName: "",
  educationRequirements: [
    { number: 1, educationLevel: "", fieldOfStudy: "", minExperience: "" },
  ],
};

export default function RecruitmentRequest() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<EmployeeFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);

  // Dropdown options state
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [icfOptions, setIcfOptions] = useState<IcfOption[]>([]);
  const [incrementSteps, setIncrementSteps] = useState<SalaryStepDto[]>([]);
  const [jobTypeOptions, setJobTypeOptions] = useState<JobTitleOption[]>([]);
  const [positionNameOptions, setPositionNameOptions] = useState<
    PositionNameOption[]
  >([]);
  const [recruitmentTypeOptions, setRecruitmentTypeOptions] = useState<
    RecruitmentTypeOption[]
  >([]);
  const [employmentTypeOptions, setEmploymentTypeOptions] = useState<
    EmploymentTypeOption[]
  >([]);

  // Search state
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<
    RecruitmentRequestSuggestion[]
  >([]);

  // Table state
  const [pendingRequests, setPendingRequests] = useState<
    RecruitmentRequestDisplayData[]
  >([]);
  const [isLoadingPendingRequests, setIsLoadingPendingRequests] =
    useState(false);
  const [pendingRequestsError, setPendingRequestsError] = useState<
    string | null
  >(null);
  const [showPendingRequestsTable, setShowPendingRequestsTable] =
    useState(false);

  const [isTableCollapsed, setIsTableCollapsed] = useState(false);

  const pendingRequestsTableRef = useRef<HTMLDivElement>(null);

  // --- DATA FETCHING & HANDLERS (No changes to the logic inside these functions) ---
  const fetchOptions = useCallback(
    async <T,>(
      endpoint: string,
      setter: React.Dispatch<React.SetStateAction<T[]>>,
      name: string
    ) => {
      try {
        const response = await authFetch(
          `http://localhost:8080/api/${endpoint}`
        );
        if (!response.ok) {
          const errorBody = await response.text();
          console.error(
            `Server error for ${name}: ${response.status}`,
            errorBody
          );
          throw new Error(`Failed to fetch ${name}`);
        }
        const data = await response.json();
        setter(data);
      } catch (error) {
        console.error(`Network error fetching ${name}:`, error);
        toast.error(`Failed to load ${name}. Check console for details.`);
        setter([]);
      }
    },
    []
  );

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        fetchOptions<DepartmentDto>(
          "departments",
          setDepartments,
          "departments"
        ),
        fetchOptions<IcfOption>("icfs", setIcfOptions, "ICF options"),
        fetchOptions<JobTitleOption>(
          "lu-job-types",
          setJobTypeOptions,
          "job types"
        ),
        fetchOptions<RecruitmentTypeOption>(
          "recruitment-types",
          setRecruitmentTypeOptions,
          "recruitment types"
        ),
        fetchOptions<PositionNameOption>(
          "position-names",
          setPositionNameOptions,
          "position names"
        ),
        fetchOptions<EmploymentTypeOption>(
          "employment-types",
          setEmploymentTypeOptions,
          "employment types"
        ),
      ]);
    };
    fetchAllData();
  }, [fetchOptions]);

  useEffect(() => {
    const fetchSearchSuggestions = async () => {
      try {
        const response = await authFetch(
          "http://localhost:8080/api/recruitment/pending-requests"
        );
        if (!response.ok) {
          throw new Error(
            "Failed to fetch pending requests for search suggestions"
          );
        }
        const data: RecruitmentRequestSuggestion[] = await response.json();
        setSearchSuggestions(data);
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
      }
    };
    fetchSearchSuggestions();
  }, []);

  useEffect(() => {
    const requestId = searchParams.get("id");
    if (requestId) {
      const fetchRequestForEdit = async () => {
        toast.loading("Loading request for editing...", {
          id: "loadEditRequest",
        });
        try {
          const response = await authFetch(
            `http://localhost:8080/api/recruitment/request/${requestId}`
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Failed to fetch request for editing."
            );
          }
          const data: RecruitmentRequestDisplayData = await response.json();
          setFormData({
            ...initialFormData,
            recruitRequestId: data.recruitRequestId,
            gmRemark: data.gmRemark || "",
            numOfEmps: data.numOfEmps?.toString() || "",
            recruitBatchCode: data.recruitBatchCode || "",
            remark: data.remark || "",
            requestStatus: data.requestStatus || "",
            requesterId: data.requesterId || "",
            budgetYear: data.budgetYear || "",
            advertisementType: data.advertisementType || "",
            salary: data.salary || "",
            department: data.department?.deptId || "",
            departmentName: data.department?.depName || "",
            jobType: data.jobCodeDetail?.hrJobType?.jobTitle?.id || "",
            icf: data.icf?.id || "",
            positionName: data.jobCodeDetail?.id || "",
            recruitmentType: data.recruitmentType?.recruitmentType || "",
            incrementStep: data.incrementStep || "",
            employmentType: data.employmentType?.id || "",
            employmentTypeName: data.employmentType?.type || "",
            educationRequirements: initialFormData.educationRequirements,
          });
          toast.success("Request loaded for editing!", {
            id: "loadEditRequest",
          });
        } catch (error: any) {
          console.error("Error loading request for edit:", error);
          toast.error(`Error loading request: ${error.message}`, {
            id: "loadEditRequest",
          });
          router.replace("/hr-module/Recruitment/request");
        }
      };
      fetchRequestForEdit();
    } else {
      setFormData(initialFormData);
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (formData.jobType && formData.icf) {
      const fetchIncrementSteps = async () => {
        try {
          const response = await authFetch(
            `http://localhost:8080/api/salary/steps?jobTitleId=${formData.jobType}&icfId=${formData.icf}`
          );
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error fetching increment steps:`, errorText);
            toast.error(`Could not find salary steps for this combination.`);
            setIncrementSteps([]);
            return;
          }
          const steps: SalaryStepDto[] = await response.json();
          setIncrementSteps(steps);
          if (!formData.recruitRequestId) {
            setFormData((prev) => ({ ...prev, incrementStep: "", salary: "" }));
          }
        } catch (error) {
          console.error("Error fetching increment steps:", error);
          toast.error("An unexpected error occurred while fetching steps.");
          setIncrementSteps([]);
        }
      };
      fetchIncrementSteps();
    } else {
      setIncrementSteps([]);
      setFormData((prev) => ({ ...prev, incrementStep: "", salary: "" }));
    }
  }, [formData.jobType, formData.icf, formData.recruitRequestId]);

  const fetchPendingRequestsForTable = useCallback(async () => {
    setIsLoadingPendingRequests(true);
    setPendingRequestsError(null);
    try {
      const response = await authFetch(
        "http://localhost:8080/api/recruitment/pending-requests-for-edit"
      );
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to fetch pending requests: ${
            response.statusText || errorBody
          }`
        );
      }
      const data: RecruitmentRequestDisplayData[] = await response.json();
      setPendingRequests(data);
      toast.success("Pending requests loaded!");
    } catch (err: any) {
      console.error("Error fetching pending requests for table:", err);
      setPendingRequestsError(err.message || "An unexpected error occurred.");
      toast.error(`Failed to load pending requests: ${err.message}`);
    } finally {
      setIsLoadingPendingRequests(false);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "incrementStep" && value) {
      const selectedStep = incrementSteps.find(
        (s) => s.stepNo.toString() === value
      );
      if (selectedStep) {
        setFormData((prev) => ({
          ...prev,
          salary: selectedStep.salary.toString(),
        }));
      }
    } else if (name === "employmentType") {
      const selectedOption = employmentTypeOptions.find(
        (opt) => opt.id.toString() === value
      );
      setFormData((prev) => ({
        ...prev,
        employmentType: value ? parseInt(value) : "",
        employmentTypeName: selectedOption ? selectedOption.type : "",
      }));
    }
  };

  const handleDepartmentSelect = useCallback((dept: DepartmentDto) => {
    setFormData((prev) => ({
      ...prev,
      department: dept.deptId,
      departmentName: dept.deptName,
    }));
    setIsDepartmentModalOpen(false);
  }, []);

  const addEducationRow = () => {
    setFormData((prev) => ({
      ...prev,
      educationRequirements: [
        ...(prev.educationRequirements || []),
        {
          number: (prev.educationRequirements?.length || 0) + 1,
          educationLevel: "",
          fieldOfStudy: "",
          minExperience: "",
        },
      ],
    }));
  };

  const removeEducationRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      educationRequirements: prev.educationRequirements
        ? prev.educationRequirements.filter((_, i) => i !== index)
        : [],
    }));
  };

  const handleEducationChange = (
    index: number,
    field: keyof EducationRequirement,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      educationRequirements: prev.educationRequirements.map((req, i) =>
        i === index ? { ...req, [field]: value } : req
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToastId = toast.loading(
      formData.recruitRequestId
        ? "Updating request..."
        : "Submitting request..."
    );
    try {
      if (!formData.recruitBatchCode.trim())
        throw new Error("Recruit Batch Code is required.");
      if (!formData.requesterId.trim())
        throw new Error("Requester ID is required.");
      if (!formData.employmentTypeName.trim())
        throw new Error("Employment Type is required.");
      if (!formData.jobType)
        throw new Error("Required Jobs (Job Type) is required.");
      if (!formData.icf) throw new Error("ICF is required.");
      if (!formData.incrementStep)
        throw new Error("Increment Step is required.");
      if (!formData.department)
        throw new Error("Working Place (Department) is required.");

      const dataToSend = {
        ...formData,
        numOfEmps: formData.numOfEmps ? parseInt(formData.numOfEmps) : null,
        salary: formData.salary || null,
        gmApprovedDate: formData.gmApprovedDate || null,
        updatedDate: formData.updatedDate || null,
        endDate: formData.endDate || null,
        department: formData.department
          ? { deptId: formData.department }
          : null,
        jobTypeId: formData.jobType ? formData.jobType : null,
        icf: formData.icf ? { id: formData.icf } : null,
        positionName: formData.positionName
          ? { id: formData.positionName }
          : null,
        recruitmentType: formData.recruitmentType
          ? { recruitmentType: formData.recruitmentType }
          : null,
        employmentTypeId: formData.employmentType
          ? parseInt(formData.employmentType.toString())
          : null,
        employmentTypeName: formData.employmentTypeName || null,
      };

      const url = formData.recruitRequestId
        ? `http://localhost:8080/api/recruitment/request/${formData.recruitRequestId}`
        : "http://localhost:8080/api/recruitment/request";
      const method = formData.recruitRequestId ? "PUT" : "POST";

      const response = await authFetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit request");
      }

      toast.dismiss(loadingToastId);
      toast.success(
        formData.recruitRequestId
          ? "Request updated successfully!"
          : "Request submitted successfully!"
      );

      const wasEditing = !!formData.recruitRequestId;

      setFormData(initialFormData); // Reset form state

      // v-- THIS IS THE FIX --v
      // If we were editing, clean the URL without a page reload.
      if (wasEditing) {
        window.history.pushState({}, "", "/hr-module/Recruitment/request");
      }
      // ^-- END OF FIX --^

      if (showPendingRequestsTable) {
        fetchPendingRequestsForTable();
      }
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      console.error("Error submitting form:", error);
      toast.error(
        `Failed to submit request: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (request: RecruitmentRequestDisplayData) => {
    toast.loading("Loading request for editing...", { id: "loadEditRequest" });
    try {
      setFormData({
        ...initialFormData,
        recruitRequestId: request.recruitRequestId,
        gmRemark: request.gmRemark || "",
        numOfEmps: request.numOfEmps?.toString() || "",
        recruitBatchCode: request.recruitBatchCode || "",
        remark: request.remark || "",
        requestStatus: request.requestStatus || "",
        requesterId: request.requesterId || "",
        budgetYear: request.budgetYear || "",
        advertisementType: request.advertisementType || "",
        salary: request.salary || "",
        department: request.department?.deptId || "",
        departmentName: request.department?.depName || "",
        jobType: request.jobCodeDetail?.hrJobType?.jobTitle?.id || "",
        icf: request.icf?.id || "",
        positionName: request.jobCodeDetail?.id || "",
        recruitmentType: request.recruitmentType?.recruitmentType || "",
        incrementStep: request.incrementStep || "",
        employmentType: request.employmentType?.id || "",
        employmentTypeName: request.employmentType?.type || "",
        educationRequirements: initialFormData.educationRequirements,
      });
      toast.success("Request loaded for editing!", { id: "loadEditRequest" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error("Error loading request for edit:", error);
      toast.error(`Error loading request: ${error.message}`, {
        id: "loadEditRequest",
      });
    }
  };

  const handleDelete = async (requestId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this request? This action cannot be undone."
      )
    ) {
      return;
    }
    toast.loading("Deleting request...", { id: "deleteRequest" });
    try {
      const response = await authFetch(
        `http://localhost:8080/api/recruitment/request/${requestId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to delete request: ${response.statusText || errorBody}`
        );
      }
      toast.success("Request deleted successfully!", {
        id: "deleteRequest",
      });
      fetchPendingRequestsForTable();
    } catch (err: any) {
      console.error("Error deleting request:", err);
      toast.error(`Failed to delete request: ${err.message}`, {
        id: "deleteRequest",
      });
    }
  };

  return (
    <div className="min-h-screen p-6 font-sans relative bg-slate-100">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Search/Management Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-[#3c8dbc] mb-4 flex items-center">
            <FiBriefcase className="mr-2" /> Recruitment Request
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label
                htmlFor="search-field"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Search Requests
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search-field"
                  name="searchQuery"
                  value={formData.searchQuery}
                  onChange={handleChange}
                  onFocus={() => setShowSearchSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSearchSuggestions(false), 100)
                  }
                  className="w-full p-2.5 pl-9 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all"
                  placeholder="Search by ID, type, etc."
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                {showSearchSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute z-20 w-full bg-white border border-slate-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                    {searchSuggestions.map((request) => (
                      <div
                        key={request.recruitRequestId}
                        className="p-2 cursor-pointer hover:bg-slate-100 text-sm text-slate-700"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            searchQuery:
                              request.recruitBatchCode ||
                              request.recruitRequestId.toString(),
                          }));
                          setShowSearchSuggestions(false);
                        }}
                      >
                        {request.recruitBatchCode} (ID:{" "}
                        {request.recruitRequestId})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-slate-200 p-6"
        >
          <h2 className="text-xl font-bold text-[#3c8dbc] mb-4 flex items-center">
            <FiBriefcase className="mr-2" />
            {formData.recruitRequestId ? "Edit Request" : " New Request"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* All form fields are unchanged */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              <div>
                <label
                  htmlFor="workingPlace"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Working Place
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="workingPlace"
                    name="departmentName"
                    value={formData.departmentName}
                    readOnly
                    onClick={() => setIsDepartmentModalOpen(true)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all cursor-pointer"
                    placeholder="Select Department"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setIsDepartmentModalOpen(true)}
                    className="ml-2 px-3 py-2 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] transition-colors"
                    aria-label="Open department selection"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiPlus />
                  </motion.button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="jobType"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Required Jobs
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all"
                  required
                >
                  <option value="">-- Select One --</option>
                  {jobTypeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.jobTitle}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="icf"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  ICF
                </label>
                <select
                  id="icf"
                  name="icf"
                  value={formData.icf}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all"
                  required
                >
                  <option value="">-- Select ICF --</option>
                  {icfOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.icf}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="incrementStep"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Increment Step
                </label>
                <select
                  id="incrementStep"
                  name="incrementStep"
                  value={formData.incrementStep}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all"
                  disabled={incrementSteps.length === 0}
                  required
                >
                  <option value="">-- Select Step --</option>
                  {incrementSteps.map((step) => (
                    <option key={step.stepNo} value={step.stepNo}>
                      {step.stepNo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="md:col-span-2 border border-slate-200 rounded-lg p-4 bg-slate-50">
              <h3 className="text-md font-semibold text-slate-700 mb-3 flex items-center">
                <FiBookOpen className="mr-2" /> Education Requirements
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        No.
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Education Level
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Field of Study
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Min Experience
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {formData.educationRequirements?.map((row, index) => (
                      <motion.tr
                        key={index}
                        className="hover:bg-slate-50 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-700">
                          {row.number}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <input
                            type="text"
                            value={row.educationLevel}
                            onChange={(e) =>
                              handleEducationChange(
                                index,
                                "educationLevel",
                                e.target.value
                              )
                            }
                            className="w-full p-1.5 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-offset-1 focus:ring-[#3c8dbc]"
                            placeholder="e.g., Bachelor's"
                          />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <input
                            type="text"
                            value={row.fieldOfStudy}
                            onChange={(e) =>
                              handleEducationChange(
                                index,
                                "fieldOfStudy",
                                e.target.value
                              )
                            }
                            className="w-full p-1.5 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-offset-1 focus:ring-[#3c8dbc]"
                            placeholder="e.g., Computer Science"
                          />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <input
                            type="text"
                            value={row.minExperience}
                            onChange={(e) =>
                              handleEducationChange(
                                index,
                                "minExperience",
                                e.target.value
                              )
                            }
                            className="w-full p-1.5 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-offset-1 focus:ring-[#3c8dbc]"
                            placeholder="e.g., 2 years"
                          />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                          <motion.button
                            type="button"
                            onClick={() => removeEducationRow(index)}
                            className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-100 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FiMinus size={16} />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <motion.button
                type="button"
                onClick={addEducationRow}
                className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus className="mr-2" /> Add Education Row
              </motion.button>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 pt-4 border-t border-slate-200">
              <div>
                <label
                  htmlFor="numOfEmps"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Required Number
                </label>
                <input
                  type="number"
                  id="numOfEmps"
                  name="numOfEmps"
                  value={formData.numOfEmps}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all"
                  placeholder="e.g., 5"
                />
              </div>
              <div>
                <label
                  htmlFor="employmentType"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Employment Type
                </label>
                <select
                  id="employmentType"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all"
                >
                  <option value="">-- Select One --</option>
                  {employmentTypeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="budgetYear"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Budget Year
                </label>
                <select
                  id="budgetYear"
                  name="budgetYear"
                  value={formData.budgetYear}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all"
                >
                  <option value="">Select</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="salary"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Salary
                </label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  readOnly
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="recruitBatchCode"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Recruit Batch Code
                </label>
                <input
                  type="text"
                  id="recruitBatchCode"
                  name="recruitBatchCode"
                  value={formData.recruitBatchCode}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="recruitmentType"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Recruitment Type
                </label>
                <select
                  id="recruitmentType"
                  name="recruitmentType"
                  value={formData.recruitmentType}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all"
                >
                  <option value="">Select One-</option>
                  {recruitmentTypeOptions.map((option) => (
                    <option
                      key={option.recruitmentType}
                      value={option.recruitmentType}
                    >
                      {option.description || option.recruitmentType}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="positionName"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Position Name
                </label>
                <select
                  id="positionName"
                  name="positionName"
                  value={formData.positionName}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all"
                >
                  <option value="">-- Select One --</option>
                  {positionNameOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="requesterId"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Requester ID
                </label>
                <input
                  type="text"
                  id="requesterId"
                  name="requesterId"
                  value={formData.requesterId}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all"
                  required
                />
              </div>
              <div className="lg:col-span-3">
                <label
                  htmlFor="remark"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  Remark
                </label>
                <input
                  type="text"
                  id="remark"
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              {formData.recruitRequestId && (
                <motion.button
                  type="button"
                  onClick={() => {
                    setFormData(initialFormData);
                    window.history.pushState(
                      {},
                      "",
                      "/hr-module/Recruitment/request"
                    );
                    toast.success("Form cleared!");
                  }}
                  className="px-6 py-2.5 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-all shadow-md hover:shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center mr-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear Form
                </motion.button>
              )}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] transition-all shadow-md hover:shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-2" />{" "}
                    {formData.recruitRequestId
                      ? "Updating..."
                      : "Submitting..."}
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="mr-2" />{" "}
                    {formData.recruitRequestId
                      ? "Update Request"
                      : "Add Request"}
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* View/Hide Pending Requests Link */}
        <div className="mt-6 text-left">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              const isOpening = !showPendingRequestsTable;
              setShowPendingRequestsTable(isOpening);

              if (isOpening) {
                fetchPendingRequestsForTable();
                setIsTableCollapsed(false);
                setTimeout(() => {
                  pendingRequestsTableRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }, 100);
              }
            }}
            className="text-[#3c8dbc] font-semibold hover:underline cursor-pointer"
          >
            {showPendingRequestsTable
              ? "Hide Pending Requests"
              : "Click here to View Pending Requests"}
          </a>
        </div>

        {/* Pending Recruitment Requests Table - Conditionally Rendered */}
        <AnimatePresence>
          {showPendingRequestsTable && (
            <motion.div
              ref={pendingRequestsTableRef}
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: "1.5rem" }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#3c8dbc] flex items-center">
                  <FiRefreshCw className="mr-2" /> Pending Recruitment Requests
                </h2>
                <motion.button
                  onClick={() => setIsTableCollapsed(!isTableCollapsed)}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                  title={isTableCollapsed ? "Expand Table" : "Collapse Table"}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isTableCollapsed ? (
                    <FiChevronDown size={20} />
                  ) : (
                    <FiChevronUp size={20} />
                  )}
                </motion.button>
              </div>

              {isLoadingPendingRequests ? (
                <div className="text-center py-10 text-slate-500">
                  Loading pending requests...
                </div>
              ) : pendingRequestsError ? (
                <div className="text-center py-10 text-red-500">
                  Error: {pendingRequestsError}
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  No pending requests found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Batch Code / ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Dept.
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Job Title
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                          # Emps
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Requester
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <AnimatePresence>
                      {!isTableCollapsed && (
                        <motion.tbody
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white divide-y divide-slate-200"
                        >
                          {pendingRequests.map((request) => (
                            <tr
                              key={request.recruitRequestId}
                              className="hover:bg-slate-50"
                            >
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                                <div className="font-medium text-slate-900">
                                  {request.recruitBatchCode}
                                </div>
                                <div className="text-xs text-slate-500">
                                  ID: {request.recruitRequestId}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-700">
                                {request.department?.depName || "N/A"}
                              </td>
                              <td className="px-4 py-3 text-sm text-slate-700">
                                {request.jobCodeDetail?.hrJobType?.jobTitle
                                  ?.jobTitle || "N/A"}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-slate-700">
                                {request.numOfEmps}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    request.requestStatus === "PENDING"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : request.requestStatus === "APPROVED"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {request.requestStatus}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">
                                {request.requesterId}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                <motion.button
                                  onClick={() => handleEdit(request)}
                                  className="text-indigo-600 hover:text-indigo-900 mr-3 p-1 rounded-md hover:bg-indigo-100 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="Edit Request"
                                >
                                  <FiEdit size={18} />
                                </motion.button>
                                <motion.button
                                  onClick={() =>
                                    handleDelete(request.recruitRequestId)
                                  }
                                  className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-100 transition-colors"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  title="Delete Request"
                                >
                                  <FiTrash2 size={18} />
                                </motion.button>
                              </td>
                            </tr>
                          ))}
                        </motion.tbody>
                      )}
                    </AnimatePresence>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DepartmentTreeSelectModal
        isOpen={isDepartmentModalOpen}
        onClose={() => setIsDepartmentModalOpen(false)}
        onSelect={handleDepartmentSelect}
        selectedDeptId={formData.department}
      />
    </div>
  );
}
