// src/components/AnimatedHero.tsx

import { motion, type Variants } from "framer-motion";
import { colors, spacing, borderRadius } from "../tokens/tokens";

interface AnimatedHeroProps {
  title: string;
  subtitle: string;
  image?: string;
  cta?: {
    text: string;
    onClick: () => void;
  };
}

export const AnimatedHero: React.FC<AnimatedHeroProps> = ({
  title,
  subtitle,
  image,
  cta,
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        background: `linear-gradient(135deg, ${colors.primary[50]} 0%, #f0f4ff 100%)`,
        padding: spacing['2xl'],
        borderRadius: borderRadius.lg,
        textAlign: "center",
      }}
    >
      <motion.h1
        variants={itemVariants}
        style={{
          fontSize: "48px",
          fontWeight: "bold",
          color: colors.primary[900],
          marginBottom: spacing.md,
        }}
      >
        {title}
      </motion.h1>

      <motion.p
        variants={itemVariants}
        style={{
          fontSize: "20px",
          color: colors.neutral[700],
          marginBottom: spacing.lg,
        }}
      >
        {subtitle}
      </motion.p>

      {image && (
        <motion.img
          variants={itemVariants}
          src={image}
          alt={title}
          style={{
            maxWidth: "100%",
            maxHeight: "400px",
            borderRadius: borderRadius.lg,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        />
      )}

      {cta && (
        <motion.button
          variants={itemVariants}
          onClick={cta.onClick}
          style={{
            marginTop: spacing.lg,
            padding: `${spacing.md} ${spacing.lg}`,
            backgroundColor: colors.primary[500],
            color: "white",
            border: "none",
            borderRadius: borderRadius.md,
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {cta.text}
        </motion.button>
      )}
    </motion.div>
  );
};
