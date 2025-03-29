"use client";

import { useEffect, useRef, useState } from "react";
import { parseLRC, LrcLine } from "@/lib/utils";
import { useAnalyserStore } from "@/store/analyserStore";
import { motion, Variants } from "motion/react";

const linesVariants: Variants = {
  active: {
    opacity: 1,
    fontSize: "42px",
    scale: 1,
    lineHeight: 1,
  },
  inactive: {
    opacity: 0.4,
    fontSize: "42px",
    scale: 0.7,
    lineHeight: 1,
  },
};

export default function LyricsPlayer({ lrcText }: { lrcText: string }) {
  const [lyrics, setLyrics] = useState<LrcLine[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const currentTimestamp = useAnalyserStore((state) => state.currentTimestamp);

  useEffect(() => {
    fetch(lrcText)
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseLRC(text);
        setLyrics(parsed);
      });
  }, []);

  useEffect(() => {
    const lineIndex = lyrics.findIndex((line, idx) =>
      currentTimestamp < line.time && idx > 0
        ? currentTimestamp >= lyrics[idx - 1].time
        : false,
    );
    if (lineIndex !== -1 && lineIndex !== currentLine) {
      setCurrentLine(lineIndex - 1);
    }
  }, [currentTimestamp]);

  // Animate scroll to current line
  useEffect(() => {
    const el = lineRefs.current[currentLine];
    const container = containerRef.current;
    if (el && container) {
      container.scrollTo({
        top: el.offsetTop - container.offsetHeight / 2 + el.offsetHeight / 2,
        behavior: "smooth",
      });
    }
  }, [currentLine]);

  return (
    <div className="p-4 flex-1 relative flex flex-col min-w-fit">
      <motion.div
        ref={containerRef}
        className="overflow-y-auto relative p-4"
        style={{
          lineHeight: "2.5rem",
          height: "16rem",
          maskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {lyrics.map((line, idx) => (
          <motion.p
            key={idx}
            ref={(el) => {
              lineRefs.current[idx] = el;
            }}
            variants={linesVariants}
            animate={idx === currentLine ? "active" : "inactive"}
            className="text-white font-bold p-2"
          >
            {line.text}
          </motion.p>
        ))}
      </motion.div>
    </div>
  );
}
