/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const ProjectsModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const emptyProject = {
    name: "",
    fromMonth: "",
    fromYear: "",
    toMonth: "",
    toYear: "",
    description: "",
    learnings: "",
    skills: "",
    url: "",
  };

  const [project, setProject] = useState(emptyProject);

  /* ===========================
     Prevent Background Scroll
  ============================ */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  /* ===========================
     Load Edit Data
  ============================ */
  useEffect(() => {
    if (initialData) {
      setProject(initialData);
    } else {
      setProject(emptyProject);
    }
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setProject({ ...project, [field]: value });
  };

  const handleSave = () => {
    if (!project.name.trim()) return;
    onSave(project);
    onClose();
  };

  /* ===========================
     Slide Animation
  ============================ */
  const modalVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: 60,
      scale: 0.95,
      transition: { duration: 0.25 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-[#161b22] rounded-2xl w-full max-w-2xl border border-gray-700 shadow-2xl flex flex-col max-h-[90vh] relative"
          >
            {/* Close Icon */}
            <X
              className="absolute right-5 top-5 cursor-pointer text-gray-400 hover:text-white"
              size={24}
              onClick={onClose}
            />

            {/* Header */}
            <div className="px-6 sm:px-8 pt-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Projects
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Showcase your best work
              </p>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-6 sm:px-8 pb-6 flex-1 custom-scrollbar">
              <div className="space-y-6 text-gray-300">

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
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-blue-500"
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
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 min-h-30 focus:outline-none focus:border-blue-500"
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
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 min-h-30 focus:outline-none focus:border-blue-500"
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
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-blue-500"
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
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                  />
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-6 px-6 sm:px-8 py-6 border-t border-gray-700">
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