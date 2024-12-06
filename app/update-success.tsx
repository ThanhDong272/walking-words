import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import type { Href } from "expo-router";
import { router } from "expo-router";
import styled from "styled-components/native";

import Button from "@components/Button";
import ScreenHeader from "@components/ScreenHeader";
import ScreenRootView from "@components/ScreenRootView";
import Text from "@views/Text";

import { useScreenData } from "@hooks/useScreenData";
import { getColorWithOpacity } from "@utils/common";
import { horizontalScale, moderateScale, verticalScale } from "@utils/layouts";

import { images } from "@assets/images";
import DefaultTheme from "@theme";

const Body = styled.View<Layout.ResponsiveData>`
  margin-top: ${({ screenData }) =>
    verticalScale(
      screenData.displayMode === "tablet" ? 145 : 20,
      screenData,
    )}px;
  flex: 1;
  flex-direction: column;
  width: ${({ screenData }) =>
    screenData.displayMode === "tablet" ? "45%" : `100%`};
  padding-horizontal: ${({ screenData }) =>
    horizontalScale(
      screenData.displayMode === "tablet" ? 32 : 20,
      screenData,
    )}px;
`;

const IntroduceContainer = styled.View<Layout.ResponsiveData>`
  gap: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 10 : 8, screenData)}px;
  align-items: center;
`;

const UpdateSuccessImage = styled.Image<Layout.ResponsiveData>`
  width: ${({ screenData }) =>
    moderateScale(
      screenData.displayMode === "tablet" ? 300 : 280,
      screenData,
    )}px;
  height: ${({ screenData }) =>
    moderateScale(
      screenData.displayMode === "tablet" ? 280 : 260,
      screenData,
    )}px;
`;

const UpdateSuccessTitle = styled(Text)<Layout.ResponsiveData>`
  font-family: ${DefaultTheme.fonts.metropolis.medium};
  color: ${DefaultTheme.colors.white};
  font-size: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 32 : 26, screenData)}px;
`;

const UpdateSuccessDescription = styled(Text)<Layout.ResponsiveData>`
  text-align: center;
  color: ${getColorWithOpacity(DefaultTheme.colors.white, 0.6)};
  font-size: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 20 : 16, screenData)}px;
  padding-horizontal: ${({ screenData }) =>
    horizontalScale(
      screenData.displayMode === "tablet" ? 60 : 40,
      screenData,
    )}px;
`;

const SubmitButton = styled(Button)<Layout.ResponsiveData>`
  margin-top: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 65 : 32, screenData)}px;
  margin-bottom: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 65 : 32, screenData)}px;
`;

const SubDescription = styled(Text)<
  Layout.ResponsiveData & {
    safeAreaBottomInset: number;
  }
>`
  text-align: center;
  color: ${getColorWithOpacity(DefaultTheme.colors.white, 0.6)};
  font-size: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 18 : 14, screenData)}px;
  padding-horizontal: ${({ screenData }) =>
    horizontalScale(
      screenData.displayMode === "tablet" ? 60 : 40,
      screenData,
    )}px;
  padding-bottom: ${({ screenData, safeAreaBottomInset }) =>
    verticalScale(safeAreaBottomInset + 16, screenData)}px;
`;

interface Props {}

const UpdateSuccessScreen: React.FC<Props> = () => {
  const route = useRoute();
  const { t } = useTranslation();
  const screenData = useScreenData();
  const { bottom } = useSafeAreaInsets();

  const {
    title,
    subDescription,
    description,
    template,
    shouldReplace,
    prevPage,
  } = route.params as Navigation.UpdateSuccessParams;

  const banner = useMemo(() => {
    if (template === "send-email") {
      return images.sendEmailSuccess;
    }
    return images.success;
  }, [template]);

  const onNext = () => {
    const destinationPage = (prevPage ?? "/(tabs)/profile") as Href<string>;
    return shouldReplace === 1
      ? router.replace(destinationPage)
      : router.navigate(destinationPage);
  };

  const renderSubmitButton = useCallback(() => {
    if (template === "send-email") return null;

    return (
      <SubmitButton
        screenData={screenData}
        text={t("profile.next")}
        onPress={onNext}
      />
    );
  }, [template]);

  return (
    <ScreenRootView>
      <ScreenHeader onPressBackOption={onNext} />
      <ScrollView
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Body screenData={screenData}>
          <IntroduceContainer screenData={screenData}>
            <UpdateSuccessImage screenData={screenData} source={banner} />
            <UpdateSuccessTitle screenData={screenData}>
              {title}
            </UpdateSuccessTitle>
            <UpdateSuccessDescription screenData={screenData}>
              {description}
            </UpdateSuccessDescription>
            {renderSubmitButton()}
          </IntroduceContainer>
        </Body>
        {subDescription && (
          <SubDescription safeAreaBottomInset={bottom} screenData={screenData}>
            {subDescription}
          </SubDescription>
        )}
      </ScrollView>
    </ScreenRootView>
  );
};

export default UpdateSuccessScreen;
