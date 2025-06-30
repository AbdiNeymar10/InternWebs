"use client";
import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { getLeaveTypes, createLeaveType, updateLeaveType, deleteLeaveType } from '../api/leaveTypes';

interface LeaveType {
  id: number;
  leaveName: string;
  leaveCode: string;
  description: string;
  status: string;
}

const LeaveTypesTable = () => {
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [tableFormData, setTableFormData] = useState({
    leaveName: '',
    leaveCode: '',
    description: '',
    status: 'Active'
  });

  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leave types from backend
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const data = await getLeaveTypes();
        setLeaveTypes(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };
    
    fetchLeaveTypes();
  }, []);

  const handleAddLeaveType = async () => {
    if (!tableFormData.leaveName || !tableFormData.leaveCode) return;

    try {
      if (isEditing && currentId) {
        const updatedLeaveType = await updateLeaveType(currentId, tableFormData);
        setLeaveTypes(leaveTypes.map(lt => lt.id === currentId ? updatedLeaveType : lt));
      } else {
        const newLeaveType = await createLeaveType(tableFormData);
        setLeaveTypes([...leaveTypes, newLeaveType]);
      }
      
      resetForm();
    } catch (err) {
      console.error('Failed to save leave type:', err);
      setError(err instanceof Error ? err.message : 'Failed to save leave type');
    }
  };

  const handleEdit = (leaveType: LeaveType) => {
    setTableFormData({
      leaveName: leaveType.leaveName,
      leaveCode: leaveType.leaveCode,
      description: leaveType.description,
      status: leaveType.status
    });
    setCurrentId(leaveType.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this leave type?')) {
      try {
        await deleteLeaveType(id);
        setLeaveTypes(leaveTypes.filter(lt => lt.id !== id));
      } catch (err) {
        console.error('Failed to delete leave type:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete leave type');
      }
    }
  };

  const resetForm = () => {
    setTableFormData({
      leaveName: '',
      leaveCode: '',
      description: '',
      status: 'Active'
    });
    setCurrentId(null);
    setIsEditing(false);
    setShowForm(false);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-100 text-red-700 rounded-md">
      Error: {error}
      <button 
        onClick={() => setError(null)} 
        className="ml-4 px-2 py-1 bg-red-200 rounded-md hover:bg-red-300"
      >
        Dismiss
      </button>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="flex justify-between items-center px-6 py-3 bg-[#3c8dbc] h-[50px]">
          <h2 className="text-xl font-semibold text-white">HR_LU_LEAVE_TYPE</h2>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center p-2 bg-white text-blue-600 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            title="Add new leave type"
          >
            <FiPlus className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-x-auto">
          <div className="overflow-y-auto max-h-[300px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-2 text-left text-xs font-bold text-black uppercase tracking-wider">S/N</th>
                  <th className="px-6 py-2 text-left text-xs font-bold text-black uppercase tracking-wider">ID</th>
                  <th className="px-6 py-2 text-left text-xs font-bold text-black uppercase tracking-wider">LEAVE_NAME</th>
                  <th className="px-6 py-2 text-left text-xs font-bold text-black uppercase tracking-wider">LEAVE_CODE</th>
                  <th className="px-6 py-2 text-left text-xs font-bold text-black uppercase tracking-wider">DESCRIPTION</th>
                  <th className="px-6 py-2 text-left text-xs font-bold text-black uppercase tracking-wider">STATUS</th>
                  <th className="px-6 py-2 text-left text-xs font-bold text-black uppercase tracking-wider">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveTypes.map((leave, index) => (
                  <tr key={leave.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{leave.id}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{leave.leaveName}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-900">{leave.leaveCode}</td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                      {leave.description || '-'}
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${leave.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(leave)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FiEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(leave.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Leave Type Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {isEditing ? 'Edit Leave Type' : 'Add New Leave Type'}
              </h3>
              <button 
                onClick={resetForm} 
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">LEAVE_NAME *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tableFormData.leaveName}
                  onChange={(e) => setTableFormData({...tableFormData, leaveName: e.target.value})}
                  placeholder="Enter leave name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">LEAVE_CODE *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tableFormData.leaveCode}
                  onChange={(e) => setTableFormData({...tableFormData, leaveCode: e.target.value})}
                  placeholder="Enter leave code"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">DESCRIPTION</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  value={tableFormData.description}
                  onChange={(e) => setTableFormData({...tableFormData, description: e.target.value})}
                  placeholder="Enter description (optional)"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">STATUS</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tableFormData.status}
                  onChange={(e) => setTableFormData({...tableFormData, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLeaveType}
                className={`px-4 py-2 text-white rounded-md transition-colors ${
                  !tableFormData.leaveName || !tableFormData.leaveCode
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#3c8dbc] hover:bg-[#3c8dbc]/90'
                }`}
                disabled={!tableFormData.leaveName || !tableFormData.leaveCode}
              >
                {isEditing ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveTypesTable;