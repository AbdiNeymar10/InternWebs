"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  FiX,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiInfo,
  FiMinus,
  FiPlus,
  FiRefreshCw,
  FiSave,
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

const API_BASE_URL = "http://localhost:8080/api";

// --- Holiday Data ---
const HOLIDAYS_LIST = [
  "2024-01-01",
  "2024-01-07",
  "2024-01-19",
  "2024-03-02",
  "2024-05-01",
  "2024-05-05",
  "2024-05-28",
  "2024-09-11",
  "2024-09-27",
  "2025-01-01",
  "2025-01-07",
];

function isHoliday(date: Date, holidays: string[]): boolean {
  const dateString = date.toISOString().split("T")[0];
  return holidays.includes(dateString);
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

// --- Interfaces ---
interface LookupOption {
  id: number;
  name: string;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: number;
  leaveStart: string;
  leaveEnd: string;
  requestedDays: number;
  dayType: string;
  description: string;
  incidentType?: string;
  status: string;
  leaveType?: {
    id: number;
    leaveName: string;
  };
}

interface LeaveSubmissionEmailDetails {
  employeeId: string;
  employeeName: string;
  leaveTypeName: string;
  incidentTypeName?: string;
  leaveStart: string;
  leaveEnd: string;
  requestedDays: number;
  description?: string;
}

interface NewLeaveTypeData {
  leaveName: string;
  leaveCode: string;
}

interface LeaveBalanceData {
  balanceId?: number;
  initialBalance: number;
  currentBalance: number; // This IS the remaining days from DB (CURRENT_BALANCE column) or defaulted by service
  usedDays: number;
  leaveYear: number;
}

interface LeaveBalanceAPIResponse {
  status: string;
  message?: string;
  data?: LeaveBalanceData;
}

interface LeaveScheduleItem {
  id: number;
  leaveYearId: number;
  employeeId: string;
  status: string | null;
  description: string | null;
}

interface LeaveScheduleAPIResponse {
  status: string;
  message?: string;
  data?: LeaveScheduleItem[];
}

// --- API Fetch Functions ---
async function fetchWrapper(url: string, options?: RequestInit) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let errorData = { message: `HTTP error! status: ${response.status}` };
      try {
        const jsonError = await response.json();
        errorData.message =
          jsonError.message ||
          jsonError.error ||
          (typeof jsonError === "string" ? jsonError : errorData.message);
      } catch (e) {
        if (response.statusText) {
          errorData.message = `HTTP error! status: ${response.status} - ${response.statusText}`;
        }
      }
      throw new Error(errorData.message);
    }
    if (
      response.status === 204 ||
      !response.headers.get("content-type")?.includes("application/json")
    ) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`API call failed to ${url}:`, error);
    throw error;
  }
}

async function fetchEmployee(employeeId: string) {
  if (!employeeId || !employeeId.trim()) return null;
  return fetchWrapper(`${API_BASE_URL}/leave/employee/${employeeId}`);
}

async function getLeaveHistory(employeeId: string): Promise<LeaveRequest[]> {
  if (!employeeId || !employeeId.trim()) return [];
  try {
    const response = await fetchWrapper(
      `${API_BASE_URL}/leave/employee/${employeeId}/requests`
    );
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Failed to fetch leave history:", error);
    toast.error("Could not load leave history.");
    return [];
  }
}

async function fetchLeaveBalance(
  employeeId: string
): Promise<LeaveBalanceAPIResponse | null> {
  if (!employeeId || !employeeId.trim()) return null;
  try {
    const response = await fetchWrapper(
      `${API_BASE_URL}/leave/balance/${employeeId}`
    );
    return response as LeaveBalanceAPIResponse;
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Could not load leave balance details",
      data: undefined,
    };
  }
}

async function fetchLeaveSchedules(
  employeeId: string
): Promise<LeaveScheduleAPIResponse | null> {
  if (!employeeId || !employeeId.trim()) return null;
  try {
    const response = await fetchWrapper(
      `${API_BASE_URL}/leave/schedules/employee/${employeeId}`
    );
    return response as LeaveScheduleAPIResponse;
  } catch (error) {
    console.error("Failed to fetch leave schedules:", error);
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Could not load leave schedules.",
      data: undefined,
    };
  }
}

async function fetchAvailableLeaveTypes(): Promise<LookupOption[]> {
  try {
    const response = await fetchWrapper(`${API_BASE_URL}/leave-types`);
    if (Array.isArray(response)) {
      return response.map((item) => ({
        id: item.id,
        name: item.leaveName,
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch leave types:", error);
    toast.error("Could not load leave types. Please try again.");
    return [];
  }
}

async function createNewLeaveTypeAPI(
  leaveTypeData: NewLeaveTypeData
): Promise<LookupOption | null> {
  try {
    const response = await fetchWrapper(`${API_BASE_URL}/leave-types`, {
      method: "POST",
      body: JSON.stringify(leaveTypeData),
    });
    if (response && response.id && response.leaveName) {
      return { id: response.id, name: response.leaveName };
    }
    return null;
  } catch (error) {
    console.error("Failed to create new leave type:", error);
    throw error;
  }
}

async function fetchAvailableIncidentTypes(): Promise<LookupOption[]> {
  try {
    const response = await fetchWrapper(`${API_BASE_URL}/incident-types`);
    if (Array.isArray(response)) {
      return response.map((item) => ({
        id: item.id,
        name: item.incidentName,
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch incident types:", error);
    toast.error("Could not load incident types. Please try again.");
    return [];
  }
}

async function createLeaveRequest(requestData: any) {
  const payload = {
    employeeId: requestData.employeeId,
    leaveTypeId: requestData.leaveTypeId
      ? Number(requestData.leaveTypeId)
      : null,
    incidentType: requestData.incidentType || null,
    leaveStart: requestData.leaveStart,
    leaveEnd: requestData.leaveEnd,
    requestedDays: requestData.requestedDays,
    dayType: requestData.dayType,
    description: requestData.description,
  };
  return fetchWrapper(`${API_BASE_URL}/leave/request`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

async function requestEmailNotificationForLeaveSubmission(
  details: LeaveSubmissionEmailDetails
) {
  try {
    await fetchWrapper(`${API_BASE_URL}/leave/notify/submission`, {
      method: "POST",
      body: JSON.stringify(details),
    });
  } catch (error) {
    console.error("Failed to request email notification from backend:", error);
  }
}

// --- Default States and Component ---
const getDefaultEmployee = (empId?: string) => ({
  firstName: "N/A",
  lastName: "",
  employeeId: empId || "N/A",
  department: "N/A",
  hiredDate: null,
});

const initialLeaveBalanceState: LeaveBalanceData = {
  initialBalance: 0,
  currentBalance: 0,
  usedDays: 0,
  leaveYear: new Date().getFullYear(),
  balanceId: undefined,
};

const ANNUAL_LEAVE_TOTAL_DAYS = 30; // Fixed total for display

export default function LeaveRequestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [employeeId, setEmployeeId] = useState("");
  const [selectedLeaveTypeId, setSelectedLeaveTypeId] = useState("");
  const [selectedIncidentTypeName, setSelectedIncidentTypeName] =
    useState<string>("");
  const [leaveStart, setLeaveStart] = useState("");
  const [noDays, setNoDays] = useState(1);
  const [dayType, setDayType] = useState("full-day");
  const [description, setDescription] = useState("");
  const [returnDay, setReturnDay] = useState("");
  const [leaveEndForPayload, setLeaveEndForPayload] = useState("");
  const [actualRequestedDays, setActualRequestedDays] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isLeaveTypesLoading, setIsLeaveTypesLoading] = useState(true);
  const [isIncidentTypesLoading, setIsIncidentTypesLoading] = useState(true);
  const [isLeaveSchedulesLoading, setIsLeaveSchedulesLoading] = useState(false);
  const [isIncidentTypeEnabled, setIsIncidentTypeEnabled] = useState(false);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [leaveHistory, setLeaveHistory] = useState<LeaveRequest[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalanceData>(
    initialLeaveBalanceState
  );
  const [leaveSchedules, setLeaveSchedules] = useState<LeaveScheduleItem[]>([]);
  const [availableLeaveTypes, setAvailableLeaveTypes] = useState<
    LookupOption[]
  >([]);
  const [availableIncidentTypes, setAvailableIncidentTypes] = useState<
    LookupOption[]
  >([]);
  const [showNewLeaveTypeModal, setShowNewLeaveTypeModal] = useState(false);
  const [newLeaveTypeName, setNewLeaveTypeName] = useState("");
  const [newLeaveTypeCode, setNewLeaveTypeCode] = useState("");
  const [isSavingNewLeaveType, setIsSavingNewLeaveType] = useState(false);

  // Derived state for the balance modal table
  const balanceDataForModalTable =
    // If balanceId is present OR if currentBalance is not the default 0 (meaning service provided a default)
    leaveBalance.balanceId !== undefined ||
    leaveBalance.currentBalance !== 0 ||
    leaveBalance.initialBalance !== 0
      ? [
          {
            id: leaveBalance.balanceId,
            leaveYear: leaveBalance.leaveYear,
            totalAllotted: ANNUAL_LEAVE_TOTAL_DAYS,
            currentBalance: leaveBalance.currentBalance,
            usedDays: leaveBalance.usedDays,
          },
        ]
      : [];

  const dayTypesOptions = [
    { label: "Full Day", value: "full-day" },
    { label: "Half Day", value: "half-day" },
    { label: "On/Off", value: "on-off" },
  ];

  useEffect(() => {
    const loadLookups = async () => {
      setIsLeaveTypesLoading(true);
      setIsIncidentTypesLoading(true);
      try {
        const [leaveTypesData, incidentTypesData] = await Promise.all([
          fetchAvailableLeaveTypes(),
          fetchAvailableIncidentTypes(),
        ]);
        setAvailableLeaveTypes(leaveTypesData);
        setAvailableIncidentTypes(incidentTypesData);
      } catch (error) {
        /* Errors already toasted */
      } finally {
        setIsLeaveTypesLoading(false);
        setIsIncidentTypesLoading(false);
      }
    };
    loadLookups();
  }, []);

  const loadAllData = useCallback(async () => {
    if (!employeeId || !employeeId.trim()) {
      setEmployeeData(null);
      setLeaveHistory([]);
      setLeaveBalance(initialLeaveBalanceState);
      setLeaveSchedules([]);
      setIsDataLoading(false);
      return;
    }
    setIsDataLoading(true);
    try {
      const [emp, hist, balanceResponse] = await Promise.all([
        fetchEmployee(employeeId),
        getLeaveHistory(employeeId),
        fetchLeaveBalance(employeeId),
      ]);
      setEmployeeData(emp || getDefaultEmployee(employeeId));
      setLeaveHistory(Array.isArray(hist) ? hist : []);

      if (
        balanceResponse &&
        balanceResponse.status === "success" &&
        balanceResponse.data
      ) {
        setLeaveBalance({
          initialBalance: balanceResponse.data.initialBalance ?? 0,
          currentBalance: balanceResponse.data.currentBalance ?? 0,
          usedDays: balanceResponse.data.usedDays ?? 0,
          leaveYear: balanceResponse.data.leaveYear ?? new Date().getFullYear(),
          balanceId: balanceResponse.data.balanceId,
        });
      } else {
        // If backend service returns a default when no record, this 'else' might not be hit
        // for "no record" cases if the service always provides a data object.
        // However, it's good for handling actual API errors.
        setLeaveBalance(initialLeaveBalanceState);
        if (
          balanceResponse?.status === "error" &&
          !balanceResponse?.message
            ?.toLowerCase()
            .includes("no active leave balance found") &&
          !balanceResponse?.message
            ?.toLowerCase()
            .includes("returning a default virtual balance") // Don't toast if service provided default
        ) {
          toast.error(
            balanceResponse.message ||
              "Could not retrieve leave balance details."
          );
        }
      }
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while loading employee data."
      );
      setEmployeeData(getDefaultEmployee(employeeId));
      setLeaveHistory([]);
      setLeaveBalance(initialLeaveBalanceState);
    } finally {
      setIsDataLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    if (employeeId && employeeId.trim()) {
      const debounceTimer = setTimeout(() => loadAllData(), 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setEmployeeData(null);
      setLeaveHistory([]);
      setLeaveBalance(initialLeaveBalanceState);
      setLeaveSchedules([]);
    }
  }, [employeeId, loadAllData]);

  const calculateLeaveDetails = useCallback(() => {
    if (!leaveStart || noDays <= 0) {
      setLeaveEndForPayload("");
      setReturnDay("");
      setActualRequestedDays(0);
      return;
    }
    setIsCalculating(true);
    const startDate = new Date(leaveStart);
    if (isNaN(startDate.getTime())) {
      setIsCalculating(false);
      setLeaveEndForPayload("");
      setReturnDay("");
      setActualRequestedDays(0);
      return;
    }
    let currentDay = new Date(startDate);
    let lastDayOfLeave: Date | null = null;
    let calculatedActualDaysValue = 0;

    if (dayType === "full-day") {
      let workDaysApplied = 0;
      currentDay = new Date(startDate);
      while (workDaysApplied < noDays) {
        if (!isWeekend(currentDay) && !isHoliday(currentDay, HOLIDAYS_LIST)) {
          workDaysApplied++;
          lastDayOfLeave = new Date(currentDay);
        }
        if (workDaysApplied < noDays)
          currentDay.setDate(currentDay.getDate() + 1);
        else if (workDaysApplied === noDays) break;
      }
      calculatedActualDaysValue = noDays;
    } else if (dayType === "half-day") {
      lastDayOfLeave = new Date(startDate);
      let tempDay = new Date(startDate);
      let daysCounted = 0;
      while (daysCounted < noDays) {
        lastDayOfLeave = new Date(tempDay);
        daysCounted++;
        if (daysCounted < noDays) tempDay.setDate(tempDay.getDate() + 1);
      }
      calculatedActualDaysValue = noDays * 0.5;
    } else if (dayType === "on-off") {
      let onDaysApplied = 0;
      currentDay = new Date(startDate);
      while (onDaysApplied < noDays) {
        while (isWeekend(currentDay) || isHoliday(currentDay, HOLIDAYS_LIST))
          currentDay.setDate(currentDay.getDate() + 1);
        lastDayOfLeave = new Date(currentDay);
        onDaysApplied++;
        if (onDaysApplied < noDays)
          currentDay.setDate(currentDay.getDate() + 1);
        else break;
      }
      calculatedActualDaysValue = noDays;
    }

    setTimeout(() => {
      if (lastDayOfLeave) {
        setLeaveEndForPayload(lastDayOfLeave.toISOString().split("T")[0]);
        let returnToWorkDate = new Date(lastDayOfLeave);
        returnToWorkDate.setDate(returnToWorkDate.getDate() + 1);
        while (
          isWeekend(returnToWorkDate) ||
          isHoliday(returnToWorkDate, HOLIDAYS_LIST)
        )
          returnToWorkDate.setDate(returnToWorkDate.getDate() + 1);
        setReturnDay(returnToWorkDate.toISOString().split("T")[0]);
      } else {
        setLeaveEndForPayload("");
        setReturnDay("");
      }
      setActualRequestedDays(calculatedActualDaysValue);
      setIsCalculating(false);
    }, 300);
  }, [leaveStart, noDays, dayType]);

  useEffect(() => {
    if (leaveStart && noDays > 0) calculateLeaveDetails();
    else {
      setLeaveEndForPayload("");
      setReturnDay("");
      setActualRequestedDays(0);
    }
  }, [leaveStart, noDays, dayType, calculateLeaveDetails]);

  useEffect(() => {
    const selectedType = availableLeaveTypes.find(
      (lt) => lt.id.toString() === selectedLeaveTypeId
    );
    setIsIncidentTypeEnabled(selectedType?.name === "የእክል");
    if (selectedType?.name !== "የእክል") setSelectedIncidentTypeName("");
  }, [selectedLeaveTypeId, availableLeaveTypes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !employeeId ||
      !employeeId.trim() ||
      !employeeData ||
      employeeData.firstName === "N/A"
    ) {
      toast.error("Valid Employee ID and loaded data are required.");
      return;
    }
    if (!selectedLeaveTypeId) {
      toast.error("Please select a Leave Type.");
      return;
    }
    if (!leaveStart) {
      toast.error("Leave Start Date is required.");
      return;
    }
    if (!returnDay || !leaveEndForPayload) {
      toast.error("Leave End & Return Date must be calculated.");
      return;
    }
    if (noDays <= 0) {
      toast.error("Number of days/units must be at least 1.");
      return;
    }
    if (actualRequestedDays <= 0) {
      toast.error("Calculated leave days must be > 0.");
      return;
    }
    if (isIncidentTypeEnabled && !selectedIncidentTypeName) {
      toast.error("Incident Type is required for 'የእክል' leave.");
      return;
    }

    const newRequestPayload = {
      employeeId,
      leaveTypeId: Number(selectedLeaveTypeId),
      incidentType: isIncidentTypeEnabled
        ? selectedIncidentTypeName || null
        : null,
      leaveStart,
      leaveEnd: leaveEndForPayload,
      requestedDays: actualRequestedDays,
      dayType,
      description,
    };
    setIsLoading(true);
    try {
      const createdRequest = await createLeaveRequest(newRequestPayload);
      toast.success("Leave requested successfully!");
      if (createdRequest && employeeData) {
        const selectedLeaveType = availableLeaveTypes.find(
          (lt) => lt.id.toString() === selectedLeaveTypeId
        );
        await requestEmailNotificationForLeaveSubmission({
          employeeId,
          employeeName: `${employeeData.firstName || ""} ${
            employeeData.lastName || ""
          }`,
          leaveTypeName: selectedLeaveType?.name || "N/A",
          incidentTypeName: isIncidentTypeEnabled
            ? selectedIncidentTypeName || undefined
            : undefined,
          leaveStart,
          leaveEnd: returnDay,
          requestedDays: actualRequestedDays,
          description: description || undefined,
        });
      }
      formRef.current?.reset();
      setLeaveStart("");
      setReturnDay("");
      setLeaveEndForPayload("");
      setSelectedLeaveTypeId("");
      setSelectedIncidentTypeName("");
      setNoDays(1);
      setDayType("full-day");
      setDescription("");
      setActualRequestedDays(0);
      if (employeeId) loadAllData();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit leave request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNewLeaveType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeaveTypeName.trim() || !newLeaveTypeCode.trim()) {
      toast.error("Leave Name and Code are required.");
      return;
    }
    setIsSavingNewLeaveType(true);
    try {
      const createdLeaveType = await createNewLeaveTypeAPI({
        leaveName: newLeaveTypeName,
        leaveCode: newLeaveTypeCode,
      });
      if (createdLeaveType) {
        setAvailableLeaveTypes((prev) => [...prev, createdLeaveType]);
        setSelectedLeaveTypeId(createdLeaveType.id.toString());
        toast.success(`Leave Type "${createdLeaveType.name}" created!`);
        setShowNewLeaveTypeModal(false);
        setNewLeaveTypeName("");
        setNewLeaveTypeCode("");
      } else toast.error("Failed to create leave type: No response.");
    } catch (error: any) {
      toast.error(error.message || "Error creating leave type.");
    } finally {
      setIsSavingNewLeaveType(false);
    }
  };

  const handleShowScheduleModal = async () => {
    if (!employeeId || !employeeId.trim()) {
      toast.error("Please enter an Employee ID first.");
      setShowSchedule(false);
      return;
    }
    setShowSchedule(true);
    setIsLeaveSchedulesLoading(true);
    setLeaveSchedules([]);
    try {
      const response = await fetchLeaveSchedules(employeeId);
      if (response && response.status === "success" && response.data) {
        setLeaveSchedules(response.data);
      } else {
        setLeaveSchedules([]);
        if (response && response.message && response.status !== "success") {
          if (
            !response.message.toLowerCase().includes("no leave schedules found")
          ) {
            toast.error(
              response.message || "Could not retrieve leave schedules."
            );
          }
        } else if (!response) {
          toast.error(
            "Failed to load leave schedules. Check console for details."
          );
        }
      }
    } catch (error: any) {
      setLeaveSchedules([]);
      toast.error(
        error.message || "An error occurred while fetching leave schedules."
      );
    } finally {
      setIsLeaveSchedulesLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 font-sans relative overflow-hidden">
      <Toaster
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
            padding: "16px",
            color: "#333",
          },
        }}
      />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc]/10 to-purple-50 opacity-30"></div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Buttons and Header ... (same as before) ... */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 4px 12px rgba(60, 141, 188, 0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowHistory(true)}
              disabled={!employeeId || isDataLoading}
              className={`px-4 py-2 bg-[#93c3e1] text-black rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 hover:shadow-md ${
                !employeeId || isDataLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <FiCalendar size={16} />
              History
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 4px 12px rgba(60, 141, 188, 0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowBalance(true)}
              disabled={!employeeId || isDataLoading}
              className={`px-4 py-2 bg-[#93c3e1] text-black rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 hover:shadow-md ${
                !employeeId || isDataLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <FiInfo size={16} />
              Annual Leave Balance
            </motion.button>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 4px 12px rgba(60, 141, 188, 0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShowScheduleModal}
              disabled={!employeeId || !employeeId.trim() || isDataLoading}
              className={`px-4 py-2 bg-[#93c3e1] text-black rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 hover:shadow-md ${
                !employeeId || !employeeId.trim() || isDataLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <FiChevronUp size={16} />
              Annual Leave Schedule
            </motion.button>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, type: "spring" }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#3c8dbc] bg-clip-text bg-gradient-to-r from-[#3c8dbc] to-[#5c9dce] inline-block">
                Leave Request
              </h1>
            </div>
            {(isLoading ||
              isDataLoading ||
              isLeaveTypesLoading ||
              isIncidentTypesLoading ||
              isLeaveSchedulesLoading) && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="text-[#3c8dbc]"
              >
                <FiRefreshCw className="w-6 h-6" />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Form JSX ... (Keep the entire form structure as it was) ... */}
        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl border border-[#3c8dbc]/30 shadow-2xl overflow-hidden p-6 lg:p-8 transition-all duration-300 hover:shadow-lg"
        >
          {/* All form fields go here, no changes needed in this section for this specific request */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label
                  htmlFor="employeeId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="employeeId"
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all duration-200 shadow-sm"
                    placeholder="Enter employee ID"
                    required
                  />
                  <FiUser className="absolute right-3 top-3 text-gray-400" />
                </div>
                {employeeData &&
                  employeeData.firstName &&
                  employeeData.firstName !== "N/A" && (
                    <p className="text-sm text-gray-600 mt-1">
                      {employeeData.firstName} {employeeData.lastName}
                    </p>
                  )}
                {employeeData &&
                  employeeData.firstName === "N/A" &&
                  employeeId &&
                  !isDataLoading && (
                    <p className="text-sm text-red-500 mt-1">
                      Employee not found.
                    </p>
                  )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label
                  htmlFor="incidentTypeName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Incident Type{" "}
                  {isIncidentTypeEnabled ? (
                    <span className="text-red-500">*</span>
                  ) : (
                    "(Optional)"
                  )}
                </label>
                <div className="relative">
                  <select
                    id="incidentTypeName"
                    value={selectedIncidentTypeName}
                    onChange={(e) =>
                      setSelectedIncidentTypeName(e.target.value)
                    }
                    className={`w-full px-4 py-2.5 appearance-none border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all duration-200 shadow-sm ${
                      !isIncidentTypeEnabled
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                        : "border-gray-300"
                    }`}
                    disabled={isIncidentTypesLoading || !isIncidentTypeEnabled}
                    required={isIncidentTypeEnabled}
                  >
                    <option value="">
                      {isIncidentTypesLoading
                        ? "Loading types..."
                        : isIncidentTypeEnabled
                        ? "-- Select Incident --"
                        : "-- Select Leave Type first --"}
                    </option>
                    {availableIncidentTypes.map((type) => (
                      <option key={`incident-opt-${type.id}`} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label
                  htmlFor="leaveStart"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Leave Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="leaveStart"
                    type="date"
                    value={leaveStart}
                    onChange={(e) => setLeaveStart(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent pr-10 transition-all duration-200 shadow-sm"
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <FiCalendar className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <label
                  htmlFor="returnDay"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Return to Work Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="returnDay"
                    type="text"
                    value={returnDay || "Calculated automatically"}
                    readOnly
                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 shadow-sm"
                  />
                  {returnDay && (
                    <FiCalendar className="absolute right-3 top-3 text-gray-400" />
                  )}
                </div>
              </motion.div>
            </div>
            {/* Right Column */}
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label
                  htmlFor="leaveType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-grow">
                    <select
                      id="leaveType"
                      value={selectedLeaveTypeId}
                      onChange={(e) => setSelectedLeaveTypeId(e.target.value)}
                      className="w-full px-4 py-2.5 appearance-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all duration-200 shadow-sm"
                      required
                      disabled={isLeaveTypesLoading}
                    >
                      <option value="">
                        {isLeaveTypesLoading
                          ? "Loading types..."
                          : "-- Select One --"}
                      </option>
                      {availableLeaveTypes.map((type) => (
                        <option
                          key={`leave-type-opt-${type.id}`}
                          value={type.id.toString()}
                        >
                          {type.name}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => setShowNewLeaveTypeModal(true)}
                    className="p-2.5 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#3c8dbc]/90 transition-colors shadow-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Add new leave type"
                  >
                    <FiPlus size={18} />
                  </motion.button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label
                  htmlFor="noDays"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Number of Days/Units <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <motion.button
                    type="button"
                    onClick={() => setNoDays((prev) => Math.max(1, prev - 1))}
                    className="p-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-gray-700 shadow-sm"
                    whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Decrease days"
                  >
                    <FiMinus size={18} />
                  </motion.button>
                  <input
                    id="noDays"
                    type="number"
                    min="1"
                    value={noDays}
                    onChange={(e) =>
                      setNoDays(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent text-center transition-all duration-200 shadow-sm"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setNoDays((prev) => prev + 1)}
                    className="p-2 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-gray-700 shadow-sm"
                    whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Increase days"
                  >
                    <FiPlus size={18} />
                  </motion.button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Actual requested leave days: {actualRequestedDays.toFixed(1)}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3"
              >
                <div>
                  <label
                    htmlFor="dayType"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Day Type
                  </label>
                  <div className="relative">
                    <select
                      id="dayType"
                      value={dayType}
                      onChange={(e) => setDayType(e.target.value)}
                      className="w-full px-4 py-2.5 appearance-none border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all duration-200 shadow-sm"
                    >
                      {dayTypesOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex items-end">
                  <motion.button
                    type="button"
                    onClick={calculateLeaveDetails}
                    disabled={!leaveStart || isCalculating || noDays <= 0}
                    className={`px-4 py-2.5 rounded-lg font-medium text-sm w-full md:w-auto ${
                      !leaveStart || isCalculating || noDays <= 0
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#3c8dbc] text-white hover:bg-[#3c8dbc]/90 shadow-md"
                    } transition-all duration-200 flex items-center justify-center`}
                    whileHover={
                      !leaveStart || isCalculating || noDays <= 0
                        ? {}
                        : { scale: 1.05 }
                    }
                    whileTap={
                      !leaveStart || isCalculating || noDays <= 0
                        ? {}
                        : { scale: 0.95 }
                    }
                  >
                    {isCalculating ? (
                      <span className="flex items-center">
                        <FiRefreshCw className="animate-spin mr-2 w-4 h-4" />
                        Calculating
                      </span>
                    ) : (
                      "Calculate"
                    )}
                  </motion.button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
              >
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all duration-200 shadow-sm"
                  placeholder="Enter additional information..."
                ></textarea>
              </motion.div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="mt-10 flex justify-center"
          >
            <motion.button
              type="submit"
              disabled={
                isLoading ||
                !employeeId ||
                !selectedLeaveTypeId ||
                !leaveStart ||
                !returnDay ||
                noDays <= 0 ||
                actualRequestedDays <= 0 ||
                (isIncidentTypeEnabled && !selectedIncidentTypeName)
              }
              className={`px-10 py-3.5 bg-gradient-to-r from-[#3c8dbc] to-[#5c9dce] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-300 shadow-md flex items-center gap-3 ${
                isLoading ||
                !employeeId ||
                !selectedLeaveTypeId ||
                !leaveStart ||
                !returnDay ||
                noDays <= 0 ||
                actualRequestedDays <= 0 ||
                (isIncidentTypeEnabled && !selectedIncidentTypeName)
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
              whileHover={
                isLoading ||
                !employeeId ||
                !selectedLeaveTypeId ||
                !leaveStart ||
                !returnDay ||
                noDays <= 0 ||
                actualRequestedDays <= 0 ||
                (isIncidentTypeEnabled && !selectedIncidentTypeName)
                  ? {}
                  : {
                      scale: 1.03,
                      boxShadow: "0 8px 20px rgba(60, 141, 188, 0.3)",
                    }
              }
              whileTap={{ scale: 0.99 }}
            >
              {isLoading ? (
                <>
                  <FiRefreshCw className="animate-spin w-5 h-5" />
                  Processing...
                </>
              ) : (
                "Submit Request"
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        <AnimatePresence>
          {/* History Modal (no changes needed for this request) */}
          {showHistory && employeeId && employeeId.trim() && (
            <motion.div
              key="history-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowHistory(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-[#3c8dbc]/30 bg-gradient-to-r from-[#3c8dbc]/10 to-[#3c8dbc]/5 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-[#3c8dbc]">
                    Leave History for {employeeData?.firstName || "Employee"}{" "}
                    {employeeData?.lastName || ""}
                  </h2>
                  <motion.button
                    onClick={() => setShowHistory(false)}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close history modal"
                  >
                    <FiX size={24} />
                  </motion.button>
                </div>
                <div className="overflow-auto flex-1 p-6">
                  {isDataLoading && leaveHistory.length === 0 ? (
                    <div className="text-center py-12">Loading history...</div>
                  ) : !isDataLoading && leaveHistory.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-center py-12"
                    >
                      <FiCalendar className="mx-auto text-gray-400" size={48} />
                      <h3 className="mt-4 text-lg font-medium text-gray-700">
                        No leave history found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        This employee hasn&apos;t submitted any leave requests
                        yet, or there was an issue fetching history.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white/90 rounded-xl border border-[#3c8dbc]/30 overflow-hidden shadow-sm"
                    >
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#3c8dbc]/30">
                          <thead className="bg-[#3c8dbc]/10">
                            <tr>
                              {[
                                "No",
                                "Year",
                                "Requested Days",
                                "Leave Start",
                                "Leave End",
                                "Type",
                                "Incident",
                                "Status",
                              ].map((header) => (
                                <th
                                  key={header}
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-[#3c8dbc] uppercase tracking-wider"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-[#3c8dbc]/20">
                            {leaveHistory.map((item, index) => (
                              <motion.tr
                                key={
                                  item.id && item.id.trim() !== ""
                                    ? `history-item-${item.id}`
                                    : `history-item-idx-${index}`
                                }
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-[#3c8dbc]/5 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {item.leaveStart
                                    ? new Date(item.leaveStart).getFullYear()
                                    : "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {item.requestedDays}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {item.leaveStart
                                    ? new Date(
                                        item.leaveStart
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {item.leaveEnd
                                    ? new Date(
                                        item.leaveEnd
                                      ).toLocaleDateString()
                                    : "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  <motion.span
                                    className={`px-3 py-1 rounded-full text-xs inline-block ${
                                      item.leaveType?.leaveName === "Annual"
                                        ? "bg-green-100 text-green-800"
                                        : item.leaveType?.leaveName === "Sick"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-purple-100 text-purple-800"
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    {item.leaveType?.leaveName || "N/A"}
                                  </motion.span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {item.incidentType || "N/A"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  <motion.span
                                    className={`px-3 py-1 rounded-full text-xs inline-block ${
                                      item.status === "Approved" ||
                                      item.status?.toUpperCase() === "APPROVED"
                                        ? "bg-green-100 text-green-800"
                                        : item.status === "Rejected" ||
                                          item.status?.toUpperCase() ===
                                            "REJECTED"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    {item.status || "Pending"}
                                  </motion.span>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div className="p-4 border-t border-[#3c8dbc]/30 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Showing {leaveHistory.length} of {leaveHistory.length}{" "}
                      records
                    </p>
                    <motion.button
                      onClick={() => setShowHistory(false)}
                      className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg text-sm font-medium hover:bg-[#3c8dbc]/90 transition-colors shadow-sm"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Balance Modal - Updated for new display logic */}
          {showBalance && employeeId && employeeId.trim() && (
            <motion.div
              key="balance-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowBalance(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-[#3c8dbc]/30 bg-gradient-to-r from-[#3c8dbc]/10 to-[#3c8dbc]/5 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-[#3c8dbc]">
                    Annual Leave Balance for{" "}
                    {employeeData?.firstName || "Employee"}{" "}
                    {employeeData?.lastName || ""}
                  </h2>
                  <motion.button
                    onClick={() => setShowBalance(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close balance modal"
                  >
                    <FiX size={24} />
                  </motion.button>
                </div>
                <div className="overflow-auto flex-1 p-6">
                  {isDataLoading &&
                  leaveBalance.balanceId === undefined &&
                  leaveBalance.currentBalance === 0 &&
                  leaveBalance.initialBalance === 0 ? (
                    <div className="text-center py-12">Loading balance...</div>
                  ) : leaveBalance.balanceId === undefined &&
                    leaveBalance.currentBalance === 0 &&
                    leaveBalance.initialBalance === 0 &&
                    !isDataLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-center py-12"
                    >
                      <FiInfo className="mx-auto text-gray-400" size={48} />
                      <h3 className="mt-4 text-lg font-medium text-gray-700">
                        Leave balance not available
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        No leave balance record found for this employee for the
                        current year.
                      </p>
                    </motion.div>
                  ) : (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/90 rounded-xl border border-[#3c8dbc]/30 overflow-hidden shadow-sm"
                      >
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-[#3c8dbc]/30">
                            <thead className="bg-[#3c8dbc]/10">
                              <tr>
                                {[
                                  "Leave Year",
                                  "Total Allotted",
                                  "Remaining Days",
                                  "Used Days",
                                ].map((header) => (
                                  <th
                                    key={header}
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-[#3c8dbc] uppercase tracking-wider"
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#3c8dbc]/20">
                              {balanceDataForModalTable.map((item, index) => (
                                <motion.tr
                                  key={
                                    item.id
                                      ? `balance-item-${item.id}`
                                      : `balance-item-idx-${index}`
                                  }
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="hover:bg-[#3c8dbc]/5 transition-colors"
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {item.leaveYear}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {item.totalAllotted} days
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                    <motion.span
                                      className={`px-3 py-1 rounded-full text-xs inline-block ${
                                        item.currentBalance > 15
                                          ? "bg-green-100 text-green-800"
                                          : item.currentBalance > 5
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      {item.currentBalance} days
                                    </motion.span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {item.usedDays} days
                                  </td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                      {/* Simplified Summary Section */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-6 p-5 bg-[#3c8dbc]/10 rounded-xl border border-[#3c8dbc]/30"
                      >
                        <h3 className="text-lg font-semibold text-[#3c8dbc] mb-3">
                          Annual Leave Summary
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1">
                              Standard Annual Allotment:
                            </p>
                            <p className="text-2xl font-bold text-[#3c8dbc]">
                              {ANNUAL_LEAVE_TOTAL_DAYS} days
                            </p>
                          </div>
                          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                            <p className="text-sm text-gray-600 mb-1">
                              Your Current Remaining Days:
                            </p>
                            <p className="text-2xl font-bold text-green-600">
                              {leaveBalance.currentBalance} days
                            </p>
                            {leaveBalance.balanceId !== undefined && ( // Show this only if a DB record was actually found
                              <p className="text-xs text-gray-500 mt-1">
                                (System record: {leaveBalance.initialBalance}{" "}
                                initial, {leaveBalance.usedDays} used)
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>
                <div className="p-4 border-t border-[#3c8dbc]/30 bg-gray-50 flex justify-end">
                  <motion.button
                    onClick={() => setShowBalance(false)}
                    className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg text-sm font-medium hover:bg-[#3c8dbc]/90 transition-colors shadow-sm"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Schedule Modal (no changes from previous version for this request) */}
          {showSchedule && (
            <motion.div
              key="schedule-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowSchedule(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-[#3c8dbc]/30 bg-gradient-to-r from-[#3c8dbc]/10 to-[#3c8dbc]/5 flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-[#3c8dbc]">
                    Annual Leave Schedule for{" "}
                    {employeeData?.firstName || "Employee"}{" "}
                    {employeeData?.lastName || ""}
                  </h2>
                  <motion.button
                    onClick={() => setShowSchedule(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close schedule modal"
                  >
                    <FiX size={24} />
                  </motion.button>
                </div>
                <div className="overflow-auto flex-1 p-6">
                  {isLeaveSchedulesLoading ? (
                    <div className="text-center py-12 text-lg font-medium text-gray-600">
                      <FiRefreshCw className="animate-spin inline-block mr-3 w-6 h-6 text-[#3c8dbc]" />
                      Loading schedules...
                    </div>
                  ) : leaveSchedules.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-center py-12"
                    >
                      <FiCalendar className="mx-auto text-gray-400" size={48} />
                      <h3 className="mt-4 text-lg font-medium text-gray-700">
                        No Leave Schedules Found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        This employee does not have any leave schedules
                        recorded, or there was an issue fetching the data.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white/90 rounded-xl border border-[#3c8dbc]/30 overflow-hidden shadow-sm"
                    >
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#3c8dbc]/30">
                          <thead className="bg-[#3c8dbc]/10">
                            <tr>
                              {[
                                "Schedule ID",
                                "Year ID",
                                "Status",
                                "Description",
                              ].map((header) => (
                                <th
                                  key={header}
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-[#3c8dbc] uppercase tracking-wider"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-[#3c8dbc]/20">
                            {leaveSchedules.map((schedule, index) => (
                              <motion.tr
                                key={
                                  schedule.id
                                    ? `schedule-item-${schedule.id}`
                                    : `schedule-item-idx-${index}`
                                }
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-[#3c8dbc]/5 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {schedule.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {schedule.leaveYearId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                      schedule.status === "Approved"
                                        ? "bg-green-100 text-green-800"
                                        : schedule.status === "Pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : schedule.status === "Rejected"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {schedule.status || "N/A"}
                                  </span>
                                </td>
                                <td
                                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate"
                                  title={schedule.description || undefined}
                                >
                                  {schedule.description || "N/A"}
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div className="p-4 border-t border-[#3c8dbc]/30 bg-gray-50 flex justify-end">
                  <motion.button
                    onClick={() => setShowSchedule(false)}
                    className="px-4 py-2 bg-[#3c8dbc] text-white rounded-lg text-sm font-medium hover:bg-[#3c8dbc]/90 transition-colors shadow-sm"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* New Leave Type Modal (no changes from previous version) */}
          <AnimatePresence>
            {showNewLeaveTypeModal && (
              <motion.div
                key="new-leave-type-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[101] p-4"
                onClick={() => setShowNewLeaveTypeModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: 20, opacity: 0 }}
                  transition={{ type: "spring", damping: 20, stiffness: 250 }}
                  className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-5 flex justify-between items-center border-b border-gray-200 bg-slate-50">
                    <h2 className="text-xl font-semibold text-[#3c8dbc]">
                      Add New Leave Type
                    </h2>
                    <motion.button
                      onClick={() => setShowNewLeaveTypeModal(false)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-200 transition-colors"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Close new leave type form"
                    >
                      <FiX size={22} />
                    </motion.button>
                  </div>
                  <form
                    onSubmit={handleSaveNewLeaveType}
                    className="p-6 space-y-5"
                  >
                    <div>
                      <label
                        htmlFor="newLeaveTypeName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Leave Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="newLeaveTypeName"
                        type="text"
                        value={newLeaveTypeName}
                        onChange={(e) => setNewLeaveTypeName(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent"
                        placeholder="e.g., Annual Leave"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="newLeaveTypeCode"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Leave Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="newLeaveTypeCode"
                        type="text"
                        value={newLeaveTypeCode}
                        onChange={(e) => setNewLeaveTypeCode(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent"
                        placeholder="e.g., AL001"
                        required
                      />
                    </div>
                    <div className="mt-6 pt-5 border-t border-gray-200 flex justify-end gap-3">
                      <motion.button
                        type="submit"
                        disabled={isSavingNewLeaveType}
                        className="px-5 py-2.5 text-sm bg-gradient-to-r from-[#3c8dbc] to-[#5c9dce] text-white rounded-lg hover:shadow-md transition-all font-medium flex items-center"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isSavingNewLeaveType ? (
                          <FiRefreshCw className="animate-spin mr-2" />
                        ) : (
                          <FiSave className="mr-2" />
                        )}
                        {isSavingNewLeaveType ? "Saving..." : "Save "}
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={() => setShowNewLeaveTypeModal(false)}
                        className="px-5 py-2.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </AnimatePresence>
      </div>
    </div>
  );
}
