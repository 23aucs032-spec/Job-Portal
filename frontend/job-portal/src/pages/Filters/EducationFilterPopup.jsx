import React, { useState } from "react";
import { X } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const EducationFilterPopup = ({
  selected,
  setSelected,
  closePopup,
  educations,
}) => {
  const [search, setSearch] = useState("");

  const toggleOption = (edu) => {
    if (selected.includes(edu)) {
      setSelected(selected.filter((item) => item !== edu));
    } else {
      setSelected([...selected, edu]);
    }
  };

  const clearAll = () => {
    setSelected([]);
  };

  const filtered = educations.filter((edu) =>
    edu.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-black/60"
        onClick={closePopup}
      ></div>

      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-96 h-full bg-[#0f172a] shadow-xl p-5 border-r border-gray-700"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">
            Education
          </h2>
          <button onClick={closePopup}>
            <X className="text-gray-400 hover:text-white" size={20} />
          </button>
        </div>

        <input
          type="text"
          placeholder="Search Education"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-md bg-[#1e293b] text-white border border-gray-600"
        />

        <div className="flex-1 max-h-[65vh] overflow-y-auto space-y-2 pr-2">
          {filtered.map((edu) => (
            <label
              key={edu.name}
              className="flex justify-between items-center text-sm text-white cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(edu.name)}
                  onChange={() => toggleOption(edu.name)}
                />
                {edu.name}
              </div>
              <span className="text-gray-400">
                ({edu.count})
              </span>
            </label>
          ))}
        </div>

        <div className="absolute bottom-5 left-5 right-5 flex justify-between">
          <button
            onClick={clearAll}
            className="text-red-400 text-sm"
          >
            Clear All
          </button>

          <button
            onClick={closePopup}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm"
          >
            Apply
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EducationFilterPopup;