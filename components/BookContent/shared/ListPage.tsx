import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useChangeThemePage } from "@context/ChangeThemePageContext";
import type * as Device from "expo-device";
import styled from "styled-components/native";

import {
  useGetBookDetails,
  useGetPopularBooks,
  useSaveCurrentPage,
} from "@generated/books/books";
import { BOOK_READER_THEME, PER_PAGE } from "@constants";
import { EQueryUser } from "@constants/queries";

import type { BookPage } from "..";

import ItemListPage from "./ItemListPage";

import DefaultTheme from "@theme";

interface Props {
  uuid: string;
  lastReadPage: number;
  data: BookPage[];
  hasNextPage: boolean;
  isFullscreen: boolean;
  isReading: boolean;
  loadMore: () => void;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  deviceType: Device.DeviceType;
  fullWidth: number;
  fullHeight: number;
}

const SCROLL_DEBOUNCE_TIME = 1000;
const INITIAL_SCROLL_DELAY = 500;

const ListPage: React.FC<Props> = ({
  uuid,
  lastReadPage,
  data,
  hasNextPage,
  isFullscreen,
  isReading,
  loadMore,
  currentPage,
  setCurrentPage,
  deviceType,
  fullWidth,
  fullHeight,
}) => {
  const scrollEndTimer = useRef<NodeJS.Timeout | null>(null);
  const listPageRef = useRef<FlatList>(null);
  const saveCurrentPage = useSaveCurrentPage();
  const { theme } = useChangeThemePage();

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

  const containerStyle = React.useMemo(
    () => ({
      backgroundColor:
        theme === BOOK_READER_THEME.DARK
          ? DefaultTheme.colors.black1C
          : DefaultTheme.colors.white,
      marginBottom: isReading ? 100 : 20,
    }),
    [theme, isReading],
  );

  const getLeftTopHeight = useCallback(() => {
    const height = isFullscreen ? 112 : 158;
    return isReading ? height - 100 : height;
  }, [isFullscreen, isReading]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const pageNumber = Math.round(
        event.nativeEvent.contentOffset.y / fullHeight,
      );
      setCurrentPage(pageNumber + 1);
    },
    [fullHeight, setCurrentPage],
  );

  const handleScrollBegin = useCallback(() => {
    if (scrollEndTimer.current) {
      clearTimeout(scrollEndTimer.current);
      scrollEndTimer.current = null;
    }
  }, []);

  const handleSaveCurrentPage = useCallback(async () => {
    if (!data[currentPage - 1]) return;

    try {
      const { success } = await saveCurrentPage.mutateAsync({
        data: {
          bookUuid: uuid,
          pageUuid: data[currentPage - 1].uuid,
        },
      });

      if (success) {
        await Promise.all([refetchBookDetail(), refetchPopularBooks()]);
      }
    } catch (error) {
      console.log("Error on save current page: ", error);
    }
  }, [
    currentPage,
    data,
    uuid,
    saveCurrentPage,
    refetchBookDetail,
    refetchPopularBooks,
  ]);

  const handleScrollEnd = useCallback(() => {
    scrollEndTimer.current = setTimeout(
      handleSaveCurrentPage,
      SCROLL_DEBOUNCE_TIME,
    );
  }, [handleSaveCurrentPage]);

  const renderItem = useCallback(
    ({ item, index }: { item: BookPage; index: number }) => (
      <ItemListPage
        bookUUID={uuid}
        item={item}
        index={index}
        fullWidth={fullWidth}
        deviceType={deviceType}
      />
    ),
    [theme, fullWidth, deviceType],
  );

  const keyExtractor = useCallback(
    (item: BookPage, index: number) => `${item.uuid || ""}-${index}`,
    [],
  );

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (data?.length > 0 && !hasNextPage) {
      timeoutId = setTimeout(() => {
        listPageRef.current?.scrollToIndex({
          index: lastReadPage - 1,
          animated: true,
          viewPosition: 0,
        });
      }, INITIAL_SCROLL_DELAY);
    }
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNextPage, lastReadPage]);

  useEffect(() => {
    return () => {
      if (scrollEndTimer.current) {
        clearTimeout(scrollEndTimer.current);
      }
    };
  }, []);

  return (
    <ContainerList {...containerStyle}>
      <FlatList
        ref={listPageRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        scrollEnabled
        bounces={false}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        scrollEventThrottle={16}
        onEndReachedThreshold={0.5}
        onEndReached={loadMore}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={5}
      />
    </ContainerList>
  );
};

const ContainerList = styled.View<{
  backgroundColor: string;
  marginBottom: number;
}>`
  margin-horizontal: 20px;
  padding-horizontal: 16px;
  padding-vertical: 32px;
  margin-bottom: ${(props) => props.marginBottom}px;
  border-radius: 24px 12px 12px 24px;
  background-color: ${(props) => props.backgroundColor};
`;

export default memo(ListPage);
