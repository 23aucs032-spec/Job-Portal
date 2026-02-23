import React from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  User,
  Building,
  Monitor,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";

// eslint-disable-next-line no-unused-vars
const TopFilters = ({ filters, setFilters }) => {
  const buttonStyle =
    "flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100";

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-black border-b border-blue-900">

      {/* JOB TYPE */}
      <button className={buttonStyle}>
        <Briefcase size={16} />
        Jobs
      </button>

      {/* DISTANCE */}
      <button className={buttonStyle}>
        <MapPin size={16} />
        8 km
      </button>

      {/* DATE POSTED */}
      <button className={buttonStyle}>
        <Clock size={16} />
        Date posted
      </button>

      {/* EXPERIENCE */}
      <button className={buttonStyle}>
        <User size={16} />
        Experience level
      </button>

      {/* COMPANY */}
      <button className={buttonStyle}>
        <Building size={16} />
        Company
      </button>

      {/* REMOTE */}
      <button className={buttonStyle}>
        <Monitor size={16} />
        Remote
      </button>

      {/* ALL FILTERS */}
      <button className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50">
        <SlidersHorizontal size={16} />
        All filters
      </button>

      {/* RESET */}
      <button
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-black"
        onClick={() =>
          setFilters({
            experience: 0,
            workMode: [],
            department: [],
            location: [],
            salary: [],
            companyType: [],
            roleCategory: [],
            education: [],
            industry: [],
          })
        }
      >
        <RotateCcw size={16} />
        Reset
      </button>

    </div>
  );
};

export default TopFilters;
