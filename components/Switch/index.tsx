import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Device from "expo-device";
import styled from "styled-components/native";

import useDeviceType from "@hooks/useDeviceType";

import DefaultTheme from "@theme";

import { ALPHA_VALUE } from "@/constants";

interface Props {
  onToggle: (value: boolean) => void;
  initialValue: boolean;
}

const Switch: React.FC<Props> = ({ onToggle, initialValue }) => {
  const [isOn, setIsOn] = useState(initialValue);
  const deviceType = useDeviceType();
  const offset = useSharedValue(
    initialValue ? (deviceType === Device.DeviceType.PHONE ? 14 : 18) : 0,
  );

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  const toggleSwitch = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    offset.value = withSpring(
      newValue ? (deviceType === Device.DeviceType.PHONE ? 14 : 18) : 0,
    );
    onToggle && onToggle(newValue);
  };

  return (
    <Pressable onPress={toggleSwitch}>
      <View
        style={[
          styles.switchTrack,
          {
            width: deviceType === Device.DeviceType.PHONE ? 26 : 34,
            height: deviceType === Device.DeviceType.PHONE ? 14 : 20,
          },
          isOn ? styles.switchTrackOn : styles.switchTrackOff,
        ]}
      >
        <Animated.View
          style={[
            styles.switchThumb,
            animatedStyles,
            {
              width: deviceType === Device.DeviceType.PHONE ? 14 : 18,
              height: deviceType === Device.DeviceType.PHONE ? 14 : 18,
            },
          ]}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  switchTrack: {
    width: 26,
    height: 14,
    borderRadius: 14,
  },
  switchTrackOn: {
    backgroundColor: DefaultTheme.colors.black + ALPHA_VALUE.alpha_06,
  },
  switchTrackOff: {
    backgroundColor: DefaultTheme.colors.white + ALPHA_VALUE.alpha_06,
  },
  switchThumb: {
    borderRadius: 14,
    backgroundColor: DefaultTheme.colors.white,
  },
});

export default Switch;
