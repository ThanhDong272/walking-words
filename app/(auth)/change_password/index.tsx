import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";
import styled from "styled-components/native";

import Button from "@components/Button";
import FormKit from "@components/FormKit";
import ScreenHeader from "@components/ScreenHeader";
import ScreenRootView from "@components/ScreenRootView";

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
      : `${((screenWidth - horizontalScale(20, screenData)) / screenWidth) * 100}%`};
  align-self: center;
  padding-horizontal: ${({ screenData }) => horizontalScale(20, screenData)}px;
`;

const SubmitButton = styled(Button)<Layout.ResponsiveData>`
  margin-top: ${({ screenData }) =>
    verticalScale(screenData.displayMode === "tablet" ? 65 : 32, screenData)}px;
`;

const ChangePasswordScreen: React.FC<Props> = () => {
  const screenData = useScreenData();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<Form.ResetPassword>();

  const onRegister = (form: Form.ResetPassword) => {
    if (!isValid) return;
    console.log(form);
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
            title={t("change_password.title")}
            desc={t("change_password.description")}
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
            onPress={handleSubmit((value) => onRegister(value))}
          />
        </Body>
      </ScrollView>
    </ScreenRootView>
  );
};

export default ChangePasswordScreen;
