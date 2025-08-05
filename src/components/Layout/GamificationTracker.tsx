"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Target, Search, Image as LcImage, Download, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "next-themes";


const totalMilestones = 4;

export default function GamificationTracker() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [milestones, setMilestones] = useState({
    searched: false,
    viewed: false,
    downloaded: false,
    shared: false,
  });

  const progress =
    (Object.values(milestones).filter(Boolean).length / totalMilestones) * 100;

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("mars_milestones");
    if (saved) {
      setMilestones(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mars_milestones", JSON.stringify(milestones));
  }, [milestones]);

  if (!mounted) return null;

  const dark = theme === "dark";

  const borderColor = dark ? "border-zinc-700" : "border-zinc-300";
  const bgColor = dark ? "bg-zinc-900" : "bg-white";
  const textColor = dark ? "text-zinc-100" : "text-zinc-900";
  const inactiveIconColor = dark ? "text-zinc-400" : "text-zinc-500";
  const activeIconColor = dark ? "text-green-400" : "text-green-600";
  const progressBg = dark ? "bg-zinc-700" : "bg-zinc-300";

  return (
    <AnimatePresence>
      <motion.div
          className={`
          fixed z-40 border ${borderColor} shadow-lg rounded-xl p-4 ${bgColor} ${textColor} transition-all
            w-[90vw] max-w-sm sm:w-[280px]
            bottom-4 left-1/2 transform -translate-x-1/2
            sm:top-16 sm:right-1 sm:left-auto sm:bottom-auto sm:translate-x-0
          `}>

        <div className="flex items-center gap-2 mb-2">
          {progress === 100 ? (
            <BadgeCheck className={`${activeIconColor} w-5 h-5`} />
          ) : (
            <Target className="text-yellow-500 w-5 h-5" />
          )}
          <span className="text-sm font-semibold">
            {progress === 100 ? "Mission Accomplished" : "Mission Progress"}
          </span>
        </div>

        <Progress value={progress} className={`h-2 ${progressBg}`} />

        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <Search size={16} className={milestones.searched ? activeIconColor : inactiveIconColor} />
            <span className={milestones.searched ? activeIconColor : inactiveIconColor}>Searched NASA library</span>
          </li>
          <li className="flex items-center gap-2">
            <LcImage size={16} className={milestones.viewed ? activeIconColor : inactiveIconColor} />
            <span className={milestones.viewed ? activeIconColor : inactiveIconColor}>Viewed media</span>
          </li>
          <li className="flex items-center gap-2">
            <Download size={16} className={milestones.downloaded ? activeIconColor : inactiveIconColor} />
            <span className={milestones.downloaded ? activeIconColor : inactiveIconColor}>Downloaded file</span>
          </li>
          <li className="flex items-center gap-2">
            <Share2 size={16} className={milestones.shared ? activeIconColor : inactiveIconColor} />
            <span className={milestones.shared ? activeIconColor : inactiveIconColor}>Shared item</span>
          </li>
        </ul>
      </motion.div>
    </AnimatePresence>
  );
}
