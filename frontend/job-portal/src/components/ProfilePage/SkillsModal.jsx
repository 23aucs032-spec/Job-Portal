/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { X, Plus } from "lucide-react";

const SkillsModal = ({
  modals,
  closeModal,
  modalVariants,
  skills,
  setSkills,
}) => {
  const [inputSkill, setInputSkill] = useState("");

  useEffect(() => {
    if (modals.skills) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modals.skills]);

  if (!modals.skills) return null;

  const handleAddSkill = () => {
    const trimmed = inputSkill.trim();
    if (!trimmed) return;

    const exists = skills.some(
      (skill) => skill.toLowerCase() === trimmed.toLowerCase()
    );

    if (!exists) {
      setSkills((prev) => [...prev, trimmed]);
    }

    setInputSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleSave = () => {
    closeModal("skills");
  };

  return ReactDOM.createPortal(
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#0f172a] p-8 shadow-2xl"
      >
        <button
          type="button"
          onClick={() => closeModal("skills")}
          className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <X size={22} />
        </button>

        <h2 className="mb-2 text-2xl font-bold text-white">Key Skills</h2>
        <p className="mb-6 text-sm text-slate-400">
          Add skills that recruiters search for to improve your profile
          visibility.
        </p>

        <div className="mb-8 flex gap-3">
          <input
            type="text"
            value={inputSkill}
            onChange={(e) => setInputSkill(e.target.value)}
            placeholder="e.g. React.js, Python, Communication..."
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddSkill();
              }
            }}
          />

          <button
            type="button"
            onClick={handleAddSkill}
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        <div>
          <p className="mb-3 text-sm text-slate-400">Added skills</p>

          <div className="flex min-h-[70px] flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-red-400"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-500">No skills added yet</p>
            )}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-end gap-4 border-t border-white/10 pt-6">
          <button
            type="button"
            className="px-5 py-2.5 text-sm font-medium text-slate-400 transition hover:text-white"
            onClick={() => closeModal("skills")}
          >
            Cancel
          </button>

          <button
            type="button"
            className="rounded-2xl bg-cyan-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default SkillsModal;