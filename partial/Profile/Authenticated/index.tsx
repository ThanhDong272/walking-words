import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { router, useFocusEffect } from "expo-router";
import styled from "styled-components/native";

import Button from "@components/Button";
import LoadingOverlay from "@components/LoadingOverlay";
import Text from "@views/Text";

import { useLogout } from "@generated/authentication/authentication";
import { useGetUserInfo } from "@generated/user/user";
import { useScreenData } from "@hooks/useScreenData";
import { getColorWithOpacity, screenWidth } from "@utils/common";
import { horizontalScale, moderateScale, verticalScale } from "@utils/layouts";
import LocalServices from "@services/local";
import { EQueryUser } from "@constants/queries";

import Container from "../Container";
import MenuItems from "../MenuItems";

import DefaultTheme from "@theme";

interface Props {}

const Body = styled.View<ResponsiveData>`
  margin-top: ${({ screenData }) =>
    verticalScale(
      screenData.displayMode === "tablet" ? 207 : 75,
      screenData,
    )}px;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: ${({ screenData }) =>
    screenData.displayMode === "tablet"
      ? "45%"
      : `${((screenWidth - horizontalScale(20, screenData)) / screenWidth) * 100}%`};
  align-self: center;
`;

const IntroduceContainer = styled.View<ResponsiveData>`
  gap: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 10 : 8, screenData)}px;
`;

const ProfileName = styled(Text)<ResponsiveData>`
  font-family: ${DefaultTheme.fonts.metropolis.medium};
  text-align: center;
  color: ${DefaultTheme.colors.white};
  font-size: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 32 : 26, screenData)}px;
`;

const ProfileEmail = styled(Text)<ResponsiveData>`
  color: ${getColorWithOpacity(DefaultTheme.colors.white, 0.6)};
  font-size: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 20 : 16, screenData)}px;
`;

const LogoutButton = styled(Button.Text)<ResponsiveData>`
  margin-bottom: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 27 : 22, screenData)}px;
  align-self: center;
`;

const Authenticated: React.FC<Props> = () => {
  const { t } = useTranslation();
  const screenData = useScreenData();

  const logout = useLogout();
  const { data: dataProfile, refetch } = useGetUserInfo({
    query: {
      queryKey: [EQueryUser.USER_PROFILE],
    },
  });

  const menuItems = [
    {
      title: t("profile.update_name"),
      onPress: () =>
        router.navigate({ pathname: "/(tabs)/profile/update-name" }),
    },
    {
      title: t("profile.update_email"),
      onPress: () =>
        router.navigate({ pathname: "/(tabs)/profile/update-email" }),
    },
    {
      title: t("profile.update_password"),
      onPress: () =>
        router.navigate({ pathname: "/(tabs)/profile/update-password" }),
    },
  ];

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  const handleLogout = async () => {
    try {
      const { success } = await logout.mutateAsync();

      if (success) {
        LocalServices.clear();
        router.replace("/(auth)/login");
      }
    } catch (error) {
      console.log("Error on logout: ", error);
    }
  };

  const renderFullName = useCallback(() => {
    if (dataProfile && dataProfile.data) {
      const { firstName, lastName } = dataProfile.data;
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      }
    }
    return null;
  }, [dataProfile]);

  const isLoadingLogout = useMemo(() => {
    return logout.isPending;
  }, [logout.isPending]);

  return (
    <>
      <Container>
        <Body screenData={screenData}>
          <IntroduceContainer screenData={screenData}>
            <ProfileName screenData={screenData}>
              {renderFullName()}
            </ProfileName>
            <ProfileEmail screenData={screenData}>
              {dataProfile?.data?.email}
            </ProfileEmail>
          </IntroduceContainer>
          <MenuItems screenData={screenData} menuItems={menuItems} />
        </Body>
        <LogoutButton
          color={DefaultTheme.colors.redFF}
          screenData={screenData}
          text={t("action.logout")}
          onPress={handleLogout}
        />
      </Container>
      <LoadingOverlay loading={isLoadingLogout} />
    </>
  );
};

export default Authenticated;
