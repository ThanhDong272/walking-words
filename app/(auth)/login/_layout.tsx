import { Stack } from "expo-router";

export default function LoginLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen
        options={{
          animation: "fade",
        }}
        name="index"
      />
    </Stack>
  );
}
