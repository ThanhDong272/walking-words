import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import styled from "styled-components/native";

import Button from "@components/Button";
import FormKit from "@components/FormKit";
import ScreenHeader from "@components/ScreenHeader";
import ScreenRootView from "@components/ScreenRootView";

import { useChangeEmail, useGetUserInfo } from "@generated/user/user";
import { useScreenData } from "@hooks/useScreenData";
import { verticalScale } from "@utils/layouts";

interface Props {}

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

const UpdateEmailScreen: React.FC<Props> = () => {
  const { t } = useTranslation();
  const screenData = useScreenData();

  const { data } = useGetUserInfo();

  const changeEmail = useChangeEmail();

  const { control, handleSubmit } = useForm<Form.UpdateProfileEmail>();

  const onChangeEmail = async (form: Form.UpdateProfileEmail) => {
    console.log(form);
    try {
      await changeEmail.mutateAsync({
        data: {
          current_email: form.email,
          new_email: form.confirmEmail,
        },
      });
      router.push({
        pathname: "/update-success",
        params: {
          title: t("profile.email_updated"),
          description: t("profile.email_updated_description"),
        },
      });
    } catch (error) {
      console.log("Error on change email: ", error);
    }
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
              title={t("profile.update_email")}
              desc={t("profile.update_email_description")}
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
                }}
                render={({
                  field: { value, onChange },
                  formState: { errors },
                }) => (
                  <FormKit.Input
                    placeHolder={t("form.current_email")}
                    defaultValue={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    hideErrorMessage
                    error={errors.email?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="confirmEmail"
                rules={{
                  required: {
                    value: true,
                    message: t("form.empty_email"),
                  },
                }}
                render={({
                  field: { value, onChange },
                  formState: { errors },
                }) => (
                  <FormKit.Input
                    placeHolder={t("form.new_email")}
                    defaultValue={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    hideErrorMessage
                    error={errors.email?.message}
                  />
                )}
              />
            </FormKit.Container>
          </View>
          <UpdateButtonContainer screenData={screenData}>
            <UpdateButton
              screenData={screenData}
              text={t("profile.next")}
              isLoading={changeEmail.isPending}
              disabled={changeEmail.isPending}
              onPress={handleSubmit((value) => onChangeEmail(value))}
            />
          </UpdateButtonContainer>
        </Body>
      </ScrollView>
    </ScreenRootView>
  );
};

export default UpdateEmailScreen;
