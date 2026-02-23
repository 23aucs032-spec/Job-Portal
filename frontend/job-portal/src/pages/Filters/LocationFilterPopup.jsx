import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { X } from "lucide-react";

const LocationFilterPopup = ({
  locations,
  selected,
  setSelected,
  closePopup,
}) => {
  const [search, setSearch] = useState("");

  const filtered = locations.filter((loc) =>
    loc.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleLocation = (name) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((l) => l !== name));
    } else {
      setSelected([...selected, name]);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      onClick={closePopup}
    >
      <motion.div
        initial={{ x: -400 }}
        animate={{ x: 0 }}
        exit={{ x: -400 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-20 left-10 bg-black border border-gray-700 w-96 max-h-[80vh] rounded-xl p-5 text-white"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Location</h2>
          <button onClick={closePopup}>
            <X size={18} />
          </button>
        </div>

        <input
          type="text"
          placeholder="Search Location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-3 bg-black border border-gray-600 rounded text-sm"
        />

        <div className="max-h-60 overflow-y-auto">
          {filtered.map((loc) => (
            <label
              key={loc.name}
              className="flex justify-between items-center text-sm mb-2 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(loc.name)}
                  onChange={() => toggleLocation(loc.name)}
                  className="accent-blue-500"
                />
                {loc.name}
              </div>

              <span className="text-xs text-gray-400">
                ({loc.count})
              </span>
            </label>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={() => setSelected([])}
            className="text-red-400 text-xs"
          >
            Clear All
          </button>

          <button
            onClick={closePopup}
            className="bg-blue-600 px-4 py-1 rounded text-sm"
          >
            Apply
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LocationFilterPopup;