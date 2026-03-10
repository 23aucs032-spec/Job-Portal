import React, { useEffect, useMemo, useState } from "react";
import RoleCategoryFilterPopup from "./RoleCategoryFilterPopup";

const API = "http://localhost:5000";

const getRoleName = (role) =>
  String(role?.name || role?.roleCategory || role?._id || "").trim();

const RoleCategoryFilter = ({ selected = [], setSelected }) => {
  const [roleCategories, setRoleCategories] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const safeSelected = Array.isArray(selected) ? selected : [];

  useEffect(() => {
    const fetchRoleCategories = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API}/api/jobs/role-category-count`);
        if (!res.ok) {
          throw new Error("Failed to fetch role categories");
        }

        const data = await res.json();

        const validRoles = Array.isArray(data)
          ? data.filter((item) => getRoleName(item) && Number(item.count) > 0)
          : [];

        setRoleCategories(validRoles);
      } catch (error) {
        console.error("Failed to fetch role categories:", error);
        setRoleCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleCategories();
  }, []);

  const firstFour = useMemo(() => roleCategories.slice(0, 4), [roleCategories]);
  const remainingRoles = useMemo(() => roleCategories.slice(4), [roleCategories]);

  const toggleOption = (roleName) => {
    if (!roleName) return;

    if (safeSelected.includes(roleName)) {
      setSelected(safeSelected.filter((item) => item !== roleName));
    } else {
      setSelected([...safeSelected, roleName]);
    }
  };

  return (
    <>
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-white">Role Category</h3>

        {loading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : firstFour.length === 0 ? (
          <p className="text-sm text-slate-500">No role categories found</p>
        ) : (
          <div className="space-y-2">
            {firstFour.map((role, index) => {
              const roleName = getRoleName(role);

              return (
                <label
                  key={role._id || roleName || index}
                  className="flex cursor-pointer items-center justify-between text-sm text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={safeSelected.includes(roleName)}
                      onChange={() => toggleOption(roleName)}
                      className="accent-cyan-500"
                    />
                    <span>{roleName}</span>
                  </div>

                  <span className="text-slate-400">({role.count || 0})</span>
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

        {remainingRoles.length > 0 && (
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
        <RoleCategoryFilterPopup
          selected={safeSelected}
          setSelected={setSelected}
          closePopup={() => setShowPopup(false)}
          roleCategories={remainingRoles}
        />
      )}
    </>
  );
};

export default RoleCategoryFilter;