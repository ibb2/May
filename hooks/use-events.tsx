import { useEffect, useState } from "react";
import * as Calendar from "expo-calendar";
import { add, startOfToday } from "date-fns";
import { useCalendar } from "@/stores/use-calendar";

export function useEvents({
  calendarId,
  startDate,
  endDate,
}: {
  calendarId: string;
  startDate: Date;
  endDate: Date;
}) {
  const [events, setEvents] = useState<Calendar.Event[]>([]);
  const [calendars, setCalendars] = useState<Calendar.Calendar[]>([]);

  // Store
  const eventUpdated = useCalendar((state) => state.eventUpdated);
  const updateEvents = useCalendar((state) => state.updateEvents);
  const setup = useCalendar((state) => state.setup);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const events = await Calendar.getEventsAsync(
          ["AB499137-F401-4F65-B90A-3E6A02C8A16C"],
          startDate,
          endDate,
        );

        setEvents(events);

        console.log("Calendar ", calendarId, "'s events fetched successfully");
      }
    })();
  }, [calendarId, endDate, startDate]);

  return events;
}
