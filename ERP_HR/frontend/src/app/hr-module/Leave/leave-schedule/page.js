"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/utils/authFetch";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiX,
  FiEdit2,
  FiSave,
  FiTrash2,
  FiBell,
  FiCheck,
  FiX as FiClose,
  FiRepeat,
} from "react-icons/fi";
import {
  getLeaveScheduleDetails,
  createLeaveScheduleDetail,
  updateLeaveScheduleDetail,
  deleteLeaveScheduleDetail,
} from "../services/leaveScheduleService";

function LowSwitchOptions({ employeeId, year }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    leaveMonth: "",
    noDays: "",
    description: "",
    priority: 0,
    scheduleId: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [reschedulingMonth, setReschedulingMonth] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });

  useEffect(() => {
    if (employeeId && year) {
      fetchLeaveScheduleDetails();
    }
  }, [employeeId, year]);

  const fetchLeaveScheduleDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authFetch(
        `http://localhost:8080/api/leave-schedules?employeeId=${employeeId}&leaveYearId=${year}`
      );
      const schedules = await response.json();

      if (schedules.length > 0) {
        const scheduleId = schedules[0].id;
        const details = await getLeaveScheduleDetails(scheduleId);
        setRecords(details);
        setFormData((prev) => ({ ...prev, scheduleId }));
      } else {
        const newSchedule = {
          leaveYearId: parseInt(year),
          employeeId,
          status: "Pending",
          description: `Leave schedule for ${employeeId} in ${year}`,
        };

        const createResponse = await authFetch(
          "http://localhost:8080/api/leave-schedules",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newSchedule),
          }
        );

        const createdSchedule = await createResponse.json();
        setFormData((prev) => ({ ...prev, scheduleId: createdSchedule.id }));
        setRecords([]);
      }
    } catch (err) {
      setError("Failed to fetch leave schedule details");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddRecord = async () => {
    if (formData.leaveMonth && formData.noDays && formData.scheduleId) {
      const isDuplicate = records.some(
        (record) =>
          record.leaveMonth.toLowerCase() === formData.leaveMonth.toLowerCase()
      );
      if (isDuplicate) {
        setError(
          "You added before, same like this. You can't add same like before, at least one different needed"
        );
        return;
      }
      try {
        const newDetail = {
          leaveMonth: formData.leaveMonth,
          noDays: formData.noDays,
          description: formData.description,
          priority: formData.priority,
          scheduleId: formData.scheduleId,
        };

        const createdDetail = await createLeaveScheduleDetail(newDetail);
        setRecords([...records, createdDetail]);

        setFormData({
          leaveMonth: "",
          noDays: "",
          description: "",
          priority: 0,
          scheduleId: formData.scheduleId,
        });
        setShowAddForm(false);
        setSuccessMessage("Added successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        setError("Failed to create leave schedule detail");
        console.error(err);
      }
    }
  };

  const handleEditRecord = (id) => {
    const recordToEdit = records.find((record) => record.id === id);
    if (recordToEdit) {
      setFormData({
        leaveMonth: recordToEdit.leaveMonth,
        noDays: recordToEdit.noDays,
        description: recordToEdit.description,
        priority: recordToEdit.priority,
        scheduleId: recordToEdit.hrLeaveSchedule?.id || formData.scheduleId,
      });
      setEditingId(id);
      setReschedulingMonth(null);
      setShowAddForm(true);
    }
  };

  const handleRescheduleRecord = (record) => {
    setFormData({
      leaveMonth: record.leaveMonth,
      noDays: record.noDays,
      description: record.description,
      priority: record.priority,
      scheduleId: record.hrLeaveSchedule?.id || formData.scheduleId,
    });
    setReschedulingMonth(record.leaveMonth);
    setEditingId(null);
    setShowAddForm(true);
  };

  const handleUpdateRecord = async () => {
    if (formData.leaveMonth && formData.noDays && editingId) {
      try {
        const updatedDetail = {
          leaveMonth: formData.leaveMonth,
          noDays: formData.noDays,
          description: formData.description,
          priority: formData.priority,
          scheduleId: formData.scheduleId,
        };

        const result = await updateLeaveScheduleDetail(
          editingId,
          updatedDetail
        );

        setRecords(
          records.map((record) => (record.id === editingId ? result : record))
        );

        setFormData({
          leaveMonth: "",
          noDays: "",
          description: "",
          priority: 0,
          scheduleId: formData.scheduleId,
        });
        setEditingId(null);
        setShowAddForm(false);
        setSuccessMessage("Updated successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        setError("Failed to update leave schedule detail");
        console.error(err);
      }
    }
  };

  const handleRescheduleSubmit = async () => {
    if (
      formData.leaveMonth &&
      formData.noDays &&
      reschedulingMonth &&
      formData.scheduleId
    ) {
      try {
        const updatedDetail = {
          leaveMonth: formData.leaveMonth,
          noDays: formData.noDays,
          description: formData.description,
          priority: formData.priority,
          scheduleId: formData.scheduleId,
        };

        const response = await authFetch(
          `http://localhost:8080/api/leave-schedules/${formData.scheduleId}/details/${reschedulingMonth}/reschedule`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedDetail),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to reschedule: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();

        setRecords(
          records.map((record) =>
            record.leaveMonth === reschedulingMonth ? result : record
          )
        );

        setFormData({
          leaveMonth: "",
          noDays: "",
          description: "",
          priority: 0,
          scheduleId: formData.scheduleId,
        });
        setReschedulingMonth(null);
        setShowAddForm(false);
        setSuccessMessage("Rescheduled successfully");
        setTimeout(() => setSuccessMessage(""), 3000);

        // Refresh notifications
        const notificationResponse = await authFetch(
          `http://localhost:8080/api/notifications?employeeId=${employeeId}`
        );
        if (notificationResponse.ok) {
          const allNotifications = await notificationResponse.json();
          window.dispatchEvent(
            new CustomEvent("updateNotifications", { detail: allNotifications })
          );
        }
      } catch (err) {
        setError("Failed to reschedule leave detail");
        console.error(err);
      }
    }
  };

  const handleDeleteRecord = async (id) => {
    if (!confirmDelete.show) {
      setConfirmDelete({ show: true, id });
      return;
    }
    try {
      await deleteLeaveScheduleDetail(id);
      setRecords(records.filter((r) => r.id !== id));
      setConfirmDelete({ show: false, id: null });
      setSuccessMessage("Deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to delete leave schedule detail");
      console.error(err);
      setConfirmDelete({ show: false, id: null });
    }
  };

  const handleConfirmDelete = (confirm) => {
    if (confirm && confirmDelete.id) {
      handleDeleteRecord(confirmDelete.id);
    } else {
      setConfirmDelete({ show: false, id: null });
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc]/10 to-purple-50 opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden p-6 mb-8"
        >
          {(successMessage || error) && (
            <div
              className={
                successMessage
                  ? "mb-4 text-center text-lg font-bold text-green-500 bg-green-100 p-2 rounded"
                  : "mb-4 text-center text-lg font-bold text-red-500 bg-red-100 p-2 rounded"
              }
            >
              {successMessage || error}
            </div>
          )}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#3c8dbc]/20">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3c8dbc] to-[#2c6da4]">
              Leave Month Options
            </h1>
            <motion.button
              onClick={() => {
                setEditingId(null);
                setReschedulingMonth(null);
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

          <div className="border border-[#3c8dbc]/30 rounded-lg overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#3c8dbc]/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3c8dbc]">
                    NO
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3c8dbc]">
                    Leave Month
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3c8dbc]">
                    No Days
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3c8dbc]">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3c8dbc]">
                    Priority
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3c8dbc]">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-[#3c8dbc]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="py-4 px-4 text-sm text-gray-500 text-center"
                    >
                      No records found
                    </td>
                  </tr>
                ) : (
                  records.map((record, index) => (
                    <tr
                      key={record.id}
                      className="border-t border-[#3c8dbc]/20 hover:bg-[#3c8dbc]/5"
                    >
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {record.leaveMonth}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {record.noDays}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {record.description}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {record.priority}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : record.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {record.status || "Pending"}
                        </span>
                      </td>
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
                        {record.status === "Rejected" && (
                          <motion.button
                            onClick={() => handleRescheduleRecord(record)}
                            className="text-yellow-500 hover:text-yellow-700 p-1"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Reschedule"
                          >
                            <FiRepeat size={16} />
                          </motion.button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

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
                setReschedulingMonth(null);
                setFormData({
                  leaveMonth: "",
                  noDays: "",
                  description: "",
                  priority: 0,
                  scheduleId: formData.scheduleId,
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
                      {reschedulingMonth
                        ? "Reschedule Leave Month"
                        : editingId
                        ? "Edit Leave Month"
                        : "Add Leave Month"}
                    </h2>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setEditingId(null);
                        setReschedulingMonth(null);
                        setFormData({
                          leaveMonth: "",
                          noDays: "",
                          description: "",
                          priority: 0,
                          scheduleId: formData.scheduleId,
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
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Leave Month:
                    </label>
                    <input
                      type="text"
                      name="leaveMonth"
                      value={formData.leaveMonth}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      No Days:
                    </label>
                    <input
                      type="text"
                      name="noDays"
                      value={formData.noDays}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Priority:
                    </label>
                    <input
                      type="number"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">
                      Description:
                    </label>
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
                      setReschedulingMonth(null);
                      setFormData({
                        leaveMonth: "",
                        noDays: "",
                        description: "",
                        priority: 0,
                        scheduleId: formData.scheduleId,
                      });
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={
                      reschedulingMonth
                        ? handleRescheduleSubmit
                        : editingId
                        ? handleUpdateRecord
                        : handleAddRecord
                    }
                    className="px-4 py-2 bg-[#3c8dbc] text-white rounded-md text-sm hover:bg-[#367fa9] transition-colors shadow-md flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {reschedulingMonth ? (
                      <FiRepeat size={16} />
                    ) : editingId ? (
                      <FiSave size={16} />
                    ) : (
                      <FiPlus size={16} />
                    )}
                    {reschedulingMonth
                      ? "Reschedule"
                      : editingId
                      ? "Update"
                      : "Add"}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
          {confirmDelete.show && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white/90 backdrop-blur-lg rounded-xl shadow-2xl w-full max-w-md p-6 text-center"
              >
                <h2 className="text-lg font-semibold text-[#3c8dbc] mb-4">
                  Are you sure?
                </h2>
                <p className="text-gray-700 mb-6">
                  Do you want to delete this Leave Month Option?
                </p>
                <div className="flex justify-center gap-4">
                  <motion.button
                    onClick={() => handleConfirmDelete(true)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiCheck size={16} /> Yes
                  </motion.button>
                  <motion.button
                    onClick={() => handleConfirmDelete(false)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiClose size={16} /> No
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
    employeeId: "",
    nameOrId: "",
    department: "",
    year: new Date().getFullYear().toString(),
    selectedOption: "",
    position: "",
    aType: "",
    bCustomer: "",
    iListedSchedule: "",
  });
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);
  const [employeeError, setEmployeeError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchEmployeeData = async (empId) => {
    setIsLoadingEmployee(true);
    setEmployeeError(null);
    setNotifications([]);
    try {
      const response = await authFetch(
        `http://localhost:8080/api/employees/${empId}`
      );
      if (!response.ok) {
        const statusText = response.statusText || "Unknown error";
        throw new Error(
          `Employee not found: ${response.status} ${statusText} (Employee ID: ${empId})`
        );
      }
      const employee = await response.json();
      setFormData((prev) => ({
        ...prev,
        nameOrId: `${employee.firstName} ${employee.lastName || ""}`.trim(),
        department: employee.department?.depName || "Unknown",
        position: employee.position?.positionName || "Unknown",
      }));

      const notificationResponse = await authFetch(
        `http://localhost:8080/api/notifications?employeeId=${empId}`
      );
      if (!notificationResponse.ok) {
        throw new Error(
          `Failed to fetch notifications: ${notificationResponse.status} ${notificationResponse.statusText}`
        );
      }
      const allNotifications = await notificationResponse.json();
      setNotifications(allNotifications);
    } catch (err) {
      setEmployeeError(err.message);
      console.error(`Error in fetchEmployeeData: ${err.message}`);
      setFormData((prev) => ({
        ...prev,
        nameOrId: "",
        department: "",
        position: "",
      }));
      setNotifications([]);
    } finally {
      setIsLoadingEmployee(false);
    }
  };

  useEffect(() => {
    if (formData.employeeId) {
      fetchEmployeeData(formData.employeeId);
    }
    setFormData((prev) => ({
      ...prev,
      year: new Date().getFullYear().toString(),
    }));

    const handleNotificationUpdate = (event) => {
      setNotifications(event.detail);
    };
    window.addEventListener("updateNotifications", handleNotificationUpdate);
    return () =>
      window.removeEventListener(
        "updateNotifications",
        handleNotificationUpdate
      );
  }, [formData.employeeId]);

  useEffect(() => {
    return () => {
      // Cleanup function runs when showNotifications changes or component unmounts
      if (showNotifications && notifications.length > 0) {
        // Delete all notifications when dropdown is closed
        const deleteAllNotifications = async () => {
          try {
            await Promise.all(
              notifications.map(async (notif) => {
                const response = await authFetch(
                  `http://localhost:8080/api/notifications/${notif.id}`,
                  {
                    method: "DELETE",
                  }
                );
                if (!response.ok) {
                  const errorText = await response.text();
                  throw new Error(
                    `Failed to delete notification ${notif.id}: ${response.status} - ${errorText}`
                  );
                }
              })
            );
            setNotifications([]); // Clear notifications after deletion
          } catch (err) {
            console.error("Error deleting notifications:", err.message);
            setEmployeeError(`Error deleting notifications: ${err.message}`);
            setTimeout(() => setEmployeeError(null), 3000);
          }
        };
        deleteAllNotifications();
      }
    };
  }, [showNotifications]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="min-h-screen p-6 font-sans relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3c8dbc]/10 to-purple-50 opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-xl border border-[#3c8dbc]/30 shadow-xl overflow-hidden mb-8"
        >
          <div className="px-6 py-4 border-b border-[#3c8dbc]/20 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3c8dbc] to-[#2c6da4]">
              Leave Schedule
            </h1>
            {notifications.length > 0 && (
              <div className="relative">
                <motion.button
                  onClick={handleToggleNotifications}
                  className="text-[#3c8dbc] hover:text-[#367fa9] relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="View Notifications"
                >
                  <FiBell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </motion.button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-80 bg-white/90 backdrop-blur-lg border border-[#3c8dbc]/30 rounded-xl shadow-xl p-4 z-50"
                    >
                      <h3 className="text-sm font-semibold text-[#3c8dbc] mb-2">
                        Notifications
                      </h3>
                      <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {notifications.map((notif) => (
                          <li
                            key={notif.id}
                            className={`text-sm p-2 rounded flex justify-between items-center ${
                              notif.message.includes("approved")
                                ? "bg-green-100 text-green-800"
                                : notif.message.includes("rescheduled")
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            <span>{notif.message}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-b border-[#3c8dbc]/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3c8dbc] transition-all duration-200"
                />
                {employeeError && (
                  <div className="text-red-500 text-sm mt-1">
                    {employeeError}
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Name
                </label>
                <input
                  type="text"
                  name="nameOrId"
                  value={isLoadingEmployee ? "Loading..." : formData.nameOrId}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={isLoadingEmployee ? "Loading..." : formData.department}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  value={isLoadingEmployee ? "Loading..." : formData.position}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-center cursor-not-allowed"
                  />
                  <motion.button
                    type="button"
                    disabled
                    className="px-3 py-2 bg-[#3c8dbc] text-white rounded-md text-sm opacity-50 cursor-not-allowed"
                    whileHover={{ scale: 1.0 }}
                    whileTap={{ scale: 1.0 }}
                  >
                    Current
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <LowSwitchOptions
          employeeId={formData.employeeId}
          year={formData.year}
        />
      </div>
    </div>
  );
}
