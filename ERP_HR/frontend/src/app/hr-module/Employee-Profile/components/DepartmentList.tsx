import { useEffect, useState } from "react";
import { getDepartments } from "../services/departmentService";
import { DepartmentDto } from "../types/department";
import DepartmentTree from "./DepartmentTree";

interface DepartmentListProps {
  onEdit: (dept: DepartmentDto | null) => void;
}

const DepartmentList = ({ onEdit }: DepartmentListProps) => {
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getDepartments();

        // Remove duplicates by deptId (keep the first occurrence)
        const unique = Array.from(
          new Map(data.map((d) => [d.deptId, d])).values()
        );
        setDepartments(unique);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Filter the departments to only include deptId 2 and its descendants
  const filteredDepartments = departments.filter(
    (department) => department.deptId === 2
  );

  // Group departments by deptLevel
  const grouped = filteredDepartments.reduce((acc, d) => {
    if (d.deptLevel !== undefined) {
      (acc[d.deptLevel] = acc[d.deptLevel] || []).push(d);
    }
    return acc;
  }, {} as Record<number, DepartmentDto[]>);

  return (
    <div>
      {Object.keys(grouped).map((level) => (
        <div key={level}>
          {grouped[parseInt(level)].map((dept) => (
            <DepartmentTree key={dept.deptId} dept={dept} onEdit={onEdit} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default DepartmentList;
