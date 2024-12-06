import type { RefObject } from "react";
import React from "react";
import { StyleSheet } from "react-native";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import styled from "styled-components/native";

import SpaceWidth from "@views/SpaceWidth";

import { images } from "@assets/images";

interface Props {
  carouselRef: RefObject<ICarouselInstance>;
}

const SwipeControls: React.FC<Props> = ({ carouselRef }) => {
  return (
    <ViewSwitchCarouselControl>
      <ButtonSwitch
        onPress={() => {
          carouselRef?.current?.prev();
        }}
      >
        <ImageSwitch source={images.previousPage} />
      </ButtonSwitch>
      <SpaceWidth size={8} />
      <ButtonSwitch
        onPress={() => {
          carouselRef?.current?.next();
        }}
      >
        <ImageSwitch source={images.nextPage} />
      </ButtonSwitch>
    </ViewSwitchCarouselControl>
  );
};

const ViewSwitchCarouselControl = styled.View`
  position: absolute;
  right: 40px;
  bottom: 4px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const ButtonSwitch = styled.TouchableOpacity``;

const ImageSwitch = styled(Image)`
  width: 24px;
  height: 24px;
`;

const styles = StyleSheet.create({});

export default SwipeControls;
