import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { filterData } from "./filterData";

const FilterSidebar = () => {
  const [experience, setExperience] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState({});

  const toggleFilter = (category, value) => {
    setSelectedFilters((prev) => {
      const current = prev[category] || [];
      if (current.includes(value)) {
        return {
          ...prev,
          [category]: current.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [category]: [...current, value],
        };
      }
    });
  };

  const renderCheckboxGroup = (title, category, options) => (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">{title}</h3>
      {options.map((option) => (
        <label key={option} className="flex gap-2 text-sm mb-1">
          <input
            type="checkbox"
            onChange={() => toggleFilter(category, option)}
            checked={selectedFilters[category]?.includes(option) || false}
          />
          {option}
        </label>
      ))}
    </div>
  );

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 bg-white p-6 rounded-xl shadow h-fit overflow-y-auto"
    >
      <h2 className="text-lg font-bold mb-4">All Filters</h2>

      {/* Posted By */}
      {renderCheckboxGroup(
        "Posted By",
        "postedBy",
        filterData.postedBy
      )}

      {/* Experience Slider */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">
          Experience ({experience} Yrs)
        </h3>
        <input
          type="range"
          min={filterData.experience.min}
          max={filterData.experience.max}
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Work Mode */}
      {renderCheckboxGroup(
        "Work Mode",
        "workMode",
        filterData.workMode
      )}

      {/* Department */}
      {renderCheckboxGroup(
        "Department",
        "department",
        filterData.department
      )}

      {/* Location */}
      {renderCheckboxGroup(
        "Location",
        "location",
        filterData.location
      )}

      {/* Salary */}
      {renderCheckboxGroup(
        "Salary",
        "salary",
        filterData.salary
      )}

      {/* Company Type */}
      {renderCheckboxGroup(
        "Company Type",
        "companyType",
        filterData.companyType
      )}

      {/* Role Category */}
      {renderCheckboxGroup(
        "Role Category",
        "roleCategory",
        filterData.roleCategory
      )}

      {/* Education */}
      {renderCheckboxGroup(
        "Education",
        "education",
        filterData.education
      )}

      {/* Industry */}
      {renderCheckboxGroup(
        "Industry",
        "industry",
        filterData.industry
      )}

      {/* Top Companies */}
      {renderCheckboxGroup(
        "Top Companies",
        "topCompanies",
        filterData.topCompanies
      )}
    </motion.aside>
  );
};

export default FilterSidebar;
