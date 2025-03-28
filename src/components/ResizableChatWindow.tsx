"use client";

import * as React from "react";
import { Button } from "./ui/Button";
import { ChevronRight } from "lucide-react";

interface ResizableChatPanelProps {
  minHeight?: number;
  maxHeight?: number;
  initialHeight?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * A dedicated "chat window" that can be resized vertically by dragging a handle
 * at the bottom edge.
 */
export function ResizableChatPanel({
  minHeight = 100,
  maxHeight = 500,
  initialHeight = 250,
  className,
  children,
}: ResizableChatPanelProps) {
  const [height, setHeight] = React.useState<number>(initialHeight);
  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  const isResizingRef = React.useRef(false);
  const startYRef = React.useRef(0);
  const startHeightRef = React.useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isResizingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = height;
  };

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isResizingRef.current) return;

      const delta = e.clientY - startYRef.current;
      const newHeight = startHeightRef.current - delta;

      // Clamp the new height between minHeight and maxHeight

      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setHeight(newHeight);
      }
      if (newHeight < 10) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    },
    [minHeight, maxHeight],
  );

  const handleMouseUp = React.useCallback(() => {
    isResizingRef.current = false;
  }, []);

  React.useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <>
      <Button
        size="icon"
        className="absolute bottom-1 -translate-y-1/2 right-24 z-40 cursor-pointer"
        onClick={() => setCollapsed(false)}
      >
        <ChevronRight />
      </Button>

      <div
        className={`relative w-full overflow-auto ${className ?? ""}`}
        style={{
          height: collapsed ? 0 : height,
          display: collapsed ? "none" : "block",
        }}
      >
        <div
          onMouseDown={handleMouseDown}
          className="
          absolute
          top-0
          left-0
          h-1
          w-full
          cursor-row-resize
          bg-zinc-700
          hover:bg-zinc-600
          transition-colors
        "
        />

        {/* This is your chat area (top panel) */}
        {children}

        {/* Handle to drag at the bottom edge */}
      </div>
    </>
  );
}
