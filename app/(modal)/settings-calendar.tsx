import { IconSymbol } from "@/components/ui/icon-symbol";
import { useCalendar } from "@/stores/use-calendar";
import * as Calendar from "expo-calendar";
import { router, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Divider, Surface } from "heroui-native";
import { useEffect, useState } from "react";
import { View, Pressable, Text } from "react-native";

export default function CalendarSettings() {
  // Store
  const setAllCalendars = useCalendar((state) => state.setAllCalendars);
  const completeSetup = useCalendar((state) => state.completeSetup);

  const [step, setStep] = useState(0);
  const [calendars, setCalendars] = useState<Calendar.Calendar[]>([]);
  const [selectedCalendars, setSelectedCalendars] = useState<
    Calendar.Calendar[]
  >([]);
  const selectedIds = new Set(selectedCalendars.map((c) => c.id));

  const activeCalendars: Calendar.Calendar[] = useCalendar(
    (state) => state.calendars,
  );
  const [allAvailableCalendars, setAllAvailableCalendars] = useState<
    Calendar.Calendar[]
  >([]);

  function selectCalendar(calendar: Calendar.Calendar) {
    if (selectedCalendars.includes(calendar) && selectedCalendars.length > 0) {
      setSelectedCalendars([]);

      const selectedCalendarPos = activeCalendars.findIndex((c) => {
        return c.id === calendar.id;
      });

      const calendarArrayWithoutSelectedCalendar = selectedCalendars.toSpliced(
        selectedCalendarPos,
        1,
      );

      setSelectedCalendars(calendarArrayWithoutSelectedCalendar);
    } else {
      setSelectedCalendars([...selectedCalendars, calendar]);
    }
  }

  function progressCalendarFlow() {
    // Scafolding to add more steps to the setup flow.
    if (step === 0) {
      // 0 Step is selecting calendars
      if (selectedCalendars.length === 0) return;
    }
  }

  function removeCalendar(calendar: Calendar.Calendar) {
    if (
      !selectedCalendars.includes(calendar) &&
      !(selectedCalendars.length > 0)
    )
      return;

    setSelectedCalendars([]);

    const selectedCalendarPos = selectedCalendars.findIndex((c) => {
      return c.id === calendar.id;
    });

    const calendarArrayWithoutSelectedCalendar = selectedCalendars.toSpliced(
      selectedCalendarPos,
      1,
    );

    setSelectedCalendars(calendarArrayWithoutSelectedCalendar);
    setAllCalendars(selectedCalendars);
  }

  function addCalendar(calendar: Calendar.Calendar) {
    setSelectedCalendars([...selectedCalendars, calendar]);
    setAllCalendars([...selectedCalendars, calendar]);
  }

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT,
        );
        setAllAvailableCalendars(calendars);
        setSelectedCalendars(activeCalendars);
      }
    })();
  }, []);

  return (
    <Surface className="flex-1 p-4 rounded-none">
      <View className="flex-1 px-4 py-2 gap-8">
        <View className="flex gap-2">
          <Text className="text-sm text-muted">Selected Calendars</Text>
          <Surface className="flex gap-2" variant="secondary">
            {selectedCalendars.map((selectedCalendar: Calendar.Calendar) => (
              <Pressable
                key={selectedCalendar.id}
                onPress={() => {
                  removeCalendar(selectedCalendar);
                }}
              >
                <View className="flex flex-row justify-between">
                  <Text className="text-[16px]">{selectedCalendar.title}</Text>
                  <SymbolView
                    name="minus.circle"
                    type="monochrome"
                    tintColor={"red"}
                    className="m-0"
                    size={20}
                  />
                </View>
              </Pressable>
            ))}
          </Surface>
        </View>
        <View className="flex gap-2">
          <Text className="text-sm text-muted">Available Calendars</Text>
          <Surface className="flex gap-2" variant="secondary">
            {allAvailableCalendars
              .filter((c) => !selectedIds.has(c.id))
              .map((selectedCalendar: Calendar.Calendar) => (
                <Pressable
                  key={selectedCalendar.id}
                  onPress={() => {
                    addCalendar(selectedCalendar);
                  }}
                >
                  <View className="flex flex-row justify-between">
                    <Text className="text-[16px]">
                      {selectedCalendar.title}
                    </Text>
                    <SymbolView
                      name="plus.circle"
                      type="monochrome"
                      tintColor={"green"}
                      className="m-0"
                      size={20}
                    />
                  </View>
                </Pressable>
              ))}
          </Surface>
        </View>
      </View>
    </Surface>
  );
}
