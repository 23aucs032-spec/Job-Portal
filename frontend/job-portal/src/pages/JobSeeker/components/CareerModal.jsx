import React, { useState } from "react";

const CareerModal = ({ profile, setProfile, close }) => {
  const [location, setLocation] = useState(profile.preferredLocation);
  const [salary, setSalary] = useState(profile.expectedSalary);

  const save = () => {
    setProfile({
      ...profile,
      preferredLocation: location,
      expectedSalary: salary
    });
    close();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Career Preferences</h3>

        <input
          type="text"
          placeholder="Preferred Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="text"
          placeholder="Expected Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />

        <button onClick={save}>Save</button>
        <button onClick={close}>Cancel</button>
      </div>
    </div>
  );
};

export default CareerModal;