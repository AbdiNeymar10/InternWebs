"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { getLeaveTypes } from '../../api/leaveTypes';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LeaveType {
  id: number;
  leaveName: string;
  leaveCode: string;
  description: string;
  status: string;
}

interface FormData {
  leaveType: string;
  gender: string;
  employmentType: string;
  paymentType: string;
  minDays: string;
  maxDays: string;
  remark: string;
  balance: number;
  escapeSunday: number;
  escapeSaturday: number;
  escapeHoliday: number;
}

interface LeaveFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function LeaveForm({ formData, setFormData, handleSubmit }: LeaveFormProps) {
  const [leaveTypeOptions, setLeaveTypeOptions] = useState<LeaveType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMaternityLeave, setIsMaternityLeave] = useState(false);

  // Fetch leave types for dropdown
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const types = await getLeaveTypes();
        setLeaveTypeOptions(types);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching leave types:', error);
        toast.error('Failed to load leave types');
        setIsLoading(false);
      }
    };
    
    fetchLeaveTypes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    // Handle checkbox conversion to 1/0
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked ? 1 : 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // Check if selected leave type is Maternity (የወሊድ)
      if (name === 'leaveType') {
        const selectedLeave = leaveTypeOptions.find(lt => lt.id.toString() === value);
        const isMaternity = selectedLeave?.leaveName === 'የወሊድ';
        setIsMaternityLeave(isMaternity);
        
        // If maternity leave is selected and gender is 'all', reset it
        if (isMaternity && formData.gender === 'all') {
          setFormData(prev => ({
            ...prev,
            gender: ''
          }));
        }
      }
    }
  };

  const containerVariants = {
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen p-6 font-sans relative">
      {/* Background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc]/10 to-purple-50 opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3c8dbc] to-[#2c6da4]">
              Leave Setting
            </h1>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Leave Type */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leave Type
                </label>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                  required
                  disabled={isLoading}
                >
                  <option value="">-- Select One --</option>
                  {leaveTypeOptions.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.leaveName}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Gender */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  For Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                  required
                >
                  <option value="">-- Select One --</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  {!isMaternityLeave && <option value="all">Both</option>}
                </select>
              </motion.div>

              {/* Employment Type */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                  required
                >
                  <option value="">-- Select One --</option>
                  <option value="permanent">Permanent</option>
                  <option value="temporary">Temporary</option>
                </select>
              </motion.div>

              {/* Remark */}
              <motion.div variants={itemVariants} className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remark
                </label>
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                  rows={3}
                  placeholder="Enter additional information about this leave policy..."
                />
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Payment Type */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type
                </label>
                <select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                  required
                >
                  <option value="">-- Select One --</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </motion.div>

              {/* Minimum Days */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Days
                </label>
                <input
                  type="number"
                  name="minDays"
                  value={formData.minDays}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                  required
                  min="0"
                />
              </motion.div>

              {/* Maximum Days */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Days
                </label>
                <input
                  type="number"
                  name="maxDays"
                  value={formData.maxDays}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                  required
                  min="0"
                />
              </motion.div>
            </div>
          </div>
          
          {/* Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <motion.div variants={itemVariants}>
              <h3 className="font-medium mb-2 text-sm text-gray-700">
                Balance
              </h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="balance"
                  name="balance"
                  checked={formData.balance === 1}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 text-[#3c8dbc] focus:ring-[#3c8dbc] border-gray-300 rounded"
                />
                <label htmlFor="balance" className="text-sm text-gray-700">
                  Balance
                </label>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="font-medium mb-2 text-sm text-gray-700">
                Escape Strategy
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="escapeSunday"
                    name="escapeSunday"
                    checked={formData.escapeSunday === 1}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-[#3c8dbc] focus:ring-[#3c8dbc] border-gray-300 rounded"
                  />
                  <label htmlFor="escapeSunday" className="text-sm text-gray-700">
                    Escape Sunday
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="escapeSaturday"
                    name="escapeSaturday"
                    checked={formData.escapeSaturday === 1}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-[#3c8dbc] focus:ring-[#3c8dbc] border-gray-300 rounded"
                  />
                  <label htmlFor="escapeSaturday" className="text-sm text-gray-700">
                    Escape Saturday
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="escapeHoliday"
                    name="escapeHoliday"
                    checked={formData.escapeHoliday === 1}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-[#3c8dbc] focus:ring-[#3c8dbc] border-gray-300 rounded"
                  />
                  <label htmlFor="escapeHoliday" className="text-sm text-gray-700">
                    Escape Holiday
                  </label>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Submit Button */}
          <motion.div 
            variants={itemVariants}
            className="pt-6 flex justify-end"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              type="submit"
              className="px-4 py-2 bg-[#3c8dbc] text-white rounded-md text-sm font-medium hover:bg-[#3c8dbc]/90 transition-colors shadow-md"
              disabled={!formData.leaveType || isLoading}
            >
              {isLoading ? 'Loading...' : 'Save'}
            </button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}