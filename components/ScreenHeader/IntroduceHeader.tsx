import React, { memo, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";

import { useScreenData } from "@hooks/useScreenData";
import { horizontalScale, verticalScale } from "@utils/layouts";

import type { IntroduceScreenHeaderProps } from "./index.props";

import { images } from "@assets/images";

const IntroduceScreenHeader: React.FC<IntroduceScreenHeaderProps> = ({
  headerRight,
  headerLeft,
}) => {
  const screenData = useScreenData();
  const { top } = useSafeAreaInsets();

  const renderHeaderLeft = useCallback(() => {
    if (screenData.displayMode === "phone" && !headerLeft)
      return (
        <HeaderRightSideContainer screenData={screenData}>
          {headerRight}
        </HeaderRightSideContainer>
      );

    return (
      <HeaderLeftSideContainer screenData={screenData}>
        {headerLeft}
      </HeaderLeftSideContainer>
    );
  }, [screenData.displayMode, headerLeft, headerRight]);

  const renderHeaderRight = useCallback(() => {
    //Do not render in phone display mode
    if (screenData.displayMode === "phone") return null;

    return headerRight;
  }, [screenData.displayMode, headerRight]);

  return (
    <RootContainer screenData={screenData} style={{ marginTop: top }}>
      {renderHeaderLeft()}

      <HeaderCenterContainer screenData={screenData}>
        <HeaderCenterImage screenData={screenData} source={images.logo} />
      </HeaderCenterContainer>

      <HeaderRightSideContainer screenData={screenData}>
        {renderHeaderRight()}
      </HeaderRightSideContainer>
    </RootContainer>
  );
};

export default memo(IntroduceScreenHeader);

const RootContainer = styled.View<Layout.ResponsiveData>`
  flex-direction: ${({ screenData }) =>
    screenData.displayMode === "tablet" ? "row" : "column"};
  align-items: ${({ screenData }) =>
    screenData.displayMode === "tablet" ? "center" : "auto"};
  margin-horizontal: ${({ screenData }) =>
    horizontalScale(
      screenData.displayMode == "tablet" ? 18 : 20,
      screenData,
    )}px;
  padding-top: ${({ screenData }) =>
    verticalScale(screenData.displayMode == "tablet" ? 42 : 16, screenData)}px;
`;

const HeaderLeftSideContainer = styled.View<Layout.ResponsiveData>`
  flex: ${({ screenData }) =>
    screenData.displayMode === "tablet" ? 0.3 : "auto"};
  align-self: ${({ screenData }) =>
    screenData.displayMode === "tablet" ? "center" : "flex-start"};
  align-items: flex-start;
`;

const HeaderRightSideContainer = styled.View<Layout.ResponsiveData>`
  flex: ${({ screenData }) =>
    screenData.displayMode === "tablet" ? 0.3 : "auto"};
  align-self: ${({ screenData }) =>
    screenData.displayMode === "tablet" ? "center" : "flex-end"};
  align-items: flex-end;
`;

const HeaderCenterContainer = styled.View<Layout.ResponsiveData>`
  flex: ${({ screenData }) =>
    screenData.displayMode === "tablet" ? 1 : "auto"};
  align-self: center;
`;

const HeaderCenterImage = styled.Image<Layout.ResponsiveData>`
  width: ${({ screenData }) =>
    horizontalScale(
      screenData.displayMode === "tablet" ? 235 : 220,
      screenData,
    )}px;
  height: ${({ screenData }) =>
    horizontalScale(
      screenData.displayMode === "tablet" ? 33 : 28,
      screenData,
    )}px;
  align-self: center;
  margin-top: ${({ screenData }) =>
    horizontalScale(screenData.displayMode == "tablet" ? 0 : 54, screenData)}px;
`;
