/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const defaultInternship = {
  company: "",
  fromMonth: "",
  fromYear: "",
  toMonth: "",
  toYear: "",
  project: "",
  description: "",
  skills: "",
  url: "",
};

const InternshipsModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [internship, setInternship] = useState({
    ...defaultInternship,
    ...initialData,
  });

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

  useEffect(() => {
    if (initialData) {
      setInternship({
        ...defaultInternship,
        ...initialData,
      });
    } else {
      setInternship(defaultInternship);
    }
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setInternship({ ...internship, [field]: value });
  };

  const handleSave = () => {
    onSave(internship);
    onClose();
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3 },
    },
    exit: { opacity: 0, y: 50, scale: 0.96, transition: { duration: 0.2 } },
  };

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl border border-white/10 bg-[#0f172a] shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <X size={22} />
            </button>

            <div className="px-8 pb-2 pt-8">
              <h2 className="mb-2 text-2xl font-bold text-white">
                Internship Details
              </h2>
              <p className="text-sm text-slate-400">
                Showcase your professional exposure and key contributions.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-8 pt-6">
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Company name
                  </label>
                  <input
                    type="text"
                    value={internship.company || ""}
                    onChange={(e) => handleChange("company", e.target.value)}
                    className={inputClass}
                    placeholder="Enter the company name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Project name
                  </label>
                  <input
                    type="text"
                    value={internship.project || ""}
                    onChange={(e) => handleChange("project", e.target.value)}
                    className={inputClass}
                    placeholder="Project name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Describe your work
                  </label>
                  <textarea
                    value={internship.description || ""}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    className={`${inputClass} min-h-32.5`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Key skills (optional)
                  </label>
                  <input
                    type="text"
                    value={internship.skills || ""}
                    onChange={(e) => handleChange("skills", e.target.value)}
                    className={inputClass}
                    placeholder="React, Node.js, API..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Project URL (optional)
                  </label>
                  <input
                    type="url"
                    value={internship.url || ""}
                    onChange={(e) => handleChange("url", e.target.value)}
                    className={inputClass}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t border-white/10 px-8 py-6">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-slate-400 transition hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-2xl bg-cyan-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500"
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