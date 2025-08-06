"use client";

import { useEffect, useState } from "react";

interface VideoPlayerProps {
  jsonUrl: string;
}

export default function VideoPlayer({ jsonUrl }: VideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [srtUrl, setSrtUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const res = await fetch(jsonUrl);
        const files: string[] = await res.json();
        const mp4 = files.find((f) => f.endsWith(".mp4"));
        const srt = files.find((f) => f.endsWith(".srt"));
        if (mp4) {
          setVideoUrl(mp4);
        }
        if(srt) {
          setSrtUrl(srt);
        }
      } catch (error) {
        console.error("Failed to load video:", error);
      }
    };

    fetchVideoUrl();
  }, [jsonUrl]);

  if (!videoUrl) return <div className="text-sm text-zinc-500">Loading video...</div>;

  return (
    <video controls className="w-full h-auto object-cover">
      <source src={videoUrl} type="video/mp4" />
       {srtUrl && (
        <track
          label="Caption"
          kind="subtitles"
          srcLang="en"
          src={`/api/caption-proxy?url=${encodeURIComponent(srtUrl)}`}
          default
        />)}
       Your browser does not support the video tag.
    </video>
  );
}
