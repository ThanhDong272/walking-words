import React, { memo } from "react";
import styled from "styled-components/native";

import Text from "@views/Text";

import { useScreenData } from "@hooks/useScreenData";
import { moderateScale } from "@utils/layouts";

import type { TextButtonProps } from "./index.props";

import DefaultTheme from "@theme";

const TextButton = (props: TextButtonProps): JSX.Element => {
  const screenData = useScreenData();
  const {
    text,
    color = DefaultTheme.colors.white,
    fontSize = 16,
    disabled,
    onPress,
    ...others
  } = props;

  const _onPress = disabled ? undefined : onPress;

  return (
    <ButtonContainer
      screenData={screenData}
      onPress={_onPress}
      disabled={disabled}
      {...others}
    >
      <ButtonTitle screenData={screenData} color={color} fontSize={fontSize}>
        {text}
      </ButtonTitle>
    </ButtonContainer>
  );
};

export default memo(TextButton);

const ButtonContainer = styled.TouchableOpacity<Layout.ResponsiveData>``;

const ButtonTitle = styled(Text)<
  ResponsiveData & { fontSize: number; color: string }
>`
  font-size: ${({ screenData, fontSize }) =>
    moderateScale(fontSize, screenData)}px;
  font-family: ${DefaultTheme.fonts.metropolis.medium};
  color: ${(props) => props.color};
`;
