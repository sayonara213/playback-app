"use client";

import { activeSong } from "@/assets/songs";
import { useAudioAnalyser } from "@/hooks/useAudio";
import { AudioAnalyserManager } from "@/lib/audioAnalyser";
import { useAnalyserStore } from "@/store/analyserStore";
import React, { useEffect, useRef } from "react";

export const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  useAudioAnalyser(audioRef);

  const setCurrentTimestamp = useAnalyserStore(
    (state) => state.setCurrentTimestamp,
  );

  const handlePlay = () => {
    if (audioRef.current) {
      const audioManager = AudioAnalyserManager.getInstance();
      const audioContext = audioManager.getAudioContext();
      if (audioContext && audioContext.state === "suspended") {
        audioContext.resume();
      }
      audioRef.current.play();
    }
  };

  useEffect(() => {
    let animationFrameId: number;

    const updateTimestamp = () => {
      if (audioRef.current) {
        setCurrentTimestamp(audioRef.current.currentTime - 0.2);
      }
      animationFrameId = requestAnimationFrame(updateTimestamp);
    };

    animationFrameId = requestAnimationFrame(updateTimestamp);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div>
      <audio
        ref={audioRef}
        controls
        onPlay={handlePlay}
        className="w-full focus:outline-none"
      >
        <source src={activeSong.audio} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};
