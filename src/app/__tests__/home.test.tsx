import HomePage from "@/app/page";
import { QueryClient, QueryClientProvider, UseQueryResult } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import * as useAPODModule from "@/hooks/useAPOD";

jest.mock("@/components/Layout/Starfield", () => {
  const MockStarfield = () => <div data-testid="starfield" />;
  MockStarfield.displayName = "MockStarfield";
  return MockStarfield;
});

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

describe("Home", () => {

  it("renders without crashing in loading state", () => {

    jest.spyOn(useAPODModule, "useAPOD").mockReturnValue({
      data: null,
      isLoading: true,
      isFetching: false,
      isError: false,
    } as unknown as UseQueryResult<useAPODModule.APODData, Error>);

    jest.spyOn(useAPODModule, "getRandomDate").mockReturnValue("2023-01-01");

    renderWithProviders(<HomePage />);

    expect(screen.getByTestId("starfield")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /get astronomy picture of the day/i })).toBeInTheDocument();
    expect(screen.getByText(/space explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/preparing data from the cosmos.../i)).toBeInTheDocument();
  });

  it("renders without crashing with errors", () => {

    jest.spyOn(useAPODModule, "useAPOD").mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      isError: true,
    } as unknown as UseQueryResult<useAPODModule.APODData, Error>);
    jest.spyOn(useAPODModule, "getRandomDate").mockReturnValue("2023-01-01");
    
    renderWithProviders(<HomePage />);

    expect(screen.getByTestId("starfield")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /get astronomy picture of the day/i })).toBeInTheDocument();
    expect(screen.getByText(/space explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/lost connection to nasa servers./i)).toBeInTheDocument();
  });

  it("renders without crashing with data", () => {

    jest.spyOn(useAPODModule, "useAPOD").mockReturnValue({
      data: {
        title: "Test APOD",
        url: "https://example.com/image.jpg",
        hdurl: "https://example.com/image_hd.jpg",
        media_type: "image",
        explanation: "This is a test explanation.",
        copyright: "NASA",
        date: "2023-01-01",
      } as useAPODModule.APODData,
      isLoading: false,
      isFetching: false,
      isError: false,
    } as unknown as UseQueryResult<useAPODModule.APODData, Error>);
    jest.spyOn(useAPODModule, "getRandomDate").mockReturnValue("2023-01-01");
    
    renderWithProviders(<HomePage />);

    expect(screen.getByTestId("starfield")).toBeInTheDocument();
    expect(screen.getByTestId("home-card")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /get astronomy picture of the day/i })).toBeInTheDocument();
    expect(screen.getByText(/space explorer/i)).toBeInTheDocument();
    expect(screen.getByText(/mission log/i)).toBeInTheDocument();
  });
});