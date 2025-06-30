'use client';
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiSearch,
  FiCheck,
  FiUsers,
  FiList,
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
  department: string; // Now contains deptName
  selected?: boolean;
}

interface LeaveTransferDetailDTO {
  empId: string;
  status: string;
}

interface LeaveTransferRequestDTO {
  transferId: number;
  budgetYear: number;
  status: string;
  requesterId: string;
  createdDate: string;
  details: LeaveTransferDetailDTO[];
}

const LeaveTransferRequest = () => {
  const [empId, setEmpId] = useState<string>('');
  const [employee, setEmployee] = useState<Employee>({ empId: '', fullName: '', position: '', department: '' });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedRequests, setSubmittedRequests] = useState<LeaveTransferRequestDTO[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!empId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/leave-transfer/employee/${empId}`);
        setEmployee({
          empId: response.data.empId,
          fullName: response.data.fullName,
          position: response.data.position,
          department: response.data.department || 'N/A', // department now contains deptName
        });
        toast.success('Employee details loaded');
      } catch (error) {
        toast.error('Employee not found');
        setEmployee({ empId: '', fullName: '', position: '', department: '' });
        setEmployees([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployeeDetails();
  }, [empId]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!empId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/leave-transfer/employees/${empId}`);
        setEmployees(response.data.map((emp: Employee) => ({ ...emp, selected: false })));
      } catch (error) {
        toast.error('Failed to load department employees');
        setEmployees([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, [empId]);

  useEffect(() => {
    const fetchSubmittedRequests = async () => {
      if (!empId) return;
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/leave-transfer/requests/${empId}`);
        setSubmittedRequests(response.data);
      } catch (error) {
        toast.error('Failed to load submitted requests');
        setSubmittedRequests([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmittedRequests();
  }, [empId]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setEmployees(employees.map(emp => ({ ...emp, selected: !selectAll })));
  };

  const handleSelectEmployee = (id: string) => {
    setEmployees(employees.map(emp =>
      emp.empId === id ? { ...emp, selected: !emp.selected } : emp
    ));
  };

  const handleSubmit = async () => {
    if (!empId) {
      toast.error('Please enter an employee ID');
      return;
    }

    const selectedEmployees = employees.filter(emp => emp.selected);
    if (selectedEmployees.length === 0) {
      toast.error('Please select at least one employee');
      return;
    }

    const requestDTO = {
      requesterId: empId,
      budgetYear: 2025,
      details: selectedEmployees.map(emp => ({
        empId: emp.empId,
        status: 'PENDING',
      })),
    };

    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:8080/api/leave-transfer/request', requestDTO);
      toast.success('Leave transfer request submitted successfully!');
      
      const response = await axios.get(`http://localhost:8080/api/leave-transfer/requests/${empId}`);
      setSubmittedRequests(response.data);
      setEmployees(employees.map(emp => ({ ...emp, selected: false })));
      setSelectAll(false);
    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.empId.toString().includes(searchTerm)
  );

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
            Leave Transfer Request
          </h1>
          <p className="text-gray-600 mt-2">
            Submit leave transfer requests for employees
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
              Employee Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID
                </label>
                <input
                  id="employeeId"
                  type="text"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
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
                  {employee.fullName || 'N/A'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <div className="w-full px-4 py-2 bg-gray-50 rounded-md">
                  {employee.position || 'N/A'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <div className="w-full px-4 py-2 bg-gray-50 rounded-md">
                  {employee.department || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-md rounded-xl border border-[#3c8dbc]/20 shadow-xl overflow-hidden mb-8"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#3c8dbc] mb-4 flex items-center">
              <FiUsers className="mr-2" />
              Select Employees for Leave Transfer
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Employees</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                  placeholder="Search by name or ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={!empId || isLoading}
                />
                <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#3c8dbc]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        disabled={!empId || isLoading}
                        className="h-4 w-4 text-[#3c8dbc] focus:ring-[#3c8dbc] border-gray-300 rounded"
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Employee ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Full Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Position
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Department
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map(emp => (
                      <tr key={emp.empId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <input
                            type="checkbox"
                            checked={!!emp.selected}
                            onChange={() => handleSelectEmployee(emp.empId)}
                            disabled={!empId || isLoading}
                            className="h-4 w-4 text-[#3c8dbc] focus:ring-[#3c8dbc] border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {emp.empId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {emp.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {emp.position}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {emp.department}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchTerm ? 'No matching employees found' : 
                         (empId ? (isLoading ? 'Loading employees...' : 'No employees in your department') : 'Enter your Employee ID to see colleagues')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !empId || employees.length === 0}
                className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
                  (isSubmitting || !empId || employees.length === 0) ? 
                  'bg-gray-400 cursor-not-allowed' : 
                  'bg-[#3c8dbc] hover:bg-[#367fa9]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <FiRefreshCw className="animate-spin inline-block mr-2" />
                    Submitting...
                  </>
                ) : 'Submit Request'}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-md rounded-xl border border-[#3c8dbc]/20 shadow-xl overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#3c8dbc] mb-4 flex items-center">
              <FiFileText className="mr-2" />
              Submitted Leave Transfer Requests
            </h2>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#3c8dbc]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Request ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Budget Year
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Created Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Employees Involved
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submittedRequests.length > 0 ? (
                    submittedRequests.map(request => (
                      <tr key={request.transferId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.transferId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.budgetYear}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.status || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.createdDate ? new Date(request.createdDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {request.details && request.details.length > 0 ? 
                           request.details.map(detail => detail.empId).join(', ') : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        {empId ? (isLoading ? 'Loading requests...' : 'No submitted requests found') : 'Enter your Employee ID to see requests'}
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

export default LeaveTransferRequest;