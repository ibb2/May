import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Redirect, Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { useCalendar } from "@/stores/use-calendar";
import { Button, Text, View } from "react-native";
import { Icon } from "expo-router/build/native-tabs";
import { SymbolView } from "expo-symbols";
import { HeaderButton } from "@react-navigation/elements";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  // States
  const [count, setCount] = useState(0);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              title: "My home",
              headerStyle: {
                backgroundColor: colorScheme === "dark" ? "#18181B" : "#FCFCFC",
              },
              headerShadowVisible: false,
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerTitle: (props) => (
                <View>
                  <Text> Hello</Text>
                </View>
              ),
              headerLeft: () => (
                <HeaderButton
                  onPress={() => router.push("/(modal)/settings-home")}
                >
                  <SymbolView
                    name="gear"
                    type="monochrome"
                    tintColor="#000"
                    className="m-0"
                    size={24}
                  />
                </HeaderButton>
              ),
              headerRight: () => (
                <HeaderButton>
                  <SymbolView
                    name="plus"
                    type="monochrome"
                    tintColor="#000"
                    className="m-0"
                    size={24}
                  />
                </HeaderButton>
              ),
            }}
          />
          <Stack.Screen name="setup" options={{ headerShown: false }} />
          <Stack.Screen
            name="(modal)"
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
