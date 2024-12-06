import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";

import BookContent from "@components/BookContent";
import HeaderBookReader from "@components/HeaderBookReader";
import SpaceHeight from "@views/SpaceHeight";

import DefaultTheme from "@theme";

interface Props {}

const BookReaderScreen: React.FC<Props> = () => {
  const { uuid, currentPage } = useLocalSearchParams();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [headerDimensions, setHeaderDimensions] = useState({
    width: 0,
    height: 0,
  });

  return (
    <Container>
      <HeaderBookReader
        isFullscreen={isFullscreen}
        onTurnOffFullscreen={() => setIsFullscreen(false)}
        onTurnOnFullscreen={() => setIsFullscreen(true)}
        onLayout={(e) => {
          setHeaderDimensions({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
          });
        }}
      />
      <SpaceHeight size={8} />
      <BookContent
        uuid={uuid as string}
        lastReadPage={Number(currentPage) || 1}
        isFullscreen={isFullscreen}
        headerDimensions={headerDimensions}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${DefaultTheme.colors.black};
`;

export default BookReaderScreen;
