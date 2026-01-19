import { create } from "zustand";
import * as Calendar from "expo-calendar";

export const useCalendar = create((set) => ({
  setup: false,
  calendars: [],
  eventUpdated: false,
  permissionStatus: "",
  updateEvents: (bool: boolean) => set({ eventUpdated: bool }),
  completeSetup: () => set({ setup: true }),
  setAllCalendars: (calendars: Calendar.Calendar[]) => set({ calendars }),
  setPermissionStatus: (status: string) => set({ permissionStatus: status }),
  // Old
  // bears: 0,
  // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 }),
  // updateBears: (newBears) => set({ bears: newBears }),
}));
