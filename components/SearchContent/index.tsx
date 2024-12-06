import React from "react";
import { FlatList, TouchableOpacity } from "react-native";
import * as Device from "expo-device";
import { useRouter } from "expo-router";

import ItemBook from "@components/ItemBook";

import type { BookDataItem } from "@generated/model";
import useDeviceType from "@hooks/useDeviceType";

interface Props {
  results: BookDataItem[];
  onEndReached: () => void;
}

const SearchContent: React.FC<Props> = ({ results, onEndReached }) => {
  const router = useRouter();
  const deviceType = useDeviceType();
  const TouchableComponent = TouchableOpacity;

  const getColumnCount = () => {
    if (deviceType === Device.DeviceType.TABLET) {
      return 3;
    } else {
      return 2;
    }
  };

  const renderItemBook = ({
    item,
    index,
  }: {
    item: BookDataItem;
    index: number;
  }) => {
    return (
      <TouchableComponent
        onPress={() =>
          router.push({ pathname: `/(tabs)/home/${item?.uuid}`, params: item })
        }
      >
        <ItemBook item={item} deviceType={deviceType} />
      </TouchableComponent>
    );
  };

  return (
    <FlatList
      data={results}
      renderItem={renderItemBook}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      numColumns={getColumnCount()}
      key={getColumnCount()}
      keyExtractor={(item: BookDataItem, index) => index.toString()}
      contentContainerStyle={{
        paddingHorizontal: 20,
        justifyContent: "flex-start",
      }}
      onEndReachedThreshold={0.1}
      onEndReached={onEndReached}
    />
  );
};

export default SearchContent;
