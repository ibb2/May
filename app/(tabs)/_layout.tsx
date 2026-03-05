import {NativeTabs} from "expo-router/unstable-native-tabs";
import React from "react";
import "../../global.css";

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(schedule)">
        <NativeTabs.Trigger.Label>Schedule</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="rectangle.grid.1x2" md="calendar-month" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="distribute.vertical.fill" md="today" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
