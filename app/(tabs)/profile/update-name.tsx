import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import styled from "styled-components/native";

import Button from "@components/Button";
import FormKit from "@components/FormKit";
import ScreenHeader from "@components/ScreenHeader";
import ScreenRootView from "@components/ScreenRootView";
import Text from "@views/Text";

import type { GetUserInfo200 } from "@generated/model";
import { useUpdateUser } from "@generated/user/user";
import { useScreenData } from "@hooks/useScreenData";
import { getColorWithOpacity } from "@utils/common";
import { moderateScale, verticalScale } from "@utils/layouts";
import LocalServices from "@services/local";
import { EQueryUser } from "@constants/queries";

import DefaultTheme from "@theme";

const Body = styled.View<ResponsiveData>`
  margin-top: ${({ screenData }) =>
    verticalScale(
      screenData.displayMode === "tablet" ? 145 : 20,
      screenData,
    )}px;
  flex: 1;
  flex-direction: column;
  width: ${({ screenData }) =>
    screenData.displayMode === "tablet" ? "45%" : `90%`};
  align-self: center;
  justify-content: ${({ screenData }) =>
    screenData.displayMode === "tablet" ? "flex-start" : "space-between"};
`;

const IntroduceContainer = styled.View<ResponsiveData>`
  gap: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 10 : 8, screenData)}px;
  align-items: flex-start;
`;

const UpdateNameTitle = styled(Text)<ResponsiveData>`
  font-family: ${DefaultTheme.fonts.metropolis.medium};
  color: ${DefaultTheme.colors.white};
  font-size: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 32 : 26, screenData)}px;
`;

const UpdateNameDescription = styled(Text)<ResponsiveData>`
  color: ${getColorWithOpacity(DefaultTheme.colors.white, 0.6)};
  font-size: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 20 : 16, screenData)}px;
`;

const FormContainer = styled.View<ResponsiveData>`
  margin-top: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 51 : 42, screenData)}px;
  gap: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 10 : 8, screenData)}px;
  width: 100%;
`;

const UpdateButtonContainer = styled.View<ResponsiveData>``;

const UpdateButton = styled(Button)<ResponsiveData>`
  margin-top: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 65 : 32, screenData)}px;
  margin-bottom: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 65 : 32, screenData)}px;
`;
interface Props {}

const UpdateNameScreen: React.FC<Props> = () => {
  const { t } = useTranslation();
  const screenData = useScreenData();
  const updateName = useUpdateUser();
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData([
    EQueryUser.USER_PROFILE,
  ]) as GetUserInfo200;
  const { firstName, lastName } = data.data;

  const userSkip = LocalServices.getItem("USER_SKIP");

  const {
    control,
    handleSubmit,
    formState: { isValid },
    setValue,
  } = useForm<Form.UpdateProfileName>({});

  useEffect(() => {
    setValue("firstName", firstName || "");
    setValue("lastName", lastName || "");
  }, [firstName, lastName, setValue]);

  const isLoading = useMemo(() => {
    return updateName.isPending;
  }, [updateName.isPending]);

  const onNext = async (form: Form.UpdateProfileName) => {
    if (!isValid) return;

    try {
      const { success } = await updateName.mutateAsync({
        data: {
          firstName: form?.firstName,
          lastName: form?.lastName,
        },
      });

      if (!success) return;

      if (firstName === "") {
        LocalServices.removeItem("USER_SKIP");

        const navigationPath = router.push({
          pathname: "/(tabs)/home",
          params: { showPopup: "showPopup" },
        });

        return navigationPath;
      }

      return router.push({
        pathname: "/update-success",
        params: {
          title: t("profile.name_updated"),
          description: t("profile.name_updated_description"),
        },
      });
    } catch (error) {
      console.error("Error updating profile name:", error);
    }
  };

  const handleGoBack = () => {
    if (userSkip) {
      LocalServices.removeItem("ACCESS_TOKEN");
      return router.dismissAll();
    }

    const isNameMissing = !firstName || !lastName;

    if (isNameMissing) {
      LocalServices.removeItem("ACCESS_TOKEN");
      return router.replace("/(auth)/login");
    }

    router.back();
  };

  return (
    <ScreenRootView>
      <ScreenHeader showButtonBack={true} onPressBackOption={handleGoBack} />
      <ScrollView
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Body screenData={screenData}>
          <View>
            <IntroduceContainer screenData={screenData}>
              <UpdateNameTitle screenData={screenData}>
                {t("profile.update_name")}
              </UpdateNameTitle>
              <UpdateNameDescription screenData={screenData}>
                {t("profile.update_name_description")}
              </UpdateNameDescription>
            </IntroduceContainer>
            <FormContainer screenData={screenData}>
              <Controller
                control={control}
                name="firstName"
                rules={{
                  required: {
                    value: true,
                    message: t("form.empty_name"),
                  },
                }}
                render={({
                  field: { value, onChange },
                  formState: { errors },
                }) => (
                  <FormKit.Input
                    placeHolder={t("form.first_name")}
                    defaultValue={value}
                    onChangeText={onChange}
                    hideErrorMessage
                    error={errors.firstName?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="lastName"
                rules={{
                  required: {
                    value: true,
                    message: t("form.empty_name"),
                  },
                }}
                render={({
                  field: { value, onChange },
                  formState: { errors },
                }) => (
                  <FormKit.Input
                    placeHolder={t("form.last_name")}
                    defaultValue={value}
                    onChangeText={onChange}
                    hideErrorMessage
                    error={errors.lastName?.message}
                  />
                )}
              />
            </FormContainer>
          </View>
          <UpdateButtonContainer screenData={screenData}>
            <UpdateButton
              screenData={screenData}
              text={t("profile.next")}
              isLoading={isLoading}
              onPress={handleSubmit((value) => onNext(value))}
            />
          </UpdateButtonContainer>
        </Body>
      </ScrollView>
    </ScreenRootView>
  );
};

export default UpdateNameScreen;
