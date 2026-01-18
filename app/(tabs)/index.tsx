import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Platform } from "react-native";
import * as Calendar from "expo-calendar";
import {
  add,
  format,
  getDate,
  getDay,
  getTime,
  getWeek,
  startOfToday,
} from "date-fns";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function HomeScreen() {
  const [events, setEvents] = useState<Calendar.Event[]>([]);
  const [calendars, setCalendars] = useState<Calendar.Calendar[]>([]);

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
      const startDate = startOfToday();
      const endDate = add(startDate, { days: 1 });
      const events = await Calendar.getEventsAsync(
        ["AB499137-F401-4F65-B90A-3E6A02C8A16C"],
        startDate,
        endDate,
      );
      setEvents(events);
    })();
  }, []);

  return (
    <View
      className="flex-1 flex-col items-center justify-around"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View style={styles.header}>
        <Text style={{ fontSize: 16, fontWeight: "500" }}>Welcome User</Text>
        <Text style={{ fontSize: 20, fontWeight: "300" }}>
          You have <Text style={{ fontWeight: "600" }}>{events?.length}</Text>{" "}
          Events today
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{getDate(new Date())}</Text>
          <Text style={styles.date}>{getDayAsString()}</Text>
        </View>
        <View style={styles.eventsContainer}>
          {events.length > 0 && events !== undefined ? (
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
                  <Text style={{ fontSize: 16, fontWeight: "500" }}>
                    {event.title}
                  </Text>
                  <Text className="text-muted">
                    {format(event.startDate, "h:mm b")}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text>You have no events today</Text>
          )}
        </View>
      </View>
      <Button title="List events" onPress={listEvents} />
      <Button title="List calendars" onPress={listCalendars} />
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
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  dateContainer: {
    alignItems: "center",
    padding: 16,
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
