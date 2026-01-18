import { useCalendar } from "@/stores/use-calendar";
import { add, format, getDate, getDay, set, startOfToday } from "date-fns";
import * as Calendar from "expo-calendar";
import { Redirect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [events, setEvents] = useState<Calendar.Event[]>([]);
  const [calendars, setCalendars] = useState<Calendar.Calendar[]>([]);

  // Store
  const eventUpdated = useCalendar((state) => state.eventUpdated);
  const updateEvents = useCalendar((state) => state.updateEvents);
  const setup = useCalendar((state) => state.setup);

  const startDate = startOfToday();
  const endDate = add(startDate, { days: 1 });

  function getDayAsString() {
    const d = getDay(new Date());
    switch (d) {
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      case 0:
        return "Sunday"; // getDay returns 0 for Sunday
      default:
        return "Monday";
    }
  }

  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const [calendars, events] = await Promise.all([
          Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT),
          Calendar.getEventsAsync(
            ["AB499137-F401-4F65-B90A-3E6A02C8A16C"],
            startDate,
            endDate,
          ),
        ]);

        setCalendars(calendars);
        setEvents(events);
        updateEvents(false);

        console.log("Calendars and events fetched successfully");
      }
    })();
  }, [eventUpdated, updateEvents, startDate, endDate]);

  if (!setup) return <Redirect href={"/setup"} />;

  return (
    <View
      className="flex-1 flex-col items-center justify-around bg-[#FCFCFC] dark:bg-[#18181B]"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View className="flex items-center">
        <Text className="text-lg text-muted">Welcome User</Text>
        <Text className="text-xl font-normal dark:text-foreground">
          You have{" "}
          <Text className="text-xl font-semibold dark:text-foreground">
            {events?.length}
          </Text>{" "}
          Events today
        </Text>
      </View>
      <View className="flex-1 items-center justify-center gap-8">
        <View className="items-center gap-2">
          <Text className="text-2xl text-muted">{getDayAsString()}</Text>
          <Text className="text-9xl text-foreground">
            {getDate(new Date())}
          </Text>
        </View>
        {events.length > 0 && events !== undefined && (
          <View className="gap-2">
            {events.map((event) => (
              <View
                key={event.id}
                className="flex flex-row items-center justify-center gap-4"
              >
                <View
                  style={{
                    backgroundColor:
                      calendars.find((c) => c.id === event.calendarId)?.color ||
                      "red",
                    width: 10,
                    height: 10,
                    borderRadius: 100,
                  }}
                ></View>
                <Text
                  style={{ fontSize: 16, fontWeight: "500" }}
                  className="text-foreground"
                >
                  {event.title}
                </Text>
                <Text className="text-muted">
                  {format(event.startDate, "h:mm a")}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
