// ExamModal.jsx
import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    if (!examForm.examName) return;
    onSave(examForm);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#161b22] rounded-2xl w-full max-w-lg p-6 border border-gray-700 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <X
              className="absolute right-5 top-5 cursor-pointer text-gray-400 hover:text-white"
              size={24}
              onClick={onClose}
            />
            <h2 className="text-2xl font-bold text-white mb-4">
              {initialData ? "Edit" : "Add"} Competitive Exam
            </h2>

            <div className="space-y-4">
              {["examName", "score", "year", "rank"].map((field) => (
                <div key={field}>
                  <label className="block text-sm text-gray-400 mb-1.5">{field}</label>
                  <input
                    type="text"
                    value={examForm[field] || ""}
                    onChange={(e) =>
                      setExamForm({ ...examForm, [field]: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-gray-200"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="text-gray-400 px-6 py-2.5"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 px-8 py-2.5 rounded-lg text-white"
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