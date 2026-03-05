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
import { Pressable, Text, useColorScheme, View } from "react-native";

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

  async function openNativeCreateEvent() {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== "granted") return;

    const result = await Calendar.createEventInCalendarAsync();
    if (result?.id) updateEvents(true);
  }

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
              <Text className="text-xs text-zinc-500">{format(visibleDate, "MMMM yyyy")}</Text>
              <Text className="text-lg dark:text-white">
                <Text className="font-semibold">{selectedDayCount}</Text> events on{" "}
                {format(visibleDate, "MMM d")}
              </Text>
            </View>
          ),
          headerLeft: () => (
            <HeaderButton onPress={() => router.push("/(modal)/settings-home")}>
              <View
                className="h-9 w-9 items-center justify-center rounded-full"
                style={{
                  backgroundColor: colorScheme === "dark" ? "#27272A" : "#F4F4F5",
                }}
              >
                <SymbolView
                  name="gear"
                  type="monochrome"
                  tintColor={colorScheme === "dark" ? "#fff" : "#000"}
                  size={18}
                />
              </View>
            </HeaderButton>
          ),
          headerRight: () => (
            <Pressable
              className="flex-row items-center gap-1 rounded-full px-3 py-2"
              style={{
                backgroundColor: colorScheme === "dark" ? "#27272A" : "#F4F4F5",
              }}
              onPress={openNativeCreateEvent}
            >
              <SymbolView
                name="plus"
                type="monochrome"
                tintColor={colorScheme === "dark" ? "#fff" : "#000"}
                size={14}
              />
              <Text className="text-sm font-medium text-zinc-800 dark:text-zinc-100">Add</Text>
            </Pressable>
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
