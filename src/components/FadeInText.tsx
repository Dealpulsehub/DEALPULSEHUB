// src/components/FadeInText.tsx

import { motion } from "framer-motion";
import { colors, typography } from "../tokens/tokens";

interface FadeInTextProps {
  text: string;
  delay?: number;
  duration?: number;
  size?: "sm" | "md" | "lg" | "xl";
}

export const FadeInText: React.FC<FadeInTextProps> = ({
  text,
  delay = 0,
  duration = 0.5,
  size = "md",
}) => {
  const sizeMap = {
    sm: "16px",
    md: "20px",
    lg: "28px",
    xl: "36px",
  };

  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        fontSize: sizeMap[size],
        color: colors.neutral[900],
        fontWeight: typography.fontWeight.semibold,
      }}
    >
      {words.map((word, idx) => (
        <motion.span key={idx} variants={wordVariants}>
          {word}{" "}
        </motion.span>
      ))}
    </motion.div>
  );
};
