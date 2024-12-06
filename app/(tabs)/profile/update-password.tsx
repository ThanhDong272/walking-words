import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import styled from "styled-components/native";

import Button from "@components/Button";
import FormKit from "@components/FormKit";
import ScreenHeader from "@components/ScreenHeader";
import ScreenRootView from "@components/ScreenRootView";

import { useChangePassword } from "@generated/user/user";
import { useScreenData } from "@hooks/useScreenData";
import { verticalScale } from "@utils/layouts";

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

const UpdatePasswordScreen: React.FC<Props> = () => {
  const { t } = useTranslation();
  const screenData = useScreenData();

  const changePassword = useChangePassword();

  const { control, handleSubmit, setError } =
    useForm<Form.UpdateProfilePassword>();

  const onChangePassword = async (form: Form.UpdateProfilePassword) => {
    try {
      await changePassword.mutateAsync({
        data: {
          password: form.currentPassword,
          new_password: form.newPassword,
          new_password_confirmation: form.confirmNewPassword,
        },
      });

      router.push({
        pathname: "/update-success",
        params: {
          title: t("profile.password_updated"),
          description: t("profile.password_updated_description"),
        },
      });
    } catch (error) {
      console.log("Error on change password: ", error);
    }
  };

  useEffect(() => {
    if (
      changePassword.error?.isAxiosError &&
      changePassword.error.response?.data.message
    ) {
      setError("confirmNewPassword", {
        message: changePassword.error.response?.data.message,
      });
    }
  }, [changePassword.error]);

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
              title={t("profile.update_password")}
              desc={t("profile.update_password_description")}
            />
            <FormKit.Container screenData={screenData}>
              <Controller
                control={control}
                name="currentPassword"
                rules={{
                  required: {
                    value: true,
                    message: t("form.empty_password"),
                  },
                }}
                render={({
                  field: { value, onChange },
                  formState: { errors },
                }) => (
                  <FormKit.Input
                    placeHolder={t("form.current_password")}
                    defaultValue={value}
                    mode="password"
                    onChangeText={onChange}
                    hideErrorMessage
                    error={errors.currentPassword?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="newPassword"
                rules={{
                  required: {
                    value: true,
                    message: t("form.empty_password"),
                  },
                }}
                render={({ field: { value, onChange } }) => (
                  <FormKit.Input
                    placeHolder={t("form.new_password")}
                    defaultValue={value}
                    mode="password"
                    onChangeText={onChange}
                    hideErrorMessage
                  />
                )}
              />
              <Controller
                control={control}
                name="confirmNewPassword"
                rules={{
                  required: {
                    value: true,
                    message: t("form.empty_password"),
                  },
                }}
                render={({
                  field: { value, onChange },
                  formState: { errors },
                }) => (
                  <FormKit.Input
                    placeHolder={t("form.enter_confirm_password")}
                    defaultValue={value}
                    mode="password"
                    hideErrorIndicator
                    onChangeText={onChange}
                    error={
                      errors.currentPassword?.message ??
                      errors.newPassword?.message ??
                      errors.confirmNewPassword?.message
                    }
                  />
                )}
              />
            </FormKit.Container>
          </View>
          <UpdateButtonContainer screenData={screenData}>
            <UpdateButton
              screenData={screenData}
              text={t("profile.next")}
              isLoading={changePassword.isPending}
              disabled={changePassword.isPending}
              onPress={handleSubmit((value) => onChangePassword(value))}
            />
          </UpdateButtonContainer>
        </Body>
      </ScrollView>
    </ScreenRootView>
  );
};

export default UpdatePasswordScreen;
