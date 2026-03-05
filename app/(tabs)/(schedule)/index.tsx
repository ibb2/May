import AgendaComponent from "@/components/schedule/agenda";
import { useCalendar } from "@/stores/use-calendar";
import { HeaderButton } from "@react-navigation/elements";
import {
  addDays,
  endOfDay,
  format,
  isSameDay,
  startOfDay,
  startOfToday,
} from "date-fns";
import * as Calendar from "expo-calendar";
import { Redirect, Stack, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useEffect, useMemo, useState } from "react";
import { Text, useColorScheme, View } from "react-native";

function toDate(value: string | Date | undefined) {
  if (!value) return new Date();
  return value instanceof Date ? value : new Date(value);
}

export default function ScheduleScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const [visibleDate, setVisibleDate] = useState(startOfToday());
  const [events, setEvents] = useState<Calendar.Event[]>([]);

  const eventUpdated = useCalendar((state) => state.eventUpdated);
  const updateEvents = useCalendar((state) => state.updateEvents);
  const setup = useCalendar((state) => state.setup);
  const calendars = useCalendar((state) => state.calendars);

  const startDate = startOfDay(addDays(selectedDate, -90));
  const endDate = endOfDay(addDays(selectedDate, 180));

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        if (!cancelled) setEvents([]);
        return;
      }

      const eventsPerCalendar = await Promise.all(
        calendars.map((calendar: Calendar.Calendar) =>
          Calendar.getEventsAsync([calendar.id], startDate, endDate),
        ),
      );

      if (cancelled) return;

      setEvents(eventsPerCalendar.flat());
      updateEvents(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [calendars, endDate, eventUpdated, startDate, updateEvents]);

  const selectedDayCount = useMemo(
    () =>
      events.filter((event) => isSameDay(toDate(event.startDate), visibleDate))
        .length,
    [events, visibleDate],
  );

  if (!setup) return <Redirect href={"/setup"} />;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Schedule",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#18181B" : "#FCFCFC",
          },
          headerTitle: () => (
            <View className="items-center">
              <Text className="text-muted">{format(visibleDate, "MMMM yyyy")}</Text>
              <Text className="text-lg dark:text-white">
                <Text className="font-semibold">{selectedDayCount}</Text> events on{" "}
                {format(visibleDate, "MMM d")}
              </Text>
            </View>
          ),
          headerLeft: () => (
            <HeaderButton onPress={() => router.push("/(modal)/settings-home")}>
              <SymbolView
                name="gear"
                type="monochrome"
                tintColor={colorScheme === "dark" ? "#fff" : "#000"}
                size={24}
              />
            </HeaderButton>
          ),
          headerRight: () => (
            <HeaderButton>
              <SymbolView
                name="plus"
                type="monochrome"
                tintColor={colorScheme === "dark" ? "#fff" : "#000"}
                size={24}
              />
            </HeaderButton>
          ),
        }}
      />

      <View className="flex-1 bg-[#FCFCFC] dark:bg-[#18181B]">
        <AgendaComponent
          events={events}
          calendars={calendars}
          selectedDate={selectedDate}
          onChangeDate={setSelectedDate}
          onVisibleDateChange={setVisibleDate}
        />
      </View>
    </>
  );
}
