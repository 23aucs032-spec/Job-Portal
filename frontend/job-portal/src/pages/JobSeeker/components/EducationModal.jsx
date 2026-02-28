import React, { useState } from "react";

const EducationModal = ({ profile, setProfile, close }) => {
  const [degree, setDegree] = useState("");
  const [college, setCollege] = useState("");

  const addEducation = () => {
    const newEdu = { degree, college };
    setProfile({
      ...profile,
      education: [...profile.education, newEdu]
    });
    close();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add Education</h3>

        <input
          type="text"
          placeholder="Degree"
          onChange={(e) => setDegree(e.target.value)}
        />

        <input
          type="text"
          placeholder="College"
          onChange={(e) => setCollege(e.target.value)}
        />

        <button onClick={addEducation}>Add</button>
        <button onClick={close}>Cancel</button>
      </div>
    </div>
  );
};

export default EducationModal;