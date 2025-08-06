"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title: string;
  description: string;
  url: string;
  className?: string;
  updateMilestone: () => void;
}

export default function ShareButton({ title, description, url, className, updateMilestone }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined" && navigator.share) {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      updateMilestone();
    } catch (err) {
      console.warn("Share failed", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={cn(
        "text-purple-600 dark:text-purple-400 text-sm flex items-center gap-1 hover:underline",
        className
      )}
      title="Share this content"
    >
      <Share2 size={14} />
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
