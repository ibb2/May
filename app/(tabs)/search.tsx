import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Platform } from "react-native";
import * as Calendar from "expo-calendar";
import { add, startOfToday } from "date-fns";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePathname, useRouter } from "expo-router";
import { useCalendar } from "@/stores/use-calendar";

export default function SearchScreen() {
  /**
   * This is a dummy screen, whose sole purpose is to immediately open the native calendar modal.
   */
  const router = useRouter();
  const pathname = usePathname();

  const [events, setEvents] = useState<Calendar.Event[]>([]);
  const [opened, onOpened] = useState<boolean>(false);

  // Store
  const updateEvents = useCalendar((state) => state.updateEvents);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      console.log("pathname", pathname);
      if (status === "granted" && pathname === "/search") {
        const results = await Calendar.createEventInCalendarAsync();

        if (results.action) {
          updateEvents(true);
          router.push("/(tabs)");
        }
      }
    })();
  }, [pathname, router, router.push]);

  return <SafeAreaView style={styles.container}></SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  events: {
    alignItems: "center",
  },
  event: {
    paddingBottom: 4,
  },
});
