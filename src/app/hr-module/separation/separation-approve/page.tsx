"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  FiCalendar,
  FiUser,
  FiChevronDown,
  FiList,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

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
  description?: string | null;
  remark?: string | null;
  comment?: string | null;
  noOfDayLeft?: string | null;
  supportiveFileName?: string;
  status?: number;
  preparedBy?: string;
  preparedDate?: string;
}

async function fetchWrapper(url: string, options?: RequestInit) {
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
  )
    return null;
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
  if (!empId || String(empId).trim() === "" || empId === "N/A") {
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
      jobTitleName: String(data.jobTitleName || "N/A - Job Title Not Provided"),
      employmentType: String(data.employmentType || ""),
      internalServiceYear: String(data.internalServiceYear || ""),
    } as EmployeeDetails;
  } catch (error) {
    toast.error(`Could not load details for Employee ID: ${empId}`);
    return null;
  }
}

async function fetchAllPendingDeptRequestsAPI(
  limit: number = 30
): Promise<SeparationRequestDetails[]> {
  try {
    const data = await fetchWrapper(
      `${API_BASE_URL}/employee-separations?status=0&sort=requestDate,desc`
    );
    const allPending = (data as SeparationRequestDetails[]) || [];
    return allPending.slice(0, limit);
  } catch (error) {
    toast.error("Failed to fetch pending requests for department approval.");
    throw error;
  }
}

export default function SeparationApproval() {
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
  const [requestDate, setRequestDate] = useState("");
  const [resignationDate, setResignationDate] = useState("");
  const [supportiveFileNameFromRequest, setSupportiveFileNameFromRequest] =
    useState("");

  const [deptApprovedBy, setDeptApprovedBy] = useState("");
  const [deptProcessedDate, setDeptProcessedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [deptDecision, setDeptDecision] = useState("");
  const [deptComment, setDeptComment] = useState("");

  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isCheckingNew, setIsCheckingNew] = useState(false);
  const [currentRequestIdForApproval, setCurrentRequestIdForApproval] =
    useState<string | null>(null);

  const [newPendingRequestsCount, setNewPendingRequestsCount] = useState(0);
  const [allPendingRequestsList, setAllPendingRequestsList] = useState<
    SeparationRequestDetails[]
  >([]);
  const [showPendingRequestsList, setShowPendingRequestsList] = useState(false);
  const processedDeptRequestIdsRef = useRef<Set<string>>(new Set());
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
      setRequestDate("");
      setResignationDate("");
      setSupportiveFileNameFromRequest("");

      if (clearCurrentRequest || currentRequestIdForApproval) {
        setDeptApprovedBy("");
        setDeptDecision("");
        setDeptComment("");
        setDeptProcessedDate(new Date().toISOString().split("T")[0]);
      }
      if (clearCurrentRequest) {
        setCurrentRequestIdForApproval(null);
      }
    },
    [currentRequestIdForApproval]
  );

  const checkForNewSubmissions = useCallback(
    async (isInitialCheck = false) => {
      if (isCheckingNew || isLoadingDetails) return;

      setIsCheckingNew(true);
      try {
        const allCurrentlyPending = await fetchAllPendingDeptRequestsAPI();
        const trulyNewRequests = allCurrentlyPending.filter(
          (req) =>
            !allPendingRequestsList.find((item) => item.id === req.id) &&
            !processedDeptRequestIdsRef.current.has(req.id) &&
            req.id !== currentRequestIdForApproval
        );

        const newCount = trulyNewRequests.length;
        setNewPendingRequestsCount(newCount);

        if (newCount > 0 && !showPendingRequestsList) {
          if (!hasShownInitialNotificationRef.current || !isInitialCheck) {
            toast.success(
              `${
                newCount > 30 ? "30+" : newCount
              } new request(s) for approval.`,
              { duration: 4000 }
            );
            if (isInitialCheck) {
              hasShownInitialNotificationRef.current = true;
            }
          }
        }
      } catch (error: any) {
        console.error("Error checking for new dept requests:", error);
        if (isInitialCheck) {
          toast.error("Could not check for new requests.");
        }
      } finally {
        setIsCheckingNew(false);
      }
    },
    [
      isCheckingNew,
      isLoadingDetails,
      allPendingRequestsList,
      currentRequestIdForApproval,
      showPendingRequestsList,
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
      const loadingToastId = `loading-dept-${requestId}`;
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
          const newList = allPendingRequestsList.filter(
            (req) => req.id !== requestId
          );
          setAllPendingRequestsList(newList);
          if (newList.length === 0) setShowPendingRequestsList(false);
          toast.dismiss(loadingToastId);
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
        setResignationReason(String(requestDetails.remark || ""));
        setAdditionalInfo(String(requestDetails.description || ""));
        setRequestWaitingDays(String(requestDetails.noOfDayLeft || "N/A"));
        setSupportiveFileNameFromRequest(
          String(requestDetails.supportiveFileName || "No file attached")
        );

        const empIdFromRequest = String(requestDetails.employeeId || "").trim();
        setEmployeeId(empIdFromRequest || "N/A");

        if (empIdFromRequest && empIdFromRequest !== "N/A") {
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
            setEmployeeType(String(empDetails.employmentType || "N/A"));
            setInternalServiceYear(
              String(empDetails.internalServiceYear || "N/A")
            );
            setJobTitle(empDetails.jobTitleName ?? "N/A");
          } else {
            setFullName(
              String(`Details not found for Emp ID: ${empIdFromRequest}`)
            );
            setJobTitle("N/A - Employee Details Fetch Failed");
            setDirectorate("N/A - Employee Details Fetch Failed");
            setGender("N/A");
            setHiredDate("N/A");
            setEmployeeType("N/A");
            setInternalServiceYear("N/A");
          }
        } else {
          setFullName("Employee ID missing from request data.");
          setJobTitle("N/A - Employee ID Missing");
          setDirectorate("N/A - Employee ID Missing");
          setGender("N/A");
          setHiredDate("N/A");
          setEmployeeType("N/A");
          setInternalServiceYear("N/A");
        }

        toast.success(`Details for request ID ${requestId} loaded.`, {
          id: `loaded-dept-${requestId}`,
        });

        const newList = allPendingRequestsList.filter(
          (req) => req.id !== requestId
        );
        setAllPendingRequestsList(newList);
        processedDeptRequestIdsRef.current.add(requestId);

        if (newList.length === 0) {
          setShowPendingRequestsList(false);
          checkForNewSubmissions();
        }
      } catch (error: any) {
        console.error("Failed to load data for dept approval:", error);
        toast.error(
          error.message || "Failed to load request and employee details."
        );
        setDirectorate("N/A - Error Loading");
        setCurrentRequestIdForApproval(null);
        resetFormFields(true);
      } finally {
        setIsLoadingDetails(false);
        toast.dismiss(loadingToastId);
      }
    },
    [
      isLoadingDetails,
      currentRequestIdForApproval,
      resetFormFields,
      allPendingRequestsList,
      checkForNewSubmissions,
    ]
  );

  const handleViewNewRequestsClick = async () => {
    if (isLoadingDetails) return;

    if (showPendingRequestsList) {
      setShowPendingRequestsList(false);
      hasShownInitialNotificationRef.current = false;
      checkForNewSubmissions();
    } else {
      setIsCheckingNew(true);
      const listLoadToastId = "dept-list-load";
      toast.loading("Fetching pending requests list...", {
        id: listLoadToastId,
      });
      try {
        const pendingList = await fetchAllPendingDeptRequestsAPI();
        const displayList = pendingList.filter(
          (req) =>
            !processedDeptRequestIdsRef.current.has(req.id) &&
            req.id !== currentRequestIdForApproval
        );
        setAllPendingRequestsList(displayList);
        setShowPendingRequestsList(true);
        if (displayList.length === 0) {
          toast.success("No pending requests to display.", { duration: 3000 });
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch pending requests list.");
      } finally {
        setIsCheckingNew(false);
        toast.dismiss(listLoadToastId);
      }
    }
  };

  useEffect(() => {
    checkForNewSubmissions(true);
    const intervalId = setInterval(
      () => checkForNewSubmissions(false),
      60000 * 2
    );
    return () => clearInterval(intervalId);
  }, [checkForNewSubmissions]);

  const handleDecisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRequestIdForApproval) {
      toast.error("No separation request selected for decision.");
      return;
    }
    if (!employeeId || employeeId === "N/A") {
      toast.error(
        "Employee ID for the current request is missing or invalid. Cannot submit decision."
      );
      return;
    }
    if (!deptProcessedDate) {
      toast.error("Please enter the processed date");
      return;
    }
    if (!deptDecision) {
      toast.error("Please select a decision");
      return;
    }
    if (!deptApprovedBy.trim()) {
      toast.error("Approved By (Dept.) field is required.");
      return;
    }

    setIsLoadingDetails(true);
    const decisionToastId = "dept-decision-submit-toast";
    toast.loading("Submitting department decision...", {
      id: decisionToastId,
    });

    try {
      const approvalRecordPayload = {
        separationRequestId: currentRequestIdForApproval,
        employeeId: employeeId,
        remark: deptComment,
      };

      await fetchWrapper(`${API_BASE_URL}/separation-approvals`, {
        method: "POST",
        body: JSON.stringify(approvalRecordPayload),
      });

      const statusToUpdate = deptDecision === "approved" ? 1 : 3;
      const mainRequestUpdatePayload = {
        status: statusToUpdate,
        remark: `Dept. Decision: ${deptDecision}. By: ${deptApprovedBy} on ${deptProcessedDate}. Comment: ${deptComment}`,
      };

      await fetchWrapper(
        `${API_BASE_URL}/employee-separations/${currentRequestIdForApproval}`,
        {
          method: "PUT",
          body: JSON.stringify(mainRequestUpdatePayload),
        }
      );

      toast.success(
        `Department decision for request ${currentRequestIdForApproval} submitted successfully!`
      );
      processedDeptRequestIdsRef.current.add(currentRequestIdForApproval);
      const newList = allPendingRequestsList.filter(
        (req) => req.id !== currentRequestIdForApproval
      );
      setAllPendingRequestsList(newList);

      resetFormFields(true);

      if (newList.length === 0) {
        setShowPendingRequestsList(false);
      }
      checkForNewSubmissions();
    } catch (error: any) {
      console.error("Error during department decision submission: ", error);
      toast.error(error.message || "Failed to submit department decision.");
    } finally {
      setIsLoadingDetails(false);
      toast.dismiss(decisionToastId);
    }
  };

  const formatDateForDisplay = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      if (
        dateString.includes("-") &&
        dateString.length >= 10 &&
        /^\d{4}-\d{2}-\d{2}/.test(dateString)
      ) {
        return dateString.split("T")[0];
      } else if (dateString.match(/^\d{4}$/)) {
        return dateString;
      }
    } catch (e) {
      console.warn("Could not parse date for display:", dateString, e);
    }
    return dateString;
  };

  return (
    <div className="min-h-screen p-6 font-sans relative bg-slate-100">
      <Toaster position="top-center" reverseOrder={false} />
      {/* Updated background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc]/5 via-[#3c8dbc]/5 to-purple-500/5 opacity-30"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, type: "spring" }}
          className="mb-8 text-center"
        >
          {/* Updated title color */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#3c8dbc]">
            Department Separation Approval
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

        {/* Notification Area / View List Button */}
        <div className="mb-6 flex justify-start items-center min-h-[60px]">
          <AnimatePresence mode="wait">
            {newPendingRequestsCount > 0 && !showPendingRequestsList && (
              <motion.div
                key="notification-banner-with-view-button"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                className="p-3 bg-yellow-100 border border-yellow-400 rounded-lg shadow-sm flex items-center"
              >
                <FiAlertCircle className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" />
                <p className="text-sm font-medium text-yellow-800">
                  {newPendingRequestsCount > 30
                    ? "30+"
                    : newPendingRequestsCount}{" "}
                  pending request(s) for your approval.
                </p>
                {/* View List button color remains yellow as per instruction */}
                <button
                  onClick={handleViewNewRequestsClick}
                  disabled={isLoadingDetails}
                  className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold py-1 px-3 rounded-md shadow-sm flex items-center transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FiList className="mr-1 h-4 w-4" /> View List
                </button>
              </motion.div>
            )}

            {showPendingRequestsList && (
              // Hide List button color remains red as per instruction
              <motion.button
                key="hide-list-button"
                onClick={handleViewNewRequestsClick}
                disabled={isLoadingDetails}
                className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold py-1 px-3 rounded-md shadow-sm flex items-center transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.3 },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  transition: { duration: 0.2 },
                }}
              >
                Hide List
              </motion.button>
            )}

            {newPendingRequestsCount === 0 &&
              !showPendingRequestsList &&
              !isCheckingNew &&
              !isLoadingDetails && (
                <motion.p
                  key="no-pending-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.3 } }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  className="text-slate-500 text-sm"
                >
                  No pending requests for department approval.
                </motion.p>
              )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showPendingRequestsList && (
            <motion.div
              className="mb-6 space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Updated title color */}
              <h3 className="text-lg font-semibold text-[#3c8dbc] mb-2">
                Pending Requests for Dept. Approval:
              </h3>
              {allPendingRequestsList.length > 0
                ? allPendingRequestsList.map((notifReq) => (
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
                        Requested on:{" "}
                        {new Date(notifReq.requestDate).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))
                : !isCheckingNew && (
                    <p className="text-center text-slate-500 py-4">
                      No pending requests to display.
                    </p>
                  )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={false}
          animate={{ opacity: currentRequestIdForApproval ? 1 : 0.6 }}
          transition={{ duration: 0.2 }}
          className={`bg-white backdrop-blur-md rounded-xl border border-slate-200 shadow-xl overflow-hidden p-6 lg:p-8 mb-8 ${
            !currentRequestIdForApproval && "pointer-events-none"
          }`}
        >
          {/* Updated title color and border */}
          <h2 className="text-xl font-semibold text-[#3c8dbc] mb-6 pb-3 border-b border-slate-200">
            Employee Information
            {currentRequestIdForApproval &&
              employeeId &&
              employeeId !== "N/A" && (
                <span className="text-sm text-slate-500 ml-2">
                  (for Emp ID: {employeeId})
                </span>
              )}
          </h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label
                  htmlFor="employeeId-display-dept"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Employee ID:
                </label>
                <input
                  type="text"
                  id="employeeId-display-dept"
                  value={employeeId || "N/A"}
                  readOnly
                  className="w-full pl-3 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="fullName-display-dept"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Full Name:
                </label>
                <input
                  type="text"
                  id="fullName-display-dept"
                  value={fullName || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="gender-display-dept"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Gender:
                </label>
                <input
                  type="text"
                  id="gender-display-dept"
                  value={gender || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="hiredDate-display-dept"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Hired Date:
                </label>
                <input
                  type="text"
                  id="hiredDate-display-dept"
                  value={formatDateForDisplay(hiredDate) || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="directorate-display-dept"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Directorate:
                </label>
                <input
                  type="text"
                  id="directorate-display-dept"
                  value={directorate || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="jobTitle-display-dept"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Job Title:
                </label>
                <input
                  type="text"
                  id="jobTitle-display-dept"
                  value={jobTitle || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="internalServiceYear-display-dept"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Internal Service Year:
                </label>
                <input
                  type="text"
                  id="internalServiceYear-display-dept"
                  value={internalServiceYear || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Employee Type:
                </label>
                <div className="flex gap-x-6 items-center pt-1">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="employeeType-display-dept"
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
                      name="employeeType-display-dept"
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

        <motion.div
          initial={false}
          animate={{ opacity: currentRequestIdForApproval ? 1 : 0.6 }}
          transition={{ duration: 0.2 }}
          className={`bg-white backdrop-blur-md rounded-xl border border-slate-200 shadow-xl overflow-hidden p-6 lg:p-8 mb-8 ${
            !currentRequestIdForApproval && "pointer-events-none"
          }`}
        >
          {/* Updated title color and border */}
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
                  htmlFor="separationType-display-dept"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Separation Type:
                </label>
                <input
                  type="text"
                  id="separationType-display-dept"
                  value={separationType || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="requestDate-display-dept"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Request Date:
                </label>
                <input
                  type="text"
                  id="requestDate-display-dept"
                  value={formatDateForDisplay(requestDate) || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="waitingDays-display-dept"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Waiting Days (from request):
                </label>
                <input
                  type="text"
                  id="waitingDays-display-dept"
                  value={requestWaitingDays || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div>
                <label
                  htmlFor="resignationDate-display-dept"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Resignation Date:
                </label>
                <input
                  type="text"
                  id="resignationDate-display-dept"
                  value={formatDateForDisplay(resignationDate) || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                />
              </div>
              <div className="md:col-span-1">
                <label
                  htmlFor="resignationReason-display-dept"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Resignation Reason:
                </label>
                <textarea
                  id="resignationReason-display-dept"
                  value={resignationReason || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                  rows={3}
                />
              </div>
              <div className="md:col-span-1">
                <label
                  htmlFor="additionalInfo-display-dept"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Additional Information:
                </label>
                <textarea
                  id="additionalInfo-display-dept"
                  value={additionalInfo || "N/A"}
                  readOnly
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-not-allowed"
                  rows={3}
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Supportive File (from request):
                </label>
                <div className="px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg min-h-[40px] text-sm text-slate-700 cursor-not-allowed">
                  {supportiveFileNameFromRequest || "N/A"}
                </div>
              </div>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={false}
          animate={{ opacity: currentRequestIdForApproval ? 1 : 0.6 }}
          transition={{ duration: 0.2 }}
          className={`bg-white backdrop-blur-md rounded-xl border border-slate-200 shadow-xl overflow-hidden p-6 lg:p-8 ${
            !currentRequestIdForApproval && "pointer-events-none"
          }`}
        >
          {/* Updated title color and border */}
          <h2 className="text-xl font-semibold text-[#3c8dbc] mb-6 pb-3 border-b border-slate-200">
            Department Decision
            {currentRequestIdForApproval && (
              <span className="text-sm text-slate-500 ml-2">
                (for Request ID: {currentRequestIdForApproval})
              </span>
            )}
          </h2>
          <form onSubmit={handleDecisionSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label
                  htmlFor="deptApprovedBy"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Approved By (Dept.) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="deptApprovedBy"
                  name="deptApprovedBy"
                  value={deptApprovedBy}
                  onChange={(e) => setDeptApprovedBy(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] transition-colors"
                  placeholder="Enter Dept. Approver ID/Name"
                  required
                  disabled={!currentRequestIdForApproval || isLoadingDetails}
                />
              </div>
              <div>
                <label
                  htmlFor="deptProcessedDate"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Processed Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="deptProcessedDate"
                    name="deptProcessedDate"
                    value={deptProcessedDate}
                    onChange={(e) => setDeptProcessedDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] pr-10 transition-colors"
                    required
                    disabled={!currentRequestIdForApproval || isLoadingDetails}
                  />
                  <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="md:col-span-1">
                <label
                  htmlFor="deptDecision"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Department Decision <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <select
                    id="deptDecision"
                    name="deptDecision"
                    value={deptDecision}
                    onChange={(e) => setDeptDecision(e.target.value)}
                    className="w-full px-4 py-2.5 appearance-none border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] bg-white transition-colors cursor-pointer hover:border-[#3c8dbc]/70"
                    required
                    disabled={!currentRequestIdForApproval || isLoadingDetails}
                  >
                    <option value="" className="text-slate-400">
                      --- Select Decision ---
                    </option>
                    <option
                      value="approved"
                      className="text-green-600 font-medium"
                    >
                      Dept. Approved
                    </option>
                    <option
                      value="rejected"
                      className="text-red-600 font-medium"
                    >
                      Dept. Rejected
                    </option>
                  </select>
                  <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-[#3c8dbc] transition-colors" />
                </div>
              </div>
              <div className="md:col-span-1">
                <label
                  htmlFor="deptComment"
                  className="block text-sm font-medium text-slate-600 mb-1"
                >
                  Department Comment:
                </label>
                <textarea
                  id="deptComment"
                  name="deptComment"
                  value={deptComment}
                  onChange={(e) => setDeptComment(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] focus:border-[#3c8dbc] transition-colors"
                  rows={3}
                  placeholder="Enter department comments..."
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
