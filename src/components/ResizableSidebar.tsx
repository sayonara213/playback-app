"use client";

import * as React from "react";

/**
 * Props for ResizableSidebar:
 * - minWidth   : The minimum allowed width (px).
 * - maxWidth   : The maximum allowed width (px).
 * - initialWidth : The initial sidebar width (px).
 * - className  : Extra CSS classes for styling (optional).
 * - children   : The sidebar content.
 */
interface ResizableSidebarProps {
  minWidth?: number;
  maxWidth?: number;
  initialWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * A dedicated sidebar component that can be resized horizontally
 * by dragging a handle on its right edge.
 */
export function ResizableSidebar({
  minWidth = 150,
  maxWidth = 400,
  initialWidth = 250,
  className,
  children,
}: ResizableSidebarProps) {
  const [width, setWidth] = React.useState<number>(initialWidth);

  // Refs to help manage drag state without triggering re-renders
  const isResizingRef = React.useRef(false);
  const startXRef = React.useRef(0);
  const startWidthRef = React.useRef(0);

  // When user clicks (mousedown) on the resizer handle
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = width;
  };

  // When user moves the mouse (while dragging)
  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isResizingRef.current) return;

      const delta = e.clientX - startXRef.current;
      const newWidth = startWidthRef.current + delta;

      // Clamp the new width between minWidth and maxWidth
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    },
    [minWidth, maxWidth],
  );

  // When user releases the mouse (mouseup)
  const handleMouseUp = React.useCallback(() => {
    isResizingRef.current = false;
  }, []);

  // Global listeners for mouse move + mouse up
  React.useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`relative flex flex-col overflow-auto ${className || ""}`}
      style={{ width }}
    >
      {/* Your sidebar content */}
      {children}

      {/* The draggable handle on the right edge */}
      <div
        onMouseDown={handleMouseDown}
        className="
          absolute
          top-0
          right-0
          h-full
          w-1
          cursor-col-resize
          bg-zinc-700
          hover:bg-zinc-600
          transition-colors
        "
      />
    </div>
  );
}
