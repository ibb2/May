export default function useCalendars() {
  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const [calendars, events] = await Promise.all([
          Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT),
          Calendar.getEventsAsync(
            ["AB499137-F401-4F65-B90A-3E6A02C8A16C"],
            startDate,
            endDate,
          ),
        ]);

        setCalendars(calendars);
        setEvents(events);
        updateEvents(false);

        console.log("Calendars and events fetched successfully");
      }
    })();
  }, [eventUpdated, updateEvents, startDate, endDate]);
}
