import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const DepartmentFilterPopup = ({
  selected,
  setSelected,
  closePopup
}) => {

  const [search, setSearch] = useState("");

  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);



  /* =====================================
     FETCH DEPARTMENT COUNT FROM BACKEND
  ===================================== */

  useEffect(() => {

    fetch("http://localhost:5000/api/jobs/department-count")

      .then(res => res.json())

      .then(data => {

        setDepartments(data);

        setLoading(false);

      })

      .catch(() => {

        setDepartments([]);

        setLoading(false);

      });

  }, []);




  /* =====================================
     SEARCH FILTER
  ===================================== */

  const filtered = departments.filter(dep =>

    dep.name
      .toLowerCase()
      .includes(search.toLowerCase())

  );




  /* =====================================
     TOGGLE SELECT
  ===================================== */

  const toggleDepartment = (depName) => {

    if (selected.includes(depName)) {

      setSelected(

        selected.filter(d => d !== depName)

      );

    }

    else {

      setSelected([

        ...selected,
        depName

      ]);

    }

  };



  return (

    <div className="fixed inset-0 bg-black/40 z-50">


      {/* ANIMATION */}

      <motion.div

        initial={{ x: -400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}

        exit={{ x: -400, opacity: 0 }}

        transition={{ duration: 0.3 }}

        className="absolute top-20 left-10 bg-black border border-gray-700 w-105 max-h-125 rounded-xl shadow-2xl p-4 text-white"

      >



        {/* HEADER */}

        <div className="flex justify-between items-center mb-3">


          <div>

            <h2 className="text-lg font-semibold">

              Department

            </h2>

            <p className="text-xs text-gray-400">

              {departments.length} Departments

            </p>

          </div>



          <button

            onClick={closePopup}

            className="text-gray-400 hover:text-white"

          >

            <X size={20} />

          </button>


        </div>




        {/* SEARCH */}

        <input

          type="text"

          placeholder="Search Department"

          className="bg-black border border-gray-600 p-2 w-full mb-3 rounded text-sm text-white outline-none focus:border-blue-500"

          value={search}

          onChange={(e) =>
            setSearch(e.target.value)
          }

        />




        {/* SELECTED COUNT */}

        {

          selected.length > 0 && (

            <p className="text-xs text-blue-400 mb-2">

              {selected.length} Selected

            </p>

          )

        }




        {/* LIST */}

        <div className="grid grid-cols-2 gap-2 max-h-75 overflow-y-auto text-sm">


          {

            loading

              ?

              <p className="text-gray-400">

                Loading...

              </p>


              :


              filtered.map(dep => (

                <label

                  key={dep.name}

                  className="flex items-center justify-between cursor-pointer hover:bg-gray-800 p-2 rounded"

                >


                  <div className="flex items-center gap-2">

                    <input

                      type="checkbox"

                      checked={

                        selected.includes(dep.name)

                      }

                      onChange={() =>

                        toggleDepartment(dep.name)

                      }

                      className="accent-blue-500"

                    />


                    {/* NAME */}

                    <span>

                      {dep.name}

                    </span>

                  </div>



                  {/* COUNT */}

                  <span className="text-gray-400 text-xs">

                    ({dep.count})

                  </span>



                </label>

              ))

          }


        </div>




        {/* BUTTONS */}

        <div className="flex justify-between items-center mt-4">


          <button

            onClick={() => setSelected([])}

            className="text-xs text-red-400 hover:text-red-300"

          >

            Clear All

          </button>



          <button

            onClick={closePopup}

            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-6 py-1.5 rounded"

          >

            Apply

          </button>


        </div>


      </motion.div>


    </div>

  );

};


export default DepartmentFilterPopup;