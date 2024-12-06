import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { useChangeThemePage } from "@context/ChangeThemePageContext";
import type { PageFlipperInstance } from "@thanhdong272/react-native-page-flipper";
import PageFlipper from "@thanhdong272/react-native-page-flipper";
import type * as Device from "expo-device";
import styled from "styled-components/native";

import {
  useGetBookDetails,
  useGetPopularBooks,
  useSaveCurrentPage,
} from "@generated/books/books";
import { breakIntoPages } from "@utils/breakIntoPages";
import { transformData } from "@utils/transformData";
import { EQueryUser } from "@constants/queries";

import type { BookPage } from "..";

import ItemFlipPage from "./ItemFlipPage";

import DefaultTheme from "@theme";

import { BOOK_READER_THEME, PER_PAGE } from "@/constants";

interface Props {
  uuid: string;
  lastReadPage: number;
  data: BookPage[];
  hasNextPage: boolean;
  setCurrentFlipPage: (value: number) => void;
  loadMore: () => void;
  deviceType: Device.DeviceType;
  fullWidth: number;
  fullHeight: number;
  pageDimensions: {
    width: number;
    height: number;
  };
  setTotalFlipPage: (value: number) => void;
}

const FlipPage: React.FC<Props> = ({
  uuid,
  lastReadPage,
  data,
  hasNextPage,
  setCurrentFlipPage,
  loadMore,
  deviceType,
  fullWidth,
  fullHeight,
  pageDimensions,
  setTotalFlipPage,
}) => {
  const flipPageRef = useRef<PageFlipperInstance>(null);
  const saveCurrentPage = useSaveCurrentPage();
  const { theme } = useChangeThemePage();

  const [frames, setFrames] = useState<any[]>([]);

  const queryOptions = {
    query: {
      queryKey: [EQueryUser.POPULAR_BOOKS],
      enabled: true,
    },
  };

  const { refetch: refetchPopularBooks } = useGetPopularBooks(
    {
      page: 1,
      perPage: PER_PAGE._10,
    },
    queryOptions,
  );

  const { refetch: refetchBookDetail } = useGetBookDetails(uuid);

  const pageContainerStyle = React.useMemo(
    () => ({
      backgroundColor:
        theme === BOOK_READER_THEME.DARK
          ? DefaultTheme.colors.black1C
          : DefaultTheme.colors.white,
      borderRadius: 24,
    }),
    [theme],
  );

  const pageSizeStyle = React.useMemo(
    () => ({
      height: fullHeight,
      width: fullWidth,
    }),
    [fullHeight, fullWidth],
  );

  const handleSaveCurrentPage = useCallback(
    async (page: number) => {
      try {
        const { success } = await saveCurrentPage.mutateAsync({
          data: {
            bookUuid: uuid,
            pageUuid: data[page - 1].uuid,
          },
        });

        if (success) {
          console.log("Save current page success");
          await Promise.all([refetchBookDetail(), refetchPopularBooks()]);
        }
      } catch (error) {
        console.log("Error on save current page: ", error);
      }
    },
    [data, uuid, saveCurrentPage, refetchBookDetail, refetchPopularBooks],
  );

  const handleFlippedEnd = useCallback(
    (index: number) => {
      setCurrentFlipPage(index + 1);

      handleSaveCurrentPage(index * 2 + 1);
    },
    [setCurrentFlipPage, handleSaveCurrentPage],
  );

  const mergedData = data.map((item) => {
    const fullContent = item.content
      .map((contentItem) => {
        if (contentItem.content.startsWith("<p>")) {
          return contentItem.content.replace(
            /<p>/g,
            `<p data-uuid="${contentItem.uuid}" data-page-uuid="${item.uuid}">`,
          );
        }
        return contentItem.content;
      })
      .join("");

    return {
      ...item,
      fullContent: fullContent,
    };
  });

  const fullContent = mergedData.map((item) => item.fullContent).join("");

  useEffect(() => {
    // Simulate breaking content into pages
    if (fullContent) {
      const _pages = breakIntoPages(fullContent, {
        width: pageDimensions.width,
        height: pageDimensions.height,
      });
      const _transformData = transformData(_pages);

      setTotalFlipPage(_transformData?.length);
      setFrames(_transformData);
    }
  }, [fullContent, pageDimensions]);

  const renderPage = useCallback(
    (pageData: any) => (
      <ItemFlipPage
        bookUUID={uuid}
        item={pageData}
        fullWidth={fullWidth}
        deviceType={deviceType}
      />
    ),
    [theme, fullWidth, deviceType],
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (data?.length > 0 && !hasNextPage) {
      timeoutId = setTimeout(() => {
        flipPageRef.current?.goToPage(Math.floor(lastReadPage / 2));
      }, 500);
    }
    return () => clearTimeout(timeoutId);
  }, [data?.length, hasNextPage, lastReadPage]);

  return (
    <FlipPageContainer>
      <PageFlipper
        ref={flipPageRef}
        onFlippedEnd={handleFlippedEnd}
        data={frames}
        singleImageMode
        contentContainerStyle={styles.flipperContainer}
        pressable={false}
        pageContainerStyle={pageContainerStyle}
        pageSize={pageSizeStyle}
        renderPage={renderPage}
        onEndReached={loadMore}
      />
    </FlipPageContainer>
  );
};

const FlipPageContainer = styled.View`
  flex: 1;
  margin-left: 26px;
  margin-right: 32px;
`;

const styles = StyleSheet.create({
  flipperContainer: {
    flex: 1,
  },
});

export default memo(FlipPage);
