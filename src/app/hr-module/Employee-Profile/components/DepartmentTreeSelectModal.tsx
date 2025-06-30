// DepartmentTreeSelectModal.tsx
'use client';
import { useState, useEffect } from 'react';
import { DepartmentDto } from '../types/department';
import { getDepartments } from '../services/departmentService';
import DepartmentTree from './DepartmentTree';

interface DepartmentTreeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (deptId: number) => void;
  selectedDeptId?: number | string;
}

const DepartmentTreeSelectModal = ({
  isOpen,
  onClose,
  onSelect,
  selectedDeptId,
}: DepartmentTreeSelectModalProps) => {
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (err) {
        console.error('Error fetching departments:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchDepartments();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Select Department</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-2xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto border rounded p-4">
            {departments.filter((d) => d.deptId === 61).map((rootDept) => (
              <DepartmentTree
                key={rootDept.deptId}
                dept={rootDept}
                onSelect={(dept) => onSelect(dept.deptId)}
                selectedDeptId={selectedDeptId ? Number(selectedDeptId) : undefined}
              />
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentTreeSelectModal;