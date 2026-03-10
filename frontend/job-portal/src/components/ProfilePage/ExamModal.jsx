/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const ExamModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [examForm, setExamForm] = useState({
    examName: "",
    score: "",
    year: "",
    rank: "",
  });

  useEffect(() => {
    if (initialData) {
      setExamForm(initialData);
    } else {
      setExamForm({
        examName: "",
        score: "",
        year: "",
        rank: "",
      });
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!examForm.examName.trim()) return;
    onSave(examForm);
    onClose();
  };

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-500";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#0f172a] p-8 shadow-2xl"
            initial={{ scale: 0.96, opacity: 0, y: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 25 }}
          >
            <button
              onClick={onClose}
              className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <X size={22} />
            </button>

            <h2 className="mb-5 text-2xl font-bold text-white">
              {initialData ? "Edit" : "Add"} Competitive Exam
            </h2>

            <div className="space-y-4">
              {["examName", "score", "year", "rank"].map((field) => (
                <div key={field}>
                  <label className="mb-1.5 block text-sm capitalize text-slate-400">
                    {field}
                  </label>
                  <input
                    type="text"
                    value={examForm[field] || ""}
                    onChange={(e) =>
                      setExamForm({ ...examForm, [field]: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end gap-4 border-t border-white/10 pt-6">
              <button
                className="px-5 py-2.5 text-sm font-medium text-slate-400 transition hover:text-white"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="rounded-2xl bg-cyan-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500"
                onClick={handleSave}
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

export default ExamModal;