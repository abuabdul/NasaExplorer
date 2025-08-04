"use client";

import { useState } from "react";
import { useAPOD, getRandomDate } from "@/hooks/useAPOD";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  Download,
  Moon,
  Sun,
  Rocket,
  Loader,
  AlertTriangle,
  NotebookPen,
} from "lucide-react";
import { motion } from "framer-motion";
import Starfield from "@/components/Starfield";

export default function HomePage() {
  const [date, setDate] = useState<string | undefined>(undefined);
  const [dark, setDark] = useState(true);
  const { data, isLoading, isFetching, isError } = useAPOD(date);

  const handleNextAPOD = () => {
    const randomDate = getRandomDate();
    setDate(randomDate);
  };

  const handleDownload = () => {
    if (data?.media_type === "image") {
      const link = document.createElement("a");
      link.href = data.url;
      link.download = `${data.title}.jpg`;
      link.click();
    }
  };

  const handleShare = async () => {
    if (!data) return;

    const shareData = {
      title: data.title,
      text: "Check out this NASA Astronomy Picture of the Day!",
      url: data.url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(data.url);
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  return (
    <main
      className={`${
        dark ? "bg-zinc-950 text-zinc-100" : "bg-white text-zinc-900"
      } min-h-screen p-6 transition-colors`}
    >
      <Starfield />

      {/* Header */}
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-6">
        <h1
          className={`text-3xl font-bold tracking-tight flex items-center gap-2 ${
            dark ? "text-zinc-100" : "text-zinc-900"
          }`}
        >
          <Rocket className="text-red-500" size={28} />
          Space Explorer: Welcome to Mars
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDark(!dark)}
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </div>

      {/* Actions */}
      <motion.div
        className="flex flex-wrap justify-center gap-4 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {/* Fetch Button */}
        <Button
            onClick={handleNextAPOD}
            disabled={isFetching}
            className={`transition-all duration-300 border shadow-md ${
            dark
                ? "bg-red-800 hover:bg-red-700 text-white border-red-500"
                : "bg-red-600 hover:bg-red-500 text-white border-red-400"
            }`}
        >
            {isFetching ? (
            <>
                <Loader size={16} className="mr-2 animate-spin" />
                Fetching...
            </>
            ) : (
            <>
                <Rocket size={16} className="mr-2" />
                Get an Astronomy Picture
            </>
            )}
        </Button>

        {/* Download Button */}
        {data?.media_type === "image" && (
            <Button
            onClick={handleDownload}
            className={`transition-all duration-300 ${
                dark
                    ? "bg-orange-600 text-zinc-100 hover:bg-orange-500"
                    : "bg-orange-100 text-orange-800 hover:bg-orange-200"
            }`}
            >
            <Download size={16} className="mr-2" />
            Download
            </Button>
        )}

        {/* Share Buttons */}
        {data && (
            <div className="flex gap-2 flex-wrap justify-center">
            {/* X (Twitter) */}
            <Button
                onClick={() =>
                window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    data.url
                    )}&text=${encodeURIComponent(data.title)}`,
                    "_blank"
                )
                }
                className={`transition-all duration-300 ${
                dark
                    ? "bg-neutral-900 text-white hover:bg-neutral-800"
                    : "bg-neutral-100 text-black hover:bg-neutral-200"
                }`}
            >
                <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
                >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.07 9.07 0 01-2.89 1.1A4.52 4.52 0 0016.11.4c-2.5 0-4.52 2.08-4.52 4.64 0 .36.03.72.1 1.07A12.84 12.84 0 013 1.7a4.52 4.52 0 001.4 6.03 4.42 4.42 0 01-2.05-.58v.06c0 2.2 1.52 4.03 3.54 4.45a4.52 4.52 0 01-2.03.08 4.5 4.5 0 004.2 3.19A9.05 9.05 0 012 19.54a12.77 12.77 0 006.29 1.87c7.55 0 11.68-6.38 11.68-11.9 0-.18-.01-.36-.02-.54A8.68 8.68 0 0023 3z" />
                </svg>
                Share on X
            </Button>

            {/* LinkedIn */}
            <Button
                onClick={() =>
                window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    data.url
                    )}`,
                    "_blank"
                )
                }
                className={`transition-all duration-300 ${
                dark
                    ? "bg-blue-700 text-white hover:bg-blue-600"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
            >
                <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
                >
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 6 3.33 6 7.66V24h-5v-7.33c0-1.75-.03-4-2.5-4s-2.88 1.93-2.88 3.87V24h-5V8z" />
                </svg>
                Share on LinkedIn
            </Button>

            {/* Instagram (fallback to clipboard) */}
            <Button
                onClick={handleShare}
                className={`transition-all duration-300 ${
                dark
                    ? "bg-pink-700 text-white hover:bg-pink-600"
                    : "bg-pink-100 text-pink-800 hover:bg-pink-200"
                }`}
            >
                <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
                >
                <path d="M7.75 2h8.5C19.1 2 21 3.9 21 6.25v11.5C21 20.1 19.1 22 16.25 22h-8.5C4.9 22 3 20.1 3 17.75V6.25C3 3.9 4.9 2 7.75 2zm0 2C6.78 4 6 4.78 6 5.75v12.5C6 19.22 6.78 20 7.75 20h8.5c.97 0 1.75-.78 1.75-1.75V5.75C18 4.78 17.22 4 16.25 4h-8.5zm4.25 2.25a4.75 4.75 0 110 9.5 4.75 4.75 0 010-9.5zm0 2a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5zm5.5-.5a1 1 0 110 2 1 1 0 010-2z" />
                </svg>
                Share to Instagram
            </Button>
            </div>
        )}
      </motion.div>

      {/* Main Content */}
      {isLoading ? (
        <div className="text-center text-zinc-400 flex items-center justify-center gap-2">
          <Loader className="animate-spin" size={20} />
          Preparing data from the cosmos...
        </div>
      ) : isError ? (
        <div className="text-red-500 text-center flex items-center justify-center gap-2">
          <AlertTriangle size={18} />
          Lost connection to NASA servers.
        </div>
      ) : data ? (
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            className={`${
              dark ? "bg-zinc-900 text-zinc-100" : "bg-zinc-100 text-zinc-900"
            } rounded-xl shadow-lg`}
          >
            <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start justify-between">
              {/* Image or Video */}
              <div className="flex-1 w-full">
                <h2 className="text-2xl font-semibold mb-1">{data.title}</h2>
                <p className={`text-sm mb-4 flex items-center gap-2 ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
                  <CalendarDays size={16} /> {data.date}
                </p>

                {data.media_type === "image" ? (
                  <img
                    src={data.url}
                    alt={data.title}
                    className="rounded-lg w-full h-auto max-h-[500px] object-cover"
                  />
                ) : (
                  <iframe
                    src={data.url}
                    title={data.title}
                    allowFullScreen
                    className="w-full h-[400px] rounded-lg"
                  />
                )}

                {data.copyright && (
                  <p
                    className={`mt-4 text-xs italic w-full ${
                        dark ? "text-zinc-500" : "text-zinc-600"
                    } text-left md:text-left`}
                    >
                    © {data.copyright}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="flex-1 text-sm md:text-base leading-relaxed space-y-4">
                <div
                  className={`flex items-center gap-2 font-semibold ${
                    dark ? "text-red-400" : "text-red-600"
                  }`}
                >
                  <NotebookPen size={18} />
                  <span>Mission Log</span>
                </div>
                <p className={`${dark ? "text-zinc-300" : "text-zinc-800"}`}>
                  {data.explanation}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}
    </main>
  );
}
