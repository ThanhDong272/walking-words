import React, { useCallback, useEffect, useRef, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Orientation, { OrientationType } from "react-native-orientation-locker";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import type { Video } from "expo-av";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useFocusEffect } from "expo-router";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import styled from "styled-components/native";

import GradientImage from "@components/GradientImage";
import VideoPlayer from "@components/VideoPlayer";

import { useGetPopularBooks } from "@generated/books/books";
import type { BookDataItem } from "@generated/model";
import useDimensions from "@hooks/useDimensions";
import useOrientationEffect from "@hooks/useOrientationEffect";

import DefaultTheme from "@theme";

import { isIOS } from "@/utils/common";

interface Props {
  index: number;
  currentIndex: number;
  item: BookDataItem;
  animationValue: Animated.SharedValue<number>;
  setParentPlaying: (value: boolean) => void;
}

const ItemVideo: React.FC<Props> = ({
  item,
  index,
  currentIndex,
  animationValue,
  setParentPlaying,
}) => {
  const videoRef = useRef<Video>(null);
  const rotation = useSharedValue(0);
  const { dimensions } = useDimensions();
  const orientation = useOrientationEffect();

  const timer = useRef<NodeJS.Timeout | undefined>(undefined);
  const firstVideoTimer = useRef<any>(null);
  const secondVideoTimer = useRef<any>(null);

  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRotation, setShowRotation] = useState(false);

  const { isLoading } = useGetPopularBooks();

  useFocusEffect(
    // if user leave the screen, stop the video
    useCallback(() => {
      return async () => {
        clearTimeout(timer.current);
        setIsPlayingVideo(false);
        await videoRef.current?.pauseAsync();
      };
    }, []),
  );

  /* This `useEffect` hook is responsible for checking if the current video is playing and if the
  current index of the video being displayed is different from the index of the video component. If
  both conditions are met, it stops the current video playback by setting `isPlayingVideo` state to
  `false` and pausing the video using the `pauseAsync` method on the `videoRef` reference. */
  useEffect(() => {
    // if user swipe to another video, stop the current video
    const handleStopVideo = async () => {
      if (isPlayingVideo && currentIndex !== index) {
        setIsPlayingVideo(false);
        await videoRef.current?.pauseAsync();
      }
    };
    handleStopVideo();
  }, [currentIndex, index, isPlayingVideo]);

  /* The `useEffect` hook you provided is responsible for setting a timer that triggers the
  `setIsPlayingVideo(true)` function call after 5 seconds if the `currentIndex` matches the `index`. */
  useEffect(() => {
    timer.current = setTimeout(() => {
      if (currentIndex === index) {
        setIsPlayingVideo(true);
      }
    }, 5000); // 5 seconds

    return () => clearTimeout(timer.current); // Cleanup the timer on unmount
  }, [currentIndex, index]);

  const maskStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animationValue.value,
      [-1, 0, 1],
      ["#000000dd", "transparent", "#000000dd"],
    );

    return {
      backgroundColor,
    };
  }, [animationValue]);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(45, { duration: 1000, easing: Easing.linear }),
      -1,
      true,
    );
  }, [rotation]);

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
    setParentPlaying(isPlayingVideo);
  }, [isPlayingVideo]);

  useEffect(() => {
    if (isPlayingVideo && !isFullscreen) {
      Orientation.lockToPortrait();
    }
  }, [isFullscreen]);

  const handleTapVideo = async () => {
    clearTimeout(timer.current);
    setIsPlayingVideo(!isPlayingVideo);
  };

  const rotationAnimationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <VideoContainer width={dimensions.width} height={dimensions.height / 3}>
      <Animated.View style={[maskStyle]}>
        {isLoading ? (
          <MotiView
            transition={{
              type: "timing",
            }}
            animate={{ backgroundColor: DefaultTheme.colors.black }}
          >
            <Skeleton
              colorMode={"dark"}
              width={dimensions.width}
              height={dimensions.height / 3}
              radius={"square"}
            />
          </MotiView>
        ) : (
          <VideoPlayer
            videoRef={videoRef}
            source={{ uri: item.introVideo }}
            isPlayingVideo={isPlayingVideo}
            setIsPlayingVideo={setIsPlayingVideo}
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
          />
        )}
      </Animated.View>
      {!isPlayingVideo && (
        <TouchableOpacity onPress={handleTapVideo} activeOpacity={1}>
          <ImageThumbnail
            width={dimensions.width}
            height={dimensions.height / 3}
          >
            <ImageCarousel
              width={dimensions.width}
              height={dimensions.height / 3}
              source={item.thumbnail}
            />
          </ImageThumbnail>
        </TouchableOpacity>
      )}
      {showRotation && isPlayingVideo && (
        <BlurContainerPress
          width={dimensions.width}
          height={dimensions.height / 3}
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
  );
};

const ImageCarousel = styled(Image)<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
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

const BlurContainerPress = styled.Pressable<{ width: number; height: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
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

export default ItemVideo;
