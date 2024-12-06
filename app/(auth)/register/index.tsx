import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import { router } from "expo-router";
import styled from "styled-components/native";

import Button from "@components/Button";
import FormKit from "@components/FormKit";
import ScreenHeader from "@components/ScreenHeader";
import ScreenRootView from "@components/ScreenRootView";
import Text from "@views/Text";

import { useRegister } from "@generated/authentication/authentication";
import type { Register422 } from "@generated/model";
import { useGetUserInfo } from "@generated/user/user";
import { useScreenData } from "@hooks/useScreenData";
import { getColorWithOpacity, screenWidth } from "@utils/common";
import { horizontalScale, moderateScale, verticalScale } from "@utils/layouts";
import LocalServices from "@services/local";
import { EMAIL_REGEX } from "@constants";

import DefaultTheme from "@theme";

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

const RegisterButton = styled(Button)<Layout.ResponsiveData>`
  margin-top: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 65 : 32, screenData)}px;
`;

const RegisterIntroduce = styled(Text)<Layout.ResponsiveData>`
  margin-top: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 92 : 45, screenData)}px;
  font-family: ${DefaultTheme.fonts.metropolis.medium};
  text-align: center;
  color: ${getColorWithOpacity(DefaultTheme.colors.white, 0.6)};
  font-size: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 14 : 12, screenData)}px;
`;

const RegisterScreen: React.FC<Props> = () => {
  const screenData = useScreenData();
  const { t } = useTranslation();

  const register = useRegister();

  const { control, handleSubmit, setError } = useForm<Form.Register>({
    defaultValues: __DEV__
      ? {
          email: "test5@example.com",
          password: process.env.EXPO_PUBLIC_TESTER_PASSWORD,
          confirmPassword: process.env.EXPO_PUBLIC_TESTER_PASSWORD,
        }
      : undefined,
  });

  const isLoading = useMemo(() => {
    return register.isPending;
  }, [register.isPending]);

  const onRegister = async (form: Form.Register) => {
    try {
      const { data: registerResponse } = await register.mutateAsync({
        data: {
          email: form.email,
          password: form.password,
          passwordConfirmation: form.confirmPassword,
        },
      });
      const accessToken = registerResponse?.accessToken;
      if (accessToken) {
        //Save token to Async Storage
        LocalServices.setItem("ACCESS_TOKEN", accessToken);
        router.replace({
          pathname: "/(screens)/update_name",
          params: {
            firstName: "",
            lastName: "",
          },
        });
      }
    } catch (error) {
      console.log("Error on register: ", error);
    }
  };

  useEffect(() => {
    const error = register.error?.response;
    if (!error) return;

    if (error.status === 422) {
      const errorResponse = (error.data as Register422).errors;
      Object.keys(errorResponse!).forEach((errorType) => {
        //@ts-expect-error something
        setError(errorType, {
          message: errorResponse![errorType],
        });
      });
    }
    setError("confirmPassword", { message: error.data.message });
  }, [register.error, setError]);

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
            title={t("register.title")}
            desc={t("register.description")}
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
                    errors.email?.message ??
                    errors.password?.message ??
                    errors.confirmPassword?.message
                  }
                />
              )}
            />
          </FormKit.Container>

          {screenData.displayMode === "phone" ? (
            <RegisterIntroduce screenData={screenData}>
              {t("register.introduce")}
            </RegisterIntroduce>
          ) : null}

          <RegisterButton
            screenData={screenData}
            text={t("register.register")}
            isLoading={isLoading}
            onPress={handleSubmit((value) => onRegister(value))}
          />

          {screenData.displayMode === "tablet" ? (
            <RegisterIntroduce screenData={screenData}>
              {t("register.introduce")}
            </RegisterIntroduce>
          ) : null}
        </Body>
      </ScrollView>
    </ScreenRootView>
  );
};

export default RegisterScreen;
