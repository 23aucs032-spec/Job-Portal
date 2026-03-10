/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const getSalaryValue = (item) => String(item?.value || "").trim();
const getSalaryName = (item) =>
  String(item?.name || item?.label || item?.value || "").trim();

const SalaryFilterPopup = ({
  selected = [],
  setSelected,
  closePopup,
  salaryRanges = [],
}) => {
  const [search, setSearch] = useState("");

  const safeSelected = Array.isArray(selected) ? selected : [];
  const safeSalaryRanges = Array.isArray(salaryRanges) ? salaryRanges : [];

  const toggleSalary = (value) => {
    if (!value) return;

    if (safeSelected.includes(value)) {
      setSelected(safeSelected.filter((item) => item !== value));
    } else {
      setSelected([...safeSelected, value]);
    }
  };

  const clearPopupItems = () => {
    const popupValues = safeSalaryRanges.map((item) => getSalaryValue(item));

    const remainingSelected = safeSelected.filter(
      (item) => !popupValues.includes(item)
    );

    setSelected(remainingSelected);
  };

  const filteredRanges = useMemo(() => {
    return safeSalaryRanges.filter((range) =>
      getSalaryName(range).toLowerCase().includes(search.toLowerCase())
    );
  }, [safeSalaryRanges, search]);

  return (
    <div className="fixed inset-0 z-50" onClick={closePopup}>
      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        initial={{ x: -320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -320, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative h-full w-[360px] max-w-[90vw] border-r border-slate-700 bg-[#0f172a] p-5 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              More Salary Ranges
            </h2>
            <p className="text-xs text-slate-400">
              {safeSalaryRanges.length} Salary Ranges
            </p>
          </div>

          <button onClick={closePopup}>
            <X className="text-slate-400 hover:text-white" size={20} />
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search Salary Range"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full rounded-md border border-slate-600 bg-[#1e293b] px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
        />

        {/* Selected Count */}
        {safeSelected.length > 0 && (
          <p className="mb-3 text-xs text-cyan-400">
            {safeSelected.length} Selected
          </p>
        )}

        {/* List */}
        <div className="max-h-[68vh] space-y-2 overflow-y-auto pr-2">
          {filteredRanges.length === 0 ? (
            <p className="text-sm text-slate-400">No more salary ranges found</p>
          ) : (
            filteredRanges.map((range, index) => {
              const value = getSalaryValue(range);
              const name = getSalaryName(range);

              return (
                <label
                  key={value || index}
                  className="flex cursor-pointer items-center justify-between rounded-md p-2 text-sm text-white hover:bg-slate-800"
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
            })
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
          <button
            onClick={clearPopupItems}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Clear Popup Items
          </button>

          <button
            onClick={closePopup}
            className="rounded-md bg-cyan-600 px-4 py-1.5 text-sm text-white hover:bg-cyan-700"
          >
            Apply
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SalaryFilterPopup;