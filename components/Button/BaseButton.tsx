import React, { memo, useCallback } from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";

import Text from "@views/Text";

import { useScreenData } from "@hooks/useScreenData";
import { horizontalScale, moderateScale } from "@utils/layouts";

import type { BaseButtonProps } from "./index.props";

import DefaultTheme from "@theme";

const BaseButton = (props: BaseButtonProps): JSX.Element => {
  const screenData = useScreenData();
  const { text, isLoading, disabled, onPress, ...others } = props;

  const _onPress = isLoading || disabled ? undefined : onPress;

  const renderBody = useCallback(() => {
    if (isLoading) {
      return (
        <ActivityIndicator color={DefaultTheme.colors.white} size="large" />
      );
    }

    return <ButtonTitle screenData={screenData}>{text}</ButtonTitle>;
  }, [isLoading, disabled, text]);

  return (
    <Button
      screenData={screenData}
      onPress={_onPress}
      disabled={disabled}
      {...others}
    >
      {renderBody()}
    </Button>
  );
};

export default memo(BaseButton);

const Button = styled.TouchableOpacity<Layout.ResponsiveData>`
  background-color: ${DefaultTheme.colors.yellowD3};
  border-radius: ${({ screenData }) => moderateScale(5, screenData)}px;
  min-height: ${({ screenData }) =>
    horizontalScale(
      screenData.displayMode === "tablet" ? 57 : 48,
      screenData,
    )}px;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const ButtonTitle = styled(Text)<Layout.ResponsiveData>`
  font-size: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 20 : 16, screenData)}px;
  font-family: ${DefaultTheme.fonts.metropolis.medium};
  color: ${DefaultTheme.colors.black};
`;
