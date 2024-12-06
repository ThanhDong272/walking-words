import React, { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AudioProvider } from "@context/AudioContext";
import { ChangeThemePageProvider } from "@context/ChangeThemePageContext";
import { DeviceTypeProvider } from "@context/DeviceTypeContext";
import { useMMKVDevTools } from "@dev-plugins/react-native-mmkv";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Audio } from "expo-av";
import * as Font from "expo-font";
import { ImageBackground } from "expo-image";
import { Stack } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "styled-components";

import i18next from "@locales/i18next";

import { useGetUserInfo } from "@generated/user/user";
import { useScreenData } from "@hooks/useScreenData";
import { asyncStoragePersister } from "@services/local";
import { queryClient } from "@services/network";

import { images } from "@assets/images";
import DefaultTheme from "@theme";

const loadFonts = async () => {
  await Font.loadAsync({
    IcoMoon: require("../assets/fonts/icomoon.ttf"),
    "Metropolis-Black": require("../assets/fonts/Metropolis-Black.ttf"),
    "Metropolis-Bold": require("../assets/fonts/Metropolis-Bold.ttf"),
    "Metropolis-ExtraBold": require("../assets/fonts/Metropolis-ExtraBold.ttf"),
    "Metropolis-ExtraLight": require("../assets/fonts/Metropolis-ExtraLight.ttf"),
    "Metropolis-Light": require("../assets/fonts/Metropolis-Light.ttf"),
    "Metropolis-Medium": require("../assets/fonts/Metropolis-Medium.ttf"),
    "Metropolis-Regular": require("../assets/fonts/Metropolis-Regular.ttf"),
    "Metropolis-SemiBold": require("../assets/fonts/Metropolis-SemiBold.ttf"),
    "Metropolis-Thin": require("../assets/fonts/Metropolis-Thin.ttf"),
    "Inter-Black": require("../assets/fonts/Inter-Black.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("../assets/fonts/Inter-ExtraBold.ttf"),
    "Inter-ExtraLight": require("../assets/fonts/Inter-ExtraLight.ttf"),
    "Inter-Light": require("../assets/fonts/Inter-Light.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Thin": require("../assets/fonts/Inter-Thin.ttf"),
  });
};

const RootLayout = () => {
  const screenData = useScreenData();

  const opacity = useSharedValue(0);
  const [isAppReady, setAppReady] = useState<boolean>(false);

  const { data, isSuccess, isPending } = useGetUserInfo({
    query: {
      retry: false,
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    // Start the splash screen animation
    opacity.value = withTiming(
      1,
      {
        duration: 2000,
        easing: Easing.in(Easing.ease),
      },
      (finished) => {
        if (!finished || isPending) return;
        runOnJS(setAppReady)(true);
      },
    );
  }, [isPending]);

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      {!isAppReady && (
        <ImageBackground
          source={
            screenData.displayMode === "phone"
              ? images.splashPhone
              : images.splashTablet
          }
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
          }}
        />
      )}
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
        initialRouteName="(tabs)"
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(screens)" />
      </Stack>
    </Animated.View>
  );
};

export default function App() {
  //Inject devtools
  useMMKVDevTools();
  useReactQueryDevTools(queryClient);

  const prepareApp = async () => {
    try {
      await loadFonts();
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    } catch (error) {
      console.warn("Error loading assets: ", error);
    }
  };

  useEffect(() => {
    prepareApp();
  }, []);

  return (
    <ThemeProvider theme={DefaultTheme}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: "black" }}>
          <StatusBar translucent backgroundColor="transparent" style="light" />
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
              persister: asyncStoragePersister,
              dehydrateOptions: {
                shouldDehydrateQuery: ({ meta }) => meta?.["persist"] === true,
              },
            }}
          >
            <I18nextProvider i18n={i18next}>
              <AudioProvider>
                <ChangeThemePageProvider>
                  <DeviceTypeProvider>
                    <RootLayout />
                  </DeviceTypeProvider>
                </ChangeThemePageProvider>
              </AudioProvider>
            </I18nextProvider>
          </PersistQueryClientProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
