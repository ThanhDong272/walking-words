import { Dimensions, Platform } from "react-native";

export const screenWidth = Dimensions.get("window").width;
export const screenHeight = Dimensions.get("window").height;

export const isAndroid = Platform.OS === "android";
export const isIOS = Platform.OS === "ios";

export const getColorWithOpacity = (hex: string, opacity: number) => {
  hex = hex.replace(/^#/, "");

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  opacity = Math.min(Math.max(opacity, 0), 1);

  const rgba = `rgba(${r}, ${g}, ${b}, ${opacity})`;

  return rgba;
};

export const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}h ${minutes}min`;
    } else {
      return `${hours}h ${seconds}sec`;
    }
  } else {
    return `${minutes}min ${seconds}sec`;
  }
};
