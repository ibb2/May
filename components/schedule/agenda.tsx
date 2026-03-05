import {
  addDays,
  differenceInCalendarDays,
  format,
  isToday,
  startOfDay,
} from "date-fns";
import * as Calendar from "expo-calendar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  events: Calendar.Event[];
  calendars: Calendar.Calendar[];
  selectedDate: Date;
  onChangeDate: (date: Date) => void;
  onVisibleDateChange?: (date: Date) => void;
};

type DayGroup = {
  date: Date;
  events: Calendar.Event[];
};

const PAGE_SIZE_DAYS = 14;
const INITIAL_PAST_DAYS = 14;
const INITIAL_FUTURE_DAYS = 21;

function toDate(value: string | Date | undefined) {
  if (!value) return new Date();
  return value instanceof Date ? value : new Date(value);
}

function hexToRgba(hexColor: string, alpha: number) {
  const hex = hexColor.replace("#", "");
  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : hex;

  const bigint = Number.parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function formatEventTime(event: Calendar.Event) {
  if (event.allDay) return "All day";
  const start = toDate(event.startDate);
  const end = toDate(event.endDate);
  return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
}

function eventIntersectsDay(event: Calendar.Event, day: Date) {
  const start = toDate(event.startDate).getTime();
  const endRaw = toDate(event.endDate).getTime();
  const end = Math.max(endRaw, start + 1);
  const dayStart = startOfDay(day).getTime();
  const dayEnd = addDays(startOfDay(day), 1).getTime();
  return start < dayEnd && end > dayStart;
}

export default function AgendaComponent({
  events,
  calendars,
  selectedDate,
  onChangeDate,
  onVisibleDateChange,
}: Props) {
  const [displayDate, setDisplayDate] = useState(startOfDay(selectedDate));
  const [rangeStart, setRangeStart] = useState(
    addDays(startOfDay(selectedDate), -INITIAL_PAST_DAYS),
  );
  const [rangeEnd, setRangeEnd] = useState(
    addDays(startOfDay(selectedDate), INITIAL_FUTURE_DAYS),
  );

  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const isPaginatingRef = useRef(false);
  const todayYOffsetRef = useRef(0);
  const contentHeightRef = useRef(0);
  const scrollYRef = useRef(0);
  const pendingPrependHeightRef = useRef<number | null>(null);
  const hasAutoScrolledToTodayRef = useRef(false);
  const pendingJumpToTodayRef = useRef(false);
  const lastVisibleDateKeyRef = useRef("");
  const dayOffsetsRef = useRef<Record<string, number>>({});
  const lastPaginationTsRef = useRef(0);

  const days = useMemo(() => {
    const totalDays = differenceInCalendarDays(rangeEnd, rangeStart) + 1;
    return Array.from({ length: totalDays }, (_, index) =>
      addDays(rangeStart, index),
    );
  }, [rangeEnd, rangeStart]);

  const groups: DayGroup[] = useMemo(() => {
    return days.map((day) => ({
      date: day,
      events: events
        .filter((event) => eventIntersectsDay(event, day))
        .sort(
          (a, b) =>
            toDate(a.startDate).getTime() - toDate(b.startDate).getTime(),
        ),
    }));
  }, [days, events]);

  const visibleGroups = useMemo(
    () => groups.filter((group) => group.events.length > 0),
    [groups],
  );

  const noCalendarEvents = events.length === 0;

  function paginateForward() {
    if (isPaginatingRef.current) return;
    if (Date.now() - lastPaginationTsRef.current < 300) return;
    isPaginatingRef.current = true;
    lastPaginationTsRef.current = Date.now();
    setRangeEnd((prev) => addDays(prev, PAGE_SIZE_DAYS));
  }

  function paginateBackward() {
    if (isPaginatingRef.current) return;
    if (Date.now() - lastPaginationTsRef.current < 300) return;
    isPaginatingRef.current = true;
    lastPaginationTsRef.current = Date.now();
    pendingPrependHeightRef.current = contentHeightRef.current;
    setRangeStart((prev) => addDays(prev, -PAGE_SIZE_DAYS));
  }

  function jumpToToday() {
    const today = startOfDay(new Date());
    pendingJumpToTodayRef.current = true;
    dayOffsetsRef.current = {};
    todayYOffsetRef.current = 0;
    setRangeStart(addDays(today, -INITIAL_PAST_DAYS));
    setRangeEnd(addDays(today, INITIAL_FUTURE_DAYS));
    setDisplayDate(today);
    onVisibleDateChange?.(today);
    onChangeDate(today);
  }

  useEffect(() => {
    if (hasAutoScrolledToTodayRef.current) return;
    if (todayYOffsetRef.current <= 0) return;

    hasAutoScrolledToTodayRef.current = true;
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollTo({
        y: Math.max(todayYOffsetRef.current - 120, 0),
        animated: false,
      });
    });
  }, [groups]);

  return (
    <View className="w-full flex-1 bg-[#FCFCFC] dark:bg-[#18181B]">
      <View className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {format(displayDate, "MMMM yyyy")}
          </Text>
          <Pressable onPress={jumpToToday}>
            <Text className="text-sm font-medium text-blue-600">Today</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{ padding: 12, paddingBottom: insets.bottom + 96 }}
        onContentSizeChange={(_, contentHeight) => {
          const previousHeight = contentHeightRef.current;
          contentHeightRef.current = contentHeight;

          if (pendingPrependHeightRef.current !== null) {
            const delta = contentHeight - pendingPrependHeightRef.current;
            if (delta > 0) {
              scrollViewRef.current?.scrollTo({
                y: Math.max(scrollYRef.current + delta, 0),
                animated: false,
              });
            }
            pendingPrependHeightRef.current = null;
          }

          if (!hasAutoScrolledToTodayRef.current && todayYOffsetRef.current > 0) {
            hasAutoScrolledToTodayRef.current = true;
            scrollViewRef.current?.scrollTo({
              y: Math.max(todayYOffsetRef.current - 120, 0),
              animated: false,
            });
          }

          if (pendingJumpToTodayRef.current) {
            pendingJumpToTodayRef.current = false;
            scrollViewRef.current?.scrollTo({
              y: Math.max(todayYOffsetRef.current - 120, 0),
              animated: true,
            });
          }

          if (contentHeight === previousHeight) {
            isPaginatingRef.current = false;
            return;
          }

          setTimeout(() => {
            isPaginatingRef.current = false;
          }, 0);
        }}
        onScroll={({ nativeEvent }) => {
          const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
          scrollYRef.current = contentOffset.y;

          if (contentOffset.y < 80) paginateBackward();

          const distanceFromBottom =
            contentSize.height - (contentOffset.y + layoutMeasurement.height);
          if (distanceFromBottom < 180) paginateForward();

          const targetY = contentOffset.y + 120;
          let visibleDate = visibleGroups[0]?.date;
          for (let i = 0; i < visibleGroups.length; i += 1) {
            const key = visibleGroups[i].date.toISOString();
            const offsetY = dayOffsetsRef.current[key];
            if (offsetY === undefined) continue;
            if (offsetY <= targetY) visibleDate = visibleGroups[i].date;
            else break;
          }

          if (visibleDate) {
            const visibleKey = format(visibleDate, "yyyy-MM-dd");
            if (lastVisibleDateKeyRef.current !== visibleKey) {
              lastVisibleDateKeyRef.current = visibleKey;
              setDisplayDate(visibleDate);
              onVisibleDateChange?.(visibleDate);
            }
          }
        }}
        scrollEventThrottle={16}
      >
        {noCalendarEvents ? (
          <View className="mt-24 items-center px-6">
            <Text className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              No events on your calendar
            </Text>
            <Text className="mt-2 text-center text-zinc-500 dark:text-zinc-400">
              Use Add in the header to create your first event.
            </Text>
          </View>
        ) : (
          visibleGroups.map((group) => {
            const isCurrentDay = isToday(group.date);

            return (
              <View
                key={group.date.toISOString()}
                className="mb-5 flex-row items-start"
                onLayout={(event) => {
                  dayOffsetsRef.current[group.date.toISOString()] =
                    event.nativeEvent.layout.y;
                  if (!isCurrentDay) return;
                  todayYOffsetRef.current = event.nativeEvent.layout.y;
                }}
              >
                <View className="mr-3 items-center" style={{ width: 48 }}>
                  <Text className="text-[11px] font-medium uppercase text-zinc-500">
                    {format(group.date, "EEE")}
                  </Text>
                  <View
                    className={`mt-1 h-8 w-8 items-center justify-center rounded-full ${
                      isCurrentDay ? "bg-blue-600" : "bg-zinc-100 dark:bg-zinc-800"
                    }`}
                  >
                    <Text
                      className={`text-base font-semibold ${
                        isCurrentDay
                          ? "text-white"
                          : "text-zinc-800 dark:text-zinc-100"
                      }`}
                    >
                      {format(group.date, "d")}
                    </Text>
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {format(group.date, "MMMM d")}
                  </Text>
                  <View className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    {group.events.map((event, index) => {
                      const color =
                        calendars.find((calendar) => calendar.id === event.calendarId)
                          ?.color || "#0EA5E9";

                      return (
                        <View
                          key={`${group.date.toISOString()}-${event.id}`}
                          className="px-4 py-3"
                          style={{
                            backgroundColor: hexToRgba(color, 0.1),
                            borderTopWidth: index === 0 ? 0 : 1,
                            borderTopColor: "rgba(228, 228, 231, 0.7)",
                          }}
                        >
                          <View className="flex-row items-center gap-2">
                            <View
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            <Text
                              className="flex-1 text-base font-medium text-zinc-900 dark:text-zinc-100"
                              numberOfLines={1}
                            >
                              {event.title || "Untitled"}
                            </Text>
                            <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                              {formatEventTime(event)}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
