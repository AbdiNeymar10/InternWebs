"use client";

import { useState, useEffect, Component } from "react";
import { motion } from "framer-motion";
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { format } from 'date-fns'; // Currently unused, can be removed if not needed elsewhere

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-red-600">
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message || "Unknown error occurred."}</p>
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// HomeThree Component (File Upload Section)
function HomeThree({ onFileSelect, selectedFile }) {
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
      onFileSelect(null); // Notify parent if file selection is cleared
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
                                // Reset the file input visually
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
                  <div className="flex-grow"></div>
                </div>
              </div>
              <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex-1">
                <div className="flex flex-col h-full">
                  <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex-1 pt-0 pb-0">
                    <div className="flex justify-end items-center mb-4">
                      {/* Pagination UI - kept as is */}
                      <span className="text-gray-600 mr-2">(1 of 1)</span>
                      <button className="text-gray-400 hover:text-gray-600">«</button>
                      <button className="text-gray-400 hover:text-gray-600 ml-1">{'<'}</button>
                      <button className="text-gray-400 hover:text-gray-600 ml-1">{'>'}</button>
                      <button className="text-gray-400 hover:text-gray-600 ml-1">»</button>
                    </div>
                  </div>
                  <div className="flex-grow flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      {selectedFile ? `Preview for ${selectedFile.name} (if applicable)` : "No file selected for preview."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// HomeTwo Component (Delegatee and Date/Reason inputs)
function HomeTwo({
  delegatorName,
  delegateeData,
  setDelegateeData,
  delegationData,
  setDelegationData,
  loadEmployeeOptions
}) {
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

  useEffect(() => {
    // Update the 'user' field in the main delegationData state when delegatorName changes
    setDelegationData(prev => ({ ...prev, user: delegatorName || "" }));
  }, [delegatorName, setDelegationData]);

  const handleDelegateeSelect = async (selectedOption) => {
    if (selectedOption && selectedOption.value) {
      try {
        const response = await axios.get(`http://localhost:8080/api/employees/${selectedOption.value}/delegation-details`, {
          timeout: 5000,
        });
        const { employeeName, employeeId, department } = response.data;
        setDelegateeData({ // Update display state for delegatee
          delegateeName: employeeName || "",
          delegateeId: employeeId || "",
          department: department || "",
        });
        setDelegationData(prev => ({ ...prev, delegateeId: employeeId || "" })); // Update main form data
      } catch (error) {
        toast.error(`Failed to fetch delegatee details: ${error.message}`);
        setDelegateeData({ delegateeName: "", delegateeId: "", department: "" });
        setDelegationData(prev => ({ ...prev, delegateeId: "" }));
      }
    } else {
      setDelegateeData({ delegateeName: "", delegateeId: "", department: "" });
      setDelegationData(prev => ({ ...prev, delegateeId: "" }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDelegationData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden p-6 mb-6 min-h-[400px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 ml-14">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delegatee Name :</label>
            <AsyncSelect
              className="w-3/4"
              cacheOptions
              defaultOptions={[{ value: "", label: "Start typing to search..." }]}
              loadOptions={loadEmployeeOptions}
              onChange={handleDelegateeSelect}
              placeholder="Search by ID or Name"
              isClearable
              styles={{
                control: (provided) => ({ ...provided, borderColor: '#d1d5db', borderRadius: '0.375rem', padding: '0.1rem', '&:hover': { borderColor: '#3c8dbc' }, boxShadow: 'none' }),
                menu: (provided) => ({ ...provided, zIndex: 9999 }),
                option: (provided, state) => ({ ...provided, backgroundColor: state.isSelected ? '#3c8dbc' : state.isFocused ? '#e6f0fa' : 'white', color: state.isSelected ? 'white' : '#374151' }),
              }}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department ፡</label>
            <input type="text" value={delegateeData.department} className="w-3/4 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed" readOnly />
          </motion.div>
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date :</label>
            <input type="date" name="fromDate" value={delegationData.fromDate} onChange={handleInputChange} className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Request Date :</label>
            <input type="date" name="requestDate" value={delegationData.requestDate} onChange={handleInputChange} className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">User :</label>
            <input type="text" value={delegationData.user} className="w-3/4 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed" readOnly />
          </motion.div>
          
        </div>
        <div className="space-y-4 ml-14">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delegatee ID :</label>
            <input type="text" value={delegateeData.delegateeId} className="w-3/4 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed" readOnly />
          </motion.div>
            <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position ፡</label>
            <input type="text" value={delegateeData.department} className="w-3/4 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed" readOnly />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date:</label>
            <input type="date" name="toDate" value={delegationData.toDate} onChange={handleInputChange} className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200" />
          </motion.div>
         <motion.div variants={itemVariants}>
  <label className="block text-sm font-medium text-gray-700 mb-1">Reason :</label>
  <textarea 
    name="requesterNotice" 
    value={delegationData.requesterNotice} 
    onChange={handleInputChange} 
    className="w-3/4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
    rows={4} // You can adjust the number of rows as needed
  />
</motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// AssignDelegation Component (Main component managing state and save logic)
export default function AssignDelegation() {
  const [delegatorData, setDelegatorData] = useState({ delegatorName: "", delegatorId: "", department: "" });
  const [delegateeData, setDelegateeData] = useState({ delegateeName: "", delegateeId: "", department: "" });
  const [powerDelegationFile, setPowerDelegationFile] = useState(null); // State for the selected file

  const [delegationData, setDelegationData] = useState({
    fromDate: "",
    toDate: "",
    requesterNotice: "",
    status: "Pending", // Default status
    delegateeId: "",
    delegatorId: "",
    requestDate: "",
    doctRete: "", // Will be set from filename if a file is uploaded
    user: "", // For display in HomeTwo, not part of entity save
    // Initialize other HrPowerDelegation fields if needed, e.g., jobPosition: ""
  });

  useEffect(() => {
    setDelegationData(prev => ({ ...prev, delegatorId: delegatorData.delegatorId || "" }));
  }, [delegatorData.delegatorId]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { when: "beforeChildren", staggerChildren: 0.1 } },
  };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  const loadEmployeeOptions = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const response = await axios.get(`http://localhost:8080/api/employees/search`, {
        params: { query: inputValue },
        timeout: 5000,
      });
      if (!Array.isArray(response.data)) return [];
      return response.data.map(emp => ({
        value: emp.id || "",
        label: `${emp.id || "N/A"} - ${emp.name || "Unknown"}`,
      }));
    } catch (error) {
      toast.error(`Failed to search employees: ${error.message}`);
      return [{ value: "", label: "Search failed (server error)" }];
    }
  };

  const handleDelegatorSelect = async (selectedOption) => {
    if (selectedOption && selectedOption.value) {
      try {
        const response = await axios.get(`http://localhost:8080/api/employees/${selectedOption.value}/delegation-details`, {
          timeout: 5000,
        });
        const { employeeName, employeeId, department } = response.data;
        setDelegatorData({ delegatorName: employeeName || "", delegatorId: employeeId || "", department: department || "" });
        // delegatorId in delegationData is updated by useEffect
      } catch (error) {
        toast.error(`Failed to fetch delegator details: ${error.message}`);
        setDelegatorData({ delegatorName: "", delegatorId: "", department: "" });
      }
    } else {
      setDelegatorData({ delegatorName: "", delegatorId: "", department: "" });
      setDelegationData(prev => ({ ...prev, delegatorId: "" })); // Explicitly clear if deselected
    }
  };

  const handleFileSelectFromChild = (file) => {
    setPowerDelegationFile(file);
    // Also update doctRete in delegationData if a file is selected or cleared
    setDelegationData(prev => ({
        ...prev,
        doctRete: file ? file.name.substring(0, 45) : "" // Example: use filename, truncate if needed
    }));
  };

  const handleSaveDelegation = async () => {
    if (!delegationData.delegatorId || !delegationData.delegateeId || !delegationData.fromDate || !delegationData.toDate || !delegationData.requestDate) {
      toast.warn("Please fill in all required fields (Delegator, Delegatee, From Date, To Date, Request Date).");
      return;
    }

    const formData = new FormData();

    // Append the file if selected
    if (powerDelegationFile) {
      formData.append('file', powerDelegationFile); // Key 'file' must match backend @RequestPart name
    }

    // Prepare the delegation data object for the JSON part
    const delegationDetailsPayload = {
      // id: null, // ID is auto-generated by backend, do not send for POST
      fromDate: delegationData.fromDate,
      toDate: delegationData.toDate,
      requesterNotice: delegationData.requesterNotice,
      status: delegationData.status || "Pending",
      delegateeId: delegationData.delegateeId,
      delegatorId: delegationData.delegatorId,
      requestDate: delegationData.requestDate,
      doctRete: delegationData.doctRete, // This is now set when file is selected/cleared
      // Include other HrPowerDelegation fields from delegationData state if they are set and need to be saved
      // e.g., jobPosition: delegationData.jobPosition,
      // Ensure these keys match your HrPowerDelegation entity fields
    };

    // Append the delegation data as a JSON string part
    // The key 'delegation' must match the @RequestPart name in your Spring Boot controller
    formData.append('delegation', new Blob([JSON.stringify(delegationDetailsPayload)], { type: 'application/json' }));

    console.log("Attempting to save delegation with FormData...");
    // For debugging FormData content:
    // for (let [key, value] of formData.entries()) {
    //   if (value instanceof Blob) {
    //     value.text().then(text => console.log(key, "-> JSON:", text));
    //   } else if (value instanceof File) {
    //     console.log(key, "-> File:", value.name, value.size, value.type);
    //   } else {
    //     console.log(key, "->", value);
    //   }
    // }

    try {
      const response = await axios.post('http://localhost:8080/api/hr-power-delegation', formData, {
        // Axios usually sets 'Content-Type': 'multipart/form-data' automatically for FormData
      });
      toast.success("Delegation saved successfully!");
      console.log("Save successful:", response.data);
      resetForm();
    } catch (error) {
      let detailedErrorMessage = "Failed to save delegation. Please try again.";
      if (error.response) {
        console.error("Error saving delegation - Server Response:", error.response.data);
        console.error("Status Code:", error.response.status);
        if (error.response.data) {
          if (typeof error.response.data === 'string') {
            detailedErrorMessage = error.response.data;
          } else if (error.response.data.message) {
            detailedErrorMessage = error.response.data.message;
          } else if (error.response.data.error) {
            detailedErrorMessage = error.response.data.error;
          } else if (error.response.status === 400) {
            detailedErrorMessage = "Bad Request: Please check the data you entered.";
          } else if (error.response.status === 500) {
            detailedErrorMessage = "Internal Server Error. Please contact support.";
          }
        }
      } else if (error.request) {
        console.error("Error saving delegation - No response received:", error.request);
        detailedErrorMessage = "No response from server. Please check your network connection.";
      } else {
        console.error("Error saving delegation - Request setup error:", error.message);
        detailedErrorMessage = `An error occurred: ${error.message}`;
      }
      toast.error(detailedErrorMessage);
    }
  };

  const resetForm = () => {
    setDelegatorData({ delegatorName: "", delegatorId: "", department: "" });
    setDelegateeData({ delegateeName: "", delegateeId: "", department: "" });
    setPowerDelegationFile(null); // Reset the file
    // Reset the file input visually
    const fileInput = document.getElementById('file-upload-input');
    if (fileInput) {
        fileInput.value = "";
    }
    setDelegationData({
      fromDate: "", toDate: "", requesterNotice: "", status: "Pending",
      delegateeId: "", delegatorId: "", requestDate: "", doctRete: "", user: "",
      // Reset other fields if they were part of initial state
    });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen p-6 font-sans relative overflow-y-auto">
        <ToastContainer position="top-right" autoClose={5000} />
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc]/10 to-purple-50 opacity-30"></div>
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3c8dbc] to-[#2c6da4]">Assign Delegation</h1>
          </motion.div>

          {/* Delegator Section */}
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden p-6 mb-6 min-h-[300px]">
            <motion.div variants={itemVariants} className="mb-6 ml-14">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search (By Delegator ID):</label>
              <AsyncSelect
                className="w-3/4"
                cacheOptions
                defaultOptions={[{ value: "", label: "Start typing to search..." }]}
                loadOptions={loadEmployeeOptions}
                onChange={handleDelegatorSelect}
                placeholder="Search by ID or Name"
                isClearable
                styles={{
                  control: (provided) => ({ ...provided, borderColor: '#d1d5db', borderRadius: '0.375rem', padding: '0.1rem', '&:hover': { borderColor: '#3c8dbc' }, boxShadow: 'none' }),
                  menu: (provided) => ({ ...provided, zIndex: 9999 }),
                  option: (provided, state) => ({ ...provided, backgroundColor: state.isSelected ? '#3c8dbc' : state.isFocused ? '#e6f0fa' : 'white', color: state.isSelected ? 'white' : '#374151' }),
                }}
              />
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 ml-14">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delegator Name:</label>
                  <input type="text" value={delegatorData.delegatorName} className="w-3/4 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed" readOnly />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delegator ID:</label>
                  <input type="text" value={delegatorData.delegatorId} className="w-3/4 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed" readOnly />
                </motion.div>
              </div>
              <div className="space-y-4 ml-14">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
                  <input type="text" value={delegatorData.department} className="w-3/4 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed" readOnly />
                </motion.div>

                 <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position:</label>
                  <input type="text" value={delegatorData.department} className="w-3/4 p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed" readOnly />
                </motion.div>
              </div>
              
            </div>
          </motion.div>

          <HomeTwo
            delegatorName={delegatorData.delegatorName}
            delegateeData={delegateeData}
            setDelegateeData={setDelegateeData}
            delegationData={delegationData}
            setDelegationData={setDelegationData}
            loadEmployeeOptions={loadEmployeeOptions}
          />

          {/* File Upload Section (HomeThree) */}
          <HomeThree onFileSelect={handleFileSelectFromChild} selectedFile={powerDelegationFile} />

          {/* Save Button Section - Moved below HomeThree */}
          <motion.div
             initial="hidden"
             animate="visible"
             variants={containerVariants}
             className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden p-6 mb-6"
          >
             <div className="flex justify-center">
               <button
                 className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors duration-200"
                 onClick={handleSaveDelegation}
               >
                 <span>Save Delegation</span>
               </button>
             </div>
          </motion.div>

        </div>
      </div>
    </ErrorBoundary>
  );
}