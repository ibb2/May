import { HeaderButton } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { View, Text } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 py-2">
        <Text className="text-lg font-bold">Settings</Text>
        <HeaderButton onPress={() => router.back()}>
          <SymbolView
            name="xmark"
            type="monochrome"
            tintColor="#000"
            className="m-0"
          />
        </HeaderButton>
      </View>
      <View className="flex-1 px-4 py-2">
        <Text className="text-base">Settings content</Text>
      </View>
    </View>
  );
}
