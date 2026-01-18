import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import * as Calendar from "expo-calendar";
import { Card, Checkbox, cn } from "heroui-native";

export default function Setup() {
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
      <Text className="text-2xl font-bold">Select your calendars</Text>
      <View className="items-center w-full gap-2">
        {calendars.map((calendar, index) => (
          <Text
            key={calendar.id + index}
            className={cn(
              "text-lg",
              selectedCalendars.includes(calendar)
                ? "underline"
                : "no-underline",
            )}
            onPress={() => selectCalendar(calendar)}
          >
            {calendar.title}
          </Text>
        ))}
      </View>
    </View>
  );
}
