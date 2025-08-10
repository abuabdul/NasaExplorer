import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { fetchMarsRoverPhotos, useMarsRoverPhotos, MarsPhoto } from "@/hooks/useMarsRoverPhotos";
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

describe("useMarsRoverPhotos hook and helpers", () => {
  const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

  const mockPhotos: MarsPhoto[] = [
    {
      id: 12345,
      img_src: "https://mars.nasa.gov/image.jpg",
      earth_date: "2023-01-01",
      sol: 1000,
      camera: {
        name: "FHAZ",
        full_name: "Front Hazard Avoidance Camera",
      },
      rover: {
        name: "Curiosity",
        landing_date: "2012-08-06",
        launch_date: "2011-11-26",
        status: "active",
      },
    },
  ];

  const roverName = "curiosity";
  const params = { sol: 1000, page: 1 };
  

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetchMarsRoverPhotos fetches and returns photos", async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: { data: { photos: mockPhotos } },
    });

    const data = await fetchMarsRoverPhotos(roverName, params);

    expect(mockedApiClient.get).toHaveBeenCalledWith(`/mars-rover/${roverName}/photos`, { params });
    expect(data).toEqual(mockPhotos);
  });

  it("useMarsRoverPhotos hook returns data", async () => {
    mockedApiClient.get.mockResolvedValueOnce({
      data: { data: { photos: mockPhotos } },
    });

    const { result } = renderHook(() => useMarsRoverPhotos(roverName, params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockPhotos);
  });

  it("useMarsRoverPhotos hook does not run when rover name is empty", async () => {
    const { result } = renderHook(() => useMarsRoverPhotos("", params), {
      wrapper: createWrapper(),
    });

    expect(mockedApiClient.get).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });
});
