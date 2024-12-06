import type { TextStyle, ViewStyle } from "react-native";
import type { ImageStyle } from "expo-image";

import type { ScreenData } from "@hooks/useScreenData";

type DeviceTypes = "phone" | "tablet";

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type StyleWithBreakPoint<T> = {
  [Key in keyof T]: PartialBy<
    { [DeviceType in DeviceTypes]: T[Key] },
    Exclude<DeviceTypes, "phone">
  >;
};

const DEFAULT_PHONE_WIDTH = 480;
// these values are based on the design we have
const PHONE_GUIDE_LINE_BASE_WIDTH = 375;
const PHONE_GUIDE_LINE_BASE_HEIGHT = 812;

const TABLET_GUIDE_LINE_BASE_WIDTH = 834;
const TABLET_GUIDE_LINE_BASE_HEIGHT = 1194;

const getDisplayMode = (screenData: ScreenData): DeviceTypes => {
  //TODO: handle screen size change on fold devices
  if (screenData.width < DEFAULT_PHONE_WIDTH) {
    return "phone";
  }
  return "tablet";
};

/**
 *
 * @param screenData
 * @returns [shortDimension, longDimension]
 */
const getDimensions = (screenData: ScreenData): number[] => {
  return screenData.width < screenData.height
    ? [screenData.width, screenData.height]
    : [screenData.height, screenData.width];
};

export const styleWithBreakPoints = <
  T extends ViewStyle | TextStyle | ImageStyle,
>(
  screenData: ScreenData,
  styleWithBreakPoints: StyleWithBreakPoint<T>,
) => {
  const finalStyle = {} as T;

  const displayMode = getDisplayMode(screenData);

  for (const key in styleWithBreakPoints) {
    const value =
      styleWithBreakPoints[key][displayMode] ?? styleWithBreakPoints[key].phone;
    if (value) {
      finalStyle[key] = value;
    }
  }
  return finalStyle;
};

const horizontalScale = (size: number, screenData: ScreenData): number => {
  const [shortDimension] = getDimensions(screenData);
  const guidelineBaseWidth =
    shortDimension < DEFAULT_PHONE_WIDTH
      ? PHONE_GUIDE_LINE_BASE_WIDTH
      : TABLET_GUIDE_LINE_BASE_WIDTH;
  return Math.ceil((shortDimension / guidelineBaseWidth) * size);
};

const verticalScale = (size: number, screenData: ScreenData): number => {
  const [shortDimension, longDimension] = getDimensions(screenData);
  const guidelineBaseHeight =
    shortDimension < DEFAULT_PHONE_WIDTH
      ? PHONE_GUIDE_LINE_BASE_HEIGHT
      : TABLET_GUIDE_LINE_BASE_HEIGHT;
  return Math.ceil((longDimension / guidelineBaseHeight) * size);
};

/**
 * Returns non-linear scale based on a resize factor (defaults to 0.51).
 * If normal horizontalScale will increase by +2X,
 * moderateScale will only increase it by +X.
 * @param size
 * @param screenData
 * @param factor
 */
const moderateScale = (
  size: number,
  screenData: ScreenData,
  factor: number = 0.51,
): number =>
  Math.ceil(size + (horizontalScale(size, screenData) - size) * factor);

export { horizontalScale, moderateScale, verticalScale };
