"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
const Select = dynamic(() => import('react-select'), { ssr: false });
import { authFetch } from "@/utils/authFetch";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

function FormComponent({ formData, handleChange }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden p-6 mb-6"
    >
      <div className="w-full max-w-6xl">
        <h2 className="text-lg font-semibold text-gray-600 mb-4">
          Delegatee List Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 ml-14">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delegatee Name ፡
              </label>
              <input
                type="text"
                name="delegateeName"
                value={formData.delegateeName}
                onChange={handleChange}
                className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                readOnly
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department ፡
              </label>
              <input
                type="text"
                name="delegateeDepartment"
                value={formData.delegateeDepartment}
                onChange={handleChange}
                className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                readOnly
              />
            </motion.div>
          </div>
          <div className="space-y-4 ml-14">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delegatee Id ፡
              </label>
              <input
                type="text"
                name="delegateeId"
                value={formData.delegateeId}
                onChange={handleChange}
                className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                readOnly
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position :
              </label>
              <input
                type="text"
                name="delegateePosition"
                value={formData.delegateePosition}
                onChange={handleChange}
                className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                readOnly
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FileUploadComponent({ formData, handleChange }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden p-6 mb-6"
    >
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-600 mb-4">
          Terminate Delegation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-14">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Updated By :
            </label>
            <input
              type="text"
              name="updatedBy"
              value={formData.updatedBy}
              onChange={handleChange}
              className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
              required
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date :
            </label>
            <input
              type="date"
              name="updatedDate"
              value={formData.updatedDate}
              onChange={handleChange}
              className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
              required
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Updator Remark ፡
            </label>
            <textarea
              name="updatorRemark"
              value={formData.updatorRemark}
              onChange={handleChange}
              className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200 h-[40px]"
              required
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function Home({ formData, onTerminate, selectedFile, onFileSelect }) {
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file);
    } else {
      onFileSelect(null);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden p-6 mb-6"
    >
      <div className="w-full max-w-6xl">
        <h2 className="text-lg font-semibold text-gray-600 mb-4">
          Supportive File Information ፡
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex-1">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex-1">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-4 flex-wrap">
                    <label htmlFor="file-upload-input" className="bg-gray-200 text-blue-600 font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-gray-300 cursor-pointer">
                      <span className="text-xl">+</span>
                      <span>Browse File</span>
                      <input id="file-upload-input" type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                    {selectedFile && (
                        <button
                            type="button"
                            onClick={() => {
                                onFileSelect(null);
                                const fileInput = document.getElementById('file-upload-input');
                                if (fileInput) {
                                    fileInput.value = "";
                                }
                            }}
                            className="bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 hover:bg-red-200"
                        >
                            <span className="text-xl">×</span>
                            <span>Clear Selection</span>
                        </button>
                    )}
                  </div>
                  {selectedFile && (
                    <div className="mt-2 text-sm text-gray-700">
                      Selected file: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </div>
                  )}
                  {formData?.doctRete && !selectedFile && (
                    <div className="mt-2 text-sm text-gray-700">
                      Existing file: <strong>{formData.doctRete}</strong>
                    </div>
                  )}
                  <div className="flex-grow"></div>
                </div>
              </div>
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex-1">
                <div className="flex flex-col h-full">
                  <div className="flex justify-end items-center mb-4">
                    <span className="text-gray-600 mr-2">(1 of 1)</span>
                    <button className="text-gray-400 hover:text-gray-600">«</button>
                    <button className="text-gray-400 hover:text-gray-600 ml-1">{'<'}</button>
                    <button className="text-gray-400 hover:text-gray-600 ml-1">{'>'}</button>
                    <button className="text-gray-400 hover:text-gray-600 ml-1">»</button>
                  </div>
                  <div className="flex-grow flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      {selectedFile ? `Preview for ${selectedFile.name} (if applicable)` : 
                       formData?.doctRete ? `Existing file: ${formData.doctRete}` : "No file selected for preview."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <button
            className="bg-gradient-to-r from-[#3c8dbc] to-[#2c6da4] text-white font-semibold py-2 px-6 rounded-lg flex items-center space-x-2 hover:opacity-90 transition-colors duration-200"
            onClick={onTerminate}
          >
            <span>Terminate Delegation</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function TerminateDelegation() {
  const [formData, setFormData] = useState({
    id: "",
    formType: "",
    delegatorName: "",
    delegatorDepartment: "",
    delegatorFromDate: "",
    delegatorRequestDate: "",
    delegatorId: "",
    delegatorPosition: "",
    delegatorToDate: "",
    delegatorReason: "",
    delegateeName: "",
    delegateeDepartment: "",
    delegateeId: "",
    delegateePosition: "",
    updatedBy: "",
    updatedDate: "",
    updatorRemark: "",
    doctRete: "",
    status: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [delegations, setDelegations] = useState([]);

  useEffect(() => {
  authFetch('http://localhost:8080/api/hr-power-delegation')
    .then(async response => {
      let data = [];
      try {
        data = await response.json();
      } catch (e) {
        console.error('Failed to parse delegations JSON:', e);
      }
      const pendingDelegations = Array.isArray(data)
        ? data.filter(delegation => delegation.status === "Pending")
        : [];
      setDelegations(pendingDelegations);
    })
    .catch(error => {
      console.error('Failed to fetch delegations:', error);
      toast.error(`Failed to fetch delegations: ${error.message}`);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setFormData(prev => ({
      ...prev,
      doctRete: file ? file.name.substring(0, 45) : prev.doctRete,
    }));
  };

  const handleDelegationSelect = async (selectedOption) => {
    if (selectedOption && selectedOption.value !== "") {
      const delegation = delegations.find(d => d.id.toString() === selectedOption.value);
      if (delegation) {
        try {
          const delegatorRes = await authFetch(`http://localhost:8080/api/employees/${delegation.delegatorId}/delegation-details`);
          const delegateeRes = await authFetch(`http://localhost:8080/api/employees/${delegation.delegateeId}/delegation-details`);
          const delegatorData = await delegatorRes.json();
          const delegateeData = await delegateeRes.json();
          setFormData({
            id: delegation.id,
            formType: delegation.id.toString(),
            delegatorName: (delegatorData && delegatorData.employeeName) || "",
            delegatorDepartment: (delegatorData && delegatorData.department) || "",
            delegatorFromDate: delegation.fromDate ? delegation.fromDate.split('T')[0] : "",
            delegatorRequestDate: delegation.requestDate || "",
            delegatorId: delegation.delegatorId || "",
            delegatorPosition: delegation.jobPosition || "",
            delegatorToDate: delegation.toDate || "",
            delegatorReason: delegation.requesterNotice || "",
            delegateeName: (delegateeData && delegateeData.employeeName) || "",
            delegateeDepartment: (delegateeData && delegateeData.department) || "",
            delegateeId: delegation.delegateeId || "",
            delegateePosition: (delegateeData && delegateeData.position) || "",
            updatedBy: "",
            updatedDate: "",
            updatorRemark: "",
            doctRete: delegation.doctRete || "",
            status: delegation.status || "",
          });
        } catch (error) {
          console.error('Failed to fetch employee details:', error);
          toast.error(`Failed to fetch employee details: ${error.message}`);
          setFormData(prev => ({
            ...prev,
            id: delegation.id,
            formType: delegation.id.toString(),
            delegatorId: delegation.delegatorId,
            delegateeId: delegation.delegateeId,
            doctRete: delegation.doctRete || "",
            status: delegation.status || "",
          }));
        }
      }
    } else {
      setFormData({
        id: "",
        formType: "",
        delegatorName: "",
        delegatorDepartment: "",
        delegatorFromDate: "",
        delegatorRequestDate: "",
        delegatorId: "",
        delegatorPosition: "",
        delegatorToDate: "",
        delegatorReason: "",
        delegateeName: "",
        delegateeDepartment: "",
        delegateeId: "",
        delegateePosition: "",
        updatedBy: "",
        updatedDate: "",
        updatorRemark: "",
        doctRete: "",
        status: "",
      });
      setSelectedFile(null);
    }
  };

  const handleTerminate = async () => {
    if (!formData.id || !formData.updatedBy || !formData.updatedDate || !formData.updatorRemark) {
      toast.warn("Please fill in all termination fields (Updated By, Updated Date, Updator Remark).");
      return;
    }

    const formDataPayload = new FormData();
    const delegationPayload = {
      id: formData.id,
      delegatorId: formData.delegatorId,
      delegateeId: formData.delegateeId,
      fromDate: formData.delegatorFromDate,
      toDate: formData.delegatorToDate,
      requestDate: formData.delegatorRequestDate,
      requesterNotice: formData.delegatorReason,
      doctRete: formData.doctRete,
      status: "TERMINATED",
      updatedBy: formData.updatedBy,
      updatedDate: formData.updatedDate,
      updatorRemark: formData.updatorRemark,
      jobPosition: formData.delegatorPosition,
    };

    formDataPayload.append('delegation', new Blob([JSON.stringify(delegationPayload)], { type: 'application/json' }));
    if (selectedFile) {
      formDataPayload.append('file', selectedFile);
    }

    try {
        const response = await authFetch(`http://localhost:8080/api/hr-power-delegation/${formData.id}`, {
          method: 'PUT',
          body: formDataPayload,
          headers: {
            // 'Content-Type' should NOT be set for FormData; browser will set it with correct boundary
          },
        });
      toast.success("Delegation terminated successfully!");
      setFormData({
        id: "",
        formType: "",
        delegatorName: "",
        delegatorDepartment: "",
        delegatorFromDate: "",
        delegatorRequestDate: "",
        delegatorId: "",
        delegatorPosition: "",
        delegatorToDate: "",
        delegatorReason: "",
        delegateeName: "",
        delegateeDepartment: "",
        delegateeId: "",
        delegateePosition: "",
        updatedBy: "",
        updatedDate: "",
        updatorRemark: "",
        doctRete: "",
        status: "",
      });
      setSelectedFile(null);
    } catch (error) {
      console.error('Error during termination:', error);
      let errorMessage = error.message;
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      }
      toast.error(`Failed to terminate delegation: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen p-6 font-sans relative overflow-y-auto">
      <ToastContainer position="top-right" autoClose={5000} />
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
            Terminate Delegation
          </h1>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden p-6 mb-6"
        >
          <div className="w-full max-w-6xl">
            <h2 className="text-lg font-semibold text-gray-600 mb-4">
              Status of delegation of responsibility
            </h2>
            <motion.div variants={itemVariants} className="mb-6 ml-14">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delegators List:
              </label>
              <div className="relative w-3/4">
                <Select
                  name="formType"
                  value={delegations.find(d => d.id.toString() === formData.formType) ? { value: formData.formType, label: `ID: ${formData.formType} | Delegator: ${formData.delegatorId}` } : null}
                  onChange={(option) => handleDelegationSelect(option || { value: "" })}
                  options={[{ value: "", label: "--- Select ---" }, ...delegations.map(d => ({ value: d.id.toString(), label: `ID: ${d.id} | Delegator: ${d.delegatorId}` }))]}
                  className="w-full"
                  classNamePrefix="select"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </motion.div>
            <h2 className="text-lg font-semibold text-gray-600 mb-4">
              Delegator List Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 ml-14">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delegator Name:
                  </label>
                  <input
                    type="text"
                    name="delegatorName"
                    value={formData.delegatorName}
                    onChange={handleChange}
                    className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                    readOnly
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department:
                  </label>
                  <input
                    type="text"
                    name="delegatorDepartment"
                    value={formData.delegatorDepartment}
                    onChange={handleChange}
                    className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                    readOnly
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date :
                  </label>
                  <input
                    type="text"
                    name="delegatorFromDate"
                    value={formData.delegatorFromDate}
                    onChange={handleChange}
                    className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                    readOnly
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Request Date :
                  </label>
                  <input
                    type="text"
                    name="delegatorRequestDate"
                    value={formData.delegatorRequestDate}
                    onChange={handleChange}
                    className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                    readOnly
                  />
                </motion.div>
              </div>
              <div className="space-y-4 ml-14">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delegator Id :
                  </label>
                  <input
                    type="text"
                    name="delegatorId"
                    value={formData.delegatorId}
                    onChange={handleChange}
                    className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                    readOnly
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position :
                  </label>
                  <input
                    type="text"
                    name="delegatorPosition"
                    value={formData.delegatorPosition}
                    onChange={handleChange}
                    className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                    readOnly
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date :
                  </label>
                  <input
                    type="text"
                    name="delegatorToDate"
                    value={formData.delegatorToDate}
                    onChange={handleChange}
                    className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                    readOnly
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason ፡
                  </label>
                  <textarea
                    name="delegatorReason"
                    value={formData.delegatorReason}
                    onChange={handleChange}
                    className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200 h-[40px]"
                    readOnly
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
        <FormComponent formData={formData} handleChange={handleChange} />
        <FileUploadComponent formData={formData} handleChange={handleChange} />
        <Home
          formData={formData}
          onTerminate={handleTerminate}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
        />
      </div>
    </div>
  );
}