
"use client";

import Image from "next/image";
import { useMarsPhotos, MarsPhoto } from "@/hooks/useMarsRovers";
import { Skeleton } from "@/components/ui/skeleton";
type Props = {
  rover: string;
  sol: number;
  camera: string;
  page?: number;
  earth_date?: string;
};

export default function RoverGallery({ rover, sol, camera, page = 1, earth_date }: Props) {
  const { data: photos = [], isLoading, isError } = useMarsPhotos({
    rover,
    sol,
    camera,
    page,
    earth_date,
  });

  if (isLoading) return <div className="text-zinc-300">Loading photos...</div>;
  if (isError) return <div className="text-red-500">Failed to load photos.</div>;
  if (!Array.isArray(photos) || photos.length === 0) return <div>No photos for this selection.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {photos.map((photo: MarsPhoto) => (
        // <Image
        //   key={photo.id}
        //   src={photo.img_src.replace(/^http:/, 'https:')} 
        //   alt={`Rover - ${photo.rover.name}, Camera - ${photo.camera.full_name}`}
        //   width={1024}
        //   height={1024}
        //   layout="intrinsic" 
        //   className="rounded shadow-lg border border-zinc-800 hover:scale-105 transition-transform"
        // />

        <img
          key={photo.id}
          src={`/api/image-proxy?url=${encodeURIComponent(photo.img_src.replace(/^http:/, 'https:'))}`}
          alt={`Rover - ${photo.rover.name}, Camera - ${photo.camera.full_name}`}
          width={1024}
          height={1024}
          className="rounded shadow-lg border border-zinc-800 hover:scale-105 transition-transform"
        />
      ))}
    </div>
  );
}