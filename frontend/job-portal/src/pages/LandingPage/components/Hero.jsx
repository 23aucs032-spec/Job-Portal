/* eslint-disable react-hooks/set-state-in-effect */
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Hero = () => {
  const navigate = useNavigate();

  // 🔎 Skills / Companies
  const [skillQuery, setSkillQuery] = useState("");
  const [skillSuggestions, setSkillSuggestions] = useState([]);

  // 📍 Location
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  // 💼 Experience
  const [experience, setExperience] = useState("");

  // 🔎 Fetch skills + companies suggestions
  useEffect(() => {
    if (skillQuery.length < 2) {
      setSkillSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {

        const [skillsRes, companyRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/search/suggest?q=${skillQuery}&type=skills`
          ),
          axios.get(
            `http://localhost:5000/api/search/suggest?q=${skillQuery}&type=companies`
          ),
        ]);

        const merged = [
          ...skillsRes.data,
          ...companyRes.data
        ];

        const unique = [...new Set(merged)];

        setSkillSuggestions(unique);

      } catch (error) {
        console.log(error);
      }
    };

    fetchSuggestions();
  }, [skillQuery]);

  // 📍 Fetch locations
  useEffect(() => {
    if (locationQuery.length < 2) {
      setLocationSuggestions([]);
      return;
    }

    const fetchLocations = async () => {
      try {

        const res = await axios.get(
          `http://localhost:5000/api/search/suggest?q=${locationQuery}&type=location`
        );

        setLocationSuggestions(res.data);

      } catch (error) {
        console.log(error);
      }
    };

    fetchLocations();
  }, [locationQuery]);

  return (
    <section className="flex items-center min-h-screen pt-24 pb-16 bg-[#020617] relative overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pt-10 mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
          >
            Find Your Dream Job or
            <span
              className="block mt-2 text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #38BDF8, #14B8A6)",
              }}
            >
              Perfect Hire
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="max-w-2xl mx-auto mb-10 text-xl leading-relaxed text-gray-400"
          >
            Connect talented professionals with innovative companies.
            Your next career move or perfect candidate is just one click away.
          </motion.p>

          {/* SEARCH BAR */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative max-w-4xl mx-auto mb-12"
          >
            <div className="flex flex-wrap items-center gap-2 p-3 bg-[#020617] border border-[#1F2933] rounded-full shadow-2xl md:flex-nowrap">

              {/* Skills / Companies */}
              <div className="relative flex items-center flex-1 gap-2 px-4 py-2 border-r border-[#1F2933]">
                <Search className="w-5 h-5 text-gray-400" />

                <input
                  type="text"
                  placeholder="Enter skills / designations / companies"
                  value={skillQuery}
                  onChange={(e) => setSkillQuery(e.target.value)}
                  className="w-full text-gray-200 bg-transparent outline-none placeholder-gray-500"
                />

                {skillSuggestions.length > 0 && (
                  <div className="absolute left-0 top-full mt-2 z-50 w-full bg-[#020617] border border-[#1F2933] rounded-lg shadow-xl max-h-60 overflow-y-auto">

                    {skillSuggestions.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSkillQuery(item);
                          setSkillSuggestions([]);
                        }}
                        className="px-4 py-2 text-gray-200 text-left cursor-pointer hover:bg-[#1F2933]"
                      >
                        {item}
                      </div>
                    ))}

                  </div>
                )}
              </div>

              {/* Experience */}
<div className="flex items-center flex-1 gap-2 px-4 py-2 border-r border-[#04417e]">
  <select
    value={experience}
    onChange={(e) => setExperience(e.target.value)}
    className="w-full text-gray-200 bg-transparent outline-none"
  >

    {/* Placeholder */}
    <option value="" disabled hidden className="text-black">
      Select experience
    </option>

    <option value="0" className="bg-black text-white">
      Fresher (less than 1 Year)
    </option>
    <option value="1" className="bg-black text-white">1 year</option>
    <option value="2" className="bg-black text-white">2 years</option>
    <option value="3" className="bg-black text-white">3 years</option>
    <option value="4" className="bg-black text-white">4 years</option>
    <option value="5" className="bg-black text-white">5 years</option>
    <option value="6" className="bg-black text-white">6 years</option>
    <option value="7" className="bg-black text-white">7 years</option>
    <option value="8" className="bg-black text-white">8 years</option>
    <option value="9" className="bg-black text-white">9 years</option>
    <option value="10" className="bg-black text-white">10 years</option>
    <option value="11" className="bg-black text-white">11 years</option>
    <option value="12" className="bg-black text-white">12 years</option>
    <option value="13" className="bg-black text-white">13 years</option>
    <option value="14" className="bg-black text-white">14 years</option>
    <option value="15" className="bg-black text-white">15 years</option>
    <option value="16" className="bg-black text-white">16 years</option>
    <option value="17" className="bg-black text-white">17 years</option>
    <option value="18" className="bg-black text-white">18 years</option>
    <option value="19" className="bg-black text-white">19 years</option>
    <option value="20" className="bg-black text-white">20 years</option>
    <option value="21" className="bg-black text-white">21 years</option>
    <option value="22" className="bg-black text-white">22 years</option>
    <option value="23" className="bg-black text-white">23 years</option>
    <option value="24" className="bg-black text-white">24 years</option>
    <option value="25" className="bg-black text-white">25 years</option>
    <option value="26" className="bg-black text-white">26 years</option>
    <option value="27" className="bg-black text-white">27 years</option>
    <option value="28" className="bg-black text-white">28 years</option>
    <option value="29" className="bg-black text-white">29 years</option>
    <option value="30" className="bg-black text-white">30 years</option>

  </select>
</div>

              {/* Location */}
              <div className="relative flex items-center flex-1 gap-2 px-4 py-2">
                <input
                  type="text"
                  placeholder="Enter location"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full text-gray-200 bg-transparent outline-none placeholder-gray-500"
                />

                {locationSuggestions.length > 0 && (
                  <div className="absolute left-0 top-full mt-2 z-50 w-full bg-[#020617] border border-[#1F2933] rounded-lg shadow-xl max-h-60 overflow-y-auto">

                    {locationSuggestions.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setLocationQuery(item);
                          setLocationSuggestions([]);
                        }}
                        className="px-4 py-2 text-gray-200 text-left cursor-pointer hover:bg-[#1F2933]"
                      >
                        {item}
                      </div>
                    ))}

                  </div>
                )}
              </div>

              {/* Search Button */}
              <button
  className="px-8 py-3 font-semibold text-black transition rounded-full shadow-md hover:scale-105"
  style={{
    background: "linear-gradient(90deg, #38BDF8, #14B8A6)",
  }}
  onClick={() =>
    navigate(
      `/find-jobs?keyword=${skillQuery}&location=${locationQuery}&experience=${experience}`
    )
  }
>
  Search
</button>

            </div>
          </motion.div>

        </div>
      </div>

      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-32 h-32 bg-[#38BDF8] rounded-full top-20 left-10 blur-3xl opacity-20" />
        <div className="absolute w-40 h-40 bg-[#14B8A6] rounded-full bottom-20 right-10 blur-3xl opacity-20" />
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 w-96 h-96 blur-3xl opacity-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(56,189,248,0.2), rgba(20,184,166,0.2))",
          }}
        />
      </div>
    </section>
  );
};

export default Hero;