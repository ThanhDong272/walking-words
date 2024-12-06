import type { ImageStyle, TextStyle, ViewStyle } from "react-native";
import { Dimensions, StyleSheet } from "react-native";

import DefaultTheme from "@theme";
const { width: ScreenWidth } = Dimensions.get("screen");

interface Style {
  container: ViewStyle;
  iconLeftContainerStyle: ViewStyle;
  iconContainerStyle: ViewStyle;
  iconLeftImageStyle: ImageStyle;
  iconImageStyle: ImageStyle;
}

export const _textInputStyle = (borderColor: any): TextStyle => ({
  height: 44,
  width: "100%",
  borderWidth: 1,
  paddingLeft: 34,
  borderRadius: 10,
  paddingRight: 10,
  borderColor: borderColor,
  justifyContent: "center",
  color: DefaultTheme.colors.white,
  fontFamily: DefaultTheme.fonts.metropolis.regular,
  backgroundColor: DefaultTheme.colors.black,
});

export default StyleSheet.create<Style>({
  container: {
    flexDirection: "row",
    alignItems: "center",
    // borderRadius: 10,
  },
  iconLeftContainerStyle: {
    left: 10,
    position: "absolute",
    backgroundColor: DefaultTheme.colors.black0F,
    zIndex: 1,
  },
  iconContainerStyle: {
    right: 10,
    position: "absolute",
    backgroundColor: DefaultTheme.colors.black0F,
  },
  iconLeftImageStyle: {
    height: 24,
    width: 24,
    tintColor: DefaultTheme.colors.white,
  },
  iconImageStyle: {
    height: 24,
    width: 24,
    tintColor: DefaultTheme.colors.white,
  },
});
