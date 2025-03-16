
import React from "react";
import { motion } from "framer-motion";

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex w-full my-6 justify-start">
      <motion.div 
        className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-6 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex space-x-2 items-center">
          <motion.div
            className="h-3 w-3 rounded-full bg-primary"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.2,
              times: [0, 0.5, 1],
              delay: 0
            }}
          />
          <motion.div
            className="h-3 w-3 rounded-full bg-primary"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.2,
              times: [0, 0.5, 1],
              delay: 0.2
            }}
          />
          <motion.div
            className="h-3 w-3 rounded-full bg-primary"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.2,
              times: [0, 0.5, 1],
              delay: 0.4
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingAnimation;
