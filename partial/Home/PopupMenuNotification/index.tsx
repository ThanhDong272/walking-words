import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList } from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { InfiniteData } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import styled from "styled-components/native";

import Icon from "@components/Icon";
import ItemNotify from "@components/ItemNotify";
import Text from "@views/Text";

import type { BookDataItem, GetRecommendedBooks200 } from "@generated/model";
import useDimensions from "@hooks/useDimensions";
import { queryClient } from "@services/network";

import DefaultTheme from "@theme";

import { ALPHA_VALUE } from "@/constants";

interface Props {
  isVisible: boolean;
  onDismiss: () => void;
}

const PopupMenuNotification: React.FC<Props> = ({ isVisible, onDismiss }) => {
  const { t } = useTranslation();
  const { dimensions } = useDimensions();
  const insets = useSafeAreaInsets();

  const data = queryClient.getQueryData<
    InfiniteData<GetRecommendedBooks200, number | undefined>
  >(["/books/recommended", { page: 0, perPage: 10 }]);

  return (
    <Modal
      isVisible={isVisible}
      animationIn={"fadeInRightBig"}
      animationOut={"fadeOutRightBig"}
      animationInTiming={500}
      animationOutTiming={500}
      backdropOpacity={0}
      onBackdropPress={onDismiss}
    >
      <Container top={insets.top}>
        <MenuBlurView
          tint={"systemThickMaterialDark"}
          intensity={50}
          experimentalBlurMethod={"dimezisBlurView"}
          blurReductionFactor={5}
        >
          <ViewNotificationTitle>
            <TextCommon
              fontSize={20}
              color={DefaultTheme.colors.greyE2}
              fontFamily={DefaultTheme.fonts.inter.medium}
            >
              {t("home.news")}
            </TextCommon>
            <Icon
              iconName={"ic_close"}
              size={28}
              color={DefaultTheme.colors.white}
              onPress={onDismiss}
            />
          </ViewNotificationTitle>
          <ViewListNotification height={dimensions.height / 4}>
            <FlatList
              data={data?.pages?.flatMap((page) => page.data?.data ?? []) ?? []}
              renderItem={({ item }: { item: BookDataItem }) => (
                <ItemNotify item={item} />
              )}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
            />
          </ViewListNotification>
        </MenuBlurView>
      </Container>
    </Modal>
  );
};

const Container = styled.View<{ top: number }>`
  position: absolute;
  top: ${(props) => props.top + 32}px;
  right: 0px;
  border-radius: 16px;
  overflow: hidden;
`;

const MenuBlurView = styled(BlurView)`
  background-color: ${DefaultTheme.colors.yellowD3 + ALPHA_VALUE.alpha_02};
`;

const ViewNotificationTitle = styled.View`
  padding: 24px;
  flex-direction: row;
  align-items: center;
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

const ViewListNotification = styled.View<{ height: number }>`
  height: ${(props) => props.height}px;
`;

export default PopupMenuNotification;
