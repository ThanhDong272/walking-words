import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DeviceType } from "expo-device";
import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import styled from "styled-components/native";

import CharacterContent from "@components/CharacterContent";
import Icon from "@components/Icon";
import ItemCharacter from "@components/ItemCharacter";
import MapStoryLocation from "@components/MapStoryLocation";
import SpaceHeight from "@views/SpaceHeight";
import Text from "@views/Text";

import {
  useGetPagePersonsInfinite,
  useGetPageSights,
} from "@generated/books/books";
import type { PagePersons, PageSights } from "@generated/model";
import useDeviceType from "@hooks/useDeviceType";
import useDimensions from "@hooks/useDimensions";
import { screenHeight, screenWidth } from "@utils/common";
import { ALPHA_VALUE, PER_PAGE } from "@constants/index";

import DefaultTheme from "@theme";

interface Props {}

export interface PagePersonsSelect extends PagePersons {
  isSelected: boolean;
}

const StoryOverviewScreen: React.FC<Props> = () => {
  const deviceType = useDeviceType();
  const { t } = useTranslation();
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const { dimensions } = useDimensions();

  const { uuid } = useLocalSearchParams();

  const { data, isLoading, hasNextPage, fetchNextPage } =
    useGetPagePersonsInfinite(
      uuid.toString(),
      {
        page: 1,
        perPage: PER_PAGE._10,
      },
      {
        query: {
          enabled: true,
          getNextPageParam: (lastPage) => {
            if (!lastPage?.data) return undefined;
            if (
              (lastPage.data.meta.currentPage ?? 0) <
              (lastPage.data.meta.total ?? 0)
            ) {
              return (lastPage.data.meta.currentPage ?? 0) + 1;
            }
            return undefined;
          },
        },
      },
    );

  const { data: dataSight } = useGetPageSights(uuid.toString(), {
    page: 1,
    perPage: PER_PAGE._10,
  });

  const [charactersList, setCharactersList] = useState<PagePersonsSelect[]>([]);
  const [characterSelected, setCharacterSelected] =
    useState<PagePersonsSelect | null>(null);
  const [dataPageSight, setDataPageSight] = useState<PageSights | null>(null);

  useEffect(() => {
    if (data) {
      const newData = data?.pages
        ?.flatMap((page) => page.data?.data ?? [])
        .map((item, i) => {
          if (i === 0) {
            return {
              ...item,
              isSelected: true,
            };
          } else {
            return {
              ...item,
              isSelected: false,
            };
          }
        });
      setCharactersList(newData);
    }
  }, [data]);

  useEffect(() => {
    setCharacterSelected(
      charactersList?.find(
        (character: PagePersonsSelect) => character?.isSelected,
      ) ?? null,
    );
  }, [charactersList]);

  useEffect(() => {
    if (dataSight) {
      console.log("DATA SIGHT: ", dataSight?.data?.data[0]);

      setDataPageSight(dataSight?.data?.data[0] ?? null);
    }
  }, [dataSight]);

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <ItemCharacter
        item={item}
        onViewCharacter={() => {
          setCharactersList(
            charactersList.map((character, i) => {
              if (i === index) {
                return {
                  ...character,
                  isSelected: true,
                };
              } else {
                return {
                  ...character,
                  isSelected: false,
                };
              }
            }),
          );

          flatListRef?.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
          });
        }}
      />
    );
  };

  return (
    <Container>
      <TitleContainer
        top={insets.top}
        paddingHorizontal={deviceType === DeviceType.PHONE ? 20 : 32}
      >
        <ButtonBack
          onPress={() => {
            router.dismiss();
          }}
        >
          <Icon
            iconName={"ic_arrow_back"}
            size={14}
            color={DefaultTheme.colors.white}
            disabled={true}
          />
        </ButtonBack>
        {/* TODO: Uncomment it once we have the image */}
        {/* <ImageCommon
          width={deviceType === DeviceType.PHONE ? 144 : 276}
          height={deviceType === DeviceType.PHONE ? 30 : 58}
          source={{ uri: link_book }}
          contentFit="contain"
        /> */}
        <View />
      </TitleContainer>
      {deviceType === DeviceType.PHONE ? (
        <ScrollView
          style={{
            marginTop: insets.top,
          }}
          showsVerticalScrollIndicator={false}
        >
          {charactersList.length > 0 && (
            <>
              <CharactersContainer>
                <ImageCharacterBackground
                  width={screenWidth}
                  height={screenHeight / 2 + 50}
                  source={{
                    uri: characterSelected?.potrait ?? "",
                  }}
                  priority={"high"}
                  contentFit={"contain"}
                >
                  <ListCharactersContainer
                    colors={[
                      DefaultTheme.colors.grey1E + ALPHA_VALUE.alpha_08,
                      DefaultTheme.colors.black + ALPHA_VALUE.alpha_08,
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.88, y: 1 }}
                  >
                    <FlatList
                      ref={flatListRef}
                      data={charactersList}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={renderItem}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      onEndReachedThreshold={0.1}
                      onEndReached={loadMore}
                    />
                  </ListCharactersContainer>
                </ImageCharacterBackground>
              </CharactersContainer>
              <ViewContent>
                <CharacterContent contentCharacter={characterSelected!} />
              </ViewContent>
            </>
          )}
          <ViewMap marginTop={charactersList?.length > 0 ? 0 : 20}>
            {dataPageSight && (
              <>
                <TextCommon
                  style={{
                    paddingHorizontal: deviceType === DeviceType.PHONE ? 20 : 0,
                  }}
                  color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_06}
                  fontFamily={DefaultTheme.fonts.metropolis.bold}
                  fontSize={16}
                >
                  {t("story_overview.where_am_i")}
                </TextCommon>
                <SpaceHeight size={12} />
                <MapStoryLocation dataPageSight={dataPageSight} />
              </>
            )}
          </ViewMap>
          <SpaceHeight size={65} />
        </ScrollView>
      ) : (
        <ViewTablet>
          <View style={{ flex: 0.5 }}>
            {charactersList.length > 0 && (
              <CharactersContainer
                style={{ position: "absolute", bottom: 0, paddingLeft: 66 }}
              >
                <ImageCharacterBackground
                  width={dimensions.width / 2.5}
                  height={dimensions.height - 120}
                  source={{
                    uri: characterSelected?.potrait ?? "",
                  }}
                  priority={"high"}
                  contentFit={"contain"}
                >
                  <ListCharactersContainer
                    colors={[
                      DefaultTheme.colors.grey1E + ALPHA_VALUE.alpha_08,
                      DefaultTheme.colors.black + ALPHA_VALUE.alpha_08,
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.88, y: 1 }}
                  >
                    <FlatList
                      ref={flatListRef}
                      data={charactersList}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={renderItem}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    />
                  </ListCharactersContainer>
                </ImageCharacterBackground>
              </CharactersContainer>
            )}
          </View>
          <View
            style={{
              flex: 0.5,
              marginTop: 100,
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {charactersList.length > 0 && (
                <CharacterContent contentCharacter={characterSelected!} />
              )}
              {dataPageSight && (
                <>
                  <TextCommon
                    color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_06}
                    fontFamily={DefaultTheme.fonts.metropolis.bold}
                    fontSize={16}
                  >
                    {t("story_overview.where_am_i")}
                  </TextCommon>
                  <SpaceHeight size={12} />
                  <MapStoryLocation dataPageSight={dataPageSight} />
                </>
              )}
              <SpaceHeight size={65} />
            </ScrollView>
          </View>
        </ViewTablet>
      )}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${DefaultTheme.colors.black0F};
`;

const TitleContainer = styled.View<{ paddingHorizontal: number; top: number }>`
  top: ${(props) => props.top}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${(props) => props.paddingHorizontal}px;
`;

const ButtonBack = styled.Pressable`
  width: 32px;
  height: 32px;
  border-radius: 2.4px;
  background-color: ${DefaultTheme.colors.white + ALPHA_VALUE.alpha_02};
  justify-content: center;
  align-items: center;
`;

const ImageCommon = styled(Image)<{ width: number; height: number }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

const ImageCharacterBackground = styled(ImageBackground)<{
  width: number;
  height: number;
}>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

const CharactersContainer = styled.View``;

const ListCharactersContainer = styled(LinearGradient)`
  padding-vertical: 12px;
  position: absolute;
  bottom: 0;
`;

const ViewContent = styled.View``;

const ViewMap = styled.View<{ marginTop: number }>`
  margin-top: ${(props) => props.marginTop}px;
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

const ViewTablet = styled.View`
  flex: 1;
  flex-direction: row;
`;

export default StoryOverviewScreen;
