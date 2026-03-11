/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { X, Plus } from "lucide-react";

const LanguagesModal = ({
  modals,
  closeModal,
  modalVariants,
  languages,
  setLanguages,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(() => {
    if (modals.languages) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modals.languages]);

  if (!modals.languages) return null;

  const handleAddLanguage = () => {
    if (!selectedLanguage) return;

    const exists = languages.includes(selectedLanguage);
    if (!exists) {
      setLanguages((prev) => [...prev, selectedLanguage]);
    }

    setSelectedLanguage("");
  };

  const handleRemoveLanguage = (langToRemove) => {
    setLanguages((prev) => prev.filter((lang) => lang !== langToRemove));
  };

  const handleSave = () => {
    closeModal("languages");
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
          onClick={() => closeModal("languages")}
          className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <X size={22} />
        </button>

        <h2 className="mb-2 text-2xl font-bold text-white">
          Languages Known
        </h2>
        <p className="mb-8 text-sm text-slate-400">
          Add languages you can communicate in to strengthen your profile.
        </p>

        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Language
            </label>

            <div className="flex gap-3">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-200 outline-none focus:border-cyan-500"
              >
                <option value="">Select Language</option>
                <option>English</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Telugu</option>
                <option>Kannada</option>
                <option>Malayalam</option>
                <option>Punjabi</option>
                <option>Odia</option>
                <option>Assamese</option>
                <option>Urdu</option>
                <option>Konkani</option>
                <option>Bodo</option>
                <option>Manipuri</option>
                <option>Sindhi</option>
                <option>Russian</option>
                <option>Chinese</option>
                <option>Korean</option>
                <option>Italian</option>
                <option>Portuguese</option>
                <option>Dutch</option>
                <option>Indonesian</option>
                <option>Malaysian</option>
              </select>

              <button
                type="button"
                onClick={handleAddLanguage}
                className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm text-slate-400">Added languages</p>

            <div className="flex min-h-[70px] flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              {languages.length > 0 ? (
                languages.map((lang) => (
                  <span
                    key={lang}
                    className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(lang)}
                      className="hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No languages added yet
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-end gap-4 border-t border-white/10 pt-6">
          <button
            type="button"
            className="px-5 py-2.5 text-sm font-medium text-slate-400 transition hover:text-white"
            onClick={() => closeModal("languages")}
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

export default LanguagesModal;