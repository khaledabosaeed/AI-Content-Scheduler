// /lib/animations.ts
export const container = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1, 
    transition: { staggerChildren: 0.15 } 
  }
};

export const item = {
  hidden: { opacity: 0, y: 18 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5 } 
  }
};
