/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { X, Eye, Download, Trash2, UploadCloud } from "lucide-react";

const initialState = {
  degree: "",
  specialization: "",
  institute: "",
  instituteLocation: "",
  startYear: "",
  endYear: "",
  courseType: "",
  percentage: "",
  marksheet: null,

  school12Name: "",
  school12Location: "",
  school12StartYear: "",
  school12EndYear: "",
  school12Percentage: "",
  school12Marksheet: null,

  school10Name: "",
  school10Location: "",
  school10StartYear: "",
  school10EndYear: "",
  school10Percentage: "",
  school10Marksheet: null,
};

const EducationModal = ({
  modals,
  closeModal,
  modalVariants,
  educationList,
  setEducationList,
  editingEducationIndex,
  setEditingEducationIndex,
}) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (!modals.education) return;

    if (
      editingEducationIndex !== null &&
      educationList?.[editingEducationIndex]
    ) {
      setFormData({
        ...initialState,
        ...educationList[editingEducationIndex],
      });
    } else {
      setFormData(initialState);
    }
  }, [modals.education, editingEducationIndex, educationList]);

  useEffect(() => {
    if (modals.education) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modals.education]);

  if (!modals.education) return null;

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500";

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleDeleteFile = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  const handleSave = () => {
    const cleanedData = {
      ...formData,
      degree: formData.degree?.trim() || "",
      specialization: formData.specialization?.trim() || "",
      institute: formData.institute?.trim() || "",
      instituteLocation: formData.instituteLocation?.trim() || "",
      startYear: formData.startYear?.trim() || "",
      endYear: formData.endYear?.trim() || "",
      courseType: formData.courseType?.trim() || "",
      percentage: formData.percentage?.trim() || "",
      school12Name: formData.school12Name?.trim() || "",
      school12Location: formData.school12Location?.trim() || "",
      school12StartYear: formData.school12StartYear?.trim() || "",
      school12EndYear: formData.school12EndYear?.trim() || "",
      school12Percentage: formData.school12Percentage?.trim() || "",
      school10Name: formData.school10Name?.trim() || "",
      school10Location: formData.school10Location?.trim() || "",
      school10StartYear: formData.school10StartYear?.trim() || "",
      school10EndYear: formData.school10EndYear?.trim() || "",
      school10Percentage: formData.school10Percentage?.trim() || "",
    };

    if (!cleanedData.degree && !cleanedData.institute) {
      alert("Please enter at least Course Name or Institute Name");
      return;
    }

    if (editingEducationIndex !== null) {
      setEducationList((prev) =>
        prev.map((item, index) =>
          index === editingEducationIndex ? cleanedData : item
        )
      );
    } else {
      setEducationList((prev) => [...(prev || []), cleanedData]);
    }

    setFormData(initialState);
    setEditingEducationIndex(null);
    closeModal("education");
  };

  const handleDeleteCurrent = () => {
    if (editingEducationIndex === null) return;

    setEducationList((prev) =>
      prev.filter((_, index) => index !== editingEducationIndex)
    );

    setFormData(initialState);
    setEditingEducationIndex(null);
    closeModal("education");
  };

  const handleClose = () => {
    setFormData(initialState);
    setEditingEducationIndex(null);
    closeModal("education");
  };

  const renderFileSection = (label, fieldName) => {
    const file = formData[fieldName];

    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>

        <label className="flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-slate-300 transition hover:bg-white/10">
          <UploadCloud size={18} />
          <span className="text-sm">Upload file</span>
          <input
            type="file"
            name={fieldName}
            accept=".pdf,.doc,.docx,image/*"
            onChange={handleChange}
            className="hidden"
          />
        </label>

        {file && (
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="truncate pr-4 text-sm text-slate-300">
              {file.name || "Uploaded File"}
            </p>

            <div className="flex items-center gap-3">
              {file instanceof File && (
                <>
                  <button
                    type="button"
                    onClick={() => window.open(URL.createObjectURL(file))}
                    className="text-cyan-400 hover:text-cyan-300"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(file);
                      link.download = file.name;
                      link.click();
                    }}
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    <Download size={18} />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => handleDeleteFile(fieldName)}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const sectionCard =
    "rounded-3xl border border-white/10 bg-white/[0.02] p-6 space-y-4";

  return ReactDOM.createPortal(
    <motion.div className="fixed inset-0 z-200 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0f172a] p-8 shadow-2xl"
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="mb-6 text-2xl font-bold text-white">
          {editingEducationIndex !== null
            ? "Edit Education"
            : "Education Details"}
        </h2>

        <div className="space-y-8">
          <div className={sectionCard}>
            <h3 className="text-lg font-semibold text-cyan-400">
              College Details
            </h3>

            <input
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              placeholder="Course Name"
              className={inputClass}
            />
            <input
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Specialization"
              className={inputClass}
            />
            <input
              name="institute"
              value={formData.institute}
              onChange={handleChange}
              placeholder="Institute Name"
              className={inputClass}
            />
            <input
              name="instituteLocation"
              value={formData.instituteLocation}
              onChange={handleChange}
              placeholder="Institute Location"
              className={inputClass}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="startYear"
                value={formData.startYear}
                onChange={handleChange}
                placeholder="Start Year"
                className={inputClass}
              />
              <input
                name="endYear"
                value={formData.endYear}
                onChange={handleChange}
                placeholder="End Year"
                className={inputClass}
              />
            </div>

            <input
              name="courseType"
              value={formData.courseType}
              onChange={handleChange}
              placeholder="Course Type"
              className={inputClass}
            />

            <input
              name="percentage"
              value={formData.percentage}
              onChange={handleChange}
              placeholder="Mark Percentage"
              className={inputClass}
            />

            {renderFileSection("College Marksheet", "marksheet")}
          </div>

          <div className={sectionCard}>
            <h3 className="text-lg font-semibold text-cyan-400">
              12th Details
            </h3>

            <input
              name="school12Name"
              value={formData.school12Name}
              onChange={handleChange}
              placeholder="School Name"
              className={inputClass}
            />
            <input
              name="school12Location"
              value={formData.school12Location}
              onChange={handleChange}
              placeholder="School Location"
              className={inputClass}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="school12StartYear"
                value={formData.school12StartYear}
                onChange={handleChange}
                placeholder="Start Year"
                className={inputClass}
              />
              <input
                name="school12EndYear"
                value={formData.school12EndYear}
                onChange={handleChange}
                placeholder="End Year"
                className={inputClass}
              />
            </div>

            <input
              name="school12Percentage"
              value={formData.school12Percentage}
              onChange={handleChange}
              placeholder="Mark Percentage"
              className={inputClass}
            />

            {renderFileSection("12th Marksheet", "school12Marksheet")}
          </div>

          <div className={sectionCard}>
            <h3 className="text-lg font-semibold text-cyan-400">
              10th Details
            </h3>

            <input
              name="school10Name"
              value={formData.school10Name}
              onChange={handleChange}
              placeholder="School Name"
              className={inputClass}
            />
            <input
              name="school10Location"
              value={formData.school10Location}
              onChange={handleChange}
              placeholder="School Location"
              className={inputClass}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="school10StartYear"
                value={formData.school10StartYear}
                onChange={handleChange}
                placeholder="Start Year"
                className={inputClass}
              />
              <input
                name="school10EndYear"
                value={formData.school10EndYear}
                onChange={handleChange}
                placeholder="End Year"
                className={inputClass}
              />
            </div>

            <input
              name="school10Percentage"
              value={formData.school10Percentage}
              onChange={handleChange}
              placeholder="Mark Percentage"
              className={inputClass}
            />

            {renderFileSection("10th Marksheet", "school10Marksheet")}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-4 border-t border-white/10 pt-6">
          {editingEducationIndex !== null && (
            <button
              type="button"
              onClick={handleDeleteCurrent}
              className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Delete
            </button>
          )}

          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-2xl bg-cyan-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500"
          >
            {editingEducationIndex !== null ? "Update" : "Save"}
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
};

export default EducationModal;