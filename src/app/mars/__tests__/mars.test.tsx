import { render, screen } from '@testing-library/react';
import MarsPage from '@/app/mars/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

describe('Mars', () => {
  it('renders without crashing', () => {
    renderWithProviders(<MarsPage />);
    
    expect(screen.getByTestId("starfield")).toBeInTheDocument();
    expect(screen.getByTestId("mars-dashboard")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /mars rover mission dashboard/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Visualize and explore photo data from NASA's Curiosity, Opportunity, and Spirit rovers./i
      )
    ).toBeInTheDocument();
  });
});