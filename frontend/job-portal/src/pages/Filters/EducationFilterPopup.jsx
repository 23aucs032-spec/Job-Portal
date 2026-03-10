import React, { useEffect, useMemo, useState } from "react";
import EducationFilterPopup from "./EducationFilterPopup";

const API = "http://localhost:5000";

const getEducationName = (edu) =>
  String(edu?.name || edu?.education || edu?._id || "").trim();

const EducationFilter = ({ selected = [], setSelected }) => {
  const [educations, setEducations] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const safeSelected = Array.isArray(selected) ? selected : [];

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/api/jobs/education-count`);
        if (!res.ok) {
          throw new Error("Failed to fetch education counts");
        }

        const data = await res.json();

        const validEducations = Array.isArray(data)
          ? data.filter(
              (item) => getEducationName(item) && Number(item.count) > 0
            )
          : [];

        setEducations(validEducations);
      } catch (error) {
        console.error("Failed to fetch educations:", error);
        setEducations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEducations();
  }, []);

  const firstFour = useMemo(() => educations.slice(0, 4), [educations]);
  const remainingEducations = useMemo(() => educations.slice(4), [educations]);

  const toggleOption = (eduName) => {
    if (!eduName) return;

    if (safeSelected.includes(eduName)) {
      setSelected(safeSelected.filter((item) => item !== eduName));
    } else {
      setSelected([...safeSelected, eduName]);
    }
  };

  return (
    <>
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-white">Education</h3>

        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : firstFour.length === 0 ? (
          <p className="text-sm text-slate-500">No education values found</p>
        ) : (
          <div className="space-y-2">
            {firstFour.map((edu, index) => {
              const eduName = getEducationName(edu);

              return (
                <label
                  key={edu._id || eduName || index}
                  className="flex cursor-pointer items-center justify-between text-sm text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={safeSelected.includes(eduName)}
                      onChange={() => toggleOption(eduName)}
                      className="accent-cyan-500"
                    />
                    <span>{eduName}</span>
                  </div>

                  <span className="text-slate-400">({edu.count || 0})</span>
                </label>
              );
            })}
          </div>
        )}

        {safeSelected.length > 0 && (
          <p className="mt-2 text-xs text-cyan-400">
            {safeSelected.length} selected
          </p>
        )}

        {remainingEducations.length > 0 && (
          <button
            type="button"
            onClick={() => setShowPopup(true)}
            className="mt-3 text-sm font-medium text-cyan-400 hover:text-cyan-300"
          >
            View More
          </button>
        )}
      </div>

      {showPopup && (
        <EducationFilterPopup
          selected={safeSelected}
          setSelected={setSelected}
          closePopup={() => setShowPopup(false)}
          educations={remainingEducations}
        />
      )}
    </>
  );
};

export default EducationFilter;