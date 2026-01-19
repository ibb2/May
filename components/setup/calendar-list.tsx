import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import * as Calendar from "expo-calendar";
import { Card, Checkbox, cn } from "heroui-native";

export default function CalendarList({
  selectedCalendars,
  selectCalendar,
}: {
  selectedCalendars: Calendar.Calendar[];
  selectCalendar: any;
}) {
  const [calendars, setCalendars] = useState<Calendar.Calendar[]>([]);

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
    <View className="flex items-center justify-center gap-8">
      <Text className="text-7xl font-bold text-center flex-wrap">
        Select your calendars
      </Text>
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
