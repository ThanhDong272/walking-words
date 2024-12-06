import React, { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { router, useFocusEffect } from "expo-router";
import styled from "styled-components/native";

import Button from "@components/Button";
import FormKit from "@components/FormKit";
import Text from "@views/Text";

import { useLogin } from "@generated/authentication/authentication";
import { useGetUserInfo } from "@generated/user/user";
import { useScreenData } from "@hooks/useScreenData";
import { getColorWithOpacity, screenWidth } from "@utils/common";
import { horizontalScale, moderateScale, verticalScale } from "@utils/layouts";
import LocalServices from "@services/local";

import Container from "../Container";

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

const LoginTitle = styled(Text)<ResponsiveData>`
  font-family: ${DefaultTheme.fonts.metropolis.medium};
  text-align: center;
  color: ${DefaultTheme.colors.white};
  font-size: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 32 : 26, screenData)}px;
`;

const LoginDescription = styled(Text)<ResponsiveData>`
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

const ForgotPasswordButton = styled(Button.Text)<ResponsiveData>`
  align-self: flex-start;
  margin-top: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 22 : 18, screenData)}px;
`;

const LoginButton = styled(Button)<ResponsiveData>`
  margin-top: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 65 : 32, screenData)}px;
`;

const SuggestRegisterButton = styled(Button.Text)<ResponsiveData>`
  margin-top: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 27 : 22, screenData)}px;
`;

const Unauthenticated: React.FC<Props> = () => {
  const { t } = useTranslation();
  const screenData = useScreenData();

  const login = useLogin();
  const { data: dataProfile, refetch } = useGetUserInfo();

  const {
    control,
    handleSubmit,
    setError,
    formState: { isValid },
  } = useForm<Form.Login>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  useEffect(() => {
    if (login.error?.isAxiosError && login.error.response?.data.message) {
      setError("password", { message: login.error.response?.data.message });
    }
  }, [login.error, setError]);

  const onLogin = async (form: Form.Login) => {
    if (!isValid) return;

    try {
      const { data } = await login.mutateAsync({
        data: {
          email: form.email,
          password: form.password,
        },
      });

      const accessToken = data?.accessToken;
      if (!accessToken) return;

      LocalServices.setItem("ACCESS_TOKEN", accessToken);

      const profile = await refetch();
      const userFirstName = profile?.data?.data?.firstName;

      if (userFirstName === null) {
        return router.navigate({
          pathname: "/(screens)/update_name",
          params: {
            firstName: "",
            lastName: "",
          },
        });
      }

      LocalServices.removeItem("USER_SKIP");
      return router.replace("/(tabs)/profile");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Container>
      <Body screenData={screenData}>
        <IntroduceContainer screenData={screenData}>
          <LoginTitle screenData={screenData}>{t("login.title")}</LoginTitle>
          <LoginDescription screenData={screenData}>
            {t("login.description")}
          </LoginDescription>
        </IntroduceContainer>

        <FormContainer screenData={screenData}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: {
                value: true,
                message: t("form.empty_email"),
              },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t("form.invalid_email"),
              },
            }}
            render={({ field: { value, onChange }, formState: { errors } }) => (
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
            render={({ field: { value, onChange }, formState: { errors } }) => (
              <FormKit.Input
                placeHolder={t("form.enter_password")}
                mode="password"
                defaultValue={value}
                onChangeText={onChange}
                error={errors.email?.message ?? errors.password?.message}
              />
            )}
          />
        </FormContainer>

        <ForgotPasswordButton
          screenData={screenData}
          text={t("login.forgot_password")}
          color={getColorWithOpacity(DefaultTheme.colors.white, 0.6)}
          fontSize={screenData.displayMode === "tablet" ? 17 : 14}
          onPress={() => console.log("forgot password")}
        />

        <LoginButton
          screenData={screenData}
          isLoading={login.isPending}
          text={t("login.login")}
          onPress={handleSubmit((value) => onLogin(value))}
        />

        <SuggestRegisterButton
          screenData={screenData}
          text={t("login.no_account")}
          onPress={() => router.navigate("/(auth)/register")}
        />
      </Body>
    </Container>
  );
};

export default Unauthenticated;
