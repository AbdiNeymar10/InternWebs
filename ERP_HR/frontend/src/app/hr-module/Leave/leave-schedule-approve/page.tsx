
"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, Variants } from "framer-motion";
import Select from 'react-select';

interface EmployeeDetails {
  fullName: string;
  department: string;
  year: string;
  requesterName: string;
  position: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  department?: { depName: string };
  position?: { positionName: string };
}

interface Schedule {
  id: number;
  employeeId: string;
  fullName: string;
  leaveYearId: number;
  status: string;
  employee?: Employee;
  scheduleDetails?: LeaveDetail[];
}

interface LeaveDetail {
  id: number;
  leaveMonth: string;
  noDays: number;
  description: string;
  status: string;
}

const ApproverDecisionForm = ({
  scheduleId,
  onStatusUpdate,
  leaveMonths,
  onSuccess
}: {
  scheduleId: string;
  onStatusUpdate: () => void;
  leaveMonths: LeaveDetail[];
  onSuccess: (message: string) => void;
}) => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [approverDecision, setApproverDecision] = useState('');
  const [remark, setRemark] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!scheduleId || !approverDecision || !selectedMonth) {
      setError('Please select a month, decision, and ensure a request is selected.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8080/api/leave-schedules/${scheduleId}/details/${selectedMonth}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: approverDecision === 'approve' ? 'Approved' : 'Rejected',
            remark,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to update status: ${response.status} ${response.statusText} - ${errorData}`);
      }

      onSuccess(`You have successfully ${approverDecision === 'approve' ? 'approved' : 'rejected'} the leave request for ${selectedMonth}.`);
      setApproverDecision('');
      setRemark('');
      setSelectedMonth('');
      onStatusUpdate();

    } catch (err: any) {
      setError(`Failed to update status: ${err.message}`);
      console.error('Error updating status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { when: "beforeChildren", staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const pendingMonths = leaveMonths.filter(m => m.status === 'Pending' || !m.status);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden p-6 mb-6"
    >
      <h2 className="text-xl font-semibold text-[#3c8dbc] mb-4">Approver Decision</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-14">
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Leave Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-3/4 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
            disabled={isLoading || pendingMonths.length === 0}
          >
            <option value="">--Select Pending Month--</option>
            {pendingMonths.map(month => (
              <option key={month.leaveMonth} value={month.leaveMonth}>
                {month.leaveMonth}
              </option>
            ))}
          </select>
        </motion.div>

        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Approver Decision:</label>
          <select
            value={approverDecision}
            onChange={(e) => setApproverDecision(e.target.value)}
            className="w-3/4 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
            disabled={isLoading}
          >
            <option value="">--Select One--</option>
            <option value="approve">Approve</option>
            <option value="reject">Reject</option>
          </select>
        </motion.div>

        <motion.div variants={itemVariants} className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Remark:</label>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="w-3/4 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
            rows={3}
            disabled={isLoading}
          />
        </motion.div>
      </div>
      {error && <div className="text-red-500 text-sm mt-4 text-center">{error}</div>}
      <motion.div
        variants={itemVariants}
        className="pt-6 flex justify-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-[#3c8dbc] text-white rounded-md text-sm font-medium hover:bg-[#3c8dbc]/90 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isLoading || !selectedMonth || !approverDecision}
        >
          {isLoading ? 'Processing...' : 'Submit Decision'}
        </button>
      </motion.div>
    </motion.div>
  );
};

const LeaveMonthOptions = ({ scheduleId }: { scheduleId: string }) => {
  const [records, setRecords] = useState<LeaveDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (scheduleId) {
      const fetchDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`http://localhost:8080/api/leave-schedules/${scheduleId}/details`);
          if (!response.ok) {
            throw new Error(`Failed to fetch details: ${response.status} ${response.statusText}`);
          }
          const details = await response.json();
          setRecords(details);
        } catch (err: any) {
          setError(`Failed to fetch leave schedule details: ${err.message}`);
          console.error('Error fetching details:', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    } else {
      setRecords([]);
    }
  }, [scheduleId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden p-6 mb-6"
    >
      <h2 className="text-xl font-semibold text-[#3c8dbc] mb-4">Leave Month Options</h2>
      <div className="border border-[#3c8dbc]/30 rounded-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#3c8dbc]/10">
              <th className="text-left py-3 px-4 text-sm font-medium text-[#3c8dbc]">No</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#3c8dbc]">Leave Month</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#3c8dbc]">No_Days</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#3c8dbc]">Description</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-[#3c8dbc]">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="py-4 px-4 text-center text-gray-500">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={5} className="py-4 px-4 text-center text-red-500">{error}</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={5} className="py-4 px-4 text-center text-gray-500">No request selected or no details found.</td></tr>
            ) : (
              records.map((record, index) => (
                <tr key={record.id} className="border-t border-[#3c8dbc]/20">
                  <td className="py-3 px-4 text-sm text-gray-700">{index + 1}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{record.leaveMonth}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{record.noDays}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{record.description}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      record.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const LeaveScheduleApprove = () => {
  const [requestId, setRequestId] = useState('');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails>({
    fullName: '', department: '', year: '', requesterName: '', position: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leaveMonths, setLeaveMonths] = useState<LeaveDetail[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchAllSchedules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/leave-schedules');
      if (!response.ok) {
        throw new Error(`Failed to fetch schedules: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      // Add validation to ensure the API returned an array
      if (!Array.isArray(data)) {
        throw new Error("API response for schedules is not a valid list.");
      }

      const schedulesWithData = await Promise.all(
        data.map(async (schedule: Schedule) => {
          let fullName = 'Unknown';
          let employeeData: Employee | undefined = undefined;

          try {
            if (!schedule.employeeId) {
              console.warn("Schedule found with missing employeeId:", schedule);
              fullName = 'Unknown (No ID)';
            } else {
              const empResponse = await fetch(`http://localhost:8080/api/employees/${schedule.employeeId}`);
              if (empResponse.ok) {
                employeeData = await empResponse.json();
                fullName = `${employeeData?.firstName || ''} ${employeeData?.lastName || ''}`.trim() || `Unnamed (${schedule.employeeId})`;
              } else {
                // Handle 404 or other errors silently by setting fallback name
                fullName = `Unknown (${schedule.employeeId})`;
              }
            }
          } catch (err: any) {
            // Silently handle network errors or other issues by setting fallback name
            fullName = `Unknown (${schedule.employeeId})`;
          }

          return {
            ...schedule,
            fullName,
            employee: employeeData,
          };
        })
      );
      setSchedules(schedulesWithData);
    } catch (err: any) {
      setError(`Failed to load schedule list: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllSchedules();
  }, [fetchAllSchedules]);

  const handleRequestChange = (selectedOption: any) => {
    const selectedId = selectedOption ? selectedOption.value : '';
    setRequestId(selectedId);

    if (selectedId) {
      const selectedSchedule = schedules.find(s => s.id.toString() === selectedId);

      if (selectedSchedule) {
        setLeaveMonths(selectedSchedule.scheduleDetails || []);
        setEmployeeDetails({
          fullName: selectedSchedule.employeeId, // This is the ID field
          department: selectedSchedule.employee?.department?.depName || 'Unknown',
          year: selectedSchedule.leaveYearId.toString(),
          requesterName: selectedSchedule.fullName,
          position: selectedSchedule.employee?.position?.positionName || 'Unknown',
        });
      }
    } else {
      setRequestId('');
      setEmployeeDetails({ fullName: '', department: '', year: '', requesterName: '', position: '' });
      setLeaveMonths([]);
    }
  };

  const handleStatusUpdate = () => {
    setRequestId('');
    setEmployeeDetails({ fullName: '', department: '', year: '', requesterName: '', position: '' });
    setLeaveMonths([]);
    fetchAllSchedules();
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { when: "beforeChildren", staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const scheduleOptions = schedules
    .filter(schedule =>
      schedule.scheduleDetails &&
      schedule.scheduleDetails.some(detail => detail.status === 'Pending' || !detail.status)
    )
    .map(schedule => ({
      value: schedule.id.toString(),
      label: `${schedule.employeeId} - ${schedule.fullName} - ${schedule.leaveYearId}`,
    }));

  return (
    <div className="min-h-screen p-6 font-sans relative overflow-y-auto bg-gray-50">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc]/10 to-purple-50 opacity-30"></div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3c8dbc] to-[#2c6da4]">
            Leave Schedule Approval
          </h1>
        </motion.div>

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6"
            role="alert"
          >
            <span className="block sm:inline">{successMessage}</span>
          </motion.div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            {error}
          </div>
        )}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 ml-14">
              <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request:
                </label>
                <Select
                  options={scheduleOptions}
                  onChange={handleRequestChange}
                  value={scheduleOptions.find(option => option.value === requestId) || null}
                  isLoading={isLoading}
                  placeholder="--Select a request with pending items--"
                  className="w-3/4"
                  styles={{
                    control: (provided) => ({ ...provided, borderColor: '#d1d5db', borderRadius: '0.375rem', padding: '0.1rem', '&:hover': { borderColor: '#3c8dbc' }, boxShadow: 'none' }),
                    menu: (provided) => ({ ...provided, zIndex: 20 }),
                    option: (provided, state) => ({ ...provided, backgroundColor: state.isSelected ? '#3c8dbc' : state.isFocused ? '#e6f0fa' : 'white', color: state.isSelected ? 'white' : '#374151' }),
                  }}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requester Id:</label>
                <input type="text" value={employeeDetails.fullName} readOnly className="w-3/4 px-2 py-1 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
                <input type="text" value={employeeDetails.department} readOnly className="w-3/4 px-2 py-1 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" />
              </motion.div>
            </div>
            <div className="space-y-4 ml-12 mr-4">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requester Name:</label>
                <input type="text" value={employeeDetails.requesterName} readOnly className="w-3/4 px-2 py-1 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position:</label>
                <input type="text" value={employeeDetails.position} readOnly className="w-3/4 px-2 py-1 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year:</label>
                <input type="text" value={employeeDetails.year} readOnly className="w-3/4 px-2 py-1 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {requestId && <LeaveMonthOptions scheduleId={requestId} />}
        {requestId && <ApproverDecisionForm
          scheduleId={requestId}
          onStatusUpdate={handleStatusUpdate}
          leaveMonths={leaveMonths}
          onSuccess={(message) => setSuccessMessage(message)}
        />}
      </div>
    </div>
  );
};

export default LeaveScheduleApprove;
