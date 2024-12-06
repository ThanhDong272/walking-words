import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";
import styled from "styled-components/native";

import ChapterList from "@components/ChapterList";
import VideoThumbnail from "@components/VideoThumbnail";
import SpaceHeight from "@views/SpaceHeight";

import { useGetBookChaptersInfinite } from "@generated/books/books";
import type { BookDataItem } from "@generated/model";
import useDeviceType from "@hooks/useDeviceType";
import useDimensions from "@hooks/useDimensions";

import DefaultTheme from "@theme";

interface Props {}

const DetailsScreen: React.FC<Props> = () => {
  const itemData = useLocalSearchParams<BookDataItem | any>();
  const { t } = useTranslation();
  const deviceType = useDeviceType();
  const { dimensions } = useDimensions();

  const { data, isLoading, hasNextPage, fetchNextPage } =
    useGetBookChaptersInfinite(
      itemData?.uuid,
      {
        page: 0,
        perPage: 10,
      },
      {
        query: {
          enabled: true,
          getNextPageParam: (lastPage) => {
            if (
              (lastPage?.data?.meta?.currentPage ?? 0) <
              (lastPage?.data?.meta?.total ?? 0)
            ) {
              return (lastPage?.data?.meta?.currentPage ?? 0) + 1;
            }
            return undefined;
          },
        },
      },
    );

  const renderSkeleton = () => {
    const skeletons = [];

    for (let i = 0; i < 10; i++) {
      skeletons.push(
        <MotiView
          key={i}
          style={{
            alignSelf: "center",
            marginBottom: 12,
            borderRadius: 12,
          }}
          transition={{
            type: "timing",
          }}
          animate={{ backgroundColor: DefaultTheme.colors.black0F }}
        >
          <Skeleton
            colorMode={"dark"}
            width={dimensions?.width - 68}
            height={64}
            radius={12}
          />
        </MotiView>,
      );
    }

    return <>{skeletons}</>;
  };

  return (
    <Container>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <VideoThumbnail uuid={itemData?.uuid} />
        <SpaceHeight size={24} />
        <ChapterList
          data={data?.pages?.flatMap((page) => page.data?.data ?? []) ?? []}
          sectionTitle={t("details.chapter")}
          deviceType={deviceType}
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          isLoading={isLoading}
          renderSkeleton={renderSkeleton}
        />
      </ScrollView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${DefaultTheme.colors.black0F};
`;

export default DetailsScreen;
