import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { router } from "expo-router";
import styled from "styled-components/native";

import Button from "@components/Button";
import FormKit from "@components/FormKit";
import ScreenHeader from "@components/ScreenHeader";
import ScreenRootView from "@components/ScreenRootView";

import { usePasswordResetLink } from "@generated/authentication/authentication";
import { useScreenData } from "@hooks/useScreenData";
import { screenWidth } from "@utils/common";
import { horizontalScale, verticalScale } from "@utils/layouts";
import { EMAIL_REGEX } from "@constants";

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

const ForgotPasswordScreen: React.FC<Props> = () => {
  const screenData = useScreenData();
  const { t } = useTranslation();

  const sendPasswordResetMail = usePasswordResetLink();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<Form.ResetPassword>();

  const onSubmitEmail = async (form: Form.ResetPassword) => {
    if (!isValid) return;
    try {
      await sendPasswordResetMail.mutateAsync({
        data: {
          email: form.email,
        },
      });
      router.replace({
        pathname: "/update-success",
        params: {
          title: t("forgot_password.check_email_title"),
          description: t("forgot_password.check_email_description"),
          template: "send-email",
          subDescription: t("forgot_password.check_email_subDescription"),
          shouldReplace: 1,
          prevPage: "/(auth)/login",
        } as Navigation.UpdateSuccessParams,
      });
    } catch (error) {
      console.log("Error on send password reset mail: ", error);
    }
  };

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
            title={t("forgot_password.title")}
            desc={t("forgot_password.description")}
          />

          <FormKit.Container screenData={screenData}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: {
                  value: true,
                  message: t("form.empty_email"),
                },
                pattern: {
                  value: EMAIL_REGEX,
                  message: t("form.invalid_email"),
                },
              }}
              render={({
                field: { value, onChange },
                formState: { errors },
              }) => (
                <FormKit.Input
                  placeHolder={t("form.enter_email")}
                  defaultValue={value}
                  keyboardType="email-address"
                  onChangeText={onChange}
                  hideErrorMessage
                  error={errors.email?.message}
                />
              )}
            />
          </FormKit.Container>

          <SubmitButton
            screenData={screenData}
            text={t("register.register")}
            isLoading={sendPasswordResetMail.isPending}
            onPress={handleSubmit((value) => onSubmitEmail(value))}
          />
        </Body>
      </ScrollView>
    </ScreenRootView>
  );
};

export default ForgotPasswordScreen;
