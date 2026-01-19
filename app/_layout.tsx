import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Redirect, Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import * as Calendar from "expo-calendar";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { useCalendar } from "@/stores/use-calendar";
import { Button, Text, View } from "react-native";
import { Icon } from "expo-router/build/native-tabs";
import { SymbolView } from "expo-symbols";
import { HeaderButton } from "@react-navigation/elements";
import { add, startOfToday } from "date-fns";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  // States
  const [count, setCount] = useState(0);
  const [events, setEvents] = useState<Calendar.Event[]>([]);

  // Store
  const eventUpdated = useCalendar((state) => state.eventUpdated);
  const updateEvents = useCalendar((state) => state.updateEvents);
  const setup = useCalendar((state) => state.setup);
  const calendars = useCalendar((state) => state.calendars);

  const startDate = startOfToday();
  const endDate = add(startDate, { days: 1 });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const eventsPerCalendar = await Promise.all(
          calendars.map((calendar: Calendar.Calendar) =>
            Calendar.getEventsAsync([calendar.id], startDate, endDate),
          ),
        );

        if (cancelled) return;

        setEvents(eventsPerCalendar.flat());
        updateEvents(false);

        console.log("Calendars and events fetched successfully");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [eventUpdated, updateEvents, startDate, endDate]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              title: "My home",
              headerStyle: {
                backgroundColor: colorScheme === "dark" ? "#18181B" : "#FCFCFC",
              },
              headerShadowVisible: false,
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerTitle: (props) => (
                <View className="flex items-center">
                  <Text className=" text-muted">Welcome User</Text>
                  <Text className="text-lg font-normal dark:text-foreground">
                    You have{" "}
                    <Text className="text-lg font-semibold dark:text-foreground">
                      {events?.length}
                    </Text>{" "}
                    Events today
                  </Text>
                </View>
              ),
              headerLeft: () => (
                <HeaderButton
                  onPress={() => router.push("/(modal)/settings-home")}
                >
                  <SymbolView
                    name="gear"
                    type="monochrome"
                    tintColor="#000"
                    className="m-0"
                    size={24}
                  />
                </HeaderButton>
              ),
              headerRight: () => (
                <HeaderButton>
                  <SymbolView
                    name="plus"
                    type="monochrome"
                    tintColor="#000"
                    className="m-0"
                    size={24}
                  />
                </HeaderButton>
              ),
            }}
          />
          <Stack.Screen name="setup" options={{ headerShown: false }} />
          <Stack.Screen
            name="(modal)"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
