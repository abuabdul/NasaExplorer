import apiClient from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

export interface APODData {
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: "image" | "video";
  title: string;
  url: string;
  copyright?: string;
}

const fetchAPOD = async (date?: string): Promise<APODData> => {
  const endpoint = date ? `/apod?date=${date}` : "/apod";
  const response = await apiClient.get<{ data: APODData }>(endpoint);
  return response.data.data;
};

export const useAPOD = (date?: string) => {
  return useQuery<APODData>({
    queryKey: ["apod", date],
    queryFn: () => fetchAPOD(date),
    staleTime: 1000 * 60 * 5,
  });
};

export const useRefetchAPOD = (date?: string) => {
  return useAPOD(date).refetch();
}

export const getRandomDate = (): string => {
    const start = new Date(1995, 5, 16);
    const end = new Date();
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    const randomDate = new Date(randomTime);
    return randomDate.toISOString().split("T")[0];
};

