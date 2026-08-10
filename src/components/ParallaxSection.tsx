// src/components/ParallaxSection.tsx

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { colors, spacing, borderRadius } from "../tokens/tokens";

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  background?: string;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.5,
  background,
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * speed]);

  return (
    <motion.div
      ref={ref}
      style={{
        y,
        background: background || colors.neutral[50],
        padding: spacing['2xl'],
        borderRadius: borderRadius.lg,
        overflow: "hidden",
      }}
    >
      {children}
    </motion.div>
  );
};
