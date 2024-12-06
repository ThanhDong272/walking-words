import { Stack } from "expo-router";

import { isIOS } from "@utils/common";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: isIOS ? "default" : "none",
      }}
    >
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot_password" />
      <Stack.Screen name="change_password" />
      <Stack.Screen name="recover_password" />
    </Stack>
  );
}
