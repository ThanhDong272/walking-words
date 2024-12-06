import React from "react";
import { StyleSheet } from "react-native";
import { ImageBackground } from "expo-image";
import styled from "styled-components/native";

import { images } from "@assets/images";

interface Props {
  children: React.ReactNode;
}

const AuthBackground: React.FC<Props> = ({ children }) => {
  return <Container source={images.authBackground}>{children}</Container>;
};

const Container = styled(ImageBackground)`
  flex: 1;
`;

const styles = StyleSheet.create({});

export default AuthBackground;
