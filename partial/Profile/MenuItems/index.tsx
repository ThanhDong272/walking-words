import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import styled from "styled-components/native";

import Text from "@views/Text";

import type { ScreenData } from "@hooks/useScreenData";
import { getColorWithOpacity, screenWidth } from "@utils/common";
import { moderateScale, verticalScale } from "@utils/layouts";

import { images } from "@assets/images";
import DefaultTheme from "@theme";

interface Props {
  screenData: ScreenData;
  menuItems: { title: string; onPress: () => void }[];
}

const Menu = styled.View<ResponsiveData>`
  background-color: ${DefaultTheme.colors.gray7};
  margin-top: ${({ screenData }) =>
    verticalScale(
      screenData.displayMode === "tablet" ? 120 : 80,
      screenData,
    )}px;
  margin-left: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 32 : 20, screenData)}px;
  margin-right: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 32 : 20, screenData)}px;
  padding-right: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 18 : 15, screenData)}px;
  padding-left: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 18 : 15, screenData)}px;
  width: ${screenWidth}px;
`;

const MenuItem = styled(TouchableOpacity)<ResponsiveData>`
  flex-direction: row;
  justify-content: space-between;
  padding-top: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 20 : 16, screenData)}px;
  padding-bottom: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 20 : 16, screenData)}px;
  background-color: ${DefaultTheme.colors.gray7};
  color: ${DefaultTheme.colors.white};
  line-height: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 20 : 16, screenData)}px;
`;

const MenuTitle = styled(Text)<ResponsiveData>`
  color: ${DefaultTheme.colors.white};
  font-size: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 20 : 16, screenData)}px;
  font-family: ${DefaultTheme.fonts.metropolis.regular};
  line-height: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 24 : 18, screenData)}px;
`;

const NextButton = styled(Image)<ResponsiveData>`
  background-color: ${getColorWithOpacity(DefaultTheme.colors.white, 0.1)};
  width: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 12 : 10, screenData)}px;
  height: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 18 : 16, screenData)}px;
`;

const LineSeparate = styled.View<ResponsiveData>`
  padding-right: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 18 : 15, screenData)}px;
  padding-left: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 18 : 15, screenData)}px;
  background-color: ${DefaultTheme.colors.grey41};
  height: 0.5px;
`;

const MenuItems: React.FC<Props> = ({ screenData, menuItems }) => {
  return (
    <Menu screenData={screenData}>
      {menuItems.map((item, index) => (
        <View key={`${index}-${item.title}`}>
          <MenuItem screenData={screenData} onPress={item.onPress}>
            <MenuTitle screenData={screenData}>{item.title}</MenuTitle>
            <NextButton screenData={screenData} source={images.icArrowNext} />
          </MenuItem>
          {menuItems?.length - 1 === index ? null : (
            <LineSeparate screenData={screenData} />
          )}
        </View>
      ))}
    </Menu>
  );
};

export default MenuItems;
