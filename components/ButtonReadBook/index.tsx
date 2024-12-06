import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components/native";

import Icon from "@components/Icon";
import SpaceWidth from "@views/SpaceWidth";
import Text from "@views/Text";

import DefaultTheme from "@theme";

interface Props {
  containerStyles?: any;
  viewRowStyles?: any;
  onPress?: () => void;
}

const ViewRowCenter = styled.View<{ justifyContent?: string }>`
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) => props.justifyContent};
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

const ButtonCommon = styled.TouchableOpacity<{
  backgroundColor: string;
  flex: number | string;
  width: number | string;
}>`
  flex: ${(props) => props.flex};
  width: ${(props) => (props.width === "auto" ? "auto" : `${props.width}px`)};
  background-color: ${(props) => props.backgroundColor};
  padding: 10px 14px;
  border-radius: 4px;
`;

const ButtonReadBook: React.FC<Props> = ({
  containerStyles,
  viewRowStyles,
  onPress,
}) => {
  const { t } = useTranslation();

  return (
    <ButtonCommon
      flex={containerStyles?.flex || 1}
      width={containerStyles?.width || "auto"}
      backgroundColor={
        containerStyles?.backgroundColor || DefaultTheme.colors.yellowD3
      }
      onPress={onPress}
    >
      <ViewRowCenter
        justifyContent={viewRowStyles?.justifyContent || "flex-start"}
      >
        <Icon
          iconName={"ic_book"}
          color={DefaultTheme.colors.black}
          size={20}
          disabled={true}
        />
        <SpaceWidth size={10} />
        <TextCommon
          color={DefaultTheme.colors.black}
          fontSize={14}
          fontFamily={DefaultTheme.fonts.metropolis.medium}
        >
          {t("action.read_now")}
        </TextCommon>
      </ViewRowCenter>
    </ButtonCommon>
  );
};

export default React.memo(ButtonReadBook);
