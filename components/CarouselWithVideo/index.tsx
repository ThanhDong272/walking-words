import React, { useEffect, useRef, useState } from "react";
import { interpolate } from "react-native-reanimated";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import Carousel from "react-native-reanimated-carousel";
import { DeviceType } from "expo-device";
import styled from "styled-components/native";

import HomeContent from "@components/HomeContent";

import type { BookDataItem } from "@generated/model";
import useDimensions from "@hooks/useDimensions";

import ItemVideo from "./shared/ItemVideo";
import SwipeControls from "./shared/SwipeControls";

interface Props {
  data?: BookDataItem[];
  deviceType?: DeviceType;
  setHideBackdrop: (value: boolean) => void;
}

const CarouselWithVideo: React.FC<Props> = ({ data, deviceType }) => {
  const carouselRef = useRef<ICarouselInstance>(null);
  const { dimensions } = useDimensions();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [parentPlaying, setParentPlaying] = useState(false);

  const renderItemBook = () => {
    return (
      <>
        {data?.[currentIndex] && (
          <HomeContent
            item={data?.[currentIndex]}
            currentIndex={currentIndex}
            isPlayingVideo={parentPlaying}
            deviceType={deviceType}
          />
        )}
      </>
    );
  };

  const animationStyle = React.useCallback((value: number) => {
    "worklet";

    const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
    const translateX = interpolate(
      value,
      [-2, 0, 1],
      [-dimensions.width, 0, dimensions.width],
    );

    return {
      transform: [{ translateX }],
      zIndex,
    };
  }, []);

  return (
    <Container>
      <Carousel
        ref={carouselRef}
        loop={data?.length !== 1 ? true : false}
        style={{ width: dimensions.width, height: dimensions.height / 3 }}
        width={dimensions.width}
        data={data || []}
        onSnapToItem={(index) => {
          setCurrentIndex(index);
        }}
        renderItem={({ index, animationValue }) => {
          return (
            <>
              {data?.[index] && (
                <ItemVideo
                  item={data?.[index]}
                  index={index}
                  setParentPlaying={setParentPlaying}
                  currentIndex={currentIndex}
                  animationValue={animationValue}
                />
              )}
            </>
          );
        }}
        customAnimation={animationStyle}
        scrollAnimationDuration={1200}
      />
      {deviceType === DeviceType.TABLET && (
        <SwipeControls carouselRef={carouselRef} />
      )}
      {renderItemBook()}
    </Container>
  );
};

const Container = styled.View``;

export default CarouselWithVideo;
