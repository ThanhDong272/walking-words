import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import styled from "styled-components/native";

import { screenWidth } from "@utils/common";

interface Props {
  isExpanded: boolean;
  children: React.ReactNode;
}

const Accordion: React.FC<Props> = ({ isExpanded, children }) => {
  const DURATION = 500;
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded), {
      duration: DURATION,
    }),
  );

  const bodyStyle = useAnimatedStyle(() => ({
    height: withTiming(isExpanded ? derivedHeight.value : 54, {
      duration: 300,
    }),
  }));

  return (
    <AnimatedAccordion style={bodyStyle}>
      <WrapperView
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
      >
        {children}
      </WrapperView>
    </AnimatedAccordion>
  );
};

const AnimatedAccordion = styled(Animated.View)`
  overflow: hidden;
`;

const WrapperView = styled.View`
  width: ${screenWidth}px;
  position: absolute;
`;

const styles = StyleSheet.create({});

export default Accordion;
