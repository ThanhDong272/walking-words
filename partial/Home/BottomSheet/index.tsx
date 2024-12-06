import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FlatList } from "react-native";
import type { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import type { InfiniteData } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import styled from "styled-components/native";

import Icon from "@components/Icon";
import ItemNotify from "@components/ItemNotify";
import Text from "@views/Text";

import type { BookDataItem, GetRecommendedBooks200 } from "@generated/model";
import { queryClient } from "@services/network";
import { ALPHA_VALUE } from "@constants";

import DefaultTheme from "@theme";

interface Props {
  modalRef: React.RefObject<BottomSheetModalMethods>;
}

const BottomSheetContainer = styled.View`
  flex: 1;
`;

const BottomSheetBlurView = styled(BlurView)`
  flex: 1;
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

const BottomSheet: React.FC<Props> = ({ modalRef, ...props }) => {
  const { t } = useTranslation();
  const snapPoints = useMemo(() => ["60%", "93%"], []);

  const data = queryClient.getQueryData<
    InfiniteData<GetRecommendedBooks200, number | undefined>
  >(["/books/recommended", { page: 0, perPage: 10 }]);

  const handleHideBottomSheet = useCallback(() => {
    modalRef.current?.dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderBackdrop = useCallback(
    (bottomSheetBackdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...bottomSheetBackdropProps}
        opacity={0}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={handleHideBottomSheet}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      style={{ borderRadius: 16, overflow: "hidden" }}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{
        backgroundColor: DefaultTheme.colors.white + ALPHA_VALUE.alpha_03,
      }}
      backgroundComponent={({ style }) => (
        <BottomSheetBlurView
          style={style}
          tint={"systemThickMaterialDark"}
          intensity={50}
          experimentalBlurMethod={"dimezisBlurView"}
          blurReductionFactor={5}
        />
      )}
    >
      <BottomSheetContainer>
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
            onPress={handleHideBottomSheet}
          />
        </ViewNotificationTitle>
        <FlatList
          data={data?.pages?.flatMap((page) => page.data?.data ?? []) ?? []}
          renderItem={({ item }: { item: BookDataItem }) => (
            <ItemNotify item={item} />
          )}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
        />
      </BottomSheetContainer>
    </BottomSheetModal>
  );
};
export default BottomSheet;
