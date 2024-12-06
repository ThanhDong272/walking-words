import React, { memo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ResizeMode, Video } from "expo-av";
import styled from "styled-components/native";

import Icon from "@components/Icon";
import ViewControls from "@components/ViewControls";

import { ALPHA_VALUE } from "@constants";

import DefaultTheme from "@theme";

interface Props {
  isVisible: boolean;
  onDismiss: () => void;
  mediaUri: {
    videoUri: string;
  };
}

const ModalVideo: React.FC<Props> = ({ isVisible, onDismiss, mediaUri }) => {
  const VIDEO_PLAYBACK_SECOND = 15000;

  const videoRef = useRef<Video>(null);

  const opacityControl = useSharedValue(1);

  const [pauseVideo, setPauseVideo] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState({
    positionMillis: 0,
    durationMillis: 1,
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacityControl.value,
    };
  });

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

  const handleCloseModal = async () => {
    if (videoRef.current) {
      await videoRef?.current?.stopAsync();
      await videoRef?.current?.unloadAsync();
    }

    setPauseVideo(false);

    onDismiss();
  };

  const toggleOutsideVideo = () => {
    if (controlsVisible) {
      opacityControl.value = withTiming(1, {
        duration: 300,
      });

      setControlsVisible(false);
    } else {
      opacityControl.value = withTiming(0, {
        duration: 300,
      });

      setControlsVisible(true);
    }
  };

  const tap = Gesture.Tap().onStart(() => {
    runOnJS(toggleOutsideVideo)();
  });

  return (
    <Modal
      isVisible={isVisible}
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
      animationInTiming={200}
      animationOutTiming={200}
      backdropOpacity={0.5}
    >
      <Container>
        <GestureDetector gesture={tap}>
          <VideoBook
            ref={videoRef}
            source={{
              uri: mediaUri?.videoUri,
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
        <ButtonClose onPress={handleCloseModal}>
          <Icon
            iconName={"ic_close"}
            size={26}
            color={DefaultTheme.colors.white}
            disabled={true}
          />
        </ButtonClose>
        <AnimatedView style={animatedStyle}>
          <ViewControls
            isPause={pauseVideo}
            onPause={handlePauseVideo}
            onRewind={handleRewind}
            onForward={handleForward}
            position={"absolute"}
            bottom={24}
          />
        </AnimatedView>
      </Container>
    </Modal>
  );
};

const Container = styled.View`
  flex: 1;
  border-radius: 20px;
`;

const ButtonClose = styled.Pressable`
  position: absolute;
  top: 18px;
  right: 18px;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: ${DefaultTheme.colors.black + ALPHA_VALUE.alpha_03};
  justify-content: center;
  align-items: center;
`;

const VideoBook = styled(Video)`
  flex: 1;
  border-radius: 20px;
`;

const AnimatedView = styled(Animated.View)``;

const styles = StyleSheet.create({});

export default memo(ModalVideo);
