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
        name="index"
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
        name="settings/calendar"
        options={{
          title: "Calendar",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      {/*<Stack.Screen
        name="settings"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Modal" }}
      />*/}
    </Stack>
  );
}
