
import React from "react";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-800"
    >
      <p>
        Created By <span className="font-medium">@rlzyy</span>
      </p>
    </motion.footer>
  );
};

export default Footer;
