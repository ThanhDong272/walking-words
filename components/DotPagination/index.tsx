import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Device from "expo-device";
import styled from "styled-components/native";

import useDeviceType from "@hooks/useDeviceType";
import { ALPHA_VALUE } from "@constants/index";

import DefaultTheme from "@theme";

interface Props {
  length: number;
  currentIndex: number;
}

const DotPagination: React.FC<Props> = ({ length, currentIndex }) => {
  const pageIndex = useSharedValue(currentIndex);
  const deviceType = useDeviceType();

  const indicatorStyles = useAnimatedStyle(() => {
    return {
      opacity: pageIndex.value === 0 ? 1 : 0.3,
      transform: [{ scale: pageIndex.value === 0 ? 1 : 0.8 }],
    };
  });

  return (
    <Container>
      {Array.from({ length }).map((_, index) => (
        <ViewDot
          key={index}
          width={
            deviceType === Device.DeviceType.PHONE
              ? index === currentIndex
                ? 17
                : 4
              : index === currentIndex
                ? 20
                : 5
          }
          height={deviceType === Device.DeviceType.PHONE ? 4 : 5}
          style={[indicatorStyles]}
          backgroundColor={
            index === currentIndex
              ? DefaultTheme.colors.yellowD3
              : DefaultTheme.colors.white + ALPHA_VALUE.alpha_03
          }
        />
      ))}
    </Container>
  );
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const ViewDot = styled(Animated.View)<{
  width: number;
  height: number;
  backgroundColor: string;
}>`
  width: ${(props) => props.width}px;
  border-radius: 5px;
  height: ${(props) => props.height}px;
  background-color: ${(props) => props.backgroundColor};
`;

const styles = StyleSheet.create({});

export default DotPagination;
