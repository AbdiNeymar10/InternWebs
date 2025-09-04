"use client";
import { useState, useEffect } from "react";
import LeaveForm from "./components/LeaveForm";
import { createLeaveSetting } from "../api/leaveSettings";
import { AxiosError } from "axios"; // Import AxiosError for better typing
import { getLeaveTypes } from "../api/leaveTypes";

export default function LeaveSetting() {
  const [formData, setFormData] = useState({
    leaveType: "",
    gender: "",
    employmentType: "",
    paymentType: "",
    minDays: "",
    maxDays: "",
    remark: "",
    balance: 0,
    escapeSunday: 0,
    escapeSaturday: 0,
    escapeHoliday: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Map form data to backend DTO structure
      const leaveSettingData = {
        leaveType: { id: formData.leaveType },
        gender: formData.gender,
        employmentType: formData.employmentType,
        paymentCode: formData.paymentType,
        minNumOfDays: parseInt(formData.minDays),
        maxNumOfDays: parseInt(formData.maxDays),
        description: formData.remark,
        toBalance: formData.balance ? 1 : 0,
        includeSat: formData.escapeSaturday ? 1 : 0,
        includeSun: formData.escapeSunday ? 1 : 0,
        includeHoliday: formData.escapeHoliday ? 1 : 0,
        status: "Active", // Default status
      };

      const response = await createLeaveSetting(leaveSettingData);
      console.log("Leave setting created:", response);

      // Reset form or show success message
      setFormData({
        leaveType: "",
        gender: "",
        employmentType: "",
        paymentType: "",
        minDays: "",
        maxDays: "",
        remark: "",
        balance: 0,
        escapeSunday: 0,
        escapeSaturday: 0,
        escapeHoliday: 0,
      });

      alert("Leave setting saved successfully!");
    } catch (error) {
      let errorMessage = "Failed to save leave setting. Please try again.";
      if (error instanceof AxiosError && error.response) {
        // If the server sent back a specific error message, use that
        console.error("Server error response:", error.response.data);
        errorMessage = `Failed to save leave setting: ${
          error.response.data.message ||
          error.response.statusText ||
          "Server error"
        }`;
      } else if (error instanceof Error) {
        console.error("Error saving leave setting:", error.message);
      }
      alert(errorMessage);
    }
  };

  return (
    <div className="p-6 mt-0">
      <LeaveForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
