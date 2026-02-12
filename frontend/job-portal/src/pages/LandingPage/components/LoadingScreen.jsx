// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect } from "react";
import Logo from "../../images/Job-portal.png";

const LoadingScreen = ({ onFinish }) => {

  useEffect(() => {
    const hasSeenLoader = sessionStorage.getItem("hasSeenLoader");

    if (hasSeenLoader) {
      onFinish();
      return;
    }

    const timer = setTimeout(() => {
      sessionStorage.setItem("hasSeenLoader", "true");
      onFinish();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]">
      <motion.img
        src={Logo}
        alt="Loading Logo"
        className="w-[60%] md:w-[40%]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
      />
    </div>
  );
};

export default LoadingScreen;
