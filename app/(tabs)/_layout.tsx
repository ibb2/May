import "../../global.css";
import React from "react";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="distribute.vertical.fill"
          drawable="custom_android_drawable"
          md="home"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>3 Days</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="rectangle.split.3x1"
          drawable="custom_plane_drawable"
          md="home"
        />
      </NativeTabs.Trigger>
      {/*<NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf="plus"
          drawable="custom_plane_drawable"
          md="home"
        />
      </NativeTabs.Trigger>*/}
    </NativeTabs>
  );
}
