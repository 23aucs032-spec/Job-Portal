/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const getIndustryName = (industry) =>
  String(industry?.name || industry?.industry || industry?._id || "").trim();

const IndustryFilterPopup = (props) => {
  const {
    selected = [],
    setSelected,
    closePopup,
    industries = [],
  } = props || {};

  const [search, setSearch] = useState("");

  const safeSelected = Array.isArray(selected) ? selected : [];
  const safeIndustries = Array.isArray(industries) ? industries : [];

  const toggleOption = (industryName) => {
    if (!industryName || typeof setSelected !== "function") return;

    if (safeSelected.includes(industryName)) {
      setSelected(safeSelected.filter((item) => item !== industryName));
    } else {
      setSelected([...safeSelected, industryName]);
    }
  };

  const clearPopupItems = () => {
    if (typeof setSelected !== "function") return;

    const popupIndustryNames = safeIndustries.map((industry) =>
      getIndustryName(industry)
    );

    const remainingSelected = safeSelected.filter(
      (item) => !popupIndustryNames.includes(item)
    );

    setSelected(remainingSelected);
  };

  const filteredIndustries = useMemo(() => {
    return safeIndustries.filter((industry) =>
      getIndustryName(industry).toLowerCase().includes(search.toLowerCase())
    );
  }, [safeIndustries, search]);

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
              More Industries
            </h2>
            <p className="text-xs text-slate-400">
              {safeIndustries.length} Industries
            </p>
          </div>

          <button onClick={closePopup}>
            <X className="text-slate-400 hover:text-white" size={20} />
          </button>
        </div>

        <input
          type="text"
          placeholder="Search Industry"
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
          {filteredIndustries.length === 0 ? (
            <p className="text-sm text-slate-400">No more industries found</p>
          ) : (
            filteredIndustries.map((industry, index) => {
              const industryName = getIndustryName(industry);

              return (
                <label
                  key={industry._id || industryName || index}
                  className="flex cursor-pointer items-center justify-between rounded-md p-2 text-sm text-white hover:bg-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={safeSelected.includes(industryName)}
                      onChange={() => toggleOption(industryName)}
                      className="accent-cyan-500"
                    />
                    <span>{industryName}</span>
                  </div>

                  <span className="text-slate-400">
                    ({industry.count || 0})
                  </span>
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

export default IndustryFilterPopup;