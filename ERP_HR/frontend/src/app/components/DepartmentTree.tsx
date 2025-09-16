import { useEffect, useState } from "react";
import { getChildren } from "../services/departmentService";
import { DepartmentDto } from "../types/department";
import { FaPlusSquare, FaMinusSquare, FaEdit } from "react-icons/fa";

const DepartmentTree = ({
  dept,
  level = 0,
  onEdit,
  onSelect, // Add onSelect prop
  disableExpand = false, // New prop
}: {
  dept: DepartmentDto;
  level?: number;
  onEdit?: (dept: DepartmentDto) => void;
  onSelect?: (deptId: number) => void; // Callback for selecting a department
  disableExpand?: boolean; // New prop
}) => {
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

  // 👇 Auto-expand root department (e.g., deptId === 61)
  useEffect(() => {
    if (!disableExpand && dept.deptId === 2) {
      toggle();
    }
  }, [dept]);

  return (
    <div style={{ marginLeft: level * 20 }} className="mb-1">
      {/* Only show expand/collapse if not disabled */}
      {!disableExpand && (
        <button onClick={toggle} className="mr-2">
          <div>
            {expanded ? (
              <FaMinusSquare className="text-gray-700" />
            ) : (
              <FaPlusSquare className="text-gray-700" />
            )}
          </div>
        </button>
      )}
      {/* Call onSelect when the department name is clicked */}
      <span
        onClick={() => onSelect && onSelect(dept.deptId)} // Trigger onSelect callback
        className="cursor-pointer text-gray-700 "
      >
        {dept.deptName}
      </span>
      {onEdit && (
        <button onClick={() => onEdit(dept)} className="ml-2 text-gray-700">
          <FaEdit />
        </button>
      )}
      {/* Only render children if not disabled */}
      {!disableExpand &&
        expanded &&
        children.map((child) => (
          <DepartmentTree
            key={child.deptId}
            dept={child}
            level={level + 1}
            onEdit={onEdit}
            onSelect={onSelect} // Pass onSelect to child nodes
          />
        ))}
    </div>
  );
};

export default DepartmentTree;
