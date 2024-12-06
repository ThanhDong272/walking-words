import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { LayoutChangeEvent } from "react-native";
import { Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DeviceType } from "expo-device";
import { router, useLocalSearchParams } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import styled from "styled-components/native";

import ModalVideo from "@components/BookContent/shared/ModalVideo";
import Icon from "@components/Icon";
import ZoomImage from "@components/ZoomImage";
import SpaceWidth from "@views/SpaceWidth";
import Text from "@views/Text";

import useDeviceType from "@hooks/useDeviceType";
import { ALPHA_VALUE } from "@constants";

import DefaultTheme from "@theme";

interface Props {}

const MapScreen: React.FC<Props> = () => {
  const deviceType = useDeviceType();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { image, media, mapWidth, mapHeight, pinX, pinY } =
    useLocalSearchParams();

  const [imageMapWidth, setImageMapWidth] = useState(0);
  const [imageMapHeight, setImageMapHeight] = useState(0);
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const [showModalVideo, setShowModalVideo] = useState(false);
  const [mediaUri, setMediaUri] = useState({
    videoUri: "",
  });

  const pinXPercentage =
    parseFloat(pinX.toString()) /
    parseFloat(mapWidth.toString().replace("px", ""));
  const pinYPercentage =
    parseFloat(pinY.toString()) /
    parseFloat(mapHeight.toString().replace("px", ""));

  const pinCoordinates = { x: pinXPercentage, y: pinYPercentage };

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const handlePlay = async () => {
    if (deviceType === DeviceType.PHONE) {
      await ScreenOrientation.unlockAsync();
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
      );

      router.push({
        pathname: "/(screens)/video_book",
        params: {
          videoUri: media,
        },
      });
    } else {
      setShowModalVideo(true);
      setMediaUri({
        videoUri: media as string,
      });
    }
  };

  return (
    <Container>
      <ButtonBack
        top={deviceType === DeviceType.PHONE ? insets.top : insets.top + 42}
        left={deviceType === DeviceType.PHONE ? 20 : 32}
        onPress={() => router.dismiss()}
      >
        <Icon
          iconName={"ic_arrow_back"}
          size={14}
          color={DefaultTheme.colors.white}
          disabled={true}
        />
      </ButtonBack>
      <MapOverview>
        <ZoomImage
          uri={image as string}
          width={dimensions.width}
          height={dimensions.height}
          imageStyle={{ width: dimensions.width, height: dimensions.height }}
          onLayoutImage={(event: LayoutChangeEvent) => {
            setImageMapWidth(event.nativeEvent.layout.width);
            setImageMapHeight(event.nativeEvent.layout.height);
          }}
        >
          <LocationView
            top={pinCoordinates.y * imageMapHeight}
            left={pinCoordinates.x * imageMapWidth}
          >
            <Icon
              iconName={"ic_location"}
              color={DefaultTheme.colors.yellowC9}
              size={deviceType === DeviceType.PHONE ? 28 : 58}
              disabled={true}
            >
              <CircleLocation
                width={deviceType === DeviceType.PHONE ? 12 : 25}
                height={deviceType === DeviceType.PHONE ? 12 : 25}
                bottom={deviceType === DeviceType.PHONE ? -6 : -10}
                style={{ transform: [{ scaleX: 2 }] }}
              />
            </Icon>
            <VisitLocationView
              width={deviceType === DeviceType.PHONE ? 74 : 148}
              height={deviceType === DeviceType.PHONE ? 19 : 38}
              marginTop={deviceType === DeviceType.PHONE ? 8 : 16}
            >
              <TouchablePlay
                width={deviceType === DeviceType.PHONE ? 18 : 36}
                height={deviceType === DeviceType.PHONE ? 18 : 36}
                onPress={handlePlay}
              >
                <Icon
                  iconName={"ic_play"}
                  size={deviceType === DeviceType.PHONE ? 10 : 20}
                  color={DefaultTheme.colors.white}
                  disabled
                />
              </TouchablePlay>
              <SpaceWidth size={deviceType === DeviceType.PHONE ? 2 : 8} />
              <TextCommon
                fontSize={deviceType === DeviceType.PHONE ? 8 : 14}
                fontFamily={DefaultTheme.fonts.metropolis.regular}
                color={DefaultTheme.colors.white}
              >
                {t("map.visit_location")}
              </TextCommon>
            </VisitLocationView>
          </LocationView>
        </ZoomImage>
      </MapOverview>
      <ModalVideo
        mediaUri={mediaUri}
        isVisible={showModalVideo}
        onDismiss={() => setShowModalVideo(false)}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${DefaultTheme.colors.black0F};
`;

const ButtonBack = styled.Pressable<{ top: number; left: number }>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  width: 32px;
  height: 32px;
  border-radius: 2.4px;
  background-color: ${DefaultTheme.colors.white + ALPHA_VALUE.alpha_02};
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const MapOverview = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LocationView = styled.View<{
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}>`
  position: absolute;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  right: ${(props) => props.right}px;
  bottom: ${(props) => props.bottom}px;
`;

const CircleLocation = styled.View<{
  width: number;
  height: number;
  bottom: number;
}>`
  position: absolute;
  bottom: ${(props) => props.bottom}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: 50px;
  background-color: ${DefaultTheme.colors.yellowC9 + ALPHA_VALUE.alpha_04};
`;

const VisitLocationView = styled.View<{
  width: number;
  height: number;
  marginTop: number;
}>`
  flex-direction: row;
  align-items: center;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: 100px;
  background-color: ${DefaultTheme.colors.yellowC9 + ALPHA_VALUE.alpha_04};
  margin-top: ${(props) => props.marginTop}px;
`;

const TouchablePlay = styled.TouchableOpacity<{
  width: number;
  height: number;
}>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: 100px;
  background-color: ${DefaultTheme.colors.yellowC9};
  padding-left: 2px;
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

export default MapScreen;
