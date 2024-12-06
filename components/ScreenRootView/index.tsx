import type { FC } from "react";
import { memo } from "react";
import type { ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";

import DefaultTheme from "@theme";

interface ScreenRootViewProps extends ViewProps {}

const ScreenRootView: FC<ScreenRootViewProps> = ({ children }) => {
  return (
    <LinearView
      colors={[DefaultTheme.colors.black1E, DefaultTheme.colors.black]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearView>
  );
};

export default memo(ScreenRootView);

const LinearView = styled(LinearGradient)`
  flex: 1;
`;
