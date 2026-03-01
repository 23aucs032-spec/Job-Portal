import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { X } from "lucide-react";

const LanguagesModal = ({
  modals,
  closeModal,
  modalVariants,
  languages,
  setLanguages,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState("");

  if (!modals.languages) return null;

  const handleAddLanguage = () => {
    if (!selectedLanguage) return;

    const exists = languages.includes(selectedLanguage);

    if (!exists) {
      setLanguages([...languages, selectedLanguage]);
    }

    setSelectedLanguage("");
  };

  const handleRemoveLanguage = (langToRemove) => {
    setLanguages(
      languages.filter((lang) => lang !== langToRemove)
    );
  };

  const handleSave = () => {
    closeModal("languages");
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-[#161b22] rounded-2xl w-full max-w-lg p-8 border border-gray-700 relative shadow-2xl"
      >
        {/* Close Button */}
        <X
          className="absolute right-5 top-5 cursor-pointer text-gray-400 hover:text-white"
          size={22}
          onClick={() => closeModal("languages")}
        />

        <h2 className="text-2xl font-bold text-white mb-2">
          Languages known
        </h2>

        <p className="text-gray-400 text-sm mb-8">
          Strengthen your resume by letting recruiters know you can communicate in multiple languages
        </p>

        {/* Language Selector */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Language
            </label>

            <div className="flex gap-3">
              <div className="relative flex-1">
                <select
                  value={selectedLanguage}
                  onChange={(e) =>
                    setSelectedLanguage(e.target.value)
                  }
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-lg p-3 text-gray-200 appearance-none cursor-pointer"
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

                {/* Dropdown Icon */}
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <button
                onClick={handleAddLanguage}
                className="bg-blue-600 hover:bg-blue-500 px-6 rounded-lg text-white font-medium transition min-w-20"
              >
                Add
              </button>
            </div>
          </div>

          {/* Added Languages */}
          <div className="min-h-20">
            <p className="text-sm text-gray-400 mb-3">
              Added languages
            </p>

            <div className="flex flex-wrap gap-2.5">
              {languages.map((lang) => (
                <span
                  key={lang}
                  className="bg-gray-700 text-gray-200 px-4 py-2 rounded-full text-sm flex items-center gap-2 border border-gray-600"
                >
                  {lang}
                  <X
                    size={14}
                    className="cursor-pointer hover:text-red-400 transition"
                    onClick={() =>
                      handleRemoveLanguage(lang)
                    }
                  />
                </span>
              ))}

              {languages.length === 0 && (
                <p className="text-gray-500 text-center w-full mt-6 text-sm">
                  No languages added yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-6 mt-10 pt-6 border-t border-gray-700">
          <button
            className="text-gray-400 hover:text-gray-200 text-sm font-medium"
            onClick={() => closeModal("languages")}
          >
            Cancel
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-500 px-10 py-3 rounded-lg font-medium text-white shadow-md transition"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LanguagesModal;