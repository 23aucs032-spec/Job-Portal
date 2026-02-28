import React, { useState } from "react";
import KmsFilterPopup from "./KmsPopupFilter";

const KmsFilter = ({ filters, setFilters }) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowPopup(true)}
        className="cursor-pointer border rounded-lg px-4 py-2 bg-black/70 text-gray-200 hover:bg-black/80 shadow-sm hover:shadow-md transition"
      >
        {filters.kms ? `Within ${filters.kms} km` : "Distance"}
      </div>

      {showPopup && (
        <KmsFilterPopup
          selected={filters.kms}
          setSelected={(value) =>
            setFilters((prev) => ({ ...prev, kms: value }))
          }
          closePopup={() => setShowPopup(false)}
        />
      )}
    </>
  );
};

export default KmsFilter;