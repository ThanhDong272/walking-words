import React, { memo } from "react";
import type { PressableProps } from "react-native";
import { StyleSheet } from "react-native";
import * as Device from "expo-device";
import styled from "styled-components/native";

import useDeviceType from "@hooks/useDeviceType";

interface Props {}

const BlurContainerPressable: React.FC<PressableProps> = ({
  children,
  ...props
}) => {
  const deviceType = useDeviceType();

  const renderBlurPressable = () => {
    if (deviceType === Device.DeviceType.PHONE) {
      return (
        <BlurViewContainerCenterPress {...props}>
          {children}
        </BlurViewContainerCenterPress>
      );
    } else {
      return <BlurContainerPress {...props}>{children}</BlurContainerPress>;
    }
  };

  return renderBlurPressable();
};

const BlurViewContainerCenterPress = styled.Pressable`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`;

const BlurContainerPress = styled.Pressable`
  position: absolute;
  right: 10px;
  bottom: 8px;
  justify-content: center;
  align-items: center;
`;

const styles = StyleSheet.create({});

export default memo(BlurContainerPressable);
