import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

export default function PageWrapper({ children, className = '', style = {} }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
      // Merge caller's style with base width: 100%
      // Previously `style` prop was silently ignored — maxWidth/margin were lost
      style={{ width: '100%', ...style }}
    >
      {children}
    </motion.div>
  );
}
