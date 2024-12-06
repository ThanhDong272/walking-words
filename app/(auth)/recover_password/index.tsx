import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";

import Button from "@components/Button";
import FormKit from "@components/FormKit";
import ScreenHeader from "@components/ScreenHeader";
import ScreenRootView from "@components/ScreenRootView";

import { usePasswordReset } from "@generated/authentication/authentication";
import { useScreenData } from "@hooks/useScreenData";
import { screenWidth } from "@utils/common";
import { horizontalScale, verticalScale } from "@utils/layouts";

interface Props {}

const Body = styled.View<Layout.ResponsiveData>`
  margin-top: ${({ screenData }) =>
    verticalScale(
      screenData.displayMode === "tablet" ? 145 : 20,
      screenData,
    )}px;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: ${({ screenData }) =>
    screenData.displayMode === "tablet"
      ? "45%"
      : `${((screenWidth - horizontalScale(20, screenData) * 2) / screenWidth) * 100}%`};
  align-self: center;
`;

const SubmitButton = styled(Button)<Layout.ResponsiveData>`
  margin-top: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 65 : 32, screenData)}px;
`;

const RecoverPasswordScreen: React.FC<Props> = () => {
  const screenData = useScreenData();
  const { t } = useTranslation();
  const { token, userEMail } = useLocalSearchParams();

  const recoverPassword = usePasswordReset();
  const { control, handleSubmit, setError } = useForm<Form.RecoverPassword>();

  const onSubmitEmail = async (form: Form.RecoverPassword) => {
    if (!token || !userEMail) return;
    try {
      await recoverPassword.mutateAsync({
        data: {
          password: form.password,
          passwordConfirmation: form.confirmPassword,
          token: token as string,
          email: userEMail as string,
        },
      });
      router.replace({
        pathname: "/update-success",
        params: {
          title: t("profile.password_updated"),
          description: t("profile.password_recovered_description"),
          shouldReplace: 1,
          prevPage: "/(auth)/login",
        } as Navigation.UpdateSuccessParams,
      });
    } catch (error) {
      console.log("Error on send password reset mail: ", error);
    }
  };

  useEffect(() => {
    if (
      recoverPassword.error?.isAxiosError &&
      recoverPassword.error.response?.data.message
    ) {
      setError("confirmPassword", {
        message: recoverPassword.error.response?.data.message,
      });
    }
  }, [recoverPassword.error, setError]);
  return (
    <ScreenRootView>
      <ScreenHeader />
      <ScrollView
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Body screenData={screenData}>
          <FormKit.Header
            title={t("recover_password.title")}
            desc={t("recover_password.description")}
          />

          <FormKit.Container screenData={screenData}>
            <Controller
              control={control}
              name="password"
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
                  placeHolder={t("form.enter_password")}
                  defaultValue={value}
                  mode="password"
                  onChangeText={onChange}
                  hideErrorMessage
                  error={errors.password?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: {
                  value: true,
                  message: t("form.empty_confirm_password"),
                },
                validate: (value) =>
                  value === control._formValues.password ||
                  t("form.password_not_match"),
              }}
              render={({
                field: { value, onChange },
                formState: { errors },
              }) => (
                <FormKit.Input
                  placeHolder={t("form.enter_confirm_password")}
                  defaultValue={value}
                  mode="password"
                  onChangeText={onChange}
                  hideErrorIndicator={!errors.confirmPassword}
                  error={
                    errors.password?.message ?? errors.confirmPassword?.message
                  }
                />
              )}
            />
          </FormKit.Container>

          <SubmitButton
            screenData={screenData}
            text={t("register.register")}
            isLoading={recoverPassword.isPending}
            onPress={handleSubmit((value) => onSubmitEmail(value))}
          />
        </Body>
      </ScrollView>
    </ScreenRootView>
  );
};

export default RecoverPasswordScreen;
