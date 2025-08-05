import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

interface FetchMarsPhotosParams {
  sol: number;
  camera?: string;
  page?: number;
  earth_date?: string;
}

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

const fetchMarsRoverPhotos = async (rover: string, params: FetchMarsPhotosParams): Promise<MarsPhoto[]> => {
  const res = await apiClient.get<{ data: { photos: MarsPhoto[] } }>(`/mars-rover/${rover}/photos`, { params });
  return res.data.data.photos || [];
};

export const useMarsRoverPhotos = (
  rover: string,
  params: FetchMarsPhotosParams) => {
  return useQuery<MarsPhoto[]>({
    queryKey: ["mars-photos", rover, params],
    queryFn: () => fetchMarsRoverPhotos(rover, params),
    enabled: !!rover,
    staleTime: 1000 * 60 * 10,
  });
};
