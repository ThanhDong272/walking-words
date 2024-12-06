import React from "react";
import * as Device from "expo-device";
import { Image } from "expo-image";
import styled from "styled-components/native";

import type { BookDataItem } from "@generated/model";

interface Props {
  item: BookDataItem;
  deviceType: Device.DeviceType;
}

const ItemBook: React.FC<Props> = ({ item, deviceType }) => {
  return (
    <ImageBook
      width={deviceType === Device.DeviceType.PHONE ? 162 : 252}
      height={deviceType === Device.DeviceType.PHONE ? 107 : 167}
      source={{ uri: item.thumbnail }}
    />
  );
};

const ImageBook = styled(Image)<{ height: number; width: number }>`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  margin-bottom: 14px;
  margin-horizontal: 6px;
`;

export default ItemBook;
