import React from "react";
import { FlatList } from "react-native";
import { DeviceType } from "expo-device";
import styled from "styled-components/native";

import Chapter from "@components/Chapter";
import SpaceHeight from "@views/SpaceHeight";
import SpaceWidth from "@views/SpaceWidth";
import Text from "@views/Text";

import type { BookChapterResource } from "@generated/model";

import DefaultTheme from "@theme";

interface Props {
  sectionTitle: string;
  data: BookChapterResource[];
  deviceType: DeviceType;
  onEndReached: () => void;
  isLoading: boolean;
  renderSkeleton: () => JSX.Element;
}

const ChapterList: React.FC<Props> = ({
  sectionTitle,
  data,
  deviceType,
  onEndReached,
  isLoading,
  renderSkeleton,
}) => {
  const renderEmptyList = () => {
    if (data?.length === 0 && isLoading) {
      return renderSkeleton;
    }
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
        contentContainerStyle={{
          marginHorizontal: 18,
          paddingHorizontal: deviceType === DeviceType.TABLET ? 16 : 0,
          paddingVertical:
            data?.length !== 0
              ? deviceType === DeviceType.PHONE
                ? 10
                : 18
              : 0,
          borderRadius: 12,
          backgroundColor: DefaultTheme.colors.black005,
        }}
        data={data}
        scrollEnabled={false}
        renderItem={({ item, index }) => (
          <Chapter total={data.length} item={item} index={index} />
        )}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <SpaceWidth size={10} />}
        onEndReached={onEndReached}
        ListEmptyComponent={renderEmptyList()}
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

export default ChapterList;
