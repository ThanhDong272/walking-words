import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text } from "react-native";
import styled from "styled-components/native";

import Icon from "@components/Icon";
import SpaceWidth from "@views/SpaceWidth";

import type { BookDataItem } from "@generated/model";
import { formatDuration } from "@utils/common";
import { ALPHA_VALUE } from "@constants/index";

import DefaultTheme from "@theme";

interface Props {
  item: BookDataItem;
}

const DurationTitle: React.FC<Props> = ({ item }) => {
  return (
    <ViewRowCenter>
      <ViewRowCenter style={{ width: 50 }}>
        <Icon
          iconName={"ic_star"}
          size={20}
          color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
        />
        <SpaceWidth size={6} />
        <TextCommon
          color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
          fontSize={14}
          fontFamily={DefaultTheme.fonts.metropolis.regular}
          style={{ marginTop: 2 }}
        >
          {item?.rating}
        </TextCommon>
      </ViewRowCenter>
      <SpaceWidth size={32} />
      <ViewRowCenter>
        <Icon
          iconName={"ic_time_clock"}
          size={20}
          color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
        />
        <SpaceWidth size={6} />
        <TextCommon
          color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
          fontSize={14}
          fontFamily={DefaultTheme.fonts.metropolis.regular}
        >
          {formatDuration(item?.duration || 0)}
        </TextCommon>
      </ViewRowCenter>
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

export default DurationTitle;
