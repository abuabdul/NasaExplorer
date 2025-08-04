// src/components/Mars/RoverTabs.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Satellite } from "lucide-react";
import { motion } from "framer-motion";

const rovers = ["curiosity", "opportunity", "spirit"] as const;

type Props = {
  selected: (typeof rovers)[number];
  onSelect: (rover: (typeof rovers)[number]) => void;
};

export default function RoverTabs({ selected, onSelect }: Props) {
  return (
    <div className="flex justify-center gap-4">
      {rovers.map((rover) => (
        <motion.div
          key={rover}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant={selected === rover ? "default" : "outline"}
            className={
              selected === rover
                ? "bg-red-600 text-white border-red-500 shadow"
                : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
            }
            onClick={() => onSelect(rover)}
          >
            <Satellite className="w-4 h-4 mr-2" />
            {rover.charAt(0).toUpperCase() + rover.slice(1)}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}