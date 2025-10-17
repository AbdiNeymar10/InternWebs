"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { authFetch } from "@/utils/authFetch";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiBriefcase,
  FiRefreshCw,
  FiCheckCircle,
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

// --- INTERFACES ---
interface RecruitmentRequestData {
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
        // This should now be populated
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

interface RecruitmentRequestSuggestion {
  recruitRequestId: number;
  recruitBatchCode: string;
  requestStatus: string;
}

interface ApprovalFormData {
  searchQuery: string;
  recruitRequestId: number | null;
  departmentName: string;
  jobTitle: string;
  jobGrade: string;
  icf: string;
  numOfEmps: string;
  recruitmentType: string;
  employmentType: string;
  requesterId: string;
  budgetYear: string;
  incrementStep: string;
  recruitBatchCode: string;
  advertisementType: string;
  requesterRemark: string;
  gmRemark: string;
  decision: "APPROVE" | "REJECT" | "";
  approvedBy: string;
}

const initialFormData: ApprovalFormData = {
  searchQuery: "",
  recruitRequestId: null,
  departmentName: "",
  jobTitle: "",
  jobGrade: "",
  icf: "",
  numOfEmps: "",
  recruitmentType: "",
  employmentType: "",
  requesterId: "",
  budgetYear: "",
  incrementStep: "",
  recruitBatchCode: "",
  advertisementType: "",
  requesterRemark: "",
  gmRemark: "",
  decision: "",
  approvedBy: "",
};

export default function ApprovalList() {
  const router = useRouter();

  const [formData, setFormData] = useState<ApprovalFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<
    RecruitmentRequestSuggestion[]
  >([]);
  const knownRequestIdsRef = useRef<Set<number> | null>(null);

  const fetchPendingRequests = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) toast.loading("Refreshing list...");
    try {
      const response = await authFetch(
        "http://localhost:8080/api/recruitment/pending-requests"
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch pending requests: ${response.statusText}`
        );
      }
      const data: RecruitmentRequestSuggestion[] = await response.json();
      setSearchSuggestions(data);

      const newRequestIds = new Set(data.map((req) => req.recruitRequestId));
      if (knownRequestIdsRef.current) {
        const newlyAdded = data.filter(
          (req) => !knownRequestIdsRef.current!.has(req.recruitRequestId)
        );
        if (newlyAdded.length > 0) {
          toast(
            `${newlyAdded.length} new request${
              newlyAdded.length > 1 ? "s" : ""
            } pending approval.`,
            { icon: "🔔" }
          );
        }
      }
      knownRequestIdsRef.current = newRequestIds;

      if (isManualRefresh) {
        toast.dismiss();
        toast.success("List refreshed!");
      }
    } catch (error: any) {
      console.error("Error fetching search suggestions:", error);
      if (isManualRefresh) {
        toast.dismiss();
        toast.error(`Failed to refresh pending requests.`);
      }
    }
  }, []);

  useEffect(() => {
    fetchPendingRequests();
    const intervalId = setInterval(() => fetchPendingRequests(false), 30000);
    return () => clearInterval(intervalId);
  }, [fetchPendingRequests]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSelect = useCallback(
    async (request: RecruitmentRequestSuggestion) => {
      setFormData((prev) => ({
        ...prev,
        searchQuery: `${request.recruitBatchCode} (ID: ${request.recruitRequestId})`,
      }));
      setShowSearchSuggestions(false);
      toast.loading("Loading request details...", { id: "loadRequest" });

      try {
        const response = await authFetch(
          `http://localhost:8080/api/recruitment/request/${request.recruitRequestId}`
        );
        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `Failed to fetch request details. Status: ${response.status}. ${errorBody}`
          );
        }
        const data: RecruitmentRequestData = await response.json();

        setFormData({
          ...initialFormData, // Reset form first
          recruitRequestId: data.recruitRequestId,
          departmentName: data.department?.depName || "",
          jobTitle: data.jobCodeDetail?.hrJobType?.jobTitle?.jobTitle || "",
          jobGrade: data.jobCodeDetail?.hrJobType?.jobGrade?.jobGrade || "N/A", // <-- This will now be populated
          icf: data.icf?.icf || "",
          numOfEmps: data.numOfEmps?.toString() || "",
          recruitmentType:
            data.recruitmentType?.description ||
            data.recruitmentType?.recruitmentType ||
            "",
          employmentType: data.employmentType?.type || "N/A",
          requesterId: data.requesterId || "",
          budgetYear: data.budgetYear || "",
          incrementStep: data.incrementStep || "N/A",
          requesterRemark: data.remark || "",
          recruitBatchCode: data.recruitBatchCode || "",
          advertisementType: data.advertisementType || "", // Pre-fill if it was already set
          gmRemark: data.gmRemark || "",
          decision: "",
          approvedBy: "",
        });
        toast.success("Request loaded successfully!", { id: "loadRequest" });
      } catch (error: any) {
        console.error("Error fetching request details:", error);
        toast.error(
          `Failed to load request: ${error.message || "Unknown error"}`,
          { id: "loadRequest" }
        );
        setFormData(initialFormData); // Clear form on error
      }
    },
    []
  );

  const handleSubmitApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.loading("Processing approval...", { id: "submitApproval" });

    if (!formData.recruitRequestId) {
      toast.error("Please select a request to approve/reject.", {
        id: "submitApproval",
      });
      setIsSubmitting(false);
      return;
    }
    if (!formData.decision) {
      toast.error("Please select a decision (Approve/Reject).", {
        id: "submitApproval",
      });
      setIsSubmitting(false);
      return;
    }
    if (formData.decision === "APPROVE" && !formData.advertisementType) {
      toast.error("Please select an Advertisement Type for approval.", {
        id: "submitApproval",
      });
      setIsSubmitting(false);
      return;
    }
    if (!formData.approvedBy.trim()) {
      toast.error("Approved By field cannot be empty.", {
        id: "submitApproval",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        recruitRequestId: formData.recruitRequestId,
        decision: formData.decision,
        remark: formData.gmRemark,
        approvedBy: formData.approvedBy,
        advertisementType: formData.advertisementType, // <-- Add to payload
      };

      const response = await authFetch(
        "http://localhost:8080/api/recruitment/approve",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process approval");
      }

      toast.success("Approval processed successfully!", {
        id: "submitApproval",
      });
      setFormData(initialFormData);
      fetchPendingRequests(true);
    } catch (error: any) {
      console.error("Error processing approval:", error);
      toast.error(
        `Failed to process approval: ${error.message || "Unknown error"}`,
        { id: "submitApproval" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 font-sans relative bg-slate-100">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-[#3c8dbc] mb-4 flex items-center">
            <FiBriefcase className="mr-2" /> Recruitment Approval
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label
                htmlFor="search-field"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Search Pending Requests
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
                    setTimeout(() => setShowSearchSuggestions(false), 150)
                  }
                  className="w-full p-2.5 pl-9 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all"
                  placeholder="Search by Batch Code or ID"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                {showSearchSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute z-20 w-full bg-white border border-slate-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                    {searchSuggestions
                      .filter(
                        (req) =>
                          req.recruitBatchCode
                            .toLowerCase()
                            .includes(formData.searchQuery.toLowerCase()) ||
                          req.recruitRequestId
                            .toString()
                            .includes(formData.searchQuery)
                      )
                      .map((request) => (
                        <div
                          key={request.recruitRequestId}
                          className="p-2 cursor-pointer hover:bg-slate-100 text-sm text-slate-700"
                          onClick={() => handleSearchSelect(request)}
                        >
                          {request.recruitBatchCode} (ID:{" "}
                          {request.recruitRequestId}) - {request.requestStatus}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end items-end h-full">
              <motion.button
                type="button"
                onClick={() => fetchPendingRequests(true)}
                className="px-4 py-2.5 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] transition-all shadow-md hover:shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiRefreshCw className="mr-2" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-slate-200 p-6"
        >
          <h2 className="text-xl font-bold text-[#3c8dbc] mb-4 flex items-center">
            <FiBriefcase className="mr-2" /> Request Details for Approval
          </h2>

          <form onSubmit={handleSubmitApproval} className="space-y-6">
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <h3 className="text-md font-semibold text-slate-700 mb-3">
                Requested Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Working Place
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.departmentName}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Required Job Type
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.jobTitle}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Job Grade
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.jobGrade}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    ICF
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.icf}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <h3 className="text-md font-semibold text-slate-700 mb-3">
                Additional Request Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Required Number
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.numOfEmps}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Recruitment Type
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.recruitmentType}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Employment Type
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.employmentType || "N/A"}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Requester ID
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.requesterId}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Budget Year
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.budgetYear}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Increment Step
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.incrementStep || "N/A"}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                  />
                </div>
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Requester's Comment
                  </label>
                  <textarea
                    readOnly
                    value={formData.requesterRemark}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <h3 className="text-md font-semibold text-[#3c8dbc] mb-3">
                Approval Action
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Batch Code
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={formData.recruitBatchCode}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                  />
                </div>

                {/* MODIFIED: Advertisement Type Dropdown */}
                <div>
                  <label
                    htmlFor="advertisementType"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Advertisement Type
                  </label>
                  <select
                    id="advertisementType"
                    name="advertisementType"
                    value={formData.advertisementType}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                    disabled={
                      !formData.recruitRequestId ||
                      formData.decision === "REJECT"
                    }
                    required={formData.decision === "APPROVE"}
                  >
                    <option value="">-- Select Type --</option>
                    <option value="Inside">Inside</option>
                    <option value="Outside">Outside</option>
                  </select>
                </div>

                <div className="lg:col-span-1">
                  <label
                    htmlFor="gmRemark"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Comment for Decision
                  </label>
                  <textarea
                    id="gmRemark"
                    name="gmRemark"
                    value={formData.gmRemark}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all min-h-[80px]"
                    placeholder="Enter your comment for approval/rejection"
                  />
                </div>
                <div>
                  <label
                    htmlFor="decision"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Decision
                  </label>
                  <select
                    id="decision"
                    name="decision"
                    value={formData.decision}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all"
                    required
                  >
                    <option value="">-- Select Decision --</option>
                    <option value="APPROVE">Approve</option>
                    <option value="REJECT">Reject</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="approvedBy"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Approved By
                  </label>
                  <input
                    type="text"
                    id="approvedBy"
                    name="approvedBy"
                    value={formData.approvedBy}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#3c8dbc] focus:border-transparent transition-all"
                    required
                    placeholder="Enter approver's name/ID"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <motion.button
                type="submit"
                disabled={isSubmitting || !formData.recruitRequestId}
                className="px-6 py-2.5 bg-[#3c8dbc] text-white rounded-lg hover:bg-[#367fa9] transition-all shadow-md hover:shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-2" /> Processing...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="mr-2" /> Process Approval
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
