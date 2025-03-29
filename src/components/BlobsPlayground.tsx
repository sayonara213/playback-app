"use client";

import { decibelsToScaleLog } from "@/lib/frequency";
import { VolumeLevels } from "@/store/analyserStore";
import React, { useRef } from "react";
import { FreqBlob } from "./audio-misc/FreqBlob";
import { motion } from "motion/react";
import { useFollowPointer } from "@/hooks/useFollowPointer";

interface BlobsPlaygroundProps {
  volumes: VolumeLevels;
}

export const BlobsPlayground: React.FC<BlobsPlaygroundProps> = ({
  volumes,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y } = useFollowPointer(ref);

  return (
    <>
      <motion.div ref={ref} style={{ x, y }}>
        <FreqBlob
          volume={decibelsToScaleLog(volumes.mid * 0.2)}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          color="rgba(245, 39, 215, 0.4)"
        />
      </motion.div>

      <FreqBlob
        volume={decibelsToScaleLog(volumes.mid * 1.2)}
        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        color="rgba(42, 255, 255, 0.4)"
      />

      <FreqBlob
        volume={decibelsToScaleLog(volumes.high) * 1}
        className="absolute left-[24px] top-[24px] z-10"
        color="rgba(3, 32, 250, 0.4)"
      />
      <FreqBlob
        volume={decibelsToScaleLog(volumes.high) * 1}
        className="absolute right-[24px] top-[24px] z-10"
        color="rgba(155, 52, 235, 0.4)"
      />
      <FreqBlob
        volume={decibelsToScaleLog(volumes.high) * 1.6}
        className="absolute left-[24px] bottom-[24px] z-10"
        color="rgba(155, 52, 235, 0.4)"
      />
      <FreqBlob
        volume={decibelsToScaleLog(volumes.high) * 1.6}
        className="absolute right-[24px] bottom-[24px] z-10"
        color="rgba(41, 214, 136, 0.2)"
      />
    </>
  );
};
