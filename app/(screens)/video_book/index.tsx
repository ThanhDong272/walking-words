import React, { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { ResizeMode, Video } from "expo-av";
import { router } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import styled from "styled-components/native";

import Icon from "@components/Icon";
import ViewControls from "@components/ViewControls";

import { isIOS } from "@utils/common";
import { ALPHA_VALUE } from "@constants";

import DefaultTheme from "@theme";

interface Props {}

const VideoBookScreen: React.FC<Props> = () => {
  const VIDEO_PLAYBACK_SECOND = 15000;

  const route = useRoute();
  const insets = useSafeAreaInsets();
  const videoRef = useRef<Video>(null);

  const controlTranslateY = useSharedValue(0);

  const { videoUri } = route.params as {
    videoUri: string;
  };

  const [pauseVideo, setPauseVideo] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState({
    positionMillis: 0,
    durationMillis: 1,
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: controlTranslateY.value }],
    };
  });

  const handleDismiss = async () => {
    await ScreenOrientation.unlockAsync();
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP,
    );

    if (videoRef.current) {
      await videoRef?.current?.stopAsync();
      await videoRef?.current?.unloadAsync();
    }

    router.dismiss();
  };

  const handlePauseVideo = async () => {
    if (videoFinished) {
      await videoRef?.current?.replayAsync();
      setPauseVideo(false);
      setVideoFinished(false);
    } else {
      setPauseVideo(!pauseVideo);
    }
  };

  const handleForward = async () => {
    if (videoRef.current && playbackStatus?.positionMillis != null) {
      await videoRef.current.setStatusAsync({
        positionMillis: playbackStatus.positionMillis + VIDEO_PLAYBACK_SECOND,
      });
    }
  };

  const handleRewind = async () => {
    if (videoRef.current && playbackStatus.positionMillis != null) {
      await videoRef.current.setStatusAsync({
        positionMillis: Math.max(
          playbackStatus.positionMillis - VIDEO_PLAYBACK_SECOND,
          0,
        ),
      });
    }
  };

  const toggleOutsideVideo = () => {
    if (controlsVisible) {
      controlTranslateY.value = withTiming(
        100,
        {
          duration: 300,
          easing: Easing.in(Easing.cubic),
        },
        () => {
          runOnJS(setControlsVisible)(false);
        },
      );
    } else {
      controlTranslateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });

      setControlsVisible(true);
    }
  };

  const tap = Gesture.Tap().onStart(() => {
    runOnJS(toggleOutsideVideo)();
  });

  return (
    <Container>
      <GestureDetector gesture={tap}>
        <VideoBook
          ref={videoRef}
          source={{
            uri: videoUri,
          }}
          resizeMode={ResizeMode.COVER}
          shouldPlay={!pauseVideo}
          volume={1}
          rate={1.0}
          isMuted={false}
          isLooping={false}
          usePoster={true}
          onPlaybackStatusUpdate={async (status: any) => {
            if (status.didJustFinish) {
              setPauseVideo(true);
              setVideoFinished(true);
            }
            setPlaybackStatus(status);
          }}
        />
      </GestureDetector>
      <ButtonBack
        onPress={handleDismiss}
        left={isIOS ? insets.left : insets.top}
      >
        <Icon
          iconName={"ic_arrow_back"}
          size={14}
          color={DefaultTheme.colors.white}
          disabled={true}
        />
      </ButtonBack>
      <AnimatedView style={animatedStyle}>
        <ViewControls
          isPause={pauseVideo}
          onPause={handlePauseVideo}
          onRewind={handleRewind}
          onForward={handleForward}
          position={"absolute"}
          bottom={isIOS ? insets.bottom : 18}
        />
      </AnimatedView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const ButtonBack = styled.Pressable<{ left: number }>`
  position: absolute;
  top: 32px;
  left: ${(props) => props.left}px;
  width: 32px;
  height: 32px;
  border-radius: 2.4px;
  background-color: ${DefaultTheme.colors.black + ALPHA_VALUE.alpha_03};
  justify-content: center;
  align-items: center;
`;

const VideoBook = styled(Video)`
  flex: 1;
`;

const AnimatedView = styled(Animated.View)``;

const styles = StyleSheet.create({});

export default VideoBookScreen;
