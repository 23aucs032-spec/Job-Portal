import React, { useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { X } from "lucide-react";

const EmploymentModal = ({
  employmentForm,
  setEmploymentForm,
  editingEmploymentIndex,
  onClose,
  onSave,
}) => {

  /* Lock Background Scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const modalVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.35 },
    },
    exit: {
      opacity: 0,
      y: 60,
      scale: 0.95,
      transition: { duration: 0.25 },
    },
  };

  return (
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
          {editingEmploymentIndex !== null
            ? "Edit Employment"
            : "Add Employment"}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Add your work experience details
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto px-6 sm:px-8 pb-6 flex-1">
        <div className="space-y-6 text-gray-300">

          {/* Role */}
          <div>
            <label className="block text-sm mb-2">Role</label>
            <input
              type="text"
              value={employmentForm.role}
              onChange={(e) =>
                setEmploymentForm({
                  ...employmentForm,
                  role: e.target.value,
                })
              }
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm mb-2">Company</label>
            <input
              type="text"
              value={employmentForm.company}
              onChange={(e) =>
                setEmploymentForm({
                  ...employmentForm,
                  company: e.target.value,
                })
              }
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 focus:border-blue-500 outline-none"
            />
          </div>

          {/* From Date */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="From Month"
              value={employmentForm.fromMonth}
              onChange={(e) =>
                setEmploymentForm({
                  ...employmentForm,
                  fromMonth: e.target.value,
                })
              }
              className="bg-gray-800 border border-gray-600 rounded-lg p-3 outline-none"
            />
            <input
              type="text"
              placeholder="From Year"
              value={employmentForm.fromYear}
              onChange={(e) =>
                setEmploymentForm({
                  ...employmentForm,
                  fromYear: e.target.value,
                })
              }
              className="bg-gray-800 border border-gray-600 rounded-lg p-3 outline-none"
            />
          </div>

          {/* To Date */}
          {!employmentForm.currentlyWorking && (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="To Month"
                value={employmentForm.toMonth}
                onChange={(e) =>
                  setEmploymentForm({
                    ...employmentForm,
                    toMonth: e.target.value,
                  })
                }
                className="bg-gray-800 border border-gray-600 rounded-lg p-3 outline-none"
              />
              <input
                type="text"
                placeholder="To Year"
                value={employmentForm.toYear}
                onChange={(e) =>
                  setEmploymentForm({
                    ...employmentForm,
                    toYear: e.target.value,
                  })
                }
                className="bg-gray-800 border border-gray-600 rounded-lg p-3 outline-none"
              />
            </div>
          )}

          {/* Currently Working */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={employmentForm.currentlyWorking}
              onChange={(e) =>
                setEmploymentForm({
                  ...employmentForm,
                  currentlyWorking: e.target.checked,
                })
              }
            />
            <span className="text-sm">Currently working here</span>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-2">Description</label>
            <textarea
              value={employmentForm.description}
              onChange={(e) =>
                setEmploymentForm({
                  ...employmentForm,
                  description: e.target.value,
                })
              }
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 min-h-30 outline-none"
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
          onClick={() => onSave(employmentForm)}
          className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg text-white"
        >
          Save
        </button>
      </div>
    </motion.div>
  );
};

export default EmploymentModal;