import { useCalendar } from "@/stores/use-calendar";
import { HeaderButton } from "@react-navigation/elements";
import { Stack, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function ModalLayout() {
  const router = useRouter();

  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen
        name="settings-home"
        options={{
          title: "Settings",
          headerRight: () => (
            <HeaderButton onPress={() => router.back()}>
              <SymbolView
                name="checkmark"
                type="hierarchical"
                className="m-0"
                size={24}
              />
            </HeaderButton>
          ),
        }}
      />
      <Stack.Screen
        name="settings-calendar"
        options={{
          title: "Calendar",
          headerBackButtonDisplayMode: "minimal",
          headerRight: () => (
            <HeaderButton onPress={() => router.replace("/(tabs)")}>
              <SymbolView
                name="checkmark"
                type="hierarchical"
                className="m-0"
                size={24}
              />
            </HeaderButton>
          ),
        }}
      />
    </Stack>
  );
}
