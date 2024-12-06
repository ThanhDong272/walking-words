import React, { memo, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import styled from "styled-components/native";

import Icon from "@components/Icon";
import Text from "@views/Text";

import { useScreenData } from "@hooks/useScreenData";
import { getColorWithOpacity } from "@utils/common";
import { horizontalScale, moderateScale } from "@utils/layouts";

import type { BaseScreenHeaderProps } from "./index.props";

import DefaultTheme from "@theme";

const RootContainer = styled.View<Layout.ResponsiveData>`
  flex-direction: row;
  padding-top: ${({ screenData }) =>
    horizontalScale(
      screenData.displayMode === "tablet" ? 42 : 16,
      screenData,
    )}px;
  padding-horizontal: ${({ screenData }) =>
    horizontalScale(
      screenData.displayMode === "tablet" ? 32 : 20,
      screenData,
    )}px;
`;

const HeaderLeftSideContainer = styled.View<Layout.ResponsiveData>`
  flex: 0.3;
  align-self: center;
  align-items: flex-start;
`;

const HeaderRightSideContainer = styled.View<Layout.ResponsiveData>`
  flex: 0.3;
  align-self: center;
  align-items: flex-end;
`;

const HeaderCenterContainer = styled.View<Layout.ResponsiveData>`
  flex: 1;
  align-self: center;
`;

const BackButton = styled(Icon)<Layout.ResponsiveData>`
  background-color: ${getColorWithOpacity(DefaultTheme.colors.white, 0.1)};
  width: ${({ screenData }) => horizontalScale(32, screenData)}px;
  height: ${({ screenData }) => horizontalScale(32, screenData)}px;
  border-radius: ${({ screenData }) => moderateScale(4, screenData)}px;
`;

const ScreenHeader: React.FC<BaseScreenHeaderProps> = ({
  headerRight,
  headerLeft,
  headerTitle,
  onPressBackOption,
  showButtonBack = true,
}) => {
  const screenData = useScreenData();
  const { top } = useSafeAreaInsets();

  const onPressBack = () => {
    if (onPressBackOption) {
      onPressBackOption();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  const renderHeaderLeft = useCallback(() => {
    if (headerLeft) return headerLeft;
    return (
      <BackButton
        screenData={screenData}
        iconName="ic_arrow_back"
        color={DefaultTheme.colors.white}
        onPress={onPressBack}
      />
    );
  }, [screenData.displayMode, headerLeft, headerRight]);

  return (
    <RootContainer screenData={screenData} style={{ marginTop: top }}>
      <HeaderLeftSideContainer screenData={screenData}>
        {showButtonBack ? renderHeaderLeft() : null}
      </HeaderLeftSideContainer>

      <HeaderCenterContainer screenData={screenData}>
        <Text>{headerTitle}</Text>
      </HeaderCenterContainer>

      <HeaderRightSideContainer screenData={screenData}>
        {headerRight}
      </HeaderRightSideContainer>
    </RootContainer>
  );
};

export default memo(ScreenHeader);
