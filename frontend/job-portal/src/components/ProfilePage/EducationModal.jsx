/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { X, Eye, Download, Trash2 } from "lucide-react";

const EducationModal = ({
  modals,
  closeModal,
  modalVariants,
  educationList,
  setEducationList,
}) => {

  /* ================= INITIAL STATE ================= */
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

  const [formData, setFormData] = React.useState(initialState);
  const [editIndex, setEditIndex] = React.useState(null);

  if (!modals.education) return null;

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  /* ================= DELETE FILE ================= */
  const handleDeleteFile = (field) => {
    setFormData({
      ...formData,
      [field]: null,
    });
  };

  /* ================= SAVE ================= */
  const handleSave = () => {
    if (editIndex !== null) {
      const updatedList = [...educationList];
      updatedList[editIndex] = formData;
      setEducationList(updatedList);
    } else {
      setEducationList([...educationList, formData]);
    }

    setFormData(initialState);
    setEditIndex(null);
    closeModal("education");
  };

  /* ================= EDIT ================= */
  const handleEdit = (index) => {
    setFormData(educationList[index]);
    setEditIndex(index);
  };

  /* ================= DELETE ================= */
  const handleDelete = (index) => {
    const updatedList = educationList.filter((_, i) => i !== index);
    setEducationList(updatedList);
  };

  /* ================= FILE SECTION ================= */
  const renderFileSection = (label, fieldName) => {
    const file = formData[fieldName];

    return (
      <div className="space-y-2">
        <label className="text-gray-300 text-sm">{label}</label>

        <input
          type="file"
          name={fieldName}
          accept=".pdf,.doc,.docx,image/*"
          onChange={handleChange}
          className="w-full text-gray-300"
        />

        {file && (
          <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg flex justify-between items-center">
            <p className="text-sm text-gray-300 truncate">
              {file.name || "Uploaded File"}
            </p>

            <div className="flex gap-3">
              {file instanceof File && (
                <>
                  <button
                    type="button"
                    onClick={() => window.open(URL.createObjectURL(file))}
                    className="text-blue-400"
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
                    className="text-green-400"
                  >
                    <Download size={18} />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => handleDeleteFile(fieldName)}
                className="text-red-400"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-[#161b22] rounded-2xl w-full max-w-4xl border border-gray-700 relative shadow-2xl max-h-[90vh] overflow-y-auto p-8"
      >
        <button
          onClick={() => closeModal("education")}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">
          {editIndex !== null ? "Edit Education" : "Education Details"}
        </h2>

        <div className="space-y-10">

          {/* ================= COLLEGE ================= */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">
              College Details
            </h3>

            <input name="degree" value={formData.degree} onChange={handleChange} placeholder="Course Name" className="inputStyle" />
            <input name="specialization" value={formData.specialization} onChange={handleChange} placeholder="Specialization" className="inputStyle" />
            <input name="institute" value={formData.institute} onChange={handleChange} placeholder="Institute Name" className="inputStyle" />
            <input name="instituteLocation" value={formData.instituteLocation} onChange={handleChange} placeholder="Institute Location" className="inputStyle" />

            <div className="flex gap-4">
              <input name="startYear" value={formData.startYear} onChange={handleChange} placeholder="Start Year" className="inputStyle" />
              <input name="endYear" value={formData.endYear} onChange={handleChange} placeholder="End Year" className="inputStyle" />
            </div>

            <input name="percentage" value={formData.percentage} onChange={handleChange} placeholder="Mark Percentage" className="inputStyle" />

            {renderFileSection("College Marksheet", "marksheet")}
          </div>

          {/* ================= 12TH ================= */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">
              12th Details
            </h3>

            <input name="school12Name" value={formData.school12Name} onChange={handleChange} placeholder="School Name" className="inputStyle" />
            <input name="school12Location" value={formData.school12Location} onChange={handleChange} placeholder="School Location" className="inputStyle" />

            <div className="flex gap-4">
              <input name="school12StartYear" value={formData.school12StartYear} onChange={handleChange} placeholder="Start Year" className="inputStyle" />
              <input name="school12EndYear" value={formData.school12EndYear} onChange={handleChange} placeholder="End Year" className="inputStyle" />
            </div>

            <input name="school12Percentage" value={formData.school12Percentage} onChange={handleChange} placeholder="Mark Percentage" className="inputStyle" />

            {renderFileSection("12th Marksheet", "school12Marksheet")}
          </div>

          {/* ================= 10TH ================= */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">
              10th Details
            </h3>

            <input name="school10Name" value={formData.school10Name} onChange={handleChange} placeholder="School Name" className="inputStyle" />
            <input name="school10Location" value={formData.school10Location} onChange={handleChange} placeholder="School Location" className="inputStyle" />

            <div className="flex gap-4">
              <input name="school10StartYear" value={formData.school10StartYear} onChange={handleChange} placeholder="Start Year" className="inputStyle" />
              <input name="school10EndYear" value={formData.school10EndYear} onChange={handleChange} placeholder="End Year" className="inputStyle" />
            </div>

            <input name="school10Percentage" value={formData.school10Percentage} onChange={handleChange} placeholder="Mark Percentage" className="inputStyle" />

            {renderFileSection("10th Marksheet", "school10Marksheet")}
          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          {editIndex !== null && (
            <button
              onClick={() => handleDelete(editIndex)}
              className="bg-red-600 px-6 py-2 rounded-lg text-white"
            >
              Delete
            </button>
          )}

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
            {editIndex !== null ? "Update" : "Save"}
          </button>
        </div>
      </motion.div>

      <style>
        {`
          .inputStyle {
            width: 100%;
            background: #1f2937;
            border: 1px solid #4b5563;
            border-radius: 0.5rem;
            padding: 0.75rem;
            color: white;
          }
        `}
      </style>
    </motion.div>
  );
};

export default EducationModal;