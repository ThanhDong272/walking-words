import React, { useCallback, useEffect, useRef, useState } from "react";
import Orientation, { OrientationType } from "react-native-orientation-locker";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { ResizeMode, Video, VideoFullscreenUpdate } from "expo-av";
import { BlurView } from "expo-blur";
import { Image, ImageBackground } from "expo-image";
import { useNavigation, useRouter } from "expo-router";
import styled from "styled-components/native";

import DetailsContent from "@components/DetailsContent";

import { useGetBookDetails } from "@generated/books/books";
import type { BookItemData } from "@generated/model";
import useDimensions from "@hooks/useDimensions";
import useOrientationEffect from "@hooks/useOrientationEffect";
import { EQueryUser } from "@constants/queries";

import GradientImage from "../GradientImage";

import { isIOS } from "@/utils/common";

interface Props {
  uuid: string;
}

const VideoThumbnail: React.FC<Props> = ({ uuid }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();
  const rotation = useSharedValue(0);
  const { dimensions } = useDimensions();
  const orientation = useOrientationEffect();

  const firstVideoTimer = useRef<any>(null);
  const secondVideoTimer = useRef<any>(null);

  const videoRef = useRef<Video>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRotation, setShowRotation] = useState(false);

  const { data } = useGetBookDetails(uuid);

  const [dataDetail, setDataDetail] = useState<BookItemData | null>(null);

  useEffect(() => {
    if (data) {
      setDataDetail(data?.data?.data ?? null);
    }
  }, [data]);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(45, { duration: 1000, easing: Easing.linear }),
      -1,
      true,
    );
  }, [rotation]);

  useFocusEffect(
    // if user leave the screen, stop the video
    useCallback(() => {
      return async () => {
        setIsPlayingVideo(false);
        await videoRef.current?.pauseAsync();
      };
    }, []),
  );

  useEffect(() => {
    const handleSensorOrientation = async () => {
      switch (orientation) {
        case OrientationType["PORTRAIT"]:
          setIsFullscreen(false);
          Orientation.lockToPortrait();

          break;
        case OrientationType["LANDSCAPE-LEFT"]:
          setIsFullscreen(true);
          isIOS
            ? Orientation.lockToLandscapeLeft()
            : Orientation.lockToLandscapeRight();

          break;
        case OrientationType["LANDSCAPE-RIGHT"]:
          setIsFullscreen(true);
          isIOS
            ? Orientation.lockToLandscapeRight()
            : Orientation.lockToLandscapeLeft();

          break;
        default:
          break;
      }
    };

    if (isPlayingVideo) {
      handleSensorOrientation();
    }
  }, [orientation]);

  useEffect(() => {
    if (isPlayingVideo) {
      firstVideoTimer.current = setTimeout(() => {
        setShowRotation(true);
        secondVideoTimer.current = setTimeout(() => {
          setShowRotation(false);
        }, 5000);
      }, 5000);
    } else {
      clearTimeout(firstVideoTimer.current);
      clearTimeout(secondVideoTimer.current);
    }
  }, [isPlayingVideo]);

  useEffect(() => {
    if (isPlayingVideo && !isFullscreen) {
      Orientation.lockToPortrait();
    }
  }, [isFullscreen]);

  useEffect(() => {
    if (isPlayingVideo) {
      if (isFullscreen) {
        videoRef?.current?.presentFullscreenPlayer();
      } else {
        videoRef?.current?.dismissFullscreenPlayer();
      }
    }
  }, [isFullscreen, isPlayingVideo]);

  const handleTapVideo = async () => {
    setIsPlayingVideo(!isPlayingVideo);
  };

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.push("/");
    }
  };

  const renderContent = () => {
    return <DetailsContent item={dataDetail ?? null} />;
  };

  const rotationAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <Container>
      <VideoContainer width={dimensions.width} height={dimensions.height / 3}>
        <VideoPlayer
          height={dimensions.height / 3}
          ref={videoRef}
          source={{
            uri: dataDetail?.introVideo ?? "",
          }}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isPlayingVideo}
          volume={1}
          rate={1.0}
          isMuted={false}
          isLooping={false}
          onPlaybackStatusUpdate={async (status: any) => {
            if (status.didJustFinish) {
              await videoRef?.current?.replayAsync();
              setIsPlayingVideo(false);
            }
          }}
          onFullscreenUpdate={async ({ fullscreenUpdate }) => {
            if (fullscreenUpdate === VideoFullscreenUpdate.PLAYER_DID_DISMISS) {
              Orientation.lockToPortrait();
              setIsFullscreen(false);

              if (isPlayingVideo) {
                await videoRef?.current?.playAsync();
              } else {
                setIsPlayingVideo(false);
                await videoRef?.current?.pauseAsync();
              }
            }
          }}
        />
        {!isPlayingVideo && (
          <ImageThumbnail
            width={dimensions.width}
            height={dimensions.height / 3}
          >
            <ImageCarousel
              width={dimensions.width}
              height={dimensions.height / 3}
              source={data?.data?.data?.thumbnail ?? ""}
            />
          </ImageThumbnail>
        )}
        <BlurBackContainerPress insets={insets} onPress={handleBack}>
          <ImageSwitch
            source={require("@/assets/images/ic_back.png")}
            resizeMode="contain"
          />
        </BlurBackContainerPress>
        <BlurPlayContainerPress onPress={handleTapVideo}>
          <ImageSwitch
            width={50}
            height={50}
            source={require("@/assets/images/ic_play.png")}
            resizeMode="contain"
          />
        </BlurPlayContainerPress>
        {showRotation && isPlayingVideo && (
          <BlurContainerPress
            pointerEvents={"box-none"}
            onPress={async () => {
              setShowRotation(false);
              setIsFullscreen(true);
              Orientation.lockToLandscapeRight();
              await videoRef?.current?.playAsync();
            }}
          >
            <BlurViewOutside
              intensity={10}
              tint={"systemThickMaterialDark"}
              experimentalBlurMethod={"dimezisBlurView"}
            >
              <BlurViewInside
                intensity={10}
                tint={"systemThickMaterialDark"}
                experimentalBlurMethod={"dimezisBlurView"}
              >
                <ImageRotate
                  style={rotationAnimationStyle}
                  source={require("@/assets/images/device_rotate.png")}
                />
              </BlurViewInside>
            </BlurViewOutside>
          </BlurContainerPress>
        )}
      </VideoContainer>
      {renderContent()}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const VideoContainer = styled.View<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

const ImageThumbnail = styled(GradientImage)<{ width: number; height: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

const VideoPlayer = styled(Video)<{
  height: number;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${(props) => props.height}px;
`;

const ImageCarousel = styled(ImageBackground)<{
  width: number;
  height: number;
}>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

const BlurContainerPress = styled.Pressable`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
`;

const BlurViewOutside = styled(BlurView)`
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 95px;
  height: 95px;
  border-radius: 95px;
`;

const BlurViewInside = styled(BlurView)`
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 85px;
  height: 85px;
  border-radius: 85px;
`;

const ImageRotate = styled(Animated.Image)`
  width: 52px;
  height: 62px;
`;

const BlurBackContainerPress = styled.Pressable<{ insets: any }>`
  position: absolute;
  left: 12px;
  top: ${({ insets }) => insets?.top + 24}px;
  height: 32px;
  width: 32px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
`;

const BlurPlayContainerPress = styled.Pressable`
  position: absolute;
  right: 12px;
  bottom: 12px;
`;

const ImageSwitch = styled(Image)<{
  width?: number;
  height?: number;
}>`
  width: ${({ width }) => width || 32}px;
  height: ${({ height }) => height || 32}px;
`;

export default VideoThumbnail;
