import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import styled from "styled-components/native";

import SpaceWidth from "@views/SpaceWidth";
import Text from "@views/Text";

import type { BookDataItem, BookItem, BookItemData } from "@generated/model";

import DefaultTheme from "@theme";

interface Props {
  item: BookItemData | null;
}

const TitleBook: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <TextCommon
        color={DefaultTheme.colors.white}
        fontFamily={DefaultTheme.fonts.metropolis.regular}
        fontSize={14}
      >
        {item?.authorName}
      </TextCommon>
      <SpaceWidth size={16} />
      <TextCommon
        color={DefaultTheme.colors.white}
        fontFamily={DefaultTheme.fonts.metropolis.regular}
        fontSize={14}
      >
        {item?.publishDate}
      </TextCommon>
      <SpaceWidth size={16} />
      <TextCommon
        color={DefaultTheme.colors.white}
        fontFamily={DefaultTheme.fonts.metropolis.regular}
        fontSize={14}
      >
        {t("details.page", {
          value: item?.totalPages ?? 0,
        })}
      </TextCommon>
    </Container>
  );
};

const Container = styled.View`
  margin-top: 24px;
  flex-direction: row;
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

const styles = StyleSheet.create({});

export default TitleBook;
