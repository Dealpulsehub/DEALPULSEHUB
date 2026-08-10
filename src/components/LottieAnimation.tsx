// src/components/LottieAnimation.tsx

import { useEffect, useRef } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { borderRadius, shadows } from "../tokens/tokens";

interface LottieAnimationProps {
  animationData: unknown;
  loop?: boolean;
  autoplay?: boolean;
  width?: number;
  height?: number;
  speed?: number;
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  loop = true,
  autoplay = true,
  width = 300,
  height = 300,
  speed = 1,
}) => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    lottieRef.current?.setSpeed(speed);
  }, [speed]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: borderRadius.lg,
        boxShadow: shadows.md,
        padding: "20px",
        backgroundColor: "#fff",
      }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{
          width,
          height,
        }}
      />
    </div>
  );
};
