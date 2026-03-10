import React, { useEffect, useMemo, useState } from "react";
import SalaryFilterPopup from "./SalaryFilterPopup";

const API = "http://localhost:5000";

const getSalaryValue = (item) => String(item?.value || "").trim();
const getSalaryName = (item) =>
  String(item?.name || item?.label || item?.value || "").trim();

const SalaryFilter = ({ selected = [], setSelected }) => {
  const [salaryRanges, setSalaryRanges] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const safeSelected = Array.isArray(selected) ? selected : [];

  useEffect(() => {
    const fetchSalaryRanges = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/api/jobs/salary-count`);
        if (!res.ok) {
          throw new Error("Failed to fetch salary ranges");
        }

        const data = await res.json();

        const validRanges = Array.isArray(data)
          ? data.filter(
              (item) => getSalaryValue(item) && Number(item.count) > 0
            )
          : [];

        setSalaryRanges(validRanges);
      } catch (error) {
        console.error("Failed to fetch salary ranges:", error);
        setSalaryRanges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryRanges();
  }, []);

  const firstFour = useMemo(() => salaryRanges.slice(0, 4), [salaryRanges]);
  const remainingRanges = useMemo(() => salaryRanges.slice(4), [salaryRanges]);

  const toggleSalary = (value) => {
    if (!value) return;

    if (safeSelected.includes(value)) {
      setSelected(safeSelected.filter((item) => item !== value));
    } else {
      setSelected([...safeSelected, value]);
    }
  };

  return (
    <>
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-white">Salary</h3>

        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : firstFour.length === 0 ? (
          <p className="text-sm text-slate-500">No salary ranges found</p>
        ) : (
          <div className="space-y-2">
            {firstFour.map((range, index) => {
              const value = getSalaryValue(range);
              const name = getSalaryName(range);

              return (
                <label
                  key={value || index}
                  className="flex cursor-pointer items-center justify-between text-sm text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={safeSelected.includes(value)}
                      onChange={() => toggleSalary(value)}
                      className="accent-cyan-500"
                    />
                    <span>{name}</span>
                  </div>

                  <span className="text-slate-400">({range.count || 0})</span>
                </label>
              );
            })}
          </div>
        )}

        {safeSelected.length > 0 && (
          <p className="mt-2 text-xs text-cyan-400">
            {safeSelected.length} selected
          </p>
        )}

        {remainingRanges.length > 0 && (
          <button
            type="button"
            onClick={() => setShowPopup(true)}
            className="mt-3 text-sm font-medium text-cyan-400 hover:text-cyan-300"
          >
            View More
          </button>
        )}
      </div>

      {showPopup && (
        <SalaryFilterPopup
          selected={safeSelected}
          setSelected={setSelected}
          closePopup={() => setShowPopup(false)}
          salaryRanges={remainingRanges}
        />
      )}
    </>
  );
};

export default SalaryFilter;