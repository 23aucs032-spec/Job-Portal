import React, { useEffect, useMemo, useState } from "react";
import IndustryFilterPopup from "./IndustryFilterPopup";

const API = "http://localhost:5000";

const getIndustryName = (industry) =>
  String(industry?.name || industry?.industry || industry?._id || "").trim();

const IndustryFilter = ({ selected = [], setSelected }) => {
  const [industries, setIndustries] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const safeSelected = Array.isArray(selected) ? selected : [];

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/api/jobs/industry-count`);
        if (!res.ok) {
          throw new Error("Failed to fetch industry counts");
        }

        const data = await res.json();

        const validIndustries = Array.isArray(data)
          ? data.filter(
              (item) => getIndustryName(item) && Number(item.count) > 0
            )
          : [];

        setIndustries(validIndustries);
      } catch (error) {
        console.error("Failed to fetch industries:", error);
        setIndustries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  const firstFour = useMemo(() => industries.slice(0, 4), [industries]);
  const remainingIndustries = useMemo(() => industries.slice(4), [industries]);

  const toggleOption = (industryName) => {
    if (!industryName || typeof setSelected !== "function") return;

    if (safeSelected.includes(industryName)) {
      setSelected(safeSelected.filter((item) => item !== industryName));
    } else {
      setSelected([...safeSelected, industryName]);
    }
  };

  return (
    <>
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-white">Industry</h3>

        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : firstFour.length === 0 ? (
          <p className="text-sm text-slate-500">No industries found</p>
        ) : (
          <div className="space-y-2">
            {firstFour.map((industry, index) => {
              const industryName = getIndustryName(industry);

              return (
                <label
                  key={industry._id || industryName || index}
                  className="flex cursor-pointer items-center justify-between text-sm text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={safeSelected.includes(industryName)}
                      onChange={() => toggleOption(industryName)}
                      className="accent-cyan-500"
                    />
                    <span>{industryName}</span>
                  </div>

                  <span className="text-slate-400">
                    ({industry.count || 0})
                  </span>
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

        {remainingIndustries.length > 0 && (
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
        <IndustryFilterPopup
          selected={safeSelected}
          setSelected={setSelected}
          closePopup={() => setShowPopup(false)}
          industries={remainingIndustries}
        />
      )}
    </>
  );
};

export default IndustryFilter;