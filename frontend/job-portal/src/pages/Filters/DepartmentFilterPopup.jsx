/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const DepartmentFilterPopup = ({
  selected = [],
  setSelected,
  closePopup,
  departments = [],
}) => {
  const [search, setSearch] = useState("");

  const safeSelected = Array.isArray(selected) ? selected : [];
  const safeDepartments = Array.isArray(departments) ? departments : [];

  const filteredDepartments = useMemo(() => {
    return safeDepartments.filter((dep) =>
      String(dep?.name || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [safeDepartments, search]);

  const toggleDepartment = (depName) => {
    if (safeSelected.includes(depName)) {
      setSelected(safeSelected.filter((d) => d !== depName));
    } else {
      setSelected([...safeSelected, depName]);
    }
  };

  const handleClearAll = () => {
    const popupDepartmentNames = safeDepartments.map((dep) => dep.name);

    const remainingSelected = safeSelected.filter(
      (item) => !popupDepartmentNames.includes(item)
    );

    setSelected(remainingSelected);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={closePopup}
    >
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute left-6 top-20 w-105 max-w-[92vw] rounded-2xl border border-slate-700 bg-[#020617] p-4 text-white shadow-2xl"
      >
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">More Departments</h2>
            <p className="text-xs text-slate-400">
              {safeDepartments.length} Departments
            </p>
          </div>

          <button
            onClick={closePopup}
            className="text-slate-400 transition hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <input
          type="text"
          placeholder="Search Department"
          className="mb-3 w-full rounded-lg border border-slate-600 bg-slate-900 p-2 text-sm text-white outline-none focus:border-cyan-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {safeSelected.length > 0 && (
          <p className="mb-2 text-xs text-cyan-400">
            {safeSelected.length} Selected
          </p>
        )}

        <div className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto text-sm">
          {filteredDepartments.length === 0 ? (
            <p className="text-slate-400">No more departments found</p>
          ) : (
            filteredDepartments.map((dep) => (
              <label
                key={dep.name}
                className="flex cursor-pointer items-center justify-between rounded p-2 hover:bg-slate-800"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={safeSelected.includes(dep.name)}
                    onChange={() => toggleDepartment(dep.name)}
                    className="accent-cyan-500"
                  />
                  <span>{dep.name}</span>
                </div>

                <span className="text-xs text-slate-400">({dep.count || 0})</span>
              </label>
            ))
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={handleClearAll}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Clear Popup Items
          </button>

          <button
            onClick={closePopup}
            className="rounded bg-cyan-600 px-6 py-1.5 text-sm text-white hover:bg-cyan-700"
          >
            Apply
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DepartmentFilterPopup;