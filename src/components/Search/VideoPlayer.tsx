"use client";

import { useEffect, useState } from "react";

interface Props {
  jsonUrl: string;
}

export default function VideoPlayer({ jsonUrl }: Props) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const res = await fetch(jsonUrl);
        const files: string[] = await res.json();
        const mp4 = files.find((f) => f.endsWith(".mp4"));
        if (mp4) {
          setVideoUrl(mp4);
        }
      } catch (error) {
        console.error("Failed to load video:", error);
      }
    };

    fetchVideoUrl();
  }, [jsonUrl]);

  if (!videoUrl) return <div className="text-sm text-zinc-500">Loading video...</div>;

  return (
    <video controls className="w-full h-60 object-cover">
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
