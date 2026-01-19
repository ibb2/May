import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Divider, Surface } from "heroui-native";
import { View, Text } from "react-native";
import { Pressable } from "react-native-gesture-handler";

export default function SettingsHomeScreen() {
  const router = useRouter();

  return (
    <Surface className="flex-1 rounded-none">
      <View className="flex gap-2">
        <Text className="text-sm text-muted pl-4">General</Text>
        <Surface className="flex gap-2" variant="secondary">
          <Pressable onPress={() => router.push("/(modal)/settings-calendar")}>
            <View className="flex flex-row items-center gap-4">
              <SymbolView
                name="calendar"
                type="monochrome"
                tintColor="black"
                size={24}
              />
              <Text className="text-lg">Calendars</Text>
              <Divider></Divider>
            </View>
          </Pressable>
        </Surface>
      </View>
    </Surface>
  );
}
