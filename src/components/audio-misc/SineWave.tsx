"use client";

import React, { useRef, useEffect } from "react";
import { useAnalyserStore } from "@/store/analyserStore";

const FrequencyVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Get the FFT data (in decibels) from the store
  const soundArray = useAnalyserStore((state) => state.soundArray);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set the canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = 600; // Set desired height
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationFrameId: number;

    const renderFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create a gradient for the stroke
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "#57076B");
      gradient.addColorStop(0.25, "#D058EE");
      gradient.addColorStop(0.5, "#C110EB");
      gradient.addColorStop(0.75, "#5E286B");
      gradient.addColorStop(1, "#950DB8");
      ctx.strokeStyle = gradient;

      ctx.beginPath();

      // Use all but the last 20 bins (as before)
      const bufferLength = soundArray.length - 20;
      // Calculate maximum log value to scale x-axis logarithmically
      const maxLogIndex = Math.log10(bufferLength);

      // Use a normalized decibel range from -100 dB to 0 dB
      const minDb = -100;
      const maxDb = 0;

      // Set a fixed line width for consistency
      ctx.lineWidth = 2;

      for (let i = 0; i < bufferLength; i++) {
        // Clamp the decibel value
        let dbValue = soundArray[i];
        dbValue = Math.max(minDb, Math.min(maxDb, dbValue));

        // Normalize to a 0–1 range
        const linearValue = (dbValue - minDb) / (maxDb - minDb);

        // Map to canvas height (invert y-axis so 0 dB is at the top)
        const y = (1 - linearValue) * canvas.height;

        // Map x using logarithmic scaling to spread out bass frequencies
        const x = (Math.log10(i + 1) / maxLogIndex) * canvas.width;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Create a closed path for the fill effect
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();

      // Fill under the curve
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fill();

      // Apply shadow effects
      ctx.shadowColor = "#F6055D";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 5;

      // Stroke the path
      ctx.stroke();

      // Continue the animation loop
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [soundArray]);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: "block", width: "100%", height: "auto" }}
    ></canvas>
  );
};

export default FrequencyVisualizer;
