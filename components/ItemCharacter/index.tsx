import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import type { PagePersonsSelect } from "@app/(screens)/story_overview";
import { Image } from "expo-image";
import styled from "styled-components/native";

import SpaceHeight from "@views/SpaceHeight";
import SpaceWidth from "@views/SpaceWidth";
import Text from "@views/Text";

import type { PagePersons } from "@generated/model";

import DefaultTheme from "@theme";

interface Props {
  item: PagePersonsSelect;
  onViewCharacter: () => void;
}

const ItemCharacter: React.FC<Props> = ({ item, onViewCharacter }) => {
  const renderFullName = useCallback(() => {
    if (item) {
      const { firstName, lastName } = item;
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      }
    }
    return null;
  }, [item]);

  return (
    <PressableView
      opactiy={item?.isSelected ? 1 : 0.4}
      onPress={onViewCharacter}
    >
      <ViewCharacter
        borderColor={
          item?.isSelected ? DefaultTheme.colors.yellowD0 : "transparent"
        }
      >
        <ImageCharacter
          source={{ uri: item?.potrait || "" }}
          priority={"high"}
          contentFit={"contain"}
        />
      </ViewCharacter>
      <SpaceWidth size={7.2} />
      <ContentCharacter>
        <TextCommon
          color={DefaultTheme.colors.white}
          fontSize={12}
          fontFamily={DefaultTheme.fonts.metropolis.bold}
        >
          {renderFullName()}
        </TextCommon>
        <SpaceHeight size={4.8} />
        <TextCommon
          color={DefaultTheme.colors.white}
          fontSize={8.4}
          fontFamily={DefaultTheme.fonts.metropolis.regular}
        >
          {item?.nickName || ""}
        </TextCommon>
      </ContentCharacter>
    </PressableView>
  );
};

const PressableView = styled.Pressable<{ opactiy: number }>`
  flex-direction: row;
  align-items: center;
  padding-horizontal: 18px;
  opacity: ${(props) => props.opactiy};
`;

const ViewCharacter = styled.View<{ borderColor: string }>`
  width: 50px;
  height: 50px;
  border-radius: 7.2px;
  border-color: ${(props) => props.borderColor};
  border-width: 0.3px;
  justify-content: center;
  align-items: center;
`;

const ImageCharacter = styled(Image)`
  width: 48px;
  height: 48px;
  border-radius: 7.2px;
`;

const ContentCharacter = styled.View``;

const TextCommon = styled(Text)<{
  color: string;
  fontSize: number;
  fontFamily: string;
}>`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize}px;
  font-family: ${(props) => props.fontFamily};
`;

const styles = StyleSheet.create({});

export default ItemCharacter;
