/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const EmploymentModal = ({
  employmentForm,
  setEmploymentForm,
  editingEmploymentIndex,
  onClose,
  onSave,
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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
          {editingEmploymentIndex !== null ? "Edit Employment" : "Add Employment"}
        </h2>
        <p className="text-sm text-slate-400">
          Add your work experience details in a clear and professional way.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8 pt-6">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Role</label>
            <input
              type="text"
              value={employmentForm.role}
              onChange={(e) =>
                setEmploymentForm({
                  ...employmentForm,
                  role: e.target.value,
                })
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Company</label>
            <input
              type="text"
              value={employmentForm.company}
              onChange={(e) =>
                setEmploymentForm({
                  ...employmentForm,
                  company: e.target.value,
                })
              }
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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
              className={inputClass}
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
              className={inputClass}
            />
          </div>

          {!employmentForm.currentlyWorking && (
            <div className="grid gap-4 md:grid-cols-2">
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
                className={inputClass}
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
                className={inputClass}
              />
            </div>
          )}

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/3 p-4 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={employmentForm.currentlyWorking}
              onChange={(e) =>
                setEmploymentForm({
                  ...employmentForm,
                  currentlyWorking: e.target.checked,
                })
              }
              className="accent-cyan-500"
            />
            Currently working here
          </label>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Description
            </label>
            <textarea
              value={employmentForm.description}
              onChange={(e) =>
                setEmploymentForm({
                  ...employmentForm,
                  description: e.target.value,
                })
              }
              className={`${inputClass} min-h-35`}
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
          onClick={() => onSave(employmentForm)}
          className="rounded-2xl bg-cyan-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500"
        >
          Save
        </button>
      </div>
    </motion.div>
  );
};

export default EmploymentModal;