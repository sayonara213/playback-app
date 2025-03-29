"use client";

import { useAudioDataLoader } from "@/hooks/useAudioDataLoader";
import { useCalculateHighEnergyFrames } from "@/hooks/useCalculateBassMax";
import { useDetectChorusSections } from "@/hooks/useHighIntensitySections";
import { volumeToColor, decibelsToScaleLog } from "@/lib/frequency";
import { useAnalyserStore } from "@/store/analyserStore";
import { cx } from "class-variance-authority";
import React, { useEffect, useState } from "react";
import FrequencyVisualizer from "./audio-misc/SineWave";
import { Card } from "./ui/Card";
import Image from "next/image";
import LyricsPlayer from "./LyricsPlayer";
import { activeSong } from "@/assets/songs";
import { BlobsPlayground } from "./BlobsPlayground";

export const AudioVisualizer = () => {
  const [isKick, setIsKick] = useState(false);
  const [isConsideredKick, setIsConsideredKick] = useState(false);
  const [_, setIsChorus] = useState(false);

  console.log(_);

  useAudioDataLoader(activeSong.audio);
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
    <div className={cx(["w-full flex-1 relative"])}>
      <div className="z-50 absolute top-1/2 left-1/2 -translate-1/2 flex gap-4">
        <Card
          className={cx([
            "flex flex-col gap-4 w-full bg-white/10 p-6 text-center backdrop-blur-3xl border-none",
            isKick && "animate-wiggle",
          ])}
        >
          <Image
            src={activeSong.image}
            alt="icon"
            className="rounded-lg min-w-64"
          />
          <p className="text-lg font-bold">{activeSong.title}</p>
          <p className="">{activeSong.desc}</p>
        </Card>
        <LyricsPlayer lrcText={activeSong.lyrics} />
      </div>

      <div
        style={{
          backgroundColor: volumeToColor(
            decibelsToScaleLog(volumes.low),
            "#381131",
          ),
        }}
        className={cx(["absolute left-0 top-0 h-full w-full rounded-lg"])}
      />
      <div className="absolute bottom-0 left-0 z-40 w-full">
        <FrequencyVisualizer />
      </div>
      <BlobsPlayground volumes={volumes} />
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
