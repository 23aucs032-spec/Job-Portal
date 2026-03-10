/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const LocationFilterPopup = ({
  locations = [],
  selected = [],
  setSelected,
  closePopup,
}) => {
  const [search, setSearch] = useState("");

  const safeLocations = Array.isArray(locations) ? locations : [];
  const safeSelected = Array.isArray(selected) ? selected : [];

  const filteredLocations = useMemo(() => {
    return safeLocations.filter((loc) =>
      String(loc?.name || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [safeLocations, search]);

  const toggleLocation = (name) => {
    if (safeSelected.includes(name)) {
      setSelected(safeSelected.filter((l) => l !== name));
    } else {
      setSelected([...safeSelected, name]);
    }
  };

  const clearPopupItems = () => {
    const popupLocationNames = safeLocations.map((loc) => loc.name);

    const remainingSelected = safeSelected.filter(
      (item) => !popupLocationNames.includes(item)
    );

    setSelected(remainingSelected);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={closePopup}
    >
      <motion.div
        initial={{ x: -400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -400, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute left-6 top-20 w-105 max-w-[92vw] rounded-2xl border border-slate-700 bg-[#020617] p-5 text-white shadow-2xl"
      >
        {/* HEADER */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">More Locations</h2>
            <p className="text-xs text-slate-400">
              {safeLocations.length} Locations
            </p>
          </div>

          <button
            onClick={closePopup}
            className="text-slate-400 transition hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search Location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3 w-full rounded-lg border border-slate-600 bg-slate-900 p-2 text-sm text-white outline-none focus:border-cyan-500"
        />

        {/* SELECTED COUNT */}
        {safeSelected.length > 0 && (
          <p className="mb-2 text-xs text-cyan-400">
            {safeSelected.length} Selected
          </p>
        )}

        {/* LIST */}
        <div className="max-h-72 space-y-2 overflow-y-auto pr-2">
          {filteredLocations.length === 0 ? (
            <p className="text-sm text-slate-400">No more locations found</p>
          ) : (
            filteredLocations.map((loc) => (
              <label
                key={loc.name}
                className="flex cursor-pointer items-center justify-between rounded-md p-2 text-sm text-white hover:bg-slate-800"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={safeSelected.includes(loc.name)}
                    onChange={() => toggleLocation(loc.name)}
                    className="accent-cyan-500"
                  />
                  <span>{loc.name}</span>
                </div>

                <span className="text-xs text-slate-400">
                  ({loc.count || 0})
                </span>
              </label>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={clearPopupItems}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Clear Popup Items
          </button>

          <button
            onClick={closePopup}
            className="rounded bg-cyan-600 px-4 py-1.5 text-sm text-white hover:bg-cyan-700"
          >
            Apply
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LocationFilterPopup;