"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNASAImageSearch, SearchParams, NasaItemLink, NasaSearchItem } from "@/hooks/useNASAImageSearch";
import {
  Download,
  ExternalLink,
  Loader,
  Search as SearchIcon,
} from "lucide-react";
import Image from "next/image";
import Starfield from "@/components/Layout/Starfield";
import VideoPlayer from "@/components/Search/VideoPlayer";
import { useMilestonesStore } from "@/stores/useMilestonesStore";
import ShareButton from "@/components/Search/ShareButton";


export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<NasaSearchItem[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({ q: "" });
  const { data, isFetching, isLoading } = useNASAImageSearch({ ...searchParams, page });
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { updateMilestone } = useMilestonesStore();
  const [totalHits, setTotalHits] = useState<number | null>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearchParams({ q: query });
    setItems([]);
    setPage(1);
    updateMilestone("searched");
  };

  useEffect(() => {
    if (data) {
      if (data.metadata?.total_hits) {
        setTotalHits(data.metadata.total_hits);
      }
      if (data.items?.length) {
        setItems((prev) => [...prev, ...data.items]);
      }
    }
  }, [data]);

  const observer = useCallback(
    (node: HTMLDivElement) => {
      if (isFetching) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && data?.items?.length) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isFetching, data]
  );

  const forceDownload = async (url: string, filename: string) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 overflow-x-hidden">
      <Starfield />
      <div data-testid="search-page" className="mb-6 flex flex-wrap items-center gap-2 z-10 relative">
        <Input
          placeholder="Search NASA's media library..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setQuery("");
            setSearchParams({ q: "" });
            setItems([]);
            setTotalHits(null);
          }}
        >
          Clear
        </Button>

        <Button onClick={handleSearch} disabled={isFetching}>
          {isFetching && items.length === 0 ? (
            <>
              <Loader size={16} className="animate-spin mr-2" /> Searching...
            </>
          ) : (
            <>
              <SearchIcon size={16} className="mr-2" /> Search
            </>
          )}
        </Button>

        {totalHits !== null && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2">
            {totalHits.toLocaleString()} results
          </span>
        )}
      </div>

      {!searchParams.q && (
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Try searching for Mars, Curiosity, Saturn, or Moon...
        </p>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const details = item.data[0];
          const preview = item.links?.find((l: NasaItemLink) => l.rel === "preview")?.href;
          const canonical = item.links?.find((l: NasaItemLink) => l.rel === "canonical")?.href;
          const isLoadingMarker = (index + 1) % 10 === 0;

          return (
            <div key={details.nasa_id}>
              <Card className="overflow-hidden w-full h-full flex flex-col">
                <CardContent className="p-0">
                  {details.media_type === "image" && preview && (
                    <Image
                      src={preview}
                      alt={details.title}
                      width={400}
                      height={300}
                      className="w-full h-48 sm:h-60 object-cover"
                    />
                  )}

                  {details.media_type === "video" && item.href && (
                    <VideoPlayer jsonUrl={item.href} />
                  )}

                  <div className="p-4">
                    <h3 className="text-sm font-semibold mb-2 line-clamp-2">{details.title}</h3>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                      {details.media_type.toUpperCase()} •{" "}
                      {new Date(details.date_created).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                      {details.keywords?.join(", ")}
                    </div>
                    <div className="text-sm mb-3 line-clamp-4">{details.description}</div>

                    <div className="flex gap-2 flex-wrap">
                      <a
                        href={canonical}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => updateMilestone("viewed")}
                        className="text-blue-600 dark:text-blue-400 text-sm flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink size={14} /> View
                      </a>

                      {details.media_type === "image" && preview && (
                        <button
                          onClick={() => {
                            if (!canonical) return;

                            forceDownload(
                              canonical.replace("~orig.tif", "~large.jpg"),
                              `${details.title}.jpg`
                            );
                            updateMilestone("downloaded");
                          }}
                          className="text-green-600 dark:text-green-400 text-sm flex items-center gap-1 hover:underline"
                        >
                          <Download size={14} /> Download
                        </button>
                      )}

                      <ShareButton
                        title={details.title}
                        description={details.description}
                        url={canonical || preview || "not valid url"}
                        updateMilestone={() => updateMilestone("shared")}
                      />

                    </div>
                  </div>
                </CardContent>
              </Card>

              {isLoadingMarker && !isLoading && isFetching && (
                <div className="flex justify-center my-4">
                  <Loader size={20} className="animate-spin text-zinc-500 dark:text-zinc-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div ref={observer} className="h-10" />

      {isLoading && items.length === 0 && (
        <div className="text-center text-zinc-500 dark:text-zinc-400 mt-6">
          Initializing mission...
        </div>
      )}

      {searchParams.q && !items.length && !isLoading && (
        <p className="text-zinc-500 dark:text-zinc-400">
          No results found for `{searchParams.q}`.
        </p>
      )}
    </main>
  );
}
