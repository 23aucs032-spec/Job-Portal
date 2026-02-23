import React, { useEffect, useState } from "react";
import CompanyTypeFilterPopup from "./CompanyTypeFilterPopup";

const CompanyTypeFilter = ({ selected, setSelected }) => {
  const [companyTypes, setCompanyTypes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs/company-type-count")
      .then((res) => res.json())
      .then((data) => setCompanyTypes(data))
      .catch(() => setCompanyTypes([]));
  }, []);

  const toggleOption = (type) => {
    if (selected.includes(type)) {
      setSelected(selected.filter((item) => item !== type));
    } else {
      setSelected([...selected, type]);
    }
  };

  const firstFour = companyTypes.slice(0, 4);

  return (
    <>
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Company Type</h3>

        <div className="space-y-2">
          {firstFour.map((type) => (
            <label
              key={type.name}
              className="flex justify-between items-center cursor-pointer text-sm"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(type.name)}
                  onChange={() => toggleOption(type.name)}
                />
                {type.name}
              </div>
              <span className="text-gray-400">
                ({type.count})
              </span>
            </label>
          ))}
        </div>

        {companyTypes.length > 4 && (
          <button
            onClick={() => setShowPopup(true)}
            className="text-blue-500 text-sm mt-3"
          >
            View More
          </button>
        )}
      </div>

      {showPopup && (
        <CompanyTypeFilterPopup
          selected={selected}
          setSelected={setSelected}
          closePopup={() => setShowPopup(false)}
          companyTypes={companyTypes}
        />
      )}
    </>
  );
};

export default CompanyTypeFilter;