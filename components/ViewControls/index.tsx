import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useReadAudio } from "@context/AudioContext";
import { Image } from "expo-image";
import styled from "styled-components/native";

import Icon from "@components/Icon";

import { images } from "@assets/images";
import DefaultTheme from "@theme";

interface Props {
  position?: string;
  zIndex?: number;
  bottom?: number;
  marginTop?: number;
  marginBottom?: number;
}

const ViewControls: React.FC<Props> = ({
  position = "relative",
  zIndex = 1,
  bottom = 0,
  marginTop = 0,
  marginBottom = 0,
}) => {
  const { pauseReading, onPauseReading, onRewind, onForward } = useReadAudio();

  return (
    <ControlsContainer
      position={position}
      zIndex={zIndex}
      bottom={bottom}
      marginTop={marginTop}
      marginBottom={marginBottom}
    >
      <TouchableOpacity onPress={onRewind}>
        <ImageControl contentFit={"contain"} source={images.rewind} />
      </TouchableOpacity>
      <ViewControlPause>
        <Icon
          iconName={pauseReading ? "ic_play" : "ic_pause"}
          size={20}
          color={DefaultTheme.colors.white}
          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          onPress={onPauseReading}
        />
      </ViewControlPause>
      <TouchableOpacity onPress={onForward}>
        <ImageControl contentFit={"contain"} source={images.forward} />
      </TouchableOpacity>
    </ControlsContainer>
  );
};

const ControlsContainer = styled.View<{
  position: string;
  zIndex: number;
  bottom: number;
  marginTop: number;
  marginBottom: number;
}>`
  position: ${(props) => props.position};
  z-index: ${(props) => props.zIndex};
  bottom: ${(props) => props.bottom}px;
  margin-top: ${(props) => props.marginTop}px;
  margin-bottom: ${(props) => props.marginBottom}px;
  width: 228px;
  height: 62px;
  border-radius: 100px;
  align-self: center;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: ${DefaultTheme.colors.black14};
`;

const ImageControl = styled(Image)`
  width: 24px;
  height: 24px;
`;

const ViewControlPause = styled.View`
  width: 62px;
  height: 62px;
  border-radius: 62px;
  background-color: ${DefaultTheme.colors.black16};
  justify-content: center;
  align-items: center;
`;

const styles = StyleSheet.create({});

export default ViewControls;
