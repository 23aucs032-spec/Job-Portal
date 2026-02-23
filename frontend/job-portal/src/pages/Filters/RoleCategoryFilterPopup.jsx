import React, { useState } from "react";
import { X } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const RoleCategoryFilterPopup = ({
  selected,
  setSelected,
  closePopup,
  roleCategories,
}) => {
  const [search, setSearch] = useState("");

const toggleOption = (roleName) => {
  if (!roleName) return;

  if (selected.includes(roleName)) {
    setSelected(selected.filter((item) => item !== roleName));
  } else {
    setSelected([...selected, roleName]);
  }
};

  const clearAll = () => {
    setSelected([]);
  };

const filteredRoles = (roleCategories || []).filter((role) => {
  const roleName =
    role?.name || role?.roleCategory || role?._id || "";

  return roleName.toLowerCase().includes(search.toLowerCase());
});

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60"
        onClick={closePopup}
      ></div>

      {/* Left Drawer */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.3 }}
        className="relative w-87.5 h-full bg-[#0f172a] shadow-xl p-5 border-r border-gray-700"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">
            Role Category
          </h2>
          <button onClick={closePopup}>
            <X className="text-gray-400 hover:text-white" size={20} />
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search Role Category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-md bg-[#1e293b] text-white border border-gray-600 focus:outline-none"
        />

        {/* Scrollable List */}
        <div className="flex-1 max-h-[65vh] overflow-y-auto space-y-2 pr-2">
          {filteredRoles.map((role, index) => {
  const roleName =
    role?.name || role?.roleCategory || role?._id || "";

  return (
    <label
      key={role._id || roleName || index}
      className="flex justify-between items-center cursor-pointer text-sm text-white"
    >
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={selected.includes(roleName)}
          onChange={() => toggleOption(roleName)}
        />
        {roleName}
      </div>

      <span className="text-gray-400">
        ({role.count || 0})
      </span>
    </label>
  );
})}
        </div>

        {/* Footer */}
        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center">
          <button
            onClick={clearAll}
            className="text-red-400 text-sm hover:underline"
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

export default RoleCategoryFilterPopup;