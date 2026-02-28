import React, { useEffect, useState } from "react";
import IndustryFilterPopup from "./IndustryFilterPopup";

const IndustryFilter = ({
  selected = [],
  setSelected,
}) => {

  const [industries, setIndustries] = useState([]);

  const [showPopup, setShowPopup] = useState(false);


  useEffect(() => {

    fetch("http://localhost:5000/api/jobs/industry-count")
      .then((res) => res.json())
      .then((data) => setIndustries(data))
      .catch(() => setIndustries([]));

  }, []);



  const toggleOption = (industry) => {

    if (selected.includes(industry)) {

      setSelected(
        selected.filter((item) => item !== industry)
      );

    } else {

      setSelected([...selected, industry]);

    }

  };


  // FIRST 4 ONLY

  const firstFour = industries.slice(0, 4);



  return (

    <>

      <div className="mt-6">

        {/* TITLE */}

        <h3 className="font-semibold mb-3 text-white">

          Industry

        </h3>


        {/* FIRST 4 */}

        <div className="space-y-2">

          {firstFour.map((industry) => (

            <label
              key={industry.name}
              className="flex justify-between items-center cursor-pointer text-sm text-white"
            >

              <div className="flex items-center gap-2">

                <input
                  type="checkbox"
                  checked={selected.includes(industry.name)}
                  onChange={() =>
                    toggleOption(industry.name)
                  }
                />

                {industry.name}

              </div>

              <span className="text-gray-400">

                ({industry.count})

              </span>

            </label>

          ))}

        </div>



        {/* VIEW MORE */}

        {industries.length > 4 && (

          <button
            onClick={() => setShowPopup(true)}
            className="text-blue-500 text-sm mt-3"
          >

            View More

          </button>

        )}

      </div>



      {/* POPUP */}

      {showPopup && (

        <IndustryFilterPopup
          selected={selected}
          setSelected={setSelected}
          closePopup={() => setShowPopup(false)}
          industries={industries}
        />

      )}

    </>

  );

};

export default IndustryFilter;