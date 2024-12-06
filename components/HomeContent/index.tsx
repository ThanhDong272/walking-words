import React, { useEffect } from "react";
import { View } from "react-native";
import Orientation from "react-native-orientation-locker";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { DeviceType } from "expo-device";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import styled from "styled-components/native";

import SpaceHeight from "@views/SpaceHeight";
import Text from "@views/Text";

import {
  useBookmarkBook,
  useGetMyNovelsInfinite,
  useGetPopularBooks,
} from "@generated/books/books";
import type { BookDataItem } from "@generated/model";
import useDimensions from "@hooks/useDimensions";
import LocalServices from "@services/local";
import { EQueryUser } from "@constants/queries";

import AuthorTitle from "./shared/AuthorTitle";
import ButtonContent from "./shared/ButtonContent";
import DurationTitle from "./shared/DurationTitle";

import DefaultTheme from "@theme";

import { ALPHA_VALUE, PER_PAGE } from "@/constants";

interface Props {
  item: BookDataItem;
  currentIndex: number;
  isPlayingVideo: boolean;
  deviceType?: DeviceType;
}

const HomeContent: React.FC<Props> = ({
  item,
  currentIndex,
  isPlayingVideo,
  deviceType,
}) => {
  const router = useRouter();
  const fadeAnim = useSharedValue(0);
  const { dimensions } = useDimensions();

  const { isLoading } = useGetPopularBooks();
  const { refetch: refetchPopularBooks } = useGetPopularBooks(
    {
      page: 1,
      perPage: PER_PAGE._10,
    },
    {
      query: {
        queryKey: [EQueryUser.POPULAR_BOOKS],
        enabled: true,
      },
    },
  );
  const { refetch: refetchMyNovels } = useGetMyNovelsInfinite(
    {
      page: 0,
      perPage: 10,
    },
    {
      query: {
        queryKey: [EQueryUser.MY_NOVELS],
        enabled: true,
        getNextPageParam: (lastPage) => {
          if (
            (lastPage?.data?.meta?.currentPage ?? 0) <
            (lastPage?.data?.meta?.total ?? 0)
          ) {
            return (lastPage?.data?.meta?.currentPage ?? 0) + 1;
          }
          return undefined;
        },
      },
    },
  );

  const bookmark = useBookmarkBook();

  const handleBookmark = async () => {
    try {
      const { success } = await bookmark.mutateAsync({
        bookUuid: item.uuid as string,
      });
      if (success) {
        refetchPopularBooks();
        refetchMyNovels();
      }
    } catch (error) {
      if (error instanceof Error && "response" in error) {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          LocalServices.removeItem("USER_SKIP");
          router.push("/(auth)/login");
        }
      }
    }
  };

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 500 });
  }, []);

  const handleNavigateBookReader = async () => {
    if (deviceType === DeviceType.TABLET) {
      await ScreenOrientation.unlockAsync();
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
      );

      Orientation.lockToLandscapeLeft();
    }
    router.push({ pathname: "/(screens)/book_reader", params: item });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

  return (
    <ViewMainContent
      paddingHorizontal={deviceType === DeviceType.PHONE ? 20 : 0}
      marginLeft={deviceType === DeviceType.TABLET ? 40 : 0}
      position={deviceType === DeviceType.TABLET ? "absolute" : "relative"}
      justifyContent={
        deviceType === DeviceType.TABLET
          ? isPlayingVideo
            ? "flex-end"
            : "center"
          : "flex-start"
      }
      bottom={deviceType === DeviceType.TABLET ? 40 : 0}
    >
      {deviceType === DeviceType.PHONE ? (
        <AnimatedTitleBook style={[animatedStyle]}>
          <TextCommon
            color={DefaultTheme.colors.white}
            fontFamily={DefaultTheme.fonts.metropolis.regular}
            fontSize={26}
          >
            {item?.name}
          </TextCommon>
          <View style={{ display: isPlayingVideo ? "none" : "flex" }}>
            <SpaceHeight size={8} />
            <AuthorTitle item={item} />
          </View>
        </AnimatedTitleBook>
      ) : (
        <AnimationView style={[animatedStyle]}>
          <TextCommon
            color={DefaultTheme.colors.white}
            fontFamily={DefaultTheme.fonts.metropolis.regular}
            fontSize={44}
          >
            {item?.name}
          </TextCommon>
          <View style={{ display: isPlayingVideo ? "none" : "flex" }}>
            <SpaceHeight size={16} />
            <AuthorTitle item={item} />
            <SpaceHeight size={10} />
            <DurationTitle item={item} />
            <SpaceHeight size={20} />
            <TextCommon
              style={{ lineHeight: 18, width: dimensions.width / 2 }}
              color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
              fontSize={14}
              fontFamily={DefaultTheme.fonts.metropolis.regular}
              numberOfLines={6}
            >
              {item?.description}
            </TextCommon>
          </View>
        </AnimationView>
      )}
      {deviceType === DeviceType.PHONE && (
        <AnimationView style={[animatedStyle]}>
          <View style={{ display: isPlayingVideo ? "none" : "flex" }}>
            <DurationTitle item={item} />
            <SpaceHeight size={20} />
            {isLoading ? (
              <MotiView
                transition={{
                  type: "timing",
                }}
                style={{ borderRadius: 100 }}
                animate={{ backgroundColor: DefaultTheme.colors.black }}
              >
                <Skeleton
                  colorMode={"dark"}
                  width={"100%"}
                  height={40}
                  radius={"round"}
                />
              </MotiView>
            ) : (
              <View>
                <TextCommon
                  style={{ lineHeight: 18, textAlign: "left" }}
                  color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
                  fontSize={14}
                  fontFamily={DefaultTheme.fonts.metropolis.regular}
                  numberOfLines={6}
                >
                  {item?.description}
                </TextCommon>
              </View>
            )}
          </View>
        </AnimationView>
      )}
      <View style={{ marginTop: deviceType === DeviceType.PHONE ? 24 : 28 }}>
        <ButtonContent
          item={item}
          onPressReadBook={handleNavigateBookReader}
          onPressBookmark={handleBookmark}
        />
      </View>
    </ViewMainContent>
  );
};

const ViewMainContent = styled.View<{
  paddingHorizontal: number;
  marginLeft: number;
  position: string;
  justifyContent: string;
  bottom: number;
}>`
  padding-horizontal: ${(props) => props.paddingHorizontal}px;
  margin-left: ${(props) => props.marginLeft}px;
  position: ${(props) => props.position};
  justify-content: center;
  bottom: ${(props) => props.bottom}px;
`;

const AnimationView = styled(Animated.View)``;

const TextCommon = styled(Text)<{
  color: string;
  fontSize: number;
  fontFamily: string;
}>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize}px;
  font-family: ${(props) => props.fontFamily};
`;

const AnimatedTitleBook = styled(Animated.View)`
  justify-content: flex-start;
  align-content: flex-end;
  position: absolute;
  top: -60px;
  padding-left: 20px;
`;

export default HomeContent;
