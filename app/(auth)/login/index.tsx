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

import { useLogin } from "@generated/authentication/authentication";
import { useGetUserInfo } from "@generated/user/user";
import { useScreenData } from "@hooks/useScreenData";
import { getColorWithOpacity, screenWidth } from "@utils/common";
import { horizontalScale, verticalScale } from "@utils/layouts";
import LocalServices from "@services/local";
import { EMAIL_REGEX } from "@constants";

import DefaultTheme from "@theme";

interface Props {}

const Body = styled.View<Layout.ResponsiveData>`
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

const ForgotPasswordButton = styled(Button.Text)<Layout.ResponsiveData>`
  align-self: flex-start;
  margin-top: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 22 : 18, screenData)}px;
`;

const LoginButton = styled(Button)<Layout.ResponsiveData>`
  margin-top: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 65 : 32, screenData)}px;
`;

const SuggestRegisterButton = styled(Button.Text)<Layout.ResponsiveData>`
  margin-top: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 27 : 22, screenData)}px;
`;

const LoginScreen: React.FC<Props> = () => {
  const screenData = useScreenData();
  const { t } = useTranslation();

  const login = useLogin();

  const { isFetching: isFetchingUserProfile, refetch } = useGetUserInfo({
    query: {
      enabled: login.isSuccess,
    },
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { isValid },
  } = useForm<Form.Login>({
    defaultValues: __DEV__
      ? {
          email: process.env.EXPO_PUBLIC_TESTER_MAIL,
          password: process.env.EXPO_PUBLIC_TESTER_PASSWORD,
        }
      : undefined,
  });

  const isLoading = useMemo(() => {
    return login.isPending || isFetchingUserProfile;
  }, [login.isPending, isFetchingUserProfile]);

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

      const isProfileIncomplete =
        !profile?.data?.data?.firstName || !profile?.data?.data?.lastName;

      if (isProfileIncomplete) {
        return router.navigate({
          pathname: "/(screens)/update_name",
          params: { firstName: "", lastName: "" },
        });
      }

      return router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSkip = () => {
    LocalServices.setItem("USER_SKIP", "USER_SKIP");
    router.replace("/(tabs)/home");
  };

  useEffect(() => {
    if (login.error?.isAxiosError && login.error.response?.data.message) {
      setError("password", { message: login.error.response?.data.message });
    }
  }, [login.error, setError]);

  return (
    <ScreenRootView>
      <ScreenHeader.Introduce
        headerRight={
          <Button.Text
            text={t("action.skip")}
            color={DefaultTheme.colors.yellowD3}
            onPress={handleSkip}
          />
        }
      />
      <ScrollView
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Body screenData={screenData}>
          <FormKit.Header
            title={t("login.title")}
            desc={t("login.description")}
          />

          <FormKit.Container screenData={screenData}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: {
                  value: true,
                  message: "Please enter your email",
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
                  mode="password"
                  defaultValue={value}
                  onChangeText={onChange}
                  error={errors.email?.message ?? errors.password?.message}
                />
              )}
            />
          </FormKit.Container>

          <ForgotPasswordButton
            screenData={screenData}
            text={t("login.forgot_password")}
            color={getColorWithOpacity(DefaultTheme.colors.white, 0.6)}
            fontSize={screenData.displayMode === "tablet" ? 17 : 14}
            onPress={() => router.navigate("/(auth)/forgot_password")}
          />

          <LoginButton
            screenData={screenData}
            text={t("login.login")}
            isLoading={isLoading}
            onPress={handleSubmit((value) => onLogin(value))}
          />
          <SuggestRegisterButton
            screenData={screenData}
            text={t("login.no_account")}
            onPress={() => router.navigate("/(auth)/register")}
          />
        </Body>
      </ScrollView>
    </ScreenRootView>
  );
};

export default LoginScreen;
