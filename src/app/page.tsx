import { AudioPlayer } from "@/components/AudioPlayer";
import { AudioVisualizer } from "@/components/AudioVisulizer";
import { ResizableChatPanel } from "@/components/ResizableChatWindow";
import { ResizableSidebar } from "@/components/ResizableSidebar";
import * as React from "react";
import icon from "@/assets/never-too-old.jpeg";
import { Avatar, AvatarImage } from "@/components/ui/Avatar";

export default function HomePage() {
  return (
    <main className="flex h-screen w-screen flex-row bg-neutral-900 text-white">
      <ResizableSidebar
        minWidth={80}
        maxWidth={200}
        initialWidth={80}
        className="bg-zinc-900 h-full"
      >
        <div className="flex gap-4">
          <div className="p-2">
            <Avatar className="w-14 h-14">
              <AvatarImage src={icon.src} />
            </Avatar>
          </div>
        </div>
      </ResizableSidebar>
      {/* Our resizable top panel (chat window) */}
      <section className="w-full flex flex-col">
        <div className="w-full flex-1 flex flex-col overflow-hidden,">
          <AudioVisualizer />
        </div>

        <ResizableChatPanel
          minHeight={100}
          maxHeight={400}
          initialHeight={250}
          className="bg-zinc-800"
        >
          <div className="p-4 ">
            <AudioPlayer />
          </div>
        </ResizableChatPanel>

        {/* The rest of the screen below the chat */}
      </section>
    </main>
  );
}
