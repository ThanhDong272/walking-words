import type {
  GestureResponderEvent,
  TouchableOpacityProps,
} from "react-native";

export type BaseButtonProps = Omit<TouchableOpacityProps, "onPress"> & {
  text: string;
  isLoading?: boolean;
  onPress: (event: GestureResponderEvent) => void;
};

export type TextButtonProps = Omit<BaseButtonProps, "isLoading"> & {
  text: string;
  color?: string;
  fontSize?: number;
};
