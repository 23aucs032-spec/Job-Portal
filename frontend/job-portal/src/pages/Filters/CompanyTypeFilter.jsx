import React, { useEffect, useMemo, useState } from "react";
import CompanyTypeFilterPopup from "./CompanyTypeFilterPopup";

const API = "http://localhost:5000";

const CompanyTypeFilter = ({ selected = [], setSelected }) => {
  const [companyTypes, setCompanyTypes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const safeSelected = Array.isArray(selected) ? selected : [];

  useEffect(() => {
    const fetchCompanyTypes = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/api/jobs/company-type-count`);
        if (!res.ok) {
          throw new Error("Failed to fetch company types");
        }

        const data = await res.json();

        // only posted-job company types
        const validCompanyTypes = Array.isArray(data)
          ? data.filter((item) => item?.name && Number(item.count) > 0)
          : [];

        setCompanyTypes(validCompanyTypes);
      } catch (error) {
        console.error("Failed to fetch company types:", error);
        setCompanyTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyTypes();
  }, []);

  const firstFour = useMemo(() => companyTypes.slice(0, 4), [companyTypes]);
  const remainingCompanyTypes = useMemo(
    () => companyTypes.slice(4),
    [companyTypes]
  );

  const toggleOption = (typeName) => {
    if (safeSelected.includes(typeName)) {
      setSelected(safeSelected.filter((item) => item !== typeName));
    } else {
      setSelected([...safeSelected, typeName]);
    }
  };

  return (
    <>
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-white">Company Type</h3>

        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : firstFour.length === 0 ? (
          <p className="text-sm text-slate-500">No company types found</p>
        ) : (
          <div className="space-y-2">
            {firstFour.map((type) => (
              <label
                key={type.name}
                className="flex cursor-pointer items-center justify-between text-sm text-slate-300"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={safeSelected.includes(type.name)}
                    onChange={() => toggleOption(type.name)}
                    className="accent-cyan-500"
                  />
                  <span>{type.name}</span>
                </div>

                <span className="text-slate-400">({type.count || 0})</span>
              </label>
            ))}
          </div>
        )}

        {safeSelected.length > 0 && (
          <p className="mt-2 text-xs text-cyan-400">
            {safeSelected.length} selected
          </p>
        )}

        {remainingCompanyTypes.length > 0 && (
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
        <CompanyTypeFilterPopup
          selected={safeSelected}
          setSelected={setSelected}
          closePopup={() => setShowPopup(false)}
          companyTypes={remainingCompanyTypes}
        />
      )}
    </>
  );
};

export default CompanyTypeFilter;