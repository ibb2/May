import { create } from "zustand";

export const useCalendar = create((set) => ({
  setup: false,
  eventUpdated: false,
  permissionStatus: "",
  updateEvents: (bool: boolean) => set({ eventUpdated: bool }),
  setupComplete: () => set({ setup: true }),
  setPermissionStatus: (status: string) => set({ permissionStatus: status }),
  // Old
  // bears: 0,
  // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 }),
  // updateBears: (newBears) => set({ bears: newBears }),
}));
