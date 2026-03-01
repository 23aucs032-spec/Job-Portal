import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { X } from "lucide-react";

const SkillsModal = ({
  modals,
  closeModal,
  modalVariants,
  skills,
  setSkills,
}) => {
  const [inputSkill, setInputSkill] = useState("");

  if (!modals.skills) return null;

  const handleAddSkill = () => {
    const trimmed = inputSkill.trim();

    if (!trimmed) return;

    // Prevent duplicates (case insensitive)
    const exists = skills.some(
      (skill) => skill.toLowerCase() === trimmed.toLowerCase()
    );

    if (!exists) {
      setSkills([...skills, trimmed]);
    }

    setInputSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSave = () => {
    closeModal("skills");
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
        className="bg-[#161b22] rounded-2xl w-full max-w-lg p-8 border border-gray-700 relative shadow-2xl"
      >
        {/* Close */}
        <X
          className="absolute right-5 top-5 cursor-pointer text-gray-400 hover:text-white"
          size={22}
          onClick={() => closeModal("skills")}
        />

        <h2 className="text-2xl font-bold text-white mb-2">
          Key skills
        </h2>

        <p className="text-gray-400 text-sm mb-6">
          Recruiters look for candidates with specific key skills. Add them here to appear in searches.
        </p>

        {/* Add Skill Input */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={inputSkill}
            onChange={(e) => setInputSkill(e.target.value)}
            placeholder="e.g. React.js, Python, Communication..."
            className="flex-1 bg-[#0d1117] border-b-2 border-blue-600 focus:border-blue-500 rounded-none p-3 text-gray-200 placeholder-gray-500 outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddSkill();
              }
            }}
          />

          <button
            onClick={handleAddSkill}
            className="bg-blue-600 hover:bg-blue-500 px-6 rounded-lg text-white font-medium transition"
          >
            Add
          </button>
        </div>

        {/* Added Skills */}
        <div>
          <p className="text-sm text-gray-400 mb-3">
            Added skills
          </p>

          <div className="flex flex-wrap gap-2.5 min-h-15">
            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-gray-700 text-gray-200 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-gray-600"
              >
                {skill}
                <X
                  size={14}
                  className="cursor-pointer hover:text-red-400 transition"
                  onClick={() => handleRemoveSkill(skill)}
                />
              </span>
            ))}

            {skills.length === 0 && (
              <p className="text-gray-500 text-sm mt-6">
                No skills added yet
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-6 mt-10 pt-6 border-t border-gray-700">
          <button
            className="text-gray-400 hover:text-gray-200 text-sm font-medium"
            onClick={() => closeModal("skills")}
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
  );
};

export default SkillsModal;