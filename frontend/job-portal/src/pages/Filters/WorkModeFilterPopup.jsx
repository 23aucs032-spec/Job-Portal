/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const getWorkModeName = (item) =>
  String(item?.name || item?.workMode || item?._id || "").trim();

const WorkModeFilterPopup = ({
  selected = [],
  setSelected,
  closePopup,
  workModes = [],
}) => {
  const [search, setSearch] = useState("");

  const safeSelected = Array.isArray(selected) ? selected : [];
  const safeWorkModes = Array.isArray(workModes) ? workModes : [];

  const toggleOption = (modeName) => {
    if (!modeName) return;

    if (safeSelected.includes(modeName)) {
      setSelected(safeSelected.filter((item) => item !== modeName));
    } else {
      setSelected([...safeSelected, modeName]);
    }
  };

  const clearPopupItems = () => {
    const popupNames = safeWorkModes.map((item) => getWorkModeName(item));

    const remainingSelected = safeSelected.filter(
      (item) => !popupNames.includes(item)
    );

    setSelected(remainingSelected);
  };

  const filteredWorkModes = useMemo(() => {
    return safeWorkModes.filter((item) =>
      getWorkModeName(item).toLowerCase().includes(search.toLowerCase())
    );
  }, [safeWorkModes, search]);

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
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              More Work Modes
            </h2>
            <p className="text-xs text-slate-400">
              {safeWorkModes.length} Work Modes
            </p>
          </div>

          <button onClick={closePopup}>
            <X className="text-slate-400 hover:text-white" size={20} />
          </button>
        </div>

        <input
          type="text"
          placeholder="Search Work Mode"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full rounded-md border border-slate-600 bg-[#1e293b] px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
        />

        {safeSelected.length > 0 && (
          <p className="mb-3 text-xs text-cyan-400">
            {safeSelected.length} Selected
          </p>
        )}

        <div className="max-h-[68vh] space-y-2 overflow-y-auto pr-2">
          {filteredWorkModes.length === 0 ? (
            <p className="text-sm text-slate-400">No more work modes found</p>
          ) : (
            filteredWorkModes.map((item, index) => {
              const modeName = getWorkModeName(item);

              return (
                <label
                  key={item._id || modeName || index}
                  className="flex cursor-pointer items-center justify-between rounded-md p-2 text-sm text-white hover:bg-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={safeSelected.includes(modeName)}
                      onChange={() => toggleOption(modeName)}
                      className="accent-cyan-500"
                    />
                    <span>{modeName}</span>
                  </div>

                  <span className="text-slate-400">({item.count || 0})</span>
                </label>
              );
            })
          )}
        </div>

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

export default WorkModeFilterPopup;