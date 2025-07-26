"use client";
import { useState } from "react";
import AppModuleLayout from "../../components/AppModuleLayout";
import DepartmentList from "../../components/DepartmentList";
import DepartmentForm from "../../components/DepartmentForm";
import { DepartmentDto } from "../../types/department";

export default function DepartmentPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<DepartmentDto | null>(null);

  const openForm = (dept: DepartmentDto | null) => {
    setSelectedDept(dept);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedDept(null);
    setIsFormOpen(false);
  };

  return (
    <AppModuleLayout>
      <h1 className="text-xl font-bold mb-6">Organization Structure</h1>

      {/* Tabs */}
      <div className="flex mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-medium transition ${
            !isFormOpen
              ? "bg-blue-600 text-white shadow"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setIsFormOpen(false)}
        >
          View Structure
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition ${
            isFormOpen
              ? "bg-green-600 text-white shadow"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => openForm(null)}
        >
          Add New Department
        </button>
      </div>

      {/* Conditional Render: Form or List */}
      {isFormOpen ? (
        <DepartmentForm
          dept={selectedDept}
          onClose={closeForm}
          onSave={closeForm}
        />
      ) : (
        <DepartmentList onEdit={openForm} />
      )}
    </AppModuleLayout>
  );
}
