import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { TextInput as RNTextInput } from "react-native";
import * as Device from "expo-device";
import { router } from "expo-router";
import styled from "styled-components/native";

import TextInput from "@views/Input";

import useDeviceType from "@hooks/useDeviceType";
import { ALPHA_VALUE } from "@constants/index";

import { images } from "@assets/images";
import DefaultTheme from "@theme";

interface Props {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

const SearchInput: React.FC<Props> = ({ placeholder, value, onChangeText }) => {
  const { t } = useTranslation();
  const deviceType = useDeviceType();
  const inputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  }, []);

  return (
    <Container>
      <TextInput
        inputRef={inputRef}
        style={[
          deviceType === Device.DeviceType.PHONE
            ? { width: "100%" }
            : { width: "35%" },
          { justifyContent: "flex-end" },
        ]}
        placeholder={placeholder || t("search.search")}
        placeholderTextColor={DefaultTheme.colors.white}
        value={value}
        onChangeText={onChangeText}
        enableIcon
        enableIconLeft
        iconImageSource={images.phXBold}
        iconLeftImageSource={images.glass}
        cursorColor={DefaultTheme.colors.white}
        onIconPress={() => {
          router.dismiss();
        }}
        disableIconLeftPress={true}
        textInputStyle={{
          backgroundColor: DefaultTheme.colors.black + ALPHA_VALUE.alpha_03,
          paddingLeft: 44,
        }}
      />
    </Container>
  );
};

const Container = styled.View`
  position: relative;
  flex-direction: row;
  align-items: center;
`;

export default SearchInput;
