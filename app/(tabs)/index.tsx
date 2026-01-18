import { useCalendar } from "@/stores/use-calendar";
import {
  add,
  format,
  getDate,
  getDay,
  startOfToday
} from "date-fns";
import * as Calendar from "expo-calendar";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import {
  useSafeAreaInsets
} from "react-native-safe-area-context";

export default function HomeScreen() {
  const [events, setEvents] = useState<Calendar.Event[]>([]);
  const [calendars, setCalendars] = useState<Calendar.Calendar[]>([]);

  // Store
  const eventUpdated = useCalendar((state) => state.eventUpdated);
  const updateEvents = useCalendar((state) => state.updateEvents);

  const startDate = startOfToday();
  const endDate = add(startDate, { days: 1 });

  async function listEvents() {
    const startDate = startOfToday();
    const endDate = add(startDate, { days: 1 });
    const events = await Calendar.getEventsAsync(
      ["AB499137-F401-4F65-B90A-3E6A02C8A16C"],
      startDate,
      endDate,
    );
    console.log("Events");
    console.log(events);
    setEvents(events);
  }

  async function getDayAsString() {
    const d = getDay(new Date());
    let day = "Monday";

    switch (d) {
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
        break;
      case 7:
        day = "Sunday";
        break;
    }

    return day;
  }

  const insets = useSafeAreaInsets();

  const getEvents = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === "granted") {
      // Interval set to every 1 second for now, performance is stable.
      const events = await Calendar.getEventsAsync(
        ["AB499137-F401-4F65-B90A-3E6A02C8A16C"],
        startDate,
        endDate,
      );
      setEvents(events);
      updateEvents(false);
      // console.log("Fetching events");
    }
  };
  getEvents();

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT,
        );
        setCalendars(calendars);
        console.log("Here are all your calendars:");
        console.log({ calendars });
      }
    })();

    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted" && eventUpdated) {
        // Interval set to every 1 second for now, performance is stable.
        const events = await Calendar.getEventsAsync(
          ["AB499137-F401-4F65-B90A-3E6A02C8A16C"],
          startDate,
          endDate,
        );
        setEvents(events);
        updateEvents(false);
        // console.log("Fetching events");
      }
    })();
  }, [eventUpdated, updateEvents]);

  return (
    <View
      className="flex-1 flex-col items-center justify-around dark:bg-[#18181B]"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View style={styles.header}>
        <Text className="text-lg dark:text-muted">Welcome User</Text>
        <Text className="text-xl font-normal dark:text-foreground">
          You have <Text className="text-xl font-semibold dark:text-foreground">{events?.length}</Text>{" "}
          Events today
        </Text>
      </View>
      <View className="flex-1 items-center justify-center">
        <View className="items-center p-16">
          <Text style={styles.date} className="text-foreground -m-2">{getDate(new Date())}</Text>
          <Text style={styles.date} className="text-foreground">{getDayAsString()}</Text>
        </View>
        <View style={styles.eventsContainer}>
          {events.length > 0 && events !== undefined && (
            <View style={styles.events}>
              {events.map((event) => (
                <View key={event.id} style={styles.event}>
                  <View
                    style={{
                      backgroundColor:
                        calendars.find((c) => c.id === event.calendarId)
                          ?.color || "red",
                      width: 10,
                      height: 10,
                      borderRadius: 100,
                    }}
                  ></View>
                  <Text style={{ fontSize: 16, fontWeight: "500" }} className="text-foreground">
                    {event.title}
                  </Text>
                  <Text className="text-muted">
                    {format(event.startDate, "h:mm b")}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === "ios"
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: "Expo Calendar" };
  const newCalendarID = await Calendar.createCalendarAsync({
    title: "Expo Calendar",
    color: "blue",
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: "internalCalendarName",
    ownerAccount: "personal",
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
  console.log(`Your new calendar ID is: ${newCalendarID}`);
}

async function listCalendars() {
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT,
  );

  console.log("Here are all your calendars:");
  console.log({ calendars });
}

async function createCalendarEvent() {
  Calendar.createEventInCalendarAsync();
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "column",
    alignItems: "center",
    alignContent: "center",
  },
  date: {
    fontSize: 60,
    fontWeight: "800",
  },
  eventsContainer: {
    alignItems: "center",
    padding: 16,
  },
  events: {
    alignItems: "center",
  },
  event: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
    paddingBottom: 4,
  },
});
