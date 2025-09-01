"use client";
import React, { useState, useEffect } from "react";
import { authFetch } from "@/utils/authFetch";
import DepartmentTreeSelectModal from "./DepartmentTreeSelectModal";
import { DepartmentDto } from "../types/department";
interface DepartmentTree {
  deptId: number;
  depName: string;
  children?: DepartmentTree[];
}

interface IcfOption {
  id: number;
  icf: string;
}

interface JobResponsibilityOption {
  id: number;
  responsibility: string;
}

interface RecruitmentTypeOption {
  recruitmentType: string;
  description: string;
}

interface NationOption {
  nationCode: number;
  name: string;
}

interface NationalityOption {
  nationalityId: number;
  nationalityName: string;
}

interface ReligionOption {
  id: number;
  name: string;
}

interface BranchOption {
  id: number;
  branchName: string;
}

interface EmploymentTypeOption {
  id: number;
  type: string;
}

interface JobTitleOption {
  id: number;
  jobTitle: string;
}

interface TitleOption {
  titleId: number;
  title: string;
}

interface JobFamilyOption {
  id: number;
  familyName: string;
}

interface PositionNameOption {
  id: number;
  name: string;
}

interface SalaryStepDto {
  stepNo: number;
  salary: number;
}

interface EmployeeFormData {
  rankId: string | number | readonly string[] | undefined;
  empId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  efirstName: string;
  emiddleName: string;
  elastName: string;
  dateOfBirth: string;
  nationality: string | number;
  religion: string | number;
  sex: string;
  maritalStatus: string;
  nation: string | number;
  contractEnd: string;
  jobType: string | number;
  icf: string | number;
  salary: string;
  pensionNumber: string;
  jobResponsibility: string | number;
  position: string | number;
  tess: string;
  title: string | number;
  employmentType: string | number;
  recruitmentType: string;
  jobFamily: string | number;
  jobGrade: string;
  retirementNo: string;
  tinNumer: string;
  hiredDate: string;
  accountNo: string;
  positionStatus: string;
  terminationDate: string;
  branch: string | number;
  dedactionDescriptive: string;
  department: string | number;
}

interface EmployeeFormProps {
  employeeData: {
    empId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    efirstName: string;
    emiddleName: string;
    elastName: string;
    dateOfBirth: string;
    sex: string;
    maritalStatus: string;
    salary?: string | { salary?: string | number };
    hiredDate: string;
    birthDate: string;
    accountNo: string;
    positionStatus: string;
    terminationDate: string;
    tinNumer: string;
    rankId: string;
    pensionNumber: string;
    tess: string;
    dedactionDescriptive: string;
    contractEnd: string;
    department?: {
      deptId: number;
      depName: string;
    };
    nationality?: {
      nationalityId: number;
    };
    religion?: {
      id: number;
    };
    nation?: {
      nationCode: number;
    };
    jobType?: {
      id: number;
    };
    icf?: {
      id: number;
    };
    jobResponsibility?: {
      id: number;
    };
    position?: {
      id: number;
    };
    title?: {
      titleId: number;
    };
    employmentType?: {
      id: number;
    };
    recruitmentType?: {
      recruitmentType: string;
    };
    jobFamily?: {
      id: number;
    };
    branch?: {
      id: number;
    };
    retirementNo?: string;
  } | null;
  isEditMode: boolean;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

export default function EmployeeForm({
  employeeData,
  isEditMode,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    empId: employeeData?.empId || "",
    firstName: employeeData?.firstName || "",
    middleName: employeeData?.middleName || "",
    lastName: employeeData?.lastName || "",
    efirstName: employeeData?.efirstName || "",
    emiddleName: employeeData?.emiddleName || "",
    elastName: employeeData?.elastName || "",
    dateOfBirth: employeeData?.dateOfBirth || "",
    nationality: employeeData?.nationality?.nationalityId || "",
    religion: employeeData?.religion?.id || "",
    sex: employeeData?.sex || "Male",
    maritalStatus: employeeData?.maritalStatus || "",
    nation: employeeData?.nation?.nationCode || "",
    contractEnd: employeeData?.contractEnd || "",
    jobType: employeeData?.jobType?.id || "",
    icf: employeeData?.icf?.id || "",
    salary:
      employeeData?.salary &&
      typeof employeeData.salary === "object" &&
      "salary" in employeeData.salary
        ? String(employeeData.salary.salary ?? "")
        : String(employeeData?.salary ?? ""),
    pensionNumber: employeeData?.pensionNumber || "",
    jobResponsibility: employeeData?.jobResponsibility?.id || "",
    position: employeeData?.position?.id || "",
    tess: employeeData?.tess || "",
    title: employeeData?.title?.titleId || "",
    employmentType: employeeData?.employmentType?.id || "",
    recruitmentType: employeeData?.recruitmentType?.recruitmentType || "",
    jobFamily: employeeData?.jobFamily?.id || "",
    jobGrade: employeeData?.birthDate || "",
    retirementNo: employeeData?.retirementNo || "",
    rankId: employeeData?.rankId || "",
    tinNumer: employeeData?.tinNumer || "",
    hiredDate: employeeData?.hiredDate || "",
    accountNo: employeeData?.accountNo || "",
    positionStatus: employeeData?.positionStatus || "Active",
    terminationDate: employeeData?.terminationDate || "",
    branch: employeeData?.branch?.id || "",
    dedactionDescriptive: employeeData?.dedactionDescriptive || "",
    department: employeeData?.department?.deptId || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departmentTree, setDepartmentTree] = useState<DepartmentTree[]>([]);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState("");
  const [icfOptions, setIcfOptions] = useState<IcfOption[]>([]);
  const [jobResponsibilityOptions, setJobResponsibilityOptions] = useState<
    JobResponsibilityOption[]
  >([]);
  const [recruitmentTypeOptions, setRecruitmentTypeOptions] = useState<
    RecruitmentTypeOption[]
  >([]);
  const [nationOptions, setNationOptions] = useState<NationOption[]>([]);
  const [nationalityOptions, setNationalityOptions] = useState<
    NationalityOption[]
  >([]);
  const [religionOptions, setReligionOptions] = useState<ReligionOption[]>([]);
  const [branchOptions, setBranchOptions] = useState<BranchOption[]>([]);
  const [employmentTypeOptions, setEmploymentTypeOptions] = useState<
    EmploymentTypeOption[]
  >([]);
  const [titleOptions, setTitleOptions] = useState<TitleOption[]>([]);
  const [jobFamilyOptions, setJobFamilyOptions] = useState<JobFamilyOption[]>(
    []
  );
  const [positionNameOptions, setPositionNameOptions] = useState<
    PositionNameOption[]
  >([]);
  const [jobTypeOptions, setJobTypeOptions] = useState<JobTitleOption[]>([]);
  const [incrementSteps, setIncrementSteps] = useState<SalaryStepDto[]>([]);

  // Fetch job details when jobType changes
  useEffect(() => {
    if (formData.jobType) {
      const fetchJobDetails = async () => {
        try {
          const response = await authFetch(
            `http://localhost:8080/api/job-types/by-job-title/${formData.jobType}`
          );
          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              `Error fetching job details: ${response.status} ${response.statusText}`,
              errorText
            );
            throw new Error(
              `Network response was not ok: ${response.status} ${response.statusText}`
            );
          }
          const data = await response.json();
          setFormData((prev) => ({
            ...prev,
            jobFamily: data.jobFamilyId
              ? String(data.jobFamilyId)
              : data.jobFamily
              ? String(data.jobFamily.id || data.jobFamily)
              : "",
            jobGrade: data.jobGrade || "",
          }));
        } catch (error) {
          console.error("Error fetching job details:", error);
        }
      };
      fetchJobDetails();
    }
  }, [formData.jobType]);

  // Fetch increment steps when jobType and icf change
  useEffect(() => {
    if (formData.jobType && formData.icf) {
      const fetchIncrementSteps = async () => {
        try {
          const response = await authFetch(
            `http://localhost:8080/api/salary/steps?jobTitleId=${formData.jobType}&icfId=${formData.icf}`
          );
          if (!response.ok) {
            const errorText = await response.text();
            console.error(
              `Error fetching increment steps: ${response.status} ${response.statusText}`,
              errorText
            );
            throw new Error(
              `Failed to fetch increment steps. Status: ${response.status}`
            );
          }
          const steps = await response.json();
          setIncrementSteps(steps);
          if (steps.length === 1) {
            setFormData((prev) => ({
              ...prev,
              retirementNo: steps[0].stepNo.toString(),
            }));
            fetchSalaryForStep(steps[0].stepNo);
          }
        } catch (error) {
          console.error("Error fetching increment steps:", error);
          setIncrementSteps([]);
        }
      };
      fetchIncrementSteps();
    } else {
      setIncrementSteps([]);
    }
  }, [formData.jobType, formData.icf]);

  const fetchSalaryForStep = async (stepNo: number) => {
    if (!formData.jobType || !formData.icf) return;
    let rawResponseText = "";
    try {
      const response = await authFetch(
        `http://localhost:8080/api/salary/salary-for-step?jobTitleId=${formData.jobType}&icfId=${formData.icf}&stepNo=${stepNo}`
      );
      rawResponseText = await response.text();
      if (!response.ok) {
        console.error(
          `Error fetching salary: HTTP ${response.status} ${response.statusText}. Response body: ${rawResponseText}`
        );
        throw new Error(`Failed to fetch salary. Status: ${response.status}`);
      }
      const salaryValue = rawResponseText;
      setFormData((prev) => ({
        ...prev,
        salary: String(salaryValue),
      }));
    } catch (error) {
      console.error(
        "Error in fetchSalaryForStep:",
        error,
        "\nRaw response text was:",
        `"${rawResponseText}"`
      );
      setFormData((prev) => ({ ...prev, salary: "" }));
    }
  };

  // Fetch all dropdown options
  useEffect(() => {
    const fetchData = async (url: string, endpointName: string) => {
      const response = await authFetch(url);
      const responseText = await response.text();
      if (!response.ok) {
        console.error(
          `Error fetching ${endpointName}: ${response.status} ${response.statusText}. Response body:`,
          responseText
        );
        throw new Error(
          `Failed to fetch ${endpointName}. Status: ${response.status}`
        );
      }
      return JSON.parse(responseText);
    };

    const fetchDropdownOptions = async () => {
      try {
        const dataSources = [
          {
            name: "Departments",
            url: "http://localhost:8080/api/departments",
            setter: setDepartmentTree,
          },
          {
            name: "Job Types",
            url: "http://localhost:8080/api/lu-job-types",
            setter: setJobTypeOptions,
          },
          {
            name: "ICFs",
            url: "http://localhost:8080/api/icfs",
            setter: setIcfOptions,
          },
          {
            name: "Job Responsibilities",
            url: "http://localhost:8080/api/responsibilities",
            setter: setJobResponsibilityOptions,
          },
          {
            name: "Recruitment Types",
            url: "http://localhost:8080/api/recruitment-types",
            setter: setRecruitmentTypeOptions,
          },
          {
            name: "Nations",
            url: "http://localhost:8080/api/nations",
            setter: setNationOptions,
          },
          {
            name: "Nationalities",
            url: "http://localhost:8080/api/nationalities",
            setter: setNationalityOptions,
          },
          {
            name: "Religions",
            url: "http://localhost:8080/api/religions",
            setter: setReligionOptions,
          },
          {
            name: "Branches",
            url: "http://localhost:8080/api/hr-lu-branch",
            setter: setBranchOptions,
          },
          {
            name: "Employment Types",
            url: "http://localhost:8080/api/employment-types",
            setter: setEmploymentTypeOptions,
          },
          {
            name: "Titles",
            url: "http://localhost:8080/api/titles",
            setter: setTitleOptions,
          },
          {
            name: "Job Families",
            url: "http://localhost:8080/api/job-families",
            setter: setJobFamilyOptions,
          },
          {
            name: "Position Names",
            url: "http://localhost:8080/api/position-names",
            setter: setPositionNameOptions,
          },
        ];
        const fetchPromises = dataSources.map((source) =>
          fetchData(source.url, source.name)
        );
        const results = await Promise.allSettled(fetchPromises);
        results.forEach((result, index) => {
          const source = dataSources[index];
          if (result.status === "fulfilled") {
            source.setter(result.value);
          } else {
            console.error(
              `Could not load data for dropdown: ${source.name}. Reason: ${result.reason.message}`
            );
            source.setter([]);
          }
        });
      } catch (error) {
        console.error(
          "Critical error occurred while setting up dropdown option fetches:",
          error
        );
      }
    };

    fetchDropdownOptions();
  }, []);

  // Set initial department name if editing
  useEffect(() => {
    if (employeeData?.department?.deptId && departmentTree.length > 0) {
      const findDeptName = (
        depts: DepartmentTree[],
        deptId: number
      ): string => {
        for (const dept of depts) {
          if (dept.deptId === deptId) return dept.depName;
          if (dept.children) {
            const name = findDeptName(dept.children, deptId);
            if (name) return name;
          }
        }
        return "";
      };
      const name = findDeptName(departmentTree, employeeData.department.deptId);
      setSelectedDepartmentName(name || employeeData.department.depName || "");
    }
  }, [employeeData, departmentTree]);

  const handleDepartmentSelect = (dept: DepartmentDto) => {
    setFormData((prev) => ({ ...prev, department: dept.deptId }));
    setSelectedDepartmentName(dept.deptName);
    setIsDepartmentModalOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const parseNumericInput = (
      value: string | number | undefined | null
    ): number | null => {
      if (
        value === null ||
        value === undefined ||
        value.toString().trim() === ""
      ) {
        return null;
      }
      const num = parseFloat(value.toString());
      return isNaN(num) ? null : num;
    };

    const jobFamilyId = parseNumericInput(formData.jobFamily);

    try {
      const submittedData = {
        ...formData,
        jobGrade: formData.jobGrade,
        nationality: formData.nationality
          ? { nationalityId: Number(formData.nationality) }
          : null,
        religion: formData.religion ? { id: Number(formData.religion) } : null,
        nation: formData.nation
          ? { nationCode: Number(formData.nation) }
          : null,
        jobType: formData.jobType ? { id: Number(formData.jobType) } : null,
        icf: formData.icf ? { id: Number(formData.icf) } : null,
        jobResponsibility: formData.jobResponsibility
          ? { id: Number(formData.jobResponsibility) }
          : null,
        jobFamily: jobFamilyId !== null ? { id: jobFamilyId } : null,
        position: formData.position ? { id: Number(formData.position) } : null,
        title: formData.title ? { titleId: Number(formData.title) } : null,
        employmentType: formData.employmentType
          ? { id: Number(formData.employmentType) }
          : null,
        recruitmentType: formData.recruitmentType
          ? { recruitmentType: formData.recruitmentType }
          : null,
        branch: formData.branch ? { id: Number(formData.branch) } : null,
        department: formData.department
          ? { deptId: Number(formData.department) }
          : null,
        salary: parseNumericInput(formData.salary),
        pensionNumber: parseNumericInput(formData.pensionNumber),
        retirementNo: parseNumericInput(formData.retirementNo),
        tinNumer: parseNumericInput(formData.tinNumer),
        accountNo: parseNumericInput(formData.accountNo),
      };

      onSubmit(submittedData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
          {isEditMode ? "Edit Employee" : "Create New Employee"}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Employee ID:
                </label>
                <input
                  type="text"
                  name="empId"
                  value={formData.empId}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  First Name:
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Middle Name:
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Last Name:
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Date Of Birth:
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Gender:
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Title:
                </label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                >
                  <option value="">--Select Title--</option>
                  {titleOptions.map((option) => (
                    <option key={option.titleId} value={option.titleId}>
                      {option.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Marital Status:
                </label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                >
                  <option value="">-select one--</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Work Unit:
                </label>
                <input
                  type="text"
                  value={selectedDepartmentName}
                  onClick={() => setIsDepartmentModalOpen(true)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs cursor-pointer"
                  placeholder="Select Department"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Job Title:
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                >
                  <option value="">--Select Job Type--</option>
                  {jobTypeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.jobTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  ICF:
                </label>
                <select
                  name="icf"
                  value={formData.icf}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                >
                  <option value="">--Select ICF--</option>
                  {icfOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.icf}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Salary:
                </label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Pension Number:
                </label>
                <input
                  type="text"
                  name="pensionNumber"
                  value={formData.pensionNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Job Responsibility:
                </label>
                <select
                  name="jobResponsibility"
                  value={formData.jobResponsibility}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                >
                  <option value="">--Select Job Responsibility--</option>
                  {jobResponsibilityOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.responsibility}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Position Name:
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                >
                  <option value="">--Select Position Name--</option>
                  {positionNameOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Directorate:
                </label>
                <input
                  type="text"
                  name="tess"
                  value={formData.tess}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Branch:
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                >
                  <option value="">--Select Branch--</option>
                  {branchOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.branchName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  First Name in English:
                </label>
                <input
                  type="text"
                  name="efirstName"
                  value={formData.efirstName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Middle Name in English:
                </label>
                <input
                  type="text"
                  name="emiddleName"
                  value={formData.emiddleName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Last Name in English:
                </label>
                <input
                  type="text"
                  name="elastName"
                  value={formData.elastName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Nation:
                </label>
                <select
                  name="nation"
                  value={formData.nation}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                >
                  <option value="">--Select Nation--</option>
                  {nationOptions.map((option) => (
                    <option key={option.nationCode} value={option.nationCode}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Nationality:
                </label>
                <select
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                >
                  <option value="">--Select Nationality--</option>
                  {nationalityOptions.map((option) => (
                    <option
                      key={option.nationalityId}
                      value={option.nationalityId}
                    >
                      {option.nationalityName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Religion:
                </label>
                <select
                  name="religion"
                  value={formData.religion}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                >
                  <option value="">--Select Religion--</option>
                  {religionOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Contract End Date:
                </label>
                <input
                  type="date"
                  name="contractEnd"
                  value={formData.contractEnd}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Employment Type:
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                >
                  <option value="">--Select Employment Type--</option>
                  {employmentTypeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Recruitment Type:
                </label>
                <select
                  name="recruitmentType"
                  value={formData.recruitmentType}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                >
                  <option value="">--Select Recruitment Type--</option>
                  {recruitmentTypeOptions.map((option) => (
                    <option
                      key={option.recruitmentType}
                      value={option.recruitmentType}
                    >
                      {option.recruitmentType}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Job Family:
                </label>
                <input
                  type="text"
                  name="jobFamily"
                  value={formData.jobFamily}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Job Class:
                </label>
                <input
                  type="text"
                  name="jobGrade"
                  value={formData.jobGrade}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Increment Step:
                </label>
                <select
                  name="retirementNo"
                  value={formData.retirementNo}
                  onChange={(e) => {
                    const newStepNo = e.target.value;
                    setFormData({ ...formData, retirementNo: newStepNo });
                    if (newStepNo) {
                      fetchSalaryForStep(parseInt(newStepNo));
                    } else {
                      setFormData((prev) => ({ ...prev, salary: "" }));
                    }
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                >
                  <option value="">--Select Increment Step--</option>
                  {incrementSteps.map((step) => (
                    <option key={step.stepNo} value={step.stepNo}>
                      Step {step.stepNo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  TIN Number:
                </label>
                <input
                  type="text"
                  name="tinNumer"
                  value={formData.tinNumer}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Hired Date:
                </label>
                <input
                  type="date"
                  name="hiredDate"
                  value={formData.hiredDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Account No:
                </label>
                <input
                  type="text"
                  name="accountNo"
                  value={formData.accountNo}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Position Status:
                </label>
                <select
                  name="positionStatus"
                  value={formData.positionStatus}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                >
                  <option value="">-Select One--</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 text-xs">
                  Division:
                </label>
                <input
                  type="text"
                  name="terminationDate"
                  value={formData.terminationDate}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 text-xs">
              Decision:
            </label>
            <textarea
              name="dedactionDescriptive"
              value={formData.dedactionDescriptive}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dedactionDescriptive: e.target.value,
                })
              }
              placeholder="Write what you change"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-24 text-xs"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 text-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white rounded-md hover:bg-[#367fa9] focus:outline-none focus:ring-2 focus:ring-[#367fa9] focus:ring-offset-2 text-sm disabled:opacity-50"
              style={{ backgroundColor: "#3c8dbc" }}
            >
              {isSubmitting
                ? "Processing..."
                : isEditMode
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
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
