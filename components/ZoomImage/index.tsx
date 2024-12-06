import React from "react";
import type { LayoutChangeEvent } from "react-native";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import type { ImageStyle } from "expo-image";
import { ImageBackground } from "expo-image";

import useZoomImage from "@hooks/useZoomImage";

type PinchOptions = {
  toScale: number;
  fromScale: number;
  origin: { x: number; y: number };
  delta: { x: number; y: number };
  offset: { x: number; y: number };
};

interface Props {
  uri: string;
  imageStyle: ImageStyle;
  width: number;
  height: number;
  children?: React.ReactNode;
  onLayoutImage?: (event: LayoutChangeEvent) => void;
}

const ZoomImage: React.FC<Props> = ({
  uri,
  imageStyle,
  width,
  height,
  children,
  onLayoutImage,
}) => {
  const { detectorStyle, animatedStyle, measureChild, pinch, pan, doubleTap } =
    useZoomImage({ width, height });

  return (
    <GestureDetector gesture={Gesture.Race(pan, pinch, doubleTap)}>
      <Animated.View style={[detectorStyle, styles.center]}>
        <Animated.View style={animatedStyle} onLayout={measureChild}>
          <ImageBackground
            style={[imageStyle]}
            source={{ uri: uri }}
            contentFit={"contain"}
            onLayout={onLayoutImage}
          >
            {children}
          </ImageBackground>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ZoomImage;
