'use client';
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiSearch,
  FiCheck,
  FiUsers,
  FiRefreshCw,
  FiAlertTriangle,
  FiFileText,
  FiUser,
  FiInfo
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

interface Employee {
  empId: string;
  fullName: string;
  position: string;
  department: string; // Contains deptName from EmployeeDTO
}

interface LeaveTransferDetailDTO {
  detailId?: number;
  empId: string;
  fullName?: string; // Added to store fetched employee name
  status: string;
}

interface LeaveTransferRequestDTO {
  transferId: number;
  budgetYear: number;
  status: string;
  requesterId: string;
  createdDate: string;
  deptName: string; // Requester's department name
  details: LeaveTransferDetailDTO[];
}

interface Requester {
  id: string;
  name: string;
  position: string;
  department: string; // Contains deptName from EmployeeDTO
}

const LeaveTransferApproval = () => {
  const [requesterId, setRequesterId] = useState('');
  const [requester, setRequester] = useState<Requester>({ id: '', name: '', position: '', department: '' });
  const [pendingRequests, setPendingRequests] = useState<LeaveTransferRequestDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch requester details
  useEffect(() => {
    const fetchRequesterDetails = async () => {
      if (!requesterId.trim()) {
        setRequester({ id: '', name: '', position: '', department: '' });
        setPendingRequests([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/leave-transfer/employee/${requesterId.trim()}`);
        setRequester({
          id: response.data.empId,
          name: response.data.fullName,
          position: response.data.position,
          department: response.data.department || 'N/A', // department contains deptName
        });
        toast.success('Approver details loaded');
      } catch (error) {
        toast.error('Approver not found');
        setRequester({ id: '', name: '', position: '', department: '' });
        setPendingRequests([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequesterDetails();
  }, [requesterId]);

  // Fetch pending requests and employee names
  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (!requester.id) return; // Only fetch if requester is valid
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/leave-transfer/pending-requests?approverId=${requester.id}`
        );
        // Fetch employee names for each detail
        const requestsWithNames = await Promise.all(
          response.data.map(async (request: LeaveTransferRequestDTO) => {
            const detailsWithNames = await Promise.all(
              request.details.map(async (detail: LeaveTransferDetailDTO) => {
                try {
                  const empResponse = await axios.get(
                    `http://localhost:8080/api/leave-transfer/employee/${detail.empId}`
                  );
                  return {
                    ...detail,
                    fullName: empResponse.data.fullName || 'Unknown',
                  };
                } catch (error) {
                  console.error(`Failed to fetch name for employee ${detail.empId}:`, error);
                  return {
                    ...detail,
                    fullName: 'Unknown',
                  };
                }
              })
            );
            return {
              ...request,
              deptName: request.deptName || 'Unknown',
              details: detailsWithNames,
            };
          })
        );
        setPendingRequests(requestsWithNames);
        toast.success('Pending requests loaded');
      } catch (error) {
        toast.error('Failed to load pending requests');
        setPendingRequests([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendingRequests();
  }, [requester.id]);

  const filteredRequests = pendingRequests.filter(request =>
    request.details.some(detail =>
      detail.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (detail.fullName && detail.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      request.requesterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.deptName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleApprove = async (detailId: number) => {
    if (!detailId) {
      toast.error('Invalid detail ID');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`http://localhost:8080/api/leave-transfer/approve/${detailId}`);
      toast.success('Request detail approved successfully!');
      
      // Refresh pending requests after approval
      const response = await axios.get(
        `http://localhost:8080/api/leave-transfer/pending-requests?approverId=${requester.id}`
      );
      const requestsWithNames = await Promise.all(
        response.data.map(async (request: LeaveTransferRequestDTO) => {
          const detailsWithNames = await Promise.all(
            request.details.map(async (detail: LeaveTransferDetailDTO) => {
              try {
                const empResponse = await axios.get(
                  `http://localhost:8080/api/leave-transfer/employee/${detail.empId}`
                );
                return {
                  ...detail,
                  fullName: empResponse.data.fullName || 'Unknown',
                };
              } catch (error) {
                console.error(`Failed to fetch name for employee ${detail.empId}:`, error);
                return {
                  ...detail,
                  fullName: 'Unknown',
                };
              }
            })
          );
          return {
            ...request,
            deptName: request.deptName || 'Unknown',
            details: detailsWithNames,
          };
        })
      );
      setPendingRequests(requestsWithNames);
    } catch (error) {
      toast.error('Failed to approve request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 font-sans relative bg-slate-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc]/5 to-purple-50/5 opacity-30"></div>
      </div>
      
      <Toaster
        position="top-center"
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

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2c6da4] to-[#3c8dbc]">
            Leave Transfer Approval
          </h1>
          <p className="text-gray-600 mt-2">
            Approve pending leave transfer requests
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-md rounded-xl border border-[#3c8dbc]/20 shadow-xl overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#3c8dbc] mb-4 flex items-center">
              <FiUser className="mr-2" />
              Approver Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="approverId" className="block text-sm font-medium text-gray-700 mb-1">
                  Approver ID
                </label>
                <input
                  id="approverId"
                  type="text"
                  value={requesterId}
                  onChange={(e) => setRequesterId(e.target.value)}
                  placeholder="Enter your employee ID"
                  disabled={isSubmitting || isLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="w-full px-4 py-2 bg-gray-50 rounded-md">
                  {requester.name || 'N/A'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <div className="w-full px-4 py-2 bg-gray-50 rounded-md">
                  {requester.position || 'N/A'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <div className="w-full px-4 py-2 bg-gray-50 rounded-md">
                  {requester.department || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-md rounded-xl border border-[#3c8dbc]/20 shadow-xl overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#3c8dbc] mb-4 flex items-center">
              <FiFileText className="mr-2" />
              Pending Leave Transfer Requests
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Requests</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                  placeholder="Search by employee ID, name, or department"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLoading}
                />
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#3c8dbc]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Employee Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.length > 0 ? (
                    filteredRequests.flatMap(request =>
                      request.details.map(detail => (
                        <tr
                          key={detail.detailId ? detail.detailId : `${request.transferId}-${detail.empId}`}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {detail.empId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {detail.fullName || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.deptName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {detail.status}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {detail.status === 'PENDING' && (
                              <button
                                onClick={() => detail.detailId && handleApprove(detail.detailId)}
                                disabled={isSubmitting || !detail.detailId}
                                className={`px-4 py-1 rounded-md text-white font-medium ${
                                  isSubmitting || !detail.detailId ? 
                                  'bg-gray-400 cursor-not-allowed' : 
                                  'bg-[#3c8dbc] hover:bg-[#367fa9]'
                                }`}
                              >
                                {isSubmitting ? (
                                  <>
                                    <FiRefreshCw className="animate-spin inline-block mr-1" />
                                    Approving...
                                  </>
                                ) : 'Approve'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchTerm ? 'No matching requests found' : 
                         (isLoading ? 'Loading requests...' : 
                          (requester.id ? 'No pending requests available' : 'Please enter a valid Approver ID'))}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaveTransferApproval;