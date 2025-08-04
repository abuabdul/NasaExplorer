"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import RoverTabs from "@/components/Mars/RoverTabs";
import FilterPanel from "@/components/Mars/FilterPanel";
import RoverGallery from "@/components/Mars/RoverGallery";
import TelemetryChart from "@/components/Mars/TelemetryChart";
import Starfield from "@/components/Starfield";

export default function MarsPage() {
  const [selectedRover, setSelectedRover] = useState<"curiosity" | "opportunity" | "spirit">("opportunity");
  const [sol, setSol] = useState(12);
  const [camera, setCamera] = useState("FHAZ");
  const [earthDate, setEarthDate] = useState("2025-01-01");

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b0c12] via-[#1a1a2e] to-[#3b0a0a] text-zinc-100 p-6 relative overflow-hidden font-sans">
      <Starfield />

      {/* Mars background subtle overlay */}
      <div 
        className="absolute inset-0 bg-[url('/mars-surface-texture.png')] bg-repeat opacity-10 pointer-events-none -z-10"
      />

      {/* Title */}
      <motion.h1
        className="text-4xl font-extrabold mb-8 flex items-center gap-3 text-red-500 drop-shadow-[0_0_10px_rgba(255,69,0,0.8)]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Rocket className="text-red-600 animate-pulse" size={36} />
        Mars Reconnaissance Log
      </motion.h1>

      <RoverTabs selected={selectedRover} onSelect={setSelectedRover} />

      <motion.div
        className="mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <FilterPanel
          rover={selectedRover}
          sol={sol}
          setSol={setSol}
          camera={camera}
          setCamera={setCamera}
          earthDate={earthDate}
          setEarthDate={setEarthDate}
        />
      </motion.div>
{/* 
      <motion.div
        className="mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <RoverGallery
          rover={selectedRover}
          sol={sol}
          camera={camera}
          earth_date={earthDate}
        />
      </motion.div> */}

      <motion.div
        className="mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >

        <TelemetryChart
        rover={selectedRover}
        sol={sol}
        camera={camera}
        earthDate={earthDate}
        />

      </motion.div>
    </main>
  );
}

