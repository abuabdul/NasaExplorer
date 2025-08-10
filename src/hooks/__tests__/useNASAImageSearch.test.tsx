import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { fetchNASAItems, useNASAImageSearch, NasaSearchCollection, SearchParams } from "@/hooks/useNASAImageSearch";
import apiClient from "@/lib/apiClient";

jest.mock("@/lib/apiClient");

import React from "react";

const createWrapper = () => {
  const queryClient = new QueryClient();
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "QueryClientTestWrapper";
  return Wrapper;
};

describe("useNASAImageSearch and fetchNASAItems", () => {
  const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

  const mockCollection: NasaSearchCollection = {
    version: "1.0",
    href: "https://images-api.nasa.gov/search",
    items: [
      {
        href: "https://images-assets.nasa.gov/image/abc123",
        data: [
          {
            center: "JPL",
            date_created: "2023-01-01T00:00:00Z",
            description: "Test image description",
            keywords: ["Mars", "Rover"],
            media_type: "image",
            nasa_id: "abc123",
            title: "Mars Rover Image",
          },
        ],
        links: [
          {
            href: "https://images-assets.nasa.gov/image/abc123/preview.jpg",
            rel: "preview",
            render: "image",
          },
        ],
      },
    ],
    metadata: {
      total_hits: 1,
    },
  };

  const params: SearchParams = {
    q: "mars",
    media_type: "image",
    year_start: "2020",
    page: 1,
    page_size: 10,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetchNASAItems fetches and returns collection", async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: { data: { collection: mockCollection } },
    });

    const data = await fetchNASAItems(params);

    expect(mockedApiClient.get).toHaveBeenCalledWith("/image-library/search", { params });
    expect(data).toEqual(mockCollection);
  });

  it("useNASAImageSearch hook returns data", async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: { data: { collection: mockCollection } },
    });

    const { result } = renderHook(() => useNASAImageSearch(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockCollection);
  });

  it("useNASAImageSearch hook does not run when q is empty", async () => {
    const emptyParams: SearchParams = { ...params, q: "" };

    const { result } = renderHook(() => useNASAImageSearch(emptyParams), {
      wrapper: createWrapper(),
    });

    expect(mockedApiClient.get).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });
});
