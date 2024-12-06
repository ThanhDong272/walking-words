import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";

import { mainLinearGradient } from "@theme";

interface Props {
  colors?: [];
  top?: number;
  children?: React.ReactNode;
}

const LinearGradientView: React.FC<Props> = ({ colors, top, children }) => {
  return (
    <Container colors={colors || mainLinearGradient} top={top || 0}>
      {children}
    </Container>
  );
};

const Container = styled(LinearGradient)<{ top: number }>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 100%;
  padding-top: ${(props) => props.top}px;
`;

export default LinearGradientView;
