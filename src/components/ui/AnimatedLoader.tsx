import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedLoader: React.FC = () => {
  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const circleVariants = {
    start: {
      y: '0%',
    },
    end: {
      y: '100%',
    },
  };

  const transition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: 'easeInOut',
  };

  return (
    <div className="fixed inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center z-[100]">
      <div className="flex flex-col items-center gap-6">
        <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center font-bold text-primary-foreground text-4xl shadow-glow-primary">
          LTP
        </div>
        <motion.div
          className="w-24 h-8 flex justify-around"
          variants={containerVariants}
          initial="start"
          animate="end"
        >
          <motion.span className="block w-4 h-4 bg-primary/80 rounded-full" variants={circleVariants} transition={transition} />
          <motion.span className="block w-4 h-4 bg-primary/80 rounded-full" variants={circleVariants} transition={transition} />
          <motion.span className="block w-4 h-4 bg-primary/80 rounded-full" variants={circleVariants} transition={transition} />
        </motion.div>
      </div>
    </div>
  );
};
