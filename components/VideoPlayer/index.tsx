import React, { useEffect, useRef } from "react";
import { TouchableWithoutFeedback } from "react-native";
import Orientation from "react-native-orientation-locker";
import { ResizeMode, Video, VideoFullscreenUpdate } from "expo-av";
import styled from "styled-components/native";

import useDimensions from "@hooks/useDimensions";

import { screenHeight } from "@/utils/common";

interface Props {
  videoRef: React.RefObject<Video>;
  source: any;
  isPlayingVideo: boolean;
  setIsPlayingVideo: (value: boolean) => void;
  isFullscreen: boolean;
  setIsFullscreen: (value: boolean) => void;
}

const VideoPlayer: React.FC<Props> = ({
  source,
  isPlayingVideo,
  setIsPlayingVideo,
  isFullscreen,
  setIsFullscreen,
}) => {
  const videoRef = useRef<Video>(null);
  const { dimensions } = useDimensions();

  useEffect(() => {
    if (isPlayingVideo) {
      if (isFullscreen) {
        videoRef?.current?.presentFullscreenPlayer();
      } else {
        videoRef?.current?.dismissFullscreenPlayer();
      }
    }
  }, [isFullscreen, isPlayingVideo]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (isPlayingVideo) {
          setIsPlayingVideo(false);
          videoRef?.current?.pauseAsync();
        }
      }}
    >
      <Container
        height={dimensions.height / 3}
        ref={videoRef}
        source={source}
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
            videoRef?.current?.dismissFullscreenPlayer();

            if (isPlayingVideo) {
              await videoRef?.current?.playAsync();
            } else {
              setIsPlayingVideo(false);
              await videoRef?.current?.pauseAsync();
            }
          }
        }}
      />
    </TouchableWithoutFeedback>
  );
};

const Container = styled(Video)<{
  height?: number;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${({ height }) => height || screenHeight / 3}px;
`;
export default VideoPlayer;
