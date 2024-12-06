import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions } from "react-native";
import { useReadAudio } from "@context/AudioContext";
import { useChangeThemePage } from "@context/ChangeThemePageContext";
import { useDeviceType } from "@context/DeviceTypeContext";
import * as Device from "expo-device";
import styled from "styled-components/native";

import ViewControls from "@components/ViewControls";
import SpaceHeight from "@views/SpaceHeight";
import Text from "@views/Text";

import { useGetBooksPagesInfinite } from "@generated/books/books";
import type { ChapterPage } from "@generated/model";
import { EQueryUser } from "@constants/queries";

import FlipPage from "./shared/FlipPage";
import ListPage from "./shared/ListPage";

import DefaultTheme from "@theme";

import { BOOK_READER_THEME } from "@/constants";
import { ALPHA_VALUE, PER_PAGE } from "@/constants";
import { screenHeight, screenWidth } from "@/utils/common";

export interface BookPage extends ChapterPage {
  showLine: boolean;
  flatContent?: string[];
}

interface Props {
  uuid: string;
  lastReadPage: number;
  isFullscreen: boolean;
  headerDimensions?: { width: number; height: number };
}

const BookContent: React.FC<Props> = ({
  uuid,
  lastReadPage,
  isFullscreen,
  headerDimensions,
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFlipPage, setCurrentFlipPage] = useState(1);
  const [pages, setPages] = useState<BookPage[]>([]);
  const [fullWidth, setFullWidth] = useState(screenWidth);
  const [fullHeight, setFullHeight] = useState(screenHeight);
  const [pageDimensions, setPageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [totalFlipPage, setTotalFlipPage] = useState(0);

  const {
    isReading,
    sound,
    setIsReading,
    setPauseReading,
    setPlaybackStatus,
    getPlaybackPercentage,
  } = useReadAudio();
  const deviceType = useDeviceType();
  const { theme } = useChangeThemePage();

  const { data, hasNextPage, fetchNextPage } = useGetBooksPagesInfinite(
    uuid,
    {
      page: 1,
      perPage: PER_PAGE._20,
    },
    {
      query: {
        enabled: true,
        queryKey: [EQueryUser.BOOK_PAGES],
        getNextPageParam: (lastPage) => {
          if (!lastPage?.data?.meta) return undefined;

          if (
            (lastPage.data.meta.currentPage ?? 0) <
            (lastPage.data.meta.lastPage ?? 0)
          ) {
            return (lastPage.data.meta.currentPage ?? 0) + 1;
          }
          return undefined;
        },
      },
    },
  );

  useEffect(() => {
    if (headerDimensions) {
      setPageDimensions({
        width: (fullWidth - 223) / 2, // 58 - 85 - 42 - 21 - 11 - 6 = 223
        height: fullHeight - headerDimensions.height - 184, // 62 - 106 - 12 - 4 = 184
      });
    }
  }, [fullHeight, fullWidth, headerDimensions]);

  useEffect(() => {
    const handleOrientationChange = () => {
      const { width, height } = Dimensions.get("window");

      setFullWidth(width);
      setFullHeight(height);
    };

    const subscription = Dimensions.addEventListener(
      "change",
      handleOrientationChange,
    );

    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (data?.pages) {
      const dataPage = data.pages?.flatMap((page) => page.data?.data ?? []);

      const updatedPages = dataPage.map((page: ChapterPage, index: number) => {
        return {
          ...page,
          showLine: index !== dataPage.length - 1,
        };
      });

      setPages(updatedPages);

      console.log("dataPage", updatedPages);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      sound?.unloadAsync();
      setIsReading(false);
      setPauseReading(false);
      setPlaybackStatus({
        positionMillis: 0,
        durationMillis: 1,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sound]);

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return (
    <Container>
      {deviceType === Device.DeviceType.PHONE ? (
        <>
          {pages?.length > 0 && (
            <ListPage
              uuid={uuid}
              lastReadPage={lastReadPage}
              data={pages}
              hasNextPage={hasNextPage}
              isFullscreen={isFullscreen}
              isReading={isReading}
              loadMore={loadMore}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              deviceType={deviceType}
              fullWidth={fullWidth}
              fullHeight={fullHeight}
            />
          )}
        </>
      ) : (
        <FlipPage
          uuid={uuid}
          lastReadPage={lastReadPage}
          data={pages}
          hasNextPage={hasNextPage}
          setCurrentFlipPage={setCurrentFlipPage}
          loadMore={loadMore}
          deviceType={deviceType}
          fullWidth={fullWidth}
          fullHeight={fullHeight}
          pageDimensions={pageDimensions}
          setTotalFlipPage={setTotalFlipPage}
        />
      )}
      {deviceType === Device.DeviceType.PHONE && <SpaceHeight size={8} />}
      {deviceType === Device.DeviceType.PHONE ? (
        <>
          {pages?.length > 0 && (
            <ViewSeparateBottom>
              <TextCommon
                color={
                  theme === BOOK_READER_THEME.LIGHT && isReading
                    ? DefaultTheme.colors.black + ALPHA_VALUE.alpha_05
                    : DefaultTheme.colors.white + ALPHA_VALUE.alpha_05
                }
                fontFamily={DefaultTheme.fonts.metropolis.regular}
                fontSize={14}
              >
                {t("book_reader.pageOf", {
                  currentPage: currentPage,
                  totalPage: pages.length,
                })}
              </TextCommon>
              {isReading && (
                <>
                  <ViewControls marginTop={18} marginBottom={10} />
                  <TextCommon
                    fontFamily={DefaultTheme.fonts.metropolis.regular}
                    fontSize={14}
                    color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
                  >
                    {t("book_reader.percentage_book_listened", {
                      value: getPlaybackPercentage(),
                    })}
                  </TextCommon>
                </>
              )}
            </ViewSeparateBottom>
          )}
        </>
      ) : (
        <>
          <ViewBottom justifyContent={isReading ? "space-between" : "center"}>
            <TextCommon
              fontFamily={DefaultTheme.fonts.metropolis.regular}
              fontSize={14}
              color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
            >
              {t("book_reader.pageOf", {
                currentPage: currentFlipPage,
                totalPage:
                  totalFlipPage % 2 === 0
                    ? totalFlipPage / 2
                    : Math.floor(totalFlipPage / 2) + 1,
              })}
            </TextCommon>
            {isReading && (
              <TextCommon
                fontFamily={DefaultTheme.fonts.metropolis.regular}
                fontSize={14}
                color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
              >
                {t("book_reader.percentage_book_listened", {
                  value: getPlaybackPercentage(),
                })}
              </TextCommon>
            )}
          </ViewBottom>
          {isReading && (
            <ViewControls
              position={"absolute"}
              bottom={10}
              marginTop={0}
              marginBottom={0}
            />
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const ViewBottom = styled.View<{ justifyContent: string }>`
  margin-top: 12px;
  padding-horizontal: 25px;
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) => props.justifyContent};
`;

const ViewSeparateBottom = styled.View`
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  justify-content: center;
  align-items: center;
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

export default BookContent;
