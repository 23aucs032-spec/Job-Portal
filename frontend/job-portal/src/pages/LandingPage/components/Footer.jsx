import { Briefcase } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Footer = () => {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative overflow-hidden text-gray-300 bg-[#020617]"
        >
            {/* Top Animated Line */}
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-0.5 bg-[linear-gradient(90deg,#38BDF8,#14B8A6)]"
            />

            <div className="relative z-10 px-5 py-10">
                <div className="max-w-6xl mx-auto">
                    <div className="space-y-8 text-center">
                        {/* Logo / Brand */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-center mb-6 space-x-2">
                                <motion.div
                                    whileHover={{ scale: 1.15, rotate: 6 }}
                                    className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg"
                                    style={{
                                        background: "linear-gradient(90deg, #38BDF8, #14B8A6)",
                                        boxShadow: "0 10px 15px rgba(0,0,0,0.4)"
                                    }}
                                >
                                    <Briefcase className="w-6 h-6 text-black" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white">
                                    JobPortal
                                </h3>
                            </div>

                            <p className="text-sm text-gray-400 max-w-md mx-auto">
                                Connecting Talented Professionals With Innovative Companies Worldwide. Your Career Success is Our Mission.
                            </p>
                        </div>

                        {/* Copyright */}
                        <div className="space-y-2">
                            <p className="text-sm text-gray-400">
                                {new Date().getFullYear()} Time To Program.
                            </p>
                            <p className="text-xs text-gray-500">
                                Made with ❤️ Happy Coding
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.footer>
    )
}

export default Footer;
