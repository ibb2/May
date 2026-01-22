import CalendarList from "@/components/setup/calendar-list";
import { useCalendar } from "@/stores/use-calendar";
import * as Calendar from "expo-calendar";
import { useRouter } from "expo-router";
import { Button, Spinner } from "heroui-native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Setup() {
  const router = useRouter();

  // Store
  const _hasHydrated = useCalendar((state) => state._hasHydrated);
  const allCalendars = useCalendar((state) => state.calendars);
  const setAllCalendars = useCalendar((state) => state.setAllCalendars);
  const completeSetup = useCalendar((state) => state.completeSetup);

  const [step, setStep] = useState(0);
  const [calendars, setCalendars] = useState<Calendar.Calendar[]>([]);
  const [selectedCalendars, setSelectedCalendars] = useState<
    Calendar.Calendar[]
  >([]);

  function selectCalendar(calendar: Calendar.Calendar) {
    const isSelected = selectedCalendars.some((c) => c.id === calendar.id);

    if (isSelected) {
      // Deselect
      setSelectedCalendars(
        selectedCalendars.filter((c) => c.id !== calendar.id),
      );
    } else {
      // Select
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

  // Handle hydration complete - check if calendars exist
  useEffect(() => {
    if (!_hasHydrated) return;

    // If calendars already selected, redirect to home
    if (allCalendars.length > 0) {
      router.replace("/(tabs)");
      return;
    }

    // Fetch available calendars for selection
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT,
        );
        setCalendars(calendars);
      }
    })();
  }, [_hasHydrated, allCalendars, router]);

  // Show spinner while hydrating or if calendars are persisted (redirecting)
  if (!_hasHydrated || allCalendars.length > 0) {
    return (
      <Spinner>
        <Spinner.Indicator />
      </Spinner>
    );
  }

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
