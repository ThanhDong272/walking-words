import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { LayoutChangeEvent } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { DeviceType } from "expo-device";
import { Image, ImageBackground } from "expo-image";
import { router } from "expo-router";
import styled from "styled-components/native";

import Icon from "@components/Icon";

import type { PageSights } from "@generated/model";
import useDeviceType from "@hooks/useDeviceType";
import useDimensions from "@hooks/useDimensions";
import { ALPHA_VALUE } from "@constants/index";

import DefaultTheme from "@theme";

interface Props {
  dataPageSight: PageSights;
}

const MapStoryLocation: React.FC<Props> = ({ dataPageSight }) => {
  const deviceType = useDeviceType();
  const { t } = useTranslation();
  const { dimensions } = useDimensions();

  const pinXPercentage =
    dataPageSight.pinX! /
    parseFloat(dataPageSight.mapWidth.toString().replace("px", ""));
  const pinYPercentage =
    dataPageSight.pinY! /
    parseFloat(dataPageSight.mapHeight.toString().replace("px", ""));

  const pinCoordinates = { x: pinXPercentage, y: pinYPercentage };

  const [mapWidth, setMapWidth] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);

  return (
    <ViewMapLocation
      style={{
        marginLeft: deviceType === DeviceType.PHONE ? 20 : 0,
        marginRight: deviceType === DeviceType.PHONE ? 20 : 66,
      }}
      onLayout={(event: LayoutChangeEvent) => {
        setMapWidth(event.nativeEvent.layout.width);
        setMapHeight(event.nativeEvent.layout.height);
      }}
    >
      <ImageMap
        source={{ uri: dataPageSight?.map?.image }}
        contentFit={"cover"}
        imageStyle={{ borderRadius: 12 }}
        width={
          deviceType === DeviceType.PHONE
            ? dimensions.width - 40
            : dimensions.width / 2.2
        }
        height={deviceType === DeviceType.PHONE ? 190 : 272}
      >
        <ButtonViewMap
          onPress={() => {
            router.push({
              pathname: "/(screens)/map",
              params: {
                image: dataPageSight?.map?.image,
                media: dataPageSight?.media,
                mapWidth: dataPageSight?.mapWidth,
                mapHeight: dataPageSight?.mapHeight,
                pinX: dataPageSight?.pinX,
                pinY: dataPageSight?.pinY,
              },
            });
          }}
          width={deviceType === DeviceType.PHONE ? 116 : 144}
          height={deviceType === DeviceType.PHONE ? 36 : 50}
          borderRadius={deviceType === DeviceType.PHONE ? 2.8 : 4}
        >
          <InnerViewMap
            width={deviceType === DeviceType.PHONE ? 110 : 136}
            height={deviceType === DeviceType.PHONE ? 30 : 42}
            borderRadius={deviceType === DeviceType.PHONE ? 2.8 : 4}
          >
            <TextCommon
              color={DefaultTheme.colors.white}
              fontFamily={DefaultTheme.fonts.metropolis.bold}
              fontSize={deviceType === DeviceType.PHONE ? 12 : 14}
            >
              {t("story_overview.view_map")}
            </TextCommon>
          </InnerViewMap>
        </ButtonViewMap>
        <LocationView
          top={pinCoordinates.y * mapHeight}
          left={pinCoordinates.x * mapWidth}
        >
          <Icon
            iconName={"ic_location"}
            color={DefaultTheme.colors.yellowC9}
            size={28}
            disabled={true}
          >
            <CircleLocation style={{ transform: [{ scaleX: 2 }] }} />
          </Icon>
        </LocationView>
      </ImageMap>
    </ViewMapLocation>
  );
};

const ViewMapLocation = styled.View`
  border-radius: 12px;
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

const ButtonViewMap = styled.Pressable<{
  width: number;
  height: number;
  borderRadius: number;
}>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  position: absolute;
  bottom: 8px;
  right: 8px;
  border-radius: ${(props) => props.borderRadius}px;
  background-color: ${DefaultTheme.colors.yellowCD + ALPHA_VALUE.alpha_02};
  justify-content: center;
  align-items: center;
  padding: 3px;
`;

const InnerViewMap = styled.View<{
  width: number;
  height: number;
  borderRadius: number;
}>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: ${(props) => props.borderRadius}px;
  background-color: ${DefaultTheme.colors.yellowCD + ALPHA_VALUE.alpha_08};
  justify-content: center;
  align-items: center;
`;

const ImageMap = styled(ImageBackground)<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
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

const CircleLocation = styled.View`
  position: absolute;
  bottom: -6px;
  width: 12px;
  height: 12px;
  border-radius: 50px;
  background-color: ${DefaultTheme.colors.yellowC9 + ALPHA_VALUE.alpha_04};
`;

const styles = StyleSheet.create({});

export default MapStoryLocation;
