import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { employerFeatures, jobSeekerFeatures } from "../../utils/data";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Features = () => {
  return (
    <section className="relative py-20 overflow-hidden bg-[#020617]">
      <div className="container relative z-10 px-12 py-12 mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Everything you need to
            <span className="block text-transparent bg-clip-text bg-[linear-gradient(90deg,#38BDF8,#14B8A6)]">
              Succeed
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-400">
            Whether you are looking for your next opportunity or the perfect
            candidate we have the tools and features to make it happen.
          </p>
        </motion.div>

        <div className="grid gap-16 md:grid-cols-2 lg:gap-24">
          {/* Job Seekers */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-12 text-center">
              <h3 className="mb-4 text-3xl font-bold text-white">
                For Job Seekers
              </h3>
              <div className="w-24 h-1 mx-auto rounded-full bg-[linear-gradient(90deg, #F97316, #EF4444)]" />
            </motion.div>

            <motion.div variants={containerVariants} className="space-y-8">
              {jobSeekerFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start p-10 space-x-4 transition-all duration-300 cursor-pointer group rounded-2xl bg-[#0F172A] hover:bg-[#1E293B]"
                >
                  <div className="flex items-center justify-center w-12 h-12 transition-colors bg-[#1E293B] flex-0 rounded-xl group-hover:bg-[#21b4f4]">
                    <feature.icon className="w-6 h-6 text-[#05aaf0] group-hover:text-black" />
                  </div>
                  <div>
                    <h4 className="mb-2 text-xl font-semibold text-white">
                      {feature.title}
                    </h4>
                    <p className="leading-relaxed text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Employers */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mb-12 text-center">
              <h3 className="mb-4 text-3xl font-bold text-white">
                For Employers
              </h3>
              <div
                className="w-24 h-1 mx-auto rounded-full"
                style={{
                  background: "linear-gradient(90deg, #F97316, #EF4444)",
                }}
              />
            </motion.div>

            <motion.div variants={containerVariants} className="space-y-8">
              {employerFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-start p-10 space-x-4 transition-all duration-300 cursor-pointer group rounded-2xl bg-[#0F172A] hover:bg-[#2A1A1A]"
                >
                  <div className="flex items-center justify-center w-12 h-12 transition-colors bg-[#2A1A1A] flex-0 rounded-xl group-hover:bg-[#F97316]">
                    <feature.icon className="w-6 h-6 text-[#F97316] group-hover:text-black" />
                  </div>
                  <div>
                    <h4 className="mb-2 text-xl font-semibold text-white">
                      {feature.title}
                    </h4>
                    <p className="leading-relaxed text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
