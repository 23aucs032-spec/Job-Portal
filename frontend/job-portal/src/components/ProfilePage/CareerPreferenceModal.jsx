/* eslint-disable no-unused-vars */
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Plus } from "lucide-react";

const CareerPreferenceModal = ({
  modals,
  closeModal,
  modalVariants,
  preferenceForm,
  setPreferenceForm,
  handlePreferenceSave,
}) => {
  if (!modals.preference) return null;

  const toggleType = (type) => {
    setPreferenceForm((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
    }));
  };

  const removeLocation = (loc) => {
    setPreferenceForm((prev) => ({
      ...prev,
      locations: prev.locations.filter((l) => l !== loc),
    }));
  };

  const addLocation = (loc) => {
    if (!loc) return;

    if (!preferenceForm.locations.includes(loc)) {
      setPreferenceForm((prev) => ({
        ...prev,
        locations: [...prev.locations, loc],
      }));
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0f172a] p-8 shadow-2xl"
        >
          <button
            onClick={() => closeModal("preference")}
            className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <X size={22} />
          </button>

          <h2 className="mb-2 text-2xl font-bold text-white">
            Career Preferences
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-slate-400">
            Tell us what kind of roles you are looking for so we can recommend
            opportunities that suit you best.
          </p>

          <div className="space-y-8 text-slate-300">
            <div>
              <p className="mb-3 font-medium text-white">Looking for</p>
              <div className="flex flex-wrap gap-3">
                {["Internships", "Jobs"].map((type) => {
                  const active = preferenceForm.types.includes(type);

                  return (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition ${
                        active
                          ? "border-cyan-500 bg-cyan-600 text-white"
                          : "border-white/10 bg-white/3 text-slate-300 hover:bg-white/6"
                      }`}
                    >
                      {type}
                      {active && <CheckCircle2 size={15} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-3 font-medium text-white">Availability to work</p>
              <div className="flex flex-wrap gap-3">
                {[
                  "15 Days or less",
                  "1 Month",
                  "2 Months",
                  "3 Months",
                  "More than 3 Months",
                ].map((opt) => {
                  const active = preferenceForm.availability === opt;

                  return (
                    <button
                      key={opt}
                      onClick={() =>
                        setPreferenceForm({
                          ...preferenceForm,
                          availability: opt,
                        })
                      }
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        active
                          ? "border-cyan-500 bg-cyan-600 text-white"
                          : "border-white/10 bg-white/3 text-slate-300 hover:bg-white/6"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-3 font-medium text-white">
                Preferred work location(s)
              </p>

              <div className="mb-4 flex min-h-14 flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/3 p-4">
                {preferenceForm.locations.length > 0 ? (
                  preferenceForm.locations.map((loc) => (
                    <span
                      key={loc}
                      className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300"
                    >
                      {loc}
                      <button onClick={() => removeLocation(loc)}>
                        <X size={14} />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">
                    No preferred locations selected
                  </span>
                )}
              </div>

              <div className="relative">
                <select
                  className="w-full rounded-2xl border border-white/10 bg-white/3 p-3 text-slate-200 outline-none focus:border-cyan-500"
                  defaultValue=""
                  onChange={(e) => addLocation(e.target.value)}
                >
                  <option value="" disabled>
                    Select from the list
                  </option>
                  <option>Bengaluru</option>
                  <option>Chennai</option>
                  <option>Delhi / NCR</option>
                  <option>Hyderabad</option>
                  <option>Mumbai</option>
                  <option>Pune</option>
                  <option>Remote</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-end gap-4 border-t border-white/10 pt-6">
            <button
              className="px-5 py-2.5 text-sm font-medium text-slate-400 transition hover:text-white"
              onClick={() => closeModal("preference")}
            >
              Cancel
            </button>

            <button
              className="rounded-2xl bg-cyan-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500"
              onClick={handlePreferenceSave}
            >
              Save
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CareerPreferenceModal;