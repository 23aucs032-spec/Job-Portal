import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

const CareerPreferenceModal = ({
  modals,
  closeModal,
  modalVariants,
  preferenceForm,
  setPreferenceForm,
  handlePreferenceSave,
}) => {
  if (!modals.preference) return null;

  const toggleType = (type) => {
    setPreferenceForm((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const removeLocation = (loc) => {
    setPreferenceForm((prev) => ({
      ...prev,
      locations: prev.locations.filter((l) => l !== loc),
    }));
  };

  const addLocation = (loc) => {
    if (!preferenceForm.locations.includes(loc)) {
      setPreferenceForm((prev) => ({
        ...prev,
        locations: [...prev.locations, loc],
      }));
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-[#161b22] rounded-2xl w-full max-w-lg p-6 sm:p-8 border border-gray-700 relative shadow-2xl"
      >
        <X
          className="absolute right-5 top-5 cursor-pointer text-gray-400 hover:text-white"
          size={24}
          onClick={() => closeModal("preference")}
        />

        <h2 className="text-2xl font-bold text-white mb-2">
          Career preferences
        </h2>

        <p className="text-gray-400 text-sm mb-8">
          Tell us your preferences for your next job & we will send you most relevant recommendations
        </p>

        <div className="space-y-8 text-gray-300">

          {/* Looking for */}
          <div>
            <p className="font-medium mb-3 text-white">Looking for</p>
            <div className="flex flex-wrap gap-3">
              {["Internships", "Jobs"].map((type) => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`px-5 py-2 rounded-full text-sm font-medium border transition-all flex items-center gap-2 ${
                    preferenceForm.types.includes(type)
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-gray-800 border-gray-600 text-gray-300"
                  }`}
                >
                  {type}
                  {preferenceForm.types.includes(type) && (
                    <CheckCircle2 size={16} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <p className="font-medium mb-3 text-white">Availability to work</p>
            <div className="flex flex-wrap gap-2.5">
              {[
                "15 Days or less",
                "1 Month",
                "2 Months",
                "3 Months",
                "More than 3 Months",
              ].map((opt) => (
                <button
                  key={opt}
                  onClick={() =>
                    setPreferenceForm({
                      ...preferenceForm,
                      availability: opt,
                    })
                  }
                  className={`px-4 py-1.5 rounded-full text-sm border ${
                    preferenceForm.availability === opt
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-gray-800 border-gray-600 text-gray-300"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div>
            <p className="font-medium mb-3 text-white">
              Preferred work location(s)
            </p>

            <div className="flex flex-wrap gap-2.5 mb-3">
              {preferenceForm.locations.map((loc) => (
                <span
                  key={loc}
                  className="bg-blue-900/40 text-blue-300 px-4 py-1.5 rounded-full text-sm border border-blue-800/50 flex items-center gap-2"
                >
                  {loc}
                  <X
                    size={14}
                    className="cursor-pointer"
                    onClick={() => removeLocation(loc)}
                  />
                </span>
              ))}
            </div>

            <select
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3"
              defaultValue=""
              onChange={(e) => addLocation(e.target.value)}
            >
              <option value="" disabled>
                Select from the list
              </option>
              <option>Bengaluru</option>
              <option>Chennai</option>
              <option>Delhi / NCR</option>
              <option>Hyderabad</option>
              <option>Mumbai</option>
              <option>Pune</option>
              <option>Remote</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-700">
          <button
            className="text-gray-400 text-sm"
            onClick={() => closeModal("preference")}
          >
            Cancel
          </button>

          <button
            className="bg-blue-600 px-8 py-3 rounded-lg text-white"
            onClick={handlePreferenceSave}
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CareerPreferenceModal;