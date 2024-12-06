import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Device from "expo-device";
import { debounce } from "lodash";
import styled from "styled-components/native";

import SearchContent from "@components/SearchContent";
import SearchInput from "@components/SearchInput";
import LinearGradientView from "@views/LinearGradient";
import SpaceHeight from "@views/SpaceHeight";
import Text from "@views/Text";

import { useBookSearchInfinite } from "@generated/books/books";
import type { BookDataItem, BookSearchParams } from "@generated/model";
import useDeviceType from "@hooks/useDeviceType";

import DefaultTheme from "@theme";

interface Props {}

const SearchScreen: React.FC<Props> = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const deviceType = useDeviceType();

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<BookDataItem[]>([]);

  const searchParams: BookSearchParams = {
    name: searchText,
    page: 1,
    perPage: 10,
  };

  const { data, hasNextPage, fetchNextPage } = useBookSearchInfinite(
    searchParams,
    {
      query: {
        enabled: !!searchParams,
        refetchOnWindowFocus: false,
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

  useEffect(() => {
    if (data?.pages) {
      setSearchResults(
        data?.pages.flatMap((page) => page.data?.data ?? []) ?? [],
      );
    } else {
      setSearchResults([]);
    }
  }, [data]);

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      setSearchText(text);
    }, 2000),
    [],
  );

  useEffect(() => {
    debouncedSearch(searchText);

    if (searchText === "") {
      setSearchResults([]);
    }

    return () => debouncedSearch.cancel();
  }, [searchText, debouncedSearch]);

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Container>
      <LinearGradientView
        top={
          deviceType === Device.DeviceType.PHONE
            ? insets.top + 20
            : insets.top + 30
        }
      >
        <SearchInputContainer
          width={deviceType === Device.DeviceType.PHONE ? "100%" : "100%"}
        >
          <SearchInput
            placeholder={t("search.placeholder")}
            value={searchText}
            onChangeText={setSearchText}
          />
        </SearchInputContainer>
        <SpaceHeight size={16} />
        <ViewText>
          <TextCommon
            color={DefaultTheme.colors.white}
            fontSize={deviceType === Device.DeviceType.PHONE ? 15 : 22}
            fontFamily={DefaultTheme.fonts.metropolis.bold}
          >
            {t("search.title")}
          </TextCommon>
        </ViewText>
        <SpaceHeight size={14} />
        <SearchContent results={searchResults} onEndReached={loadMore} />
      </LinearGradientView>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const SearchInputContainer = styled.View<{ width: string }>`
  display: flex;
  align-items: flex-end;
  padding-left: 20px;
  padding-right: 20px;
  width: ${(props) => props.width};
`;

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

export default SearchScreen;
