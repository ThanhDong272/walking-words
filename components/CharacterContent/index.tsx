import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { NativeSyntheticEvent, TextLayoutEventData } from "react-native";
import { StyleSheet, View } from "react-native";
import type { PagePersonsSelect } from "@app/(screens)/story_overview";
import { DeviceType } from "expo-device";
import styled from "styled-components/native";

import Accordion from "@components/Accordion";
import SpaceHeight from "@views/SpaceHeight";
import SpaceWidth from "@views/SpaceWidth";
import Text from "@views/Text";

import useDeviceType from "@hooks/useDeviceType";
import useDimensions from "@hooks/useDimensions";
import { ALPHA_VALUE } from "@constants/index";

import DefaultTheme from "@theme";

interface Props {
  contentCharacter: PagePersonsSelect;
}

const CharacterContent: React.FC<Props> = ({ contentCharacter }) => {
  const deviceType = useDeviceType();
  const { t } = useTranslation();
  const { dimensions } = useDimensions();

  const [isExpanded, setIsExpanded] = useState(false);
  const [textLayout, setTextLayout] = useState<any>([]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    setTextLayout([]);
  }, [contentCharacter?.biography]);

  const handleTextLayout = (
    event: NativeSyntheticEvent<TextLayoutEventData>,
  ) => {
    setTextLayout(event.nativeEvent.lines);
  };

  const renderFullName = useCallback(() => {
    if (contentCharacter) {
      const { firstName, lastName } = contentCharacter;
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      }
    }
    return null;
  }, [contentCharacter]);

  return (
    <Container>
      <TextCommon
        style={{
          paddingHorizontal: deviceType === DeviceType.PHONE ? 20 : 0,
        }}
        color={DefaultTheme.colors.white}
        fontFamily={DefaultTheme.fonts.metropolis.bold}
        fontSize={deviceType === DeviceType.PHONE ? 36 : 58}
      >
        {renderFullName()}
      </TextCommon>
      <SpaceHeight size={6} />
      <ViewRowCenter
        style={{
          paddingHorizontal: deviceType === DeviceType.PHONE ? 20 : 0,
        }}
      >
        {contentCharacter?.features?.[0] && (
          <TextCommon
            color={DefaultTheme.colors.white}
            fontFamily={DefaultTheme.fonts.metropolis.regular}
            fontSize={14}
          >
            {contentCharacter.features[0].value || ""}{" "}
            <TextCommon
              color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
              fontFamily={DefaultTheme.fonts.metropolis.regular}
              fontSize={14}
            >
              {contentCharacter.features[0].name || ""}
            </TextCommon>
          </TextCommon>
        )}
        <SpaceWidth size={32} />
        {contentCharacter?.features?.[1] && (
          <TextCommon
            color={DefaultTheme.colors.white}
            fontFamily={DefaultTheme.fonts.metropolis.regular}
            fontSize={14}
          >
            {contentCharacter.features[1].value}{" "}
            <TextCommon
              color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
              fontFamily={DefaultTheme.fonts.metropolis.regular}
              fontSize={14}
            >
              {contentCharacter.features[1].name || ""}
            </TextCommon>
          </TextCommon>
        )}
      </ViewRowCenter>
      <SpaceHeight size={22} />
      <ContentDetail>
        <Accordion isExpanded={isExpanded}>
          <View
            style={{
              paddingLeft: deviceType === DeviceType.PHONE ? 20 : 0,
              width:
                deviceType === DeviceType.PHONE
                  ? dimensions.width - 20
                  : dimensions.width / 2.4,
            }}
          >
            <TextCommon
              style={{
                lineHeight: 18,
                flexWrap: "wrap",
              }}
              color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
              fontFamily={DefaultTheme.fonts.metropolis.regular}
              fontSize={14}
              onTextLayout={handleTextLayout}
            >
              {textLayout.length > 0
                ? textLayout.map((line: any, index: number) => (
                    <TextCommon
                      key={index}
                      style={{
                        lineHeight: 18,
                        flexWrap: "wrap",
                        opacity: index === 2 && !isExpanded ? 0.5 : 1,
                      }}
                      color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
                      fontFamily={DefaultTheme.fonts.metropolis.regular}
                      fontSize={14}
                    >
                      {line.text}
                    </TextCommon>
                  ))
                : contentCharacter?.biography || ""}
            </TextCommon>
          </View>
        </Accordion>
        <ButtonView
          style={{
            paddingRight:
              deviceType === DeviceType.PHONE ? 0 : dimensions.width / 12,
          }}
          marginBottom={deviceType === DeviceType.PHONE ? 30 : 36}
          onPress={toggleExpand}
        >
          <TextCommon
            color={DefaultTheme.colors.white + ALPHA_VALUE.alpha_05}
            fontFamily={DefaultTheme.fonts.metropolis.regular}
            fontSize={14}
          >
            {t(
              isExpanded
                ? "story_overview.view_less"
                : "story_overview.view_more",
            )}
          </TextCommon>
        </ButtonView>
      </ContentDetail>
    </Container>
  );
};

const Container = styled.View`
  margin-top: 35px;
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

const ViewRowCenter = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ContentDetail = styled.View``;

const ButtonView = styled.Pressable<{ marginBottom: number }>`
  margin-top: 20px;
  margin-bottom: ${(props) => props.marginBottom}px;
  align-self: center;
`;

const styles = StyleSheet.create({});

export default CharacterContent;
