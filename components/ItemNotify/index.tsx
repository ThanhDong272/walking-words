import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import * as Device from "expo-device";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import styled from "styled-components/native";

import ModalVideo from "@components/BookContent/shared/ModalVideo";
import SpaceHeight from "@views/SpaceHeight";
import Text from "@views/Text";

import type { BookDataItem } from "@generated/model";
import useDeviceType from "@hooks/useDeviceType";
import { formatDuration, screenWidth } from "@utils/common";
import { ALPHA_VALUE } from "@constants";

import DefaultTheme from "@theme";

interface Props {
  item: BookDataItem;
}

const ItemNotify: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation();
  const deviceType = useDeviceType();
  const router = useRouter();

  const [mediaUri, setMediaUri] = useState({
    videoUri: "",
    imageUri: "",
  });
  const [showModalVideo, setShowModalVideo] = useState(false);

  const handlePress = async () => {
    if (deviceType === Device.DeviceType.PHONE) {
      await ScreenOrientation.unlockAsync();
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
      );

      router.push({
        pathname: "/(screens)/video_book",
        params: {
          videoUri: item?.introVideo,
          imageUri: item?.thumbnail,
        },
      });
    } else {
      setShowModalVideo(true);
      setMediaUri({
        videoUri: item?.introVideo || "",
        imageUri: item?.thumbnail || "",
      });
    }
  };

  return (
    <ContainerTouchable justifyContent={"space-between"}>
      <ViewRow>
        <ImageContent
          source={{ uri: item.thumbnail }}
          contentFit={"cover"}
          priority={"high"}
        />
        <ViewContent width={screenWidth / 1.8}>
          <TextCommon
            fontSize={14}
            fontFamily={DefaultTheme.fonts.metropolis.medium}
            color={DefaultTheme.colors.greyE2}
          >
            {item?.name}
          </TextCommon>
          <SpaceHeight size={8} />
          <TextCommon
            fontSize={14}
            fontFamily={DefaultTheme.fonts.metropolis.thin}
            color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_07}
            style={{ lineHeight: 18 }}
            numberOfLines={3}
          >
            {item?.description}
          </TextCommon>
          <SpaceHeight size={8} />
          <ButtonWatch onPress={handlePress}>
            <TextCommon
              fontSize={14}
              fontFamily={DefaultTheme.fonts.metropolis.medium}
              color={DefaultTheme.colors.black}
            >
              {t("home.watch_now")}
            </TextCommon>
          </ButtonWatch>
        </ViewContent>
      </ViewRow>
      <TextCommon
        fontSize={14}
        fontFamily={DefaultTheme.fonts.metropolis.medium}
        color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_07}
      >
        {formatDuration(item?.duration || 0)}
      </TextCommon>
      <ModalVideo
        mediaUri={mediaUri}
        isVisible={showModalVideo}
        onDismiss={() => setShowModalVideo(false)}
      />
    </ContainerTouchable>
  );
};

const ContainerTouchable = styled.Pressable<{ justifyContent: string }>`
  flex-direction: row;
  justify-content: ${(props) => props.justifyContent};
  border-top-width: 1px;
  border-top-color: ${DefaultTheme.colors.white + ALPHA_VALUE.alpha_02};
  padding: 24px;
`;

const ViewRow = styled.View`
  flex-direction: row;
`;

const ImageContent = styled(Image)`
  width: 48px;
  height: 48px;
  border-radius: 48px;
`;

const ViewContent = styled.View<{ width: number }>`
  margin-horizontal: 12px;
  align-items: flex-start;
  width: ${(props) => props.width}px;
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

const ButtonWatch = styled.Pressable`
  padding-horizontal: 12px;
  padding-vertical: 8px;
  border-radius: 4px;
  background-color: ${DefaultTheme.colors.yellowD3};
`;

export default ItemNotify;
