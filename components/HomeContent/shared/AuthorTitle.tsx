import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text } from "react-native";
import styled from "styled-components/native";

import SpaceWidth from "@views/SpaceWidth";

import type { BookDataItem } from "@generated/model";
import { ALPHA_VALUE } from "@constants/index";

import DefaultTheme from "@theme";

interface Props {
  item: BookDataItem;
}

const AuthorTitle: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation();

  return (
    <ViewRowCenter>
      <TextCommon
        color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
        fontFamily={DefaultTheme.fonts.metropolis.regular}
        fontSize={14}
      >
        {t("home.author_by")}{" "}
        <TextCommon
          color={DefaultTheme.colors.white}
          fontFamily={DefaultTheme.fonts.metropolis.regular}
          fontSize={14}
        >
          {item?.authorName}
        </TextCommon>
      </TextCommon>
      <SpaceWidth size={8} />
      <TextCommon
        color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
        fontFamily={DefaultTheme.fonts.metropolis.regular}
        fontSize={14}
      >
        {t("home.published")}{" "}
        <TextCommon
          color={DefaultTheme.colors.white}
          fontFamily={DefaultTheme.fonts.metropolis.regular}
          fontSize={14}
        >
          {item?.publishDate}
        </TextCommon>
      </TextCommon>
    </ViewRowCenter>
  );
};

const ViewRowCenter = styled.View`
  flex-direction: row;
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

const styles = StyleSheet.create({});

export default AuthorTitle;
