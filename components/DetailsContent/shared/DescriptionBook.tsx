import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { DeviceType } from "expo-device";
import styled from "styled-components/native";

import Text from "@views/Text";

import type { BookDataItem, BookItem, BookItemData } from "@generated/model";
import useDeviceType from "@hooks/useDeviceType";
import { ALPHA_VALUE } from "@constants";

import DefaultTheme from "@theme";

interface Props {
  item: BookItemData | null;
}

const DescriptionBook: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation();
  const deviceType = useDeviceType();

  return (
    <Container
      flexDirection={deviceType === DeviceType.PHONE ? "column" : "row"}
      marginTop={deviceType === DeviceType.PHONE ? 16 : 36}
    >
      <View style={{ flex: deviceType === DeviceType.PHONE ? 1 : 0.6 }}>
        <TextCommon
          style={{ lineHeight: 24, textAlign: "left" }}
          color={DefaultTheme.colors.white}
          fontSize={deviceType === DeviceType.PHONE ? 14 : 16}
          fontFamily={DefaultTheme.fonts.metropolis.regular}
        >
          {item?.description}
        </TextCommon>
      </View>
      <BookDetailContent
        style={{ gap: 8, flex: deviceType === DeviceType.PHONE ? 1 : 0.3 }}
        marginTop={deviceType === DeviceType.PHONE ? 24 : 0}
      >
        <TextCommon
          color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
          fontFamily={DefaultTheme.fonts.metropolis.regular}
          fontSize={14}
          numberOfLines={2}
        >
          {t("details.character")}
          {": "}
          <TextCommon
            color={DefaultTheme.colors.white}
            fontFamily={DefaultTheme.fonts.metropolis.regular}
            fontSize={14}
          >
            {item?.persons?.map(({ name }) => name).join(", ") ?? ""}
          </TextCommon>
        </TextCommon>

        <TextCommon
          color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
          fontFamily={DefaultTheme.fonts.metropolis.regular}
          fontSize={14}
        >
          {t("details.author_by")}
          {": "}
          <TextCommon
            color={DefaultTheme.colors.white}
            fontFamily={DefaultTheme.fonts.metropolis.regular}
            fontSize={14}
          >
            {item?.authorName}
          </TextCommon>
        </TextCommon>
        <TextCommon
          color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
          fontFamily={DefaultTheme.fonts.metropolis.regular}
          fontSize={14}
        >
          {t("details.genre")}
          {": "}
          <TextCommon
            color={DefaultTheme.colors.white}
            fontFamily={DefaultTheme.fonts.metropolis.regular}
            fontSize={14}
          >
            {item?.genre ?? ""}
          </TextCommon>
        </TextCommon>
      </BookDetailContent>
    </Container>
  );
};

const Container = styled.View<{ flexDirection: string; marginTop: number }>`
  flex: 1;
  flex-direction: ${(props) => props.flexDirection};
  margin-top: ${(props) => props.marginTop}px;
  align-items: flex-start;
  justify-content: space-between;
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

const BookDetailContent = styled.View<{
  marginTop: number;
}>`
  justify-content: flex-end;
  margin-top: ${(props) => props.marginTop}px;
`;

export default DescriptionBook;
