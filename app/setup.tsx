import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import * as Calendar from "expo-calendar";

export default function Setup() {
  const [calendars, setCalendars] = useState();

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const [calendars, events] = await Promise.all([
          Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT),
        ]);

        setCalendars(calendars);

        console.log("Calendars fetched successfully");
      }
    })();
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Select calendars</Text>
    </View>
  );
}
