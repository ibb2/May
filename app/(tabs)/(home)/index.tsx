import { useCalendar } from "@/stores/use-calendar";
import { HeaderButton } from "@react-navigation/elements";
import { add, format, getDate, getDay, startOfToday } from "date-fns";
import * as Calendar from "expo-calendar";
import { Redirect, Stack, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, useColorScheme, View } from "react-native";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const [events, setEvents] = useState<Calendar.Event[]>([]);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const eventUpdated = useCalendar((state) => state.eventUpdated);
  const updateEvents = useCalendar((state) => state.updateEvents);
  const setup = useCalendar((state) => state.setup);
  const calendars = useCalendar((state) => state.calendars);

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
        return "Sunday";
      default:
        return "Monday";
    }
  }

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
      if (status !== "granted") return;

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

  if (!setup) return <Redirect href={"/setup"} />;

  const scrollEnabled = contentHeight > viewportHeight + 8;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Today",
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colorScheme === "dark" ? "#18181B" : "#FCFCFC",
          },
          headerTitle: () => (
            <View className="items-center">
              <Text className="text-xs text-zinc-500">{format(new Date(), "EEEE, MMM d")}</Text>
              <Text className="text-lg dark:text-white">
                <Text className="font-semibold">{events.length}</Text> events today
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

      <ScrollView
        className="flex-1 bg-[#FCFCFC] dark:bg-[#18181B]"
        bounces={scrollEnabled}
        alwaysBounceVertical={false}
        scrollEnabled={scrollEnabled}
        onLayout={(event) => {
          setViewportHeight(event.nativeEvent.layout.height);
        }}
        onContentSizeChange={(_, height) => {
          setContentHeight(height);
        }}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 24,
        }}
      >
        <View className="mb-8 items-center gap-1">
          <Text className="text-2xl text-muted">{getDayAsString()}</Text>
          <Text className="text-8xl text-foreground">{getDate(new Date())}</Text>
        </View>

        {events.length > 0 ? (
          <View className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
            {events.map((event, index) => (
              <View
                key={event.id}
                className="flex-row items-center gap-3 px-4 py-3"
                style={{
                  borderTopWidth: index === 0 ? 0 : 1,
                  borderTopColor: "rgba(228, 228, 231, 0.7)",
                }}
              >
                <View
                  style={{
                    backgroundColor:
                      calendars.find((c) => c.id === event.calendarId)?.color || "#0EA5E9",
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                  }}
                />
                <Text className="flex-1 text-base font-medium text-zinc-900 dark:text-zinc-100" numberOfLines={1}>
                  {event.title || "Untitled"}
                </Text>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                  {format(event.startDate, "h:mm a")}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View className="items-center gap-3 px-6 py-8">
            <Text className="text-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              You are all caught up for today.
            </Text>
            <Text className="text-center text-zinc-500 dark:text-zinc-400">
              Add an event to plan the rest of your day.
            </Text>
            <Pressable onPress={openNativeCreateEvent}>
              <Text className="text-base font-medium text-blue-600">Add an event</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </>
  );
}
