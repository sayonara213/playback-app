// src/hooks/useAudioAnalyser.ts

import { useEffect } from "react";
import { useAnalyserStore } from "@/store/analyserStore";
import { calculateLowMidHighVelocity } from "../lib/frequency";
import { AudioAnalyserManager } from "@/lib/audioAnalyser";

export const useAudioAnalyser = (
  audioRef: React.RefObject<HTMLAudioElement | null>,
) => {
  const updateVolumes = useAnalyserStore((state) => state.updateVolumes);
  const updateSoundArray = useAnalyserStore((state) => state.updateSoundArray);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const audioManager = AudioAnalyserManager.getInstance();
    audioManager.init(audioElement);

    const analyser = audioManager.getAnalyserNode();
    if (!analyser) return;

    const dataArray = new Float32Array(analyser.frequencyBinCount);

    let animationFrameId: number;

    const updateAudioData = () => {
      analyser.getFloatFrequencyData(dataArray);

      // Update the global sound array
      updateSoundArray(new Float32Array(dataArray));

      // Calculate volumes for different frequency bands
      const volumes = calculateLowMidHighVelocity(dataArray);
      updateVolumes(volumes);

      animationFrameId = requestAnimationFrame(updateAudioData);
    };

    updateAudioData();

    return () => {
      cancelAnimationFrame(animationFrameId);
      // Optionally disconnect the audio element if needed
    };
  }, [audioRef, updateVolumes, updateSoundArray]);
};
