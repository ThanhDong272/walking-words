import React from "react";
import { useDeviceType } from "@context/DeviceTypeContext";
import { DeviceType } from "expo-device";
import styled from "styled-components/native";

import ButtonBookmark from "@components/ButtonBookmark";
import ButtonReadBook from "@components/ButtonReadBook";
import SpaceWidth from "@views/SpaceWidth";

import { BookDataItem } from "@generated/model";

interface Props {
  onPressReadBook?: () => void;
  onPressBookmark?: () => void;
  item?: BookDataItem;
}

const ViewRowCenter = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ButtonContent: React.FC<Props> = ({
  onPressReadBook,
  onPressBookmark,
  item,
}) => {
  const deviceType = useDeviceType();

  return (
    <ViewRowCenter>
      <ButtonReadBook
        containerStyles={{
          flex: deviceType === DeviceType.PHONE ? 1 : "none",
          width: deviceType === DeviceType.PHONE ? "auto" : 164,
        }}
        viewRowStyles={
          deviceType === DeviceType.PHONE
            ? { justifyContent: "flex-start" }
            : { justifyContent: "center" }
        }
        onPress={onPressReadBook}
      />
      <SpaceWidth size={14} />
      <ButtonBookmark
        isBookmark={item?.isBookmarked}
        containerStyles={{
          flex: deviceType === DeviceType.PHONE ? 1 : "none",
          width: deviceType === DeviceType.PHONE ? "auto" : 164,
        }}
        viewRowStyles={
          deviceType === DeviceType.PHONE
            ? { justifyContent: "flex-start" }
            : { justifyContent: "center" }
        }
        onPress={onPressBookmark}
      />
    </ViewRowCenter>
  );
};

export default React.memo(ButtonContent);
