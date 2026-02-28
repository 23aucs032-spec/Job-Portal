import React from "react";
import { X } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const distanceOptions = [5, 10, 25, 50, 100];

const KmsFilterPopup = ({ selected, setSelected, closePopup }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/90 w-100 rounded-2xl shadow-xl p-6 text-gray-200"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-blue-400">Distance</h2>
          <X
            className="cursor-pointer text-gray-200 hover:text-red-500"
            size={20}
            onClick={closePopup}
          />
        </div>

        {/* Options */}
        <div className="space-y-3">
          {distanceOptions.map((km) => (
            <label
              key={km}
              className="flex items-center gap-3 cursor-pointer hover:text-blue-400"
            >
              <input
                type="radio"
                name="distance"
                checked={selected === km}
                onChange={() => setSelected(km)}
                className="accent-blue-500"
              />
              <span>Within {km} km</span>
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6">
          <button
            onClick={closePopup}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default KmsFilterPopup;