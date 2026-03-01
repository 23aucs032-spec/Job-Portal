// ProjectsModal.jsx
import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const ProjectsModal = ({
  isOpen,
  onClose,
  onSave,
  modalVariants,
  initialData,
}) => {
  const [project, setProject] = useState({
    name: "",
    fromMonth: "",
    fromYear: "",
    toMonth: "",
    toYear: "",
    description: "",
    learnings: "",
    skills: "",
    url: "",
  });

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProject(initialData);
    } else {
      setProject({
        name: "",
        fromMonth: "",
        fromYear: "",
        toMonth: "",
        toYear: "",
        description: "",
        learnings: "",
        skills: "",
        url: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setProject({ ...project, [field]: value });
  };

  const handleSave = () => {
    if (!project.name) return;
    onSave(project);
    onClose();
  };

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
              Projects
            </h2>

            <p className="text-gray-400 text-sm mb-8">
              Showcase your best work
            </p>

            <div className="space-y-6">

              {/* Project Name */}
              <div>
                <label className="block text-sm mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) =>
                    handleChange("name", e.target.value)
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm mb-2">
                  Project Description
                </label>
                <textarea
                  value={project.description}
                  onChange={(e) =>
                    handleChange("description", e.target.value)
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 min-h-25"
                />
              </div>

              {/* Learnings */}
              <div>
                <label className="block text-sm mb-2">
                  Learnings & Favorite Part
                </label>
                <textarea
                  value={project.learnings}
                  onChange={(e) =>
                    handleChange("learnings", e.target.value)
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 min-h-25"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm mb-2">
                  Key Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={project.skills}
                  onChange={(e) =>
                    handleChange("skills", e.target.value)
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3"
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm mb-2">
                  Project URL
                </label>
                <input
                  type="url"
                  value={project.url}
                  onChange={(e) =>
                    handleChange("url", e.target.value)
                  }
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

export default ProjectsModal;