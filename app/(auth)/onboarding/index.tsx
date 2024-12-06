import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ResizeMode, Video } from "expo-av";
import * as Device from "expo-device";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import styled from "styled-components/native";

import DotPagination from "@components/DotPagination";
import Icon from "@components/Icon";
import ScreenRootView from "@components/ScreenRootView";
import Text from "@views/Text";

import useDeviceType from "@hooks/useDeviceType";
import { screenHeight, screenWidth } from "@utils/common";

import { images } from "@assets/images";
import DefaultTheme from "@theme";

interface Props {}

const onboardings = [
  {
    imageUri: "https://iili.io/dUqNGVI.png",
    title: "onboarding.general_function",
  },
  {
    imageUri: "https://iili.io/dUqNGVI.png",
    title: "onboarding.integrated_ebook",
  },
  {
    imageUri: "https://iili.io/dUqNGVI.png",
    videoUri:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    title: "onboarding.integrated_audio_book",
  },
  {
    imageUri: "https://iili.io/dUqNGVI.png",
    title: "onboarding.interactive_story",
  },
  {
    imageUri: "https://iili.io/dUqNGVI.png",
    title: "onboarding.integrated_film_sequences",
  },
  {
    imageUri: "https://iili.io/dUqNGVI.png",
    title: "onboarding.post_and_share",
  },
];

const OnboardingScreen: React.FC<Props> = () => {
  const { t } = useTranslation();
  const videoRef = useRef<Video>(null);
  const carouselRef = useRef<FlatList>(null);
  const deviceType = useDeviceType();

  const [activeIndex, setActiveIndex] = useState(0);

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  };
  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);

  const renderItem = ({ item }: { item: any; index: number }) => {
    return (
      <CarouselContainerItem>
        <TextDisplayContainer
          bottom={86}
          paddingHorizontal={deviceType === Device.DeviceType.PHONE ? 40 : 0}
        >
          <TextCommon
            color={DefaultTheme.colors.white}
            fontFamily={DefaultTheme.fonts.metropolis.medium}
            fontSize={deviceType === Device.DeviceType.PHONE ? 26 : 32}
            style={{ textAlign: "center" }}
          >
            {t(item?.title)}
          </TextCommon>
        </TextDisplayContainer>
      </CarouselContainerItem>
    );
  };

  return (
    <ScreenRootView>
      <SafeView edges={["top", "bottom"]}>
        <HeaderContainer
          marginTop={deviceType === Device.DeviceType.PHONE ? 0 : 30}
        >
          {deviceType === Device.DeviceType.TABLET && (
            <ViewSlogan>
              <ImageCommon
                width={240}
                height={34}
                source={images.splashSlogan}
              />
            </ViewSlogan>
          )}
          <TouchableOpacity onPress={() => router.navigate("/(auth)/login")}>
            <TextCommon
              fontSize={deviceType === Device.DeviceType.PHONE ? 16 : 20}
              color={DefaultTheme.colors.white}
              fontFamily={DefaultTheme.fonts.metropolis.medium}
            >
              {t("action.skip")}
            </TextCommon>
          </TouchableOpacity>
        </HeaderContainer>
        <CarouselContainer>
          <CarouselContainerItem>
            <MediaContainer
              marginBottom={deviceType === Device.DeviceType.PHONE ? 100 : 120}
            >
              {onboardings[activeIndex]?.videoUri ? (
                <VideoCommon
                  ref={videoRef}
                  source={{ uri: onboardings[activeIndex]?.videoUri }}
                  resizeMode={ResizeMode.COVER}
                  shouldPlay={true}
                  volume={1}
                  rate={1.0}
                  isMuted={false}
                  isLooping={true}
                  usePoster={true}
                  posterSource={{ uri: onboardings[activeIndex]?.imageUri }}
                  posterStyle={{
                    resizeMode: "contain",
                  }}
                  width={
                    deviceType === Device.DeviceType.PHONE
                      ? screenWidth - 28
                      : screenWidth - 60
                  }
                  height={deviceType === Device.DeviceType.PHONE ? 290 : 600}
                />
              ) : (
                <>
                  <ImageCommon
                    contentFit={"contain"}
                    width={
                      deviceType === Device.DeviceType.PHONE
                        ? screenWidth - 28
                        : screenWidth - 60
                    }
                    height={deviceType === Device.DeviceType.PHONE ? 290 : 600}
                    source={{ uri: onboardings[activeIndex]?.imageUri }}
                  />
                  <LinearGradient
                    colors={["transparent", DefaultTheme.colors.black10]}
                    style={styles.gradientBottom}
                  />
                </>
              )}
            </MediaContainer>
          </CarouselContainerItem>
          <FlatList
            ref={carouselRef}
            data={onboardings}
            renderItem={renderItem}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            viewabilityConfigCallbackPairs={
              viewabilityConfigCallbackPairs.current
            }
          />
        </CarouselContainer>
        <BottomContainer
          marginBottom={deviceType === Device.DeviceType.PHONE ? 30 : 86}
        >
          <DotPagination
            length={onboardings.length}
            currentIndex={activeIndex}
          />
          <ButtonNext
            width={deviceType === Device.DeviceType.PHONE ? 60 : 70}
            height={deviceType === Device.DeviceType.PHONE ? 60 : 70}
            onPress={() => {
              if (activeIndex === onboardings.length - 1) {
                console.log("finish");
              } else {
                carouselRef?.current?.scrollToIndex({
                  index: activeIndex + 1,
                  animated: true,
                });
              }
            }}
          >
            <Icon
              iconName={"ic_arrow_forward"}
              color={DefaultTheme.colors.black}
              size={deviceType === Device.DeviceType.PHONE ? 26 : 30}
              disabled={true}
            />
          </ButtonNext>
        </BottomContainer>
      </SafeView>
    </ScreenRootView>
  );
};

const HeaderContainer = styled.View<{ marginTop?: number }>`
  align-items: flex-end;
  margin-top: ${(props) => props.marginTop}px;
  padding-horizontal: 18px;
`;

const SafeView = styled(SafeAreaView)`
  flex: 1;
  justify-content: space-between;
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

const ViewSlogan = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  align-items: center;
`;

const ImageCommon = styled(Image)<{ width: number; height: number }>``;

const CarouselContainer = styled.View`
  flex: 1;
`;

const CarouselContainerItem = styled.View`
  justify-content: center;
  align-items: center;
  width: ${screenWidth}px;
`;

const VideoCommon = styled(Video)<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

const MediaContainer = styled.View<{
  marginBottom: number;
}>`
  flex: 1;
  margin-bottom: ${(props) => props.marginBottom}px;
  margin-top: ${screenHeight / 8}px;
`;

const TextDisplayContainer = styled.View<{
  bottom: number;
  paddingHorizontal: number;
}>`
  position: absolute;
  bottom: ${(props) => props.bottom}px;
  padding-horizontal: ${(props) => props.paddingHorizontal}px;
`;

const BottomContainer = styled.View<{ marginBottom: number }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => props.marginBottom}px;
  padding-horizontal: 20px;
`;

const ButtonNext = styled.TouchableOpacity<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: 100px;
  background-color: ${DefaultTheme.colors.yellowD3};
  justify-content: center;
  align-items: center;
`;

const styles = StyleSheet.create({
  gradientBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "30%",
  },
});

export default OnboardingScreen;
