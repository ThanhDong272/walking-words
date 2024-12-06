import React, { memo, useEffect, useState } from "react";
import Orientation from "react-native-orientation-locker";
import { useDeviceType } from "@context/DeviceTypeContext";
import { DeviceType } from "expo-device";
import { router } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import styled from "styled-components/native";

import ButtonBookmark from "@components/ButtonBookmark";
import ButtonReadBook from "@components/ButtonReadBook";
import SpaceWidth from "@views/SpaceWidth";

import {
  useBookmarkBook,
  useGetBookDetails,
  useGetMyNovelsInfinite,
  useGetPopularBooks,
} from "@generated/books/books";
import type { BookItemData } from "@generated/model";
import LocalServices from "@services/local";
import { PER_PAGE } from "@constants";
import { EQueryUser } from "@constants/queries";

interface Props {
  item: BookItemData | null;
}

const Container = styled.View`
  margin-top: 16px;
`;

const ViewRowCenter = styled.View<{ justifyContent?: string }>`
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) => props.justifyContent};
`;

const ButtonDetail: React.FC<Props> = ({ item }) => {
  const deviceType = useDeviceType();

  const bookmark = useBookmarkBook();
  const { refetch: refetchBookDetail } = useGetBookDetails(item?.uuid ?? "");
  const { refetch: refetchPopularBooks } = useGetPopularBooks(
    {
      page: 1,
      perPage: PER_PAGE._10,
    },
    {
      query: {
        queryKey: [EQueryUser.POPULAR_BOOKS],
        enabled: true,
      },
    },
  );
  const { refetch: refetchMyNovels } = useGetMyNovelsInfinite(
    {
      page: 0,
      perPage: 10,
    },
    {
      query: {
        queryKey: [EQueryUser.MY_NOVELS],
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

  const [bookmarked, setBookmarked] = useState<boolean>(false);

  useEffect(() => {
    if (item) {
      setBookmarked(item?.isBookmarked ?? false);
    }
  }, [item]);

  const handleBookmark = async () => {
    try {
      const { success } = await bookmark.mutateAsync({
        bookUuid: item?.uuid ?? "",
      });
      if (success) {
        const responseBookDetail = await refetchBookDetail();

        const bookDetailData = responseBookDetail?.data?.data?.data;

        if (bookDetailData) {
          setBookmarked(bookDetailData!.isBookmarked!);

          refetchPopularBooks();
          refetchMyNovels();
        }
      }
    } catch (error) {
      console.log("Error on bookmark: ", error);

      if (error instanceof Error && "response" in error) {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          LocalServices.removeItem("USER_SKIP");
          router.push("/(auth)/login");
        }
      }
    }
  };

  const handleNavigateBookReader = async () => {
    if (deviceType === DeviceType.TABLET) {
      await ScreenOrientation.unlockAsync();
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
      );

      Orientation.lockToLandscapeLeft();
    }

    router.push({ pathname: "/(screens)/book_reader", params: item });
  };

  return (
    <Container>
      <ViewRowCenter>
        <ButtonReadBook
          onPress={handleNavigateBookReader}
          containerStyles={{
            flex: 1,
            width: "auto",
          }}
          viewRowStyles={
            deviceType === DeviceType.PHONE
              ? { justifyContent: "flex-start" }
              : { justifyContent: "center" }
          }
        />
        <SpaceWidth size={14} />
        <ButtonBookmark
          isBookmark={bookmarked}
          onPress={handleBookmark}
          containerStyles={{
            flex: 1,
            width: "auto",
          }}
          viewRowStyles={
            deviceType === DeviceType.PHONE
              ? { justifyContent: "flex-start" }
              : { justifyContent: "center" }
          }
        />
      </ViewRowCenter>
    </Container>
  );
};

export default memo(ButtonDetail);
