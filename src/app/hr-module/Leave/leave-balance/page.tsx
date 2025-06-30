'use client';
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import useSWR from 'swr';
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiRefreshCw,
  FiUser,
  FiCalendar,
  FiFileText,
  FiInfo,
  FiChevronDown,
  FiChevronUp,
  FiAlertTriangle
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

export default function LeaveBalance() {
  const [yearId, setYearId] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  type LeaveType = { id: number; leaveName: string };
  type LeaveYear = { id: number; lyear: string };

  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [leaveYears, setLeaveYears] = useState<LeaveYear[]>([]);
  type LeaveBalanceType = { totalDays: number; remainingDays: number };
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalanceType | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsInitialLoading(true);
      try {
        const [typesResponse, yearsResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/leave/leave-types'),
          axios.get('http://localhost:8080/api/leave/leave-years'),
        ]);
        setLeaveTypes(typesResponse.data);
        setLeaveYears(yearsResponse.data);
      } catch (err) {
        toast.error('Failed to fetch initial data');
        console.error('API Error (Initial Fetch):', err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchLeaveBalance = async () => {
      if (employeeId && yearId && leaveType) {
        setIsLoading(true);
        setError('');
        setLeaveBalance(null);
        const params = {
          employeeId,
          leaveYearId: parseInt(yearId),
          leaveTypeId: parseInt(leaveType),
        };
        
        try {
          const response = await axios.get('http://localhost:8080/api/leave/balance', { params });
          setLeaveBalance(response.data);
          toast.success('Leave balance loaded successfully');
        } catch (err) {
          let errorMsg = 'No records found';
          if (typeof err === 'object' && err !== null && 'response' in err) {
            const response = (err as any).response;
            errorMsg = response?.data?.message || errorMsg;
          }
          setError(errorMsg);
          toast.error(errorMsg);
          console.error('API Error (Leave Balance):', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      fetchLeaveBalance();
    }, 500); // Debounce to prevent rapid firing

    return () => clearTimeout(timer);
  }, [employeeId, yearId, leaveType]);

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

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2c6da4] to-[#3c8dbc]">
            Leave Balance System
          </h1>
          <p className="text-gray-600 mt-2">
            Check available leave days for employees
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-md rounded-xl border border-[#3c8dbc]/20 shadow-xl overflow-hidden"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#3c8dbc] mb-4 flex items-center">
              <FiFileText className="mr-2" />
              Search Leave Balance
            </h2>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    id="employeeId"
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="Enter employee ID"
                    disabled={isLoading || isInitialLoading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    id="year"
                    value={yearId}
                    onChange={(e) => setYearId(e.target.value)}
                    disabled={isLoading || isInitialLoading || leaveYears.length === 0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                  >
                    <option value="">-- Select Year --</option>
                    {leaveYears.map((year) => (
                      <option key={year.id} value={year.id}>
                        {year.lyear}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 mb-1">
                    Leave Type
                  </label>
                  <select
                    id="leaveType"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    disabled={isLoading || isInitialLoading || leaveTypes.length === 0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-[#3c8dbc] focus:border-transparent transition-colors"
                  >
                    <option value="">-- Select Leave Type --</option>
                    {leaveTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.leaveName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 text-red-700 rounded-md flex items-start"
                >
                  <FiAlertTriangle className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </form>
          </div>

          <div className="border-t border-[#3c8dbc]/20 p-6 bg-slate-50">
            <h2 className="text-xl font-semibold text-[#3c8dbc] mb-4 flex items-center">
              <FiInfo className="mr-2" />
              Leave Balance Results
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#3c8dbc]/20">
                    <th className="text-left py-3 px-4 text-[#3278a0] uppercase text-xs font-semibold tracking-wider">
                      No
                    </th>
                    <th className="text-left py-3 px-4 text-[#3278a0] uppercase text-xs font-semibold tracking-wider">
                      Employee ID
                    </th>
                    <th className="text-left py-3 px-4 text-[#3278a0] uppercase text-xs font-semibold tracking-wider">
                      Total Days
                    </th>
                    <th className="text-left py-3 px-4 text-[#3278a0] uppercase text-xs font-semibold tracking-wider">
                      Remaining Days
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-[#3c8dbc]">
                        <FiRefreshCw className="animate-spin inline-block mr-2" />
                        Loading leave balance...
                      </td>
                    </tr>
                  ) : leaveBalance ? (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-gray-700">1</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">
                        {employeeId}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {leaveBalance.totalDays ?? 'N/A'}
                      </td>
                      <td className={`py-3 px-4 text-sm font-medium ${
                        leaveBalance.remainingDays < 5 ? 'text-yellow-600' : 'text-gray-700'
                      }`}>
                        {leaveBalance.remainingDays ?? 'N/A'}
                        {leaveBalance.remainingDays < 5 && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            Low Balance
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-gray-500">
                        {isInitialLoading ? (
                          <>
                            <FiRefreshCw className="animate-spin inline-block mr-2" />
                            Loading initial data...
                          </>
                        ) : (
                          'Enter search criteria to view results'
                        )}
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
}