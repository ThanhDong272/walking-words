import type { FC } from "react";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pressable, TextInput } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import styled from "styled-components/native";

import Icon from "@components/Icon";
import Text from "@views/Text";

import { useScreenData } from "@hooks/useScreenData";
import { getColorWithOpacity } from "@utils/common";
import { horizontalScale, moderateScale, verticalScale } from "@utils/layouts";

import type { FormInputProps } from "./index.props";

import DefaultTheme from "@theme";

const ANIMATION_DURATION = 250;
const PLACEHOLDER_TRANSLATE_RATIO = 0.7;
const INPUT_TRANSLATE_RATIO = 1 - PLACEHOLDER_TRANSLATE_RATIO;
const PHONE_INPUT_FONTSIZE = 14;
const TABLET_INPUT_FONTSIZE = 17;

const InputContainer = styled.View<
  Layout.ResponsiveData & { error?: string; hideErrorIndicator?: boolean }
>`
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background-color: ${getColorWithOpacity(DefaultTheme.colors.greyD3, 0.05)};
  gap: ${({ screenData }) => moderateScale(16, screenData)}px;
  padding-horizontal: ${({ screenData }) =>
    horizontalScale(
      screenData.displayMode === "tablet" ? 16 : 20,
      screenData,
    )}px;
  border-radius: ${({ screenData }) => moderateScale(5, screenData)}px;
  min-height: ${({ screenData }) =>
    moderateScale(screenData.displayMode === "tablet" ? 64 : 52, screenData)}px;
  border-color: ${({ error, hideErrorIndicator }) => {
    return error && !hideErrorIndicator
      ? DefaultTheme.colors.redFF
      : "transparent";
  }};
  border-width: 0.5px;
`;

const InputBodyContainer = styled.View<Layout.ResponsiveData>`
  flex-direction: column;
  flex: 1;
`;

const PlaceHolderText = styled(Animated.Text)<Layout.ResponsiveData>`
  color: ${getColorWithOpacity(DefaultTheme.colors.white, 0.6)};
  font-family: ${DefaultTheme.fonts.metropolis.regular};
  line-height: ${({ screenData }) =>
    moderateScale(
      screenData.displayMode === "tablet"
        ? TABLET_INPUT_FONTSIZE
        : PHONE_INPUT_FONTSIZE,
      screenData,
    )}px;
  font-size: ${({ screenData }) =>
    moderateScale(
      screenData.displayMode === "tablet"
        ? TABLET_INPUT_FONTSIZE
        : PHONE_INPUT_FONTSIZE,
      screenData,
    )}px;
`;

const Input = styled(Animated.createAnimatedComponent(TextInput))<{
  screenData: Layout.ScreenData;
}>`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;

  width: 100%;
  color: ${DefaultTheme.colors.white};
  font-family: ${DefaultTheme.fonts.metropolis.regular};
  font-size: ${({ screenData }) =>
    moderateScale(
      screenData.displayMode === "tablet"
        ? TABLET_INPUT_FONTSIZE
        : PHONE_INPUT_FONTSIZE,
      screenData,
    )}px;
  min-height: ${({ screenData }) =>
    moderateScale(
      screenData.displayMode === "tablet"
        ? TABLET_INPUT_FONTSIZE
        : PHONE_INPUT_FONTSIZE,
      screenData,
    )}px;
`;

const ErrorText = styled(Text)<Layout.ResponsiveData>`
  color: ${DefaultTheme.colors.redFF};
  margin-top: ${({ screenData }) => verticalScale(10, screenData)}px;
  align-self: flex-start;
`;

const FormInput: FC<FormInputProps> = ({
  error,
  keyboardType,
  hideErrorMessage,
  hideErrorIndicator,
  placeHolder,
  defaultValue,
  mode = "normal",
  onChangeText,
}) => {
  const screenData = useScreenData();
  const animatedValue = useSharedValue<number>(0);

  const inputRef = useRef<TextInput>(null);

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isInputActive, setInputActive] = useState<boolean>(false);

  const minimizeInputFontSize = useMemo(
    () => moderateScale(12, screenData),
    [screenData],
  );
  const phoneInputFontSize = useMemo(
    () => moderateScale(PHONE_INPUT_FONTSIZE, screenData),
    [screenData],
  );
  const tabletInputFontSize = useMemo(
    () => moderateScale(TABLET_INPUT_FONTSIZE, screenData),
    [screenData],
  );
  const inputVerticalGap = useMemo(
    () => verticalScale(4, screenData),
    [screenData],
  );

  const animatedPlaceHolderStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      animatedValue.value,
      [0, 1],
      [
        screenData.displayMode === "tablet"
          ? tabletInputFontSize
          : phoneInputFontSize,
        minimizeInputFontSize,
      ],
    );
    const translateY = interpolate(
      animatedValue.value,
      [0, 1],
      [
        0,
        -(
          PLACEHOLDER_TRANSLATE_RATIO *
          (screenData.displayMode === "tablet"
            ? tabletInputFontSize
            : phoneInputFontSize)
        ),
      ],
    );
    return {
      fontSize,
      lineHeight: fontSize,
      transform: [
        {
          translateY,
        },
      ],
    };
  });

  const animatedInputContainerStyle = useAnimatedStyle(() => {
    const translatedValue =
      INPUT_TRANSLATE_RATIO *
        (screenData.displayMode === "tablet"
          ? tabletInputFontSize
          : phoneInputFontSize) +
      inputVerticalGap;

    const translateY = interpolate(
      animatedValue.value,
      [0, 1],
      [0, translatedValue],
    );
    return {
      transform: [
        {
          translateY: translateY,
        },
      ],
    };
  });

  const onInputTextChange = useCallback(
    (text: string) => {
      if (text && !isInputActive) {
        setInputActive(true);
      } else if (!text) {
        setInputActive(false);
      }
      onChangeText(text);
    },
    [isInputActive],
  );

  useEffect(() => {
    animatedValue.value = withTiming(isInputActive ? 1 : 0, {
      duration: ANIMATION_DURATION,
    });
  }, [isInputActive]);

  //setInputActive status base on input default value
  useEffect(() => {
    setInputActive(Boolean(defaultValue));
  }, [defaultValue]);

  return (
    <Pressable onPress={() => inputRef.current?.focus()}>
      <InputContainer
        screenData={screenData}
        error={error}
        hideErrorIndicator={hideErrorIndicator}
      >
        <InputBodyContainer screenData={screenData}>
          <PlaceHolderText
            screenData={screenData}
            style={animatedPlaceHolderStyle}
          >
            {placeHolder}
          </PlaceHolderText>
          <Input
            screenData={screenData}
            ref={inputRef}
            keyboardType={keyboardType}
            style={[animatedInputContainerStyle]}
            secureTextEntry={mode === "password" && !passwordVisible}
            onChangeText={onInputTextChange}
            defaultValue={defaultValue}
            autoCapitalize={"none"}
          />
        </InputBodyContainer>
        {mode === "password" ? (
          <Icon
            iconName={passwordVisible ? "ic_eye_close" : "ic_eye_open"}
            onPress={() => setPasswordVisible(!passwordVisible)}
            size={20}
            color={DefaultTheme.colors.white}
          />
        ) : null}
      </InputContainer>
      {!hideErrorMessage ? (
        <ErrorText screenData={screenData}>{error}</ErrorText>
      ) : null}
    </Pressable>
  );
};

export default memo(FormInput);
