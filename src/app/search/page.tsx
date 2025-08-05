"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchParams, useNASAImageSearch } from "@/hooks/useNasaImageSearch";
import { Download, ExternalLink, Loader, Search as SearchIcon } from "lucide-react";
import Image from "next/image";
import Starfield from "@/components/Starfield";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useState<SearchParams>({ q: "" });
  const { data, isLoading, isFetching } = useNASAImageSearch(searchParams);

  const [milestones, setMilestones] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("mars_milestones") || "{}");
    }
    return {};
  });

  const updateMilestone = (key: keyof typeof milestones) => {
    const updated = { ...milestones, [key]: true };
    setMilestones(updated);
    localStorage.setItem("mars_milestones", JSON.stringify(updated));
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearchParams({ q: query });
    updateMilestone("searched");
  };

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex items-center gap-2">
        
        <Starfield />

        <Input
          placeholder="Search NASA's media library..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={handleSearch} disabled={isFetching}>
          {isFetching ? (
            <>
              <Loader size={16} className="animate-spin mr-2" /> Searching...
            </>
          ) : (
            <>
              <SearchIcon size={16} className="mr-2" /> Search
            </>
          )}
        </Button>
      </div>

      {!searchParams.q && (
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Try searching for Mars, Curiosity, Saturn, or Moon...</p>
      )}

      {isLoading ? (
        <div className="text-center text-zinc-500 dark:text-zinc-400">Searching the stars...</div>
      ) : data && data.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => {
            const details = item.data[0];
            const thumbnail = item.links?.find(link => link.rel === "preview")?.href;
            const canonical = item.links?.find(link => link.rel === "canonical")?.href;
            return (
                <Card key={details.nasa_id} className="overflow-hidden">
                <CardContent className="p-0">
                    <pre>{JSON.stringify(details, null, 2)}</pre>
                    <pre>{JSON.stringify(item.links && item.links[0], null, 2)}</pre>
                    <pre>{JSON.stringify(canonical, null, 2)}</pre>

                    {details.media_type === "image" && thumbnail && (
                    <Image
                        src={thumbnail}
                        alt={details.title}
                        width={400}
                        height={300}
                        className="w-full h-60 object-cover"
                    />
                //             "date_created": "2019-05-31T00:00:00Z",
                //             "keywords": [
                //                 "Mars",
                //                 "Mars Celebration",
                //                 "Pennsylvania"
                //             ],
                //             "location": "Mars, PA, USA",
                //             "photographer": "NASA/Bill Ingalls",
                    )}
                    <div className="p-4">
                    <h3 className="text-sm font-semibold mb-2 line-clamp-1">
                        {details.description}
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                        <a
                        href={canonical}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 text-sm flex items-center gap-1 hover:underline"
                        >
                        <ExternalLink size={14} /> View
                        </a>
                        {details.media_type === "image" && (
                        <a
                            href={canonical?.replace("~orig.tif", "~large.jpg")}
                            download
                            className="text-green-600 dark:text-green-400 text-sm flex items-center gap-1 hover:underline"
                        >
                            <Download size={14} /> Download
                        </a>
                        )}
                    </div>
                    </div>
                </CardContent>
                </Card>
            )
          })}
         </div>
      ) : searchParams.q && (
        <p className="text-zinc-500 dark:text-zinc-400">No results found for `{searchParams.q}`.</p>
      )}
    </main>
  );
}
