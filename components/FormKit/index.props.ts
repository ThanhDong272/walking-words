import type { TextInputProps } from "react-native";

export type FormInputProps = {
  /**@default normal */
  mode?: "normal" | "password";
  placeHolder?: string;
  defaultValue?: string;
  hideErrorMessage?: boolean;
  hideErrorIndicator?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  error?: string;
  onChangeText: (text: string) => void;
};

export type FormHeaderProps = {
  title: string;
  desc?: string;
};
