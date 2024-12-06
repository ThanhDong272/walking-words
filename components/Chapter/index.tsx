import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import * as Device from "expo-device";
import styled from "styled-components/native";

import SpaceHeight from "@views/SpaceHeight";

import type { BookChapterResource } from "@generated/model";
import useDeviceType from "@hooks/useDeviceType";
import { formatDuration } from "@utils/common";
import { ALPHA_VALUE } from "@constants";

import DefaultTheme from "@theme";

interface Props {
  total: number;
  item: BookChapterResource;
  index: number;
}

const Chapter: React.FC<Props> = ({ total, item, index = 0 }) => {
  const { t } = useTranslation();
  const deviceType = useDeviceType();

  return (
    <Container>
      <ContentContainer>
        <IndexWrapper
          marginRight={deviceType === Device.DeviceType.PHONE ? 10 : 20}
        >
          <TextCommon
            color={DefaultTheme.colors.white}
            fontSize={deviceType === Device.DeviceType.PHONE ? 16 : 24}
            fontFamily={DefaultTheme.fonts.metropolis.bold}
          >
            {index + 1}
          </TextCommon>
        </IndexWrapper>
        <Summary>
          <Title>
            <TextCommon
              color={DefaultTheme.colors.white}
              fontSize={deviceType === Device.DeviceType.PHONE ? 16 : 18}
              fontFamily={DefaultTheme.fonts.metropolis.medium}
              style={{
                marginRight: 6,
                lineHeight: 16,
                fontWeight: "500",
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item?.name}
            </TextCommon>
            <TextCommon
              color={"rgba(255, 255, 255, 0.40)"}
              fontSize={deviceType === Device.DeviceType.PHONE ? 10 : 14}
              fontFamily={DefaultTheme.fonts.metropolis.medium}
              style={{
                lineHeight: deviceType === Device.DeviceType.PHONE ? 12 : 14,
                fontWeight: "400",
                alignSelf: "flex-end",
                flexShrink: 1,
                flexGrow: 1,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {formatDuration(item?.listeningTime || 0)}{" "}
              {t("details.listening_time")}
            </TextCommon>
          </Title>
          {item.description ? (
            <>
              <SpaceHeight size={8} />
              <TextCommon
                color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
                fontSize={deviceType === Device.DeviceType.PHONE ? 12 : 14}
                fontFamily={DefaultTheme.fonts.metropolis.medium}
                style={{
                  flexGrow: 1,
                  flex: 1,
                  lineHeight: 17,
                  fontWeight: "400",
                }}
              >
                {item?.description}
              </TextCommon>
            </>
          ) : null}
        </Summary>
        <View style={{ display: "flex" }}>
          <TextCommon
            color={DefaultTheme.colors.white}
            fontSize={deviceType === Device.DeviceType.PHONE ? 10 : 14}
            fontFamily={DefaultTheme.fonts.metropolis.medium}
            style={{
              lineHeight: 18,
              fontWeight: "400",
            }}
          >
            {t("details.page", {
              value: item?.numberOfPages,
            })}
          </TextCommon>
        </View>
      </ContentContainer>
      {index === total - 1 ? null : (
        <LineSeparator
          marginHorizontal={deviceType === Device.DeviceType.PHONE ? 10 : 16}
        />
      )}
    </Container>
  );
};

const Container = styled.View``;

const ContentContainer = styled.View`
  flex-direction: row;
  padding-vertical: 14px;
  padding-horizontal: 10px;
`;

const IndexWrapper = styled.View<{ marginRight: number }>`
  margin-right: ${(props) => props.marginRight || 10}px;
  justify-content: center;
`;

const Summary = styled.View`
  flex: 1;
  flex-grow: 1;
`;

const Title = styled.View`
  flex-direction: row;
  flex-wrap: nowrap;
  overflow: hidden;
  width: 100%;
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

const LineSeparator = styled.View<{ marginHorizontal: number }>`
  margin-horizontal: ${(props) => props.marginHorizontal}px;
  height: 1px;
  background-color: ${DefaultTheme.colors.white + ALPHA_VALUE.alpha_02};
`;

export default Chapter;
