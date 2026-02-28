import React, { useEffect, useState } from "react";
import EducationFilterPopup from "./EducationFilterPopup";

const EducationFilter = ({ selected, setSelected }) => {
  const [educations, setEducations] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs/education-count")
      .then((res) => res.json())
      .then((data) => setEducations(data))
      .catch(() => setEducations([]));
  }, []);

  const toggleOption = (edu) => {
    if (selected.includes(edu)) {
      setSelected(selected.filter((item) => item !== edu));
    } else {
      setSelected([...selected, edu]);
    }
  };

  const firstFour = educations.slice(0, 4);

  return (
    <>
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Education</h3>

        <div className="space-y-2">
          {firstFour.map((edu) => (
            <label
              key={edu.name}
              className="flex justify-between items-center cursor-pointer text-sm"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(edu.name)}
                  onChange={() => toggleOption(edu.name)}
                />
                {edu.name}
              </div>
              <span className="text-gray-400">
                ({edu.count})
              </span>
            </label>
          ))}
        </div>

        {educations.length > 4 && (
          <button
            onClick={() => setShowPopup(true)}
            className="text-blue-500 text-sm mt-3"
          >
            View More
          </button>
        )}
      </div>

      {showPopup && (
        <EducationFilterPopup
          selected={selected}
          setSelected={setSelected}
          closePopup={() => setShowPopup(false)}
          educations={educations}
        />
      )}
    </>
  );
};

export default EducationFilter;