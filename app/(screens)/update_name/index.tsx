import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import styled from "styled-components/native";

import Button from "@components/Button";
import FormKit from "@components/FormKit";
import ScreenHeader from "@components/ScreenHeader";
import ScreenRootView from "@components/ScreenRootView";

import { useUpdateUser } from "@generated/user/user";
import { useScreenData } from "@hooks/useScreenData";
import { verticalScale } from "@utils/layouts";
import LocalServices from "@services/local";

const Body = styled.View<Layout.ResponsiveData>`
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

const UpdateButtonContainer = styled.View<Layout.ResponsiveData>``;

const UpdateButton = styled(Button)<Layout.ResponsiveData>`
  margin-top: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 65 : 32, screenData)}px;
  margin-bottom: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 65 : 32, screenData)}px;
`;
interface Props {}

const UpdateNameScreen: React.FC<Props> = () => {
  const { t } = useTranslation();
  const screenData = useScreenData();
  const route = useRoute();

  const updateName = useUpdateUser();

  const { firstName, lastName, forceLogout } = route.params as {
    firstName: string;
    lastName: string;
    forceLogout?: string;
  };

  const userSkip = LocalServices.getItem("USER_SKIP");

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<Form.UpdateProfileName>();

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

        // const navigationPath = forceLogout
        //   ? router.back()
        //   : router.push({
        //       pathname: "/(tabs)/home",
        //       params: { showPopup: "showPopup" },
        //     });

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

    router.replace("/(tabs)/profile");
  };

  return (
    <ScreenRootView>
      <ScreenHeader />
      <ScrollView
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Body screenData={screenData}>
          <View>
            <FormKit.Header
              title={t("profile.update_name")}
              desc={t("profile.update_name_description")}
            />
            <FormKit.Container screenData={screenData}>
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
            </FormKit.Container>
          </View>
          <UpdateButtonContainer screenData={screenData}>
            <UpdateButton
              screenData={screenData}
              text={t("profile.next")}
              onPress={handleSubmit((value) => onNext(value))}
            />
          </UpdateButtonContainer>
        </Body>
      </ScrollView>
    </ScreenRootView>
  );
};

export default UpdateNameScreen;
