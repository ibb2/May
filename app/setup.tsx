import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import * as Calendar from "expo-calendar";
import { Button, Card, Checkbox, cn } from "heroui-native";
import CalendarList from "@/components/setup/calendar-list";
import { useRouter } from "expo-router";
import { useCalendar } from "@/stores/use-calendar";

export default function Setup() {
  const router = useRouter();

  // Store
  const setAllCalendars = useCalendar((state) => state.setAllCalendars);
  const completeSetup = useCalendar((state) => state.completeSetup);

  const [step, setStep] = useState(0);
  const [calendars, setCalendars] = useState<Calendar.Calendar[]>([]);
  const [selectedCalendars, setSelectedCalendars] = useState<
    Calendar.Calendar[]
  >([]);

  function selectCalendar(calendar: Calendar.Calendar) {
    if (selectedCalendars.includes(calendar) && selectedCalendars.length > 0) {
      setSelectedCalendars([]);

      const selectedCalendarPos = selectedCalendars.findIndex((c) => {
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
    setAllCalendars(selectedCalendars);
    completeSetup();
    router.replace("/(tabs)");
    setStep(step + 1);
  }

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT,
        );
        setCalendars(calendars);

        console.log("Calendars fetched successfully");
        console.log(calendars.length);
        // console.log(calendars);
      }
    })();
  }, []);

  return (
    <View className="flex-1 items-center justify-center gap-8">
      {step === 0 && (
        <CalendarList
          selectedCalendars={selectedCalendars}
          selectCalendar={selectCalendar}
        />
      )}
      {step === 1 && <Text>Step 2</Text>}
      <Button onPress={progressCalendarFlow}>Done</Button>
    </View>
  );
}
