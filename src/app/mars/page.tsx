"use client";

import MarsDashboard from "@/components/Mars/MarsDashboard";
import Starfield from "@/components/Layout/Starfield";

export default function MarsPage() {
  return (
    <main className="max-w-7xl mx-auto p-6">
      <Starfield />
      <h1 className="text-3xl font-bold mb-4 text-center">Mars Rover Mission Dashboard</h1>
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        Visualize and explore photo data from NASA&apos;s Curiosity, Opportunity, and Spirit rovers.
      </p>
      <MarsDashboard />
    </main>
  );
}
