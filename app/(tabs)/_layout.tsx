import React from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { Tabs } from "expo-router";
import styled from "styled-components/native";

import Icon from "@components/Icon";

import DefaultTheme from "@theme";

const IconTabBar = styled(Icon)``;

export default function TabLayout() {
  const { t } = useTranslation();
  return (
    <SafeAreaView
      edges={["bottom"]}
      style={{ flex: 1, backgroundColor: DefaultTheme.colors.black10 }}
    >
      <Tabs
        initialRouteName="home"
        safeAreaInsets={{
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
        }}
        screenOptions={{
          tabBarActiveBackgroundColor: DefaultTheme.colors.black10,
          tabBarInactiveBackgroundColor: DefaultTheme.colors.black10,
          tabBarActiveTintColor: DefaultTheme.colors.white,
          tabBarInactiveTintColor: DefaultTheme.colors.grey7C,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: t("tabs.homepage"),
            href: {
              pathname: "/home",
            },
            tabBarIcon: ({ focused }) => (
              <IconTabBar
                iconName={"ic_home"}
                size={28}
                disabled
                color={
                  focused
                    ? DefaultTheme.colors.white
                    : DefaultTheme.colors.grey7C
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t("tabs.profile"),
            href: {
              pathname: "/profile",
            },
            tabBarIcon: ({ focused }) => (
              <IconTabBar
                iconName={"ic_profile"}
                size={28}
                disabled
                color={
                  focused
                    ? DefaultTheme.colors.white
                    : DefaultTheme.colors.grey7C
                }
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
