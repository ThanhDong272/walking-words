import React from "react";
import type { TextProps } from "react-native";
import styled from "styled-components/native";

import DefaultTheme from "@theme";
interface ComponentPropsInterface {
  color?: string;
}
const StyledTextBase = styled.Text<ComponentPropsInterface>`
  color: ${(props) => props.color ?? props.theme.colors.black};
  font-family: ${DefaultTheme.fonts.metropolis.regular};
`;
const Component = (props: ComponentPropsInterface & TextProps) => {
  return <StyledTextBase {...props} allowFontScaling={false} />;
};

Component.default = {};

export default Component;
