import { act } from "@testing-library/react";
import { useMilestonesStore } from "@/stores/useMilestonesStore";

type milestonesStoreType = typeof useMilestonesStore;

beforeEach(() => {
  const { resetMilestones } = useMilestonesStore.getState();
  act(() => {
    resetMilestones();
  });
  localStorage.clear();
});

describe("useMilestonesStore", () => {
  it("has initial state with all milestones false", () => {
    const { milestones } = useMilestonesStore.getState();
    expect(milestones).toEqual({
      searched: false,
      viewed: false,
      downloaded: false,
      shared: false,
    });
  });

  it("updates a specific milestone", () => {
    act(() => {
      useMilestonesStore.getState().updateMilestone("searched");
    });

    const { milestones } = useMilestonesStore.getState();
    expect(milestones.searched).toBe(true);
    expect(milestones.viewed).toBe(false);
  });

  it("resets all milestones to false", () => {
    act(() => {
      useMilestonesStore.getState().updateMilestone("searched");
      useMilestonesStore.getState().updateMilestone("downloaded");
    });

    act(() => {
      useMilestonesStore.getState().resetMilestones();
    });

    const { milestones } = useMilestonesStore.getState();
    expect(milestones).toEqual({
      searched: false,
      viewed: false,
      downloaded: false,
      shared: false,
    });
  });

  it("persists state to localStorage", () => {
    act(() => {
      useMilestonesStore.getState().updateMilestone("viewed");
    });

    const stored = localStorage.getItem("search_milestones");
    expect(stored).toContain('"viewed":true');
  });

  it("rehydrates state from localStorage", async () => {
    localStorage.setItem(
      "search_milestones",
      JSON.stringify({
        state: {
          milestones: {
            searched: true,
            viewed: false,
            downloaded: false,
            shared: false,
          },
        },
        version: 0,
      })
    );

    await (useMilestonesStore as unknown as milestonesStoreType).persist.rehydrate();

    const { milestones } = useMilestonesStore.getState();
    expect(milestones.searched).toBe(true);
  });
});
