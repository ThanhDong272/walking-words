import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import DefaultTheme from "@theme";

export default function BookReaderLayout() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: DefaultTheme.colors.black }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
      </Stack>
    </SafeAreaView>
  );
}
