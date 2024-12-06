import React, { memo, useState } from "react";
import type { InternalRendererProps, TBlock } from "react-native-render-html";
import { BlurView } from "expo-blur";
import * as Device from "expo-device";
import { router } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import styled from "styled-components/native";

import Icon from "@components/Icon";

import BlurContainerPressable from "./BlurContainerPressable";
import ModalVideo from "./ModalVideo";

import DefaultTheme from "@theme";

interface CustomVideoRendererProps extends InternalRendererProps<TBlock> {
  width: number;
  deviceType: Device.DeviceType;
}

const CustomVideoRenderer = (props: CustomVideoRendererProps) => {
  const { tnode, deviceType } = props;

  const [mediaUri, setMediaUri] = useState({
    videoUri: "",
  });
  const [showModalVideo, setShowModalVideo] = useState(false);

  const handleTapVideo = async ({ videoUri }: { videoUri: string }) => {
    if (deviceType === Device.DeviceType.PHONE) {
      await ScreenOrientation.unlockAsync();
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
      );

      router.push({
        pathname: "/(screens)/video_book",
        params: {
          videoUri,
        },
      });
    } else {
      setShowModalVideo(true);
      setMediaUri({
        videoUri,
      });
    }
  };

  return (
    <VideoContainer>
      <ImageThumbnail
        source={{ uri: tnode.attributes.poster }}
        resizeMode={"cover"}
      />
      <BlurContainerPressable
        pointerEvents={"box-none"}
        onPress={() => {
          handleTapVideo({
            videoUri: tnode.attributes.src,
          });
        }}
      >
        <BlurViewOutside
          intensity={10}
          experimentalBlurMethod={"dimezisBlurView"}
        >
          <BlurViewInside
            intensity={10}
            experimentalBlurMethod={"dimezisBlurView"}
          >
            <Icon
              iconName={"ic_play"}
              size={20}
              color={DefaultTheme.colors.white}
              disabled={true}
            />
          </BlurViewInside>
        </BlurViewOutside>
      </BlurContainerPressable>
      <ModalVideo
        mediaUri={mediaUri}
        isVisible={showModalVideo}
        onDismiss={() => setShowModalVideo(false)}
      />
    </VideoContainer>
  );
};

const VideoContainer = styled.View`
  height: 165px;
  border-radius: 10px;
  margin-bottom: 16px;
`;

const ImageThumbnail = styled.Image`
  height: 165px;
  border-radius: 10px;
`;

const BlurViewOutside = styled(BlurView)`
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 55px;
  height: 55px;
  border-radius: 55px;
`;

const BlurViewInside = styled(BlurView)`
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 45px;
  height: 45px;
  border-radius: 45px;
`;

export default memo(CustomVideoRenderer);
