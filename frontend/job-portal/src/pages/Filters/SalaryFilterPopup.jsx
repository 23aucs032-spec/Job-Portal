import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const SalaryFilterPopup = ({ selected, setSelected, closePopup }) => {
  const [salaryRanges, setSalaryRanges] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs/salary-count")
      .then((res) => res.json())
      .then((data) => setSalaryRanges(data))
      .catch(() => setSalaryRanges([]));
  }, []);

  const toggleSalary = (value) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((s) => s !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute left-0 top-12 w-80 bg-white shadow-2xl rounded-xl border z-50"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h3 className="font-semibold text-lg">Salary</h3>
        <X
          className="cursor-pointer text-gray-500 hover:text-black"
          size={18}
          onClick={closePopup}
        />
      </div>

      {/* Salary List */}
      <div className="p-4 max-h-80 overflow-y-auto space-y-3">
        {salaryRanges.map((range) => (
          <label
            key={range.value}
            className="flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(range.value)}
                onChange={() => toggleSalary(range.value)}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600">
                {range.name}
              </span>
            </div>

            <span className="text-xs text-gray-500">
              ({range.count})
            </span>
          </label>
        ))}
      </div>

      {/* Apply Button */}
      <div className="p-4 border-t">
        <button
          onClick={closePopup}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full font-medium"
        >
          Apply
        </button>
      </div>
    </motion.div>
  );
};

export default SalaryFilterPopup;