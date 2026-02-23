import React, { useState } from "react";

// ✅ correct path
import departments from "./components/departmentData";

import DepartmentFilterPopup from "./DepartmentFilterPopup";


const DepartmentFilter = ({ filters, setFilters }) => {

  const [showPopup, setShowPopup] = useState(false);


  // ✅ prevent undefined error
  const selectedDepartments = filters.department || [];


  // ✅ show only first 4
  const topDepartments = departments.slice(0, 4);



  // ✅ toggle department
  const toggleDepartment = (dept) => {

    let updated = [];

    if (selectedDepartments.includes(dept)) {

      updated = selectedDepartments.filter(
        d => d !== dept
      );

    } else {

      updated = [
        ...selectedDepartments,
        dept
      ];

    }

    setFilters({
      ...filters,
      department: updated
    });

  };



  return (

    <div>

      <h3 className="text-sm font-semibold mb-2">

        Department

      </h3>



      {/* TOP 4 DEPARTMENTS */}

      {

        topDepartments.map(dept => (

          <label key={dept} className="block cursor-pointer">

            <input

              type="checkbox"

              checked={selectedDepartments.includes(dept)}

              onChange={() =>
                toggleDepartment(dept)
              }

              className="mr-2"

            />

            {dept}

          </label>

        ))

      }



      {/* VIEW ALL BUTTON */}

      <button

        onClick={() =>
          setShowPopup(true)
        }

        className="text-blue-500 text-sm mt-2"

      >

        View All Departments

      </button>



      {/* POPUP */}

      {

        showPopup && (

          <DepartmentFilterPopup

            selected={selectedDepartments}

            setSelected={(data) =>

              setFilters({
                ...filters,
                department: data
              })

            }

            closePopup={() =>
              setShowPopup(false)
            }

          />

        )

      }



    </div>

  );

};



export default DepartmentFilter;