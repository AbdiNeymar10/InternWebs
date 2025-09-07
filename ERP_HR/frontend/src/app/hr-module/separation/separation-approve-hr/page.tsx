"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  FiCalendar,
  FiUser,
  FiChevronDown,
  FiRefreshCw,
  FiList,
  FiAlertCircle,
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";
import { authFetch } from "@/utils/authFetch";

const API_BASE_URL = "http://localhost:8080/api";

interface EmployeeDetails {
  empId: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  hiredDate?: string;
  departmentName?: string;
  directorateName?: string;
  jobTitleName?: string;
  employmentType?: string;
  internalServiceYear?: string;
}

interface SeparationRequestDetails {
  id: string;
  employeeId: string;
  separationTypeId: string;
  separationType?: {
    separationTypeId: string;
    description: string;
  };
  requestDate: string;
  resignationDate?: string | null;
  description?: string | null; // Original employee additional info
  remark?: string | null; // Department's remark/comment
  comment?: string | null; // Original employee reason
  noOfDayLeft?: string | null;
  supportiveFileName?: string;
  status?: number;
}

async function fetchWrapper(url: string, options?: RequestInit) {
  const response = await authFetch(url, {
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
      errorData = await response.json();
    } catch (e) {
      errorData.message = response.statusText || errorData.message;
    }
    const errorMessage = `Failed to fetch ${url}: ${
      errorData.message || response.status
    }`;
    console.error(errorMessage, {
      url,
      options,
      responseStatus: response.status,
      errorData,
    });
    throw new Error(errorMessage);
  }
  if (
    response.status === 204 ||
    !response.headers.get("content-type")?.includes("application/json")
  ) {
    return null;
  }
  return response.json();
}

async function fetchSeparationRequestById(
  requestId: string
): Promise<SeparationRequestDetails | null> {
  if (!requestId) return null;
  return fetchWrapper(`${API_BASE_URL}/employee-separations/${requestId}`);
}

async function fetchEmployeeDetailsById(
  empId: string
): Promise<EmployeeDetails | null> {
  if (!empId || String(empId).trim() === "" || empId.toUpperCase() === "N/A") {
    console.warn("fetchEmployeeDetailsById called with invalid empId:", empId);
    return null;
  }
  try {
    const data = await fetchWrapper(
      `${API_BASE_URL}/employees/by-emp-id/${empId}`
    );
    if (!data) return null;
    return {
      empId: String(data.empId || ""),
      firstName: String(data.firstName || ""),
      middleName: String(data.middleName || ""),
      lastName: String(data.lastName || ""),
      gender: String(data.gender || ""),
      hiredDate: String(data.hiredDate || ""),
      departmentName: String(data.departmentName || "N/A"),
      directorateName: String(data.directorateName || "N/A"),
      jobTitleName: String(data.jobTitleName || "N/A"),
      employmentType: String(data.employmentType || ""),
      internalServiceYear: String(data.internalServiceYear || "N/A"),
    } as EmployeeDetails;
  } catch (error) {
    console.error(`Error fetching employee details for ID ${empId}:`, error);
    toast.error(`Could not load details for Employee ID: ${empId}`);
    return null;
  }
}

// Fetches requests approved by department (status=1), pending HR action
async function fetchAllDeptApprovedRequestsAPI(
  limit: number = 30
): Promise<SeparationRequestDetails[]> {
  try {
    const data = await fetchWrapper(
      `${API_BASE_URL}/employee-separations?status=1&sort=requestDate,desc`
    );
    const allDeptApprovedRaw = (data as SeparationRequestDetails[]) || [];
    const allDeptApprovedFiltered = allDeptApprovedRaw.filter(
      (req) =>
        req.employeeId &&
        req.employeeId.trim() !== "" &&
        req.employeeId.toUpperCase() !== "N/A"
    );
    return allDeptApprovedFiltered.slice(0, limit);
  } catch (error) {
    console.error(
      "Error fetching department-approved separation requests:",
      error
    );
    toast.error("Failed to fetch requests for HR approval.");
    throw error;
  }
}

export default function SeparationApproveHrPage() {
  const [employeeId, setEmployeeId] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [hiredDate, setHiredDate] = useState("");
  const [directorate, setDirectorate] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [internalServiceYear, setInternalServiceYear] = useState("");
  const [employeeType, setEmployeeType] = useState("");

  const [separationType, setSeparationType] = useState("");
  const [requestWaitingDays, setRequestWaitingDays] = useState("");
  const [resignationReason, setResignationReason] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [departmentComment, setDepartmentComment] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [resignationDate, setResignationDate] = useState("");
  const [supportiveFileNameFromRequest, setSupportiveFileNameFromRequest] =
    useState("");

  const [hrApprovedBy, setHrApprovedBy] = useState("");
  const [hrProcessedDate, setHrProcessedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [hrDecision, setHrDecision] = useState("");
  const [hrClearanceStatus, setHrClearanceStatus] = useState("");
  const [hrComment, setHrComment] = useState("");

  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isCheckingNew, setIsCheckingNew] = useState(false);
  const [currentRequestIdForApproval, setCurrentRequestIdForApproval] =
    useState<string | null>(null);

  const [newRequestsForHrCount, setNewRequestsForHrCount] = useState(0);
  const [requestsForHrList, setRequestsForHrList] = useState<
    SeparationRequestDetails[]
  >([]);
  const [showRequestsForHrList, setShowRequestsForHrList] = useState(false);

  const processedHrRequestIdsRef = useRef<Set<string>>(new Set());
  const hasShownInitialNotificationRef = useRef(false);

  const resetFormFields = useCallback(
    (clearCurrentRequest = true) => {
      setEmployeeId("");
      setFullName("");
      setGender("");
      setHiredDate("");
      setDirectorate("");
      setJobTitle("");
      setInternalServiceYear("");
      setEmployeeType("");
      setSeparationType("");
      setRequestWaitingDays("");
      setResignationReason("");
      setAdditionalInfo("");
      setDepartmentComment("");
      setRequestDate("");
      setResignationDate("");
      setSupportiveFileNameFromRequest("");

      if (clearCurrentRequest || currentRequestIdForApproval) {
        setHrApprovedBy("");
        setHrDecision("");
        setHrClearanceStatus("");
        setHrComment("");
        setHrProcessedDate(new Date().toISOString().split("T")[0]);
      }
      if (clearCurrentRequest) {
        setCurrentRequestIdForApproval(null);
      }
    },
    [currentRequestIdForApproval]
  );

  const checkForNewDeptApprovedRequests = useCallback(
    async (isInitialCheck = false) => {
      if (isCheckingNew || isLoadingDetails) return;
      setIsCheckingNew(true);

      try {
        const allTrulyPending = await fetchAllDeptApprovedRequestsAPI(); // Fresh fetch
        const countOfNewItemsForHr = allTrulyPending.filter(
          (req) =>
            !processedHrRequestIdsRef.current.has(req.id) &&
            req.id !== currentRequestIdForApproval // Exclude current and already processed
        ).length;

        setNewRequestsForHrCount(countOfNewItemsForHr);

        if (countOfNewItemsForHr > 0 && !showRequestsForHrList) {
          if (!hasShownInitialNotificationRef.current || !isInitialCheck) {
            toast.success(
              `${
                countOfNewItemsForHr > 30 ? "30+" : countOfNewItemsForHr
              } request(s) are now pending HR approval. Click 'View List'.`,
              { duration: 7000 }
            );
            if (isInitialCheck) {
              hasShownInitialNotificationRef.current = true;
            }
          }
        }
      } catch (error: any) {
        console.error("Error checking for new HR approval requests:", error);
        if (isInitialCheck) {
          toast.error("Could not check for new HR requests.");
        }
      } finally {
        setIsCheckingNew(false);
      }
    },
    [
      isCheckingNew,
      isLoadingDetails,
      // requestsForHrList, // No longer a direct dependency for count logic
      currentRequestIdForApproval,
      showRequestsForHrList,
    ]
  );

  const loadDataForApproval = useCallback(
    async (requestId: string) => {
      if (isLoadingDetails && currentRequestIdForApproval === requestId) return;
      if (isLoadingDetails) {
        toast("Please wait, another request is loading.", { icon: "⏳" });
        return;
      }
      setIsLoadingDetails(true);
      setCurrentRequestIdForApproval(requestId);

      // Hide the list as soon as a request is selected for loading
      setShowRequestsForHrList(false); // <--- HIDE LIST EARLY

      const loadingToastId = `loading-hr-${requestId}`;
      toast.loading(`Loading details for request ID: ${requestId}...`, {
        id: loadingToastId,
      });
      resetFormFields(false);

      try {
        const requestDetails = await fetchSeparationRequestById(requestId);
        if (!requestDetails) {
          toast.error(`Separation request with ID ${requestId} not found.`);
          setCurrentRequestIdForApproval(null);
          resetFormFields(true);
          processedHrRequestIdsRef.current.add(requestId); // Mark as processed even if not found
          toast.dismiss(loadingToastId);
          checkForNewDeptApprovedRequests(); // <--- Re-check for other pending items
          return;
        }

        setSeparationType(
          String(
            requestDetails.separationType?.description ||
              requestDetails.separationTypeId ||
              ""
          )
        );
        setRequestDate(String(requestDetails.requestDate?.split("T")[0] || ""));
        setResignationDate(
          String(requestDetails.resignationDate?.split("T")[0] || "")
        );
        setResignationReason(String(requestDetails.comment || ""));
        setAdditionalInfo(String(requestDetails.description || ""));
        setDepartmentComment(String(requestDetails.remark || ""));
        setRequestWaitingDays(String(requestDetails.noOfDayLeft || "N/A"));
        setSupportiveFileNameFromRequest(
          String(requestDetails.supportiveFileName || "No file attached")
        );

        const empIdFromRequest = String(requestDetails.employeeId || "").trim();
        setEmployeeId(empIdFromRequest || "N/A");

        if (
          empIdFromRequest &&
          empIdFromRequest.toUpperCase() !== "N/A" &&
          empIdFromRequest !== ""
        ) {
          const empDetails = await fetchEmployeeDetailsById(empIdFromRequest);
          if (empDetails) {
            setFullName(
              String(
                `${empDetails.firstName || ""} ${empDetails.middleName || ""} ${
                  empDetails.lastName || ""
                }`.trim()
              )
            );
            setGender(String(empDetails.gender || ""));
            setHiredDate(String(empDetails.hiredDate || ""));
            setDirectorate(String(empDetails.directorateName || "N/A"));
            setJobTitle(String(empDetails.jobTitleName || "N/A"));
            setEmployeeType(String(empDetails.employmentType || ""));
            setInternalServiceYear(
              String(empDetails.internalServiceYear || "N/A")
            );
          } else {
            setFullName(
              String(`Details not found for Emp ID: ${empIdFromRequest}`)
            );
            setJobTitle("N/A - Employee Details Fetch Failed");
            setGender("");
            setHiredDate("");
            setDirectorate("N/A - Employee Details Fetch Failed");
            setEmployeeType("");
            setInternalServiceYear("N/A");
          }
        } else {
          setFullName("Employee ID missing or invalid in request.");
          setGender("");
          setHiredDate("");
          setDirectorate("N/A - Employee ID Missing/Invalid");
          setJobTitle("N/A");
          setEmployeeType("");
          setInternalServiceYear("N/A");
        }

        toast.success(`Details for request ID ${requestId} loaded.`, {
          id: `loaded-hr-${requestId}`,
        });

        processedHrRequestIdsRef.current.add(requestId);
        // The list is already hidden. Now check if other items should make the "View List" banner reappear.
        checkForNewDeptApprovedRequests(); // <--- Re-check for other pending items
      } catch (error: any) {
        console.error("Failed to load data for HR approval:", error);
        toast.error(
          error.message ||
            "Failed to load request and employee details for HR approval."
        );
        setCurrentRequestIdForApproval(null);
        resetFormFields(true);
        checkForNewDeptApprovedRequests(); // <--- Also re-check on error
      } finally {
        setIsLoadingDetails(false);
        toast.dismiss(loadingToastId);
      }
    },
    [
      isLoadingDetails,
      currentRequestIdForApproval,
      resetFormFields,
      checkForNewDeptApprovedRequests,
    ]
  );

  const handleViewDeptApprovedRequestsClick = async () => {
    if (isLoadingDetails) return;

    if (showRequestsForHrList) {
      setShowRequestsForHrList(false);
      hasShownInitialNotificationRef.current = false;
      checkForNewDeptApprovedRequests();
    } else {
      setIsCheckingNew(true);
      const listLoadToastId = "hr-list-load";
      toast.loading("Fetching list of requests for HR approval...", {
        id: listLoadToastId,
      });
      try {
        const list = await fetchAllDeptApprovedRequestsAPI();
        const displayList = list.filter(
          (req) =>
            !processedHrRequestIdsRef.current.has(req.id) &&
            req.id !== currentRequestIdForApproval
        );
        setRequestsForHrList(displayList);
        setShowRequestsForHrList(true);
        if (displayList.length === 0) {
          toast.success("No requests currently pending HR approval.", {
            duration: 3000,
          });
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch list for HR approval.");
      } finally {
        setIsCheckingNew(false);
        toast.dismiss(listLoadToastId);
      }
    }
  };

  useEffect(() => {
    checkForNewDeptApprovedRequests(true);
    const intervalId = setInterval(
      () => checkForNewDeptApprovedRequests(false),
      60000 * 2.5
    );
    return () => clearInterval(intervalId);
  }, [checkForNewDeptApprovedRequests]);

  const handleHrDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRequestIdForApproval) {
      toast.error("No separation request selected for HR decision.");
      return;
    }
    if (
      !employeeId ||
      employeeId.toUpperCase() === "N/A" ||
      employeeId.trim() === ""
    ) {
      toast.error(
        "Employee ID for the current request is missing or invalid. Cannot submit decision."
      );
      return;
    }
    if (!hrProcessedDate) {
      toast.error("Please enter the processed date");
      return;
    }
    if (!hrDecision) {
      toast.error("Please select an HR decision");
      return;
    }
    if (!hrClearanceStatus) {
      toast.error("Please select a Clearance Status");
      return;
    }
    if (!hrApprovedBy.trim()) {
      toast.error("Approved By (HR) field is required.");
      return;
    }

    setIsLoadingDetails(true);
    const decisionToastId = "hr-decision-submit-toast";
    toast.loading("Submitting HR decision...", {
      id: decisionToastId,
    });

    try {
      const approvalRecordPayload = {
        separationRequestId: currentRequestIdForApproval,
        employeeId: employeeId,
        remark: `HR Decision: ${hrDecision}. Clearance: ${hrClearanceStatus}. Comment: ${hrComment}`,
        processedBy: hrApprovedBy,
        processedDate: hrProcessedDate,
        approvalStage: "HR",
      };

      let finalStatus = 3;
      if (hrDecision === "approved") {
        finalStatus = 2; // HR Approved
      } else if (hrDecision === "rejected") {
        finalStatus = 4; // HR Rejected
      }

      const mainRequestUpdatePayload: any = {
        status: finalStatus,
        remark: `HR Decision: ${hrDecision}. Clearance: ${hrClearanceStatus}. HR Comment by ${hrApprovedBy}: ${hrComment}`,
      };

      await fetchWrapper(
        `${API_BASE_URL}/employee-separations/${currentRequestIdForApproval}`,
        {
          method: "PUT",
          body: JSON.stringify(mainRequestUpdatePayload),
        }
      );

      toast.success(
        `HR decision for request ${currentRequestIdForApproval} submitted successfully!`,
        { id: decisionToastId }
      );
      processedHrRequestIdsRef.current.add(currentRequestIdForApproval);

      resetFormFields(true);
      checkForNewDeptApprovedRequests();
    } catch (error: any) {
      console.error("Error during HR decision submission: ", error);
      toast.error(error.message || "Failed to submit HR decision.", {
        id: decisionToastId,
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const formatDateForDisplay = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
        return dateString.split("T")[0];
      }
    } catch (e) {
      console.warn("Could not parse date for display:", dateString, e);
    }
    return dateString;
  };

  return (
    <div className="min-h-screen p-6 font-sans relative bg-slate-100">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc]/5 via-[#3c8dbc]/5 to-purple-500/5 opacity-30"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, type: "spring" }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#3c8dbc]">
            HR Separation Approval
          </h1>
          {isLoadingDetails && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="text-[#3c8dbc] mt-2 inline-block"
            >
              <FiRefreshCw className="w-6 h-6" />
            </motion.div>
          )}
        </motion.div>

        <div className="mb-6 flex justify-start items-center min-h-[60px]">
          <AnimatePresence mode="wait">
            {newRequestsForHrCount > 0 && !showRequestsForHrList && (
              <motion.div
                key="hr-notification-banner"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                className="p-3 bg-yellow-100 border border-yellow-400 rounded-lg shadow-sm flex items-center"
              >
                <FiAlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                <p className="text-sm font-medium text-yellow-800">
                  You have{" "}
                  {newRequestsForHrCount > 30 ? "30+" : newRequestsForHrCount}{" "}
                  request(s) pending HR approval.
                </p>
                <button
                  onClick={handleViewDeptApprovedRequestsClick}
                  disabled={isLoadingDetails || isCheckingNew}
                  className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold py-1 px-3 rounded-md shadow-sm flex items-center transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FiList className="mr-1 h-4 w-4" /> View List
                </button>
              </motion.div>
            )}

            {showRequestsForHrList && (
              <button
                onClick={handleViewDeptApprovedRequestsClick}
                disabled={isLoadingDetails || isCheckingNew}
                className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-3 rounded-md shadow-sm flex items-center transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Hide List
              </button>
            )}

            {newRequestsForHrCount === 0 &&
              !showRequestsForHrList &&
              !isCheckingNew &&
              !isLoadingDetails && (
                <motion.p
                  key="hr-no-pending-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.3 } }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  className="text-slate-500 text-sm"
                >
                  No requests currently pending HR approval.
                </motion.p>
              )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showRequestsForHrList && (
            <motion.div
              className="mb-6 space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-[#3c8dbc] mb-2">
                Requests Pending HR Approval:
              </h3>
              {requestsForHrList.length > 0
                ? requestsForHrList.map((notifReq) => (
                    <motion.div
                      key={notifReq.id}
                      layout
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        x: -300,
                        transition: { duration: 0.3, ease: "easeInOut" },
                      }}
                      className={`p-3.5 border rounded-lg shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer
                              ${
                                currentRequestIdForApproval === notifReq.id
                                  ? "bg-[#3c8dbc]/10 border-[#3c8dbc]/50 ring-2 ring-[#3c8dbc]"
                                  : "bg-white hover:bg-slate-50/70 border-slate-200"
                              }`}
                      onClick={() => {
                        if (
                          isLoadingDetails ||
                          currentRequestIdForApproval === notifReq.id
                        )
                          return;
                        loadDataForApproval(notifReq.id);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FiAlertCircle
                            className={`h-5 w-5 mr-2.5 flex-shrink-0 ${
                              currentRequestIdForApproval === notifReq.id
                                ? "text-[#3c8dbc]"
                                : "text-[#3c8dbc]/80"
                            }`}
                          />
                          <p
                            className={`text-sm font-medium ${
                              currentRequestIdForApproval === notifReq.id
                                ? "text-slate-800"
                                : "text-slate-700"
                            }`}
                          >
                            Request ID:{" "}
                            <span className="font-bold">{notifReq.id}</span>
                          </p>
                        </div>
                        <span
                          className={`text-xs ml-2 ${
                            currentRequestIdForApproval === notifReq.id
                              ? "text-slate-600"
                              : "text-slate-500"
                          }`}
                        >
                          Emp ID: {notifReq.employeeId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 pl-[2.125rem]">
                        Submitted on:{" "}
                        {formatDateForDisplay(notifReq.requestDate)}
                      </p>
                    </motion.div>
                  ))
                : !isCheckingNew && (
                    <p className="text-center text-slate-500 py-4">
                      No requests currently pending HR approval.
                    </p>
                  )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Employee Information Section */}
        <motion.div
          initial={false}
          animate={{ opacity: currentRequestIdForApproval ? 1 : 0.6 }}
          transition={{ duration: 0.2 }}
          className={`bg-white backdrop-blur-md rounded-xl border border-slate-200 shadow-xl overflow-hidden p-6 lg:p-8 mb-8 ${
            !currentRequestIdForApproval && "pointer-events-none"
          }`}
        >
          <h2 className="text-xl font-semibold text-[#3c8dbc] mb-6 pb-3 border-b border-slate-200">
            Employee Information
            {currentRequestIdForApproval &&
              employeeId &&
              employeeId.toUpperCase() !== "N/A" &&
              employeeId.trim() !== "" && (
                <span className="text-sm text-slate-500 ml-2">
                  (for Emp ID: {employeeId})
                </span>
              )}
          </h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label
                  htmlFor="employeeId-display-hr"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Employee ID:
                </label>
                <input
                  type="text"
                  id="employeeId-display-hr"
                  value={employeeId || "N/A"}
                  readOnly
                  className="w-full pl-3 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="fullName-display-hr"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Full Name:
                </label>
                <input
                  type="text"
                  id="fullName-display-hr"
                  value={fullName || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="gender-display-hr"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Gender:
                </label>
                <input
                  type="text"
                  id="gender-display-hr"
                  value={gender || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="hiredDate-display-hr"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Hired Date:
                </label>
                <input
                  type="text"
                  id="hiredDate-display-hr"
                  value={formatDateForDisplay(hiredDate) || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="directorate-display-hr"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Directorate:
                </label>
                <input
                  type="text"
                  id="directorate-display-hr"
                  value={directorate || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="jobTitle-display-hr"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Job Title:
                </label>
                <input
                  type="text"
                  id="jobTitle-display-hr"
                  value={jobTitle || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div className="md:col-span-1">
                <label
                  htmlFor="internalServiceYear-display-hr"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Internal Service Year:
                </label>
                <input
                  type="text"
                  id="internalServiceYear-display-hr"
                  value={internalServiceYear || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Employee Type:
                </label>
                <div className="flex gap-x-6 items-center pt-1">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="employeeType-display-hr"
                      value="Permanent"
                      checked={employeeType === "Permanent"}
                      readOnly
                      disabled
                      className="form-radio h-4 w-4 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-not-allowed"
                    />
                    <span className="ml-2 text-slate-700">Permanent</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="employeeType-display-hr"
                      value="Contract"
                      checked={employeeType === "Contract"}
                      readOnly
                      disabled
                      className="form-radio h-4 w-4 text-[#3c8dbc] focus:ring-[#3c8dbc] cursor-not-allowed"
                    />
                    <span className="ml-2 text-slate-700">Contract</span>
                  </label>
                  {employeeType &&
                    !["Permanent", "Contract"].includes(employeeType) && (
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          checked
                          readOnly
                          disabled
                          className="form-radio h-4 w-4 cursor-not-allowed"
                        />
                        <span className="ml-2 text-slate-700">
                          {employeeType || "Other"}
                        </span>
                      </label>
                    )}
                </div>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Request Information Section */}
        <motion.div
          initial={false}
          animate={{ opacity: currentRequestIdForApproval ? 1 : 0.6 }}
          transition={{ duration: 0.2 }}
          className={`bg-white backdrop-blur-md rounded-xl border border-slate-200 shadow-xl overflow-hidden p-6 lg:p-8 mb-8 ${
            !currentRequestIdForApproval && "pointer-events-none"
          }`}
        >
          <h2 className="text-xl font-semibold text-[#3c8dbc] mb-6 pb-3 border-b border-slate-200">
            Request Information
            {currentRequestIdForApproval && (
              <span className="text-sm text-slate-500 ml-2">
                (for Request ID: {currentRequestIdForApproval})
              </span>
            )}
          </h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label
                  htmlFor="separationType-display-hr"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Separation Type:
                </label>
                <input
                  type="text"
                  id="separationType-display-hr"
                  value={separationType || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="requestDate-display-hr"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Request Date:
                </label>
                <input
                  type="text"
                  id="requestDate-display-hr"
                  value={formatDateForDisplay(requestDate) || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="waitingDays-display-hr"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Waiting Days (from request):
                </label>
                <input
                  type="text"
                  id="waitingDays-display-hr"
                  value={requestWaitingDays || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="resignationDate-display-hr"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Resignation Date:
                </label>
                <input
                  type="text"
                  id="resignationDate-display-hr"
                  value={formatDateForDisplay(resignationDate) || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-1">
                <label
                  htmlFor="resignationReason-display-hr"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Employee Reason (Original):
                </label>
                <textarea
                  id="resignationReason-display-hr"
                  value={resignationReason || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                  rows={2}
                />
              </div>
              <div className="md:col-span-1">
                <label
                  htmlFor="additionalInfo-display-hr"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Additional Info (Original):
                </label>
                <textarea
                  id="additionalInfo-display-hr"
                  value={additionalInfo || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                  rows={2}
                />
              </div>
              {/* Department Comment and Supportive File next to each other */}
              <div className="md:col-span-1">
                <label
                  htmlFor="departmentComment-display-hr"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Department Comment:
                </label>
                <textarea
                  id="departmentComment-display-hr"
                  value={departmentComment || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                  rows={2}
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium  text-slate-600 mb-1">
                  Supportive File (from request):
                </label>
                <textarea
                  id="supprotiveFile-display-hr"
                  value={supportiveFileNameFromRequest || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                  rows={2}
                />
              </div>
            </div>
          </form>
        </motion.div>

        {/* HR Decision Section */}
        <motion.div
          initial={false}
          animate={{ opacity: currentRequestIdForApproval ? 1 : 0.6 }}
          transition={{ duration: 0.2 }}
          className={`bg-white backdrop-blur-md rounded-xl border border-slate-200 shadow-xl overflow-hidden p-6 lg:p-8 ${
            !currentRequestIdForApproval && "pointer-events-none"
          }`}
        >
          <h2 className="text-xl font-semibold text-[#3c8dbc] mb-6 pb-3 border-b border-slate-200">
            HR Decision
            {currentRequestIdForApproval && (
              <span className="text-sm text-slate-500 ml-2">
                (for Request ID: {currentRequestIdForApproval})
              </span>
            )}
          </h2>
          <form onSubmit={handleHrDecisionSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label
                  htmlFor="hrApprovedBy"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Approved By (HR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="hrApprovedBy"
                  name="hrApprovedBy"
                  value={hrApprovedBy}
                  onChange={(e) => setHrApprovedBy(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] bg-white transition-colors"
                  placeholder="Enter HR Approver ID/Name"
                  required
                  disabled={!currentRequestIdForApproval || isLoadingDetails}
                />
              </div>
              <div>
                <label
                  htmlFor="hrProcessedDate"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Processed Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="hrProcessedDate"
                    name="hrProcessedDate"
                    value={hrProcessedDate}
                    onChange={(e) => setHrProcessedDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] pr-10 bg-white transition-colors"
                    required
                    disabled={!currentRequestIdForApproval || isLoadingDetails}
                  />
                  <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="md:col-span-1">
                <label
                  htmlFor="hrDecision"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  HR Decision <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <select
                    id="hrDecision"
                    name="hrDecision"
                    value={hrDecision}
                    onChange={(e) => setHrDecision(e.target.value)}
                    className="w-full px-4 py-2.5 appearance-none border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] bg-white transition-colors cursor-pointer hover:border-[#3c8dbc]/70"
                    required
                    disabled={!currentRequestIdForApproval || isLoadingDetails}
                  >
                    <option value="" className="text-slate-400">
                      --- Select HR Decision ---
                    </option>
                    <option
                      value="approved"
                      className="text-green-600 font-medium"
                    >
                      HR Approved
                    </option>
                    <option
                      value="rejected"
                      className="text-red-600 font-medium"
                    >
                      HR Rejected
                    </option>
                  </select>
                  <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#3c8dbc] transition-colors" />
                </div>
              </div>
              <div className="md:col-span-1">
                <label
                  htmlFor="hrClearanceStatus"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Clearance Status <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <select
                    id="hrClearanceStatus"
                    name="hrClearanceStatus"
                    value={hrClearanceStatus}
                    onChange={(e) => setHrClearanceStatus(e.target.value)}
                    className="w-full px-4 py-2.5 appearance-none border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] bg-white transition-colors cursor-pointer hover:border-[#3c8dbc]/70"
                    required
                    disabled={!currentRequestIdForApproval || isLoadingDetails}
                  >
                    <option value="" className="text-slate-400">
                      --- Select Clearance ---
                    </option>
                    <option
                      value="Finished"
                      className="text-green-600 font-medium"
                    >
                      Finished
                    </option>
                    <option
                      value="Unfinished"
                      className="text-orange-600 font-medium"
                    >
                      Unfinished
                    </option>
                  </select>
                  <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#3c8dbc] transition-colors" />
                </div>
              </div>

              {/* HR Comment now md:col-span-1 to match HR Decision width */}
              <div className="md:col-span-1">
                <label
                  htmlFor="hrComment"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  HR Comment:
                </label>
                <textarea
                  id="hrComment"
                  name="hrComment"
                  value={hrComment}
                  onChange={(e) => setHrComment(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] bg-white transition-colors"
                  rows={3}
                  placeholder="Enter HR comments..."
                  disabled={!currentRequestIdForApproval || isLoadingDetails}
                />
              </div>
            </div>
            <div className="pt-8 flex justify-end">
              <motion.button
                type="submit"
                disabled={isLoadingDetails || !currentRequestIdForApproval}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                style={{ backgroundColor: "#3c8dbc" }}
              >
                {isLoadingDetails ? (
                  <FiRefreshCw className="animate-spin w-5 h-5 mr-2" />
                ) : null}
                Submit
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
