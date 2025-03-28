"use client";

import { useAudioDataLoader } from "@/hooks/useAudioDataLoader";
import { useCalculateHighEnergyFrames } from "@/hooks/useCalculateBassMax";
import { useDetectChorusSections } from "@/hooks/useHighIntensitySections";
import { volumeToColor, decibelsToScaleLog } from "@/lib/frequency";
import { useAnalyserStore } from "@/store/analyserStore";
import { cx } from "class-variance-authority";
import React, { useEffect, useState } from "react";
import { FreqBlob } from "./audio-misc/FreqBlob";
import FrequencyVisualizer from "./audio-misc/SineWave";
import { Card } from "./ui/Card";
import Image from "next/image";
import icon from "@/assets/never-too-old.jpeg";

export const AudioVisualizer = () => {
  const [isKick, setIsKick] = useState(false);
  const [isConsideredKick, setIsConsideredKick] = useState(false);
  const [isChorus, setIsChorus] = useState(false);

  useAudioDataLoader("/song.mp3");
  useCalculateHighEnergyFrames();
  useDetectChorusSections();

  const highEnergyFrames = useAnalyserStore((state) => state.highEnergyFrames);
  const volumes = useAnalyserStore((state) => state.volumes);
  const chorusSections = useAnalyserStore((state) => state.chorusSections);
  const currentTimestamp = useAnalyserStore((state) => state.currentTimestamp);

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
    if (!currentTimestamp || !highEnergyFrames) return;

    const tolerance = 0.1; // 100 milliseconds

    const isKickFrame = highEnergyFrames.some(
      (frameTime) => Math.abs(currentTimestamp - frameTime) <= tolerance,
    );

    setIsConsideredKick(isKickFrame);
  }, [currentTimestamp, highEnergyFrames]);

  useEffect(() => {
    if (!currentTimestamp || !chorusSections) return;

    const isInChorus = chorusSections.some(
      (section) =>
        currentTimestamp >= section.startTime &&
        currentTimestamp <= section.endTime,
    );

    if (isInChorus) {
      // Trigger chorus-related effects
      setIsChorus(true);
    } else {
      setIsChorus(false);
    }
  }, [currentTimestamp, chorusSections]);

  return (
    <div
      className={cx(["w-full flex-1 relative", isChorus && "animate-shake"])}
    >
      <Card
        className={cx([
          "z-50 flex flex-col gap-4 w-full max-w-md bg-white/10 p-10 text-center backdrop-blur-3xl absolute top-1/2 left-1/2 -translate-1/2 border-none",
          isKick && "animate-wiggle",
        ])}
      >
        <Image src={icon} alt="icon" className="rounded-lg" />
        <p className="text-lg font-bold">Never too Old</p>
        <p className="">Song by Monrroe ‧ 2019</p>
      </Card>

      <div
        style={{
          backgroundColor: volumeToColor(
            decibelsToScaleLog(volumes.low),
            "#381131",
          ),
        }}
        className={cx(["absolute left-0 top-0 h-full w-full rounded-lg"])}
      />
      <div className="absolute bottom-0 left-0 z-50 w-full">
        <FrequencyVisualizer />
      </div>
      <FreqBlob
        volume={decibelsToScaleLog(volumes.mid)}
        className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
        color="rgba(245, 39, 245, 0.8)"
      />

      <FreqBlob
        volume={decibelsToScaleLog(volumes.high) * 0.7}
        className="absolute left-[24px] top-[24px] z-10"
        color="rgba(155, 52, 235, 0.4)"
      />
      <FreqBlob
        volume={decibelsToScaleLog(volumes.high) * 0.7}
        className="absolute right-[24px] top-[24px] z-10"
        color="rgba(155, 52, 235, 0.4)"
      />
      <FreqBlob
        volume={decibelsToScaleLog(volumes.high) * 0.7}
        className="absolute left-[24px] bottom-[24px] z-10"
        color="rgba(155, 52, 235, 0.4)"
      />
      <FreqBlob
        volume={decibelsToScaleLog(volumes.high) * 0.7}
        className="absolute right-[24px] bottom-[24px] z-10"
        color="rgba(155, 52, 235, 0.4)"
      />

      <div
        className="z-4 absolute h-full w-full bg-white"
        style={{
          background: `radial-gradient(circle, rgba(9,9,121,0) 52%, rgba(255,0,0,0.04) 73%, rgba(255,0,110,0.3) 100%)`,
          opacity: decibelsToScaleLog(volumes.low) / 1000,
        }}
      />
    </div>
  );
};
