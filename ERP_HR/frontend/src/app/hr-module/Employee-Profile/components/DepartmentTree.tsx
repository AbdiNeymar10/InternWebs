// DepartmentTree.tsx
import { useEffect, useState } from "react";
import { getChildren } from "../services/departmentService";
import { DepartmentDto } from "../types/department";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";

interface DepartmentTreeProps {
  dept: DepartmentDto;
  level?: number;
  onEdit?: (dept: DepartmentDto) => void; // Optional for editing
  onSelect?: (dept: DepartmentDto) => void; // Optional for selection
  selectedDeptId?: number; // Optional to highlight selected department
}

const DepartmentTree = ({
  dept,
  level = 0,
  onEdit,
  onSelect,
  selectedDeptId,
}: DepartmentTreeProps) => {
  const [children, setChildren] = useState<DepartmentDto[]>([]);
  const [expanded, setExpanded] = useState(false);

  const toggle = async () => {
    if (!expanded) {
      try {
        const res = await getChildren(dept.deptId);
        setChildren(res);
        setExpanded(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      setExpanded(false);
    }
  };

  // Auto-expand root department
  useEffect(() => {
    if (dept.deptId === 2) {
      toggle();
    }
  }, [dept]);

  return (
    <div style={{ marginLeft: level * 20 }} className="mb-1">
      <div
        className={`flex items-center hover:bg-gray-100 p-1 rounded cursor-pointer`}
        onClick={() => onSelect && onSelect(dept)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          className="mr-2"
        >
          {expanded ? <FaMinusSquare /> : <FaPlusSquare />}
        </button>
        <span className="flex-grow">{dept.deptName}</span>
      </div>
      {expanded &&
        children.map((child) => (
          <DepartmentTree
            key={child.deptId}
            dept={child}
            level={level + 1}
            onEdit={onEdit}
            onSelect={onSelect}
            selectedDeptId={selectedDeptId}
          />
        ))}
    </div>
  );
};

export default DepartmentTree;
