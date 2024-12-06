import React from "react";
import styled, { useTheme } from "styled-components/native";

import { getColorWithOpacity } from "@utils/common";

import DefaultTheme from "@theme";

interface Props {
  loading?: boolean;
  color?: string;
}
const DimmedOverlay = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  background-color: ${getColorWithOpacity(DefaultTheme.colors.black, 0.5)};
`;

const ActivityIndicator = styled.ActivityIndicator`
  width: 30%;
  justify-content: center;
  align-items: center;
`;

const LoadingOverlay: React.FC<Props> = ({ loading, color }) => {
  const theme = useTheme();

  return loading ? (
    <DimmedOverlay>
      <ActivityIndicator
        animating
        size="large"
        color={color || theme.colors.white}
      />
    </DimmedOverlay>
  ) : null;
};

export default LoadingOverlay;
