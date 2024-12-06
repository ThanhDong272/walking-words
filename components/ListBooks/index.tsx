import React, { useCallback, useState } from "react";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native";
import { DeviceType } from "expo-device";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { isNull } from "lodash";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import styled from "styled-components/native";

import SpaceHeight from "@views/SpaceHeight";
import SpaceWidth from "@views/SpaceWidth";
import Text from "@views/Text";

import type { BookDataItem } from "@services/network/generated/model";

import DefaultTheme from "@theme";

interface Props {
  sectionTitle: string;
  data: BookDataItem[];
  status: any;
  deviceType: DeviceType;
  onEndReached?: () => void;
}

const ListBooks: React.FC<Props> = ({
  sectionTitle,
  data,
  status,
  deviceType,
  onEndReached,
}) => {
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);

  const handleLoadEnd = useCallback(() => setLoaded(true), []);

  const renderItem = ({
    item,
    index,
  }: {
    item: BookDataItem;
    index: number;
  }) => {
    return (
      <TouchableComponent
        width={deviceType === DeviceType.PHONE ? 252 : 330}
        height={deviceType === DeviceType.PHONE ? 168 : 220}
        onPress={() =>
          router.push({ pathname: `/(tabs)/home/${item?.uuid}`, params: item })
        }
      >
        {!loaded &&
          (item as any).thumbnail !== "" &&
          !isNull((item as any).thumbnail) && (
            <MotiView
              transition={{
                type: "timing",
              }}
              animate={{ backgroundColor: DefaultTheme.colors.black }}
            >
              <Skeleton
                colorMode={"dark"}
                width={deviceType === DeviceType.PHONE ? 252 : 330}
                height={deviceType === DeviceType.PHONE ? 168 : 220}
                radius={"square"}
              />
            </MotiView>
          )}
        <ImageBook
          width={deviceType === DeviceType.PHONE ? 252 : 330}
          height={deviceType === DeviceType.PHONE ? 168 : 220}
          source={{ uri: item?.thumbnail }}
          priority={"high"}
          onLoadEnd={handleLoadEnd}
        />
      </TouchableComponent>
    );
  };

  const renderSkeleton = () => {
    const skeletons = [];

    for (let i = 0; i < 10; i++) {
      skeletons.push(
        <MotiView
          key={i}
          transition={{
            type: "timing",
          }}
          animate={{ backgroundColor: DefaultTheme.colors.black }}
          style={{ marginRight: 10 }}
        >
          <Skeleton
            colorMode={"dark"}
            width={deviceType === DeviceType.PHONE ? 252 : 330}
            height={deviceType === DeviceType.PHONE ? 168 : 220}
            radius={"square"}
          />
        </MotiView>,
      );
    }
    return <>{status === "pending" && skeletons}</>;
  };

  return (
    <Container>
      <ViewText>
        <TextCommon
          color={DefaultTheme.colors.white}
          fontSize={deviceType === DeviceType.PHONE ? 15 : 22}
          fontFamily={DefaultTheme.fonts.metropolis.bold}
        >
          {sectionTitle}
        </TextCommon>
      </ViewText>
      <SpaceHeight size={14} />
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 20 }}
        data={data}
        renderItem={renderItem}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <SpaceWidth size={10} />}
        onEndReachedThreshold={0.1}
        onEndReached={onEndReached}
        ListEmptyComponent={renderSkeleton}
      />
      <SpaceHeight size={24} />
    </Container>
  );
};

const Container = styled.View``;

const ViewText = styled.View`
  padding-left: 20px;
`;

const TextCommon = styled(Text)<{
  color: string;
  fontSize: number;
  fontFamily: string;
}>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize}px;
  font-family: ${(props) => props.fontFamily};
`;

const ImageBook = styled(Image)<{ height: number; width: number }>`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
`;

const TouchableComponent = styled(TouchableOpacity)<{
  width: number;
  height: number;
}>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

export default ListBooks;
