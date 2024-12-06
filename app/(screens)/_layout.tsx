import React from "react";
import { Stack } from "expo-router";

import { isIOS } from "@utils/common";

export default function ScreenLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: isIOS ? "default" : "none",
      }}
    >
      <Stack.Screen name="search" options={{ headerShown: false }} />
      <Stack.Screen name="book_reader" options={{ headerShown: false }} />
      <Stack.Screen name="video_book" options={{ headerShown: false }} />
      <Stack.Screen name="story_overview" options={{ headerShown: false }} />
      <Stack.Screen name="map" options={{ headerShown: false }} />
    </Stack>
  );
}
