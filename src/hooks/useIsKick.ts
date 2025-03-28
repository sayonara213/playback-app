import { useEffect, useState } from "react";

export const useIsKick = () => {
  const [isKick, setIsKick] = useState(false);

  const [isConsideredKick, setIsConsideredKick] = useState(false);

  useEffect(() => {
    if (isConsideredKick) {
      setTimeout(() => {
        setIsKick(true);
      }, 60);
      setTimeout(() => {
        setIsKick(false);
      }, 160);
    }
  }, [isConsideredKick]);

  useEffect(() => {
    if (!audioRef.current || !currentTimestamp || !highEnergyFrames) return;

    const tolerance = 0.1; // 100 milliseconds

    const isKickFrame = highEnergyFrames.some(
      (frameTime) => Math.abs(currentTimestamp - frameTime) <= tolerance,
    );

    setIsConsideredKick(isKickFrame);
  }, [currentTimestamp, highEnergyFrames, audioRef]);
};
