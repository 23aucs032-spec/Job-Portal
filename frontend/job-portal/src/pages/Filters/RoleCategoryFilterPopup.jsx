/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const getRoleName = (role) =>
  String(role?.name || role?.roleCategory || role?._id || "").trim();

const RoleCategoryFilterPopup = ({
  selected = [],
  setSelected,
  closePopup,
  roleCategories = [],
}) => {
  const [search, setSearch] = useState("");

  const safeSelected = Array.isArray(selected) ? selected : [];
  const safeRoleCategories = Array.isArray(roleCategories) ? roleCategories : [];

  const toggleOption = (roleName) => {
    if (!roleName) return;

    if (safeSelected.includes(roleName)) {
      setSelected(safeSelected.filter((item) => item !== roleName));
    } else {
      setSelected([...safeSelected, roleName]);
    }
  };

  const clearPopupItems = () => {
    const popupRoleNames = safeRoleCategories.map((role) => getRoleName(role));

    const remainingSelected = safeSelected.filter(
      (item) => !popupRoleNames.includes(item)
    );

    setSelected(remainingSelected);
  };

  const filteredRoles = useMemo(() => {
    return safeRoleCategories.filter((role) =>
      getRoleName(role).toLowerCase().includes(search.toLowerCase())
    );
  }, [safeRoleCategories, search]);

  return (
    <div className="fixed inset-0 z-50" onClick={closePopup}>
      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        initial={{ x: -320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -320, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative h-full w-90 max-w-[90vw] border-r border-slate-700 bg-[#0f172a] p-5 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              More Role Categories
            </h2>
            <p className="text-xs text-slate-400">
              {safeRoleCategories.length} Role Categories
            </p>
          </div>

          <button onClick={closePopup}>
            <X className="text-slate-400 hover:text-white" size={20} />
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search Role Category"
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
          {filteredRoles.length === 0 ? (
            <p className="text-sm text-slate-400">No more role categories found</p>
          ) : (
            filteredRoles.map((role, index) => {
              const roleName = getRoleName(role);

              return (
                <label
                  key={role._id || roleName || index}
                  className="flex cursor-pointer items-center justify-between rounded-md p-2 text-sm text-white hover:bg-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={safeSelected.includes(roleName)}
                      onChange={() => toggleOption(roleName)}
                      className="accent-cyan-500"
                    />
                    <span>{roleName}</span>
                  </div>

                  <span className="text-slate-400">({role.count || 0})</span>
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

export default RoleCategoryFilterPopup;