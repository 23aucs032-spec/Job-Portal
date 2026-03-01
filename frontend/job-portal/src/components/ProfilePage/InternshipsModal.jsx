import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const InternshipsModal = ({ isOpen, onClose, modalVariants, onSave, initialData }) => {
const [internship, setInternship] = useState(
  initialData || {
    company: "",
    fromMonth: "",
    fromYear: "",
    toMonth: "",
    toYear: "",
    project: "",
    description: "",
    skills: "",
    url: "",
  }
);

  const handleChange = (field, value) => {
    setInternship({ ...internship, [field]: value });
  };

const handleSave = () => {
  onSave(internship);
  onClose();
};
useEffect(() => {
  if (initialData) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInternship(initialData);
  }
}, [initialData]);
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-[#161b22] rounded-2xl w-full max-w-2xl p-6 sm:p-8 border border-gray-700 relative shadow-2xl"
          >
            <X
              className="absolute right-5 top-5 cursor-pointer text-gray-400 hover:text-white"
              size={24}
              onClick={onClose}
            />

            <h2 className="text-2xl font-bold text-white mb-2">
              Internships
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Show your professional learnings
            </p>

            <div className="space-y-6 text-gray-300">

              {/* Company */}
              <div>
                <label className="block text-sm mb-2">Company name</label>
                <input
                  type="text"
                  value={internship.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3"
                  placeholder="Enter the company name"
                />
              </div>

              {/* Project */}
              <div>
                <label className="block text-sm mb-2">Project name</label>
                <input
                  type="text"
                  value={internship.project}
                  onChange={(e) => handleChange("project", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3"
                  placeholder="Project name"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm mb-2">
                  Describe your work
                </label>
                <textarea
                  value={internship.description}
                  onChange={(e) =>
                    handleChange("description", e.target.value)
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 min-h-30"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm mb-2">
                  Key skills (optional)
                </label>
                <input
                  type="text"
                  value={internship.skills}
                  onChange={(e) => handleChange("skills", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm mb-2">
                  Project URL (optional)
                </label>
                <input
                  type="url"
                  value={internship.url}
                  onChange={(e) => handleChange("url", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3"
                />
              </div>
            </div>

            <div className="flex justify-end gap-6 mt-10 pt-6 border-t border-gray-700">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-200 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg text-white"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InternshipsModal;