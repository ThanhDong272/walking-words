import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useRoute } from "@react-navigation/native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import styled from "styled-components/native";

import CarouselWithVideo from "@components/CarouselWithVideo";
import Icon from "@components/Icon";
import SpaceHeight from "@views/SpaceHeight";
import SpaceWidth from "@views/SpaceWidth";

import { useFetchPopularBooks } from "@hooks/useBooks";
import useDeviceType from "@hooks/useDeviceType";
import useDimensions from "@hooks/useDimensions";

import DefaultTheme from "@theme";

import BottomSheet from "@/partial/Home/BottomSheet";
import ModalWelcome from "@/partial/Home/ModalWelcome";
import MyNovels from "@/partial/Home/MyNovels";
import PopularBooks from "@/partial/Home/PopularBooks";
import PopupMenuNotification from "@/partial/Home/PopupMenuNotification";
import RecommendedBooks from "@/partial/Home/RecommendedBooks";

interface Props {}

const HomeScreen: React.FC<Props> = () => {
  const router = useRouter();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const deviceType = useDeviceType();
  const [hideBackdrop, setHideBackdrop] = useState(false);
  const { dimensions } = useDimensions();

  const { showPopup } = route.params as {
    showPopup: string;
  };

  const { dataPopular } = useFetchPopularBooks();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [openNotificationMenu, setOpenNotificationMenu] = useState(false);
  const [showPopupWelcome, setShowPopupWelcome] = useState(
    showPopup ? true : false,
  );

  useEffect(() => {
    if (hideBackdrop) {
      setTimeout(() => {
        setHideBackdrop(false);
      }, 1500);
    }
  }, [hideBackdrop]);

  const handleShowBottomSheet = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  return (
    <BottomSheetModalProvider>
      <Container>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <CarouselWithVideo
            data={dataPopular}
            deviceType={deviceType}
            setHideBackdrop={setHideBackdrop}
          />
          <ViewMenuIcon
            top={
              deviceType === Device.DeviceType.PHONE
                ? insets.top
                : insets.top + 20
            }
          >
            <Icon
              iconName={"ic_glass"}
              size={deviceType === Device.DeviceType.PHONE ? 24 : 28}
              color={DefaultTheme.colors.white}
              onPress={() => router.push({ pathname: "/(screens)/search" })}
            />
            <SpaceWidth
              size={deviceType === Device.DeviceType.PHONE ? 12 : 32}
            />
            <Icon
              iconName={"ic_bell"}
              size={deviceType === Device.DeviceType.PHONE ? 24 : 28}
              color={DefaultTheme.colors.white}
              onPress={() => {
                if (deviceType === Device.DeviceType.PHONE) {
                  handleShowBottomSheet();
                } else {
                  setOpenNotificationMenu(true);
                }
              }}
            />
          </ViewMenuIcon>
          <SpaceHeight size={24} />
          <PopularBooks />
          <RecommendedBooks />
          <MyNovels />
        </ScrollView>
        {hideBackdrop && (
          <FullBackRound width={dimensions.width} height={dimensions.height} />
        )}
      </Container>
      <BottomSheet modalRef={bottomSheetModalRef} />
      <PopupMenuNotification
        isVisible={openNotificationMenu}
        onDismiss={() => setOpenNotificationMenu(false)}
      />
      <ModalWelcome
        isVisible={showPopupWelcome}
        onDismiss={() => setShowPopupWelcome(false)}
      />
    </BottomSheetModalProvider>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${DefaultTheme.colors.black0F};
`;

const ViewMenuIcon = styled.View<{ top: number }>`
  flex-direction: row;
  align-items: center;
  position: absolute;
  padding-right: 20px;
  top: ${(props) => props.top}px;
  right: 0;
`;

const FullBackRound = styled.View<{ width: number; height: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  background-color: ${DefaultTheme.colors.black0F};
`;

export default HomeScreen;
