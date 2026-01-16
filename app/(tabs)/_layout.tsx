import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { Pressable, TouchableWithoutFeedback } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Today</Label>
        <Icon
          sf="distribute.vertical.fill"
          drawable="custom_android_drawable"
        />
      </NativeTabs.Trigger>
      {/*<NativeTabs.Trigger name="explore">
        <Label>3 Days</Label>
        <Icon sf="rectangle.split.3x1" drawable="custom_plane_drawable" />
      </NativeTabs.Trigger>*/}
      <NativeTabs.Trigger name="search" role="search">
        <Label>Search</Label>
        <Icon sf="plus" drawable="custom_plane_drawable" />
      </NativeTabs.Trigger>
    </NativeTabs>
    // <Tabs
    //   screenOptions={{
    //     tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    //     headerShown: false,
    //     tabBarButton: HapticTab,
    //   }}>
    //   <Tabs.Screen
    //     name="index"
    //     options={{
    //       title: 'Home',
    //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="explore"
    //     options={{
    //       title: 'Explore',
    //       tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
    //     }}
    //   />
    // </Tabs>
  );
}
