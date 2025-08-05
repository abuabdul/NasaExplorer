"use client";

import { useEffect, useState } from "react";
import { useAPOD, getRandomDate } from "@/hooks/useAPOD";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  Download,
  Loader,
  AlertTriangle,
  NotebookPen,
  Telescope,
  ImagePlus,
} from "lucide-react";
import { FaXTwitter, FaLinkedin, FaInstagram } from "react-icons/fa6";
import { motion } from "framer-motion";
import Starfield from "@/components/Starfield";
import { useTheme } from "next-themes";

export default function HomePage() {
  const [date, setDate] = useState<string | undefined>(undefined);
  const { theme } = useTheme();
  const { data, isLoading, isFetching, isError } = useAPOD(date);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;
  
  const dark = theme === "dark";

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
        dark ? "bg-zinc-950 text-zinc-100" : "bg-white/20 text-zinc-900"
      } min-h-screen p-6 transition-colors`}
    >
      <Starfield />

      {data && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 hidden sm:flex flex-col gap-3 items-center">
          {/* Download Button */}
          {data.media_type === "image" && (
            <Button
              onClick={handleDownload}
              size="icon"
              className="bg-orange-600 hover:bg-orange-500 text-white rounded-full shadow-md"
              title="Download Image"
            >
              <Download size={18} />
            </Button>
          )}

          {/* Share: X (Twitter) */}
          <Button
            onClick={() =>
              window.open(
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.title)}`,
                "_blank"
              )
            }
            size="icon"
            className="bg-black text-white hover:bg-zinc-800 rounded-full shadow-md"
            title="Share on X"
          >
            <FaXTwitter size={18} />
          </Button>

          {/* LinkedIn */}
          <Button
            onClick={() =>
              window.open(
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`,
                "_blank"
              )
            }
            size="icon"
            className="bg-blue-700 text-white hover:bg-blue-600 rounded-full shadow-md"
            title="Share on LinkedIn"
          >
            <FaLinkedin size={18} />
          </Button>
          
          {/* Instagram (fallback to clipboard) */}
          <Button
            onClick={handleShare}
            size="icon"
            className="bg-pink-600 text-white hover:bg-pink-500 rounded-full shadow-md"
            title="Share on Instagram"
          >
            <FaInstagram size={18} />
          </Button>
        </div>
      )}

      {/* CT Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
        className="flex flex-wrap justify-center gap-4 mb-10 mt-20 sm:mt-16 md:mt-12"
      >
        <h1
          className={`text-3xl font-bold tracking-tight flex items-center gap-2 ${
            dark ? "text-zinc-100" : "text-zinc-900"
          }`}
        >
          <Telescope className="text-red-500" size={28} />
          Space Explorer
        </h1>
        <motion.button
          onClick={handleNextAPOD}
          disabled={isFetching}
          className={`flex items-center gap-3 px-6 py-4 text-lg font-semibold rounded-full shadow-xl transition-all
            ${
              dark
                ? "bg-gradient-to-r from-yellow-400 to-red-600 text-zinc-950 hover:from-yellow-500 hover:to-red-700"
                : "bg-gradient-to-r from-red-600 to-yellow-400 text-white hover:from-red-700 hover:to-yellow-500"
            }`}
        >
          {isFetching ? (
            <>
              <Loader size={16} className="mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <ImagePlus size={18} className="mr-2" />
              Get Astronomy Picture of the Day
            </>
          )}
        </motion.button>
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
