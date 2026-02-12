// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

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

              {/* Skills */}
              <div className="flex items-center flex-1 gap-2 px-4 py-2 border-r border-[#1F2933]">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter skills / designations / companies"
                  className="w-full text-gray-200 bg-transparent outline-none placeholder-gray-500"
                />
              </div>

              {/* Experience */}
              <div className="flex items-center flex-1 gap-2 px-4 py-2 border-r border-[#04417e]">
                <select className="w-full text-gray-200 bg-transparent outline-none">
                  <option className="text-black">Select experience</option>
                  <option className="text-black">Fresher</option>
                  <option className="text-black">1-3 years</option>
                  <option className="text-black">3-5 years</option>
                  <option className="text-black">5+ years</option>
                </select>
              </div>

              {/* Location */}
              <div className="flex items-center flex-1 gap-2 px-4 py-2">
                <input
                  type="text"
                  placeholder="Enter location"
                  className="w-full text-gray-200 bg-transparent outline-none placeholder-gray-500"
                />
              </div>

              {/* Search Button */}
              <button
                className="px-8 py-3 font-semibold text-black transition rounded-full shadow-md hover:scale-105"
                style={{
                  background:
                    "linear-gradient(90deg, #38BDF8, #14B8A6)",
                }}
                onClick={() => navigate("/find-jobs")}
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
