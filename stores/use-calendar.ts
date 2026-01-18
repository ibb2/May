import { create } from "zustand";

export const useCalendar = create((set) => ({
  eventUpdated: false,
  updateEvents: (bool: boolean) => set({ eventUpdated: bool }),
  // Old
  // bears: 0,
  // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 }),
  // updateBears: (newBears) => set({ bears: newBears }),
}));
