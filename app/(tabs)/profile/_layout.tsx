import { Stack } from "expo-router";

import { isIOS } from "@utils/common";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: isIOS ? "default" : "none",
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
