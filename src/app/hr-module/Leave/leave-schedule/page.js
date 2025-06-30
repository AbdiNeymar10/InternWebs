'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiX, FiChevronUp, FiChevronDown, FiEdit2, FiSave, FiTrash2 } from "react-icons/fi";
import {
  getLeaveScheduleDetails,
  createLeaveScheduleDetail,
  updateLeaveScheduleDetail,
  deleteLeaveScheduleDetail
} from '../services/leaveScheduleService';

function LowSwitchOptions({ employeeId, year }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    leaveMonth: '',
    noDays: '',
    description: '',
    priority: 0,
    scheduleId: null
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (employeeId && year) {
      fetchLeaveScheduleDetails();
    }
  }, [employeeId, year]);

  const fetchLeaveScheduleDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // First, check if a leave schedule exists for this employee and year
      const response = await fetch(`http://localhost:8080/api/leave-schedules?employeeId=${employeeId}&leaveYearId=${year}`);
      const schedules = await response.json();
      
      if (schedules.length > 0) {
        // If schedule exists, get its details
        const scheduleId = schedules[0].id;
        const details = await getLeaveScheduleDetails(scheduleId);
        setRecords(details);
        setFormData(prev => ({ ...prev, scheduleId }));
      } else {
        // If no schedule exists, create one
        const newSchedule = {
          leaveYearId: parseInt(year),
          employeeId,
          status: 'Pending',
          description: `Leave schedule for ${employeeId} in ${year}`
        };
        
        const createResponse = await fetch('http://localhost:8080/api/leave-schedules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSchedule),
        });
        
        const createdSchedule = await createResponse.json();
        setFormData(prev => ({ ...prev, scheduleId: createdSchedule.id }));
        setRecords([]);
      }
    } catch (err) {
      setError('Failed to fetch leave schedule details');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddRecord = async () => {
    if (formData.leaveMonth && formData.noDays && formData.scheduleId) {
      try {
        const newDetail = {
          leaveMonth: formData.leaveMonth,
          noDays: formData.noDays,
          description: formData.description,
          priority: formData.priority,
          scheduleId: formData.scheduleId
        };
        
        const createdDetail = await createLeaveScheduleDetail(newDetail);
        setRecords([...records, createdDetail]);
        
        setFormData({
          leaveMonth: '',
          noDays: '',
          description: '',
          priority: 0,
          scheduleId: formData.scheduleId
        });
        setShowAddForm(false);
      } catch (err) {
        setError('Failed to create leave schedule detail');
        console.error(err);
      }
    }
  };

  const handleEditRecord = (id) => {
    const recordToEdit = records.find(record => record.id === id);
    if (recordToEdit) {
      setFormData({
        leaveMonth: recordToEdit.leaveMonth,
        noDays: recordToEdit.noDays,
        description: recordToEdit.description,
        priority: recordToEdit.priority,
        scheduleId: recordToEdit.hrLeaveSchedule?.id || formData.scheduleId
      });
      setEditingId(id);
      setShowAddForm(true);
    }
  };

  const handleUpdateRecord = async () => {
    if (formData.leaveMonth && formData.noDays && editingId) {
      try {
        const updatedDetail = {
          leaveMonth: formData.leaveMonth,
          noDays: formData.noDays,
          description: formData.description,
          priority: formData.priority,
          scheduleId: formData.scheduleId
        };
        
        const result = await updateLeaveScheduleDetail(editingId, updatedDetail);
        
        setRecords(records.map(record => 
          record.id === editingId ? result : record
        ));
        
        setFormData({
          leaveMonth: '',
          noDays: '',
          description: '',
          priority: 0,
          scheduleId: formData.scheduleId
        });
        setEditingId(null);
        setShowAddForm(false);
      } catch (err) {
        setError('Failed to update leave schedule detail');
        console.error(err);
      }
    }
  };

  const handleDeleteRecord = async (id) => {
    try {
      await deleteLeaveScheduleDetail(id);
      setRecords(records.filter(r => r.id !== id));
    } catch (err) {
      setError('Failed to delete leave schedule detail');
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 font-sans relative">
      {/* Background gradient - changed from fixed to absolute */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc]/10 to-purple-50 opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden p-6 mb-8"
        >
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#3c8dbc]/20">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3c8dbc] to-[#2c6da4]">
              Leave Month Options
            </h1>
            <motion.button 
              onClick={() => {
                setEditingId(null);
                setShowAddForm(true);
              }}
              className="bg-[#3c8dbc] text-white px-4 py-2 rounded-md hover:bg-[#367fa9] text-sm flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiPlus size={16} />
              Add
            </motion.button>
          </div>

          {/* Table Section */}
          <div className="border border-[#3c8dbc]/30 rounded-lg overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#3c8dbc]/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3c8dbc]">NO</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3c8dbc]">Leave Month</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3c8dbc]">No Days</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3c8dbc]">Description</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3c8dbc]">Priority</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3c8dbc]">Action</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-4 px-4 text-sm text-gray-500 text-center">
                      No records found
                    </td>
                  </tr>
                ) : (
                  records.map((record, index) => (
                    <tr key={record.id} className="border-t border-[#3c8dbc]/20 hover:bg-[#3c8dbc]/5">
                      <td className="py-3 px-4 text-sm text-gray-700">{index + 1}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{record.leaveMonth}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{record.noDays}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{record.description}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{record.priority}</td>
                      <td className="py-3 px-4 text-sm text-gray-700 flex gap-2">
                        <motion.button 
                          onClick={() => handleEditRecord(record.id)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </motion.button>
                        <motion.button 
                          onClick={() => handleDeleteRecord(record.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </motion.button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Popup Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
                setFormData({
                  leaveMonth: '',
                  noDays: '',
                  description: '',
                  priority: 0,
                  scheduleId: formData.scheduleId
                });
              }}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-[#3c8dbc]/30">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-[#3c8dbc]">
                      {editingId ? 'Edit Leave Month' : 'Add Leave Month'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingId(null);
                        setFormData({
                          leaveMonth: '',
                          noDays: '',
                          description: '',
                          priority: 0,
                          scheduleId: formData.scheduleId
                        });
                      }}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Leave Month:</label>
                    <input 
                      type="text" 
                      name="leaveMonth"
                      value={formData.leaveMonth}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">No Days:</label>
                    <input 
                      type="text" 
                      name="noDays"
                      value={formData.noDays}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Priority:</label>
                    <input 
                      type="number" 
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Description:</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                    />
                  </div>
                </div>
                
                <div className="p-4 border-t border-[#3c8dbc]/20 flex justify-end space-x-3">
                  <motion.button 
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingId(null);
                      setFormData({
                        leaveMonth: '',
                        noDays: '',
                        description: '',
                        priority: 0,
                        scheduleId: formData.scheduleId
                      });
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    onClick={editingId ? handleUpdateRecord : handleAddRecord}
                    className="px-4 py-2 bg-[#3c8dbc] text-white rounded-md text-sm hover:bg-[#367fa9] transition-colors shadow-md flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {editingId ? <FiSave size={16} /> : <FiPlus size={16} />}
                    {editingId ? 'Update' : 'Add'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function HRMSystem() {
  const [formData, setFormData] = useState({
    employeeId: 'EMP001',
    nameOrId: '',
    department: '',
    year: new Date().getFullYear().toString(),
    selectedOption: '',
    position: '',
    aType: '',
    bCustomer: '',
    iListedSchedule: ''
  });
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);
  const [employeeError, setEmployeeError] = useState(null);

  const fetchEmployeeData = async (empId) => {
    setIsLoadingEmployee(true);
    setEmployeeError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/employees/${empId}`);
      if (!response.ok) {
        throw new Error('Employee not found');
      }
      const employee = await response.json();
      setFormData(prev => ({
        ...prev,
        nameOrId: `${employee.firstName} ${employee.lastName || ''}`.trim(),
        department: employee.department?.depName || 'Unknown',
        position: employee.position?.positionName || 'Unknown'
      }));
    } catch (err) {
      setEmployeeError('Failed to fetch employee details');
      console.error(err);
      setFormData(prev => ({
        ...prev,
        nameOrId: '',
        department: '',
        position: ''
      }));
    } finally {
      setIsLoadingEmployee(false);
    }
  };

  useEffect(() => {
    if (formData.employeeId) {
      fetchEmployeeData(formData.employeeId);
    }
  }, [formData.employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const incrementYear = () => {
    setFormData(prev => ({
      ...prev,
      year: String(Number(prev.year) + 1)
    }));
  };

  const decrementYear = () => {
    setFormData(prev => ({
      ...prev,
      year: String(Math.max(Number(prev.year) - 1, new Date().getFullYear() - 5))
    }));
  };

  return (
    <div className="min-h-screen p-6 font-sans relative">
      {/* Background gradient - changed from fixed to absolute */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc]/10 to-purple-50 opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden mb-8"
        >
          {/* Header */} 
          <div className="px-6 py-4 border-b border-[#3c8dbc]/20 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3c8dbc] to-[#2c6da4]">
              Leave Schedule
            </h1>
            <div className="text-lg font-medium text-[#3c8dbc]">Total Leave Days: 0.0</div>
          </div>

          {/* Request Section */}
          <div className="px-6 py-4 border-b border-[#3c8dbc]/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                />
                {employeeError && (
                  <div className="text-red-500 text-sm mt-1">{employeeError}</div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                <input
                  type="text"
                  name="nameOrId"
                  value={isLoadingEmployee ? 'Loading...' : formData.nameOrId}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={isLoadingEmployee ? 'Loading...' : formData.department}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  name="position"
                  value={isLoadingEmployee ? 'Loading...' : formData.position}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <div className="flex items-center gap-2">
                  <div className="flex flex-1">
                    <motion.button 
                      type="button"
                      onClick={decrementYear}
                      className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-l-md hover:bg-gray-300 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiChevronDown size={16} />
                    </motion.button>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border-t border-b border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] appearance-none"
                    >
                      {Array.from({ length: 11 }, (_, i) => {
                        const year = new Date().getFullYear() - 5 + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                    <motion.button 
                      type="button"
                      onClick={incrementYear}
                      className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-r-md hover:bg-gray-300 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiChevronUp size={16} />
                    </motion.button>
                  </div>
                  <motion.button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, year: new Date().getFullYear().toString() }))}
                    className="px-3 py-2 bg-[#3c8dbc] text-white rounded-md text-sm hover:bg-[#367fa9] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Current
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        <LowSwitchOptions employeeId={formData.employeeId} year={formData.year}/>
      </div>
    </div>
  );
}