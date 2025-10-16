"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

type Vacancy = {
  postCode?: string;
  position?: string;
  icf?: string;
  percentNo?: number | string;
  requiredNo?: number | string;
  postDate?: string;
  deadline?: string;
  vacancyType?: string;
};

const InternalVacancyList: React.FC = () => {
  // Mock data - empty for now to match "No records found"
  const vacancies: Vacancy[] = [];

  return (
    <div className="min-h-screen p-6 font-sans relative overflow-y-auto">
      {/* Background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc]/10 to-purple-50 opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3c8dbc] to-[#2c6da4]">
            Internal Vacancy List
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden mb-8"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#3c8dbc]/20 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3c8dbc] to-[#2c6da4]">
              Vacancy List
            </h1>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="border border-[#3c8dbc]/30 rounded-lg overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#3c8dbc]/10">
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#3c8dbc] uppercase tracking-wider">
                      No
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#3c8dbc] uppercase tracking-wider">
                      Post Code
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#3c8dbc] uppercase tracking-wider">
                      Position
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#3c8dbc] uppercase tracking-wider">
                      ICF
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#3c8dbc] uppercase tracking-wider">
                      % No
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#3c8dbc] uppercase tracking-wider">
                      Required No
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#3c8dbc] uppercase tracking-wider">
                      Post Date
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#3c8dbc] uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#3c8dbc] uppercase tracking-wider">
                      Vacancy Type
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#3c8dbc] uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vacancies.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="py-4 px-4 text-sm text-gray-500 text-center"
                      >
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    vacancies.map((vacancy, index) => (
                      <motion.tr
                        key={index}
                        className="border-t border-[#3c8dbc]/20 hover:bg-[#3c8dbc]/5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td className="py-3 px-4 text-xs text-gray-700">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-700">
                          {vacancy.postCode}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-700">
                          {vacancy.position}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-700">
                          {vacancy.icf}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-700">
                          {vacancy.percentNo}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-700">
                          {vacancy.requiredNo}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-700">
                          {vacancy.postDate}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-700">
                          {vacancy.deadline}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-700">
                          {vacancy.vacancyType}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-700 flex gap-2">
                          <button className="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 transition-colors">
                            <FiEdit2 size={14} />
                          </button>
                          <button className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors">
                            <FiTrash2 size={14} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
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

export default InternalVacancyList;


