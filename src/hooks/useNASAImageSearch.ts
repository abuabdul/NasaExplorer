import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export interface SearchParams {
  q: string;
  media_type?: string;
  year_start?: string;
  year_end?: string;
  page?: number;
  page_size?: number;
}

export interface NasaItemData {
  center: string;
  date_created: string;
  description: string;
  keywords?: string[];
  media_type: "image" | "video" | "audio";
  nasa_id: string;
  title: string;
}

export interface NasaItemLink {
  href: string;
  rel: "preview" | "alternate" | "captions" | "canonical";
  render?: "image";
  width?: number;
  height?: number;
  size?: number;
}

export interface NasaSearchItem {
  href: string;
  data: NasaItemData[];
  links?: NasaItemLink[];
}

export interface NasaSearchCollection {
      version: string;
      href: string;
      items: NasaSearchItem[];
      metadata: {
        total_hits: number;
      };
      links?: {
        rel: string;
        prompt?: string;
        href: string;
      }[];
}

export interface NasaSearchResponse {
  data: {
    collection: NasaSearchCollection;
  };
}

export const fetchNASAItems = async (params: SearchParams): Promise<NasaSearchCollection> => {
  const res = await apiClient.get<{ data: NasaSearchResponse["data"] }>("/image-library/search", {
    params,
  });
  return res.data.data.collection || [];
};

export const useNASAImageSearch = (params: SearchParams) => {
  return useQuery<NasaSearchCollection>({
    queryKey: ["nasa-search", params],
    queryFn: () => fetchNASAItems(params),
    enabled: !!params.q,
    staleTime: 1000 * 60 * 10,
  });
};
