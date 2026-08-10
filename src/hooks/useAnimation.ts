// src/hooks/useAnimation.ts

import { useInView } from "react-intersection-observer";
import { animationPresets } from "../tokens/animations";

type PresetName = keyof typeof animationPresets;

interface UseAnimationProps {
  preset?: PresetName;
  triggerOnce?: boolean;
  threshold?: number;
  delay?: number;
}

export const useAnimation = ({
  preset = "fadeIn",
  triggerOnce = true,
  threshold = 0.1,
  delay = 0,
}: UseAnimationProps = {}) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
  });

  const animationPreset = animationPresets[preset];

  return {
    ref,
    inView,
    ...animationPreset,
    transition: {
      ...animationPreset.transition,
      delay,
    },
  };
};
