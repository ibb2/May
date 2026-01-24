import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Redirect, Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import * as Calendar from "expo-calendar";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { useCalendar } from "@/stores/use-calendar";
import { Button, Text, View } from "react-native";
import { Icon } from "expo-router/build/native-tabs";
import { SymbolView } from "expo-symbols";
import { HeaderButton } from "@react-navigation/elements";
import { add, startOfToday } from "date-fns";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <>
      <Stack></Stack>
      <StatusBar style="auto" />
    </>
  );
}
