import React, { useEffect, useMemo, useState } from "react";
import WorkModeFilterPopup from "./WorkModeFilterPopup";

const API = "http://localhost:5000";

const getWorkModeName = (item) =>
  String(item?.name || item?.workMode || item?._id || "").trim();

const WorkModeFilter = ({ selected = [], setSelected }) => {
  const [workModes, setWorkModes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const safeSelected = Array.isArray(selected) ? selected : [];

  useEffect(() => {
    const fetchWorkModes = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/api/jobs/work-mode-count`);
        if (!res.ok) {
          throw new Error("Failed to fetch work mode counts");
        }

        const data = await res.json();

        const validWorkModes = Array.isArray(data)
          ? data.filter(
              (item) => getWorkModeName(item) && Number(item.count) > 0
            )
          : [];

        setWorkModes(validWorkModes);
      } catch (error) {
        console.error("Failed to fetch work modes:", error);
        setWorkModes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkModes();
  }, []);

  const firstFour = useMemo(() => workModes.slice(0, 4), [workModes]);
  const remainingWorkModes = useMemo(() => workModes.slice(4), [workModes]);

  const toggleOption = (modeName) => {
    if (!modeName) return;

    if (safeSelected.includes(modeName)) {
      setSelected(safeSelected.filter((item) => item !== modeName));
    } else {
      setSelected([...safeSelected, modeName]);
    }
  };

  return (
    <>
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-white">Work Mode</h3>

        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : firstFour.length === 0 ? (
          <p className="text-sm text-slate-500">No work modes found</p>
        ) : (
          <div className="space-y-2">
            {firstFour.map((item, index) => {
              const modeName = getWorkModeName(item);

              return (
                <label
                  key={item._id || modeName || index}
                  className="flex cursor-pointer items-center justify-between text-sm text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={safeSelected.includes(modeName)}
                      onChange={() => toggleOption(modeName)}
                      className="accent-cyan-500"
                    />
                    <span>{modeName}</span>
                  </div>

                  <span className="text-slate-400">({item.count || 0})</span>
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

        {remainingWorkModes.length > 0 && (
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
        <WorkModeFilterPopup
          selected={safeSelected}
          setSelected={setSelected}
          closePopup={() => setShowPopup(false)}
          workModes={remainingWorkModes}
        />
      )}
    </>
  );
};

export default WorkModeFilter;