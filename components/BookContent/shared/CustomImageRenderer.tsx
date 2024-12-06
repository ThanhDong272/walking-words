import React, { memo, useCallback, useState } from "react";
import type { InternalRendererProps, TBlock } from "react-native-render-html";
import { useInternalRenderer } from "react-native-render-html";
import { Image } from "expo-image";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import styled from "styled-components/native";

interface CustomImageRendererProps extends InternalRendererProps<TBlock> {
  width: number;
}

const CustomImageRenderer = (props: CustomImageRendererProps) => {
  const { rendererProps } = useInternalRenderer("img", props);

  const [isLoading, setIsLoading] = useState(false);

  const uri = rendererProps.source.uri;

  const thumbnailSource = {
    uri: uri,
  };

  const handleLoadEnd = useCallback(() => {
    setIsLoading(true);
  }, []);

  return (
    <Container>
      {!isLoading && uri !== "" && (
        <MotiView
          transition={{
            type: "timing",
          }}
        >
          <Skeleton
            colorMode={"dark"}
            width={props.width}
            height={165}
            radius={10}
          />
        </MotiView>
      )}
      {thumbnailSource && (
        <ImageBook
          source={thumbnailSource}
          contentFit={"cover"}
          onLoadEnd={handleLoadEnd}
        />
      )}
    </Container>
  );
};

const Container = styled.View`
  height: 165px;
  border-radius: 10px;
  margin-bottom: 16px;
`;

const ImageBook = styled(Image)`
  height: 165px;
  border-radius: 10px;
`;

export default memo(CustomImageRenderer);
