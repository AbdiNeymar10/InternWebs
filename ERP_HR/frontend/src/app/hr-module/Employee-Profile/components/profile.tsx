"use client";

import { useState, useRef, useEffect } from "react";
import { authFetch } from "@/utils/authFetch";
import { FiUser, FiCamera, FiEdit2, FiSearch } from "react-icons/fi";

// --- TYPE DEFINITIONS ---

type PositionDetail = {
  id: number;
  name: string;
  salary?: string | number;
};

type Department = {
  deptId: number;
  depName: string;
  parentDeptId?: number;
};

type NationalityDetail = {
  nationalityId: number;
  nationalityDescription?: string;
  nationalityName: string;
};

type ReligionDetail = { id: number; name?: string };
type NationDetail = { nationCode: number; name?: string };
type JobTitleDetail = { id: number; jobTitle?: string };
type IcfDetail = { id: number; icf?: string };
type JobResponsibilityDetail = { id: number; responsibility?: string };
type TitleDetail = { titleId: number; title?: string };
type EmploymentTypeDetail = { id: number; type?: string };
type RecruitmentTypeDetail = { recruitmentType: string; description?: string };
type JobFamilyDetail = { id: number; familyName?: string };
type BranchDetail = { id: number; branchName?: string };

type Employee = {
  id: number;
  empId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  efirstName?: string;
  emiddleName?: string;
  elastName?: string;
  gender: string;
  dateOfBirth: string;
  nationality?: string | NationalityDetail | null;
  position?: PositionDetail | null;
  department?: Department | null;
  status: string | number | null;
  photo?: string;
  religion?: ReligionDetail | null;
  maritalStatus?: string;
  nation?: NationDetail | null;
  contractEnd?: string;
  jobType?: JobTitleDetail | null;
  icf?: IcfDetail | null;
  salary?: string | number;
  pensionNumber?: string;
  jobResponsibility?: JobResponsibilityDetail | null;
  tess?: string;
  title?: TitleDetail | null;
  employmentType?: EmploymentTypeDetail | null;
  recruitmentType?: RecruitmentTypeDetail | string | null;
  jobFamily?: JobFamilyDetail | null;
  jobGrade?: string;
  retirementNo?: string;
  rankId?: string;
  tinNumer?: string;
  hiredDate?: string;
  accountNo?: string;
  terminationDate?: string;
  branch?: BranchDetail | null;
  dedactionDescriptive?: string;
  birthDate?: string;
  [key: string]: any;
};

// Maps backend search result to minimal Employee type
const mapSearchResultToEmployee = (result: {
  id: string;
  name: string;
  department: string;
}): Employee => ({
  id: parseInt(result.id, 10),
  empId: result.id,
  firstName: result.name.split(" ")[0] || "",
  lastName: result.name.split(" ").slice(1).join(" ") || "",
  position: { id: 0, name: "Unknown" },
  department: { deptId: 0, depName: result.department },
  status: null,
  gender: "Unknown",
  dateOfBirth: "",
});

// --- COMPONENT ---

interface EmployeeProfileProps {
  employee?: Employee;
  onEdit?: () => void;
  allEmployees?: Employee[];
  onEmployeeSelect?: (employee: Employee) => void;
}

export default function EmployeeProfile({
  employee,
  onEdit,
  allEmployees = [],
  onEmployeeSelect,
}: EmployeeProfileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | undefined>(() =>
    employee?.photo ? `data:image/jpeg;base64,${employee.photo}` : undefined
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Employee[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | undefined>(
    employee
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  interface EmployeeProfileProps {
    employee?: Employee;
    onEdit?: () => void;
    allEmployees?: Employee[];
    onEmployeeSelect?: (employee: Employee) => void;
  }

  useEffect(() => {
    if (employee) {
      setCurrentEmployee(employee);
      // Only update profileImage if employee.photo is defined and non-empty
      setProfileImage(
        employee.photo ? `data:image/jpeg;base64,${employee.photo}` : undefined
      );
    }
  }, [employee]);

  const mapEmployeeResponse = (data: any): Employee => ({
    id: data.id || parseInt(data.empId, 10),
    empId: data.empId,
    firstName: data.firstName || "",
    middleName: data.middleName,
    lastName: data.lastName || "",
    efirstName: data.efirstName,
    emiddleName: data.emiddleName,
    elastName: data.elastName,
    gender: data.sex || "Unknown",
    dateOfBirth: data.dateOfBirth || data.birthDate || "",
    nationality: data.nationality
      ? {
          nationalityId: data.nationality.nationalityId,
          nationalityName: data.nationality.nationalityName,
          nationalityDescription: data.nationality.nationalityDescription,
        }
      : null,
    position: data.position
      ? {
          id: Number(data.position.id),
          name: data.position.positionName || data.position.name || "Unknown",
          salary:
            data.position.salary !== undefined
              ? String(data.position.salary)
              : undefined,
        }
      : data.payGrade
      ? {
          id: Number(data.payGrade.payGradeId),
          name: data.payGrade.payGradeName || "Unknown",
          salary:
            data.payGrade.salary !== undefined
              ? String(data.payGrade.salary)
              : undefined,
        }
      : null,
    department: data.department
      ? {
          deptId: data.department.deptId,
          depName: data.department.depName || "Unknown",
        }
      : null,
    status:
      data.empStatus != null ? data.empStatus : data.positionStatus || null,
    photo: data.photo || undefined, // Ensure photo is preserved or set to undefined if null
    religion: data.religion
      ? { id: Number(data.religion.id), name: data.religion.name }
      : null,
    maritalStatus: data.maritalStatus,
    nation: data.nation
      ? { nationCode: Number(data.nation.nationCode), name: data.nation.name }
      : null,
    contractEnd: data.contractEnd,
    jobType: data.jobType
      ? { id: Number(data.jobType.id), jobTitle: data.jobType.jobTitle }
      : null,
    icf: data.icf ? { id: Number(data.icf.id), icf: data.icf.icf } : null,
    salary: data.salary !== undefined ? String(data.salary) : "",
    pensionNumber: data.pensionNumber,
    jobResponsibility: data.jobResponsibility
      ? {
          id: Number(data.jobResponsibility.id),
          responsibility: data.jobResponsibility.responsibility,
        }
      : null,
    tess: data.tess,
    title: data.title
      ? { titleId: Number(data.title.titleId), title: data.title.title }
      : null,
    employmentType: data.employmentType
      ? { id: Number(data.employmentType.id), type: data.employmentType.type }
      : null,
    recruitmentType: data.recruitmentType,
    jobFamily: data.jobFamily
      ? { id: Number(data.jobFamily.id), familyName: data.jobFamily.familyName }
      : null,
    jobGrade: data.jobGrade,
    retirementNo: data.retirementNo,
    rankId: data.rankId,
    tinNumer: data.tinNumer,
    hiredDate: data.hiredDate,
    accountNo: data.accountNo,
    terminationDate: data.terminationDate,
    branch: data.branch
      ? { id: Number(data.branch.id), branchName: data.branch.branchName }
      : null,
    dedactionDescriptive: data.dedactionDescriptive,
    birthDate: data.birthDate || data.dateOfBirth || "",
  });

  const fetchEmployeeDetails = async (
    empId: string
  ): Promise<Employee | null> => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await authFetch(
        `http://localhost:8080/api/employees/${empId}/with-relations`
      );
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(
          `Failed to fetch employee details: Status ${response.status}, ${errorBody}`
        );
        throw new Error(
          response.status === 404
            ? `Employee not found with ID: ${empId}`
            : `Failed to fetch employee details: ${response.statusText}`
        );
      }
      const data = await response.json();
      const employee = mapEmployeeResponse(data);
      return employee;
    } catch (err: any) {
      console.error("Error fetching employee details:", err.message);
      setError(
        err.message || "Failed to load employee details. Please try again."
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusDisplay = (
    status: string | number | null | undefined
  ): string => {
    if (status === null || status === undefined || status === "") return "N/A";
    if (typeof status === "number") {
      if (status === 1) return "Active";
      if (status === 0) return "Inactive";
      return `Unknown (${status})`;
    }
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "active") return "Active";
    if (lowerStatus === "inactive") return "Inactive";
    if (lowerStatus === "on leave") return "On Leave";
    return status;
  };

  const handleImageError = () => {
    setProfileImage(undefined);
  };
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentEmployee) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError("Image size exceeds 10MB limit.");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64Image = event.target.result as string;
          const base64Data = base64Image.split(",")[1]; // Extract base64 data

          try {
            // Optimistic update
            setProfileImage(base64Image);
            setError(null);

            const response = await fetch(
              `http://localhost:8080/api/employees/${currentEmployee.empId}/image`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profileImage: base64Data }),
              }
            );

            if (!response.ok) {
              setProfileImage(
                currentEmployee.photo
                  ? `data:image/jpeg;base64,${currentEmployee.photo}`
                  : undefined
              );
              const errorData = await response.json();
              throw new Error(
                errorData.error ||
                  `Failed to upload image: ${response.statusText}`
              );
            }

            setSuccessMessage("Image uploaded successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);

            // Refresh employee details
            const updatedEmployee = await fetchEmployeeDetails(
              currentEmployee.empId
            );
            if (updatedEmployee) {
              setCurrentEmployee(updatedEmployee);
              setProfileImage(
                updatedEmployee.photo
                  ? `data:image/jpeg;base64,${updatedEmployee.photo}`
                  : undefined
              );
              if (onEmployeeSelect) {
                onEmployeeSelect(updatedEmployee);
              }
            }
          } catch (err: any) {
            console.error("Error uploading image:", err);
            setError(err.message || "Failed to upload image to the database.");
            setSuccessMessage(null);
            setProfileImage(
              currentEmployee.photo
                ? `data:image/jpeg;base64,${currentEmployee.photo}`
                : undefined
            );
          }
        }
      };
      reader.onerror = () => {
        setError("Failed to read the image file.");
        setProfileImage(
          currentEmployee.photo
            ? `data:image/jpeg;base64,${currentEmployee.photo}`
            : undefined
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 0) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authFetch(
          `http://localhost:8080/api/employees/search?query=${encodeURIComponent(
            term
          )}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch search results: ${response.statusText}`
          );
        }
        const results: { id: string; name: string; department: string }[] =
          await response.json();
        const mappedResults = results.map(mapSearchResultToEmployee);
        setSearchResults(mappedResults);
        setShowResults(true);
      } catch (error) {
        console.error("Error searching employees:", error);
        setError("Error searching employees. Please try again.");
        const filtered: Employee[] = allEmployees.filter(
          (emp: Employee) =>
            emp.empId.toString().includes(term) ||
            `${emp.firstName} ${emp.lastName}`
              .toLowerCase()
              .includes(term.toLowerCase())
        );
        setSearchResults(filtered);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const handleEmployeeSelect = async (selectedEmployee: Employee) => {
    setIsLoading(true);
    const detailedEmployee = await fetchEmployeeDetails(selectedEmployee.empId);
    if (detailedEmployee) {
      setCurrentEmployee(detailedEmployee);
      setSearchTerm("");
      setShowResults(false);
      if (onEmployeeSelect) {
        onEmployeeSelect(detailedEmployee);
      }
    }
    setIsLoading(false);
  };

  if (!currentEmployee) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 mt-6 flex items-center justify-center">
        <div className="text-gray-500">No employee selected</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 mt-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 sm:p-6">
          {error && (
            <div className="mb-4 text-red-600 text-xs sm:text-sm">{error}</div>
          )}
          {successMessage && (
            <div className="mb-4 text-green-600 text-xs sm:text-sm">
              {successMessage}
            </div>
          )}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-4 sm:gap-6">
            <div className="flex-1 w-full min-w-0">
              <div className="relative w-full mb-4 sm:mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400 text-sm" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search employee ID or name..."
                  className="block w-full pl-10 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
                {isLoading && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                  </div>
                )}
                {showResults && searchResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-1 max-h-60 overflow-auto text-xs sm:text-sm">
                    {searchResults.map((emp) => (
                      <div
                        key={emp.empId}
                        className="px-3 sm:px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleEmployeeSelect(emp)}
                      >
                        <div className="font-semibold">
                          {emp.empId} - {emp.firstName} {emp.lastName}
                        </div>
                        <div className="text-gray-600 text-xs">
                          {typeof emp.department === "object" && emp.department
                            ? emp.department.depName
                            : emp.department}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {showResults &&
                  searchResults.length === 0 &&
                  searchTerm &&
                  !isLoading && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg py-2 px-3 sm:px-4 text-gray-500 text-xs sm:text-sm">
                      No employees found
                    </div>
                  )}
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center border-b border-gray-200 pb-2 sm:pb-3">
                  <span className="w-20 sm:w-24 text-xs sm:text-sm text-gray-600 font-semibold">
                    ID
                  </span>
                  <span className="text-xs sm:text-sm text-gray-800">
                    {currentEmployee.empId}
                  </span>
                </div>
                <div className="flex items-center border-b border-gray-200 pb-2 sm:pb-3">
                  <span className="w-20 sm:w-24 text-xs sm:text-sm text-gray-600 font-semibold">
                    Name
                  </span>
                  <span className="text-xs sm:text-sm text-gray-800">
                    {currentEmployee.firstName} {currentEmployee.middleName}{" "}
                    {currentEmployee.lastName}
                  </span>
                </div>
                <div className="flex items-center border-b border-gray-200 pb-2 sm:pb-3">
                  <span className="w-20 sm:w-24 text-xs sm:text-sm text-gray-600 font-semibold">
                    Position
                  </span>
                  <span className="text-xs sm:text-sm text-gray-800">
                    {typeof currentEmployee.position === "object" &&
                    currentEmployee.position
                      ? currentEmployee.position.name
                      : currentEmployee.position}
                  </span>
                </div>
                <div className="flex items-center border-b border-gray-200 pb-2 sm:pb-3">
                  <span className="w-20 sm:w-24 text-xs sm:text-sm text-gray-600 font-semibold">
                    Department
                  </span>
                  <span className="text-xs sm:text-sm text-gray-800">
                    {typeof currentEmployee.department === "object" &&
                    currentEmployee.department
                      ? currentEmployee.department.depName
                      : currentEmployee.department}
                  </span>
                </div>
                <div className="flex items-center border-b border-gray-200 pb-2 sm:pb-3">
                  <span className="w-20 sm:w-24 text-xs sm:text-sm text-gray-600 font-semibold">
                    Status
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      getStatusDisplay(currentEmployee.status) === "Active"
                        ? "text-green-600"
                        : getStatusDisplay(currentEmployee.status) ===
                          "Inactive"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {getStatusDisplay(currentEmployee.status) || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center w-full sm:w-auto mt-4 sm:mt-0 min-w-0 sm:min-w-[200px]">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="flex items-center px-3 py-1.5 rounded-lg hover:bg-[#367fa9] transition-colors shadow-md hover:shadow-lg mb-3 sm:mb-4 text-xs"
                  style={{ backgroundColor: "#3c8dbc" }}
                >
                  <FiEdit2 className="mr-1.5 text-xs text-white" />
                  <span className="text-white">Edit</span>
                </button>
              )}
              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-100 flex items-center justify-center overflow-hidden shadow-md rounded-lg">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiUser
                        size={48}
                        className="text-gray-400 sm:w-16 sm:h-16"
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={handleImageUploadClick}
                  className="absolute -bottom-2 -right-2 bg-white p-1.5 sm:p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors border border-gray-200 hover:shadow-lg"
                >
                  <FiCamera size={16} className="text-blue-600 sm:w-5 sm:h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <span className="text-xs sm:text-sm text-gray-600 font-semibold mt-2 sm:mt-3">
                {profileImage ? "Profile Photo" : "Add Photo"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
