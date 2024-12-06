import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-native-modal";
import { DeviceType } from "expo-device";
import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";

import SpaceHeight from "@views/SpaceHeight";
import Text from "@views/Text";

import useDeviceType from "@hooks/useDeviceType";

import DefaultTheme from "@theme";

interface Props {
  isVisible: boolean;
  onDismiss: () => void;
}

const ModalWelcome: React.FC<Props> = ({ isVisible, onDismiss }) => {
  const { t } = useTranslation();
  const deviceType = useDeviceType();

  return (
    <Modal
      isVisible={isVisible}
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
      animationInTiming={200}
      animationOutTiming={200}
      backdropOpacity={0.5}
    >
      <LinearView
        width={deviceType === DeviceType.PHONE ? "auto" : 408}
        colors={[DefaultTheme.colors.black1E, DefaultTheme.colors.black]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TextCommon
          fontFamily={DefaultTheme.fonts.metropolis.medium}
          fontSize={28}
          color={DefaultTheme.colors.white}
        >
          {t("home.welcome")}
        </TextCommon>
        <SpaceHeight size={20} />
        <TextCommon
          fontFamily={DefaultTheme.fonts.metropolis.light}
          fontSize={deviceType === DeviceType.PHONE ? 16 : 18}
          color={DefaultTheme.colors.white}
          style={{ lineHeight: 24, textAlign: "center" }}
        >
          {t("home.full_access_features")}
        </TextCommon>
        <SpaceHeight size={42} />
        <ButtonStart
          onPress={onDismiss}
          paddingVertical={deviceType === DeviceType.PHONE ? 16 : 18}
        >
          <TextCommon
            fontFamily={DefaultTheme.fonts.metropolis.medium}
            fontSize={16}
            color={DefaultTheme.colors.black}
          >
            {t("action.get_started")}
          </TextCommon>
        </ButtonStart>
      </LinearView>
    </Modal>
  );
};

const LinearView = styled(LinearGradient)<{ width: number | string }>`
  width: ${(props) => props.width}px;
  border-radius: 28px;
  justify-content: center;
  align-items: center;
  padding-horizontal: 22px;
  padding-top: 38px;
  padding-bottom: 22px;
  align-self: center;
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

const ButtonStart = styled.TouchableOpacity<{
  paddingVertical: number;
}>`
  border-radius: 4px;
  background-color: ${DefaultTheme.colors.yellowD3};
  justify-content: center;
  align-items: center;
  padding-vertical: ${(props) => props.paddingVertical}px;
  align-self: stretch;
`;

export default ModalWelcome;
