import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export interface MarsPhoto {
  id: number;
  img_src: string;
  earth_date: string;
  sol: number;
  camera: {
    name: string;
    full_name: string;
  };
  rover: {
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
}

interface FetchMarsPhotosParams {
  rover: string;
  sol: number;
  camera?: string;
  page?: number;
  earth_date?: string;
}

const fetchMarsPhotos = async ({
  rover,
  sol,
  camera,
  page = 1,
  earth_date,
}: FetchMarsPhotosParams): Promise<MarsPhoto[]> => {
  const params: Record<string, string | number> = { sol };
  if (camera && camera !== "all") params.camera = camera;
  if (earth_date) params.earth_date = earth_date;

  console.log("Fetching Mars photos with params:", params)
  const res = await apiClient.get<{ data: { photos: MarsPhoto[] } }>(`/mars-rover/${rover}/photos`, { params });
  console.log("Fetched Mars photos:", res.data.data);
  return res.data.data.photos || [];
};

export const useMarsPhotos = ({ rover, sol, camera, page = 1 }: FetchMarsPhotosParams) => {
  return useQuery<MarsPhoto[]>({
    queryKey: ["marsPhotos", rover, sol, camera, page],
    queryFn: () => fetchMarsPhotos({ rover, sol, camera, page }),
    staleTime: 1000 * 60 * 5,
 });
};

export const useRefetchMarsPhotos = (params: FetchMarsPhotosParams) => {
  return useMarsPhotos(params).refetch;
};
