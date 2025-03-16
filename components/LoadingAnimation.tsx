
import React from "react";
import { motion } from "framer-motion";

const pulse = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex w-full my-6 justify-start">
      <motion.div 
        className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-6 py-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="flex space-x-3 items-center"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        >
          <motion.div variants={pulse} animate="animate" className="h-3 w-3 rounded-full bg-primary" />
          <motion.div variants={pulse} animate="animate" className="h-3 w-3 rounded-full bg-primary" style={{ animationDelay: "0.2s" }} />
          <motion.div variants={pulse} animate="animate" className="h-3 w-3 rounded-full bg-primary" style={{ animationDelay: "0.4s" }} />
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-sm text-gray-500 dark:text-gray-400 ml-2"
          >
            Thinking...
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingAnimation;
