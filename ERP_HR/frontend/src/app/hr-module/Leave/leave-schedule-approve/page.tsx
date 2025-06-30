"use client";
import React, { useState, useEffect } from 'react';
import { motion, Variants } from "framer-motion";
import Select from 'react-select';

interface EmployeeDetails {
  fullName: string;
  department: string;
  year: string;
  requesterName: string;
  position: string;
}

interface Schedule {
  id: number;
  employeeId: string;
  fullName: string;
  leaveYearId: number;
  status: string;
}

interface LeaveDetail {
  id: number;
  leaveMonth: string;
  noDays: number;
  description: string;
}

const ApproverDecisionForm = ({ scheduleId, onStatusUpdate }: { scheduleId: string; onStatusUpdate: (schedule: Schedule) => void }) => {
  const [approverDecision, setApproverDecision] = useState('');
  const [remark, setRemark] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!scheduleId || !approverDecision) {
      setError('Please select a decision and ensure a request is selected.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/api/leave-schedules/${scheduleId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: approverDecision === 'approve' ? 'Approved' : 'Rejected',
          remark,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status} ${response.statusText}`);
      }

      const updatedSchedule = await response.json();
      onStatusUpdate(updatedSchedule);
      setApproverDecision('');
      setRemark('');
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
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

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
        <motion.div variants={itemVariants}>
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
          className="px-4 py-2 bg-[#3c8dbc] text-white rounded-md text-sm font-medium hover:bg-[#3c8dbc]/90 transition-colors shadow-md"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Create'}
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
          const response = await fetch(`http://localhost:8080/api/leave-schedules/${scheduleId}/details`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
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
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-sm text-gray-500 text-center">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-sm text-red-500 text-center">
                  {error}
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 px-4 text-sm text-gray-500 text-center">
                  No records found
                </td>
              </tr>
            ) : (
              records.map((record, index) => (
                <tr key={record.id} className="border-t border-[#3c8dbc]/20">
                  <td className="py-3 px-4 text-sm text-gray-700">{index + 1}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{record.leaveMonth}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{record.noDays}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{record.description}</td>
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
    fullName: '',
    department: '',
    year: '',
    requesterName: '',
    position: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8080/api/leave-schedules', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch schedules: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const schedulesWithEmployee = await Promise.all(
          data.map(async (schedule: Schedule) => {
            try {
              const empResponse = await fetch(`http://localhost:8080/api/employees/${schedule.employeeId}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              let serverMessage = `Status: ${empResponse.status} ${empResponse.statusText}`;
              if (!empResponse.ok) {
                try {
                    const errorBody = await empResponse.json(); 
                    serverMessage = errorBody.message || errorBody.error || JSON.stringify(errorBody);
                } catch (e) { 
                    try {
                        serverMessage = await empResponse.text();
                    } catch (e2) { /* Ignore if text also fails */ }
                }
                if (empResponse.status === 404) {
                  throw new Error(`Employee not found with ID: ${schedule.employeeId}. Server said: ${serverMessage}`);
                }
                throw new Error(`Failed to fetch employee ${schedule.employeeId}. Server said: ${serverMessage}`);
              }
              const employee = await empResponse.json();
              return {
                ...schedule,
                fullName: `${employee.firstName} ${employee.lastName || ''}`.trim(),
              };
            } catch (err: any) {
              console.error(`Error fetching details for employee ${schedule.employeeId}:`, err.message);
              return { ...schedule, fullName: `Unknown (${schedule.employeeId})` };
            }
          })
        );
        setSchedules(schedulesWithEmployee);
      } catch (err: any) {
        let errorMessage = 'Failed to fetch leave schedules';
        if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Unable to connect to the server. Please ensure the backend is running at http://localhost:8080.';
        } else if (err.message.includes('404')) {
          errorMessage = 'Leave schedules not found. Please check the backend configuration.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Server error occurred. Please check the backend logs.';
        } else {
          errorMessage = `Failed to fetch leave schedules: ${err.message}`;
        }
        setError(errorMessage);
        console.error('Error fetching schedules:', err, { status: err.status, statusText: err.statusText });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  const handleRequestChange = async (selectedOption: any) => {
    const selectedId = selectedOption ? selectedOption.value : '';
    setRequestId(selectedId);

    if (selectedId) {
      setIsLoading(true);
      setError(null);
      try {
        const scheduleResponse = await fetch(`http://localhost:8080/api/leave-schedules/${selectedId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        let serverMessageSchedule = `Status: ${scheduleResponse.status} ${scheduleResponse.statusText}`;
        if (!scheduleResponse.ok) {
          try {
            const errorBody = await scheduleResponse.json();
            serverMessageSchedule = errorBody.message || errorBody.error || JSON.stringify(errorBody);
          } catch (e) {
             try {
                serverMessageSchedule = await scheduleResponse.text();
            } catch (e2) { /* Ignore if text also fails */ }
          }
          throw new Error(`Failed to fetch schedule ${selectedId}. Server said: ${serverMessageSchedule}`);
        }
        const schedule = await scheduleResponse.json();

        const empResponse = await fetch(`http://localhost:8080/api/employees/${schedule.employeeId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        let serverMessageEmployee = `Status: ${empResponse.status} ${empResponse.statusText}`;
        if (!empResponse.ok) {
          try {
            const errorBody = await empResponse.json();
            serverMessageEmployee = errorBody.message || errorBody.error || JSON.stringify(errorBody);
          } catch (e) {
            try {
                serverMessageEmployee = await empResponse.text();
            } catch (e2) { /* Ignore if text also fails */ }
          }
          if (empResponse.status === 404) {
            throw new Error(`Employee not found with ID: ${schedule.employeeId}. Server said: ${serverMessageEmployee}`);
          }
          throw new Error(`Failed to fetch employee ${schedule.employeeId}. Server said: ${serverMessageEmployee}`);
        }
        const employee = await empResponse.json();
        setEmployeeDetails({
          fullName: schedule.employeeId,
          department: employee.department?.depName || 'Unknown',
          year: schedule.leaveYearId.toString(),
          requesterName: `${employee.firstName} ${employee.lastName || ''}`.trim(),
          position: employee.position?.positionName || 'Unknown',
        });
      } catch (err: any) {
        setError(`Failed to load request details: ${err.message}`);
        console.error('Error fetching request details:', err);
        setEmployeeDetails({
          fullName: '',
          department: '',
          year: '',
          requesterName: '',
          position: '',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setEmployeeDetails({
        fullName: '',
        department: '',
        year: '',
        requesterName: '',
        position: '',
      });
    }
  };

  const handleStatusUpdate = (updatedSchedule: Schedule) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === updatedSchedule.id ? { ...schedule, status: updatedSchedule.status } : schedule
    ));
    setRequestId('');
    setEmployeeDetails({
      fullName: '',
      department: '',
      year: '',
      requesterName: '',
      position: '',
    });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  // Prepare options for react-select
  const scheduleOptions = [
    { value: '', label: '--Select One--' },
    ...schedules.map(schedule => ({
      value: schedule.id.toString(),
      label: `${schedule.employeeId} - ${schedule.fullName}`,
    })),
  ];

  return (
    <div className="min-h-screen p-6 font-sans relative overflow-y-auto">
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
            Leave Schedule Approve
          </h1>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 ml-14">
              <motion.div variants={itemVariants} className="mb-6">
                <label className="block text-sm font-medium text-red-500 mb-1">
                  Request:
                </label>
                <Select
                  options={scheduleOptions}
                  onChange={handleRequestChange}
                  value={scheduleOptions.find(option => option.value === requestId) || null}
                  isDisabled={isLoading}
                  placeholder="--Select One--"
                  className="w-3/4"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      borderColor: '#d1d5db',
                      borderRadius: '0.375rem',
                      padding: '0.1rem',
                      '&:hover': {
                        borderColor: '#3c8dbc',
                      },
                      boxShadow: 'none',
                    }),
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 20,
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isSelected ? '#3c8dbc' : state.isFocused ? '#e6f0fa' : 'white',
                      color: state.isSelected ? 'white' : '#374151',
                    }),
                  }}
                />
                {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requester Id:</label>
                <input
                  type="text"
                  value={isLoading ? 'Loading...' : employeeDetails.fullName}
                  readOnly
                  className="w-3/4 px-2 py-1 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
                <input
                  type="text"
                  value={isLoading ? 'Loading...' : employeeDetails.department}
                  readOnly
                  className="w-3/4 px-2 py-1 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </motion.div>
            </div>
            <div className="space-y-4 ml-12 mr-4">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requester Name:</label>
                <input
                  type="text"
                  value={isLoading ? 'Loading...' : employeeDetails.requesterName}
                  readOnly
                  className="w-3/4 px-2 py-1 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position:</label>
                <input
                  type="text"
                  value={isLoading ? 'Loading...' : employeeDetails.position}
                  readOnly
                  className="w-3/4 px-2 py-1 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year:</label>
                <input
                  type="text"
                  value={isLoading ? 'Loading...' : employeeDetails.year}
                  readOnly
                  className="w-3/4 px-2 py-1 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
        <LeaveMonthOptions scheduleId={requestId} />
        <ApproverDecisionForm scheduleId={requestId} onStatusUpdate={handleStatusUpdate} />
      </div>
    </div>
  );
};

export default LeaveScheduleApprove;