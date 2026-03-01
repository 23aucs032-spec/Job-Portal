import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { X } from "lucide-react";

const EducationModal = ({
  modals,
  closeModal,
  modalVariants,
  courseName,
  setCourseName,
  otherCourse,
  setOtherCourse,
  specialization,
  setSpecialization,
  otherSpecialization,
  collegeName,
  setCollegeName,
  selectedGrading,
  selectedCourseType,
  setSelectedCourseType,
  startYear,
  setStartYear,
  endYear,
  setEndYear,
  educationList,
  setEducationList,
}) => {
  if (!modals.education) return null;

  const handleSave = () => {
    const newEducation = {
      course: courseName === "Other" ? otherCourse : courseName,
      specialization:
        specialization === "Other"
          ? otherSpecialization
          : specialization,
      college: collegeName,
      grading: selectedGrading,
      courseType: selectedCourseType,
      startYear,
      endYear,
    };

    setEducationList([...educationList, newEducation]);

    closeModal("education");
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
        className="bg-[#161b22] rounded-2xl w-full max-w-2xl p-8 border border-gray-700 relative shadow-2xl"
      >
        {/* Close */}
        <button
          onClick={() => closeModal("education")}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">
          Education
        </h2>

        <div className="space-y-6">

          {/* Course */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">
              Course name
            </label>
            <select
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3"
            >
              <option value="">Select course</option>
              <option>B.Tech/B.E.</option>
              <option>B.Sc</option>
              <option>B.Com</option>
              <option>Other</option>
            </select>

            {courseName === "Other" && (
              <input
                type="text"
                value={otherCourse}
                onChange={(e) => setOtherCourse(e.target.value)}
                placeholder="Specify other"
                className="w-full mt-3 bg-gray-800 border border-gray-600 rounded-lg p-3"
              />
            )}
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">
              Specialization
            </label>
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3"
            />
          </div>

          {/* College */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">
              College name
            </label>
            <input
              type="text"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3"
            />
          </div>

          {/* Duration */}
          <div className="flex gap-4">
            <select
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg p-3"
            >
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
            </select>

            <select
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg p-3"
            >
              <option>2026</option>
              <option>2025</option>
              <option>2024</option>
            </select>
          </div>

          {/* Course Type */}
          <div className="flex gap-3">
            {["Full Time", "Part Time", "Correspondence"].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setSelectedCourseType(type)}
                  className={`px-4 py-2 rounded-full text-sm border ${
                    selectedCourseType === type
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-gray-800 border-gray-600"
                  }`}
                >
                  {type}
                </button>
              )
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => closeModal("education")}
            className="text-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-blue-600 px-8 py-2 rounded-lg text-white"
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EducationModal;