import { create } from "zustand";
import { persist } from "zustand/middleware";

type MilestoneKey = "searched" | "viewed" | "downloaded" | "shared";

interface MilestonesState {
  milestones: Record<MilestoneKey, boolean>;
  updateMilestone: (key: MilestoneKey) => void;
  resetMilestones: () => void;
}

export const useMilestonesStore = create<MilestonesState>()(
  persist(
    (set) => ({
      milestones: {
        searched: false,
        viewed: false,
        downloaded: false,
        shared: false,
      },
      updateMilestone: (key) =>
        set((state) => ({
          milestones: { ...state.milestones, [key]: true },
        })),
      resetMilestones: () =>
        set(() => ({
          milestones: {
            searched: false,
            viewed: false,
            downloaded: false,
            shared: false,
          },
        })),
    }),
    {
      name: "search_milestones",
    }
  )
);