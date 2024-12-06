import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styled from "styled-components/native";

import LoadingOverlay from "@components/LoadingOverlay";
import ScreenRootView from "@components/ScreenRootView";
import Text from "@views/Text";

import { useLogout } from "@generated/authentication/authentication";
import { useScreenData } from "@hooks/useScreenData";
import { horizontalScale, moderateScale } from "@utils/layouts";

import DefaultTheme from "@theme";

interface Props {
  children: React.ReactNode;
}

const Header = styled.View<ResponsiveData>`
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

const HeaderTitle = styled(Text)<ResponsiveData>`
  font-family: ${DefaultTheme.fonts.metropolis.bold};
  font-size: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 26 : 24, screenData)}px;
  color: ${DefaultTheme.colors.white};
  flex: 1;
`;

const Container: React.FC<Props> = ({ children }) => {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();
  const screenData = useScreenData();

  const logout = useLogout();

  const isLoadingLogout = useMemo(() => {
    return logout.isPending;
  }, [logout.isPending]);

  return (
    <ScreenRootView>
      <Header screenData={screenData} style={{ marginTop: top }}>
        <HeaderTitle screenData={screenData}>{t("profile.title")}</HeaderTitle>
      </Header>

      <ScrollView
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {children}
      </ScrollView>
      <LoadingOverlay loading={isLoadingLogout} />
    </ScreenRootView>
  );
};

export default Container;
