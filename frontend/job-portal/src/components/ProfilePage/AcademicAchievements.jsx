/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";

const achievementOptions = [
  "College topper",
  "Department topper",
  "Top 3 in class",
  "Top 10 in class",
  "Gold medalist",
  "Received scholarship",
  "All rounder",
];

const AcademicAchievements = ({
  modals,
  closeModal,
  onSave,
  initialData = [],
}) => {
  const [selectedAchievements, setSelectedAchievements] = useState([]);
  const [otherAchievement, setOtherAchievement] = useState("");

  useEffect(() => {
    if (modals?.accomplishments) {
      const normalized = Array.isArray(initialData)
        ? initialData
            .map((item) => {
              if (typeof item === "string") {
                return {
                  title: item,
                  description: "",
                  year: "",
                };
              }

              return {
                title: item?.title || "",
                description: item?.description || "",
                year: item?.year || "",
              };
            })
            .filter((item) => item.title.trim() !== "")
        : [];

      setSelectedAchievements(normalized);
      setOtherAchievement("");
    }
  }, [modals?.accomplishments, initialData]);

  const isSelected = (achievement) => {
    return selectedAchievements.some((item) => item.title === achievement);
  };

  const toggleAchievement = (achievement) => {
    const alreadySelected = selectedAchievements.some(
      (item) => item.title === achievement
    );

    if (alreadySelected) {
      setSelectedAchievements((prev) =>
        prev.filter((item) => item.title !== achievement)
      );
    } else {
      setSelectedAchievements((prev) => [
        ...prev,
        {
          title: achievement,
          description: "",
          year: "",
        },
      ]);
    }
  };

  const handleRemove = (achievement) => {
    setSelectedAchievements((prev) =>
      prev.filter((item) => item.title !== achievement)
    );
  };

  const updateAchievementField = (title, field, value) => {
    setSelectedAchievements((prev) =>
      prev.map((item) =>
        item.title === title ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddOther = () => {
    const trimmed = otherAchievement.trim();
    if (!trimmed) return;

    const exists = selectedAchievements.some(
      (item) => item.title.trim().toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) {
      setOtherAchievement("");
      return;
    }

    setSelectedAchievements((prev) => [
      ...prev,
      {
        title: trimmed,
        description: "",
        year: "",
      },
    ]);

    setOtherAchievement("");
  };

  const handleSave = () => {
    const cleaned = selectedAchievements
      .filter((item) => item.title && item.title.trim() !== "")
      .map((item) => ({
        title: item.title.trim(),
        description: item.description?.trim() || "",
        year: item.year?.trim() || "",
      }));

    if (onSave) onSave(cleaned);
    closeModal("accomplishments");
  };

  return (
    <AnimatePresence>
      {modals?.accomplishments && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 30 }}
            transition={{ duration: 0.25 }}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0f172a] p-8 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => closeModal("accomplishments")}
              className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <X size={22} />
            </button>

            <h2 className="mb-2 text-2xl font-bold text-white">
              Academic Achievements
            </h2>

            <p className="mb-8 text-sm leading-relaxed text-slate-400">
              Add academic recognitions to highlight your strengths and stand out
              to recruiters.
            </p>

            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Selected achievements
              </label>

              <div className="flex min-h-17.5 flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                {selectedAchievements.length > 0 ? (
                  selectedAchievements.map((item) => (
                    <span
                      key={item.title}
                      className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300"
                    >
                      {item.title}
                      <button
                        type="button"
                        onClick={() => handleRemove(item.title)}
                        className="text-cyan-300 hover:text-red-400"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">
                    No achievements added yet
                  </span>
                )}
              </div>
            </div>

            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Add achievements
              </label>

              <div className="flex flex-wrap gap-3">
                {achievementOptions.map((achievement) => {
                  const active = isSelected(achievement);

                  return (
                    <button
                      key={achievement}
                      type="button"
                      onClick={() => toggleAchievement(achievement)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                        active
                          ? "border-cyan-500 bg-cyan-600 text-white"
                          : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {!active && <Plus size={14} />}
                      {achievement}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Add custom achievement
              </label>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={otherAchievement || ""}
                  onChange={(e) => setOtherAchievement(e.target.value)}
                  placeholder="Enter custom achievement"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={handleAddOther}
                  className="rounded-2xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500"
                >
                  Add
                </button>
              </div>
            </div>

            {selectedAchievements.length > 0 && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-white">
                  Achievement Details
                </h3>

                {selectedAchievements.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <p className="mb-4 text-base font-semibold text-cyan-300">
                      {item.title}
                    </p>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm text-slate-400">
                          Description
                        </label>
                        <textarea
                          value={item.description || ""}
                          onChange={(e) =>
                            updateAchievementField(
                              item.title,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Describe this achievement"
                          className="min-h-25 w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-slate-400">
                          Year
                        </label>
                        <input
                          type="text"
                          value={item.year || ""}
                          onChange={(e) =>
                            updateAchievementField(
                              item.title,
                              "year",
                              e.target.value
                            )
                          }
                          placeholder="e.g. 2025"
                          className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-10 flex items-center justify-end gap-4 border-t border-white/10 pt-6">
              <button
                type="button"
                className="px-5 py-2.5 text-sm font-medium text-slate-400 transition hover:text-white"
                onClick={() => closeModal("accomplishments")}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AcademicAchievements;