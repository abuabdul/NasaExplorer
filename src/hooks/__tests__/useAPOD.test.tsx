import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { useAPOD, fetchAPOD, getRandomDate, APODData } from "@/hooks/useAPOD";
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

describe("useAPOD hook and helpers", () => {
  const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

  const mockData: APODData = {
    date: "2023-01-01",
    explanation: "Test explanation",
    media_type: "image",
    title: "Test Title",
    url: "https://example.com/image.jpg",
    hdurl: "https://example.com/image_hd.jpg",
    copyright: "NASA",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetchAPOD fetches data correctly without date", async () => {
    mockedApiClient.get.mockResolvedValueOnce({ data: { data: mockData } });

    const data = await fetchAPOD();

    expect(mockedApiClient.get).toHaveBeenCalledWith("/apod");
    expect(data).toEqual(mockData);
  });

  it("fetchAPOD fetches data correctly with date", async () => {
    mockedApiClient.get.mockResolvedValueOnce({ data: { data: mockData } });

    const date = "2023-01-01";
    const data = await fetchAPOD(date);

    expect(mockedApiClient.get).toHaveBeenCalledWith(`/apod?date=${date}`);
    expect(data).toEqual(mockData);
  });

  it("useAPOD hook returns data", async () => {
    mockedApiClient.get.mockResolvedValueOnce({ data: { data: mockData } });

    const { result } = renderHook(() => useAPOD("2023-01-01"), {
        wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });

  it("getRandomDate returns a date string in the correct format", () => {
    const dateStr = getRandomDate();
    expect(typeof dateStr).toBe("string");
    expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
