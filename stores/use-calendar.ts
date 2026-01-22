import { create } from "zustand";
import * as Calendar from "expo-calendar";
import { createJSONStorage, persist } from "zustand/middleware";
import Storage from "expo-sqlite/kv-store";

export const useCalendar = create()(
  persist(
    (set) => ({
      setup: false,
      calendars: [],
      eventUpdated: false,
      permissionStatus: "",
      updateEvents: (bool: boolean) => set({ eventUpdated: bool }),
      completeSetup: () => set({ setup: true }),
      setAllCalendars: (calendars: Calendar.Calendar[]) => set({ calendars }),
      setPermissionStatus: (status: string) =>
        set({ permissionStatus: status }),
      // Old
      // bears: 0,
      // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
      // removeAllBears: () => set({ bears: 0 }),
      // updateBears: (newBears) => set({ bears: newBears }),
    }),
    {
      name: "calendar-storage",
      // partialize: (state) => ({ calendars: state.calendars }),
      storage: createJSONStorage(() => Storage),
      onRehydrateStorage: (state) => {
        console.log("hydration starts");

        // optional
        return (state, error) => {
          if (error) {
            console.log("an error happened during hydration", error);
          } else {
            console.log("Length of calendars, ", state.calendars.length);
            console.log("hydration finished");
          }
        };
      },
    },
  ),
);
