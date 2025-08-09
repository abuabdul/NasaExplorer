import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import SearchPage from "@/app/search/page";

jest.mock("@/components/Layout/Starfield", () => {
  const MockStarfield = () => <div data-testid="starfield" />;
  MockStarfield.displayName = "MockStarfield";
  return MockStarfield;
});

jest.mock('@/hooks/useNASAImageSearch', () => ({
  useNASAImageSearch: jest.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
    isFetching: false,
  })),
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}

describe('Search', () => {
  it('renders without crashing', () => {
    renderWithProviders(<SearchPage />);

    expect(screen.getByTestId("starfield")).toBeInTheDocument();
    expect(screen.getByTestId("search-page")).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/search nasa's media library.../i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
    expect(screen.getByText(/try searching for mars, curiosity, saturn, or moon.../i)).toBeInTheDocument();
  });
});