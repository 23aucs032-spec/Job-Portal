import React, { useEffect, useMemo, useState } from "react";
import DepartmentFilterPopup from "./DepartmentFilterPopup";

const API = "http://localhost:5000";

const DepartmentFilter = ({ filters, setFilters }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedDepartments = Array.isArray(filters?.department)
    ? filters.department
    : [];

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/api/jobs/department-count`);
        if (!res.ok) {
          throw new Error("Failed to fetch departments");
        }

        const data = await res.json();

        // only posted job departments
        const validDepartments = Array.isArray(data)
          ? data.filter((item) => item?.name && Number(item.count) > 0)
          : [];

        setDepartments(validDepartments);
      } catch (error) {
        console.error("Department fetch error:", error);
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const topDepartments = useMemo(() => departments.slice(0, 4), [departments]);
  const remainingDepartments = useMemo(() => departments.slice(4), [departments]);

  const toggleDepartment = (deptName) => {
    setFilters((prev) => {
      const prevDepartments = Array.isArray(prev.department)
        ? prev.department
        : [];

      const updated = prevDepartments.includes(deptName)
        ? prevDepartments.filter((d) => d !== deptName)
        : [...prevDepartments, deptName];

      return {
        ...prev,
        department: updated,
      };
    });
  };

  return (
    <div className="mb-6">
      <h3 className="mb-2 text-sm font-semibold text-white">Department</h3>

      {loading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : topDepartments.length === 0 ? (
        <p className="text-sm text-slate-500">No departments found</p>
      ) : (
        <div className="space-y-2">
          {topDepartments.map((dept) => (
            <label
              key={dept.name}
              className="flex cursor-pointer items-center justify-between text-sm text-slate-300"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedDepartments.includes(dept.name)}
                  onChange={() => toggleDepartment(dept.name)}
                  className="mr-2 accent-cyan-500"
                />
                <span>{dept.name}</span>
              </div>

              <span className="text-xs text-slate-400">({dept.count})</span>
            </label>
          ))}
        </div>
      )}

      {selectedDepartments.length > 0 && (
        <p className="mt-2 text-xs text-cyan-400">
          {selectedDepartments.length} selected
        </p>
      )}

      {remainingDepartments.length > 0 && (
        <button
          type="button"
          onClick={() => setShowPopup(true)}
          className="mt-3 text-sm font-medium text-cyan-400 hover:text-cyan-300"
        >
          View More
        </button>
      )}

      {showPopup && (
        <DepartmentFilterPopup
          selected={selectedDepartments}
          setSelected={(data) =>
            setFilters((prev) => ({
              ...prev,
              department: data,
            }))
          }
          closePopup={() => setShowPopup(false)}
          departments={remainingDepartments}
        />
      )}
    </div>
  );
};

export default DepartmentFilter;