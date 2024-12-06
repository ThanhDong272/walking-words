import { useEffect, useState } from "react";
import type { ScaledSize } from "react-native";
import { Dimensions } from "react-native";

const DefaultScreenDimensions = Dimensions.get("window");

export const useScreenData = () => {
  const [screenData, setScreenData] = useState<Layout.ScreenData>({
    width: DefaultScreenDimensions.width,
    height: DefaultScreenDimensions.height,
    orientation:
      DefaultScreenDimensions.width < DefaultScreenDimensions.height
        ? "portrait"
        : "landscape",
    displayMode: DefaultScreenDimensions.width < 480 ? "phone" : "tablet",
  });

  const onScreenDimensionsChange = ({
    window,
  }: {
    window: ScaledSize;
    screen: ScaledSize;
  }) => {
    setScreenData({
      width: window.width,
      height: window.height,
      orientation: window.width < window.height ? "portrait" : "landscape",
      displayMode: window.width < 480 ? "phone" : "tablet",
    });
  };

  useEffect(() => {
    const screenDimensionSubs = Dimensions.addEventListener(
      "change",
      onScreenDimensionsChange,
    );
    return () => {
      screenDimensionSubs?.remove();
    };
  }, []);

  return screenData;
};
