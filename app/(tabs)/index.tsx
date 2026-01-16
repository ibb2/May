import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Platform } from "react-native";
import * as Calendar from "expo-calendar";
import { add, startOfToday } from "date-fns";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [events, setEvents] = useState<Calendar.Event[]>([]);

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

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT,
        );
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text>Welcome User</Text>
        <Text>
          You have <Text style={{ fontWeight: "bold" }}>4</Text> Events today
        </Text>
      </View>
      <View style={styles.content}>
        {events.length > 0 && events !== undefined && (
          <View style={styles.events}>
            {events.map((event) => (
              <View key={event.id} style={styles.event}>
                <Text>{event.title}</Text>
              </View>
            ))}
          </View>
        )}
        <Button title="Create a new calendar" onPress={createCalendar} />
        <Button title="List calendars" onPress={listCalendars} />
        <Button title="List events" onPress={listEvents} />
        <Button title="Create a new event" onPress={createCalendarEvent} />
      </View>
    </SafeAreaView>
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
