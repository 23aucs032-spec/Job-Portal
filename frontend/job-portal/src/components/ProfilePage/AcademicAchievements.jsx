import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { X } from "lucide-react";

// Props: 
// modals -> {accomplishments: boolean}, 
// openModal -> function, 
// closeModal -> function, 
// onSave -> function(profileAchievementsArray)
const AcademicAchievements = ({ modals, closeModal, onSave }) => {
  const [selectedAchievements, setSelectedAchievements] = useState([]);

  const achievementOptions = [
    "College topper",
    "Department topper",
    "Top 3 in class",
    "Top 10 in class",
    "Gold medalist",
    "Received scholarship",
    "All rounder",
    "Other",
  ];

  const toggleAchievement = (achievement) => {
    if (selectedAchievements.includes(achievement)) {
      setSelectedAchievements(selectedAchievements.filter((a) => a !== achievement));
    } else {
      setSelectedAchievements([...selectedAchievements, achievement]);
    }
  };

  const handleSave = () => {
    console.log("Saved achievements:", selectedAchievements);
    if (onSave) onSave(selectedAchievements);
    closeModal("accomplishments");
  };

  return (
    <>
      {modals.accomplishments && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#161b22] rounded-2xl w-full max-w-lg p-6 sm:p-8 border border-gray-700 relative shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            {/* Close button */}
            <X
              className="absolute right-5 top-5 cursor-pointer text-gray-400 hover:text-white"
              size={24}
              onClick={() => closeModal("accomplishments")}
            />

            <h2 className="text-2xl font-bold text-white mb-2">Academic Achievements</h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Adding your achievements helps recruiters know your value as a potential candidate
            </p>

            <div className="space-y-6">
              {/* Selected achievements */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Selected achievements
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {selectedAchievements.map((achievement) => (
                    <span
                      key={achievement}
                      className="bg-blue-900/40 text-blue-300 px-4 py-1.5 rounded-full text-sm border border-blue-800/50 flex items-center gap-2"
                    >
                      {achievement}
                      <X
                        size={14}
                        className="cursor-pointer hover:text-red-400"
                        onClick={() => toggleAchievement(achievement)}
                      />
                    </span>
                  ))}
                  {selectedAchievements.length === 0 && (
                    <span className="text-gray-500 text-sm">No achievements added yet</span>
                  )}
                </div>
              </div>

              {/* Achievement options as pills */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Add achievements
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {achievementOptions.map((achievement) => (
                    <button
                      key={achievement}
                      className={`px-4 py-1.5 rounded-full text-sm border transition flex items-center gap-1.5
                        ${
                          selectedAchievements.includes(achievement)
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                        }`}
                      onClick={() => toggleAchievement(achievement)}
                    >
                      {achievement}
                      {!selectedAchievements.includes(achievement) && (
                        <span className="text-blue-400">+</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-6 mt-10 pt-6 border-t border-gray-700">
              <button
                className="text-gray-400 hover:text-gray-200 text-sm font-medium"
                onClick={() => closeModal("accomplishments")}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-500 px-10 py-3 rounded-lg font-medium text-white shadow-md transition"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default AcademicAchievements;