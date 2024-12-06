import { useTranslation } from "react-i18next";
import type { LayoutChangeEvent } from "react-native";
import { StyleSheet, View } from "react-native";
import Orientation from "react-native-orientation-locker";
import { useReadAudio } from "@context/AudioContext";
import { useChangeThemePage } from "@context/ChangeThemePageContext";
import { useDeviceType } from "@context/DeviceTypeContext";
import * as Device from "expo-device";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import styled from "styled-components/native";

import Icon from "@components/Icon";
import Switch from "@components/Switch";
import SpaceHeight from "@views/SpaceHeight";
import SpaceWidth from "@views/SpaceWidth";
import Text from "@views/Text";

import { images } from "@assets/images";
import DefaultTheme from "@theme";

import { ALPHA_VALUE, BOOK_READER_THEME } from "@/constants";

interface Props {
  isFullscreen: boolean;
  onTurnOnFullscreen: () => void;
  onTurnOffFullscreen: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}

const HeaderBookReader: React.FC<Props> = ({
  isFullscreen,
  onTurnOnFullscreen,
  onTurnOffFullscreen,
  onLayout,
}) => {
  const { t } = useTranslation();
  const { isReading, onReadingChapter } = useReadAudio();
  const { theme, onChangeTheme } = useChangeThemePage();
  const deviceType = useDeviceType();

  const handleDismiss = async () => {
    if (deviceType === Device.DeviceType.TABLET) {
      await ScreenOrientation.unlockAsync();
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      );

      Orientation.lockToPortrait();
    }

    router.dismiss();
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    onLayout?.(event);
  };

  const handleReadingChapter = () => {
    onReadingChapter({ audioUrl: "" });
  };

  return (
    <HeaderContainer
      onLayout={handleLayout}
      paddingHorizontal={deviceType === Device.DeviceType.PHONE ? 20 : 32}
    >
      <TitleContainer>
        <ButtonBack onPress={handleDismiss}>
          <Icon
            iconName={"ic_arrow_back"}
            size={14}
            color={DefaultTheme.colors.white}
            disabled={true}
          />
        </ButtonBack>
        {isFullscreen && (
          <TouchableButton
            onPress={onTurnOffFullscreen}
            paddingHorizontal={deviceType === Device.DeviceType.PHONE ? 10 : 15}
            paddingVertical={deviceType === Device.DeviceType.PHONE ? 10 : 13}
            borderColor={DefaultTheme.colors.yellowC9}
            borderWidth={0.5}
            borderRadius={6}
          >
            <ImageCommon width={20} height={20} source={images.icFullScreen} />
          </TouchableButton>
        )}
      </TitleContainer>
      {deviceType === Device.DeviceType.PHONE && <SpaceHeight size={8} />}
      {isFullscreen ? null : (
        <>
          {deviceType === Device.DeviceType.PHONE && <SpaceHeight size={24} />}
          {deviceType === Device.DeviceType.PHONE ? (
            <ViewSettings alignSelf={"flex-start"}>
              <TouchableButton
                paddingHorizontal={10}
                paddingVertical={10}
                borderColor={DefaultTheme.colors.white + ALPHA_VALUE.alpha_02}
                borderWidth={0}
                borderRadius={2.4}
                onPress={onTurnOnFullscreen}
              >
                <ImageCommon
                  width={20}
                  height={20}
                  source={images.icFullScreen}
                />
              </TouchableButton>
              <SpaceWidth size={8} />
              <TouchableButton
                paddingHorizontal={10}
                paddingVertical={12.5}
                onPress={handleReadingChapter}
                borderColor={
                  isReading
                    ? DefaultTheme.colors.yellowC9
                    : DefaultTheme.colors.white + ALPHA_VALUE.alpha_02
                }
                borderWidth={isReading ? 0.4 : 0}
                borderRadius={2.4}
              >
                {isReading ? (
                  <ImageCommon
                    width={14}
                    height={14}
                    source={images.icReading}
                  />
                ) : (
                  <Icon
                    iconName={"ic_volume"}
                    size={14}
                    color={DefaultTheme.colors.white}
                    disabled={true}
                  />
                )}
                <SpaceWidth size={6} />
                <TextCommon
                  color={DefaultTheme.colors.white}
                  fontFamily={DefaultTheme.fonts.metropolis.medium}
                  fontSize={12}
                >
                  {isReading
                    ? t("book_reader.chapter_listening")
                    : t("book_reader.listen_chapter")}
                </TextCommon>
              </TouchableButton>
              <SpaceWidth size={8} />
              {isReading ? null : (
                <TouchableButton
                  paddingHorizontal={10}
                  paddingVertical={12.5}
                  borderColor={DefaultTheme.colors.white + ALPHA_VALUE.alpha_02}
                  borderWidth={0}
                  borderRadius={2.4}
                  disabled={true}
                >
                  <TextCommon
                    color={DefaultTheme.colors.white}
                    fontFamily={DefaultTheme.fonts.metropolis.medium}
                    fontSize={12}
                  >
                    {t("book_reader.bright")}
                  </TextCommon>
                  <SpaceWidth size={6} />
                  <Switch
                    initialValue={
                      theme === BOOK_READER_THEME.DARK ? true : false
                    }
                    onToggle={onChangeTheme}
                  />
                  <SpaceWidth size={6} />
                  <TextCommon
                    color={DefaultTheme.colors.white}
                    fontFamily={DefaultTheme.fonts.metropolis.medium}
                    fontSize={12}
                  >
                    {t("book_reader.dark")}
                  </TextCommon>
                </TouchableButton>
              )}
            </ViewSettings>
          ) : (
            <ViewSettings alignSelf={"flex-end"}>
              {isReading ? null : (
                <TouchableButton
                  paddingHorizontal={15}
                  paddingVertical={15}
                  borderColor={DefaultTheme.colors.white + ALPHA_VALUE.alpha_02}
                  borderWidth={0}
                  borderRadius={6}
                  disabled={true}
                >
                  <TextCommon
                    color={DefaultTheme.colors.white}
                    fontFamily={DefaultTheme.fonts.metropolis.medium}
                    fontSize={16}
                  >
                    {t("book_reader.bright")}
                  </TextCommon>
                  <SpaceWidth size={10} />
                  <Switch
                    initialValue={
                      theme === BOOK_READER_THEME.DARK ? true : false
                    }
                    onToggle={onChangeTheme}
                  />
                  <SpaceWidth size={10} />
                  <TextCommon
                    color={DefaultTheme.colors.white}
                    fontFamily={DefaultTheme.fonts.metropolis.medium}
                    fontSize={16}
                  >
                    {t("book_reader.dark")}
                  </TextCommon>
                </TouchableButton>
              )}
              <SpaceWidth size={10} />
              <TouchableButton
                paddingHorizontal={15}
                paddingVertical={14}
                onPress={handleReadingChapter}
                borderColor={
                  isReading
                    ? DefaultTheme.colors.yellowC9
                    : DefaultTheme.colors.white + ALPHA_VALUE.alpha_02
                }
                borderWidth={isReading ? 0.4 : 0}
                borderRadius={6}
              >
                {isReading ? (
                  <ImageCommon
                    width={18}
                    height={18}
                    source={images.icReading}
                  />
                ) : (
                  <Icon
                    iconName={"ic_volume"}
                    size={18}
                    color={DefaultTheme.colors.white}
                    disabled={true}
                  />
                )}
                <SpaceWidth size={6} />
                <TextCommon
                  color={DefaultTheme.colors.white}
                  fontFamily={DefaultTheme.fonts.metropolis.medium}
                  fontSize={16}
                >
                  {isReading
                    ? t("book_reader.chapter_listening")
                    : t("book_reader.listen_chapter")}
                </TextCommon>
              </TouchableButton>
              <SpaceWidth size={10} />
              <TouchableButton
                paddingHorizontal={15}
                paddingVertical={13}
                borderColor={DefaultTheme.colors.white + ALPHA_VALUE.alpha_02}
                borderWidth={0}
                borderRadius={6}
                onPress={onTurnOnFullscreen}
              >
                <ImageCommon
                  width={20}
                  height={20}
                  source={images.icFullScreen}
                />
              </TouchableButton>
            </ViewSettings>
          )}
        </>
      )}
    </HeaderContainer>
  );
};

const HeaderContainer = styled.View<{ paddingHorizontal: number }>`
  padding-horizontal: ${(props) => props.paddingHorizontal}px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ButtonBack = styled.Pressable`
  width: 32px;
  height: 32px;
  border-radius: 2.4px;
  background-color: ${DefaultTheme.colors.white + ALPHA_VALUE.alpha_02};
  justify-content: center;
  align-items: center;
`;

const TextCommon = styled(Text)<{
  color: string;
  fontSize: number;
  fontFamily: string;
}>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize}px;
  font-family: ${(props) => props.fontFamily};
`;

const ViewSettings = styled.View<{ alignSelf: string }>`
  flex-direction: row;
  align-items: center;
  align-self: ${(props) => props.alignSelf};
`;

const TouchableButton = styled.Pressable<{
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  paddingHorizontal: number;
  paddingVertical: number;
}>`
  padding-horizontal: ${(props) => props.paddingHorizontal}px;
  padding-vertical: ${(props) => props.paddingVertical}px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${DefaultTheme.colors.white + ALPHA_VALUE.alpha_02};
  border-radius: ${(props) => props.borderRadius}px;
  border-color: ${(props) => props.borderColor};
  border-width: ${(props) => props.borderWidth}px;
`;

const ImageCommon = styled(Image)<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

const styles = StyleSheet.create({});

export default HeaderBookReader;
