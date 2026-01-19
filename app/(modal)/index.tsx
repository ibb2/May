import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Divider, Surface } from "heroui-native";
import { View, Text } from "react-native";
import { Pressable } from "react-native-gesture-handler";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <Surface className="flex-1 p-4 rounded-none">
      <View className="flex-1 px-4 py-2">
        <View className="flex gap-2">
          <Text className="text-sm text-muted">General</Text>
          <Surface className="flex gap-2" variant="secondary">
            <Pressable
              onPress={() => router.push("/(modal)/settings/calendar")}
            >
              <View>
                <Text>Calendars</Text>
                <Divider></Divider>
              </View>
            </Pressable>
            <Text>Calendars</Text>
            <Divider></Divider>
            <Text>Calendars</Text>
            <Divider></Divider>
            <Text>Calendars</Text>
            <Divider></Divider>
            <Text>Calendars</Text>
            <Divider></Divider>
            <Text>Calendars</Text>
          </Surface>
        </View>
      </View>
    </Surface>
  );
}
