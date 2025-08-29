import React from 'react';
import { motion } from 'framer-motion';

const shapes = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  animationDuration: `${Math.random() * 5 + 5}s`,
  animationDelay: `${Math.random() * 5}s`,
  size: `${Math.random() * 80 + 20}px`,
}));

export const BackgroundAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background">
      <ul className="absolute inset-0 m-0 p-0">
        {shapes.map((shape) => (
          <motion.li
            key={shape.id}
            className="absolute block list-none w-20 h-20 bg-primary/10 rounded-full bottom-[-150px]"
            style={{
              left: shape.left,
              width: shape.size,
              height: shape.size,
            }}
            animate={{
              y: '-100vh',
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: parseFloat(shape.animationDuration),
              delay: parseFloat(shape.animationDelay),
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </ul>
    </div>
  );
};
