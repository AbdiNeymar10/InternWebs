"use client";

import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import axios from 'axios';

interface DelegationRecord {
  id: string;
  delegateeId: string;
  delegatorId: string;
  startDate: string;
  toDate: string;
}

const DelegationHistory = () => {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<DelegationRecord[]>([]);

  const handleSearch = async (id: string) => {
    if (!id.trim()) {
      setRecords([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch delegations where ID is delegator
      const delegatorResponse = await axios.get(`http://localhost:8080/api/hr-power-delegation/delegator/${id}`, { timeout: 5000 });
      // Fetch delegations where ID is delegatee
      const delegateeResponse = await axios.get(`http://localhost:8080/api/hr-power-delegation/delegatee/${id}`, { timeout: 5000 });

      // Combine results, removing duplicates by ID
      const combinedRecords = [
        ...delegatorResponse.data,
        ...delegateeResponse.data.filter((d: any) => !delegatorResponse.data.some((dr: any) => dr.id === d.id))
      ].map((d: any) => ({
        id: d.id.toString(),
        delegateeId: d.delegateeId,
        delegatorId: d.delegatorId,
        startDate: d.startDate || '',
        toDate: d.toDate || ''
      }));

      setRecords(combinedRecords);
      if (combinedRecords.length === 0) {
        setError('No delegations found for this ID.');
      }
    } catch (err: any) {
      setError(`Failed to fetch delegations: ${err.response?.data?.message || err.message}`);
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReferenceNumber(value);
    handleSearch(value);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3c8dbc] to-[#2c6da4]">
          Delegation History
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gray-50 flex flex-col items-center p-4"
      >
        <div className="w-full max-w-screen-2xl">
          {/* Input Section */}
          <motion.div 
            className="w-full bg-white rounded-lg border border-[#3c8dbc]/30 shadow-md p-4 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >  
            <h2 className="text-lg font-semibold text-gray-600 mb-4">እረፍትን ይፈልጉ</h2>
            <div className="flex items-center">
              <input
                type="text"
                value={referenceNumber}
                onChange={handleInputChange}
                placeholder="Enter Employee or Delegator ID"
                className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 bg-white w-1/4"
              />
            </div>
          </motion.div>

          {/* Table Section */}
          <motion.div
            className="w-full bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-[#3c8dbc]/10 p-4 border-b border-[#3c8dbc]/20">
              <h2 className="text-lg font-semibold text-gray-600">Delegation History</h2>
            </div>

            {/* Pagination Controls (Top) */}
            <div className="flex justify-between items-center p-3 bg-gray-100 border-b border-[#3c8dbc]/20">
              <div className="flex items-center">
                <button 
                  disabled 
                  className="p-1 text-gray-400 cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="mx-2 text-sm text-gray-700">{records.length}</span>
                <button 
                  disabled 
                  className="p-1 text-gray-400 cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#3c8dbc]/10">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 border-r border-[#3c8dbc]/20">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 border-r border-[#3c8dbc]/20">Delegatee ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 border-r border-[#3c8dbc]/20">Delegator Id</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 border-r border-[#3c8dbc]/20">Start Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">End Date</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-4 px-4 text-sm text-gray-500 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={5} className="py-4 px-4 text-sm text-red-500 text-center">
                        {error}
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 px-4 text-sm text-gray-500 text-center">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr key={record.id} className="border-b border-[#3c8dbc]/10">
                        <td className="py-3 px-4 text-sm text-gray-700 border-r border-[#3c8dbc]/20">{record.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border-r border-[#3c8dbc]/20">{record.delegateeId}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border-r border-[#3c8dbc]/20">{record.delegatorId}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 border-r border-[#3c8dbc]/20">{record.startDate}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{record.toDate}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls (Bottom) */}
            <div className="flex justify-between items-center p-3 bg-gray-100 border-t border-[#3c8dbc]/20">
              <div className="flex items-center">
                <button 
                  disabled 
                  className="p-1 text-gray-400 cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  disabled 
                  className="p-1 text-gray-400 cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default DelegationHistory;