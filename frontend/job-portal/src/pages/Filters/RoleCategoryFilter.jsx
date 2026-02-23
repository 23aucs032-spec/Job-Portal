import React, { useEffect, useState } from "react";
import RoleCategoryFilterPopup from "./RoleCategoryFilterPopup";

const RoleCategoryFilter = ({ selected, setSelected }) => {
  const [roleCategories, setRoleCategories] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs/role-category-count")
      .then((res) => res.json())
      .then((data) => setRoleCategories(data))
      .catch(() => setRoleCategories([]));
  }, []);

  const toggleOption = (role) => {
    if (selected.includes(role)) {
      setSelected(selected.filter((item) => item !== role));
    } else {
      setSelected([...selected, role]);
    }
  };

  const firstFour = roleCategories.slice(0, 4);

  return (
    <>
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Role Category</h3>

        <div className="space-y-2">
          {firstFour.map((role, index) => {
  const roleName =
    role?.name || role?.roleCategory || role?._id || "";

  return (
    <label
      key={role._id || roleName || index}
      className="flex justify-between items-center cursor-pointer text-sm"
    >
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={selected.includes(roleName)}
          onChange={() => toggleOption(roleName)}
        />
        {roleName}
      </div>
      <span className="text-gray-400">
        ({role.count || 0})
      </span>
    </label>
  );
})}
        </div>

        {roleCategories.length > 4 && (
          <button
            onClick={() => setShowPopup(true)}
            className="text-blue-500 text-sm mt-3"
          >
            View More
          </button>
        )}
      </div>

      {showPopup && (
        <RoleCategoryFilterPopup
          selected={selected}
          setSelected={setSelected}
          closePopup={() => setShowPopup(false)}
          roleCategories={roleCategories}
        />
      )}
    </>
  );
};

export default RoleCategoryFilter;